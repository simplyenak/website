#!/usr/bin/env python3
"""Striking Distance → Colony Bridge

Reads the JSON output from gsc-striking-distance.py (--colony-json flag)
and auto-registers top candidates as new colony pages in colony-tracker.json.

Usage:
  # First run the scanner with colony output:
  python3 scripts/seo-automation/gsc-striking-distance.py --limit 20 --colony-json

  # Then register top candidates as colony pages:
  python3 scripts/striking-to-colony.py --max 10

  # Or specify a custom JSON file:
  python3 scripts/striking-to-colony.py --input .hermes/tmp/striking-distance-colonies.json --max 5
"""
import json
import os
import re
import sys
import argparse
from pathlib import Path
from datetime import datetime

REPO_ROOT = Path("/var/home/maarten/website-optimization")
TRACKER_FILE = REPO_ROOT / "colony-tracker.json"
DEFAULT_INPUT = REPO_ROOT / ".hermes" / "tmp" / "striking-distance-colonies.json"

# ── Strategic tour targets (from .hermes/plans/tour-strategy.md) ──
# The final page in every colony chain should link toward one of these.
# Pillar 2 (multi-day/private) is the default; Pillar 3 (corporate) for biz queries.
STRATEGIC_TOURS = {
    "private-tours": {
        "url": "/tours/private-tours/",
        "title": "Private Multi-Day Food Tours",
        "anchor": "private multi-day food tour",
        "pillar": 2,
        "description": "Multi-day group experiences and packages",
    },
    "tailored-tours": {
        "url": "/tours/tailored-tours/",
        "title": "Tailored Food Experiences",
        "anchor": "custom food tour experience",
        "pillar": 2,
        "description": "Bespoke multi-day itineraries with sustainability & social impact",
    },
    "corporate-groups": {
        "url": "/tours/corporate-groups/",
        "title": "Corporate Food Experiences",
        "anchor": "corporate food experience",
        "pillar": 3,
        "description": "B2B teambuilding, client entertainment, incentive trips",
    },
    # New multi-day package pages (Pillar 2 money pages)
    "ultimate-malaysia-food-experience": {
        "url": "/tours/packages/ultimate-malaysia-food-experience/",
        "title": "Ultimate Malaysia Food Experience",
        "anchor": "3-day KL and Penang food tour package",
        "pillar": 2,
        "description": "KL + Penang combo, 3-day multi-day package, from RM2,500",
    },
    "kuala-lumpur-food-experience": {
        "url": "/tours/packages/kuala-lumpur-food-experience/",
        "title": "Kuala Lumpur Food Experience",
        "anchor": "4-day Kuala Lumpur food tour package",
        "pillar": 2,
        "description": "KL deep dive, 4-day multi-day package, from RM3,500",
    },
    "penang-food-experience": {
        "url": "/tours/packages/penang-food-experience/",
        "title": "Penang Food Experience",
        "anchor": "4-day Penang food tour package",
        "pillar": 2,
        "description": "Penang deep dive, 4-day multi-day package, from RM3,000",
    },
}

def get_strategic_tour(category: str) -> dict:
    """Pick the right strategic tour target based on the colony category.

    - corporate/business queries → corporate-groups
    - sustainability/social-impact queries → tailored-tours
    - penang-specific queries → penang-food-experience
    - kuala-lumpur-specific queries → kuala-lumpur-food-experience
    - general food/travel queries → ultimate-malaysia-food-experience (the combo)
    - everything else → private-tours (fallback)
    """
    cat_lower = category.lower()
    if any(w in cat_lower for w in ["corporate", "business", "b2b", "team"]):
        return STRATEGIC_TOURS["corporate-groups"]
    if any(w in cat_lower for w in ["sustainable", "social", "impact", "custom", "eco"]):
        return STRATEGIC_TOURS["tailored-tours"]
    if any(w in cat_lower for w in ["penang", "george town"]):
        return STRATEGIC_TOURS["penang-food-experience"]
    if any(w in cat_lower for w in ["kuala lumpur", "kl", "chow kit", "brickfields"]):
        return STRATEGIC_TOURS["kuala-lumpur-food-experience"]
    # Default to the flagship combo package
    return STRATEGIC_TOURS["ultimate-malaysia-food-experience"]

# ── Colony name normalization ──

def normalize_colony(name):
    """Normalize colony name to snake/kebab case."""
    name = name.lower().strip()
    name = re.sub(r'[^a-z0-9-]', '-', name)
    name = re.sub(r'-+', '-', name)
    return name.strip('-')

def parse_args():
    p = argparse.ArgumentParser(description='Striking Distance → Colony Bridge')
    p.add_argument('--input', default=str(DEFAULT_INPUT),
                   help=f'Input JSON from striking distance scanner (default: {DEFAULT_INPUT})')
    p.add_argument('--max', type=int, default=10, help='Max candidates to register (default: 10)')
    p.add_argument('--score-threshold', type=float, default=0,
                   help='Minimum opportunity score to consider (default: 0 = all)')
    p.add_argument('--dry-run', action='store_true',
                   help='Show what would be registered without modifying colony-tracker.json')
    p.add_argument('--colony', default=None,
                   help='Override colony name for all candidates (e.g. "kuala-lumpur-guides")')
    return p.parse_args()

# ── Colony Tracker integration ──

def load_tracker():
    if TRACKER_FILE.exists():
        return json.loads(TRACKER_FILE.read_text())
    return {"threshold": {}, "colonies": []}

def save_tracker(data):
    TRACKER_FILE.write_text(json.dumps(data, indent=2))
    print(f"  ✓ Tracked state saved to {TRACKER_FILE}")

def find_or_create_colony(data, colony_name):
    """Find an existing colony by id or create a new one."""
    for c in data["colonies"]:
        if c["id"] == colony_name:
            return c
    new_colony = {"id": colony_name, "pages": []}
    data["colonies"].append(new_colony)
    print(f"  + Created new colony group: {colony_name}")
    return new_colony

def slug_exists_in_colony(colony, slug):
    """Check if a slug is already registered in this colony."""
    return any(p["slug"] == slug for p in colony["pages"])

def keyword_exists_anywhere(data, keyword):
    """Check if a target_keyword is already registered in any colony."""
    keyword_lower = keyword.lower().strip()
    for c in data["colonies"]:
        for p in c["pages"]:
            if p.get("target_keyword", "").lower().strip() == keyword_lower:
                return True
    return False

# ── Chain linking logic ──

def auto_link(colony_pages, category="general"):
    """Auto-link pages in a colony sequentially by score rank.

    The highest-scoring page links to the next highest, and so on.
    The LAST page in the chain links to a strategic tour target
    (Pillar 2 multi-day private tour by default) instead of ending
    the chain — this steers colony authority toward money pages.
    """
    sorted_pages = sorted(colony_pages,
                          key=lambda p: p.get("_score", 0),
                          reverse=True)

    # Determine which strategic tour this colony should feed into
    strategic = get_strategic_tour(category)

    for i, page in enumerate(sorted_pages):
        if i < len(sorted_pages) - 1:
            next_page = sorted_pages[i + 1]
            page["links_to"] = next_page["slug"]
            page["linked_from"] = sorted_pages[i - 1]["slug"] if i > 0 else None
            next_slug = next_page["slug"]
            next_url = next_page["url"]
            page["contextual_link_url"] = next_url
            page["contextual_link_text"] = next_page.get("title", next_page.get("suggested_title", ""))[:60]
            page["contextual_link_phrase"] = f"For more on this, continue reading our"
        else:
            # LAST PAGE in chain → link to strategic tour target
            page["links_to"] = strategic["slug"] if False else None  # not a colony page slug
            page["linked_from"] = sorted_pages[i - 1]["slug"] if i > 0 else None
            page["contextual_link_url"] = strategic["url"]
            page["contextual_link_text"] = strategic["anchor"]
            page["contextual_link_phrase"] = f"Ready to experience this firsthand? Book a"
            page["linked_from"] = sorted_pages[i - 1]["slug"] if i > 0 else None

def build_link_data(page):
    """Build the colony page entry dict from a striking distance candidate."""
    slug = page.get("suggested_slug", "")
    title = page.get("suggested_title", page["query"].title())
    url = page.get("suggested_url", f"/stories/{slug}/")
    query = page["query"]

    return {
        "slug": slug,
        "title": title,
        "url": url,
        "target_keyword": query,
        "status": "planned",
        "links_to": None,
        "linked_from": None,
        "payload_type": "story",
        "contextual_link_phrase": page.get("contextual_link_phrase",
                                           f"For more on {query}, check out our"),
        "contextual_link_text": page.get("contextual_link_text",
                                         f"guide to {query}")[:80],
        "contextual_link_url": page.get("contextual_link_url", url),
        "_score": page.get("score", 0),
        "_category": page.get("category", "general"),
    }

def main():
    args = parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        print(f"✗ Input file not found: {input_path}")
        print(f"  Run the striking distance scanner first:")
        print(f"  python3 scripts/seo-automation/gsc-striking-distance.py --limit 20 --colony-json")
        sys.exit(1)

    data = json.loads(input_path.read_text())
    candidates = data.get("candidates", [])
    print(f"\n=== Striking Distance → Colony Bridge ===\n")
    print(f"Loaded {len(candidates)} candidates from {input_path}")
    print(f"Scan generated: {data.get('generated_at', 'unknown')}")

    # Filter by score threshold
    if args.score_threshold > 0:
        candidates = [c for c in candidates if c.get("score", 0) >= args.score_threshold]
        print(f"After score threshold ({args.score_threshold}): {len(candidates)}")

    # Cap at --max
    candidates = candidates[:args.max]
    print(f"Processing top {len(candidates)} candidates\n")

    # Load existing tracker state
    tracker = load_tracker()
    registered_count = 0
    skipped_count = 0
    new_colony_pages = {}  # colony_name -> [page_dicts]

    for idx, cand in enumerate(candidates):
        query = cand["query"]
        score = cand.get("score", 0)
        pos = cand.get("position", 0)
        impressions = cand.get("impressions", 0)

        # Deduplicate by keyword
        if keyword_exists_anywhere(tracker, query):
            print(f"  SKIP [{idx+1}] '{query}' — already registered in tracker")
            skipped_count += 1
            continue

        # Determine colony
        colony_name = args.colony or cand.get("colony", "general")
        colony_name = normalize_colony(colony_name)

        page_entry = build_link_data(cand)
        slug = page_entry["slug"]

        # Check slug uniqueness within colony
        colony_obj = find_or_create_colony(tracker, colony_name)
        if slug_exists_in_colony(colony_obj, slug):
            # Slug collision — append a suffix
            page_entry["slug"] = f"{slug}-{colony_name}"
            page_entry["url"] = f"/stories/{page_entry['slug']}/"

        # Accumulate for batch linking
        if colony_name not in new_colony_pages:
            new_colony_pages[colony_name] = []
        new_colony_pages[colony_name].append(page_entry)

        print(f"  ✓ [{idx+1}] Will register: '{query}'")
        print(f"          Title: {page_entry['title']}")
        print(f"          Slug:  {page_entry['slug']}")
        print(f"          Colony: {colony_name}")
        print(f"          Score: {score} | Pos: {pos} | Imp: {impressions}")
        registered_count += 1

    # Apply auto-linking within each colony group
    for col_name, pages in new_colony_pages.items():
        # Determine category from the first page's _category
        cat = pages[0].get("_category", col_name) if pages else col_name
        auto_link(pages, category=cat)

    # If dry-run, just show what would happen
    if args.dry_run:
        print(f"\n─── DRY RUN — No changes made ───")
        print(f"Would register: {registered_count} new colony pages")
        print(f"Would skip:     {skipped_count} already-registered keywords")
        print(f"Colony groups:  {list(new_colony_pages.keys())}")
        if registered_count > 0:
            print(f"\nProposed new state for colony-tracker.json:")
            for col_name, pages in new_colony_pages.items():
                colony_obj = find_or_create_colony(tracker, col_name)
                for p in pages:
                    # Remove internal _score, _category
                    clean = {k: v for k, v in p.items() if not k.startswith("_")}
                    colony_obj["pages"].append(clean)
            print(json.dumps(tracker, indent=2)[:2000])
        return

    # Apply changes
    for col_name, pages in new_colony_pages.items():
        colony_obj = find_or_create_colony(tracker, col_name)
        for p in pages:
            clean = {k: v for k, v in p.items() if not k.startswith("_")}
            colony_obj["pages"].append(clean)

    save_tracker(tracker)
    print(f"\n─── Summary ───")
    print(f"Registered: {registered_count} new colony pages")
    print(f"Skipped:    {skipped_count} already-registered keywords")
    print(f"Colonies:   {', '.join(new_colony_pages.keys())}")
    print(f"\nNext step: Run `python3 colony-tracker.py create-story <slug>` for each new page,\n"
          f"or use the bofu-landing-factory for commercial-intent pages.")

if __name__ == "__main__":
    main()
