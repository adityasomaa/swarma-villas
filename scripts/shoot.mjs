import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

/**
 * Screenshots for review. Not a test â€” a way to look at all three directions at
 * a real desktop width instead of guessing from a narrow preview pane.
 *
 *   node scripts/shoot.mjs / /houses                       (defaults to the home page)
 *   node scripts/shoot.mjs --width 390 --tag mobile /
 *   SHOOT_ORIGIN=https://swarma-villas.vercel.app node scripts/shoot.mjs /
 */
const args = process.argv.slice(2);
let width = 1440;
let height = 900;
let tag = "desktop";
const paths = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--width") width = Number(args[++i]);
  else if (args[i] === "--height") height = Number(args[++i]);
  else if (args[i] === "--tag") tag = args[++i];
  else paths.push(args[i]);
}
if (paths.length === 0) paths.push("/");
const ORIGIN = process.env.SHOOT_ORIGIN || "http://localhost:3100";

mkdirSync("scratch/shots", { recursive: true });

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });

// Consent up front, so the banner is not in every screenshot.
await page.goto(`${ORIGIN}/`, { waitUntil: "domcontentloaded" });
await page.evaluate(() => localStorage.setItem("swarma.consent.v1", "accepted"));

for (const path of paths) {
  await page.goto(`${ORIGIN}${path}`, { waitUntil: "networkidle" });
  // Let the intro play out and every Reveal fire.
  await page.waitForTimeout(3200);
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  /*
   * fullPage composites a tall image, and a lazy <img> that has never been in
   * the viewport composites BLANK — which reads in review as a missing
   * photograph rather than a screenshot artefact. Force every image eager and
   * wait for all of them to decode before capturing.
   */
  await page.evaluate(async () => {
    /*
     * Kill every transition and animation before capturing.
     *
     * An element carrying `transition-transform` gets its own composited layer,
     * and fullPage compositing renders those layers BLANK in the stitched
     * image — which in review looks exactly like a photograph that failed to
     * load. It is not: the same elements paint correctly in a viewport
     * screenshot and in the browser. Removing the transitions removes the
     * layers, and the capture matches what a person sees.
     */
    const style = document.createElement("style");
    style.textContent =
      "*,*::before,*::after{transition:none!important;animation:none!important;will-change:auto!important}";
    document.head.appendChild(style);

    const imgs = [...document.querySelectorAll("img")];
    for (const img of imgs) img.loading = "eager";
    await Promise.all(
      imgs.map((img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise((r) => {
              img.addEventListener("load", r, { once: true });
              img.addEventListener("error", r, { once: true });
              setTimeout(r, 8000);
            }),
      ),
    );
  });
  await page.waitForTimeout(1200);
  const name = `${tag}${path === "/" ? "_home" : path.replace(/\//g, "_")}.png`;
  await page.screenshot({ path: `scratch/shots/${name}`, fullPage: true });
  console.log(name);
}

await browser.close();
