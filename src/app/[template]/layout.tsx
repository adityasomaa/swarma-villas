import { notFound } from "next/navigation";

import { Footer } from "@/components/chrome/Footer";
import { Header } from "@/components/chrome/Header";
import { IntroLoader } from "@/components/shared/IntroLoader";
import { t1Fonts, t2Fonts, t3Fonts } from "@/lib/fonts";
import { TEMPLATE_LIST, type TemplateId } from "@/lib/templates";

/* =============================================================================
   THE PREVIEW SHELL
   -----------------------------------------------------------------------------
   One dynamic segment serves all three previews. Thirteen route files cover
   fifty-one pages, and — more importantly — there is one definition of "what a
   page of this site is", so the three directions cannot drift apart
   structurally while they diverge visually.

   `dynamicParams = false` is what implements the brief's 404 rule. Only
   template-1, template-2 and template-3 are generated; /about, /houses, a
   mistyped /template-4 and every other single-segment path fall through to
   src/app/not-found.tsx with a real 404 status. `/` has no page.tsx at all, so
   it 404s too.

   The wrapper carries BOTH `data-tpl` (which selects the palette and the
   geometry) and the font class (which is where next/font defines its CSS
   variable). Neither can move to <body>: the palettes have to be able to
   coexist, and a font variable declared on <body> would not exist on this
   subtree.
   ========================================================================== */

export const dynamicParams = false;

export function generateStaticParams() {
  return TEMPLATE_LIST.map((t) => ({ template: t.basePath.slice(1) }));
}

const FONTS: Record<TemplateId, string> = { t1: t1Fonts, t2: t2Fonts, t3: t3Fonts };

/** "template-2" -> "t2". Anything else is not a preview. */
export function idFromSegment(segment: string): TemplateId | null {
  const match = TEMPLATE_LIST.find((t) => t.basePath === `/${segment}`);
  return match ? match.id : null;
}

export default async function TemplateLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ template: string }>;
}) {
  const { template } = await params;
  const tpl = idFromSegment(template);
  if (!tpl) notFound();

  return (
    <div data-tpl={tpl} className={`${FONTS[tpl]} flex min-h-dvh flex-col bg-canvas text-ink`}>
      <IntroLoader />
      <Header tpl={tpl} />
      {/*
        The skip link in the root layout targets this id, and it is the element
        the page transition scrolls to the top of.
      */}
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer tpl={tpl} />
    </div>
  );
}
