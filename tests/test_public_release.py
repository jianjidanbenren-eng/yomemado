"""Regression checks for public sample tools and the showcase assets.

No private W48/W51 source, letters, fonts, or music is required.
"""
from pathlib import Path
import tempfile
import unittest

from PIL import Image

from tools.check_stamp import inspect

ROOT = Path(__file__).resolve().parents[1]


class StampCheckerTests(unittest.TestCase):
    def setUp(self):
        self.work = tempfile.TemporaryDirectory()
        self.addCleanup(self.work.cleanup)
        self.front = Path(self.work.name) / "front.png"
        self.back = Path(self.work.name) / "back.png"

    def make_pair(self, second_alpha_change=False, wrong_size=False, opaque_corner=False):
        size = (735, 1040) if wrong_size else (736, 1040)
        a = Image.new("RGBA", size, (0, 0, 0, 0))
        for y in range(20, size[1] - 20):
            for x in range(20, size[0] - 20):
                a.putpixel((x, y), (240, 225, 198, 255))
        b = a.copy()
        if second_alpha_change:
            b.putpixel((30, 30), (240, 225, 198, 0))
        if opaque_corner:
            a.putpixel((0, 0), (240, 225, 198, 255))
            b.putpixel((0, 0), (240, 225, 198, 255))
        a.save(self.front)
        b.save(self.back)

    def test_valid_transparent_pair(self):
        self.make_pair()
        self.assertTrue(inspect(self.front, self.back)["ok"])

    def test_reject_mismatched_perforation(self):
        self.make_pair(second_alpha_change=True)
        self.assertFalse(inspect(self.front, self.back)["same_alpha"])

    def test_reject_wrong_size(self):
        self.make_pair(wrong_size=True)
        self.assertFalse(inspect(self.front, self.back)["size_736x1040"])

    def test_reject_opaque_corner(self):
        self.make_pair(opaque_corner=True)
        self.assertFalse(inspect(self.front, self.back)["transparent_outer_corners"])


class ShowcaseAssetTests(unittest.TestCase):
    def test_real_video_is_checked_in(self):
        path = ROOT / "assets" / "yomemado-showcase-silent.mp4"
        self.assertTrue(path.is_file())
        self.assertGreater(path.stat().st_size, 100_000)
        with path.open("rb") as stream:
            header = stream.read(32)
        self.assertIn(b"ftyp", header)

    def test_webp_poster_is_checked_in(self):
        path = ROOT / "assets" / "showcase-poster.webp"
        self.assertTrue(path.is_file())
        with Image.open(path) as poster:
            self.assertEqual(poster.format, "WEBP")
            self.assertGreaterEqual(poster.width, 700)

    def test_homepage_has_accessible_video(self):
        page = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertIn('id="showcase-film"', page)
        self.assertIn('controls playsinline', page)
        self.assertIn('assets/yomemado-showcase-silent.mp4', page)
        self.assertIn('assets/showcase-poster.webp', page)
        self.assertEqual(page.count('class="film-chapter"'), 5)


class DeployableTemplateTests(unittest.TestCase):
    def test_template_files_are_present(self):
        required = [
            "index.html",
            "config.js",
            "letters.js",
            "README.md",
            "USAGE.md",
            "LICENSE",
            "vercel.json",
            "netlify.toml",
        ]
        for name in required:
            self.assertTrue((ROOT / "template" / name).is_file(), name)

    def test_template_is_config_driven(self):
        page = (ROOT / "template" / "index.html").read_text(encoding="utf-8")
        self.assertIn('src="./config.js"', page)
        self.assertIn('src="./letters.js"', page)
        self.assertIn("localStorage", page)
        self.assertIn("RELEASE", page)
        self.assertIn("COLLECT", page)

    def test_public_template_has_no_private_service_links(self):
        content = "\n".join(
            p.read_text(encoding="utf-8")
            for p in (ROOT / "template").glob("*")
            if p.is_file() and p.suffix in {".html", ".js", ".md", ".json", ".toml"}
        )
        forbidden = [
            "humblesloth128.chatgpt.site",
            "api/private/letters",
            "W51 正式离线版",
            "OPENAI_API_KEY",
            "VERCEL_TOKEN",
        ]
        for needle in forbidden:
            self.assertNotIn(needle, content)

    def test_readme_has_one_click_deploy_buttons(self):
        readme = (ROOT / "README.md").read_text(encoding="utf-8")
        self.assertIn("vercel.com/new/clone", readme)
        self.assertIn("app.netlify.com/start/deploy", readme)
        self.assertIn("tree%2Fmain%2Ftemplate", readme)


if __name__ == "__main__":
    unittest.main()
