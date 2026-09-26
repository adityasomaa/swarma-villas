import type { Metadata } from "next";

import { Gallery } from "@/components/blocks/Gallery";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBand } from "@/components/blocks/home";
import { Photo } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Container, Prose, Section, SectionHeader } from "@/components/ui";
import { experience } from "@/content/site";

export const metadata: Metadata = {
  title: experience.h1,
  description: experience.lede,
};

/**
 * One page now, rather than four separate experience pages. The villa's
 * revision put the restaurant and the packages on pages of their own and
 * folded everything else into this one: the wellness treatments they run
 * themselves, then the things they arrange beyond the property.
 */
export default function ExperiencesPage() {
  const [wellnessLead, ...wellnessRest] = experience.wellness.photos;

  return (
    <>
      <PageHero
        kicker={experience.kicker}
        title={experience.h1}
        lede={experience.lede}
        photo={{ slug: "jungle-05", alt: "The greenery around Swarma Villas" }}
        crumbs={[{ label: "Experience", path: "/experiences" }]}
      />

      <Section tone="canvas">
        <Container width="narrow">
          <SectionHeader
            kicker={experience.intro.kicker}
            title={experience.intro.title}
            className="mb-8"
          />
          <Prose paragraphs={experience.intro.body} size="lead" className="mx-auto text-center" />
        </Container>
      </Section>

      {/* ------------------------------------------------------- wellness */}
      <Section tone="surface" id="wellness">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal>
              <Photo
                slug={wellnessLead!}
                ratio={4 / 5}
                sizes="(min-width: 1024px) 48vw, 100vw"
                alt="A flower bath prepared at Swarma Villas"
              />
            </Reveal>
            <div>
              <SectionHeader
                kicker={experience.wellness.kicker}
                title={experience.wellness.title}
                align="start"
                className="mb-6"
              />
              <Prose paragraphs={experience.wellness.body} />
              <Reveal delay={100} className="mt-8">
                <WhatsAppButton
                  action="Experiences — Book a treatment"
                  subject="a massage or body scrub"
                  label="Book a treatment"
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------- beyond the villa */}
      <Section tone="canvas" id="beyond">
        <Container width="wide">
          <SectionHeader
            kicker={experience.beyond.kicker}
            title={experience.beyond.title}
            lede={experience.beyond.body.join(" ")}
            className="mb-12 md:mb-16"
          />

          <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {experience.beyond.items.map((item, i) => (
              <li key={item.name} className="bg-canvas">
                <Reveal delay={(i % 3) * 80}>
                  <article className="flex h-full flex-col">
                    <Photo
                      slug={item.photo}
                      ratio={16 / 10}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      alt={`${item.name} — arranged by Swarma Villas`}
                    />
                    <div className="flex flex-1 flex-col p-6 md:p-8">
                      <h3 className="display text-[1.5rem] leading-tight">{item.name}</h3>
                      <div className="mt-3 space-y-3 text-[0.9375rem] leading-[1.7] text-muted">
                        {item.body.map((b, j) => (
                          <p key={j}>{b}</p>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ------------------------------------------------------- arranging it */}
      <Section tone="surface" size="tight">
        <Container width="narrow" className="text-center">
          <SectionHeader title={experience.closing.title} align="center" className="mb-6" />
          <Prose paragraphs={experience.closing.body} className="mx-auto" />
          <Reveal delay={100} className="mt-8">
            <WhatsAppButton
              action="Experiences — Enquire"
              subject="the experiences you arrange"
              label={experience.closing.cta}
            />
          </Reveal>
        </Container>
      </Section>

      {wellnessRest.length > 0 && (
        <Section tone="canvas" size="tight">
          <Container width="wide">
            <SectionHeader kicker="Look around" title="At the villa" className="mb-10 md:mb-14" />
            <Gallery slugs={wellnessRest} />
          </Container>
        </Section>
      )}

      <CtaBand
        title="Add an experience to your stay"
        lede="Tell us what you would like to do and when you are here, and we will arrange it."
      />
    </>
  );
}
