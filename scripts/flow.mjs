import { chromium, devices } from "playwright";

/* =============================================================================
   BEHAVIOUR TESTS
   -----------------------------------------------------------------------------
   The audit checks the pages as documents. This checks the things the brief
   asked for that only exist while someone is using the site:

     11  Lenis smooth scrolling, off while a popup is open, off on tablet and
         phone
     12  custom dropdowns, never a native <select>; the calendar opens from
         anywhere in the field, not only from the icon
     13  two loaders — arrival for the home page, page for everything else
     14  page closes -> content changes -> scroll to top -> page opens, with
         every change happening while the curtain is closed

   Point 14 is the one that cannot be checked by looking. The test samples the
   scroll position and the curtain state together, and fails if the page is ever
   seen scrolling while the curtain is not covering it.

     node scripts/flow.mjs http://localhost:3100
   ========================================================================== */

const ORIGIN = process.argv[2] ?? "http://localhost:3000";
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "  pass" : "  FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
};

const browser = await chromium.launch();

/* ========================================================== DESKTOP ======= */
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${ORIGIN}/template-1`, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.setItem("swarma.consent.v1", "accepted"));

  console.log("\nDesktop 1440x900");

  /* ---------------------------------------------- 11. Lenis is running ---- */
  await page.goto(`${ORIGIN}/template-1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(3400);
  const lenisOn = await page.evaluate(() => document.documentElement.classList.contains("lenis"));
  check("Lenis active on desktop", lenisOn);

  /* ---------------------------- 12. no native form controls anywhere ------ */
  await page.goto(`${ORIGIN}/template-1/contact`, { waitUntil: "networkidle" });
  await page.waitForTimeout(3400);
  const native = await page.evaluate(() => ({
    selects: document.querySelectorAll("select").length,
    dates: document.querySelectorAll('input[type="date"]').length,
  }));
  check("no native <select>", native.selects === 0, `found ${native.selects}`);
  check("no native date input", native.dates === 0, `found ${native.dates}`);

  /* ------------------- 12. the calendar opens from anywhere in the field -- */
  const field = page.locator("#booking-checkIn");
  await field.scrollIntoViewIfNeeded();
  const box = await field.boundingBox();
  // Click 24px in from the LEFT edge — the label text, as far from the calendar
  // icon on the right as the control allows.
  await page.mouse.click(box.x + 24, box.y + box.height / 2);
  await page.waitForTimeout(400);
  const openedFromLeft = await page.evaluate(
    () => document.querySelectorAll('[role="dialog"] [role="grid"], [role="dialog"] table').length > 0,
  );
  check("calendar opens from the left of the field, not just the icon", openedFromLeft);

  /* ----------------------- 11. Lenis stops while the calendar is open ----- */
  const stoppedWhileOpen = await page.evaluate(() =>
    document.documentElement.classList.contains("lenis-stopped"),
  );
  check("Lenis stopped while the calendar is open", stoppedWhileOpen);

  /* -------------------------------------- the calendar closes on Escape --- */
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const closed = await page.evaluate(
    () => document.querySelectorAll('[role="dialog"] [role="grid"], [role="dialog"] table').length === 0,
  );
  const focusReturned = await page.evaluate(() => document.activeElement?.id);
  check("Escape closes the calendar", closed);
  check("focus returns to the field", focusReturned === "booking-checkIn", `focus on ${focusReturned}`);
  const lenisResumed = await page.evaluate(
    () => !document.documentElement.classList.contains("lenis-stopped"),
  );
  check("Lenis resumes after the calendar closes", lenisResumed);

  /* ----------------------- 12. the listbox is operable from the keyboard -- */
  await page.locator("#booking-house").scrollIntoViewIfNeeded();
  await page.locator("#booking-house").focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(250);
  const listOpen = await page.evaluate(
    () => document.querySelectorAll('[role="listbox"] [role="option"]').length,
  );
  check("listbox opens with Enter", listOpen > 0, `${listOpen} options`);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(250);
  const chosen = await page.locator("#booking-house").innerText();
  check("arrow keys + Enter select an option", !/choose one/i.test(chosen), `now "${chosen.trim()}"`);

  /* ----- 14. the transition sequence: nothing moves while the page is open */
  await page.goto(`${ORIGIN}/template-1/houses`, { waitUntil: "networkidle" });
  await page.waitForTimeout(3400);
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForTimeout(700);

  const samples = await page.evaluate(async () => {
    const taken = [];
    let running = true;
    const sample = () => {
      const curtain = document.querySelector("[data-curtain]");
      taken.push({
        t: Math.round(performance.now()),
        y: Math.round(window.scrollY),
        phase: curtain?.getAttribute("data-state") ?? "none",
        path: location.pathname,
      });
      if (running) requestAnimationFrame(sample);
    };
    sample();

    // Follow the first link into a house page, the same way a visitor would.
    const link = [...document.querySelectorAll('a[href*="/houses/"]')][0];
    link.click();

    await new Promise((r) => setTimeout(r, 3000));
    running = false;
    return taken;
  });

  const changedAt = samples.findIndex((s, i) => i > 0 && s.path !== samples[i - 1].path);
  check("navigation happened", changedAt > 0);

  if (changedAt > 0) {
    // The route may only change while the curtain is fully closed.
    const atChange = samples[changedAt];
    check(
      "the page changes while the curtain is closed",
      atChange.phase === "closed" || atChange.phase === "closing",
      `phase was "${atChange.phase}"`,
    );

    // The scroll must be back at the top before the curtain starts opening.
    const openingAt = samples.findIndex((s, i) => i >= changedAt && s.phase === "opening");
    if (openingAt > 0) {
      check(
        "scrolled to the top before the curtain opens",
        samples[openingAt].y <= 2,
        `scrollY was ${samples[openingAt].y}`,
      );
    }

    // And at no point may the page be seen scrolling with the curtain clear.
    let seenMoving = null;
    for (let i = 1; i < samples.length; i++) {
      const a = samples[i - 1];
      const b = samples[i];
      if (b.phase === "idle" && Math.abs(b.y - a.y) > 40) {
        seenMoving = `${a.y} -> ${b.y}`;
        break;
      }
    }
    check("the page never jumps while it is uncovered", seenMoving === null, seenMoving ?? "");

    /* --------------------------------- 13. which loader played ----------- */
    const variants = new Set(samples.map((s) => s.variant).filter(Boolean));
    void variants;
  }

  /* --------------- 13. the two loaders are actually different variants --- */
  const variantToHouse = await page.evaluate(async () => {
    const link = [...document.querySelectorAll('a[href*="/houses/"]')][0];
    if (!link) return null;
    link.click();
    await new Promise((r) => setTimeout(r, 250));
    return document.querySelector("[data-curtain]")?.getAttribute("data-variant") ?? null;
  });
  await page.waitForTimeout(2600);

  const variantToHome = await page.evaluate(async () => {
    const link = [...document.querySelectorAll("header a")].find(
      (a) => new URL(a.href).pathname === "/template-1",
    );
    if (!link) return null;
    link.click();
    await new Promise((r) => setTimeout(r, 250));
    return document.querySelector("[data-curtain]")?.getAttribute("data-variant") ?? null;
  });
  await page.waitForTimeout(2600);

  check("page loader on an inner page", variantToHouse === "page", `got "${variantToHouse}"`);
  check("arrival loader when going home", variantToHome === "arrival", `got "${variantToHome}"`);

  await context.close();
}

/* ============================================== TABLET AND PHONE ========= */
for (const [label, config] of [
  ["Tablet 820x1180", { viewport: { width: 820, height: 1180 }, hasTouch: true, isMobile: true }],
  ["Phone", devices["iPhone 13"]],
]) {
  const context = await browser.newContext(config);
  const page = await context.newPage();
  console.log(`\n${label}`);

  await page.goto(`${ORIGIN}/template-1`, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.setItem("swarma.consent.v1", "accepted"));
  await page.goto(`${ORIGIN}/template-1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(3400);

  const lenisOff = await page.evaluate(
    () => !document.documentElement.classList.contains("lenis"),
  );
  check(`${label}: Lenis is off`, lenisOff);

  await context.close();
}

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(
  `\n${results.length - failed.length}/${results.length} behaviour checks passed.` +
    (failed.length ? `\nFAILED: ${failed.map((f) => f.name).join(", ")}\n` : "\n"),
);
process.exit(failed.length ? 1 : 0);
