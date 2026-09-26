import type { NextConfig } from "next";

/**
 * The site used to live under /template-1, /template-2 and /template-3 while
 * three directions were being compared. Riverstone (template 2) was chosen and
 * now sits at the root. Links to the old previews were already sent to the
 * client, so every one of them lands on the same page at its new address
 * rather than on a 404.
 *
 * Temporary (307), not permanent: this is still a vercel.app preview, and a
 * permanent redirect is cached by browsers with no way to take it back.
 */
const PREVIEWS = ["template-1", "template-2", "template-3"];

/**
 * The villa's September revision renamed two houses, folded the four separate
 * experience pages into one, and dropped the Terms of use page. Anything
 * already linked to the old addresses lands on the new one.
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
        permanent: false,
      })),
    ];
  },
};

export default nextConfig;
