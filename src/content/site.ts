/* =============================================================================
   SWARMA VILLAS BALI — SINGLE SOURCE OF CONTENT
   =============================================================================

   HOW TO EDIT THIS FILE (no coding needed)
   ----------------------------------------
   - Everything the site displays comes from this one file.
   - Only edit the text between the quote marks: "like this".
   - Do not delete the commas, brackets or braces around the text.

   WHERE THIS CAME FROM
   --------------------
   The wording is the villa's own, supplied on 25 September 2026 as
   "SWARMA VILLAS BALI - web" and "…- HOUSE", and transcribed here. Nothing has
   been invented. Where the documents left a sentence out of order (the
   government-ID line under check-in), it was moved, not rewritten.

   The house rates, the cancellation policy, the house names and the Bamboo
   Dome's description all changed in that revision. Nothing on this site should
   contradict them.
   ============================================================================= */

/* -----------------------------------------------------------------------------
   1. BUSINESS DETAILS
   -------------------------------------------------------------------------- */

export const business = {
  name: "Swarma Villas Bali",
  /** The line that heads the calls to action. */
  tagline: "River Side & Greenery View",
  /** How the villa describes itself, in its own words. */
  positioning: "Eco Chic Greenery Retreat in Singakerta, Ubud — Bali, Indonesia",
  /** The villa's own footer line. */
  footerLine: "Come Slowly. Stay Naturally.",
  footerBlurb:
    "A small place in Singakerta - Ubud, made for travellers who appreciate " +
    "nature, culture, thoughtful design and genuine hospitality.",

  address: {
    street: "Jl. Raya Kengetan Gang Abian Tiying",
    village: "Singakerta",
    district: "Kecamatan Ubud",
    regency: "Kabupaten Gianyar",
    province: "Bali",
    postalCode: "80571",
    country: "Indonesia",
    countryCode: "ID",
    /**
     * NOT SHOWN ON THE SITE, and it should not be until the villa confirms it.
     *
     * This is the plus code their Google listing publishes, but it does not
     * decode to Singakerta: "M7CM+XVJ" resolves to -8.3276, 115.2846, which is
     * around Tegallalang, roughly 24 km north of the street address above.
     * A plus code is what a guest pastes into Maps, so a wrong one sends them
     * to the wrong village. Put the corrected code here and restore the row in
     * the location band when they confirm it.
     */
    plusCode: "M7CM+XVJ",
  },

  email: "info@swarmavillas.com",
  /** Reservations line. */
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

  /**
   * The villa's film. The "In Motion" section is hidden until their own video
   * shoot is finished — see showVideoSection below.
   */
  youtubeId: "s0T-FazO2yk",
} as const;

/**
 * THE BOOKING ENGINE.
 *
 * Guestaps (MarketConnect), merchant slug "swarma-villas-ubud", supplied by the
 * villa on 29 September 2026. secure.guestaps.com currently redirects to
 * secure.guestpro.net; the address below is the vendor's own documented entry
 * point, so it is the one to keep.
 *
 * Set this back to null and every Book Direct button falls back to the enquiry
 * form. Nothing else needs changing either way — see bookDirect below.
 *
 * The engine also takes dates directly, which nothing here uses yet:
 *   https://secure.guestaps.com/swarma-villas-ubud/hotel-filter-redirect
 *     /YYYY-MM-DD/YYYY-MM-DD/<promo code, or promo_code_empty>?guest=A-C-I
 * and publishes availability and nightly rates for merchant
 * 88b92680-6b1c-4e52-a22b-d6ed6f0d5692 through
 * api.marketconnect.id/guestapp-hotel/api/search-availability.
 */
export const bookingUrl: string | null = "https://secure.guestaps.com/swarma-villas-ubud";

/**
 * The home page's "In Motion" band. The villa asked for it to be hidden until
 * their video shoot is finished; set this to true to bring it back.
 */
export const showVideoSection = false;

/**
 * THE PUBLISHED NUMBER.
 *
 * The villa has two lines: a reservations phone (ending 0530) and a WhatsApp
 * number (ending 6314). They asked for only the WhatsApp one to appear on the
 * site for now. Set showReservationsLine to true to put the reservations
 * number back beside it; everything reads these three, so that is the only
 * change needed.
 */
export const showReservationsLine = false;
export const publicPhoneDisplay = business.whatsappDisplay;
export const publicPhoneE164 = business.whatsappE164;

export const addressOneLine =
  `${business.address.street}, ${business.address.village}, ` +
  `${business.address.district}, ${business.address.regency}, ` +
  `${business.address.province} ${business.address.postalCode}`;

/**
 * Opens Google Maps directions to the address above. Coordinates are not
 * hard-coded because none have been confirmed — see plusCode above — so Google
 * resolves the written address, which is the part we know to be right.
 */
export const mapsDirectionsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=" +
  encodeURIComponent(`${addressOneLine}, ${business.address.country}`);

export const mapsPlaceUrl =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(`${business.name}, ${addressOneLine}`);

/* -----------------------------------------------------------------------------
   2. THE HOUSES
   -----------------------------------------------------------------------------
   Three types across five individual houses: two Gladak, one Hexa, two Domes.

   THE RATES BELOW ARE THE ONES THAT STAND. The booking engine currently quotes
   more — 700,000 / 900,000 / 1,000,000 against the 500,000 / 600,000 / 700,000
   here — because the villa has not set their discounts up in it yet. Asked
   which to follow on 29 September 2026, they said the website's. So do not
   "correct" these to match the engine: the engine is the thing that is going
   to move. The booking bar deliberately shows no engine price for the same
   reason.
   -------------------------------------------------------------------------- */

export type House = {
  slug: string;
  name: string;
  /** Nightly rate in Indonesian Rupiah, as published ("start from"). */
  priceFromIDR: number;
  bed: string;
  maxGuests: number;
  sizeSqm: number;
  /** How many houses of this type the villa has. */
  count: number;
  /**
   * What this house is called inside the booking engine, exactly. Matched by
   * name, so if the villa renames a room there, rename it here too — a house
   * whose names stop matching simply shows no live rate, it does not break.
   */
  engineRooms: readonly string[];
  /** One line that separates this house from the other two. */
  distinction: string;
  /** The villa's own description, in paragraphs. */
  body: string[];
  /** In the villa's own order. */
  amenities: string[];
  /** Photo slugs from src/content/photos.json. First one leads. */
  photos: string[];
};

export const houses: House[] = [
  {
    slug: "gladak-house",
    name: "Gladak House",
    priceFromIDR: 500000,
    bed: "Queen size",
    maxGuests: 2,
    sizeSqm: 12,
    count: 2,
    engineRooms: ["Gladak House 1", "Gladak House 2"],
    distinction:
      "A traditional Javanese teakwood house with heritage details and an open air bathtub beneath the sky.",
    body: [
      "The Gladak houses are traditional wooden structures originating from Java, often " +
        "referred to as Javanese bridal houses. Rich in cultural heritage, they feature " +
        "intricate carvings and antique furnishings that reflect the timeless character of " +
        "Indonesian craftsmanship. There are two Gladak houses at Swarma, making them a " +
        "lovely choice for friends or family who would like to stay in the same style of " +
        "house while keeping their own private space.",
      "The house is charming from the outside, with a tiny terrace and a short entrance " +
        "door, a thoughtful reflection of traditional Asian architecture. The low door also " +
        "echoes the Indonesian gesture of bowing slightly when entering a new space, a sign " +
        "of humility and respect.",
      "While the entrance is low and the terrace intimate, the interior opens into a " +
        "surprisingly spacious and comfortable area, with a high, airy roof that brings in " +
        "natural light. Five steps lead up from the garden into the house.",
      "The attached open air bathroom features a bathtub beneath the sky, offering a " +
        "distinctly Balinese way to bathe surrounded by treetops and, on clear nights, the " +
        "stars. The terrace has antique wooden chairs, creating a quiet place to read or " +
        "enjoy the garden and surrounding landscape.",
    ],
    amenities: [
      "Air conditioning",
      "WiFi internet",
      "Bedside reading light",
      "Mosquito net",
      "Duvet",
      "Minibar",
      "Wardrobe",
      "Carpeted floor",
      "Wooden parquet floor",
      "Bathrobe",
      "Bathtub",
      "Shower",
      "Shower gel",
      "Shampoo",
      "Conditioner",
      "Hairdryer",
      "Shower cap and dental kit on request",
      "Wooden chairs",
      "Terrace",
      "Iron and ironing board on request",
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
    slug: "bamboo-hexa",
    name: "Bamboo Hexa",
    priceFromIDR: 600000,
    bed: "King size",
    maxGuests: 2,
    sizeSqm: 16,
    count: 1,
    engineRooms: ["Bamboo Hexa"],
    distinction:
      "An elegant hexagonal, single storey bamboo house with traditional woven walls, a semi open shower and no stairs.",
    body: [
      "The Bamboo Hexa is a hexagonal bamboo house designed around comfort and easy " +
        "access. It is single storey with no stairs, making it the only house type at " +
        "Swarma with a completely ground level layout. As the only Bamboo Hexa, it offers a " +
        "more individual stay for guests looking for its particular design and easy access.",
      "The walls are made using traditional woven bamboo, bringing warmth and gentle " +
        "airflow to the space. Open windows encourage natural ventilation, while the " +
        "interior offers quiet views of the garden and swimming pool.",
      "A spacious bamboo table provides room for working, writing or enjoying a meal. The " +
        "bathroom has a private semi open shower that maintains a connection with the " +
        "surrounding environment.",
      "At the front, a terrace with antique rattan chairs creates a relaxed corner for " +
        "reading, drinking tea or enjoying the greenery.",
    ],
    amenities: [
      "Air conditioning",
      "WiFi internet",
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
      "Shower cap and dental kit on request",
      "Rattan chairs",
      "Terrace",
      "Iron and ironing board on request",
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
    priceFromIDR: 700000,
    bed: "King size",
    maxGuests: 2,
    sizeSqm: 20,
    count: 2,
    engineRooms: ["Bamboo Dome 1", "Bamboo Dome 2"],
    distinction:
      "A distinctive bamboo dome with a curved interior and an enclosed bathroom featuring both a bathtub and shower.",
    body: [
      "The Bamboo Dome is an architecturally unique bamboo house, built around a " +
        "distinctive curved form rather than conventional four walls and a ceiling. It is " +
        "the largest of the three house types and one of Swarma's most distinctive spaces. " +
        "Two Bamboo Domes are available at Swarma, giving couples travelling with friends " +
        "or families the option to stay close together while enjoying the privacy of their " +
        "own Dome.",
      "Inside, the dome has a comfortable bedroom with air conditioning, a mosquito net " +
        "and a small sofa with a table suitable for working on a laptop, reading or simply " +
        "relaxing. The bathroom is on the same level as the bedroom and features both a " +
        "bathtub and shower.",
      "The Bamboo Dome is now fully enclosed for greater privacy and comfort, while " +
        "retaining its distinctive bamboo character and connection to the surrounding " +
        "greenery.",
      "Guests have full access to all shared facilities, including the outdoor pool, " +
        "tropical garden and Swarma Paon Restaurant.",
    ],
    amenities: [
      "Air conditioning",
      "WiFi internet",
      "Bedside reading light",
      "Mosquito net",
      "Duvet",
      "Small sofa",
      "Small table for laptop",
      "Minibar",
      "Wardrobe",
      "Carpeted floor",
      "Wooden parquet floor",
      "Bathrobe",
      "Bathtub",
      "Shower",
      "Shower gel",
      "Shampoo",
      "Conditioner",
      "Hairdryer",
      "Shower cap and dental kit on request",
      "Iron and ironing board on request",
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

/* -----------------------------------------------------------------------------
   3. PAON RESTAURANT
   -------------------------------------------------------------------------- */

export const restaurant = {
  kicker: "Restaurant",
  h1: "Paon Restaurant by Swarma Villa",
  /*
   * Replaced wholesale on 29 September 2026 from the villa's own document,
   * "SWARMA VILLAS BALI - web - Restaurant". Its opening line does the work the
   * old lede did, so it is the lede now rather than a near-repeat of it.
   */
  lede:
    "Open daily and welcoming to everyone, Paon Restaurant by Swarma Villa is an " +
    "open air restaurant set within a beautifully restored Javanese wooden house.",
  body: [
    "In respect for Balinese culture, our restaurant is named after the traditional " +
      "Balinese kitchen, Paon — a place associated with warmth, family and honest flavours.",
    "At Swarma, the kitchen is more than a place where food is prepared. It is a place " +
      "where people come together.",
    "Surrounded by greenery and warm Indonesian craftsmanship, Paon brings together the " +
      "character of a traditional wooden home with a relaxed dining experience. Our menu " +
      "is inspired by the flavours of Bali and Indonesia, alongside a selection of " +
      "Western favourites.",
    "Whether you are staying with us or simply visiting the area, you are always welcome " +
      "at Paon. Come for breakfast, lunch, dinner, a relaxed meal in the garden, or " +
      "simply to enjoy good food in a peaceful setting.",
  ],
  /** Two titled parts the villa added below the opening text. */
  sections: [
    {
      title: "Dining Your Way",
      body: [
        "Our kitchen is happy to accommodate dietary requirements and food allergies " +
          "whenever possible. If you have specific dietary needs, please let us know in " +
          "advance so our team can prepare your meal with care.",
        "Planning something special? Paon can also cater for special occasions and " +
          "private celebrations, from a relaxed dinner to a more personal gathering. " +
          "Share your plans with us and we will be happy to discuss the menu and " +
          "arrangements.",
      ],
    },
    {
      title: "Staying Nearby?",
      body: [
        "You do not need to be a Swarma guest to enjoy Paon. Non resident guests are " +
          "welcome, and if you prefer to enjoy your meal where you are staying, food " +
          "delivery can also be arranged, subject to availability and location.",
      ],
    },
  ],
  closing:
    "Come as you are, stay for a while, and enjoy the flavours of Bali and Indonesia at Paon.",
  cuisineTitle: "Our cuisine",
  cuisine: [
    { name: "Balinese", text: "Traditional flavours and ingredients inspired by Bali." },
    { name: "Indonesian", text: "Familiar dishes from across the Indonesian archipelago." },
    { name: "Western", text: "Comfortable choices for guests looking for something familiar." },
    { name: "Breakfast", text: "Start the morning slowly with breakfast at Paon." },
  ],
  /**
   * The space the villa asked to have held for the menu. Put a path or a URL in
   * `href` and the button appears; until then the space carries the note and a
   * way to ask for it. There is a menu COVER in the photo library
   * ("menu-cover") but no pages behind it, which is why this is still null.
   */
  menu: {
    label: "View menu",
    href: null as string | null,
    pending: "Our full menu is being prepared. Ask us and we will send it over.",
  },
  detailsTitle: "Restaurant details",
  details: [
    { label: "Open daily", value: "08:00 – 21:00" },
    { label: "Served", value: "Breakfast · Lunch · Dinner" },
    { label: "Open to", value: "Villa guests and non resident visitors" },
  ],
  cta: {
    kicker: "Greenery & Garden View",
    title: "Add Paon Restaurant by Swarma Villa to Your Stay",
    lede:
      "Enjoy breakfast, lunch or dinner at Paon during your stay at Swarma Villas. " +
      "Send us your dates and we'll reply on WhatsApp with availability and direct " +
      "booking options.",
  },
  photos: ["paon-01", "paon-03", "food-04", "paon-09", "paon-13", "paon-dinner-01"],
} as const;

/* -----------------------------------------------------------------------------
   4. EXPERIENCES
   -------------------------------------------------------------------------- */

export const experience = {
  kicker: "Experience",
  h1: "Experience Beyond the Room",
  lede: "Cultural, wellness and nature experiences to discover Bali and beyond, at your own pace.",

  intro: {
    kicker: "Experiences",
    title: "More Than a Stay",
    body: [
      "Some of the most memorable moments are found beyond your room.",
      "At Swarma Villas, experiences are a natural part of staying with us — from taking " +
        "time to slow down with a traditional Balinese massage to discovering local " +
        "culture, nature and landscapes beyond the property.",
      "Whether you are looking for quiet time, a deeper connection with Balinese " +
        "traditions or an adventure into nature, our team can help arrange experiences to " +
        "suit your stay.",
    ],
  },

  wellness: {
    kicker: "Wellness",
    title: "Massage & Body Scrub",
    body: [
      "Reconnect with yourself through the healing touch of Balinese tradition.",
      "At Swarma Villas Bali, our Massage & Body Scrub treatments are more than just " +
        "relaxation. They are rooted in traditional techniques passed down through " +
        "generations, with a focus on care, balance and taking time to unwind.",
      "Our local therapists use time honoured techniques and carefully selected oils and " +
        "scrubs. Choose a soothing massage to ease tension or a body scrub to refresh and " +
        "care for your skin. Each treatment is adapted to your preferences and needs.",
      "Whether you prefer a gentle, relaxing massage or a more invigorating treatment, " +
        "simply let your therapist know what feels right for you. We believe every " +
        "treatment should feel personal, comfortable and unhurried.",
      "To honour the quiet rhythm of the village and give our therapists time to prepare, " +
        "we recommend booking your treatment in advance.",
      "Take a moment to slow down, breathe and reconnect.",
    ],
    photos: ["bath-flower-01", "ritual-01", "bath-open-05", "menu-spa"],
    /**
     * As above. The library does hold a treatment menu ("menu-spa") with real
     * prices, but it carries the old logo, the reservations number the villa
     * has just taken off the site and a gmail address, so it is not linked
     * here until they send a current one.
     */
    menu: {
      label: "View treatment menu",
      href: null as string | null,
      pending: "Our treatment menu is being updated. Ask us and we will send it over.",
    },
  },

  beyond: {
    kicker: "Beyond the Villa",
    title: "Discover Bali & Beyond",
    body: [
      "There is more to experience beyond Swarma.",
      "We can help arrange a selection of cultural, nature and outdoor experiences, from " +
        "meaningful local traditions to adventures further afield. Discover Bali at a " +
        "slower pace, or venture beyond the island to experience more of Indonesia.",
    ],
    items: [
      {
        name: "Water Temple Purification",
        body: [
          "Visit a Balinese water temple and take part in a traditional purification ritual.",
          "Known locally as melukat, the ceremony is a spiritual practice of cleansing and " +
            "renewal, guided by local traditions and temple customs.",
        ],
        photo: "waterfall-01",
      },
      {
        name: "Rice Field Walking",
        body: [
          "Slow down and explore the landscapes around Bali on foot.",
          "Walk through rice fields, village paths and quieter corners of the countryside " +
            "while experiencing a different side of everyday Balinese life.",
        ],
        photo: "ricefield-01",
      },
      {
        name: "Jungle Trekking & Waterfall",
        body: [
          "For those who enjoy a little more adventure, explore Bali's natural landscapes on foot.",
          "Our jungle trekking experiences can include crossing a lake, walking through " +
            "tropical surroundings and visiting a waterfall along the way. A rewarding way " +
            "to spend a day surrounded by nature.",
        ],
        photo: "jungle-01",
      },
      {
        name: "Hiking & Nature Adventures",
        body: [
          "Discover Bali's landscapes through hiking and outdoor adventures suited to your " +
            "interests and experience level.",
          "From gentle walks to more challenging routes, our team can help arrange an " +
            "experience that allows you to explore beyond the usual tourist paths.",
        ],
        photo: "jungle-03",
      },
      {
        name: "Mount Ijen & The Blue Fire",
        body: [
          "For a journey beyond Bali, travel to Java to experience Mount Ijen and its " +
            "famous blue fire phenomenon.",
          "An early start and overnight journey make this a more adventurous experience, " +
            "but it offers the opportunity to witness one of Indonesia's remarkable natural " +
            "landscapes.",
        ],
        photo: "jungle-06",
      },
      {
        name: "More of Indonesia",
        body: [
          "Your journey does not have to end in Bali.",
          "For guests staying longer or looking to explore further, we can help arrange " +
            "experiences and journeys to other parts of Indonesia, including islands, " +
            "cultural destinations and natural landscapes.",
        ],
        photo: "waterfall-03",
      },
    ],
  },

  closing: {
    title: "Let Us Arrange Your Experience",
    body: [
      "Tell us what you would like to discover during your stay, and our team will be " +
        "happy to help arrange the experience for you.",
      "Some experiences require advance planning and are subject to availability, weather " +
        "and local conditions.",
      "Discover more. Take your time. Experience Indonesia.",
    ],
    cta: "Enquire About Experiences",
  },
} as const;

/* -----------------------------------------------------------------------------
   5. PACKAGES & SPECIAL OFFERS
   -------------------------------------------------------------------------- */

export const packages = {
  kicker: "Package & Offer",
  h1: "Packages & Special Offers",
  lede:
    "Romantic stays, nature experiences, wellness and longer stay offers, created " +
    "around your time at Swarma.",

  intro: {
    title: "Thoughtful Ways to Stay",
    body: [
      "Make your time at Swarma a little more special with a stay designed around what " +
        "you enjoy — romance, nature, wellness or simply having everything taken care of.",
      "Our packages combine accommodation with selected experiences and dining, while our " +
        "longer stay offers make it easier to settle in and enjoy Swarma at a slower pace.",
    ],
  },

  listTitle: "Our Packages",
  list: [
    {
      name: "Romantic Escape",
      tagline: "A Serene Stay for Two",
      body: ["A relaxed romantic experience combining wellness, dining and thoughtful details for two."],
      includedTitle: "Included",
      included: [
        "60-minute couple's Balinese massage",
        "Candlelit dinner for two",
        "Flower decoration in your house",
        "One bottle of wine",
      ],
      photo: "paon-dinner-01",
    },
    {
      name: "Nature Adventure",
      tagline: "Discover Bali Through Nature",
      body: [
        "Spend a day exploring Bali's natural landscapes, with a choice of two experiences.",
        "Option 1 — Jungle, Lake & Waterfall: jungle trek, sacred lake crossing, water " +
          "temple and hidden waterfall.",
        "Option 2 — Rice Fields, River & Waterfall: rice field walk, jungle river and " +
          "hidden waterfall.",
        "A great choice for guests who would like to combine time in nature with a little " +
          "relaxation afterwards.",
      ],
      includedTitle: "Also included",
      included: ["60-minute Balinese massage"],
      photo: "waterfall-02",
    },
    {
      name: "Wellness Journey",
      tagline: "A Slower Way to Reconnect",
      body: [
        "Take time to slow down with a traditional Balinese water purification experience " +
          "and a relaxing massage.",
        "A peaceful experience centred around reflection, renewal and rest.",
      ],
      includedTitle: "Included",
      included: [
        "Water purification at a sacred temple",
        "60-minute traditional Balinese massage",
      ],
      photo: "bath-flower-01",
    },
    {
      name: "Full Board Stay",
      tagline: "Everything You Need, Included",
      body: [
        "Enjoy your stay with meals arranged throughout your visit, so you can spend more " +
          "time relaxing and less time planning where to eat.",
      ],
      includedTitle: "Included",
      included: [
        "Daily breakfast from our signature menu",
        "Lunch with starter, main course, dessert and one drink",
        "Dinner with starter, main course, dessert and one drink",
      ],
      photo: "food-03",
    },
  ],

  rates: {
    title: "Package Rates",
    body: [
      "Package prices are not published on our website, as they depend on your dates, " +
        "house and number of guests.",
      "Send us your preferred dates and party size, and we will prepare the package " +
        "options and rate for your stay.",
    ],
    cta: "Ask About a Package",
  },

  offers: {
    kicker: "Special Offers",
    title: "Stay Longer, Stay Slower",
    body: [
      "Some stays are better enjoyed without rushing.",
      "For guests planning a longer visit or travelling together as a group, we offer " +
        "special rates based on your dates, length of stay and number of guests.",
    ],
    items: [
      { name: "Weekly Stay", from: "From IDR 2,800,000", text: "Special rates available for weekly stays." },
      { name: "Monthly Stay", from: "From IDR 10,500,000", text: "Special rates available for monthly stays." },
      {
        name: "Group Stay",
        from: "Travelling with friends or family?",
        text: "Ask us about special group rates when booking multiple houses or planning a longer stay.",
      },
    ],
    closing: {
      title: "Ask for Your Special Rate",
      body: [
        "Rates vary depending on availability, dates, length of stay and group size.",
        "Send us your dates and number of guests, and we will reply with the available " +
          "option and special rate for your stay.",
      ],
      cta: "Enquire on WhatsApp",
    },
  },
} as const;

/* -----------------------------------------------------------------------------
   6. GUEST REVIEWS — only the ones the villa actually published
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
   7. PAGE COPY
   -------------------------------------------------------------------------- */

export const copy = {
  home: {
    h1: "A riverside villa in the greenery of Ubud",
    lede:
      "Three houses in the village of Singakerta, minutes from the centre of Ubud. " +
      "Timber and bamboo, a pool in the garden, and Paon, our own restaurant in a " +
      "beautifully restored Javanese wooden house.",

    houses: {
      kicker: "Where you Sleep",
      title: "Three Houses. Three Distinct Ways to Stay.",
      lede:
        "Javanese teak, woven bamboo and an unconventional bamboo dome. Each house has " +
        "its own character, crafted to offer a different way of experiencing Swarma.",
    },

    villa: {
      kicker: "The Villa",
      /**
       * Two lines. The villa asked for the break to fall after "Nature."
       * rather than wherever the measure happens to put it, so the break is
       * written here rather than left to the browser.
       */
      titleLines: ["Stay Close to Nature.", "Stay Close to What Matters."],
      body: [
        "Swarma Villas is a small eco conscious stay in Singakerta, Ubud, shaped by " +
          "nature, culture and simple Balinese hospitality.",
        "Three distinctive homes, each with its own character, are set among tropical " +
          "greenery, with spaces to slow down and enjoy the surroundings.",
        "Enjoy a refreshing swim, a relaxed meal at Paon Restaurant, quiet moments in the " +
          "tropical garden, or a traditional Balinese massage — all within the property.",
        "Small in scale. Personal in spirit.",
      ],
      cta: "Discover Swarma Villas",
    },

    experiences: {
      kicker: "On the Property",
      title: "Experiences at Swarma Villas",
      lede:
        "Swim, dine, unwind and reconnect at Swarma — with our pool, Paon Restaurant " +
        "and traditional Balinese massage. When you feel " +
        "like exploring further, discover Ubud and its surroundings through jungle " +
        "trekking, rice field walks, water purification, hiking and other experiences " +
        "arranged beyond the property.",
      cards: [
        {
          name: "Paon Restaurant by Swarma Villas",
          text:
            "The villa's own restaurant, named after the traditional Balinese kitchen. " +
            "Open to non residents too.",
          href: "/restaurant",
          photo: "paon-01",
        },
        {
          name: "Massage & Body Ritual",
          text:
            "Balinese massage and body scrub, rooted in techniques passed down through " +
            "generations.",
          href: "/experiences",
          photo: "bath-flower-01",
        },
        {
          name: "Package & Offer",
          text:
            "Thoughtfully created stays and seasonal offers, designed to make your time " +
            "at Swarma even more memorable.",
          href: "/packages",
          photo: "paon-dinner-01",
        },
        {
          name: "Beyond Swarma",
          text:
            "Explore beyond the property through cultural experiences, nature walks, " +
            "outdoor adventures and journeys across Indonesia.",
          href: "/experiences",
          photo: "jungle-01",
        },
      ],
    },

    cta: {
      title: "Come and Experience Swarma",
      lede:
        "Send us your dates and we'll reply on WhatsApp with availability and our best " +
        "direct rate.",
    },
  },

  about: {
    h1: "About Swarma Villas Bali",
    lede:
      "A villa on the side of Ubud greenery, where you can watch the valley from your room, " +
      "with warm local hospitality and service that remembers your name.",
    /** The opening, before the first sub-heading. */
    intro: [
      "Welcome to Swarma Villas Bali — a small, nature immersed retreat in the quiet " +
        "village of Singakerta, around 10 minutes from the cultural heart of Ubud. " +
        "Surrounded by tropical greenery and the gentle rhythm of village life, Swarma " +
        "offers a more personal way to experience Bali, combining traditional " +
        "craftsmanship, thoughtful design and warm Balinese hospitality.",
      "Swarma Villas was born from a passion for slow travel, tropical surroundings and " +
        "the simple pleasure of having time to pause. Rather than a conventional hotel " +
        "with rows of rooms, Swarma is made up of three individual houses, each with its " +
        "own character and story. The experience is intimate, relaxed and connected to " +
        "the natural setting around it.",
    ],
    sections: [
      {
        title: "Three Houses, Three Stories",
        body: [
          "At Swarma, each house offers a different way to stay.",
          "The Gladak House is a traditional Javanese teakwood house, crafted from " +
            "reclaimed timber and enriched with antique details and carved elements. Its " +
            "heritage architecture brings a piece of Java into the landscape of Bali, " +
            "while its open air bathtub creates a quiet connection with the outdoors.",
          "The Bamboo Dome offers something entirely different. Its distinctive curved " +
            "structure is built around the character of bamboo, creating an unconventional " +
            "and intimate space for travellers who appreciate architecture, creativity and " +
            "nature. Its enclosed bathroom beneath the curved bamboo roof includes both a " +
            "bathtub and shower.",
          "The Bamboo Hexa is a single level bamboo house built on a hexagonal plan. " +
            "Traditional woven bamboo walls, natural airflow and its easy, stair free " +
            "access make it a comfortable choice for guests who prefer a more grounded and " +
            "accessible stay.",
          "Although each house is different, they share the same surroundings: the " +
            "tropical garden, swimming pool and the relaxed atmosphere of Swarma.",
        ],
      },
      {
        title: "A Place to Eat, Rest and Connect",
        body: [
          "At the heart of the property is Paon Restaurant, our own restaurant named after " +
            "the traditional Balinese word for kitchen. Housed in a restored antique wooden " +
            "building from Java, Paon brings together Indonesian heritage flavours and " +
            "familiar Western dishes in a relaxed garden setting.",
          "Food at Swarma is intended to feel approachable and welcoming. Guests can enjoy " +
            "breakfast, lunch or dinner without having to leave the property, while " +
            "non residents are also welcome to dine at Paon.",
          "For those looking to slow down further, our massage and body rituals offer " +
            "another way to relax. Local therapists practise traditional Balinese " +
            "techniques passed down through generations, with treatments adapted to each " +
            "guest's preferred pressure, focus and pace.",
        ],
      },
      {
        title: "More Than a Place to Stay",
        body: [
          "We believe a stay in Bali can be about more than where you sleep. It can be " +
            "about experiencing the culture, landscape and everyday rhythm of the island.",
          "Some experiences take place at Swarma, while others invite you to explore " +
            "further. Depending on your interests, we " +
            "can arrange experiences such as rice field walks, jungle trekking, water " +
            "purification, hiking and other cultural and nature based activities. Selected " +
            "journeys can also take you beyond Bali to other parts of Indonesia, including " +
            "Java and its unique landscapes.",
        ],
      },
      {
        title: "Our Way of Hospitality",
        body: [
          "Swarma is Balinese owned and family managed, with a local team who take pride " +
            "in creating a warm and personal experience for every guest.",
          "Our approach to hospitality is simple: comfortable spaces, thoughtful details, " +
            "good food, genuine care and the freedom to enjoy your stay at your own pace.",
          "We value the character of traditional materials and architecture, while " +
            "continuing to adapt our spaces to the needs of modern travellers. " +
            "Sustainability is part of this approach — not as a statement, but through the " +
            "way we design, maintain and use the property.",
          "Whether you come to discover Ubud, spend quiet days in the garden, experience " +
            "Indonesian craftsmanship or simply take a break from a busy routine, Swarma " +
            "offers a place to slow down and experience Bali in a more personal way.",
          "Welcome to Swarma Villas Bali.",
        ],
      },
    ],
    why: [
      {
        title: "An Ubud location that is actually quiet",
        text:
          "Tucked into Singakerta's rice paddies and greenery, yet only minutes from " +
          "central Ubud — art, wellness and the rest of it.",
      },
      {
        title: "Eco minded comfort",
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
    cta: {
      title: "Come and Experience Swarma",
      lede:
        "Discover a slower side of Bali, with a stay shaped by nature, culture and warm " +
        "local hospitality.",
    },
  },

  houses: {
    kicker: "Where you Sleep",
    /** The plain string, for metadata and anywhere a heading is not rendered. */
    h1: "Three Houses. Each With Its Own Character.",
    /** Rendered form. The villa asked for the break to fall before "Each". */
    h1Lines: ["Three Houses.", "Each With Its Own Character."],
    lede:
      "Swarma Villas has three types of accommodation across five individual houses, " +
      "each offering a different way to experience the property. From reclaimed Javanese " +
      "teak to woven bamboo architecture, every house has its own character, while " +
      "sharing the same idea: comfort without losing character.",
    ratesNote:
      "Rates shown are starting rates. For current rates and availability, you can book " +
      "through “Book Direct” or contact us on WhatsApp for more information.",
    cta: {
      title: "Which House Is Yours?",
      lede:
        "Tell us your dates and how many guests are staying, and we'll show you what's " +
        "available.",
    },
    houseCta: {
      title: "Which House Is Yours?",
      lede:
        "Three distinct house types, with five individual stays to choose from. Send " +
        "your dates and we'll help you find the right one.",
    },
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

  journal: {
    kicker: "The Swarma Journal",
    h1: "Stories from Singakerta",
    lede:
      "Notes on the houses, the kitchen, the village and the experiences around us — " +
      "written slowly, in the villa's own voice.",
  },

  location: {
    heading: "Getting here",
    lede:
      "Swarma Villas Bali is on Jl. Raya Kengetan Gang Abian Tiying in Singakerta, in " +
      "the Ubud district of Gianyar.",
  },
} as const;

/* -----------------------------------------------------------------------------
   8. NAVIGATION AND CALLS TO ACTION
   -------------------------------------------------------------------------- */

export const cta = {
  primary: { label: "Book Direct", href: "/contact" },
  secondary: { label: "Ask on WhatsApp" },
  contact: { label: "Contact us", href: "/contact" },
} as const;

/**
 * Every Book Direct button on the site. Resolving the booking engine here
 * rather than at each button is the difference between switching it on in one
 * place and remembering seven — which is how five of them were still pointing
 * at the enquiry form while two were not.
 */
export const bookDirect = {
  label: cta.primary.label,
  href: bookingUrl ?? cta.primary.href,
  external: bookingUrl !== null,
} as const;

/** The eight items the villa asked for, in their order. */
export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Houses", href: "/houses" },
  { label: "Restaurant", href: "/restaurant" },
  { label: "Experience", href: "/experiences" },
  { label: "Package & Offer", href: "/packages" },
  { label: "Journal", href: "/journal" },
  { label: "Gallery", href: "/gallery" },
] as const;

export const guestCountOptions = [1, 2, 3, 4] as const;
