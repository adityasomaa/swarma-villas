/* =============================================================================
   DOES THIS KEY WORK
   -----------------------------------------------------------------------------
   Run this before putting a key into Vercel. It makes the two calls the site
   makes and prints what Google says, so a key that is going to fail fails here
   — in a terminal, in five seconds — rather than silently on the live page,
   where the only symptom is the old reviews still showing.

   Almost every failure is one of three things, and Google names which:
   billing not enabled, the wrong Places API enabled, or a key restricted by
   HTTP referrer (the site calls from a server, which sends no referrer).

   Run:  GOOGLE_PLACES_API_KEY=... node scripts/check-places-key.mjs
   The key is read from the environment on purpose: typed on the command line
   it would sit in your shell history.
   ========================================================================== */

const API = "https://places.googleapis.com/v1";
const LOOKUP = "Swarma Villas, Jl. Raya Kengetan Gang Abian Tiying, Singakerta, Ubud, Bali";

const key = process.env.GOOGLE_PLACES_API_KEY;
if (!key) {
  console.log("No GOOGLE_PLACES_API_KEY in the environment.\n");
  console.log("  macOS / Linux   GOOGLE_PLACES_API_KEY=xxx node scripts/check-places-key.mjs");
  console.log('  Windows PS      $env:GOOGLE_PLACES_API_KEY="xxx"; node scripts/check-places-key.mjs');
  process.exit(1);
}

/** Google puts the useful sentence in error.message. */
async function call(label, url, init) {
  const res = await fetch(url, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.error?.message ?? `HTTP ${res.status}`;
    console.log(`  FAIL  ${label}\n        ${msg}`);
    return null;
  }
  console.log(`  ok    ${label}`);
  return body;
}

console.log("Asking Google what this key can do...\n");

const found = await call(
  "find the listing (Text Search, IDs only — free tier)",
  `${API}/places:searchText`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "places.id",
    },
    body: JSON.stringify({ textQuery: LOOKUP, maxResultCount: 1 }),
  },
);

const placeId = process.env.GOOGLE_PLACES_PLACE_ID || found?.places?.[0]?.id;
if (!placeId) {
  console.log("\nNo place id, so the details call cannot be made.");
  process.exit(1);
}

const place = await call(
  "read the reviews (Place Details Enterprise — 1,000 free a month)",
  `${API}/places/${encodeURIComponent(placeId)}`,
  {
    headers: {
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "displayName,formattedAddress,rating,userRatingCount,googleMapsUri,reviews",
    },
  },
);

if (!place) process.exit(1);

const reviews = place.reviews ?? [];
console.log("\nThe listing this key reaches:");
console.log(`  name      ${place.displayName?.text ?? "-"}`);
console.log(`  address   ${place.formattedAddress ?? "-"}`);
console.log(`  rating    ${place.rating ?? "-"} from ${place.userRatingCount ?? "-"} reviews`);
console.log(`  returned  ${reviews.length} review${reviews.length === 1 ? "" : "s"} (Google returns at most five)`);
console.log(`  place id  ${placeId}`);
for (const r of reviews.slice(0, 5)) {
  const who = r.authorAttribution?.displayName ?? "?";
  const text = (r.originalText?.text ?? r.text?.text ?? "").replace(/\s+/g, " ").slice(0, 60);
  console.log(`            ${String(r.rating ?? "?")}★  ${who} — ${text}…`);
}

const right = /Kengetan|Singakerta/i.test(place.formattedAddress ?? "");
console.log(
  `\n${right ? "This is the villa's real listing." : "CHECK THIS: the address does not look like the villa's."}`,
);
console.log("\nReady. Put the key into Vercel as GOOGLE_PLACES_API_KEY and redeploy.");
console.log(`Set GOOGLE_PLACES_PLACE_ID=${placeId} as well to skip the lookup.`);
