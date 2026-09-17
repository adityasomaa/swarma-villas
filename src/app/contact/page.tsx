import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHero } from "@/components/blocks/PageHero";
import { BookingForm } from "@/components/form/BookingForm";
import { Reveal } from "@/components/shared/Reveal";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Container, Section, SectionHeader } from "@/components/ui";
import {
  addressOneLine,
  bookingTerms,
  business,
  copy,
  mapsDirectionsUrl,
} from "@/content/site";
import { clsx } from "@/lib/clsx";

export const metadata: Metadata = {
  title: "Book your stay",
  description: copy.contact.lede,
};

export default function ContactPage() {

  const checkInOut = bookingTerms.sections.find((s) => s.title === "Check-in and check-out times");

  return (
    <>
      <PageHero
        kicker="Book direct"
        title={copy.contact.h1}
        lede={copy.contact.lede}
        crumbs={[{ label: "Contact", path: "/contact" }]}
      />

      <Section tone="canvas">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
            {/* ------------------------------------------------------ form */}
            <div>
              {/*
                The form reads ?house= from the URL on the client, which is what
                keeps this page a static document. That needs a Suspense
                boundary — without one, useSearchParams opts the whole route
                into on-demand rendering and its prefetch is cancelled from
                every page that links here.
              */}
              <Suspense fallback={<FormSkeleton />}>
                <BookingForm />
              </Suspense>
            </div>

            {/* --------------------------------------------------- details */}
            <div className="flex flex-col gap-6">
              <Reveal>
                <div
                  className={clsx(
                    "p-7 md:p-8",
                    "border border-line bg-surface",
                  )}
                >
                  <h2 className="display text-[1.375rem]">Rather just message us?</h2>
                  <p className="mt-3 text-[0.9375rem] leading-[1.7] text-muted">
                    {copy.contact.blurb}
                  </p>
                  <div className="mt-6">
                    <WhatsAppButton action="Contact page — Ask on WhatsApp" />
                  </div>

                  <dl className="mt-7 space-y-4 border-t border-line pt-6 text-[0.9375rem]">
                    <div>
                      <dt className="kicker text-subtle">Reservations</dt>
                      <dd className="mt-1.5">
                        <a
                          href={`tel:${business.phoneE164}`}
                          className="text-ink underline-offset-4 hover:underline"
                        >
                          {business.phoneDisplay}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="kicker text-subtle">WhatsApp</dt>
                      <dd className="mt-1.5 text-muted">{business.whatsappDisplay}</dd>
                    </div>
                    <div>
                      <dt className="kicker text-subtle">Email</dt>
                      <dd className="mt-1.5">
                        <a
                          href={`mailto:${business.email}`}
                          className="text-ink underline-offset-4 hover:underline"
                        >
                          {business.email}
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </Reveal>

              <Reveal delay={90}>
                <div
                  className={clsx(
                    "p-7 md:p-8",
                    "border border-line bg-raised",
                  )}
                >
                  <h2 className="display text-[1.375rem]">Getting here</h2>
                  <address className="mt-3 text-[0.9375rem] leading-[1.7] text-muted not-italic">
                    {addressOneLine}
                    <br />
                    {business.address.country}
                  </address>
                  <p className="mt-3 text-[0.875rem] text-subtle">
                    Google plus code {business.address.plusCode}
                  </p>
                  <a
                    href={mapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-block border-b border-current pb-0.5 text-[0.875rem] text-accent"
                  >
                    Open directions in Google Maps
                  </a>
                </div>
              </Reveal>

              {checkInOut && (
                <Reveal delay={140}>
                  <div
                    className={clsx(
                      "p-7 md:p-8",
                      "border border-line bg-surface",
                    )}
                  >
                    <h2 className="display text-[1.375rem]">{checkInOut.title}</h2>
                    <ul className="mt-4 space-y-2.5">
                      {checkInOut.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-baseline gap-3 text-[0.9375rem] leading-[1.6] text-muted"
                        >
                          <span
                            aria-hidden
                            className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- map */}
      <Section tone="surface" size="tight">
        <Container>
          <SectionHeader
            kicker="Where we are"
            title={copy.location.heading}
            lede={copy.location.lede}
            className="mb-8"
          />
          {/*
            A link to Google Maps rather than an embedded map. An embed loads
            Google's tiles and cookies on every visit to this page, whether or
            not anyone looks at it — the same reason the video on the home page
            is a facade.
          */}
          <a
            href={mapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              "group flex flex-col gap-4 p-7 transition-colors duration-300 sm:flex-row sm:items-center sm:justify-between md:p-9",
              "border border-line bg-canvas hover:bg-raised",
            )}
          >
            <span>
              <span className="display block text-[1.25rem]">Open in Google Maps</span>
              <span className="mt-2 block text-[0.9375rem] text-muted">{addressOneLine}</span>
            </span>
            <span className="text-[0.8125rem] uppercase tracking-[0.16em] text-accent">
              Directions
              <span
                aria-hidden
                className="ml-2 inline-block transition-transform duration-400 ease-out-quint group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </span>
          </a>
        </Container>
      </Section>
    </>
  );
}

/** Matches the form's height closely enough that nothing jumps when it swaps in. */
function FormSkeleton() {
  return (
    <div aria-hidden className="grid gap-5">
      {[64, 64, 64, 64, 88, 120, 52].map((h, i) => (
        <div key={i} className="r-sm bg-raised" style={{ height: h }} />
      ))}
    </div>
  );
}
