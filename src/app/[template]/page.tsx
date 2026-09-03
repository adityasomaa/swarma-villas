import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Hero } from "@/components/blocks/Hero";
import { HousesSection } from "@/components/blocks/Houses";
import { VideoBand } from "@/components/blocks/VideoBand";
import {
  AboutBand,
  CtaBand,
  ExperiencesSection,
  GalleryStrip,
  LocationBand,
  ReviewsBand,
} from "@/components/blocks/home";
import { Section } from "@/components/ui";
import { business, copy } from "@/content/site";
import { idFromSegment } from "@/app/[template]/layout";

export const metadata: Metadata = {
  title: `${business.name} — ${business.tagline}`,
  description: copy.home.lede,
};

/**
 * The home page, and the one page that plays the arrival loader when you
 * navigate to it. Section order follows the current site — houses, about,
 * experiences, the video, reviews, gallery, how to get here — because the
 * redesign is a redesign, not a re-scoping.
 */
export default async function HomePage({ params }: { params: Promise<{ template: string }> }) {
  const { template } = await params;
  const tpl = idFromSegment(template);
  if (!tpl) notFound();

  return (
    <>
      <Hero tpl={tpl} />

      <Section tpl={tpl} tone={tpl === "t3" ? "canvas" : "surface"}>
        <HousesSection tpl={tpl} />
      </Section>

      <Section tpl={tpl} tone="canvas">
        <AboutBand tpl={tpl} />
      </Section>

      <Section tpl={tpl} tone={tpl === "t3" ? "surface" : "canvas"}>
        <ExperiencesSection tpl={tpl} />
      </Section>

      <Section tpl={tpl} tone="canvas" size="tight">
        <VideoBand tpl={tpl} />
      </Section>

      <Section tpl={tpl} tone={tpl === "t2" ? "deep" : "surface"}>
        <ReviewsBand tpl={tpl} />
      </Section>

      <Section tpl={tpl} tone="canvas">
        <GalleryStrip tpl={tpl} />
      </Section>

      <Section tpl={tpl} tone={tpl === "t3" ? "surface" : "canvas"}>
        <LocationBand tpl={tpl} />
      </Section>

      <CtaBand tpl={tpl} />
    </>
  );
}
