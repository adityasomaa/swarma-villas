import type { Metadata } from "next";

import { LegalDoc } from "@/components/blocks/LegalDoc";
import { termsOfUse } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of use",
  description: termsOfUse.lede,
};

export default function TermsOfUsePage() {

  return (
    <LegalDoc
      doc={termsOfUse}
      currentPath="/terms-of-use"
      crumbLabel="Terms of use"
    />
  );
}
