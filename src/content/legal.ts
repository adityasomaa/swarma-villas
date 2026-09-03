import { addressOneLine, business } from "@/content/site";

/* =============================================================================
   PRIVACY POLICY AND TERMS OF USE
   =============================================================================

   These two documents are the only pages on this site whose text was NOT taken
   from swarmavillasbali.com — the current site does not carry either one, and
   the brief asked for both.

   They are written to describe what THIS build actually does, and nothing else.
   Every claim below is checkable against the code:

     - no analytics, no advertising pixel, no third-party script
       (grep the repo: there is no gtag, no Meta pixel, no Hotjar)
     - three localStorage keys, all first-party, all named in the policy
       (src/lib/consent.ts, src/lib/booking/store.ts)
     - the booking form sends nothing anywhere; it validates on the server and
       then opens WhatsApp with a message the guest sends themselves
       (src/app/actions/booking.ts, src/lib/whatsapp.ts)
     - typefaces are self-hosted by next/font at build time, so no request goes
       to a font CDN (src/lib/fonts.ts)
     - one embedded YouTube player on the home page, which is a third party and
       is disclosed as one

   If any of that changes, this file has to change with it. A privacy policy
   that describes a different site than the one it sits on is worse than none.

   NOT LEGAL ADVICE. Before this goes live under the villa's own domain, have
   someone qualified read it against Indonesian PDP Law No. 27/2022 and, if the
   villa markets into the EU or the UK, against the GDPR.
   ============================================================================= */

export type LegalSection = { title: string; paragraphs?: string[]; items?: string[] };
export type LegalDocument = {
  h1: string;
  lede: string;
  updated: string;
  sections: LegalSection[];
};

const CONTACT_LINE =
  `${business.name}, ${addressOneLine}, ${business.address.country}. ` +
  `Email ${business.email}. Telephone ${business.phoneDisplay}.`;

/* -------------------------------------------------------------------------- */

export const privacyPolicy: LegalDocument = {
  h1: "Privacy policy",
  lede:
    "What this website stores, what it does not, and how to change your mind. " +
    "It is short because the site collects very little.",
  updated: "3 September 2026",
  sections: [
    {
      title: "Who is responsible",
      paragraphs: [
        `This website is operated by ${business.name}. For any question about this ` +
          "policy or about information held about you, write to us:",
        CONTACT_LINE,
      ],
    },
    {
      title: "The short version",
      items: [
        "There is no analytics on this site. No Google Analytics, no advertising pixel, no session recorder, no heat map.",
        "Nothing is shared with, or sold to, anyone.",
        "No account can be created, and there is no login.",
        "No payment is taken anywhere on this site.",
        "Three pieces of information can be stored, all in your own browser, and only if you agree. They are listed below by name.",
      ],
    },
    {
      title: "What is stored in your browser",
      paragraphs: [
        "Strictly speaking these are not cookies — nothing is sent to a server with " +
          "every request. They are entries in your browser's local storage, which stay " +
          "on your device. They are listed here anyway, because what matters is that " +
          "something is being kept, not what it is technically called.",
      ],
      items: [
        "swarma.consent.v1 — whether you accepted or declined storage. Written as soon as you answer the banner, so you are not asked again. This one entry is kept whichever way you answer; without it we could not remember that you said no.",
        "swarma.booking-draft.v1 — what you have typed into the booking form, so a half-finished enquiry survives a reload or a wrong tap. Written only if you accepted.",
        "swarma.booking-requests.v1 — the enquiries you have prepared on this device, so you can see what you sent. Written only if you accepted.",
      ],
    },
    {
      title: "Declining, and changing your mind",
      paragraphs: [
        "If you decline, the two booking entries are deleted immediately and nothing " +
          "further is written. The booking form still works; it simply forgets you " +
          "between visits.",
        "You can change your answer at any time from the Cookie settings link in the " +
          "footer of every page. Choosing Decline there deletes what was already " +
          "stored, on the spot. Clearing site data in your browser has the same effect.",
      ],
    },
    {
      title: "The booking form",
      paragraphs: [
        "The form asks for a name, an email address, a phone number, the house you are " +
          "interested in, your dates, the number of guests and anything you want to add.",
        "When you submit it, those details are checked on our server for completeness " +
          "and consistency — that the dates make sense, that the email looks like an " +
          "email. They are not stored on that server and they are not emailed anywhere.",
        "What happens next is that your browser opens WhatsApp with a message already " +
          "written, addressed to the villa. You send it, or you do not. Until you press " +
          "send in WhatsApp, the villa has received nothing.",
        "Once you do send it, the message is in WhatsApp, which is operated by Meta and " +
          "governed by its own privacy policy, not by this one.",
      ],
    },
    {
      title: "Third parties",
      items: [
        "The home page embeds one video from YouTube. If you play it, YouTube — that is, Google — receives a request from your browser and may set its own cookies. That is outside our control and is governed by Google's privacy policy.",
        "Typefaces are downloaded from this website itself, not from a font service, so no request about you leaves for a third party when a page loads.",
        "Links to Google Maps, Instagram, Facebook and WhatsApp are ordinary links. Nothing is sent until you click one.",
      ],
    },
    {
      title: "Hosting and server logs",
      paragraphs: [
        "This site is hosted by Vercel Inc. Like any web host, Vercel records the " +
          "requests it serves — IP address, time, page requested, browser — for a " +
          "limited period, in order to run and protect the service. Those logs are " +
          "produced by the hosting infrastructure, not by anything on this site.",
      ],
    },
    {
      title: "Your rights",
      paragraphs: [
        "Because this website stores nothing about you on our servers, there is " +
          "generally nothing here for us to hand over or erase — the entries listed " +
          "above are on your device and under your control.",
        "If you have sent us an enquiry by WhatsApp or email, that correspondence does " +
          "exist. You may ask us for a copy of it, ask us to correct it, or ask us to " +
          "delete it, by writing to the address above. Depending on where you live, " +
          "you may also have the right to complain to a supervisory authority.",
      ],
    },
    {
      title: "Children",
      paragraphs: [
        "This site is not directed at children, and we do not knowingly collect " +
          "information from them.",
      ],
    },
    {
      title: "Changes",
      paragraphs: [
        "If what the site does changes, this page changes with it, and the date at the " +
          "top is updated.",
      ],
    },
  ],
};

/* -------------------------------------------------------------------------- */

export const termsOfUse: LegalDocument = {
  h1: "Terms of use",
  lede:
    "The rules for using this website. Your stay itself is governed by the " +
    "booking terms, which are a separate page.",
  updated: "3 September 2026",
  sections: [
    {
      title: "These terms, and the other ones",
      paragraphs: [
        "This page covers the website: what you may do with it, and what it does and " +
          "does not promise. It is not the contract for your stay.",
        "The conditions that apply to a booking — check-in times, payment, the " +
          "cancellation policy, liability for damage — are set out on the Terms & " +
          "conditions page. If the two ever disagree about a booking, the booking terms " +
          "win.",
      ],
    },
    {
      title: "Using the site",
      items: [
        "You may read these pages, print them and share links to them.",
        "Please do not attempt to break, overload or gain unauthorised access to the site or the server behind it.",
        "Please do not scrape the site in bulk, or reuse its photographs or text commercially, without asking us first.",
        "Please do not submit anything unlawful, abusive or deliberately false through the booking form.",
      ],
    },
    {
      title: "Rates and availability",
      paragraphs: [
        "The rates shown on this site are the published starting rates per night. They " +
          "are a starting point, not a quotation: the final price for a stay depends on " +
          "the dates, the length of the stay and what is included.",
        "This site has no live connection to a booking system. Nothing here shows " +
          "availability, and choosing dates in the form does not hold a room. A booking " +
          "exists only once we have confirmed it to you directly.",
        "Rates and availability can change, and we may correct an error on this site " +
          "after you have seen it.",
      ],
    },
    {
      title: "Accuracy",
      paragraphs: [
        "We take care to describe the houses, the facilities and the experiences " +
          "accurately, and the photographs are of this property. Even so, a website is " +
          "a description and not a guarantee; a real garden changes with the season.",
        "The Bamboo Dome is being redesigned to become more enclosed while a nearby " +
          "resort project is under way. That is stated on its own page, and shared " +
          "facilities remain open as usual.",
      ],
    },
    {
      title: "Intellectual property",
      paragraphs: [
        `The photographs, text, layout and design of this site belong to ${business.name} ` +
          "or are used with permission. You may not republish them as your own.",
      ],
    },
    {
      title: "Other websites",
      paragraphs: [
        "Where we link to somewhere else — Google Maps, YouTube, WhatsApp, a social " +
          "account — we do not control what is there and are not responsible for it.",
      ],
    },
    {
      title: "Availability of the site",
      paragraphs: [
        "We try to keep this site working, but we do not promise it will be available " +
          "at all times or free of error. It may be taken down for maintenance without " +
          "notice.",
      ],
    },
    {
      title: "Liability",
      paragraphs: [
        "Nothing in these terms limits any liability that cannot lawfully be limited, " +
          "including liability for death or personal injury caused by negligence, or " +
          "for fraud.",
        "Beyond that, and to the extent the law allows, we are not liable for loss " +
          "arising from your use of this website — for example loss caused by relying " +
          "on a rate or a description here rather than on a booking we confirmed to you " +
          "directly.",
      ],
    },
    {
      title: "Governing law",
      paragraphs: [
        "These terms are governed by the law of the Republic of Indonesia, and the " +
          "courts of Indonesia have jurisdiction over any dispute about them.",
      ],
    },
    {
      title: "Contact",
      paragraphs: ["Questions about these terms can go to:", CONTACT_LINE],
    },
  ],
};
