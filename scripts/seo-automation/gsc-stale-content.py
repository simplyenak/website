#!/usr/bin/env python3
"""
Stale Content Report for Simply Enak (monthly).

Finds ranking pages whose content has not been touched in N months:
  DEFEND — GSC position 1-5 (refresh to hold the spot)
  CLIMB  — GSC position 6-20 (refresh to push onto page 1)

Last-modified source of truth: Payload snapshots in
site/src/data/content/stories.json and tours.json (synced via `npm run sync`
— run that first if Payload has newer edits than the snapshot).

Usage:
    python3 gsc-stale-content.py --days 28 --months 6

Output: .hermes/plans/stale-content-report.md (also echoed to stdout).
Auth: GSC service account at ~/.google/credentials/gsc-key.json.
"""
import argparse
import json
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

REPO = Path("/var/home/maarten/website-optimization")
REPORT = REPO / ".hermes" / "plans" / "stale-content-report.md"
CRED_PATH = Path.home() / ".google" / "credentials" / "gsc-key.json"
SITE = "sc-domain:simplyenak.com"
MIN_IMPRESSIONS = 10  # ignore pages with negligible traffic in window


def get_token():
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request
    creds = service_account.Credentials.from_service_account_file(
        str(CRED_PATH), scopes=["https://www.googleapis.com/auth/webmasters.readonly"])
    creds.refresh(Request())
    return creds.token


def fetch_gsc(token: str, days: int) -> dict:
    enc_site = urllib.parse.quote(SITE, safe="")
    end = datetime.now(timezone.utc).date() - timedelta(days=3)  # GSC lag
    start = end - timedelta(days=days - 1)
    body = json.dumps({
        "startDate": str(start), "endDate": str(end),
        "dimensions": ["page"], "rowLimit": 25000, "dataState": "all",
    }).encode()
    req = urllib.request.Request(
        f"https://www.googleapis.com/webmasters/v3/sites/{enc_site}/searchAnalytics/query",
        data=body)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    rows = json.loads(urllib.request.urlopen(req, timeout=60).read()).get("rows", [])
    pages = {}
    for row in rows:
        page = (row.get("keys") or [""])[0]
        if not page:
            continue
        if page.startswith("/"):
            page = "https://simplyenak.com" + page
        # normalize: strip locale prefix and trailing slash for doc matching,
        # but keep the original URL for the report
        pages[page] = {
            "clicks": row.get("clicks", 0),
            "impressions": row.get("impressions", 0),
            "position": round(row.get("position", 999), 1),
        }
    return pages


def load_doc_dates() -> dict:
    """Map URL path -> last-updated date from Payload snapshots (EN only;
    locale twins share the EN doc's freshness)."""
    dates = {}
    content = REPO / "site" / "src" / "data" / "content"
    for fname, prefix in (("stories.json", "/stories/"), ("tours.json", "/tours/")):
        path = content / fname
        if not path.exists():
            continue
        data = json.loads(path.read_text())
        items = data if isinstance(data, list) else data.get("stories") or data.get("tours") or []
        for doc in items:
            slug = doc.get("slug")
            when = doc.get("updatedAt") or doc.get("publishedDate") or doc.get("createdAt")
            if slug and when:
                dates[prefix + slug] = when[:10]
    return dates


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=28)
    ap.add_argument("--months", type=int, default=6)
    args = ap.parse_args()

    if not CRED_PATH.exists():
        print(f"ERROR: GSC key missing at {CRED_PATH}", file=sys.stderr)
        return 1

    try:
        token = get_token()
        pages = fetch_gsc(token, args.days)
    except Exception as e:
        print(f"ERROR: GSC fetch failed: {e}", file=sys.stderr)
        return 2

    doc_dates = load_doc_dates()
    cutoff = (datetime.now(timezone.utc) - timedelta(days=args.months * 30)).date()

    defend, climb, unknown = [], [], 0
    for url, m in pages.items():
        if m["impressions"] < MIN_IMPRESSIONS or m["position"] > 20:
            continue
        path = url.split("simplyenak.com", 1)[1]
        # strip locale prefix (e.g. /nl/stories/x -> /stories/x)
        parts = path.strip("/").split("/")
        doc_path = path
        if len(parts) > 1 and len(parts[0]) == 2:
            doc_path = "/" + "/".join(parts[1:])
        updated = doc_dates.get(doc_path.rstrip("/")) or doc_dates.get(doc_path.rstrip("/") + "/")
        if not updated:
            # tour pages also live under sub-paths (segments/, locations/, dietary/)
            base = "/" + "/".join(doc_path.strip("/").split("/")[:2])
            updated = doc_dates.get(base)
        if not updated:
            continue  # non-CMS page (homepage, static) — out of scope here
        if datetime.strptime(updated, "%Y-%m-%d").date() >= cutoff:
            continue  # fresh enough
        entry = f"{url} — pos {m['position']}, {m['impressions']} imps, last touched {updated}"
        (defend if m["position"] <= 5 else climb).append((m["impressions"], entry))
        unknown += 0

    defend.sort(reverse=True)
    climb.sort(reverse=True)

    lines = [f"# Stale Content Report (generated {datetime.now().strftime('%Y-%m-%d')}, "
             f"{args.months} months threshold)",
             "",
             f"Window: last {args.days} days. Refresh candidates: "
             f"{len(climb)} to climb, {len(defend)} to defend.",
             "After refreshing a page, run gsc-auto-index.py to request re-indexing.",
             "",
             f"## CLIMB (pos 6-20, stale) — {len(climb)}",
             ""]
    lines += [f"- {e}" for _, e in climb] or ["None."]
    lines += ["", f"## DEFEND (pos 1-5, stale) — {len(defend)}", ""]
    lines += [f"- {e}" for _, e in defend] or ["None."]
    lines.append("")

    text = "\n".join(lines)
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(text)
    print(text)
    return 0


if __name__ == "__main__":
    sys.exit(main())
