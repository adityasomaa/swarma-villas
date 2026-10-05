import "server-only";

/* =============================================================================
   GOOGLE REVIEWS
   -----------------------------------------------------------------------------
   Reads the villa's own listing through the Places API and hands the reviews to
   /review. The villa asked for their Google reviews on the page rather than a
   link to them.

   SWITCHED ON BY ONE ENVIRONMENT VARIABLE. With no key this returns null and
   the page falls back to the reviews the villa published itself, which is what
   it showed before. Nothing here can take the page down: every failure path —
   no key, a refused request, a changed field, a listing with no reviews — ends
   in null.

   SET IT ON THE SERVER, NEVER IN THE BUNDLE. `server-only` above makes a client
   import a build error rather than a key in the JavaScript a visitor downloads.
   The name has no NEXT_PUBLIC_ prefix for the same reason.

     GOOGLE_PLACES_API_KEY    required. Enable "Places API (New)" on the key.
     GOOGLE_PLACES_PLACE_ID   optional. Without it the place is looked up by
                              name once per revalidation, which costs a second
                              request. Set it to save that, and to pin the page
                              to a particular listing — which will matter when
                              the villa merges their duplicate one.

   WHAT THIS COSTS. Asking for reviews and rating puts the request in Google's
   "Place Details Enterprise" bucket: 1,000 calls a month free, then $20 per
   thousand. The page revalidates daily, so this is called a handful of times a
   day rather than once a visitor — call it fifty a month against a free cap of
   a thousand. The place lookup is "Text Search (IDs Only)", which is unlimited
   and free, which is why the field mask below asks for nothing else.

   Daily refresh also keeps this inside Google's terms, which do not allow their
   review content to be stored indefinitely.
   ========================================================================== */

/*
 * Google's address, unless something overrides it. The override exists so the
 * page itself can be rendered against a stub in scripts/check-review-page.mjs
 * — otherwise the only way to see this page in its Google state is to hold a
 * billable key, which is not a thing a check should need.
 */
const API = process.env.GOOGLE_PLACES_BASE || "https://places.googleapis.com/v1";

/** How the villa's listing is found when no place id is configured. */
const LOOKUP = "Swarma Villas, Jl. Raya Kengetan Gang Abian Tiying, Singakerta, Ubud, Bali";

export type GoogleReview = {
  author: string;
  /** The reviewer's Google profile. Google requires the attribution to link. */
  authorUrl?: string;
  photoUrl?: string;
  rating: number;
  text: string;
  /** Google's own wording, e.g. "2 months ago". Theirs, so it is not reworded. */
  relativeTime: string;
  languageCode?: string;
};

export type GooglePlaceReviews = {
  rating: number | null;
  total: number | null;
  reviews: GoogleReview[];
  /** The listing itself, for the attribution link. */
  mapsUri: string | null;
};

type RawReview = {
  rating?: number;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
};

async function findPlaceId(key: string): Promise<string | null> {
  const res = await fetch(`${API}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      /*
       * ID ONLY, DELIBERATELY. Google bills Text Search by the most expensive
       * field asked for: "Text Search Essentials (IDs Only)" is unlimited and
       * free, and adding displayName — which is a Pro field, and which this
       * code never read — would have moved every lookup onto a paid SKU for
       * nothing.
       */
      "X-Goog-FieldMask": "places.id",
    },
    body: JSON.stringify({ textQuery: LOOKUP, maxResultCount: 1 }),
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  const json: unknown = await res.json();
  const places = (json as { places?: { id?: string }[] })?.places;
  return places?.[0]?.id ?? null;
}

/**
 * Up to five reviews, which is all the Places API returns for a place. There is
 * no way to ask for more and no way to choose which — worth knowing before
 * anyone expects every review a guest has left to appear here.
 */
export async function fetchGoogleReviews(): Promise<GooglePlaceReviews | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return null;

  try {
    const placeId = process.env.GOOGLE_PLACES_PLACE_ID || (await findPlaceId(key));
    if (!placeId) return null;

    const res = await fetch(`${API}/places/${encodeURIComponent(placeId)}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
      },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: RawReview[];
    };

    const reviews: GoogleReview[] = (json.reviews ?? []).flatMap((r) => {
      // originalText is the review as written; text may be Google's translation
      const body = (r.originalText?.text ?? r.text?.text ?? "").trim();
      const author = r.authorAttribution?.displayName?.trim();
      if (!body || !author) return [];
      return [
        {
          author,
          authorUrl: r.authorAttribution?.uri,
          photoUrl: r.authorAttribution?.photoUri,
          rating: typeof r.rating === "number" ? r.rating : 0,
          text: body,
          relativeTime: r.relativePublishTimeDescription ?? "",
          languageCode: r.originalText?.languageCode ?? r.text?.languageCode,
        },
      ];
    });

    if (reviews.length === 0) return null;

    return {
      rating: typeof json.rating === "number" ? json.rating : null,
      total: typeof json.userRatingCount === "number" ? json.userRatingCount : null,
      reviews,
      mapsUri: json.googleMapsUri ?? null,
    };
  } catch {
    return null;
  }
}
