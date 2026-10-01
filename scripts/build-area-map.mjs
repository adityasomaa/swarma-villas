import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";

/* =============================================================================
   THE "GETTING HERE" MAP
   -----------------------------------------------------------------------------
   Builds public/img/area-map.svg from OpenStreetMap data.

   WHY NOT A SCREENSHOT OF GOOGLE MAPS. The villa asked for a map of the area
   with other accommodation taken off it. Editing a Google Maps image is
   against Google's terms, and their tiles carry every hotel label whether we
   want them or not. OpenStreetMap publishes the underlying DATA under the ODbL,
   which we are free to draw ourselves — so we ask for roads, water and the
   handful of places we want named, and nothing else is ever fetched. There is
   no accommodation on this map because none is ever requested.

   ATTRIBUTION is required by the ODbL and is printed inside the SVG.

   Run:  node scripts/build-area-map.mjs
   The Overpass response is cached in scratch/, so a re-run to change styling
   does not hit their servers again. Pass --refetch to force a new request.
   ========================================================================== */

const CACHE = "scratch/overpass-ubud.json";

/* -----------------------------------------------------------------------------
   1. WHAT THE MAP SHOWS
   -----------------------------------------------------------------------------
   THE VILLA'S POSITION. Gg. Abian Tiying is not in OpenStreetMap, so this is
   worked out from what is. The villa said on 1 October that the entrance is on
   Jl. Raya Kengetan directly opposite Gaya Gelato Lab, beside Gang Gora, and
   OSM puts Gang Gora's junction with the main road at -8.538430, 115.245217.
   The pin sits across the road from that junction.

   Good to about fifty metres. The previous value — the street name geocoded on
   its own — was out by more than a kilometre, which is why this is written
   down with its working. Ask them to drop a pin and it becomes exact.

   GAYA GELATO LAB is drawn at the villa's request. It is not in OSM, and all
   that is known is that it faces the villa across Jl. Raya Kengetan, so it is
   placed on the west side of the junction: about thirty metres out, which at
   this scale is two units. The two labels point opposite ways so that they can
   both be read even though the marks nearly touch.
   -------------------------------------------------------------------------- */
const VILLA = { lat: -8.5383, lng: 115.2456, label: "Swarma Villas" };

/** Everything else is geocoded from OSM at build time, by name. */
const LANDMARKS = [
  { q: "Puri Saren Agung, Ubud, Gianyar, Bali", label: "Ubud Palace", anchor: "start" },
  { q: "Sacred Monkey Forest Sanctuary, Ubud, Bali", label: "Monkey Forest", anchor: "start" },
  // The walk itself is a path, not a place; OSM knows the ridge as Bukit Campuhan.
  { q: "Campuhan, Ubud, Gianyar, Bali", label: "Campuhan Ridge Walk", anchor: "end" },
  { q: "Goa Gajah, Bedulu, Blahbatuh, Gianyar, Bali", label: "Goa Gajah", anchor: "start" },
];

/**
 * The shops the villa asked for. Nominatim does not know them by these names,
 * so the coordinates are read out of OpenStreetMap's own data and written here
 * rather than looked up at build time. All three sit within about a kilometre
 * north of the villa on the same road, so they are drawn smaller than the
 * landmarks and labelled on alternating sides to keep them apart.
 */
const SHOPS = [
  { lat: -8.527367, lng: 115.24381, label: "CocoMart Tebongkang", anchor: "start" },
  { lat: -8.532994, lng: 115.243668, label: "Pepito’s", anchor: "start" },
  // These two sit within a couple of hundred metres of the villa, so both
  // labels run left, away from the villa's own name on the right.
  { lat: -8.536528, lng: 115.243593, label: "Rüsters", anchor: "end" },
  { lat: -8.5385, lng: 115.2448, label: "Gaya Gelato Lab", anchor: "end" },
];

const PALETTE = {
  canvas: "#f5f0e4",
  raised: "#ebe4d0",
  line: "#d9d1b9",
  ink: "#2f3915",
  muted: "#474c30",
  subtle: "#65684f",
  gold: "#c9a451",
  water: "#a3b799",
};

/* -----------------------------------------------------------------------------
   2. FETCHING
   -------------------------------------------------------------------------- */

const UA = { "User-Agent": "swarma-villas-site-build/1.0 (static map build)" };

// A frame wide enough to hold the villa and Ubud centre with air around both.
const BBOX = { s: -8.566, w: 115.2205, n: -8.4955, e: 115.3015 };

const OVERPASS = `
[out:json][timeout:120];
(
  way["highway"~"^(motorway|trunk|primary|secondary|tertiary|unclassified|residential)$"]
     (${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});
  way["waterway"~"^(river|stream)$"](${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});
);
out geom;`;

async function overpass() {
  if (existsSync(CACHE) && !process.argv.includes("--refetch")) {
    return JSON.parse(readFileSync(CACHE, "utf8"));
  }
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { ...UA, "Content-Type": "text/plain" },
    body: OVERPASS,
  });
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  const json = await res.json();
  mkdirSync("scratch", { recursive: true });
  writeFileSync(CACHE, JSON.stringify(json));
  return json;
}

async function geocode(q) {
  const url =
    "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=" + encodeURIComponent(q);
  const res = await fetch(url, { headers: UA });
  const [hit] = await res.json();
  await new Promise((r) => setTimeout(r, 1200)); // their usage policy: 1 req/sec
  return hit ? { lat: Number(hit.lat), lng: Number(hit.lon) } : null;
}

/* -----------------------------------------------------------------------------
   3. PROJECTION
   -----------------------------------------------------------------------------
   Web Mercator, then fitted to the viewBox. At six kilometres the difference
   between Mercator and anything fancier is far below a pixel, but using the
   same projection every real map uses means the shapes are the shapes people
   recognise from their phone.
   -------------------------------------------------------------------------- */
/*
 * The viewBox is small on purpose. The map is drawn at about 512 CSS pixels on
 * a desktop and 350 on a phone, so type sized against a 1200-unit frame ends up
 * at eight pixels and unreadable. A 700-unit frame makes every label and stroke
 * 1.7x larger relative to the ground it covers.
 */
const W = 700;
const H = 525;

const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));

function makeProjection(box) {
  const x0 = box.w;
  const x1 = box.e;
  const y0 = mercY(box.n);
  const y1 = mercY(box.s);
  return ({ lat, lng }) => ({
    x: ((lng - x0) / (x1 - x0)) * W,
    y: ((mercY(lat) - y0) / (y1 - y0)) * H,
  });
}

/** The frame, chosen so the aspect ratio of the viewBox matches the ground. */
function frame() {
  const cLat = (VILLA.lat + -8.5069) / 2;
  const kmPerDegLat = 110.57;
  const kmPerDegLng = 111.32 * Math.cos((cLat * Math.PI) / 180);
  const heightKm = 6.6;
  const widthKm = (heightKm * W) / H;
  const dLat = heightKm / kmPerDegLat / 2;
  const dLng = widthKm / kmPerDegLng / 2;
  const cLng = 115.2565;
  return { s: cLat - dLat, n: cLat + dLat, w: cLng - dLng, e: cLng + dLng };
}

/* -----------------------------------------------------------------------------
   4. DRAWING
   -------------------------------------------------------------------------- */

/** Road classes, widest and darkest first — the usual cartographic hierarchy. */
const ROADS = [
  { match: ["motorway", "trunk", "primary"], width: 2.4, colour: PALETTE.subtle, opacity: 0.85 },
  { match: ["secondary", "tertiary"], width: 1.6, colour: PALETTE.subtle, opacity: 0.6 },
  { match: ["unclassified", "residential"], width: 0.8, colour: PALETTE.subtle, opacity: 0.3 },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const MIN_STEP = 1.1;

function polyline(geometry, project) {
  const pts = [];
  let last = null;
  geometry.forEach((p, i) => {
    const { x, y } = project({ lat: p.lat, lng: p.lon });
    const isEnd = i === 0 || i === geometry.length - 1;
    if (!isEnd && last && Math.hypot(x - last.x, y - last.y) < MIN_STEP) return;
    last = { x, y };
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  });
  return pts.join(" ");
}

/** Keeps a way out of the file when every point of it is outside the frame. */
const onScreen = (geometry, project) =>
  geometry.some((p) => {
    const { x, y } = project({ lat: p.lat, lng: p.lon });
    return x > -60 && x < W + 60 && y > -60 && y < H + 60;
  });

async function main() {
  const box = frame();
  const project = makeProjection(box);
  const data = await overpass();

  const ways = data.elements.filter((e) => e.type === "way" && e.geometry);
  const water = ways.filter((w) => w.tags?.waterway);
  const layers = ROADS.map((spec) => ({
    ...spec,
    ways: ways.filter((w) => spec.match.includes(w.tags?.highway)),
  }));

  const places = [];
  for (const spot of LANDMARKS) {
    const at = await geocode(spot.q);
    if (!at) {
      console.warn(`  ! no coordinate for ${spot.label} — left off the map`);
      continue;
    }
    places.push({ ...spot, ...at });
  }

  const out = [];
  out.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" ` +
      `aria-label="Map of Singakerta and central Ubud showing the position of Swarma Villas">`,
  );
  out.push(`<rect width="${W}" height="${H}" fill="${PALETTE.canvas}"/>`);

  // water under the roads, as it is on the ground
  out.push(`<g fill="none" stroke="${PALETTE.water}" stroke-linecap="round" stroke-linejoin="round">`);
  for (const w of water) {
    if (!onScreen(w.geometry, project)) continue;
    const width = w.tags.waterway === "river" ? 3.2 : 1.4;
    out.push(`<polyline points="${polyline(w.geometry, project)}" stroke-width="${width}"/>`);
  }
  out.push(`</g>`);

  for (const layer of layers) {
    out.push(
      `<g fill="none" stroke="${layer.colour}" stroke-opacity="${layer.opacity}" ` +
        `stroke-width="${layer.width}" stroke-linecap="round" stroke-linejoin="round">`,
    );
    for (const w of layer.ways) {
      if (!onScreen(w.geometry, project)) continue;
      out.push(`<polyline points="${polyline(w.geometry, project)}"/>`);
    }
    out.push(`</g>`);
  }

  // landmarks
  out.push(
    `<g font-family="ui-sans-serif, system-ui, sans-serif" font-size="20" fill="${PALETTE.muted}">`,
  );
  for (const p of places) {
    const { x, y } = project(p);
    if (x < 0 || x > W || y < 0 || y > H) {
      console.warn(`  ! ${p.label} falls outside the frame`);
      continue;
    }
    /* Flip a label that would run off the edge. Estimating the width from the
       character count is crude, but the alternative is measuring text, which
       needs a browser, and being a few units out only changes whether a label
       that nearly fits gets flipped. */
    const width = p.label.length * 20 * 0.55;
    let anchor = p.anchor;
    if (anchor === "start" && x + 12 + width > W - 8) anchor = "end";
    else if (anchor === "end" && x - 12 - width < 8) anchor = "start";
    const dx = anchor === "end" ? -12 : 12;
    out.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="${PALETTE.muted}"/>`);
    out.push(
      `<text x="${(x + dx).toFixed(1)}" y="${(y + 7).toFixed(1)}" text-anchor="${anchor}" ` +
        `paint-order="stroke" stroke="${PALETTE.canvas}" stroke-width="4.5">${esc(p.label)}</text>`,
    );
  }
  out.push(`</g>`);

  /* The shops, smaller than the landmarks. They are a cluster rather than a
     scatter, so they get a tighter mark and a lighter label. */
  out.push(
    `<g font-family="ui-sans-serif, system-ui, sans-serif" font-size="16" fill="${PALETTE.subtle}">`,
  );
  for (const shop of SHOPS) {
    const { x, y } = project(shop);
    if (x < 0 || x > W || y < 0 || y > H) {
      console.warn(`  ! ${shop.label} falls outside the frame`);
      continue;
    }
    const width = shop.label.length * 16 * 0.55;
    let anchor = shop.anchor;
    if (anchor === "start" && x + 10 + width > W - 8) anchor = "end";
    else if (anchor === "end" && x - 10 - width < 8) anchor = "start";
    out.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="${PALETTE.subtle}"/>`);
    out.push(
      `<text x="${(x + (anchor === "end" ? -9 : 9)).toFixed(1)}" y="${(y + 5.5).toFixed(1)}" ` +
        `text-anchor="${anchor}" paint-order="stroke" stroke="${PALETTE.canvas}" ` +
        `stroke-width="4">${esc(shop.label)}</text>`,
    );
  }
  out.push(`</g>`);

  // the villa, last and loudest
  const v = project(VILLA);
  out.push(`<g>`);
  out.push(
    `<circle cx="${v.x.toFixed(1)}" cy="${v.y.toFixed(1)}" r="21" fill="${PALETTE.gold}" fill-opacity="0.22"/>`,
  );
  out.push(
    `<circle cx="${v.x.toFixed(1)}" cy="${v.y.toFixed(1)}" r="8" fill="${PALETTE.gold}" ` +
      `stroke="${PALETTE.canvas}" stroke-width="2.5"/>`,
  );
  out.push(
    `<text x="${(v.x + 26).toFixed(1)}" y="${(v.y + 10).toFixed(1)}" text-anchor="start" ` +
      `font-family="ui-serif, Georgia, serif" font-size="29" fill="${PALETTE.ink}" ` +
      `paint-order="stroke" stroke="${PALETTE.canvas}" stroke-width="5">${esc(VILLA.label)}</text>`,
  );
  out.push(`</g>`);

  // scale bar — one kilometre, measured in the projection rather than assumed
  const kmLng = 1 / (111.32 * Math.cos(((box.n + box.s) / 2) * (Math.PI / 180)));
  const barPx = (kmLng / (box.e - box.w)) * W;
  const bx = 30;
  const by = H - 36;
  out.push(
    `<g stroke="${PALETTE.subtle}" stroke-width="2" font-family="ui-sans-serif, system-ui, sans-serif" font-size="18">`,
  );
  out.push(`<line x1="${bx}" y1="${by}" x2="${(bx + barPx).toFixed(1)}" y2="${by}"/>`);
  out.push(`<line x1="${bx}" y1="${by - 6}" x2="${bx}" y2="${by + 6}"/>`);
  out.push(
    `<line x1="${(bx + barPx).toFixed(1)}" y1="${by - 6}" x2="${(bx + barPx).toFixed(1)}" y2="${by + 6}"/>`,
  );
  out.push(
    `<text x="${bx}" y="${by - 10}" stroke="none" fill="${PALETTE.subtle}">1 km</text>`,
  );
  out.push(`</g>`);

  // ODbL attribution, required
  out.push(
    `<text x="${W - 14}" y="${H - 13}" text-anchor="end" ` +
      `font-family="ui-sans-serif, system-ui, sans-serif" font-size="16" fill="${PALETTE.subtle}">` +
      `Map data &#169; OpenStreetMap contributors</text>`,
  );
  out.push(`</svg>`);

  mkdirSync("public/img", { recursive: true });
  writeFileSync("public/img/area-map.svg", out.join("\n"));

  const drawn = layers.reduce((n, l) => n + l.ways.length, 0);
  console.log(
    `public/img/area-map.svg — ${drawn} roads, ${water.length} waterways, ` +
      `${places.length} landmarks, ${SHOPS.length} shops`,
  );
}

await main();
