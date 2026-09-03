#!/usr/bin/env node
/**
 * Pulls the villa's own photography from the current site.
 *
 * It reads the WordPress media library through the REST API rather than
 * scraping rendered <img> tags. Rendered tags only ever expose the scaled copy
 * WordPress chose for that layout — mostly 512px Elementor thumbnails — and the
 * original upload path cannot be derived from an Elementor thumb name because
 * the year/month folder is not in it. The API hands over `source_url` for the
 * full-size file directly.
 *
 * Output:
 *   scratch/photos-raw/  the untouched originals
 *   scratch/source/library.json  every item with its real size and alt text
 *
 * Optimising for the web is a separate step (scripts/optimise-photos.mjs), so
 * this can be re-run without redoing the expensive part.
 */

import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const RAW = join(ROOT, "scratch", "photos-raw");
const META = join(ROOT, "scratch", "source");
mkdirSync(RAW, { recursive: true });
mkdirSync(META, { recursive: true });

const API = "https://swarmavillasbali.com/wp-json/wp/v2/media";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

/** Not photographs of the property. */
function isChrome(name) {
  return /logo|icon|favicon|cropped|placeholder|avatar|sprite|badge|payment|banner-?ad|watermark/i.test(
    name,
  );
}

function slugFor(file) {
  return basename(file, extname(file))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 52);
}

/* ------------------------------------------------------------ the library */

const items = [];
for (let page = 1; page <= 10; page++) {
  const res = await fetch(
    `${API}?per_page=100&page=${page}&_fields=id,alt_text,title,mime_type,media_details,source_url`,
    { headers: { "User-Agent": UA } },
  );
  if (!res.ok) break;
  const batch = await res.json();
  if (!Array.isArray(batch) || batch.length === 0) break;
  items.push(...batch);
  const total = Number(res.headers.get("x-wp-totalpages") ?? 1);
  if (page >= total) break;
}

console.log(`media library: ${items.length} items`);

/* ------------------------------------------------------------- downloading */

const library = [];
const seenSlug = new Set();

for (const item of items) {
  const d = item.media_details ?? {};
  const url = item.source_url;
  if (!url || !/^image\//.test(item.mime_type ?? "")) continue;
  if (!/\.(jpe?g|png|webp)$/i.test(url)) continue;

  const name = basename(url);
  if (isChrome(name)) continue;

  const w = d.width ?? 0;
  const h = d.height ?? 0;
  // Anything below this is a thumbnail or a UI graphic, not a usable photo.
  if (w < 900 || h < 600) continue;

  let slug = slugFor(name);
  let n = 2;
  while (seenSlug.has(slug)) slug = `${slugFor(name)}-${n++}`;
  seenSlug.add(slug);

  const ext = /\.png$/i.test(url) ? ".png" : ".jpg";
  const file = `${slug}${ext}`;
  const dest = join(RAW, file);

  if (!existsSync(dest)) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Referer: "https://swarmavillasbali.com/" },
      });
      if (!res.ok) {
        console.log(`  MISS ${res.status} ${name}`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(dest, buf);
      process.stdout.write(".");
    } catch (e) {
      console.log(`  ERR  ${name} ${String(e).slice(0, 60)}`);
      continue;
    }
  } else {
    process.stdout.write("=");
  }

  library.push({
    slug,
    file,
    source: url,
    w,
    h,
    ratio: +(w / h).toFixed(3),
    orientation: w / h > 1.15 ? "landscape" : w / h < 0.87 ? "portrait" : "square",
    alt: (item.alt_text ?? "").trim(),
    title: (item.title?.rendered ?? "").replace(/<[^>]*>/g, "").trim(),
  });
}

writeFileSync(join(META, "library.json"), JSON.stringify(library, null, 2), "utf8");

const byOrientation = {};
for (const a of library) byOrientation[a.orientation] = (byOrientation[a.orientation] ?? 0) + 1;

console.log(`\n\n${library.length} photographs downloaded to scratch/photos-raw`);
console.log("orientation:", JSON.stringify(byOrientation));
console.log(
  "widest:",
  library
    .slice()
    .sort((a, b) => b.w - a.w)
    .slice(0, 5)
    .map((a) => `${a.w}x${a.h} ${a.slug}`)
    .join(" | "),
);
