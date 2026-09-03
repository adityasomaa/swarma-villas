import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { idFromSegment } from "@/app/[template]/layout";
import { LegalDoc } from "@/components/blocks/LegalDoc";
import { privacyPolicy } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: privacyPolicy.lede,
};

export default async function PrivacyPage({ params }: { params: Promise<{ template: string }> }) {
  const { template } = await params;
  const tpl = idFromSegment(template);
  if (!tpl) notFound();

  return (
    <LegalDoc
      tpl={tpl}
      doc={privacyPolicy}
      currentPath="/privacy"
      crumbLabel="Privacy policy"
    />
  );
}
