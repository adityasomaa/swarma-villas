import { Photo } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { TLink } from "@/components/shared/Transition";
import { Button, Container, Prose, SectionHeader } from "@/components/ui";
import {
  addressOneLine,
  business,
  copy,
  cta,
  experiences,
  mapsDirectionsUrl,
  reviews,
} from "@/content/site";

/* =============================================================================
   HOME PAGE SECTIONS
   -----------------------------------------------------------------------------
   Everything below the hero. Several of these are reused on inner pages — the
   location band on /about, the call-to-action band nearly everywhere.
   ========================================================================== */

/* ------------------------------------------------------------------ about */

export function AboutBand() {
  return (
    <Container width="wide">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* A photograph beside the text, with a second, smaller one overlapping
            it on the larger screens. */}
        <Reveal className="relative">
          <Photo
            slug="property-10"
            ratio={4 / 5}
            sizes="(min-width: 1024px) 48vw, 100vw"
            alt="The veranda of one of the houses, looking out over the garden"
          />
          <div className="absolute -right-4 -bottom-8 hidden w-44 lg:block xl:w-56">
            <Photo
              slug="jungle-01"
              ratio={1}
              sizes="14rem"
              alt="The jungle valley beside the villa"
            />
          </div>
        </Reveal>

        <div>
          <SectionHeader kicker="The villa" title={copy.about.h1} align="start" className="mb-6" />
          <Prose paragraphs={copy.about.body.slice(0, 2)} />
          <Reveal delay={100} className="mt-8">
            <Button href="/about" tone="outline">
              More about Swarma Villas
            </Button>
          </Reveal>
        </div>
      </div>
    </Container>
  );
}

/* ------------------------------------------------------------ experiences */

export function ExperiencesSection() {
  return (
    <Container width="wide">
      <SectionHeader
        kicker="On the property"
        title={copy.experiences.h1}
        lede={copy.experiences.lede}
        className="mb-12 md:mb-16"
      />

      {/* A hairline grid: the gap is the line colour showing through. */}
      <ul className="grid gap-px bg-line sm:grid-cols-2">
        {experiences.map((exp, i) => (
          <li key={exp.slug} className="bg-canvas">
            <Reveal delay={i * 80}>
              <TLink
                href={`/experiences/${exp.slug}`}
                className="group flex h-full flex-col p-6 transition-colors duration-400 hover:bg-raised md:p-8"
              >
                <div className="overflow-hidden">
                  <Photo
                    slug={exp.photos[0]!}
                    ratio={16 / 10}
                    sizes="(min-width: 640px) 50vw, 100vw"
                    imgClassName="transition-transform duration-[1000ms] ease-out-quint group-hover:scale-[1.06]"
                    alt={`${exp.name} at Swarma Villas Bali`}
                  />
                </div>
                <div className="flex flex-1 flex-col pt-5">
                  <h3 className="display text-[1.5rem] leading-tight">{exp.name}</h3>
                  <p className="mt-3 flex-1 text-[0.9375rem] leading-[1.65] text-muted">
                    {exp.summary}
                  </p>
                  <span className="mt-5 inline-block text-[0.8125rem] text-accent">
                    Read more
                    <span
                      aria-hidden
                      className="ml-1.5 inline-block transition-transform duration-400 ease-out-quint group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </span>
                </div>
              </TLink>
            </Reveal>
          </li>
        ))}
      </ul>
    </Container>
  );
}

/* ---------------------------------------------------------------- reviews */

/** One quote, very large, centred, nothing else on the band. */
export function ReviewsBand() {
  const first = reviews[0];
  if (!first) return null;

  return (
    <Container width="narrow" className="text-center">
      <Reveal>
        <p className="kicker text-gold">From our guests</p>
        <blockquote className="display mt-8 text-[clamp(1.75rem,4vw,3rem)] leading-[1.12]">
          &ldquo;{first.quote}&rdquo;
        </blockquote>
        <figcaption className="mt-8 text-[0.8125rem] uppercase tracking-[0.16em] text-muted">
          {first.author} &middot; {first.date}
        </figcaption>
        <p className="mt-2 text-[0.75rem] text-subtle">{first.via}</p>
      </Reveal>
      <Reveal delay={120} className="mt-10">
        <Button href="/review" tone="outline">
          Read the reviews
        </Button>
      </Reveal>
    </Container>
  );
}

/* ---------------------------------------------------------------- gallery */

const HOME_GALLERY = [
  "pool-01",
  "gladak-terrace-01",
  "paon-03",
  "dome-bed-03",
  "waterfall-02",
  "bath-open-03",
  "hexa-ext-02",
  "food-02",
];

export function GalleryStrip() {
  return (
    <>
      <Container width="wide">
        <SectionHeader
          kicker="The property"
          title={copy.gallery.h1}
          lede={copy.gallery.lede}
          className="mb-10 md:mb-14"
        />
      </Container>

      <Container width="wide">
        <ul className="grid grid-cols-2 gap-px bg-line md:grid-cols-4">
          {HOME_GALLERY.map((slug, i) => (
            <li key={slug}>
              <Reveal delay={(i % 4) * 60}>
                <Photo slug={slug} ratio={1} sizes="(min-width: 768px) 25vw, 50vw" alt="" />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>

      <Container className="mt-10 text-center">
        <Button href="/gallery" tone="outline">
          See the full gallery
        </Button>
      </Container>
    </>
  );
}

/* --------------------------------------------------------------- location */

export function LocationBand() {
  return (
    <Container>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <SectionHeader
            kicker="Where we are"
            title={copy.location.heading}
            lede={copy.location.lede}
            align="start"
          />
          <dl className="mt-8 space-y-5 border-t border-line pt-7">
            <div>
              <dt className="kicker text-subtle">Address</dt>
              <dd className="mt-2 text-[1rem] leading-[1.7] text-muted">
                <address className="not-italic">
                  {addressOneLine}
                  <br />
                  {business.address.country}
                </address>
              </dd>
            </div>
            <div>
              <dt className="kicker text-subtle">Google plus code</dt>
              <dd className="mt-2 text-[1rem] text-muted tabular-nums">
                {business.address.plusCode}
              </dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={mapsDirectionsUrl} external>
              Get directions
            </Button>
            <Button href={cta.primary.href} tone="outline">
              {cta.primary.label}
            </Button>
          </div>
        </div>

        <Reveal>
          <Photo
            slug="ricefield-01"
            ratio={4 / 3}
            sizes="(min-width: 1024px) 48vw, 100vw"
            alt="Rice fields in Singakerta, the village the villa sits in"
          />
        </Reveal>
      </div>
    </Container>
  );
}

/* -------------------------------------------------------------------- CTA */

export function CtaBand({
  title = "Come and stay with us",
  lede = "Send your dates and we will reply on WhatsApp with availability. Booking direct means no agency fee.",
}: {
  title?: string;
  lede?: string;
}) {
  return (
    <section className="on-deep relative isolate overflow-hidden bg-deep">
      <Photo slug="pool-05" fill sizes="100vw" className="-z-10 opacity-30" alt="" />
      <Container className="relative py-20 text-center md:py-28">
        <Reveal>
          <p className="kicker text-gold">{business.tagline}</p>
          <h2 className="display measure-display mx-auto mt-5 text-[clamp(2rem,5vw,3.5rem)] leading-[1.06]">
            {title}
          </h2>
          <p className="measure-prose mx-auto mt-6 text-[1.0625rem] leading-[1.75] text-muted">
            {lede}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href={cta.primary.href}>{cta.primary.label}</Button>
            <Button href="/houses" tone="outline">
              Compare the houses
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
