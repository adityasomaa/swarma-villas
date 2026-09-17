import type { ElementType, ReactNode } from "react";

import { TLink } from "@/components/shared/Transition";
import { clsx } from "@/lib/clsx";

/* =============================================================================
   PRIMITIVES
   -----------------------------------------------------------------------------
   The handful of building blocks every page is made from. Colour never appears
   here as a hex value — everything goes through the palette tokens in
   globals.css, which `.on-deep` and `.on-photo` redefine for their subtrees, so
   the same `text-ink` is deep sage on cream and white on a photograph.
   ========================================================================== */

/* ------------------------------------------------------------------ layout */

export function Container({
  children,
  className,
  width = "default",
}: {
  children: ReactNode;
  className?: string;
  width?: "default" | "wide" | "narrow";
}) {
  return (
    <div
      className={clsx(
        "mx-auto w-full px-5 sm:px-8",
        width === "narrow" && "max-w-3xl",
        width === "default" && "max-w-6xl",
        width === "wide" && "max-w-[100rem] lg:px-12",
        className,
      )}
    >
      {children}
    </div>
  );
}

const PAD = {
  tight: "py-14 md:py-20",
  default: "py-20 md:py-28",
  loose: "py-24 md:py-36",
} as const;

export function Section({
  children,
  className,
  id,
  tone = "canvas",
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "canvas" | "surface" | "raised" | "deep";
  size?: keyof typeof PAD;
}) {
  return (
    <section
      id={id}
      className={clsx(
        PAD[size],
        tone === "canvas" && "bg-canvas",
        tone === "surface" && "bg-surface",
        tone === "raised" && "bg-raised",
        tone === "deep" && "on-deep bg-deep",
        className,
      )}
    >
      {children}
    </section>
  );
}

/* ---------------------------------------------------------------- headings */

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={clsx("kicker text-accent", className)}>{children}</p>;
}

/** The type is the whole idea: very large, very light, centred unless asked. */
export function SectionHeader({
  kicker,
  title,
  lede,
  as: Tag = "h2",
  align = "center",
  className,
}: {
  kicker?: string;
  title: ReactNode;
  lede?: ReactNode;
  as?: ElementType;
  align?: "start" | "center";
  className?: string;
}) {
  const centred = align === "center";
  return (
    <header className={clsx(centred ? "mx-auto max-w-4xl text-center" : "max-w-4xl", className)}>
      {kicker && <Kicker className="mb-5">{kicker}</Kicker>}
      <Tag className="display measure-head text-[clamp(2.125rem,5.2vw,3.75rem)] leading-[1.06]">
        {title}
      </Tag>
      {lede && (
        <p
          className={clsx(
            "measure-prose mt-6 text-[1.0625rem] leading-[1.75] text-muted",
            centred && "mx-auto",
          )}
        >
          {lede}
        </p>
      )}
    </header>
  );
}

/* ----------------------------------------------------------------- buttons */

type ButtonTone = "primary" | "outline" | "quiet";

/* =============================================================================
   THE BUTTON
   -----------------------------------------------------------------------------
   Hover is not a background swap. Two things move together — a fill that
   sweeps in from the left, and a label that rolls up and out while an identical
   copy rolls in — both owned by `.btn` in globals.css.

   THE LABEL IS RENDERED TWICE. The copy carries aria-hidden, so a screen
   reader announces the name once.

   `--btn-wipe` is what the fill is made of, and it changes with the tone: a
   primary button is already gold and wipes to deep sage, an outline button is
   transparent and wipes to ink. Hovering always crosses a real boundary rather
   than nudging a brightness.
   ========================================================================== */

function buttonClasses(tone: ButtonTone): string {
  const skin = {
    // Gold ground, sage label; the wipe brings the sage in and the label flips
    // to gold to stay readable on it.
    primary: "btn bg-gold text-ongold [--btn-wipe:var(--c-deep)] hover:text-gold focus-visible:text-gold",
    // Transparent with a hairline; the wipe brings ink in under a canvas label.
    outline:
      "btn border border-current text-ink [--btn-wipe:var(--c-ink)] hover:text-canvas focus-visible:text-canvas",
    quiet: "text-accent underline-offset-4 hover:underline",
  }[tone];

  return clsx(
    "inline-flex items-center justify-center gap-2 font-medium",
    // Colour only. The wipe and the roll are transforms and are owned by CSS,
    // so nothing here can fight them.
    "transition-[color,border-color] duration-300 ease-out",
    "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent",
    tone === "quiet"
      ? "text-[0.9375rem]"
      : "px-8 py-4 text-[0.8125rem] uppercase tracking-[0.16em]",
    skin,
  );
}

/** The label and the copy that replaces it. */
function Roll({ children, tone }: { children: ReactNode; tone: ButtonTone }) {
  if (tone === "quiet") return <>{children}</>;
  return (
    <span className="btn__roll">
      <span className="btn__label">{children}</span>
      <span aria-hidden className="btn__label btn__label--clone">
        {children}
      </span>
    </span>
  );
}

export function Button({
  href,
  children,
  tone = "primary",
  className,
  external,
  ...rest
}: {
  href: string;
  children: ReactNode;
  tone?: ButtonTone;
  className?: string;
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children" | "className">) {
  const cls = clsx(buttonClasses(tone), className);
  const label = <Roll tone={tone}>{children}</Roll>;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {label}
      </a>
    );
  }
  return (
    <TLink href={href} className={cls} {...rest}>
      {label}
    </TLink>
  );
}

/**
 * The same skin for an element that is not a link. Wrap the label in
 * <ButtonLabel> to get the roll as well; the wipe comes with the class.
 */
export function buttonStyle(tone: ButtonTone = "primary"): string {
  return buttonClasses(tone);
}

export function ButtonLabel({ children }: { children: ReactNode }) {
  return <Roll tone="primary">{children}</Roll>;
}

/* -------------------------------------------------------------------- text */

/** Long-form paragraphs. Never rendered from HTML — these are plain strings. */
export function Prose({
  paragraphs,
  className,
  size = "default",
}: {
  paragraphs: readonly string[];
  className?: string;
  size?: "default" | "lead";
}) {
  return (
    <div
      className={clsx(
        "measure-prose space-y-5",
        size === "lead" ? "text-[1.125rem] leading-[1.7]" : "text-[1.0625rem] leading-[1.75]",
        "text-muted",
        className,
      )}
    >
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

/** A labelled fact. Used for rates, sizes, opening hours. */
export function Spec({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="kicker text-subtle">{label}</dt>
      <dd className="display mt-1.5 text-[1.25rem] text-ink">{value}</dd>
    </div>
  );
}
