import journalPhotos from "@/content/photos.json";

/* =============================================================================
   THE SWARMA JOURNAL
   -----------------------------------------------------------------------------
   Fifteen posts, supplied by the villa as "The Swarma Journal" and transcribed
   here unchanged — every title, excerpt, paragraph and closing line is theirs.

   WHAT IS NOT THEIRS, and what to change when they say so:
     - the slug of each post, derived from its title;
     - the photograph on each post, chosen from the villa's own library;
     - the ORDER, which is the order the document lists them in.

   There are no publication dates. The villa sent fifteen posts "ready to post"
   without dates, and inventing them would put a false date on the page and in
   the structured data. Add a `date` here when they decide on one.
   ========================================================================== */

export type JournalPost = {
  slug: string;
  title: string;
  /** One sentence for the index card and the meta description. */
  excerpt: string;
  body: string[];
  /** The villa's own closing line, set apart at the end of the post. */
  closing: string;
  /** A slug from photos.json. */
  photo: string;
};

export const journal: JournalPost[] = [
  {
    slug: "welcome-to-swarma-a-small-place-made-slowly",
    title: "Welcome to Swarma — A Small Place, Made Slowly",
    excerpt: "In a quiet corner of Singakerta, three houses, a restored Javanese kitchen, and a pool in the garden are shaping a slower way to stay in Ubud.",
    body: [
      "Ten minutes from the centre of Ubud, the road narrows, the traffic falls away, and the rice paddies begin. This is Singakerta — a village that has kept its own pace even as Ubud around it has grown busier, brighter, faster. It is here, tucked into the greenery, that Swarma Villas was built.",
      "We did not set out to build a hotel. A hotel is rows of rooms, numbered doors, a lobby you pass through without really arriving. Swarma has three houses instead — the Gladak House in reclaimed Javanese teak, the Bamboo Hexa on its single grounded level, and the Bamboo Dome curved like nothing else in the valley. Each one is different. Each one built to be lived in, not simply slept in.",
      "At the centre of it all sits Paon, our own restaurant, named for the traditional Balinese kitchen and housed inside a restored antique wooden building carried over from Java. Paon is where the day tends to slow down — breakfast taken without hurry, a lunch that runs long, a dinner under the trees.",
      "Swarma is Balinese-owned and family-managed. That matters more than it might sound. It means the team who greets you is the same team that has watched this garden grow, who knows which afternoon the light falls best across the pool, who can tell you, honestly, which experience beyond the property is worth your one free day and which isn't.",
      "We built Swarma for travellers who don't need very much to feel like they've arrived somewhere real — a good house, a slow meal, a garden to sit in, and time enough to notice all three.",
    ],
    closing: "Come and see it for yourself. Send us your dates on WhatsApp and we'll help you find the right house.",
    photo: "property-04",
  },
  {
    slug: "three-houses-three-ways-to-stay",
    title: "Three Houses, Three Ways to Stay",
    excerpt: "Javanese teak, woven bamboo, and an architecture that curves instead of squares off — Swarma's three house types, and how to choose between them.",
    body: [
      "Most villas ask you to choose a room category. At Swarma, you choose a house — and the difference is not small.",
      "The Gladak House is the most traditional of the three: a Javanese teakwood structure built from reclaimed timber, its low entrance door a quiet echo of the Indonesian gesture of bowing on the way into someone's home. Step through it and the room opens up unexpectedly — high ceilings, natural light, an open-air bathtub set beneath the sky, close enough to the treetops that you'll hear the birds while you soak. It suits the traveller drawn to heritage and craftsmanship, someone who wants their house to have a story before they ever arrived in it.",
      "The Bamboo Hexa takes the opposite approach: built on a hexagonal plan, entirely at ground level, with no stairs to climb. Traditional woven bamboo walls let the air move through naturally, and the whole house feels grounded — literally and otherwise. It's the house we recommend for anyone who wants easy, unfussy access, or simply prefers to feel close to the earth.",
      "The Bamboo Dome is Swarma's most distinctive structure — a curved bamboo form built around comfort rather than convention. Larger than the other two, fully enclosed now for privacy, with a bathroom that holds both a bathtub and a shower beneath its curved roof. It's the house for travellers who came to Bali partly for the architecture, who want a stay that feels a little unconventional.",
      "Three houses, three characters — but the same garden, the same pool, and the same restaurant waiting at the centre of it all.",
    ],
    closing: "Not sure which house is yours? Tell us how you like to travel and we'll point you toward the right one.",
    photo: "property-05",
  },
  {
    slug: "inside-the-gladak-house-a-javanese-bridal-house-in-the-ubud",
    title: "Inside the Gladak House: A Javanese Bridal House in the Ubud Hills",
    excerpt: "Reclaimed teak, antique carvings, and an open-air bathtub beneath the stars — a closer look at Swarma's most heritage-rich house.",
    body: [
      "There is a particular kind of house in Java, traditionally known as a bridal house — built from reclaimed teakwood, dense with carved detail, the kind of structure meant to be lived in for generations before it is ever taken apart and rebuilt somewhere new. Two of these houses now stand at Swarma, carried piece by piece into the hills above Ubud and given a second life.",
      "You'll notice the entrance before anything else: a small terrace, a door built low and narrow — not an oversight, but tradition. In much of Indonesia, a low doorway asks you to bow slightly as you enter, a",
      "small physical gesture of humility on the way into someone else's home. Five steps lead up from the garden, and then the room opens — unexpectedly high, unexpectedly bright, the roofline lifting the space in a way the modest entrance doesn't prepare you for.",
      "The bathroom is where the Gladak House makes its clearest argument for itself: an open-air bathtub, walls open to the sky, close enough to the surrounding treetops that bathing here feels less like a hotel amenity and more like a small, private ritual. On a clear night, you'll see stars from the water.",
      "Outside, a terrace holds a pair of antique wooden chairs — a good, quiet spot for the last coffee of the morning or the first glass of something in the evening, looking out over the garden and the rice fields beyond.",
      "It is a house for guests who want their stay to carry some weight of history — who find as much pleasure in the carved detail of a door frame as in the villa's pool.",
    ],
    closing: "The Gladak House starts from IDR 500,000 per night. Send us your dates and we'll confirm availability on WhatsApp.",
    photo: "gladak-bed-01",
  },
  {
    slug: "the-bamboo-hexa-grounded-woven-unhurried",
    title: "The Bamboo Hexa: Grounded, Woven, Unhurried",
    excerpt: "No stairs, no fuss — just woven bamboo walls, open windows, and a terrace made for slow mornings. Meet Swarma's most accessible house.",
    body: [
      "Some houses ask you to climb toward them. The Bamboo Hexa doesn't — it's the only house type at Swarma built entirely on a single, ground-level plan, which makes it the easiest of the three to move through and around. No stairs, no raised thresholds, just a short, easy walk from the garden path to your own front door.",
      "The house takes its name from its shape: a hexagon, built from traditional woven bamboo that does two things at once — it lets the structure breathe, drawing air through the walls in a way that concrete never could, and it fills the interior with a soft, dappled light that shifts through the day. Open windows keep that airflow moving, and from inside, the views settle quietly onto the garden and the swimming pool beyond.",
      "Practically, the Hexa is built for staying a while: a spacious bamboo table gives you somewhere to work, write, or simply eat a meal without balancing a plate on your knees. The bathroom keeps a semi-open shower — private, but never fully closed off from the surrounding greenery, so even washing off the day's heat comes with a view.",
      "At the front, a small terrace holds antique rattan chairs — the kind of corner that earns its keep slowly, over the course of a stay, as the place you return to with tea in the late afternoon or a book you haven't finished.",
      "It's a house without pretension. Nothing about it asks to be admired; it simply works, quietly and well, for however long you'd like to stay.",
    ],
    closing: "The Bamboo Hexa starts from IDR 600,000 per night. Send your dates on WhatsApp and we'll reply with availability.",
    photo: "hexa-ext-01",
  },
  {
    slug: "sleeping-inside-a-curve-the-bamboo-dome",
    title: "Sleeping Inside a Curve: The Bamboo Dome",
    excerpt: "No four walls, no flat ceiling — just bamboo bent into a single, uninterrupted form. Swarma's most architecturally distinctive house, explained.",
    body: [
      "Most houses are built from straight lines — four walls, a flat ceiling, corners you can lean into. The Bamboo Dome has none of that. It's built around a single curved form, bamboo bent and woven into a shape closer to a shell than a room, and it's unlike anything else on the property — or, most guests tell us, anything else they've stayed in.",
      "There are two Domes at Swarma, which makes them a natural choice for a pair of couples travelling together, or a small family wanting rooms close by without sharing walls. Each is the largest of Swarma's three house types, and each has been fully enclosed for privacy, without losing the bamboo character that makes the structure so distinctive from the outside.",
      "Step inside and the bedroom feels surprisingly conventional in the best sense — air conditioning, a proper mosquito net, a small sofa and table set up well enough for working on a laptop or simply reading through an afternoon. The bathroom sits on the same level, no steps to navigate after dark, with both a bathtub and a shower tucked beneath the curve of the roof.",
      "What the Dome offers, more than any other house at Swarma, is a sense of having stepped somewhere unfamiliar without sacrificing comfort. It rewards guests who are curious about architecture, who want their accommodation to be part of the story they tell about the trip — not just where they slept, but what they slept inside.",
      "Full access to the garden, pool, and Paon Restaurant comes standard, whichever house you choose.",
    ],
    closing: "The Bamboo Dome starts from IDR 700,000 per night. Tell us your dates on WhatsApp and we'll reply with availability.",
    photo: "dome-bed-01",
  },
  {
    slug: "paon-the-kitchen-at-the-heart-of-swarma",
    title: "Paon: The Kitchen at the Heart of Swarma",
    excerpt: "Named for the traditional Balinese kitchen, housed inside a restored Javanese wooden building — Paon Restaurant is where Swarma slows all the way down.",
    body: [
      "In Bali, paon is the word for kitchen — but not just any kitchen. It carries with it the idea of the family hearth, the room where the household actually happens, where warmth and food and conversation are the same thing. It felt like the only possible name for the restaurant we built at the centre of Swarma.",
      "Paon lives inside a restored antique wooden house, carried over from Java and rebuilt here in the garden, open-air, unhurried by design. The kitchen draws from Balinese and Indonesian traditions — the flavours of the archipelago, cooked the way they're meant to be — alongside a set of Western dishes for guests who want something familiar alongside something new. Breakfast, lunch, and dinner are all served here, which means a stay at Swarma never really requires leaving the property, though of course you're free to.",
      "Non-residents are welcome too. Some of our favourite evenings at Paon are shared with guests from elsewhere in Ubud who came for dinner on a friend's recommendation and stayed until the candles burned low.",
      "What we hope guests notice, beyond the food itself, is the pace of the place. Nothing at Paon is built for speed. The restaurant sits in a garden setting meant for lingering — a long lunch that runs into the afternoon, a breakfast eaten slowly enough to watch the light change across the pool. It is, in many ways, the clearest expression of what Swarma is trying to be: a kitchen, in the fullest sense of the word.",
    ],
    closing: "Open daily, 08:00–21:00, for breakfast, lunch, and dinner. Staying with us or visiting for a meal — either way, we'd love to have you at the table.",
    photo: "paon-01",
  },
  {
    slug: "a-balinese-blessing-what-happens-in-a-ceremony-and-why-it",
    title: "A Balinese Blessing: What Happens in a Ceremony, and Why It Matters",
    excerpt: "For guests curious about Bali beyond the beach and the rice terrace, the Balinese blessing ceremony offers a quiet window into the island's spiritual life.",
    body: [
      "There's a version of Bali that lives on postcards — the rice terraces, the beach clubs, the infinity pools. And then there's the Bali that happens quietly, several times a day, in small offerings placed on doorsteps and temple gates opened for prayer. A Balinese blessing ceremony is a chance to step, briefly and respectfully, into that second version of the island.",
      "At Swarma, we can arrange a blessing ceremony on the property itself — no travel required, no early start. A local priest or ceremonial leader guides the ritual, which typically involves offerings, holy water, and prayer, each element carrying specific meaning within Balinese Hindu tradition. Guests aren't expected to understand every gesture in advance; part of the experience is simply being present, and asking questions afterward if you're curious.",
      "What tends to surprise guests most is how personal it feels. This isn't a staged cultural performance — it's a genuine practice, adapted respectfully for guests who want to understand it rather than simply watch it. Many leave with a small sense of what daily spiritual life actually looks like in Bali: not grand or theatrical, but constant, woven into the rhythm of an ordinary day.",
      "It's a fitting experience for the early part of a stay — a way of settling in, of understanding a little more about the place you've come to before you go looking for waterfalls and rice fields beyond the property.",
    ],
    closing: "Ask us about arranging a blessing ceremony during your stay — a meaningful way to begin your time at Swarma.",
    photo: "ritual-01",
  },
  {
    slug: "melukat-water-temple-purification-in-the-hills-above-ubud",
    title: "Melukat: Water Temple Purification in the Hills Above Ubud",
    excerpt: "A visit to a sacred water temple, and a purification ritual known locally as melukat — one of Bali's most personal cultural experiences.",
    body: [
      "Beyond Swarma, tucked into the hills that surround Ubud, water temples have drawn Balinese families for generations for a ritual known as melukat — purification, cleansing, a spiritual reset carried out through water itself. It's one of the experiences we're asked about most, and one we're always glad to arrange.",
      "The ritual takes place at a sacred spring or temple pool, guided by local custom rather than a fixed script. Guests typically wear a sarong and sash, offer a small prayer or offering, and then move through the water beneath a series of spouts, each one associated with a different aspect of the cleansing — physical, emotional, spiritual. It is quiet, cold, and, for many guests, unexpectedly moving.",
      "We should be honest about what this isn't: it isn't a spa treatment, and it isn't designed for comfort in the conventional sense. The water is genuinely cold, the setting is a working temple rather than a resort, and the ritual asks for a degree of openness rather than passive observation. Guests who approach it that way tend to describe it as one of the most memorable parts of their whole trip to Bali.",
      "Melukat pairs particularly well with a slower morning or afternoon — nothing scheduled directly before or after, room enough to sit with the experience rather than rush from it straight into the next thing.",
    ],
    closing: "We can arrange a melukat experience with advance notice — ask our team when planning your stay.",
    photo: "waterfall-01",
  },
  {
    slug: "on-foot-through-the-rice-fields-of-singakerta",
    title: "On Foot Through the Rice Fields of Singakerta",
    excerpt: "No guide required to feel the pace of rural Bali — just a pair of shoes and a walk through the paddies and village paths around Swarma.",
    body: [
      "You don't need to travel far from Swarma to find rice fields — they begin almost at the edge of the property, terraced green squares stepping down toward the river valley, worked by the same families who've farmed this land for generations. A walk through them is one of the simplest, quietest ways to",
      "understand rural Bali, and one of the experiences we recommend most often to guests who want to slow down rather than sightsee.",
      "The walk itself follows a mix of raised paddy paths and village lanes, past farmers tending the fields, temples tucked between properties, and the occasional warung selling nothing more complicated than coffee and a fried snack. It isn't strenuous — most guests manage it comfortably regardless of fitness level — and it rewards an early start, when the light is soft and the heat hasn't yet settled in.",
      "What makes the walk worth doing, more than any single view, is the texture of everyday life it passes through. This is Singakerta going about its ordinary business — children walking to school, a woman laying out offerings, a farmer knee-deep in water. It's a version of Bali that's easy to miss entirely if your days are spent between the pool and a beach club, and one that Swarma's location makes almost effortless to find.",
      "We can arrange a local guide for context and conversation along the way, or point you toward a self-guided route if you'd rather walk it quietly, on your own time.",
    ],
    closing: "Ask our team for a rice field walking route — guided or self-guided, depending on how you like to explore.",
    photo: "ricefield-01",
  },
  {
    slug: "jungle-river-waterfall-a-half-day-trek-from-swarma",
    title: "Jungle, River, Waterfall: A Half-Day Trek from Swarma",
    excerpt: "For guests who want their stay in Ubud to include a little adventure — a trek through jungle and river crossings, ending at a hidden waterfall.",
    body: [
      "Not every day at Swarma needs to be spent by the pool. For guests who came to Bali partly for its landscape — the jungle, the water, the sense of walking somewhere genuinely wild — we can arrange a half-day trek that starts in dense tropical forest and ends, without exception, at a waterfall.",
      "The route typically threads through jungle trails, across a river or small lake depending on the path chosen, and down toward water that's usually tucked well out of sight from any road. It's the kind of trek that asks a little more of you than a rice field walk — sturdy shoes, a willingness to get wet, a reasonable level of fitness — but it rewards that effort clearly. Few things reset a traveller quite like standing under a waterfall after an hour of jungle walking.",
      "Two versions of this experience tend to appeal to different guests. One combines the jungle trek with a sacred lake crossing and a visit to a water temple, layering a cultural stop into the adventure. The other stays closer to nature throughout — rice fields, a jungle river, and the waterfall itself, with less structure and more time simply moving through the landscape.",
      "Either way, we'd suggest treating the rest of the day as recovery: a late lunch at Paon, a swim in the pool once you're back, an early night. The trek gives plenty; let the rest of the day give something back.",
    ],
    closing: "Ask about our Nature Adventure package, which pairs this trek with a Balinese massage — a full day of exertion and recovery, arranged for you.",
    photo: "jungle-01",
  },
  {
    slug: "the-balinese-massage-a-tradition-not-a-spa-menu-item",
    title: "The Balinese Massage: A Tradition, Not a Spa Menu Item",
    excerpt: "Swarma's massage and body ritual treatments draw on techniques passed down through generations — here's what to expect, and how to ask for what you need.",
    body: [
      "A Balinese massage is easy to find in Bali and easy to get wrong — rushed, generic, performed the same way regardless of who's on the table. At Swarma, we've tried to build something closer to what the tradition actually intends: a treatment shaped around the person receiving it, performed by local therapists trained in techniques that have been passed down, quite literally, through generations of their own families.",
      "The technique itself blends long, flowing strokes with firmer pressure at key points — a combination meant to ease tension in the muscles while also, in the Balinese understanding of the practice, restoring a sense of balance more broadly. Oils and scrubs are chosen with care, and a body scrub is available for guests who want something more restorative for the skin alongside the massage itself.",
      "The part we'd most like guests to understand: this isn't a fixed-pressure, fixed-pace treatment. Whether you'd prefer something gentle and slow or firmer and more invigorating, simply tell your therapist at the start. A good Balinese massage is responsive, not standardised — and ours are built to be exactly that.",
      "Because the treatment is genuinely personal, and because our therapists prepare with care rather than working through a rushed schedule, we ask guests to book in advance where possible. It's a small courtesy that respects both the tradition and the person practising it.",
    ],
    closing: "Book a massage or body scrub as part of your stay — ask our team when you arrive, or in advance via WhatsApp.",
    photo: "bath-flower-01",
  },
  {
    slug: "beyond-bali-a-day-at-mount-ijen-and-the-blue-fire",
    title: "Beyond Bali: A Day at Mount Ijen and the Blue Fire",
    excerpt: "For guests staying long enough for one adventurous day trip, Mount Ijen in East Java offers one of Indonesia's rarest natural phenomena.",
    body: [
      "Most experiences we arrange from Swarma keep guests within Bali. Mount Ijen is the exception — a journey across the strait into East Java, built for guests who have the time, and the appetite, for something genuinely adventurous.",
      "Ijen is famous for one thing above all: blue fire, a rare phenomenon caused by sulfuric gases igniting as they escape the volcanic crater, visible only in the dark hours before dawn. Seeing it means an overnight journey and an early, headlamp-lit climb — not a comfortable outing, and not one we'd recommend for every guest. But for travellers drawn to the more dramatic side of Indonesia's landscape, it's close to unforgettable: blue flames flickering against black rock, the crater lake pale and sulfurous below, dawn breaking slowly over the volcanic ridgeline as the fire fades with the coming light.",
      "Because of the distance and the early start required, this is best suited to guests staying several nights at Swarma rather than a quick weekend — enough time to recover with a slow day back at the villa afterward. We help arrange the logistics: transport, guide, timing, all coordinated so the only thing you need to manage is the climb itself.",
      "It's not a trip for everyone. But for guests who came to Indonesia hoping to see something they won't easily see elsewhere, Ijen delivers exactly that.",
    ],
    closing: "Planning a longer stay? Ask our team about arranging a Mount Ijen and Blue Fire journey as part of your trip.",
    photo: "jungle-03",
  },
  {
    slug: "a-guide-to-singakerta-ubuds-quieter-edge",
    title: "A Guide to Singakerta: Ubud's Quieter Edge",
    excerpt: "Ten minutes from central Ubud, Singakerta keeps its own pace — here's how to spend a day around Swarma without ever needing to leave the village.",
    body: [
      "Ubud's centre gets most of the attention — the market, the palace, the cafés lined up along the main road. Singakerta, where Swarma sits, is a different kind of place: a working village that happens to be close enough to Ubud for convenience, and far enough to keep its own rhythm intact.",
      "The address itself tells part of the story: Jl. Raya Kengetan Gang Abian Tiying, Singakerta — a road that runs through rice fields as much as it runs past them. Within a short walk or scooter ride, you'll find the kind of local businesses that give a neighbourhood its character rather than its tourist appeal: a favourite local warung, a well-loved gelato lab worth the short trip, a general store for the essentials you forgot to pack. None of them dressed up for visitors — simply good, because the village needed them to be.",
      "For a slower day, we'd suggest starting at Paon for breakfast, walking out into the surrounding rice fields while the morning is still cool, and returning by midday for a swim before the heat sets in. In the afternoon, a short scooter ride brings you into central Ubud proper — the market, the galleries, the more familiar version of the town — before returning to Singakerta for dinner, where the quiet resumes almost as soon as you're back on the village road.",
      "It's a version of Ubud that rewards staying a little outside it: close enough for everything the town offers, far enough to come home to somewhere genuinely calm.",
    ],
    closing: "Ask our team for a local's route through Singakerta and Ubud — the places we'd actually send a friend.",
    photo: "property-12",
  },
  {
    slug: "why-we-build-slowly-bamboo-reclaimed-teak-and-what",
    title: "Why We Build Slowly: Bamboo, Reclaimed Teak, and What Sustainability Actually Looks Like",
    excerpt: "Not a certification or a slogan — just a set of choices about materials, pace, and how a small villa can sit lightly on the land it's built on.",
    body: [
      "Sustainability gets used as a marketing word often enough that it's worth being specific about what it actually means at Swarma, because for us it isn't a statement — it's a set of practical decisions, made early, about how this place would be built and run.",
      "It starts with materials. The Gladak House is built from reclaimed Javanese teakwood — timber with a previous life, given a second one here rather than sourced new. The Bamboo Hexa and Bamboo Dome are built from bamboo itself: a material that grows quickly, requires far less energy to work with than concrete or steel, and breathes in a way that reduces the need for heavy air conditioning even in Bali's humidity. None of these choices were made purely for aesthetics, though we're glad they happen to look beautiful too.",
      "It continues in the pace of the place. A property built around three houses rather than thirty doesn't need to pull the same volume of water, generate the same volume of waste, or place the same pressure on a small village's infrastructure. Staying small was, in part, a sustainability decision as much as a design one.",
      "We won't claim perfection — sustainability is a direction, not a finished state, and we're still learning where we can do better. But every material choice, every decision about scale, and every plan for how this property continues to grow has started from the same question: does this let Swarma sit a little more lightly on the land it's built on? We'd rather keep asking that question honestly than put a badge on the website and stop thinking about it.",
    ],
    closing: "Curious about how Swarma was built? Ask our team — we're always glad to talk about it.",
    photo: "hexa-ext-03",
  },
  {
    slug: "packages-built-around-how-you-actually-want-to-stay",
    title: "Packages Built Around How You Actually Want to Stay",
    excerpt: "Romance, nature, wellness, or simply everything taken care of — a look at Swarma's curated packages, and the longer-stay rates for guests who don't want to rush.",
    body: [
      "Not every stay needs to be built from scratch. For guests who'd rather have the details handled, we've put together four packages, each shaped around a different way of spending time at Swarma.",
      "A Serene Stay for Two brings together a couple's Balinese massage, a candlelit dinner, flowers in your house, and a bottle of wine — a package built for guests marking something, or simply wanting a little romance folded into the ordinary rhythm of a stay.",
      "Discover Bali Through Nature pairs a half-day trek — jungle, lake, and waterfall, or rice fields and river, your choice — with a Balinese massage afterward, so the exertion of the morning is met with recovery in the afternoon.",
      "A Slower Way to Reconnect combines a water temple purification ritual with a traditional massage — two of Swarma's most reflective experiences, deliberately placed together for guests who came to Bali looking for more than a suntan.",
      "Everything You Need, Included is our full-board option: breakfast, lunch, and dinner arranged daily from Paon's menu, for guests who'd rather spend their time in the garden than deciding where to eat.",
      "For guests staying longer, our weekly and monthly rates are built to reward exactly that — starting from IDR 2,800,000 for a week and IDR 10,500,000 for a month, with group rates available for parties booking multiple houses together.",
      "Package pricing depends on your dates, house, and party size, so nothing is published as a flat rate — send us what you have in mind, and we'll put together the right option.",
    ],
    closing: "Tell us your dates, your house, and which package caught your eye — we'll reply on WhatsApp with the details.",
    photo: "paon-dinner-01",
  },
]

export function journalPostBySlug(slug: string): JournalPost | undefined {
  return journal.find((p) => p.slug === slug);
}

/**
 * Fails the build if a post points at a photograph that is not in the library,
 * which is the one way this file can go stale without anyone noticing.
 */
const known = new Set((journalPhotos as { slug: string }[]).map((p) => p.slug));
for (const post of journal) {
  if (!known.has(post.photo)) {
    throw new Error(`journal: "${post.slug}" uses photo "${post.photo}", which is not in photos.json`);
  }
}
