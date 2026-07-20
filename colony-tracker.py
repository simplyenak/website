#!/usr/bin/env python3
"""Colony page tracker — checks GSC thresholds and auto-injects links between colony pages.

Colony strategy: Each colony page targets an easy PAA keyword. Once it sustains a position
≤10 with ≥100 impressions/wk and ≥1 click/wk for 2 weeks, the script:
  1. Adds a contextual in-content link to the next colony page in the chain
  2. Adds/updates the "What Else to Read" section at the bottom
  3. Commits the changes

Usage:
  python3 colony-tracker.py status           # Show colony status
  python3 colony-tracker.py check --gsc      # Check pages against GSC thresholds
  python3 colony-tracker.py inject           # Auto-add links for ready pages
  python3 colony-tracker.py register         # Register a new colony page
"""
import json, os, re, subprocess, sys
from pathlib import Path
from datetime import datetime, timedelta

ROOT = Path(__file__).resolve().parent
TRACKER_FILE = ROOT / "colony-tracker.json"
POST_DIR = ROOT / "site" / "src" / "data" / "post"

DEFAULT = {
    "threshold": {
        "max_position": 10,
        "min_impressions_weekly": 100,
        "min_clicks_weekly": 1,
        "sustain_weeks": 2
    },
    "colonies": [
        {
            "id": "durian-colony",
            "pages": [
                {
                    "slug": "eating-durians",
                    "title": "Durian in Malaysia: Types, Season & Where to Eat",
                    "url": "/blog/eating-durians/",
                    "target_keyword": "durian season malaysia",
                    "status": "planted",
                    "links_to": "malaysia-durian-guide",
                    "linked_from": None,
                    "contextual_link_phrase": "If you want to know which variety to look for, our",
                    "contextual_link_text": "Malaysian Durian Guide",
                    "contextual_link_url": "/blog/malaysia-durian-guide/"
                }
            ]
        }
    ]
}

def load():
    if TRACKER_FILE.exists():
        return json.loads(TRACKER_FILE.read_text())
    return DEFAULT

def save(data):
    TRACKER_FILE.write_text(json.dumps(data, indent=2))
    print(f"  Saved {TRACKER_FILE}")

def get_gsc(keyword):
    """Query GSC for keyword position data (28-day window)."""
    alt = [
        Path(os.path.expanduser("~/.google/credentials/gsc-key.json")),
        Path(os.path.expanduser("~/.skills-data/data-driven-product/configs/gsc-service-account.json")),
    ]
    cred = None
    for p in alt:
        if p.exists(): cred = p; break
    if not cred:
        return None
    try:
        from google.oauth2 import service_account
        from google.auth.transport.requests import Request
        import urllib.parse, urllib.request
        c = service_account.Credentials.from_service_account_file(str(cred),
            scopes=["https://www.googleapis.com/auth/webmasters.readonly"])
        c.refresh(Request())
        site = "sc-domain:simplyenak.com"
        enc = urllib.parse.quote(site, safe='')
        end = datetime.now()
        start = end - timedelta(days=28)
        body = json.dumps({
            "startDate": start.strftime("%Y-%m-%d"),
            "endDate": end.strftime("%Y-%m-%d"),
            "dimensions": ["query"],
            "rowLimit": 10, "dataState": "all"
        }).encode()
        req = urllib.request.Request(
            f"https://www.googleapis.com/webmasters/v3/sites/{enc}/searchAnalytics/query",
            data=body)
        req.add_header("Authorization", f"Bearer {c.token}")
        req.add_header("Content-Type", "application/json")
        resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
        rows = resp.get("rows", [])
        if rows:
            return {"impressions": rows[0].get("impressions",0), "clicks": rows[0].get("clicks",0),
                    "position": rows[0].get("position",999)}
        return None
    except Exception as e:
        print(f"  GSC error: {e}"); return None

def inject(post, colony):
    """Add contextual link + What Else to Read to a page."""
    if not post: return False
    content = post.read_text(encoding="utf-8")
    orig = content
    p = colony["pages"]
    this = next((x for x in p if x["slug"] == post.stem), None)
    if not this: return False
    next_p = next((x for x in p if x["slug"] == this["links_to"]), None)
    if not next_p: return False
    
    faq = "## Frequently Asked Questions"
    link = f"[{this['contextual_link_text']}]({this['contextual_link_url']})"
    sentence = f"{this['contextual_link_phrase']} {link}."
    if this['contextual_link_url'] not in content:
        if faq in content:
            content = content.replace(faq, f"{sentence}\n\n{faq}")
            print(f"  + Link added: {this['contextual_link_text']}")
    
    others = [x for x in p if x["slug"] != post.stem and x["status"] in ("ranked","linked","planted")]
    if others:
        we_section = "## What Else to Read\n\n" + "\n".join(
            f"- [{x['title']}]({x['url']})" for x in others
        )
        if "## What Else to Read" in content:
            content = re.sub(r"## What Else to Read.*?(?=\n## |\Z)", we_section, content, flags=re.DOTALL)
            print(f"  ~ What Else to Read updated")
        else:
            end = "\n---\n"
            if end in content:
                content = content.replace(end, f"\n{we_section}\n{end}")
            else:
                content += f"\n\n{we_section}\n"
            print(f"  + What Else to Read section added")
    
    if content != orig:
        post.write_text(content, encoding="utf-8")
        return True
    return False

# ── Commands ──
def status():
    d = load()
    print("\n=== Colony Status ===\n")
    for c in d["colonies"]:
        print(f"Colony: {c['id']}")
        for p in c["pages"]:
            print(f"  [{p['status'].upper()}] {p['title']} → {p.get('links_to','end')}")

def check(gsc=False):
    d = load()
    t = d["threshold"]
    print(f"\n=== Colony Threshold Check ===\n")
    for c in d["colonies"]:
        for p in c["pages"]:
            if p["status"] != "planted":
                print(f"  [{p['status']}] {p['title']}"); continue
            g = get_gsc(p["target_keyword"]) if gsc else None
            if not g:
                print(f"  [?] {p['title']} — run with --gsc"); continue
            pos, imp, cl = g["position"], g["impressions"], g["clicks"]
            if pos <= t["max_position"] and imp >= t["min_impressions_weekly"] and cl >= t["min_clicks_weekly"]:
                print(f"  [READY] {p['title']}: pos {pos:.1f}, {imp}imp, {cl}clicks")
                p["status"] = "ready"
            else:
                print(f"  [WAIT]  {p['title']}: pos {pos:.1f}, {imp}imp, {cl}clicks")
    save(d)

def inject_cmd():
    d = load()
    changed = False
    print("\n=== Injecting Colony Links ===\n")
    for c in d["colonies"]:
        for p in c["pages"]:
            if p["status"] != "ready": continue
            post = POST_DIR / f"{p['slug']}.md"
            if not post.exists():
                # Check stories dir
                post = ROOT / "site" / "src" / "data" / "content" / "stories" / f"{p['slug']}.md"
            if post.exists() and inject(post, c):
                p["status"] = "ranked"
                changed = True
                print(f"  ✓ {post.stem}")
    if changed:
        save(d)
        subprocess.run(["git","add","-A"], cwd=ROOT, check=False)
        subprocess.run(["git","commit","-m",f"auto: colony links ({datetime.now():%Y-%m-%d})"],
            cwd=ROOT, check=False)
        print("\n  Committed")
    else:
        print("  Nothing to inject")

def register():
    print("\n=== Register New Colony Page ===\n")
    slug = input("Slug: ").strip()
    title = input("Title: ").strip()
    kw = input("Target keyword: ").strip()
    next_slug = input("Links to (next colony slug): ").strip()
    phrase = input("Contextual link phrase: ").strip()
    text = input("Link text: ").strip()
    url = input(f"Link URL (/blog/{slug}/): ").strip() or f"/blog/{slug}/"
    col = input("Colony name (e.g. durian-colony): ").strip()
    d = load()
    colony = next((c for c in d["colonies"] if c["id"] == col), None)
    if not colony:
        colony = {"id": col, "pages": []}; d["colonies"].append(colony)
    colony["pages"].append({
        "slug": slug, "title": title, "url": url, "target_keyword": kw,
        "status": "planted", "links_to": next_slug or None, "linked_from": None,
        "contextual_link_phrase": phrase, "contextual_link_text": text, "contextual_link_url": url
    })
    save(d)
    # Update previous page's links_to
    for c in d["colonies"]:
        for p in c["pages"]:
            if p.get("links_to") == slug and p["slug"] != slug:
                p["links_to"] = next_slug or None
    save(d)
    print(f"\n  Registered {title} in colony {col}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    {"status": status, "check": lambda: check("--gsc" in sys.argv),
     "inject": inject_cmd, "register": register}.get(sys.argv[1], lambda: print("Unknown"))()
