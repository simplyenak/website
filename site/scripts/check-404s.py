#!/usr/bin/env python3
"""Daily 404 check: crawl sitemap, report broken URLs."""
import re
import sys
import urllib.request
import urllib.error
from html.parser import HTMLParser

BASE_URL = "https://simplyenak.com"
SITEMAP_INDEX = f"{BASE_URL}/sitemap-index.xml"
THRESHOLD = 10  # alert if >N 404s found
REPORT_LIMIT = 50
UA = "Mozilla/5.0 (SimplyEnak-SEO-Checker/1.0; +https://simplyenak.com)"

def fetch_text(url):
    """Fetch URL and return text content."""
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.read().decode('utf-8')

def extract_locs(xml_text):
    """Extract all <loc> URLs from sitemap XML."""
    return re.findall(r'<loc>([^<]+)</loc>', xml_text)

def fetch_sitemap_urls():
    """Fetch sitemap index and collect all page URLs."""
    all_urls = []
    seen = set()

    # Fetch index
    try:
        index_xml = fetch_text(SITEMAP_INDEX)
    except urllib.error.HTTPError as e:
        print(f"ERROR: Could not fetch sitemap index ({e.code})", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: Could not fetch sitemap index: {e}", file=sys.stderr)
        sys.exit(1)

    sitemap_urls = extract_locs(index_xml)
    print(f"Found {len(sitemap_urls)} sitemap files in index.")

    # Fetch each sitemap
    for sm_url in sitemap_urls:
        try:
            xml = fetch_text(sm_url)
        except Exception as e:
            print(f"  warn: could not fetch {sm_url}: {e}", file=sys.stderr)
            continue

        locs = extract_locs(xml)
        for loc in locs:
            loc = loc.strip().rstrip('/')
            if loc in seen:
                continue
            seen.add(loc)

            # Skip non-English pages
            locale_skip = any(f'/{lang}/' in loc for lang in ['de', 'es', 'fr', 'ja', 'ms', 'nl', 'pt', 'ru', 'zh'])
            if locale_skip:
                continue

            # Skip sitemap files
            if 'sitemap-' in loc:
                continue

            all_urls.append(loc)

    return all_urls

def check_url(url):
    """Check a single URL, return HTTP status code."""
    try:
        req = urllib.request.Request(url, headers={'User-Agent': UA})
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return 0  # connection error

def main():
    print("=" * 60)
    print("Daily 404 Check — Simply Enak")
    print("=" * 60)

    urls = fetch_sitemap_urls()
    print(f"\nChecking {len(urls)} URLs...\n")

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
            print(f"  {i+1}/{len(urls)} checked ({ok_count} ok, {len(not_found)} 404s)...")

    print(f"\n{'=' * 60}")
    print(f"RESULTS: {ok_count} OK | {len(not_found)} 404s | {len(errors)} other errors")
    print(f"{'=' * 60}")

    if not_found:
        print(f"\n🚨 404 NOT FOUND ({len(not_found)}):")
        for url in not_found[:REPORT_LIMIT]:
            print(f"  - {url}")
        if len(not_found) > REPORT_LIMIT:
            print(f"  ... and {len(not_found) - REPORT_LIMIT} more")

    if errors:
        print(f"\n⚠️  OTHER ERRORS ({len(errors)}):")
        for url, code in errors[:20]:
            print(f"  - {url} → {code}")

    if len(not_found) > THRESHOLD:
        print(f"\n🚨 ALERT: {len(not_found)} 404s found (threshold: {THRESHOLD})")
        sys.exit(1)
    else:
        print(f"\n✅ OK: {len(not_found)} 404s (threshold: {THRESHOLD})")
        sys.exit(0)

if __name__ == '__main__':
    main()
