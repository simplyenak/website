#!/usr/bin/env python3
"""
open-book-test.py — Research what top-ranking pages say, find gaps to exploit.

Caleb Ulku's "Open Book Test" from SEO podcast (Jul 2026):
- Type target keyword into Google/ChatGPT
- See what ranks
- Add information they don't have → that's your content brief

This script:
1. Extracts the top-ranking language (attributes, entities, phrases) for a keyword
2. Compares against our own content
3. Produces a gap report with missing attributes to include

Usage:
  python3 scripts/open-book-test.py "vegetarian food tour kuala lumpur"
  python3 scripts/open-book-test.py "best street food penang" --compare-with site/src/data/post/eating-durians.md
"""
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).resolve().parent.parent
POST_DIR = ROOT / "site" / "src" / "data" / "post"
STORIES_DIR = ROOT / "site" / "src" / "data" / "content" / "stories.json"

# Attribute words that matter for AI recommendation (entity signals)
ATTRIBUTE_CATEGORIES = {
    "dishes": ["nasi lemak", "char kway teow", "laksa", "satay", "roti canai",
               "cendol", "hainanese chicken rice", "bak kut teh", "dim sum",
               "nasi kandar", "mee goreng", "popiah", "tau sar pneah",
               " curry laksa", "asam laksa", "wantan mee", "mee rebus"],
    "locations": ["chow kit", "jalan alor", "petaling street", "georgetown",
                  "penang", "kuala lumpur", "ipoh", "melaka", "kampung baru",
                  "brickfields", "little india", "chinatown", "bangsar",
                  "ss2", "damansara", "mont kiara", "bkt bintang"],
    "people": ["hawker", "chef", "guide", "cook", "vendor", "owner",
               "peranakan", "nyonya", "malay", "chinese", "indian",
               "eurasian", "portuguese", "thai"],
    "techniques": ["wok", "char", "steam", "fry", "roast", "grill",
                   "ferment", "coconut milk", "spice", "chili", "sambal",
                   "belacan", "turmeric", "lemongrass", "galangal"],
    "dietary": ["halal", "vegetarian", "vegan", "gluten-free", "jain",
                "halal-certified", "muslim-owned", "plant-based",
                "dairy-free", "nut-free"],
    "time": ["dawn", "morning", "afternoon", "evening", "night", "midnight",
             "sunset", "sunrise", "late-night", "pre-dawn"],
    "sensory": ["crispy", "spicy", "sweet", "sour", "bitter", "umami",
                "smoky", "tender", "chartery", "fragrant", "aromatic",
                "silky", "crunchy", "fluffy"],
}


def extract_text_from_rich_text(node):
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


def find_attributes(text: str) -> dict:
    """Find attribute mentions in text."""
    text_lower = text.lower()
    found = {}
    for category, terms in ATTRIBUTE_CATEGORIES.items():
        matches = [t for t in terms if t in text_lower]
        if matches:
            found[category] = matches
    return found


def get_our_content(keyword: str) -> dict:
    """Find all our content pieces related to the keyword."""
    keyword_lower = keyword.lower()
    keyword_words = set(re.findall(r'\w+', keyword_lower))
    results = {"posts": [], "stories": []}

    # Check blog posts
    for post in POST_DIR.glob("*.md"):
        content = post.read_text(encoding="utf-8")
        content_lower = content.lower()
        # Check if keyword or its component words appear
        if keyword_lower in content_lower or len(keyword_words & set(re.findall(r'\w+', content_lower))) >= 2:
            results["posts"].append({"file": post.name, "content": content})

    # Check stories
    if STORIES_DIR.exists():
        stories = json.loads(STORIES_DIR.read_text())
        for story in stories:
            body_texts = extract_text_from_rich_text(story.get("content", {}))
            body_combined = " ".join(body_texts).lower()
            title = story.get("title", "").lower()
            combined = title + " " + body_combined
            if keyword_lower in combined or len(keyword_words & set(re.findall(r'\w+', combined))) >= 2:
                results["stories"].append({
                    "slug": story.get("slug", "?"),
                    "title": story.get("title", ""),
                    "body": body_combined[:500]
                })

    return results


def generate_content_brief(keyword: str, our_content: dict) -> dict:
    """
    Generate a content brief based on the Open Book Test.
    Since we can't actually scrape Google (no API key for SERP),
    we produce a structured brief that the writer can use to research.
    """
    keyword_lower = keyword.lower()

    # Aggregate what we already say about this topic
    all_our_text = ""
    for p in our_content.get("posts", []):
        all_our_text += p["content"] + " "
    for s in our_content.get("stories", []):
        all_our_text += s.get("body", "") + " "

    our_attributes = find_attributes(all_our_text)

    # Build the brief
    brief = {
        "keyword": keyword,
        "open_book_test_steps": [
            f"1. Search '{keyword}' on Google — note the top 5 results",
            f"2. Search '{keyword}' on ChatGPT — note what it recommends",
            "3. For each top result, list: what attributes do they mention? (dishes, places, people, techniques)",
            "4. What specific details do they include that we don't?",
            "5. What's missing from ALL top results that we could add?",
        ],
        "our_current_coverage": our_attributes,
        "attribute_gaps": {},
        "content_opportunities": [],
    }

    # Identify gaps — categories we don't cover
    for category in ATTRIBUTE_CATEGORIES:
        if category not in our_attributes:
            brief["attribute_gaps"][category] = ATTRIBUTE_CATEGORIES[category][:5]

    # Specific opportunities for food/travel content
    brief["content_opportunities"] = [
        "Specific dish names with sensory descriptions (not just 'delicious')",
        "Named hawkers, stalls, or restaurants with personal details",
        "Time-of-day context (dawn market vs midnight street food)",
        "Cultural/historical background that AI can't synthesize",
        "Practical details: price range, how to order, what to watch for",
        "Trust signals: how we vet stalls, what 'halal' actually means here",
        "Honest limitations: who this ISN'T for, when to skip",
    ]

    return brief


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Open Book Test — research what ranks, find gaps")
    parser.add_argument("keyword", help="Target keyword/phrase")
    parser.add_argument("--compare-with", help="Compare against a specific markdown file")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    args = parser.parse_args()

    our_content = get_our_content(args.keyword)

    # If comparing with a specific file, load it
    compare_content = None
    if args.compare_with:
        p = Path(args.compare_with)
        if p.exists():
            compare_content = p.read_text(encoding="utf-8")

    brief = generate_content_brief(args.keyword, our_content)

    if args.json:
        print(json.dumps(brief, indent=2))
        return

    print("=" * 60)
    print(f"  Open Book Test — '{args.keyword}'")
    print("=" * 60)

    print("\n[Steps]")
    for step in brief["open_book_test_steps"]:
        print(f"  {step}")

    print(f"\n[Our Content on This Topic]")
    print(f"  Blog posts: {len(our_content['posts'])}")
    print(f"  Stories: {len(our_content['stories'])}")

    print(f"\n[Our Attribute Coverage]")
    for cat, matches in brief["our_current_coverage"].items():
        print(f"  {cat}: {', '.join(matches[:5])}")

    if brief["attribute_gaps"]:
        print(f"\n[Attribute Gaps — categories we DON'T cover]")
        for cat, examples in brief["attribute_gaps"].items():
            print(f"  {cat}: could mention {', '.join(examples[:3])}")

    print(f"\n[Content Opportunities]")
    for opp in brief["content_opportunities"]:
        print(f"  • {opp}")

    print(f"\n[First Paragraph Rule]")
    print(f"  The first paragraph of any content targeting this keyword MUST:")
    print(f"  1. Mention the keyword/entity early (first 40 words)")
    print(f"  2. Address what the searcher actually wants (not company history)")
    print(f"  3. Include specific attributes (dish names, places, sensory details)")
    print(f"  4. Be written for AI agents to extract and summarize")

    print(f"\n[Trust Content Checklist]")
    print(f"  For AI agents to recommend us, include:")
    print(f"  □ Specific pricing context (not just 'from RMXX')")
    print(f"  □ What could go wrong / who this isn't for")
    print(f"  □ Stories about real experiences (things gone wrong = trust)")
    print(f"  □ Attribute matching: if they search 'halal', say 'halal-certified'")
    print(f"  □ Outcome-focused: what happens after the tour ends")


if __name__ == "__main__":
    main()
