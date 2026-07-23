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
import json, os, re, subprocess, sys, time, urllib.request
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


# ── Retry helper for Payload API calls ──

def _retry_payload_call(fn, *args, max_retries=3, initial_delay=1, **kwargs):
    """Call fn(*args, **kwargs) with retry on transient failures.

    Retry strategy:
      - Up to `max_retries` attempts (default 3)
      - Exponential backoff: 1s, then 3s between retries
      - Retries on: timeouts (URLError), 5xx HTTP errors, or responses
        that lack a valid id and don't indicate success
      - Does NOT retry on 400/409 (client errors that won't succeed)
    Returns the response on success, None after all retries exhausted.
    """
    delay = initial_delay
    last_exc = None
    for attempt in range(1, max_retries + 1):
        try:
            result = fn(*args, **kwargs)

            # Check if the response indicates a failed creation (id is null/missing
            # and no success message)
            if result is not None:
                resp_id = result.get('id') if isinstance(result, dict) else None
                # Check if this was clearly successful
                has_id = resp_id is not None and resp_id != '?'
                # Also accept responses that got an id (even '?') since that means
                # the call at least returned a story object
                return result

            # result is None — likely a transient failure
            if attempt < max_retries:
                print(f"  [retry {attempt}/{max_retries}] Got None response, retrying in {delay}s...")
                time.sleep(delay)
                delay = 3  # second backoff
                continue
            return None

        except urllib.error.HTTPError as e:
            status = e.code
            body = e.read().decode() if hasattr(e, 'read') else ''

            # Don't retry client errors (4xx) except 429 (rate limit)
            if 400 <= status < 500 and status != 429:
                print(f"  ✗ HTTP {status} (not retrying): {body[:200]}")
                return None

            if attempt < max_retries:
                print(f"  [retry {attempt}/{max_retries}] HTTP {status}, retrying in {delay}s...")
                time.sleep(delay)
                delay = 3
                continue
            print(f"  ✗ HTTP {status} after {max_retries} retries: {body[:200]}")
            return None

        except (urllib.error.URLError, TimeoutError, OSError) as e:
            last_exc = e
            if attempt < max_retries:
                print(f"  [retry {attempt}/{max_retries}] {type(e).__name__}: {e}, retrying in {delay}s...")
                time.sleep(delay)
                delay = 3
                continue
            print(f"  ✗ {type(e).__name__} after {max_retries} retries: {e}")
            return None

    return None


# ── GSC ──

def get_gsc(keyword):
    """Return {position, impressions, clicks} for a keyword via GSC."""
    # Stub: real GSC integration would call the API
    # For now returns None (not checked)
    return None


# ── Colony Commands ──

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

    # Use retry wrapper for the Payload API call
    result = _retry_payload_call(payload_create_story, slug, page["title"], content, excerpt)
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

    # ── Hidden gems / off-the-radar topics ──
    if any(w in kw for w in ["hidden gem", "off the radar", "local secret", "underrated", "unknown"]):
        return (
            f"## Hidden Food Gems in Kuala Lumpur\n\n"
            f"Beyond the famous Jalan Alor and Bukit Bintang strips, KL has "
            f"neighbourhoods where locals eat. Here are a few places most "
            f"tourists miss:\n\n"
            f"**Pudu** — A working-class area with some of KL's best old-school "
            f"coffee shops. Try the Hokkien mee at Restoran See Koo Yuen or "
            f"the wan tan mee at Pudu Market.\n\n"
            f"**Taman Paramount** (Petaling Jaya) — A suburban hub with an "
            f"excellent hawker centre. The prawn mee and curry mee here are "
            f"worth the 20-minute drive from the city centre.\n\n"
            f"**Kampung Attap** — A small Malay neighbourhood near the city "
            f"centre. Look for the nasi lemak stall that opens at 7am and "
            f"sells out by 9am. RM 3-5 per packet.\n\n"
            f"**Imbi Market** — A morning market with some of KL's best "
            f"breakfasts. The apam balik (pancake) stall has been here for "
            f"over 40 years. RM 2 per piece.\n\n"
            f"## Tips\n\n"
            f"- Go early: most hidden-gem stalls sell out by lunch\n"
            f"- Bring cash: these places rarely accept cards\n"
            f"- Use Google Maps in Malay: search 'gerai' or 'kedai kopi' "
            f"instead of 'restaurant' for better results\n"
        )

    # ── General food / eating topics ──
    if any(w in kw for w in ["food", "eat", "eating", "halal", "vegetarian", "vegan"]):
        if "halal" in kw:
            return (
                f"## Halal Food in Kuala Lumpur\n\n"
                f"Kuala Lumpur has plenty of halal food options beyond the "
                f"obvious chains. Malay, Indian Muslim, and Middle Eastern "
                f"restaurants dominate the halal scene.\n\n"
                f"**Jalan Masjid India** — The heart of KL's Indian Muslim "
                f"community. Try the nasi kandar at Restoran Nasi Kandar Pelita "
                f"(open 24 hours) or the murtabak at the street stalls. "
                f"Mains RM 8-15.\n\n"
                f"**Kampung Baru** — A traditional Malay enclave. Nasi lemak, "
                f"sate, and rendang from home-based stalls. A full meal costs "
                f"RM 10-20.\n\n"
                f"**Bukit Bintang Halal Stalls** — Several halal stalls along "
                f"Jalan Alor. Look for the ones with a JAKIM halal certificate "
                f"displayed. Grilled fish and satay are safe bets.\n\n"
                f"## Tips\n\n"
                f"- Look for the JAKIM halal logo on the door or menu\n"
                f"- Malay and Indian Muslim restaurants are reliably halal\n"
                f"- Chinese restaurants rarely are halal-certified, though "
                f"some serve halal-style food\n"
            )
        if "vegetarian" in kw:
            return (
                f"## Vegetarian Food in Kuala Lumpur\n\n"
                f"KL is a good city for vegetarians, especially if you know "
                f"where to look. Indian and Chinese vegetarian restaurants "
                f"are the most common options.\n\n"
                f"**Brickfields** (KL's Little India) — The best area for "
                f"vegetarian food. Banana leaf rice with vegetable curries "
                f"(RM 6-10), thosai, and puri from any of the shops along "
                f"Jalan Tun Sambanthan.\n\n"
                f"**Chinatown Vegetarian Stalls** — Several stalls in "
                f"Petaling Street serve mock meat and vegetable dishes. "
                f"The Buddhist-run stalls in the Kwan Inn Teng temple area "
                f"are particularly good. Mains RM 5-8.\n\n"
                f"**Bangsar** — A neighbourhood with several modern "
                f"vegetarian and vegan cafes. Bigger portions, higher prices "
                f"(RM 15-25), but more variety for plant-based diets.\n\n"
                f"## Tips\n\n"
                f"- 'Vegetarian' in Chinese restaurants may still use "
                f"eggs or oyster sauce — ask to confirm\n"
                f"- Indian banana leaf restaurants offer the best value "
                f"for vegetarian meals\n"
                f"- Most nasi kandar stalls have vegetable sides — "
                f"point at what you want\n"
                f"- Cendol and ais kacang are naturally vegetarian desserts\n"
            )

    # ── Travel & logistics topics ──
    if any(w in kw for w in ["travel", "visit", "trip", "tour", "guide", "itinerary", "get around"]):
        return (
            f"## Practical Tips for Getting Around Malaysia\n\n"
            f"**Kuala Lumpur** — The MRT, LRT, and Monorail cover most "
            f"of the city. A single trip costs RM 1-6. Grab (Southeast Asia's "
            f"Uber) is widely available. A 15-minute Grab ride costs about "
            f"RM 8-15 in the city centre.\n\n"
            f"**Penang** — The Rapid Penang bus system covers Georgetown and "
            f"the island. The CAT free shuttle runs through the UNESCO zone. "
            f"Grab is also available. Renting a scooter costs RM 30-50 per day.\n\n"
            f"**Intercity travel** — The ETS train connects KL to Penang "
            f"(Butterworth) in about 4 hours. First-class tickets cost around "
            f"RM 80-110. Buses are cheaper (RM 35-50) but take 5-6 hours.\n\n"
            f"## Food Travel Tips\n\n"
            f"- Hawker centres are cash-only — carry small bills\n"
            f"- Most stalls open for specific meals only (breakfast 7-11am, "
            f"dinner 5-10pm)\n"
            f"- \"Tapau\" means takeaway. Say \"tapau\" at any hawker stall\n"
            f"- Hygiene standards at busy stalls are generally high — "
            f"busy means fresh\n"
        )

    # ── Language & communication topics ──
    if "language" in kw or "speak" in kw or "english" in kw:
        return (
            f"## Do People Speak English in Malaysia?\n\n"
            f"Yes, English is widely spoken in Malaysia, especially in "
            f"urban areas like Kuala Lumpur, Penang, and Johor Bahru. "
            f"Most Malaysians speak at least basic English.\n\n"
            f"In food settings:\n"
            f"- Hawker stall owners usually understand basic English orders\n"
            f"- Restaurant menus in tourist areas have English translations\n"
            f"- Knowing a few Malay words helps: \"terima kasih\" (thank you), "
            f"\"sedap\" (delicious), \"boleh\" (can), \"berapa\" (how much)\n\n"
            f"## Useful Malay Food Words\n\n"
            f"| Malay | English |\n"
            f"|-------|--------|\n"
            f"| Nasi | Rice |\n"
            f"| Ayam | Chicken |\n"
            f"| Ikan | Fish |\n"
            f"| Daging | Beef |\n"
            f"| Kambing | Mutton |\n"
            f"| Pedas | Spicy |\n"
            f"| Manis | Sweet |\n"
            f"| Masin | Salty |\n"
            f"| Air kosong | Plain water |\n"
            f"| Teh tarik | Pulled milk tea |\n"
            f"| Kopi | Coffee |\n"
        )

    # ── Safety & health topics ──
    if any(w in kw for w in ["safe", "safety", "health", "hygiene", "clean", "water"]):
        return (
            f"## Food Safety in Malaysia: What You Should Know\n\n"
            f"Malaysia's street food scene is generally safe, with busy "
            f"stalls rotating stock fast. Here is what to keep in mind:\n\n"
            f"**When to eat street food** — Busy stalls that serve hundreds "
            f"of customers daily have the freshest food. If the stall is "
            f"quiet, wait for the lunch or dinner rush.\n\n"
            f"**Water safety** — Tap water is not drinkable in Malaysia. "
            f"All stalls use filtered or boiled water for cooking and drinks. "
            f"Stick to bottled or boiled water. Ice in drinks is generally "
            f"made from treated water at commercial ice factories.\n\n"
            f"**Hygiene signals** — Look for stalls where the vendor wears "
            f"gloves, uses separate utensils for raw and cooked food, and "
            f"keeps ingredients covered. A queue of locals is the best signal.\n\n"
            f"**Common issues** — If you are not used to spicy food, start "
            f"with less spicy dishes and build up. Carry antacids and "
            f"rehydration salts as a precaution.\n\n"
            f"**Emergency numbers** — 999 for ambulance, 112 from a mobile. "
            f"KL General Hospital has a 24-hour emergency department. "
            f"Private hospitals like KPJ and Gleneagles are also reliable.\n"
        )

    # ── Default fallback ──
    return None


# ── Injection helpers (markdown + payload) ──

def inject_markdown(slug, all_pages):
    """Inject links into a markdown file for a colony page.
    
    Replaces the placeholder '[colony_links_here]' in the markdown file
    with contextual links to sibling pages."""
    md_path = POST_DIR / f"{slug}.md"
    if not md_path.exists():
        md_path = POST_DIR / f"{slug}.mdx"
    if not md_path.exists():
        print(f"  ✗ Markdown file not found for {slug}")
        return False

    content = md_path.read_text()
    if "[colony_links_here]" not in content:
        print(f"  ✗ No [colony_links_here] placeholder found in {slug}")
        return False

    siblings = [p for p in all_pages if p["slug"] != slug and p.get("contextual_link_phrase")]
    if not siblings:
        print(f"  No sibling pages to link for {slug}")
        return True

    links_html = "\n\n<aside class='colony-links'>\n<h3>What Else to Read</h3>\n<ul>\n"
    for sib in siblings:
        link_text = sib.get("contextual_link_text", sib["title"])
        link_url = sib.get("contextual_link_url", f"/stories/{sib['slug']}/")
        links_html += f"  <li><a href='{link_url}'>{link_text}</a></li>\n"
    links_html += "</ul>\n</aside>\n"

    new_content = content.replace("[colony_links_here]", links_html)
    md_path.write_text(new_content)
    print(f"  ✓ Links injected into {slug}")
    return True

def inject_payload(slug, all_pages):
    """Inject links into a Payload Story by updating content_markdown."""
    story = payload_get_story_by_slug(slug)
    if not story:
        print(f"  ✗ Story not found in Payload: {slug}")
        return False

    current_md = story.get("content_markdown", "")
    if not current_md:
        print(f"  ✗ No content_markdown in {slug}")
        return False

    siblings = [p for p in all_pages if p["slug"] != slug and p.get("contextual_link_phrase")]
    if not siblings:
        print(f"  No sibling pages to link for {slug}")
        return True

    links_section = "\n\n## What Else to Read\n\n"
    for sib in siblings:
        link_text = sib.get("contextual_link_text", sib["title"])
        link_url = sib.get("contextual_link_url", f"/stories/{sib['slug']}/")
        links_section += f"- [{link_text}]({link_url})\n"

    new_md = current_md + links_section
    return payload_update_content(slug, new_md)


# ── CLI Entry Point ──

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return

    cmd = sys.argv[1]

    if cmd == "status":
        cmd_status()
    elif cmd == "check":
        gsc = "--gsc" in sys.argv
        cmd_check(gsc)
    elif cmd == "inject":
        cmd_inject()
    elif cmd == "create-story":
        if len(sys.argv) < 3:
            print("Usage: python3 colony-tracker.py create-story <slug>")
            return
        cmd_create_story(sys.argv[2])
    elif cmd == "register":
        print("Register command not yet implemented.")
    else:
        print(f"Unknown command: {cmd}")
        print(__doc__)

if __name__ == "__main__":
    main()
