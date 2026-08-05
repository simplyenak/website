#!/usr/bin/env python3
"""
GSC Striking Distance Scanner — enhanced with OpenSEO keyword volume.

Combines GSC position/impression data with DataForSEO search volume/difficulty
to find the highest-opportunity keywords: high impressions + low CTR + positions 5-20.

Output: JSON/CSV of ranked opportunities.

Usage:
    python3 scripts/seo-automation/gsc-striking-distance.py --days 28 --limit 20 --colony-json
    python3 scripts/seo-automation/gsc-striking-distance.py --gsc-json ./gsc-export.json --volume
    python3 scripts/seo-automation/gsc-striking-distance.py --cron
"""

import argparse
import csv
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

# ── OpenSEO integration ────────────────────────────────────────────────
OPENSEO_MCP_URL = os.environ.get("OPENSEO_MCP_URL", "http://open-seo_seo:3001/mcp")
PROJECT_ID = os.environ.get("OPENSEO_PROJECT_ID", "68f79602-5c49-441b-807c-63e22a9eebe3")

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
OUTPUT_DIR = REPO_ROOT / ".hermes" / "seo-reports" / "openseo"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ── Defaults ───────────────────────────────────────────────────────────
DEFAULT_LOCATION_CODE = 2840  # Malaysia
DEFAULT_LANGUAGE_CODE = "en"
DEFAULT_MIN_IMPRESSIONS = 100
DEFAULT_MAX_POSITION = 20
DEFAULT_MIN_POSITION = 5
DEFAULT_LIMIT = 25


def mcp_call(tool_name: str, arguments: dict) -> dict:
    """Call an OpenSEO MCP tool and return the result."""
    import urllib.request
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {"name": tool_name, "arguments": arguments},
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        OPENSEO_MCP_URL,
        data=data,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            body = resp.read().decode("utf-8")
            for line in body.split("\n"):
                if line.startswith("data: "):
                    return json.loads(line[6:])
            return json.loads(body)
    except Exception as e:
        return {"error": str(e)}


def get_keyword_volume(keywords: list[str]) -> dict:
    """Get search volume and difficulty for a list of keywords."""
    result = mcp_call("get_keyword_metrics", {
        "projectId": PROJECT_ID,
        "keywords": [{"keyword": kw} for kw in keywords],
        "country": "MY",
        "language": "en",
    })
    # Parse structured content
    volume_map = {}
    if "result" in result and "structuredContent" in result["result"]:
        content = result["result"]["structuredContent"]
        for kw_data in content.get("keywords", []):
            keyword = kw_data.get("keyword", "").lower()
            volume_map[keyword] = kw_data
    return volume_map


def parse_gsc_json(gsc_data: list[dict]) -> list[dict]:
    """Parse GSC search analytics data."""
    parsed = []
    for row in gsc_data:
        keys = row.get("keys", [])
        if not keys:
            continue
        query = keys[0]
        position = row.get("position", 999)
        impressions = row.get("impressions", 0)
        clicks = row.get("clicks", 0)
        ctr = row.get("ctr", 0)
        parsed.append({
            "query": query,
            "position": round(position, 1),
            "impressions": impressions,
            "clicks": clicks,
            "ctr": round(ctr * 100, 2),
        })
    return parsed


def filter_striking_distance(gsc_data: list[dict],
                              min_pos: int = DEFAULT_MIN_POSITION,
                              max_pos: int = DEFAULT_MAX_POSITION,
                              min_imp: int = DEFAULT_MIN_IMPRESSIONS,
                              max_clicks: int = 3) -> list[dict]:
    """Filter for striking distance keywords."""
    return [
        row for row in gsc_data
        if min_pos <= row["position"] <= max_pos
        and row["impressions"] >= min_imp
        and row["clicks"] < max_clicks
    ]


def score_opportunities(striking: list[dict], volume_map: dict) -> list[dict]:
    """Score and enrich opportunities with search volume data."""
    scored = []
    for row in striking:
        query = row["query"].lower()
        vol_data = volume_map.get(query, {})
        search_volume = vol_data.get("searchVolume", 0)
        difficulty = vol_data.get("keywordDifficulty")
        cpc = vol_data.get("cpc")
        intent = vol_data.get("intent", "unknown")

        # Score: impressions × (1/position) × (1-CTR)
        score = row["impressions"] * (1 / row["position"]) * (1 - row["ctr"] / 100)
        if search_volume:
            # Boost score by volume if available
            score *= (search_volume / 100)

        scored.append({
            **row,
            "search_volume": search_volume,
            "keyword_difficulty": difficulty,
            "cpc": cpc,
            "intent": intent,
            "opportunity_score": round(score, 1),
        })

    scored.sort(key=lambda x: x["opportunity_score"], reverse=True)
    return scored


def get_gsc_token():
    """Get GSC access token from the service account key (~/.google/credentials/gsc-key.json)."""
    import os
    cred_candidates = [
        Path.home() / ".google" / "credentials" / "gsc-key.json",
        Path("/home/maarten/.google/credentials/gsc-key.json"),
    ]
    for cred_path in cred_candidates:
        if not cred_path.exists():
            continue
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
            continue
    return None


def save_output(data: list[dict], name: str):
    """Save results to JSON and CSV."""
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")

    # JSON
    json_path = OUTPUT_DIR / f"{name}_{timestamp}.json"
    json_path.write_text(json.dumps(data, indent=2, default=str))
    latest_json = OUTPUT_DIR / f"{name}_latest.json"
    latest_json.write_text(json.dumps(data, indent=2, default=str))

    # CSV
    if data:
        csv_path = OUTPUT_DIR / f"{name}_{timestamp}.csv"
        with open(csv_path, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=data[0].keys())
            writer.writeheader()
            writer.writerows(data)
        latest_csv = OUTPUT_DIR / f"{name}_latest.csv"
        with open(latest_csv, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=data[0].keys())
            writer.writeheader()
            writer.writerows(data)

    return json_path


def run_from_gsc_json(args):
    """Run analysis from a GSC JSON export."""
    gsc_data = json.loads(Path(args.gsc_json).read_text())
    parsed = parse_gsc_json(gsc_data)
    print(f"Parsed {len(parsed)} queries from GSC data")

    striking = filter_striking_distance(
        parsed,
        min_pos=args.min_position,
        max_pos=args.max_position,
        min_imp=args.min_impressions,
        max_clicks=args.max_clicks,
    )
    print(f"Found {len(striking)} striking distance keywords")

    volume_map = {}
    if args.volume and striking:
        print("Fetching search volume data from OpenSEO...")
        queries = [s["query"] for s in striking]
        # Batch in groups of 100 (API limit)
        for i in range(0, len(queries), 100):
            batch = queries[i:i+100]
            batch_vol = get_keyword_volume(batch)
            volume_map.update(batch_vol)
            print(f"  Fetched {len(batch_vol)} volume data points")

    scored = score_opportunities(striking, volume_map)
    path = save_output(scored, "striking_distance")
    print(f"Saved to {path}")

    # Print top 10
    print("\nTop 10 opportunities:")
    for s in scored[:10]:
        vol_str = f"vol:{s['search_volume']}" if s["search_volume"] else "vol:N/A"
        print(f"  {s['query'][:50]:50} pos:{s['position']:5.1f} imp:{s['impressions']:5} {vol_str} score:{s['opportunity_score']:.1f}")

    return scored


def run_cron(args):
    """Run daily cron analysis — fetch fresh GSC query data, then analyze."""
    print("=== GSC Striking Distance Scanner (Cron) ===")
    # Fetch real GSC query-level data via the service account (same pattern as
    # seo-ranking-pipeline.py / artifact-rank-monitor.py).
    token = get_gsc_token()
    if not token:
        print("ERROR: no GSC credentials (expected ~/.google/credentials/gsc-key.json)")
        return []

    import urllib.parse, urllib.request
    end_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    start_date = (datetime.now(timezone.utc) - __import__("datetime").timedelta(days=args.days)).strftime("%Y-%m-%d")
    body = json.dumps({
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": ["query"],
        "rowLimit": 25000,
        "dataState": "all",
    }).encode()
    enc_site = urllib.parse.quote("sc-domain:simplyenak.com", safe="")
    url = f"https://www.googleapis.com/webmasters/v3/sites/{enc_site}/searchAnalytics/query"
    req = urllib.request.Request(url, data=body)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            rows = json.loads(resp.read().decode("utf-8")).get("rows", [])
    except Exception as e:
        print(f"GSC query error: {e}")
        return []
    print(f"Fetched {len(rows)} query rows from GSC")

    parsed = parse_gsc_json(rows)
    striking = filter_striking_distance(
        parsed,
        min_pos=args.min_position,
        max_pos=args.max_position,
        min_imp=args.min_impressions,
        max_clicks=args.max_clicks,
    )
    print(f"Found {len(striking)} striking distance keywords")

    volume_map = {}
    if args.volume and striking:
        print("Fetching search volume data from OpenSEO...")
        queries = [s["query"] for s in striking]
        for i in range(0, len(queries), 100):
            batch = queries[i:i+100]
            batch_vol = get_keyword_volume(batch)
            volume_map.update(batch_vol)
            print(f"  Fetched {len(batch_vol)} volume data points")

    scored = score_opportunities(striking, volume_map)
    scored = scored[:args.limit]
    if scored:
        path = save_output(scored, "striking_distance")
        print(f"Saved to {path}")
        print("\nTop opportunities:")
        for s in scored[:10]:
            vol_str = f"vol:{s['search_volume']}" if s["search_volume"] else "vol:N/A"
            print(f"  {s['query'][:50]:50} pos:{s['position']:5.1f} imp:{s['impressions']:5} {vol_str} score:{s['opportunity_score']:.1f}")

    # --colony-json: write the bridge's expected input file
    if args.colony_json:
        colony_data = {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "candidates": [
                {
                    "query": s["query"],
                    "score": s["opportunity_score"],
                    "position": s["position"],
                    "impressions": s["impressions"],
                    "clicks": s["clicks"],
                    "search_volume": s.get("search_volume", 0),
                    # The bridge (striking-to-colony.py build_link_data) needs
                    # these to build proper colony page entries — without them
                    # it registers entries with empty slugs (/stories// URLs).
                    "suggested_slug": slugify(s["query"]),
                    "suggested_title": s["query"].title(),
                    "suggested_url": f"/stories/{slugify(s['query'])}/",
                }
                for s in scored
            ],
        }
        colony_path = REPO_ROOT / ".hermes" / "tmp" / "striking-distance-colonies.json"
        colony_path.parent.mkdir(parents=True, exist_ok=True)
        colony_path.write_text(json.dumps(colony_data, indent=2))
        print(f"Colony candidates written to {colony_path} ({len(colony_data['candidates'])} candidates)")

    return scored


def slugify(text: str) -> str:
    """Turn a query into a URL slug (lowercase, hyphens, alnum only)."""
    import re
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug


def main():
    parser = argparse.ArgumentParser(description="GSC Striking Distance Scanner with OpenSEO Volume")
    parser.add_argument("--gsc-json", help="Path to GSC search analytics JSON export")
    parser.add_argument("--days", type=int, default=28, help="Lookback days (default: 28)")
    parser.add_argument("--limit", type=int, default=DEFAULT_LIMIT, help="Max results")
    parser.add_argument("--min-impressions", type=int, default=DEFAULT_MIN_IMPRESSIONS)
    parser.add_argument("--max-position", type=int, default=DEFAULT_MAX_POSITION)
    parser.add_argument("--min-position", type=int, default=DEFAULT_MIN_POSITION)
    parser.add_argument("--max-clicks", type=int, default=3)
    parser.add_argument("--volume", action="store_true", help="Fetch search volume from OpenSEO")
    parser.add_argument("--colony-json", action="store_true", help="Output colony-compatible JSON")
    parser.add_argument("--cron", action="store_true", help="Run in cron mode")
    args = parser.parse_args()

    if args.cron:
        return run_cron(args)
    elif args.gsc_json:
        return run_from_gsc_json(args)
    else:
        parser.error("Provide --gsc-json or --cron")


if __name__ == "__main__":
    main()
