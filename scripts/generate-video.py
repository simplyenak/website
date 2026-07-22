#!/usr/bin/env python3
"""
generate-video.py — Create video scripts for key content pieces (Gemini Maps strategy).

Caleb Ulku podcast (Jul 2026) insight:
- Gemini is the only frontier model natively trained on video (Google owns YouTube)
- Create a YouTube video for 1/3 to 1/2 of articles
- Can use AI (Pictory, etc.) — nobody watches them, they're for Gemini
- Embed the video link on the page

This script:
1. Reads blog posts and extracts key talking points
2. Generates a video script optimized for AI extraction
3. Outputs in Pictory-compatible format

Usage:
  python3 scripts/generate-video.py site/src/data/post/eating-durians.md
  python3 scripts/generate-video.py --all
"""
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POST_DIR = ROOT / "site" / "src" / "data" / "post"
STORIES_DIR = ROOT / "site" / "src" / "data" / "content" / "stories.json"

# Pictory requirements:
# - Script should be conversational, 2-3 minutes spoken
# - Clear section breaks for B-roll insertion
# - Include key facts for on-screen text overlays
# - Target 400-600 words for ~2.5 min video

def extract_key_facts(content: str) -> list:
    """Extract key facts from content for video emphasis."""
    facts = []
    # Remove markdown formatting
    clean = re.sub(r'\*\*([^*]+)\*\*', r'\1', content)  # Bold
    clean = re.sub(r'\*([^*]+)\*', r'\1', clean)  # Italic
    clean = re.sub(r'`([^`]+)`', r'\1', clean)  # Code
    clean = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', clean)  # Links
    # Look for sentences with numbers, names, or strong claims
    sentences = re.split(r'[.!?]+', clean)
    for s in sentences:
        s = s.strip()
        if len(s) < 20 or len(s) > 150:
            continue
        # Prioritize sentences with: numbers, named entities, or strong claims
        if re.search(r'\b\d+\b', s) or re.search(r'[A-Z][a-z]+(?:\s[A-Z][a-z]+){1,}', s):
            facts.append(s)
    return facts[:10]  # Top 10 facts


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


def generate_video_script(title: str, content: str, keyword: str = "") -> dict:
    """Generate a video script from a blog post."""
    # Extract key sections from the content
    parts = content.split("---", 2)
    if len(parts) < 3:
        return {"error": "Invalid markdown format"}

    fm, body = parts[1], parts[2].strip()

    # Get description for hook
    desc_match = re.search(r'description:\s*"([^"]+)"', fm, re.MULTILINE)
    description = desc_match.group(1) if desc_match else ""

    # Extract headings as section markers
    headings = re.findall(r'^##\s+(.+)', body, re.MULTILINE)

    # Extract key facts
    facts = extract_key_facts(body)

    # Build the script
    script = {
        "title": title,
        "keyword": keyword or title,
        "duration_estimate": "2-3 minutes",
        "word_count_target": 500,
        "sections": [],
        "b_roll_suggestions": [],
        "on_screen_text": [],
    }

    # Hook (first 30 seconds)
    hook_fact = facts[0] if facts else f"there's more to {keyword or title.lower()} than you think"
    script["sections"].append({
        "type": "hook",
        "timestamp": "0:00-0:30",
        "narration": f"Did you know that {hook_fact.lower()}? Here's what most people get wrong about {keyword or title.lower()}.",
        "visual": "Hook image or video clip that creates curiosity"
    })

    # Context/setup (30-60 seconds)
    if len(facts) > 1:
        script["sections"].append({
            "type": "context",
            "timestamp": "0:30-1:00",
            "narration": f"Here's the thing about {keyword or title.lower()}: {facts[1].lower() if len(facts) > 1 else 'there is more to it than you think.'}",
            "visual": "Establishing shot of location"
        })

    # Key facts (60-120 seconds)
    fact_narration = "Let me share some specifics. "
    for i, fact in enumerate(facts[2:5], 1):
        fact_narration += f"Number {i}: {fact}. "
        script["on_screen_text"].append(fact[:60])

    script["sections"].append({
        "type": "key_facts",
        "timestamp": "1:00-2:00",
        "narration": fact_narration.strip(),
        "visual": "B-roll of food, locations, people"
    })

    # CTA (last 30 seconds)
    script["sections"].append({
        "type": "cta",
        "timestamp": "2:00-2:30",
        "narration": f"If you want to experience {keyword or title.lower()} for yourself, we take you there with locals who know every stall. Link in the description.",
        "visual": "Tour group eating, smiling, enjoying"
    })

    # B-roll suggestions
    script["b_roll_suggestions"] = [
        "Close-up of dishes being prepared",
        "Market/street scenes with movement",
        "Guide explaining to tour group",
        "Map/location establishing shot",
        "Group eating and enjoying food",
    ]

    # Build full narration text
    script["full_script"] = " ".join([s["narration"] for s in script["sections"]])
    script["word_count"] = len(script["full_script"].split())

    return script


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Generate video scripts from blog posts")
    parser.add_argument("file", nargs="?", help="Path to markdown file")
    parser.add_argument("--all", action="store_true", help="Generate scripts for all posts")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    parser.add_argument("--pictory-format", action="store_true", help="Output in Pictory import format")
    args = parser.parse_args()

    if args.all:
        posts = list(POST_DIR.glob("*.md"))
        results = []
        for post in posts:
            content = post.read_text(encoding="utf-8")
            parts = content.split("---", 2)
            if len(parts) < 3:
                continue
            fm = parts[1]
            tm = re.search(r'^title:\s*"([^"]+)"', fm, re.MULTILINE)
            title = tm.group(1) if tm else post.stem
            script = generate_video_script(title, content)
            if "error" not in script:
                results.append(script)

        if args.json:
            print(json.dumps(results, indent=2))
        else:
            print(f"Generated {len(results)} video scripts from blog posts")
            for r in results:
                print(f"\n[{r['title']}]")
                print(f"  Word count: {r['word_count']} (target: 400-600)")
                print(f"  Duration: {r['duration_estimate']}")
                for s in r["sections"]:
                    print(f"  [{s['timestamp']}] {s['narration'][:60]}...")

    elif args.file:
        p = Path(args.file)
        if not p.exists():
            print(f"File not found: {p}")
            sys.exit(1)

        content = p.read_text(encoding="utf-8")
        parts = content.split("---", 2)
        if len(parts) < 3:
            print("Invalid markdown format")
            sys.exit(1)

        fm = parts[1]
        tm = re.search(r'^title:\s*"([^"]+)"', fm, re.MULTILINE)
        title = tm.group(1) if tm else p.stem

        script = generate_video_script(title, content)

        if args.pictory_format:
            # Pictory expects plain text script
            print(f"# {script['title']}\n")
            for section in script["sections"]:
                print(f"[{section['timestamp']}] {section['visual']}")
                print(f"{section['narration']}\n")
        elif args.json:
            print(json.dumps(script, indent=2))
        else:
            print("=" * 60)
            print(f"  Video Script: {script['title']}")
            print("=" * 60)
            print(f"\nDuration: {script['duration_estimate']}")
            print(f"Word count: {script['word_count']} (target: 400-600)")
            print(f"\n[Sections]")
            for section in script["sections"]:
                print(f"\n  [{section['timestamp']}] ({section['type']})")
                print(f"  Narration: {section['narration']}")
                print(f"  Visual: {section['visual']}")

            if script["on_screen_text"]:
                print(f"\n[On-Screen Text Overlays]")
                for text in script["on_screen_text"]:
                    print(f"  • {text}")

            print(f"\n[B-Roll Suggestions]")
            for b in script["b_roll_suggestions"]:
                print(f"  • {b}")

            print(f"\n[Full Script]")
            print(script["full_script"])

            print(f"\n[Next Steps]")
            print(f"  1. Copy full script into Pictory.ai")
            print(f"  2. Select 'AI Avatars' or 'Stock video' mode")
            print(f"  3. Add B-roll suggestions as scene descriptions")
            print(f"  4. Export and upload to YouTube")
            print(f"  5. Embed video URL on the blog post page")

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
