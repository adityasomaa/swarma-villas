import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

/*
 * The same measurement as hero-contrast, for the inner pages.
 *
 * PageHero's overlay is lighter than the home hero's, because half a screen of
 * heavy scrim looks like a mistake. That makes the photograph behind it matter
 * more, so when a hero photo changes this is the check that says whether the
 * heading still reads.
 */
const ORIGIN = process.argv[2] ?? "http://localhost:3100";
const PAGES = [
  "/about", "/houses", "/houses/gladak-house", "/houses/bamboo-hexa",
  "/houses/bamboo-dome", "/restaurant", "/experiences", "/packages", "/journal",
];

const b = await chromium.launch({ channel: "chrome" });
const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await c.newPage();
await p.goto(`${ORIGIN}/`, { waitUntil: "domcontentloaded" });
await p.evaluate(() => localStorage.setItem("swarma.consent.v1", "accepted"));

const out = {};
for (const path of PAGES) {
  await p.goto(`${ORIGIN}${path}`, { waitUntil: "networkidle" });
  await p.waitForTimeout(3200);
  const boxes = await p.evaluate(() => {
    const hero = document.querySelector('[data-hero="dark"]');
    if (!hero) return null;
    const pick = { kicker: hero.querySelector(".kicker"), h1: hero.querySelector("h1") };
    const r = {};
    for (const [k, el] of Object.entries(pick)) {
      if (!el) continue;
      const b = el.getBoundingClientRect();
      r[k] = { x: b.x, y: b.y, w: b.width, h: b.height };
      el.style.visibility = "hidden";
    }
    return r;
  });
  if (!boxes) { out[path] = "no photo hero"; continue; }
  await p.waitForTimeout(250);
  out[path] = {};
  for (const [k, box] of Object.entries(boxes)) {
    const clip = { x: Math.max(0, box.x), y: Math.max(0, box.y), width: Math.max(4, box.w), height: Math.max(4, box.h) };
    const file = `scratch/hero-inner-${path.replace(/\//g, "_")}-${k}.png`;
    await p.screenshot({ path: file, clip });
    out[path][k] = file;
  }
}
writeFileSync("scratch/hero-inner.json", JSON.stringify(out, null, 1));
await b.close();
console.log("captured");
