#!/usr/bin/env python3
"""
Backlink & Anchor Profile Audit — Simply Enak SEO
====================================================
Audits the backlink/trust profile of a domain using the sources we
actually have credentials for:

  1. GSC Search Analytics (branded vs non-branded query share)  — always runs
  2. Common Crawl web graph (PageRank / harmonic centrality proxy) — always runs
  3. Moz Link Explorer (DA/PA, anchors, spam score)             — runs IF key present

Outputs a markdown report to .hermes/seo-reports/ and appends a JSON snapshot
to backlink-history.json for trend tracking.

The anchor-text ratio check (Dooley method: top anchors should be branded
+ naked URL) needs Moz. Without a Moz key the report clearly states the
anchor section is SKIPPED — it never invents data.

Usage:
    python3 scripts/backlink-audit.py                              # both domains
    python3 scripts/backlink-audit.py --domain simplyenak.com
    python3 scripts/backlink-audit.py --domain culinarytravelexperts.com
    python3 scripts/backlink-audit.py --moz                      # require Moz key
    python3 scripts/backlink-audit.py --cron                      # quiet, for cron

Env:
    MOZ_API_KEY        accessId:secret for Moz v2 REST API (optional)
    GOOGLE_APPLICATION_CREDENTIALS   path to GSC service account JSON
                       (defaults to ~/.config/claude-seo/google-api.json)
    CLAUDE_SEO_SCRIPTS path to claude-seo scripts dir for commoncrawl_graph.py
                       (defaults to ~/.hermes-website/skills/claude-seo/scripts)
"""

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

try:
    import requests
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request
except ImportError:
    print("Error: requests + google-auth required", file=sys.stderr)
    sys.exit(1)

# ── Paths & config ────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = REPO_ROOT / ".hermes" / "seo-reports"
HISTORY_FILE = OUTPUT_DIR / "backlink-history.json"

GSC_CRED = os.environ.get(
    "GOOGLE_APPLICATION_CREDENTIALS",
    os.path.expanduser("~/.config/claude-seo/google-api.json"),
)
CLAUDE_SEO_SCRIPTS = Path(
    os.environ.get(
        "CLAUDE_SEO_SCRIPTS",
        os.path.expanduser("~/.hermes-website/skills/claude-seo/scripts"),
    )
)

GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"
GSC_BASE = "https://www.googleapis.com/webmasters/v3/sites"
DAYS = 90

# Domains we operate. The "sc-domain:" form is what the service account
# has access to (verified 2026-08-16).
DOMAINS = {
    "simplyenak.com": "sc-domain:simplyenak.com",
    "culinarytravelexperts.com": "sc-domain:culinarytravelexperts.com",
}

# Brand terms per domain (query contains any of these => branded)
BRAND_TERMS = {
    "simplyenak.com": ["simply enak", "simplyenak", "enak food tours"],
    "culinarytravelexperts.com": [
        "culinary travel experts",
        "culinarytravelexperts",
    ],
}

# Anchor text buckets (Moz data) — Dooley-style health check
ANCHOR_SUSPICIOUS_TERMS = [
    "casino", "porn", "xxx", "viagra", "pharmacy", "slot", "betting",
    "loan", "payday", "日", "的", "と", "の",  # CJK anchor spam
]

ANCHOR_GENERIC_TERMS = ["click here", "website", "learn more", "read more", "this site", "here"]


# ── GSC helpers ───────────────────────────────────────────────────────
def gsc_client():
    if not Path(GSC_CRED).exists():
        return None, f"GSC credentials not found at {GSC_CRED}"
    creds = service_account.Credentials.from_service_account_file(
        GSC_CRED, scopes=[GSC_SCOPE]
    )
    creds.refresh(Request())
    return creds, None


def gsc_query(creds, property_id, body):
    """Run a Search Analytics query; returns rows or []."""
    r = requests.post(
        f"{GSC_BASE}/{property_id}/searchAnalytics/query",
        headers={"Authorization": "Bearer " + creds.token},
        json=body,
        timeout=30,
    )
    if r.status_code != 200:
        try:
            detail = r.json().get("error", {}).get("message", "") or r.text[:200]
        except Exception:
            detail = r.text[:200]
        return None, f"GSC query failed {r.status_code}: {detail[:200]}"
    return r.json().get("rows", []), None


def analyze_branded_share(creds, domain):
    """Branded vs non-branded query split over the window."""
    end = datetime.now(timezone.utc)
    start = end - timedelta(days=DAYS)
    body = {
        "startDate": start.strftime("%Y-%m-%d"),
        "endDate": end.strftime("%Y-%m-%d"),
        "dimensions": ["query"],
        "rowLimit": 25000,
    }
    rows, err = gsc_query(creds, DOMAINS[domain], body)
    if err:
        return {"error": err}
    if not rows:
        return {"error": "no query data"}

    terms = BRAND_TERMS[domain]
    branded = {"clicks": 0, "impressions": 0, "queries": 0}
    non_branded = {"clicks": 0, "impressions": 0, "queries": 0}
    top = sorted(rows, key=lambda r: -r.get("clicks", 0))[:15]

    for row in rows:
        q = (row.get("keys") or [""])[0].lower()
        bucket = branded if any(t in q for t in terms) else non_branded
        bucket["clicks"] += row.get("clicks", 0)
        bucket["impressions"] += row.get("impressions", 0)
        bucket["queries"] += 1

    total_clicks = branded["clicks"] + non_branded["clicks"] or 1
    total_impr = branded["impressions"] + non_branded["impressions"] or 1

    return {
        "window_days": DAYS,
        "branded": branded,
        "non_branded": non_branded,
        "branded_clicks_pct": round(100 * branded["clicks"] / total_clicks, 1),
        "branded_impr_pct": round(100 * branded["impressions"] / total_impr, 1),
        "brand_queries": [
            {"q": (r.get("keys") or [""])[0], "clicks": r.get("clicks", 0),
             "impressions": r.get("impressions", 0), "pos": round(r.get("position", 0), 1)}
            for r in top
        ],
    }


# ── Common Crawl helpers ──────────────────────────────────────────────
def common_crawl_domain(domain):
    """Run claude-seo commoncrawl_graph.py for a domain."""
    script = CLAUDE_SEO_SCRIPTS / "commoncrawl_graph.py"
    if not script.exists():
        return {"error": f"commoncrawl_graph.py not found at {script}"}
    try:
        proc = subprocess.run(
            [sys.executable, str(script), domain, "--json"],
            capture_output=True, text=True, timeout=180,
        )
        if proc.returncode != 0:
            return {"error": proc.stderr.strip()[:300]}
        return json.loads(proc.stdout)
    except (subprocess.TimeoutExpired, json.JSONDecodeError) as e:
        return {"error": str(e)}


# ── Moz helpers (optional) ────────────────────────────────────────────
def moz_metrics(domain):
    """DA/PA + anchor text via claude-seo moz_api.py (needs MOZ_API_KEY)."""
    script = CLAUDE_SEO_SCRIPTS / "moz_api.py"
    if not script.exists():
        return {"error": "moz_api.py not found"}
    env = dict(os.environ)
    if not env.get("MOZ_API_KEY") and Path(os.path.expanduser(
            "~/.config/claude-seo/backlinks-api.json")).exists():
        # let backlinks_auth.py pick it up from config file
        pass

    out = {"metrics": None, "anchors": None, "error": None}
    for sub_cmd, key in (("metrics", "metrics"), ("anchors", "anchors")):
        try:
            proc = subprocess.run(
                [sys.executable, str(script), sub_cmd, f"https://{domain}", "--json"],
                capture_output=True, text=True, timeout=120, env=env,
            )
            if proc.returncode == 0 and proc.stdout.strip():
                out[key] = json.loads(proc.stdout)
            else:
                out["error"] = proc.stderr.strip()[:200] or proc.stdout.strip()[:200]
        except (subprocess.TimeoutExpired, json.JSONDecodeError) as e:
            out["error"] = str(e)
    return out


def classify_anchors(anchor_rows):
    """Bucket Moz anchor text rows into branded / naked / exact / generic / suspicious."""
    if not anchor_rows:
        return None
    buckets = {"branded": 0, "naked_url": 0, "exact_match": 0, "generic": 0, "suspicious": 0, "other": 0}
    total = 0
    for row in anchor_rows:
        # Moz anchor rows: {anchor_text: str, external_pages: n, ...} — accept variants
        text = row.get("anchor_text") or row.get("anchor") or row.get("key") or ""
        count = row.get("external_pages") or row.get("count") or row.get("internal_pages") or 1
        total += count
        low = text.lower().strip()
        if any(t in low for t in ANCHOR_SUSPICIOUS_TERMS):
            buckets["suspicious"] += count
        elif low.startswith(("http://", "https://", "www.")) or domain_in(low):
            buckets["naked_url"] += count
        elif any(t in low for t in ANCHOR_GENERIC_TERMS):
            buckets["generic"] += count
        elif low and len(low.split()) <= 4 and " " in low.strip():
            buckets["exact_match"] += count
        else:
            buckets["other"] += count
    return {"buckets": buckets, "total": total}


def domain_in(text: str) -> bool:
    return "simplyenak" in text or "culinarytravelexperts" in text


# ── Report generation ─────────────────────────────────────────────────
def health_line(ok: bool, label: str, detail: str = "") -> str:
    mark = "✅" if ok else ("⚠️" if detail.startswith("SKIP") else "❌")
    return f"{mark} {label}" + (f" — {detail}" if detail else "")


def generate_report(results: dict, domains_audited: list[str]) -> str:
    lines = []
    lines.append("# Backlink & Trust Profile Audit")
    lines.append(f"\n**Generated:** {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    lines.append(f"**Window:** last {DAYS} days (GSC branded share)")
    lines.append("\n---\n")

    for domain in domains_audited:
        r = results.get(domain, {})
        lines.append(f"\n## {domain}\n")

        # GSC branded share
        gsc = r.get("gsc_branded_share", {})
        lines.append("### 1. Branded search share (GSC)")
        if "error" in gsc:
            lines.append(health_line(False, "GSC", gsc["error"]))
        else:
            b = gsc.get("branded", {})
            nb = gsc.get("non_branded", {})
            lines.append(health_line(
                gsc.get("branded_clicks_pct", 0) >= 20,
                f"Branded {gsc.get('branded_clicks_pct')}% of clicks "
                f"({b.get('clicks',0)}/{b.get('clicks',0)+nb.get('clicks',0)})",
                "branded ≥20% = healthy brand demand (site quality gate)"
            ))
            lines.append(f"  - Impressions: branded {gsc.get('branded_impr_pct')}% "
                         f"({b.get('impressions',0)}) vs non-branded ({nb.get('impressions',0)})")
            lines.append("  - Top queries:")
            for q in gsc.get("brand_queries", [])[:8]:
                lines.append(f"    - `{q['q']}` — {q['clicks']} clicks, {q['impressions']} impr, pos {q['pos']}")

        # Common Crawl
        cc = r.get("common_crawl", {})
        lines.append("\n### 2. Domain graph presence (Common Crawl, free)")
        if cc.get("error"):
            lines.append(health_line(False, "Common Crawl", cc["error"]))
        else:
            data = cc.get("data", cc) if isinstance(cc, dict) else cc
            meta = cc.get("metadata", {}) if isinstance(cc, dict) else {}
            if not isinstance(data, dict):
                data = {}
            lines.append(f"  - Latest release: {data.get('latest_release') or meta.get('release', '?')}")
            lines.append(f"  - In crawl: {data.get('in_crawl')}  In rankings: {data.get('in_rankings')}")
            lines.append(f"  - PageRank: {data.get('pagerank')} (rank {data.get('pagerank_rank')})")
            lines.append(f"  - Harmonic centrality: {data.get('harmonic_centrality')} "
                         f"(rank {data.get('harmonic_centrality_rank')})")
            lines.append(f"  - Hosts in graph (n_hosts): {data.get('n_hosts')}")
            if data.get("note"):
                lines.append(f"  - Note: {data['note']}")
            if not data:
                lines.append("  - (no graph data)")

        # Moz
        moz = r.get("moz", {})
        lines.append("\n### 3. Moz Link Explorer (anchor ratios — Dooley check)")
        if moz.get("error") and not moz.get("metrics") and not moz.get("anchors"):
            lines.append(health_line(False, "Moz", "SKIP — no MOZ_API_KEY. Anchor ratio check "
                                                    "requires a paid Moz/Ahrefs/Semrush backlink "
                                                    "API (Moz free tier is a 7-day trial, not "
                                                    "suitable for monthly runs)."))
            lines.append("  - Free alternatives already covered: GSC branded-share + Common Crawl graph.")
            lines.append("  - Add key: `export MOZ_API_KEY=accessId:secret`, re-run (one-off snapshot).")
        else:
            m = moz.get("metrics") or {}
            md = m.get("data", m) if isinstance(m, dict) else {}
            if md:
                lines.append(f"  - DA: {md.get('domain_authority', '?')}  "
                             f"PA: {md.get('page_authority', '?')}  "
                             f"Spam score: {md.get('spam_score', '?')}")
            anchors = moz.get("anchors") or {}
            ad = anchors.get("data", anchors) if isinstance(anchors, dict) else {}
            rows = ad.get("anchors") or ad.get("rows") or (ad if isinstance(ad, list) else None)
            if rows:
                classified = classify_anchors(rows)
                if classified and classified.get("total"):
                    buckets = classified["buckets"]
                    lines.append(f"  - Anchor buckets (n={classified['total']}):")
                    for name in ("branded", "naked_url", "exact_match", "generic", "suspicious", "other"):
                        pct = 100 * buckets[name] / classified["total"]
                        lines.append(f"    - {name}: {buckets[name]} ({pct:.1f}%)")
            else:
                lines.append("  - No anchor rows returned by Moz (or quota).")

    lines.append("\n---\n")
    lines.append("## What healthy looks like (Dooley checklist)\n")
    lines.append("- Branded + naked URL should be the top 2-4 anchors")
    lines.append("- Exact-match anchors < 10%; generic 15-25%; brand 40-60%")
    lines.append("- Branded search ≥ 20% of clicks = brand demand exists (site quality gate)")
    lines.append("- Suspicious anchors (casino/porn/CJK) = toxic profile, investigate")
    lines.append("- Re-run monthly to trend DR-equivalents and branded share\n")

    lines.append("## Next steps\n")
    lines.append("1. If anchor section skipped: add a Moz free-tier key and re-run.")
    lines.append("2. If suspicious anchors found: export list, review, disavow if confirmed.")
    lines.append("3. Watch branded share trend in backlink-history.json.")
    return "\n".join(lines)


# ── Main ──────────────────────────────────────────────────────────────
def main():
    ap = argparse.ArgumentParser(description="Backlink & anchor profile audit")
    ap.add_argument("--domain", choices=list(DOMAINS) + ["both"], default="both")
    ap.add_argument("--moz", action="store_true", help="fail if no Moz key")
    ap.add_argument("--cron", action="store_true", help="quiet output")
    args = ap.parse_args()

    domains = list(DOMAINS) if args.domain == "both" else [args.domain]
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    creds, cred_err = gsc_client()
    if cred_err:
        print(f"⚠ {cred_err}", file=sys.stderr)
        creds = None

    moz_key = os.environ.get("MOZ_API_KEY")
    if args.moz and not moz_key:
        print("Error: --moz requested but no MOZ_API_KEY set", file=sys.stderr)
        sys.exit(1)

    results = {}
    for domain in domains:
        print(f"📡 Auditing {domain}...")
        r = {}
        if creds:
            r["gsc_branded_share"] = analyze_branded_share(creds, domain)
        else:
            r["gsc_branded_share"] = {"error": cred_err}
        print(f"  🌐 Common Crawl graph...")
        r["common_crawl"] = common_crawl_domain(domain)
        if moz_key:
            print(f"  🔗 Moz metrics + anchors...")
            r["moz"] = moz_metrics(domain)
        else:
            r["moz"] = {"error": "no key"}
        results[domain] = r

    report = generate_report(results, domains)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d")
    report_file = OUTPUT_DIR / f"backlink-audit-{stamp}.md"
    report_file.write_text(report)

    # Append JSON snapshot for trend tracking
    history = {}
    if HISTORY_FILE.exists():
        try:
            history = json.loads(HISTORY_FILE.read_text())
        except json.JSONDecodeError:
            history = {}
    ts = datetime.now(timezone.utc).isoformat()
    for domain in domains:
        history.setdefault(domain, {})[ts] = {
            "gsc": results[domain].get("gsc_branded_share", {}),
            "common_crawl": results[domain].get("common_crawl", {}),
            "moz": results[domain].get("moz", {}),
        }
    HISTORY_FILE.write_text(json.dumps(history, indent=2))

    if not args.cron:
        print(report)
    else:
        # cron: one-line summary per domain
        for domain in domains:
            gsc = results[domain].get("gsc_branded_share", {})
            cc = results[domain].get("common_crawl", {})
            moz = results[domain].get("moz", {})
            print(f"{domain}: branded_share={gsc.get('branded_clicks_pct','n/a')}% "
                  f"cc_err={'yes' if cc.get('error') else 'ok'} "
                  f"moz={'ok' if moz.get('metrics') else 'skip'}")
    print(f"\n📄 Report: {report_file}")


if __name__ == "__main__":
    main()
