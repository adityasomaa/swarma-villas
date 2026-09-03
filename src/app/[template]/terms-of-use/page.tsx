import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { idFromSegment } from "@/app/[template]/layout";
import { LegalDoc } from "@/components/blocks/LegalDoc";
import { termsOfUse } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of use",
  description: termsOfUse.lede,
};

export default async function TermsOfUsePage({
  params,
}: {
  params: Promise<{ template: string }>;
}) {
  const { template } = await params;
  const tpl = idFromSegment(template);
  if (!tpl) notFound();

  return (
    <LegalDoc
      tpl={tpl}
      doc={termsOfUse}
      currentPath="/terms-of-use"
      crumbLabel="Terms of use"
    />
  );
}
