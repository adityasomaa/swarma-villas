import { readFileSync } from "node:fs";

import { chromium } from "playwright";

/* =============================================================================
   THE REVIEW ROW
   -----------------------------------------------------------------------------
   Three things here fail quietly — the row keeps moving and nothing throws, so
   nobody finds out by looking at it for five seconds.

   1. THE SEAM. The track holds the reviews twice and slides by exactly one
      copy. "Exactly" is arithmetic: a copy is not half the track's width, it is
      half plus half a gap, and anything that changes the track's box — padding,
      a border, a margin on the last card — moves one of those two numbers and
      not the other. The row then jumps by the difference once a lap. It already
      happened once: padding-inline on the track put the seam 24px out.

   2. THE DUPLICATE. The second copy is scenery. If it loses aria-hidden a
      screen reader reads all ten reviews twice over.

   3. REDUCED MOTION. The site-wide rule collapses every animation to 0.001ms,
      which does not stop a marquee — it teleports it to the end and parks it
      there, showing the back half of the row and nothing else. The row has to
      opt out of that rule and become something you push instead.

   Run: node scripts/check-marquee.mjs [origin]
   ========================================================================== */

const ORIGIN = process.argv[2] ?? "http://localhost:3100";
/* Counted out of the source rather than imported: the content file is
   TypeScript and reaches for the "@/" alias, neither of which plain node does,
   and a check that needs a build step to run is a check that stops being run. */
const N = (readFileSync("src/content/google-reviews.ts", "utf8").match(/^ {6}author:/gm) ?? [])
  .length;
if (N < 2) {
  console.log("Could not count the reviews in src/content/google-reviews.ts.");
  process.exit(1);
}

const failures = [];
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });

/** The seam arithmetic, at a width where the cards are wide and one where they are not. */
async function measure(page, label) {
  const m = await page.evaluate(() => {
    const track = document.querySelector(".marquee__track");
    if (!track) return null;
    const items = [...track.children];
    const half = items.length / 2;
    const gap = parseFloat(getComputedStyle(track).columnGap);
    const width = track.getBoundingClientRect().width;
    const copy =
      items[half].getBoundingClientRect().left - items[0].getBoundingClientRect().left;
    return {
      items: items.length,
      hidden: items.filter((li) => li.getAttribute("aria-hidden") !== null).length,
      drift: copy - (width / 2 + gap / 2),
      animation: getComputedStyle(track).animationName,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  });

  if (!m) {
    failures.push(`${label}: no review row on the page`);
    return;
  }
  if (m.items !== N * 2) failures.push(`${label}: ${m.items} cards, expected ${N * 2}`);
  if (m.hidden !== N) failures.push(`${label}: ${m.hidden} cards hidden from assistive tech, expected ${N}`);
  if (Math.abs(m.drift) > 0.5) failures.push(`${label}: the seam is ${m.drift.toFixed(1)}px out`);
  if (m.animation === "none") failures.push(`${label}: the row is not animating`);
  if (m.overflow > 0) failures.push(`${label}: the page scrolls sideways by ${m.overflow}px`);
  console.log(
    `  ${label.padEnd(18)} ${m.items} cards, ${m.hidden} hidden, seam ${m.drift.toFixed(2)}px, ${m.animation}`,
  );
}

for (const [label, viewport] of [
  ["desktop", { width: 1440, height: 900 }],
  ["phone", { width: 375, height: 812 }],
]) {
  const page = await browser.newPage({ viewport });
  await page.goto(`${ORIGIN}/`, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.setItem("swarma.consent.v1", "accepted"));
  await page.goto(`${ORIGIN}/review`, { waitUntil: "networkidle" });
  await measure(page, label);
  await page.close();
}

/* ------------------------------------------------- the calm version */
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${ORIGIN}/`, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.setItem("swarma.consent.v1", "accepted"));
  await page.goto(`${ORIGIN}/review`, { waitUntil: "networkidle" });

  const calm = await page.evaluate(() => {
    const track = document.querySelector(".marquee__track");
    const first = track?.firstElementChild;
    return {
      animation: track ? getComputedStyle(track).animationName : "missing",
      // the row must still start at the start, not parked at the end
      offset: first ? Math.round(first.getBoundingClientRect().left) : null,
      repeatShown: [...document.querySelectorAll(".marquee__repeat")].some(
        (el) => getComputedStyle(el).display !== "none",
      ),
      scrollable: track
        ? getComputedStyle(track.parentElement).overflowX === "auto"
        : false,
    };
  });

  if (calm.animation !== "none") failures.push(`reduced motion: still animating (${calm.animation})`);
  if (calm.offset !== null && calm.offset < -20) {
    failures.push(`reduced motion: the row is parked ${-calm.offset}px to the left`);
  }
  if (calm.repeatShown) failures.push("reduced motion: the duplicate copy is still shown");
  if (!calm.scrollable) failures.push("reduced motion: the row cannot be scrolled by hand");
  console.log(
    `  ${"reduced motion".padEnd(18)} animation ${calm.animation}, starts at ${calm.offset}px, scrollable: ${calm.scrollable}`,
  );
  await context.close();
}

await browser.close();

console.log(`\n${N} reviews, checked at two widths and with motion turned down.`);
if (failures.length === 0) {
  console.log("PASS — no failures.");
  process.exit(0);
}
for (const f of failures) console.log(`  FAIL  ${f}`);
process.exit(1);
