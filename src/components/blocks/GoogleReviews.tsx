import { Button, Container, Section, SectionHeader } from "@/components/ui";
import { clsx } from "@/lib/clsx";
import type { GooglePlaceReviews, GoogleReview } from "@/lib/reviews/google";

/* =============================================================================
   REVIEWS, RUNNING
   -----------------------------------------------------------------------------
   One slow row of review cards, drifting left, with the whole set repeated once
   so the row never shows its end.

   WHY A REPEAT RATHER THAN A CAROUSEL. There is no state, no timer and no
   JavaScript: one CSS animation moves one element, which is why this costs
   nothing on a phone and keeps working if the bundle fails. The cost is that
   every card exists twice in the DOM, so the second copy is aria-hidden — a
   screen reader reads the ten reviews once, not twice.

   ATTRIBUTION IS NOT DECORATION. These reviews are their authors' writing. Each
   card carries the name, links to the author's Google profile where there is
   one, and says plainly where it came from. The text is reproduced as written;
   see src/content/google-reviews.ts for the two mechanical fixes applied and
   why nothing else was.

   The cards are clamped to eight lines so the row keeps one height. Clamping is
   visual only: the full review is in the markup, and the link underneath goes
   to all of them.
   ========================================================================== */

function Stars({ rating }: { rating: number }) {
  const whole = Math.round(rating);
  return (
    <span aria-label={`${rating} out of 5`} className="text-[0.8125rem] tracking-[0.18em] text-gold">
      <span aria-hidden>
        {"★".repeat(whole)}
        {"☆".repeat(Math.max(0, 5 - whole))}
      </span>
    </span>
  );
}

function Card({ review }: { review: GoogleReview }) {
  return (
    <figure
      className={clsx(
        "flex h-full w-[min(82vw,23rem)] flex-col p-7 md:p-8",
        "border border-line bg-surface",
      )}
    >
      <Stars rating={review.rating} />
      <blockquote
        lang={review.languageCode}
        className="mt-4 line-clamp-8 flex-1 text-[1rem] leading-[1.7] text-muted"
      >
        &ldquo;{review.text}&rdquo;
      </blockquote>
      <figcaption className="mt-6 border-t border-line pt-5 text-[0.875rem]">
        {review.authorUrl ? (
          <a
            href={review.authorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline-offset-4 hover:underline"
          >
            {review.author}
          </a>
        ) : (
          <span className="text-ink">{review.author}</span>
        )}
        {review.relativeTime && (
          <span className="text-subtle"> &middot; {review.relativeTime}</span>
        )}
      </figcaption>
    </figure>
  );
}

export function GoogleReviews({
  data,
  capturedOn,
}: {
  data: GooglePlaceReviews;
  /** Set when the reviews were transcribed rather than read live from Google. */
  capturedOn?: string;
}) {
  const { reviews } = data;

  return (
    <Section tone="canvas">
      <Container>
        <SectionHeader
          kicker="From Google"
          title={data.rating !== null ? `${data.rating.toFixed(1)} out of 5` : "What guests write on Google"}
          lede={
            data.total !== null
              ? `From ${data.total.toLocaleString("en-GB")} reviews on the villa's Google listing.`
              : undefined
          }
          className="mb-10 md:mb-14"
        />
      </Container>

      {/* Full bleed: the row should run off both edges, not stop at the gutter. */}
      <div className="marquee">
        <ul className="marquee__track">
          {reviews.map((review, i) => (
            <li key={`a-${review.author}-${i}`} className="flex">
              <Card review={review} />
            </li>
          ))}
          {/* The repeat that makes the row endless. Not read aloud, not counted. */}
          {reviews.map((review, i) => (
            <li key={`b-${review.author}-${i}`} aria-hidden className="flex marquee__repeat">
              <Card review={review} />
            </li>
          ))}
        </ul>
      </div>

      <Container>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          {data.mapsUri && (
            <Button href={data.mapsUri} tone="outline" external>
              See all reviews on Google
            </Button>
          )}
          <p className="text-[0.8125rem] leading-relaxed text-subtle">
            Reviews and ratings from Google, shown as written.
            {capturedOn && ` Copied from the listing in ${capturedOn}; the score there moves.`}
          </p>
        </div>
      </Container>
    </Section>
  );
}
