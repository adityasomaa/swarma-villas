import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { idFromSegment } from "@/app/[template]/layout";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBand } from "@/components/blocks/home";
import { Photo } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { TLink } from "@/components/shared/Transition";
import { Container, Section } from "@/components/ui";
import { copy, experiences } from "@/content/site";
import { clsx } from "@/lib/clsx";
import { href } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Experiences",
  description: copy.experiences.lede,
};

export default async function ExperiencesPage({
  params,
}: {
  params: Promise<{ template: string }>;
}) {
  const { template } = await params;
  const tpl = idFromSegment(template);
  if (!tpl) notFound();

  return (
    <>
      <PageHero
        tpl={tpl}
        kicker="On the property"
        title={copy.experiences.h1}
        lede={copy.experiences.lede}
        photo={{ slug: "jungle-01", alt: "The jungle valley beside Swarma Villas" }}
        crumbs={[{ label: "Experiences", path: "/experiences" }]}
      />

      <Section tpl={tpl} tone="canvas">
        <Container width={tpl === "t2" ? "wide" : "default"}>
          {/*
            Four items, listed rather than gridded: each one is a page of its
            own with a real description, so an index that gives them room reads
            better than four equal tiles.
          */}
          <ul className="flex flex-col">
            {experiences.map((exp, i) => (
              <li key={exp.slug} className="border-t border-line last:border-b">
                <Reveal>
                  <TLink
                    href={href(tpl, `/experiences/${exp.slug}`)}
                    className={clsx(
                      "group grid items-center gap-8 py-10 md:gap-12 md:py-14",
                      "lg:grid-cols-2",
                      i % 2 === 1 && "lg:[&>*:first-child]:order-2",
                    )}
                  >
                    <div className="overflow-hidden">
                      <Photo
                        slug={exp.photos[0]!}
                        ratio={16 / 10}
                        rounded={tpl === "t1" ? "md" : "none"}
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        imgClassName="transition-transform duration-[1100ms] ease-out-quint group-hover:scale-[1.04]"
                        alt={`${exp.name} at Swarma Villas Bali`}
                      />
                    </div>

                    <div className="lg:px-4">
                      <p className="kicker text-subtle tabular-nums">
                        {String(i + 1).padStart(2, "0")} /{" "}
                        {String(experiences.length).padStart(2, "0")}
                      </p>
                      <h2 className="display mt-4 text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.06]">
                        {exp.name}
                      </h2>
                      <p className="measure-prose mt-4 text-[1.0625rem] leading-[1.7] text-muted">
                        {exp.summary}
                      </p>
                      {exp.facts && (
                        <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-[0.875rem]">
                          {exp.facts.map((fact) => (
                            <div key={fact.label} className="flex gap-2">
                              <dt className="text-subtle">{fact.label}:</dt>
                              <dd className="text-muted">{fact.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      <span className="mt-6 inline-block border-b border-current pb-1 text-[0.8125rem] uppercase tracking-[0.16em] text-accent">
                        Read more
                      </span>
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
        title="Arrange it before you arrive"
        lede="Treatments and treks are better booked ahead — tell us what you would like and we will set it up."
      />
    </>
  );
}
