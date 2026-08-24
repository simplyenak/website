#!/usr/bin/env python3
"""GSC query-level overlap between durian-guide-2026 and eating-durians."""
import json, sys, urllib.parse, urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

def get_gsc_token():
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
                str(cred_path), scopes=["https://www.googleapis.com/auth/webmasters.readonly"])
            creds.refresh(Request())
            return creds.token
        except Exception:
            continue
    return None

def gsc_query(token, start, end, dims, row_limit=25000):
    body = json.dumps({"startDate": start, "endDate": end, "dimensions": dims,
                       "rowLimit": row_limit, "dataState": "all"}).encode()
    enc = urllib.parse.quote("sc-domain:simplyenak.com", safe="")
    url = f"https://www.googleapis.com/webmasters/v3/sites/{enc}/searchAnalytics/query"
    req = urllib.request.Request(url, data=body)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8")).get("rows", [])

token = get_gsc_token()
if not token:
    sys.exit("no token")

end = datetime.now(timezone.utc).strftime("%Y-%m-%d")
start = (datetime.now(timezone.utc) - timedelta(days=28)).strftime("%Y-%m-%d")
print(f"=== Query overlap {start} -> {end} ===")

def norm(u):
    return u.rstrip("/") + "/"

rows = gsc_query(token, start, end, ["query", "page"])
by_page = {}
for r in rows:
    keys = r.get("keys", [])
    if len(keys) != 2:
        continue
    q, page = keys
    if "durian" not in q.lower() and "durian" not in page.lower():
        continue
    by_page.setdefault(norm(page), []).append({
        "query": q, "imp": r.get("impressions", 0), "clicks": r.get("clicks", 0),
        "pos": round(r.get("position", 999), 1)})

targets = {
    "durian-guide-2026": "https://simplyenak.com/stories/durian-guide-2026/",
    "eating-durians": "https://simplyenak.com/stories/eating-durians/",
}

# Build query -> set of pages, find queries hitting BOTH
q_to_pages = {}
for page, qs in by_page.items():
    for qd in qs:
        q_to_pages.setdefault(qd["query"], set()).add(norm(page))

print("\n=== Queries where BOTH pages rank ===")
overlap_items = []
for q, pages in q_to_pages.items():
    if norm(targets["durian-guide-2026"]) in pages and norm(targets["eating-durians"]) in pages:
        total_imp = 0
        details = []
        for p in pages:
            for d in by_page[p]:
                if d["query"] == q:
                    total_imp += d["imp"]
                    details.append((p.split("/")[-2], d["pos"], d["imp"], d["clicks"]))
        overlap_items.append((q, total_imp, details))

for q, total_imp, details in sorted(overlap_items, key=lambda x: -x[1]):
    print(f"  '{q}': imp {total_imp} -> {details}")

print("\n=== eating-durians top 15 queries ===")
for d in sorted(by_page.get(norm(targets["eating-durians"]), []), key=lambda x: -x["imp"])[:15]:
    print(f"  pos {d['pos']:6.1f} imp {d['imp']:5} clicks {d['clicks']:3}  '{d['query']}'")

print("\n=== durian-guide-2026 top 15 queries ===")
for d in sorted(by_page.get(norm(targets["durian-guide-2026"]), []), key=lambda x: -x["imp"])[:15]:
    print(f"  pos {d['pos']:6.1f} imp {d['imp']:5} clicks {d['clicks']:3}  '{d['query']}'")
