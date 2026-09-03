import type { ElementType, ReactNode } from "react";

import { TLink } from "@/components/shared/Transition";
import { clsx } from "@/lib/clsx";
import type { TemplateId } from "@/lib/templates";

/* =============================================================================
   TEMPLATE-AWARE PRIMITIVES
   -----------------------------------------------------------------------------
   Three designs share this file, and every component in it branches on the
   template id rather than taking a pile of style props. That is deliberate:
   the differences between the directions are decisions, and decisions belong in
   one readable place, not scattered across sixty call sites as class strings.

   Colour never appears here as a hex value. Everything goes through the palette
   tokens, which are redefined per `[data-tpl]` in globals.css — so the same
   `bg-surface text-ink` renders warm cream in Amber, pale stone in Riverstone
   and plain white in Paon.
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

/**
 * Vertical rhythm. Amber breathes the most, Paon is the tightest — which is
 * the difference between a resort site and a hotel site more than any colour is.
 */
export function Section({
  tpl,
  children,
  className,
  id,
  tone = "canvas",
  size = "default",
}: {
  tpl: TemplateId;
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "canvas" | "surface" | "raised" | "deep";
  size?: "default" | "tight" | "loose";
}) {
  const pad = {
    t1: { tight: "py-16 md:py-20", default: "py-20 md:py-28 lg:py-32", loose: "py-24 md:py-36 lg:py-44" },
    t2: { tight: "py-14 md:py-20", default: "py-20 md:py-28", loose: "py-24 md:py-36" },
    t3: { tight: "py-12 md:py-16", default: "py-16 md:py-24", loose: "py-20 md:py-28" },
  }[tpl][size];

  return (
    <section
      id={id}
      className={clsx(
        pad,
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

/**
 * The section header is where the three directions separate most visibly on
 * every page that is not the home page, so each gets its own composition rather
 * than a shared block with a different alignment prop.
 */
export function SectionHeader({
  tpl,
  kicker,
  title,
  lede,
  as: Tag = "h2",
  align,
  className,
}: {
  tpl: TemplateId;
  kicker?: string;
  title: ReactNode;
  lede?: ReactNode;
  as?: ElementType;
  align?: "start" | "center";
  className?: string;
}) {
  const centred = align ? align === "center" : tpl !== "t1";

  if (tpl === "t3") {
    // Paon: hairline above, small caps kicker, restrained serif. Hotel-formal.
    return (
      <header
        className={clsx(
          "border-t border-line pt-8",
          centred ? "mx-auto max-w-3xl text-center" : "max-w-3xl",
          className,
        )}
      >
        {kicker && <Kicker className="mb-4">{kicker}</Kicker>}
        <Tag className="display measure-head text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.18]">
          {title}
        </Tag>
        {lede && (
          <p
            className={clsx(
              "measure-prose mt-5 text-[1.0625rem] leading-[1.75] text-muted",
              centred && "mx-auto",
            )}
          >
            {lede}
          </p>
        )}
      </header>
    );
  }

  if (tpl === "t2") {
    // Riverstone: the type is the whole idea. Very large, very light, centred.
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

  // Amber: left-aligned, a short gold rule doing the work a kicker underline does.
  return (
    <header className={clsx(centred ? "mx-auto max-w-3xl text-center" : "max-w-3xl", className)}>
      {kicker && (
        <div className={clsx("flex items-center gap-3", centred && "justify-center")}>
          <span aria-hidden className="h-px w-8 bg-gold" />
          <Kicker>{kicker}</Kicker>
        </div>
      )}
      <Tag className="display measure-head mt-5 text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.1]">
        {title}
      </Tag>
      {lede && (
        <p
          className={clsx(
            "measure-prose mt-5 text-[1.0625rem] leading-[1.75] text-muted",
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

function buttonClasses(tpl: TemplateId, tone: ButtonTone): string {
  const shape = {
    t1: "r-pill px-7 py-3.5 text-[0.9375rem]",
    t2: "px-8 py-4 text-[0.8125rem] uppercase tracking-[0.16em]",
    t3: "px-7 py-3.5 text-[0.75rem] uppercase tracking-[0.2em]",
  }[tpl];

  const skin = {
    primary: "bg-gold text-ongold hover:brightness-[1.06] active:brightness-[0.97]",
    outline: "border border-current text-ink hover:bg-ink hover:text-canvas",
    quiet: "text-accent underline-offset-4 hover:underline",
  }[tone];

  return clsx(
    "inline-flex items-center justify-center gap-2 font-medium",
    "transition-[background-color,color,filter,border-color] duration-300 ease-out",
    "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent",
    tone !== "quiet" && shape,
    tone === "quiet" && "text-[0.9375rem]",
    skin,
  );
}

export function Button({
  tpl,
  href,
  children,
  tone = "primary",
  className,
  external,
  ...rest
}: {
  tpl: TemplateId;
  href: string;
  children: ReactNode;
  tone?: ButtonTone;
  className?: string;
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children" | "className">) {
  const cls = clsx(buttonClasses(tpl, tone), className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <TLink href={href} className={cls} {...rest}>
      {children}
    </TLink>
  );
}

/** The same skin, on a real <button> — used by the form and the cookie banner. */
export function buttonStyle(tpl: TemplateId, tone: ButtonTone = "primary"): string {
  return buttonClasses(tpl, tone);
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
export function Spec({
  tpl,
  label,
  value,
}: {
  tpl: TemplateId;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className={clsx(tpl === "t3" ? "border-t border-line pt-3" : "")}>
      <dt className="kicker text-subtle">{label}</dt>
      <dd className={clsx("mt-1.5 text-ink", tpl === "t2" ? "display text-[1.25rem]" : "text-[1rem]")}>
        {value}
      </dd>
    </div>
  );
}

/** A hairline. Paon leans on these; Amber barely uses them. */
export function Rule({ className }: { className?: string }) {
  return <hr className={clsx("border-0 border-t border-line", className)} />;
}
