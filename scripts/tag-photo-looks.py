# -*- coding: utf-8 -*-
"""
Gives every photograph a "look": an id shared by the frames that show the same
thing from the same spot.

The villa shoots a scene several times and sends the frames across different
folders, so the library holds many pictures that a visitor reads as the same
picture. /gallery uses this to show one of each within a group, which is what
they asked for; the pages keep whichever frame they were given, because a page
is a sequence the villa chose rather than a set.

THE THRESHOLD. Mean greyscale difference over a 48px thumbnail. Pairs confirmed
by eye as the same scene run up to 31; above 34 the count explodes from 19 to
577 and the matches turn into "similar brightness" nonsense, a waterfall paired
with a bathroom shelf. 32 sits in that gap.

Run after importing photographs: python scripts/tag-photo-looks.py
"""
import json, pathlib
from PIL import Image

THRESHOLD = 32.0
MANIFEST = pathlib.Path("src/content/photos.json")
photos = json.loads(MANIFEST.read_text(encoding="utf-8"))

thumbs = {}
for p in photos:
    f = pathlib.Path("public/img") / min(p["sizes"], key=lambda s: s["w"])["file"]
    thumbs[p["slug"]] = list(Image.open(f).convert("L").resize((48, 48), Image.LANCZOS).getdata())

slugs = sorted(thumbs)
parent = {s: s for s in slugs}
def find(a):
    while parent[a] != a:
        parent[a] = parent[parent[a]]; a = parent[a]
    return a

for i, a in enumerate(slugs):
    ta = thumbs[a]
    for b in slugs[i + 1:]:
        if sum(abs(x - y) for x, y in zip(ta, thumbs[b])) / 2304 < THRESHOLD:
            ra, rb = find(a), find(b)
            if ra != rb:
                parent[rb] = ra

for p in photos:
    p["look"] = find(p["slug"])

MANIFEST.write_text(json.dumps(photos, indent=2) + "\n", encoding="utf-8")

groups = {}
for p in photos:
    groups.setdefault(p["look"], []).append(p["slug"])
shared = {k: v for k, v in groups.items() if len(v) > 1}
print(f"{len(photos)} photographs, {len(groups)} distinct looks")
print(f"{sum(len(v) - 1 for v in shared.values())} would be hidden as repeats within a group\n")
for k, v in sorted(shared.items(), key=lambda kv: -len(kv[1]))[:12]:
    print(f"  {k:<18} {', '.join(sorted(v))}")
