/* =============================================================================
   SWARMA VILLAS BALI — SINGLE SOURCE OF CONTENT
   =============================================================================

   HOW TO EDIT THIS FILE (no coding needed)
   ----------------------------------------
   - Everything the three designs display comes from this one file. Change it
     here once and all three update together.
   - Only edit the text between the quote marks: "like this".
   - Do not delete the commas, brackets or braces around the text.

   WHERE THIS CAME FROM
   --------------------
   Every fact below was taken from swarmavillasbali.com on 3 September 2026 —
   the page copy, the room specifications, the published rates, the terms and
   the contact details. Nothing has been invented.

   Two kinds of edit were made to the source wording, and only these two:
     1. Spelling and grammar fixed where the original had slips
        ("Avaibility" -> "Availability", "Abouts us" -> "About us",
         "cencellation" -> "cancellation").
     2. Sentences split or joined for reading. No claim was added, removed or
        strengthened anywhere.
   ============================================================================= */

/* -----------------------------------------------------------------------------
   1. BUSINESS DETAILS
   -------------------------------------------------------------------------- */

export const business = {
  name: "Swarma Villas Bali",
  /** The villa's own tagline, from the site title. */
  tagline: "River Side & Forest View",
  /** How the villa describes itself, in its own words. */
  positioning: "Eco-Chic Jungle Retreat in Singakerta, Ubud — Bali, Indonesia",
  /** The founder line the current site repeats in every footer. */
  founderLine:
    "Swarma Villas has the personal touch of its founder and offers a unique " +
    "experience, where you can explore this side of Ubud village and meet the " +
    "people who live here.",

  address: {
    street: "Jl. Raya Kengetan Gang Abian Tiying",
    village: "Singakerta",
    district: "Kecamatan Ubud",
    regency: "Kabupaten Gianyar",
    province: "Bali",
    postalCode: "80571",
    country: "Indonesia",
    countryCode: "ID",
    /** The Google plus code shown on the villa's About page. */
    plusCode: "M7CM+XVJ",
  },

  email: "info@swarmavillasbali.com",
  /** Reservations line, as printed in the footer. */
  phoneDisplay: "+62 821-4638-0530",
  phoneE164: "6282146380530",
  /** A DIFFERENT number from the phone line — the villa lists both. */
  whatsappDisplay: "+62 819-1637-6314",
  whatsappE164: "6281916376314",

  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
  },

  /** The video embedded on the current home page. */
  youtubeId: "s0T-FazO2yk",
} as const;

export const addressOneLine =
  `${business.address.street}, ${business.address.village}, ` +
  `${business.address.district}, ${business.address.regency}, ` +
  `${business.address.province} ${business.address.postalCode}`;

/**
 * Opens Google Maps directions to the address above. Coordinates are not
 * hard-coded because none were published; Google resolves the written address.
 */
export const mapsDirectionsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=" +
  encodeURIComponent(`${addressOneLine}, ${business.address.country}`);

export const mapsPlaceUrl =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(`${business.name}, ${addressOneLine}`);

/* -----------------------------------------------------------------------------
   2. THE THREE HOUSES
   -------------------------------------------------------------------------- */

export type House = {
  slug: string;
  name: string;
  /** Nightly rate in Indonesian Rupiah, as published ("start from"). */
  priceFromIDR: number;
  bed: string;
  maxGuests: number;
  sizeSqm: number;
  /** One line that separates this house from the other two. */
  distinction: string;
  /** The villa's own description, in paragraphs. */
  body: string[];
  amenities: string[];
  /** Photo slugs from src/content/photos.json. First one leads. */
  photos: string[];
};

export const houses: House[] = [
  {
    slug: "wooden-gladak-house",
    name: "Wooden Gladak House",
    priceFromIDR: 850000,
    bed: "Queen size",
    maxGuests: 2,
    sizeSqm: 12,
    distinction: "A traditional Javanese teakwood house with an open-air bathtub",
    body: [
      "The Gladak houses are traditional wooden structures originating from Java, " +
        "often referred to as Javanese bridal houses. These wooden homes are rich in " +
        "cultural heritage, featuring intricate carvings and antique furnishings that " +
        "reflect the timeless elegance of Indonesian craftsmanship. Staying in a " +
        "Gladak offers an immersive experience of Indonesian tradition, for anyone " +
        "who wants their stay to teach them something.",
      "The house is charming from the outside, with a tiny terrace and a short " +
        "entrance door — a thoughtful reflection of traditional Asian architecture and " +
        "the height of its original inhabitants. The low door also echoes the " +
        "Indonesian gesture of bowing slightly when entering a new space, a sign of " +
        "humility and respect.",
      "While the entrance is low and the terrace intimate, the interior opens up to a " +
        "surprisingly spacious and comfortable area, with a high, airy roof that brings " +
        "in light. To reach the room, guests climb five steps into a space raised above " +
        "the garden.",
      "The attached open-air bathroom has a bathtub under the sky — a genuinely " +
        "Balinese way to bathe, with views of treetops and stars. The terrace holds " +
        "antique wooden chairs, a cosy place to read and look out over the garden and " +
        "the rice fields beyond.",
    ],
    amenities: [
      "Air conditioning",
      "Wi-Fi internet",
      "Bedside reading light",
      "Mosquito net",
      "Duvet",
      "Minibar",
      "Wardrobe",
      "Carpeted floor",
      "Wooden parquet floor",
      "Bathrobe",
      "Bathtub",
      "Shower gel",
      "Shampoo",
      "Conditioner",
      "Hairdryer",
      "Bathroom",
      "Iron and ironing board on request",
      "Shower cap and dental kit on request",
      "Wooden chairs on the terrace",
      "Terrace",
    ],
    photos: [
      "gladak-bed-01",
      "gladak-bed-04",
      "gladak-ext-01",
      "gladak-bed-02",
      "bath-open-03",
      "gladak-terrace-01",
      "gladak-bed-05",
      "gladak-ext-02",
    ],
  },
  {
    slug: "hexa-bamboo-house",
    name: "Hexa Bamboo House",
    priceFromIDR: 950000,
    bed: "King size",
    maxGuests: 2,
    sizeSqm: 16,
    distinction: "Hexagonal, single storey, and the only house with no stairs",
    body: [
      "The Hexa Bamboo House is a hexagonal bamboo house designed around comfort and " +
        "access. It is single storey with no stairs, which makes it the easiest of the " +
        "three to move around — a good choice for anyone with mobility difficulties, or " +
        "for anyone who simply wants a stay at ground level.",
      "The walls are traditional woven bamboo, which gives both warmth and gentle " +
        "airflow. The open-window design encourages natural ventilation. From inside " +
        "there are quiet views over the gardens and the swimming pool.",
      "A spacious bamboo table gives room for working, writing or eating in. The " +
        "bathroom has a semi-open shower — private, but still connected to the outside.",
      "At the front there is a terrace with antique rattan chairs, a corner for reading " +
        "or drinking tea while looking out over the greenery.",
    ],
    amenities: [
      "Air conditioning",
      "Wi-Fi internet",
      "Bedside reading light",
      "Mosquito net",
      "Duvet",
      "Desk",
      "Minibar",
      "Wardrobe",
      "Carpeted floor",
      "Flat floor, no stairs",
      "Bathrobe",
      "Shower",
      "Shower gel",
      "Shampoo",
      "Conditioner",
      "Hairdryer",
      "Bathroom",
      "Iron and ironing board on request",
      "Shower cap and dental kit on request",
      "Rattan chairs on the terrace",
      "Terrace",
    ],
    photos: [
      "hexa-ext-01",
      "hexa-int-01",
      "hexa-ext-03",
      "hexa-int-02",
      "hexa-ext-02",
      "hexa-ext-04",
      "bath-dome-02",
      "hexa-ext-05",
    ],
  },
  {
    slug: "bamboo-dome",
    name: "Bamboo Dome",
    priceFromIDR: 950000,
    bed: "King size",
    maxGuests: 2,
    sizeSqm: 20,
    distinction: "A domed bamboo shell, the largest of the three",
    body: [
      "The Bamboo Dome is an architecturally unique bamboo house, built entirely from " +
        "bamboo. It is the largest of the three houses and the one people photograph " +
        "most: a curved shell rather than four walls and a ceiling.",
      "Inside, the dome has a comfortable bed with air conditioning and a mosquito net, " +
        "along with a built-in lounge for reading or simply sitting. The bathroom is on " +
        "the same level as the bedroom and has both a bathtub and a shower.",
      "To keep it private and comfortable during a nearby resort project, the Bamboo " +
        "Dome is being redesigned to become more enclosed, while keeping its airy, " +
        "nature-facing bamboo character.",
      "Guests have full access to all shared facilities, including the outdoor pool, " +
        "the tropical garden and Swarma Paon Restaurant, all of which remain open as " +
        "usual.",
    ],
    amenities: [
      "Air conditioning",
      "Wi-Fi internet",
      "Bedside reading light",
      "Mosquito net",
      "Duvet",
      "Minibar",
      "Wardrobe",
      "Carpeted floor",
      "Wooden parquet floor",
      "Bathrobe",
      "Shower",
      "Shower gel",
      "Shampoo",
      "Conditioner",
      "Hairdryer",
      "Bathroom",
      "Staircase from bathroom to bedroom",
      "Iron and ironing board on request",
      "Shower cap and dental kit on request",
      "Cushions",
    ],
    photos: [
      "dome-bed-01",
      "dome-bed-03",
      "dome-lounge-01",
      "dome-bed-05",
      "dome-lounge-02",
      "bath-dome-01",
      "dome-detail-02",
      "dome-lounge-03",
    ],
  },
];

export function houseBySlug(slug: string): House | undefined {
  return houses.find((h) => h.slug === slug);
}

/**
 * The rating the villa publishes on each of its own room pages. Carried across
 * as their claim, attributed — not presented as something this site measured.
 */
export const publishedRating = { value: 4.5, outOf: 5, source: "Google reviews, as published by the villa" };

/* -----------------------------------------------------------------------------
   3. EXPERIENCES
   -------------------------------------------------------------------------- */

export type Experience = {
  slug: string;
  name: string;
  summary: string;
  body: string[];
  /** Optional labelled list, e.g. what to bring, or the packages. */
  lists?: { title: string; items: string[] }[];
  /** Practical facts the villa published. */
  facts?: { label: string; value: string }[];
  photos: string[];
};

export const experiences: Experience[] = [
  {
    slug: "package-offer",
    name: "Package & Offer",
    summary: "Four curated packages, each built around the villa and the valley it sits in.",
    body: [
      "Escape to our riverside villa just outside Ubud, surrounded by jungle, rice " +
        "fields and the sound of flowing water. Each of our curated packages comes with " +
        "a special offer.",
    ],
    lists: [
      {
        title: "Romantic Escape",
        items: [
          "A serene retreat for two, blending relaxation and romance in the heart of Ubud",
          "Private Balinese blessing ceremony",
          "60-minute couple's Balinese massage",
          "Candlelit dinner for two",
          "Flower decoration in your villa",
          "One bottle of wine",
        ],
      },
      {
        title: "Nature Adventure",
        items: [
          "Discover Bali's sacred landscapes with your choice of adventure",
          "Option 1: jungle trek, sacred lake crossing, water temple, hidden waterfall",
          "Option 2: rice field walk, jungle river, hidden waterfall",
          "Plus a 60-minute Balinese massage",
        ],
      },
      {
        title: "Wellness Journey",
        items: [
          "Reconnect through Balinese healing traditions",
          "Water purification at a sacred temple, or a blessing at the villa with a local priest",
          "60-minute traditional Balinese massage",
        ],
      },
      {
        title: "Full-Board Stay",
        items: [
          "Every meal included for the length of your stay",
          "Breakfast from the villa's signature menu",
          "Lunch and dinner: starter, main course, dessert and one drink",
        ],
      },
    ],
    photos: ["paon-dinner-01", "ritual-01", "pool-07", "food-03"],
  },
  {
    slug: "jungle-trekking",
    name: "Jungle Trekking",
    summary: "A guided walk into a jungle the Balinese treat as sacred, ending at a waterfall.",
    body: [
      "Step into the ancient world with our jungle trekking adventure, where nature, " +
        "tradition and quiet come together in one journey. This jungle is more than a " +
        "forest — it is a sacred space, deeply honoured by the Balinese people. For " +
        "generations it has been a place of reflection and respect for the natural world.",
      "As you walk beneath towering trees and through thick tropical foliage you will " +
        "hear birdsong, rustling leaves and distant water. Along the path you will find " +
        "a hidden temple tucked into the jungle, a site rarely seen by visitors.",
      "The journey continues with a crossing of Lake Tamblingan in a traditional wooden " +
        "canoe, gliding over sacred water surrounded by misty hills and untouched " +
        "rainforest. It is a moment to breathe deeply and reconnect.",
      "After the trek there is a waterfall, where you can rest, reflect, or stand in the " +
        "cooling spray of clean mountain water. It is not just a walk in the jungle; it " +
        "is a return to something essential.",
    ],
    lists: [
      {
        title: "What to bring",
        items: [
          "Comfortable hiking or trekking shoes",
          "A light jacket — the jungle can be cool and misty",
          "Long or short trousers, whichever you find comfortable",
          "Sunscreen is recommended",
          "A small backpack for water and personal items",
        ],
      },
    ],
    photos: ["waterfall-02", "jungle-03", "waterfall-03", "jungle-06", "ricefield-01", "waterfall-01"],
  },
  {
    slug: "swarma-paon-restaurant",
    name: "Paon Restaurant by Swarma Villa",
    summary:
      "The villa's own restaurant, named after the traditional Balinese kitchen. Open to non-residents too.",
    body: [
      "In respect for Balinese culture, our restaurant is named after the traditional " +
        "Balinese kitchen, Paon — a space that stands for warmth, family and honest " +
        "flavours.",
      "Swarma Paon Restaurant offers a menu drawn from the flavours of Indonesian " +
        "cuisine alongside Western favourites. Every dish is prepared with fresh, " +
        "locally sourced ingredients. Whether you are starting the day with breakfast, " +
        "having a slow lunch or winding down over dinner, each meal is meant to connect " +
        "you to Bali's culinary heritage.",
      "For anything more personal, we also arrange private dinners in our open-air " +
        "spaces — for a quiet evening, a celebration, or a meal with family and friends. " +
        "Set against the sound of the river and the leaves, dinner here becomes " +
        "something you remember.",
      "At Swarma Paon we think dining is not only about the food. It is about sharing " +
        "moments, stories, and the spirit of Bali.",
    ],
    facts: [
      { label: "Open", value: "Daily, 8:00 to 21:00" },
      { label: "Last order", value: "20:00" },
      { label: "Open to", value: "Villa guests and non-resident visitors" },
    ],
    photos: ["paon-01", "paon-03", "food-04", "paon-09", "paon-13", "paon-dinner-01"],
  },
  {
    slug: "massage-body-rituals",
    name: "Massage & Body Rituals",
    summary: "Balinese massage and body scrubs, with homemade herbal oils, booked at the villa.",
    body: [
      "Reconnect with yourself through the healing touch of Balinese tradition. At " +
        "Swarma Villas Bali our massage and body scrub treatments are more than " +
        "relaxation — they are a cultural ritual, rooted in generations of wisdom and " +
        "natural care.",
      "Our local therapists use techniques passed down through families, combined with " +
        "homemade herbal oils and scrubs made from locally sourced ingredients and fresh " +
        "island flowers. Whether you choose a massage to release tension or a body scrub " +
        "to restore your skin, each treatment is adapted to you.",
      "Please tell your therapist what you prefer — pressure, oils, focus. They will " +
        "tailor the session to it.",
      "We believe in unhurried treatments. To honour the rhythm of the village and let " +
        "our therapists prepare properly, we recommend booking your treatment in advance.",
    ],
    photos: ["bath-flower-01", "ritual-01", "bath-open-05", "menu-spa"],
  },
];

export function experienceBySlug(slug: string): Experience | undefined {
  return experiences.find((e) => e.slug === slug);
}

/* -----------------------------------------------------------------------------
   4. TERMS & CONDITIONS — the villa's own booking terms
   -------------------------------------------------------------------------- */

export const bookingTerms = {
  intro:
    "All bookings are subject to these conditions, which are deemed to have been " +
    "accepted in full by the hirer and by every person in the party.",
  sections: [
    {
      title: "Check-in and check-out times",
      items: [
        "Check-in starts at 14:00 and the latest check-out is 12:00.",
        "A valid government ID or passport is required at check-in.",
      ],
    },
    {
      title: "Early arrival and late departure",
      items: [
        "If you arrive early, please contact reception and we will store your luggage until check-in time.",
        "Late check-out depends on room availability.",
        "Ask reception at least 24 hours before departure about late check-out.",
      ],
    },
    {
      title: "Payment",
      items: ["Full payment is due after booking the room.", "Payment is accepted in IDR and USD."],
    },
    {
      title: "Cancellation policy",
      items: [
        "Cancellation 1 to 5 days before arrival: no refund.",
        "Cancellation 7 to 10 days before arrival: 30% refund.",
        "Cancellation 15 to 30 days before arrival: 50% refund.",
      ],
    },
    {
      title: "Losses and damage",
      items: [
        "Guests are responsible for leaving the villa in good order and clean condition.",
        "Guests are liable for any loss or damage to the villa during their stay.",
        "The villa owner retains the right to repossess the villa if guests or their visitors cause damage.",
      ],
    },
    {
      title: "General rules",
      items: [
        "Please observe the rules of the villa.",
        "Illegal drugs may not be brought into the villa grounds.",
        "Please keep noise down, so as not to disturb other guests.",
      ],
    },
  ],
};

/* -----------------------------------------------------------------------------
   5. GUEST REVIEWS — only the ones the villa actually published
   -----------------------------------------------------------------------------
   The current Review page also carries one entry that is spam (a random string
   of characters submitted through the open review form). It is not reproduced
   here. Add real reviews to this list as they come in.
   -------------------------------------------------------------------------- */

export type Review = {
  title: string;
  quote: string;
  author: string;
  date: string;
  /** Where the villa published it. */
  via: string;
  language?: string;
};

export const reviews: Review[] = [
  {
    title: "My hidden gem in Bali",
    quote:
      "The stay was amazing. Close to Ubud but still with a nature vibe, and a lot on " +
      "offer for food and day trips.",
    author: "Julius",
    date: "18 April 2026",
    via: "Review submitted on swarmavillasbali.com",
  },
  {
    title: "Je recommande les yeux fermés",
    quote:
      "Je recommande les yeux fermés. La beauté du lieu, la gentillesse des hôtes, la " +
      "gourmandise des plats. Tout était parfait, je reviendrai c'est une certitude.",
    author: "Morgane Thn",
    date: "3 years ago",
    via: "Google review, shown on the villa's About page",
    language: "fr",
  },
];

/* -----------------------------------------------------------------------------
   6. PAGE COPY
   -------------------------------------------------------------------------- */

export const copy = {
  home: {
    h1: "A river-side villa in the jungle above Ubud",
    kicker: business.tagline,
    lede:
      "Three houses in the village of Singakerta, minutes from the centre of Ubud. " +
      "Timber and bamboo, a pool in the garden, and a restaurant of our own.",
  },

  about: {
    h1: "About Swarma Villas Bali",
    lede:
      "A villa on the side of a river, where you can watch the valley from your room, " +
      "with warm local hospitality and service that remembers your name.",
    body: [
      "Welcome to Swarma Villas Bali — a nature-immersed villa retreat in the quiet " +
        "village of Singakerta, minutes from the cultural heart of Ubud. Our boutique " +
        "eco-villa celebrates rustic Balinese living, sustainable design and unhurried " +
        "experiences.",
      "Swarma Villas was born from a passion for slow travel, tropical quiet and " +
        "genuine Balinese hospitality. Set among tropical greenery, rice paddies and a " +
        "gently flowing river, the villas are designed to bring you closer to nature " +
        "while keeping comfort and privacy intact. Each space blends traditional " +
        "craftsmanship with eco-minded architecture.",
      "There are three houses rather than a block of rooms: a traditional Javanese " +
        "teakwood gladak, a woven bamboo house on a hexagonal plan, and a bamboo dome. " +
        "Each has its own character, and all of them open onto the same garden and pool.",
      "Respecting Balinese culture, our restaurant takes its name from the traditional " +
        "Balinese kitchen, Paon. Swarma Paon serves a menu of Indonesian heritage " +
        "dishes alongside Western ones. Alongside it, our therapists offer massage and " +
        "body rituals during your stay — tell them what you prefer and they will adapt.",
    ],
    why: [
      {
        title: "An Ubud location that is actually quiet",
        text:
          "Tucked into Singakerta's rice paddies and jungle, yet only minutes from " +
          "central Ubud — art, wellness and the rest of it.",
      },
      {
        title: "Eco-minded comfort",
        text:
          "Bamboo and teakwood structures designed to sit with the landscape rather " +
          "than on top of it.",
      },
      {
        title: "Personal guest care",
        text: "A small team, focused on service that is meaningful rather than scripted.",
      },
      {
        title: "Slow Bali living",
        text:
          "A place for people who want to slow down, reconnect with nature and explore " +
          "the spiritual side of Bali.",
      },
    ],
  },

  houses: {
    h1: "Three houses, three published rates",
    lede:
      "A gladak in Javanese teak, a hexagonal bamboo house and a bamboo dome. Every " +
      "rate is published in full — compare all three on one screen.",
  },

  experiences: {
    h1: "Experiences at Swarma Villas",
    lede:
      "Packages, jungle trekking, our own restaurant and Balinese body rituals — all " +
      "arranged on the property, so a day here does not have to start with transport.",
  },

  gallery: {
    h1: "Gallery",
    lede: "The houses, the garden, the pool, the restaurant and the valley around them.",
  },

  review: {
    h1: "Guest reviews",
    lede: "What guests have written about staying here.",
  },

  contact: {
    h1: "Book your stay",
    lede:
      "Send your dates and we will reply on WhatsApp with availability. No payment is " +
      "taken through this form.",
    blurb:
      "Contact us and let us help with your stay. We appreciate your questions — our " +
      "team is ready to help with whatever you need.",
  },

  terms: {
    h1: "Terms & conditions",
    lede: "The conditions that apply to every booking at Swarma Villas Bali.",
  },

  location: {
    heading: "Getting here",
    lede:
      "Swarma Villas Bali is on Jl. Raya Kengetan Gang Abian Tiying in Singakerta, in " +
      "the Ubud district of Gianyar.",
  },
} as const;

/* -----------------------------------------------------------------------------
   7. NAVIGATION AND CALLS TO ACTION
   -------------------------------------------------------------------------- */

export const cta = {
  primary: { label: "Book direct", href: "/contact" },
  secondary: { label: "Ask on WhatsApp" },
} as const;

/** The seven items the current site carries, in the same order. */
export const nav = [
  { label: "Home", href: "" },
  { label: "About", href: "/about" },
  { label: "Houses", href: "/houses" },
  { label: "Experiences", href: "/experiences" },
  { label: "Review", href: "/review" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;

export const guestCountOptions = [1, 2, 3, 4] as const;

/**
 * Every page of a template, in order. Used by the sitemap, the audit and the
 * footer, so there is exactly one list to keep correct.
 */
export const pagePaths = [
  "",
  "/about",
  "/houses",
  ...houses.map((h) => `/houses/${h.slug}`),
  "/experiences",
  ...experiences.map((e) => `/experiences/${e.slug}`),
  "/gallery",
  "/review",
  "/contact",
  "/term-condition",
  "/privacy",
  "/terms-of-use",
];
