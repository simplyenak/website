#!/usr/bin/env python3
"""
Phase 3 — competitor keyword gaps via DataForSEO keywords_for_site -> Grist.

For each domain in the Grist Competitors table, pull the Google Ads "Keywords
For Site" set (DataForSEO keywords_data/google_ads/keywords_for_site) and
upsert into CompetitorKeywords. Then compute gaps: competitor keywords NOT in
our own GSCQueries, upserted into CompetitorGaps. The top open gaps are fed
into the ContentPipeline as Source="competitor" rows so the kanban board is
the single source of truth for what to build next.

Funding gate: the account is unfunded -> every task returns status 40200
(Payment Required) even though the path is valid (top-level 20000). On 40200
the script logs it and writes nothing, exits 0. No invented data. Top up
~$10-20 (Phase 2) and the same script fills the tables on its next cron run.

Endpoint (verified 2026-09-15):
  POST /v3/keywords_data/google_ads/keywords_for_site/live
  body: [{"target": domain, "location_code": 2840, "language_code": "en", "limit": N}]
  task result: {data: {keywords: [{keyword, ...metrics}]}, ...}
Costs are pay-per-task (~$0.01-0.05 each); a few competitor domains weekly is
pennies.

Credentials: DATAFORSEO_API_KEY base64(login:password) — see dfs_key().

Usage:
  python3 competitor-keywords.py            # all Competitors, last ISO week
  python3 competitor-keywords.py --dry-run  # 1 probe call, no writes
"""
import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import grist  # noqa: E402

API = "https://api.dataforseo.com/v3"
LOCATION_CODE = 2840    # DataForSEO location_code for Malaysia (int, not the string "2840")
LANGUAGES = ["en"]      # en covers our market; ms adds little for keyword-gap signal
EP = "keywords_data/google_ads/keywords_for_site/live"


def dfs_key():
    """DataForSEO key = base64(login:password). Env first, then the
    grist-mcp / data-driven-product .env files (no secrets in code)."""
    key = os.environ.get("DATAFORSEO_API_KEY", "")
    if key:
        return key.strip()
    for p in (
        os.path.expanduser("~/.config/grist-mcp/.env"),
        os.path.expanduser("~/.skills-data/data-driven-product/.env"),
        os.path.expanduser("~/.skills-data/data-driven-product/configs/grist.env"),
    ):
        if not os.path.exists(p):
            continue
        for line in open(p):
            line = line.strip()
            if line.startswith("DATAFORSEO_API_KEY="):
                return line.split("=", 1)[1].strip().strip("'\"")
    return ""


def dfs_call(payload, timeout=90):
    """POST one task. Returns (task_status_code, task_result).
    40200 = valid path, unfunded; 20000 = success; 40503 = bad payload."""
    key = dfs_key()
    if not key:
        return None, "DATAFORSEO_API_KEY not set"
    req = urllib.request.Request(
        f"{API}/{EP}", data=json.dumps([payload]).encode(),
        headers={"Content-Type": "application/json", "Authorization": f"Basic {key}"},
        method="POST")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            out = json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        try:
            out = json.loads(e.read().decode())
        except Exception:
            return None, e.read().decode()[:200]
    t = (out.get("tasks") or [{}])[0]
    return t.get("status_code"), t.get("result")


def keywords_from_result(result):
    """keywords_for_site -> result.data.keywords: [{keyword, ...}].
    Defensive: accept the flat or nested shape, pull a volume/position hint."""
    if not result:
        return []
    data = result.get("data") or result
    kws = data.get("keywords") or data.get("items") or []
    out = []
    for k in kws:
        kw = k.get("keyword") or k.get("query")
        if not kw:
            continue
        out.append({
            "keyword": kw,
            "position": k.get("position") or k.get("average_position"),
            "volume": k.get("volume") or k.get("search_volume") or 0,
        })
    return out


def last_week_start():
    now = datetime.now(timezone.utc).date()
    this_mon = now - timedelta(days=now.weekday())
    return this_mon - timedelta(days=7)


def normalize(s):
    return (s or "").lower().strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="1 probe call, no writes")
    ap.add_argument("--limit", type=int, default=100, help="keywords per domain")
    args = ap.parse_args()

    if args.dry_run:
        code, res = dfs_call({"target": "simplyenak.com",
                              "location_code": LOCATION_CODE,
                              "language_code": "en", "limit": 5})
        if code == 40200:
            print("UNFUNDED — DataForSEO task 40200 Payment Required. "
                  "Top up ~$10-20 and re-run; no writes made.")
            return 0
        if code == 20000:
            print(f"CREDIT OK — probe returned {len(keywords_from_result(res))} keywords.")
            return 0
        print(f"PROBE FAILED — status {code}: {str(res)[:200]}")
        return 1

    wk_start = last_week_start()
    wk_ts = grist.ts(wk_start)
    competitors = [r.get("fields", {}).get("Domain")
                   for r in grist.get_records("Competitors")]
    competitors = [normalize(d) for d in competitors if d]
    if not competitors:
        print("No Competitors rows in Grist — seed the Competitors table first.")
        return 1

    for domain in competitors:
        print(f"--- {domain} (week {wk_start}) ---")
        rows = []
        for lang in LANGUAGES:
            code, res = dfs_call({"target": domain, "location_code": LOCATION_CODE,
                                  "language_code": lang, "limit": args.limit})
            if code == 40200:
                print(f"  [{lang}] UNFUNDED (40200) — skipping pulls; no writes.")
                return 0
            if code != 20000:
                print(f"  [{lang}] ERROR status {code}: {str(res)[:150]}")
                continue
            for kw in keywords_from_result(res)[:args.limit]:
                rows.append({
                    "Domain": domain, "WeekStart": wk_ts,
                    "Keyword": kw["keyword"], "Position": kw.get("position"),
                    "Volume": kw.get("volume") or 0,
                    "Source": f"dfs-keywords-for-site-{lang}",
                })
        r1 = grist.upsert("CompetitorKeywords", ["Domain", "WeekStart", "Keyword"], rows)
        print(f"  CompetitorKeywords: {r1['posted']} new, {r1['patched']} refreshed "
              f"({len(rows)} rows)")

    # Gaps: competitor keywords absent from our GSCQueries.
    ours = {normalize(r.get("fields", {}).get("Query"))
            for r in grist.get_records("GSCQueries")}
    comp = grist.get_records("CompetitorKeywords", {"WeekStart": [wk_ts]})
    gaps = {}
    for r in comp:
        f = r.get("fields", {})
        kw = normalize(f.get("Keyword"))
        if not kw or kw in ours:
            continue
        gaps[(f.get("Domain"), kw)] = {
            "pos": f.get("Position"), "vol": f.get("Volume")}
    gap_rows = [{
        "Domain": d, "WeekStart": wk_ts, "GapKeyword": kw,
        "CompPosition": g.get("pos"), "Volume": g.get("vol"), "Status": "open",
    } for (d, kw), g in gaps.items()]
    r2 = grist.upsert("CompetitorGaps", ["Domain", "WeekStart", "GapKeyword"], gap_rows)
    print(f"  CompetitorGaps: {r2['posted']} new ({len(gap_rows)} open this week)")

    # Feed the top open gaps into the content pipeline (todo rows only).
    active = {r.get("fields", {}).get("Query"): r.get("fields", {})
              for r in grist.get_records("ContentPipeline")}
    pipe_rows = []
    for g in sorted(gap_rows, key=lambda x: (x.get("Volume") or 0), reverse=True)[:20]:
        q = g["GapKeyword"]
        if q in active and active[q].get("Status") in ("todo", "drafting",
                                                        "awaiting-approval", "approved"):
            continue
        pipe_rows.append({
            "Query": q, "Source": "competitor", "Bucket": "90 days",
            "Status": "todo", "Notes": f"competitor gap ({g['Domain']}, vol {g.get('Volume')})",
        })
    r3 = grist.upsert("ContentPipeline", ["Query"], pipe_rows)
    print(f"  ContentPipeline: {r3['posted']} new gap rows")
    print("done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
