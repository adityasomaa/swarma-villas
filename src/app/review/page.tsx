import type { Metadata } from "next";

import { GoogleReviews } from "@/components/blocks/GoogleReviews";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBand } from "@/components/blocks/home";
import { Reveal } from "@/components/shared/Reveal";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Button, Container, Section, SectionHeader } from "@/components/ui";
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
   Google first when Google answers, the villa's own underneath.

   The villa asked for their Google reviews on the page. That needs a Places API
   key, and until one is set this page is exactly what it was: the two reviews
   they published themselves. With a key, Google's reviews lead and the one
   review submitted through their own website stays below them — the other one
   was carried across from Google by hand, and showing it beside the live ones
   would print the same thing twice.

   DAILY, NOT PER VISIT. Google is called once a revalidation rather than once a
   visitor: cheaper, faster, and inside Google's rules about how long their
   review content may be held.
   ========================================================================== */

export const revalidate = 86400;

export default async function ReviewPage() {
  const google = await fetchGoogleReviews();
  const own = google
    ? reviews.filter((r) => !/google/i.test(r.via))
    : reviews;

  return (
    <>
      <PageHero
        kicker="From our guests"
        title={copy.review.h1}
        lede={copy.review.lede}
        photo={{ slug: "paon-09", alt: "The open air restaurant at Swarma Villas" }}
        crumbs={[{ label: "Review", path: "/review" }]}
      />

      {google && <GoogleReviews data={google} />}

      <Section tone={google ? "surface" : "canvas"}>
        <Container>
          {google && (
            <SectionHeader
              kicker="Sent to us directly"
              title="Written to the villa"
              className="mb-10 md:mb-14"
            />
          )}
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
                {google ? (
                  <p>
                    The reviews above come straight from the villa&rsquo;s Google listing and
                    are shown as written. Below them is a review sent to the villa directly,
                    which is not on Google and so does not count towards the score.
                  </p>
                ) : (
                  <>
                    <p>
                      These are the reviews the villa has published itself — one submitted
                      through the website and one carried across from Google. They are shown in
                      full and unedited, apart from the spelling of the English one. No overall
                      score is shown, because there is no single platform behind these two to
                      average.
                    </p>
                    <p>
                      Every review guests have left, and the rating they add up to, is on the
                      villa&rsquo;s Google listing.
                    </p>
                  </>
                )}
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
