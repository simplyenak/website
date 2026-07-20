#!/usr/bin/env python3
"""Content Audit — correlates GSC ranking performance with content characteristics.
This is the feedback loop: learns what features = better rankings, improves content over time.
"""
import json, os, re, sys, urllib.request, urllib.parse
from pathlib import Path
from datetime import datetime, timedelta

ROOT = Path(__file__).resolve().parent
REPO_ROOT = ROOT
if not (REPO_ROOT / ".git").exists():
    for p in [Path("/home/maarten/website-optimization"), Path(os.path.expanduser("~/website-optimization"))]:
        if (p / ".git").exists(): REPO_ROOT = p; break

POST_DIR = REPO_ROOT / "site" / "src" / "data" / "post"
STORIES_DIR = REPO_ROOT / "site" / "src" / "data" / "content" / "stories.json"
CREDENTIALS_PATH = os.path.expanduser("~/.google/credentials/gsc-key.json")

def get_gsc_token():
    alt = [Path(CREDENTIALS_PATH), Path(os.path.expanduser("~/.skills-data/data-driven-product/configs/gsc-service-account.json"))]
    cred = next((p for p in alt if p.exists()), None)
    if not cred: return None
    try:
        from google.oauth2 import service_account
        from google.auth.transport.requests import Request
        c = service_account.Credentials.from_service_account_file(str(cred),
            scopes=["https://www.googleapis.com/auth/webmasters.readonly"])
        c.refresh(Request()); return c.token
    except ImportError: return None

def query_gsc_page(url_path, token):
    enc = urllib.parse.quote("sc-domain:simplyenak.com", safe='')
    start = (datetime.now() - timedelta(days=28)).strftime("%Y-%m-%d")
    end = datetime.now().strftime("%Y-%m-%d")
    body = json.dumps({"startDate": start, "endDate": end, "dimensions": ["page"],
        "dimensionFilterGroups": [{"filters": [{"dimension": "page", "operator": "contains", "expression": url_path}]}],
        "rowLimit": 5, "dataState": "all"}).encode()
    req = urllib.request.Request(f"https://www.googleapis.com/webmasters/v3/sites/{enc}/searchAnalytics/query", data=body)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
        rows = resp.get("rows", [])
        if rows: return {"impressions": rows[0].get("impressions",0), "clicks": rows[0].get("clicks",0),
                         "position": rows[0].get("position",999), "ctr": rows[0].get("ctr",0)}
    except Exception: pass
    return None

def classify_title(title):
    tl = title.lower()
    if title.endswith("?"): return "question"
    if any(w in tl for w in ["how to","how do","how can"]): return "how-to"
    if any(w in tl for w in ["what is","what are","what happens"]): return "what-is"
    if any(w in tl for w in ["when is","when does","when should"]): return "when"
    if any(w in tl for w in ["best","top","guide"]): return "listicle"
    if any(w in tl for w in ["mistake","wrong","never","avoid","don't"]): return "negative-insight"
    if any(w in tl for w in ["secret","won't tell","never hear","insider"]): return "curiosity-gap"
    return "other"

def extract_features(md_path):
    try: content = md_path.read_text(encoding="utf-8")
    except: return None
    parts = content.split("---", 2)
    if len(parts) < 3: return None
    fm, body = parts[1], parts[2]
    title = re.search(r'^title:\s*"([^"]+)"', fm, re.MULTILINE)
    title = title.group(1) if title else ""
    desc = re.search(r'description:\s*"([^"]+)"', fm, re.MULTILINE)
    desc = desc.group(1) if desc else ""
    image = re.search(r'^image:\s*"([^"]+)"', fm, re.MULTILINE)
    author = re.search(r'^author:\s*"([^"]+)"', fm, re.MULTILINE)
    wc = len(body.split())
    h2s = len(re.findall(r"^##\s+", body, re.MULTILINE))
    h3s = len(re.findall(r"^###\s+", body, re.MULTILINE))
    faqs = len(re.findall(r"\*\*[^*]+\?\*\*", body)) + len(re.findall(r"^###\s+.*\?", body, re.MULTILINE))
    internal = len(re.findall(r"simplyenak\.com[^\s\)]*", content) + re.findall(r"\]\(/[^\)]+\)", content))
    external = len([l for l in re.findall(r"https?://[^\s\)]+", content) if "simplyenak.com" not in l])
    has_summary = bool(re.search(r"\*\*>\s*.+\*\*", body[:300]))
    entities = set(re.findall(r"(?<!\.\s)[A-Z][a-z]+(?:\s[A-Z][a-z]+)+", body))
    return {"title": title, "title_type": classify_title(title), "word_count": wc,
            "h2_count": h2s, "h3_count": h3s, "faq_count": faqs, "internal_links": internal,
            "external_links": external, "has_hero_image": bool(image.group(1) if image else ""),
            "has_ai_summary": has_summary, "named_entities": len(entities),
            "author": author.group(1) if author else ""}

def analyze(pages):
    insights = []
    # Word count buckets
    for label, lo, hi in [("short (<1500w)", 0, 1500), ("medium (1500-2500w)", 1500, 2500), ("long (2500w+)", 2500, 99999)]:
        g = [p for p in pages if p["gsc"] and lo <= p["features"]["word_count"] < hi]
        if g:
            insights.append(f"  {label}: avg pos {sum(p['gsc']['position'] for p in g)/len(g):.1f}, {len(g)} pages")
    # AI summary
    ws = [p for p in pages if p["gsc"] and p["features"]["has_ai_summary"]]
    wos = [p for p in pages if p["gsc"] and not p["features"]["has_ai_summary"]]
    if ws and wos:
        aw = sum(p["gsc"]["position"] for p in ws)/len(ws)
        awo = sum(p["gsc"]["position"] for p in wos)/len(wos)
        insights.append(f"  AI summary: WITH avg pos {aw:.1f} vs WITHOUT {awo:.1f} ({'better' if aw<awo else 'worse'})")
    # Internal links
    hl = [p for p in pages if p["gsc"] and p["features"]["internal_links"] >= 4]
    ll = [p for p in pages if p["gsc"] and p["features"]["internal_links"] < 4]
    if hl and ll:
        insights.append(f"  Internal links: ≥4 avg pos {sum(p['gsc']['position'] for p in hl)/len(hl):.1f} vs <4 avg {sum(p['gsc']['position'] for p in ll)/len(ll):.1f}")
    # Title type
    tp = {}
    for p in pages:
        if p["gsc"]:
            tt = p["features"]["title_type"]
            tp.setdefault(tt, []).append(p["gsc"]["position"])
    if tp:
        insights.append("  Title type performance (best first):")
        for tt, pos in sorted(tp.items(), key=lambda x: sum(x[1])/len(x[1])):
            insights.append(f"    {tt}: avg pos {sum(pos)/len(pos):.1f} ({len(pos)} pages)")
    return insights

def main():
    token = get_gsc_token()
    if not token: print("No GSC token"); sys.exit(1)
    pages = []
    for md in sorted(POST_DIR.glob("*.md")):
        f = extract_features(md)
        if f:
            g = query_gsc_page(f"/blog/{md.stem}/", token)
            pages.append({"slug": md.stem, "url": f"/blog/{md.stem}/", "features": f, "gsc": g})
    # Stories
    if STORIES_DIR.exists():
        stories = json.loads(STORIES_DIR.read_text())
        for s in stories:
            if s.get("_status") == "published" and s.get("content_markdown"):
                slug = s.get("slug","")
                md = s.get("content_markdown","")
                wc = len(md.split())
                has_summary = bool(re.search(r"\*\*>\s*.+\*\*", md[:300]))
                faqs = len(re.findall(r"\*\*[^*]+\?\*\*", md))
                internal = len(re.findall(r"simplyenak\.com[^\s\)]*", md) + re.findall(r"\]\(/[^\)]+\)", md))
                title = s.get("title","")
                f = {"title":title, "title_type":classify_title(title), "word_count":wc,
                     "h2_count":md.count("## "),"h3_count":md.count("### "),"faq_count":faqs,
                     "internal_links":internal,"external_links":0,"has_hero_image":bool(s.get("featuredImage")),
                     "has_ai_summary":has_summary,"named_entities":0,"author":"Simply Enak"}
                g = query_gsc_page(f"/stories/{slug}/", token)
                pages.append({"slug":slug,"url":f"/stories/{slug}/","features":f,"gsc":g})

    print("\n=== Content Audit ===\n")
    print(f"Pages: {len(pages)} | With GSC data: {sum(1 for p in pages if p['gsc'])}")
    print("\n--- Page Performance ---\n")
    for p in sorted(pages, key=lambda x: x["gsc"]["position"] if x["gsc"] else 999):
        g=p["gsc"]; f=p["features"]
        if g:
            print(f"  {p['slug'][:40]:40s} pos {g['position']:5.1f} | {g['impressions']:4d}imp {g['clicks']:2d}clk | {f['word_count']:4d}w | {f['title_type']}")
        else:
            print(f"  {p['slug'][:40]:40s} no GSC | {f['word_count']:4d}w | {f['title_type']}")
    print("\n--- Insights ---\n")
    for i in analyze(pages): print(i)
    if "--export-json" in sys.argv:
        out = REPO_ROOT / "content" / "content-audit.json"
        out.write_text(json.dumps(pages, indent=2, default=str))
        print(f"\nExported to {out}")
    print("\nDone.")

if __name__ == "__main__":
    main()
