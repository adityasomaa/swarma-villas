import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { idFromSegment } from "@/app/[template]/layout";
import { LegalDoc } from "@/components/blocks/LegalDoc";
import { CtaBand } from "@/components/blocks/home";
import { bookingTerms, copy } from "@/content/site";
import type { LegalDocument } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms & conditions",
  description: copy.terms.lede,
};

/**
 * The villa's own booking conditions, reshaped into the same document type the
 * privacy policy and the terms of use use, so all three read alike. The words
 * are unchanged apart from the spelling fixes recorded at the top of
 * content/site.ts.
 */
const doc: LegalDocument = {
  h1: copy.terms.h1,
  lede: copy.terms.lede,
  updated: "3 September 2026",
  sections: [
    { title: "Acceptance", paragraphs: [bookingTerms.intro] },
    ...bookingTerms.sections.map((section) => ({
      title: section.title,
      items: section.items,
    })),
  ],
};

export default async function TermConditionPage({
  params,
}: {
  params: Promise<{ template: string }>;
}) {
  const { template } = await params;
  const tpl = idFromSegment(template);
  if (!tpl) notFound();

  return (
    <>
      <LegalDoc
        tpl={tpl}
        doc={doc}
        currentPath="/term-condition"
        crumbLabel="Terms & conditions"
      />
      <CtaBand
        tpl={tpl}
        title="Ready when you are"
        lede="Send your dates and we will confirm what is free and what it comes to."
      />
    </>
  );
}
