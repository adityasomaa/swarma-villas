import type { Metadata } from "next";

import { LegalDoc } from "@/components/blocks/LegalDoc";
import { CtaBand } from "@/components/blocks/home";
import { termsAndConditions } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: termsAndConditions.lede,
};

export default function TermConditionPage() {
  return (
    <>
      <LegalDoc doc={termsAndConditions} currentPath="/term-condition" crumbLabel="Terms & conditions" />
      <CtaBand
        title="Ready when you are"
        lede="Send your dates and we will confirm what is free and what it comes to."
      />
    </>
  );
}
