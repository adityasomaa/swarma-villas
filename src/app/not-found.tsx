import type { Metadata } from "next";

import { NotFoundLinks } from "@/components/shared/NotFoundLinks";
import { sharedFonts } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/* =============================================================================
   404
   -----------------------------------------------------------------------------
   This file is doing more work than a 404 normally does. The brief asks for
   three previews under /template-1..3 and for everything else to return 404 —
   including `/`. There is no src/app/page.tsx, so Next serves this route for
   the bare origin, for /about, for a mistyped house slug, for everything.

   That makes it the first page a reviewer opening the deployment sees, so it
   has to explain itself and hand over the three doors. It is served with a real
   404 status either way, which is what keeps the previews out of the index
   while they are still previews.
   ========================================================================== */

export default function NotFound() {
  return (
    <main
      data-tpl="t1"
      className={`${sharedFonts} min-h-dvh bg-canvas text-ink`}
      style={{ fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-6 py-24 sm:px-8">
        <p className="kicker text-accent">Error 404</p>
        <h1 className="display mt-5 text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.04]">
          Nothing lives at this address
        </h1>
        <p className="measure-prose mt-6 text-[1.0625rem] leading-[1.7] text-muted">
          This deployment is a design review for Swarma Villas Bali. It holds
          three complete versions of the site and nothing else — every page sits
          under one of the three paths below, and any other address, this one
          included, answers with a 404 exactly as you are seeing now.
        </p>
        <NotFoundLinks />
      </div>
    </main>
  );
}
