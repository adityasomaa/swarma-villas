import type { MetadataRoute } from "next";

import { pagePaths } from "@/content/site";
import { SITE_URL } from "@/lib/seo";

/**
 * Every page of the site. robots.ts currently disallows the whole host, so
 * nothing here is crawled today — the file exists so that the day the disallow
 * comes off, the map is already correct.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return pagePaths.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : path.startsWith("/houses/") ? 0.9 : 0.7,
  }));
}
