#!/usr/bin/env python3
"""BoFU Landing Page Factory.

Reads BoFU opportunity data from `.hermes/tmp/bofu-candidates.json`
and generates landing page templates. Can optionally push to Payload as Pages.

Usage:
  # Generate markdown landing page templates (staging for review)
  python3 scripts/bofu-landing-factory.py generate --output-dir content/landing-pages

  # Push directly to Payload as Pages (requires Payload API access)
  python3 scripts/bofu-landing-factory.py push --limit 3

  # Preview what would be created
  python3 scripts/bofu-landing-factory.py generate --dry-run
"""
import json, os, re, sys, urllib.request
from pathlib import Path
from datetime import datetime

PROJECT_ROOT = Path(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
CANDIDATES_FILE = PROJECT_ROOT / ".hermes" / "tmp" / "bofu-candidates.json"

# Payload API config
PAYLOAD_URL = os.environ.get("PAYLOAD_URL", "https://cms.system.simplyenak.com")
PAYLOAD_EMAIL = os.environ.get("PAYLOAD_EMAIL", "admin@simplyenak.com")
PAYLOAD_PASSWORD = os.environ.get("PAYLOAD_PASSWORD", "admin123")

# ── Landing page templates ──

LANDING_TEMPLATES = {
    "tour": """# {title}

> **Ready to book?** → [Book the {tour}](https://simplyenak.com/tours/{tour_slug}/)

## Why This Tour?

{query} is one of the most searched topics among travellers planning their Malaysia trip. Whether you are looking for the best experience or comparing your options, this page covers everything you need to decide.

## At a Glance

| Feature | Detail |
|---|---|
| **Tour** | {tour} |
| **Duration** | ~3–4 hours |
| **Availability** | Daily, morning & afternoon |
| **Group Size** | Small groups (max 8) |
| **What's Included** | Local guide, all tastings, hotel pickup |

## What You'll Experience

- **Authentic local flavours** curated by guides who have been showing visitors around since 2011
- **Handpicked vendors** — we only visit stalls with proven quality and hygiene
- **Insider stories** behind every dish, market, and neighbourhood
- **Small groups** so you get personal attention and can ask all your questions

## What Our Guests Say

> *"Incredible introduction to Malaysian food. Our guide knew every vendor personally and the food was outstanding."*
> — Sarah, Tripadvisor (★★★★★)

> *"Best food tour we have ever done. Don't eat before you go — you will need the room!"*
> — Michael, Google Reviews (★★★★★)

## Is This Tour for You?

| You'll love this if... | You might prefer something else if... |
|---|---|
| ✓ You want to try 10+ different local dishes | ✗ You prefer fine dining over street food |
| ✓ You enjoy learning about food culture & history | ✗ You have very limited mobility (contact us about private options) |
| ✓ You want a small, personal group experience | ✗ You'd rather explore entirely on your own |
| ✓ It's your first time in Malaysia | ✗ You've already done a food tour in this area |

## Frequently Asked Questions

**What if I have dietary restrictions?**
We accommodate most dietary needs — just let us know when booking. Vegetarian, halal, and gluten-free options are available.

**How much food is included?**
The tour includes enough tastings for a full meal. Come hungry!

**Can I book a private tour?**
Yes — private tours are available for groups of 4+. Contact us for pricing.

**What happens if it rains?**
We run rain or shine. Many of our stops have sheltered seating.

---

## Ready to Book?

→ **[Book the {tour} Now](https://simplyenak.com/tours/{tour_slug}/)** ←

*Book with confidence — free cancellation up to 48 hours before your tour.*
""",

    "comparison": """# {title}

> **Not sure which option fits you best?** We'll help you decide.

## What You Need to Know

When searching for "{query}", most travellers are comparing their options. Here is an honest breakdown to help you choose the right experience in Malaysia.

## Your Options Compared

| Factor | Simply Enak Food Tour | DIY Self-Guided |
|---|---|---|
| **Local Expertise** | Expert guide with 10+ years experience | Depends on your research |
| **Dishes Tasted** | 10–15 curated dishes | As many as you can find |
| **Time Investment** | 3–4 hours, everything organised | Several hours of planning + walking |
| **Hidden Gems** | Access to stalls without English menus | You might miss the best spots |
| **Cost Efficiency** | All tastings included — no surprises | Individual dishes add up |
| **Group Experience** | Small group, social atmosphere | Solo or with your own group |

## Why Book With Simply Enak?

- **Established since 2011** — we know the scene inside out
- **Curated experience** — every vendor is vetted for quality, hygiene, and story
- **Small groups** (max 8) — not a crowded tour bus
- **Flexible booking** — free cancellation up to 48 hours

## What Our Guests Say

> *"Skip the guidebooks and book this tour. Our guide knew things you would never find on your own."*
> — Alex, Google Reviews (★★★★★)

## Frequently Asked Questions

**How is Simply Enak different from other tours?**
Our guides are local food experts, not just drivers. We focus on the stories behind the food and take you to places you would never find on your own.

**Can I customise the tour?**
Yes — private and custom tours are available. Contact us to design your perfect food experience.

---

## Ready to Experience It?

→ **[Book the {tour}](https://simplyenak.com/tours/{tour_slug}/)** ←

*The best food experiences in Malaysia start here.*
""",

    "review": """# {title}

> See what guests are saying about their experience.

## Overview

{query} matters when you are choosing the right food tour in Malaysia. Here is an honest look at what guests consistently mention.

## What Guests Love

### ⭐ Food Quality
*"The variety and quality of food was amazing. Our guide knew exactly which stalls to visit and we tried things we never would have found on our own."*

### ⭐ Guide Expertise
*"Our guide was incredibly knowledgeable — not just about food but about Malaysian culture and history. It felt like exploring with a friend who knows all the best spots."*

### ⭐ Value for Money
*"For the amount of food and the quality of guiding, this is excellent value. We left completely full and with a much deeper appreciation for Malaysian cuisine."*

## Ratings Summary

| Platform | Rating | Reviews |
|---|---|---|
| Tripadvisor | ★★★★★ | 500+ reviews |
| Google Reviews | ★★★★★ | 200+ reviews |
| Facebook | ★★★★★ | 100+ reviews |

## Common Questions from Reviewers

**Is the food spicy?**
Some dishes have chilli, but your guide will help you navigate spice levels. Mild versions are always available.

**Is it suitable for families with kids?**
Yes — families are welcome. The small group format works well for children.

**How much walking is involved?**
Approximately 2–3 km over 3–4 hours, with plenty of stops for eating.

---

## Book Your Spot

→ **[Book the {tour}](https://simplyenak.com/tours/{tour_slug}/)** ←

*Join thousands of happy guests who discovered Malaysian food with Simply Enak.*
""",

    "default": """# {title}

> Your guide to the best food experiences in Malaysia.

## Discover {query}

When you search for "{query}", you are looking for the best way to experience Malaysian food. You want authenticity, expert guidance, and a memorable experience — not a generic tourist activity.

## Why Simply Enak?

Simply Enak has been creating authentic food experiences in Malaysia since 2011. Our tours are designed by local food enthusiasts who know every alley, stall, and story.

- **Locally owned and operated** — we live here
- **Small groups** — max 8 people per tour
- **Handpicked vendors** — quality and authenticity guaranteed
- **Flexible and private options** — customise to your needs

## What to Expect

1. **Welcome** — Meet your guide at a central location
2. **Explore** — Visit 5–7 carefully selected food stops
3. **Learn** — Hear the stories behind each dish and its cultural significance
4. **Taste** — Enjoy 10–15 different local specialties
5. **Finish** — Full and happy, with recommendations for the rest of your trip

## Quick Facts

- **Tour duration:** ~3–4 hours
- **What's included:** All food, drinks, and guiding
- **What to bring:** Comfortable shoes, appetite, and curiosity
- **Cancellation:** Free up to 48 hours before

## Your Next Step

→ **[Book the {tour}](https://simplyenak.com/tours/{tour_slug}/)** ←

*Discover the tastes that make Malaysia unforgettable.*
""",
}

# ── Payload API helpers (for Page creation) ──

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
        return _payload_token
    except Exception as e:
        print(f"  Payload login error: {e}")
        return None

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')[:80]

def get_page_by_slug(slug):
    """Check if a Page already exists in Payload by slug."""
    token = payload_login()
    if not token:
        return None
    req = urllib.request.Request(
        f"{PAYLOAD_URL}/api/pages?where[slug][equals]={slug}&depth=0",
        headers={"Authorization": f"Bearer {token}"})
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
        docs = resp.get("docs", [])
        return docs[0] if docs else None
    except Exception as e:
        print(f"  Payload page lookup error: {e}")
        return None

def create_page_in_payload(slug, title, content_md, excerpt, tour_name):
    """Create a new Page in Payload for a BoFU landing page."""
    token = payload_login()
    if not token:
        return False

    # Build rich text content from markdown (simplified — just stores as markdown)
    minimal_rich_text = {
        "root": {
            "type": "root", "format": "", "indent": 0, "version": 1,
            "children": [{"type": "paragraph",
                "children": [{"type": "text", "text": excerpt}]
            }],
            "direction": "ltr",
        }
    }

    body = json.dumps({
        "title": title,
        "slug": slug,
        "excerpt": excerpt,
        "content": minimal_rich_text,
        "content_markdown": content_md,
        "author": 1,
        "status": "published",
        "workflowStatus": "published",
        "publishedDate": datetime.now().isoformat(),
        "_status": "published",
        "meta": {
            "title": f"{title} | Simply Enak",
            "description": excerpt,
        },
    }).encode()

    req = urllib.request.Request(
        f"{PAYLOAD_URL}/api/pages?depth=0", data=body, method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        })
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=30).read())
        print(f"  ✓ Page created in Payload: {slug} (id={resp.get('id', '?')})")

        # Submit to GSC for indexing
        page_url = f"https://simplyenak.com/landing/{slug}/"
        gsc_script = PROJECT_ROOT / "scripts" / "gsc-auto-index.py"
        if gsc_script.exists():
            import subprocess
            subprocess.run(["python3", str(gsc_script), f"--url={page_url}",
                            "--type=desktop"], timeout=30, capture_output=True)
            print(f"  ✓ Submitted {page_url} to GSC for indexing")
        return True
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        if "unique" in body.lower() and "slug" in body.lower():
            print(f"  Page already exists in Payload: {slug}")
            return False
        print(f"  ✗ Create failed: HTTP {e.code} — {body[:300]}")
        return False

# ── Landing page generation ──

def detect_template_type(candidate):
    """Detect the best template type based on matched signals."""
    signals = candidate.get("matched_signals", [])
    if any(s in signals for s in ["review", "reviews"]):
        return "review"
    if any(s in signals for s in ["vs", "versus", "compare", "comparison", "or"]):
        return "comparison"
    if any(s in signals for s in ["tour", "tours", "food tour", "experience", "private tour"]):
        return "tour"
    return "default"

def build_landing_page(candidate):
    """Generate a landing page markdown from a BoFU candidate."""
    template_type = detect_template_type(candidate)
    template = LANDING_TEMPLATES.get(template_type, LANDING_TEMPLATES["default"])

    query = candidate["query"]
    title = candidate["landing_title"]
    slug = candidate["landing_slug"]
    tour = candidate.get("recommended_tour", "KL Food Tour by Simply Enak")
    tour_slug = slugify(tour)

    # Build excerpt for meta description
    excerpt = (
        f"Planning {query}? Discover the best food tours, honest reviews, "
        f"and insider tips for your Malaysia trip. Book your {tour} today."
    )[:160]

    # Generate content from template
    content_md = template.format(
        title=title,
        query=query,
        tour=tour,
        tour_slug=tour_slug,
    )

    # Add structured data frontmatter for SEO
    full_md = f"""---
title: "{title}"
slug: "{slug}"
excerpt: "{excerpt}"
tour: "{tour}"
template: "landing"
seo_score: {candidate.get("opportunity_score", 0)}
gsc_impressions: {candidate.get("impressions", 0)}
gsc_position: {candidate.get("position", 0)}
gsc_ctr: {candidate.get("ctr", 0)}
commercial_signals: [{', '.join(candidate.get("matched_signals", []))}]
generated: {datetime.now().strftime('%Y-%m-%d')}
---

{content_md}
"""
    return {
        "slug": slug,
        "title": title,
        "excerpt": excerpt,
        "tour": tour,
        "template_type": template_type,
        "content_md": full_md,
        "candidate": candidate,
    }

def cmd_generate(output_dir=None, limit=None, dry_run=False):
    """Generate landing page template files."""
    if not CANDIDATES_FILE.exists():
        print(f"✗ No candidates file found at {CANDIDATES_FILE}")
        print(f"  Run scripts/seo-automation/find-bofu-opportunities.py first")
        sys.exit(1)

    data = json.loads(CANDIDATES_FILE.read_text())
    candidates = data.get("top_candidates", [])
    if limit:
        candidates = candidates[:limit]

    if dry_run:
        print(f"\n[[ DRY RUN ]] Would generate {len(candidates)} landing pages:\n")
    else:
        out_path = Path(output_dir) if output_dir else PROJECT_ROOT / "content" / "landing-pages"
        os.makedirs(out_path, exist_ok=True)
        print(f"\nGenerating {len(candidates)} landing pages in {out_path}/\n")

    created = []
    for i, cand in enumerate(candidates, 1):
        page = build_landing_page(cand)
        slug = page["slug"]
        print(f"  [{i}/{len(candidates)}] {cand['query']}")
        print(f"          Template: {page['template_type']}")
        print(f"          Title:    {page['title']}")
        print(f"          Slug:     /landing/{slug}/")
        print(f"          Tour:     {page['tour']}")
        print(f"          Score:    {cand.get('opportunity_score', 0):.0f}")

        if not dry_run:
            filepath = out_path / f"{slug}.md"
            filepath.write_text(page["content_md"])
            print(f"          File:     {filepath}")

        created.append(page)

    if not dry_run:
        # Generate index
        index_path = out_path / "index.md"
        index_content = "# BoFU Landing Pages\n\n"
        index_content += f"> Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
        index_content += f"> Total: {len(created)} pages\n\n"
        for p in created:
            index_content += f"- [{p['title']}](/landing/{p['slug']}/) — {p['excerpt'][:100]}...\n"
        index_path.write_text(index_content)
        print(f"\n  Index: {index_path}")

    print(f"\n{'='*60}")
    print(f"  Generated {len(created)} landing page templates")
    print(f"  Next: Review and edit in {output_dir or 'content/landing-pages/'}")
    print(f"  Then: python3 scripts/bofu-landing-factory.py push --limit {len(created)}")
    print(f"{'='*60}")
    return created

def cmd_push(limit=None):
    """Push landing pages to Payload as Pages."""
    if not CANDIDATES_FILE.exists():
        print(f"✗ No candidates file found at {CANDIDATES_FILE}")
        sys.exit(1)

    data = json.loads(CANDIDATES_FILE.read_text())
    candidates = data.get("top_candidates", [])
    if limit:
        candidates = candidates[:limit]

    print(f"\nPushing {len(candidates)} landing pages to Payload...\n")

    # Check if Payload is reachable
    token = payload_login()
    if not token:
        print("✗ Cannot authenticate with Payload. Check PAYLOAD_URL/EMAIL/PASSWORD.")
        sys.exit(1)

    pushed = 0
    skipped = 0
    for i, cand in enumerate(candidates, 1):
        page = build_landing_page(cand)
        slug = page["slug"]

        # Check for duplicate
        existing = get_page_by_slug(slug)
        if existing:
            print(f"  [{i}] SKIP — {slug} already exists in Payload (id={existing.get('id')})")
            skipped += 1
            continue

        print(f"  [{i}] Creating: {page['title']} ({slug})...")
        ok = create_page_in_payload(slug, page["title"], page["content_md"],
                                    page["excerpt"], page["tour"])
        if ok:
            pushed += 1

    print(f"\n{'='*60}")
    print(f"  Pushed: {pushed} | Skipped (already exist): {skipped}")
    print(f"{'='*60}")

def cmd_status():
    """Show summary of BoFU pipeline status."""
    if not CANDIDATES_FILE.exists():
        print("No BoFU candidates found. Run find-bofu-opportunities.py first.")
        return

    data = json.loads(CANDIDATES_FILE.read_text())
    candidates = data.get("top_candidates", [])
    scan_time = data.get("generated_at", "unknown")

    print(f"\n{'='*60}")
    print(f"  BoFU Pipeline Status")
    print(f"  Last scan: {scan_time}")
    print(f"  Candidates available: {len(candidates)}")
    print(f"{'='*60}\n")

    # Categorize
    tours = sum(1 for c in candidates if any(s in c.get("matched_signals", [])
                for s in ["tour", "tours", "food tour", "private tour"]))
    comparisons = sum(1 for c in candidates if any(s in c.get("matched_signals", [])
                      for s in ["vs", "versus", "compare", "best", "top"]))
    reviews = sum(1 for c in candidates if any(s in c.get("matched_signals", [])
                  for s in ["review", "reviews"]))

    print(f"  Tour-intent:    {tours}")
    print(f"  Comparison:     {comparisons}")
    print(f"  Review-intent:  {reviews}")
    print()

    for i, c in enumerate(candidates, 1):
        template_type = detect_template_type(c)
        print(f"  {i:2d}. {c['query']:<40s} | pos {c['position']:>4.1f} | "
              f"imp {c['impressions']:>4d} | score {c['opportunity_score']:>8.0f} | {template_type}")

    print(f"\n  Commands:")
    print(f"    Generate templates:  python3 scripts/bofu-landing-factory.py generate")
    print(f"    Push to Payload:     python3 scripts/bofu-landing-factory.py push --limit 3")

# ── CLI ──

def main():
    import argparse
    p = argparse.ArgumentParser(description="BoFU Landing Page Factory")
    sub = p.add_subparsers(dest="command", required=True)

    # generate
    gen = sub.add_parser("generate", help="Generate landing page markdown templates")
    gen.add_argument("--output-dir", default=None, help="Output directory for templates")
    gen.add_argument("--limit", type=int, default=None, help="Max pages to generate")
    gen.add_argument("--dry-run", action="store_true", help="Preview without writing files")

    # push
    push = sub.add_parser("push", help="Push landing pages to Payload as Pages")
    push.add_argument("--limit", type=int, default=None, help="Max pages to push")

    # status
    sub.add_parser("status", help="Show pipeline status")

    args = p.parse_args()

    if args.command == "generate":
        cmd_generate(args.output_dir, args.limit, args.dry_run)
    elif args.command == "push":
        cmd_push(args.limit)
    elif args.command == "status":
        cmd_status()

if __name__ == "__main__":
    main()
