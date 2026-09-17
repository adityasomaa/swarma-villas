import { DM_Sans, Instrument_Serif } from "next/font/google";

/* =============================================================================
   TYPEFACES
   -----------------------------------------------------------------------------
   Instrument Serif for display, DM Sans for everything else. Both are SIL Open
   Font License and self-hosted by next/font at build time, so no request ever
   leaves for a third-party font CDN — which is what lets the privacy policy say
   so.

   The class goes on <html>, which is where next/font defines the variables.
   That makes them available to the whole document, including the calendar and
   the lightbox, which render through portals straight into <body>.
   ========================================================================== */

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

export const fontVariables = `${instrument.variable} ${dmSans.variable}`;
