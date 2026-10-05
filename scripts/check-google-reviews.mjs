import { register } from "node:module";

/* =============================================================================
   THE GOOGLE REVIEW READER, WITHOUT GOOGLE
   -----------------------------------------------------------------------------
   The key lives on the server and is not in this repository, so the only part
   of this that can be tested here is the part that will actually go wrong: the
   shape Google sends back, and every path that must end in null rather than in
   a broken page.

   Run: node scripts/check-google-reviews.mjs
   ========================================================================== */

register("./server-only-stub.mjs", import.meta.url);

const MODULE = "../src/lib/reviews/google.ts";
const failures = [];
const check = (what, ok, detail = "") => {
  if (!ok) failures.push(`${what}${detail ? ` — ${detail}` : ""}`);
  console.log(`  ${ok ? "pass" : "FAIL"}  ${what}${detail ? ` — ${detail}` : ""}`);
};

/* The module is TypeScript; Node 24 strips the types for us. */
const { fetchGoogleReviews } = await import(MODULE);

const realFetch = globalThis.fetch;
const calls = [];
function stub(handler) {
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return handler(String(url), init);
  };
}
const json = (body, ok = true) => ({ ok, json: async () => body });

const PLACE = {
  rating: 4.7,
  userRatingCount: 128,
  googleMapsUri: "https://maps.google.com/?cid=6089290508169825112",
  reviews: [
    {
      rating: 5,
      originalText: { text: "Tempatnya tenang sekali.", languageCode: "id" },
      text: { text: "The place is very quiet.", languageCode: "en" },
      relativePublishTimeDescription: "2 months ago",
      authorAttribution: {
        displayName: "Rina P",
        uri: "https://www.google.com/maps/contrib/123",
        photoUri: "https://lh3.googleusercontent.com/a/abc",
      },
    },
    { rating: 4, text: { text: "" }, authorAttribution: { displayName: "No Text" } },
    { rating: 4, text: { text: "Lovely." } },
  ],
};

/* ------------------------------------------------------------ no key at all */
delete process.env.GOOGLE_PLACES_API_KEY;
stub(() => json({}));
check("no key returns null rather than calling Google", (await fetchGoogleReviews()) === null);
check("and makes no request", calls.length === 0, `${calls.length} calls`);

/* ------------------------------------------------- the ordinary path, happy */
process.env.GOOGLE_PLACES_API_KEY = "test-key";
process.env.GOOGLE_PLACES_PLACE_ID = "ChIJtest";
calls.length = 0;
stub(() => json(PLACE));
const data = await fetchGoogleReviews();
check("a configured place id skips the lookup", calls.length === 1, `${calls.length} calls`);
check("the key travels in a header, never the query string",
  calls[0].init?.headers?.["X-Goog-Api-Key"] === "test-key" && !calls[0].url.includes("test-key"));
check("rating and total come through", data?.rating === 4.7 && data?.total === 128);
check("reviews without text or author are dropped", data?.reviews.length === 1,
  `${data?.reviews.length} kept of 3`);
check("the review is the one as written, not the translation",
  data?.reviews[0].text === "Tempatnya tenang sekali." && data?.reviews[0].languageCode === "id");
check("the attribution survives",
  data?.reviews[0].author === "Rina P" && Boolean(data?.reviews[0].authorUrl) && Boolean(data?.reviews[0].photoUrl));
check("Google's own wording for when is kept", data?.reviews[0].relativeTime === "2 months ago");

/* ------------------------------------------------ looking the place id up */
delete process.env.GOOGLE_PLACES_PLACE_ID;
calls.length = 0;
stub((url) => (url.includes(":searchText") ? json({ places: [{ id: "ChIJfound" }] }) : json(PLACE)));
check("without a place id it searches, then reads", (await fetchGoogleReviews()) !== null && calls.length === 2,
  `${calls.length} calls`);
check("and reads the place it found", calls[1]?.url.includes("ChIJfound"));

/* ------------------------------------------------------- every way to fail */
process.env.GOOGLE_PLACES_PLACE_ID = "ChIJtest";
for (const [what, handler] of [
  ["a refused request", () => json({ error: "denied" }, false)],
  ["a thrown request", () => { throw new Error("network"); }],
  ["a listing with no reviews", () => json({ rating: 4.7, reviews: [] })],
  ["a response with nothing in it", () => json({})],
  ["reviews that are all unusable", () => json({ reviews: [{ rating: 5 }] })],
]) {
  stub(handler);
  check(`${what} returns null`, (await fetchGoogleReviews()) === null);
}

globalThis.fetch = realFetch;
console.log(`\n${failures.length === 0 ? "PASS — no failures." : `${failures.length} FAILED`}`);
process.exit(failures.length ? 1 : 0);
