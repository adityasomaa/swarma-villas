import { PageHero } from "@/components/blocks/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { TLink } from "@/components/shared/Transition";
import { Container, Section } from "@/components/ui";
import type { LegalDocument } from "@/content/legal";
import { clsx } from "@/lib/clsx";
import { href, type TemplateId } from "@/lib/templates";

/* =============================================================================
   LEGAL PAGES
   -----------------------------------------------------------------------------
   Three pages share this layout: the booking terms, the terms of use and the
   privacy policy. They are text, and the design's whole job is to keep them
   readable — one column, a measure that does not run past 64 characters, and a
   contents list that jumps to a section.

   The headings carry ids so a specific clause can be linked to directly, which
   is what people actually do with a cancellation policy.
   ========================================================================== */

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const RELATED = [
  { label: "Terms & conditions", path: "/term-condition" },
  { label: "Terms of use", path: "/terms-of-use" },
  { label: "Privacy policy", path: "/privacy" },
];

export function LegalDoc({
  tpl,
  doc,
  currentPath,
  crumbLabel,
}: {
  tpl: TemplateId;
  doc: LegalDocument;
  currentPath: string;
  crumbLabel: string;
}) {
  return (
    <>
      <PageHero
        tpl={tpl}
        kicker="Legal"
        title={doc.h1}
        lede={doc.lede}
        crumbs={[{ label: crumbLabel, path: currentPath }]}
      />

      <Section tpl={tpl} tone="canvas">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
            {/* ------------------------------------------------- contents */}
            <nav aria-label="On this page" className="lg:sticky lg:top-[calc(var(--switcher-h)+7rem)] lg:self-start">
              <h2 className="kicker text-subtle">On this page</h2>
              <ol className="mt-4 space-y-2 border-l border-line pl-4">
                {doc.sections.map((section) => (
                  <li key={section.title}>
                    <a
                      href={`#${slugify(section.title)}`}
                      className="text-[0.875rem] leading-snug text-muted underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-[0.75rem] text-subtle">Last updated {doc.updated}</p>
            </nav>

            {/* ------------------------------------------------- the text */}
            <div>
              {doc.sections.map((section, i) => (
                <Reveal
                  key={section.title}
                  as="section"
                  delay={Math.min(i, 4) * 50}
                  className={clsx("scroll-mt-[calc(var(--switcher-h)+8rem)]", i > 0 && "mt-12")}
                >
                  <h2
                    id={slugify(section.title)}
                    className="display border-t border-line pt-6 text-[1.375rem] leading-snug"
                  >
                    {section.title}
                  </h2>

                  {section.paragraphs && (
                    <div className="measure-prose mt-5 space-y-4 text-[1rem] leading-[1.8] text-muted">
                      {section.paragraphs.map((p, j) => (
                        <p key={j}>{p}</p>
                      ))}
                    </div>
                  )}

                  {section.items && (
                    <ul className="measure-prose mt-5 space-y-3">
                      {section.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-baseline gap-3 text-[1rem] leading-[1.75] text-muted"
                        >
                          <span
                            aria-hidden
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Reveal>
              ))}

              {/* ------------------------------------------ the other two */}
              <div className="mt-16 border-t border-line pt-8">
                <h2 className="kicker text-subtle">The other documents</h2>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {RELATED.filter((r) => r.path !== currentPath).map((related) => (
                    <li key={related.path}>
                      <TLink
                        href={href(tpl, related.path)}
                        className="text-[0.9375rem] text-accent underline-offset-4 hover:underline"
                      >
                        {related.label}
                      </TLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
