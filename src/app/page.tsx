import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: { absolute: `${business.name} — ${business.tagline}` },
  description: copy.home.lede,
};

/**
 * The home page, and the one page that plays the arrival loader when you
 * navigate to it. Section order follows the current site — houses, about,
 * experiences, the video, reviews, gallery, how to get here.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <Section tone="surface">
        <HousesSection />
      </Section>

      <Section tone="canvas">
        <AboutBand />
      </Section>

      <Section tone="canvas">
        <ExperiencesSection />
      </Section>

      <Section tone="canvas" size="tight">
        <VideoBand />
      </Section>

      <Section tone="deep">
        <ReviewsBand />
      </Section>

      <Section tone="canvas">
        <GalleryStrip />
      </Section>

      <Section tone="canvas">
        <LocationBand />
      </Section>

      <CtaBand />
    </>
  );
}
