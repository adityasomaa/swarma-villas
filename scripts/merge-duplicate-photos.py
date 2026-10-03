# -*- coding: utf-8 -*-
"""
Merges photographs that are the SAME IMAGE stored under two slugs.

The villa has sent overlapping sets for weeks: a picture arrives in a house
folder and again in a page brief, and nothing notices, because the files differ
by a byte and the slugs differ by a number. The gallery then shows it twice.

Only exact matches are merged here — a colour difference under 0.5 out of 255,
which in practice means the same export. Near identical FRAMES of the same
scene are a separate question and are handled where they are displayed, not by
deleting one of them.

The surviving slug is the one with the most pixels. Every reference in src/ is
rewritten to it, then the loser leaves photos.json and public/img.

Run: python scripts/merge-duplicate-photos.py [--apply]
"""
import json, pathlib, re, sys
from PIL import Image

APPLY = "--apply" in sys.argv
MANIFEST = pathlib.Path("src/content/photos.json")
photos = json.loads(MANIFEST.read_text(encoding="utf-8"))
by_slug = {p["slug"]: p for p in photos}

thumbs = {}
for p in photos:
    f = pathlib.Path("public/img") / min(p["sizes"], key=lambda s: s["w"])["file"]
    thumbs[p["slug"]] = list(Image.open(f).convert("RGB").resize((96, 96), Image.LANCZOS).getdata())

slugs = sorted(thumbs)
parent = {s: s for s in slugs}
def find(a):
    while parent[a] != a:
        parent[a] = parent[parent[a]]; a = parent[a]
    return a

for i, a in enumerate(slugs):
    for b in slugs[i + 1:]:
        d = sum(abs(x - y) for pa, pb in zip(thumbs[a], thumbs[b]) for x, y in zip(pa, pb)) / (96 * 96 * 3)
        if d < 0.5:
            ra, rb = find(a), find(b)
            if ra != rb:
                parent[rb] = ra

clusters = {}
for s in slugs:
    clusters.setdefault(find(s), []).append(s)
clusters = {k: v for k, v in clusters.items() if len(v) > 1}

rename = {}
for members in clusters.values():
    ranked = sorted(members, key=lambda s: (-(by_slug[s]["w"] * by_slug[s]["h"]), s))
    keep = ranked[0]
    for s in ranked[1:]:
        rename[s] = keep
    print(f"keep {keep:<18} <- {', '.join(ranked[1:])}")

if not rename:
    print("no exact duplicates")
    raise SystemExit(0)
print(f"\n{len(rename)} slugs to merge away")
if not APPLY:
    print("dry run; pass --apply to write")
    raise SystemExit(0)

# rewrite every reference
touched = 0
for path in pathlib.Path("src").rglob("*"):
    if path.suffix not in (".ts", ".tsx") or path.name == "photos.json":
        continue
    text = original = path.read_text(encoding="utf-8")
    for old, new in rename.items():
        text = re.sub(rf'"{re.escape(old)}"', f'"{new}"', text)
    if text != original:
        path.write_text(text, encoding="utf-8")
        touched += 1
print(f"{touched} source files rewritten")

for old in rename:
    for size in by_slug[old]["sizes"]:
        f = pathlib.Path("public/img") / size["file"]
        if f.exists():
            f.unlink()
kept = [p for p in photos if p["slug"] not in rename]
MANIFEST.write_text(json.dumps(kept, indent=2) + "\n", encoding="utf-8")
print(f"photos.json: {len(photos)} -> {len(kept)}")
