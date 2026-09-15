#!/usr/bin/env python3
"""
Phase 3 — backlink + anchor profile via DataForSEO -> Grist BacklinkSnapshot.

Replaces the dormant anchor section of scripts/backlink-audit.py with a
DataForSEO pay-per-task source (per the site-optimization dataforseo reference).
Each run pulls backlinks/summary/live + backlinks/anchors/live for a domain,
upserts one BacklinkSnapshot row per (Domain, week), and records the top
anchors so the Dooley anchor-health ratios (branded / naked / exact-match /
generic / suspicious) can be read directly in Grist.

Funding gate: same 40200 degrade as competitor-keywords.py — no invented
numbers; an unfunded week shows as an absent row.

Credentials: DATAFORSEO_API_KEY base64(login:password) from
~/.skills-data/data-driven-product/.env on the server.

Usage:
  python3 backlink-snapshot.py                       # both tracked domains
  python3 backlink-snapshot.py --domain simplyenak.com
  python3 backlink-snapshot.py --dry-run            # credit probe
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
DOMAINS = ["simplyenak.com", "culinarytravelexperts.com"]


def dfs_key():
    """DataForSEO key = base64(login:password). Env first, then the
    data-driven-product .env file (same pattern as BING_WEBMASTER_API_KEY)."""
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


def call(endpoint, payload):
    key = dfs_key()
    if not key:
        return None, "DATAFORSEO_API_KEY not set"
    req = urllib.request.Request(
        f"{API}/{endpoint}", data=json.dumps([payload]).encode(),
        headers={"Content-Type": "application/json", "Authorization": f"Basic {key}"},
        method="POST")
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            out = json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:300]
    t = (out.get("tasks") or [{}])[0]
    return t.get("status_code"), t.get("result")


def anchor_bands(anchors):
    """Classify anchors into Dooley bands. anchors: list of {anchor_text, count}."""
    def has(text, *pats):
        low = (text or "").lower()
        return any(p in low for p in pats)
    bands = {"branded": 0, "naked": 0, "exact": 0, "generic": 0, "suspicious": 0, "other": 0}
    for a in anchors:
        text = a.get("anchor_text") or a.get("anchor") or ""
        count = a.get("count") or 1
        low = text.lower().strip()
        if has(text, "simplyenak", "simply enak", "culinary travel"):
            bands["branded"] += count
        elif low in ("", "-", "more", "click here", "read more", "website", "here"):
            bands["naked"] += count
        elif has(text, "food tour", "kuala lumpur", "penang", "kangar", "tour", "malaysia", "malaysian", "malay food"):
            bands["exact"] += count
        elif has(text, "casino", "sex", "viagra", "loan", "loan", "porn", "crypto", "bet"):
            bands["suspicious"] += count
        else:
            bands["generic"] += count
    return bands


def week_start():
    now = datetime.now(timezone.utc).date()
    this_mon = now - timedelta(days=now.weekday())
    return this_mon - timedelta(days=7)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--domain")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    domains = [args.domain] if args.domain else DOMAINS
    wk = grist.ts(week_start())

    for domain in domains:
        if args.dry_run:
            code, res = call("backlinks/summary/live", {"target": domain, "limit": 1})
            if code == 40200:
                print(f"[{domain}] UNFUNDED (40200) — top up and re-run. No writes.")
            elif code == 20000:
                d = (res or {}).get("data", {})
                print(f"[{domain}] CREDIT OK — {d.get('backlinks_count','?')} backlinks "
                      f"from {d.get('referring_domains_count','?')} domains.")
            else:
                print(f"[{domain}] status {code}: {str(res)[:200]}")
            continue

        code, summary = call("backlinks/summary/live", {"target": domain, "limit": 100})
        if code == 40200:
            print(f"[{domain}] UNFUNDED — skipping. No writes this week.")
            continue
        if code != 20000:
            print(f"[{domain}] summary error {code}: {str(summary)[:200]}")
            continue
        sdata = (summary or {}).get("data", {})

        code2, anchors = call("backlinks/anchors/live", {"target": domain, "limit": 100})
        top_anchors = []
        if code2 == 20000:
            rows = ((anchors or {}).get("data", {}) or {}).get("keywords", [])
            top_anchors = rows[:10]
        else:
            print(f"[{domain}] anchors error {code2} — storing summary only")

        bands = anchor_bands(top_anchors)
        anchor_str = "; ".join(
            f"{(a.get('anchor_text') or a.get('anchor')) or '(empty)'} x{a.get('count',1)}"
            for a in top_anchors[:6]
        )
        note = (f"Dooley bands: branded={bands['branded']} naked={bands['naked']} "
                f"exact={bands['exact']} generic={bands['generic']} suspicious={bands['suspicious']}")
        grist.upsert("BacklinkSnapshot", ["Domain", "WeekStart"], [{
            "Domain": domain,
            "WeekStart": wk,
            "RefDomains": sdata.get("referring_domains_count"),
            "TotalBacklinks": sdata.get("backlinks_count"),
            "TopAnchors": anchor_str or None,
            "Note": note,
        }])
        print(f"[{domain}] BacklinkSnapshot upserted: {sdata.get('referring_domains_count')} domains, "
              f"{sdata.get('backlinks_count')} links.")
    print("done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
