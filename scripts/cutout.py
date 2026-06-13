"""
One-off: remove the white studio background from the hero images and write
transparent PNGs. Uses rembg (U2-Net human-seg) with alpha matting so the
white shirt / bright suit are kept solid and hair edges stay soft. Alpha
matting also estimates true foreground colors at the rim, which kills the
white fringe you'd otherwise get compositing over the dark hero background.

Run with the project venv:
    .rembg-venv/Scripts/python.exe scripts/cutout.py
"""
import io
from pathlib import Path
from PIL import Image
from rembg import remove, new_session

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "images" / "_originals"
OUT = ROOT / "public" / "images"
PREVIEW = ROOT / "public" / "images" / "_originals"  # dark-bg previews for review

# Hero dark-mode background color (globals.css .dark .hero-container center).
DARK_BG = (29, 23, 45)  # #1d172d

session = new_session("u2net_human_seg")

JOBS = [
    ("p1.orig.png", "p1.cut.png"),
    ("p2.orig.jpg", "p2.cut.png"),
]

for src_name, out_name in JOBS:
    src_path = SRC / src_name
    raw = src_path.read_bytes()
    cut = remove(
        raw,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=15,
        alpha_matting_erode_size=11,
    )
    img = Image.open(io.BytesIO(cut)).convert("RGBA")
    out_path = OUT / out_name
    img.save(out_path, "PNG")
    w, h = img.size
    # Count fully-transparent vs solid to sanity-check the matte.
    alpha = img.getchannel("A")
    hist = alpha.histogram()
    transparent = hist[0]
    solid = hist[255]
    total = w * h
    print(f"{src_name} -> {out_name}  {w}x{h}  "
          f"transparent={transparent/total:.0%} solid={solid/total:.0%}")

    # Dark-background composite so edge fringing is visible when reviewed.
    bg = Image.new("RGBA", img.size, DARK_BG + (255,))
    comp = Image.alpha_composite(bg, img).convert("RGB")
    comp.save(PREVIEW / out_name.replace(".cut.png", ".preview.jpg"), "JPEG", quality=90)

print("done")
