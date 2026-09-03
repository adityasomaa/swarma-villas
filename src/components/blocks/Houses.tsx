import { Photo } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { TLink } from "@/components/shared/Transition";
import { Container, SectionHeader } from "@/components/ui";
import { copy, houses, type House } from "@/content/site";
import { clsx } from "@/lib/clsx";
import { formatIDR } from "@/lib/format";
import { href, type TemplateId } from "@/lib/templates";

/* =============================================================================
   THE THREE HOUSES
   -----------------------------------------------------------------------------
   Used twice: as a section on the home page and as the body of /houses. The
   `headingLevel` prop exists because of that — on /houses the page title is the
   h1 and these are h2s, on the home page the section title is the h2 and these
   are h3s. Skipping a level is a real accessibility failure, not a nitpick:
   it breaks heading navigation in every screen reader.

     Amber       three rounded cards in a row, photograph on top
     Riverstone  full-width alternating rows, numbered, sharp corners
     Paon        a hairline-ruled index, the way a hotel lists its rooms
   ========================================================================== */

type Level = "h2" | "h3";

export function HouseGrid({
  tpl,
  headingLevel = "h2",
}: {
  tpl: TemplateId;
  headingLevel?: Level;
}) {
  if (tpl === "t2") return <RiverstoneRows headingLevel={headingLevel} />;
  if (tpl === "t3") return <PaonIndex headingLevel={headingLevel} />;
  return <AmberCards headingLevel={headingLevel} />;
}

/** The one line of specification all three show under a name. */
function specLine(house: House): string {
  return `${house.bed} · Up to ${house.maxGuests} guests · ${house.sizeSqm} sqm`;
}

/* ------------------------------------------------------------- 1 — AMBER */

function AmberCards({ headingLevel }: { headingLevel: Level }) {
  const H = headingLevel;
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {houses.map((house, i) => (
        <li key={house.slug}>
          <Reveal delay={i * 90}>
            <TLink
              href={href("t1", `/houses/${house.slug}`)}
              className="group flex h-full flex-col overflow-hidden r-md bg-surface shadow-[0_1px_2px_rgba(22,19,12,0.05)] transition-[transform,box-shadow] duration-500 ease-out-quint hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(22,19,12,0.4)]"
            >
              <div className="overflow-hidden">
                <Photo
                  slug={house.photos[0]!}
                  ratio={4 / 3}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  imgClassName="transition-transform duration-[900ms] ease-out-quint group-hover:scale-[1.05]"
                  alt={`${house.name} at Swarma Villas Bali`}
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <H className="display text-[1.5rem] leading-tight">{house.name}</H>
                <p className="mt-2 text-[0.875rem] text-subtle">{specLine(house)}</p>
                <p className="measure-prose mt-4 flex-1 text-[0.9375rem] leading-[1.65] text-muted">
                  {house.distinction}
                </p>
                <p className="mt-6 flex items-baseline justify-between border-t border-line pt-4">
                  <span className="display text-[1.375rem]">{formatIDR(house.priceFromIDR)}</span>
                  <span className="text-[0.8125rem] text-accent">
                    per night
                    <span aria-hidden className="ml-2 inline-block transition-transform duration-400 ease-out-quint group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </span>
                </p>
              </div>
            </TLink>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------- 2 — RIVERSTONE */

function RiverstoneRows({ headingLevel }: { headingLevel: Level }) {
  const H = headingLevel;
  return (
    <ul className="flex flex-col">
      {houses.map((house, i) => (
        <li key={house.slug} className="border-t border-line last:border-b">
          <Reveal>
            <TLink
              href={href("t2", `/houses/${house.slug}`)}
              className={clsx(
                "group grid items-center gap-8 py-10 md:gap-12 md:py-14",
                "lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
                // Alternates, so the eye zig-zags down the page rather than
                // running down a single column of photographs.
                i % 2 === 1 && "lg:[&>*:first-child]:order-2",
              )}
            >
              <div className="overflow-hidden">
                <Photo
                  slug={house.photos[0]!}
                  ratio={16 / 10}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  imgClassName="transition-transform duration-[1100ms] ease-out-quint group-hover:scale-[1.04]"
                  alt={`${house.name} at Swarma Villas Bali`}
                />
              </div>

              <div className="lg:px-4">
                <p className="kicker text-subtle tabular-nums">
                  {String(i + 1).padStart(2, "0")} / {String(houses.length).padStart(2, "0")}
                </p>
                <H className="display mt-4 text-[clamp(1.875rem,4vw,3rem)] leading-[1.02]">
                  {house.name}
                </H>
                <p className="mt-4 text-[0.875rem] uppercase tracking-[0.12em] text-subtle">
                  {specLine(house)}
                </p>
                <p className="measure-prose mt-5 text-[1.0625rem] leading-[1.7] text-muted">
                  {house.distinction}
                </p>
                <p className="mt-7 flex items-baseline gap-3">
                  <span className="display text-[1.75rem]">{formatIDR(house.priceFromIDR)}</span>
                  <span className="text-[0.8125rem] uppercase tracking-[0.16em] text-muted">
                    per night
                  </span>
                </p>
                <span className="mt-6 inline-block border-b border-current pb-1 text-[0.8125rem] uppercase tracking-[0.16em] text-accent">
                  View the house
                </span>
              </div>
            </TLink>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------- 3 — PAON */

function PaonIndex({ headingLevel }: { headingLevel: Level }) {
  const H = headingLevel;
  return (
    <ul className="border-t border-line">
      {houses.map((house, i) => (
        <li key={house.slug} className="border-b border-line">
          <Reveal delay={i * 70}>
            <TLink
              href={href("t3", `/houses/${house.slug}`)}
              className="group grid gap-6 py-8 sm:grid-cols-[14rem_minmax(0,1fr)_auto] sm:items-start sm:gap-8 md:py-10"
            >
              <div className="overflow-hidden">
                <Photo
                  slug={house.photos[0]!}
                  ratio={4 / 3}
                  sizes="(min-width: 640px) 14rem, 100vw"
                  imgClassName="transition-transform duration-[900ms] ease-out-quint group-hover:scale-[1.05]"
                  alt={`${house.name} at Swarma Villas Bali`}
                />
              </div>

              <div>
                <H className="display text-[1.5rem] leading-tight transition-colors duration-300 group-hover:text-accent">
                  {house.name}
                </H>
                <p className="mt-2 text-[0.75rem] uppercase tracking-[0.14em] text-subtle">
                  {specLine(house)}
                </p>
                <p className="measure-prose mt-4 text-[0.9375rem] leading-[1.7] text-muted">
                  {house.distinction}
                </p>
              </div>

              <div className="sm:text-right">
                <p className="kicker text-subtle">From</p>
                <p className="display mt-1.5 text-[1.375rem]">{formatIDR(house.priceFromIDR)}</p>
                <p className="mt-0.5 text-[0.75rem] text-muted">per night</p>
                <span className="mt-4 inline-block border-b border-current pb-0.5 text-[0.75rem] uppercase tracking-[0.16em] text-accent">
                  Details
                </span>
              </div>
            </TLink>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------ the home-page section */

export function HousesSection({ tpl }: { tpl: TemplateId }) {
  return (
    <Container width={tpl === "t2" ? "wide" : "default"}>
      <SectionHeader
        tpl={tpl}
        kicker="Where you sleep"
        title={copy.houses.h1}
        lede={copy.houses.lede}
        className="mb-12 md:mb-16"
      />
      <HouseGrid tpl={tpl} headingLevel="h3" />
    </Container>
  );
}
