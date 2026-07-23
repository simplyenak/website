#!/usr/bin/env python3
"""GSC Colony Analysis — find new colony topics and detect topical bridges."""
import json, os, sys, urllib.parse, urllib.request, re
from datetime import datetime, timedelta
from collections import defaultdict

CRED = os.path.expanduser("~/.google/credentials/gsc-key.json")
SITE = "sc-domain:simplyenak.com"
SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"

from google.oauth2 import service_account
from google.auth.transport.requests import Request

def gsc_query(dimensions, row_limit=25000):
    """Query GSC Search Analytics API."""
    credentials = service_account.Credentials.from_service_account_file(CRED, scopes=[SCOPE])
    credentials.refresh(Request())
    enc = urllib.parse.quote(SITE, safe='')
    url = f"https://www.googleapis.com/webmasters/v3/sites/{enc}/searchAnalytics/query"
    end = datetime.now().strftime("%Y-%m-%d")
    start = (datetime.now() - timedelta(days=28)).strftime("%Y-%m-%d")
    body = {
        "startDate": start, "endDate": end,
        "dimensions": dimensions,
        "rowLimit": row_limit,
        "dataState": "all"
    }
    req = urllib.request.Request(url, data=json.dumps(body).encode())
    req.add_header("Authorization", f"Bearer {credentials.token}")
    req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, timeout=60) as resp:
        result = json.loads(resp.read().decode("utf-8"))
    return result.get("rows", [])

# ── Part A: Query-level data ──
print("=== Part A: Fetching query-level GSC data (28d, rowLimit=25000) ===")
query_rows = gsc_query(["query"], 25000)
print(f"  Total queries returned: {len(query_rows)}")

# Save raw data
raw_path = "/var/home/maarten/website-optimization/.hermes/tmp/gsc-queries-raw.json"
with open(raw_path, "w") as f:
    json.dump({"fetched_at": datetime.now().isoformat(), "rows": query_rows}, f, indent=2)
print(f"  Raw data saved to {raw_path}")

# Filter: position 5-20, impressions >= 50
striking = []
for row in query_rows:
    imp = row.get("impressions", 0)
    pos = row.get("position", 100)
    clk = row.get("clicks", 0)
    q = row.get("keys", [""])[0]
    if 5 <= pos <= 20 and imp >= 50:
        ctr = row.get("ctr", 0)
        score = imp * (1.0 / pos) * (1.0 - ctr)
        striking.append({
            "query": q, "impressions": imp, "clicks": clk,
            "position": round(pos, 1), "ctr": round(ctr * 100, 1),
            "score": round(score, 1)
        })

striking.sort(key=lambda x: x["score"], reverse=True)
print(f"  Striking-distance queries (pos 5-20, imp>=50): {len(striking)}")

# ── Topical clustering ──
# Define topic clusters by keyword patterns
TOPIC_PATTERNS = {
    "street-food": [
        "street food", "jalan alor", "pasar malam", "night market", "hawker",
        "gerai", "food court", "street snack", "street eats"
    ],
    "halal-food": [
        "halal", "halal food", "halal restaurant", "halal street food",
        "halal malaysia", "halal kl", "halal penang"
    ],
    "kuala-lumpur": [
        "kuala lumpur", "kl", "kuala lumpur food", "things to do in kuala lumpur",
        "kl attractions", "kuala lumpur travel guide", "kuala lumpur itinerary",
        "kl tower", "petronas", "batu caves", "bukit bintang", "chow kit"
    ],
    "penang": [
        "penang", "penang food", "penang island", "george town",
        "penang hill", "penang travel", "penang attraction", "penang street food",
        "penang hawker", "penang local food"
    ],
    "malaysian-food": [
        "malaysian food", "malaysian cuisine", "traditional malaysian",
        "malay food", "nasi", "laksa", "rendang", "satay", "roti canai",
        "mee goreng", "curry", "sambal", "nasi lemak", "char kway teow",
        "bah kut teh", "asam laksa", "penang laksa", "sarawak"
    ],
    "food-tour": [
        "food tour", "food trip", "food walk", "street food tour",
        "culinary tour", "food guide", "food experience",
        "kuala lumpur food tour", "penang food tour"
    ],
    "local-food": [
        "local food", "local cuisine", "traditional food",
        "authentic malaysian", "where to eat", "best food",
        "local malaysian food", "local eats"
    ],
    "vegetarian": [
        "vegetarian", "vegan", "vegetarian malaysia", "vegan malaysia",
        "vegetarian kl", "vegetarian penang", "vegetarian food"
    ],
    "travel-guide": [
        "travel guide", "travel tips", "backpacking", "where to go",
        "best time to visit", "malaysia travel", "itinerary",
        "things to do", "attractions", "tourist spots"
    ],
}

def classify_query(q):
    ql = q.lower()
    matches = defaultdict(float)
    for topic, patterns in TOPIC_PATTERNS.items():
        for pat in patterns:
            if pat in ql:
                matches[topic] += 1
    if matches:
        return max(matches, key=matches.get)
    return "other"

def is_question(q):
    """Detect PAA-style question queries."""
    ql = q.lower().strip()
    starters = [
        "what", "why", "when", "where", "how", "which", "who", "can", "is",
        "are", "do", "does", "should", "best", "top"
    ]
    return any(ql.startswith(w) for w in starters) or ql.endswith("?")

# Cluster the striking queries
clusters = defaultdict(list)
unclustered = []
for kw in striking:
    q = kw["query"]
    topic = classify_query(q)
    kw["topic"] = topic
    kw["is_question"] = is_question(q)
    if topic != "other":
        clusters[topic].append(kw)
    else:
        unclustered.append(kw)

print(f"\n  Topical clusters found:")
for topic in sorted(clusters.keys(), key=lambda t: sum(k["impressions"] for k in clusters[t]), reverse=True):
    items = clusters[topic]
    total_imp = sum(k["impressions"] for k in items)
    avg_pos = sum(k["position"] for k in items) / len(items)
    questions = [k for k in items if k["is_question"]]
    print(f"    {topic}: {len(items)} queries, {total_imp} total imp, avg pos {avg_pos:.1f}, {len(questions)} questions")
if unclustered:
    print(f"    (other): {len(unclustered)} queries")

# ── Part B: Query × Page data for bridges ──
print("\n=== Part B: Fetching query+page GSC data for bridge detection ===")
qp_rows = gsc_query(["query", "page"], 25000)
print(f"  Total query-page rows: {len(qp_rows)}")

# Build a query->pages map and page->queries map
query_pages = defaultdict(set)
page_queries = defaultdict(set)
for row in qp_rows:
    keys = row.get("keys", ["", ""])
    q, p = keys[0], keys[1]
    if q and p:
        query_pages[q].add(p)
        page_queries[p].add(q)

# Build topic->pages map from page URLs
def classify_page(url):
    """Classify a page URL into a topic based on its content path."""
    ul = url.lower()
    if "durian" in ul: return "durian"
    if "street-food" in ul or "hawker" in ul or "jalan-alor" in ul or "night-market" in ul:
        return "street-food"
    if "halal" in ul: return "halal-food"
    if "penang" in ul: return "penang"
    if "kuala-lumpur" in ul or "kl-" in ul: return "kuala-lumpur"
    if "food-tour" in ul or "culinary-tour" in ul: return "food-tour"
    if "vegetarian" in ul or "vegan" in ul: return "vegetarian"
    if "local" in ul: return "local-food"
    if "malaysian" in ul or "malaysia-food" in ul or "malaysia-travel" in ul:
        return "malaysian-food"
    if "travel" in ul or "guide" in ul or "itinerary" in ul:
        return "travel-guide"
    return "general"

# Assign topics to pages
page_topics = {}
for page in page_queries:
    page_topics[page] = classify_page(page)

# Find bridge queries: queries that appear with pages from multiple topic clusters
bridge_candidates = []
for query, pages in query_pages.items():
    topic_set = set()
    for p in pages:
        t = page_topics.get(p, "general")
        topic_set.add(t)
    if len(topic_set) >= 2:
        # Check if this query is in our striking distance set
        sq = next((s for s in striking if s["query"] == query), None)
        if sq:
            bridge_candidates.append({
                "query": query,
                "impressions": sq["impressions"],
                "position": sq["position"],
                "topics": sorted(topic_set),
                "pages": sorted(pages)[:5],
                "bridge_score": round(sq["impressions"] / sq["position"], 1)
            })

bridge_candidates.sort(key=lambda x: x["bridge_score"], reverse=True)

print(f"  Bridge queries detected: {len(bridge_candidates)}")

# ── Output results ──

# Helper: suggest a colony chain for a topic
def suggest_colony(cluster_name, items):
    """Build a 3-4 page colony chain from a topical cluster."""
    items_sorted = sorted(items, key=lambda x: x["impressions"], reverse=True)
    questions = [i for i in items_sorted if i["is_question"]]
    non_questions = [i for i in items_sorted if not i["is_question"]]

    chain = []
    # Start with high-impression non-question (broadest page)
    # Then 2-3 PAA questions increasing in specificity
    used = set()

    # Pick 1 broad keyword (not a question) as the entry page
    for i in non_questions:
        if i["query"] not in used:
            chain.append({"page": "entry", "keyword": i["query"], "impressions": i["impressions"], "position": i["position"]})
            used.add(i["query"])
            break

    # Pick 2-3 PAA questions for the chain
    for i in questions[:3]:
        if i["query"] not in used:
            chain.append({"page": "paa", "keyword": i["query"], "impressions": i["impressions"], "position": i["position"]})
            used.add(i["query"])

    # If we don't have enough questions, add more non-questions
    while len(chain) < 3:
        for i in items_sorted:
            if i["query"] not in used:
                chain.append({"page": "supporting", "keyword": i["query"], "impressions": i["impressions"], "position": i["position"]})
                used.add(i["query"])
                break
        else:
            break

    return chain[:4]

# Find best colony opportunities (clusters with high striking-distance potential)
colony_rankings = []
for topic, items in clusters.items():
    total_imp = sum(k["impressions"] for k in items)
    avg_pos = sum(k["position"] for k in items) / len(items)
    question_count = len([k for k in items if k["is_question"]])
    colony_score = round(total_imp / avg_pos, 1)
    chain = suggest_colony(topic, items)

    # Check if colony already exists or is related to durian
    if topic == "durian":
        continue  # Already have durian colony

    colony_rankings.append({
        "topic": topic,
        "total_impressions": total_imp,
        "avg_position": round(avg_pos, 1),
        "question_count": question_count,
        "query_count": len(items),
        "colony_score": colony_score,
        "proposed_chain": chain
    })

colony_rankings.sort(key=lambda x: x["colony_score"], reverse=True)

# ── Write deliverables ──

# 1. Colony proposals
proposal_path = "/var/home/maarten/website-optimization/.hermes/plans/new-colony-proposals.md"
with open(proposal_path, "w") as f:
    f.write("# New Colony Proposals — Simply Enak GSC Analysis\n\n")
    f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
    f.write(f"**Data:** 28-day GSC lookback, queries with position 5-20 and impressions ≥50\n\n")

    f.write("## Top Colony Opportunities\n\n")
    f.write("| Rank | Colony Topic | Total Impressions | Avg Position | Queries | Questions | Score |\n")
    f.write("|------|-------------|-------------------|-------------|---------|-----------|-------|\n")
    for i, cr in enumerate(colony_rankings[:6], 1):
        f.write(f"| {i} | **{cr['topic']}** | {cr['total_impressions']} | {cr['avg_position']} | {cr['query_count']} | {cr['question_count']} | {cr['colony_score']} |\n")

    f.write("\n---\n\n## Detailed Colony Chains\n\n")

    for i, cr in enumerate(colony_rankings[:4], 1):
        topic = cr["topic"]
        f.write(f"### Colony {i}: {topic.replace('-', ' ').title()}\n\n")

        # Colony name
        colony_id = topic.lower().replace(" ", "-").replace("_", "-") + "-colony"
        f.write(f"- **Colony ID:** `{colony_id}`\n")
        f.write(f"- **Total striking queries:** {cr['query_count']}\n")
        f.write(f"- **Total impressions:** {cr['total_impressions']}\n")
        f.write(f"- **Average position:** {cr['avg_position']}\n")
        f.write(f"- **PAA-style questions available:** {cr['question_count']}\n\n")

        # Show a few representative queries from this cluster
        f.write("**Top queries in cluster:**\n\n")
        cluster_items = sorted(clusters[topic], key=lambda x: x["impressions"], reverse=True)[:10]
        for qi in cluster_items:
            qmark = " ❓" if qi["is_question"] else ""
            f.write(f"  - `{qi['query']}` — {qi['impressions']} imp, pos {qi['position']}{qmark}\n")
        f.write("\n")

        f.write("**Proposed Colony Chain:**\n\n")
        chain = cr["proposed_chain"]
        if not chain:
            f.write("  _(Insufficient data to build a chain)_\n\n")
            continue

        for j, node in enumerate(chain):
            kw = node["keyword"]
            slug = re.sub(r'[^a-z0-9]+', '-', kw.lower()).strip('-')[:60]
            page_type = node["page"]
            pos = node["position"]
            imp = node["impressions"]

            # Generate a title
            if page_type == "entry":
                title = kw.title() + ": A Malaysia Guide"
            elif page_type == "paa":
                title = kw[0].upper() + kw[1:] + " — Everything You Need to Know"
            else:
                title = "Complete Guide to " + kw.title()

            next_idx = j + 1
            next_slug = ""
            if next_idx < len(chain):
                next_slug = re.sub(r'[^a-z0-9]+', '-', chain[next_idx]["keyword"].lower()).strip('-')[:60]
                next_title = chain[next_idx]["keyword"]

            link_phrase = f"Learn more about {chain[next_idx]['keyword'] if next_idx < len(chain) else 'related topics'}"
            link_text = f"our guide to {chain[next_idx]['keyword'] if next_idx < len(chain) else 'related topics'}"

            f.write(f"**Page {j+1}: `{slug}`**\n")
            f.write(f"  - Title: {title}\n")
            f.write(f"  - Target keyword: `{kw}`\n")
            f.write(f"  - URL: `/stories/{slug}/`\n")
            f.write(f"  - Type: {page_type} (pos {pos}, {imp} imp/28d)\n")
            if next_idx < len(chain):
                f.write(f"  - Links to: `{next_slug}`\n")
                f.write(f"  - Contextual link phrase: \"{link_phrase}\"\n")
                f.write(f"  - Contextual link text: \"{link_text}\"\n")
                f.write(f"  - Contextual link URL: `/stories/{next_slug}/`\n")
            else:
                f.write(f"  - Links to: _(end of chain — link back to colony hub)_\n")
            f.write("\n")

        f.write("**Colony JSON (for colony-tracker.py):**\n\n")
        f.write("```json\n")
        colony_config = {
            "id": colony_id,
            "pages": []
        }
        for j, node in enumerate(chain):
            kw = node["keyword"]
            slug = re.sub(r'[^a-z0-9]+', '-', kw.lower()).strip('-')[:60]
            next_s = None
            next_t = chain[j+1]["keyword"] if j+1 < len(chain) else None
            next_slug = re.sub(r'[^a-z0-9]+', '-', next_t.lower()).strip('-')[:60] if next_t else None
            colony_config["pages"].append({
                "slug": slug,
                "title": kw.title() + ": A Malaysia Guide" if j == 0 else (kw[0].upper() + kw[1:] + " — Everything You Need to Know"),
                "url": f"/stories/{slug}/",
                "target_keyword": kw,
                "status": "planned",
                "links_to": next_slug if next_slug else None,
                "linked_from": None,
                "payload_type": "story",
                "contextual_link_phrase": f"Learn more about {next_t or 'related topics'}",
                "contextual_link_text": f"our guide to {next_t or 'related topics'}",
                "contextual_link_url": f"/stories/{next_slug}/" if next_slug else ""
            })
        f.write(json.dumps(colony_config, indent=4))
        f.write("\n```\n\n---\n\n")

    f.write("\n## Other Candidates to Watch\n\n")
    for i, cr in enumerate(colony_rankings[4:8], 5):
        f.write(f"**{i}. {cr['topic'].replace('-', ' ').title()}** — {cr['total_impressions']} imp, avg pos {cr['avg_position']}, {cr['question_count']} questions\n")

print(f"\n  Colony proposals written to {proposal_path}")

# 2. Topical bridges
bridge_path = "/var/home/maarten/website-optimization/.hermes/plans/topical-bridges.md"
with open(bridge_path, "w") as f:
    f.write("# Topical Bridge Map — Simply Enak GSC Analysis\n\n")
    f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
    f.write(f"**Data:** 28-day GSC query+page co-occurrence analysis\n\n")

    f.write("## What Are Topical Bridges?\n\n")
    f.write("Topical bridges are queries that trigger pages from multiple topic clusters in GSC's \n")
    f.write("co-occurrence data. These queries represent opportunities to link between colonies, \n")
    f.write("passing link authority across topical boundaries.\n\n")

    f.write("## Top Bridge Queries\n\n")
    f.write("| Query | Impressions | Position | Bridge Score | Topics Bridged |\n")
    f.write("|-------|------------|----------|-------------|----------------|\n")

    for b in bridge_candidates[:20]:
        topics_str = " ↔ ".join(b["topics"])
        f.write(f"| `{b['query']}` | {b['impressions']} | {b['position']} | {b['bridge_score']} | {topics_str} |\n")

    f.write("\n## Bridge Recommendations\n\n")
    f.write("Link from `[topic A colony page]` to `[topic B colony page]` using the bridge query as anchor text.\n\n")

    # Group bridges by topic pair
    bridge_pairs = defaultdict(list)
    for b in bridge_candidates[:30]:
        pair = tuple(sorted(b["topics"]))
        if len(pair) >= 2:
            bridge_pairs[pair].append(b)

    for pair in sorted(bridge_pairs.keys(), key=lambda p: len(bridge_pairs[p]), reverse=True):
        bridges = bridge_pairs[pair]
        f.write(f"### {pair[0].replace('-', ' ').title()} ↔ {pair[1].replace('-', ' ').title()}\n\n")
        f.write(f"{len(bridges)} bridge queries found:\n\n")
        for b in bridges[:5]:
            # Infer colony pages from topics
            t1, t2 = b["topics"][0], b["topics"][1]
            colony1_page = f"`/stories/{t1.replace('_', '-')}-guide/`"
            colony2_page = f"`/stories/{t2.replace('_', '-')}-guide/`"
            f.write(f"- **Query:** `{b['query']}`\n")
            f.write(f"  - Recommendation: Link from {colony1_page} to {colony2_page} using anchor text \"**{b['query']}**\"\n")
            f.write(f"  - Evidence: {b['impressions']} imp at position {b['position']} appears across {', '.join(b['topics'])}\n\n")
        f.write("---\n\n")

    # If no colony-specific pages exist yet, suggest generic bridge opportunities
    f.write("\n## Cross-Colony Link Opportunities (actionable)\n\n")
    f.write("These are concrete links you can add today between existing pages:\n\n")
    count = 0
    for b in bridge_candidates:
        if count >= 10:
            break
        # Find actual pages in each topic
        topics = b["topics"]
        if len(topics) < 2:
            continue
        # Pick a representative page from each topic
        pages_by_topic = defaultdict(list)
        for p in b["pages"]:
            t = page_topics.get(p, "general")
            pages_by_topic[t].append(p)

        if len(pages_by_topic) >= 2:
            topics_list = list(pages_by_topic.keys())[:2]
            src_candidates = pages_by_topic.get(topics_list[0], [])
            dst_candidates = pages_by_topic.get(topics_list[1], [])
            if src_candidates and dst_candidates:
                src = src_candidates[0]
                dst = dst_candidates[0]
                f.write(f"1. **Anchor query:** `{b['query']}`\n")
                f.write(f"   - Link from: {src}\n")
                f.write(f"   - Link to: {dst}\n")
                f.write(f"   - Anchor text: \"{b['query']}\"\n")
                f.write(f"   - Bridge strength: {b['bridge_score']} (imp/pos)\n\n")
                count += 1

print(f"  Topical bridges written to {bridge_path}")

# ── Summary to stdout ──
print("\n\n=== ANALYSIS SUMMARY ===")
print(json.dumps({
    "total_striking_queries": len(striking),
    "clusters_found": len(clusters),
    "top_clusters": [
        {"topic": cr["topic"], "impressions": cr["total_impressions"],
         "avg_position": cr["avg_position"], "chain": [c["keyword"] for c in cr["proposed_chain"]]}
        for cr in colony_rankings[:6]
    ],
    "bridge_queries_found": len(bridge_candidates),
    "top_bridges": [
        {"query": b["query"], "topics": b["topics"], "score": b["bridge_score"]}
        for b in bridge_candidates[:10]
    ]
}, indent=2))
