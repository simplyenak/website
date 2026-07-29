#!/usr/bin/env python3
"""
SEO Ranking Phase Pipeline for Simply Enak
=============================================
Automated ranking-based phased system with colony page architecture.

Analyzes the Simply Enak sitemap, classifies each page by type and rank tier,
and outputs actionable per-page recommendations based on its ranking phase.

Usage:
    python3 scripts/seo-ranking-pipeline.py [--sitemap URL] [--output-dir .] [--verbose]
    python3 scripts/seo-ranking-pipeline.py --cron              # Run with defaults for cron

Designed to run daily via cron. Real GSC data can be plugged in via --rank-data.
"""

import argparse
import csv
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

# ──────────────────────────────────────────────────────────────────────
# Configuration
# ──────────────────────────────────────────────────────────────────────
DEFAULT_SITEMAP = "https://simplyenak.com/sitemap-en.xml"
PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = PROJECT_ROOT / ".hermes" / "seo-reports"

# ── Colony page URL patterns ─────────────────────────────────────────
COLONY_PATTERNS = {
    "location": "/tours/locations/",
    "dietary": "/tours/dietary/",
    "specialty": "/tours/specialty/",
    "segment": "/tours/segments/",
}

# ── Page type classification ─────────────────────────────────────────
PAGE_TYPES = {
    "homepage":    {"weight": 1.0, "priority": "high"},
    "tour":        {"weight": 0.9, "priority": "high"},     # Individual bookable tour
    "colony":      {"weight": 0.8, "priority": "high"},     # Landing/hub page
    "blog":        {"weight": 0.7, "priority": "medium"},   # Blog post / story
    "supporting":  {"weight": 0.5, "priority": "medium"},   # About, contact, FAQ, etc.
    "utility":     {"weight": 0.3, "priority": "low"},      # Thank-you, legal, etc.
}

# ── Ranking phase thresholds ─────────────────────────────────────────
#   Phase 1: Position 50+ or unranked  → Foundation SEO
#   Phase 2: Position 20-50             → Content enrichment
#   Phase 3: Position 10-20             → Authority building
#   Phase 4: Position 5-10              → Conversion optimization
#   Phase 5: Position 1-5               → Maintenance & defense
#
PHASES = [
    {"id": 1, "name": "Foundation",     "range": (51, 999), "label": "Position 50+ / Unranked"},
    {"id": 2, "name": "Enrichment",     "range": (21, 50),  "label": "Position 20–50"},
    {"id": 3, "name": "Authority",      "range": (11, 20),  "label": "Position 10–20"},
    {"id": 4, "name": "Conversion",     "range": (6, 10),   "label": "Position 5–10"},
    {"id": 5, "name": "Maintenance",    "range": (1, 5),    "label": "Position 1–5"},
]

PHASE_ACTIONS = {
    1: {
        "title": "Foundation SEO — Setup for Rankability",
        "actions": [
            "Set unique, keyword-rich title tags (<60 chars)",
            "Write compelling meta descriptions (150–160 chars)",
            "Add proper heading hierarchy (H1 → H2 → H3)",
            "Ensure page is indexable (no noindex, no canonical issues)",
            "Add Open Graph and Twitter card meta tags",
            "Verify Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)",
            "Add structured data (Product, FAQ, BreadcrumbList, LocalBusiness)",
            "Submit URL to Google Search Console for indexing",
            "Ensure mobile-friendly rendering",
            "Create or update XML sitemap entry",
        ],
    },
    2: {
        "title": "Content Enrichment — Deepening Relevance",
        "actions": [
            "Expand body content to 1500–2500 words targeting secondary keywords",
            "Add FAQ section with schema markup (target PAA boxes)",
            "Add related internal links (3–5 contextual links to tours/pages)",
            "Improve readability: shorter paragraphs, bullet points, tables",
            "Add multimedia: images with alt text, optional video",
            "Add 'People also ask' targeted subheadings",
            "Generate backlinks from related blog posts / stories",
            "Update last-modified date to signal freshness",
            "Add table of contents for long-form pages",
            "Include external citations / authoritative sources",
        ],
    },
    3: {
        "title": "Authority Building — Climbing the SERP",
        "actions": [
            "Acquire contextual backlinks from travel bloggers / food sites",
            "Submit to relevant directories (TripAdvisor, Google Business Profile)",
            "Share on social media with structured hashtags",
            "Earn mentions through HARO / guest posting in food-travel niche",
            "Build links from colony pages → this commercial page",
            "Get listed on partner / vendor websites with backlinks",
            "Encourage Google reviews (review schema already in place)",
            "Create 'best of' listicles that cite this page",
            "Participate in relevant subreddits / forums (r/malaysia, r/travel)",
            "Update content quarterly to maintain topical authority",
        ],
    },
    4: {
        "title": "Conversion Optimization — Turning Traffic into Bookings",
        "actions": [
            "Add prominent booking CTA above the fold",
            "Add social proof: testimonials, review scores, trust badges",
            "A/B test title tags for CTR improvement",
            "Add urgency signals (limited availability, 'booked X times today')",
            "Optimize for featured snippets (answer common questions concisely)",
            "Add comparison table vs competitors showing unique value",
            "Implement exit-intent popup with discount or lead magnet",
            "Reduce form friction: shorten booking flow, add WhatsApp button",
            "Add FAQ schema to occupy more SERP real estate",
            "Monitor click-through-rate and adjust meta descriptions",
        ],
    },
    5: {
        "title": "Maintenance — Defending Top Positions",
        "actions": [
            "Monitor position daily via GSC / rank tracker",
            "Refresh content quarterly with new information / data",
            "Watch competitor pages for new content or features",
            "Respond to new reviews and maintain Google Business Profile",
            "Continue building new backlinks at sustaining pace",
            "Monitor and fix any technical SEO regressions",
            "Update internal links as new content is published",
            "Track branded vs non-branded traffic split",
            "Watch for algorithm updates and adjust if needed",
            "Test new CTA variations to sustain conversion rate",
        ],
    },
}

# ── Page-level rank potential scoring (no GSC data mode) ────────────
RANK_SIGNAL_KEYWORDS = {
    "tour": {
        "high":    ["kuala lumpur", "penang", "food tour", "foodie"],
        "medium":  ["street food", "market", "heritage", "night food", "vegetarian", "halal"],
        "low":     ["private", "corporate", "wedding", "chef"],
    },
    "colony": {
        "high":    ["best", "top", "guide", "where to eat"],
        "medium":  ["tours", "food", "things to do"],
        "low":     [],
    },
    "blog": {
        "high":    ["guide", "what to eat", "best", "where to", "how to"],
        "medium":  ["first time", "visitor", "travel", "food"],
        "low":     ["what is", "who is", "history"],
    },
}


# ──────────────────────────────────────────────────────────────────────
# Pipeline Logic
# ──────────────────────────────────────────────────────────────────────


def fetch_sitemap(url: str) -> list[dict]:
    """Fetch and parse sitemap XML. Returns list of {loc, lastmod, priority}."""
    import urllib.request

    print(f"  Fetching sitemap: {url}")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "SimplyEnak-SEO-Pipeline/1.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            raw = resp.read()
    except Exception as e:
        print(f"  ⚠ Failed to fetch {url}: {e}")
        print("  → Falling back to local sitemap.xml")
        local_path = PROJECT_ROOT / "public" / "sitemap.xml"
        if local_path.exists():
            raw = local_path.read_bytes()
            print(f"  ✓ Loaded local sitemap from {local_path}")
        else:
            print(f"  ✗ No local sitemap found at {local_path}")
            return []

    tree = ET.fromstring(raw)
    ns = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = []
    for url_elem in tree.findall("ns:url", ns):
        loc = url_elem.findtext("ns:loc", "", ns)
        lastmod = url_elem.findtext("ns:lastmod", "", ns)
        priority = float(url_elem.findtext("ns:priority", "0.5", ns) or "0.5")
        if loc:
            urls.append({"loc": loc, "lastmod": lastmod, "priority": priority})
    print(f"  Found {len(urls)} URLs in sitemap")
    return urls


def classify_page(url: str, priority: float, locale: str | None = None) -> dict:
    """Classify a URL into page type and metadata."""
    path = url.replace("https://simplyenak.com", "").rstrip("/") or "/"

    # Language prefix detection
    lang_prefix_match = re.match(r"^/(ms|zh|de|fr|es|pt|ja|ru|nl)", path)
    lang_prefix = lang_prefix_match.group(1) if lang_prefix_match else "en"

    # Filter by locale if specified
    if locale and locale != "all" and lang_prefix != locale:
        return {"type": "filtered_out", "subtype": "", "path": path, "locale": lang_prefix}

    # Strip language prefix for classification
    lang_prefixes = re.compile(r"^/(ms|zh|de|fr|es|pt|ja|ru|nl)")
    path_clean = re.sub(lang_prefixes, "", path) if lang_prefix != "en" else path
    if path_clean == "":
        path_clean = "/"

    # Determine type
    if path_clean == "/" or path_clean == "":
        ptype = "homepage"
        subtype = "homepage"
    elif re.match(r"^/tours/[a-z0-9\-]+$", path_clean) and not any(
        p in path_clean for p in ["/locations/", "/dietary/", "/specialty/", "/segments/"]
    ):
        ptype = "tour"
        slug = path_clean.replace("/tours/", "")
        subtype = f"tour:{slug}"
    elif "/tours/private-tours/" in path_clean and path_clean != "/tours/private-tours":
        ptype = "tour"
        slug = path_clean.rsplit("/", 1)[-1]
        subtype = f"tour:{slug}"
    elif "/tours/locations/" in path_clean:
        ptype = "colony"
        subtype = f"location:{path_clean.split('/')[-1]}"
    elif "/tours/dietary/" in path_clean:
        ptype = "colony"
        subtype = f"dietary:{path_clean.split('/')[-1]}"
    elif "/tours/specialty/" in path_clean:
        ptype = "colony"
        subtype = f"specialty:{path_clean.split('/')[-1]}"
    elif "/tours/segments/" in path_clean:
        ptype = "colony"
        subtype = f"segment:{path_clean.split('/')[-1]}"
    elif path_clean.startswith("/stories/") and path_clean != "/stories":
        ptype = "blog"
        subtype = f"blog:{path_clean.replace('/stories/', '')}"
    elif path_clean in ("/stories", "/stories/page/1"):
        ptype = "supporting"
        subtype = "blog-index"
    elif path_clean in ("/about", "/contact", "/faq", "/directions", "/how-it-works",
                         "/how-to-prepare", "/tour-quiz", "/testimonials", "/track-record",
                         "/tours", "/custom-tours"):
        ptype = "supporting"
        subtype = f"page:{path_clean.strip('/')}"
    elif path_clean.startswith("/tours/") and path_clean not in ("/tours",):
        # Other tour sub-pages (private, tailored, corporate, why-simply-enak)
        ptype = "supporting"
        subtype = f"tour-page:{path_clean.replace('/tours/', '')}"
    elif path_clean in ("/thank-you", "/thank-you-contact", "/thank-you-booking",
                         "/thank-you-booking-kuala-lumpur", "/thank-you-booking-penang",
                         "/thank-you-inquiry", "/thank-you-registration",
                         "/privacy-policy", "/privacy", "/terms-conditions", "/terms"):
        ptype = "utility"
        subtype = f"utility:{path_clean.strip('/')}"
    else:
        ptype = "supporting"
        subtype = f"other:{path_clean.strip('/')}"

    return {"type": ptype, "subtype": subtype, "path": path}


def get_gsc_token():
    """Get GSC access token from service account key."""
    cred_path = Path.home() / ".google" / "credentials" / "gsc-key.json"
    if not cred_path.exists():
        return None
    try:
        from google.oauth2 import service_account
        from google.auth.transport.requests import Request
        creds = service_account.Credentials.from_service_account_file(
            str(cred_path),
            scopes=["https://www.googleapis.com/auth/webmasters.readonly"]
        )
        creds.refresh(Request())
        return creds.token
    except Exception:
        return None


def fetch_gsc_positions(token: str, days: int = 28) -> dict[str, float]:
    """
    Fetch real Google Search Console position data for all pages.
    Returns a dict mapping URL paths to average position.
    """
    import urllib.parse
    enc_site = urllib.parse.quote("sc-domain:simplyenak.com", safe="")
    end_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    start_date = (datetime.now(timezone.utc) - __import__("datetime").timedelta(days=days)).strftime("%Y-%m-%d")

    positions = {}
    url = f"https://www.googleapis.com/webmasters/v3/sites/{enc_site}/searchAnalytics/query"
    body = json.dumps({
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": ["page"],
        "rowLimit": 25000,
        "dataState": "all",
    }).encode()

    req = __import__("urllib.request").request.Request(url, data=body)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")

def fetch_gsc_positions(token: str, days: int = 28) -> dict[str, float]:
    """
    Fetch real Google Search Console position data for all pages.
    Returns a dict mapping normalized URL paths to average position.
    """
    import urllib.parse
    enc_site = urllib.parse.quote("sc-domain:simplyenak.com", safe="")
    end_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    start_date = (datetime.now(timezone.utc) - __import__("datetime").timedelta(days=days)).strftime("%Y-%m-%d")

    positions = {}
    url = f"https://www.googleapis.com/webmasters/v3/sites/{enc_site}/searchAnalytics/query"
    body = json.dumps({
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": ["page"],
        "rowLimit": 25000,
        "dataState": "all",
    }).encode()

    req = __import__("urllib.request").request.Request(url, data=body)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")

    try:
        resp = __import__("urllib.request").request.urlopen(req, timeout=30)
        data = json.loads(resp.read())
        for row in data.get("rows", []):
            page = row.get("keys", [""])[0] if row.get("keys") else ""
            pos = row.get("position", 999)
            if page:
                # Normalize: ensure full URL with trailing slash for consistent lookup
                if page.startswith("/"):
                    page = "https://simplyenak.com" + page
                # Store both with and without trailing slash for maximum compatibility
                positions[page] = pos
                positions[page.rstrip("/") + "/"] = pos
                positions[page.rstrip("/")] = pos
    except Exception as e:
        print(f"  ⚠ GSC API error: {e}")

    return positions


def estimate_rank_position(page_info: dict, url: str, gsc_positions: dict[str, float] | None = None) -> int | None:
    """
    Return real GSC position if available, otherwise estimate from signals.
    """
    # Check if we have real GSC data for this path
    if gsc_positions and url in gsc_positions:
        return int(gsc_positions[url])

    # Fall back to estimation
    ptype = page_info["type"]
    priority = page_info.get("priority", 0.5)
    path = page_info["path"].lower()

    # Start with priority as base signal (0.0–1.0 mapped to rank 1–100)
    base_rank = max(1, min(100, int(100 - (priority * 90))))

    # Adjust based on page type (commercial intents are harder to rank)
    type_penalties = {
        "tour": 10,       # High competition for commercial keywords
        "colony": 5,      # Medium competition for informational-hybrid pages
        "blog": 0,        # Lower competition for informational content
        "homepage": -5,   # Brand authority helps homepage
        "supporting": 15,
        "utility": 40,
    }

    adjusted = base_rank + type_penalties.get(ptype, 0)

    # Colony pages typically rank better for longtail
    if ptype == "colony" and any(kw in path for kw in ["guide", "where", "best", "what"]):
        adjusted -= 8

    # Brand pages rank better
    brand_boost = {
        "/": 3, "/about": 8, "/contact": 6, "/tours": 5,
    }
    if path in brand_boost:
        adjusted = brand_boost[path]

    return max(1, min(100, adjusted))


def determine_phase(rank: int | None) -> int:
    """Determine which phase a page is in based on rank position."""
    if rank is None:
        return 1  # Unknown = foundation
    for phase in PHASES:
        lo, hi = phase["range"]
        if lo <= rank <= hi:
            return phase["id"]
    return 1


def get_actions_for_phase(phase_id: int) -> list[str]:
    """Get the action checklist for a given phase."""
    phase_info = PHASE_ACTIONS.get(phase_id, PHASE_ACTIONS[1])
    return phase_info["actions"]


def get_phase_label(phase_id: int) -> str:
    for phase in PHASES:
        if phase["id"] == phase_id:
            return f"{phase['name']} ({phase['label']})"
    return "Foundation"


def crawl_site_structure() -> dict:
    """
    Build a site structure map from local data files.
    Maps colony pages → their linked commercial tours.
    """
    tours_path = PROJECT_ROOT / "site" / "src" / "data" / "tours.js"
    tours = []
    try:
        with open(tours_path) as f:
            content = f.read()
        # Extract tour slugs via simple regex
        slugs = re.findall(r"slug:\s*'([^']+)'", content)
        names = re.findall(r"name:\s*'([^']+)'", content)
        locations = re.findall(r"locations:\s*\[([^\]]+)\]", content)
        tours = [{"slug": s, "name": n} for s, n in zip(slugs, names)]
    except Exception as e:
        print(f"  ⚠ Could not parse tours.js: {e}")

    return {
        "tours": tours,
        "colony_types": list(COLONY_PATTERNS.keys()),
    }


# ──────────────────────────────────────────────────────────────────────
# Report Generation
# ──────────────────────────────────────────────────────────────────────


def generate_csv_report(pages: list[dict], output_path: Path):
    """Generate a CSV report with per-page phase and actions."""
    fieldnames = [
        "url", "page_type", "subtype", "priority",
        "gsc_position", "estimated_rank", "phase_id", "phase_label",
        "top_action", "actions"
    ]
    with open(output_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for p in sorted(pages, key=lambda x: x.get("gsc_position") or x.get("estimated_rank") or 999):
            actions = "\n".join(p["actions"][:5])
            writer.writerow({
                "url": p["url"],
                "page_type": p["page_type"],
                "subtype": p["subtype"],
                "priority": p.get("priority", ""),
                "gsc_position": p.get("gsc_position", ""),
                "estimated_rank": p.get("estimated_rank", ""),
                "phase_id": p["phase_id"],
                "phase_label": p["phase_label"],
                "top_action": p["actions"][0] if p["actions"] else "",
                "actions": actions,
            })
    print(f"  ✓ CSV report: {output_path}")


def generate_markdown_report(pages: list[dict], output_path: Path):
    """Generate a human-readable markdown report grouped by phase."""
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    grouped = defaultdict(list)
    for p in pages:
        grouped[p["phase_id"]].append(p)

    lines = []
    lines.append(f"# SEO Ranking Phase Report — Simply Enak")
    lines.append(f"**Generated:** {timestamp}\n")
    lines.append(f"**Total pages analyzed:** {len(pages)}\n")

    # Summary
    lines.append("## Summary by Phase\n")
    lines.append("| Phase | Pages | Description |")
    lines.append("|-------|-------|-------------|")
    for phase in PHASES:
        count = len(grouped.get(phase["id"], []))
        lines.append(f"| {phase['name']} | {count} | {phase['label']} |")
    lines.append("")

    # Per-phase details
    for phase in PHASES:
        pid = phase["id"]
        phase_pages = grouped.get(pid, [])
        if not phase_pages:
            continue

        phase_info = PHASE_ACTIONS[pid]
        lines.append(f"\n---\n")
        lines.append(f"## Phase {pid}: {phase_info['title']}")
        lines.append(f"**Pages in this phase:** {len(phase_pages)}\n")

        for p in sorted(phase_pages, key=lambda x: x.get("gsc_position") or x.get("estimated_rank") or 999):
            gsc = f"**GSC pos {p['gsc_position']:.0f}**" if p.get("gsc_position") else ""
            est = f"(est #{p['estimated_rank']})" if p.get("estimated_rank") else ""
            rank_str = gsc or est or "Unranked"
            lines.append(f"### [{p['page_type']}] {p['url']} _(~{rank_str})_")
            if gsc and est:
                lines.append(f"  ↳ GSC: pos {p['gsc_position']:.0f} | estimated was #{p['estimated_rank']}")
            lines.append(f"Type: `{p['subtype']}`\n")
            lines.append("**Priority Actions:**")
            for action in p["actions"][:5]:
                lines.append(f"- [ ] {action}")
            lines.append("")

    with open(output_path, "w") as f:
        f.write("\n".join(lines))
    print(f"  ✓ Markdown report: {output_path}")


def generate_json_report(pages: list[dict], output_path: Path):
    """Generate a JSON report for programmatic consumption."""
    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_pages": len(pages),
        "summary": {},
        "phases": {},
        "pages": pages,
    }

    for phase in PHASES:
        pid = phase["id"]
        phase_pages = [p for p in pages if p["phase_id"] == pid]
        report["summary"][phase["name"]] = len(phase_pages)
        report["phases"][str(pid)] = {
            "label": phase["label"],
            "action_plan": PHASE_ACTIONS[pid]["title"],
            "page_count": len(phase_pages),
            "urls": [p["url"] for p in phase_pages],
        }

    with open(output_path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"  ✓ JSON report: {output_path}")


# ──────────────────────────────────────────────────────────────────────
# Backlink Map Generation (Colony → Tour linking)
# ──────────────────────────────────────────────────────────────────────


def generate_colony_link_map(pages: list[dict]) -> dict:
    """
    Map which colony pages should link to which commercial tour pages.
    Uses substring matching: colony for 'kuala-lumpur' links to KL tours, etc.
    """
    tours = [p for p in pages if p["page_type"] == "tour"]
    colonies = [p for p in pages if p["page_type"] == "colony"]

    link_map = {}
    for c in colonies:
        path = c["path"]
        matches = []
        for t in tours:
            t_path = t["path"]
            score = 0
            # Location match
            for loc in ["kuala-lumpur", "penang", "melaka", "ipoh", "klang"]:
                if loc in path and loc in t_path:
                    score += 3
            # Dietary match
            for diet in ["vegetarian", "vegan", "halal", "gluten-free", "jain"]:
                if diet in path and diet in t_path:
                    score += 2
            # Specialty match
            for spec in ["street-food", "night-food", "heritage", "market"]:
                if spec in path and spec in t.get("subtype", ""):
                    score += 2
            if score > 0:
                matches.append({"url": t["url"], "score": score, "reason": f"contextual relevance (score {score})"})

        matches.sort(key=lambda x: -x["score"])
        if matches:
            link_map[c["url"]] = matches[:5]  # Top 5

    return link_map


def render_link_map_report(link_map: dict, output_path: Path):
    """Write the colony→tour link map to a markdown file."""
    lines = []
    lines.append("# Colony Page → Tour Linking Map\n")
    lines.append("Recommended internal links from colony (hub) pages to commercial tour pages.\n")
    lines.append("| Colony Page | → | Tour Page | Score |")
    lines.append("|-------------|---|-----------|-------|")

    for colony_url, targets in sorted(link_map.items()):
        for i, t in enumerate(targets):
            if i == 0:
                lines.append(f"| `{colony_url}` | → | `{t['url']}` | {t['score']} |")
            else:
                lines.append(f"| | → | `{t['url']}` | {t['score']} |")

    lines.append("")
    lines.append("### Implementation Notes")
    lines.append("- Add contextual links in body text (not just sidebar/footer)")
    lines.append("- Use descriptive anchor text matching the tour name")
    lines.append("- Aim for 3–5 outbound links per colony page")
    lines.append("- Link from colony hero section and at least one content section")

    with open(output_path, "w") as f:
        f.write("\n".join(lines))
    print(f"  ✓ Link map: {output_path}")


# ──────────────────────────────────────────────────────────────────────
# Main Pipeline
# ──────────────────────────────────────────────────────────────────────


def run_pipeline(sitemap_url: str | None = None, output_dir: str | None = None,
                 verbose: bool = False, locale: str = "en") -> dict:
    """Execute the full SEO ranking phase pipeline."""
    sitemap_url = sitemap_url or DEFAULT_SITEMAP
    output_dir = output_dir or str(OUTPUT_DIR)
    os.makedirs(output_dir, exist_ok=True)

    print("=" * 60)
    print("  Simply Enak — SEO Ranking Phase Pipeline")
    print("=" * 60)

    # Step 1: Fetch sitemap
    print("\n[Step 1] Fetching sitemap...")
    urls = fetch_sitemap(sitemap_url)
    if not urls:
        print("  ✗ No URLs found. Exiting.")
        return {"error": "No URLs found"}

    # Step 2: Classify pages (filtering to requested locale)
    print(f"\n[Step 2] Classifying {len(urls)} pages (locale: {locale})...")
    classified = []
    for entry in urls:
        info = classify_page(entry["loc"], entry.get("priority", 0.5), locale=locale)
        if info["type"] == "filtered_out":
            if verbose:
                print(f"  Filtered out (wrong locale): {entry['loc']}")
            continue
        info["url"] = entry["loc"]
        info["priority"] = entry.get("priority", 0.5)
        info["lastmod"] = entry.get("lastmod", "")
        classified.append(info)

    # Step 3: Fetch GSC data and assign phases
    print(f"\n[Step 3] Fetching GSC data and assigning phases...")

    # Try to get real positions from GSC API first
    gsc_positions = None
    gsc_token = get_gsc_token()
    if gsc_token:
        print(f"  → Fetching real positions from GSC API...")
        gsc_positions = fetch_gsc_positions(gsc_token)
        print(f"  → Found GSC position data for {len(gsc_positions)} pages")
        print(f"  (Other pages will use estimated positions until they rank)")
    else:
        print(f"  ⚠ GSC key not found — using estimated positions only")
        print(f"  → Credentials: ~/.google/credentials/gsc-key.json")

    enriched = []
    for info in classified:
        rank = estimate_rank_position(info, info["url"], gsc_positions)
        phase_id = determine_phase(rank)
        actions = get_actions_for_phase(phase_id)
        rank_str = str(rank) if rank else "Unranked"
        enriched.append({
            "url": info["url"],
            "page_type": info["type"],
            "subtype": info["subtype"],
            "path": info["path"],
            "priority": info["priority"],
            "lastmod": info["lastmod"],
            "estimated_rank": rank if gsc_positions is None or info["url"] not in gsc_positions else None,
            "gsc_position": round(gsc_positions[info["url"]], 1) if gsc_positions and info["url"] in gsc_positions else None,
            "phase_id": phase_id,
            "phase_label": get_phase_label(phase_id),
            "actions": actions,
        })

    # Step 4: Generate reports
    print(f"\n[Step 4] Generating reports...")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    csv_path = Path(output_dir) / f"seo-ranking-pipeline_{timestamp}.csv"
    generate_csv_report(enriched, csv_path)

    md_path = Path(output_dir) / f"seo-ranking-pipeline_{timestamp}.md"
    generate_markdown_report(enriched, md_path)

    json_path = Path(output_dir) / f"seo-ranking-pipeline_{timestamp}.json"
    generate_json_report(enriched, json_path)

    # Step 5: Generate colony link map
    print(f"\n[Step 5] Generating colony→tour link map...")
    link_map = generate_colony_link_map(enriched)
    link_path = Path(output_dir) / f"colony-link-map_{timestamp}.md"
    render_link_map_report(link_map, link_path)

    # Summary
    print("\n" + "=" * 60)
    print("  Pipeline Complete — Summary")
    print("=" * 60)
    phase_counts = defaultdict(int)
    for p in enriched:
        phase_counts[p["phase_id"]] += 1
    for phase in PHASES:
        count = phase_counts.get(phase["id"], 0)
        print(f"  Phase {phase['id']} ({phase['name']}): {count} pages")
    print(f"\n  Reports written to: {output_dir}/")
    print(f"  Run 'hermes cron add seo-ranking-pipeline' to automate")

    return {
        "total_pages": len(enriched),
        "phase_counts": dict(phase_counts),
        "reports": {
            "csv": str(csv_path),
            "markdown": str(md_path),
            "json": str(json_path),
            "link_map": str(link_path),
        },
    }


# ──────────────────────────────────────────────────────────────────────
# CLI Entry Point
# ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="SEO Ranking Phase Pipeline for Simply Enak"
    )
    parser.add_argument("--sitemap", default=DEFAULT_SITEMAP,
                        help=f"Sitemap URL (default: {DEFAULT_SITEMAP})")
    parser.add_argument("--output-dir", default=None,
                        help="Output directory for reports")
    parser.add_argument("--verbose", "-v", action="store_true",
                        help="Verbose output")
    parser.add_argument("--cron", action="store_true",
                        help="Run with cron defaults (quiet, to ~/.hermes/seo-reports/)")
    parser.add_argument("--rank-data", default=None,
                        help="CSV with real rank data: url,position (optional, replaces estimation)")
    parser.add_argument("--locale", default="en",
                        help="Language filter: en, ms, zh, de, fr, es, pt, ja, ru, nl, or 'all' (default: en)")
    args = parser.parse_args()

    if args.cron:
        cron_output = str(PROJECT_ROOT / ".hermes" / "seo-reports" / "cron")
        os.makedirs(cron_output, exist_ok=True)
        args.output_dir = cron_output
        args.verbose = False

    run_pipeline(
        sitemap_url=args.sitemap,
        output_dir=args.output_dir,
        verbose=args.verbose,
        locale=args.locale,
    )


if __name__ == "__main__":
    main()
