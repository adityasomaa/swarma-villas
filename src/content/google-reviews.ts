import type { GooglePlaceReviews } from "@/lib/reviews/google";

import { googleListingUrl } from "@/content/site";

/* =============================================================================
   GOOGLE REVIEWS, COPIED BY HAND
   -----------------------------------------------------------------------------
   The villa asked for their Google reviews on the site. Reading them from the
   Places API needs a Google Cloud billing account, which was not worth opening
   for this, so these were transcribed from the listing instead.

   WHAT TRANSCRIBED MEANS HERE. Every review below is one person's writing, and
   it is reproduced as they wrote it: nothing shortened, nothing tidied, nothing
   left out because it was less flattering. Two things were touched, both
   mechanical:

     - Google renders a review's paragraph breaks as nothing at all, so the copy
       arrives with sentences fused ("stayed in.I've never been"). The space is
       put back.
     - The relative dates Google shows ("3 months ago") would start lying the
       day after they were copied, so each is recorded as the month or year it
       pointed at instead.

   Each card carries the author's name and links to their Google profile, which
   is the attribution Google asks for and, more to the point, the thing that
   tells a visitor these are real people rather than marketing copy.

   KEEPING IT HONEST. The aggregate below is a snapshot and will drift. Recopy
   it when the villa next asks about reviews; `CAPTURED` is on the page so no
   one has to guess how old it is. If the Places API is ever switched on, the
   live reviews take over automatically and this file stops being read — see
   src/lib/reviews/google.ts.
   ========================================================================== */

/** When the aggregate and the reviews below were read off the listing. */
export const CAPTURED = "October 2026";

export const googleReviewsFallback: GooglePlaceReviews = {
  rating: 4.7,
  total: 69,
  mapsUri: googleListingUrl,
  reviews: [
    {
      author: "Michael Middleton",
      authorUrl: "https://www.google.com/maps/contrib/104545243552810291313",
      rating: 5,
      relativeTime: "March 2026",
      text:
        "I’ve been to 60 countries, stayed in well over 100 hotels and this is by far " +
        "the number 1 place I’ve ever stayed in. I’ve never been to a place as friendly " +
        "and accommodating as Swarma Villa. They treat you like family. Anywhere you " +
        "want to go, Made will take you, the food is great, the massages are the best " +
        "I’ve ever had and the room (which they upgraded to me for free) was incredible. " +
        "I’m already thinking about when I’m coming back! Thanks for everything!",
    },
    {
      author: "TheViewer",
      authorUrl: "https://www.google.com/maps/contrib/101030398857291500489",
      rating: 5,
      relativeTime: "March 2026",
      text:
        "Swarma was my hidden gem in Bali. I immediately fell in love with this " +
        "accomodation and extend my stay from 3 to 6 nights. My bamboo bungalow had a " +
        "modern interior(electricity and AC)with a semi-open bath so showering under the " +
        "sky while having your privacy. Wifi was good and the pool was nice. All within " +
        "very green garden. I liked eating here (Nasi Campur Bali was my favorite). It is " +
        "far enough outside Ubud to be calm and close enough that you are within 15min " +
        "scooter of the city center. You have also the option to book guided activities " +
        "all over Bali/East Java in very personal atmosphere without big groups. Thanks " +
        "for a great time!!!",
    },
    {
      author: "Emma Goode",
      authorUrl: "https://www.google.com/maps/contrib/107921328921046545891",
      rating: 5,
      relativeTime: "2024",
      text:
        "Unreal little oasis a short drive away from Ubud. I lucked out when I found this " +
        "place in my hunt for a last-minute place to stay near Ubud. The hosts greeted me " +
        "warmly with a refreshing welcome drink and showed me to my gorgeous villa. The " +
        "room itself is beautiful, but the standout feature is the outdoor bathroom with " +
        "an excellent shower (great water pressure and hot water)! The bed was super comfy " +
        "too! I spent most of my time lounging by the pool, drinking coconuts and fresh " +
        "fruit juice, but I did make time to pop by the gelato shop across the street, and " +
        "I’d definitely recommend that! Also, they have on-call massage services at a " +
        "really affordable rate, and the massage was excellent! I would not stay anywhere " +
        "else if I come back to Ubud! One thing worth noting: there’s reasonably good " +
        "signage on the street and the little road leading to the villa, but the little " +
        "road is quite janky, so don’t be alarmed - at the end of it, everything is " +
        "beautiful.",
    },
    {
      author: "Jaz M",
      authorUrl: "https://www.google.com/maps/contrib/106608759187087679554",
      rating: 5,
      relativeTime: "2023",
      text:
        "We absolutely loved it here. The lovely local host family making every delicious " +
        "meal from scratch. Our hut was awesome and had heaps of character backing onto " +
        "running water and jungle view. You can rent a scooter for cheap and the town of " +
        "Ubud is 15 minutes away, but there are also some affordable upscale restaurants " +
        "to have a cocktail and fancy meal within walking distance too if that’s your " +
        "thing (if you turn right towards the town and Wednesday night the place we went " +
        "had live jazz and killer sunset views). Overall Swarma Villa offered us " +
        "everything we wanted on our holiday: friendliness, good vibes, nice pool and " +
        "food, and convenience with a variety of things to do nearby. Highly recommend " +
        "for anyone who wants to support local and have an awesome experience in a more " +
        "down to earth setting than a big resort. Loved our hosts.",
    },
    {
      author: "Benjamin Wan",
      authorUrl: "https://www.google.com/maps/contrib/115092266443677038768",
      rating: 5,
      relativeTime: "July 2026",
      text:
        "We spent 3 nights in this place - everything was amazing. The swimming pool with " +
        "sun loungers, a lot of choice for breakfast, and most of all the most incredible " +
        "welcoming staff. They helped me to find a good place to fix my bag in a very " +
        "short time. The place is quiet and just what you need if you want a place to " +
        "chill. The beds were also very comfortable and all the food is made fresh in " +
        "front of you. Highly recommend this place",
    },
    {
      author: "Ollie Coe",
      authorUrl: "https://www.google.com/maps/contrib/108101809213000532221",
      rating: 5,
      relativeTime: "2023",
      text:
        "We had a lovely time at Swarma Villas. The space is incredible (we barely wanted " +
        "to go out!) and with the pool it’s the perfect place to chill. Breakfast is " +
        "really good (pic included) and you can order lunch and dinner which was also " +
        "great and very cheap. We also had a massage and scrub organised to happen at the " +
        "accommodation. Really friendly staff topped it off. Highly recommended!",
    },
    {
      author: "Okan Alkan",
      authorUrl: "https://www.google.com/maps/contrib/106620594372172611560",
      rating: 5,
      relativeTime: "2021",
      text:
        "It is the perfect place to stay. Close to Ubud center and away from the crowd. It " +
        "has a very nice rice field view from the pool, a river and a jungle by your room. " +
        "You can have it all at once :) Plus, it has the most delicious food!!! I also " +
        "have to mention the staff who treats you as family. It is highly recommended to " +
        "stay here even for a couple of days",
    },
    {
      author: "audrey leliege",
      authorUrl: "https://www.google.com/maps/contrib/113866347382535158518",
      rating: 5,
      relativeTime: "2025",
      text:
        "A raw paradise to connect with nature and oneself. Listen to the sound of the " +
        "river and the jungle. Very lovely and helpful staff. Food is tasty and very " +
        "affordable. Nice pool. I loved my stay! Thank you I will be back",
    },
    {
      /*
       * Copied to the About page long before the rest of these, which is why it
       * has no profile link: the villa supplied the quote, not the listing.
       */
      author: "Morgane Thn",
      rating: 5,
      relativeTime: "2023",
      languageCode: "fr",
      text:
        "Je recommande les yeux fermés. La beauté du lieu, la gentillesse des hôtes, la " +
        "gourmandise des plats. Tout était parfait, je reviendrai c'est une certitude.",
    },
    {
      author: "Ryla Kaja",
      authorUrl: "https://www.google.com/maps/contrib/112970168764338514762",
      rating: 5,
      relativeTime: "2025",
      text:
        "Beautiful setting , authentic bali vibes, jungle resort, i stayed for 2 nights , " +
        "one in gladak and second night in bamboo villa. My fav is gladak, with open " +
        "shower concept",
    },
  ],
};
