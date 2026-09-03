import type { NextConfig } from "next";

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
};

export default nextConfig;
