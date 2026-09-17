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
    return PREVIEWS.flatMap((preview) => [
      { source: `/${preview}`, destination: "/", permanent: false },
      { source: `/${preview}/:path*`, destination: "/:path*", permanent: false },
    ]);
  },
};

export default nextConfig;
