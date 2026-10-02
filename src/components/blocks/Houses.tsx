import { Photo } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { TLink } from "@/components/shared/Transition";
import { Container, SectionHeader } from "@/components/ui";
import { copy, houses, type House } from "@/content/site";
import { clsx } from "@/lib/clsx";
import { formatIDR } from "@/lib/format";

/* =============================================================================
   THE THREE HOUSES
   -----------------------------------------------------------------------------
   Full-width rows, alternating sides. Used twice: as a section on the home page
   and as the body of /houses.

   The `headingLevel` prop exists because of that. On /houses the page title is
   the h1 and these are h2s; on the home page the section title is the h2 and
   these are h3s. Skipping a level breaks heading navigation in every screen
   reader.
   ========================================================================== */

type Level = "h2" | "h3";

/** The one line of specification shown under each name. */
function specLine(house: House): string {
  return `${house.bed} · Up to ${house.maxGuests} guests · ${house.sizeSqm} sqm`;
}

export function HouseGrid({ headingLevel = "h2" }: { headingLevel?: Level }) {
  const H = headingLevel;
  return (
    <ul className="flex flex-col">
      {houses.map((house, i) => (
        <li key={house.slug} className="border-t border-line last:border-b">
          <Reveal>
            <TLink
              href={`/houses/${house.slug}`}
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
                  slug={house.cardPhoto ?? house.photos[0]!}
                  ratio={16 / 10}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  imgClassName="transition-transform duration-[1100ms] ease-out-quint group-hover:scale-[1.04]"
                  alt={`${house.name} at Swarma Villas Bali`}
                />
              </div>

              <div className="lg:px-4">
                <H className="display text-[clamp(1.875rem,4vw,3rem)] leading-[1.02]">
                  {house.name}
                </H>
                <p className="mt-4 text-[0.875rem] uppercase tracking-[0.12em] text-subtle">
                  {specLine(house)}
                </p>
                <p className="measure-prose mt-5 text-[1.0625rem] leading-[1.7] text-muted">
                  {house.distinction}
                </p>
                {/* "Starting from" at the villa's request: the figure is the
                    lowest rate for the house, not a fixed price. */}
                <p className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-[0.8125rem] uppercase tracking-[0.16em] text-muted">
                    Starting from
                  </span>
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

/* ------------------------------------------------ the home-page section */

export function HousesSection() {
  return (
    <Container width="wide">
      <SectionHeader
        kicker={copy.home.houses.kicker}
        title={copy.home.houses.title}
        lede={copy.home.houses.lede}
        className="mb-12 md:mb-16"
      />
      <HouseGrid headingLevel="h3" />
    </Container>
  );
}
