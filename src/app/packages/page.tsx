import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/PageHero";
import { CtaBand } from "@/components/blocks/home";
import { Photo } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Container, Prose, Section, SectionHeader } from "@/components/ui";
import { packages } from "@/content/site";

export const metadata: Metadata = {
  title: packages.h1,
  description: packages.lede,
};

/**
 * Packages and the longer-stay offers.
 *
 * The package rates are deliberately absent — the villa quotes them per stay.
 * The weekly and monthly "from" figures ARE published, so they are shown.
 */
export default function PackagesPage() {
  return (
    <>
      <PageHero
        kicker={packages.kicker}
        title={packages.h1}
        lede={packages.lede}
        photo={{ slug: "pool-06", alt: "The pool in the garden at Swarma Villas" }}
        crumbs={[{ label: "Package & Offer", path: "/packages" }]}
      />

      <Section tone="canvas">
        <Container width="narrow">
          <SectionHeader title={packages.intro.title} className="mb-8" />
          <Prose paragraphs={packages.intro.body} size="lead" className="mx-auto text-center" />
        </Container>
      </Section>

      {/* ------------------------------------------------------- the packages */}
      <Section tone="surface">
        <Container width="wide">
          <SectionHeader kicker="Stay your way" title={packages.listTitle} className="mb-12 md:mb-16" />

          <ul className="flex flex-col">
            {packages.list.map((pack, i) => (
              <li key={pack.name} className="border-t border-line last:border-b">
                <Reveal>
                  <article
                    className={
                      "grid items-center gap-8 py-10 md:gap-12 md:py-14 lg:grid-cols-2" +
                      (i % 2 === 1 ? " lg:[&>*:first-child]:order-2" : "")
                    }
                  >
                    <Photo
                      slug={pack.photo}
                      ratio={16 / 10}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      alt={`${pack.name} at Swarma Villas`}
                    />

                    <div className="lg:px-4">
                      <p className="kicker text-subtle tabular-nums">
                        {String(i + 1).padStart(2, "0")} — {pack.name}
                      </p>
                      <h3 className="display mt-4 text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.06]">
                        {pack.tagline}
                      </h3>
                      <div className="measure-prose mt-5 space-y-3 text-[1.0625rem] leading-[1.7] text-muted">
                        {pack.body.map((b, j) => (
                          <p key={j}>{b}</p>
                        ))}
                      </div>

                      <h4 className="kicker mt-7 text-accent">{pack.includedTitle}</h4>
                      <ul className="mt-4 space-y-2.5">
                        {pack.included.map((item) => (
                          <li
                            key={item}
                            className="flex items-baseline gap-3 text-[0.9375rem] leading-[1.6] text-muted"
                          >
                            <span aria-hidden className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal delay={80}>
            <div className="mt-12 border border-line bg-canvas p-7 md:p-9">
              <h3 className="display text-[1.5rem]">{packages.rates.title}</h3>
              <Prose paragraphs={packages.rates.body} className="mt-4" />
              <div className="mt-7">
                <WhatsAppButton
                  action="Packages — Ask about a package"
                  subject="one of your packages"
                  label={packages.rates.cta}
                />
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ----------------------------------------------------- longer stays */}
      <Section tone="canvas">
        <Container>
          <SectionHeader
            kicker={packages.offers.kicker}
            title={packages.offers.title}
            lede={packages.offers.body.join(" ")}
            className="mb-12 md:mb-16"
          />

          <ul className="grid gap-px bg-line md:grid-cols-3">
            {packages.offers.items.map((offer, i) => (
              <li key={offer.name} className="bg-canvas">
                <Reveal delay={i * 80}>
                  <div className="flex h-full flex-col p-7 md:p-9">
                    <h3 className="display text-[1.5rem] leading-snug">{offer.name}</h3>
                    <p className="display mt-3 text-[1.25rem] text-accent">{offer.from}</p>
                    <p className="mt-3 flex-1 text-[0.9375rem] leading-[1.7] text-muted">{offer.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal delay={100}>
            <div className="mt-12 text-center">
              <h3 className="display text-[1.5rem]">{packages.offers.closing.title}</h3>
              <Prose paragraphs={packages.offers.closing.body} className="mx-auto mt-4" />
              <div className="mt-7">
                <WhatsAppButton
                  action="Packages — Ask for a special rate"
                  subject="a weekly, monthly or group rate"
                  label={packages.offers.closing.cta}
                />
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
