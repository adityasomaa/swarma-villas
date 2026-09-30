# -*- coding: utf-8 -*-
"""Reads the bands captured by inner-hero-contrast.mjs and scores them."""
import json, pathlib
from PIL import Image

def lum(px):
    def ch(v):
        v /= 255
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = px[:3]
    return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)

# WCAG minimums: large display type 3:1, everything else 4.5:1
NEED = {"kicker": 4.5, "h1": 3.0}

data = json.loads(pathlib.Path("scratch/hero-inner.json").read_text(encoding="utf-8"))
worst = 99.0
fails = 0
for path, bands in data.items():
    if isinstance(bands, str):
        print(f"{path:<26} {bands}")
        continue
    for kind, file in bands.items():
        im = Image.open(file).convert("RGB")
        ls = sorted(lum(p) for p in im.get_flattened_data() if True) if hasattr(im, "get_flattened_data") else sorted(lum(p) for p in list(im.getdata()))
        top = ls[int(len(ls) * 0.9):] or ls[-1:]
        brightest = sum(top) / len(top)
        ratio = 1.05 / (brightest + 0.05)
        need = NEED[kind]
        ok = ratio >= need
        if not ok:
            fails += 1
        worst = min(worst, ratio / need)
        print(f"{path:<26} {kind:<7} {ratio:6.2f}:1  need {need}  {'ok' if ok else 'FAIL'}")
print(f"\nworst margin: {worst:.2f}   failures: {fails}")
