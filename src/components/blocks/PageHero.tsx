import { Photo } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { TLink } from "@/components/shared/Transition";
import { Container } from "@/components/ui";
import { clsx } from "@/lib/clsx";

/* =============================================================================
   INNER-PAGE OPENING
   -----------------------------------------------------------------------------
   Half a screen, with the type across the bottom-left of the photograph.

   A page with no photograph — privacy, terms of use, contact, the 404 — falls
   through to a plain typographic opening on the canvas instead. Half a screen
   of empty colour would be a worse page, not a more consistent one, and those
   pages get a solid header because nothing dark sits behind it.

   HEIGHT. `50svh` with a floor of 22rem: at 50% of a short landscape phone the
   band would be under 200px and the heading would not fit inside it.
   ========================================================================== */

export type Crumb = { label: string; path: string };

const HALF = "min-h-[max(22rem,50svh)]";

type Props = {
  kicker?: string;
  title: string;
  lede?: string;
  /** Omit for the text-only pages. */
  photo?: { slug: string; alt: string };
  crumbs?: Crumb[];
};

export function PageHero({ kicker, title, lede, photo, crumbs = [] }: Props) {
  if (!photo) return <TextOnlyHero {...{ kicker, title, lede, crumbs }} />;

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
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(24,30,10,0.82)_0%,rgba(24,30,10,0.36)_60%,rgba(24,30,10,0.3)_100%)]"
      />

      <div className={clsx("on-photo relative flex flex-col justify-end", HALF)}>
        <Container width="wide" className="pt-32 pb-12 md:pb-16">
          <Breadcrumbs crumbs={crumbs} />
          <Reveal className="mt-6">
            {kicker && <p className="kicker">{kicker}</p>}
            <h1 className="display mt-4 max-w-4xl text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.98]">
              {title}
            </h1>
            {lede && (
              <p className="measure-prose mt-5 text-[1.0625rem] leading-[1.7] opacity-90">{lede}</p>
            )}
          </Reveal>
        </Container>
      </div>
    </section>
  );
}

/* ------------------------------------------------- pages with no photograph */

function TextOnlyHero({ kicker, title, lede, crumbs = [] }: Omit<Props, "photo">) {
  return (
    <section className="bg-canvas pt-36 pb-4 md:pt-44">
      <Container>
        <Breadcrumbs crumbs={crumbs} />
        <Reveal className="mt-6">
          {kicker && <p className="kicker text-accent">{kicker}</p>}
          <h1 className="display measure-display mt-4 text-[clamp(2.25rem,5.4vw,4rem)] leading-[1]">
            {title}
          </h1>
          {lede && (
            <p className="measure-prose mt-5 text-[1.0625rem] leading-[1.75] text-muted">{lede}</p>
          )}
        </Reveal>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  if (crumbs.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem] uppercase tracking-[0.14em]">
        <li>
          <TLink
            href="/"
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
                  href={crumb.path}
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
