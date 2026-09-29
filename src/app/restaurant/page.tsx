import type { Metadata } from "next";

import { Gallery } from "@/components/blocks/Gallery";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBand } from "@/components/blocks/home";
import { MenuSlot } from "@/components/shared/MenuSlot";
import { Reveal } from "@/components/shared/Reveal";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Container, Prose, Section, SectionHeader } from "@/components/ui";
import { restaurant } from "@/content/site";

export const metadata: Metadata = {
  title: restaurant.h1,
  description: restaurant.lede,
};

/**
 * Paon, the villa's own restaurant. Its own page at the villa's request — it
 * was a section under Experiences before, and it is open to non-residents, so
 * it needs an address of its own to send people to.
 *
 * The villa asked for the menu's space to be held. MenuSlot holds it: put a
 * path in restaurant.menu.href and it becomes the button.
 */
export default function RestaurantPage() {
  const [lead, ...rest] = restaurant.photos;

  return (
    <>
      <PageHero
        kicker={restaurant.kicker}
        title={restaurant.h1}
        lede={restaurant.lede}
        photo={{ slug: lead!, alt: "Paon Restaurant by Swarma Villa, set in a restored Javanese wooden house" }}
        crumbs={[{ label: "Restaurant", path: "/restaurant" }]}
      />

      <Section tone="canvas">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
            <Prose paragraphs={restaurant.body} size="lead" />

            <Reveal delay={100}>
              <aside className="border border-line bg-surface p-7 md:p-8 lg:sticky lg:top-28">
                <h2 className="display text-[1.25rem]">{restaurant.detailsTitle}</h2>
                <dl className="mt-5 space-y-4 border-t border-line pt-5">
                  {restaurant.details.map((d) => (
                    <div key={d.label}>
                      <dt className="kicker text-subtle">{d.label}</dt>
                      <dd className="mt-1.5 text-[1rem] text-ink">{d.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-7 border-t border-line pt-6">
                  <WhatsAppButton
                    action="Restaurant page — Contact Paon"
                    subject="Paon Restaurant"
                    label="Contact Paon"
                    className="w-full"
                  />
                </div>

                <MenuSlot
                  menu={restaurant.menu}
                  action="Restaurant page — Ask for the menu"
                  subject="the menu at Paon"
                  className="mt-6"
                />
              </aside>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------- dining your way, staying nearby */}
      <Section tone="surface">
        <Container>
          <div className="grid gap-10 md:grid-cols-2 md:gap-14">
            {restaurant.sections.map((section, i) => (
              <Reveal key={section.title} delay={i * 90}>
                <SectionHeader as="h2" title={section.title} align="start" className="mb-5" />
                <Prose paragraphs={section.body} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={160}>
            <p className="display measure-head mx-auto mt-14 text-center text-[clamp(1.375rem,3vw,2rem)] leading-[1.3] text-ink md:mt-20">
              {restaurant.closing}
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section tone="canvas">
        <Container>
          <SectionHeader
            kicker="On the menu"
            title={restaurant.cuisineTitle}
            className="mb-10 md:mb-14"
          />
          <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {restaurant.cuisine.map((c, i) => (
              <li key={c.name} className="bg-canvas">
                <Reveal delay={i * 70}>
                  <div className="h-full p-7 md:p-8">
                    <h3 className="display text-[1.375rem] leading-snug">{c.name}</h3>
                    <p className="mt-3 text-[0.9375rem] leading-[1.7] text-muted">{c.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {rest.length > 0 && (
        <Section tone="surface">
          <Container width="wide">
            <SectionHeader kicker="Look around" title="Paon in photographs" className="mb-10 md:mb-14" />
            <Gallery slugs={rest} />
          </Container>
        </Section>
      )}

      <CtaBand title={restaurant.cta.title} lede={restaurant.cta.lede} />
    </>
  );
}
