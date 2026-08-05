#!/usr/bin/env python3
"""
OpenSEO MCP Client for Simply Enak.

Calls OpenSEO MCP tools to fetch keyword data, competitor insights,
backlinks, and domain overview. Outputs JSON reports for cron consumption.

Usage:
    python3 scripts/seo-automation/openseo_client.py --action keywords --keywords "food tour malaysia" "penang street food"
    python3 scripts/seo-automation/openseo_client.py --action domain-overview
    python3 scripts/seo-automation/openseo_client.py --action competitor --domain competitor.com
    python3 scripts/seo-automation/openseo_client.py --action backlinks
    python3 scripts/seo-automation/openseo_client.py --action serp --keyword "food tour malaysia"
    python3 scripts/seo-automation/openseo_client.py --action cron  # run all daily checks
"""

import argparse
import json
import os
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

# ── Configuration ──────────────────────────────────────────────────────
OPENSEO_MCP_URL = os.environ.get("OPENSEO_MCP_URL", "http://tasks.open-seo_seo:3001/mcp")
PROJECT_ID = os.environ.get("OPENSEO_PROJECT_ID", "68f79602-5c49-441b-807c-63e22a9eebe3")
DOMAIN = "simplyenak.com"
LOCATION_CODE = 2840  # Malaysia
LANGUAGE_CODE = "en"

OUTPUT_DIR = Path(os.environ.get("OPENSEO_OUTPUT_DIR", "/tmp/openseo-output"))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ── Default seed keywords for research ─────────────────────────────────
SEED_KEYWORDS = [
    "food tour malaysia",
    "penang street food",
    "kuala lumpur food tour",
    "malaysia food tour",
    "georgetown night food",
    "durian season malaysia",
    "chow kit market",
    "malaysian street food",
]

# ── Competitor domains to track ────────────────────────────────────────
COMPETITOR_DOMAINS = [
    "foodtourmalaysia.com",
    "penangfoodie.com",
    "klfoodtour.com",
    "malaysia-travel-guide.com",
]


def mcp_call(tool_name: str, arguments: dict) -> dict:
    """Call an OpenSEO MCP tool and return the result."""
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
            # MCP may return SSE or plain JSON
            for line in body.split("\n"):
                if line.startswith("data: "):
                    return json.loads(line[6:])
            return json.loads(body)
    except Exception as e:
        return {"error": str(e)}


def research_keywords(seeds: list[str]) -> dict:
    """Research keyword data (volume, difficulty, CPC) for seed keywords."""
    result = mcp_call("research_keywords", {
        "projectId": PROJECT_ID,
        "seeds": [{"seed": s} for s in seeds],
        "country": "MY",
        "language": "en",
    })
    return result


def get_domain_overview(domain: str = DOMAIN) -> dict:
    """Get organic traffic and keyword count for a domain."""
    result = mcp_call("get_domain_overview", {
        "projectId": PROJECT_ID,
        "domain": domain,
        "country": "MY",
    })
    return result


def get_domain_keywords(domain: str = DOMAIN, limit: int = 50) -> dict:
    """Get top organic keywords for a domain."""
    result = mcp_call("get_domain_keyword_suggestions", {
        "projectId": PROJECT_ID,
        "domain": domain,
        "country": "MY",
        "limit": limit,
    })
    return result


def get_backlinks_overview(domain: str = DOMAIN) -> dict:
    """Get backlink profile summary."""
    result = mcp_call("get_backlinks_overview", {
        "projectId": PROJECT_ID,
        "domain": domain,
        "country": "MY",
    })
    return result


def get_serp_results(keyword: str) -> dict:
    """Get live Google SERP results for a keyword."""
    result = mcp_call("get_serp_results", {
        "projectId": PROJECT_ID,
        "keywords": [keyword],
        "country": "MY",
        "language": "en",
    })
    return result


def get_competitor_gap(domain: str) -> dict:
    """Get keyword gap analysis for a competitor domain."""
    result = mcp_call("get_domain_keyword_suggestions", {
        "projectId": PROJECT_ID,
        "domain": domain,
        "country": "MY",
        "limit": 100,
    })
    return result


def save_report(name: str, data: dict) -> Path:
    """Save a report to the output directory."""
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    path = OUTPUT_DIR / f"{name}_{timestamp}.json"
    path.write_text(json.dumps(data, indent=2, default=str))
    # Also save as latest
    latest = OUTPUT_DIR / f"{name}_latest.json"
    latest.write_text(json.dumps(data, indent=2, default=str))
    return path


def run_keywords(args):
    """Run keyword research."""
    keywords = args.keywords or SEED_KEYWORDS
    print(f"Researching {len(keywords)} seed keywords...")
    result = research_keywords(keywords)
    path = save_report("keywords", result)
    print(f"Saved to {path}")
    # Print summary
    if "result" in result and "structuredContent" in result["result"]:
        content = result["result"]["structuredContent"]
        for r in content.get("results", []):
            if r.get("ok"):
                print(f"  {r['seed']}: {r['rowCount']} keywords ({r['source']})")
    return result


def run_domain_overview(args):
    """Run domain overview."""
    print(f"Fetching domain overview for {DOMAIN}...")
    result = get_domain_overview(DOMAIN)
    path = save_report("domain_overview", result)
    print(f"Saved to {path}")
    if "result" in result and "structuredContent" in result["result"]:
        content = result["result"]["structuredContent"]
        print(f"  Organic traffic: {content.get('organicTraffic')}")
        print(f"  Organic keywords: {content.get('organicKeywords')}")
    return result


def run_competitor(args):
    """Run competitor analysis."""
    domains = [args.domain] if args.domain else COMPETITOR_DOMAINS
    all_results = {}
    for domain in domains:
        print(f"Analyzing competitor: {domain}...")
        result = get_competitor_gap(domain)
        all_results[domain] = result
        if "result" in result and "structuredContent" in result["result"]:
            content = result["result"]["structuredContent"]
            keywords = content.get("keywords", [])
            print(f"  {domain}: {len(keywords)} keywords found")
    path = save_report("competitors", all_results)
    print(f"Saved to {path}")
    return all_results


def run_backlinks(args):
    """Run backlink monitoring."""
    print(f"Fetching backlink overview for {DOMAIN}...")
    result = get_backlinks_overview(DOMAIN)
    path = save_report("backlinks", result)
    print(f"Saved to {path}")
    if "result" in result and "structuredContent" in result["result"]:
        content = result["result"]["structuredContent"]
        print(f"  Backlinks: {content.get('backlinks')}")
        print(f"  Referring domains: {content.get('referringDomains')}")
    return result


def run_serp(args):
    """Run SERP check."""
    keyword = args.keyword or "food tour malaysia"
    print(f"Fetching SERP for: {keyword}...")
    result = get_serp_results(keyword)
    path = save_report(f"serp_{keyword.replace(' ', '_')}", result)
    print(f"Saved to {path}")
    return result


def run_cron(args):
    """Run all daily checks."""
    print("=== OpenSEO Daily Cron ===")
    timestamp = datetime.now(timezone.utc).isoformat()
    report = {"timestamp": timestamp, "results": {}}

    # 1. Domain overview
    print("\n[1/4] Domain overview...")
    try:
        report["results"]["domain_overview"] = get_domain_overview(DOMAIN)
        print("  OK")
    except Exception as e:
        print(f"  FAILED: {e}")
        report["results"]["domain_overview"] = {"error": str(e)}

    # 2. Keyword research (top seeds)
    print("\n[2/4] Keyword research...")
    try:
        report["results"]["keywords"] = research_keywords(SEED_KEYWORDS[:5])
        print("  OK")
    except Exception as e:
        print(f"  FAILED: {e}")
        report["results"]["keywords"] = {"error": str(e)}

    # 3. Backlinks
    print("\n[3/4] Backlink overview...")
    try:
        report["results"]["backlinks"] = get_backlinks_overview(DOMAIN)
        print("  OK")
    except Exception as e:
        print(f"  FAILED: {e}")
        report["results"]["backlinks"] = {"error": str(e)}

    # 4. Competitor snapshot (just top competitor)
    print("\n[4/4] Competitor snapshot...")
    try:
        report["results"]["competitor"] = get_competitor_gap(COMPETITOR_DOMAINS[0])
        print("  OK")
    except Exception as e:
        print(f"  FAILED: {e}")
        report["results"]["competitor"] = {"error": str(e)}

    path = save_report("daily_cron", report)
    print(f"\nFull report saved to {path}")
    return report


def main():
    parser = argparse.ArgumentParser(description="OpenSEO MCP Client")
    parser.add_argument("--action", required=True,
                        choices=["keywords", "domain-overview", "competitor", "backlinks", "serp", "cron"])
    parser.add_argument("--keywords", nargs="+", help="Seed keywords for research")
    parser.add_argument("--domain", help="Domain for competitor/backlink analysis")
    parser.add_argument("--keyword", help="Single keyword for SERP check")
    args = parser.parse_args()

    actions = {
        "keywords": run_keywords,
        "domain-overview": run_domain_overview,
        "competitor": run_competitor,
        "backlinks": run_backlinks,
        "serp": run_serp,
        "cron": run_cron,
    }
    actions[args.action](args)


if __name__ == "__main__":
    main()
