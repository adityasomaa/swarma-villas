"use client";

import { usePathname } from "next/navigation";
import { useCallback } from "react";

import { SITE_URL } from "@/lib/seo";
import { templateFromPath } from "@/lib/templates";
import { generalEnquiryUrl, type Provenance } from "@/lib/whatsapp";

/**
 * Every "Ask on WhatsApp" button on the site goes through here, so the message
 * always carries where it came from — the page, the preview, and which button
 * was pressed — without any call site having to remember to attach it.
 *
 * The page URL is read from the pathname rather than window.location so the
 * value is identical on the server and the client and React does not warn about
 * a hydration mismatch.
 */
export function useEnquiry() {
  const pathname = usePathname();

  return useCallback(
    (action: string, subject?: string) => {
      const provenance: Provenance = {
        template: templateFromPath(pathname),
        pageUrl: `${SITE_URL}${pathname}`,
        action,
      };
      return generalEnquiryUrl(provenance, subject);
    },
    [pathname],
  );
}
