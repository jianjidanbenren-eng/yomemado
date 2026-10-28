#!/usr/bin/env python3
"""Inspect a pair of stamp PNGs; no private template or assets required."""

import argparse
import json
from pathlib import Path

from PIL import Image


def inspect(front_path: Path, back_path: Path) -> dict:
    with Image.open(front_path) as front_file, Image.open(back_path) as back_file:
        front_file.load()
        back_file.load()
        size_ok = front_file.size == back_file.size == (736, 1040)
        rgba_ok = front_file.mode == back_file.mode == "RGBA"
        if not rgba_ok or not size_ok:
            return {
                "ok": False,
                "size_736x1040": size_ok,
                "rgba": rgba_ok,
                "same_alpha": False,
                "transparent_outer_corners": False,
                "has_transparency": False,
                "has_opaque_paper": False,
            }

        front_alpha = front_file.getchannel("A")
        back_alpha = back_file.getchannel("A")
        corners = ((0, 0), (735, 0), (0, 1039), (735, 1039))
        results = {
            "size_736x1040": True,
            "rgba": True,
            "same_alpha": front_alpha.tobytes() == back_alpha.tobytes(),
            "transparent_outer_corners": all(
                front_alpha.getpixel(point) == back_alpha.getpixel(point) == 0
                for point in corners
            ),
            "has_transparency": front_alpha.getextrema()[0] == 0,
            "has_opaque_paper": front_alpha.getextrema()[1] == 255,
        }
        return {"ok": all(results.values()), **results}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("front", type=Path, help="front RGBA PNG")
    parser.add_argument("back", type=Path, help="back RGBA PNG")
    args = parser.parse_args()
    try:
        result = inspect(args.front, args.back)
    except (OSError, ValueError) as exc:
        result = {"ok": False, "error": str(exc)}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
