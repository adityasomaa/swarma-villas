import { Photo, photosIn } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { TLink } from "@/components/shared/Transition";
import { Button, Container, Prose, SectionHeader } from "@/components/ui";
import { addressOneLine, business, copy, cta, experiences, mapsDirectionsUrl, reviews } from "@/content/site";
import { clsx } from "@/lib/clsx";
import { href, type TemplateId } from "@/lib/templates";

/* =============================================================================
   HOME PAGE SECTIONS
   -----------------------------------------------------------------------------
   Everything below the hero. These branch on the template where the structure
   genuinely differs and share it where it does not — a review quote is a review
   quote in all three directions; a photograph grid is not.
   ========================================================================== */

/* ------------------------------------------------------------------ about */

export function AboutBand({ tpl }: { tpl: TemplateId }) {
  const paragraphs = copy.about.body.slice(0, 2);

  if (tpl === "t3") {
    // Paon: two even columns under a centred header. Hotel-brochure structure.
    return (
      <Container>
        <SectionHeader
          tpl={tpl}
          kicker="The villa"
          title={copy.about.h1}
          lede={copy.about.lede}
          className="mb-12"
        />
        <Reveal>
          <div className="grid gap-8 border-t border-line pt-10 md:grid-cols-2 md:gap-12">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-[1.0625rem] leading-[1.8] text-muted">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={120} className="mt-12">
          <div className="grid gap-4 sm:grid-cols-3">
            {["gladak-ext-01", "hexa-ext-01", "dome-lounge-01"].map((slug) => (
              <Photo
                key={slug}
                slug={slug}
                ratio={4 / 5}
                sizes="(min-width: 640px) 33vw, 100vw"
                alt=""
              />
            ))}
          </div>
        </Reveal>
        <div className="mt-10 text-center">
          <Button tpl={tpl} href={href(tpl, "/about")} tone="outline">
            More about Swarma Villas
          </Button>
        </div>
      </Container>
    );
  }

  // Amber and Riverstone: a photograph beside the text, with a second,
  // smaller photograph overlapping it on the larger screens.
  return (
    <Container width={tpl === "t2" ? "wide" : "default"}>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <Photo
            slug="property-10"
            ratio={tpl === "t2" ? 4 / 5 : 1}
            rounded={tpl === "t1" ? "md" : "none"}
            sizes="(min-width: 1024px) 48vw, 100vw"
            alt="The veranda of one of the houses, looking out over the garden"
          />
          <div className="absolute -bottom-8 -right-4 hidden w-44 lg:block xl:w-56">
            <Photo
              slug="jungle-01"
              ratio={1}
              rounded={tpl === "t1" ? "sm" : "none"}
              sizes="14rem"
              className={clsx(tpl === "t1" && "ring-8 ring-canvas")}
              alt="The jungle valley beside the villa"
            />
          </div>
        </Reveal>

        <div>
          <SectionHeader
            tpl={tpl}
            kicker="The villa"
            title={copy.about.h1}
            align="start"
            className="mb-6"
          />
          <Prose paragraphs={paragraphs} />
          <Reveal delay={100} className="mt-8">
            <Button tpl={tpl} href={href(tpl, "/about")} tone="outline">
              More about Swarma Villas
            </Button>
          </Reveal>
        </div>
      </div>
    </Container>
  );
}

/* ------------------------------------------------------------ experiences */

export function ExperiencesSection({ tpl }: { tpl: TemplateId }) {
  return (
    <Container width={tpl === "t2" ? "wide" : "default"}>
      <SectionHeader
        tpl={tpl}
        kicker="On the property"
        title={copy.experiences.h1}
        lede={copy.experiences.lede}
        className="mb-12 md:mb-16"
      />

      <ul
        className={clsx(
          "grid gap-5",
          tpl === "t1" && "sm:grid-cols-2 lg:grid-cols-4",
          tpl === "t2" && "gap-px bg-line sm:grid-cols-2",
          tpl === "t3" && "gap-8 sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {experiences.map((exp, i) => (
          <li key={exp.slug} className={clsx(tpl === "t2" && "bg-canvas")}>
            <Reveal delay={i * 80}>
              <TLink
                href={href(tpl, `/experiences/${exp.slug}`)}
                className={clsx(
                  "group flex h-full flex-col",
                  tpl === "t1" && "overflow-hidden r-md bg-surface transition-transform duration-500 ease-out-quint hover:-translate-y-1",
                  tpl === "t2" && "p-6 transition-colors duration-400 hover:bg-raised md:p-8",
                )}
              >
                <div className="overflow-hidden">
                  <Photo
                    slug={exp.photos[0]!}
                    ratio={tpl === "t2" ? 16 / 10 : 4 / 5}
                    rounded="none"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    imgClassName="transition-transform duration-[1000ms] ease-out-quint group-hover:scale-[1.06]"
                    alt={`${exp.name} at Swarma Villas Bali`}
                  />
                </div>
                <div className={clsx("flex flex-1 flex-col", tpl === "t1" ? "p-5" : "pt-5")}>
                  <h3
                    className={clsx(
                      "display leading-tight",
                      tpl === "t2" ? "text-[1.5rem]" : "text-[1.25rem]",
                    )}
                  >
                    {exp.name}
                  </h3>
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

export function ReviewsBand({ tpl }: { tpl: TemplateId }) {
  const first = reviews[0];
  if (!first) return null;

  if (tpl === "t2") {
    // Riverstone: one quote, very large, centred, nothing else on the band.
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
          <Button tpl={tpl} href={href(tpl, "/review")} tone="outline">
            Read the reviews
          </Button>
        </Reveal>
      </Container>
    );
  }

  return (
    <Container>
      <SectionHeader
        tpl={tpl}
        kicker="From our guests"
        title={copy.review.h1}
        className="mb-10 md:mb-14"
      />
      <ul className={clsx("grid gap-6", reviews.length > 1 && "md:grid-cols-2")}>
        {reviews.map((review, i) => (
          <li key={review.author}>
            <Reveal delay={i * 90}>
              <figure
                className={clsx(
                  "flex h-full flex-col p-7 md:p-8",
                  tpl === "t1" ? "r-md bg-surface" : "border border-line bg-surface",
                )}
              >
                <h3 className="display text-[1.25rem] leading-snug">{review.title}</h3>
                <blockquote
                  lang={review.language}
                  className="mt-4 flex-1 text-[1rem] leading-[1.75] text-muted"
                >
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-line pt-4 text-[0.8125rem] text-subtle">
                  <span className="text-ink">{review.author}</span> &middot; {review.date}
                  <span className="mt-1 block">{review.via}</span>
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
      <div className={clsx("mt-10", tpl === "t3" && "text-center")}>
        <Button tpl={tpl} href={href(tpl, "/review")} tone="outline">
          Read the reviews
        </Button>
      </div>
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

export function GalleryStrip({ tpl }: { tpl: TemplateId }) {
  return (
    <>
      <Container width={tpl === "t2" ? "wide" : "default"}>
        <SectionHeader
          tpl={tpl}
          kicker="The property"
          title={copy.gallery.h1}
          lede={copy.gallery.lede}
          className="mb-10 md:mb-14"
        />
      </Container>

      <Container width="wide">
        <ul
          className={clsx(
            "grid gap-3",
            tpl === "t1" && "grid-cols-2 gap-4 md:grid-cols-4",
            tpl === "t2" && "grid-cols-2 gap-px bg-line md:grid-cols-4",
            tpl === "t3" && "grid-cols-2 gap-2 md:grid-cols-4",
          )}
        >
          {HOME_GALLERY.map((slug, i) => (
            <li key={slug} className={clsx(i === 0 && tpl === "t1" && "col-span-2 row-span-2")}>
              <Reveal delay={(i % 4) * 60}>
                <Photo
                  slug={slug}
                  ratio={i === 0 && tpl === "t1" ? 1 : 1}
                  rounded={tpl === "t1" ? "sm" : "none"}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  alt=""
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>

      <Container className={clsx("mt-10", tpl !== "t1" && "text-center")}>
        <Button tpl={tpl} href={href(tpl, "/gallery")} tone="outline">
          See the full gallery
        </Button>
      </Container>
    </>
  );
}

/* --------------------------------------------------------------- location */

export function LocationBand({ tpl }: { tpl: TemplateId }) {
  return (
    <Container>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <SectionHeader
            tpl={tpl}
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
            <Button tpl={tpl} href={mapsDirectionsUrl} external>
              Get directions
            </Button>
            <Button tpl={tpl} href={href(tpl, cta.primary.href)} tone="outline">
              {cta.primary.label}
            </Button>
          </div>
        </div>

        <Reveal>
          <Photo
            slug="ricefield-01"
            ratio={4 / 3}
            rounded={tpl === "t1" ? "md" : "none"}
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
  tpl,
  title = "Come and stay with us",
  lede = "Send your dates and we will reply on WhatsApp with availability. Booking direct means no agency fee.",
}: {
  tpl: TemplateId;
  title?: string;
  lede?: string;
}) {
  return (
    <section className="on-deep relative isolate overflow-hidden bg-deep">
      <Photo
        slug="pool-05"
        ratio={16 / 9}
        sizes="100vw"
        className="absolute inset-0 -z-10 h-full w-full opacity-30"
        alt=""
      />
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
            <Button tpl={tpl} href={href(tpl, cta.primary.href)}>
              {cta.primary.label}
            </Button>
            <Button tpl={tpl} href={href(tpl, "/houses")} tone="outline">
              Compare the houses
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/** Used by /gallery — the full library, grouped. */
export { photosIn };
