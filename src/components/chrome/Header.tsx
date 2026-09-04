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
import { href, type TemplateId } from "@/lib/templates";
import { useEnquiry } from "@/lib/useEnquiry";

/* =============================================================================
   THE THREE HEADERS
   -----------------------------------------------------------------------------
   Same seven links, same book button, same mobile panel behaviour — and three
   different structures, because the header is the first thing that tells you
   which of the three sites you are on:

     Amber       a floating pill: dark glass over the photograph, warm and
                 light once you scroll past it
     Riverstone  edge to edge and transparent over the photograph, solid after
     Paon        two rows, wordmark centred above a hairline-ruled nav bar

   All three now START OVER A PHOTOGRAPH, because every hero is a photograph,
   which is what lets the gold wordmark be the one you see on arrival. Gold is
   1.44:1 on cream and cannot be read there, so the moment the header lands on
   its own light ground the mark switches to the near-black cut.

   `overHero` is not "am I at the top". Privacy, terms of use and contact have
   no photograph — a gold mark there would sit on cream and disappear. The hero
   declares itself with data-hero="dark" and the header asks the document once
   per navigation.

   The shared parts are behaviour, not appearance: useMobileMenu owns Escape,
   focus trapping, route-change closing and the scroll lock, so a bug fixed in
   one header is fixed in all three.
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
 * talk except through the document they share. One query per navigation.
 *
 * It starts false so the server-rendered header is the solid one: a first paint
 * showing a cream wordmark on cream, corrected a frame later, is worse than a
 * dark one that turns transparent.
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
function useIsCurrent(tpl: TemplateId) {
  const pathname = usePathname();
  return (item: string) => {
    const target = href(tpl, item);
    if (item === "") return pathname === target;
    return pathname === target || pathname.startsWith(`${target}/`);
  };
}

/* -------------------------------------------------------------------------- */

export function Header({ tpl }: { tpl: TemplateId }) {
  const { menuOpen, setMenuOpen } = useUI();
  const { panelRef, toggleRef } = useMobileMenu();
  const scrolled = useScrolled();
  const overHero = useOverHero();
  const isCurrent = useIsCurrent(tpl);

  // True while the header is sitting on the photograph: gold mark, light text,
  // no background of its own.
  const onPhoto = overHero && !scrolled;
  const parts = { onPhoto, scrolled, isCurrent, toggleRef };

  return (
    <>
      {tpl === "t1" && <AmberHeader {...parts} />}
      {tpl === "t2" && <RiverstoneHeader {...parts} />}
      {tpl === "t3" && <PaonHeader {...parts} />}

      <MobilePanel tpl={tpl} open={menuOpen} panelRef={panelRef} onClose={() => setMenuOpen(false)} />
    </>
  );
}

type HeaderPartProps = {
  onPhoto: boolean;
  scrolled: boolean;
  isCurrent: (item: string) => boolean;
  toggleRef: React.RefObject<HTMLButtonElement | null>;
};

/* ------------------------------------------------------- 1 — AMBER (pill) */

function AmberHeader({ onPhoto, scrolled, isCurrent, toggleRef }: HeaderPartProps) {
  return (
    <header
      className={clsx(
        "fixed inset-x-0 z-sticky-header px-4 transition-[top] duration-500 ease-out-quint sm:px-6",
        scrolled ? "top-[calc(var(--switcher-h)+0.75rem)]" : "top-[calc(var(--switcher-h)+1.25rem)]",
        onPhoto && "on-photo",
      )}
    >
      <div
        className={clsx(
          "mx-auto flex max-w-6xl items-center justify-between gap-4 r-pill px-4 py-2.5 sm:px-5",
          "transition-[background-color,box-shadow,border-color] duration-500 ease-out-quint",
          "border backdrop-blur-xl",
          onPhoto
            ? "border-white/15 bg-black/25"
            : "border-transparent bg-surface/88 shadow-[0_10px_40px_-20px_rgba(22,19,12,0.45)]",
        )}
      >
        <LogoLink tpl="t1" tone={onPhoto ? "gold" : "ink"} height={42} />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <TLink
                  href={href("t1", item.href)}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className={clsx(
                    "block r-pill px-4 py-2 text-[0.9375rem] transition-colors duration-300",
                    isCurrent(item.href)
                      ? onPhoto
                        ? "bg-white/15 text-ink"
                        : "bg-raised text-ink"
                      : onPhoto
                        ? "text-muted hover:bg-white/10 hover:text-ink"
                        : "text-muted hover:bg-raised/60 hover:text-ink",
                  )}
                >
                  {item.label}
                </TLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <Button tpl="t1" href={href("t1", cta.primary.href)} className="px-5 py-2.5">
              {cta.primary.label}
            </Button>
          </span>
          <MenuToggle tpl="t1" toggleRef={toggleRef} />
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------- 2 — RIVERSTONE (over the hero) */

function RiverstoneHeader({ onPhoto, isCurrent, toggleRef }: HeaderPartProps) {
  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-(--switcher-h) z-sticky-header",
        "transition-[background-color,border-color] duration-500 ease-out-quint",
        onPhoto
          ? "on-photo border-b border-transparent"
          : "border-b border-line bg-canvas/92 backdrop-blur-lg",
      )}
    >
      <div className="mx-auto flex max-w-[100rem] items-center justify-between gap-6 px-5 py-4 sm:px-8 md:py-5 lg:px-12">
        <LogoLink tpl="t2" tone={onPhoto ? "gold" : "ink"} height={42} />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <TLink
                  href={href("t2", item.href)}
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
          <span className="hidden sm:block">
            <Button
              tpl="t2"
              href={href("t2", cta.primary.href)}
              tone={onPhoto ? "outline" : "primary"}
              className="px-6 py-3"
            >
              {cta.primary.label}
            </Button>
          </span>
          <MenuToggle tpl="t2" toggleRef={toggleRef} />
        </div>
      </div>
    </header>
  );
}

/* --------------------------------------------------- 3 — PAON (two rows) */

function PaonHeader({ onPhoto, scrolled, isCurrent, toggleRef }: HeaderPartProps) {
  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-(--switcher-h) z-sticky-header",
        "transition-[background-color,border-color,box-shadow] duration-500 ease-out-quint",
        onPhoto
          ? "on-photo border-b border-white/20"
          : clsx(
              "border-b border-line bg-canvas",
              scrolled && "shadow-[0_12px_30px_-24px_rgba(0,0,0,0.35)]",
            ),
      )}
    >
      {/* Row 1 — the wordmark, centred, with the reservations line beside it. */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <a
          href={`tel:${business.phoneE164}`}
          className="hidden text-[0.75rem] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink lg:block lg:w-56"
        >
          {business.phoneDisplay}
        </a>

        <LogoLink
          tpl="t3"
          tone={onPhoto ? "gold" : "ink"}
          height={scrolled ? 40 : 50}
          className="mx-auto lg:mx-0"
        />

        <div className="flex w-auto items-center justify-end gap-3 lg:w-56">
          <span className="hidden sm:block">
            <Button tpl="t3" href={href("t3", cta.primary.href)} className="px-5 py-3">
              {cta.primary.label}
            </Button>
          </span>
          <MenuToggle tpl="t3" toggleRef={toggleRef} />
        </div>
      </div>

      {/* Row 2 — the nav, on its own hairline-ruled band. */}
      <nav
        aria-label="Main"
        className={clsx("hidden border-t lg:block", onPhoto ? "border-white/20" : "border-line")}
      >
        <ul className="mx-auto flex max-w-6xl items-center justify-center gap-10 px-8">
          {nav.map((item) => (
            <li key={item.href}>
              <TLink
                href={href("t3", item.href)}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className={clsx(
                  "block border-b-2 py-3.5 text-[0.75rem] uppercase tracking-[0.2em] transition-colors duration-300",
                  isCurrent(item.href)
                    ? "border-gold text-ink"
                    : "border-transparent text-muted hover:border-current hover:text-ink",
                )}
              >
                {item.label}
              </TLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

/* ------------------------------------------------------------ mobile menu */

function MenuToggle({
  tpl,
  toggleRef,
}: {
  tpl: TemplateId;
  toggleRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const { menuOpen, setMenuOpen } = useUI();
  return (
    <button
      ref={toggleRef}
      type="button"
      onClick={() => setMenuOpen(!menuOpen)}
      aria-expanded={menuOpen}
      aria-controls="mobile-menu"
      className={clsx(
        // 44px square: the smallest target that is comfortable on a phone, and
        // the reason this is not sized to the icon inside it.
        "inline-flex h-11 w-11 items-center justify-center lg:hidden",
        tpl === "t1" && "r-pill hover:bg-white/10",
        tpl !== "t1" && "hover:opacity-70",
      )}
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
  tpl,
  open,
  panelRef,
  onClose,
}: {
  tpl: TemplateId;
  open: boolean;
  panelRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}) {
  const isCurrent = useIsCurrent(tpl);
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
      <div className="flex items-center justify-between px-5 pt-[calc(var(--switcher-h)+1rem)] pb-4 sm:px-8">
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
                href={href(tpl, item.href)}
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
          <Button tpl={tpl} href={href(tpl, cta.primary.href)} onClick={onClose}>
            {cta.primary.label}
          </Button>
          <Button tpl={tpl} tone="outline" external href={enquiry("Mobile menu — Ask on WhatsApp")}>
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
