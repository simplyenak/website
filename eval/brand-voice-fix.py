#!/usr/bin/env python3
"""
Brand voice fixer — auto-fixes common AI-speak violations in content JSON.

Strategy: whole-phrase replacement, single-word filler removal with cleanup.
Run with --dry-run first, then --fix to apply.
"""

import json
import re
import sys
from pathlib import Path

CONTENT_DIR = Path(__file__).parent.parent / "site" / "src" / "data" / "content"

# Whole phrases first (order matters — longer phrases first)
PHRASE_FIXES = [
    ("hidden gems", ""),
    ("dive into", "explore"),
    ("immerse yourself", "experience"),
    ("journey through", "explore"),
    ("embark on a journey", "start your experience"),
    ("embark on", "start"),
    ("delve into", "explore"),
    ("transport yourself", "visit"),
    ("whisk you away", "take you"),
    ("whisked away", "taken"),
    ("step back in time", "visit the past"),
    ("off the beaten path", ""),
    ("off the beaten track", ""),
    ("tucked away", ""),
    ("rich tapestry", "variety"),
    ("melting pot", "mix"),
    ("curated experience", "experience"),
    ("once-in-a-lifetime", "memorable"),
    ("foodie paradise", "food scene"),
    ("paradise for foodies", "food scene"),
    ("critically acclaimed", "well-reviewed"),
    ("award-winning", ""),
    ("world-class", ""),
    ("can't-miss", "worth visiting"),
    ("must-try", "worth trying"),
    ("must-visit", "worth visiting"),
    ("must-see", "worth seeing"),
    ("unique", "distinctive"),
    ("one-of-a-kind", "distinctive"),
    ("bespoke", "custom"),
    ("handcrafted", "handmade"),
    ("artisanal", "handmade"),
    ("gourmet", "quality"),
    ("tailored", "custom"),
    ("personalized", "custom"),
    ("seamless", "smooth"),
    ("effortless", "simple"),
    ("transformative", "memorable"),
    ("unparalleled", "outstanding"),
    ("extraordinary", ""),
    ("remarkable", ""),
    ("spectacular", ""),
    ("magnificent", ""),
    ("stunning", ""),
    ("breathtaking", ""),
    ("exquisite", ""),
    ("opulent", ""),
    ("lavish", ""),
    ("extravagant", ""),
    ("decadent", "rich"),
    ("indulgent", "rich"),
    ("authentic", ""),
    ("luxury", ""),
    ("premium", ""),
    ("iconic", "well-known"),
    ("legendary", "famous"),
    ("renowned", "well-known"),
    ("acclaimed", "well-reviewed"),
    ("celebrated", "popular"),
    ("famous", "well-known"),
    ("destination", "place"),
    ("hotspot", "place"),
    ("amazing", ""),
    ("incredible", ""),
    ("unforgettable", ""),
    ("vibrant", ""),
    ("bustling", ""),
    ("best", "popular"),
    ("top", "popular"),
    ("leading", "popular"),
    ("premier", "popular"),
    ("highly rated", "well-reviewed"),
    ("five-star", ""),
    ("5-star", ""),
    ("superlative", "excellent"),
    ("myriad", "many"),
    ("cornerstone", "foundation"),
    ("testament", "example"),
    ("haven for", "place for"),
    ("mecca for", "place for"),
    ("hub for", "place for"),
    ("nestled in", "in"),
    ("not just", "not only"),
]

# Em-dash → comma or period
EM_DASH = re.compile(r'\s*[—–]\s*')

def fix_text(text):
    """Fix brand voice in a single string."""
    if not isinstance(text, str):
        return text, []

    original = text
    changes = []
    result = text

    for phrase, replacement in PHRASE_FIXES:
        pattern = r'\b' + re.escape(phrase) + r'\b'
        if re.search(pattern, result, re.IGNORECASE):
            result = re.sub(pattern, replacement, result, flags=re.IGNORECASE)
            changes.append(f'"{phrase}" → "{replacement}"')

    # Em-dashes
    if EM_DASH.search(result):
        result = EM_DASH.sub(', ', result)
        changes.append('em-dash → comma')

    # Clean up: "an ," → "a ,", "  " → " " etc.
    result = re.sub(r'\s+,', ',', result)  # space before comma
    result = re.sub(r'  +', ' ', result)   # double spaces
    result = re.sub(r'^,\s*', '', result)   # leading comma
    result = re.sub(r',\s*$', '', result)   # trailing comma

    return result.strip(), changes


def fix_value(value, path=""):
    """Recursively fix JSON content."""
    changes = []
    if isinstance(value, str):
        fixed, c = fix_text(value)
        changes = [f"{path}: {ch}" for ch in c]
        return fixed, changes
    elif isinstance(value, list):
        new_list = []
        for i, item in enumerate(value):
            fixed, c = fix_value(item, f"{path}[{i}]")
            new_list.append(fixed)
            changes.extend(c)
        return new_list, changes
    elif isinstance(value, dict):
        new_dict = {}
        skip = {"id", "slug", "status", "_status", "createdAt", "updatedAt",
                "published_at", "image", "hero_image", "url", "href",
                "cta_href", "guide_slug", "alt", "caption", "position",
                "type", "code", "languages_code", "email", "phone",
                "review_text", "author_name", "author_location"}
        for k, v in value.items():
            if k in skip:
                new_dict[k] = v
                continue
            fixed, c = fix_value(v, f"{path}.{k}" if path else k)
            new_dict[k] = fixed
            changes.extend(c)
        return new_dict, changes
    return value, []


def main():
    dry_run = "--dry-run" in sys.argv
    fix_mode = "--fix" in sys.argv

    # Same skip list as brand-voice-gate.py
    SKIP_FILES = {"testimonials.json", "reviews.json", "stories.json", "media-coverage.json"}

    files = sorted(f for f in CONTENT_DIR.glob("*.json") if f.name != "media.json" and f.name not in SKIP_FILES)
    total_changes = 0
    files_changed = 0

    for fpath in files:
        data = json.loads(fpath.read_text())
        new_data, changes = fix_value(data, fpath.name)

        if changes:
            files_changed += 1
            total_changes += len(changes)

            if dry_run:
                print(f"\n{fpath.name}: {len(changes)} change(s)")
                for c in changes[:3]:
                    print(f"  {c}")
                if len(changes) > 3:
                    print(f"  ... +{len(changes)-3} more")
            elif fix_mode:
                with open(fpath, 'w') as f:
                    json.dump(new_data, f, indent=2, ensure_ascii=False)
                    f.write('\n')
                print(f"Fixed {fpath.name}: {len(changes)} change(s)")

    print(f"\n{'='*60}")
    print(f"Brand Voice Fixer — {files_changed} files, {total_changes} changes")
    print(f"{'='*60}")

    if not fix_mode and not dry_run:
        print("\nRun with --dry-run to preview, --fix to apply")


if __name__ == "__main__":
    sys.exit(0)
