#!/usr/bin/env python3
"""Daily 404 check: crawl sitemap, report broken URLs."""
import re
import sys
import time
import urllib.request
from collections import Counter

BASE_URL = "https://simplyenak.com"
SITEMAP_URL = f"{BASE_URL}/sitemap-index.xml"
THRESHOLD = 10  # only report if >N 404s found
REPORT_LIMIT = 50
CONCURRENCY = 5  # sequential for simplicity

def fetch_sitemap_urls(url):
    """Fetch sitemap index and extract all page URLs."""
    urls = []
    seen = set()

    def fetch_sitemap(site_url):
        try:
            with urllib.request.urlopen(site_url, timeout=10) as r:
                content = r.read().decode('utf-8')
        except Exception as e:
            print(f"  warn: could not fetch {site_url}: {e}", file=sys.stderr)
            return

        # Extract <loc> URLs
        for loc in re.findall(r'<loc>([^<]+)</loc>', content):
            loc = loc.strip()
            if loc in seen:
                continue
            seen.add(loc)
            # Skip non-English, non-canonical URLs
            if not loc.startswith(BASE_URL + '/'):
                continue
            if '/de/' in loc or '/es/' in loc or '/fr/' in loc or '/ja/' in loc or '/ms/' in loc or '/nl/' in loc or '/pt/' in loc or '/ru/' in loc or '/zh/' in loc:
                continue
            # Skip sitemap files themselves
            if '/sitemap-' in loc or '/sitemap-index' in loc:
                continue
            # Normalize: strip trailing slash for consistency
            clean = loc.rstrip('/')
            if clean not in seen:
                urls.append(clean)

    # Fetch index first
    fetch_sitemap(SITEMAP_URL)
    return urls

def check_url(url):
    """Check a single URL, return (url, status_code)."""
    try:
        req = urllib.request.Request(url, method='HEAD')
        req.add_header('User-Agent', 'Mozilla/5.0 (SimplyEnak-SEO/1.0)')
        with urllib.request.urlopen(req, timeout=15) as r:
            return url, r.status
    except urllib.error.HTTPError as e:
        return url, e.code
    except Exception:
        return url, 0  # connection error

def main():
    print("=== Daily 404 Check ===")
    print(f"Fetching sitemap from {SITEMAP_URL}...")

    urls = fetch_sitemap_urls(SITEMAP_URL)
    print(f"Found {len(urls)} URLs to check.")

    not_found = []
    errors = []
    ok_count = 0

    for i, url in enumerate(urls):
        status = check_url(url)
        if status == 404:
            not_found.append(url)
        elif status >= 400:
            errors.append((url, status))
        else:
            ok_count += 1

        if (i + 1) % 20 == 0:
            print(f"  checked {i+1}/{len(urls)}...")

    print(f"\nResults: {ok_count} OK, {len(not_found)} 404, {len(errors)} errors")

    if not_found:
        print(f"\n--- {len(not_found)} URLs returning 404 ---")
        for url in not_found[:REPORT_LIMIT]:
            print(f"  {url}")
        if len(not_found) > REPORT_LIMIT:
            print(f"  ... and {len(not_found) - REPORT_LIMIT} more")

    if errors:
        print(f"\n--- {len(errors)} URLs with other errors ---")
        for url, code in errors[:20]:
            print(f"  {url} → {code}")

    # Return exit code based on threshold
    if len(not_found) > THRESHOLD:
        print(f"\nALERT: {len(not_found)} 404s found (threshold: {THRESHOLD})")
        sys.exit(1)
    else:
        print(f"\nOK: {len(not_found)} 404s found (below threshold: {THRESHOLD})")
        sys.exit(0)

if __name__ == '__main__':
    main()
