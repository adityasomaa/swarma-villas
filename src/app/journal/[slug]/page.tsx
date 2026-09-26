import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/blocks/PageHero";
import { CtaBand } from "@/components/blocks/home";
import { Photo } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { TLink } from "@/components/shared/Transition";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Container, Section, SectionHeader } from "@/components/ui";
import { journal, journalPostBySlug } from "@/content/journal";

/* =============================================================================
   ONE JOURNAL POST
   -----------------------------------------------------------------------------
   Fifteen static pages. `dynamicParams = false` means a slug that is not in
   journal.ts 404s at the edge instead of being rendered on demand — there is no
   database behind this, so an unknown slug can only ever be a dead link.

   There is no published date, in the markup or in the page: the villa supplied
   the posts without dates. See content/journal.ts.
   ========================================================================== */

export const dynamicParams = false;

export function generateStaticParams() {
  return journal.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = journalPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = journalPostBySlug(slug);
  if (!post) notFound();

  const index = journal.findIndex((p) => p.slug === post.slug);
  const more = [...journal.slice(index + 1), ...journal.slice(0, index)].slice(0, 3);

  return (
    <>
      <PageHero
        kicker="The Swarma Journal"
        title={post.title}
        photo={{ slug: post.photo, alt: "" }}
        crumbs={[
          { label: "Journal", path: "/journal" },
          { label: post.title, path: `/journal/${post.slug}` },
        ]}
      />

      <Section tone="canvas">
        <Container width="narrow">
          <article>
            <p className="display text-[clamp(1.25rem,2.6vw,1.625rem)] leading-[1.45] text-ink">
              {post.excerpt}
            </p>

            <div className="mt-10 space-y-6 border-t border-line pt-10 text-[1.0625rem] leading-[1.8] text-muted">
              {post.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <Reveal>
              <aside className="mt-12 border-l-2 border-gold pl-6 md:pl-8">
                <p className="display text-[1.25rem] leading-[1.5] text-ink">{post.closing}</p>
                <div className="mt-6">
                  <WhatsAppButton
                    action={`Journal — ${post.title}`}
                    subject="a stay at Swarma Villas"
                    label="Ask on WhatsApp"
                  />
                </div>
              </aside>
            </Reveal>
          </article>
        </Container>
      </Section>

      {/* ------------------------------------------------------- keep reading */}
      <Section tone="surface">
        <Container width="wide">
          <SectionHeader kicker="Keep reading" title="More from the journal" className="mb-10 md:mb-14" />
          <ul className="grid gap-px bg-line md:grid-cols-3">
            {more.map((other, i) => (
              <li key={other.slug} className="bg-surface">
                <Reveal delay={i * 80}>
                  <TLink href={`/journal/${other.slug}`} className="group flex h-full flex-col">
                    <div className="overflow-hidden">
                      <Photo
                        slug={other.photo}
                        ratio={16 / 10}
                        sizes="(min-width: 768px) 33vw, 100vw"
                        imgClassName="transition-transform duration-[1000ms] ease-out-quint group-hover:scale-[1.05]"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6 md:p-7">
                      <h3 className="display text-[1.25rem] leading-snug">{other.title}</h3>
                      <p className="mt-3 flex-1 text-[0.9375rem] leading-[1.65] text-muted">
                        {other.excerpt}
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

          <div className="mt-10 text-center">
            <TLink
              href="/journal"
              className="inline-block border-b border-current pb-1 text-[0.8125rem] uppercase tracking-[0.16em] text-accent"
            >
              All journal entries
            </TLink>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
