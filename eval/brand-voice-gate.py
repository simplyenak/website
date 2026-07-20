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
    "amazing", "awesome", "best", "top", "leading", "premier",
    "destination", "melting pot", "foodie paradise",
    "must-try", "must-visit", "must-see", "iconic", "legendary",
    "famous", "renowned", "acclaimed", "award-winning",
    "gourmet", "artisanal", "bespoke", "tailored", "unique",
    "one-of-a-kind", "superlative",
]

SKIP_KEYS = {"id","slug","status","_status","createdAt","updatedAt",
             "published_at","image","hero_image","url","href",
             "cta_href","guide_slug","alt","caption","position",
             "type","code","languages_code","email","phone"}


def scan_value(value, path=""):
    violations = []
    if isinstance(value, str):
        text_lower = value.lower()
        for phrase in BANNED:
            if re.search(r'\b' + re.escape(phrase.lower()) + r'\b', text_lower):
                violations.append((phrase, path, value[:80]))
    elif isinstance(value, list):
        for i, item in enumerate(value):
            violations.extend(scan_value(item, f"{path}[{i}]"))
    elif isinstance(value, dict):
        for k, v in value.items():
            if k in SKIP_KEYS or k == "translations":
                continue
            violations.extend(scan_value(v, f"{path}.{k}" if path else k))
    return violations


def main():
    files = sorted(f for f in CONTENT_DIR.glob("*.json") if f.name != "media.json")
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
    return 1 if all_v else 0


if __name__ == "__main__":
    sys.exit(main())
