"""
为视频准备原作的“工作副本”（原图不动）：
  public/photos/web/*.jpg     长边 1920 的副本，渲染更快
  public/photos/fx/16-shadow-*.png   从 16 号作品提取的“纯黑影子”遮罩与轮廓线（热光一幕用）
并打印从原作取色得到的色值（写入 src/data/photos.ts）。
运行：python3 scripts/prepare-photos.py   （需要 Pillow：pip install pillow）
"""
from pathlib import Path
from PIL import Image, ImageFilter, ImageOps

SRC = Path("public/photos")
WEB = SRC / "web"
FX = SRC / "fx"
WEB.mkdir(exist_ok=True)
FX.mkdir(exist_ok=True)

EXCLUDE = ("05-", "25-", "26-", "32-")  # 05 为 Rebecca Norris Webb 作品；25/26/32 作者待核实

for f in sorted(SRC.iterdir()):
    if not f.name[:2].isdigit() or f.name.startswith(EXCLUDE):
        continue
    im = Image.open(f).convert("RGB")
    im.thumbnail((1920, 1920), Image.LANCZOS)
    out = WEB / (f.stem + ".jpg")
    im.save(out, quality=90)
    print(out.name, im.size)

# 16 号：影子遮罩
src16 = next(SRC.glob("16-*"))
im = Image.open(src16).convert("RGB")
im.thumbnail((1920, 1920), Image.LANCZOS)
lum = ImageOps.grayscale(im).filter(ImageFilter.GaussianBlur(3))
mask = lum.point(lambda v: 255 if v < 42 else 0).filter(ImageFilter.MedianFilter(9))
fill = Image.new("RGBA", im.size, (0, 0, 0, 0))
fill.putalpha(mask)
fill.save(FX / "16-shadow-mask.png")
edge = mask.filter(ImageFilter.MaxFilter(7))
inner = mask.filter(ImageFilter.MinFilter(7))
outline = Image.eval(Image.merge("L", [edge]), lambda v: v)
from PIL import ImageChops
ring = ImageChops.subtract(edge, inner)
line = Image.new("RGBA", im.size, (255, 255, 255, 0))
line.putalpha(ring)
line.save(FX / "16-shadow-outline.png")
print("shadow share:", round(sum(1 for v in mask.getdata() if v) / (im.size[0] * im.size[1]), 3))

# 从原作取色：在指定位置取 3% 见方的平均色
def sample(path, pts):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    res = []
    for x, y in pts:
        r = int(w * 0.015)
        box = im.crop((int(x / 100 * w) - r, int(y / 100 * h) - r, int(x / 100 * w) + r, int(y / 100 * h) + r))
        c = box.resize((1, 1), Image.BOX).getpixel((0, 0))
        res.append("#%02x%02x%02x" % c)
    return res

print("16 palette:", sample(src16, [(62, 38), (3, 18), (64, 78), (88, 80)]))
print("14 palette:", sample(next(SRC.glob("14-*")), [(28, 30), (47, 45), (85, 40), (70, 60)]))
print("02 palette:", sample(next(SRC.glob("02-*")), [(40, 80), (20, 20), (5, 55)]))
