import { chromium, devices } from "playwright";
import { writeFileSync } from "node:fs";

/*
 * Measures the contrast of the hero text against the photograph actually
 * behind it. The text is hidden, the band under each line is screenshotted,
 * and white is compared against the brightest 10% of those pixels — the
 * patches of sky and leaf that make a line hard to read.
 */
const ORIGIN = process.argv[2] ?? "http://localhost:3100";
const b = await chromium.launch({ channel: "chrome" });
const out = {};
for (const [label, cfg] of [
  ["desktop", { viewport: { width: 1440, height: 900 } }],
  ["phone", devices["iPhone 13"]],
]) {
  const c = await b.newContext(cfg);
  const p = await c.newPage();
  await p.goto(`${ORIGIN}/`, { waitUntil: "domcontentloaded" });
  await p.evaluate(() => localStorage.setItem("swarma.consent.v1", "accepted"));
  await p.goto(`${ORIGIN}/`, { waitUntil: "networkidle" });
  await p.waitForTimeout(3800);
  const boxes = await p.evaluate(() => {
    const hero = document.querySelector('[data-hero="dark"]');
    const pick = { kicker: hero.querySelector(".kicker"), h1: hero.querySelector("h1"), lede: hero.querySelector("p.max-w-md") };
    const r = {};
    for (const [k, el] of Object.entries(pick)) {
      const b = el.getBoundingClientRect();
      r[k] = { x: b.x, y: b.y, w: b.width, h: b.height };
      el.style.visibility = "hidden";
    }
    // header too — it sits on the same photograph
    const nav = document.querySelector("header nav") ?? document.querySelector("header");
    const hb = nav.getBoundingClientRect();
    r.nav = { x: hb.x, y: hb.y, w: hb.width, h: hb.height };
    document.querySelector("header").style.visibility = "hidden";
    return r;
  });
  await p.waitForTimeout(300);
  const res = {};
  for (const [k, bx] of Object.entries(boxes)) {
    const buf = await p.screenshot({ clip: { x: bx.x, y: bx.y, width: Math.max(1, bx.w), height: Math.max(1, bx.h) } });
    res[k] = buf.toString("base64");
  }
  out[label] = res;
  await c.close();
}
await b.close();
writeFileSync("scratch/hero-bands.json", JSON.stringify(out));
console.log("captured");
