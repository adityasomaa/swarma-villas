import { Photo } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { Button, Container } from "@/components/ui";
import { business, copy, cta, houses } from "@/content/site";
import { formatIDR } from "@/lib/format";
import { href, type TemplateId } from "@/lib/templates";

/* =============================================================================
   THREE OPENINGS
   -----------------------------------------------------------------------------
   All three fill one screen and all three set their type ON the photograph.
   What differs is the composition, taken from each direction's reference:

     Amber       the type in a warm glass panel floating over the photograph,
                 with the rate card beside it. (Vantara)
     Riverstone  the name across the bottom-left corner, nothing else on it.
                 (Villa Asteria)
     Paon        centred between two hairlines, hotel-formal. (Villa L)

   HEIGHT. `100svh` — the *small* viewport height — minus the preview switcher.
   On a phone `100vh` is the height with the address bar collapsed, so a hero
   sized in vh is taller than the screen on arrival and its buttons sit below
   the fold until you scroll. `svh` is the honest number.

   THE SCRIM. Every one of these puts text on a photograph, so every one of
   them carries a gradient underneath the type. Without it the contrast depends
   on which part of a jungle happens to be bright that day — and jungle is the
   one subject that is reliably light and dark in the same frame.
   ========================================================================== */

const cheapest = Math.min(...houses.map((h) => h.priceFromIDR));

/** One screen, honestly measured. Used by all three. */
const FULL = "min-h-[calc(100svh-var(--switcher-h))]";

export function Hero({ tpl }: { tpl: TemplateId }) {
  if (tpl === "t1") return <AmberHero />;
  if (tpl === "t2") return <RiverstoneHero />;
  return <PaonHero />;
}

/* ------------------------------------------------------------- 1 — AMBER */

function AmberHero() {
  return (
    <section data-hero="dark" className={`relative isolate w-full overflow-hidden ${FULL}`}>
      <Photo
        slug="property-03"
        priority
        fill
        sizes="100vw"
        className="-z-10"
        imgClassName="object-[center_38%]"
        alt="A teakwood gladak house raised above the garden at Swarma Villas"
      />
      {/*
        Warm rather than neutral, so the scrim belongs to Amber's palette
        instead of greying the photograph down.
      */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,rgba(22,19,12,0.86)_0%,rgba(22,19,12,0.62)_38%,rgba(22,19,12,0.18)_68%,rgba(22,19,12,0.32)_100%)]"
      />

      <div className={`on-photo relative flex items-center ${FULL}`}>
        <Container className="grid w-full items-end gap-8 py-28 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.75fr)] lg:gap-12">
          <div>
            <Reveal>
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-px w-8 bg-gold" />
                <p className="kicker">{copy.home.kicker}</p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="display mt-6 text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02]">
                {copy.home.h1}
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="measure-prose mt-6 text-[1.0625rem] leading-[1.7] opacity-90 md:text-[1.125rem]">
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
          </div>

          {/* The rate card. Glass, rounded, warm — Amber's whole character in
              one element, and the only place a rate appears above the fold. */}
          <Reveal delay={320}>
            <div className="r-md border border-white/15 bg-black/30 p-6 backdrop-blur-xl md:p-7">
              <p className="kicker opacity-75">Rates start from</p>
              <p className="display mt-2 text-[2rem] leading-none">
                {formatIDR(cheapest)}
                <span className="ml-2 align-middle text-[0.8125rem] tracking-normal opacity-75">
                  per night
                </span>
              </p>
              <p className="mt-3 text-[0.875rem] leading-relaxed opacity-85">
                Published rate for the Wooden Gladak House. Book direct on WhatsApp — no
                agency fee.
              </p>
              <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/20 pt-5">
                {[
                  ["Houses", String(houses.length)],
                  ["Ubud", "Singakerta"],
                  ["Sleeps", "2 each"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="kicker text-[0.5625rem] opacity-70">{label}</dt>
                    <dd className="display mt-1 text-[0.9375rem] sm:text-[1.0625rem]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </Container>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- 2 — RIVERSTONE */

function RiverstoneHero() {
  return (
    <section data-hero="dark" className={`relative isolate w-full ${FULL}`}>
      <Photo
        slug="pool-02"
        priority
        fill
        sizes="100vw"
        className="-z-10"
        imgClassName="object-center"
        alt="The pool at Swarma Villas, surrounded by jungle planting"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(20,24,18,0.8)_0%,rgba(20,24,18,0.34)_46%,rgba(20,24,18,0.3)_100%)]"
      />

      <div className={`on-photo relative flex flex-col justify-end ${FULL}`}>
        <Container width="wide" className="pb-16 md:pb-24">
          <Reveal>
            <p className="kicker">{copy.home.kicker}</p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="display mt-5 max-w-5xl text-[clamp(2.5rem,8.5vw,6.5rem)] leading-[0.94]">
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
    <section data-hero="dark" className={`relative isolate w-full ${FULL}`}>
      <Photo
        slug="property-12"
        priority
        fill
        sizes="100vw"
        className="-z-10"
        imgClassName="object-[center_45%]"
        alt="The open pavilion and lawn at Swarma Villas Bali"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(14,14,14,0.68)_0%,rgba(14,14,14,0.34)_45%,rgba(14,14,14,0.72)_100%)]"
      />

      <div className={`on-photo relative flex items-center justify-center ${FULL}`}>
        <Container className="py-24 text-center">
          {/* Hairlines above and below the block: Paon's whole system is rules,
              and here they frame rather than separate. */}
          <Reveal>
            <p className="kicker border-t border-white/35 pt-8">{business.positioning}</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="display measure-display mx-auto mt-6 text-[clamp(2.25rem,5.6vw,4.25rem)] leading-[1.08]">
              {copy.home.h1}
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="measure-prose mx-auto mt-6 text-[1.0625rem] leading-[1.75] opacity-90">
              {copy.home.lede}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap justify-center gap-3 border-b border-white/35 pb-10">
              <Button tpl="t3" href={href("t3", cta.primary.href)}>
                {cta.primary.label}
              </Button>
              <Button tpl="t3" href={href("t3", "/houses")} tone="outline">
                The houses
              </Button>
            </div>
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
