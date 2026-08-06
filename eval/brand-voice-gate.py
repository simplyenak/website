#!/usr/bin/env python3
"""Brand voice gate — scans content JSON for banned AI-speak phrases."""

import json, sys, re
from pathlib import Path

CONTENT_DIR = Path(__file__).parent.parent / "site" / "src" / "data" / "content"

BANNED = [
    "authentic", "immersive experience", "embark", "luxury", "premium",
    "world-class", "unforgettable", "bustling", "vibrant", "tapestry",
    "unparalleled", "cornerstone", "testament", "myriad", "delve",
    "hidden gems", "dive into", "immerse yourself", "journey through",
    "elevate", "transformative", "seamless", "curated experience",
    "once-in-a-lifetime", "breathtaking", "stunning", "spectacular",
    "magnificent", "extraordinary", "remarkable", "incredible",
    "amazing", "awesome", "top", "leading", "premier",
    "destination", "melting pot", "foodie paradise",
    "must-try", "must-visit", "must-see", "iconic", "legendary",
    "famous", "renowned", "acclaimed", "award-winning",
    "gourmet", "artisanal", "bespoke", "tailored", "unique",
    "one-of-a-kind", "superlative",
    # Filler words (skill: Filler category — remove)
    "truly", "very", "really", "quite", "literally",
    # Corporate tells (skill: "Never use proper/safest/recommended/appreciated")
    "proper", "safest", "recommended", "appreciated",
    # Absence framing (skill: sell presence, never absence)
    "hidden from tourists", "not overrun", "never see", "not in guidebooks",
    "won't find in guidebooks", "off the tourist trail",
]

SKIP_KEYS = {"id","slug","status","_status","createdAt","updatedAt",
             "published_at","image","hero_image","url","href",
             "cta_href","guide_slug","alt","caption","position",
             "type","code","languages_code","email","phone",
             "review_text","author_name","author_location"}
SKIP_FILES = {"testimonials.json", "reviews.json", "stories.json", "media-coverage.json"}

# Em-dash check — brand voice bans em-dashes (—, U+2014). Phrase scan can't
# catch punctuation. Also catches the common "word — word" spacing pattern.
EM_DASH_RE = re.compile(r'[\u2014\u2013]')


def scan_value(value, path="", check_em_dash=True):
    violations = []
    if isinstance(value, str):
        text_lower = value.lower()
        for phrase in BANNED:
            if re.search(r'\b' + re.escape(phrase.lower()) + r'\b', text_lower):
                violations.append((phrase, path, value[:80]))
        if check_em_dash and EM_DASH_RE.search(value):
            violations.append(("em-dash (—/–)", path, value[:80]))
    elif isinstance(value, list):
        for i, item in enumerate(value):
            violations.extend(scan_value(item, f"{path}[{i}]", check_em_dash))
    elif isinstance(value, dict):
        for k, v in value.items():
            if k in SKIP_KEYS or k == "translations":
                continue
            violations.extend(scan_value(v, f"{path}.{k}" if path else k, check_em_dash))
    return violations


def main():
    files = sorted(f for f in CONTENT_DIR.glob("*.json") if f.name != "media.json" and f.name not in SKIP_FILES)
    all_v = []
    for fpath in files:
        data = json.loads(fpath.read_text())
        all_v.extend(scan_value(data, fpath.name))

    print(f"\n{'='*60}")
    print(f"Brand Voice Gate — {len(files)} files scanned")
    print(f"{'='*60}")

    if not all_v:
        print("✅ No violations.")
        return 0

    by_file = {}
    for phrase, ctx, snippet in all_v:
        by_file.setdefault(ctx.split(".")[0], []).append((phrase, snippet))

    for fname, vs in sorted(by_file.items()):
        print(f"\n{fname}: {len(vs)} violation(s)")
        for phrase, snippet in vs[:3]:
            print(f"  ❌ '{phrase}' → {snippet[:60]}")
        if len(vs) > 3:
            print(f"  ... +{len(vs)-3} more")

    print(f"\nTOTAL: {len(all_v)} violation(s)")
    return 1  # Block deploy — run brand-voice-fix.py --fix and retry


if __name__ == "__main__":
    sys.exit(main())
