"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { hardScrollToTop } from "@/components/shared/SmoothScroll";
import { TEMPLATES, templateFromPath, type TemplateId } from "@/lib/templates";
import { prefersReducedMotion, wait } from "@/lib/wait";

/* =============================================================================
   PAGE TRANSITIONS — the two loaders
   -----------------------------------------------------------------------------
   THE SEQUENCE, and it is never allowed to vary:

     1. page closes      the curtain covers the viewport
     2. content changes  only then does the router navigate
     3. scroll to top    instantly, while the curtain still covers everything
     4. page opens       the curtain clears

   Every step waits for the one before it, so the visitor never sees a
   half-rendered page or a scroll position jumping. It is deliberately unhurried:
   the brief asked for seamless over fast.

   THE TWO LOADERS:
     "arrival"  — the first load of the site, and any navigation that lands on a
                  template's home page. The bigger of the two: the mark draws,
                  the name sets, and the curtain lifts.
     "page"     — every other navigation. Shorter, quieter, no wordmark.

   Every wait is `wait()` from lib/wait, which races setTimeout against
   requestAnimationFrame. A sequence driven by rAF alone freezes when the tab is
   backgrounded and the curtain never reopens.
   ========================================================================== */

export type CurtainVariant = "arrival" | "page";
type Phase = "idle" | "closing" | "closed" | "opening";

/** Per-template, per-variant timing in milliseconds. */
const TIMING: Record<TemplateId | "shared", Record<CurtainVariant, { close: number; open: number }>> = {
  t1: { arrival: { close: 760, open: 900 }, page: { close: 560, open: 640 } },
  t2: { arrival: { close: 820, open: 940 }, page: { close: 600, open: 700 } },
  t3: { arrival: { close: 720, open: 860 }, page: { close: 540, open: 620 } },
  shared: { arrival: { close: 600, open: 700 }, page: { close: 460, open: 540 } },
};

/** If the route never arrives, reopen anyway rather than trapping the visitor. */
const NAVIGATION_TIMEOUT = 4000;

type TransitionState = {
  phase: Phase;
  variant: CurtainVariant;
  navigate: (href: string) => void;
};

const Ctx = createContext<TransitionState | null>(null);

export function usePageTransition(): TransitionState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePageTransition must be used inside <TransitionProvider>");
  return ctx;
}

/** A template home is `/template-N` exactly. */
function isHomePath(pathname: string): boolean {
  return Object.values(TEMPLATES).some((t) => t.basePath === pathname);
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [variant, setVariant] = useState<CurtainVariant>("page");
  const pendingPath = useRef<string | null>(null);
  const busy = useRef(false);
  const timing = useRef(TIMING.shared.page);

  const navigate = useCallback(
    (href: string) => {
      if (busy.current) return;

      const target = new URL(href, window.location.origin);
      if (target.pathname === window.location.pathname) {
        // Same page. Nothing to swap, so just go back to the top.
        hardScrollToTop();
        return;
      }

      // The loader is chosen by where you are GOING, not where you are.
      const nextVariant: CurtainVariant = isHomePath(target.pathname) ? "arrival" : "page";
      const tpl = templateFromPath(target.pathname) ?? templateFromPath(pathname);
      const t = TIMING[tpl ?? "shared"][nextVariant];
      timing.current = t;

      const reduced = prefersReducedMotion();
      const closeMs = reduced ? 140 : t.close;

      busy.current = true;
      pendingPath.current = target.pathname;
      setVariant(nextVariant);
      setPhase("closing");

      void (async () => {
        // 1. page closes
        await wait(closeMs);
        setPhase("closed");
        // 2. content changes, behind the curtain
        router.push(target.pathname + target.search + target.hash);
      })();
    },
    [router, pathname],
  );

  // 3 + 4. The new route has rendered: jump to the top, then open.
  useEffect(() => {
    if (!busy.current) return;
    if (pendingPath.current && pathname !== pendingPath.current) return;

    let cancelled = false;
    void (async () => {
      pendingPath.current = null;
      hardScrollToTop();
      // A beat at the top so the new page is painted before it is revealed.
      await wait(prefersReducedMotion() ? 40 : 220);
      if (cancelled) return;
      setPhase("opening");
      await wait(prefersReducedMotion() ? 140 : timing.current.open);
      if (cancelled) return;
      setPhase("idle");
      busy.current = false;
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // Safety net: offline, a 500, a hung request — reopen rather than leaving the
  // visitor staring at a closed curtain forever.
  useEffect(() => {
    if (phase !== "closed") return;
    const timer = setTimeout(() => {
      pendingPath.current = null;
      hardScrollToTop();
      setPhase("opening");
      setTimeout(() => {
        setPhase("idle");
        busy.current = false;
      }, timing.current.open);
    }, NAVIGATION_TIMEOUT);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <Ctx.Provider value={{ phase, variant, navigate }}>
      {children}
      <Curtain phase={phase} variant={variant} template={templateFromPath(pathname)} />
    </Ctx.Provider>
  );
}

/**
 * Jump to the same page in a different preview: /template-1/houses becomes
 * /template-2/houses. Used only by the preview switcher, which is review
 * scaffolding rather than part of any of the three designs.
 *
 * If the current route is outside every preview — the 404 — it lands on that
 * template's home instead, which is also the one case that plays the arrival
 * loader rather than the page loader.
 */
export function useTemplateNav(): (id: TemplateId) => void {
  const { navigate } = usePageTransition();
  const pathname = usePathname();

  return useCallback(
    (id: TemplateId) => {
      const current = templateFromPath(pathname);
      const rest = current ? pathname.slice(TEMPLATES[current].basePath.length) : "";
      navigate(TEMPLATES[id].basePath + rest);
    },
    [navigate, pathname],
  );
}

/* ------------------------------------------------------------------- links */

type TLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
  prefetch?: boolean;
};

/**
 * The only component used for internal navigation. It renders a real anchor
 * with a real href, so middle-click, "open in new tab" and crawlers behave
 * normally; the click handler is what routes it through the curtain.
 */
export function TLink({ href, children, onClick, prefetch, ...rest }: TLinkProps) {
  const { navigate } = usePageTransition();
  const isInternal = href.startsWith("/") && !href.startsWith("//");

  if (!isInternal) {
    return (
      <a href={href} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      prefetch={prefetch}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        // Leave the intentional "open somewhere else" gestures to the browser.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
          return;
        }
        event.preventDefault();
        navigate(href);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}

/* ---------------------------------------------------------------- curtains */

function Curtain({
  phase,
  variant,
  template,
}: {
  phase: Phase;
  variant: CurtainVariant;
  template: TemplateId | null;
}) {
  const family = template ?? "t1";
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // The calm version simplifies itself: no wipe, but the scroll reset still
  // happens in the right place in the sequence, so nothing is lost.
  if (reduced) return null;

  const slats = family === "t3" ? 5 : family === "t1" ? 1 : 3;

  return (
    <div
      className="sw-curtain z-curtain"
      /* A stable hook for scripts/flow.mjs, which samples the phase and the
         scroll position together to prove the page only ever changes while the
         curtain is covering it. Class names are style; this is contract. */
      data-curtain=""
      data-state={phase}
      data-variant={variant}
      data-family={family}
      data-tpl={family}
      aria-hidden="true"
    >
      {Array.from({ length: slats }, (_, i) => (
        <span
          key={i}
          className="sw-curtain__panel"
          style={{ "--i": i, "--n": slats } as React.CSSProperties}
        />
      ))}
      {variant === "arrival" && (
        <span className="sw-curtain__mark">
          <CurtainMark />
        </span>
      )}
    </div>
  );
}

/** The feather from the logo, drawn as a single path so it can be stroked on. */
export function CurtainMark() {
  return (
    <svg viewBox="0 0 120 64" width="120" height="64" aria-hidden="true" focusable="false">
      <path
        className="sw-curtain__feather"
        d="M8 52 C 26 46, 44 38, 62 26 C 76 17, 92 12, 112 12 C 104 30, 90 42, 72 48 C 54 54, 30 56, 8 52 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        pathLength={1}
      />
      <path
        className="sw-curtain__rib"
        d="M10 51 C 40 44, 74 32, 110 13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        pathLength={1}
      />
    </svg>
  );
}
