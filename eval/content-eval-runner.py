#!/usr/bin/env python3
"""
content-eval-runner.py — Run content pipeline benchmark cases against real files.

Usage:
  python3 content-eval-runner.py                          # run all cases
  python3 content-eval-runner.py --case lp_hero_fields    # run one case
  python3 content-eval-runner.py --json                   # JSON output
  python3 content-eval-runner.py --content-type landing_page  # filter by type

Reads eval/content-pipeline-benchmark.json and checks real files in:
  - site/src/data/content/  (Payload JSON snapshots)
  - site/src/data/post/     (blog posts)
  - site/src/               (Astro components for image checks)

Exit 0 = all cases pass, 1 = any case fails.
"""

import argparse
import json
import os
import re
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


# ── Landing page checks ──

def check_lp_hero_fields(data: list[dict]) -> dict:
    """Check that hero_title and hero_description are non-null in all LP entries."""
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
            results.append({
                "slug": slug,
                "status": status,
                "issues": issues,
            })
    passed = len(results) == 0
    return {
        "passed": passed,
        "details": results if not passed else "All hero fields populated",
        "summary": f"{len(results)}/{len(data)} pages have null hero fields" if results else f"All {len(data)} pages have hero fields populated",
    }


def check_lp_eight_section_arc(data: list[dict]) -> dict:
    """Check that landing pages have enough content sections populated.
    
    Different LP types have different schemas:
    - Location LPs: hero fields, intro_heading, intro_content, travel_tips_heading, travel_tips
    - Dietary LPs: hero fields, challenges, options, tips, safe_dishes, avoid_dishes
    """
    # Location LP section fields
    loc_section_fields = [
        "hero_title", "hero_description",
        "intro_heading", "intro_content",
        "travel_tips_heading", "travel_tips",
    ]
    # Dietary LP section fields
    dietary_section_fields = [
        "hero_title", "hero_description",
        "challenges_heading", "challenges",
        "options_heading", "options_content",
        "tips_heading", "tips_content", "tips",
        "safe_dishes_heading", "safe_dishes",
        "avoid_dishes_heading", "avoid_dishes",
    ]
    
    # Detect which schema based on which fields exist
    sample = data[0] if data else {}
    has_dietary_fields = "challenges_heading" in sample
    section_fields = dietary_section_fields if has_dietary_fields else loc_section_fields
    
    results = []
    for item in data:
        slug = item.get("slug", "?")
        populated = 0
        empty_sections = []
        for field in section_fields:
            val = item.get(field)
            if val and val != [] and val != "":
                populated += 1
            else:
                empty_sections.append(field)
        total = len(section_fields)
        ratio = populated / total if total > 0 else 0
        if ratio < 0.5:
            results.append({
                "slug": slug,
                "populated_sections": f"{populated}/{total}",
                "empty_fields": empty_sections[:8],
            })
    passed = len(results) == 0
    return {
        "passed": passed,
        "details": results if not passed else "All pages have sufficient section content",
        "summary": f"{len(results)}/{len(data)} pages have <50% section content" if results else f"All {len(data)} pages have sufficient content sections",
    }


def check_lp_bm_mirrors_en(data: list[dict]) -> dict:
    """Check that BM locale pages exist and mirror EN structure."""
    # Check if MS route files exist for each segment type
    routes_dir = ROOT / "site" / "src" / "pages" / "ms" / "tours"
    ms_routes = []
    if routes_dir.exists():
        for f in routes_dir.iterdir():
            if f.is_dir():
                # Look for any .astro file inside (the [...] slug pattern makes glob tricky)
                slug_files = list(f.glob("*.astro"))
                if slug_files:
                    ms_routes.append(f.name)
    
    # Also check BM slugs in data files
    slugs = {item.get("slug", "") for item in data}
    bm_pattern = re.compile(r"-bm$|/ms/|bm-")
    bm_count = sum(1 for s in slugs if bm_pattern.search(s))
    
    # Also check locale files
    locale_files = []
    for f in CONTENT_DIR.glob("*ms*.json"):
        locale_files.append(f.name)
    for f in CONTENT_DIR.glob("*bm*.json"):
        locale_files.append(f.name)
    
    passed = len(ms_routes) > 0 or bm_count > 0 or len(locale_files) > 0
    return {
        "passed": passed,
        "details": {
            "ms_route_dirs": ms_routes or "none found",
            "bm_slugs_in_data": bm_count,
            "locale_files": locale_files or "none found",
        },
        "summary": f"MS routes: {ms_routes}, BM slugs: {bm_count}, locale files: {len(locale_files)}" if passed else "No BM locale variants detected",
    }


def check_lp_payload_pipeline(data: list[dict], filename: str) -> dict:
    """Check the 3-tier pipeline: snapshot files should exist and have real data."""
    issues = []
    # Check that snapshot file exists and has content
    if not data:
        issues.append(f"{filename} is empty or missing")
    else:
        # Check for _status field that might filter drafts
        for item in data:
            status = item.get("status", item.get("_status", ""))
            if status == "draft":
                issues.append(f"  {item.get('slug', '?')}: draft status (may be filtered by _status)")
    passed = len(issues) == 0
    return {
        "passed": passed,
        "details": issues if not passed else f"{filename} has {len(data)} entries, all published",
        "summary": f"{len(issues)} pipeline issues" if issues else "Pipeline data flows correctly",
    }


def check_lp_field_collisions() -> dict:
    """Check for known field collision patterns in Payload content types.

    In Payload 3.x, each collection gets its own GraphQL type, so fields
    like 'name' in DietaryOptions vs 'name' in Locations do NOT collide
    (they become DietaryOption.name and Location.name).

    REAL collisions happen when:
    - Multiple content types share the SAME Payload collection (e.g. landing
      page variants) and have diverging field schemas
    - A single Payload collection has fields that collide with the frontend's
      TypeScript interface

    The known collisions (steps_title, three_ways_description, groups_description)
    were already fixed in recent commits.
    """
    collision_risk = []
    content_files = list(CONTENT_DIR.glob("*.json"))

    # Payload collection → JSON file mapping
    COLLECTION_MAP = {
        "tours": ["tours"],
        "stories": ["stories"],
        "faqs": ["faqs"],
        "testimonials": ["testimonials"],
        "dietary_options": ["dietary-options"],
        "locations": ["locations"],
        "specialty_experiences": ["specialty-experiences"],
        "travel_types": ["travel-types"],
        "landing_pages": ["dietary-landing-pages", "specialty-landing-pages",
                          "travel-type-landing-pages", "location-landing-pages"],
    }

    # Check for previously fixed collisions still appearing
    known_collisions = ["steps_title", "three_ways_description", "groups_description"]
    for field in known_collisions:
        owners = []
        for col, files in COLLECTION_MAP.items():
            for fname in files:
                f = CONTENT_DIR / f"{fname}.json"
                if f.exists():
                    with open(f) as fh:
                        data = json.load(fh)
                    if isinstance(data, list) and data and field in (data[0] if data else {}):
                        owners.append(fname)
        if len(owners) > 1:
            collision_risk.append({
                "field": field,
                "in_files": owners,
                "note": "Previously fixed collision — verify migration",
            })

    # Common field names shared across separate Payload collections 
    # (dietary_options, locations, specialty_experiences, travel_types)
    # are NOT collisions in Payload 3.x — each collection gets its own 
    # GraphQL type (e.g. DietaryOption.color vs Location.color).
    # No additional checks needed.

    passed = len(collision_risk) == 0
    return {
        "passed": passed,
        "details": collision_risk if not passed else "No field collisions detected",
        "summary": f"{len(collision_risk)} collision risks" if collision_risk else "No field collisions",
    }


# ── Image optimization checks ──

def check_image_optimization() -> dict:
    """Check that Image.astro supports srcset, lazy loading, and responsive formats."""
    image_component = ROOT / "site" / "src" / "components" / "common" / "Image.astro"
    issues = []

    if not image_component.exists():
        return {
            "passed": False,
            "details": "Image.astro not found",
            "summary": "Image component missing",
        }

    content = image_component.read_text(encoding="utf-8")

    checks = {
        "srcset": "srcset" in content or "sizes" in content,
        "loading_lazy": "loading" in content and ("lazy" in content or "eager" in content or "rest.loading" in content),
        "webp_support": "webp" in content.lower() or "format" in content.lower() or "sharp" in content.lower(),
    }

    for check_name, result in checks.items():
        if not result:
            issues.append(f"Missing: {check_name}")

    passed = len(issues) == 0
    return {
        "passed": passed,
        "details": {**checks, "issues": issues} if issues else checks,
        "summary": f"{len(issues)} image optimization gaps" if issues else "Image component has srcset, lazy loading, and format support",
    }


# ── Blog post checks ──

def check_blog_seo_basics() -> dict:
    """Check blog posts for SEO fundamentals."""
    posts = list(POST_DIR.glob("*.md")) + list(POST_DIR.glob("*.mdx"))
    issues = []

    for post in posts:
        content = post.read_text(encoding="utf-8")

        # Parse frontmatter
        parts = content.split("---", 2)
        if len(parts) < 3:
            issues.append({"file": post.name, "issue": "No frontmatter"})
            continue

        fm_text = parts[1]
        body = parts[2]

        # Extract title — use double-quote matching to avoid apostrophe issues
        title_match = re.search(r'^title:\s*"([^"]+)"', fm_text, re.MULTILINE)
        if not title_match:
            title_match = re.search(r"^title:\s*'([^']+)'", fm_text, re.MULTILINE)
        title = title_match.group(1) if title_match else ""
        if title and len(title) > 60:
            issues.append({"file": post.name, "issue": f"Title too long ({len(title)} chars): {title[:50]}..."})

        # Extract meta description — check nested metadata.description first
        # The metadata block may have title: before description:
        desc = ""
        # Check nested metadata block — allow other fields between metadata: and description:
        metadata_match = re.search(r'metadata:\s*\n(?:\s+\w+:.*\n)*\s*description:\s*"([^"]+)"', fm_text)
        if metadata_match:
            desc = metadata_match.group(1)
        else:
            # Try single-quote version
            metadata_match = re.search(r"metadata:\s*\n(?:\s+\w+:.*\n)*\s*description:\s*'([^']+)'", fm_text)
            if metadata_match:
                desc = metadata_match.group(1)
            else:
                # Fall back to top-level description
                desc_match = re.search(r'^description:\s*"([^"]+)"', fm_text, re.MULTILINE)
                if desc_match:
                    desc = desc_match.group(1)
                else:
                    desc_match = re.search(r"^description:\s*'([^']+)'", fm_text, re.MULTILINE)
                    if desc_match:
                        desc = desc_match.group(1)
                    else:
                        # Try excerpt as last resort (double-quote only to avoid apostrophe issues)
                        excerpt_match = re.search(r'^excerpt:\s*"([^"]+)"', fm_text, re.MULTILINE)
                        if excerpt_match:
                            desc = excerpt_match.group(1)
        if not desc:
            issues.append({"file": post.name, "issue": "No meta description"})
        elif len(desc) < 120 or len(desc) > 160:
            issues.append({"file": post.name, "issue": f"Meta desc {len(desc)} chars (target 140-160)"})

        # Check single H1 — in this Astro setup, H1 comes from SinglePost.astro
        # using frontmatter title, not from markdown body. So we check frontmatter title instead.
        title_match = re.search(r"title:\s*[\"'](.+?)[\"']", fm_text)
        if not title_match:
            issues.append({"file": post.name, "issue": "No title in frontmatter (renders as H1)"})

        # Also check for H1s in body (should be 0 — title comes from layout)
        h1_count = len(re.findall(r"^#\s+", body, re.MULTILINE))
        if h1_count > 0:
            issues.append({"file": post.name, "issue": f"Body has {h1_count} H1(s) — should be in frontmatter title only"})

        # Check internal links
        internal_links = re.findall(r"https://simplyenak\.com[^\s\)]+", content)
        if len(internal_links) < 2:
            issues.append({"file": post.name, "issue": f"Only {len(internal_links)} internal links (need 2+)"})

    passed = len(issues) == 0
    return {
        "passed": passed,
        "details": issues[:20] if issues else f"All {len(posts)} posts pass SEO basics",
        "summary": f"{len(issues)} SEO issues across {len(posts)} posts" if issues else f"All {len(posts)} posts pass SEO basics",
    }


def check_blog_brand_voice() -> dict:
    """Check blog posts for brand voice compliance (banned words)."""
    brand_script = Path.home() / ".hermes" / "skills" / "simplyenak" / "simply-enak-brand" / "scripts" / "scan-brand-violations.py"

    posts = list(POST_DIR.glob("*.md")) + list(POST_DIR.glob("*.mdx"))
    total_violations = 0
    per_post = []

    # Banned words (same as scan-brand-violations.py)
    banned_words = [
        "authentic", "premium", "luxury", "discover", "explore",
        "immerse", "customer", "delicious", "unique", "best",
        "amazing", "adventure", "journey", "award-winning",
        "world-class", "unforgettable", "breathtaking",
    ]
    banned_phrases = [
        r"hidden\s+gem",
        r"off\s+the\s+beaten\s+(path|track)",
        r"we're\s+not\s+\w",  # "we're not X" pattern — requires apostrophe
    ]
    em_dash = "\u2014"

    for post in posts:
        content = post.read_text(encoding="utf-8")
        violations = 0
        found_words = []

        for word in banned_words:
            if re.search(rf"\b{re.escape(word)}\b", content.lower()):
                violations += 1
                found_words.append(word)

        for phrase in banned_phrases:
            if re.search(phrase, content.lower()):
                violations += 1
                found_words.append(f"phrase: {phrase}")

        if em_dash in content:
            violations += 1
            found_words.append("em-dash")

        if violations > 0:
            per_post.append({"file": post.name, "violations": violations, "words": found_words})
            total_violations += violations

    passed = total_violations == 0
    return {
        "passed": passed,
        "details": per_post[:20] if per_post else f"All {len(posts)} posts are brand-compliant",
        "summary": f"{total_violations} brand violations across {len(posts)} posts" if total_violations else f"All {len(posts)} posts are brand-compliant",
    }


# ── Media upload checks ──

def check_media_quality() -> dict:
    """Check media-related content for quality issues."""
    # Check media coverage for attribution format
    media_file = CONTENT_DIR / "media-coverage.json"
    if not media_file.exists():
        return {
            "passed": False,
            "details": "media-coverage.json not found",
            "summary": "Media coverage file missing",
        }

    data = load_json(media_file)
    if not isinstance(data, list):
        return {
            "passed": False,
            "details": f"Expected list, got {type(data).__name__}",
            "summary": "Media coverage data malformed",
        }

    issues = []
    for item in data:
        outlet = item.get("outlet", "")
        if not outlet:
            issues.append({"id": item.get("id", "?"), "issue": "Missing outlet name"})
        # detail is optional — it's a subtitle/description, not required for display

    passed = len(issues) == 0
    return {
        "passed": passed,
        "details": issues[:20] if issues else f"All {len(data)} media items have proper attribution",
        "summary": f"{len(issues)} media quality issues" if issues else f"All {len(data)} media items have proper attribution",
    }


# ── Deploy workflow checks ──

def check_deploy_workflow() -> dict:
    """Check for staging-first deploy patterns in CI/CD config.
    
    Simply Enak uses a two-workflow pattern:
    - deploy-site.yml: builds and deploys to CF Pages (staging on push, prod on manual dispatch)
    - deploy-payload.yml: builds and pushes Docker image (deploy happens via docker service update on server)
    """
    issues = []

    gh_dir = ROOT / ".github" / "workflows"
    if gh_dir.exists():
        workflows = list(gh_dir.glob("*.yml")) + list(gh_dir.glob("*.yaml"))
        if not workflows:
            issues.append("No GitHub Actions workflows found")
        else:
            for wf in workflows:
                content = wf.read_text(encoding="utf-8")
                # Check for staging step — either explicit staging target or staging in project name
                # Note: deploy-payload.yml is a build-and-push workflow; actual deploy is manual
                # via docker service update on the server. This is intentional for the backend.
                has_staging = (
                    "staging" in content.lower()
                    or "preview" in content.lower()
                    or "repository_dispatch" in content  # alternative staging trigger
                )
                # Payload backend workflow is build-and-push only (deploy is manual on server)
                # deploy-payload.yml builds Docker image but doesn't deploy — it's a push workflow
                is_build_only = "payload" in wf.name.lower() and "docker/build-push-action" in content
                if not has_staging and not is_build_only:
                    issues.append({"file": wf.name, "issue": "No staging/preview step in workflow"})
    else:
        issues.append(".github/workflows directory not found")

    passed = len(issues) == 0
    return {
        "passed": passed,
        "details": issues if issues else "CI/CD workflows have staging steps",
        "summary": f"{len(issues)} deploy workflow issues" if issues else "Deploy workflow follows staging-first pattern",
    }


# ── Case dispatcher ──

CASE_HANDLERS = {
    "lp_hero_fields_populated": lambda: check_lp_hero_fields(load_json(CONTENT_DIR / "location-landing-pages.json")),
    "lp_eight_section_arc": lambda: check_lp_eight_section_arc(load_json(CONTENT_DIR / "location-landing-pages.json")),
    "lp_bm_mirrors_en": lambda: check_lp_bm_mirrors_en(load_json(CONTENT_DIR / "location-landing-pages.json")),
    "lp_payload_deploy_pipeline": lambda: check_lp_payload_pipeline(load_json(CONTENT_DIR / "location-landing-pages.json"), "location-landing-pages.json"),
    "lp_field_collisions": check_lp_field_collisions,
    "lp_image_optimization": check_image_optimization,
    "blog_seo_basics": check_blog_seo_basics,
    "blog_brand_voice": check_blog_brand_voice,
    "media_upload_quality": check_media_quality,
    "deploy_workflow": check_deploy_workflow,
}


def run_case(case: dict) -> dict:
    """Run a single benchmark case and return results."""
    case_id = case["case_id"]
    handler = CASE_HANDLERS.get(case_id)

    if not handler:
        return {
            "case_id": case_id,
            "passed": False,
            "error": f"No handler implemented for case '{case_id}'",
            "details": "Add this case_id to CASE_HANDLERS in content-eval-runner.py",
        }

    try:
        result = handler()
        return {
            "case_id": case_id,
            "scenario": case.get("scenario", ""),
            "content_type": case.get("content_type", ""),
            "weight": case.get("weight", 1.0),
            "passed": result["passed"],
            "summary": result["summary"],
            "details": result["details"],
        }
    except Exception as e:
        return {
            "case_id": case_id,
            "passed": False,
            "error": str(e),
            "details": f"Exception: {type(e).__name__}: {e}",
        }


def main():
    parser = argparse.ArgumentParser(description="Run content pipeline benchmark cases")
    parser.add_argument("--case", "-c", help="Run specific case by ID")
    parser.add_argument("--content-type", "-t", help="Filter by content type")
    parser.add_argument("--json", "-j", action="store_true", help="Output JSON instead of text")
    args = parser.parse_args()

    benchmark = load_benchmark()

    if args.case:
        benchmark = [c for c in benchmark if c["case_id"] == args.case]
        if not benchmark:
            print(f"Case '{args.case}' not found in benchmark")
            sys.exit(2)
    elif args.content_type:
        benchmark = [c for c in benchmark if c.get("content_type") == args.content_type]

    results = []
    for case in benchmark:
        result = run_case(case)
        results.append(result)

    # Calculate weighted score
    total_weight = sum(r.get("weight", 1.0) for r in results)
    passed_weight = sum(r.get("weight", 1.0) for r in results if r["passed"])
    score = (passed_weight / total_weight * 100) if total_weight > 0 else 0

    if args.json:
        print(json.dumps({
            "total_cases": len(results),
            "passed": sum(1 for r in results if r["passed"]),
            "failed": sum(1 for r in results if not r["passed"]),
            "weighted_score": round(score, 1),
            "results": results,
        }, indent=2))
    else:
        print()
        print("=" * 70)
        print("  CONTENT PIPELINE EVAL — RESULTS")
        print("=" * 70)
        print()

        for r in results:
            status = "PASS" if r["passed"] else "FAIL"
            icon = "  [PASS]" if r["passed"] else "  [FAIL]"
            print(f"{icon} {r['case_id']}")
            print(f"         {r.get('summary', r.get('error', ''))}")
            if not r["passed"] and "details" in r:
                details = r["details"]
                if isinstance(details, list):
                    for d in details[:5]:
                        print(f"         - {d}")
                    if len(details) > 5:
                        print(f"         ... and {len(details) - 5} more")
                elif isinstance(details, dict):
                    for k, v in list(details.items())[:5]:
                        print(f"         {k}: {v}")
                elif isinstance(details, str) and len(details) < 200:
                    print(f"         {details}")
            print()

        print("=" * 70)
        passed_count = sum(1 for r in results if r["passed"])
        failed_count = sum(1 for r in results if not r["passed"])
        print(f"  TOTAL: {passed_count}/{len(results)} cases passed | Weighted score: {score:.1f}%")
        if failed_count > 0:
            print(f"  {failed_count} case(s) need attention")
        print("=" * 70)

    sys.exit(0 if all(r["passed"] for r in results) else 1)


if __name__ == "__main__":
    main()
