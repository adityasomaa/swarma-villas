#!/usr/bin/env node
/**
 * One-off crawler for the CURRENT swarmavillasbali.com.
 *
 * It exists to answer three questions before any design work starts:
 *   1. what pages does the site actually have,
 *   2. what does each page say, and
 *   3. which photographs and videos are on it, at what real pixel size.
 *
 * Output goes to scratch/source/ as JSON. Nothing here writes into the app.
 */

import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "scratch", "source");
mkdirSync(OUT, { recursive: true });

const ORIGIN = "https://swarmavillasbali.com";

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
});
const page = await context.newPage();

/* ------------------------------------------------------- discover the pages */

await page.goto(ORIGIN, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(4000);

const discovered = await page.evaluate((origin) => {
  const out = new Set();
  for (const a of document.querySelectorAll("a[href]")) {
    try {
      const u = new URL(a.getAttribute("href"), location.href);
      if (u.origin !== origin) continue;
      if (/\.(jpg|jpeg|png|webp|gif|pdf|mp4|zip)$/i.test(u.pathname)) continue;
      u.hash = "";
      u.search = "";
      out.add(u.pathname.replace(/\/$/, "") || "/");
    } catch {}
  }
  return [...out];
}, ORIGIN);

// Seed with the structure the owner described, so nothing is missed if the
// home page does not link to every page.
const SEEDS = [
  "/",
  "/about",
  "/houses",
  "/gallery",
  "/contact",
  "/term-condition",
  "/review",
  "/experiences",
];

const queue = [...new Set([...SEEDS, ...discovered])];
const seen = new Set();
const pages = [];
const media = new Map();

function noteMedia(url, meta) {
  if (!url || url.startsWith("data:")) return;
  const key = url.split("?")[0];
  const prev = media.get(key) ?? { url: key, w: 0, h: 0, on: new Set(), kind: meta.kind };
  prev.w = Math.max(prev.w, meta.w ?? 0);
  prev.h = Math.max(prev.h, meta.h ?? 0);
  prev.on.add(meta.on);
  prev.kind = meta.kind;
  media.set(key, prev);
}

/* ------------------------------------------------------------- visit them all */

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);

  let status = 0;
  try {
    const res = await page.goto(ORIGIN + path, { waitUntil: "networkidle", timeout: 90000 });
    status = res?.status() ?? 0;
  } catch {
    pages.push({ path, status: 0, error: "navigation failed" });
    continue;
  }
  if (status !== 200) {
    pages.push({ path, status });
    continue;
  }

  await page.waitForTimeout(2500);
  // Walk the page so lazy images and background videos actually load.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.85;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 260));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
  await page.waitForTimeout(1500);

  const data = await page.evaluate((origin) => {
    const abs = (u) => {
      try {
        return new URL(u, location.href).href;
      } catch {
        return null;
      }
    };

    const images = [];
    for (const img of document.querySelectorAll("img")) {
      const src = img.currentSrc || img.src;
      if (!src) continue;
      images.push({
        url: abs(src),
        w: img.naturalWidth,
        h: img.naturalHeight,
        alt: img.getAttribute("alt") ?? "",
      });
    }
    // Background images set in CSS.
    for (const el of document.querySelectorAll("body *")) {
      const bg = getComputedStyle(el).backgroundImage;
      if (!bg || bg === "none") continue;
      for (const m of bg.matchAll(/url\(["']?(.*?)["']?\)/g)) {
        const u = abs(m[1]);
        if (u && !/^data:/.test(u)) images.push({ url: u, w: 0, h: 0, alt: "", css: true });
      }
    }

    const videos = [];
    for (const v of document.querySelectorAll("video")) {
      const srcs = [v.getAttribute("src"), ...[...v.querySelectorAll("source")].map((s) => s.getAttribute("src"))];
      for (const s of srcs) {
        const u = s && abs(s);
        if (u) videos.push({ url: u, w: v.videoWidth, h: v.videoHeight, poster: abs(v.getAttribute("poster") ?? "") });
      }
    }
    for (const f of document.querySelectorAll("iframe[src]")) {
      const u = abs(f.getAttribute("src"));
      if (u && /youtube|vimeo|player/.test(u)) videos.push({ url: u, embed: true });
    }

    const links = [];
    for (const a of document.querySelectorAll("a[href]")) {
      try {
        const u = new URL(a.getAttribute("href"), location.href);
        if (u.origin === origin && !/\.(jpg|jpeg|png|webp|gif|pdf|mp4|zip)$/i.test(u.pathname)) {
          u.hash = "";
          u.search = "";
          links.push(u.pathname.replace(/\/$/, "") || "/");
        }
      } catch {}
    }

    const headings = [...document.querySelectorAll("h1,h2,h3,h4")].map((h) => ({
      level: Number(h.tagName[1]),
      text: (h.textContent ?? "").replace(/\s+/g, " ").trim(),
    }));

    return {
      title: document.title,
      description:
        document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
      h1Count: document.querySelectorAll("h1").length,
      headings,
      text: (document.body.innerText ?? "").replace(/\s+/g, " ").trim(),
      images,
      videos,
      links: [...new Set(links)],
    };
  }, ORIGIN);

  for (const img of data.images) noteMedia(img.url, { ...img, kind: "image", on: path });
  for (const v of data.videos) noteMedia(v.url, { ...v, kind: v.embed ? "embed" : "video", on: path });

  for (const l of data.links) if (!seen.has(l) && !queue.includes(l)) queue.push(l);

  pages.push({
    path,
    status,
    title: data.title,
    description: data.description,
    h1Count: data.h1Count,
    headings: data.headings,
    chars: data.text.length,
    text: data.text,
    imageCount: data.images.length,
    videoCount: data.videos.length,
  });

  process.stdout.write(`.`);
}

await browser.close();

const mediaList = [...media.values()].map((m) => ({ ...m, on: [...m.on] }));

writeFileSync(join(OUT, "pages.json"), JSON.stringify(pages, null, 2), "utf8");
writeFileSync(join(OUT, "media.json"), JSON.stringify(mediaList, null, 2), "utf8");

console.log(`\n\n${pages.length} pages, ${mediaList.length} unique media files`);
console.log("\nPAGES");
for (const p of pages.sort((a, b) => a.path.localeCompare(b.path))) {
  console.log(
    `  ${String(p.status).padEnd(4)} ${p.path.padEnd(34)} h1:${p.h1Count ?? "-"} ` +
      `chars:${String(p.chars ?? 0).padStart(5)} img:${String(p.imageCount ?? 0).padStart(3)} ` +
      `vid:${p.videoCount ?? 0}`,
  );
}
console.log("\nMEDIA BY KIND");
const byKind = {};
for (const m of mediaList) byKind[m.kind] = (byKind[m.kind] ?? 0) + 1;
console.log(" ", JSON.stringify(byKind));
