import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/PageHero";
import { CtaBand, LocationBand } from "@/components/blocks/home";
import { HouseGrid } from "@/components/blocks/Houses";
import { Photo } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { Container, Prose, Section, SectionHeader } from "@/components/ui";
import { copy, reviews } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: copy.about.lede,
};

export default function AboutPage() {

  const french = reviews.find((r) => r.language === "fr");

  return (
    <>
      <PageHero
        kicker="The villa"
        title={copy.about.h1}
        lede={copy.about.lede}
        photo={{
          slug: "property-02",
          alt: "A teakwood gladak house among the planting at Swarma Villas Bali",
        }}
        crumbs={[{ label: "About", path: "/about" }]}
      />

      {/* ------------------------------------------------------- the story */}
      <Section tone="canvas">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
            <Reveal>
              <Photo
                slug="property-06"
                ratio={4 / 5}
                sizes="(min-width: 1024px) 45vw, 100vw"
                alt="The row of houses along the garden path"
              />
            </Reveal>
            <div>
              <Prose paragraphs={copy.about.body} size="lead" />
            </div>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------- why stay here */}
      <Section tone="surface">
        <Container>
          <SectionHeader
            kicker="Why stay here"
            title="What makes Swarma different"
            className="mb-12 md:mb-16"
          />
          <ul
            className="grid gap-px bg-line sm:grid-cols-2"
          >
            {copy.about.why.map((item, i) => (
              <li key={item.title} className="bg-surface">
                <Reveal delay={i * 80}>
                  <div
                    className="flex h-full flex-col p-7 md:p-9"
                  >
                    <span className="kicker text-accent tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="display mt-5 text-[1.375rem] leading-snug">{item.title}</h3>
                    <p className="mt-3 text-[1rem] leading-[1.7] text-muted">{item.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ------------------------------------------------------ the houses */}
      <Section tone="canvas">
        <Container width="wide">
          <SectionHeader
            kicker="Where you sleep"
            title="Three houses, not a block of rooms"
            lede="Each has its own character, and all of them open onto the same garden and pool."
            className="mb-12 md:mb-16"
          />
          <HouseGrid headingLevel="h3" />
        </Container>
      </Section>

      {/* ------------------------------------------- one guest, in their words */}
      {french && (
        <Section tone="deep" size="tight">
          <Container width="narrow" className="text-center">
            <Reveal>
              <p className="kicker text-gold">A guest review</p>
              <blockquote
                lang={french.language}
                className="display mt-7 text-[clamp(1.5rem,3.4vw,2.5rem)] leading-[1.16]"
              >
                &ldquo;{french.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-7 text-[0.8125rem] uppercase tracking-[0.16em] text-muted">
                {french.author} &middot; {french.date}
              </figcaption>
              <p className="mt-2 text-[0.75rem] text-subtle">{french.via}</p>
            </Reveal>
          </Container>
        </Section>
      )}

      <Section tone="canvas">
        <LocationBand />
      </Section>

      <CtaBand />
    </>
  );
}
