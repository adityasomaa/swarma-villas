import type { Metadata } from "next";

import { Gallery } from "@/components/blocks/Gallery";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBand } from "@/components/blocks/home";
import { allPhotos } from "@/components/shared/Photo";
import { Container, Section, SectionHeader } from "@/components/ui";
import { copy } from "@/content/site";

export const metadata: Metadata = {
  title: "Gallery",
  description: copy.gallery.lede,
};

/* =============================================================================
   THE FULL LIBRARY
   -----------------------------------------------------------------------------
   Every photograph the villa published, grouped rather than poured into one
   endless grid — 108 images in a single column of squares is a scroll, not a
   gallery.

   The order below is the order someone actually wants: the property first,
   then each house, then the pool and the restaurant, then what is outside the
   gate. Categories with nothing in them drop out on their own, so adding or
   removing photographs from photos.json cannot leave an empty heading behind.
   ========================================================================== */

const GROUPS: { title: string; blurb: string; categories: string[] }[] = [
  {
    title: "The property",
    blurb: "The garden, the paths between the houses, and the valley they sit above.",
    categories: ["property"],
  },
  {
    title: "The Wooden Gladak House",
    blurb: "Javanese teak, an open-air bathtub and a terrace over the garden.",
    categories: ["gladak"],
  },
  {
    title: "The Hexa Bamboo House",
    blurb: "Woven bamboo walls, single storey, no stairs.",
    categories: ["hexa"],
  },
  {
    title: "The Bamboo Dome",
    blurb: "A curved bamboo shell, the largest of the three.",
    categories: ["dome"],
  },
  {
    title: "Rooms and details",
    blurb: "Interiors and the small things that make them.",
    categories: ["rooms", "detail"],
  },
  {
    title: "Bathrooms and rituals",
    blurb: "Open-air bathing, flower baths and the massage room.",
    categories: ["bathroom", "ritual"],
  },
  {
    title: "The pool",
    blurb: "The outdoor pool in the tropical garden.",
    categories: ["pool"],
  },
  {
    title: "Swarma Paon Restaurant",
    blurb: "The restaurant, the kitchen and the food that comes out of it.",
    categories: ["restaurant", "food", "menu"],
  },
  {
    title: "Beyond the gate",
    blurb: "The jungle, the rice fields and the waterfalls the treks reach.",
    categories: ["jungle", "waterfall"],
  },
];

export default function GalleryPage() {

  const groups = GROUPS.map((group) => ({
    ...group,
    slugs: allPhotos
      .filter((p) => group.categories.includes(p.category))
      .map((p) => p.slug),
  })).filter((group) => group.slugs.length > 0);

  const total = groups.reduce((sum, g) => sum + g.slugs.length, 0);

  return (
    <>
      <PageHero
        kicker="The property"
        title={copy.gallery.h1}
        lede={copy.gallery.lede}
        photo={{ slug: "pool-01", alt: "The pool at Swarma Villas Bali" }}
        crumbs={[{ label: "Gallery", path: "/gallery" }]}
      />

      <Section tone="canvas" size="tight">
        <Container>
          <p className="text-[0.9375rem] text-muted">
            {total} photographs, all of this property. Select any one to see it larger; the
            arrow keys move through a set and Escape closes it.
          </p>
        </Container>
      </Section>

      {groups.map((group, i) => (
        <Section
          key={group.title}
          tone={i % 2 === 0 ? "canvas" : "surface"}
          size="tight"
        >
          <Container width="wide">
            <SectionHeader
              kicker={`${group.slugs.length} photographs`}
              title={group.title}
              lede={group.blurb}
              className="mb-8 md:mb-12"
            />
            <Gallery slugs={group.slugs} columns={4} />
          </Container>
        </Section>
      ))}

      <CtaBand
        title="See it for yourself"
        lede="Photographs only go so far. Send your dates and come and stand in it."
      />
    </>
  );
}
