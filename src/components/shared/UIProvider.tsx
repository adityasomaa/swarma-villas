"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * One small piece of shared UI state, because several widgets need to know
 * about each other:
 *
 *   - Lenis must stop while a menu, calendar or modal is open, or the page
 *     scrolls behind the thing you are trying to use.
 *   - The cookie banner sits above the mobile menu on the stacking scale, so it
 *     hides itself while the menu is open rather than covering it.
 */
type UIState = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  /** How many calendars / modals are currently open. */
  overlayCount: number;
  openOverlay: () => void;
  closeOverlay: () => void;
  /** True when smooth scrolling must be suspended. */
  scrollLocked: boolean;
};

const Ctx = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [overlayCount, setOverlayCount] = useState(0);

  const openOverlay = useCallback(() => setOverlayCount((n) => n + 1), []);
  const closeOverlay = useCallback(() => setOverlayCount((n) => Math.max(0, n - 1)), []);

  const value = useMemo<UIState>(
    () => ({
      menuOpen,
      setMenuOpen,
      overlayCount,
      openOverlay,
      closeOverlay,
      scrollLocked: menuOpen || overlayCount > 0,
    }),
    [menuOpen, overlayCount, openOverlay, closeOverlay],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUI(): UIState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}
