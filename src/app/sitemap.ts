import type { MetadataRoute } from "next";

import { journal } from "@/content/journal";
import { houses } from "@/content/site";
import { SITE_URL } from "@/lib/seo";

/**
 * Every page of the site, built from the content rather than from a hand-kept
 * list — a hand-kept list is how the journal's fifteen pages would have been
 * left out.
 *
 * robots.ts currently disallows the whole host, so nothing here is crawled
 * today. The file exists so that the day the disallow comes off, the map is
 * already correct.
 */
const staticPaths = [
  "/",
  "/about",
  "/houses",
  "/restaurant",
  "/experiences",
  "/packages",
  "/journal",
  "/gallery",
  "/review",
  "/contact",
  "/term-condition",
  "/privacy",
];

function priorityFor(path: string): number {
  if (path === "/") return 1;
  if (path.startsWith("/houses")) return 0.9;
  if (path === "/term-condition" || path === "/privacy") return 0.3;
  if (path.startsWith("/journal/")) return 0.5;
  return 0.7;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    ...staticPaths,
    ...houses.map((h) => `/houses/${h.slug}`),
    ...journal.map((p) => `/journal/${p.slug}`),
  ];

  return paths.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: priorityFor(path),
  }));
}
