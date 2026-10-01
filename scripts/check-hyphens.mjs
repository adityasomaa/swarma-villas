import { chromium } from "playwright";

/* =============================================================================
   NO HYPHENATED COMPOUNDS
   -----------------------------------------------------------------------------
   The villa writes compound modifiers open: open air, single storey, eco chic,
   non resident. They asked for it three times across a week, so it is a house
   rule rather than a one-off edit, and a rule that is only kept by hand is a
   rule that quietly stops being kept.

   This reads the VISIBLE TEXT of every page rather than the content files,
   which is the only way to catch a string hardcoded in a component, a caption
   in photos.json, or a label that a CSS text-transform has changed.

   FOUR WORDS ARE ALLOWED TO KEEP THEIRS. Wi-Fi is a trademark, and Check-in,
   Check-out and No-show are dictionary nouns in the terms. If the villa ever
   wants those opened up too, take them out of ALLOWED.

   Run: node scripts/check-hyphens.mjs [origin]
   ========================================================================== */

const ORIGIN = process.argv[2] ?? "http://localhost:3100";

const PAGES = [
  "/", "/about", "/houses", "/houses/gladak-house", "/houses/bamboo-hexa",
  "/houses/bamboo-dome", "/restaurant", "/experiences", "/packages", "/journal",
  "/gallery", "/review", "/contact", "/term-condition", "/privacy",
];

const ALLOWED = new Set(["Wi-Fi", "Check-in", "Check-out", "check-in", "check-out", "No-show"]);

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${ORIGIN}/`, { waitUntil: "domcontentloaded" });
await page.evaluate(() => localStorage.setItem("swarma.consent.v1", "accepted"));

const found = new Map();
for (const path of PAGES) {
  await page.goto(`${ORIGIN}${path}`, { waitUntil: "domcontentloaded" });
  const text = await page.evaluate(() => document.body.innerText);
  for (const match of text.matchAll(/[A-Za-z]{2,}-[A-Za-z]{2,}/g)) {
    if (ALLOWED.has(match[0])) continue;
    if (!found.has(match[0])) found.set(match[0], new Set());
    found.get(match[0]).add(path);
  }
}
await browser.close();

if (found.size === 0) {
  console.log(`${PAGES.length} pages read, no hyphenated compounds.`);
  process.exit(0);
}
for (const [word, paths] of [...found].sort()) {
  console.log(`  ${word.padEnd(20)} ${[...paths].join(", ")}`);
}
console.log(`\n${found.size} hyphenated word(s) in the visible text.`);
process.exit(1);
