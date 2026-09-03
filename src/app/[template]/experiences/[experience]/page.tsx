import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { idFromSegment } from "@/app/[template]/layout";
import { Gallery } from "@/components/blocks/Gallery";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBand } from "@/components/blocks/home";
import { JsonLd } from "@/components/shared/JsonLd";
import { Reveal } from "@/components/shared/Reveal";
import { TLink } from "@/components/shared/Transition";
import { Container, Prose, Section, SectionHeader } from "@/components/ui";
import { experienceBySlug, experiences } from "@/content/site";
import { clsx } from "@/lib/clsx";
import { breadcrumbJsonLd } from "@/lib/seo";
import { href, TEMPLATE_LIST } from "@/lib/templates";

export const dynamicParams = false;

export function generateStaticParams() {
  return TEMPLATE_LIST.flatMap((t) =>
    experiences.map((e) => ({ template: t.basePath.slice(1), experience: e.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ experience: string }>;
}): Promise<Metadata> {
  const { experience: slug } = await params;
  const exp = experienceBySlug(slug);
  if (!exp) return {};
  return { title: exp.name, description: exp.summary };
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ template: string; experience: string }>;
}) {
  const { template, experience: slug } = await params;
  const tpl = idFromSegment(template);
  const exp = experienceBySlug(slug);
  if (!tpl || !exp) notFound();

  const [lead, ...rest] = exp.photos;
  const others = experiences.filter((e) => e.slug !== exp.slug);
  const singleList = exp.lists?.length === 1 ? exp.lists[0] : undefined;

  return (
    <>
      <PageHero
        tpl={tpl}
        kicker="Experiences"
        title={exp.name}
        lede={exp.summary}
        photo={{ slug: lead!, alt: `${exp.name} at Swarma Villas Bali` }}
        crumbs={[
          { label: "Experiences", path: "/experiences" },
          { label: exp.name, path: `/experiences/${exp.slug}` },
        ]}
      />

      <Section tpl={tpl} tone="canvas">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
            <Prose paragraphs={exp.body} size="lead" />

            {(exp.facts || singleList) && (
              <Reveal delay={100}>
                <aside
                  className={clsx(
                    "p-7 md:p-8",
                    "lg:sticky lg:top-[calc(var(--switcher-h)+7rem)]",
                    tpl === "t1" ? "r-md bg-surface" : "border border-line bg-surface",
                  )}
                >
                  {exp.facts && (
                    <dl className="space-y-4">
                      {exp.facts.map((fact) => (
                        <div key={fact.label}>
                          <dt className="kicker text-subtle">{fact.label}</dt>
                          <dd className="mt-1.5 text-[1rem] text-ink">{fact.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {/*
                    One labelled list — "what to bring" — belongs beside the
                    facts. Several lists are the packages, and they get their own
                    section below where there is room for them.
                  */}
                  {singleList && (
                    <div className={clsx(exp.facts && "mt-7 border-t border-line pt-6")}>
                      <h2 className="display text-[1.25rem]">{singleList.title}</h2>
                      <ul className="mt-4 space-y-2.5">
                        {singleList.items.map((item) => (
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
                  )}
                </aside>
              </Reveal>
            )}
          </div>
        </Container>
      </Section>

      {exp.lists && exp.lists.length > 1 && (
        <Section tpl={tpl} tone="surface">
          <Container>
            <SectionHeader
              tpl={tpl}
              kicker="What is included"
              title="The packages"
              className="mb-10 md:mb-14"
            />
            <ul
              className={clsx(
                "grid gap-px bg-line sm:grid-cols-2",
                tpl === "t1" && "gap-6 bg-transparent",
              )}
            >
              {exp.lists.map((list, i) => (
                <li key={list.title} className={clsx(tpl !== "t1" && "bg-surface")}>
                  <Reveal delay={i * 80}>
                    <div className={clsx("h-full p-7 md:p-9", tpl === "t1" && "r-md bg-canvas")}>
                      <span className="kicker text-gold tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="display mt-4 text-[1.5rem] leading-snug">{list.title}</h3>
                      <ul className="mt-5 space-y-2.5">
                        {list.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-baseline gap-3 text-[0.9375rem] leading-[1.65] text-muted"
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
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.8125rem] text-subtle">
              Package prices are not published on this site. Ask us and we will quote for your
              dates and the size of your party.
            </p>
          </Container>
        </Section>
      )}

      {rest.length > 0 && (
        <Section tpl={tpl} tone="canvas">
          <Container width={tpl === "t2" ? "wide" : "default"}>
            <SectionHeader
              tpl={tpl}
              kicker="Look around"
              title={exp.name}
              className="mb-10 md:mb-14"
            />
            <Gallery tpl={tpl} slugs={rest} />
          </Container>
        </Section>
      )}

      <Section tpl={tpl} tone="surface" size="tight">
        <Container>
          <SectionHeader tpl={tpl} kicker="Also here" title="Other experiences" className="mb-8" />
          <ul className="grid gap-4 sm:grid-cols-3">
            {others.map((other) => (
              <li key={other.slug}>
                <TLink
                  href={href(tpl, `/experiences/${other.slug}`)}
                  className={clsx(
                    "group flex h-full flex-col p-6 transition-colors duration-300",
                    tpl === "t1"
                      ? "r-md bg-canvas hover:bg-raised"
                      : "border border-line bg-canvas hover:bg-raised",
                  )}
                >
                  <h3 className="display text-[1.125rem] leading-snug">{other.name}</h3>
                  <p className="mt-2 flex-1 text-[0.875rem] leading-[1.6] text-muted">
                    {other.summary}
                  </p>
                  <span className="mt-4 text-[0.8125rem] text-accent">
                    Read more
                    <span
                      aria-hidden
                      className="ml-1.5 inline-block transition-transform duration-400 ease-out-quint group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </span>
                </TLink>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand tpl={tpl} title={`Add ${exp.name} to your stay`} />

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: href(tpl) },
          { name: "Experiences", path: href(tpl, "/experiences") },
          { name: exp.name, path: href(tpl, `/experiences/${exp.slug}`) },
        ])}
      />
    </>
  );
}
