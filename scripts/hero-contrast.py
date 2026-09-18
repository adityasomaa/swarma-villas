import json, base64, io
from PIL import Image
def lin(v):
    v /= 255; return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
def lum(p): return 0.2126 * lin(p[0]) + 0.7152 * lin(p[1]) + 0.0722 * lin(p[2])
need = {"kicker": 4.5, "lede": 4.5, "nav": 4.5, "h1": 3.0}
data = json.load(open("scratch/hero-bands.json"))
worst = 99
for device, bands in data.items():
    for k, b64 in bands.items():
        im = Image.open(io.BytesIO(base64.b64decode(b64))).convert("RGB")
        ls = sorted(lum(p) for p in im.getdata())
        p90 = ls[int(len(ls) * 0.9)]
        ratio = 1.05 / (p90 + 0.05)
        ok = ratio >= need[k]
        worst = min(worst, ratio / need[k])
        print(f"{device:8} {k:7} white vs brightest 10%: {ratio:5.2f}:1  need {need[k]}  {'ok' if ok else 'LOW'}")
print("worst margin:", round(worst, 2))
