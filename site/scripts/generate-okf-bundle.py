#!/usr/bin/env python3
"""
OKF Bundle Generator for Simply Enak — v3
=========================================
Reads Payload CMS JSON snapshots and generates an OKF-conformant knowledge bundle.

Features:
  - Subdirectory structure: tours/, guides/, faqs/, locations/
  - Semantic cross-links: tours↔location, guides↔location, dietary matched guides
  - KnowledgeBundle root index with YAML frontmatter
  - ISO-8601 timestamps, resource URIs, tags
  - --dry-run flag for testing
  - Optional OKF validation after generation
  - Self-contained HTML visualizer
"""
import json, re, sys
from datetime import datetime, timezone
from pathlib import Path

DATA_DIR = Path("src/data/content").resolve()
OUT_DIR = Path("public/okf").resolve()
VALIDATOR = Path(__file__).resolve().parent.parent.parent / "eval" / "okf-validate.mjs"
SITE_URL = "https://simplyenak.com"
BUNDLE_TIMESTAMP = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
DRY_RUN = "--dry-run" in sys.argv

# ─── Location slug normalisation ──────────────────────────────────────────────
# Maps raw location strings from Payload to canonical city slugs
LOCATION_ALIASES = {
    "kl": "kuala-lumpur", "kuala lumpur": "kuala-lumpur", "k.l.": "kuala-lumpur",
    "penang": "penang", "penang road": "penang", "george town": "penang", "georgetown": "penang",
    "ipoh": "ipoh", "melaka": "melaka", "malacca": "melaka",
    "malaysia": "kuala-lumpur",  # fallback for country-level content
}
LOCATION_SLUGS_BUILT = set()  # populated during location generation

# ─── Helpers ──────────────────────────────────────────────────────────────────

def extract_text(j):
    if not j: return ""
    if isinstance(j, str): return j
    r = j.get("root", j.get("en", {}).get("root"))
    if not r or not r.get("children"): return json.dumps(j)
    parts = []
    for c in r["children"]:
        if c.get("children"): parts.extend(ch.get("text","") for ch in c["children"] if ch.get("text"))
        elif c.get("text"): parts.append(c["text"])
    return " ".join(parts)

def extract_md(s):
    md = s.get("content_markdown", s.get("contentMarkdown", ""))
    if md and len(md) > 200: return md
    t = extract_text(s.get("content"))
    return t if len(t) > 200 else md

def qy(v):
    if v is None: return '""'
    s = str(v).strip()
    if not s: return '""'
    if "\n" in s: s = s.replace("\n", "\\n")
    needs_quote = any(c in s for c in [":", "#", "{", "[", ">", "|", "&", "*", "!", "%", "\\"])
    if needs_quote: s = s.replace('"', '\\"'); return f'"{s}"'
    return s

def fm(**kw):
    lines = ["---"]
    for k, v in kw.items():
        if v is None: continue
        if isinstance(v, list):
            if v:
                lines.append(f"{k}:")
                for item in v: lines.append(f"  - {qy(item)}")
            else: lines.append(f"{k}: []")
        elif isinstance(v, bool): lines.append(f"{k}: {str(v).lower()}")
        elif isinstance(v, int): lines.append(f"{k}: {v}")
        else: lines.append(f"{k}: {qy(v)}")
    lines.append("---")
    return "\n".join(lines)

def ts(val, default=None):
    if not val: return default
    try:
        if isinstance(val, str): return val.replace(" ", "T")[:19] + "Z"
        if isinstance(val, (int, float)):
            return datetime.fromtimestamp(val / 1000 if val > 1e12 else val, tz=timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    except (ValueError, OSError): pass
    return default

def norm_loc(raw):
    """Normalise a location string to a canonical slug."""
    if not raw: return "kuala-lumpur"
    raw = raw.strip().lower().replace("/", " ").replace(",", "").replace("-", " ")
    raw = re.sub(r'\s+', ' ', raw).strip()
    return LOCATION_ALIASES.get(raw, raw.replace(" ", "-"))

def trunc(s, n):
    if not s: return ""
    s = str(s)
    if len(s) <= n: return s
    cut = s.rfind(" ", 0, n)
    return s[:cut] + "..." if cut > n // 2 else s[:n] + "..."

# ─── Generators ───────────────────────────────────────────────────────────────

def gen_tour(t, guides_by_loc):
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

    ls = norm_loc(location)
    tags = ["food-tour", ls] if ls else ["food-tour"]
    tags.extend(d.lower() for d in dietary[:3])

    loc_file = f"../locations/{ls}.md" if ls in LOCATION_SLUGS_BUILT or ls in ["kuala-lumpur", "penang", "ipoh"] else None
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
        body += f"\n## Dietary options\n\nAccommodates: {', '.join(dietary)}.\n"

    # Cross-link to location
    if loc_file:
        body += f"\n## Location\n\nSee [{location}]({loc_file}) for more about the area.\n"

    # Semantic cross-links: find guides matching this tour's location AND dietary tags
    matched_guides = []
    ls_clean = ls.replace("-", " ").lower()
    for g in guides_by_loc.get(ls, []):
        # Prefer guides with matching dietary keywords
        score = 0
        g_slug = g["slug"].lower()
        for d in dietary:
            if d.lower()[:4] in g_slug:
                score += 2
        if ls_clean in g_slug:
            score += 1
        if ls in g_slug:
            score += 1
        matched_guides.append((score, g))
    matched_guides.sort(key=lambda x: -x[0])

    top_guides = [g for s, g in matched_guides if s > 0][:4]
    if top_guides:
        body += "\n## Related guides\n\n"
        for g in top_guides:
            body += f"- [{g['title']}](../{g['file']})\n"

    body += f"\n## Book this tour\n\n[{SITE_URL}/tours/{slug}/]({SITE_URL}/tours/{slug}/) or [WhatsApp](https://wa.me/60172878929)\n"

    return {"f": f"tours/{slug}.md", "c": f + "\n" + body, "t": name, "d": desc[:120], "type": "tour", "slug": slug, "location": location, "dietary": dietary}

def gen_guide(s):
    slug = s["slug"]
    title = s["title"]
    md = extract_md(s)
    excerpt = trunc(s.get("excerpt") or s.get("meta_description") or title, 300)

    hints = {"kuala-lumpur": "kuala-lumpur", "kl-": "kuala-lumpur", "penang": "penang", "ipoh": "ipoh", "melaka": "melaka", "malaysia": "kuala-lumpur"}
    ls = "kuala-lumpur"
    city_name = "Kuala Lumpur"
    for h, l in hints.items():
        if h in slug: ls = l; break
    if ls == "penang": city_name = "Penang"
    elif ls == "ipoh": city_name = "Ipoh"
    elif ls == "melaka": city_name = "Melaka"

    loc_file = f"../locations/{ls}.md" if ls in ["kuala-lumpur", "penang", "ipoh"] else None

    meta = s.get("meta", {})
    cats = str(meta.get("categories", "") or "")
    tags = ["food-guide", ls] if ls else ["food-guide"]
    if cats:
        tags.append(cats.lower().replace(" ", "-").replace("&", "and"))

    f = fm(
        type="guide", title=title, description=excerpt,
        resource=f"{SITE_URL}/stories/{slug}/",
        timestamp=ts(s.get("updatedAt"), BUNDLE_TIMESTAMP),
        tags=tags, location=city_name,
    )

    summary = trunc(md, 1000)

    body = f"# {title}\n\n{excerpt}\n\n> Full article: [{SITE_URL}/stories/{slug}/]({SITE_URL}/stories/{slug}/)\n\n---\n\n{summary}\n"

    # Cross-link to location
    if loc_file:
        body += f"\n\nTours and guides for [{city_name}]({loc_file}).\n"

    return {"f": f"guides/{slug}.md", "c": f + "\n" + body, "t": title, "type": "guide", "slug": slug, "location": ls}

def gen_faq(f):
    q = f["question"]
    a = extract_text(f.get("answer"))
    slug = re.sub(r"[^a-z0-9]+", "-", q.lower()).strip("-")[:60]
    tags = ["faq"]
    if any(w in q.lower() for w in ["book", "pay", "cancel", "price"]): tags.append("booking")
    if any(w in q.lower() for w in ["food", "diet", "eat", "vegan", "halal"]): tags.append("food")
    if any(w in q.lower() for w in ["group", "private", "solo"]): tags.append("groups")

    ff = fm(type="faq", title=q, description=a[:200] if a else q, timestamp=ts(f.get("updatedAt"), BUNDLE_TIMESTAMP), tags=tags)
    # FAQ has a link back to the FAQs index — prevents orphan (S4)
    body = f"# {q}\n\n{a}\n\n---\n\n[Back to FAQs](../faqs/index.md)\n"
    return {"f": f"faqs/{slug}.md", "c": ff + "\n" + body, "t": q, "type": "faq", "slug": slug}

def gen_location(l, tours_for_loc, guides_for_loc):
    name = l.get("name", "Unknown")
    sub = trunc(l.get("subtitle") or l.get("description") or f"Simply Enak runs food tours in {name}.", 300)
    slug = l.get("slug", norm_loc(name))
    site_slug = slug.replace("_", "-")

    tags = ["malaysia", slug] if slug else ["malaysia"]

    # Use actual website URL for the resource
    resource_url = f"{SITE_URL}/tours/locations/food-tours-{site_slug}" if site_slug else SITE_URL

    ff = fm(
        type="place", title=name, description=sub, resource=resource_url,
        timestamp=ts(l.get("updatedAt"), BUNDLE_TIMESTAMP), tags=tags,
    )

    body = f"# {name}\n\n{sub}\n"

    if tours_for_loc:
        body += "\n## Tours\n\n"
        for t in tours_for_loc:
            body += f"- [{t['title']}](../{t['file']}) — {t['desc'][:100]}\n"

    if guides_for_loc:
        body += "\n## Food guides\n\n"
        for g in guides_for_loc[:5]:
            body += f"- [{g['title']}](../{g['file']})\n"

    return {"f": f"locations/{slug}.md", "c": ff + "\n" + body, "t": name, "type": "place", "slug": slug}


def gen_visualizer(concepts):
    """Generate a self-contained HTML visualizer for the knowledge bundle."""
    nodes = []
    edges = []
    for i, c in enumerate(concepts):
        nodes.append({"id": i, "label": c["t"][:40], "type": c.get("type", "concept"), "file": c["f"]})

    tour_locs = {}; guide_locs = {}
    for i, c in enumerate(concepts):
        loc = c.get("location", "").lower()
        if c["type"] == "tour" and loc: tour_locs.setdefault(loc, []).append(i)
        if c["type"] == "guide" and loc: guide_locs.setdefault(loc, []).append(i)
    for loc, tour_ids in tour_locs.items():
        for ti in tour_ids:
            for gi in guide_locs.get(loc, [])[:5]:
                edges.append({"source": ti, "target": gi, "label": loc})

    data = json.dumps({"nodes": nodes, "edges": edges})

    html = JS_VISUALIZER.replace("__DATA__", data)
    return html


JS_VISUALIZER = """<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Simply Enak OKF — Knowledge Graph</title>
<style>body{margin:0;font-family:sans-serif;background:#111;color:#eee}#graph{width:100vw;height:100vh}
.node circle{stroke:#fff;stroke-width:1.5;cursor:pointer}
.node text{font:10px sans-serif;fill:#eee;pointer-events:none}
.link{stroke:#555;stroke-opacity:.4;fill:none}
.legend{position:fixed;bottom:20px;left:20px;background:rgba(0,0,0,.7);padding:12px;border-radius:8px;font:12px sans-serif;color:#aaa}
.legend span{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:4px}
</style></head><body>
<div id="graph"></div>
<div class="legend">
  <div><span style="background:#ff6b6b"></span> Tours</div>
  <div><span style="background:#ffd93d"></span> Guides</div>
  <div><span style="background:#6bcb77"></span> FAQs</div>
  <div><span style="background:#4d96ff"></span> Locations</div>
</div>
<script src="https://d3js.org/d3.v7.min.js"></script>
<script>
const data = __DATA__;
const w = window.innerWidth, h = window.innerHeight;
const svg = d3.select("#graph").append("svg").attr("width",w).attr("height",h);
const g = svg.append("g");
const zoom = d3.zoom().on("zoom",e=>g.attr("transform",e.transform));
svg.call(zoom);
const colors = {tour:"#ff6b6b",guide:"#ffd93d",faq:"#6bcb77",place:"#4d96ff"};
const sim = d3.forceSimulation(data.nodes)
  .force("link",d3.forceLink(data.edges).id(d=>d.id).distance(80))
  .force("charge",d3.forceManyBody().strength(-120))
  .force("center",d3.forceCenter(w/2,h/2));
const link = g.selectAll(".link").data(data.edges).join("line").attr("class","link");
const node = g.selectAll(".node").data(data.nodes).join("g").attr("class","node")
  .call(d3.drag().on("start",(e,d)=>{if(!e.active)sim.alphaTarget(.3).restart();d.fx=d.x;d.fy=d.y})
    .on("drag",(e,d)=>{d.fx=e.x;d.fy=e.y}).on("end",(e,d)=>{if(!e.active)sim.alphaTarget(0);d.fx=null;d.fy=null}));
node.append("circle").attr("r",d=>(d.type==="tour"?8:6)).attr("fill",d=>colors[d.type]||"#888");
node.append("text").text(d=>d.label).attr("dx",12).attr("dy",".35em");
sim.on("tick",()=>{link.attr("x1",d=>d.source.x).attr("y1",d=>d.source.y).attr("x2",d=>d.target.x).attr("y2",d=>d.target.y);
  node.attr("transform",d=>`translate(${d.x},${d.y})`)});
</script></body></html>"""


# ─── Index generation ─────────────────────────────────────────────────────────

def gen_index(concepts):
    f = fm(
        type="KnowledgeBundle",
        title="Simply Enak — Malaysian Food Tours",
        description="Small-group and private food tours in Kuala Lumpur, Penang, and Ipoh. Family-run stalls, real neighbourhoods, heritage vendors since 2011.",
        resource=SITE_URL, timestamp=BUNDLE_TIMESTAMP,
        tags=["malaysia", "food-tours", "kuala-lumpur", "penang", "ipoh", "street-food"],
    )

    body = "# Simply Enak — Knowledge Bundle\n\nThis bundle describes Simply Enak, a Malaysian food tour operator since 2011.\n\n"
    body += "## Quick facts\n\n- **Locations**: Kuala Lumpur, Penang, Ipoh\n- **Guests**: 5,000+\n- **Price range**: RM 285–RM 450 per person\n- **Booking**: [simplyenak.com](https://simplyenak.com) | [WhatsApp](https://wa.me/60172878929)\n\n---\n\n"
    body += "## Tours\n\n"
    for c in concepts:
        if c["type"] != "tour": continue
        body += f"- [{c['t']}]({c['f']}) — {c.get('d', '')}\n"
    body += "\n## Food Guides\n\n"
    for c in concepts:
        if c["type"] != "guide": continue
        body += f"- [{c['t']}]({c['f']}) — {c.get('d', '')[:100]}\n"
    body += "\n## Locations\n\n"
    for c in concepts:
        if c["type"] != "place": continue
        body += f"- [{c['t']}]({c['f']})\n"
    body += "\n## Frequently Asked Questions\n\n"
    for c in concepts:
        if c["type"] != "faq": continue
        body += f"- [{c['t']}]({c['f']})\n"
    body += f"\n## Visualizer\n\n[View knowledge graph](visualize.html)\n\n---\n- [Change log](log.md)\n- Generated: {BUNDLE_TIMESTAMP}\n- Source: [{SITE_URL}]({SITE_URL})\n"
    return f + "\n" + body


def gen_sub_index(folder, title, concepts):
    tag = folder.rstrip("/")
    f = fm(type="guide", title=title, description=f"Index of {title.lower()}.", timestamp=BUNDLE_TIMESTAMP, tags=[tag])
    body = f"# {title}\n\n"
    for c in concepts:
        body += f"- [{c['t']}]({c['f'].split('/')[-1]})\n"
    if folder != "faqs":
        body += "\n[Back to bundle index](../index.md)\n"
    return f + "\n" + body


def gen_log():
    return """---
type: Concept
title: Bundle Change Log
tags:
  - changelog
---

# Change Log

## 2026-07-09 — OKF v3

- OKF-conformant bundle with validated cross-links
- Semantic guide matching (location + dietary tags)
- Self-contained HTML visualizer
- CI validation via okf-validate.mjs
- 6 tours, 44 guides, 3 locations, 10 FAQs
"""


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    print(f"OKF Generator v3{' [DRY RUN]' if DRY_RUN else ''}\n  In: {DATA_DIR}\n  Out: {OUT_DIR}\n")

    tours_raw = json.load(open(DATA_DIR / "tours.json"))
    stories_raw = json.load(open(DATA_DIR / "stories.json"))
    faqs_raw = json.load(open(DATA_DIR / "faqs.json"))
    locations_raw = json.load(open(DATA_DIR / "locations.json"))

    pt = [t for t in tours_raw if t.get("_status") not in ("draft", "archived")]
    ps = [s for s in stories_raw if s.get("status") == "published" and s.get("workflowStatus") == "published" and len(extract_md(s)) > 200]
    pf = [f for f in faqs_raw if f.get("workflowStatus") != "draft"]
    pl = [l for l in locations_raw if l.get("name")]

    print(f"  Tours:{len(pt)} Guides:{len(ps)} FAQs:{len(pf)} Locations:{len(pl)}\n")

    # Build location slug set
    global LOCATION_SLUGS_BUILT
    for l in pl:
        slug = l.get("slug", norm_loc(l.get("name", "")))
        LOCATION_SLUGS_BUILT.add(slug)

    # Build location → (tours, guides) cross-reference index
    guides_by_loc = {}
    for s in ps:
        hints = {"kuala-lumpur": "kuala-lumpur", "kl": "kuala-lumpur", "penang": "penang", "ipoh": "ipoh", "melaka": "melaka"}
        ls = "kuala-lumpur"
        for h, l in hints.items():
            if h in s["slug"]: ls = l; break
        guides_by_loc.setdefault(ls, []).append({
            "title": s["title"], "file": f"guides/{s['slug']}.md", "slug": s["slug"],
        })

    if DRY_RUN:
        print("DRY RUN — no files written.")
        return

    # Clean and create directories
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for old in OUT_DIR.rglob("*.md"):
        old.unlink()
    for old in OUT_DIR.rglob("*.html"):
        old.unlink()

    concepts = []

    # ── Tours ──────────────────────────────────────────────────────────────────
    (OUT_DIR / "tours").mkdir(parents=True, exist_ok=True)
    for t in pt:
        c = gen_tour(t, guides_by_loc)
        (OUT_DIR / c["f"]).write_text(c["c"])
        concepts.append(c)
        print(f"  + {c['f']}")
    (OUT_DIR / "tours/index.md").write_text(gen_sub_index("tours", "Tours", [c for c in concepts if c["type"] == "tour"]))
    print(f"  + tours/index.md")

    # ── Guides ────────────────────────────────────────────────────────────────
    (OUT_DIR / "guides").mkdir(parents=True, exist_ok=True)
    for s in ps:
        g = gen_guide(s)
        (OUT_DIR / g["f"]).write_text(g["c"])
        concepts.append(g)
    (OUT_DIR / "guides/index.md").write_text(gen_sub_index("guides", "Food Guides", [c for c in concepts if c["type"] == "guide"]))
    print(f"  + guides/index.md")

    # ── FAQs ──────────────────────────────────────────────────────────────────
    (OUT_DIR / "faqs").mkdir(parents=True, exist_ok=True)
    for f_item in pf:
        fc = gen_faq(f_item)
        (OUT_DIR / fc["f"]).write_text(fc["c"])
        concepts.append(fc)
    (OUT_DIR / "faqs/index.md").write_text(gen_sub_index("faqs", "FAQs", [c for c in concepts if c["type"] == "faq"]))
    print(f"  + faqs/index.md")

    # ── Locations ─────────────────────────────────────────────────────────────
    (OUT_DIR / "locations").mkdir(parents=True, exist_ok=True)
    for l_item in pl:
        ls = norm_loc(l_item.get("name", ""))
        tours_for_loc = [{"title": t["name"], "file": f"tours/{t['slug']}.md", "desc": trunc(t.get("short_description") or t.get("shortDescription") or t.get("tagline") or "", 200)} for t in pt if norm_loc(t.get("location", "")) == ls]
        guides_for_loc = guides_by_loc.get(ls, [])
        lc = gen_location(l_item, tours_for_loc, guides_for_loc)
        (OUT_DIR / lc["f"]).write_text(lc["c"])
        concepts.append(lc)
        print(f"  + {lc['f']}")
    (OUT_DIR / "locations/index.md").write_text(gen_sub_index("locations", "Destinations", [c for c in concepts if c["type"] == "place"]))
    print(f"  + locations/index.md")

    # ── Root index + visualizer + log ─────────────────────────────────────────
    (OUT_DIR / "index.md").write_text(gen_index(concepts))
    print(f"  + index.md")
    (OUT_DIR / "visualize.html").write_text(gen_visualizer(concepts))
    print(f"  + visualize.html")
    (OUT_DIR / "log.md").write_text(gen_log())
    print(f"  + log.md")

    # Summary
    counts = {}
    for c in concepts: counts[c["type"]] = counts.get(c["type"], 0) + 1
    print(f"\nDone: {sum(counts.values())} concepts")
    for t, n in sorted(counts.items()): print(f"  {t}: {n}")

    # Validate
    if VALIDATOR.exists():
        import subprocess
        r = subprocess.run(["node", str(VALIDATOR), str(OUT_DIR)], capture_output=True, text=True, timeout=30)
        print(f"\n  {'✅ OKF: PASS' if r.returncode == 0 else '⚠️  OKF issues:'}")
        for line in r.stdout.split("\n")[:10]:
            if "ERROR" in line or "WARN" in line or "PASS" in line or "FAIL" in line:
                print(f"    {line.strip()}")

if __name__ == "__main__":
    main()
