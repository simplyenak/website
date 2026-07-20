#!/usr/bin/env python3
"""
Brand voice gate — scans content JSON for banned AI-speak phrases.
Run as part of CI quality gate.
"""

import json
import sys
import re
from pathlib import Path

CONTENT_DIR = Path(__file__).parent.parent / "site" / "src" / "data" / "content"

BANNED_PHRASES = [
    "authentic", "immersive experience", "embark on a journey",
    "luxury", "premium", "world-class", "can't-miss", "unforgettable",
    "bustling", "vibrant", "tapestry", "unparalleled", "not just",
    "cornerstone", "testament", "myriad", "embark", "delve",
    "rich tapestry", "hidden gems", "dive into", "immerse yourself",
    "journey through", "discover the magic", "unveil", "elevate",
    "transformative", "seamless", "effortless", "curated experience",
    "once-in-a-lifetime", "breathtaking", "stunning", "spectacular",
    "magnificent", "extraordinary", "remarkable", "incredible",
    "amazing", "awesome", "best", "top", "leading", "premier",
    "destination", "hotspot", "melting pot", "cultural melting pot",
    "foodie paradise", "paradise for foodies", "haven for", "mecca for",
    "hub for", "nestled in", "tucked away", "off the beaten path",
    "off the beaten track", "step back in time", "transport yourself",
    "whisked away", "whisk you away", "savor", "savour", "indulge",
    "indulgent", "decadent", "exquisite", "sumptuous", "opulent",
    "lavish", "extravagant", "gourmet", "artisanal", "handcrafted",
    "bespoke", "tailored", "personalized", "unique", "one-of-a-kind",
    "must-try", "must-visit", "must-see", "iconic", "legendary",
    "famous", "renowned", "acclaimed", "celebrated", "award-winning",
    "critically acclaimed", "highly rated", "five-star", "5-star",
    "superlative",
]

EM_DASH_PATTERN = re.compile(r'[—–]')

SKIP_KEYS = {"id", "slug", "status", "_status", "createdAt", "updatedAt",
             "published_at", "image", "hero_image", "url", "href",
             "cta_href", "guide_slug", "alt", "caption", "position",
             "type", "code", "languages_code", "email", "phone"}

def scan_text(text, context=""):
    violations = []
    text_lower = text.lower()
    for phrase in BANNED_PHRASES:
        if phrase.lower() in text_lower:
            violations.append((phrase, context, text[:80]))
    if EM_DASH_PATTERN.search(text):
        violations.append(("[em-dash]", context, text[:80]))
    return violations

def scan_value(value, path=""):
    violations = []
    if isinstance(value, str):
        violations.extend(scan_text(value, path))
    elif isinstance(value, list):
        for i, item in enumerate(value):
            violations.extend(scan_value(item, f"{path}[{i}]"))
    elif isinstance(value, dict):
        for k, v in value.items():
            if k in SKIP_KEYS:
                continue
            violations.extend(scan_value(v, f"{path}.{k}" if path else k))
    return violations

def main():
    files = [f for f in CONTENT_DIR.glob("*.json") if f.name != "media.json"]
    all_v = []
    for fpath in sorted(files):
        data = json.loads(fpath.read_text())
        for v in scan_value(data, fpath.name):
            all_v.append((fpath.name, v))

    print(f"\n{'='*60}")
    print(f"Brand Voice Gate — {len(files)} files scanned")
    print(f"{'='*60}")

    if not all_v:
        print("✅ No violations.")
        return 0

    by_file = {}
    for fname, v in all_v:
        by_file.setdefault(fname, []).append(v)

    for fname, vs in sorted(by_file.items()):
        print(f"\n{fname}: {len(vs)} violation(s)")
        for phrase, ctx, snippet in vs[:3]:
            print(f"  ❌ '{phrase}' → {snippet[:60]}")
        if len(vs) > 3:
            print(f"  ... +{len(vs)-3} more")

    print(f"\nTOTAL: {len(all_v)} violation(s)")
    return 1

if __name__ == "__main__":
    sys.exit(main())
