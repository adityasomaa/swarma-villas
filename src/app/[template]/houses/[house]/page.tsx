import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { idFromSegment } from "@/app/[template]/layout";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBand } from "@/components/blocks/home";
import { Gallery } from "@/components/blocks/Gallery";
import { JsonLd } from "@/components/shared/JsonLd";
import { Photo } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { TLink } from "@/components/shared/Transition";
import { Button, Container, Prose, Section, SectionHeader, Spec } from "@/components/ui";
import { houseBySlug, houses, publishedRating } from "@/content/site";
import { clsx } from "@/lib/clsx";
import { formatIDR } from "@/lib/format";
import { accommodationJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { href, TEMPLATE_LIST } from "@/lib/templates";

/**
 * `dynamicParams = false` matters here beyond the 404 rule. Without it an
 * invented slug renders a client-side error shell with no h1 and a 200 status —
 * a page that looks broken and is indexable. With it, /houses/anything-else is
 * a real 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return TEMPLATE_LIST.flatMap((t) =>
    houses.map((h) => ({ template: t.basePath.slice(1), house: h.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ house: string }>;
}): Promise<Metadata> {
  const { house: slug } = await params;
  const house = houseBySlug(slug);
  if (!house) return {};
  return {
    title: house.name,
    description: `${house.distinction}. ${house.bed}, up to ${house.maxGuests} guests, ${house.sizeSqm} sqm. From ${formatIDR(house.priceFromIDR)} per night at Swarma Villas Bali, Ubud.`,
  };
}

export default async function HousePage({
  params,
}: {
  params: Promise<{ template: string; house: string }>;
}) {
  const { template, house: slug } = await params;
  const tpl = idFromSegment(template);
  const house = houseBySlug(slug);
  if (!tpl || !house) notFound();

  const others = houses.filter((h) => h.slug !== house.slug);
  const [lead, ...rest] = house.photos;
  const canonicalPath = href(tpl, `/houses/${house.slug}`);
  const jsonLd = accommodationJsonLd(house.slug, canonicalPath);

  return (
    <>
      <PageHero
        tpl={tpl}
        kicker="The houses"
        title={house.name}
        lede={house.distinction}
        photo={{ slug: lead!, alt: `Inside the ${house.name} at Swarma Villas Bali` }}
        crumbs={[
          { label: "Houses", path: "/houses" },
          { label: house.name, path: `/houses/${house.slug}` },
        ]}
      />

      {/* ------------------------------------------- description + booking card */}
      <Section tpl={tpl} tone="canvas">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <Prose paragraphs={house.body} size="lead" />

              <Reveal className="mt-12">
                <h2 className="display text-[1.5rem]">What is in the house</h2>
                <ul
                  className={clsx(
                    "mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2",
                    tpl === "t3" && "border-t border-line pt-6",
                  )}
                >
                  {house.amenities.map((item) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-3 text-[0.9375rem] leading-[1.6] text-muted"
                    >
                      <span aria-hidden className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* The rate card. Sticky on desktop so the price and the button stay
                with you while you read four paragraphs of description. */}
            <Reveal delay={100}>
              <aside
                className={clsx(
                  "lg:sticky lg:top-[calc(var(--switcher-h)+7rem)]",
                  "p-7 md:p-8",
                  tpl === "t1" && "r-md bg-surface shadow-[0_20px_60px_-40px_rgba(22,19,12,0.5)]",
                  tpl !== "t1" && "border border-line bg-surface",
                )}
              >
                <p className="kicker text-subtle">Start from</p>
                <p className="display mt-2 text-[2.25rem] leading-none">
                  {formatIDR(house.priceFromIDR)}
                </p>
                <p className="mt-2 text-[0.875rem] text-muted">per night</p>

                <dl className="mt-7 space-y-4 border-t border-line pt-6">
                  <Spec tpl={tpl} label="Bed" value={house.bed} />
                  <Spec tpl={tpl} label="Sleeps" value={`Up to ${house.maxGuests} guests`} />
                  <Spec tpl={tpl} label="Floor area" value={`${house.sizeSqm} sqm`} />
                  <Spec tpl={tpl} label="Check in / out" value="14:00 / 12:00" />
                </dl>

                <div className="mt-7 flex flex-col gap-3">
                  <Button
                    tpl={tpl}
                    href={`${href(tpl, "/contact")}?house=${house.slug}`}
                    className="w-full"
                  >
                    Request these dates
                  </Button>
                  <Button tpl={tpl} href={href(tpl, "/term-condition")} tone="quiet">
                    Read the booking terms
                  </Button>
                </div>

                <p className="mt-6 border-t border-line pt-5 text-[0.8125rem] leading-relaxed text-subtle">
                  The villa publishes a {publishedRating.value} out of {publishedRating.outOf}{" "}
                  rating for this house ({publishedRating.source}). This page shows no
                  availability — send your dates and we will reply.
                </p>
              </aside>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------ gallery */}
      {rest.length > 0 && (
        <Section tpl={tpl} tone="surface">
          <Container width={tpl === "t2" ? "wide" : "default"}>
            <SectionHeader
              tpl={tpl}
              kicker="Look around"
              title={`The ${house.name} in photographs`}
              className="mb-10 md:mb-14"
            />
            <Gallery tpl={tpl} slugs={rest} />
          </Container>
        </Section>
      )}

      {/* --------------------------------------------------------- the others */}
      <Section tpl={tpl} tone="canvas">
        <Container>
          <SectionHeader
            tpl={tpl}
            kicker="The other two"
            title="Or stay somewhere else on the property"
            className="mb-10 md:mb-14"
          />
          <ul className="grid gap-6 sm:grid-cols-2">
            {others.map((other, i) => (
              <li key={other.slug}>
                <Reveal delay={i * 90}>
                  <TLink
                    href={href(tpl, `/houses/${other.slug}`)}
                    className={clsx(
                      "group flex h-full flex-col overflow-hidden",
                      tpl === "t1" && "r-md bg-surface",
                      tpl !== "t1" && "border border-line bg-surface",
                    )}
                  >
                    <Photo
                      slug={other.photos[0]!}
                      ratio={16 / 9}
                      sizes="(min-width: 640px) 50vw, 100vw"
                      imgClassName="transition-transform duration-[900ms] ease-out-quint group-hover:scale-[1.05]"
                      alt={`${other.name} at Swarma Villas Bali`}
                    />
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="display text-[1.375rem] leading-tight">{other.name}</h3>
                      <p className="mt-2 flex-1 text-[0.9375rem] leading-[1.6] text-muted">
                        {other.distinction}
                      </p>
                      <p className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
                        <span className="display text-[1.25rem]">
                          {formatIDR(other.priceFromIDR)}
                        </span>
                        <span className="text-[0.8125rem] text-accent">
                          per night
                          <span
                            aria-hidden
                            className="ml-2 inline-block transition-transform duration-400 ease-out-quint group-hover:translate-x-1"
                          >
                            &rarr;
                          </span>
                        </span>
                      </p>
                    </div>
                  </TLink>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand
        tpl={tpl}
        title={`Stay in the ${house.name}`}
        lede="Send your dates and we will reply on WhatsApp. Booking direct means no agency fee."
      />

      {jsonLd && <JsonLd data={jsonLd} />}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: href(tpl) },
          { name: "Houses", path: href(tpl, "/houses") },
          { name: house.name, path: canonicalPath },
        ])}
      />
    </>
  );
}
