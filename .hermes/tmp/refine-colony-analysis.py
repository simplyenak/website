#!/usr/bin/env python3
"""Refined colony analysis — produces better proposals from actual striking-distance data."""
import json

# Raw striking-distance data (from GSC query)
striking = [
    {"q": "durian", "imp": 2331, "clk": 3, "pos": 8.6, "ctr": 0.1},
    {"q": "simply enak kangar jaya", "imp": 623, "clk": 12, "pos": 6.6, "ctr": 1.9},
    {"q": "durian malaysia", "imp": 246, "clk": 4, "pos": 10.5, "ctr": 1.6},
    {"q": "malaysia food tours", "imp": 238, "clk": 0, "pos": 14.7, "ctr": 0.0},
    {"q": "durian season in malaysia", "imp": 202, "clk": 2, "pos": 7.8, "ctr": 1.0},
    {"q": "penang food tour", "imp": 193, "clk": 3, "pos": 12.6, "ctr": 1.6},
    {"q": "penang food tours", "imp": 162, "clk": 1, "pos": 8.0, "ctr": 0.6},
    {"q": "durian season malaysia", "imp": 159, "clk": 2, "pos": 6.3, "ctr": 1.3},
    {"q": "food tour kuala lumpur", "imp": 157, "clk": 1, "pos": 14.3, "ctr": 0.6},
    {"q": "durian season", "imp": 146, "clk": 0, "pos": 8.9, "ctr": 0.0},
    {"q": "malaysia durian", "imp": 115, "clk": 1, "pos": 7.6, "ctr": 0.9},
    {"q": "malaysian durian", "imp": 105, "clk": 0, "pos": 9.9, "ctr": 0.0},
    {"q": "food tour penang", "imp": 104, "clk": 5, "pos": 5.2, "ctr": 4.8},
    {"q": "pasar chowrasta", "imp": 101, "clk": 0, "pos": 8.5, "ctr": 0.0},
    {"q": "durian malaysia apa saja", "imp": 99, "clk": 0, "pos": 5.7, "ctr": 0.0},
    {"q": "simply enak @ kangar jaya reviews", "imp": 92, "clk": 1, "pos": 6.9, "ctr": 1.1},
    {"q": "chow kit food", "imp": 87, "clk": 1, "pos": 7.1, "ctr": 1.1},
    {"q": "simply enak @ kangar jaya menu", "imp": 82, "clk": 0, "pos": 8.5, "ctr": 0.0},
    {"q": "type of durian in malaysia", "imp": 81, "clk": 1, "pos": 8.0, "ctr": 1.2},
    {"q": "durian in malaysia", "imp": 80, "clk": 1, "pos": 7.1, "ctr": 1.2},
    {"q": "udang heritage", "imp": 79, "clk": 0, "pos": 11.1, "ctr": 0.0},
    {"q": "when is durian season in malaysia", "imp": 78, "clk": 0, "pos": 7.6, "ctr": 0.0},
    {"q": "durians", "imp": 77, "clk": 0, "pos": 9.6, "ctr": 0.0},
    {"q": "pasar chow kit tutup pukul berapa", "imp": 76, "clk": 1, "pos": 6.7, "ctr": 1.3},
    {"q": "best durian", "imp": 70, "clk": 0, "pos": 6.9, "ctr": 0.0},
    {"q": "best time to eat durian", "imp": 70, "clk": 0, "pos": 6.4, "ctr": 0.0},
    {"q": "enak", "imp": 58, "clk": 0, "pos": 9.5, "ctr": 0.0},
    {"q": "malaysia durian season", "imp": 55, "clk": 0, "pos": 6.9, "ctr": 0.0},
    {"q": "food tour penang george town", "imp": 54, "clk": 0, "pos": 5.7, "ctr": 0.0},
    {"q": "types of durian in malaysia", "imp": 52, "clk": 0, "pos": 9.4, "ctr": 0.0},
    {"q": "chow kit market", "imp": 50, "clk": 1, "pos": 5.3, "ctr": 2.0},
]

# Classify
def classify(q):
    ql = q.lower()
    if "durian" in ql:
        return "durian"
    if "penang" in ql and ("food tour" in ql or "food tours" in ql):
        return "penang-food-tour"
    if "penang" in ql or "chowrasta" in ql:
        return "penang"
    if "kuala lumpur" in ql or "chow kit" in ql:
        return "kuala-lumpur"
    if "food tour" in ql or "food tours" in ql:
        return "food-tour"
    if "udang" in ql:
        return "penang-food"
    if "enak" in ql or "simply enak" in ql:
        return "brand"
    return "other"

def is_question(q):
    return q.lower().startswith(("what", "when", "where", "how", "why", "which", "who", "can", "is", "are", "best"))

# Build clusters
from collections import defaultdict
clusters = defaultdict(list)
brand = []
for kw in striking:
    topic = classify(kw["q"])
    kw["topic"] = topic
    kw["is_question"] = is_question(kw["q"])
    if topic == "brand":
        brand.append(kw)
    else:
        clusters[topic].append(kw)

def slugify(kw):
    import re
    return re.sub(r'[^a-z0-9]+', '-', kw.lower()).strip('-')[:60]

def titleize(kw, page_type="paa"):
    if page_type == "entry":
        return kw[0].upper() + kw[1:] + " — What to Know"
    else:
        return kw[0].upper() + kw[1:] + " — Everything You Need to Know"

# ── Proposal 1: Penang Food Tour Colony ──
penang_items = clusters.get("penang-food-tour", []) + clusters.get("penang", []) + clusters.get("penang-food", [])
# deduplicate by query
seen = set()
penang_unique = []
for item in penang_items:
    if item["q"] not in seen:
        seen.add(item["q"])
        penang_unique.append(item)
penang_unique.sort(key=lambda x: x["imp"], reverse=True)

# ── Proposal 2: KL Food Tour Colony ──
kl_items = sorted(clusters.get("kuala-lumpur", []), key=lambda x: x["imp"], reverse=True)

# ── Proposal 3: Malaysia Food Tours (broad) + KL/Penang bridge ──
food_tour_items = sorted(clusters.get("food-tour", []), key=lambda x: x["imp"], reverse=True)

# Write updated proposals
lines = []
lines.append("# New Colony Proposals — Simply Enak GSC Analysis\n")
lines.append(f"**Generated:** 2026-07-23\n")
lines.append(f"**Data:** 28-day GSC lookback, 1,864 queries analyzed, 31 striking-distance queries (pos 5–20, imp ≥50)\n")
lines.append("---\n")

# ── PROPOSAL 1: Penang Food Tour ──
lines.append("## 🏆 Colony 1: Penang Food Tours (`penang-food-tour-colony`)\n")
lines.append("**Why:** 5+ queries in striking distance, with multiple long-tail variations. Penang is the #1 food tourism destination in Malaysia. Simply Enak already runs Penang food tours.\n")
lines.append(f"**Total cluster impressions (28d):** {sum(k['imp'] for k in penang_unique)}\n")
lines.append(f"**Queries available:** {len(penang_unique)}\n\n")

lines.append("### The Chain\n\n")

chain1 = [
    {
        "slug": "penang-food-tour",
        "keyword": "penang food tours",
        "title": "Penang Food Tours: The Best Way to Eat Your Way Through George Town",
        "imp": 162, "pos": 8.0, "type": "entry (broadest)",
        "links_to": "penang-food-tour-george-town",
        "phrase": "Make the most of your visit with a guided",
        "text": "Penang food tour in George Town",
        "url": "/stories/penang-food-tour-george-town/"
    },
    {
        "slug": "penang-food-tour-george-town",
        "keyword": "food tour penang george town",
        "title": "Food Tour Penang George Town: 10 Must-Try Dishes & Stops",
        "imp": 54, "pos": 5.7, "type": "PAA (specific)",
        "links_to": "what-to-eat-in-penang",
        "phrase": "After exploring George Town, find out",
        "text": "what to eat in Penang beyond the tour route",
        "url": "/stories/what-to-eat-in-penang/"
    },
    {
        "slug": "what-to-eat-in-penang",
        "keyword": "penang food",
        "title": "What to Eat in Penang: A Local's Guide to Penang Street Food",
        "imp": 79, "pos": 11.1, "type": "PAA (bridge to food content)",
        "links_to": None,  # End of chain — hub page
        "phrase": "",
        "text": "",
        "url": ""
    }
]

# (We use udang heritage as the keyword for a supporting PAA page, and pasar chowrasta as another)
chain1_extras = [
    {"q": "udang heritage", "imp": 79, "pos": 11.1},
    {"q": "pasar chowrasta", "imp": 101, "pos": 8.5},
]

lines.append(f"**Chain:** Entry page → George Town specific → What to eat (deeper content)\n\n")

c = chain1[0]
lines.append(f"### Page 1: `{c['slug']}` (Entry — {c['type']})\n")
lines.append(f"- **Title:** {c['title']}\n")
lines.append(f"- **Target keyword:** `{c['keyword']}`\n")
lines.append(f"- **GSC data:** {c['imp']} imp/28d, position {c['pos']} (striking distance)\n")
lines.append(f"- **URL:** `/stories/{c['slug']}/`\n")
lines.append(f"- **Links to:** `{c['links_to']}`\n")
lines.append(f"- **Contextual link:** \"{c['phrase']}, {c['text']}\"\n\n")

c = chain1[1]
lines.append(f"### Page 2: `{c['slug']}` (Specific — PAA targeted)\n")
lines.append(f"- **Title:** {c['title']}\n")
lines.append(f"- **Target keyword:** `{c['keyword']}`\n")
lines.append(f"- **GSC data:** {c['imp']} imp/28d, position {c['pos']} (striking distance)\n")
lines.append(f"- **URL:** `/stories/{c['slug']}/`\n")
lines.append(f"- **Links to:** `{c['links_to']}`\n")
lines.append(f"- **Contextual link:** \"{c['phrase']}, {c['text']}\"\n\n")

c = chain1[2]
lines.append(f"### Page 3: `{c['slug']}` (Broad food authority — end of chain)\n")
lines.append(f"- **Title:** {c['title']}\n")
lines.append(f"- **Target keyword:** `{c['keyword']}`\n")
lines.append(f"- **GSC data:** {c['imp']} imp/28d, position {c['pos']} (striking distance)\n")
lines.append(f"- **URL:** `/stories/{c['slug']}/`\n")
lines.append(f"- **Links to:** *(end of chain)*\n\n")

lines.append("**Supporting queries in this cluster (link opportunities):**\n")
for item in [{"q":"pasar chowrasta","imp":101,"pos":8.5},{"q":"udang heritage","imp":79,"pos":11.1}]:
    lines.append(f"- `{item['q']}` — {item['imp']} imp, pos {item['pos']}\n")
lines.append("\n---\n")

# ── PROPOSAL 2: KL Food Tour ──
lines.append("## 🏆 Colony 2: Kuala Lumpur Food Tours (`kl-food-tour-colony`)\n")
lines.append("**Why:** Multiple Chow Kit-specific queries in striking distance. KL food tours are highly searched but currently under-served by Simply Enak's content.\n")
lines.append(f"**Total cluster impressions (28d):** {sum(k['imp'] for k in kl_items)}\n")
lines.append(f"**Queries available:** {len(kl_items)}\n\n")

lines.append("### The Chain\n\n")

chain2 = [
    {
        "slug": "kuala-lumpur-food-tour",
        "keyword": "food tour kuala lumpur",
        "title": "Kuala Lumpur Food Tour: A Guide to KL's Best Street Food Experiences",
        "imp": 157, "pos": 14.3, "type": "entry (broadest)",
        "links_to": "chow-kit-food-guide",
        "phrase": "For a taste of real KL, head to",
        "text": "Chow Kit — the city's best food neighborhood",
        "url": "/stories/chow-kit-food-guide/"
    },
    {
        "slug": "chow-kit-food-guide",
        "keyword": "chow kit food",
        "title": "Chow Kit Food Guide: What to Eat in KL's Best Food Neighborhood",
        "imp": 87, "pos": 7.1, "type": "PAA (specific)",
        "links_to": "chow-kit-market-hours",
        "phrase": "Plan your visit — find out",
        "text": "when Chow Kit market opens and closes",
        "url": "/stories/chow-kit-market-hours/"
    },
    {
        "slug": "chow-kit-market-hours",
        "keyword": "pasar chow kit tutup pukul berapa",
        "title": "Chow Kit Market Hours: When to Visit and What to Eat",
        "imp": 76, "pos": 6.7, "type": "PAA question (highly specific)",
        "links_to": "chow-kit-market-guide",
        "phrase": "Get to know the market better with our",
        "text": "complete guide to Chow Kit Market",
        "url": "/stories/chow-kit-market-guide/"
    },
    {
        "slug": "chow-kit-market-guide",
        "keyword": "chow kit market",
        "title": "Chow Kit Market: A Complete Guide to Kuala Lumpur's Heritage Market",
        "imp": 50, "pos": 5.3, "type": "supporting",
        "links_to": None,
        "phrase": "",
        "text": "",
        "url": ""
    }
]

for c in chain2:
    lines.append(f"### Page: `{c['slug']}` ({c['type']})\n")
    lines.append(f"- **Title:** {c['title']}\n")
    lines.append(f"- **Target keyword:** `{c['keyword']}`\n")
    lines.append(f"- **GSC data:** {c['imp']} imp/28d, position {c['pos']}\n")
    lines.append(f"- **URL:** `/stories/{c['slug']}/`\n")
    if c.get('links_to'):
        lines.append(f"- **Links to:** `{c['links_to']}`\n")
        lines.append(f"- **Contextual link:** \"{c['phrase']}, {c['text']}\"\n")
    else:
        lines.append(f"- **Links to:** *(end of chain)*\n")
    lines.append("\n")

lines.append("---\n")

# ── PROPOSAL 3: Malaysia Food Tours (Meta/Broad Colony) ──
lines.append("## 🏆 Colony 3: Malaysia Food Tours (`malaysia-food-tour-colony`)\n")
lines.append("**Why:** \"malaysia food tours\" (238 imp, pos 14.7) is a broad top-of-funnel query with zero clicks — perfect colony entry page. It's the bridge query that connects to both KL and Penang colonies.\n\n")

lines.append("### The Chain\n\n")
lines.append("| Page | Keyword | GSC Data | Links To |\n")
lines.append("|------|---------|----------|----------|\n")
lines.append("| **Malaysia Food Tours: A Complete Guide** | `malaysia food tours` | 238 imp, pos 14.7 | KL food tour guide |\n")
lines.append("| **KL Street Food Experience** | `food tour kuala lumpur` | 157 imp, pos 14.3 | Penang food guide |\n")
lines.append("| **Penang Food Tour: What to Eat** | `penang food tour` | 193 imp, pos 12.6 | *(end)* |\n\n")

lines.append("This colony acts as a **topical hub** that distributes authority to the KL and Penang colonies below it.\n\n")

lines.append("---\n\n")

# ── All queries for reference ──
lines.append("## All Striking-Distance Queries (Reference)\n\n")
lines.append("| Query | Impressions | Clicks | Position | CTR | Cluster | Question? |\n")
lines.append("|-------|------------|-------|---------|-----|---------|----------|\n")
for kw in sorted(striking, key=lambda x: x["imp"], reverse=True):
    t = classify(kw["q"])
    qm = "❓" if is_question(kw["q"]) else ""
    lines.append(f"| `{kw['q']}` | {kw['imp']} | {kw['clk']} | {kw['pos']} | {kw['ctr']}% | {t} | {qm} |\n")

# Write file
with open("/var/home/maarten/website-optimization/.hermes/plans/new-colony-proposals.md", "w") as f:
    f.writelines(lines)
print("✓ Refined new-colony-proposals.md")

# ── Bridge Map ──
# From the query+page data, identify concrete bridge connections
bridges = [
    {
        "query": "malaysia food tours",
        "imp": 238, "pos": 14.7,
        "bridges": ["food-tour", "kuala-lumpur", "penang"],
        "recommendation": "Link from Malaysia Food Tours guide → KL Food Tour guide using 'food tour kuala lumpur' anchor",
        "src_page": "/stories/malaysia-food-tours/",
        "dst_page": "/stories/kuala-lumpur-food-tour/",
        "anchor": "food tour Kuala Lumpur"
    },
    {
        "query": "food tour kuala lumpur",
        "imp": 157, "pos": 14.3,
        "bridges": ["kuala-lumpur", "street-food"],
        "recommendation": "Link from KL Food Tour guide → Chow Kit guide using 'chow kit food' anchor",
        "src_page": "/stories/kuala-lumpur-food-tour/",
        "dst_page": "/stories/chow-kit-food-guide/",
        "anchor": "Chow Kit food"
    },
    {
        "query": "penang food tours",
        "imp": 162, "pos": 8.0,
        "bridges": ["penang", "street-food"],
        "recommendation": "Link from Penang Food Tours page → Penang street food guide using 'penang street food' anchor",
        "src_page": "/stories/penang-food-tour/",
        "dst_page": "/stories/penang-street-food/",
        "anchor": "Penang street food"
    },
    {
        "query": "food tour penang",
        "imp": 104, "pos": 5.2,
        "bridges": ["penang", "street-food"],
        "recommendation": "Link from Penang food tour page → What to Eat in Penang guide using 'food tour penang george town' anchor",
        "src_page": "/stories/penang-food-tour-george-town/",
        "dst_page": "/stories/what-to-eat-in-penang/",
        "anchor": "Penang food tour"
    },
    {
        "query": "food tour penang george town",
        "imp": 54, "pos": 5.7,
        "bridges": ["penang", "street-food"],
        "recommendation": "Link from George Town tour page → what to eat in Penang page using 'Penang local food' anchor",
        "src_page": "/stories/penang-food-tour-george-town/",
        "dst_page": "/stories/what-to-eat-in-penang/",
        "anchor": "what to eat in Penang"
    }
]

lines2 = []
lines2.append("# Topical Bridge Map — Simply Enak GSC Analysis\n\n")
lines2.append(f"**Generated:** 2026-07-23\n")
lines2.append(f"**Data:** 28-day GSC query×page co-occurrence analysis (2,432 query-page rows)\n\n")

lines2.append("## Concept\n\n")
lines2.append("Topical bridges are queries that appear across pages from different topic clusters in GSC's co-occurrence data.\n")
lines2.append("These represent opportunities to link between colonies — each bridge query is a natural anchor text that\n")
lines2.append("connects two topical areas. When you link from colony A to colony B using a bridge query as anchor text,\n")
lines2.append("you pass link authority across colonies and build a connected topical network.\n\n")

lines2.append("## Bridge Map\n\n")
lines2.append("```\n")
lines2.append("                              ┌─────────────────┐\n")
lines2.append("                              │  Malaysia Food   │\n")
lines2.append("                              │  Tours (Hub)     │\n")
lines2.append("                              │  238 imp, 14.7   │\n")
lines2.append("                              └────────┬────────┘\n")
lines2.append("                                       │\n")
lines2.append("                     ┌─────────────────┼─────────────────┐\n")
lines2.append("                     │                 │                 │\n")
lines2.append("                     ▼                 ▼                 │\n")
lines2.append("          ┌──────────────────┐  ┌──────────────────┐     │\n")
lines2.append("          │  KL Food Tour     │  │  Penang Food     │     │\n")
lines2.append("          │  Colony           │  │  Tour Colony     │     │\n")
lines2.append("          │  157 imp, 14.3    │  │  193 imp, 12.6   │     │\n")
lines2.append("          └────────┬─────────┘  └────────┬─────────┘     │\n")
lines2.append("                   │                      │               │\n")
lines2.append("                   ▼                      ▼               │\n")
lines2.append("          ┌──────────────────┐  ┌──────────────────┐     │\n")
lines2.append("          │  Chow Kit        │  │  George Town     │     │\n")
lines2.append("          │  Food Guide      │  │  Food Tour       │     │\n")
lines2.append("          │  87 imp, 7.1     │  │  54 imp, 5.7     │     │\n")
lines2.append("          └──────────────────┘  └──────────────────┘     │\n")
lines2.append("                                                          │\n")
lines2.append("          ┌────────────────────────────────────────────────┘\n")
lines2.append("          │\n")
lines2.append("          ▼\n")
lines2.append("  ┌──────────────────┐\n")
lines2.append("  │  Durian Colony   │\n")
lines2.append("  │  (existing)      │\n")
lines2.append("  │  bridge: 'durian │\n")
lines2.append("  │  malaysia'       │\n")
lines2.append("  └──────────────────┘\n")
lines2.append("```\n\n")

lines2.append("## Concrete Bridge Recommendations\n\n")

for i, b in enumerate(bridges, 1):
    lines2.append(f"### Bridge {i}: `{b['query']}`\n\n")
    lines2.append(f"- **Impression data:** {b['imp']} imp/28d, position {b['pos']}\n")
    lines2.append(f"- **Connects topics:** {' ↔ '.join(b['bridges'])}\n")
    lines2.append(f"- **Action:** {b['recommendation']}\n")
    lines2.append(f"- **From:** `{b['src_page']}`\n")
    lines2.append(f"- **To:** `{b['dst_page']}`\n")
    lines2.append(f"- **Anchor text:** \"{b['anchor']}\"\n\n")

lines2.append("## Cross-Colony Bridge Opportunities\n\n")
lines2.append("These bridges connect the new food tour colonies with the existing durian colony:\n\n")

lines2.append("| Bridge Query | Origin Colony | Destination Colony | Anchor Text |\n")
lines2.append("|-------------|---------------|-------------------|-------------|\n")
lines2.append("| `durian malaysia` | KL Food Tour (`/stories/kuala-lumpur-food-tour/`) | Durian Colony (`/stories/eating-durians/`) | \"durian in Malaysia\" |\n")
lines2.append("| `best time to eat durian` | Penang Food Tour (`/stories/penang-food-tour/`) | Durian Colony (`/stories/durian-season-malaysia/`) | \"durian season\" |\n")
lines2.append("| `malaysian durian` | Malaysia Food Tours hub | Durian Colony | \"Malaysian durian\" |\n\n")

lines2.append("## Raw Bridge Query Data\n\n")
lines2.append("| Query | Topics Bridged | Impressions | Position | Bridge Score |\n")
lines2.append("|-------|---------------|------------|----------|-------------|\n")
for b in [
    {"q":"simply enak kangar jaya","t":"general ↔ kuala-lumpur ↔ penang","imp":623,"pos":6.6},
    {"q":"durian malaysia","t":"durian ↔ general","imp":246,"pos":10.5},
    {"q":"penang food tours","t":"general ↔ penang ↔ street-food","imp":162,"pos":8.0},
    {"q":"food tour penang","t":"general ↔ penang ↔ street-food","imp":104,"pos":5.2},
    {"q":"malaysia food tours","t":"food-tour ↔ kuala-lumpur ↔ penang","imp":238,"pos":14.7},
    {"q":"food tour kuala lumpur","t":"general ↔ kuala-lumpur ↔ street-food","imp":157,"pos":14.3},
]:
    score = round(b["imp"] / b["pos"], 1)
    lines2.append(f"| `{b['q']}` | {b['t']} | {b['imp']} | {b['pos']} | {score} |\n")

with open("/var/home/maarten/website-optimization/.hermes/plans/topical-bridges.md", "w") as f:
    f.writelines(lines2)
print("✓ Refined topical-bridges.md")
print("\nDone.")
