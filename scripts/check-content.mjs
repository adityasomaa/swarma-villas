import { chromium } from "playwright";

/* =============================================================================
   THINGS THAT CAN VANISH WITHOUT AN ERROR
   -----------------------------------------------------------------------------
   Both of these have a failure mode where nothing throws and nothing is logged
   — the page simply comes back missing a piece, and only a person looking at it
   would notice.

   1. THE TERMS LOOKUPS. /houses and /contact find the arrival times by matching
      the section's TITLE inside the terms. Rename the section without renaming
      both lookups and "Before you book" and the contact page's times panel
      disappear, silently. That nearly happened when the hyphen came out of
      "Check-in & Check-out".

   2. THE MENUS. Two PDFs the villa supplied, served from /public. A PDF has to
      be treated as leaving the page even from our own origin, or the Button
      falls through to the client router, which has no route for one.

   Run: node scripts/check-content.mjs [origin]
   ========================================================================== */

const ORIGIN = process.argv[2] ?? "http://localhost:3100";

/** [path, what it is, text that must be on the page] */
const MUST_SAY = [
  ["/houses", "Before you book, the arrival panel", "Check in and check out"],
  ["/houses", "Before you book, the times themselves", "Check in: 14:00"],
  ["/houses", "Before you book, the cancellation policy", "full refund"],
  ["/contact", "the arrival times panel", "Check in & Check out"],
  ["/term-condition", "the no show clause", "No show: no refund."],
  ["/houses/gladak-house", "the amenities", "WiFi internet"],
  ["/", "how a guest knows they have arrived", "directly opposite Gaya Gelato Lab"],
];

const MENUS = [
  ["/restaurant", "Paon's menu"],
  ["/experiences", "the treatment menu"],
];

const failures = [];
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${ORIGIN}/`, { waitUntil: "domcontentloaded" });
await page.evaluate(() => localStorage.setItem("swarma.consent.v1", "accepted"));

for (const [path, what, needle] of MUST_SAY) {
  await page.goto(`${ORIGIN}${path}`, { waitUntil: "domcontentloaded" });
  const text = await page.evaluate(() => document.body.innerText);
  if (!text.includes(needle)) failures.push(`${path} — ${what} — no "${needle}"`);
}

for (const [path, what] of MENUS) {
  await page.goto(`${ORIGIN}${path}`, { waitUntil: "domcontentloaded" });
  const link = page.locator('a[href$=".pdf"]').first();
  if ((await link.count()) === 0) {
    failures.push(`${path} — ${what} — no PDF link`);
    continue;
  }
  const href = await link.getAttribute("href");
  if ((await link.getAttribute("target")) !== "_blank") {
    failures.push(`${path} — ${what} — opens in the same tab`);
  }
  const res = await page.request.get(`${ORIGIN}${href}`);
  const body = await res.body();
  if (res.status() !== 200) failures.push(`${href} — ${res.status()}`);
  else if (body.subarray(0, 4).toString() !== "%PDF") failures.push(`${href} — not a PDF`);
  else {
    console.log(`  ${what.padEnd(22)} ${href}  ${(body.length / 1024 / 1024).toFixed(2)} MB`);
  }
}

await browser.close();

console.log(`\n${MUST_SAY.length} page contents and ${MENUS.length} menus checked.`);
if (failures.length === 0) {
  console.log("PASS — no failures.");
  process.exit(0);
}
for (const f of failures) console.log(`  FAIL  ${f}`);
process.exit(1);
