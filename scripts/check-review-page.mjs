import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

/* =============================================================================
   THE REVIEW PAGE IN ITS GOOGLE STATE
   -----------------------------------------------------------------------------
   Renders /review against a stub standing in for the Places API, so the page
   can be seen and checked without a billable key. Proves the three things that
   would be embarrassing live: the reviews appear, the attribution Google
   requires appears with them, and the hand written Google review is not printed
   a second time underneath.

   Run: node scripts/check-review-page.mjs
   ========================================================================== */

const PORT = 4411;
const APP = 3101;

const PLACE = {
  rating: 4.7,
  userRatingCount: 128,
  googleMapsUri: "https://maps.google.com/?cid=6089290508169825112",
  reviews: [
    {
      rating: 5,
      originalText: { text: "Tempatnya tenang sekali, sarapannya enak.", languageCode: "id" },
      relativePublishTimeDescription: "2 months ago",
      authorAttribution: { displayName: "Rina P", uri: "https://www.google.com/maps/contrib/1" },
    },
    {
      rating: 5,
      originalText: { text: "A quiet corner of Ubud with genuinely kind hosts.", languageCode: "en" },
      relativePublishTimeDescription: "a year ago",
      authorAttribution: { displayName: "Tom H", uri: "https://www.google.com/maps/contrib/2" },
    },
  ],
};

const stub = createServer((req, res) => {
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(req.url.includes(":searchText") ? { places: [{ id: "ChIJstub" }] } : PLACE));
});
await new Promise((r) => stub.listen(PORT, r));

const env = {
  ...process.env,
  GOOGLE_PLACES_API_KEY: "stub-key",
  GOOGLE_PLACES_PLACE_ID: "ChIJstub",
  GOOGLE_PLACES_BASE: `http://127.0.0.1:${PORT}/v1`,
  PORT: String(APP),
};

const run = (cmd, args) =>
  new Promise((resolve, reject) => {
    const c = spawn(cmd, args, { env, shell: true, stdio: "pipe" });
    c.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });

console.log("  building against the stub ...");
await run("npx", ["next", "build"]);

const server = spawn("npx", ["next", "start", "-p", String(APP)], { env, shell: true, stdio: "pipe" });
await new Promise((r) => setTimeout(r, 6000));

const failures = [];
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
// the arrival curtain covers the page for about a second; the consent panel
// covers the rest of it until it is answered
await page.goto(`http://127.0.0.1:${APP}/`, { waitUntil: "domcontentloaded" });
await page.evaluate(() => localStorage.setItem("swarma.consent.v1", "accepted"));
await page.goto(`http://127.0.0.1:${APP}/review`, { waitUntil: "networkidle" });
await page.waitForTimeout(4000);
const text = await page.evaluate(() => document.body.innerText);

const want = [
  ["the rating", "4.7 out of 5"],
  ["the review count", "128 reviews"],
  ["a review as written", "Tempatnya tenang sekali"],
  ["the author attribution", "Rina P"],
  ["Google's own wording for when", "2 months ago"],
  ["the attribution line", "Reviews and ratings from Google"],
  ["what Google will and will not return", "up to five reviews"],
  ["the villa's own review still below", "The stay was amazing"],
];
for (const [what, needle] of want) {
  const ok = text.includes(needle);
  if (!ok) failures.push(`${what} — no "${needle}"`);
  console.log(`  ${ok ? "pass" : "FAIL"}  ${what}`);
}
// the French one was copied off Google by hand; printing it beside the live ones repeats it
const repeated = text.includes("Je recommande les yeux");
if (repeated) failures.push("the hand copied Google review is printed again below the live ones");
console.log(`  ${repeated ? "FAIL" : "pass"}  the hand copied Google review is not repeated`);

const links = await page.evaluate(() =>
  [...document.querySelectorAll('a[href*="maps.google.com/contrib"], a[href*="/maps/contrib/"]')].length);
if (links < 1) failures.push("no author links; Google requires the attribution to link");
console.log(`  ${links >= 1 ? "pass" : "FAIL"}  author names link to their profiles (${links})`);

await page.locator("text=out of 5").first().scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
await page.screenshot({ path: "scratch/shots/review_google.png" });
await browser.close();
server.kill();
stub.close();

console.log(`\n${failures.length === 0 ? "PASS — no failures." : `${failures.length} FAILED`}`);
for (const f of failures) console.log(`  ${f}`);
process.exit(failures.length ? 1 : 0);
