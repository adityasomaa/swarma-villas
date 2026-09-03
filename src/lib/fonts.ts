import { Cormorant_Garamond, Inter, Instrument_Serif, DM_Sans, Lora } from "next/font/google";

/* =============================================================================
   TYPEFACES — one pair per direction, taken from its reference.
   -----------------------------------------------------------------------------
   Each pair is imported by its own template layout, never by the root layout,
   so a visitor who only opens Amber never downloads Instrument Serif or Lora.
   All five families are SIL Open Font License and are self-hosted by next/font
   at build time: no request ever leaves for a third-party font CDN.
   ========================================================================== */

/* ---- Template 1 — Amber (after Vantara) -------------------------------- */

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const t1Fonts = `${cormorant.variable} ${inter.variable}`;

/* ---- Template 2 — Riverstone (after Villa Asteria) --------------------- */

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-instrument",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dmsans",
});

export const t2Fonts = `${instrument.variable} ${dmSans.variable}`;

/* ---- Template 3 — Paon (after Villa L) --------------------------------- */

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
});

export const t3Fonts = lora.variable;

/** Used by the 404 and the preview switcher, which sit outside any template. */
export const sharedFonts = `${cormorant.variable} ${inter.variable}`;
