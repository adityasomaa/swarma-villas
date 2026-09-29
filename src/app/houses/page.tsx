import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/PageHero";
import { HouseGrid } from "@/components/blocks/Houses";
import { CtaBand } from "@/components/blocks/home";
import { Reveal } from "@/components/shared/Reveal";
import { Container, Section, SectionHeader } from "@/components/ui";
import { termsAndConditions } from "@/content/legal";
import { copy, houses } from "@/content/site";
import { formatIDR } from "@/lib/format";

export const metadata: Metadata = {
  title: "The houses",
  description: copy.houses.lede,
};

/**
 * "Before you book" reads its two panels out of the terms rather than keeping
 * its own copy of them. The check-in times and the cancellation policy were
 * both revised once already; a second copy of either would be the one that
 * went stale.
 */
const section = (title: string) => termsAndConditions.sections.find((s) => s.title === title);

/**
 * "2 houses" beside "One house" was the villa's note: the column mixed a digit
 * with a word. Spelled out, in the villa's own capitalisation.
 */
const WORDS = ["", "One", "Two", "Three", "Four", "Five"] as const;
const houseCount = (n: number) =>
  `${WORDS[n] ?? n} ${n === 1 ? "House" : "Houses"}`;

export default function HousesPage() {
  const arrival = section("Check in & Check out");
  const cancellation = section("Cancellation Policy");

  return (
    <>
      <PageHero
        kicker={copy.houses.kicker}
        title={copy.houses.h1Lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
        lede={copy.houses.lede}
        photo={{ slug: "room-04", alt: "A bed under a mosquito net in one of the houses" }}
        crumbs={[{ label: "Houses", path: "/houses" }]}
      />

      <Section tone="canvas">
        <Container width="wide">
          <HouseGrid headingLevel="h2" />
        </Container>
      </Section>

      {/* ------------------------------------------------ side-by-side compare */}
      <Section tone="surface">
        <Container>
          <SectionHeader
            kicker="Side by side"
            title="All three on one screen"
            lede="The starting rate, the bed, the capacity and the floor area — the four things people actually compare."
            className="mb-10 md:mb-14"
          />
          <Reveal>
            {/*
              A real table, because this is tabular data. The wrapper scrolls
              rather than the page, which is what keeps a narrow phone from
              scrolling sideways as a whole.
            */}
            <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[38rem] border-collapse text-left">
                <caption className="sr-only">
                  The three house types at Swarma Villas Bali compared by rate, bed, capacity and size
                </caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="kicker py-4 pr-4 text-subtle">
                      House
                    </th>
                    <th scope="col" className="kicker py-4 pr-4 text-subtle">
                      From, per night
                    </th>
                    <th scope="col" className="kicker py-4 pr-4 text-subtle">
                      Bed
                    </th>
                    <th scope="col" className="kicker py-4 pr-4 text-subtle">
                      Guests
                    </th>
                    <th scope="col" className="kicker py-4 pr-4 text-subtle">
                      Size
                    </th>
                    <th scope="col" className="kicker py-4 text-subtle">
                      How many
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {houses.map((house) => (
                    <tr key={house.slug} className="border-b border-line align-top">
                      <th scope="row" className="py-5 pr-4 font-normal">
                        <span className="display block text-[1.125rem]">{house.name}</span>
                        <span className="mt-1 block text-[0.875rem] text-muted">
                          {house.distinction}
                        </span>
                      </th>
                      <td className="display py-5 pr-4 text-[1.125rem] whitespace-nowrap">
                        {formatIDR(house.priceFromIDR)}
                      </td>
                      <td className="py-5 pr-4 text-[0.9375rem] text-muted">{house.bed}</td>
                      <td className="py-5 pr-4 text-[0.9375rem] text-muted tabular-nums">
                        Up to {house.maxGuests}
                      </td>
                      <td className="py-5 pr-4 text-[0.9375rem] text-muted tabular-nums whitespace-nowrap">
                        {house.sizeSqm} sqm
                      </td>
                      <td className="py-5 text-[0.9375rem] text-muted whitespace-nowrap">
                        {houseCount(house.count)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <p className="mt-6 text-[0.8125rem] leading-relaxed text-subtle">
            {copy.houses.ratesNote}
          </p>
        </Container>
      </Section>

      {/* ---------------------------------------------- what to know first */}
      {arrival && cancellation && (
        <Section tone="canvas" size="tight">
          <Container>
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <h2 className="kicker text-accent">Before you book</h2>
              </div>
              <dl className="grid gap-8 sm:grid-cols-2 md:col-span-2">
                <div>
                  <dt className="display text-[1.125rem]">Check in and check out</dt>
                  <dd className="mt-3 text-[0.9375rem] leading-[1.7] text-muted">
                    <ul className="space-y-1.5">
                      {arrival.items?.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="display text-[1.125rem]">Cancellation</dt>
                  <dd className="mt-3 text-[0.9375rem] leading-[1.7] text-muted">
                    <ul className="space-y-1.5">
                      {cancellation.items?.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    {cancellation.paragraphs?.map((p) => (
                      <p key={p} className="mt-3 text-[0.8125rem] text-subtle">
                        {p}
                      </p>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </Container>
        </Section>
      )}

      <CtaBand title={copy.houses.cta.title} lede={copy.houses.cta.lede} />
    </>
  );
}
