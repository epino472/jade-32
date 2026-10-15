"""Genera los íconos de la app (medalla de jade con 玉) en assets/. Uso: python3 tools/make-icon.py"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent.parent / "assets"
S = 1024
FONTS = [
    "/System/Library/Fonts/PingFang.ttc",
    "/System/Library/Fonts/Hiragino Sans GB.ttc",
    "/System/Library/Fonts/STHeiti Medium.ttc",
]


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def hexcolor(h):
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


img = Image.new("RGB", (S, S))
px = ImageDraw.Draw(img)
top, bottom, glow = hexcolor("#15111b"), hexcolor("#0b0d12"), hexcolor("#5a2a1e")
for y in range(S):
    px.line([(0, y), (S, y)], fill=lerp(top, bottom, y / S))
# resplandor cálido abajo
overlay = Image.new("RGB", (S, S), glow)
mask = Image.new("L", (S, S), 0)
md = ImageDraw.Draw(mask)
for r in range(520, 0, -8):
    md.ellipse([S / 2 - r, S + 120 - r, S / 2 + r, S + 120 + r], fill=int(70 * (1 - r / 520)))
img = Image.composite(overlay, img, mask)

d = ImageDraw.Draw(img)
cx = cy = S // 2
R = 372
dark, mid, light = hexcolor("#2c7a60"), hexcolor("#5fb593"), hexcolor("#b7ead3")
steps = 90
for i in range(steps):
    t = i / (steps - 1)
    r = R * (1 - t * 0.92)
    ox, oy = -t * R * 0.28, -t * R * 0.30
    color = lerp(dark, mid, t * 2) if t < 0.5 else lerp(mid, light, (t - 0.5) * 2)
    d.ellipse([cx + ox - r, cy + oy - r, cx + ox + r, cy + oy + r], fill=color)

gold = hexcolor("#d9bd7e")
d.ellipse([cx - R, cy - R, cx + R, cy + R], outline=gold, width=16)
inner = R - 62
d.ellipse([cx - inner, cy - inner, cx + inner, cy + inner], outline=hexcolor("#e9fff5"), width=4)

font = None
for path in FONTS:
    try:
        font = ImageFont.truetype(path, 430)
        break
    except OSError:
        continue
if font is None:
    raise SystemExit("No se encontró una fuente con caracteres chinos")
d.text((cx, cy + 8), "玉", font=font, fill=hexcolor("#0e3a2b"), anchor="mm")

for size, name in [(512, "icon-512.png"), (192, "icon-192.png"), (180, "icon-180.png"), (32, "favicon-32.png")]:
    img.resize((size, size), Image.LANCZOS).save(OUT / name, optimize=True)
    print("ok", name)
