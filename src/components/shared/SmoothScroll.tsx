"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useUI } from "@/components/shared/UIProvider";
import { prefersReducedMotion } from "@/lib/wait";

/* =============================================================================
   LENIS — switched on only where it helps.
   -----------------------------------------------------------------------------
   OFF on tablet and mobile. Both were asked for, and both are right: touch
   devices already have momentum scrolling that feels better than a JavaScript
   reimplementation, and hijacking it there costs battery and breaks the
   address-bar collapse that gives a phone its extra viewport height. The gate
   is a width of 1024px AND a fine pointer, so a tablet with a keyboard and a
   trackpad is treated as the desktop it is behaving like.

   OFF entirely under prefers-reduced-motion.

   STOPPED whenever a menu, calendar or modal is open, so the page cannot drift
   behind the thing the visitor is using.
   ========================================================================== */

/** Module-level handle so the page transition can jump scroll without React. */
let activeLenis: Lenis | null = null;

export function SmoothScroll() {
  const { scrollLocked } = useUI();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const eligible =
      window.matchMedia("(min-width: 1024px)").matches &&
      window.matchMedia("(pointer: fine)").matches &&
      !prefersReducedMotion();

    if (!eligible) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 0,
    });
    lenisRef.current = lenis;
    activeLenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
      activeLenis = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (scrollLocked) lenis.stop();
    else lenis.start();
  }, [scrollLocked]);

  return null;
}

/**
 * Jump to the top with no animation, whether or not Lenis is running.
 * Lenis keeps its own idea of scroll position; telling only the window leaves
 * the two out of sync and the next wheel event snaps back.
 */
export function hardScrollToTop() {
  if (activeLenis) activeLenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}
