#!/usr/bin/env python3
"""
GSC Impressions-vs-Clicks Scanner — from the Local Buzz Content Playbook.

Finds pages with high impressions but low clicks (eligible but not converting):
the GSC "fix impressions-vs-clicks, don't touch winners" step.

For each page: impressions, clicks, CTR, avg position, and the top query
driving impressions. Classifies into action buckets:
  - CLICKS_LEAK  : high impressions, low CTR, pos 6-20 (striking distance)
  - TITLE_FIX    : high impressions, low CTR, pos 1-5 (title/meta iteration)
  - CONTENT_GAP  : high impressions, near-zero clicks (content gap)
Pages already ranking AND clicking are excluded (the discipline rule).

Usage:
    python3 scripts/seo-automation/gsc-impressions-clicks.py --days 28
    python3 scripts/seo-automation/gsc-impressions-clicks.py --days 28 --min-impressions 200 --min-ctr-gap 0.03

Output: JSON/CSV in .hermes/seo-reports/impressions-clicks/ + top-20 table to stdout.
"""

import argparse
import csv
import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
# Allow overriding output dir via HERMES_OUTPUT_DIR env var (for read-only mounts)
# — same convention as refresh-loop.py
_OVERRIDE_OUTPUT = os.environ.get("HERMES_OUTPUT_DIR")
if _OVERRIDE_OUTPUT:
    OUTPUT_DIR = Path(_OVERRIDE_OUTPUT)
else:
    OUTPUT_DIR = REPO_ROOT / ".hermes" / "seo-reports" / "impressions-clicks"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Defaults
DEFAULT_DAYS = 28
DEFAULT_MIN_IMPRESSIONS = 200
DEFAULT_MAX_POSITION = 25  # beyond this, impressions are too scattered to act on
DEFAULT_MIN_CTR_GAP = 0.03  # pages below this CTR with big impressions are leaks
DEFAULT_SITE = "sc-domain:simplyenak.com"


def get_gsc_token():
    """Get GSC access token from the service account key.

    Resolution order (matches credential-injection-patterns.md):
      1. ~/.google/credentials/gsc-key.json          (local dev)
      2. /home/maarten/.google/credentials/gsc-key.json
      3. /home/maarten/.config/claude-seo/google-api.json  (server)
    """
    cred_candidates = [
        Path.home() / ".google" / "credentials" / "gsc-key.json",
        Path("/home/maarten/.google/credentials/gsc-key.json"),
        Path("/home/maarten/.config/claude-seo/google-api.json"),
    ]
    for cred_path in cred_candidates:
        if not cred_path.exists():
            continue
        try:
            from google.oauth2 import service_account
            from google.auth.transport.requests import Request
            creds = service_account.Credentials.from_service_account_file(
                str(cred_path),
                scopes=["https://www.googleapis.com/auth/webmasters.readonly"],
            )
            creds.refresh(Request())
            return creds.token
        except Exception as e:
            print(f"  ⚠ credential {cred_path} failed: {e}", file=sys.stderr)
            continue
    return None


def gsc_query(token: str, start_date: str, end_date: str, dimensions: list[str], row_limit: int = 25000) -> list[dict]:
    """Fetch search analytics rows from GSC."""
    body = json.dumps({
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": dimensions,
        "rowLimit": row_limit,
        "dataState": "all",
    }).encode()
    enc_site = urllib.parse.quote(DEFAULT_SITE, safe="")
    url = f"https://www.googleapis.com/webmasters/v3/sites/{enc_site}/searchAnalytics/query"
    req = urllib.request.Request(url, data=body)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8")).get("rows", [])


def analyze(token: str, days: int, min_impressions: int, max_position: int, min_ctr_gap: float):
    end_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    start_date = (datetime.now(timezone.utc) - timedelta(days=days)).strftime("%Y-%m-%d")
    print(f"=== GSC Impressions-vs-Clicks ({start_date} → {end_date}) ===")

    # Page-level data (the primary signal)
    page_rows = gsc_query(token, start_date, end_date, ["page"])
    print(f"Fetched {len(page_rows)} page rows")
    # Query-level data (to attribute the top driving query per page)
    query_rows = gsc_query(token, start_date, end_date, ["query", "page"])
    print(f"Fetched {len(query_rows)} query×page rows")

    # Aggregate queries per page, keep the highest-impression query
    page_top_query: dict[str, dict] = {}
    for row in query_rows:
        keys = row.get("keys", [])
        if len(keys) != 2:
            continue
        query, page = keys
        imp = row.get("impressions", 0)
        cur = page_top_query.get(page)
        if cur is None or imp > cur.get("impressions", 0):
            page_top_query[page] = {
                "query": query,
                "impressions": imp,
                "clicks": row.get("clicks", 0),
                "position": round(row.get("position", 999), 1),
            }

    # Classify pages
    buckets = {"CLICKS_LEAK": [], "TITLE_FIX": [], "CONTENT_GAP": []}
    analyzed = []
    for row in page_rows:
        keys = row.get("keys", [])
        if not keys:
            continue
        page = keys[0]
        impressions = row.get("impressions", 0)
        clicks = row.get("clicks", 0)
        position = row.get("position", 999)
        ctr = row.get("ctr", 0)

        if impressions < min_impressions:
            continue
        if position > max_position:
            continue

        entry = {
            "page": page,
            "impressions": impressions,
            "clicks": clicks,
            "ctr": round(ctr * 100, 2),
            "position": round(position, 1),
            "top_query": page_top_query.get(page, {}).get("query", ""),
            "top_query_impressions": page_top_query.get(page, {}).get("impressions", 0),
            "top_query_position": page_top_query.get(page, {}).get("position", 0),
        }

        if ctr < min_ctr_gap and impressions >= min_impressions:
            if position <= 5:
                bucket = "TITLE_FIX"
            elif position <= 20:
                bucket = "CLICKS_LEAK"
            else:
                bucket = "CONTENT_GAP"
        else:
            continue  # already converting (or low impressions) — the discipline rule

        entry["bucket"] = bucket
        buckets[bucket].append(entry)
        analyzed.append(entry)

    # Sort each bucket by lost clicks (impressions × CTR gap), desc
    for b in buckets:
        buckets[b].sort(key=lambda e: e["impressions"] * (1 - e["ctr"] / 100), reverse=True)

    return analyzed, buckets, start_date, end_date


def send_telegram(text: str):
    """Send a message to Telegram (sourced via telegram.token.sh on the server)."""
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    chat = os.environ.get("TELEGRAM_ALLOWED_USERS", "1511186614")
    if not token:
        return
    import urllib.request
    data = json.dumps({"chat_id": chat, "text": text[:4000]}).encode()
    req = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data=data,
        headers={"Content-Type": "application/json"},
    )
    try:
        urllib.request.urlopen(req, timeout=10)
    except Exception as e:
        print(f"  ⚠ Telegram send failed: {e}", file=sys.stderr)


def save_output(analyzed: list[dict], buckets: dict, start_date: str, end_date: str):
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    meta = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "range": [start_date, end_date],
        "site": DEFAULT_SITE,
        "totals": {k: len(v) for k, v in buckets.items()},
    }
    json_path = OUTPUT_DIR / f"impressions-clicks_{timestamp}.json"
    json_path.write_text(json.dumps({"meta": meta, "pages": analyzed}, indent=2, default=str))
    latest_json = OUTPUT_DIR / "impressions-clicks_latest.json"
    latest_json.write_text(json.dumps({"meta": meta, "pages": analyzed}, indent=2, default=str))

    if analyzed:
        csv_path = OUTPUT_DIR / f"impressions-clicks_{timestamp}.csv"
        with open(csv_path, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=list(analyzed[0].keys()))
            writer.writeheader()
            writer.writerows(analyzed)
    return json_path


def main():
    parser = argparse.ArgumentParser(description="GSC Impressions-vs-Clicks Scanner")
    parser.add_argument("--days", type=int, default=DEFAULT_DAYS)
    parser.add_argument("--min-impressions", type=int, default=DEFAULT_MIN_IMPRESSIONS)
    parser.add_argument("--max-position", type=int, default=DEFAULT_MAX_POSITION)
    parser.add_argument("--min-ctr-gap", type=float, default=DEFAULT_MIN_CTR_GAP)
    parser.add_argument("--telegram", action="store_true", help="Send top opportunities to Telegram (needs TELEGRAM_BOT_TOKEN env)")
    args = parser.parse_args()

    token = get_gsc_token()
    if not token:
        print("ERROR: no GSC credentials (expected ~/.google/credentials/gsc-key.json)")
        sys.exit(1)

    analyzed, buckets, start_date, end_date = analyze(
        token, args.days, args.min_impressions, args.max_position, args.min_ctr_gap
    )

    # Summary table
    print(f"\nPages found: CLICKS_LEAK={len(buckets['CLICKS_LEAK'])}  "
          f"TITLE_FIX={len(buckets['TITLE_FIX'])}  CONTENT_GAP={len(buckets['CONTENT_GAP'])}")
    print("\nTop 20 opportunities (lost clicks = impressions × CTR gap):")
    for e in analyzed[:20]:
        print(f"  [{e['bucket']:11}] pos:{e['position']:5.1f} imp:{e['impressions']:6} "
              f"clicks:{e['clicks']:4} ctr:{e['ctr']:5.2f}%  {e['page'][:60]}")
        if e["top_query"]:
            print(f"                     ↳ top query: \"{e['top_query'][:60]}\"")

    if analyzed:
        path = save_output(analyzed, buckets, start_date, end_date)
        print(f"\nSaved to {path}")
        print(f"Totals: {json.dumps({k: len(v) for k, v in buckets.items()})}")

        if args.telegram:
            lines = [f"GSC Impressions-vs-Clicks ({start_date} → {end_date})",
                     f"Leaks: {len(buckets['CLICKS_LEAK'])}  Title-fix: {len(buckets['TITLE_FIX'])}  Content-gap: {len(buckets['CONTENT_GAP'])}",
                     ""]
            for e in analyzed[:10]:
                lines.append(f"{e['bucket']} pos {e['position']:.1f} | imp {e['impressions']} ctr {e['ctr']:.2f}% | {e['page']}")
                if e["top_query"]:
                    lines.append(f"    ↳ \"{e['top_query'][:55]}\"")
            send_telegram("\n".join(lines))


if __name__ == "__main__":
    main()
