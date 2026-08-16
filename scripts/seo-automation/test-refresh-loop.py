#!/usr/bin/env python3
"""Unit tests for refresh-loop.py — scoring, URL normalization, structural flag,
missing-redirect detection, and the volume reweight (critique fixes Aug 2026).

Run: python3 scripts/seo-automation/test-refresh-loop.py
(no network, no GSC credentials needed — pure logic tests)
"""
import importlib.util
import json
import sys
import unittest
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent
SPEC = importlib.util.spec_from_file_location(
    "refresh_loop", REPO / "scripts" / "seo-automation" / "refresh-loop.py")
rl = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(rl)


def cur(imp, clicks, pos, ctr):
    return {"page": f"https://simplyenak.com/p{imp}", "impressions": imp, "clicks": clicks,
            "position": pos, "ctr": ctr}


def prev(imp, clicks, pos, ctr):
    return {"impressions": imp, "clicks": clicks, "position": pos, "ctr": ctr}


class TestNormalizeUrl(unittest.TestCase):
    def test_trailing_slash_stripped(self):
        self.assertEqual(rl.normalize_url("https://x.com/a/b/"), "https://x.com/a/b")

    def test_index_html_stripped(self):
        self.assertEqual(rl.normalize_url("https://x.com/a/index.html"), "https://x.com/a")

    def test_root_preserved(self):
        # homepage with and without trailing slash must normalize to the same key
        self.assertEqual(rl.normalize_url("https://x.com/"), "https://x.com")
        self.assertEqual(rl.normalize_url("https://x.com"), "https://x.com")

    def test_bare_slash(self):
        self.assertEqual(rl.normalize_url("/"), "/")

    def test_query_stripped(self):
        self.assertEqual(rl.normalize_url("https://x.com/a?x=1"), "https://x.com/a")


class TestScorePage(unittest.TestCase):
    def test_below_min_impressions_skipped(self):
        e = rl.score_page(cur(10, 1, 5.0, 0.05), prev(100, 10, 3.0, 0.10))
        self.assertIsNone(e)

    def test_above_max_position_skipped(self):
        e = rl.score_page(cur(300, 1, 15.0, 0.05), prev(400, 10, 5.0, 0.10))
        self.assertIsNone(e)

    def test_winner_not_touched(self):
        # clicks up + healthy CTR → counter-signals push below threshold
        e = rl.score_page(cur(300, 12, 5.0, 0.06), prev(200, 5, 6.0, 0.03))
        self.assertIsNone(e)

    def test_decline_is_candidate(self):
        e = rl.score_page(cur(200, 3, 6.0, 0.015), prev(400, 10, 4.0, 0.025))
        self.assertIsNotNone(e)
        self.assertGreaterEqual(e["score"], rl.DEFAULT_MIN_SCORE)

    def test_lost_clicks_recorded(self):
        e = rl.score_page(cur(200, 3, 6.0, 0.015), prev(400, 10, 4.0, 0.025))
        self.assertEqual(e["lost_clicks"], 7)
        self.assertEqual(e["lost_impressions"], 200)

    def test_no_negative_lost_clicks(self):
        # clicks UP but impressions down — discipline rule should keep it out or
        # at least not report negative lost clicks
        e = rl.score_page(cur(200, 8, 6.0, 0.04), prev(400, 5, 4.0, 0.0125))
        if e is not None:
            self.assertGreaterEqual(e["lost_clicks"], 0)

    def test_volume_reweight(self):
        # Same % decay; the page with more absolute lost clicks scores higher.
        small = rl.score_page(cur(200, 2, 6.0, 0.01), prev(400, 3, 4.0, 0.0075))
        big = rl.score_page(cur(200, 2, 6.0, 0.01), prev(400, 9, 4.0, 0.0225))
        self.assertIsNotNone(small)
        self.assertIsNotNone(big)
        self.assertGreater(big["lost_clicks"], small["lost_clicks"])
        self.assertGreaterEqual(big["score"], small["score"])


class TestStructuralFlag(unittest.TestCase):
    def test_migration_detected(self):
        # impressions collapsed >70% but position IMPROVED by >1 → structural
        e = rl.score_page(cur(40, 2, 3.3, 0.05), prev(7308, 30, 7.2, 0.004))
        self.assertIsNotNone(e)
        self.assertTrue(e.get("structural"))

    def test_not_structural_when_position_worsens(self):
        # position got worse → genuine decline, not migration
        e = rl.score_page(cur(108, 1, 5.0, 0.009), prev(469, 2, 1.9, 0.004))
        self.assertIsNotNone(e)
        self.assertFalse(e.get("structural"))


class TestMissingRedirect(unittest.TestCase):
    def test_already_stories_url_skipped(self):
        self.assertIsNone(rl.missing_redirect_check("https://simplyenak.com/stories/foo"))

    def test_root_url_not_404_skipped(self):
        # would need network; monkeypatch check_url_status to avoid hitting the live site
        orig = rl.check_url_status

        def fake(url, timeout=12):
            return {"status": 200, "redirect": None, "error": None}

        rl.check_url_status = fake
        try:
            self.assertIsNone(rl.missing_redirect_check("https://simplyenak.com/foo"))
        finally:
            rl.check_url_status = orig

    def test_root_404_stories_live_detected(self):
        orig = rl.check_url_status

        def fake(url, timeout=12):
            if "stories/" in url:
                return {"status": 200, "redirect": None, "error": None}
            return {"status": 404, "redirect": None, "error": None}

        rl.check_url_status = fake
        try:
            res = rl.missing_redirect_check("https://simplyenak.com/food-guide-chow-kit")
            self.assertIsNotNone(res)
            self.assertEqual(res["stories_url"], "https://simplyenak.com/stories/food-guide-chow-kit/")
        finally:
            rl.check_url_status = orig

    def test_root_404_stories_404_skipped(self):
        orig = rl.check_url_status

        def fake(url, timeout=12):
            return {"status": 404, "redirect": None, "error": None}

        rl.check_url_status = fake
        try:
            self.assertIsNone(rl.missing_redirect_check("https://simplyenak.com/foo"))
        finally:
            rl.check_url_status = orig


class TestVerify(unittest.TestCase):
    def setUp(self):
        self.orig_status = rl.check_url_status
        self.orig_open = urllib.request.urlopen
        # isolate from the real output dir
        self.orig_dir = rl.OUTPUT_DIR
        self.tmp = Path(__file__).parent / "_test_verify"
        self.tmp.mkdir(exist_ok=True)
        rl.OUTPUT_DIR = self.tmp

    def tearDown(self):
        rl.check_url_status = self.orig_status
        urllib.request.urlopen = self.orig_open
        rl.OUTPUT_DIR = self.orig_dir
        import shutil
        shutil.rmtree(self.tmp, ignore_errors=True)

    def _write_latest(self, pages):
        (self.tmp / "refresh-loop_latest.json").write_text(
            json.dumps({"meta": {}, "pages": pages, "missing_redirects": []}))

    def test_verify_pass_when_rendered(self):
        self._write_latest([{"page": "https://simplyenak.com/stories/foo"}])
        rl.check_url_status = lambda url, timeout=12: {"status": 200, "redirect": None, "error": None}

        def fake_open(req, timeout=20):
            class R:
                def read(self):
                    return b'<html><title>Foo - Simply Enak</title><body><p>Intro paragraph text.</p></body></html>'
            return R()

        urllib.request.urlopen = fake_open
        self.assertEqual(rl.verify(), 0)

    def test_verify_fails_on_404(self):
        self._write_latest([{"page": "https://simplyenak.com/stories/foo"}])
        rl.check_url_status = lambda url, timeout=12: {"status": 404, "redirect": None, "error": None}
        self.assertEqual(rl.verify(), 1)

    def test_verify_fails_when_rendered_title_missing(self):
        # snapshot says meta_title is "Expected Title", rendered page lacks it
        self._write_latest([{"page": "https://simplyenak.com/stories/foo"}])
        rl.check_url_status = lambda url, timeout=12: {"status": 200, "redirect": None, "error": None}

        orig_resolve = rl.resolve_content_source
        rl.resolve_content_source = lambda page: {
            "file": "/nonexistent/stories.json", "collection": "stories",
            "slug": "foo", "meta_title": "Expected Refresh Title",
            "meta_description": ""}

        def fake_open(req, timeout=20):
            class R:
                def read(self):
                    return b'<html><title>Stale Title</title><body><p>different text entirely</p></body></html>'
            return R()

        urllib.request.urlopen = fake_open
        try:
            # expect_body stays empty (no stories.json on disk), but the
            # expected title is missing from the rendered page → must fail
            self.assertEqual(rl.verify(), 1)
        finally:
            rl.resolve_content_source = orig_resolve

    def test_verify_redirect_target(self):
        self._write_latest([{"page": "https://simplyenak.com/stories/foo",
                             "missing_redirect": {"stories_url": "https://simplyenak.com/stories/foo/"}}])
        # the redirect target must answer 200; the root URL 404 is expected
        rl.check_url_status = lambda url, timeout=12: {"status": 200, "redirect": None, "error": None}
        self.assertEqual(rl.verify(), 0)

    def test_first_markdown_paragraph_skips_h1(self):
        md = "# Title\n\nFirst real paragraph here.\n\nSecond paragraph."
        self.assertEqual(rl._first_markdown_paragraph(md), "First real paragraph here.")

    def test_first_lexical_paragraph(self):
        content = {"root": {"children": [
            {"type": "heading", "children": [{"text": "H1"}]},
            {"type": "paragraph", "children": [{"text": "First para"}]},
        ]}}
        self.assertEqual(rl._first_lexical_paragraph(content), "First para")


if __name__ == "__main__":
    unittest.main(verbosity=2)
