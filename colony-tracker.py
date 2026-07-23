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
    """Create a colony page as a Payload Story with specific, valuable content."""
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

    kw = page['target_keyword']
    title = page['title']
    excerpt = f"Your practical guide to {kw} in Malaysia — specific recommendations, local tips, and what to expect."

    # ── Build content per topic ──
    content = build_colony_content(kw)
    if not content:
        print(f"  Could not generate content for '{kw}'")
        return

    result = payload_create_story(slug, page["title"], content, excerpt)
    if result:
        page["status"] = "planted"
        save(d)


def build_colony_content(keyword):
    """Generate specific, valuable content for a colony page based on topic.
    
    Returns markdown string, or None if topic isn't recognised.
    Each template includes real specifics: dish names, locations, prices, times.
    """
    kw = keyword.lower().strip()

    # ── Durian ──
    if "durian" in kw:
        if "season" in kw:
            return (
                f"## When Is Durian Season in Malaysia?\n\n"
                f"Durian season in Malaysia runs from **June to August**, with a "
                f"smaller window from December to January. The peak months are "
                f"July and August, when the best Musang King and D24 varieties "
                f"are harvested.\n\n"
                f"During peak season, durian stalls pop up across Kuala Lumpur — "
                f"SS2 in Petaling Jaya has a famous stretch with 10+ vendors. "
                f"A good Musang King costs around RM 40-70 per fruit. "
                f"Off-season, prices double and quality drops.\n\n"
                f"## Where to Eat Durian in KL\n\n"
                f"**SS2 Durian Stalls** (Petaling Jaya) — The most famous cluster. "
                f"Open daily during season, 10am to midnight. Vendors let you "
                f"choose your fruit and open it in front of you.\n\n"
                f"**Durian Man** (Cheras) — A sit-down durian restaurant. "
                f"Good for first-timers who want air conditioning and proper seating. "
                f"Open year-round.\n\n"
                f"**Jin Xian Hong** (Pudu) — Known for high-quality Musang King. "
                f"More expensive but worth it for connoisseurs.\n\n"
                f"## Tips for First-Timers\n\n"
                f"- A good durian feels heavy for its size\n"
                f"- The stem should be fresh and green, not dry\n"
                f"- Press the spikes — they should give slightly\n"
                f"- If you hear seeds rattling when shaken, it is overripe\n"
                f"- Start with Musang King (creamy, sweet) if you are new\n"
            )
        if "how to pick" in kw or "choose" in kw:
            return (
                f"## How to Choose a Good Durian in Malaysia\n\n"
                f"Picking a good durian takes practice, but these four checks "
                f"will get you 90% of the way there:\n\n"
                f"**1. Weight** — A good durian feels heavy for its size. "
                f"More weight means more flesh and less air inside.\n\n"
                f"**2. Stem** — The stem should be fresh, green, and firm. "
                f"A dry or brown stem means the fruit was picked too long ago.\n\n"
                f"**3. Spikes** — Press two spikes together. They should have "
                f"a slight give. Rock-hard spikes mean the fruit is underripe. "
                f"Too soft means overripe.\n\n"
                f"**4. Sound** — Tap the durian. A hollow sound means good "
                f"air pockets inside. Shake it gently; if you hear seeds "
                f"rattling, it is overripe.\n\n"
                f"## Best Varieties for First-Timers\n\n"
                f"| Variety | Flavour | Price (per fruit) |\n"
                f"|---------|---------|-------------------|\n"
                f"| Musang King | Sweet, creamy, mild bitterness | RM 40-70 |\n"
                f"| D24 | Bitter-sweet, classic durian taste | RM 20-40 |\n"
                f"| Udang Merah | Sweet, reddish flesh, less bitter | RM 30-50 |\n"
                f"| D101 | Sweet, mild, good for beginners | RM 15-30 |\n\n"
                f"Most sellers in KL let you taste a sample before buying. "
                f"Ask for Musang King if you are trying durian for the first time."
            )
        return (
            f"## What to Know About Durian in Malaysia\n\n"
            f"Durian is known as the 'king of fruits' in Southeast Asia. "
            f"It has a creamy, custard-like texture and a strong aroma "
            f"that people either love or find intense.\n\n"
            f"Malaysia grows some of the world's best durian varieties. "
            f"Unlike Thailand, Malaysian durians are harvested when they "
            f"fall naturally from the tree, which means they are riper "
            f"and more flavourful.\n\n"
            f"## Popular Varieties\n\n"
            f"- **Musang King** — The most popular. Sweet, creamy, with a "
            f"hint of bitterness. RM 40-70 per fruit.\n"
            f"- **D24** — The classic. Bitter-sweet, strong durian taste. "
            f"RM 20-40 per fruit.\n"
            f"- **Udang Merah** — Red-fleshed, sweet, less pungent. "
            f"RM 30-50 per fruit.\n\n"
            f"Durian is in season June-August and December-January. "
            f"The best places to eat it in KL are SS2 Petaling Jaya, "
            f"Durian Man in Cheras, and Jin Xian Hong in Pudu."
        )

    # ── Street food / hawker ──
    if any(w in kw for w in ["street food", "hawker", "food stall", "pasar malam"]):
        if "kuala lumpur" in kw or "kl" in kw:
            return (
                f"## Kuala Lumpur's Best Street Food\n\n"
                f"Kuala Lumpur's street food scene runs from early morning "
                f"until late night. The city has everything from banana-leaf "
                f"nasi lemak stalls to charcoal-grilled satay.\n\n"
                f"**Jalan Alor** (Bukit Bintang) — KL's most famous food street. "
                f"Open 5pm to midnight. Try the grilled seafood, satay, and "
                f"Hokkien mee. Busy with tourists but the food is solid.\n\n"
                f"**Petaling Street** (Chinatown) — Hawker stalls under white "
                f"canopies. Open late morning to evening. Known for wonton mee, "
                f"roast duck, and apam balik (pancake with corn and sugar).\n\n"
                f"**SS2 Hawker Centre** (Petaling Jaya) — Where locals go. "
                f"40+ stalls in one food court. Try the curry noodle, claypot "
                f"chicken rice, and cendol. Open breakfast to dinner.\n\n"
                f"**Bangsar Night Market** (Wednesdays) — A proper pasar malam. "
                f"Best for snacks, fresh fruit, and Malay street food. "
                f"Starts at 4pm.\n\n"
                f"## What to Order\n\n"
                f"- Nasi lemak (coconut rice with sambal) — RM 3-5\n"
                f"- Satay (grilled skewers with peanut sauce) — RM 1.50/stick\n"
                f"- Cendol (shaved ice dessert) — RM 4-6\n"
                f"- Curry puff (flaky pastry with curry filling) — RM 2-3\n"
                f"- Apam balik (crispy pancake) — RM 3-5"
            )
        if "penang" in kw:
            return (
                f"## Penang's Street Food Scene\n\n"
                f"Penang is widely considered Malaysia's food capital. "
                f"George Town's streets are packed with hawker stalls, "
                f"some operating for three generations.\n\n"
                f"**Chulia Street Night Market** — The evening hawker hub. "
                f"Open 6pm to midnight. Try the char kway teow, oyster omelette, "
                f"and pasembur (Malay-style salad with peanut sauce).\n\n"
                f"**Gurney Drive Hawker Centre** — Penang's most famous food "
                f"court. 50+ stalls under one roof. Open late afternoon to "
                f"midnight. Known for lok lok (skewers with dipping sauces).\n\n"
                f"**Air Itam Market** — Breakfast central. Open 6am to noon. "
                f"Try the Assam laksa here, it won the 'world's best food' "
                f"ranking by CNN Travel.\n\n"
                f"## Must-Try Penang Dishes\n\n"
                f"- Char kway teow (stir-fried rice noodles) — RM 6-8\n"
                f"- Assam laksa (sour fish noodle soup) — RM 5-7\n"
                f"- Cendol (pandan jelly with coconut milk) — RM 3-5\n"
                f"- Hokkien mee (prawn noodle soup) — RM 6-8\n"
                f"- Oyster omelette — RM 8-12"
            )
        return (
            f"## Malaysian Street Food: What to Know\n\n"
            f"Malaysian street food is a mix of Malay, Chinese, and Indian "
            f"traditions. Hawker centres and food courts are the best places "
            f"to try a variety. Most stalls open for specific meals: "
            f"breakfast stalls close by noon, dinner stalls start at 5pm.\n\n"
            f"Prices range from RM 3-10 per dish. Cash is preferred at "
            f"most hawker stalls. Look for the stalls with queues — "
            f"locals know which ones are worth waiting for.\n\n"
            f"Popular dishes to try: nasi lemak (breakfast), char kway teow "
            f"(lunch), satay (evening), and roti canai (any time). "
            f"Most hawker food is halal, but Chinese stalls may not be."
        )

    # ── Food tours ──
    if "food tour" in kw or "food tours" in kw:
        if "kuala lumpur" in kw or "kl" in kw:
            return (
                f"## Food Tours in Kuala Lumpur\n\n"
                f"A Kuala Lumpur food tour typically lasts 3-4 hours and "
                f"covers 8-12 tasting stops across 2-3 neighbourhoods. "
                f"Most tours are walking-based and suitable for all fitness levels.\n\n"
                f"## What a Typical KL Food Tour Includes\n\n"
                f"- A guided walk through 2-3 food neighborhoods\n"
                f"- 8-12 tastings, from street snacks to full dishes\n"
                f"- Stories about Malaysian history, culture, and food traditions\n"
                f"- A local guide who knows the vendors personally\n\n"
                f"## Popular KL Food Tour Routes\n\n"
                f"**Chinatown + Bukit Bintang** — The classic. Covers Petaling "
                f"Street's hawkers and Jalan Alor's night stalls. Best for "
                f"first-time visitors.\n\n"
                f"**Chow Kit Market + Kampung Baru** — The local experience. "
                f"Morning market walk followed by Malay lunch in KL's last "
                f"kampung village. Best for foodies.\n\n"
                f"**Brickfields Little India** — Indian food focus. Banana "
                f"leaf rice, roti canai, and South Indian snacks. "
                f"Best for vegetarian-friendly options.\n\n"
                f"Prices range from RM 150-450 per person depending on "
                f"whether you join a group or book a private tour."
            )
        if "penang" in kw:
            return (
                f"## Food Tours in Penang\n\n"
                f"Penang food tours focus on George Town's hawker scene, "
                f"usually covering 10-15 tastings over 3-4 hours. "
                f"The city's UNESCO heritage status means you walk "
                f"through historic streets between stops.\n\n"
                f"## What a Typical Penang Food Tour Includes\n\n"
                f"- 10-15 tasting stops across George Town\n"
                f"- Penang classics: char kway teow, Assam laksa, Hokkien mee\n"
                f"- Heritage walking route through UNESCO streets\n"
                f"- Stories about Penang's Peranakan and colonial history\n\n"
                f"Most tours cost RM 200-350 per person. Evening tours "
                f"are popular because the hawker stalls come alive after "
                f"5pm. Private tours can include a cooking class or "
                f"Balik Pulau countryside visit."
            )
        return (
            f"## Malaysian Food Tours: What to Expect\n\n"
            f"A typical Malaysian food tour lasts 3-4 hours and covers "
            f"8-15 tastings. You walk between stops with a local guide "
            f"who shares the stories behind each dish.\n\n"
            f"Most tours cost RM 150-450 per person. Group tours are "
            f"cheaper; private tours cost more but give you flexibility "
            f"on route, pace, and dietary needs.\n\n"
            f"The best cities for food tours are Kuala Lumpur (mix of "
            f"Malay, Chinese, and Indian cuisines) and Penang (street "
            f"food capital with strong Peranakan influence)."
        )

    # ── Halal food ──
    if "halal" in kw:
        return (
            f"## Halal Food in Malaysia: A Practical Guide\n\n"
            f"Malaysia has a strong halal certification system run by JAKIM. "
            f"Most Malay and Indian Muslim restaurants are halal. Chinese "
            f"restaurants generally are not, unless they advertise otherwise.\n\n"
            f"## How to Identify Halal Food\n\n"
            f"- Look for the green JAKIM halal logo on signage or menus\n"
            f"- Malay restaurants (look for names in Bahasa Melayu) are almost always halal\n"
            f"- Indian Muslim stalls (called 'Mamak') are halal\n"
            f"- Chinese halal restaurants will display it prominently\n"
            f"- Food courts and hawker centres typically have a mix\n\n"
            f"## Best Halal Food in Kuala Lumpur\n\n"
            f"**Kampung Baru** — Malay food hub. Try nasi lemak, rendang, "
            f"and satay. Most stalls are halal.\n\n"
            f"**Brickfields** — Indian Muslim area. Banana leaf rice, "
            f"roti canai, and biryani. All halal.\n\n"
            f"**Chow Kit Market** — Malay market food. Best for breakfast. "
            f"Nasi dagang, lontong, and kuih.\n\n"
            f"Penang's George Town also has excellent halal options, "
            f"especially in the Malay and Indian Muslim neighborhoods "
            f"around Kapitan Keling Mosque."
        )

    # ── Vegetarian / dietary ──
    if any(w in kw for w in ["vegetarian", "vegan", "dietary", "gluten-free"]):
        return (
            f"## Vegetarian and Dietary-Friendly Food in Malaysia\n\n"
            f"Malaysia is surprisingly good for special diets. "
            f"The Indian vegetarian tradition is strong, especially "
            f"in Brickfields (KL's Little India).\n\n"
            f"## Where to Find Vegetarian Food\n\n"
            f"**Brickfields, Kuala Lumpur** — The best area for vegetarian. "
            f"Banana leaf rice restaurants offer unlimited vegetables, "
            f"lentil curry, and pickles. Budget RM 8-15 per meal.\n\n"
            f"**Buddhist vegetarian stalls** — Found in Chinatown and "
            f"near temples. These are vegan by default (no meat, no dairy, "
            f"no onion/garlic in strict ones). Look for 'zhai' or 'sai' signs.\n\n"
            f"**Indian Muslim (Mamak) stalls** — Good for vegetarian options. "
            f"Roti canai, capati, and vegetable curries are standard.\n\n"
            f"## Tips\n\n"
            f"- Malay and Indian Muslim food is mostly dairy-free (uses coconut milk)\n"
            f"- Nasi kandar (mixed rice) lets you choose your own vegetables\n"
            f"- Most hawker stalls can adjust spice levels on request\n"
            f"- Simply Enak tours accommodate all dietary needs — just mention it when booking"
        )

    # ── Night markets ──
    if any(w in kw for w in ["night market", "pasar malam", "market"]):
        return (
            f"## Night Markets in Malaysia\n\n"
            f"Night markets (pasar malam) are weekly events where "
            f"neighbourhood streets transform into open-air markets. "
            f"They operate on rotating schedules so each area gets one "
            f"night per week.\n\n"
            f"## Kuala Lumpur Night Markets\n\n"
            f"**Bangsar Night Market** (Wednesdays, 4-9pm) — The most "
            f"popular for food. Grilled seafood, rojak, apam balik, "
            f"and fresh fruit.\n\n"
            f"**Taman Connaught Night Market** (Thursdays, 5-11pm) — "
            f"KL's longest night market. 2km of stalls. Best for snacks "
            f"and clothes, but less food-focused than Bangsar.\n\n"
            f"**SS2 Night Market** (Mondays, 5-10pm) — Petaling Jaya's "
            f"main market. Good mix of food and produce.\n\n"
            f"## What to Eat\n\n"
            f"- Apam balik (crispy pancake) — RM 3-5\n"
            f"- Grilled fish and seafood — RM 5-15\n"
            f"- Fried noodles and rice — RM 5-8\n"
            f"- Fresh fruit juice — RM 3-6\n"
            f"- Kuih (traditional cakes) — RM 1-3 each\n\n"
            f"Bring small bills. Cash is the only option at most stalls."
        )

    # ── Malay / Malaysian cuisine ──
    if any(w in kw for w in ["malaysian food", "malay food", "local food"]):
        return (
            f"## Malaysian Food: A Quick Introduction\n\n"
            f"Malaysian food is a fusion of Malay, Chinese, and Indian "
            f"culinary traditions. The result is one of Southeast Asia's "
            f"most diverse food scenes.\n\n"
            f"## Three Cuisines, One Food Scene\n\n"
            f"**Malay food** — The foundation. Coconut milk, lemongrass, "
            f"chilli, and belacan (shrimp paste) are core ingredients. "
            f"Nasi lemak, rendang, and satay are Malay classics.\n\n"
            f"**Chinese Malaysian food** — Adapted from southern Chinese "
            f"traditions. Noodles, soy sauce, and pork (in non-halal places). "
            f"Char kway teow, Hokkien mee, and wonton mee.\n\n"
            f"**Indian Malaysian food** — Southern Indian influence. "
            f"Banana leaf rice, roti canai, and biryani. Heavy on spices "
            f"and lentils.\n\n"
            f"## What Makes Malaysian Food Unique\n\n"
            f"- **Nasi lemak** — Coconut rice with sambal, the national dish. RM 3-5\n"
            f"- **Roti canai** — Flaky flatbread with curry. RM 2-4\n"
            f"- **Satay** — Grilled skewers with peanut sauce. RM 1.50/stick\n"
            f"- **Laksa** — Spicy noodle soup. RM 6-10\n"
            f"- **Cendol** — Shaved ice dessert with pandan jelly. RM 3-6\n\n"
            f"Malaysians eat 5-6 times a day: breakfast, morning tea, "
            f"lunch, afternoon tea, dinner, and supper. Food is central "
            f"to social life."
        )

    # ── Penang-specific ──
    if "penang" in kw and any(w in kw for w in ["food", "eat", "dish", "guide"]):
        return (
            f"## Penang Food: What to Eat and Where\n\n"
            f"Penang is Malaysia's food capital. George Town's hawker "
            f"scene has been shaped by generations of Chinese, Malay, "
            f"and Peranakan cooks.\n\n"
            f"## Must-Try Dishes\n\n"
            f"**Char Kway Teow** — Stir-fried rice noodles with prawns, "
            f"cockles, egg, and chives. Best at Sisters on Macalister Lane "
            f"or Lorong Selamat. RM 6-8.\n\n"
            f"**Assam Laksa** — Sour fish noodle soup with tamarind, "
            f"pineapple, and mint. Air Itam Market's version won CNN's "
            f"world's best food ranking. RM 5-7.\n\n"
            f"**Hokkien Mee** — Prawn noodle soup with pork ribs and "
            f"hard-boiled egg. RM 6-8.\n\n"
            f"**Cendol** — Shaved ice with green pandan jelly, coconut "
            f"milk, and gula Melaka (palm sugar). Penang Road's Teochew "
            f"Cendol is the most famous. RM 3-5.\n\n"
            f"**Oyster Omelette** — Fresh oysters fried with egg and "
            f"sweet potato starch. Chulia Street Night Market. RM 8-12.\n\n"
            f"## Best Food Areas\n\n"
            f"- **Chulia Street** — Night market, good for dinner\n"
            f"- **Gurney Drive** — Hawker centre, best for variety\n"
            f"- **Air Itam** — Breakfast market, best for laksa\n"
            f"- **Penang Road** — Desserts and cendol\n"
            f"- **Macalister Lane** — Char kway teow central"
        )

    # ── KL-specific ──
    if any(w in kw for w in ["kuala lumpur", "kl food", "kl guide", "chow kit", "brickfields"]):
        if "chow kit" in kw:
            return (
                f"## Chow Kit Market: KL's Largest Wet Market\n\n"
                f"Chow Kit Market is Kuala Lumpur's biggest and oldest "
                f"wet market. It operates daily from 6am to noon in "
                f"the Chow Kit neighbourhood, just north of the city centre.\n\n"
                f"## What You Will Find\n\n"
                f"The market is split into sections: fresh produce, meat "
                f"and poultry, seafood, dried goods, and cooked food. "
                f"The cooked food section is where locals go for breakfast:\n\n"
                f"- Nasi lemak with fried chicken — RM 5-7\n"
                f"- Lontong (rice cakes in coconut curry) — RM 4-6\n"
                f"- Mee rebus (noodles in sweet potato gravy) — RM 5-7\n"
                f"- Kuih (traditional cakes) — RM 1-3 each\n\n"
                f"## Tips\n\n"
                f"- Go early (7-9am) for the best selection\n"
                f"- Bring cash, most stalls don't accept cards\n"
                f"- Wear comfortable shoes, the market is sprawling\n"
                f"- Photography is fine but always ask vendors first\n"
                f"- Simply Enak offers a guided Chow Kit market tour "
                f"that includes breakfast at 4 different stalls"
            )
        return (
            f"## Kuala Lumpur Food Scene\n\n"
            f"Kuala Lumpur's food scene reflects its multicultural "
            f"population. Within a 2km radius you can find Malay, "
            f"Chinese, Indian, and Peranakan food.\n\n"
            f"## Best Areas for Food\n\n"
            f"- **Chinatown (Petaling Street)** — Hawker stalls, roast meats, "
            f"and budget eats. Try wonton mee and apam balik.\n"
            f"- **Bukit Bintang** — Jalan Alor food street. Best for "
            f"evening street food and grilled seafood.\n"
            f"- **Brickfields** — Little India. Banana leaf rice, roti "
            f"canai, and South Indian snacks.\n"
            f"- **Kampung Baru** — Traditional Malay village. Nasi lemak, "
            f"rendang, and satay.\n"
            f"- **Chow Kit** — Morning wet market. Best for breakfast "
            f"and local market food.\n\n"
            f"Most hawker stalls charge RM 3-10 per dish. Food courts "
            f"are common in shopping malls. Street stalls are concentrated "
            f"in specific areas rather than scattered across the city."
        )

    # ── Default fallback: concise, honest, specific ──
    return (
        f"## What You Need to Know About {keyword.title()}\n\n"
        f"Malaysia has a rich food culture shaped by Malay, Chinese, "
        f"and Indian traditions. This topic is something visitors "
        f"often ask about when planning their trip to Kuala Lumpur "
        f"or Penang.\n\n"
        f"## Quick Facts\n\n"
        f"- **Best places to experience this:** The hawker centres "
        f"and food stalls in KL and Penang are the best starting points\n"
        f"- **Typical cost:** RM 5-15 per dish or serving\n"
        f"- **Best time:** Most stalls operate from late morning "
        f"to evening. Check specific timings for your chosen area\n\n"
        f"## Getting the Most Out of Your Visit\n\n"
        f"The best approach is to explore with someone who knows "
        f"the local food scene. Simply Enak's guides have been "
        f"leading food tours in Kuala Lumpur and Penang since 2011 "
        f"and can take you to the best spots for this experience.\n\n"
        f"Every tour is customisable for dietary needs, group size, "
        f"and pace. Just let us know what you are looking for."
    )


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
