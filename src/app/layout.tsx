import type { Metadata, Viewport } from "next";
import "./globals.css";

import { ConsentProvider } from "@/components/shared/ConsentProvider";
import { CookieBanner } from "@/components/shared/CookieBanner";
import { JsonLd } from "@/components/shared/JsonLd";
import { SkipLink } from "@/components/shared/SkipLink";
import { SmoothScroll } from "@/components/shared/SmoothScroll";
import { PreviewSwitcher } from "@/components/shared/PreviewSwitcher";
import { TransitionProvider } from "@/components/shared/Transition";
import { UIProvider } from "@/components/shared/UIProvider";
import { business } from "@/content/site";
import { SITE_URL, lodgingBusinessJsonLd } from "@/lib/seo";

/**
 * The root layout carries what is the same across all three previews: the
 * providers, the preview switcher, smooth scrolling, the cookie settings and
 * the business-level structured data.
 *
 * It loads NO typeface. next/font defines its variable on the element carrying
 * the class, and that element has to be each template's own wrapper — the
 * curtain and the chrome live inside it and need the variable to resolve.
 * Loading a face here would also put it on every page of every preview.
 */

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
   * Noindex, deliberately. Three previews carrying Swarma Villas' own copy
   * would compete with swarmavillasbali.com in search — damaging the client
   * this is a pitch to. Flip this and the disallow in robots.ts together on the
   * day one direction goes live under the real domain.
   */
  robots: { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#16130c",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConsentProvider>
          <UIProvider>
            <TransitionProvider>
              <SkipLink />
              <PreviewSwitcher />
              <SmoothScroll />
              {children}
              <CookieBanner />
            </TransitionProvider>
          </UIProvider>
        </ConsentProvider>
        <JsonLd data={lodgingBusinessJsonLd()} />
      </body>
    </html>
  );
}
