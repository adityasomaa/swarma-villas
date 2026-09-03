import { Photo } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { Button, Container } from "@/components/ui";
import { business, copy, cta, houses } from "@/content/site";
import { formatIDR } from "@/lib/format";
import { href, type TemplateId } from "@/lib/templates";

/* =============================================================================
   THREE OPENINGS
   -----------------------------------------------------------------------------
   The hero is the single largest difference between the directions, so none of
   it is shared. Same words, same photograph pool, same two buttons — three
   arrangements taken from three references:

     Amber       split. Type on the left, a tall photograph bleeding off the
                 right edge, a glass rate card overlapping it. (Vantara)
     Riverstone  one photograph, full height, the name set over its bottom-left
                 corner and nothing else on it. (Villa Asteria)
     Paon        a centred title block on white above a wide photograph, framed
                 by hairlines. (Villa L)

   Every heading here is the page h1. The `priority` flag on the leading
   photograph makes it the LCP candidate and stops it queueing behind the rest.
   ========================================================================== */

const cheapest = Math.min(...houses.map((h) => h.priceFromIDR));

export function Hero({ tpl }: { tpl: TemplateId }) {
  if (tpl === "t1") return <AmberHero />;
  if (tpl === "t2") return <RiverstoneHero />;
  return <PaonHero />;
}

/* ------------------------------------------------------------- 1 — AMBER */

function AmberHero() {
  return (
    <section className="relative overflow-hidden bg-canvas pt-[calc(var(--switcher-h)+7rem)] pb-16 md:pt-[calc(var(--switcher-h)+9rem)] md:pb-24">
      <div className="gutter-start grid items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:pr-0">
        <div className="lg:max-w-[34rem]">
          <Reveal>
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-gold" />
              <p className="kicker text-accent">{copy.home.kicker}</p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="display mt-6 text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.03]">
              {copy.home.h1}
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="measure-prose mt-6 text-[1.125rem] leading-[1.7] text-muted">
              {copy.home.lede}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button tpl="t1" href={href("t1", cta.primary.href)}>
                {cta.primary.label}
              </Button>
              <Button tpl="t1" href={href("t1", "/houses")} tone="outline">
                See the three houses
              </Button>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-7">
              <div>
                <dt className="kicker text-subtle">Houses</dt>
                <dd className="display mt-1.5 text-[1.75rem]">{houses.length}</dd>
              </div>
              <div>
                <dt className="kicker text-subtle">From</dt>
                <dd className="display mt-1.5 text-[1.75rem]">{formatIDR(cheapest)}</dd>
              </div>
              <div>
                <dt className="kicker text-subtle">Ubud</dt>
                <dd className="display mt-1.5 text-[1.75rem]">Singakerta</dd>
              </div>
            </dl>
          </Reveal>
        </div>

        {/* The photograph runs off the right edge on wide screens, which is the
            move the reference makes and the reason this column is unpadded. */}
        <Reveal delay={120} x={24} y={0} className="relative">
          <Photo
            slug="property-03"
            priority
            ratio={4 / 5}
            rounded="md"
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="lg:rounded-r-none"
            alt="A teakwood gladak house raised above the garden at Swarma Villas"
          />

          <div className="absolute bottom-5 left-5 right-5 r-sm bg-surface/85 p-5 backdrop-blur-xl sm:left-6 sm:right-auto sm:max-w-xs sm:p-6">
            <p className="kicker text-subtle">Rates start from</p>
            <p className="display mt-2 text-[1.875rem] leading-none">
              {formatIDR(cheapest)}
              <span className="ml-2 align-middle text-[0.8125rem] tracking-normal text-muted">
                per night
              </span>
            </p>
            <p className="mt-3 text-[0.875rem] leading-relaxed text-muted">
              Published rate for the Wooden Gladak House. Book direct on WhatsApp — no
              agency fee.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- 2 — RIVERSTONE */

function RiverstoneHero() {
  return (
    <section className="relative min-h-[calc(100svh-var(--switcher-h))] w-full">
      <div className="absolute inset-0">
        <Photo
          slug="pool-02"
          priority
          sizes="100vw"
          className="h-full w-full"
          imgClassName="object-center"
          alt="The pool at Swarma Villas, surrounded by jungle planting"
        />
        {/*
          A scrim, not a filter. The name and the transparent header both sit on
          this photograph, and without it the contrast depends on which part of
          a jungle happens to be light that day.
        */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,24,18,0.78)_0%,rgba(20,24,18,0.32)_42%,rgba(20,24,18,0.28)_100%)]"
        />
      </div>

      <div className="on-photo relative flex min-h-[calc(100svh-var(--switcher-h))] flex-col justify-end">
        <Container width="wide" className="pb-16 md:pb-24">
          <Reveal>
            <p className="kicker">{copy.home.kicker}</p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="display mt-5 max-w-5xl text-[clamp(2.75rem,8.5vw,6.5rem)] leading-[0.94]">
              {copy.home.h1}
            </h1>
          </Reveal>
          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Reveal delay={200}>
              <p className="max-w-md text-[1.0625rem] leading-[1.7] opacity-90">
                {copy.home.lede}
              </p>
            </Reveal>
            <Reveal delay={280}>
              <div className="flex flex-wrap gap-3">
                <Button tpl="t2" href={href("t2", cta.primary.href)}>
                  {cta.primary.label}
                </Button>
                <Button tpl="t2" href={href("t2", "/houses")} tone="outline">
                  The houses
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- 3 — PAON */

function PaonHero() {
  return (
    <section className="bg-canvas">
      <Container className="pt-14 pb-10 text-center md:pt-20 md:pb-12">
        <Reveal>
          <p className="kicker text-accent">{business.positioning}</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="display measure-display mx-auto mt-6 text-[clamp(2.25rem,5.4vw,4rem)] leading-[1.1]">
            {copy.home.h1}
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="measure-prose mx-auto mt-6 text-[1.0625rem] leading-[1.75] text-muted">
            {copy.home.lede}
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button tpl="t3" href={href("t3", cta.primary.href)}>
              {cta.primary.label}
            </Button>
            <Button tpl="t3" href={href("t3", "/houses")} tone="outline">
              The houses
            </Button>
          </div>
        </Reveal>
      </Container>

      <Reveal delay={120} y={24}>
        <Container width="wide">
          <Photo
            slug="property-12"
            priority
            ratio={21 / 9}
            sizes="100vw"
            alt="The open pavilion and lawn at Swarma Villas Bali"
          />
        </Container>
      </Reveal>
    </section>
  );
}
