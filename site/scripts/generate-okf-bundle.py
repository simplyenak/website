#!/usr/bin/env python3
"""
OKF Bundle Generator for Simply Enak — v2
=========================================
Reads Payload CMS JSON snapshots and generates an OKF-conformant knowledge bundle.

Conformance: M1-M6✅ S1-S6✅ (S3, S6 advisory — human judgement)
"""
import json, re
from datetime import datetime, timezone
from pathlib import Path

DATA_DIR = Path("src/data/content").resolve()
OUT_DIR = Path("public/okf").resolve()
SITE_URL = "https://simplyenak.com"
BUNDLE_TIMESTAMP = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

# ─── Helpers ──────────────────────────────────────────────────────────────────

def extract_text(j):
    if not j:
        return ""
    if isinstance(j, str):
        return j
    r = j.get("root", j.get("en", {}).get("root"))
    if not r or not r.get("children"):
        return json.dumps(j)
    parts = []
    for c in r["children"]:
        if c.get("children"):
            parts.extend(ch.get("text", "") for ch in c["children"] if ch.get("text"))
        elif c.get("text"):
            parts.append(c["text"])
    return " ".join(parts)


def extract_md(s):
    md = s.get("content_markdown", s.get("contentMarkdown", ""))
    if md and len(md) > 200:
        return md
    t = extract_text(s.get("content"))
    return t if len(t) > 200 else md


def qy(v):
    """Format a YAML scalar value with proper quoting and newline escaping."""
    if v is None:
        return '""'
    s = str(v).strip()
    if not s:
        return '""'
    # Escape internal newlines as \n (YAML flow scalar)
    if "\n" in s:
        s = s.replace("\n", "\\n")
    needs_quote = any(c in s for c in [":", "#", "{", "[", ">", "|", "&", "*", "!", "%", "\\"])
    if needs_quote:
        s = s.replace('"', '\\"')
        return f'"{s}"'
    return s


def fm(**kw):
    lines = ["---"]
    for k, v in kw.items():
        if v is None:
            continue
        if isinstance(v, list):
            if v:
                lines.append(f"{k}:")
                for item in v:
                    lines.append(f"  - {qy(item)}")
            else:
                lines.append(f"{k}: []")
        elif isinstance(v, bool):
            lines.append(f"{k}: {str(v).lower()}")
        elif isinstance(v, int):
            lines.append(f"{k}: {v}")
        else:
            lines.append(f"{k}: {qy(v)}")
    lines.append("---")
    return "\n".join(lines)


def ts(val, default=None):
    if not val:
        return default
    try:
        if isinstance(val, str):
            return val.replace(" ", "T")[:19] + "Z"
        if isinstance(val, (int, float)):
            return datetime.fromtimestamp(val / 1000 if val > 1e12 else val, tz=timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    except (ValueError, OSError):
        pass
    return default


def loc_slug(loc):
    if not loc:
        return ""
    return loc.lower().replace(" ", "-").replace("/", "-").replace(",", "").strip("-")


def trunc(s, n):
    """Truncate at word boundary. Returns empty string on None/empty."""
    if not s:
        return ""
    s = str(s)
    if len(s) <= n:
        return s
    cut = s.rfind(" ", 0, n)
    return s[:cut] + "..." if cut > n // 2 else s[:n] + "..."

# ─── Generators ───────────────────────────────────────────────────────────────

def gen_tour(t, loc_index):
    slug = t["slug"]
    name = t["name"]
    desc = trunc(t.get("short_description") or t.get("shortDescription") or t.get("tagline") or "", 300)
    price = t.get("price", 0)
    cur = t.get("currency", "MYR")
    duration = str(t.get("duration") or "")
    location = str(t.get("location") or t.get("city") or "Kuala Lumpur")
    meeting = str(t.get("meetingPoint") or t.get("meeting_point") or "")
    max_pax = t.get("maxParticipants") or t.get("max_participants") or 8
    tour_type = t.get("tourType") or t.get("tour_type") or "join-in"
    dietary = sorted(set(str(d.get("name") or d.get("slug") or "") for d in (t.get("dietaryOptions") or t.get("dietary_options") or []) if str(d.get("name") or d.get("slug") or "")))
    highlights = [str(h.get("highlight") or "") if isinstance(h, dict) else str(h) for h in (t.get("highlights") or []) if str(h.get("highlight") if isinstance(h, dict) else h)]

    ls = loc_slug(location)
    tags = ["food-tour", ls] if ls else ["food-tour"]
    tags.extend(d.lower() for d in dietary[:3])

    # Build location link
    loc_file = f"../locations/{ls}.md" if ls in loc_index else None
    location_link = f"[{location}]({loc_file})" if loc_file else location

    f = fm(
        type="tour", title=name, description=desc or f"Simply Enak food tour in {location}",
        resource=f"{SITE_URL}/tours/{slug}/",
        timestamp=ts(t.get("updatedAt"), BUNDLE_TIMESTAMP),
        tags=tags, price=f"{cur} {price}", duration=duration,
        location=location, group_size=f"up to {max_pax}",
        tour_type=tour_type,
        meeting_point=meeting if tour_type == "join-in" else None,
        dietary_options=dietary or None,
    )

    body = f"# {name}\n\n{desc or 'Experience the flavours of ' + location + ' with Simply Enak.'}\n\n## Details\n\n"
    body += f"- **Price**: {cur} {price} per person\n- **Duration**: {duration}\n"
    body += f"- **Location**: {location_link}\n- **Group size**: up to {max_pax} guests\n"
    if tour_type == "both":
        body += "- **Available as**: join-in group or private tour\n"
    elif tour_type == "private":
        body += "- **Type**: private tour (your group only)\n"
    if meeting:
        body += f"- **Meeting point**: {meeting}\n"

    if highlights:
        body += "\n## Highlights\n\n" + "\n".join(f"- {h}" for h in highlights[:5]) + "\n"

    if dietary:
        body += f"\n## Dietary options\n\nAccommodates: {', '.join(dietary)}.\n\nMost tours can be customised — contact [WhatsApp](https://wa.me/60172878929) before booking.\n"

    # Cross-link to location
    if loc_file:
        body += f"\n## Location\n\nSee [{location}]({loc_file}) for more about the neighbourhood.\n"

    # Cross-link relevant guides
    guides_for_loc = loc_index.get(ls, {}).get("guides", [])
    if guides_for_loc:
        body += "\n## Related guides\n\n"
        for g in guides_for_loc[:3]:
            body += f"- [{g['title']}](../{g['file']})\n"

    body += f"\n## Book this tour\n\n[{SITE_URL}/tours/{slug}/]({SITE_URL}/tours/{slug}/) or [WhatsApp](https://wa.me/60172878929)\n"

    return {"f": f"tours/{slug}.md", "c": f + "\n" + body, "t": name, "d": desc[:120], "type": "tour", "slug": slug, "location": location}


def gen_guide(s, loc_index):
    slug = s["slug"]
    title = s["title"]
    md = extract_md(s)
    excerpt = trunc(s.get("excerpt") or s.get("meta_description") or title, 300)

    hints = {"kuala-lumpur": "Kuala Lumpur", "kl-": "Kuala Lumpur", "penang": "Penang", "ipoh": "Ipoh", "melaka": "Melaka", "malaysia": "Malaysia"}
    location = "Malaysia"
    for h, l in hints.items():
        if h in slug:
            location = l
            break

    ls = loc_slug(location)
    loc_file = f"../locations/{ls}.md" if ls in loc_index else None

    meta = s.get("meta", {})
    cats = str(meta.get("categories", "") or "")
    tags = ["food-guide", ls] if ls else ["food-guide"]
    if cats:
        tags.append(cats.lower().replace(" ", "-").replace("&", "and"))

    f = fm(
        type="guide", title=title, description=excerpt,
        resource=f"{SITE_URL}/stories/{slug}/",
        timestamp=ts(s.get("updatedAt"), BUNDLE_TIMESTAMP),
        tags=tags, location=location,
    )

    summary = trunc(md, 1000)

    body = f"# {title}\n\n{excerpt}\n\n> Full article: [{SITE_URL}/stories/{slug}/]({SITE_URL}/stories/{slug}/)\n\n---\n\n{summary}\n"

    # Cross-link to location
    if loc_file:
        body += f"\n\nSee [{location}]({loc_file}) for tours in this area.\n"

    return {"f": f"guides/{slug}.md", "c": f + "\n" + body, "t": title, "type": "guide", "slug": slug, "location": location}


def gen_faq(f):
    q = f["question"]
    a = extract_text(f.get("answer"))
    slug = re.sub(r"[^a-z0-9]+", "-", q.lower()).strip("-")[:60]
    tags = ["faq"]
    if any(w in q.lower() for w in ["book", "pay", "cancel", "price"]):
        tags.append("booking")
    if any(w in q.lower() for w in ["food", "diet", "eat", "vegan", "halal"]):
        tags.append("food")
    if any(w in q.lower() for w in ["group", "private", "solo"]):
        tags.append("groups")

    ff = fm(
        type="faq", title=q, description=a[:200] if a else q,
        timestamp=ts(f.get("updatedAt"), BUNDLE_TIMESTAMP), tags=tags,
    )
    return {"f": f"faqs/{slug}.md", "c": ff + "\n# " + q + "\n\n" + a + "\n", "t": q, "type": "faq", "slug": slug}


def gen_location(l, tour_index, guide_index):
    name = l.get("name", "Unknown")
    sub = trunc(l.get("subtitle") or l.get("description") or f"Simply Enak runs food tours in {name}.", 300)
    slug = l.get("slug", loc_slug(name))
    ls = loc_slug(name)

    tags = ["malaysia", ls] if ls else ["malaysia"]

    # Find tours and guides for this location
    loc_tours = tour_index.get(ls, [])
    loc_guides = guide_index.get(ls, [])

    ff = fm(
        type="place", title=name, description=sub,
        resource= l.get("url") or f"{SITE_URL}/tours/locations/food-tours-{ls}" if ls else SITE_URL,
        timestamp=ts(l.get("updatedAt"), BUNDLE_TIMESTAMP), tags=tags,
    )

    body = f"# {name}\n\n{sub}\n"

    if loc_tours:
        body += "\n## Tours\n\n"
        for t_item in loc_tours:
            body += f"- [{t_item['title']}](../{t_item['file']}) — {t_item['desc'][:100]}\n"

    if loc_guides:
        body += "\n## Food guides\n\n"
        for g in loc_guides[:5]:
            body += f"- [{g['title']}](../{g['file']})\n"

    return {"f": f"locations/{slug}.md", "c": ff + "\n" + body, "t": name, "type": "place", "slug": slug}


def gen_index(concepts):
    """Generate root index.md with KnowledgeBundle type and cross-links."""
    f = fm(
        type="KnowledgeBundle",
        title="Simply Enak — Malaysian Food Tours",
        description="Small-group and private food tours in Kuala Lumpur, Penang, and Ipoh. Family-run stalls, real neighbourhoods, heritage vendors since 2011.",
        resource=SITE_URL, timestamp=BUNDLE_TIMESTAMP,
        tags=["malaysia", "food-tours", "kuala-lumpur", "penang", "ipoh", "street-food"],
    )

    body = """# Simply Enak — Knowledge Bundle

This bundle describes Simply Enak, a Malaysian food tour operator since 2011.

## Quick facts

- **Locations**: Kuala Lumpur, Penang, Ipoh
- **Guests**: 5,000+
- **Price range**: RM 285–RM 450 per person
- **Booking**: [simplyenak.com](https://simplyenak.com) | [WhatsApp](https://wa.me/60172878929)

---

## Tours

"""
    for c in concepts:
        if c["type"] != "tour":
            continue
        body += f"- [{c['t']}]({c['f']}) — {c.get('d', '')}\n"

    body += "\n## Food Guides\n\n"
    for c in concepts:
        if c["type"] != "guide":
            continue
        body += f"- [{c['t']}]({c['f']}) — {c.get('d', '')[:100]}\n"

    body += "\n## Locations\n\n"
    for c in concepts:
        if c["type"] != "place":
            continue
        body += f"- [{c['t']}]({c['f']})\n"

    body += "\n## Frequently Asked Questions\n\n"
    for c in concepts:
        if c["type"] != "faq":
            continue
        body += f"- [{c['t']}]({c['f']})\n"

    body += f"\n---\n\nGenerated: {BUNDLE_TIMESTAMP}\n\nSource: [{SITE_URL}]({SITE_URL})\n"
    return f + "\n" + body


def gen_sub_index(folder, title, concepts):
    tag = folder.rstrip("/")
    f = fm(
        type="guide", title=title,
        description=f"Index of {title.lower()} in the Simply Enak knowledge bundle.",
        timestamp=BUNDLE_TIMESTAMP, tags=[tag],
    )
    body = f"# {title}\n\n"
    for c in concepts:
        body += f"- [{c['t']}]({c['f'].split('/')[-1]})\n"
    body += "\n[Back to bundle index](../index.md)\n"
    return f + "\n" + body


def gen_log(g_count, f_count):
    return f"""---
type: Concept
title: Bundle Change Log
tags:
  - changelog
---

# Change Log

## 2026-07-09 — OKF-conformant bundle

- Rebuilt generator for OKF conformance (M1–M6, S1–S6)
- Subdirectory structure with folder index.md files
- KnowledgeBundle root index with YAML frontmatter
- Cross-links between tours, locations, and guides
- 6 tours, {g_count} guides, 3 locations, {f_count} FAQs
"""


def main():
    print(f"OKF Generator v2\n  In: {DATA_DIR}\n  Out: {OUT_DIR}\n")

    tours_raw = json.load(open(DATA_DIR / "tours.json"))
    stories_raw = json.load(open(DATA_DIR / "stories.json"))
    faqs_raw = json.load(open(DATA_DIR / "faqs.json"))
    locations_raw = json.load(open(DATA_DIR / "locations.json"))

    pt = [t for t in tours_raw if t.get("_status") != "draft" and t.get("_status") != "archived"]
    ps = [s for s in stories_raw if s.get("status") == "published" and s.get("workflowStatus") == "published" and len(extract_md(s)) > 200]
    pf = [f for f in faqs_raw if f.get("workflowStatus") != "draft"]
    pl = [l for l in locations_raw if l.get("name")]

    print(f"  Tours:{len(pt)} Guides:{len(ps)} FAQs:{len(pf)} Locations:{len(pl)}\n")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for old in OUT_DIR.rglob("*.md"):
        old.unlink()

    # Build location → (tours, guides) index for cross-linking
    loc_index = {}
    for t in pt:
        loc = loc_slug(str(t.get("location") or t.get("city") or "Kuala Lumpur"))
        if loc not in loc_index:
            loc_index[loc] = {"tours": [], "guides": []}
        loc_index[loc]["tours"].append({
            "title": t["name"], "file": f"tours/{t['slug']}.md",
            "desc": trunc(t.get("short_description") or t.get("shortDescription") or t.get("tagline") or "", 200),
        })
    for s in ps:
        hints = {"kuala-lumpur": "kuala-lumpur", "kl-": "kuala-lumpur", "penang": "penang", "ipoh": "ipoh", "melaka": "melaka"}
        loc = "malaysia"
        for h, l in hints.items():
            if h in s["slug"]:
                loc = l
                break
        if loc not in loc_index:
            loc_index[loc] = {"tours": [], "guides": []}
        loc_index[loc]["guides"].append({
            "title": s["title"], "file": f"guides/{s['slug']}.md",
        })

    concepts = []

    # Tours
    (OUT_DIR / "tours").mkdir(parents=True, exist_ok=True)
    for t in pt:
        c = gen_tour(t, loc_index)
        (OUT_DIR / c["f"]).write_text(c["c"])
        concepts.append(c)
        print(f"  + {c['f']}")
    idx = gen_sub_index("tours", "Tours", [c for c in concepts if c["type"] == "tour"])
    (OUT_DIR / "tours/index.md").write_text(idx)
    print(f"  + tours/index.md")

    # Guides
    (OUT_DIR / "guides").mkdir(parents=True, exist_ok=True)
    for s in ps:
        g = gen_guide(s, loc_index)
        (OUT_DIR / g["f"]).write_text(g["c"])
        concepts.append(g)
    idx = gen_sub_index("guides", "Food Guides", [c for c in concepts if c["type"] == "guide"])
    (OUT_DIR / "guides/index.md").write_text(idx)
    print(f"  + guides/index.md")

    # FAQs
    (OUT_DIR / "faqs").mkdir(parents=True, exist_ok=True)
    for f_item in pf:
        fc = gen_faq(f_item)
        (OUT_DIR / fc["f"]).write_text(fc["c"])
        concepts.append(fc)
    idx = gen_sub_index("faqs", "FAQs", [c for c in concepts if c["type"] == "faq"])
    (OUT_DIR / "faqs/index.md").write_text(idx)
    print(f"  + faqs/index.md")

    # Locations (need cross-reference data already built)
    (OUT_DIR / "locations").mkdir(parents=True, exist_ok=True)
    for l_item in pl:
        ls = loc_slug(l_item.get("name", ""))
        tours_for_loc = loc_index.get(ls, {"tours": []})["tours"]
        guides_for_loc = loc_index.get(ls, {"guides": []})["guides"]
        lc = gen_location(l_item, {ls: tours_for_loc}, {ls: guides_for_loc})
        (OUT_DIR / lc["f"]).write_text(lc["c"])
        concepts.append(lc)
        print(f"  + {lc['f']}")
    idx = gen_sub_index("locations", "Destinations", [c for c in concepts if c["type"] == "place"])
    (OUT_DIR / "locations/index.md").write_text(idx)
    print(f"  + locations/index.md")

    # Root index
    (OUT_DIR / "index.md").write_text(gen_index(concepts))
    print(f"  + index.md")

    # Log
    g_count = sum(1 for c in concepts if c["type"] == "guide")
    f_count = sum(1 for c in concepts if c["type"] == "faq")
    (OUT_DIR / "log.md").write_text(gen_log(g_count, f_count))
    print(f"  + log.md")

    counts = {}
    for c in concepts:
        counts[c["type"]] = counts.get(c["type"], 0) + 1
    print(f"\nDone: {sum(counts.values())} concepts")
    for t, n in sorted(counts.items()):
        print(f"  {t}: {n}")

    # Optional: validate with OKF conformance checker
    validator = Path(__file__).resolve().parent.parent.parent / "eval" / "okf-validate.mjs"
    if validator.exists():
        import subprocess
        result = subprocess.run(["node", str(validator), str(OUT_DIR)], capture_output=True, text=True, timeout=30)
        if result.returncode == 0:
            print(f"\n✅ OKF conformance: PASS")
        else:
            print(f"\n⚠️  OKF conformance issues:\n{result.stdout[:500]}")


if __name__ == "__main__":
    main()
