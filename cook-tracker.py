#!/usr/bin/env python3
"""
cook-tracker.py — Track blog posts through Google's "let it cook" lifecycle.

Stages:
  new         — Published but not yet indexed (0-30 days)
  indexing    — Submitted, waiting for Google to crawl (30-60 days)
  building    — Indexed but no ranking yet (60-120 days)
  ranking     — Ranking 4-20, gaining impressions (120-180 days)
  performing  — Ranking < 4 or strong traffic (180+ days)

Usage:
  python3 cook-tracker.py                # Update all posts
  python3 cook-tracker.py --check        # Just show status
  python3 cook-tracker.py --submit       # Submit un-indexed posts to GSC
  python3 cook-tracker.py --json         # JSON output
"""

import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent
POST_DIR = ROOT / "site" / "src" / "data" / "post"
# Allow overriding the tracker JSON path via env (for read-only container mounts)
# — same convention as refresh-loop.py / gsc-impressions-clicks.py
TRACKER_FILE = Path(os.environ.get("COOK_TRACKER_FILE", str(ROOT / "content" / "cook-tracker.json")))
CREDENTIALS_PATH = os.path.expanduser("~/.google/credentials/gsc-key.json")

# Stage thresholds (days)
STAGE_THRESHOLDS = {
    "new": (0, 30),
    "indexing": (30, 60),
    "building": (60, 120),
    "ranking": (120, 180),
    "performing": (180, 99999),
}

STAGE_DESCRIPTIONS = {
    "new": "Published, not indexed. Submit to GSC.",
    "indexing": "In progress. Google crawling but not ranking.",
    "building": "Indexed, building authority. No rank yet.",
    "ranking": "Ranking 4-20. Gaining impressions.",
    "performing": "Ranking <4 or strong traffic. Matched intent.",
}


def get_gsc_token():
    """Load GSC credentials and return bearer token."""
    alt = [
        Path(CREDENTIALS_PATH),
        Path(os.path.expanduser("~/.skills-data/data-driven-product/configs/gsc-service-account.json")),
    ]
    cred = next((p for p in alt if p.exists()), None)
    if not cred:
        return None
    try:
        from google.oauth2 import service_account
        from google.auth.transport.requests import Request
        c = service_account.Credentials.from_service_account_file(
            str(cred), scopes=["https://www.googleapis.com/auth/webmasters.readonly"]
        )
        c.refresh(Request())
        return c.token
    except ImportError:
        return None
    except Exception as e:
        print(f"GSC auth error: {e}", file=sys.stderr)
        return None


def query_gsc_page(url_path, token):
    """Query GSC for a specific page path. Returns impressions/clicks/position/ctr."""
    if not token:
        return None
    enc = urllib.parse.quote("sc-domain:simplyenak.com", safe="")
    start = (datetime.now() - timedelta(days=28)).strftime("%Y-%m-%d")
    end = datetime.now().strftime("%Y-%m-%d")
    
    body = json.dumps({
        "startDate": start, "endDate": end, "dimensions": ["page"],
        "dimensionFilterGroups": [{"filters": [
            {"dimension": "page", "operator": "contains", "expression": url_path}
        ]}],
        "rowLimit": 5, "dataState": "all"
    }).encode()
    
    req = urllib.request.Request(
        f"https://www.googleapis.com/webmasters/v3/sites/{enc}/searchAnalytics/query",
        data=body
    )
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
        rows = resp.get("rows", [])
        if rows:
            return {
                "impressions": rows[0].get("impressions", 0),
                "clicks": rows[0].get("clicks", 0),
                "position": round(rows[0].get("position", 999), 1),
                "ctr": round(rows[0].get("ctr", 0), 3),
            }
    except Exception:
        pass
    return None


def query_gsc_index_status(url, token):
    """Check if a URL is indexed via GSC URL Inspection API."""
    if not token:
        return None
    enc = urllib.parse.quote("sc-domain:simplyenak.com", safe="")
    body = json.dumps({"inspectionUrl": url, "siteUrl": "sc-domain:simplyenak.com"}).encode()
    req = urllib.request.Request(
        "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
        data=body, method="POST"
    )
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
        result = resp.get("inspectionResult", {})
        index_result = result.get("indexStatusResult", {})
        verdict = index_result.get("verdict", "")
        coverage_state = index_result.get("coverageState", "")
        
        is_indexed = verdict in ("VERDICT_UNSPECIFIED", "PASS") and "not indexed" not in coverage_state.lower()
        return {
            "verdict": verdict,
            "coverage_state": coverage_state,
            "indexed": is_indexed,
        }
    except Exception:
        pass
    return None


def load_existing_tracker():
    """Load existing cook tracker data."""
    if TRACKER_FILE.exists():
        try:
            with open(TRACKER_FILE, "r") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            pass
    return {"posts": {}, "last_updated": None, "gsc_available": False}


def save_tracker(data):
    """Save tracker data to JSON."""
    TRACKER_FILE.parent.mkdir(exist_ok=True)
    with open(TRACKER_FILE, "w") as f:
        json.dump(data, f, indent=2, default=str)


def parse_post(path):
    """Parse a blog post frontmatter and extract key info."""
    try:
        content = path.read_text(encoding="utf-8")
    except IOError:
        return None
    
    parts = content.split("---", 2)
    if len(parts) < 3:
        return None
    
    fm, body = parts[1], parts[2]
    
    title = re.search(r'^title:\s*["\']?([^"\']+)["\']?', fm, re.MULTILINE)
    date_match = re.search(r'^publishDate:\s*(\S+)', fm, re.MULTILINE)
    desc = re.search(r'^description:\s*["\']?([^"\']+)["\']?', fm, re.MULTILINE)
    
    slug = path.stem
    url_path = f"/stories/{slug}"
    full_url = f"https://simplyenak.com{url_path}"
    title_str = title.group(1).strip().strip('"').strip("'") if title else slug
    date_str = date_match.group(1) if date_match else None
    desc_str = desc.group(1).strip().strip('"').strip("'") if desc else ""
    
    # Calculate days since published
    days_since = None
    if date_str:
        try:
            # Handle both ISO formats
            if "T" in date_str:
                pub_date = datetime.strptime(date_str[:10], "%Y-%m-%d")
            else:
                pub_date = datetime.strptime(date_str[:10], "%Y-%m-%d")
            days_since = (datetime.now() - pub_date).days
        except ValueError:
            pass
    
    # Determine cook stage
    stage = "unknown"
    if days_since is not None:
        for stage_name, (lo, hi) in STAGE_THRESHOLDS.items():
            if lo <= days_since < hi:
                stage = stage_name
                break
    
    # Extract target keyword (from title, remove stopwords)
    stopwords = {
        "what", "the", "a", "an", "is", "are", "was", "were", "do", "does", "did",
        "will", "would", "could", "should", "may", "might", "can", "to", "of",
        "in", "on", "at", "for", "with", "from", "by", "and", "or", "but", "not",
        "this", "that", "these", "those", "your", "my", "his", "her", "their", "our",
        "its", "you", "he", "she", "it", "they", "we", "i", "me", "guide", "how",
        "why", "when", "where", "most", "some", "actually", "find", "try", "during",
        "to", "about", "malaysia", "malaysian", "kuala", "lumpur", "penang", "kl",
    }
    title_words = [w.lower().strip() for w in title_str.split() if len(w) > 2]
    target_keywords = [w for w in title_words if w not in stopwords][:3]
    
    return {
        "slug": slug,
        "title": title_str,
        "description": desc_str[:120],
        "publish_date": date_str[:10] if date_str else None,
        "days_since_published": days_since,
        "stage": stage,
        "word_count": len(body.split()),
        "url_path": url_path,
        "full_url": f"https://simplyenak.com{url_path}",
        "target_keywords": target_keywords,
    }


def get_current_gsc_data(url_path, full_url, token):
    """Get current GSC data for a page."""
    if not token:
        return {"available": False}
    
    # Get search analytics (impressions, clicks, position)
    analytics = query_gsc_page(url_path, token)
    
    # Get index status (indexed or not)
    # Don't hammer GSC — this is slower, so do it only for un-indexed pages
    index_status = None
    if not analytics or analytics.get("impressions", 0) == 0:
        index_status = query_gsc_index_status(full_url, token)
        time.sleep(0.3)  # Rate limit for URL Inspection API
    
    return {
        "available": True,
        "analytics": analytics,
        "index_status": index_status,
    }


def update_tracker(check_only=False, submit=False):
    """Main function: update cook tracker data."""
    data = load_existing_tracker()
    
    # Find all blog posts
    posts = list(POST_DIR.glob("*.md"))
    if not posts:
        print("No blog posts found")
        return data
    
    token = get_gsc_token()
    if token:
        data["gsc_available"] = True
    else:
        data["gsc_available"] = False
        if not check_only:
            print("WARNING: No GSC credentials found. Only static data available.")
    
    # Parse all posts
    current_posts = {}
    for post_path in posts:
        post_info = parse_post(post_path)
        if not post_info:
            continue
        
        slug = post_info["slug"]
        
        # Preserve existing GSC data if check_only
        if check_only and slug in data["posts"]:
            existing = data["posts"][slug]
            post_info["gsc_history"] = existing.get("gsc_history", [])
            post_info["first_seen"] = existing.get("first_seen", datetime.now().isoformat())
            post_info["last_gsc_update"] = existing.get("last_gsc_update")
            post_info["indexed"] = existing.get("indexed")
            post_info["current_position"] = existing.get("current_position")
            post_info["best_position"] = existing.get("best_position")
            post_info["total_impressions"] = existing.get("total_impressions", 0)
            post_info["total_clicks"] = existing.get("total_clicks", 0)
        else:
            # Fresh scrape or update mode
            post_info["gsc_history"] = []
            post_info["first_seen"] = datetime.now().isoformat()
            post_info["last_gsc_update"] = None
            post_info["indexed"] = None
            post_info["current_position"] = None
            post_info["best_position"] = None
            post_info["total_impressions"] = 0
            post_info["total_clicks"] = 0
        
        # Query GSC for current data (unless check_only mode)
        if token and not check_only:
            gsc_data = get_current_gsc_data(
                post_info["url_path"], post_info["full_url"], token
            )
            
            if gsc_data["available"]:
                post_info["last_gsc_update"] = datetime.now().isoformat()
                
                if gsc_data["index_status"]:
                    post_info["indexed"] = gsc_data["index_status"]["indexed"]
                
                if gsc_data["analytics"]:
                    analytics = gsc_data["analytics"]
                    post_info["current_position"] = analytics["position"]
                    post_info["total_impressions"] = post_info.get("total_impressions", 0) + analytics["impressions"]
                    post_info["total_clicks"] = post_info.get("total_clicks", 0) + analytics["clicks"]
                    
                    # Track best position ever
                    best = post_info.get("best_position")
                    if best is None or (analytics["position"] < best and analytics["position"] > 0):
                        post_info["best_position"] = analytics["position"]
                    
                    # Append to history
                    post_info["gsc_history"].append({
                        "date": datetime.now().isoformat(),
                        "impressions": analytics["impressions"],
                        "clicks": analytics["clicks"],
                        "position": analytics["position"],
                        "ctr": analytics["ctr"],
                    })
                    # Keep last 12 records
                    post_info["gsc_history"] = post_info["gsc_history"][-12:]
                
                # Rate limit
                time.sleep(0.15)
        
        current_posts[slug] = post_info
    
    data["posts"] = current_posts
    data["last_updated"] = datetime.now().isoformat()
    
    # Compute summary statistics
    stage_counts = {}
    indexed_count = 0
    ranking_count = 0
    total_impressions = 0
    total_clicks = 0
    
    for slug, post in current_posts.items():
        stage = post["stage"]
        stage_counts[stage] = stage_counts.get(stage, 0) + 1
        
        if post.get("indexed"):
            indexed_count += 1
        if post.get("current_position") and post["current_position"] < 20:
            ranking_count += 1
        total_impressions += post.get("total_impressions", 0)
        total_clicks += post.get("total_clicks", 0)
    
    data["summary"] = {
        "total_posts": len(current_posts),
        "stage_distribution": stage_counts,
        "indexed_count": indexed_count,
        "ranking_count": ranking_count,
        "total_impressions": total_impressions,
        "total_clicks": total_clicks,
    }
    
    save_tracker(data)
    return data


def print_report(data):
    """Print a human-readable cook-stage report."""
    print("\n" + "=" * 70)
    print("  COOK TRACKER — Blog Post Lifecycle Report")
    print("=" * 70 + "\n")
    
    summary = data.get("summary", {})
    print(f"  Last updated: {data.get('last_updated', 'never')}")
    print(f"  GSC available: {'yes' if data.get('gsc_available') else 'no'}")
    print(f"  Total posts tracked: {summary.get('total_posts', 0)}")
    print(f"  Indexed: {summary.get('indexed_count', 0)}/{summary.get('total_posts', 0)}")
    print(f"  Ranking (<20): {summary.get('ranking_count', 0)}/{summary.get('total_posts', 0)}")
    print(f"  Total impressions: {summary.get('total_impressions', 0):,}")
    print(f"  Total clicks: {summary.get('total_clicks', 0):,}")
    
    # Stage distribution
    print("\n  Stage Distribution:")
    print("  " + "-" * 40)
    stage_dist = summary.get("stage_distribution", {})
    for stage, desc in STAGE_DESCRIPTIONS.items():
        count = stage_dist.get(stage, 0)
        bar = "█" * count + "░" * (10 - min(count, 10))
        print(f"    {stage:12} {bar} {count:2}  {desc}")
    
    # Post details
    print("\n  Post Details:")
    print("  " + "-" * 66)
    posts = data.get("posts", {})
    
    # Sort by days since published
    sorted_posts = sorted(posts.values(), key=lambda p: p.get("days_since_published") or 0, reverse=True)
    
    for post in sorted_posts:
        days = post.get("days_since_published", "?")
        stage = post.get("stage", "?")
        title = post.get("title", post["slug"])[:45]
        
        # Status indicators
        idx = "✓" if post.get("indexed") else "·" if post.get("indexed") is None else "✗"
        
        pos = post.get("current_position")
        if pos is None:
            pos_str = "   -"
        elif pos < 1:
            pos_str = "  <1"
        else:
            pos_str = f"{pos:5.1f}"
        
        imp = post.get("total_impressions", 0)
        if imp > 1000:
            imp_str = f"{imp/1000:.1f}k"
        else:
            imp_str = f"{imp:4}"
        
        print(f"    [{idx}] {days:3}d {stage:12} {pos_str} imp={imp_str:>5}  {title}")
    
    print("\n" + "=" * 70)


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Track blog post cook stages")
    parser.add_argument("--check", action="store_true", help="Only show current status, don't update")
    parser.add_argument("--submit", action="store_true", help="Submit un-indexed posts to GSC")
    parser.add_argument("--json", action="store_true", help="Output JSON")
    args = parser.parse_args()
    
    if args.submit:
        # Submit un-indexed posts via gsc-auto-index.py
        from subprocess import run
        result = run(
            ["python3", str(ROOT / "gsc-auto-index.py"), "--sitemap-only"],
            capture_output=True, text=True
        )
        print(result.stdout)
        if result.returncode != 0:
            print(result.stderr, file=sys.stderr)
    
    data = update_tracker(check_only=args.check)
    
    if args.json:
        print(json.dumps(data, indent=2, default=str))
    else:
        print_report(data)
    # Emit a concise machine-readable signal line the cron agent can reason over
    print()
    print("--- SIGNAL SUMMARY ---")
    c = 0
    for pid, p in sorted(data.get("posts", {}).items()):
        days = p.get("days_since_published") or 0
        imp = p.get("total_impressions") or 0
        clicks = p.get("total_clicks") or 0
        pos = p.get("current_position") or 0
        stage = p.get("stage", "?")
        flags = []
        if stage in ("building", "ranking") and days >= 60 and imp == 0:
            flags.append("INDEXED-BUT-0-IMPRESSIONS")
        if pos and 0 < pos < 20 and clicks == 0:
            flags.append("RANKING-20-0-CLICKS")
        if flags:
            c += 1
            print(f"  {pid}: stage={stage} days={days} imp={imp} pos={pos} -> {','.join(flags)}")
    print(f"total concerning: {c}")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
