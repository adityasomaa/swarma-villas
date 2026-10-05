import { Reveal } from "@/components/shared/Reveal";
import { Container, Section, SectionHeader } from "@/components/ui";
import { clsx } from "@/lib/clsx";
import type { GooglePlaceReviews } from "@/lib/reviews/google";

/* =============================================================================
   REVIEWS, AS GOOGLE HOLDS THEM
   -----------------------------------------------------------------------------
   ATTRIBUTION IS NOT DECORATION HERE. Google's terms require each review to
   carry its author's name and a link to their profile, and the text to be shown
   as written — not trimmed, not reordered, not filtered to the kind ones. So
   every review that comes back is rendered, one star rating each, Google's own
   wording for when ("2 months ago"), and the photograph Google supplies.

   The photographs come from Google's own domain, which is why they are plain
   <img> rather than the site's Photo component: they are not in the library and
   they change without notice.
   ========================================================================== */

function Stars({ rating }: { rating: number }) {
  const whole = Math.round(rating);
  return (
    <span aria-label={`${rating} out of 5`} className="text-[0.875rem] tracking-[0.18em] text-gold">
      <span aria-hidden>{"★".repeat(whole)}{"☆".repeat(Math.max(0, 5 - whole))}</span>
    </span>
  );
}

export function GoogleReviews({ data }: { data: GooglePlaceReviews }) {
  return (
    <Section tone="canvas">
      <Container>
        <SectionHeader
          kicker="From Google"
          title={
            data.rating !== null
              ? `${data.rating.toFixed(1)} out of 5`
              : "What guests write on Google"
          }
          lede={
            data.total !== null
              ? `From ${data.total.toLocaleString("en-GB")} reviews on the villa's Google listing.`
              : undefined
          }
          className="mb-10 md:mb-14"
        />

        <ul className="grid gap-6 md:grid-cols-2">
          {data.reviews.map((review, i) => (
            <li key={`${review.author}-${i}`}>
              <Reveal delay={(i % 2) * 90}>
                <figure
                  className={clsx(
                    "flex h-full flex-col p-7 md:p-9",
                    "border border-line bg-surface",
                  )}
                >
                  <Stars rating={review.rating} />
                  <blockquote
                    lang={review.languageCode}
                    className="mt-4 flex-1 text-[1.0625rem] leading-[1.75] text-muted"
                  >
                    &ldquo;{review.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                    {review.photoUrl && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={review.photoUrl}
                        alt=""
                        width={36}
                        height={36}
                        loading="lazy"
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                      />
                    )}
                    <span className="text-[0.875rem]">
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
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-[0.8125rem] leading-relaxed text-subtle">
          Reviews and ratings from Google.{" "}
          {data.mapsUri && (
            <a
              href={data.mapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-ink"
            >
              See the listing on Google Maps
            </a>
          )}
          . Google returns a selection of up to five reviews for a listing and chooses which;
          the full set is on Google.
        </p>
      </Container>
    </Section>
  );
}
