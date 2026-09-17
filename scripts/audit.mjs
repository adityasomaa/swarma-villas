import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";

/* =============================================================================
   AUDIT
   -----------------------------------------------------------------------------
   Crawls all 17 pages in a real browser and fails on things that are wrong
   rather than things that are debatable. Every check here exists because the
   failure it catches is invisible in a screenshot:

     structure      exactly one h1; no skipped heading level (h1 -> h3)
     links          no link still pointing at a retired /template-N preview
     images         every <img> has an alt attribute (empty is fine and means
                    decorative — missing is not the same thing)
     overflow       nothing forces the page to scroll sideways, at three widths
     landmarks      one <main>, and the skip link's target exists
     labels         every control a person can operate has an accessible name
     404            addresses the site does not have really return 404
     redirects      the old preview links land on the same page at its new address
     duplicates     no two pages share a title or a meta description

   Run it against a production build:
     npx next build && bash scripts/serve.sh 3100
     node scripts/audit.mjs http://localhost:3100

   PW_CHANNEL=chrome uses the installed Chrome instead of Playwright's own
   download, for machines where that download is missing.
   ========================================================================== */

const ORIGIN = process.argv[2] ?? "http://localhost:3000";
const WIDTHS = [390, 768, 1440];

const PAGE_PATHS = [
  "/",
  "/about",
  "/houses",
  "/houses/wooden-gladak-house",
  "/houses/hexa-bamboo-house",
  "/houses/bamboo-dome",
  "/experiences",
  "/experiences/package-offer",
  "/experiences/jungle-trekking",
  "/experiences/swarma-paon-restaurant",
  "/experiences/massage-body-rituals",
  "/gallery",
  "/review",
  "/contact",
  "/term-condition",
  "/privacy",
  "/terms-of-use",
];

const MUST_404 = ["/nope", "/houses/not-a-house", "/experiences/not-real", "/template-4", "/about/extra"];

/** Old preview address -> where it must end up. */
const REDIRECTS = [
  ["/template-2", "/"],
  ["/template-2/houses", "/houses"],
  ["/template-2/houses/bamboo-dome", "/houses/bamboo-dome"],
  ["/template-1/about", "/about"],
  ["/template-3/contact", "/contact"],
];

const failures = [];
const fail = (page, check, detail) => failures.push({ page, check, detail });

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

// Accept storage once, so the cookie banner is not measured as page overflow.
await page.goto(`${ORIGIN}/`, { waitUntil: "domcontentloaded" });
await page.evaluate(() => localStorage.setItem("swarma.consent.v1", "accepted"));

/* ------------------------------------------------ 1. addresses it lacks ---- */

for (const path of MUST_404) {
  const response = await page.goto(`${ORIGIN}${path}`, { waitUntil: "domcontentloaded" });
  if (response?.status() !== 404) fail(path, "404", `expected 404, got ${response?.status()}`);
}

/* ------------------------------------------- 2. the retired preview links -- */

for (const [from, to] of REDIRECTS) {
  const response = await page.goto(`${ORIGIN}${from}`, { waitUntil: "domcontentloaded" });
  const landed = new URL(page.url()).pathname;
  if (response?.status() !== 200 || landed !== to) {
    fail(from, "redirect", `expected ${to} with 200, landed on ${landed} with ${response?.status()}`);
  }
}

/* --------------------------------------------------- 3. every page ------- */

const seenTitles = new Map();
const seenDescriptions = new Map();
let checked = 0;

for (const path of PAGE_PATHS) {
  const response = await page.goto(`${ORIGIN}${path}`, { waitUntil: "networkidle" });

  if (response?.status() !== 200) {
    fail(path, "status", `got ${response?.status()}`);
    continue;
  }
  checked++;

  // The intro curtain covers the page on a hard load; let it clear before
  // anything is measured, or every measurement is of the curtain.
  await page.waitForTimeout(3400);

  const result = await page.evaluate(() => {
    const out = {};

    /* ---- headings ---- */
    const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
      level: Number(h.tagName[1]),
      text: (h.textContent || "").trim(),
    }));
    out.h1s = headings.filter((h) => h.level === 1).map((h) => h.text);
    out.jumps = [];
    let previous = 0;
    for (const heading of headings) {
      if (previous && heading.level > previous + 1) {
        out.jumps.push(`h${previous} -> h${heading.level} at "${heading.text.slice(0, 40)}"`);
      }
      previous = heading.level;
    }

    /* ---- nothing still points at a retired preview ---- */
    out.staleLinks = [...document.querySelectorAll("a[href]")]
      .map((a) => a.getAttribute("href"))
      .filter((href) => href && /^\/template-\d/.test(href));

    /* ---- images ---- */
    out.missingAlt = [...document.querySelectorAll("img")]
      .filter((img) => !img.hasAttribute("alt"))
      .map((img) => img.getAttribute("src"));

    /* ---- landmarks ---- */
    out.mainCount = document.querySelectorAll("main").length;
    out.skipTargetExists = Boolean(document.getElementById("main"));

    /* ---- accessible names on controls ---- */
    const named = (el) => {
      if (el.getAttribute("aria-label")?.trim()) return true;
      if (el.getAttribute("aria-labelledby")) return true;
      if ((el.textContent || "").trim()) return true;
      if (el.getAttribute("title")?.trim()) return true;
      // input, select and textarea all expose .labels.
      if (el.labels?.length) return true;
      return false;
    };
    out.unnamed = [...document.querySelectorAll("button, a[href], select, textarea, input")]
      .filter((el) => el.type !== "hidden" && !el.closest(".honeypot"))
      .filter((el) => !named(el))
      .map((el) => `${el.tagName.toLowerCase()}${el.className ? "." + String(el.className).split(" ")[0] : ""}`)
      .slice(0, 5);

    /* ---- metadata ---- */
    out.title = document.title;
    out.description = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
    out.lang = document.documentElement.lang;

    return out;
  });

  if (result.h1s.length !== 1) {
    fail(path, "h1", `${result.h1s.length} h1s: ${JSON.stringify(result.h1s).slice(0, 120)}`);
  }
  for (const jump of result.jumps) fail(path, "heading-order", jump);
  for (const href of result.staleLinks) fail(path, "stale-preview-link", href);
  for (const src of result.missingAlt) fail(path, "img-alt", `no alt on ${src}`);
  if (result.mainCount !== 1) fail(path, "landmark", `${result.mainCount} <main> elements`);
  if (!result.skipTargetExists) fail(path, "skip-link", "#main does not exist");
  for (const control of result.unnamed) fail(path, "unnamed-control", control);
  if (!result.lang) fail(path, "lang", "<html> has no lang");
  if (!result.title) fail(path, "title", "empty");
  if (!result.description) fail(path, "description", "empty");

  const titleOwner = seenTitles.get(result.title);
  if (titleOwner) fail(path, "duplicate-title", `same as ${titleOwner}`);
  else seenTitles.set(result.title, path);

  const descOwner = seenDescriptions.get(result.description);
  if (descOwner) fail(path, "duplicate-description", `same as ${descOwner}`);
  else seenDescriptions.set(result.description, path);

  /* ---- horizontal overflow, at three widths ---- */
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(260);
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      if (doc.scrollWidth <= doc.clientWidth + 1) return null;
      // Name the widest offender rather than just reporting a number.
      let worst = null;
      for (const el of document.querySelectorAll("body *")) {
        const rect = el.getBoundingClientRect();
        if (rect.right > doc.clientWidth + 1 && rect.width > 0) {
          const overhang = rect.right - doc.clientWidth;
          if (!worst || overhang > worst.overhang) {
            worst = {
              overhang: Math.round(overhang),
              tag: el.tagName.toLowerCase(),
              cls: String(el.className || "").slice(0, 70),
            };
          }
        }
      }
      return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, worst };
    });
    if (overflow) {
      fail(
        path,
        `overflow@${width}`,
        `${overflow.scrollWidth} > ${overflow.clientWidth}; widest: ${overflow.worst?.tag} .${overflow.worst?.cls}`,
      );
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
}

await browser.close();

/* ------------------------------------------------------------- report ---- */

mkdirSync("scratch", { recursive: true });
writeFileSync("scratch/audit.json", JSON.stringify({ checked, failures }, null, 2));

console.log(
  `\nAudited ${checked} pages, ${MUST_404.length} missing addresses and ${REDIRECTS.length} retired preview links.`,
);
if (failures.length === 0) {
  console.log("PASS — no failures.\n");
  process.exit(0);
}

const byCheck = new Map();
for (const f of failures) {
  if (!byCheck.has(f.check)) byCheck.set(f.check, []);
  byCheck.get(f.check).push(f);
}
console.log(`FAIL — ${failures.length} problems in ${byCheck.size} categories:\n`);
for (const [check, items] of [...byCheck].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${check} (${items.length})`);
  for (const item of items.slice(0, 6)) console.log(`    ${item.page}  ${item.detail}`);
  if (items.length > 6) console.log(`    ... and ${items.length - 6} more`);
}
console.log("\nFull list: scratch/audit.json\n");
process.exit(1);
