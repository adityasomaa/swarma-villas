import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Footer } from "@/components/chrome/Footer";
import { Header } from "@/components/chrome/Header";
import { ConsentProvider } from "@/components/shared/ConsentProvider";
import { CookieBanner } from "@/components/shared/CookieBanner";
import { IntroLoader } from "@/components/shared/IntroLoader";
import { JsonLd } from "@/components/shared/JsonLd";
import { SkipLink } from "@/components/shared/SkipLink";
import { SmoothScroll } from "@/components/shared/SmoothScroll";
import { TransitionProvider } from "@/components/shared/Transition";
import { UIProvider } from "@/components/shared/UIProvider";
import { business } from "@/content/site";
import { fontVariables } from "@/lib/fonts";
import { SITE_URL, lodgingBusinessJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${business.name} – ${business.tagline}`,
    template: `%s | ${business.name}`,
  },
  description:
    "Swarma Villas Bali is an eco-chic jungle retreat in Singakerta, Ubud, with " +
    "three houses: a Javanese teakwood gladak, a hexagonal bamboo house and a " +
    "bamboo dome. Published rates, a pool, and Swarma Paon Restaurant on site.",
  applicationName: business.name,
  authors: [{ name: business.name }],
  keywords: [
    "Swarma Villas Bali",
    "villa in Ubud",
    "eco villa Ubud",
    "bamboo house Bali",
    "Singakerta accommodation",
    "Ubud jungle villa",
    "book direct Ubud villa",
  ],
  openGraph: {
    type: "website",
    siteName: business.name,
    locale: "en_US",
    url: SITE_URL,
    title: `${business.name} – ${business.tagline}`,
    description:
      "Three houses in Singakerta, Ubud. Published rates, an on-site restaurant, " +
      "and direct booking over WhatsApp.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name} – ${business.tagline}`,
    description: "Three houses in Singakerta, Ubud. Published rates, book direct.",
  },
  /**
   * Noindex, deliberately, for as long as this lives on vercel.app. A second
   * copy of Swarma Villas' own copy would compete with swarmavillasbali.com in
   * search. Flip this and the disallow in robots.ts together on the day the
   * site moves to the villa's own domain.
   */
  robots: { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#2b3227",
  colorScheme: "light",
};

/**
 * The font class goes on <html>: next/font defines its CSS variables on the
 * element carrying the class, and this is the only element that is an ancestor
 * of everything — including the calendar and the lightbox, which render
 * through portals straight into <body>.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="flex min-h-dvh flex-col">
        <ConsentProvider>
          <UIProvider>
            <TransitionProvider>
              <SkipLink />
              <SmoothScroll />
              <IntroLoader />
              <Header />
              {/*
                The skip link targets this id, and it is the element the page
                transition scrolls to the top of.
              */}
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
              <CookieBanner />
            </TransitionProvider>
          </UIProvider>
        </ConsentProvider>
        <JsonLd data={lodgingBusinessJsonLd()} />
      </body>
    </html>
  );
}
