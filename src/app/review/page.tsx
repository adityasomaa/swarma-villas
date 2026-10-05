import type { Metadata } from "next";

import { GoogleReviews } from "@/components/blocks/GoogleReviews";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBand } from "@/components/blocks/home";
import { Reveal } from "@/components/shared/Reveal";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Button, Container, Section, SectionHeader } from "@/components/ui";
import { CAPTURED, googleReviewsFallback } from "@/content/google-reviews";
import { copy, googleListingUrl, reviews } from "@/content/site";
import { clsx } from "@/lib/clsx";
import { fetchGoogleReviews } from "@/lib/reviews/google";

export const metadata: Metadata = {
  title: "Guest reviews",
  description: copy.review.lede,
};

/* =============================================================================
   REVIEWS
   -----------------------------------------------------------------------------
   Google's reviews lead; the one sent to the villa directly sits underneath.

   TWO SOURCES, ONE SHAPE. Normally these come from the transcribed set in
   src/content/google-reviews.ts. If a Places API key is ever set they come from
   Google itself instead, live, and the page does not change in any other way —
   both are the same type, so the row below does not know or care which it got.
   The only visible difference is the line admitting when a transcribed set was
   copied, since that one goes stale and the live one cannot.

   The review submitted through the villa's own website is not on Google and so
   is not part of the score. It is kept separate and labelled rather than mixed
   in, because a visitor counting stars should be able to count the same ones
   Google counted.
   ========================================================================== */

export const revalidate = 86400;

export default async function ReviewPage() {
  const live = await fetchGoogleReviews();
  const google = live ?? googleReviewsFallback;
  /* Morgane's review is in the Google set now; showing it here as well would
     print the same words twice under two different headings. */
  const own = reviews.filter((r) => !/google/i.test(r.via));

  return (
    <>
      <PageHero
        kicker="From our guests"
        title={copy.review.h1}
        lede={copy.review.lede}
        photo={{ slug: "paon-09", alt: "The open air restaurant at Swarma Villas" }}
        crumbs={[{ label: "Review", path: "/review" }]}
      />

      <GoogleReviews data={google} capturedOn={live ? undefined : CAPTURED} />

      <Section tone="surface">
        <Container>
          <SectionHeader
            kicker="Sent to us directly"
            title="Written to the villa"
            className="mb-10 md:mb-14"
          />
          <ul className={clsx("grid gap-6", own.length > 1 && "md:grid-cols-2")}>
            {own.map((review, i) => (
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
                  The reviews in the row above are from the villa&rsquo;s Google listing and are
                  shown as written, each one under the name of the guest who wrote it. Google
                  holds many more than ten; the link above goes to all of them.
                </p>
                <p>
                  The review below was sent to the villa directly. It is not on Google, and so
                  it does not count towards the score.
                </p>
                <p>
                  If you have stayed with us, write to us and we will add yours.
                </p>
              </div>
              {/*
                This said "Send us your review" and went to /contact, which is
                the booking enquiry form — a guest offering a review landed on
                a form asking for their dates. It goes to WhatsApp now, which
                is what the sentence above it promises.
              */}
              <div className="mt-7 flex flex-wrap gap-3">
                <WhatsAppButton
                  action="Review page — Send a review"
                  opening="Hello Swarma Villas, I would like to leave a review of my stay."
                  label="Send us your review"
                />
                {/*
                  With Google's own reviews above there is nothing left to read
                  here, so the link is an invitation to write one. Without them
                  it is the only way to the rest, and says so.
                */}
                <Button href={googleListingUrl} tone="outline" external>
                  {google ? "Review us on Google" : "Read our reviews on Google"}
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
