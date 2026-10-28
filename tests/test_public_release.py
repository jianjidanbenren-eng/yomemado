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
        path = ROOT / "assets" / "yomemado-showcase-original.mp4"
        self.assertTrue(path.is_file())
        self.assertGreater(path.stat().st_size, 100_000)
        with path.open("rb") as stream:
            header = stream.read(32)
        self.assertIn(b"ftyp", header)

    def test_original_video_is_unmodified_and_retains_its_audio_track(self):
        import hashlib
        import json
        source = json.loads((ROOT / "assets/showcase-source.json").read_text())
        data = (ROOT / "assets" / source["file"]).read_bytes()
        self.assertEqual(len(data), source["bytes"])
        self.assertEqual(hashlib.sha256(data).hexdigest(), source["sha256"])
        self.assertIn(b"vide", data)
        self.assertIn(b"soun", data)
        self.assertEqual((source["width"], source["height"], source["durationSeconds"]), (1920, 1080, 45))

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
        self.assertIn('assets/yomemado-showcase-original.mp4', page)
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
        logic = (ROOT / "template" / "machine.js").read_text(encoding="utf-8")
        self.assertIn('src="./config.js"', page)
        self.assertIn('src="./letters.js"', page)
        self.assertIn('src="./machine.js?', page)
        self.assertIn('src="./audio.js?', page)
        self.assertIn("localStorage", logic)
        self.assertIn("RELEASE", page)
        self.assertIn("入藏", page)

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

    def test_reader_controls_are_outside_the_flip_button(self):
        from html.parser import HTMLParser

        class ReaderParser(HTMLParser):
            def __init__(self):
                super().__init__()
                self.buttons = []
                self.nested = []

            def handle_starttag(self, tag, attrs):
                if tag == "button":
                    identity = dict(attrs).get("id")
                    if self.buttons:
                        self.nested.append((self.buttons[-1], identity))
                    self.buttons.append(identity)

            def handle_endtag(self, tag):
                if tag == "button" and self.buttons:
                    self.buttons.pop()

        parser = ReaderParser()
        parser.feed((ROOT / "template/index.html").read_text())
        self.assertEqual(parser.nested, [], "Nested buttons break browser layout and flip actions")
        self.assertEqual(parser.buttons, [])

    def test_readme_has_one_click_deploy_buttons(self):
        readme = (ROOT / "README.md").read_text(encoding="utf-8")
        self.assertIn("vercel.com/new/clone", readme)
        self.assertIn("app.netlify.com/start/deploy", readme)
        self.assertIn("root-directory=template", readme)

    def test_real_public_stamp_pairs(self):
        for tag in ("001", "002", "003"):
            folder = ROOT / "template/assets/stamps"
            self.assertTrue(inspect(folder / f"{tag}-front.png", folder / f"{tag}-back.png")["ok"])

    def test_public_bundle_has_only_the_approved_effect_samples(self):
        import json
        approved = json.loads((ROOT / "template/assets/sfx/sources.json").read_text())["samples"]
        effects = {ROOT / "template/assets/sfx" / item["file"] for item in approved.values()}
        for folder in (ROOT / "template", ROOT / "skills"):
            for path in folder.rglob("*"):
                if path in effects:
                    continue
                self.assertNotIn(path.suffix.lower(), {".ttf", ".otf", ".ttc", ".mp3", ".m4a", ".wav"})
                if path.suffix in {".html", ".css", ".js"}:
                    text = path.read_text(encoding="utf8")
                    self.assertNotIn("data:font", text)
                    self.assertNotIn("application/octet-stream", text)

    def test_approved_w32_samples_and_dispatch_code_are_unchanged(self):
        import hashlib
        import json
        directory = ROOT / "template/assets/sfx"
        sources = json.loads((directory / "sources.json").read_text())
        self.assertEqual(set(sources["samples"]), {"switch", "coordinate", "stamp", "flip", "pen", "archive_save", "archive_open", "archive_close"})
        for sample in sources["samples"].values():
            data = (directory / sample["file"]).read_bytes()
            self.assertEqual(len(data), sample["bytes"])
            self.assertEqual(hashlib.sha256(data).hexdigest(), sample["sha256"])
        code = (ROOT / "template/audio.js").read_text()
        block = code.split("// ORIGINAL_V3_BEGIN: retained verbatim from the approved machine.\n")[1].split("    // ORIGINAL_V3_END")[0]
        self.assertEqual(hashlib.sha256(block.encode()).hexdigest(), sources["mechanismCodeSha256"])

    def test_deploy_root_is_the_machine(self):
        import tomllib
        data = tomllib.loads((ROOT / "netlify.toml").read_text())
        self.assertEqual(data["build"], {"base": "template", "publish": "."})


class PublicSkillTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        import importlib.util
        cls.skill = ROOT / "skills/yomemado-stamp-maker"
        spec = importlib.util.spec_from_file_location("public_renderer", cls.skill / "scripts/render_stamp.py")
        cls.renderer = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(cls.renderer)

    def test_standalone_renderer_and_actual_alpha(self):
        import json
        data = json.loads((self.skill / "examples/002.json").read_text())
        data.update(id="TEST", paragraphs=["A lake, snow and distant mountains. A new note for the public example."], signature="Yomemado")
        with tempfile.TemporaryDirectory() as folder:
            front, back = self.renderer.render(self.skill / "examples/002-art.png", data, folder)
            self.assertTrue(inspect(front, back)["ok"])

    def test_fixed_footer_rejects_overflow(self):
        import json
        data = json.loads((self.skill / "examples/002.json").read_text())
        data["stamp"]["footerShortLines"] = ["AN IMPOSSIBLY LONG FOOTER", "LAKE"]
        with tempfile.TemporaryDirectory() as folder, self.assertRaisesRegex(ValueError, "overflows"):
            self.renderer.render(self.skill / "examples/002-art.png", data, folder)

    def test_english_note_does_not_split_words(self):
        from PIL import ImageDraw, ImageFont
        draw = ImageDraw.Draw(Image.new("RGB", (300, 300)))
        font = ImageFont.load_default(size=20)
        text = "Distant mountain shadows cross the blue lake."
        lines = self.renderer.wrap(draw, text, font, 160)
        self.assertEqual(" ".join(lines), text)

    def test_skill_references_exist(self):
        import re
        skill = (self.skill / "SKILL.md").read_text()
        for link in re.findall(r"\]\(([^)]+)\)", skill):
            if not link.startswith("https:"):
                self.assertTrue((self.skill / link).is_file(), link)


if __name__ == "__main__":
    unittest.main()
