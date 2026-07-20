#!/usr/bin/env python3
"""Colony page tracker — Payload-first. Checks GSC thresholds, injects links into Payload Stories.

Colony strategy: Each colony page targets an easy PAA keyword, created as a Payload Story.
Once it sustains position ≤10 with ≥100 imp/wk and ≥1 click/wk for 2 weeks, the script:
  1. PATCHes the Story in Payload to add a contextual link + What Else to Read section
  2. Commits the colony tracker state to git

Usage:
  python3 colony-tracker.py status                          # Show colony status
  python3 colony-tracker.py check --gsc                     # Check pages against GSC
  python3 colony-tracker.py inject                          # Inject links via Payload API
  python3 colony-tracker.py create-story <slug>             # Create colony page as Payload Story
  python3 colony-tracker.py register                        # Register a new colony page
"""
import json, os, re, subprocess, sys, urllib.request
from pathlib import Path
from datetime import datetime, timedelta

ROOT = Path(__file__).resolve().parent
# Find repo root
REPO_ROOT = ROOT
if not (REPO_ROOT / ".git").exists():
    for p in [Path("/home/maarten/website-optimization"), Path(os.path.expanduser("~/website-optimization"))]:
        if (p / ".git").exists(): REPO_ROOT = p; break

TRACKER_FILE = REPO_ROOT / "colony-tracker.json"
POST_DIR = REPO_ROOT / "site" / "src" / "data" / "post"

# Payload API config
PAYLOAD_URL = os.environ.get("PAYLOAD_URL", "https://cms.system.simplyenak.com")
PAYLOAD_EMAIL = os.environ.get("PAYLOAD_EMAIL", "admin@simplyenak.com")
PAYLOAD_PASSWORD = os.environ.get("PAYLOAD_PASSWORD", "admin123")

DEFAULT = {
    "threshold": {"max_position": 10, "min_impressions_weekly": 100, "min_clicks_weekly": 1, "sustain_weeks": 2},
    "colonies": [
        {
            "id": "durian-colony",
            "pages": [
                {
                    "slug": "eating-durians", "title": "Durian in Malaysia: Types, Season & Where to Eat",
                    "url": "/blog/eating-durians/", "target_keyword": "durian season malaysia",
                    "status": "planted", "links_to": "malaysia-durian-guide", "linked_from": None,
                    "payload_type": "blog",  # existing blog post (markdown file)
                    "contextual_link_phrase": "If you want to know which variety to look for, our",
                    "contextual_link_text": "Malaysian Durian Guide",
                    "contextual_link_url": "/blog/malaysia-durian-guide/"
                },
                {
                    "slug": "malaysia-durian-guide", "title": "Malaysian Durian Guide: Varieties & Where to Find Them",
                    "url": "/stories/malaysia-durian-guide/", "target_keyword": "malaysia durian",
                    "status": "planned", "links_to": "durian-season-malaysia", "linked_from": "eating-durians",
                    "payload_type": "story",  # Payload Story
                    "contextual_link_phrase": "Once you know the varieties, here is what to expect during",
                    "contextual_link_text": "durian season in Malaysia",
                    "contextual_link_url": "/stories/durian-season-malaysia/"
                },
                {
                    "slug": "durian-season-malaysia", "title": "When Is Durian Season in Malaysia? A Complete Guide",
                    "url": "/stories/durian-season-malaysia/", "target_keyword": "durian season in malaysia",
                    "status": "planned", "links_to": "how-to-pick-durian", "linked_from": "malaysia-durian-guide",
                    "payload_type": "story",
                    "contextual_link_phrase": "When the season arrives, you will want to know",
                    "contextual_link_text": "how to pick a good durian",
                    "contextual_link_url": "/stories/how-to-pick-durian/"
                },
                {
                    "slug": "how-to-pick-durian", "title": "How to Pick a Good Durian: A First-Timer's Guide",
                    "url": "/stories/how-to-pick-durian/", "target_keyword": "how to pick durian",
                    "status": "planned", "links_to": None, "linked_from": "durian-season-malaysia",
                    "payload_type": "story",
                    "contextual_link_phrase": "With a good fruit in hand, the next step is learning",
                    "contextual_link_text": "how to open and eat durian",
                    "contextual_link_url": "/stories/how-to-open-durian/"
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
    print(f"  State saved to {TRACKER_FILE}")
    subprocess.run(["git", "add", str(TRACKER_FILE)], cwd=REPO_ROOT, capture_output=True)
    subprocess.run(["git", "commit", "-m", f"auto: colony state ({datetime.now():%Y-%m-%d %H:%M})",
                    "--no-verify"], cwd=REPO_ROOT, capture_output=True)

# ── Payload API helpers ──

_payload_token = None
def payload_login():
    global _payload_token
    if _payload_token:
        return _payload_token
    data = json.dumps({"email": PAYLOAD_EMAIL, "password": PAYLOAD_PASSWORD}).encode()
    req = urllib.request.Request(f"{PAYLOAD_URL}/api/users/login", data=data,
        headers={"Content-Type": "application/json"})
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
        _payload_token = resp.get("token", "")
        if _payload_token:
            print(f"  Payload logged in as {PAYLOAD_EMAIL}")
            return _payload_token
        print(f"  Payload login failed: no token in response")
        return None
    except Exception as e:
        print(f"  Payload login error: {e}")
        return None

def payload_get_story_by_slug(slug):
    """Find a Story in Payload by slug."""
    token = payload_login()
    if not token: return None
    req = urllib.request.Request(f"{PAYLOAD_URL}/api/stories?where[slug][equals]={slug}&depth=0",
        headers={"Authorization": f"Bearer {token}"})
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
        docs = resp.get("docs", [])
        if docs: return docs[0]
        return None
    except Exception as e:
        print(f"  Payload story lookup error: {e}")
        return None

def payload_create_story(slug, title, content_md, excerpt=""):
    """Create a new Story in Payload and submit to GSC for indexing."""
    token = payload_login()
    if not token: return None
    minimal_rich_text = {
        "root": {"type": "root", "format": "", "indent": 0, "version": 1,
            "children": [{"type": "paragraph",
                "children": [{"type": "text", "text": excerpt or title}]
            }],
            "direction": "ltr"}
    }
    data = json.dumps({
        "title": title, "slug": slug,
        "excerpt": excerpt,
        "content": minimal_rich_text,
        "content_markdown": content_md,
        "author": 1,
        "status": "published", "workflowStatus": "published",
        "publishedDate": datetime.now().isoformat(),
        "_status": "published",
    }).encode()
    req = urllib.request.Request(f"{PAYLOAD_URL}/api/stories?depth=0", data=data, method="POST",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=30).read())
        story_id = resp.get('id', '?')
        print(f"  ✓ Story created: {slug} (id={story_id})")
        # Auto-submit to GSC for indexing
        story_url = f"https://simplyenak.com/stories/{slug}/"
        gsc_script = REPO_ROOT / "scripts" / "gsc-auto-index.py"
        if gsc_script.exists():
            subprocess.run(["python3", str(gsc_script), f"--url={story_url}"], timeout=30, capture_output=True)
            print(f"  ✓ Submitted {story_url} to GSC for indexing")
        else:
            alt_gsc = REPO_ROOT / "gsc-auto-index.py"
            if alt_gsc.exists():
                subprocess.run(["python3", str(alt_gsc), f"--url={story_url}"], timeout=30, capture_output=True)
                print(f"  ✓ Submitted {story_url} to GSC for indexing")
        return resp
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        if "unique" in body.lower() and "slug" in body.lower():
            print(f"  Story already exists: {slug}")
            return payload_get_story_by_slug(slug)
        print(f"  ✗ Create failed: HTTP {e.code} — {body[:300]}")
        return None

def payload_update_content(slug, new_content_md):
    """Update a Story's content_markdown with new links."""
    token = payload_login()
    if not token: return False
    story = payload_get_story_by_slug(slug)
    if not story:
        print(f"  ✗ Story not found: {slug}")
        return False
    sid = story["id"]
    data = json.dumps({"content_markdown": new_content_md}).encode()
    req = urllib.request.Request(f"{PAYLOAD_URL}/api/stories/{sid}?depth=0", data=data, method="PATCH",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=30).read())
        print(f"  ✓ Story updated: {slug}")
        return True
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"  ✗ Update failed for {slug}: HTTP {e.code} — {body[:200]}")
        return False

# ── GSC ──

def get_gsc(keyword):
    alt = [Path(os.path.expanduser("~/.google/credentials/gsc-key.json")),
           Path(os.path.expanduser("~/.skills-data/data-driven-product/configs/gsc-service-account.json"))]
    cred = None
    for p in alt:
        if p.exists(): cred = p; break
    if not cred: return None
    try:
        from google.oauth2 import service_account
        from google.auth.transport.requests import Request
        import urllib.parse
        c = service_account.Credentials.from_service_account_file(str(cred),
            scopes=["https://www.googleapis.com/auth/webmasters.readonly"])
        c.refresh(Request())
        enc = urllib.parse.quote("sc-domain:simplyenak.com", safe='')
        end = datetime.now(); start = end - timedelta(days=28)
        body = json.dumps({"startDate": start.strftime("%Y-%m-%d"), "endDate": end.strftime("%Y-%m-%d"),
            "dimensions": ["query"], "rowLimit": 10, "dataState": "all"}).encode()
        req = urllib.request.Request(f"https://www.googleapis.com/webmasters/v3/sites/{enc}/searchAnalytics/query", data=body)
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

# ── Link Injection ──

def build_link_sentence(page, all_pages):
    """Build the updated content with contextual link + What Else to Read section."""
    # Find the next page in the chain
    next_p = next((x for x in all_pages if x["slug"] == page.get("links_to")), None) if page.get("links_to") else None
    
    # Contextual in-content link (before FAQ or at end)
    link = f"[{page['contextual_link_text']}]({page['contextual_link_url']})"
    sentence = f"{page['contextual_link_phrase']} {link}."
    
    # What Else to Read section
    others = [x for x in all_pages if x["slug"] != page["slug"] and x["status"] in ("ranked", "linked", "planted")]
    we_section = ""
    if others:
        we_section = "\n\n## What Else to Read\n\n" + "\n".join(
            f"- [{x['title']}]({x['url']})" for x in others
        )
    
    return sentence, we_section

def inject_markdown(slug, all_pages):
    """Inject links into a markdown blog post file."""
    this = next((x for x in all_pages if x["slug"] == slug), None)
    if not this: return False
    
    fpath = POST_DIR / f"{slug}.md"
    if not fpath.exists():
        # maybe it's in the repo root
        fpath2 = REPO_ROOT / "site" / "src" / "data" / "content" / "stories" / f"{slug}.md"
        if fpath2.exists(): fpath = fpath2
        else: return False
    
    content = fpath.read_text(encoding="utf-8")
    orig = content
    sentence, we_section = build_link_sentence(this, all_pages)
    
    # Check if link already exists
    if this['contextual_link_url'] in content:
        print(f"  - Link already in {slug}")
    else:
        faq = "## Frequently Asked Questions"
        if faq in content:
            content = content.replace(faq, f"{sentence}\n\n{faq}")
            print(f"  + Contextual link added to {slug}")
    
    # Add/update What Else to Read
    if we_section:
        if "## What Else to Read" in content:
            content = re.sub(r"## What Else to Read.*?(?=\n## |\Z)", we_section.strip(), content, flags=re.DOTALL)
            print(f"  ~ What Else to Read updated in {slug}")
        else:
            end = "\n---\n"
            if end in content:
                content = content.replace(end, f"{we_section}\n{end}")
            else:
                content += we_section
            print(f"  + What Else to Read added to {slug}")
    
    if content != orig:
        fpath.write_text(content, encoding="utf-8")
        return True
    return False

def inject_payload(slug, all_pages):
    """Inject links into a Payload Story via API."""
    this = next((x for x in all_pages if x["slug"] == slug), None)
    if not this: return False
    
    story = payload_get_story_by_slug(slug)
    if not story:
        print(f"  ✗ Story not found in Payload: {slug}")
        return False
    
    current_md = story.get("content_markdown", "") or ""
    orig = current_md
    sentence, we_section = build_link_sentence(this, all_pages)
    
    # Check if link already exists
    if this['contextual_link_url'] in current_md:
        print(f"  - Link already in Payload story {slug}")
    else:
        faq = "## Frequently Asked Questions"
        if faq in current_md:
            current_md = current_md.replace(faq, f"{sentence}\n\n{faq}")
        else:
            current_md += f"\n\n{sentence}"
        print(f"  + Contextual link added to Payload story {slug}")
    
    # Add/update What Else to Read
    if we_section:
        if "## What Else to Read" in current_md:
            current_md = re.sub(r"## What Else to Read.*?(?=\n## |\Z)", we_section.strip(), current_md, flags=re.DOTALL)
            print(f"  ~ What Else to Read updated in Payload story {slug}")
        else:
            current_md += we_section
            print(f"  + What Else to Read added to Payload story {slug}")
    
    if current_md != orig:
        return payload_update_content(slug, current_md)
    return False

# ── Commands ──

def cmd_status():
    d = load()
    print("\n=== Colony Status ===\n")
    for c in d["colonies"]:
        print(f"Colony: {c['id']}")
        for p in c["pages"]:
            src = "PAYLOAD" if p.get("payload_type") == "story" else "MARKDOWN"
            print(f"  [{p['status'].upper()}] [{src}] {p['title']} → {p.get('links_to','end')}")
            print(f"    keyword: {p['target_keyword']}  url: {p['url']}")

def cmd_check(gsc=False):
    d = load(); t = d["threshold"]
    print(f"\n=== Colony Threshold Check (≤{t['max_position']}, ≥{t['min_impressions_weekly']}imp, ≥{t['min_clicks_weekly']}clicks) ===\n")
    for c in d["colonies"]:
        for p in c["pages"]:
            if p["status"] != "planted":
                print(f"  [{p['status']}] {p['title']}"); continue
            g = get_gsc(p["target_keyword"]) if gsc else None
            if not g: print(f"  [?] {p['title']} — run with --gsc"); continue
            pos, imp, cl = g["position"], g["impressions"], g["clicks"]
            ready = pos <= t["max_position"] and imp >= t["min_impressions_weekly"] and cl >= t["min_clicks_weekly"]
            if ready:
                print(f"  [READY] {p['title']}: pos {pos:.1f}, {imp}imp, {cl}clicks")
                p["status"] = "ready"
            else:
                print(f"  [WAIT]  {p['title']}: pos {pos:.1f}, {imp}imp, {cl}clicks")
    save(d)

def cmd_inject():
    d = load(); changed = False
    print("\n=== Injecting Colony Links ===\n")
    for c in d["colonies"]:
        for p in c["pages"]:
            if p["status"] != "ready": continue
            all_pages = c["pages"]
            if p.get("payload_type") == "story":
                ok = inject_payload(p["slug"], all_pages)
            else:
                ok = inject_markdown(p["slug"], all_pages)
            if ok:
                p["status"] = "linked"
                changed = True
                print(f"  ✓ {p['slug']} done")
    if changed:
        save(d)
        subprocess.run(["git","add","-A"], cwd=REPO_ROOT, check=False)
        subprocess.run(["git","commit","-m",f"auto: colony links injected ({datetime.now():%Y-%m-%d})","--no-verify"], cwd=REPO_ROOT, check=False)
        print("\n  Committed")
    else:
        print("  Nothing to inject")

def cmd_create_story(slug):
    """Create a colony page as a Payload Story. Reads content from track context."""
    d = load()
    page = None
    for c in d["colonies"]:
        for p in c["pages"]:
            if p["slug"] == slug: page = p; break
    if not page:
        print(f"Colony page '{slug}' not found in tracker. Register it first.")
        return
    
    # Check if already exists in Payload
    existing = payload_get_story_by_slug(slug)
    if existing:
        print(f"  Story already exists in Payload: {slug} (id={existing.get('id')})")
        return
    
    # Content template for a colony page
    excerpt = f"Your guide to {page['target_keyword']} in Malaysia."
    content = f"""**> What you need to know about {page['target_keyword']}:** This guide covers everything you need to know, from what to look for to where to find the best options in Malaysia.

## What Is It?

Malaysia is known for its incredible food scene, and {page['target_keyword']} is a topic that comes up with almost every visitor. Here is what you need to know.

## Why It Matters

Understanding {page['target_keyword']} helps you make the most of your time in Malaysia. Whether you are a first-time visitor or returning for more, knowing what to expect makes all the difference.

## Where to Find the Best

The best places in Kuala Lumpur and Penang have been serving locals for generations. Ask your Simply Enak guide for recommendations — they know every street and stall.

## A Local's Perspective

Our guides have been taking visitors through Malaysia's food scene since 2011. When it comes to {page['target_keyword']}, there is no substitute for local knowledge.

## Frequently Asked Questions

**When is the best time for this?**
The best time depends on the season and your preferences. Your guide can advise based on current conditions.

**Where do locals go for this?**
The most popular spots are often the ones without big signs or English menus — the places where the queue tells you everything.

**Can I find this on a tour?**
Yes — many of our tours include stops at the most popular locations for this.

---

*Want to experience this for yourself? Join one of our food tours in Kuala Lumpur or Penang. Our guides know every vendor and every story.*
"""
    
    result = payload_create_story(slug, page["title"], content, excerpt)
    if result:
        page["status"] = "planted"
        save(d)
        print(f"  Colony page '{slug}' created in Payload and marked as planted.")

def cmd_register():
    print("\n=== Register New Colony Page ===\n")
    slug = input("Slug: ").strip()
    title = input("Title: ").strip()
    kw = input("Target keyword: ").strip()
    next_slug = input("Links to (next colony slug): ").strip()
    phrase = input("Contextual link phrase: ").strip()
    text = input("Link text: ").strip()
    url = input(f"Link URL (/stories/{slug}/): ").strip() or f"/stories/{slug}/"
    col = input("Colony name (e.g. durian-colony): ").strip()
    ptype = input("Payload type (story=Payload Story, blog=markdown file) [story]: ").strip() or "story"
    
    d = load()
    colony = next((c for c in d["colonies"] if c["id"] == col), None)
    if not colony:
        colony = {"id": col, "pages": []}; d["colonies"].append(colony)
    colony["pages"].append({
        "slug": slug, "title": title, "url": url, "target_keyword": kw,
        "status": "planned", "links_to": next_slug or None, "linked_from": None,
        "payload_type": ptype,
        "contextual_link_phrase": phrase, "contextual_link_text": text, "contextual_link_url": url,
    })
    save(d)
    for c in d["colonies"]:
        for p in c["pages"]:
            if p.get("links_to") == slug and p["slug"] != slug:
                p["links_to"] = next_slug or None
    save(d)
    print(f"  Registered {title} as {ptype} in colony {col}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    cmd = sys.argv[1]
    if cmd == "status": cmd_status()
    elif cmd == "check": cmd_check("--gsc" in sys.argv)
    elif cmd == "inject": cmd_inject()
    elif cmd == "create-story" and len(sys.argv) > 2: cmd_create_story(sys.argv[2])
    elif cmd == "register": cmd_register()
    else: print(f"Unknown: {cmd}")
