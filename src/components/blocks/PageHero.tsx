import { Photo } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { TLink } from "@/components/shared/Transition";
import { Container } from "@/components/ui";
import { clsx } from "@/lib/clsx";
import { href, type TemplateId } from "@/lib/templates";

/* =============================================================================
   INNER-PAGE OPENING
   -----------------------------------------------------------------------------
   Half a screen, and the type sits ON the photograph rather than above it.

   The three directions keep their own composition inside that constraint:

     Amber       type at the bottom-left, warm scrim, rounded bottom corners
     Riverstone  type at the bottom-left, square, edge to edge
     Paon        type centred between hairlines

   A page with no photograph — privacy, terms of use, contact — falls through to
   a plain typographic opening on the canvas instead. Half a screen of empty
   colour would be a worse page, not a more consistent one.

   HEIGHT. `50svh` with a floor of 22rem: at 50% of a short landscape phone the
   band would be under 200px and the heading would not fit inside it.
   ========================================================================== */

export type Crumb = { label: string; path: string };

const HALF = "min-h-[max(22rem,50svh)]";

type Props = {
  tpl: TemplateId;
  kicker?: string;
  title: string;
  lede?: string;
  /** Omit for the text-only pages: privacy, terms, contact. */
  photo?: { slug: string; alt: string };
  crumbs?: Crumb[];
};

export function PageHero({ tpl, kicker, title, lede, photo, crumbs = [] }: Props) {
  if (!photo) return <TextOnlyHero {...{ tpl, kicker, title, lede, crumbs }} />;

  const centred = tpl === "t3";

  return (
    <section data-hero="dark" className={clsx("relative isolate w-full overflow-hidden", HALF)}>
      <Photo
        slug={photo.slug}
        priority
        fill
        sizes="100vw"
        className="-z-10"
        imgClassName="object-[center_42%]"
        alt={photo.alt}
      />
      <div
        aria-hidden
        className={clsx(
          "absolute inset-0 -z-10",
          tpl === "t1" &&
            "bg-[linear-gradient(to_top,rgba(22,19,12,0.85)_0%,rgba(22,19,12,0.42)_58%,rgba(22,19,12,0.3)_100%)]",
          tpl === "t2" &&
            "bg-[linear-gradient(to_top,rgba(20,24,18,0.82)_0%,rgba(20,24,18,0.36)_60%,rgba(20,24,18,0.3)_100%)]",
          tpl === "t3" &&
            "bg-[linear-gradient(to_bottom,rgba(14,14,14,0.68)_0%,rgba(14,14,14,0.36)_45%,rgba(14,14,14,0.7)_100%)]",
        )}
      />

      <div
        className={clsx(
          "on-photo relative flex",
          HALF,
          centred ? "items-center justify-center" : "flex-col justify-end",
        )}
      >
        <Container
          width={tpl === "t2" ? "wide" : "default"}
          className={clsx(
            "pt-[calc(var(--switcher-h)+7rem)] pb-12 md:pb-16",
            centred && "text-center",
          )}
        >
          <Breadcrumbs tpl={tpl} crumbs={crumbs} className={centred ? "justify-center" : undefined} />

          <Reveal className={clsx("mt-6", centred && "border-t border-white/35 pt-8")}>
            {kicker &&
              (tpl === "t1" ? (
                <div className="flex items-center gap-3">
                  <span aria-hidden className="h-px w-8 bg-gold" />
                  <p className="kicker">{kicker}</p>
                </div>
              ) : (
                <p className="kicker">{kicker}</p>
              ))}

            <h1
              className={clsx(
                "display mt-4",
                tpl === "t2"
                  ? "max-w-4xl text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.98]"
                  : "measure-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.06]",
                centred && "mx-auto",
              )}
            >
              {title}
            </h1>

            {lede && (
              <p
                className={clsx(
                  "measure-prose mt-5 text-[1.0625rem] leading-[1.7] opacity-90",
                  centred && "mx-auto",
                )}
              >
                {lede}
              </p>
            )}
          </Reveal>
        </Container>
      </div>
    </section>
  );
}

/* ------------------------------------------------- pages with no photograph */

function TextOnlyHero({
  tpl,
  kicker,
  title,
  lede,
  crumbs = [],
}: Omit<Props, "photo">) {
  const centred = tpl === "t3";
  return (
    <section className="bg-canvas pt-[calc(var(--switcher-h)+6.5rem)] pb-4 md:pt-[calc(var(--switcher-h)+8rem)]">
      <Container className={clsx(centred && "text-center")}>
        <Breadcrumbs tpl={tpl} crumbs={crumbs} className={centred ? "justify-center" : undefined} />
        <Reveal className={clsx("mt-6", centred && "border-y border-line py-10")}>
          {kicker &&
            (tpl === "t1" ? (
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-px w-8 bg-gold" />
                <p className="kicker text-accent">{kicker}</p>
              </div>
            ) : (
              <p className="kicker text-accent">{kicker}</p>
            ))}
          <h1
            className={clsx(
              "display measure-display mt-4 text-[clamp(2rem,5vw,3.5rem)] leading-[1.06]",
              centred && "mx-auto",
            )}
          >
            {title}
          </h1>
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
        </Reveal>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Breadcrumbs({
  tpl,
  crumbs,
  className,
}: {
  tpl: TemplateId;
  crumbs: Crumb[];
  className?: string;
}) {
  if (crumbs.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={clsx(
          "flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem] uppercase tracking-[0.14em]",
          className,
        )}
      >
        <li>
          <TLink
            href={href(tpl)}
            className="text-current underline-offset-4 opacity-70 transition-opacity hover:underline hover:opacity-100"
          >
            Home
          </TLink>
        </li>
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-2">
              <span aria-hidden className="opacity-40">
                /
              </span>
              {last ? (
                <span aria-current="page">{crumb.label}</span>
              ) : (
                <TLink
                  href={href(tpl, crumb.path)}
                  className="text-current underline-offset-4 opacity-70 transition-opacity hover:underline hover:opacity-100"
                >
                  {crumb.label}
                </TLink>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
