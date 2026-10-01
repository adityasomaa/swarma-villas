import { chromium } from "playwright";

/* =============================================================================
   THE WAY OUT TO THE BOOKING ENGINE
   -----------------------------------------------------------------------------
   Two things, both of which have already been wrong once.

   1. EVERY Book Direct. Five of the seven buttons read cta.primary.href
      directly and stayed on the enquiry form when the engine was switched on;
      the footer's text link is a TLink, which falls back to a plain anchor for
      an off-site address but adds no target, so it replaced the tab. Both are
      fixed, and this is what keeps them fixed.

   2. The booking bar on a house page: that it asks the engine once rather than
      per keystroke, that it reports what the engine says, and that the button
      carries the chosen dates into the deep link.

   Run: node scripts/check-booking.mjs [origin]
   ========================================================================== */

const ORIGIN = process.argv[2] ?? "http://localhost:3100";
const ENGINE = "https://secure.guestaps.com/swarma-villas-ubud";

const LINK_PAGES = [
  "/", "/about", "/houses", "/restaurant", "/experiences", "/packages",
  "/journal", "/gallery", "/review", "/contact", "/nope",
];

const failures = [];
const fail = (what, detail) => failures.push(`${what}: ${detail}`);

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
await page.goto(`${ORIGIN}/`, { waitUntil: "domcontentloaded" });
await page.evaluate(() => localStorage.setItem("swarma.consent.v1", "accepted"));

/* ------------------------------------------------- 1. every Book Direct link */

let checked = 0;
for (const path of LINK_PAGES) {
  await page.goto(`${ORIGIN}${path}`, { waitUntil: "domcontentloaded" });
  const links = await page.evaluate(() =>
    [...document.querySelectorAll("a")]
      .filter((a) => /book\s*direct/i.test(a.innerText))
      .map((a) => ({
        href: a.getAttribute("href"),
        target: a.getAttribute("target"),
        rel: a.getAttribute("rel") ?? "",
      })),
  );
  for (const link of links) {
    checked++;
    if (link.href !== ENGINE) fail(`${path} Book Direct`, `href is ${link.href}`);
    else if (link.target !== "_blank") fail(`${path} Book Direct`, "no target=_blank");
    else if (!link.rel.includes("noopener")) fail(`${path} Book Direct`, "no rel=noopener");
  }
}

// the mobile menu holds one more
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${ORIGIN}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await page.getByRole("button", { name: /menu/i }).click();
await page.waitForTimeout(800);
for (const href of await page.evaluate(() =>
  [...document.querySelectorAll("a")]
    .filter((a) => /book\s*direct/i.test(a.innerText))
    .map((a) => a.getAttribute("href")),
)) {
  checked++;
  if (href !== ENGINE) fail("mobile menu Book Direct", `href is ${href}`);
}

/* --------------------------------------------------------- 2. the booking bar */

/** Day buttons are labelled with the long date, so navigate by month instead. */
async function pickDate(p, fieldId, month, day) {
  const box = await p.locator(`#${fieldId}`).boundingBox();
  await p.mouse.click(box.x + 24, box.y + box.height / 2);
  await p.waitForTimeout(500);
  for (let i = 0; i < 18; i++) {
    const grid = p.locator(`[role="dialog"] [role="grid"][aria-label="${month}"]`);
    if (await grid.count()) {
      await grid
        .locator('button[role="gridcell"]', { hasText: new RegExp(`^${day}$`) })
        .first()
        .click();
      await p.waitForTimeout(500);
      return true;
    }
    await p.getByRole("button", { name: "Next month" }).click();
    await p.waitForTimeout(220);
  }
  return false;
}

// Far enough out that the villa is unlikely to be full, and the month label is
// built from the date so this keeps working as time passes.
const when = new Date(Date.now() + 120 * 864e5);
const month = when.toLocaleString("en-GB", { month: "long", year: "numeric" });
const inDay = 11;
const outDay = 14;

await page.setViewportSize({ width: 1440, height: 950 });
const apiCalls = [];
page.on("request", (r) => {
  if (r.url().includes("search-room")) apiCalls.push(r.url());
});

await page.goto(`${ORIGIN}/houses/gladak-house`, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
await page.locator("text=Book your stay").first().scrollIntoViewIfNeeded();

const picked =
  (await pickDate(page, "bar-checkIn", month, inDay)) &&
  (await pickDate(page, "bar-checkOut", month, outDay));
if (!picked) fail("booking bar", `could not pick ${month} ${inDay}-${outDay}`);
await page.waitForTimeout(2800);

if (apiCalls.length !== 1) fail("booking bar", `${apiCalls.length} availability calls, want 1`);

const line = (await page.locator('[aria-live="polite"]').first().innerText()).replace(/\s+/g, " ");
if (!/Gladak House is (free|taken)/.test(line)) fail("booking bar", `says "${line}"`);
// The price belongs to the engine, not to us: the villa asked for their own
// published rates to stand while the engine is still undiscounted.
if (/IDR/.test(line)) fail("booking bar", `quotes a rate: "${line}"`);

const cta = page.locator("a", { hasText: /Continue to booking|Open the booking page/ }).first();
const href = await cta.getAttribute("href");
const iso = (d) => `${when.getFullYear()}-${String(when.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
if (!href?.includes(`/${iso(inDay)}/${iso(outDay)}/`)) fail("booking bar", `deep link is ${href}`);
if ((await cta.getAttribute("target")) !== "_blank") fail("booking bar", "button stays in the tab");

await browser.close();

console.log(`${checked} Book Direct links, and the booking bar on a house page.`);
if (failures.length === 0) {
  console.log("PASS — no failures.");
  process.exit(0);
}
for (const f of failures) console.log(`  FAIL  ${f}`);
process.exit(1);
