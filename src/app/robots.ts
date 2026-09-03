import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

/**
 * This deployment is a design review, not the live villa site. Indexing it
 * would put three near-identical copies of Swarma Villas' own copy into Google
 * competing with swarmavillasbali.com — the textbook way to damage the client
 * you are pitching to.
 *
 * When one direction is chosen and this becomes the real site, delete the
 * disallow and keep the sitemap line.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
