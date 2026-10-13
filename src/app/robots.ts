import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

/**
 * Open to everything. The vercel.app copy is kept out of the index by an
 * X-Robots-Tag header (next.config.ts), not by a disallow here: a crawler has to
 * be allowed to fetch a page to see that it must not index it, so disallowing
 * the host would leave its URLs in results with no snippet rather than gone.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
