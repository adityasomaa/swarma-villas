"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderMark } from "@/components/shared/Transition";
import { business } from "@/content/site";
import { prefersReducedMotion, wait } from "@/lib/wait";

/* =============================================================================
   THE FIRST-LOAD VIEW — loader one of two.
   -----------------------------------------------------------------------------
   This is the arrival loader in the case a route transition cannot cover: a
   hard page load, where there is no previous page to close. It renders once per
   document. Every navigation after it is handled by the curtain in
   Transition.tsx, which shows the same logo on the same deep sage so the two
   read as one system rather than two different animations.

   `hasPlayed` is module-level on purpose. It survives client navigation — so
   going back to the home page does not replay the intro — and resets on a real
   page load, which is exactly when the intro should run.
   ========================================================================== */

let hasPlayed = false;

const HOLD_MS = 1900;
const EXIT_MS = 900;

export function IntroLoader() {
  const [phase, setPhase] = useState<"in" | "out" | "gone">(() => (hasPlayed ? "gone" : "in"));
  /**
   * Per-instance, and deliberately NOT the module flag above.
   *
   * `hasPlayed` answers "has this document already shown the intro" and decides
   * the INITIAL state. It must not also guard the effect: React remounts
   * effects on the same instance in development, so a module flag set on the
   * first run makes the second run bail out — and since the first run's cleanup
   * has already cancelled its own sequence, nothing is left to finish it. The
   * curtain then sits over the site forever.
   *
   * A ref is scoped to this instance, so the second invocation sees the same
   * `true` the first one set and the sequence that is already running is the
   * one that completes. There is no cancellation to undo it: setting state
   * after unmount is a no-op, and the phase only ever moves forwards.
   */
  const started = useRef(false);

  useEffect(() => {
    if (started.current || phase === "gone") return;
    started.current = true;
    hasPlayed = true;

    const reduced = prefersReducedMotion();
    const hold = reduced ? 300 : HOLD_MS;
    const exit = reduced ? 180 : EXIT_MS;

    void (async () => {
      await wait(hold);
      setPhase("out");
      await wait(exit);
      setPhase("gone");
    })();
  }, [phase]);

  // While the intro is up the page behind it must not scroll.
  useEffect(() => {
    if (phase === "gone") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      className="sw-intro z-curtain"
      data-state={phase}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${business.name}`}
    >
      <div className="sw-intro__inner">
        <LoaderMark className="sw-intro__logo" />
        <p className="sw-intro__sub" aria-hidden="true">
          {business.tagline}
        </p>
      </div>
    </div>
  );
}
