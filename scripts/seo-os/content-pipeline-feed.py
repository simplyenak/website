#!/usr/bin/env python3
"""
ContentPipeline feed — Phase 1 of the SEO-OS plan.

Pulls GSC striking-distance opportunities and upserts them into the Grist
ContentPipeline table (Kanban view). Deterministic bucketing (30/60/90 days)
so the board always shows a prioritised queue, not a flat list.

Data source: scripts/seo-automation/gsc-striking-distance.py (GSC service
account + optional OpenSEO volume). If that script can't run here (no GSC
credentials), falls back to the freshest *_latest.json already on disk.

Usage:
  python3 content-pipeline-feed.py              # refresh via scanner, then upsert
  python3 content-pipeline-feed.py --no-scan     # use the latest JSON only
  python3 content-pipeline-feed.py --limit 30    # cap rows pushed
  python3 content-pipeline-feed.py --dry-run     # show rows, don't write
"""
import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent  # website-optimization/
sys.path.insert(0, str(HERE))
import grist  # noqa: E402

STRIKER = REPO / "scripts" / "seo-automation" / "gsc-striking-distance.py"
LATEST = REPO / ".hermes" / "seo-reports" / "openseo" / "striking_distance_latest.json"

# ContentPipeline unique key is the Query. A row is "active" until it reaches
# a terminal status; the feed never re-seeds terminal rows or overwrites a
# non-todo status (a human/agent may have moved it forward).
ACTIVE_STATUSES = {"todo", "drafting", "awaiting-approval", "approved"}
DEFAULTS = {"Source": "striking", "Status": "todo"}


def slugify(text):
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s


def bucket_for(score, position):
    """Deterministic 30/60/90-day bucket from the scanner's opportunity_score.
    score already folds position/impressions/CTR in; close-to-ranking = sooner."""
    if score is None and position is None:
        return "90 days"
    if score is not None and score >= 60:
        return "30 days"
    if (score is not None and score >= 30) or (position is not None and position <= 12):
        return "60 days"
    return "90 days"


def refresh_via_scanner(limit):
    """Run the striking-distance scanner; it rewrites LATEST json. Returns bool."""
    if not STRIKER.exists():
        print(f"[feed] scanner not found at {STRIKER}")
        return False
    print(f"[feed] running striking-distance scanner (limit {limit}) ...")
    r = subprocess.run(
        [sys.executable, str(STRIKER), "--cron", "--days", "28",
         "--limit", str(limit), "--colony-json"],
        cwd=str(REPO), capture_output=True, text=True, timeout=240,
    )
    sys.stdout.write(r.stdout[-1500:])
    if r.returncode != 0:
        print(f"[feed] scanner exit {r.returncode}: {r.stderr[-500:]}")
        return False
    return LATEST.exists()


def load_rows(limit):
    if not LATEST.exists():
        return []
    data = json.loads(LATEST.read_text())
    rows = data if isinstance(data, list) else data.get("candidates", data.get("rows", []))
    out = []
    for r in rows[:limit]:
        q = (r.get("query") or r.get("suggested_slug") or "").strip()
        if not q:
            continue
        score = r.get("opportunity_score", r.get("score"))
        pos = r.get("position")
        out.append({
            "Query": q,
            "Slug": r.get("suggested_slug") or slugify(q),
            "Title": r.get("suggested_title") or q.title(),
            "Source": "striking",
            "Bucket": bucket_for(score, pos),
            "Score": score,
            "Position": pos,
            "Impressions": r.get("impressions"),
            "Clicks": r.get("clicks"),
        })
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-scan", action="store_true", help="skip the scanner, use latest JSON")
    ap.add_argument("--limit", type=int, default=30)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if not args.no_scan:
        refresh_via_scanner(args.limit)

    rows = load_rows(args.limit)
    print(f"[feed] {len(rows)} striking-distance opportunities to push")
    if not rows:
        print("[feed] nothing to push (no data or all filtered).")
        return

    # Existing rows keyed by Query so we can skip active/terminal ones.
    existing = {r.get("fields", {}).get("Query"): r.get("fields", {})
                for r in grist.get_records("ContentPipeline")}

    to_write = []
    for r in rows:
        q = r["Query"]
        if q in existing and existing[q].get("Status") in ACTIVE_STATUSES:
            # Still being worked — don't clobber, but refresh the bucket/score.
            r["Status"] = existing[q].get("Status")
            for k in ("DraftPath", "PublishedUrl", "PayloadStoryId", "IndexedAt",
                      "QuestionsAsked", "Notes"):
                if existing[q].get(k):
                    r[k] = existing[q][k]
        else:
            r.setdefault("Status", "todo")
        to_write.append(r)

    if args.dry_run:
        for r in to_write:
            print(f"  {r['Bucket']:8} {r.get('Status','todo'):12} {r['Query'][:45]:45} score={r.get('Score')}")
        print(f"[feed] dry-run: would upsert {len(to_write)} rows into ContentPipeline.")
        return

    res = grist.upsert("ContentPipeline", ["Query"], to_write)
    print(f"[feed] upserted ContentPipeline: {res['posted']} new, {res['patched']} refreshed.")
    live = grist.get_records("ContentPipeline")
    print(f"[feed] ContentPipeline now has {len(live)} rows.")


if __name__ == "__main__":
    main()
