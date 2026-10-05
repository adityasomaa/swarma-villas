import { chromium, devices } from "playwright";

/* =============================================================================
   WHAT A TAP LEAVES BEHIND
   -----------------------------------------------------------------------------
   A phone has no hover, but it fires :hover on tap and leaves it there until
   something else is touched. The button's hover rolls its label out of its box
   and fills the background, so a tapped button sat there filled and empty —
   the villa photographed one on their phone after opening the booking engine
   and coming back to the page.

   The states are behind `@media (hover: hover) and (pointer: fine)` now. This
   taps a real button on a real touch emulation and checks that the label did
   not move, which is the thing a guest would notice.

   Run: node scripts/check-touch.mjs [origin]
   ========================================================================== */

const ORIGIN = process.argv[2] ?? "http://localhost:3100";

/** [path, the text on the button to tap] */
const BUTTONS = [
  ["/houses/gladak-house", /open the booking page/i],
  ["/review", /send us your review/i],
  ["/contact", /ask on whatsapp/i],
];

const failures = [];
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
const context = await browser.newContext({ ...devices["iPhone 13"] });
const page = await context.newPage();

await page.goto(`${ORIGIN}/`, { waitUntil: "domcontentloaded" });
await page.evaluate(() => localStorage.setItem("swarma.consent.v1", "accepted"));

// the emulation has to actually report a device with no hover, or this proves nothing
const reportsTouch = await page.evaluate(() => matchMedia("(hover: none)").matches);
if (!reportsTouch) failures.push("the emulated device still reports hover; the test proves nothing");

for (const [path, label] of BUTTONS) {
  await page.goto(`${ORIGIN}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  // Reveal holds a section at zero opacity until it has been scrolled past,
  // and Playwright will not tap something it considers invisible.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
  });
  await page.waitForTimeout(600);

  /* :visible matters — the mobile menu holds its own copy of these buttons
     behind visibility:hidden, and .first() would pick that one. */
  const button = page.locator("a.btn:visible, button.btn:visible").filter({ hasText: label }).first();
  if ((await button.count()) === 0) {
    failures.push(`${path}: no button matching ${label}`);
    continue;
  }
  await button.scrollIntoViewIfNeeded();
  await button.waitFor({ state: "visible", timeout: 10000 });

  // tap without following the link, which would take the page away
  await button.evaluate((el) => {
    el.addEventListener("click", (e) => e.preventDefault(), { once: true });
  });
  await button.tap();
  await page.waitForTimeout(700);

  const state = await button.evaluate((el) => {
    const label = el.querySelector(".btn__label");
    const wipe = getComputedStyle(el, "::before").transform;
    return {
      labelTransform: label ? getComputedStyle(label).transform : "none",
      wipeTransform: wipe,
      labelVisible: label ? label.getBoundingClientRect().top >= el.getBoundingClientRect().top - 2 : false,
    };
  });

  // "none" or an identity matrix both mean the label did not roll away
  const moved = state.labelTransform !== "none" && !/matrix\(1, 0, 0, 1, 0, 0\)/.test(state.labelTransform);
  if (moved) failures.push(`${path}: the label moved after a tap (${state.labelTransform})`);
  if (!state.labelVisible) failures.push(`${path}: the label is outside the button after a tap`);
  console.log(
    `  ${path.padEnd(26)} label ${moved ? "MOVED" : "steady"}, still inside: ${state.labelVisible}`,
  );
}

await browser.close();

console.log(`\n${BUTTONS.length} buttons tapped on a touch device.`);
if (failures.length === 0) {
  console.log("PASS — no failures.");
  process.exit(0);
}
for (const f of failures) console.log(`  FAIL  ${f}`);
process.exit(1);
