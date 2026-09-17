"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { hardScrollToTop } from "@/components/shared/SmoothScroll";
import { prefersReducedMotion, wait } from "@/lib/wait";

/* =============================================================================
   PAGE TRANSITIONS — the two loaders
   -----------------------------------------------------------------------------
   THE SEQUENCE, and it is never allowed to vary:

     1. page closes      the curtain covers the viewport
     2. content changes  only then does the router navigate
     3. scroll to top    instantly, while the curtain still covers everything
     4. page opens       the curtain clears

   THE TWO LOADERS, chosen by WHERE YOU ARE GOING and never by where you are:
     "arrival"  the home page, and the first load of the site. The logo rises
                into place on the closed curtain, then the curtain lifts.
     "page"     every other destination. Shorter, quieter, no mark.

   ---------------------------------------------------------------------------
   TIMING LIVES HERE AND ONLY HERE.

   These numbers used to exist twice — once in this file as the delays the
   sequence waits, and again in motion.css as the CSS transition durations. They
   drifted, and five of the twelve phases ended up with the JavaScript hiding
   the curtain while its animation was still running: the panels vanished
   mid-slide. That is what "patah-patah" was.

   Now the numbers are written once, below, and pushed onto the curtain element
   as custom properties. motion.css derives every duration and every stagger
   delay from them, so a panel's animation finishes exactly as its phase ends
   and the two cannot drift apart again.

   `close`   how long the curtain takes to cover the screen
   `hold`    the MINIMUM time it stays covered, measured from the moment it is
             covered. The arrival loader needs enough of this for the logo to
             be seen; without it the mark was cut off at whatever moment the
             router happened to be ready.
   `open`    how long it takes to clear
   `stagger` the gap between neighbouring columns. The per-panel duration is
             `total - stagger x (panels - 1)`, so the LAST panel lands exactly
             on the budget rather than after it.
   ========================================================================== */

export type CurtainVariant = "arrival" | "page";
type Phase = "idle" | "closing" | "closed" | "opening";

type Beat = {
  close: number;
  hold: number;
  open: number;
  staggerClose: number;
  staggerOpen: number;
};

/** Three columns closing from alternating edges. */
const TIMING: Record<CurtainVariant, Beat> = {
  arrival: { close: 860, hold: 900, open: 940, staggerClose: 70, staggerOpen: 60 },
  page: { close: 660, hold: 200, open: 720, staggerClose: 70, staggerOpen: 60 },
};

const PANELS = 3;

/** If the route never arrives, reopen anyway rather than trapping the visitor. */
const NAVIGATION_TIMEOUT = 4000;

/**
 * A beat between the curtain finishing its exit and being hidden.
 *
 * `idle` sets `visibility: hidden`, which is instant. Flipping to it on the
 * exact millisecond the transition is due to end means the last frame of the
 * animation and the frame that hides it can be the same one — the panel is
 * still a few percent short of gone when it disappears. Sixty milliseconds is
 * about four frames: invisible to a viewer, decisive for the browser.
 */
const CURTAIN_TAIL = 60;

/* -----------------------------------------------------------------------------
   TWO CONTEXTS, NOT ONE.

   `navigate` never changes, so a link never re-renders. The phase changes four
   times per navigation, and it is read by exactly one component — the curtain.
   Putting both in one context re-rendered every TLink on the page four times per
   navigation, which on /gallery is a hundred and eight of them, at the precise
   moment the curtain is trying to animate.
   -------------------------------------------------------------------------- */

const NavCtx = createContext<((href: string) => void) | null>(null);

export function useNavigate(): (href: string) => void {
  const navigate = useContext(NavCtx);
  if (!navigate) throw new Error("useNavigate must be used inside <TransitionProvider>");
  return navigate;
}

const isHomePath = (pathname: string) => pathname === "/";

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhase] = useState<Phase>("idle");
  const [variant, setVariant] = useState<CurtainVariant>("page");

  const pendingPath = useRef<string | null>(null);
  const busy = useRef(false);
  const beat = useRef<Beat>(TIMING.page);
  const closedAt = useRef(0);

  const navigate = useCallback(
    (href: string) => {
      if (busy.current) return;

      const target = new URL(href, window.location.origin);
      if (target.pathname === window.location.pathname) {
        // Same page. Nothing to swap, so just go back to the top.
        hardScrollToTop();
        return;
      }

      const nextVariant: CurtainVariant = isHomePath(target.pathname) ? "arrival" : "page";
      const b = TIMING[nextVariant];
      beat.current = b;

      const reduced = prefersReducedMotion();

      busy.current = true;
      pendingPath.current = target.pathname;
      setVariant(nextVariant);
      setPhase("closing");

      void (async () => {
        // 1. page closes
        await wait(reduced ? 140 : b.close);
        closedAt.current = performance.now();
        setPhase("closed");
        // 2. content changes, behind the curtain
        router.push(target.pathname + target.search + target.hash);
      })();
    },
    [router],
  );

  // 3 + 4. The new route has rendered: jump to the top, hold, then open.
  useEffect(() => {
    if (!busy.current) return;
    if (pendingPath.current && pathname !== pendingPath.current) return;

    let cancelled = false;
    void (async () => {
      pendingPath.current = null;
      hardScrollToTop();

      const reduced = prefersReducedMotion();
      // Stay covered until the loader has actually finished playing, and long
      // enough for the new page to have painted a frame at the top.
      const elapsed = performance.now() - closedAt.current;
      const remaining = reduced ? 40 : Math.max(180, beat.current.hold - elapsed);

      await wait(remaining);
      if (cancelled) return;
      setPhase("opening");
      await wait(reduced ? 140 : beat.current.open + CURTAIN_TAIL);
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
      }, beat.current.open + CURTAIN_TAIL);
    }, NAVIGATION_TIMEOUT);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <NavCtx.Provider value={navigate}>
      {children}
      <Curtain phase={phase} variant={variant} beat={beat.current} />
    </NavCtx.Provider>
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
  const navigate = useNavigate();
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
  beat,
}: {
  phase: Phase;
  variant: CurtainVariant;
  beat: Beat;
}) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const slats = PANELS;

  // The numbers from TIMING, handed to CSS. Every duration and delay in
  // motion.css is computed from these four values, which is what keeps the
  // animation and the sequence that drives it in step.
  const vars = useMemo(
    () =>
      ({
        "--sw-close": `${beat.close}ms`,
        "--sw-open": `${beat.open}ms`,
        "--sw-stagger-close": `${beat.staggerClose}ms`,
        "--sw-stagger-open": `${beat.staggerOpen}ms`,
        "--n": slats,
      }) as React.CSSProperties,
    [beat, slats],
  );

  // The calm version simplifies itself: no wipe, but the scroll reset still
  // happens in the right place in the sequence, so nothing is lost.
  if (reduced) return null;

  return (
    <div
      className="sw-curtain z-curtain"
      /* A stable hook for scripts/flow.mjs, which samples the phase and the
         scroll position together to prove the page only ever changes while the
         curtain is covering it. Class names are style; this is contract. */
      data-curtain=""
      data-state={phase}
      data-variant={variant}
      style={vars}
      aria-hidden="true"
    >
      {Array.from({ length: slats }, (_, i) => (
        <span key={i} className="sw-curtain__panel" style={{ "--i": i } as React.CSSProperties} />
      ))}
      {variant === "arrival" && (
        <span className="sw-curtain__mark">
          <LoaderMark className="sw-curtain__logo" />
        </span>
      )}
    </div>
  );
}

/**
 * The logo as both loaders show it: the reversed cut, gold and cream, on the
 * deep sage of the curtain. Decorative here — each loader carries its own
 * accessible label, so the image would only be announced twice.
 */
export function LoaderMark({ className }: { className: string }) {
  return (
    <img
      src="/brand/logo-reversed.png"
      srcSet="/brand/logo-reversed.png 1x, /brand/logo-reversed@2x.png 2x"
      alt=""
      aria-hidden="true"
      width={157}
      height={100}
      className={className}
      decoding="async"
    />
  );
}
