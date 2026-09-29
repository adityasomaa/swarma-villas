import { addressOneLine, business, publicPhoneDisplay } from "@/content/site";

/* =============================================================================
   TERMS & CONDITIONS AND PRIVACY POLICY
   =============================================================================
   Both documents are the villa's own, supplied on 25 September 2026 and
   transcribed here. The earlier "Terms of use" page was removed at their
   request.

   NOT LEGAL ADVICE. Before this goes live under the villa's own domain, have
   someone qualified read it against Indonesian PDP Law No. 27/2022 and, if the
   villa markets into the EU or the UK, against the GDPR.

   One thing to keep true: the privacy policy says browser storage is used to
   remember what you type into the enquiry form. That is what this site does
   (see src/lib/consent.ts). If the site ever gains analytics, an advertising
   pixel or a third party script, this page has to say so.
   ============================================================================= */

export type LegalSection = { title: string; paragraphs?: string[]; items?: string[] };
export type LegalDocument = {
  h1: string;
  lede: string;
  updated: string;
  sections: LegalSection[];
};

const CONTACT_LINES = [
  business.name,
  `${addressOneLine}, ${business.address.country}`,
  business.email,
  publicPhoneDisplay,
];

/* -------------------------------------------------------------------------- */

export const termsAndConditions: LegalDocument = {
  h1: "Terms & Conditions",
  lede: "The conditions that apply to bookings and stays at Swarma Villas Bali.",
  updated: "25 September 2026",
  sections: [
    {
      title: "Booking & Confirmation",
      items: [
        "A booking is confirmed once it has been confirmed by Swarma Villas or through the relevant booking platform.",
        "Guests are responsible for providing accurate booking information.",
        "Rates and inclusions are based on the confirmed booking.",
      ],
    },
    {
      title: "Check in & Check out",
      items: [
        "Check in: 14:00",
        "Check out: 12:00",
        "A valid government ID or passport is required at check in.",
        "Early check in is subject to availability.",
        "Late check out is subject to availability and may incur an additional charge.",
      ],
    },
    {
      title: "Payment",
      items: [
        "Payment is made according to the terms of the confirmed booking.",
        "Payment is accepted in IDR and USD.",
        "Any applicable bank or payment charges are the guest's responsibility.",
      ],
    },
    {
      title: "Cancellation Policy",
      items: [
        "Cancellation 4 days or more before arrival: full refund.",
        "Cancellation 1–3 days before arrival: 50% refund.",
        "No show: no refund.",
      ],
      paragraphs: [
        "Cancellation is based on the property's local time and arrival date.",
        "Applies to standard bookings only. Not applicable to weekly, monthly, " +
          "non refundable or special offers.",
      ],
    },
    {
      title: "Damage & Guest Responsibility",
      items: [
        "Guests are expected to take reasonable care of the house, facilities and property.",
        "Guests are responsible for damage or loss caused during their stay.",
        "Any damage or maintenance issue should be reported to the Swarma Villas team as soon as possible.",
      ],
    },
    {
      title: "Safety & Property Awareness",
      paragraphs: [
        "Swarma Villas is a nature based property with stone paths, steps and different " +
          "house layouts. Guests are kindly asked to take reasonable care, particularly " +
          "when travelling with children or elderly guests.",
        "Some houses have stairs or other access considerations. Please review the " +
          "individual house description before booking.",
      ],
    },
    {
      title: "House Rules",
      items: [
        "Please respect the property, staff and other guests.",
        "Please keep noise to a reasonable level.",
        "Illegal drugs are not permitted on the property.",
        "Guests are responsible for the behaviour of their visitors.",
        "Guests are expected to follow any specific house rules provided during their stay.",
      ],
    },
    {
      title: "Facilities & Services",
      paragraphs: [
        "Facilities and services may occasionally be affected by maintenance, weather or " +
          "circumstances beyond our control. We will do our best to inform guests of " +
          "significant changes.",
      ],
    },
    {
      title: "Contact",
      paragraphs: CONTACT_LINES,
    },
  ],
};

/* -------------------------------------------------------------------------- */

export const privacyPolicy: LegalDocument = {
  h1: "Privacy Policy",
  lede:
    "This Privacy Policy explains how Swarma Villas Bali handles information provided " +
    "through our website.",
  updated: "25 September 2026",
  sections: [
    {
      title: "1. Information We Collect",
      paragraphs: ["When you contact us or make a booking enquiry, we may collect your:"],
      items: [
        "Name",
        "Email address",
        "Phone number",
        "Preferred house",
        "Arrival and departure dates",
        "Number of guests",
        "Other information you choose to provide",
      ],
    },
    {
      title: "2. How We Use Your Information",
      paragraphs: ["We use this information to:"],
      items: [
        "Respond to enquiries",
        "Process booking requests",
        "Communicate with you about your stay",
        "Provide requested services",
      ],
    },
    {
      title: "3. Website & Cookies",
      paragraphs: [
        "Our website may use essential browser storage or cookies to remember your " +
          "preferences and information entered into booking or enquiry forms.",
        "Third party services embedded or linked on our website may collect information " +
          "according to their own privacy policies.",
      ],
    },
    {
      title: "4. Your Privacy & Contact",
      paragraphs: [
        "We respect your privacy and handle your personal information with care. You may " +
          "contact us to ask about, update or request deletion of personal information we " +
          "hold, subject to applicable law.",
        business.name,
        business.email,
        publicPhoneDisplay,
      ],
    },
  ],
};
