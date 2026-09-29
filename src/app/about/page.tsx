import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/PageHero";
import { CtaBand } from "@/components/blocks/home";
import { Photo } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { Container, Prose, Section, SectionHeader } from "@/components/ui";
import { copy } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: copy.about.lede,
};

/**
 * The villa's own About text, in four titled parts.
 *
 * The houses grid and the guest-review band that used to sit below were
 * removed at the villa's request — both now live on pages of their own, and
 * repeating them here only made the page longer than its story needed.
 */
export default function AboutPage() {
  const asides = ["property-06", "paon-01", "jungle-01", "property-03"] as const;

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

      {/* -------------------------------------------------------- the opening */}
      <Section tone="canvas">
        <Container width="narrow">
          <Prose paragraphs={copy.about.intro} size="lead" />
        </Container>
      </Section>

      {/* ---------------------------------------------------- the four parts */}
      {copy.about.sections.map((section, i) => (
        <Section key={section.title} tone={i % 2 === 0 ? "surface" : "canvas"}>
          <Container>
            <div
              className={
                "grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16" +
                (i % 2 === 1 ? " lg:[&>*:first-child]:order-2" : "")
              }
            >
              <Reveal>
                <Photo
                  slug={asides[i] ?? "property-06"}
                  ratio={4 / 5}
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  alt=""
                />
              </Reveal>
              <div>
                <SectionHeader title={section.title} align="start" className="mb-6" />
                <Prose paragraphs={section.body} />
              </div>
            </div>
          </Container>
        </Section>
      ))}

      {/* ------------------------------------------------------ why stay here */}
      <Section tone="surface">
        <Container>
          <SectionHeader
            kicker="Why stay here"
            title="What makes Swarma different"
            className="mb-12 md:mb-16"
          />
          <ul className="grid gap-px bg-line sm:grid-cols-2">
            {copy.about.why.map((item, i) => (
              <li key={item.title} className="bg-surface">
                <Reveal delay={i * 80}>
                  <div className="flex h-full flex-col p-7 md:p-9">
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

      {/* The villa asked for Getting here to come off this page — it is on the
          home page, and About is a story rather than a set of directions. */}
      <CtaBand title={copy.about.cta.title} lede={copy.about.cta.lede} />
    </>
  );
}
