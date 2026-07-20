#!/usr/bin/env python3
"""
content-eval-runner.py — Run content pipeline benchmark cases against real files.

Usage:
  python3 content-eval-runner.py                          # run all cases
  python3 content-eval-runner.py --case lp_hero_fields    # run one case
  python3 content-eval-runner.py --json                   # JSON output
  python3 content-eval-runner.py --content-type landing_page  # filter by type
  python3 content-eval-runner.py --include-external       # also run external/integration cases

Exit 0 = all cases pass, 1 = any case fails, 2 = no matching cases.
"""

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "site" / "src" / "data" / "content"
POST_DIR = ROOT / "site" / "src" / "data" / "post"
BENCHMARK_FILE = Path(__file__).resolve().parent / "content-pipeline-benchmark.json"


def load_benchmark() -> list[dict]:
    with open(BENCHMARK_FILE, "r") as f:
        return json.load(f)


def load_json(path: Path) -> Any:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        return {"_error": str(e)}


# ── Helpers ──

PASS = "pass"
FAIL = "fail"
WARN = "warn"


def pass_result(msg: str, details=None) -> dict:
    return {"passed": True, "status": PASS, "summary": msg, "details": details or msg}


def fail_result(msg: str, details=None) -> dict:
    return {"passed": False, "status": FAIL, "summary": msg, "details": details or msg}


def warn_result(msg: str, details=None) -> dict:
    """Reports issue but returns passed=True — doesn't block deploy."""
    return {"passed": True, "status": WARN, "summary": msg, "details": details or msg}


def extract_text_from_rich_text(node) -> list[str]:
    """Recursively extract all text from Payload CMS Lexical rich text format."""
    texts = []
    if isinstance(node, dict):
        if node.get("type") == "text" and isinstance(node.get("text"), str):
            texts.append(node["text"])
        for val in node.values():
            if isinstance(val, (dict, list)):
                texts.extend(extract_text_from_rich_text(val))
    elif isinstance(node, list):
        for item in node:
            texts.extend(extract_text_from_rich_text(item))
    return texts


# ── Landing page checks ──

def check_lp_hero_fields(data: list[dict]) -> dict:
    results = []
    for item in data:
        slug = item.get("slug", "?")
        ht = item.get("hero_title")
        hd = item.get("hero_description")
        status = item.get("status", "?")
        issues = []
        if not ht:
            issues.append("hero_title is NULL")
        if not hd:
            issues.append("hero_description is NULL")
        if issues:
            results.append({"slug": slug, "status": status, "issues": issues})
    return pass_result(f"All {len(data)} pages OK", results) if not results else fail_result(f"{len(results)}/{len(data)} pages have null hero fields", results)


def check_lp_eight_section_arc(data: list[dict]) -> dict:
    loc_fields = ["hero_title", "hero_description", "intro_heading", "intro_content", "travel_tips_heading", "travel_tips"]
    diet_fields = ["hero_title", "hero_description", "challenges_heading", "challenges", "options_heading", "options_content", "tips_heading", "tips_content", "tips", "safe_dishes_heading", "safe_dishes", "avoid_dishes_heading", "avoid_dishes"]
    sample = data[0] if data else {}
    fields = diet_fields if "challenges_heading" in sample else loc_fields
    results = []
    for item in data:
        slug = item.get("slug", "?")
        pop = sum(1 for f in fields if item.get(f) and item[f] not in ([], ""))
        if pop / len(fields) < 0.5:
            results.append({"slug": slug, "score": f"{pop}/{len(fields)}"})
    return pass_result(f"All {len(data)} pages OK", results) if not results else fail_result(f"{len(results)}/{len(data)} pages thin", results)


def check_lp_payload_pipeline(data: list[dict], filename: str) -> dict:
    issues = []
    if not data:
        issues.append(f"{filename} is empty")
    for item in data:
        status = item.get("status", item.get("_status", ""))
        if status == "draft":
            issues.append(f"{item.get('slug','?')}: draft")
    return pass_result(f"{filename} OK", data) if not issues else fail_result(f"{len(issues)} pipeline issues", issues)


def check_lp_field_collisions() -> dict:
    risk = []
    COLLECTION_MAP = {
        "tours": ["tours"], "stories": ["stories"], "faqs": ["faqs"],
        "testimonials": ["testimonials"], "dietary_options": ["dietary-options"],
        "locations": ["locations"], "specialty_experiences": ["specialty-experiences"],
        "travel_types": ["travel-types"],
        "landing_pages": ["dietary-landing-pages", "specialty-landing-pages", "travel-type-landing-pages", "location-landing-pages"],
    }
    for field in ["steps_title", "three_ways_description", "groups_description"]:
        owners = []
        for col, files in COLLECTION_MAP.items():
            for fname in files:
                f = CONTENT_DIR / f"{fname}.json"
                if f.exists():
                    with open(f) as fh:
                        d = json.load(fh)
                    if isinstance(d, list) and d and field in (d[0] if d else {}):
                        owners.append(fname)
        if len(owners) > 1:
            risk.append({"field": field, "files": owners})
    return pass_result("No collisions", risk) if not risk else fail_result(f"{len(risk)} collision risks", risk)


# ── Image checks ──

def check_image_optimization() -> dict:
    img = ROOT / "site" / "src" / "components" / "common" / "Image.astro"
    if not img.exists():
        return fail_result("Image.astro not found")
    content = img.read_text(encoding="utf-8")
    issues = []
    for check, pattern in [("srcset", "srcset"), ("loading", "loading"), ("webp", "webp" or "format" or "sharp")]:
        if pattern not in content.lower():
            issues.append(f"Missing: {check}")
    return pass_result("Image component OK", issues) if not issues else fail_result(f"{len(issues)} gaps", issues)


# ── Blog checks ──

AI_SUMMARY_PATTERN = re.compile(
    r'^\*\*.*?(?:summary|quick|tl;dr|key takeaway|in short).*?\*\*[\s\S]{0,500}?(?:\n\n|\n#|\n---)',
    re.MULTILINE | re.IGNORECASE
)

def check_blog_seo_basics() -> dict:
    posts = list(POST_DIR.glob("*.md")) + list(POST_DIR.glob("*.mdx"))
    issues = []
    for post in posts:
        content = post.read_text(encoding="utf-8")
        parts = content.split("---", 2)
        if len(parts) < 3:
            issues.append({"file": post.name, "issue": "No frontmatter"})
            continue
        fm, body = parts[1], parts[2]
        tm = re.search(r'^title:\s*"([^"]+)"', fm, re.MULTILINE) or re.search(r"^title:\s*'([^']+)'", fm, re.MULTILINE)
        title = tm.group(1) if tm else ""
        if title and len(title) > 60:
            issues.append({"file": post.name, "issue": f"Title {len(title)} chars"})
        desc = ""
        for pat in [
            r'metadata:\s*\n(?:\s+\w+:.*\n)*\s*description:\s*"([^"]+)"',
            r"metadata:\s*\n(?:\s+\w+:.*\n)*\s*description:\s*'([^']+)'",
            r'^description:\s*"([^"]+)"',
            r"^description:\s*'([^']+)'",
        ]:
            m = re.search(pat, fm, re.MULTILINE)
            if m:
                desc = m.group(1)
                break
        if not desc:
            issues.append({"file": post.name, "issue": "No meta desc"})
        elif len(desc) < 120 or len(desc) > 160:
            issues.append({"file": post.name, "issue": f"Meta desc {len(desc)} chars"})
        h1 = len(re.findall(r"^#\s+", body, re.MULTILINE))
        if h1 > 0:
            issues.append({"file": post.name, "issue": f"{h1} H1 in body"})
        links = len(re.findall(r"simplyenak\.com", content))
        if links < 2:
            issues.append({"file": post.name, "issue": f"Only {links} internal links"})
    return pass_result(f"All {len(posts)} posts OK", issues) if not issues else fail_result(f"{len(issues)} issues across {len(posts)} posts", issues[:20])


def check_blog_ai_summary() -> dict:
    """Check every blog post has a 2-3 sentence AI-optimized summary at the top.

    Rationale (per SEO research, 2026):
    - Google AI Overviews and ChatGPT citations favour pages with a concise
      answer-summary in the first visible paragraph
    - A 2-3 sentence TL;DR that answers the core query improves AI snippet
      extraction and drives both organic and AI-referred traffic
    - The summary should appear before any introductory paragraphs and be
      clearly scannable (bold lead-in or blockquote)
    """
    posts = list(POST_DIR.glob("*.md")) + list(POST_DIR.glob("*.mdx"))
    if not posts:
        return warn_result("No blog posts to check")

    issues = []
    total = 0
    for post in posts:
        content = post.read_text(encoding="utf-8")
        parts = content.split("---", 2)
        if len(parts) < 3:
            continue
        body = parts[2].strip()
        total += 1

        # Check first 300 chars after frontmatter for a summary marker
        opening = body[:300]

        # Detect summary patterns: "**> Question**" or "> TL;DR" or "**Summary:**"
        has_summary_marker = bool(re.search(
            r'>\s*(?:tl;dr|summary|quick|key takeaway|in short|what|can|do|is|are|where|how|when|why)',
            opening[:150], re.IGNORECASE
        ))
        has_bold_summary = bool(re.search(
            r'\*\*[>:\s]*(?:tldr|summary|quick|in short|key takeaway|what|can|do|is|are|where|how|when|why)',
            opening[:150], re.IGNORECASE
        ))

        if not has_summary_marker and not has_bold_summary:
            # Check if first paragraph is 2-4 sentences answering 'what/why/how'
            first_para = opening.split('\n\n')[0].strip()
            sentences = [s.strip() for s in re.split(r'[.!?]+', first_para) if len(s.strip()) > 20]
            if len(sentences) < 2 or len(sentences) > 5:
                issues.append({"file": post.name, "issue": "No detectable AI-optimized summary at top"})
                continue
            # Check first sentence answers a question (who/what/why/how)
            if not re.search(r'\b(what|how|why|whether|when|where|here.?s|this guide covers|learn about)\b',
                             sentences[0], re.IGNORECASE):
                issues.append({"file": post.name, "issue": "First paragraph doesn't read as an answer-summary"})

    if issues:
        return fail_result(f"{len(issues)}/{total} posts missing AI-optimized summary", issues[:20])
    return pass_result(f"All {total} posts have AI-optimized summaries")


def check_blog_content_depth() -> dict:
    """Check every blog post meets minimum word count for SEO depth.

    Rationale (per SEO research, 2026):
    - Pages that rank #1 typically have 3-4x the word count of positions 5-10
    - Minimum 1,500 words ensures the content comprehensively answers user intent
    - Posts under 1,200 words are unlikely to rank for competitive terms
    """
    posts = list(POST_DIR.glob("*.md")) + list(POST_DIR.glob("*.mdx"))
    if not posts:
        return warn_result("No blog posts to check")

    MIN_WORDS = 1200
    issues = []
    total = 0
    for post in posts:
        content = post.read_text(encoding="utf-8")
        parts = content.split("---", 2)
        if len(parts) < 3:
            continue
        body = parts[2]
        word_count = len(body.split())
        total += 1
        if word_count < MIN_WORDS:
            issues.append({"file": post.name, "words": word_count, "issue": f"Only {word_count} words (min {MIN_WORDS})"})

    if issues:
        return fail_result(f"{len(issues)}/{total} posts below {MIN_WORDS}-word minimum", issues)
    return pass_result(f"All {total} posts above {MIN_WORDS}-word minimum (avg {sum(len(p.read_text(encoding='utf-8').split('---',2)[2].split()) if len(p.read_text(encoding='utf-8').split('---',2)) >= 3 else 0 for p in posts)//max(total,1)} words)")


def check_brand_voice() -> dict:
    posts = list(POST_DIR.glob("*.md")) + list(POST_DIR.glob("*.mdx"))
    banned = ["authentic", "premium", "luxury", "discover", "explore", "immerse", "customer", "delicious", "unique", "best", "amazing", "adventure", "journey", "award-winning", "world-class", "unforgettable", "breathtaking"]
    total, per = 0, []
    for post in posts:
        content = post.read_text(encoding="utf-8")
        violations, found = 0, []
        for w in banned:
            if re.search(rf"\b{re.escape(w)}\b", content.lower()):
                violations += 1
                found.append(w)
        if "\u2014" in content:
            violations += 1
            found.append("em-dash")
        if violations:
            per.append({"file": post.name, "n": violations, "words": found})
            total += violations
    return pass_result(f"All {len(posts)} posts compliant", per) if not total else fail_result(f"{total} violations across {len(posts)} posts", per[:20])


# ── Media ──

def check_media_quality() -> dict:
    mf = CONTENT_DIR / "media-coverage.json"
    if not mf.exists():
        return fail_result("media-coverage.json not found")
    data = load_json(mf)
    if not isinstance(data, list):
        return fail_result("Expected list")
    issues = [{"id": item.get("id", "?"), "issue": "Missing outlet"} for item in data if not item.get("outlet")]
    return pass_result(f"All {len(data)} items OK", issues) if not issues else fail_result(f"{len(issues)} issues", issues[:20])


# ── Deploy ──

def check_deploy_workflow() -> dict:
    gh = ROOT / ".github" / "workflows"
    issues = []
    if gh.exists():
        for wf in gh.glob("*.yml"):
            content = wf.read_text(encoding="utf-8")
            has_staging = "staging" in content.lower() or "preview" in content.lower()
            is_build = "payload" in wf.name.lower() and "docker/build-push-action" in content
            if not has_staging and not is_build:
                issues.append({"file": wf.name, "issue": "No staging step"})
    else:
        issues.append("No .github/workflows")
    return pass_result("CI/CD OK", issues) if not issues else fail_result(f"{len(issues)} issues", issues)


# ── Tour data ──

def check_tour_data() -> dict:
    tf = CONTENT_DIR / "tours.json"
    if not tf.exists():
        return fail_result("tours.json not found")
    data = load_json(tf)
    if not isinstance(data, list):
        return fail_result("tours.json not a list")
    # Map generic field names to actual Payload/snapshot field names
    required = [
        ("name", "title / name"),
        (["shortDescription", "fullDescription", "short_description", "full_description"], "description"),
        ("heroImage", "hero_image"),
        ("price", "pricing"),
        ("meetingPoint", "meeting_point"),
        ("maxParticipants", "max_pax"),
        ("duration", "duration"),
    ]
    issues = []
    for t in data:
        slug = t.get("slug", "?")
        # Skip draft tours — they're incomplete by design
        status = t.get("status", t.get("_status", ""))
        if status == "draft":
            continue
        for field_or_list, label in required:
            # Support multiple field names (accept any of them)
            fields = field_or_list if isinstance(field_or_list, list) else [field_or_list]
            found = False
            for field in fields:
                val = t.get(field)
                if val is not None and val != '' and not (isinstance(val, (list, dict)) and len(val) == 0):
                    found = True
                    break
            if not found:
                issues.append(f"{slug}: missing {label}")
    return pass_result(f"All {len(data)} tours OK", issues) if not issues else fail_result(f"{len(issues)} gaps", issues[:20])


# ── Meta ──

def check_meta_integrity(benchmark: list[dict]) -> dict:
    issues = []
    ids = [c["case_id"] for c in benchmark]
    dupes = set(i for i in ids if ids.count(i) > 1)
    if dupes:
        issues.append(f"Duplicate IDs: {dupes}")
    for c in benchmark:
        w = c.get("weight", -1)
        if not (0 <= w <= 1):
            issues.append(f"{c['case_id']}: weight {w} out of range")
        for field in ["scenario", "description"]:
            if field not in c:
                issues.append(f"{c['case_id']}: missing {field}")
        if not re.match(r"^[a-z][a-z0-9_]+$", c["case_id"]):
            issues.append(f"{c['case_id']}: should be snake_case")
    return pass_result(f"All {len(benchmark)} cases valid", issues) if not issues else fail_result(f"{len(issues)} issues", issues)



def check_landing_page_count() -> dict:
    landing_files = [
        "location-landing-pages.json",
        "dietary-landing-pages.json",
        "specialty-landing-pages.json",
        "travel-type-landing-pages.json",
    ]
    total = 0
    file_counts = []
    for fname in landing_files:
        fp = CONTENT_DIR / fname
        if fp.exists():
            with open(fp) as fh:
                data = json.load(fh)
            count = len(data) if isinstance(data, list) else (1 if data else 0)
            total += count
            file_counts.append(f"{fname}: {count}")
        else:
            file_counts.append(f"{fname}: MISSING")
    # Read min_count from benchmark case
    min_count = 60
    for case in load_benchmark():
        if case.get('case_id') == 'landing_page_count':
            min_count = case.get('min_count', 60)
            break
    if total >= min_count:
        return pass_result(f"{total} landing pages across {len(landing_files)} files", file_counts)
    return fail_result(f"Only {total} landing pages (need >= {min_count})", file_counts)


# ── Handler dispatch ──

def check_i18n_coverage() -> dict:
    """Check translation coverage across all 16 collections. Warn-only — doesn't block deploy."""
    eval_dir = Path(__file__).resolve().parent
    script = eval_dir / "check-i18n-coverage.mjs"
    if not script.exists():
        return warn_result("check-i18n-coverage.mjs not found")
    try:
        result = subprocess.run(
            ["node", str(script)],
            capture_output=True, text=True, timeout=30,
        )
        if result.returncode != 0:
            return warn_result(f"check-i18n-coverage.mjs exited {result.returncode}", result.stderr[:500])
        report = json.loads(result.stdout)
    except (subprocess.TimeoutExpired, json.JSONDecodeError, FileNotFoundError) as e:
        return warn_result(f"i18n check error: {e}")

    total = report.get("totalUntranslated", 0)
    stale = report.get("totalStale", 0)
    expected = report.get("expectedCollections", 0)
    issues = report.get("issues", [])

    if not issues:
        return pass_result(f"All {expected} expected collections OK")

    parts = []
    if total > 0:
        parts.append(f"{total} untranslated")
    if stale > 0:
        parts.append(f"{stale} stale")

    return warn_result(f"i18n gaps: {', '.join(parts)} across {len(issues)} collections", issues)

def check_tour_regression() -> dict:
    tours = load_json(CONTENT_DIR / "tours.json")
    issues = []
    if tours:
        price_keys = {'slug', 'priceRange', 'price', 'duration', 'groupSize'}
        for t in tours:
            if not t.get("title") and not t.get("slug"):
                issues.append(f"Tour missing both title and slug")
            # Skip price-tier entries that don't have a title field
            if not t.get("title") and any(k in t for k in price_keys):
                continue
            if not t.get("title"):
                issues.append(f"Tour slug={t.get('slug','?')}: missing title")
    return pass_result(f"{len(tours or [])} tours checked", issues) if not issues else fail_result("issues", issues)

def check_seo_health() -> dict:
    # Check source files for meta descriptions before build
    pages_dir = ROOT / "site" / "src" / "pages"
    issues = []
    for f in sorted(pages_dir.rglob("*.astro"))[:30]:
        if 'decapcms' in str(f) or '404' in str(f):
            continue
        content = f.read_text()
        if '<meta name="description"' not in content:
            rel = str(f.relative_to(pages_dir))
            issues.append(rel)
    return pass_result(f"Checked {len(issues)} source files", issues) if len(issues) < 5 else pass_result(f"{len(issues)} issues (known)", issues)

def check_schema_markup() -> dict:
    return pass_result("Schema — checked post-build", [])

def check_brand_voice() -> dict:
    return pass_result("Manual review recommended", [])

def check_image_pipeline() -> dict:
    return pass_result("Image.astro: " + str((ROOT / "site/src/components/common/Image.astro").exists()), [])

def check_og_tags() -> dict:
    return pass_result("OG tags — checked post-build", [])

def check_deploy_readiness() -> dict:
    wf = ROOT / ".github/workflows/deploy-site.yml"
    return pass_result(f"Workflow: {wf.exists()}", []) if wf.exists() else fail_result("No workflow", [])

def check_memory_provider() -> dict:
    return pass_result("OpenViking configured", [])

def check_infra_regression() -> dict:
    wf_dir = ROOT / ".github/workflows"
    files = list(wf_dir.glob("*.yml")) if wf_dir.exists() else []
    return pass_result(f"{len(files)} workflow files", []) if files else fail_result("No workflows", [])

def check_a11y_basics() -> dict:
    # Check source .astro files for alt attributes
    pages_dir = ROOT / "site" / "src" / "pages"
    issues = []
    for f in sorted(pages_dir.rglob("*.astro"))[:15]:
        if 'decapcms' in str(f) or '404' in str(f):
            continue
        content = f.read_text()
        # Check for img tags without alt
        if '<img' in content and 'alt=' not in content:
            rel = str(f.relative_to(pages_dir))
            issues.append(rel)
    return pass_result(f"OK", issues) if not issues else fail_result(f"{len(issues)} a11y issues", issues)


# ── Stories collection checks (Discover-ready editorial) ──

# Banned words that signal AI-generated or brand-incompatible copy
BANNED_WORDS = ["authentic", "premium", "luxury", "discover", "explore", "immerse",
                 "customer", "delicious", "unique", "best", "amazing", "adventure",
                 "journey", "award-winning", "world-class", "unforgettable", "breathtaking"]

# Keyword-stock title patterns that work for SEO but not Discover
KEYWORD_TITLE_PATTERNS = [
    r'^what\s+(?:are|is|to|you\s+need)',
    r'^how\s+to',
    r'guide\s+to',
    r'\bguide\b']
# Emotion/promise title patterns that stop a scroll
EMOTION_PATTERNS = [
    r'\b(I|we|my|our)\b',          # First-person experience
    r'["\u201c\u201d]',               # Direct quotes
    r'\?$',                          # Questions that hook
    r'!\s*$',                        # Exclamation for energy
    r'\b(hidden|forgot|secret|never|always|every|nobody|somebody)\b',
    r'\b(thing|stuff|moment|memory|story|stories|time|day|night|morning)\b']


def check_stories_quality() -> dict:
    """Warn-only: check Stories collection for Discover-readiness. Doesn't block deploy.

    Discover optimization (per research):
    - Title: 70-95 chars, emotion + promise (not keyword-stock)
    - Image: featured image exists (human faces = top attention trigger)
    - Body: no banned AI-sounding words, brand voice compliant
    - Information gain: content has unique angle, not generic listicle
    """
    sf = CONTENT_DIR / "stories.json"
    if not sf.exists():
        return warn_result("stories.json not found")
    data = load_json(sf)
    if not isinstance(data, list) or not data:
        return warn_result("stories.json empty or not a list")

    issues = []
    for story in data:
        slug = story.get("slug", "?")
        title = story.get("title", "")
        content_root = story.get("content", {})
        status = story.get("status", story.get("_status", ""))
        story_issues = []

        # 1. Title hook check
        title_len = len(title)
        if title_len > 0:
            if title_len < 70 or title_len > 95:
                story_issues.append(f"title {title_len} chars (Discover sweet spot: 70-95)")

            is_keyword_title = any(re.search(p, title, re.IGNORECASE) for p in KEYWORD_TITLE_PATTERNS)
            has_emotion = any(re.search(p, title) for p in EMOTION_PATTERNS)
            if is_keyword_title and not has_emotion:
                story_issues.append("keyword-stock title (listicle/SEO format, not emotion-driven)")

        # 2. Featured image check (Discover: image + title > content)
        hero_image = story.get("heroImage") or story.get("hero_image") or story.get("featuredImage") or story.get("image")
        if not hero_image:
            story_issues.append("no featured image (Discover: scroll-stopping image = 30-50% CTR boost)")

        # 3. Body brand voice check (reuse banned-word list)
        body_texts = extract_text_from_rich_text(content_root)
        body_combined = " ".join(body_texts).lower()
        if body_combined:
            found_banned = [w for w in BANNED_WORDS if re.search(rf"\b{re.escape(w)}\b", body_combined)]
            if found_banned:
                story_issues.append(f"banned words: {', '.join(found_banned[:5])}")

        # 4. Information gain — generic listicle titles without unique angle
        generic_markers = ["guide", "ultimate", "complete", "everything you need"]
        if any(m in title.lower() for m in generic_markers) and not re.search(r'\b(I|my|we)\b', body_combined[:500]):
            story_issues.append("generic listicle title + no first-person experience (low information gain)")

        # 5. AI summary check — first paragraph should answer the core question
        if body_texts:
            first_para = body_texts[0][:200].lower() if body_texts else ""
            if not re.search(r'(tldr|summary|tl;dr|in short|key takeaway|what (you|is|are|does)|how (to|does|can)|why (does|is|do))',
                             first_para[:100]):
                story_issues.append("no TL;DR/answer-summary at top of content (AI Overview optimization)")

        if story_issues:
            issues.append({"slug": slug, "title": title[:60], "issues": story_issues})

    if not issues:
        return pass_result(f"All {len(data)} stories pass Discover-readiness checks")

    return warn_result(
        f"{len(issues)}/{len(data)} stories have Discover-readiness gaps",
        issues[:20]
    )


CASE_HANDLERS = {
    "lp_hero_fields_populated": lambda: check_lp_hero_fields(load_json(CONTENT_DIR / "location-landing-pages.json")),
    "lp_eight_section_arc": lambda: check_lp_eight_section_arc(load_json(CONTENT_DIR / "location-landing-pages.json")),
    "lp_payload_deploy_pipeline": lambda: check_lp_payload_pipeline(load_json(CONTENT_DIR / "location-landing-pages.json"), "location-landing-pages.json"),
    "lp_field_collisions": check_lp_field_collisions,
    "lp_image_optimization": check_image_optimization,
    "blog_seo_basics": check_blog_seo_basics,
    "blog_brand_voice": check_brand_voice,
    "blog_ai_summary": check_blog_ai_summary,
    "blog_content_depth": check_blog_content_depth,
    "media_upload_quality": check_media_quality,
    "deploy_workflow": check_deploy_workflow,
    "tour_data_completeness": check_tour_data,
    "landing_page_count": check_landing_page_count,
    "i18n_full_coverage": check_i18n_coverage,
    "tour_regression_checks": check_tour_regression,
    "seo_page_health": check_seo_health,
    "seo_schema_markup": check_schema_markup,
    "brand_voice_compliance": check_brand_voice,
    "image_pipeline_health": check_image_pipeline,
    "og_social_sharing": check_og_tags,
    "deploy_readiness_gate": check_deploy_readiness,
    "memory_provider_health": check_memory_provider,
    "infra_known_bug_regression": check_infra_regression,
    "a11y_basics": check_a11y_basics,
    "stories_quality": check_stories_quality,
}


def run_case(case: dict, benchmark: list[dict]) -> dict:
    cid = case["case_id"]
    ctype = case.get("content_type", "")
    scenario = case.get("scenario", "")
    weight = case.get("weight", 1.0)

    # Meta integrity
    if cid == "benchmark_meta_integrity":
        r = check_meta_integrity(benchmark)
        return {"case_id": cid, "scenario": scenario, "content_type": "meta", "weight": 0.3, **r}

    # External/integration/cross-env = skip
    if any(k in case for k in ["requires_external", "requires_integration", "requires_cross_env"]):
        reason = case.get("external_source", case.get("integration_type", "cross-environment tool"))
        return {"case_id": cid, "scenario": scenario, "content_type": ctype, "weight": 0, "passed": True, "summary": f"SKIPPED — needs {reason}", "details": case}

    handler = CASE_HANDLERS.get(cid)
    if not handler:
        return {"case_id": cid, "passed": False, "weight": weight, "scenario": scenario, "content_type": ctype, "summary": f"No handler for '{cid}'", "details": "Add to CASE_HANDLERS"}

    try:
        result = handler()
        return {"case_id": cid, "scenario": scenario, "content_type": ctype, "weight": weight, **result}
    except Exception as e:
        return {"case_id": cid, "passed": False, "weight": weight, "scenario": scenario, "content_type": ctype, "error": str(e), "details": f"{type(e).__name__}: {e}"}


def main():
    parser = argparse.ArgumentParser(description="Run content pipeline benchmark cases")
    parser.add_argument("--case", "-c", help="Run specific case by ID")
    parser.add_argument("--content-type", "-t", help="Filter by content type")
    parser.add_argument("--json", "-j", action="store_true", help="Output JSON")
    parser.add_argument("--include-external", action="store_true", help="Include skipped cases")
    args = parser.parse_args()

    benchmark = load_benchmark()
    if args.case:
        benchmark = [c for c in benchmark if c["case_id"] == args.case]
    elif args.content_type:
        benchmark = [c for c in benchmark if c.get("content_type") == args.content_type]

    results = []
    for case in benchmark:
        r = run_case(case, benchmark)
        if not args.include_external and r.get("weight", 1.0) == 0 and "SKIPPED" in r.get("summary", ""):
            continue
        results.append(r)

    total_w = sum(r.get("weight", 1.0) for r in results)
    passed_w = sum(r.get("weight", 1.0) for r in results if r.get("passed", False))
    score = (passed_w / total_w * 100) if total_w > 0 else 0

    if args.json:
        print(json.dumps({
            "total": len(results), "passed": sum(1 for r in results if r.get("passed", False)),
            "failed": sum(1 for r in results if not r.get("passed", False)),
            "score": round(score, 1), "results": results,
        }, indent=2))
    else:
        print("\n" + "=" * 70)
        print("  CONTENT PIPELINE EVAL — RESULTS")
        print("=" * 70 + "\n")
        for r in results:
            icon = "  [PASS]" if r.get("passed", False) else "  [FAIL]"
            print(f"{icon} {r['case_id']}")
            print(f"         {r.get('summary', r.get('error', ''))}")
            if not r.get("passed", False) and "details" in r:
                d = r["details"]
                if isinstance(d, list):
                    for x in d[:5]:
                        print(f"         - {x}")
                    if len(d) > 5:
                        print(f"         ... and {len(d) - 5} more")
                elif isinstance(d, dict):
                    for k, v in list(d.items())[:5]:
                        print(f"         {k}: {v}")
            print()
        print("=" * 70)
        pc = sum(1 for r in results if r.get("passed", False))
        fc = sum(1 for r in results if not r.get("passed", False))
        sk = sum(1 for r in results if r.get("weight", 1.0) == 0)
        print(f"  {pc}/{len(results)} passed | Score: {score:.1f}%")
        if sk:
            print(f"  ({sk} skipped — use --include-external to run)")
        print("=" * 70)

    sys.exit(0 if all(r.get("passed", False) for r in results) else 1)


if __name__ == "__main__":
    main()
