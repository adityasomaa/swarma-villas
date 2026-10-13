import type { NextConfig } from "next";

/**
 * The site used to live under /template-1, /template-2 and /template-3 while
 * three directions were being compared. Riverstone (template 2) was chosen and
 * now sits at the root. Links to the old previews were already sent to the
 * client, so every one of them lands on the same page at its new address
 * rather than on a 404. Temporary: these were only ever review links.
 */
const PREVIEWS = ["template-1", "template-2", "template-3"];

/**
 * The villa's September revision renamed two houses, folded the four separate
 * experience pages into one, and dropped the Terms of use page. Anything
 * already linked to the old addresses lands on the new one. Permanent: the
 * /experiences/* ones are also the old WordPress site's indexed addresses.
 */
const MOVED: Record<string, string> = {
  "/houses/wooden-gladak-house": "/houses/gladak-house",
  "/houses/hexa-bamboo-house": "/houses/bamboo-hexa",
  "/experiences/swarma-paon-restaurant": "/restaurant",
  "/experiences/package-offer": "/packages",
  "/experiences/massage-body-rituals": "/experiences#wellness",
  "/experiences/jungle-trekking": "/experiences#beyond",
  "/terms-of-use": "/term-condition",
};

/**
 * The old WordPress site's own addresses, from its sitemap on 13 October 2026,
 * wherever they differ from this site's. Google has these indexed, and when
 * swarmavillasbali.com forwards here with the path intact these are what arrive.
 * The rest of its sitemap (/about/, /gallery/, /review/ …) already matches once
 * Next drops the trailing slash.
 *
 * Permanent: this is the real move, and a 308 is what tells Google to carry
 * each old page's standing across to the new one.
 */
const OLD_SITE: Record<string, string> = {
  "/house/wooden-gladak-house": "/houses/gladak-house",
  "/house/hexa-bamboo-house": "/houses/bamboo-hexa",
  "/house/bamboo-dome": "/houses/bamboo-dome",
  "/house": "/houses",
  "/author/:name": "/",
};

const nextConfig: NextConfig = {
  /**
   * The Vercel Image Optimization quota on this account is exhausted. With the
   * optimizer on, every image request returns 402 and production renders blank.
   * All photography here is pre-encoded to WebP at four widths by
   * scripts/optimise-photos.mjs and served as static files with a srcset, so
   * the optimizer would buy nothing anyway.
   */
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,

  async redirects() {
    return [
      ...PREVIEWS.flatMap((preview) => [
        { source: `/${preview}`, destination: "/", permanent: false },
        { source: `/${preview}/:path*`, destination: "/:path*", permanent: false },
      ]),
      ...Object.entries(MOVED).map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      ...Object.entries(OLD_SITE).map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
    ];
  },

  /**
   * The same deployment answers on swarma-villas.vercel.app, and the pages are
   * prerendered once for every host, so the page itself cannot say "index me
   * on one host and not the other". A header keyed on the host can. Every
   * *.vercel.app address gets noindex; swarmavillas.com gets nothing extra.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?<host>.*)\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};

export default nextConfig;
