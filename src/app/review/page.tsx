import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/PageHero";
import { CtaBand } from "@/components/blocks/home";
import { Reveal } from "@/components/shared/Reveal";
import { Button, Container, Section, SectionHeader } from "@/components/ui";
import { copy, publishedRating, reviews } from "@/content/site";
import { clsx } from "@/lib/clsx";

export const metadata: Metadata = {
  title: "Guest reviews",
  description: copy.review.lede,
};

/* =============================================================================
   REVIEWS
   -----------------------------------------------------------------------------
   Two reviews, and that is the honest number. The current site's review page
   carries a third entry that is spam — a random string submitted through an
   open form — and it is not reproduced here.

   Two is a thin page, and the temptation is to pad it. It is not padded. What
   is added instead is the one thing a visitor actually wants when a site shows
   only two reviews: a straight statement of where they came from, and a link
   to somewhere with more of them.
   ========================================================================== */

export default function ReviewPage() {

  return (
    <>
      <PageHero
        kicker="From our guests"
        title={copy.review.h1}
        lede={copy.review.lede}
        photo={{ slug: "paon-09", alt: "The open-air restaurant at Swarma Villas" }}
        crumbs={[{ label: "Review", path: "/review" }]}
      />

      <Section tone="canvas">
        <Container>
          <ul className={clsx("grid gap-6", reviews.length > 1 && "md:grid-cols-2")}>
            {reviews.map((review, i) => (
              <li key={review.author}>
                <Reveal delay={i * 90}>
                  <figure
                    className={clsx(
                      "flex h-full flex-col p-8 md:p-10",
                      "border border-line bg-surface",
                    )}
                  >
                    <h2 className="display text-[1.5rem] leading-snug">{review.title}</h2>
                    <blockquote
                      lang={review.language}
                      className="mt-5 flex-1 text-[1.0625rem] leading-[1.75] text-muted"
                    >
                      &ldquo;{review.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-7 border-t border-line pt-5 text-[0.875rem]">
                      <span className="text-ink">{review.author}</span>
                      <span className="text-subtle"> &middot; {review.date}</span>
                      <span className="mt-1 block text-[0.8125rem] text-subtle">{review.via}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              </li>
            ))}
          </ul>

          {/* Where the numbers come from, stated rather than implied. */}
          <Reveal delay={120}>
            <div
              className={clsx(
                "mt-10 p-7 md:p-9",
                "border border-line bg-raised",
              )}
            >
              <h2 className="display text-[1.25rem]">About these reviews</h2>
              <div className="measure-prose mt-4 space-y-4 text-[0.9375rem] leading-[1.7] text-muted">
                <p>
                  These are the reviews the villa has published itself — one submitted through
                  the website and one carried across from Google. They are shown in full and
                  unedited, apart from the spelling of the English one.
                </p>
                <p>
                  Swarma Villas publishes a rating of {publishedRating.value} out of{" "}
                  {publishedRating.outOf} on its own room pages, attributed to{" "}
                  {publishedRating.source.toLowerCase()}. That is the villa&rsquo;s figure, and it
                  is repeated here as theirs rather than presented as something this site
                  measured.
                </p>
                <p>
                  If you have stayed with us, write to us and we will add yours.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href={"/contact"} tone="outline">
                  Send us your review
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="surface" size="tight">
        <Container width="narrow" className="text-center">
          <SectionHeader
            kicker="Come and see"
            title="The best review is your own"
            align="center"
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={"/houses"}>
              Look at the houses
            </Button>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
