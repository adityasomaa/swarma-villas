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
from PIL import Image, ImageOps

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

    # ---------------------------------------------- 1 October, second batch
    # The five Experience cards, the four on Package & Offer, and four of the
    # eight tiles in the home page's gallery strip. Categories are chosen so
    # each one lands in a group on /gallery as well.
    ("exp-water-temple.jpg", "waterfall-06", "waterfall",
     "Guests taking part in a melukat purification under the water"),
    ("exp-rice-field.jpg", "ricefield-03", "ricefield",
     "Guests on a swing above the rice fields and palms"),
    ("exp-jungle.jpg", "jungle-08", "jungle",
     "A guest at the foot of a giant banyan tree in the jungle"),
    ("exp-hiking.jpg", "jungle-09", "jungle",
     "Two walkers watching the sun come up from a ridge"),
    ("exp-ijen.jpg", "jungle-10", "jungle",
     "The blue fire burning in the crater at Mount Ijen"),
    ("pkg-hero.jpg", "pool-11", "pool",
     "The pool under the palms, looking out over the rice fields"),
    ("pkg-romantic.jpg", "ritual-05", "ritual",
     "A stone bath filled with flowers, a heart laid out in red petals"),
    ("pkg-nature.jpg", "jungle-11", "jungle",
     "The hanging roots of a banyan tree in the forest"),
    ("pkg-wellness.jpg", "waterfall-07", "waterfall",
     "Guests standing under a temple waterfall during a blessing"),
    ("gal-1.jpg", "pool-12", "pool",
     "The pool from the water, palms and a pavilion behind it"),
    ("gal-3.jpg", "paon-14", "restaurant",
     "The dining room at Paon, laid for a meal and open to the garden"),
    ("gal-6.jpg", "paon-15", "restaurant",
     "The bar and open kitchen at Paon under its timber roof"),

    # ------------------------------- the Gladak House folder, in their order
    # Sixteen files, "1Hero Imgae" then Gladak1 to Gladak15. Gladak7 is the
    # same flower bath already in the library as ritual-05, so it is not
    # duplicated here; the house's photo list reuses that slug in its place.
    ("gladak-00-hero.jpg", "gladak-ext-04", "gladak",
     "The planted path and steps up to the Gladak House"),
    ("gladak-01.jpg", "gladak-terrace-02", "gladak",
     "Carved chairs and a low table on the Gladak House terrace"),
    ("gladak-02.jpg", "gladak-bed-09", "gladak",
     "The bed under its mosquito net, seen from the foot of the room"),
    ("gladak-03.jpg", "gladak-bed-10", "gladak",
     "The bed and the open shelving beside it"),
    ("gladak-04.jpg", "gladak-bed-11", "gladak",
     "The bed from the side, the terrace door standing open"),
    ("gladak-05.jpg", "gladak-detail-01", "gladak",
     "The wardrobe, the minibar and a robe hanging ready"),
    ("gladak-06.jpg", "bath-open-06", "bathroom",
     "A carved stone basin in the open air bathroom"),
    ("gladak-08.jpg", "bath-open-07", "bathroom",
     "The outdoor shower, towels hung on a bamboo ladder"),
    ("gladak-09.jpg", "bath-open-08", "bathroom",
     "The freestanding tub in the open air bathroom"),
    ("gladak-10.jpg", "bath-detail-02", "bathroom",
     "Shower gel, shampoo and conditioner set out on the stone"),
    ("gladak-11.jpg", "bath-open-09", "bathroom",
     "The timber corner of the bathroom with flowers on a shelf"),
    ("gladak-12.jpg", "gladak-ext-05", "gladak",
     "The Gladak House terrace running along the front of the house"),
    ("gladak-13.jpg", "gladak-ext-06", "gladak",
     "The house seen from the garden through the planting"),
    ("gladak-14.jpg", "gladak-ext-07", "gladak",
     "The entrance to the Gladak House, red foliage either side"),
    ("gladak-15.jpg", "pool-13", "pool",
     "The pool under the palms, seen from the garden"),
    # The Mount Ijen journal entry. Their file is 560x373, which is small for
    # the card, so it is served at that size rather than upscaled.
    ("journal-ijen.jpg", "jungle-12", "jungle",
     "The turquoise crater lake at Mount Ijen at first light"),
    # ------------------------------- 2 October: the Hexa and Dome folders,
    # the restaurant folder, and the journal and experience pictures. Two
    # files arrived twice and are not stored twice: the journal's Gladak and
    # Hexa pictures are the same files as gladak-ext-07 and hexa-ext-07.
    ("hexa-01.jpg", "hexa-int-04", "hexa", "The Bamboo Hexa bed behind its draped net"),
    ("hexa-02.jpg", "hexa-int-05", "hexa", "The bed and the woven bamboo wall behind it"),
    ("hexa-03.jpg", "hexa-int-06", "hexa", "Shelving and a daybed along the bamboo wall"),
    ("hexa-04.jpg", "hexa-int-07", "hexa", "The open wardrobe and the air conditioning above it"),
    ("hexa-05.jpg", "hexa-int-08", "hexa", "A desk and chair set under the window"),
    ("hexa-06.jpg", "hexa-int-09", "hexa", "The long desk running under the windows"),
    ("hexa-07.jpg", "bath-open-10", "bathroom", "A copper basin in the Hexa bathroom"),
    ("hexa-08.jpg", "bath-open-11", "bathroom", "The semi open shower, planting over the wall"),
    ("hexa-09.jpg", "bath-detail-03", "bathroom", "Bath products on a timber shelf with flowers"),
    ("hexa-10.jpg", "hexa-ext-06", "hexa", "Two chairs on the Hexa terrace"),
    ("hexa-11.jpg", "hexa-ext-07", "hexa", "The Bamboo Hexa from the lawn, the pool in front"),

    ("dome-01.jpg", "dome-bed-07", "dome", "The Bamboo Dome bed inside the curved shell"),
    ("dome-02.jpg", "dome-bed-08", "dome", "The bed and the woven ceiling arching over it"),
    ("dome-03.jpg", "dome-bed-09", "dome", "The bed with the side table and rug"),
    ("dome-04.jpg", "dome-bed-10", "dome", "The Dome bed seen through the curve of the wall"),
    ("dome-05.jpg", "dome-lounge-04", "dome", "The low table and seating beside the bed"),
    ("dome-06.jpg", "dome-lounge-05", "dome", "The lounge end of the Dome, the door standing open"),
    ("dome-07.jpg", "dome-detail-05", "dome", "The arched window and a stool beneath it"),
    ("dome-08.jpg", "dome-detail-06", "dome", "Woven pots and a patterned hanging by the bed"),
    ("dome-09.jpg", "dome-detail-07", "dome", "Flowers on the corner table"),
    ("dome-10.jpg", "bath-dome-06", "bathroom", "The Dome bath filled with flower petals"),
    ("dome-11.jpg", "bath-dome-07", "bathroom", "The bathroom under the curved bamboo roof"),
    ("dome-12.jpg", "bath-dome-08", "bathroom", "The basin and the timber wall behind it"),
    ("dome-13.jpg", "bath-dome-09", "bathroom", "The shower in the Dome bathroom"),
    ("dome-14.jpg", "bath-detail-04", "bathroom", "Bath products set out on a timber shelf"),
    ("dome-15.jpg", "dome-ext-01", "dome", "The Bamboo Dome from the garden path"),
    ("dome-16.jpg", "dome-ext-02", "dome", "A frangipani tree in front of the Dome"),

    ("resto-01.jpg", "paon-16", "restaurant", "The dining room at Paon, open to the garden"),
    ("resto-02.jpg", "paon-17", "restaurant", "Tables and the counter inside Paon"),
    ("resto-03.jpg", "paon-18", "restaurant", "A table laid with flowers and a menu"),
    ("resto-04.jpg", "paon-19", "restaurant", "A candlelit dinner laid for two"),
    ("resto-05.jpg", "food-06", "food", "A pot of tea and a plate of cookies"),
    ("resto-06.jpg", "food-07", "food", "Pancakes with fruit, and an iced coffee"),
    ("resto-07.jpg", "paon-20", "restaurant", "The bar at Paon, with a member of the team behind it"),
    ("resto-08.jpg", "food-08", "food", "An afternoon tea stand of sweets and savouries"),
    ("resto-09.jpg", "food-09", "food", "A rice platter served on a banana leaf"),
    ("resto-10.jpg", "food-10", "food", "A breakfast tray with eggs, fruit and coffee"),
    ("resto-11.jpg", "food-11", "food", "Spring rolls with a dipping sauce"),
    ("resto-12.jpg", "food-12", "food", "Pandan pancakes folded on a plate"),
    ("resto-13.jpg", "food-13", "food", "A smoothie bowl topped with dragon fruit"),
    ("resto-14.jpg", "food-14", "food", "A tall glass of fruit juice on the table"),
    ("resto-15.jpg", "paon-21", "restaurant", "The coffee machine on the counter at Paon"),
    ("resto-16.jpg", "paon-22", "restaurant", "Wine bottles racked under the timber roof"),
    ("resto-17.jpg", "paon-23", "restaurant", "The wine shelf against the bamboo wall"),
    ("resto-18.jpg", "paon-24", "restaurant", "The dining room from the far end"),
    ("resto-19.jpg", "paon-25", "restaurant", "Shelves of carvings and flowers inside Paon"),
    ("resto-20.jpg", "paon-26", "restaurant", "The carved entrance to the restaurant"),

    ("jr-blessing.jpg", "ritual-06", "ritual", "A blessing being given beside the pool"),
    ("jr-melukat.jpg", "waterfall-08", "waterfall", "Guests sitting in the water during a melukat"),
    ("jr-ricefield.jpg", "ricefield-04", "ricefield", "A walker on the path between the rice fields"),
    ("xp-01.jpg", "ritual-07", "ritual", "Guests learning to make a canang offering"),
    ("xp-03.jpg", "paon-27", "restaurant", "Guests at the table with a spread of dishes"),
]

OUT.mkdir(parents=True, exist_ok=True)
manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
by_slug = {m["slug"]: m for m in manifest}

for src_name, slug, category, caption in NEW:
    src = RAW / src_name
    if not src.exists():
        sys.exit(f"missing source: {src}")
    im = Image.open(src)
    # A phone writes the rotation into EXIF rather than the pixels. Without
    # this, a portrait photograph is encoded on its side and the page shows it
    # that way, which is how the rice field swing arrived.
    im = ImageOps.exif_transpose(im).convert("RGB")
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

# Entries are rewritten wholesale above, which drops the "look" field, and a
# photograph without one is treated as unique and can repeat itself in the
# gallery. Retagging is cheap, so it happens every time rather than being
# something to remember.
print()
subprocess.run([sys.executable, "scripts/tag-photo-looks.py"], check=True)
