#!/usr/bin/env node
/**
 * Curates and optimises the villa's photography.
 *
 * TWO THINGS HAPPEN HERE, AND THE FIRST ONE MATTERS MOST.
 *
 * 1. CURATION. The WordPress media library holds 156 images, but a large share
 *    of them are stock photographs that shipped with the theme — Maldives
 *    overwater bungalows, Portofino yachts, the Ligurian coast, grey European
 *    apartments, smiling stock concierges. Publishing those would misrepresent
 *    a jungle villa in Ubud. Every index in KEEP below was looked at on a
 *    contact sheet and confirmed to be this property, its food, its staff or
 *    the landscape its guests are actually taken to.
 *
 * 2. OPTIMISATION. The originals run to 4608px and 149 MB in total. Vercel's
 *    image optimizer is switched off on this account (exhausted quota, every
 *    request 402s), so responsive sizes are generated here, at build-prep time,
 *    and served as plain static files with a srcset.
 *
 * Run: npm run photos
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const RAW = join(ROOT, "scratch", "photos-raw");
const OUT = join(ROOT, "public", "img");
const INDEX = JSON.parse(readFileSync(join(ROOT, "scratch", "contact", "index.json"), "utf8"));

/* ==========================================================================
   THE CURATION
   --------------------------------------------------------------------------
   index -> [slug, category, caption]
   Categories drive where a photo may be used; captions become alt text.
   ======================================================================== */

const KEEP = {
  // ---- Bamboo Dome: the curved bamboo shell, pink bedding, built-in lounge
  19: ["dome-bed-01", "dome", "Bed under a mosquito net inside the curved bamboo shell of the Bamboo Dome"],
  23: ["dome-bed-02", "dome", "The Bamboo Dome bed with woven bamboo walls curving overhead"],
  24: ["dome-bed-03", "dome", "Inside the Bamboo Dome, looking across the bed to the curved wall"],
  25: ["dome-bed-04", "dome", "The Bamboo Dome interior, bed and woven bamboo ceiling"],
  26: ["dome-bed-05", "dome", "Bed and built-in bamboo lounge inside the Bamboo Dome"],
  27: ["dome-lounge-01", "dome", "The built-in lounge and low table inside the Bamboo Dome"],
  29: ["dome-lounge-02", "dome", "Seating corner and wardrobe inside the Bamboo Dome"],
  30: ["dome-lounge-03", "dome", "The Bamboo Dome interior with its arched window and bathrobe"],
  20: ["dome-detail-01", "dome", "Bamboo detailing and a stool inside the Bamboo Dome"],
  21: ["dome-detail-02", "dome", "Flowers on a wooden table against a woven bamboo wall"],
  22: ["dome-detail-03", "dome", "Fresh flowers and a bowl on the Bamboo Dome table"],
  28: ["dome-detail-04", "dome", "Wardrobe and bathrobe inside the Bamboo Dome"],

  // ---- Bathrooms
  12: ["bath-dome-01", "bathroom", "Bamboo bathroom with a stone basin and hanging towels"],
  13: ["bath-flower-01", "ritual", "Bathtub filled with water and flower petals arranged in a pattern"],
  14: ["bath-flower-02", "ritual", "Flower petal bath prepared on a dark bathtub"],
  15: ["bath-dome-02", "bathroom", "Bathroom with a bathtub against a woven bamboo wall"],
  16: ["bath-dome-03", "bathroom", "Shower corner inside a bamboo bathroom"],
  17: ["bath-dome-04", "bathroom", "Bamboo bathroom with towels on a rail and a mirror"],
  18: ["bath-dome-05", "bathroom", "Bathroom with a round basin set into a bamboo counter"],
  4: ["bath-open-01", "bathroom", "Open-air bathroom with a stone basin and bamboo screen"],
  9: ["bath-open-02", "bathroom", "Outdoor shower against a rendered wall with a pebble floor"],
  79: ["bath-open-03", "bathroom", "Outdoor bathtub and basin under the open sky"],
  80: ["bath-open-04", "bathroom", "Stone basin and a carved mirror in an open-air bathroom"],
  150: ["bath-open-05", "bathroom", "Freestanding tub and stone basin in the open-air bathroom"],
  83: ["bath-detail-01", "bathroom", "Bathroom detail with fresh flowers above the fittings"],
  85: ["room-detail-01", "detail", "Open wardrobe with folded towels and a flower arrangement"],
  82: ["room-detail-02", "detail", "Toiletries lined up on a stone ledge"],
  81: ["room-detail-03", "detail", "Towel ladder beside an outdoor shower"],

  // ---- Wooden Gladak House: red batik bedding, teak, low entrance
  48: ["gladak-terrace-01", "gladak", "Terrace chairs and a small table outside the Wooden Gladak House"],
  49: ["gladak-bed-01", "gladak", "Four-poster bed with red bedding inside the Wooden Gladak House"],
  50: ["gladak-bed-02", "gladak", "Bed and mosquito net inside the Wooden Gladak House"],
  51: ["gladak-bed-03", "gladak", "The Wooden Gladak House bed against a woven wall"],
  87: ["gladak-bed-04", "gladak", "Bed with a red batik runner under a mosquito net"],
  88: ["gladak-bed-05", "gladak", "Bedroom with red batik bedding and a wooden bench"],
  89: ["gladak-bed-06", "gladak", "Bedroom interior with red batik bedding and open shelving"],
  149: ["gladak-bed-07", "gladak", "Bed with red batik bedding and air conditioning above"],
  148: ["gladak-ext-01", "gladak", "The wooden gladak house seen from the garden at dusk"],
  151: ["gladak-ext-02", "gladak", "Wooden gladak houses among banana palms"],
  154: ["gladak-ext-03", "gladak", "A wooden house and lawn in the villa garden"],

  // ---- Hexa Bamboo House: hexagonal plan, arched door, woven walls
  54: ["hexa-ext-01", "hexa", "The arched doorway of the Hexa Bamboo House framed by planting"],
  55: ["hexa-ext-02", "hexa", "The Hexa Bamboo House among tropical planting"],
  58: ["hexa-ext-03", "hexa", "Arched bamboo doorway of the Hexa Bamboo House"],
  63: ["hexa-int-01", "hexa", "Bed and curtain inside the woven bamboo Hexa house"],
  147: ["hexa-int-02", "hexa", "Bed under a canopy inside the Hexa Bamboo House"],
  46: ["hexa-ext-04", "hexa", "A hexagonal bamboo house standing in the garden"],
  52: ["hexa-ext-05", "hexa", "The hexagonal bamboo house seen across the lawn"],

  // ---- Rooms, general
  0: ["room-01", "rooms", "Bed with a mosquito net against a woven bamboo wall"],
  8: ["room-02", "rooms", "Bed and canopy in a villa room"],
  11: ["room-03", "rooms", "Four-poster bed with white drapes in a villa room"],
  56: ["room-04", "rooms", "Bed with white linen and a woven headboard"],
  57: ["room-05", "rooms", "Bed beside a balcony looking into the garden"],
  62: ["room-06", "rooms", "Bed with a red runner under a white canopy"],
  64: ["room-07", "rooms", "Bedroom with white linen and a canopy frame"],
  65: ["room-08", "rooms", "Bed and side table beside an open wall"],

  // ---- The property: exteriors, terraces, walkways
  3: ["property-01", "property", "Bamboo building surrounded by tropical planting"],
  38: ["property-02", "property", "A bamboo house standing among palms and greenery"],
  45: ["property-03", "property", "Wooden and bamboo buildings in the villa garden"],
  47: ["property-04", "property", "A timber structure framed by tropical foliage"],
  53: ["property-05", "property", "Path through the villa garden past the buildings"],
  59: ["property-06", "property", "Terrace chairs lined along the front of the villas"],
  60: ["property-07", "property", "Villa terraces with chairs and flowering plants"],
  69: ["property-08", "property", "Timber terrace with a table looking into the garden"],
  70: ["property-09", "property", "Wooden veranda with armchairs and a round table"],
  71: ["property-10", "property", "Veranda seating along the front of a wooden house"],
  72: ["property-11", "property", "Timber deck running along the villa"],
  108: ["property-12", "property", "A pavilion and daybed in the villa garden"],

  // ---- Pool and garden
  42: ["pool-01", "pool", "The swimming pool with jungle planting behind it"],
  61: ["pool-02", "pool", "Pool and parasols surrounded by tropical greenery"],
  126: ["pool-03", "pool", "Loungers and planting beside the pool"],
  127: ["pool-04", "pool", "A floating breakfast tray on the pool at dusk"],
  128: ["pool-05", "pool", "The pool area lit in the evening"],
  129: ["pool-06", "pool", "The pool seen from the deck in bright sun"],
  153: ["pool-07", "pool", "A floating breakfast tray served in the pool"],

  // ---- Swarma Paon Restaurant
  104: ["paon-01", "restaurant", "Tables set inside Swarma Paon Restaurant under a bamboo roof"],
  105: ["paon-02", "restaurant", "The dining room at Swarma Paon Restaurant"],
  106: ["paon-03", "restaurant", "Looking through Swarma Paon Restaurant to the garden"],
  107: ["paon-04", "restaurant", "Bamboo dining furniture and planting at Swarma Paon"],
  109: ["paon-05", "restaurant", "Textiles and a counter inside the restaurant"],
  110: ["paon-06", "restaurant", "Dining tables and flowers at Swarma Paon Restaurant"],
  112: ["paon-07", "restaurant", "The restaurant interior with lanterns overhead"],
  113: ["paon-08", "restaurant", "Tables and flowers inside Swarma Paon Restaurant"],
  114: ["paon-09", "restaurant", "The restaurant counter and open kitchen"],
  115: ["paon-10", "restaurant", "Coffee machine on the restaurant counter"],
  116: ["paon-11", "restaurant", "Shelves of tableware and ornaments in the restaurant"],
  68: ["paon-12", "restaurant", "A drink on a bamboo table in the restaurant"],
  74: ["paon-13", "restaurant", "A fresh juice served on a bamboo table"],
  122: ["paon-dinner-01", "restaurant", "A candlelit dinner laid for two with flowers and wine"],

  // ---- Food
  41: ["food-01", "food", "Granola bowl topped with fruit and flowers"],
  43: ["food-02", "food", "Sliced fruit plated with flowers"],
  97: ["food-03", "food", "Nasi campur served on a banana leaf"],
  98: ["food-04", "food", "Nasi campur with side dishes on a wooden plate"],
  123: ["food-05", "food", "Spring rolls with dipping sauce"],

  // ---- Jungle, waterfalls, rice fields
  44: ["jungle-01", "jungle", "Looking up through the jungle canopy"],
  75: ["jungle-02", "jungle", "Sunlight through the branches of the jungle"],
  76: ["jungle-03", "jungle", "The buttressed roots of an old jungle tree"],
  77: ["jungle-04", "jungle", "Tall trees in the jungle"],
  78: ["jungle-05", "jungle", "The forest canopy seen from below"],
  137: ["jungle-06", "jungle", "A path through the jungle"],
  138: ["jungle-07", "jungle", "Ancient trees along the trekking route"],
  118: ["ricefield-01", "jungle", "Rice fields under an open sky"],
  119: ["waterfall-01", "waterfall", "A waterfall falling into a rocky pool"],
  136: ["waterfall-02", "waterfall", "Water falling through dense green planting"],
  139: ["waterfall-03", "waterfall", "A wide waterfall running down a mossy cliff"],
  141: ["waterfall-04", "waterfall", "The waterfall seen through the surrounding jungle"],
  143: ["waterfall-05", "waterfall", "Falling water against a green cliff face"],
  103: ["ritual-01", "ritual", "A water purification at a jungle waterfall"],

  // ---- Menus, as published by the villa
  1: ["menu-cover", "menu", "The cover of the Paon Restaurant menu"],
  130: ["menu-spa", "menu", "The massage and body treatment menu"],
};

/* ---------------------------------------------------------------- encoding */

const WIDTHS = [480, 960, 1600, 2400];
const QUALITY = 76;

// Resumable: existing output is kept and only missing sizes are encoded, so a
// crash part-way through does not mean starting over.
mkdirSync(OUT, { recursive: true });

/**
 * ffprobe occasionally dies on a malformed JPEG from this library with a
 * Windows access violation rather than a clean error, which takes the whole run
 * down. Failures are caught and the photo is skipped with a note, so one bad
 * file cannot cost the other hundred.
 */
function probe(file) {
  try {
    const out = execFileSync(
      "ffprobe",
      ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", file],
      { encoding: "utf8", timeout: 20000 },
    ).trim();
    const [w, h] = out.split(",").map(Number);
    if (!w || !h) return null;
    return { w, h };
  } catch {
    return null;
  }
}

const manifest = [];
let written = 0;
let bytes = 0;

for (const [idx, [slug, category, caption]] of Object.entries(KEEP)) {
  const file = INDEX[idx];
  if (!file) {
    console.log(`  ?? index ${idx} not in contact sheet`);
    continue;
  }
  const src = join(RAW, file);
  if (!existsSync(src)) {
    console.log(`  ?? missing ${file}`);
    continue;
  }

  const size = probe(src);
  if (!size) {
    console.log(`
  skip (unreadable) ${file}`);
    continue;
  }
  const { w, h } = size;
  const widths = WIDTHS.filter((x) => x <= w);
  if (widths.length === 0) widths.push(w);
  if (!widths.includes(Math.min(w, WIDTHS[WIDTHS.length - 1])) && w < WIDTHS[WIDTHS.length - 1]) {
    widths.push(w);
  }

  const sizes = [];
  let failed = false;
  for (const target of widths) {
    const outFile = `${slug}-${target}.webp`;
    const outPath = join(OUT, outFile);
    if (!existsSync(outPath)) {
      try {
        execFileSync("ffmpeg", [
          "-y", "-loglevel", "error",
          "-i", src,
          "-vf", `scale=${target}:-2:flags=lanczos`,
          "-quality", String(QUALITY),
          "-compression_level", "6",
          outPath,
        ], { timeout: 60000 });
        written++;
      } catch {
        console.log(`
  skip (encode failed) ${outFile}`);
        failed = true;
        break;
      }
    }
    const bytesOut = readFileSync(outPath).length;
    sizes.push({ w: target, file: outFile, kb: Math.round(bytesOut / 1024) });
    bytes += bytesOut;
  }
  if (failed) continue;

  manifest.push({
    slug,
    category,
    caption,
    w,
    h,
    ratio: +(w / h).toFixed(4),
    orientation: w / h > 1.15 ? "landscape" : w / h < 0.87 ? "portrait" : "square",
    sizes,
    source: file,
  });
  process.stdout.write(".");
}

manifest.sort((a, b) => a.slug.localeCompare(b.slug));
writeFileSync(join(ROOT, "src", "content", "photos.json"), JSON.stringify(manifest, null, 2), "utf8");

const byCat = {};
for (const m of manifest) byCat[m.category] = (byCat[m.category] ?? 0) + 1;

console.log(`\n\n${manifest.length} photographs kept, ${written} files written`);
console.log("total:", (bytes / 1024 / 1024).toFixed(1), "MB");
console.log("by category:", JSON.stringify(byCat, null, 0));
