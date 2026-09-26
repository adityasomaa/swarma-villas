import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/PageHero";
import { CtaBand } from "@/components/blocks/home";
import { Photo } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { TLink } from "@/components/shared/Transition";
import { Container, Section } from "@/components/ui";
import { journal } from "@/content/journal";
import { copy } from "@/content/site";

export const metadata: Metadata = {
  title: "Journal",
  description: copy.journal.lede,
};

/**
 * The index. The posts are listed in the order the villa wrote them, because
 * there are no publication dates to sort by — see content/journal.ts.
 */
export default function JournalPage() {
  const [lead, ...rest] = journal;

  return (
    <>
      <PageHero
        kicker={copy.journal.kicker}
        title={copy.journal.h1}
        lede={copy.journal.lede}
        photo={{ slug: "property-08", alt: "The garden path at Swarma Villas" }}
        crumbs={[{ label: "Journal", path: "/journal" }]}
      />

      {lead && (
        <Section tone="canvas">
          <Container width="wide">
            <Reveal>
              <TLink
                href={`/journal/${lead.slug}`}
                className="group grid items-center gap-8 md:gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
              >
                <div className="overflow-hidden">
                  <Photo
                    slug={lead.photo}
                    ratio={16 / 10}
                    priority
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    imgClassName="transition-transform duration-[1100ms] ease-out-quint group-hover:scale-[1.04]"
                    alt=""
                  />
                </div>
                <div className="lg:px-4">
                  <p className="kicker text-accent">Latest</p>
                  <h2 className="display mt-4 text-[clamp(1.875rem,4vw,3rem)] leading-[1.02]">
                    {lead.title}
                  </h2>
                  <p className="measure-prose mt-5 text-[1.0625rem] leading-[1.7] text-muted">
                    {lead.excerpt}
                  </p>
                  <span className="mt-6 inline-block border-b border-current pb-1 text-[0.8125rem] uppercase tracking-[0.16em] text-accent">
                    Read the story
                  </span>
                </div>
              </TLink>
            </Reveal>
          </Container>
        </Section>
      )}

      <Section tone="surface">
        <Container width="wide">
          <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <li key={post.slug} className="bg-surface">
                <Reveal delay={(i % 3) * 70}>
                  <TLink href={`/journal/${post.slug}`} className="group flex h-full flex-col">
                    <div className="overflow-hidden">
                      <Photo
                        slug={post.photo}
                        ratio={16 / 10}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        imgClassName="transition-transform duration-[1000ms] ease-out-quint group-hover:scale-[1.05]"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6 md:p-8">
                      <h2 className="display text-[1.375rem] leading-snug">{post.title}</h2>
                      <p className="mt-3 flex-1 text-[0.9375rem] leading-[1.65] text-muted">
                        {post.excerpt}
                      </p>
                      <span className="mt-5 text-[0.8125rem] text-accent">
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
      </Section>

      <CtaBand />
    </>
  );
}
