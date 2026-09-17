"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LogoImage, LogoLink } from "@/components/chrome/Logo";
import { TLink } from "@/components/shared/Transition";
import { useUI } from "@/components/shared/UIProvider";
import { useMobileMenu } from "@/components/shared/useMobileMenu";
import { Button } from "@/components/ui";
import { business, cta, nav } from "@/content/site";
import { clsx } from "@/lib/clsx";
import { useEnquiry } from "@/lib/useEnquiry";

/* =============================================================================
   HEADER
   -----------------------------------------------------------------------------
   Edge to edge. Transparent with the gold wordmark while it sits on a
   photograph; solid cream with the dark wordmark once it is on its own ground.
   Gold is 1.27:1 on the cream and cannot be read there, so the mark switches
   the moment the ground does.

   `onPhoto` is not "am I at the top". Privacy, terms of use, contact and the
   404 have no photograph — a gold mark there would disappear into the cream.
   The hero declares itself with data-hero="dark" and the header asks the
   document once per navigation.

   The mobile panel's behaviour — Escape, focus trapping, closing on route
   change, the scroll lock — lives in useMobileMenu.
   ========================================================================== */

function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/**
 * Does this page open on a dark photograph?
 *
 * Read from the DOM rather than passed as a prop because the header lives in
 * the layout and the hero lives in the page — they are siblings, with no way to
 * talk except through the document they share.
 *
 * It starts false so the server-rendered header is the solid one: a first paint
 * with a cream wordmark on cream, corrected a frame later, is worse than a
 * solid header that turns transparent.
 */
function useOverHero(): boolean {
  const pathname = usePathname();
  const [overHero, setOverHero] = useState(false);

  useEffect(() => {
    setOverHero(Boolean(document.querySelector('[data-hero="dark"]')));
  }, [pathname]);

  return overHero;
}

/** Is this nav item the page we are on? Home only matches exactly. */
function useIsCurrent() {
  const pathname = usePathname();
  return (target: string) =>
    target === "/" ? pathname === "/" : pathname === target || pathname.startsWith(`${target}/`);
}

/* -------------------------------------------------------------------------- */

export function Header() {
  const { menuOpen, setMenuOpen } = useUI();
  const { panelRef, toggleRef } = useMobileMenu();
  const scrolled = useScrolled();
  const overHero = useOverHero();
  const isCurrent = useIsCurrent();
  const onPhoto = overHero && !scrolled;

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-sticky-header",
          "transition-[background-color,border-color] duration-500 ease-out-quint",
          onPhoto
            ? "on-photo border-b border-transparent"
            : "border-b border-line bg-canvas/92 backdrop-blur-lg",
        )}
      >
        <div className="mx-auto flex max-w-[100rem] items-center justify-between gap-6 px-5 py-4 sm:px-8 md:py-5 lg:px-12">
          <LogoLink tone={onPhoto ? "gold" : "ink"} height={42} />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {nav.map((item) => (
                <li key={item.href}>
                  <TLink
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    className={clsx(
                      "relative block py-1 text-[0.8125rem] uppercase tracking-[0.16em] transition-colors duration-300",
                      "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left",
                      "after:scale-x-0 after:bg-current after:transition-transform after:duration-400 after:ease-out-quint",
                      "hover:after:scale-x-100",
                      isCurrent(item.href) ? "after:scale-x-100" : "opacity-80 hover:opacity-100",
                    )}
                  >
                    {item.label}
                  </TLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {/* The wrapper carries the responsive display. On the Button itself,
                `hidden` would fight the button's own `inline-flex`, and which
                one wins is decided by the order Tailwind emits them. */}
            <span className="hidden sm:block">
              <Button
                href={cta.primary.href}
                tone={onPhoto ? "outline" : "primary"}
                className="px-6 py-3"
              >
                {cta.primary.label}
              </Button>
            </span>
            <MenuToggle toggleRef={toggleRef} />
          </div>
        </div>
      </header>

      <MobilePanel open={menuOpen} panelRef={panelRef} onClose={() => setMenuOpen(false)} />
    </>
  );
}

/* ------------------------------------------------------------ mobile menu */

function MenuToggle({ toggleRef }: { toggleRef: React.RefObject<HTMLButtonElement | null> }) {
  const { menuOpen, setMenuOpen } = useUI();
  return (
    <button
      ref={toggleRef}
      type="button"
      onClick={() => setMenuOpen(!menuOpen)}
      aria-expanded={menuOpen}
      aria-controls="mobile-menu"
      // 44px square: the smallest target that is comfortable on a phone.
      className="inline-flex h-11 w-11 items-center justify-center hover:opacity-70 lg:hidden"
    >
      <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
      <span aria-hidden className="relative block h-3.5 w-6">
        <span
          className={clsx(
            "absolute inset-x-0 block h-px bg-current transition-transform duration-400 ease-out-quint",
            menuOpen ? "top-1/2 rotate-45" : "top-0",
          )}
        />
        <span
          className={clsx(
            "absolute inset-x-0 block h-px bg-current transition-transform duration-400 ease-out-quint",
            menuOpen ? "top-1/2 -rotate-45" : "top-full",
          )}
        />
      </span>
    </button>
  );
}

function MobilePanel({
  open,
  panelRef,
  onClose,
}: {
  open: boolean;
  panelRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}) {
  const isCurrent = useIsCurrent();
  const enquiry = useEnquiry();

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      // Hidden from assistive tech and from Tab order when closed, so a closed
      // panel cannot be reached by keyboard while it is invisible.
      {...(!open ? { inert: true } : {})}
      aria-label="Menu"
      className={clsx(
        "fixed inset-0 z-mobile-menu flex flex-col lg:hidden",
        "on-deep bg-deep",
        "transition-[opacity,visibility] duration-400 ease-out-quint",
        open ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      <div className="flex items-center justify-between px-5 pt-4 pb-4 sm:px-8">
        <LogoImage tone="gold" height={42} />
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 w-11 items-center justify-center text-[1.5rem] leading-none"
        >
          <span className="sr-only">Close menu</span>
          <span aria-hidden>&times;</span>
        </button>
      </div>

      {/* Scrolls on its own when seven links plus four actions do not fit on a
          short phone in landscape. */}
      <nav aria-label="Main" className="flex-1 overflow-y-auto overscroll-contain px-5 pb-10 sm:px-8">
        <ul className="flex flex-col">
          {nav.map((item, i) => (
            <li key={item.href} className="border-b border-line">
              <TLink
                href={item.href}
                onClick={onClose}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className={clsx(
                  "display flex items-baseline gap-4 py-4 text-[1.625rem] transition-[opacity,transform] duration-500 ease-out-quint sm:text-[1.875rem]",
                  isCurrent(item.href) ? "text-gold" : "text-ink",
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                )}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              >
                <span className="text-[0.6875rem] tracking-[0.2em] text-muted tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.label}
              </TLink>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3">
          <Button href={cta.primary.href} onClick={onClose}>
            {cta.primary.label}
          </Button>
          <Button tone="outline" external href={enquiry("Mobile menu — Ask on WhatsApp")}>
            {cta.secondary.label}
          </Button>
          <a
            href={`mailto:${business.email}`}
            className="mt-2 text-[0.9375rem] text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            {business.email}
          </a>
          <a
            href={`tel:${business.phoneE164}`}
            className="text-[0.9375rem] text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            {business.phoneDisplay}
          </a>
        </div>
      </nav>
    </div>
  );
}
