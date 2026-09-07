#!/usr/bin/env python3
"""
GSC Skill Feedback data pull for Simply Enak.

Compares the last N days of Search Console performance against the previous
N days, at page level (with top queries per page), and reports winners,
losers, position movers, and new entrants. Output feeds the monthly
"performance -> memory" loop: an agent (or Maarten) turns these diffs into
proposed skill updates in content/pending-changes/. This script only
produces data; it never edits anything.

Usage:
    python3 gsc-skill-feedback.py                # 28d vs prior 28d
    python3 gsc-skill-feedback.py --days 90     # custom window

Auth: service account at ~/.google/credentials/gsc-key.json (same as
ranking_movement_detector.py). Site: sc-domain:simplyenak.com.

Output: markdown to stdout + JSON to
~/.hermes-website/seo-reports/skill-feedback-<YYYY-MM>.json
"""
import argparse
import json
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

CRED_PATH = Path.home() / ".google" / "credentials" / "gsc-key.json"
REPORT_DIR = Path.home() / ".hermes-website" / "seo-reports"
SITE = "sc-domain:simplyenak.com"
# Noise floors: ignore pages below these impressions in BOTH windows.
MIN_TOTAL_IMPRESSIONS = 100
MIN_CLICKS_DELTA = 5
MIN_POS_DELTA = 3.0


def get_token():
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request
    creds = service_account.Credentials.from_service_account_file(
        str(CRED_PATH), scopes=["https://www.googleapis.com/auth/webmasters.readonly"])
    creds.refresh(Request())
    return creds.token


def fetch_window(token: str, start: str, end: str) -> dict:
    """Fetch page+query rows for a window; aggregate to page level."""
    enc_site = urllib.parse.quote(SITE, safe="")
    url = f"https://www.googleapis.com/webmasters/v3/sites/{enc_site}/searchAnalytics/query"
    body = json.dumps({
        "startDate": start, "endDate": end,
        "dimensions": ["page", "query"],
        "rowLimit": 25000, "dataState": "all",
    }).encode()
    req = urllib.request.Request(url, data=body)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    resp = urllib.request.urlopen(req, timeout=60)
    rows = json.loads(resp.read()).get("rows", [])

    pages = {}
    for row in rows:
        keys = row.get("keys", ["", ""])
        page, query = (keys + ["", ""])[:2]
        if not page:
            continue
        if page.startswith("/"):
            page = "https://simplyenak.com" + page
        p = pages.setdefault(page, {
            "clicks": 0, "impressions": 0, "pos_wsum": 0.0, "queries": {}})
        p["clicks"] += row.get("clicks", 0)
        p["impressions"] += row.get("impressions", 0)
        p["pos_wsum"] += row.get("position", 0) * row.get("impressions", 0)
        p["queries"][query] = p["queries"].get(query, 0) + row.get("clicks", 0)

    for p in pages.values():
        p["position"] = round(p["pos_wsum"] / p["impressions"], 1) if p["impressions"] else None
        p["top_queries"] = sorted(p["queries"], key=p["queries"].get, reverse=True)[:3]
        del p["pos_wsum"], p["queries"]
    return pages


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=28)
    args = ap.parse_args()

    if not CRED_PATH.exists():
        print(f"ERROR: GSC key missing at {CRED_PATH}", file=sys.stderr)
        return 1

    # GSC data is ~2-3 days stale; end both windows 3 days ago, back to back.
    end = datetime.now(timezone.utc).date() - timedelta(days=3)
    cur_s, cur_e = end - timedelta(days=args.days - 1), end
    prev_s, prev_e = cur_s - timedelta(days=args.days), cur_s - timedelta(days=1)

    try:
        token = get_token()
        cur = fetch_window(token, str(cur_s), str(cur_e))
        prev = fetch_window(token, str(prev_s), str(prev_e))
    except Exception as e:
        print(f"ERROR: GSC fetch failed: {e}", file=sys.stderr)
        return 1

    winners, losers, pos_up, pos_down, new_entrants = [], [], [], [], []
    for page, c in cur.items():
        p = prev.get(page)
        total_imp = c["impressions"] + (p["impressions"] if p else 0)
        if total_imp < MIN_TOTAL_IMPRESSIONS and not (p is None and c["clicks"] >= MIN_CLICKS_DELTA):
            continue
        d_clicks = c["clicks"] - (p["clicks"] if p else 0)
        d_pos = (c["position"] - p["position"]) if (p and p["position"] and c["position"]) else None
        row = {"page": page, "clicks": c["clicks"], "prev_clicks": p["clicks"] if p else 0,
               "impressions": c["impressions"], "position": c["position"],
               "prev_position": p["position"] if p else None,
               "delta_clicks": d_clicks, "delta_position": d_pos,
               "top_queries": c["top_queries"]}
        if p is None and c["clicks"] >= MIN_CLICKS_DELTA:
            new_entrants.append(row)
            continue
        if d_clicks >= MIN_CLICKS_DELTA:
            winners.append(row)
        elif d_clicks <= -MIN_CLICKS_DELTA:
            losers.append(row)
        if d_pos is not None and abs(d_pos) >= MIN_POS_DELTA and c["impressions"] >= 50:
            (pos_up if d_pos < 0 else pos_down).append(row)

    winners.sort(key=lambda r: -r["delta_clicks"])
    losers.sort(key=lambda r: r["delta_clicks"])
    pos_up.sort(key=lambda r: r["delta_position"])
    pos_down.sort(key=lambda r: -r["delta_position"])

    report = {
        "generated": datetime.now(timezone.utc).isoformat(timespec="minutes"),
        "window_current": [str(cur_s), str(cur_e)],
        "window_previous": [str(prev_s), str(prev_e)],
        "totals": {
            "clicks": sum(p["clicks"] for p in cur.values()),
            "prev_clicks": sum(p["clicks"] for p in prev.values()),
            "impressions": sum(p["impressions"] for p in cur.values()),
            "pages_current": len(cur), "pages_previous": len(prev),
        },
        "winners": winners[:12], "losers": losers[:12],
        "position_up": pos_up[:8], "position_down": pos_down[:8],
        "new_entrants": new_entrants[:8],
    }

    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    month = datetime.now(timezone.utc).strftime("%Y-%m")
    out = REPORT_DIR / f"skill-feedback-{month}.json"
    out.write_text(json.dumps(report, indent=1))

    t = report["totals"]
    lines = [f"GSC skill-feedback diff  {cur_s}..{cur_e} vs {prev_s}..{prev_e}",
             f"Clicks {t['prev_clicks']} -> {t['clicks']}  |  Impressions {t['impressions']:,}"]
    for title, key in [("WINNERS (clicks gained)", "winners"),
                       ("LOSERS (clicks lost)", "losers"),
                       ("POSITION UP", "position_up"),
                       ("POSITION DOWN", "position_down"),
                       ("NEW ENTRANTS", "new_entrants")]:
        lines.append(f"\n== {title} ==")
        for r in report[key]:
            pos = f" pos {r['prev_position']}->{r['position']}" if r["prev_position"] else ""
            lines.append(f"  {r['delta_clicks']:+d} clicks{pos}  {r['page']}")
            if r["top_queries"]:
                lines.append(f"    queries: {', '.join(r['top_queries'])}")
        if not report[key]:
            lines.append("  (none above thresholds)")
    lines.append(f"\nJSON: {out}")
    print("\n".join(lines))
    return 0


if __name__ == "__main__":
    sys.exit(main())
