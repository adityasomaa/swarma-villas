import type { Metadata } from "next";

import { Gallery } from "@/components/blocks/Gallery";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBand } from "@/components/blocks/home";
import { allPhotos } from "@/components/shared/Photo";
import { Container, Section, SectionHeader } from "@/components/ui";
import { copy, houses, restaurant } from "@/content/site";

export const metadata: Metadata = {
  title: "Gallery",
  description: copy.gallery.lede,
};

/* =============================================================================
   THE FULL LIBRARY
   -----------------------------------------------------------------------------
   Grouped the way the villa asked for on 1 October: the pictures a page
   already owns are the pictures the gallery shows for it.

     - the property, the pool and the garden in one group, because the
       property is small and splitting them made three thin sets;
     - one group per house, taken from that house's own photo list, so the
       gallery and the house page can never drift apart;
     - the restaurant from the restaurant page;
     - and everything left over in one group at the end.

   THAT LAST GROUP IS THE POINT. It is a remainder, not a category list, so a
   photograph added to the library turns up here even if nobody remembers to
   file it. The old version grouped by category, and a category no group named
   rendered nowhere at all.
   ========================================================================== */

type Group = { title: string; blurb: string; slugs: string[] };

export default function GalleryPage() {
  const seen = new Set<string>();
  const take = (slugs: string[]) => {
    const fresh = slugs.filter((slug) => !seen.has(slug));
    for (const slug of fresh) seen.add(slug);
    return fresh;
  };
  /* Lists slugs without claiming them. take() is what claims, and calling one
     inside the other claims a slug and then filters it straight back out. */
  const inCategories = (categories: string[]) =>
    allPhotos.filter((p) => categories.includes(p.category)).map((p) => p.slug);

  const groups: Group[] = [
    {
      title: "The property",
      blurb: "The garden, the paths between the houses, the pool and the valley they sit above.",
      slugs: take(inCategories(["property", "pool"])),
    },
    ...houses.map((house) => ({
      title: house.name,
      blurb: house.distinction,
      slugs: take([house.cardPhoto, ...house.photos].filter((s): s is string => Boolean(s))),
    })),
    {
      title: "Paon Restaurant",
      blurb: "The restaurant, the kitchen and the food that comes out of it.",
      slugs: take([...restaurant.photos, ...inCategories(["restaurant", "food"])]),
    },
    {
      title: "Everything else",
      blurb: "The bathrooms, the treatments, and the places the villa takes people.",
      slugs: take(allPhotos.map((p) => p.slug)),
    },
  ].filter((group) => group.slugs.length > 0);

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
