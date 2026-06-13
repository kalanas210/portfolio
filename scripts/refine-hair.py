"""
Refine the hair cutout for the side-profile portrait. The first pass left a
gray/white frosting around the spiky hair: the light studio background bled
into the semi-transparent hair pixels. Fix = a soft hair matte + background
color *decontamination* (unmix the known flat bg out of edge pixels) + a
gentle alpha cleanup to kill the faint haze in the gaps between strands.

    MODEL=u2net_human_seg .rembg-venv/Scripts/python.exe scripts/refine-hair.py
    MODEL=birefnet-portrait ... (better hair, large one-time download)
"""
import io, os
import numpy as np
from pathlib import Path
from PIL import Image
from rembg import remove, new_session

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "images" / "_originals" / "p2png.orig.png"
OUT = ROOT / "public" / "images" / "p3.png"
PREVIEW = ROOT / "public" / "images" / "_originals" / "p2png.preview.jpg"
DARK_BG = (29, 23, 45)  # hero dark-mode center #1d172d

MODEL = os.environ.get("MODEL", "u2net_human_seg")
USE_MATTING = MODEL.startswith("u2net") or MODEL.startswith("isnet")

src = Image.open(SRC).convert("RGB")
rgb = np.asarray(src).astype(np.float32)
H, W, _ = rgb.shape

session = new_session(MODEL)
cut = remove(
    src,
    session=session,
    alpha_matting=USE_MATTING,
    alpha_matting_foreground_threshold=240,
    alpha_matting_background_threshold=10,
    alpha_matting_erode_size=11,
)
cut = cut if isinstance(cut, Image.Image) else Image.open(io.BytesIO(cut))
alpha = np.asarray(cut.convert("RGBA").getchannel("A")).astype(np.float32) / 255.0

# --- sample the flat background color from the four corners ---
c = 40
corners = np.concatenate([
    rgb[:c, :c].reshape(-1, 3), rgb[:c, -c:].reshape(-1, 3),
    rgb[-c:, :c].reshape(-1, 3), rgb[-c:, -c:].reshape(-1, 3),
])
B = np.median(corners, axis=0)  # e.g. light gray ~ (235,235,238)
print(f"model={MODEL} bg~{B.round(1).tolist()} "
      f"alpha range [{alpha.min():.2f},{alpha.max():.2f}]")

# --- decontaminate: observed = a*F + (1-a)*B  ->  F = (observed-(1-a)*B)/a ---
a = alpha[..., None]
safe = np.maximum(a, 0.15)               # avoid blow-up where alpha≈0
F = (rgb - (1.0 - a) * B) / safe
F = np.clip(F, 0, 255)
# only trust decontamination on real edge pixels; keep original where solid
edge = (alpha > 0.02) & (alpha < 0.97)
out_rgb = np.where(edge[..., None], F, rgb)

# --- clean the alpha: drop the faintest haze, keep genuine fine strands ---
a_clean = np.clip((alpha - 0.06) / 0.90, 0.0, 1.0)

rgba = np.dstack([out_rgb, a_clean * 255.0]).astype(np.uint8)
result = Image.fromarray(rgba, "RGBA")
result.save(OUT)

solid = float((a_clean > 0.98).mean())
transp = float((a_clean < 0.02).mean())
print(f"saved {OUT.name}  {W}x{H}  solid={solid:.0%} transparent={transp:.0%}")

bg = Image.new("RGBA", result.size, DARK_BG + (255,))
Image.alpha_composite(bg, result).convert("RGB").save(PREVIEW, "JPEG", quality=92)
print(f"saved preview {PREVIEW.name}")
