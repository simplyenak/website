#!/usr/bin/env python3
"""Submit new/updated pages to GSC for indexing.

Usage: python3 scripts/gsc-auto-index.py [--sitemap-only] [--url=https://...]
"""
import json, os, re, subprocess, sys, urllib.parse, urllib.request
from pathlib import Path

SITE_URL = "sc-domain:simplyenak.com"
SITEMAP_URL = "https://simplyenak.com/sitemap-index.xml"
SCOPE = "https://www.googleapis.com/auth/webmasters"

def get_token():
    for p in [os.path.expanduser("~/.google/credentials/gsc-key.json"),
              os.path.expanduser("~/.skills-data/data-driven-product/configs/gsc-service-account.json"),
              os.path.expanduser("~/.config/claude-seo/google-api.json")]:
        if Path(p).exists():
            from google.oauth2 import service_account
            from google.auth.transport.requests import Request
            c = service_account.Credentials.from_service_account_file(p, scopes=[SCOPE])
            c.refresh(Request()); return c.token
    print("ERROR: GSC creds not found"); sys.exit(1)

def submit_sitemap(token):
    enc = urllib.parse.quote(SITE_URL, safe="")
    url = f"https://www.googleapis.com/webmasters/v3/sites/{enc}/sitemaps/{urllib.parse.quote(SITEMAP_URL, safe='')}"
    req = urllib.request.Request(url, method="PUT")
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Length", "0")
    try:
        urllib.request.urlopen(req, timeout=15)
        print(f"Sitemap submitted: {SITEMAP_URL}")
    except urllib.error.HTTPError as e:
        print(f"Sitemap failed: HTTP {e.code}")

def inspect(url, token):
    body = json.dumps({"inspectionUrl": url, "siteUrl": SITE_URL}).encode()
    req = urllib.request.Request(
        "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
        data=body, method="POST")
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    try:
        resp = urllib.request.urlopen(req, timeout=15)
        s = json.loads(resp.read()).get("inspectionResult",{}).get("indexStatusResult",{}).get("coverageState","?")
        print(f"  {url} -> {s}")
    except urllib.error.HTTPError as e:
        print(f"  {url} -> HTTP {e.code}")

def detect():
    root = Path(__file__).resolve().parent
    try:
        r = subprocess.run(["git","diff","--name-status","HEAD~1","HEAD"],
            capture_output=True, text=True, timeout=10, cwd=root)
        urls = []
        for line in r.stdout.strip().split("\n"):
            if not line.strip(): continue
            st, fp = line.split("\t", 1)
            m = re.match(r"site/src/data/post/(.+)\.md$", fp)
            if m: urls.append((st, f"https://simplyenak.com/blog/{m.group(1)}/"))
            m = re.match(r"site/src/data/content/stories/(.+)\.md$", fp)
            if m: urls.append((st, f"https://simplyenak.com/stories/{m.group(1)}/"))
        return urls
    except: return []

if __name__ == "__main__":
    single = None; sitemap_only = "--sitemap-only" in sys.argv
    for a in sys.argv[1:]:
        if a.startswith("--url="): single = a.split("=",1)[1]
    token = get_token()
    print("\n=== GSC Auto-Indexing ===\n")
    submit_sitemap(token)
    if single:
        inspect(single, token)
    elif not sitemap_only:
        urls = detect()
        if urls:
            print(f"\n{len(urls)} pages:")
            for st, url in urls:
                print(f"  [{'NEW' if st=='A' else 'MOD'}] {url}")
                inspect(url, token)
        else:
            print("No new pages detected.")
    print("\nDone.")
