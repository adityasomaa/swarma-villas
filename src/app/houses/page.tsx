import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/PageHero";
import { HouseGrid } from "@/components/blocks/Houses";
import { CtaBand } from "@/components/blocks/home";
import { Reveal } from "@/components/shared/Reveal";
import { Container, Section, SectionHeader } from "@/components/ui";
import { bookingTerms, copy, houses } from "@/content/site";
import { formatIDR } from "@/lib/format";

export const metadata: Metadata = {
  title: "The houses",
  description: copy.houses.lede,
};

export default function HousesPage() {

  const cancellation = bookingTerms.sections.find((s) => s.title === "Cancellation policy");

  return (
    <>
      <PageHero
        kicker="Where you sleep"
        title={copy.houses.h1}
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
            lede="The published starting rate, the bed, the capacity and the floor area — the four things people actually compare."
            className="mb-10 md:mb-14"
          />
          <Reveal>
            {/*
              A real table, because this is tabular data. The wrapper scrolls
              rather than the page, which is what keeps a narrow phone from
              scrolling sideways as a whole.
            */}
            <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[36rem] border-collapse text-left">
                <caption className="sr-only">
                  The three houses at Swarma Villas Bali compared by rate, bed, capacity and size
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
                    <th scope="col" className="kicker py-4 text-subtle">
                      Size
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
                      <td className="py-5 text-[0.9375rem] text-muted tabular-nums whitespace-nowrap">
                        {house.sizeSqm} sqm
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <p className="mt-6 text-[0.8125rem] leading-relaxed text-subtle">
            Rates are the villa&rsquo;s published starting rates and are a starting point rather
            than a quotation. This site has no connection to a booking system, so nothing here
            shows availability — send your dates and we will reply.
          </p>
        </Container>
      </Section>

      {/* ---------------------------------------------- what to know first */}
      {cancellation && (
        <Section tone="canvas" size="tight">
          <Container>
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <h2 className="kicker text-accent">Before you book</h2>
              </div>
              <dl className="md:col-span-2 grid gap-6 sm:grid-cols-2">
                <div>
                  <dt className="display text-[1.125rem]">Check-in and check-out</dt>
                  <dd className="mt-2 text-[0.9375rem] leading-[1.7] text-muted">
                    Check-in from 14:00, check-out by 12:00. A government ID or passport is
                    needed at check-in.
                  </dd>
                </div>
                <div>
                  <dt className="display text-[1.125rem]">Cancellation</dt>
                  <dd className="mt-2 text-[0.9375rem] leading-[1.7] text-muted">
                    <ul className="space-y-1">
                      {cancellation.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          </Container>
        </Section>
      )}

      <CtaBand
        title="Which house is yours?"
        lede="Tell us your dates and how many of you there are, and we will say what is free."
      />
    </>
  );
}
