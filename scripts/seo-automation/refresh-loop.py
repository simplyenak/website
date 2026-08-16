#!/usr/bin/env python3
"""
GSC Content Refresh Loop — "stop publishing, start refreshing".

Implements the refresh-over-publish playbook (Charles Floate / Edward Stern
podcast, Aug 2026): instead of only producing new pages, find existing pages
that are LOSING GROUND but still in striking distance (pos 4-12), and produce
a per-page refresh brief: what to update, in what order, with the site's brand
voice guardrails. After the refresh is deployed, reindex the touched URLs.

Detection signals (two consecutive periods compared):
  - Impression decay  (current < previous)
  - Click decay
  - Position decay    (avg position worsened)
  - Striking distance (current pos 4-10 — worth pushing back over the line)
  - Counter-signals: clicks up / CTR healthy → excluded (the discipline rule)

Output: .hermes/seo-reports/refresh-loop/
    refresh-loop_latest.json      — machine-readable page data + scores
    refresh-brief_latest.md       — per-page refresh brief (the deliverable)
    refresh-urls_latest.txt       — URLs to reindex after deploy

Usage:
    python3 scripts/seo-automation/refresh-loop.py                 # 28d vs prior 28d, top 5
    python3 scripts/seo-automation/refresh-loop.py --days 14 --top 8
    python3 scripts/seo-automation/refresh-loop.py --reindex       # IndexNow the flagged URLs
"""

import argparse
import csv
import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
OUTPUT_DIR = REPO_ROOT / ".hermes" / "seo-reports" / "refresh-loop"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

INDEXNOW_KEY_FILE = REPO_ROOT / "site" / "public" / "indexnow-key.txt"
INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"
INDEXNOW_BATCH = 100
DEFAULT_SITE = "sc-domain:simplyenak.com"
DEFAULT_HOST = "simplyenak.com"
DEFAULT_MIN_IMPRESSIONS = 30   # site scale: most pages run 30-500 imp/28d
DEFAULT_MAX_POSITION = 12
DEFAULT_MIN_SCORE = 25

# Content source resolver: page URL prefix -> (collection name, JSON path)
CONTENT_JSON = {
    "tours": REPO_ROOT / "site" / "src" / "data" / "content" / "tours.json",
    "landing": REPO_ROOT / "site" / "src" / "data" / "content" / "location-landing-pages.json",
    "specialty": REPO_ROOT / "site" / "src" / "data" / "content" / "specialty-landing-pages.json",
    "dietary": REPO_ROOT / "site" / "src" / "data" / "content" / "dietary-landing-pages.json",
    "travel": REPO_ROOT / "site" / "src" / "data" / "content" / "travel-type-landing-pages.json",
    "pages": REPO_ROOT / "site" / "src" / "data" / "content" / "pages.json",
}

STATIC_PAGE_MAP = {
    "/about/": "about-page.json",
    "/contact/": "contact-page.json",
    "/faq/": "faqs.json",
    "/private-tours/": "private-tours-page.json",
    "/corporate-groups/": "corporate-groups-page.json",
    "/how-it-works/": "how-it-works-page.json",
    "/how-to-prepare/": "how-to-prepare-page.json",
    "/comparison/": "comparison-page.json",
    "/tailored-tours/": "tailored-tours-page.json",
    "/directions/": "directions-page.json",
    "/track-record/": "track-record-page.json",
}

BANNED_WORDS = [
    "authentic", "best", "world-class", "premium", "must-see", "genuine",
    "amazing", "incredible", "customer", "client", "establishment", "venue",
    "explore", "embark", "immersive",
]


def get_gsc_token():
    """Get GSC access token from the service account key (~/.google/credentials/gsc-key.json)."""
    cred_candidates = [
        Path.home() / ".google" / "credentials" / "gsc-key.json",
        Path("/home/maarten/.google/credentials/gsc-key.json"),
    ]
    for cred_path in cred_candidates:
        if not cred_path.exists():
            continue
        try:
            from google.oauth2 import service_account
            from google.auth.transport.requests import Request
            creds = service_account.Credentials.from_service_account_file(
                str(cred_path),
                scopes=["https://www.googleapis.com/auth/webmasters.readonly"],
            )
            creds.refresh(Request())
            return creds.token
        except Exception as e:
            print(f"  ⚠ credential {cred_path} failed: {e}", file=sys.stderr)
            continue
    return None


def gsc_query(token: str, start_date: str, end_date: str, dimensions: list[str], row_limit: int = 25000) -> list[dict]:
    """Fetch search analytics rows from GSC."""
    body = json.dumps({
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": dimensions,
        "rowLimit": row_limit,
        "dataState": "all",
    }).encode()
    enc_site = urllib.parse.quote(DEFAULT_SITE, safe="")
    url = f"https://www.googleapis.com/webmasters/v3/sites/{enc_site}/searchAnalytics/query"
    req = urllib.request.Request(url, data=body)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8")).get("rows", [])


def gsc_query_for_page(token: str, start_date: str, end_date: str, page_url: str, row_limit: int = 5) -> list[dict]:
    """Fetch the top queries for ONE page (filtered server-side).

    The global query×page pull is sorted by impressions and truncated at 25k rows,
    so low-traffic pages never appear. Filtering by page URL is the only reliable way.
    """
    body = json.dumps({
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": ["query"],
        "rowLimit": row_limit,
        "dataState": "all",
        "dimensionFilterGroups": [{
            "filters": [{
                "dimension": "page",
                "operator": "equals",
                "expression": page_url,
            }]
        }],
    }).encode()
    enc_site = urllib.parse.quote(DEFAULT_SITE, safe="")
    url = f"https://www.googleapis.com/webmasters/v3/sites/{enc_site}/searchAnalytics/query"
    req = urllib.request.Request(url, data=body)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8")).get("rows", [])



def fmt_date(d: datetime) -> str:
    return d.strftime("%Y-%m-%d")


def normalize_url(url: str) -> str:
    """Normalize a page URL for period matching: strip trailing slash and index.html.

    GSC reports trailing-slash and index.html variants as separate rows, which
    would otherwise look like fake declines when the served variant swapped.
    """
    u = url.split("?")[0].rstrip("/")
    if u.endswith("/index.html"):
        u = u[: -len("/index.html")]
    return u or "/"


def check_url_status(url: str, timeout: int = 12) -> dict:
    """Check a live URL's HTTP status without following redirects.

    Returns {"status": int|None, "redirect": str|None, "error": str|None}.
    A status of None means the check failed (network/DNS) — callers should
    treat that as "unknown", not as healthy.
    """
    import urllib.error as url_err
    req = urllib.request.Request(url, method="HEAD",
                                 headers={"User-Agent": "refresh-loop/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return {"status": resp.status, "redirect": resp.headers.get("Location"), "error": None}
    except url_err.HTTPError as e:
        return {"status": e.code, "redirect": e.headers.get("Location"), "error": None}
    except Exception as e:
        return {"status": None, "redirect": None, "error": str(e)}


def missing_redirect_check(page: str) -> dict | None:
    """Detect the 'old story URL 404s, /stories/ twin is live' class.

    After the Jul 2026 /stories/ permalink migration, root-level story URLs kept
    their GSC impressions but 404 when the Worker REDIRECTS map missed them —
    which looks like a content decline but is a missing 301. If the page 404s
    and /stories/<slug>/ answers 200, flag it: fix the redirect, not the copy.
    Returns {"stories_url": ..., "status": ...} or None if not applicable.
    """
    path = urllib.parse.urlparse(page).path
    slug = path.strip("/").split("/")[-1]
    if path.startswith("/stories/") or not slug:
        return None  # already the canonical form, or a root page like "/"
    stories_url = f"https://{DEFAULT_HOST}/stories/{slug}/"
    cur = check_url_status(page)
    if cur["status"] == 404:
        twin = check_url_status(stories_url)
        if twin["status"] == 200:
            return {"stories_url": stories_url, "root_status": cur["status"]}
    return None




def resolve_content_source(page: str) -> dict:
    """Map a page URL to the file that holds its copy, plus current title/description if found."""
    path = urllib.parse.urlparse(page).path
    slug = path.strip("/").split("/")[-1]

    # Static pages (about, contact, faq, ...)
    for prefix, fname in STATIC_PAGE_MAP.items():
        if path.startswith(prefix):
            fp = REPO_ROOT / "site" / "src" / "data" / "content" / fname
            title = desc = ""
            try:
                d = json.loads(fp.read_text())
                if isinstance(d, list):
                    d = d[0] if d else {}
                title = d.get("meta_title") or d.get("seo_title") or d.get("title") or ""
                desc = d.get("meta_description") or d.get("seo_description") or ""
            except Exception:
                pass
            return {"file": str(fp), "collection": fname, "meta_title": title, "meta_description": desc}

    # Tours
    if path.startswith("/tours/"):
        fp = CONTENT_JSON["tours"]
        try:
            items = json.loads(fp.read_text())
            for t in items:
                if t.get("slug") == slug:
                    return {"file": str(fp), "collection": "tours", "slug": slug,
                            "meta_title": t.get("seo_title") or t.get("name") or "",
                            "meta_description": t.get("seo_description") or t.get("shortDescription") or ""}
        except Exception:
            pass
        return {"file": str(fp), "collection": "tours", "slug": slug}

    # Stories (blog posts synced from Payload into stories.json; some also have .md)
    if path.startswith("/stories/") or slug:
        fp = REPO_ROOT / "site" / "src" / "data" / "content" / "stories.json"
        try:
            items = json.loads(fp.read_text())
            for s in items:
                if s.get("slug") == slug:
                    return {"file": str(fp), "collection": "stories (Payload + stories.json — update via Payload)",
                            "slug": slug,
                            "meta_title": s.get("meta_title") or s.get("title") or "",
                            "meta_description": s.get("meta_description") or ""}
        except Exception:
            pass

    # Landing pages (location / specialty / dietary / travel-type)
    for key in ("landing", "specialty", "dietary", "travel"):
        fp = CONTENT_JSON[key]
        try:
            items = json.loads(fp.read_text())
            for lp in items:
                if lp.get("slug") == slug:
                    return {"file": str(fp), "collection": f"{key} landing pages", "slug": slug,
                            "meta_title": lp.get("meta_title") or lp.get("hero_title") or "",
                            "meta_description": lp.get("meta_description") or lp.get("hero_description") or ""}
        except Exception:
            pass

    return {"file": "unknown — check Payload CMS", "collection": "unknown", "slug": slug}


def score_page(cur: dict, prev: dict) -> dict | None:
    """Score a page for refresh priority. Returns entry dict or None if not a candidate."""
    imp_c, clicks_c, pos_c, ctr_c = cur["impressions"], cur["clicks"], cur["position"], cur["ctr"]
    imp_p, clicks_p, pos_p = prev["impressions"], prev["clicks"], prev["position"]

    if imp_c < DEFAULT_MIN_IMPRESSIONS or pos_c > DEFAULT_MAX_POSITION or imp_p <= 0:
        return None

    imp_drop = (imp_p - imp_c) / imp_p
    click_drop = (clicks_p - clicks_c) / clicks_p if clicks_p > 0 else 0
    pos_worse = pos_c - pos_p  # positive = ranking got worse

    # Structural migration check: impressions collapsed while position IMPROVED
    # (e.g. a permalink/canonical change moved traffic to a sibling URL). Refreshing
    # copy on the losing URL is wasted work — verify the redirect/canonical instead.
    if imp_drop > 0.7 and pos_worse < -1.0:
        return {
            "page": cur["page"],
            "score": 0,
            "structural": True,
            "reasons": [f"impressions -{imp_drop*100:.0f}% but position improved {pos_p:.1f}→{pos_c:.1f} "
                        f"— likely URL migration, not content decay"],
            "cur": {"impressions": imp_c, "clicks": clicks_c, "ctr": round(ctr_c * 100, 2), "position": round(pos_c, 1)},
            "prev": {"impressions": imp_p, "clicks": clicks_p, "ctr": round(prev["ctr"] * 100, 2), "position": round(pos_p, 1)},
            "impression_drop_pct": round(imp_drop * 100, 1),
            "click_drop_pct": round(click_drop * 100, 1),
            "position_change": round(pos_worse, 1),
            "top_queries": [],
        }

    score = 0
    reasons = []

    if imp_drop > 0.5:
        score += 40; reasons.append(f"impressions -{imp_drop*100:.0f}%")
    elif imp_drop > 0.3:
        score += 30; reasons.append(f"impressions -{imp_drop*100:.0f}%")
    elif imp_drop > 0.15:
        score += 15; reasons.append(f"impressions -{imp_drop*100:.0f}%")

    if click_drop > 0.5:
        score += 25; reasons.append(f"clicks -{click_drop*100:.0f}%")
    elif click_drop > 0.3:
        score += 15; reasons.append(f"clicks -{click_drop*100:.0f}%")

    if pos_worse >= 2:
        score += 20; reasons.append(f"position +{pos_worse:.1f}")
    elif pos_worse >= 1:
        score += 10; reasons.append(f"position +{pos_worse:.1f}")

    if 4 <= pos_c <= 10:
        score += 20; reasons.append("striking distance")

    # Volume value: absolute lost clicks and impressions (ROI ordering). A page
    # losing 5 clicks is worth refreshing before a page losing 2, even if the
    # percentage decay is smaller.
    lost_clicks = max(0, clicks_p - clicks_c)
    lost_impressions = max(0, imp_p - imp_c)
    if lost_clicks >= 5:
        score += 15; reasons.append(f"-{lost_clicks} clicks lost")
    elif lost_clicks >= 2:
        score += 10; reasons.append(f"-{lost_clicks} clicks lost")
    if lost_impressions >= 300:
        score += 15; reasons.append(f"-{lost_impressions} impressions lost")
    elif lost_impressions >= 100:
        score += 10; reasons.append(f"-{lost_impressions} impressions lost")
    elif lost_impressions >= 40:
        score += 5; reasons.append(f"-{lost_impressions} impressions lost")

    # Counter-signals (the discipline rule — don't touch winners)
    if clicks_c > clicks_p:
        score -= 20
    if ctr_c > 0.05:
        score -= 10

    if score < DEFAULT_MIN_SCORE:
        return None

    return {
        "page": cur["page"],
        "score": score,
        "reasons": reasons,
        "cur": {"impressions": imp_c, "clicks": clicks_c, "ctr": round(ctr_c * 100, 2), "position": round(pos_c, 1)},
        "prev": {"impressions": imp_p, "clicks": clicks_p, "ctr": round(prev["ctr"] * 100, 2), "position": round(pos_p, 1)},
        "impression_drop_pct": round(imp_drop * 100, 1),
        "click_drop_pct": round(click_drop * 100, 1),
        "position_change": round(pos_worse, 1),
        "lost_clicks": lost_clicks,
        "lost_impressions": lost_impressions,
        "top_queries": [],
    }


def analyze(token: str, days: int, top_n: int):
    end_current = datetime.now(timezone.utc) - timedelta(days=1)  # GSC lag
    start_current = end_current - timedelta(days=days - 1)
    end_prev = start_current - timedelta(days=1)
    start_prev = end_prev - timedelta(days=days - 1)

    print(f"=== Content Refresh Loop ({fmt_date(start_current)} → {fmt_date(end_current)}) ===")
    print(f"    comparing vs ({fmt_date(start_prev)} → {fmt_date(end_prev)})")

    cur_rows = gsc_query(token, fmt_date(start_current), fmt_date(end_current), ["page"])
    prev_rows = gsc_query(token, fmt_date(start_prev), fmt_date(end_prev), ["page"])
    print(f"Fetched {len(cur_rows)} current / {len(prev_rows)} previous page rows")

    prev_map = {}
    for row in prev_rows:
        keys = row.get("keys", [])
        if keys:
            prev_map[normalize_url(keys[0])] = row

    # Top queries are fetched per-page AFTER picking (see below) — a global
    # query×page pull is truncated at 25k rows before low-traffic pages appear.

    candidates = []
    structural = []
    missing_redirect = []
    for row in cur_rows:
        keys = row.get("keys", [])
        if not keys:
            continue
        page = keys[0]
        prev = prev_map.get(normalize_url(page))
        if prev is None:
            continue
        cur = {"page": page, "impressions": row.get("impressions", 0), "clicks": row.get("clicks", 0),
               "ctr": row.get("ctr", 0), "position": row.get("position", 999)}
        entry = score_page(cur, prev)
        if entry is not None:
            if entry.get("structural"):
                structural.append(entry)
            else:
                candidates.append(entry)

    if structural:
        print(f"\n⚠ Structural flags (URL migration — verify canonical/redirect, do NOT refresh copy):")
        for e in structural:
            print(f"  {e['page']}")
            print(f"         imp {e['prev']['impressions']}→{e['cur']['impressions']}  pos {e['prev']['position']}→{e['cur']['position']}")
            print(f"         {' '.join(e['reasons'])}")

    # Missing-redirect class: root-level story URL 404s but /stories/ twin is
    # live. This is a 301 fix, not a copy refresh — pull it out of the pool.
    checked = []
    for e in candidates:
        try:
            mr = missing_redirect_check(e["page"])
        except Exception as ex:
            mr = None
            print(f"  ⚠ url check failed for {e['page']}: {ex}")
        if mr:
            e["missing_redirect"] = mr
            missing_redirect.append(e)
        else:
            checked.append(e)
    candidates = checked

    if missing_redirect:
        print(f"\n🚧 Missing redirects (old root URL 404s, /stories/ twin live — add to Worker REDIRECTS, do NOT refresh copy):")
        for e in sorted(missing_redirect, key=lambda x: -x["lost_clicks"]):
            print(f"  {e['page']}  (imp {e['prev']['impressions']}→{e['cur']['impressions']}, {e['lost_clicks']} clicks lost)")
            print(f"         → {e['missing_redirect']['stories_url']}")

    # ROI ordering: absolute lost clicks first, then lost impressions, then signal score.
    candidates.sort(key=lambda e: (e["lost_clicks"], e["lost_impressions"], e["score"]), reverse=True)
    picked = candidates[:top_n]
    print(f"\nDeclining candidates: {len(candidates)}, top {len(picked)} picked")


    # Top queries per picked page (server-side filter — cheap, precise)
    cur_start_s, cur_end_s = fmt_date(start_current), fmt_date(end_current)
    for e in picked:
        try:
            rows = gsc_query_for_page(token, cur_start_s, cur_end_s, e["page"], row_limit=10)
            e["top_queries"] = [{
                "query": r["keys"][0],
                "impressions": r.get("impressions", 0),
                "clicks": r.get("clicks", 0),
                "position": round(r.get("position", 999), 1),
            } for r in rows if r.get("keys")]
        except Exception as ex:
            print(f"  ⚠ top queries for {e['page']} failed: {ex}")

    for e in picked:
        print(f"  score:{e['score']:3}  {e['page']}")
        print(f"         imp {e['prev']['impressions']}→{e['cur']['impressions']}  "
              f"clicks {e['prev']['clicks']}→{e['cur']['clicks']}  pos {e['prev']['position']}→{e['cur']['position']}  "
              f"({' '.join(e['reasons'][:3])})")

    return picked, missing_redirect, fmt_date(start_prev), fmt_date(end_prev), fmt_date(start_current), fmt_date(end_current)


def build_brief(picked: list[dict], dates: dict, missing_redirect: list[dict] | None = None) -> str:
    """Generate the per-page refresh brief (the deliverable)."""
    missing_redirect = missing_redirect or []
    lines = []
    lines.append(f"# Content Refresh Brief — {dates['current_start']} → {dates['current_end']}")
    lines.append("")
    lines.append("Source: GSC two-period comparison. Rule: refresh beats publish — update meta, ")
    lines.append("first 2 paragraphs, one list, the date; then reindex. Do not touch winners.")
    lines.append("")
    if missing_redirect:
        lines.append(f"🚧 MISSING REDIRECTS ({len(missing_redirect)}) — fix these in site/workers/cdn-rewriter.js REDIRECTS map, do NOT refresh copy:")
        for e in sorted(missing_redirect, key=lambda x: -x["lost_clicks"]):
            lines.append(f"- {e['page']}  →  {e['missing_redirect']['stories_url']}  "
                         f"(imp {e['prev']['impressions']}→{e['cur']['impressions']}, {e['lost_clicks']} clicks lost)")
        lines.append("")
    lines.append(f"Pages: {len(picked)}")
    for i, e in enumerate(picked, 1):
        src = resolve_content_source(e["page"])
        lines.append("")
        lines.append(f"## {i}. {e['page']}  (score {e['score']})")
        lines.append("")
        lines.append("| Metric | Before | After | Δ |")
        lines.append("|--------|--------|-------|---|")
        lines.append(f"| Impressions | {e['prev']['impressions']:,} | {e['cur']['impressions']:,} | {-e['impression_drop_pct']:.0f}% |")
        lines.append(f"| Clicks | {e['prev']['clicks']:,} | {e['cur']['clicks']:,} | {-e['click_drop_pct']:.0f}% |")
        lines.append(f"| CTR | {e['prev']['ctr']:.2f}% | {e['cur']['ctr']:.2f}% | {e['cur']['ctr']-e['prev']['ctr']:+.2f}pp |")
        lines.append(f"| Avg position | {e['prev']['position']:.1f} | {e['cur']['position']:.1f} | {e['position_change']:+.1f} |")
        lines.append("")
        lines.append(f"Signals: {'; '.join(e['reasons'])}")
        lines.append("")
        if e["top_queries"]:
            significant = [q for q in e["top_queries"] if q["impressions"] >= 3]
            if significant:
                lines.append("Top queries (current period):")
                for q in significant:
                    lines.append(f"- \"{q['query']}\" — {q['impressions']:,} imp, {q['clicks']} clicks, pos {q['position']}")
            else:
                lines.append("⚠ No dominant query — the page's head query appears to have died "
                             "(remaining impressions are sub-threshold long-tail).")
                lines.append("  Check the current top-3 SERP for this page's topic: if intent flipped, "
                             "refresh won't recover it — rewrite or retire.")
            lines.append("")
        lines.append(f"**Where to edit:** `{src['file']}` ({src['collection']})")
        if src.get("slug"):
            lines.append(f"Slug: `{src['slug']}`")
        if src.get("meta_title") or src.get("meta_description"):
            lines.append("")
            lines.append(f"Current meta title: {src.get('meta_title') or '(empty)'}")
            lines.append(f"Current meta description: {src.get('meta_description') or '(empty)'}")
        lines.append("")
        lines.append("**Refresh checklist (in order):**")
        lines.append("1. Meta title — front-load the primary query. Format: `<query>: <differentiator>`")
        lines.append("2. Meta description — <160 chars, answer the query directly, secondary terms included")
        lines.append("3. First 2 paragraphs — tighten; answer \"what is this page about\" in the first 200 words")
        lines.append("4. Expand one list/section by 2 items (new stalls, dishes, neighbourhoods, details)")
        lines.append("5. Info gain — add ONE unique data point absent from the top 3 SER (a name, year, number, dish)")
        lines.append("6. Update the date — visible \"Updated <date>\" on the page")
        lines.append("7. Brand voice scan — no banned words, no em-dashes, \"Simply Enak\" never \"Enak\" alone")
        if e["impression_drop_pct"] <= -50:
            lines.append("")
            lines.append("⚠ **Intent check:** impressions dropped >50%. Verify the current top-3 SERP still matches this page")
            lines.append("type (blog post vs booking page vs info page). If intent flipped, refresh won't fix it —")
            lines.append("consider rewrite or retire instead.")
    lines.append("")
    lines.append("**After deploy:**")
    lines.append("    python3 scripts/seo-automation/refresh-loop.py --reindex")
    lines.append("")
    lines.append("Banned words: " + ", ".join(f'"{w}"' for w in BANNED_WORDS))
    return "\n".join(lines)


def save_outputs(picked: list[dict], dates: dict, missing_redirect: list[dict] | None = None) -> Path:
    missing_redirect = missing_redirect or []
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    meta = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "site": DEFAULT_SITE,
        "current_range": [dates["current_start"], dates["current_end"]],
        "previous_range": [dates["previous_start"], dates["previous_end"]],
        "count": len(picked),
        "missing_redirect_count": len(missing_redirect),
    }
    payload = {"meta": meta, "pages": picked, "missing_redirects": missing_redirect}

    json_path = OUTPUT_DIR / f"refresh-loop_{timestamp}.json"
    json_path.write_text(json.dumps(payload, indent=2, default=str))
    (OUTPUT_DIR / "refresh-loop_latest.json").write_text(json.dumps(payload, indent=2, default=str))

    brief = build_brief(picked, dates, missing_redirect)
    brief_path = OUTPUT_DIR / f"refresh-brief_{timestamp}.md"
    brief_path.write_text(brief)
    (OUTPUT_DIR / "refresh-brief_latest.md").write_text(brief)

    urls = [e["page"] for e in picked]
    (OUTPUT_DIR / "refresh-urls_latest.txt").write_text("\n".join(urls) + ("\n" if urls else ""))

    if picked:
        csv_path = OUTPUT_DIR / f"refresh-loop_{timestamp}.csv"
        with open(csv_path, "w", newline="") as f:
            rows = [{"page": e["page"], "score": e["score"],
                     "prev_impressions": e["prev"]["impressions"], "cur_impressions": e["cur"]["impressions"],
                     "prev_clicks": e["prev"]["clicks"], "cur_clicks": e["cur"]["clicks"],
                     "prev_position": e["prev"]["position"], "cur_position": e["cur"]["position"],
                     "impression_drop_pct": e["impression_drop_pct"], "click_drop_pct": e["click_drop_pct"]}
                    for e in picked]
            writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
            writer.writeheader()
            writer.writerows(rows)

    print(f"\nSaved to {OUTPUT_DIR}")
    print(f"  brief:  {brief_path.name}")
    print(f"  json:   {json_path.name}")
    return brief_path


def reindex(dry_run: bool = False):
    """Submit the flagged URLs to IndexNow (after the refresh is deployed)."""
    urls_file = OUTPUT_DIR / "refresh-urls_latest.txt"
    if not urls_file.exists():
        print("ERROR: no refresh-urls_latest.txt — run the analysis first")
        sys.exit(1)
    urls = [u.strip() for u in urls_file.read_text().splitlines() if u.strip()]
    if not urls:
        print("No URLs to reindex.")
        return

    if not INDEXNOW_KEY_FILE.exists():
        print(f"ERROR: IndexNow key not found at {INDEXNOW_KEY_FILE}")
        sys.exit(1)
    key = INDEXNOW_KEY_FILE.read_text().strip()

    print(f"[reindex] {len(urls)} URLs → {INDEXNOW_ENDPOINT} (host {DEFAULT_HOST})")
    if dry_run:
        print("[reindex] DRY-RUN — would submit:")
        for u in urls:
            print(f"  {u}")
        return

    ok = failed = 0
    for i in range(0, len(urls), INDEXNOW_BATCH):
        batch = urls[i:i + INDEXNOW_BATCH]
        body = json.dumps({"host": DEFAULT_HOST, "key": key, "urlList": batch}).encode()
        req = urllib.request.Request(INDEXNOW_ENDPOINT, data=body,
                                     headers={"Content-Type": "application/json; charset=utf-8"})
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                status = resp.status
            if status in (200, 202):
                ok += len(batch)
            else:
                failed += len(batch)
                print(f"  batch {i//INDEXNOW_BATCH+1} → HTTP {status}")
        except Exception as e:
            failed += len(batch)
            print(f"  batch {i//INDEXNOW_BATCH+1} → error: {e}")
    print(f"[reindex] done: {ok} submitted, {failed} failed")
    print("NOTE: IndexNow covers Bing/Yandex. For Google same-day, the sitemap + URL")
    print("Inspection API is the path (Google ignores IndexNow).")
    sys.exit(1 if failed else 0)


def main():
    parser = argparse.ArgumentParser(description="GSC Content Refresh Loop")
    parser.add_argument("--days", type=int, default=28, help="Lookback days per period (default 28)")
    parser.add_argument("--top", type=int, default=5, help="Top N pages for the brief (default 5)")
    parser.add_argument("--reindex", action="store_true", help="IndexNow the flagged URLs (run after deploy)")
    parser.add_argument("--dry-run", action="store_true", help="With --reindex: list URLs without submitting")
    args = parser.parse_args()

    if args.reindex:
        reindex(dry_run=args.dry_run)
        return

    token = get_gsc_token()
    if not token:
        print("ERROR: no GSC credentials (expected ~/.google/credentials/gsc-key.json)")
        sys.exit(1)

    picked, missing_redirect, prev_start, prev_end, cur_start, cur_end = analyze(token, args.days, args.top)
    dates = {"previous_start": prev_start, "previous_end": prev_end,
             "current_start": cur_start, "current_end": cur_end}
    if picked or missing_redirect:
        save_outputs(picked, dates, missing_redirect)
    else:
        print("\nNo declining pages in striking distance this period. Nothing to refresh.")


if __name__ == "__main__":
    main()
