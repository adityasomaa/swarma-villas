"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useUI } from "@/components/shared/UIProvider";

/**
 * Headless mobile-menu behaviour, shared by all three headers because these
 * rules are correctness rather than style:
 *
 *   - Escape closes it and focus returns to the toggle.
 *   - A route change closes it, or the panel survives the page transition and
 *     covers the new page.
 *   - Tab is trapped inside the panel while it is open.
 *   - The page behind it does not scroll (UIProvider also tells Lenis to stop).
 *
 * Each template renders its own markup and its own animation on top of this.
 */
export function useMobileMenu() {
  const { menuOpen, setMenuOpen } = useUI();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    }, 0);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen, setMenuOpen]);

  return { menuOpen, setMenuOpen, panelRef, toggleRef };
}
