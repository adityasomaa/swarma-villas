import { Photo } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { TLink } from "@/components/shared/Transition";
import { Container } from "@/components/ui";
import { clsx } from "@/lib/clsx";
import { href, type TemplateId } from "@/lib/templates";

/* =============================================================================
   INNER-PAGE OPENING
   -----------------------------------------------------------------------------
   Every page that is not the home page starts here, so the three directions
   stay recognisably themselves below the fold as well as on the front page:

     Amber       type on cream, a wide rounded photograph under it
     Riverstone  the title set over a short full-bleed photograph
     Paon        a centred title between hairlines, photograph below

   The breadcrumb is real navigation, not decoration — every inner page is at
   least two clicks deep and this is how you get back up one level.
   ========================================================================== */

export type Crumb = { label: string; path: string };

export function PageHero({
  tpl,
  kicker,
  title,
  lede,
  photo,
  crumbs = [],
}: {
  tpl: TemplateId;
  kicker?: string;
  title: string;
  lede?: string;
  /** Omit for the text-only pages: privacy, terms. */
  photo?: { slug: string; alt: string };
  crumbs?: Crumb[];
}) {
  /* ------------------------------------------------------- 2 — RIVERSTONE */
  if (tpl === "t2" && photo) {
    return (
      <section className="relative isolate">
        <Photo
          slug={photo.slug}
          priority
          ratio={21 / 9}
          sizes="100vw"
          className="absolute inset-0 -z-10 h-full w-full"
          alt={photo.alt}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(20,24,18,0.8),rgba(20,24,18,0.3))]"
        />
        <div className="on-photo">
          <Container
            width="wide"
            className="flex min-h-[26rem] flex-col justify-end pt-[calc(var(--switcher-h)+8rem)] pb-12 md:min-h-[32rem] md:pb-16"
          >
            <Breadcrumbs tpl={tpl} crumbs={crumbs} />
            <Reveal>
              {kicker && <p className="kicker mt-6">{kicker}</p>}
              <h1 className="display mt-4 max-w-4xl text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.98]">
                {title}
              </h1>
              {lede && (
                <p className="measure-prose mt-5 text-[1.0625rem] leading-[1.7] opacity-90">
                  {lede}
                </p>
              )}
            </Reveal>
          </Container>
        </div>
      </section>
    );
  }

  /* ------------------------------------------------------------- 3 — PAON */
  if (tpl === "t3") {
    return (
      <section className="bg-canvas">
        <Container className="pt-8 pb-10 text-center md:pb-12">
          <Breadcrumbs tpl={tpl} crumbs={crumbs} className="justify-center" />
          <Reveal className="mt-8 border-y border-line py-10">
            {kicker && <p className="kicker text-accent">{kicker}</p>}
            <h1 className="display measure-display mx-auto mt-4 text-[clamp(2rem,4.6vw,3.25rem)] leading-[1.12]">
              {title}
            </h1>
            {lede && (
              <p className="measure-prose mx-auto mt-5 text-[1.0625rem] leading-[1.75] text-muted">
                {lede}
              </p>
            )}
          </Reveal>
        </Container>
        {photo && (
          <Reveal>
            <Container width="wide">
              <Photo slug={photo.slug} priority ratio={21 / 9} sizes="100vw" alt={photo.alt} />
            </Container>
          </Reveal>
        )}
      </section>
    );
  }

  /* ------------------------------------------------------------ 1 — AMBER */
  return (
    <section className="bg-canvas pt-[calc(var(--switcher-h)+7rem)] md:pt-[calc(var(--switcher-h)+8.5rem)]">
      <Container>
        <Breadcrumbs tpl={tpl} crumbs={crumbs} />
        <Reveal className="mt-6">
          {kicker && (
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-gold" />
              <p className="kicker text-accent">{kicker}</p>
            </div>
          )}
          <h1 className="display measure-display mt-5 text-[clamp(2.25rem,5.2vw,3.75rem)] leading-[1.05]">
            {title}
          </h1>
          {lede && (
            <p className="measure-prose mt-5 text-[1.125rem] leading-[1.7] text-muted">{lede}</p>
          )}
        </Reveal>
      </Container>
      {photo && (
        <Reveal delay={120} className="mt-12">
          <Container>
            <Photo
              slug={photo.slug}
              priority
              ratio={21 / 9}
              rounded="md"
              sizes="100vw"
              alt={photo.alt}
            />
          </Container>
        </Reveal>
      )}
    </section>
  );
}

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
                <span aria-current="page" className="opacity-100">
                  {crumb.label}
                </span>
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
