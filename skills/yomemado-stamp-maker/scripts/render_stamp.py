#!/usr/bin/env python3
"""Compose prepared, text-free artwork into a reusable RGBA stamp pair.

No model, network, private service, or music is required. This script does not
generate artwork or claim to verify the pictured place.
"""
import argparse
import json
import os
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SIZE = (736, 1040)
INK = (22, 49, 65, 255)
PAPER = (246, 238, 215, 255)


def font_path(explicit=None, chinese=False):
    candidates = [explicit, os.environ.get("YOMEMADO_FONT")]
    if chinese:
        candidates += [
            str(Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts/simsun.ttc"),
            "/System/Library/Fonts/Supplemental/Songti.ttc",
            "/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc",
        ]
    else:
        candidates += [
            str(Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts/timesbd.ttf"),
            "/System/Library/Fonts/Supplemental/Georgia Bold.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
        ]
    for item in candidates:
        if item and Path(item).is_file():
            return str(item)
    if chinese:
        raise ValueError("Chinese text needs a local Songti/CJK font: pass --font /path/to/font or set YOMEMADO_FONT")
    # Pillow's bundled font keeps the English-only workflow portable.
    return None


def load_font(path, size):
    return ImageFont.truetype(path, size) if path else ImageFont.load_default(size=size)


def tracked(draw, xy, text, font, fill, spacing=0, align="left", max_width=None):
    widths = [draw.textlength(c, font=font) for c in text]
    width = sum(widths) + max(0, len(text)-1) * spacing
    if max_width is not None and width > max_width:
        raise ValueError(f"Text overflows its fixed box ({width:.1f} > {max_width}): {text}")
    x, y = xy
    if align == "center":
        x -= width / 2
    elif align == "right":
        x -= width
    for char, w in zip(text, widths):
        draw.text((round(x), y), char, font=font, fill=fill, anchor="ls")
        x += w + spacing


def validate(data):
    if data.get("mode") not in ("photo", "autonomous"):
        raise ValueError("mode must be photo or autonomous")
    if data["mode"] == "photo" and not data.get("sourcePhoto"):
        raise ValueError("Photo mode must record the source photo or provenance")
    if data["mode"] == "autonomous" and not data.get("facts", {}).get("citations"):
        raise ValueError("Autonomous mode must record fact citations")
    tag = data.get("id", "")
    if not (tag == "TEST" or len(tag) == 3 and tag.isdigit()):
        raise ValueError("id must be TEST or three digits")
    stamp = data["stamp"]
    lines = stamp.get("footerShortLines")
    if not isinstance(lines, list) or len(lines) != 2 or any(not isinstance(t, str) or not t.strip() for t in lines):
        raise ValueError("footerShortLines must contain exactly two nonempty lines")
    for key in ("regionShort", "pictureTitleShort", "pictureSubtitle"):
        if not isinstance(stamp.get(key), str) or not stamp[key].strip():
            raise ValueError("Missing stamp field: " + key)


def wrap(draw, text, font, width):
    lines = []
    for paragraph in text.split("\n"):
        line = ""
        tokens = re.findall(r"[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*|[^\x00-\x7f]|\s+|.", paragraph)
        for token in tokens:
            if draw.textlength(token.strip(), font=font) > width:
                raise ValueError("An unbreakable word overflows; shorten the note")
            if line and draw.textlength(line + token, font=font) > width:
                lines.append(line.rstrip())
                line = token.lstrip()
            else:
                line += token
        lines.append(line.rstrip())
    return lines


def render(art_path, data, output, master=None, text_font=None, print_font=None):
    validate(data)
    master = master or ROOT / "assets/master.png"
    base = Image.open(master).convert("RGBA")
    if base.size != SIZE:
        raise ValueError("Master must be 736 x 1040 RGBA")
    alpha = base.getchannel("A")
    if any(alpha.getpixel(p) != 0 for p in ((0, 0), (735, 0), (0, 1039), (735, 1039))):
        raise ValueError("Master corners must be transparent")
    artwork = Image.open(art_path).convert("RGBA")
    if artwork.size != (624, 723):
        raise ValueError("Prepared artwork must be 624 x 723; crop/extend it deliberately before compositing")
    front = base.copy()
    mask = Image.new("L", (624*3, 723*3))
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, 624*3-1, 723*3-1), radius=90, fill=255)
    front.paste(artwork, (57, 144), mask.resize((624, 723), Image.Resampling.LANCZOS))
    draw = ImageDraw.Draw(front)
    stamp, tag = data["stamp"], data["id"]
    pf = font_path(print_font)
    tracked(draw, (368, 96), stamp["regionShort"] + " · " + tag, load_font(pf, 43), INK, 3.8, "center", 610)
    tracked(draw, (90, 205), stamp["pictureTitleShort"], load_font(pf, 27), PAPER, 3, max_width=580)
    tracked(draw, (90, 231), stamp["pictureSubtitle"], load_font(pf, 14), PAPER, 2.65, max_width=580)
    draw.line((90, 251, 140, 251), fill=PAPER, width=2)
    for title, baseline in zip(stamp["footerShortLines"], (931, 976)):
        tracked(draw, (69, baseline), title, load_font(pf, 49), INK, 3, max_width=317)
    tracked(draw, (666, 956), "NO. " + tag, load_font(pf, 17), INK, 2.4, "right", 250)
    front.putalpha(alpha)

    back = Image.new("RGBA", SIZE, PAPER)
    bd = ImageDraw.Draw(back)
    bd.rounded_rectangle((45, 45, 691, 995), radius=5, outline=(171, 130, 90), width=2)
    body = "\n\n".join(data.get("paragraphs", []))
    is_cjk = any("\u2e80" <= ch <= "\uffef" for ch in body + data.get("signature", ""))
    bf = font_path(text_font, chinese=is_cjk)
    bd.text((69, 117), "POSTCARD / PUBLIC SAMPLE", font=load_font(pf, 23), fill=(159, 70, 48))
    bd.line((69, 144, 667, 144), fill=(185, 152, 112), width=2)
    meta = data.get("date", "") + " / " + data.get("place", "")
    for i, line in enumerate(wrap(bd, meta, load_font(pf, 18), 596)):
        bd.text((69, 174+i*28), line, font=load_font(pf, 18), fill=INK)
    y = 278
    for line in wrap(bd, body, load_font(bf, 30), 590):
        if y > 835:
            raise ValueError("Back text overflows; shorten it instead of silently shrinking the font")
        bd.text((73, y), line, font=load_font(bf, 30), fill=INK)
        y += 49
    signature = data.get("signature", "— Yomemado")
    bd.text((655, 935), signature, font=load_font(bf, 27), fill=INK, anchor="rs")
    bd.text((69, 974), "PUBLIC SAMPLE / NO. " + tag, font=load_font(pf, 16), fill=(126, 105, 80))
    back.putalpha(alpha)
    output = Path(output)
    output.mkdir(parents=True, exist_ok=True)
    front_path, back_path = output / f"{tag}-front.png", output / f"{tag}-back.png"
    front.save(front_path, optimize=True)
    back.save(back_path, optimize=True)
    return front_path, back_path


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--art", type=Path, required=True)
    parser.add_argument("--data", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--master", type=Path)
    parser.add_argument("--font", type=Path, help="Local Songti/CJK font for the back; not uploaded")
    parser.add_argument("--print-font", type=Path, help="Optional serif font for fixed-size English printing")
    args = parser.parse_args()
    front, back = render(args.art, json.loads(args.data.read_text(encoding="utf8")), args.out, args.master, args.font, args.print_font)
    print(json.dumps({"front": str(front), "back": str(back), "size": list(SIZE), "rgba": True, "ai_generation_tested": False}))
