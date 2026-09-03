import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

/**
 * Screenshots for review. Not a test — a way to look at all three directions at
 * a real desktop width instead of guessing from a narrow preview pane.
 *
 *   node scripts/shoot.mjs /template-1 /template-2          (defaults to homes)
 *   node scripts/shoot.mjs --width 390 --tag mobile /template-1
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
if (paths.length === 0) paths.push("/template-1", "/template-2", "/template-3");

mkdirSync("scratch/shots", { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });

// Consent up front, so the banner is not in every screenshot.
await page.goto("http://localhost:3100/template-1", { waitUntil: "domcontentloaded" });
await page.evaluate(() => localStorage.setItem("swarma.consent.v1", "accepted"));

for (const path of paths) {
  await page.goto(`http://localhost:3100${path}`, { waitUntil: "networkidle" });
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
  await page.waitForTimeout(900);
  const name = `${tag}${path.replace(/\//g, "_")}.png`;
  await page.screenshot({ path: `scratch/shots/${name}`, fullPage: true });
  console.log(name);
}

await browser.close();
