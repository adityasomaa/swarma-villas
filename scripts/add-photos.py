# -*- coding: utf-8 -*-
"""
Adds photographs to the library without rebuilding it.

scripts/optimise-photos.mjs regenerates public/img and photos.json wholesale
from the original WordPress export. That is the right tool for the initial
curation and the wrong one for adding nine files: it would need every original
back on disk and would overwrite captions that have been edited since.

This writes the same sizes at the same quality, and merges by slug.

Run: python scripts/add-photos.py
"""
import json, pathlib, subprocess, sys
from PIL import Image

WIDTHS = [480, 960, 1600, 2400]
QUALITY = 76
OUT = pathlib.Path("public/img")
MANIFEST = pathlib.Path("src/content/photos.json")
RAW = pathlib.Path("scratch/drive-photos")

# source file -> slug, category, caption (the caption becomes alt text)
NEW = [
    ("home-1hero-image.jpg", "pool-08", "pool",
     "The pool and garden at Swarma Villas under a clear sky"),
    ("home-2gladak-house.jpg", "gladak-bed-08", "gladak",
     "The Gladak House bed with red batik bedding under a mosquito net"),
    ("home-3hexa-bedroom1-jpg.jpg", "hexa-int-03", "hexa",
     "The Bamboo Hexa bedroom, woven bamboo walls behind a draped bed"),
    ("home-4home.jpg", "pool-09", "pool",
     "The pool seen from the garden path, palms overhead"),
    ("home-5home.jpg", "ritual-02", "ritual",
     "A massage table set up under a thatched roof in the garden"),
    ("about-1hero.jpg", "pool-10", "pool",
     "The pool with sun loungers, the houses behind it"),
    ("about-2about.jpg", "ritual-03", "ritual",
     "A canang offering placed on a wooden table in the garden"),
    ("about-3about.jpg", "property-13", "property",
     "A wooden house among red foliage, stone steps leading up to it"),
    ("house-3bamboo-dome-house.jpg", "dome-bed-06", "dome",
     "Inside the Bamboo Dome, the bed under its curved bamboo roof"),
    # The Beyond Swarma card, second attempt. The villa asked for the water
    # bottles on the deck to be out of frame and the view and the guests to
    # carry it, so the source is cropped to its top 78% before it gets here:
    # the card is 16:10 and covers, which crops the sides rather than putting
    # the deck back.
    ("home-6beyond.jpg", "ricefield-02", "ricefield",
     "Two guests looking out over the rice terraces on a day trip from the villa"),
    # The wellness lead on the Experience page.
    ("massage-new.jpg", "ritual-04", "ritual",
     "A massage table laid out under a thatched bale in the garden"),
]

OUT.mkdir(parents=True, exist_ok=True)
manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
by_slug = {m["slug"]: m for m in manifest}

for src_name, slug, category, caption in NEW:
    src = RAW / src_name
    if not src.exists():
        sys.exit(f"missing source: {src}")
    im = Image.open(src)
    im = im.convert("RGB")
    w, h = im.size

    widths = [x for x in WIDTHS if x <= w] or [w]
    sizes = []
    for target in widths:
        scaled = im if target == w else im.resize(
            (target, round(h * target / w)), Image.LANCZOS)
        out_file = f"{slug}-{target}.webp"
        out_path = OUT / out_file
        scaled.save(out_path, "WEBP", quality=QUALITY, method=6)
        sizes.append({"w": target, "file": out_file,
                      "kb": round(out_path.stat().st_size / 1024)})

    by_slug[slug] = {
        "slug": slug,
        "category": category,
        "caption": caption,
        "w": w,
        "h": h,
        "ratio": round(w / h, 4),
        "orientation": "landscape" if w / h > 1.15 else ("portrait" if w / h < 0.87 else "square"),
        "sizes": sizes,
        "source": src_name,
    }
    print(f"{slug:<16} {w}x{h}  {len(sizes)} sizes  "
          f"{sum(s['kb'] for s in sizes)} KB total")

merged = sorted(by_slug.values(), key=lambda m: m["slug"])
MANIFEST.write_text(json.dumps(merged, indent=2) + "\n", encoding="utf-8")
print(f"\nphotos.json: {len(manifest)} -> {len(merged)} photographs")
