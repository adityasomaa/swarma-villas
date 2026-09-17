import type { Metadata } from "next";

import { LegalDoc } from "@/components/blocks/LegalDoc";
import { privacyPolicy } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: privacyPolicy.lede,
};

export default function PrivacyPage() {

  return (
    <LegalDoc
      doc={privacyPolicy}
      currentPath="/privacy"
      crumbLabel="Privacy policy"
    />
  );
}
