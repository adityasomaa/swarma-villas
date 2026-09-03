/**
 * A delay that survives a backgrounded tab.
 *
 * requestAnimationFrame stops firing when the tab is hidden. Any sequence that
 * chains on rAF alone — a page-transition curtain, for instance — freezes
 * mid-way and never finishes, leaving the visitor staring at a covered screen
 * when they come back. Racing a setTimeout against rAF keeps the timing
 * frame-accurate while the tab is visible and guarantees completion when it is
 * not.
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };

    const timer = setTimeout(finish, ms);

    if (typeof requestAnimationFrame === "undefined") return;
    const start = performance.now();
    const tick = (now: number) => {
      if (done) return;
      if (now - start >= ms) {
        clearTimeout(timer);
        finish();
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
