#!/usr/bin/env python3
"""
PAA (People Also Ask) Content Factory for Simply Enak.

Creates FAQ-style Payload Stories from PAA questions sourced from GSC,
a curated topic question bank, or via alsoask.com scrape. Each Q&A becomes
a published Payload Story with a ~120-word brand-voice answer.

Usage:
  python3 scripts/paa-content-factory.py --topic "street food malaysia" --dry-run
  python3 scripts/paa-content-factory.py --topic "durian malaysia" --limit 5
  python3 scripts/paa-content-factory.py --dry-run   # auto-detect topics
"""
import argparse
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
GSC_CREDENTIALS = os.path.expanduser("~/.google/credentials/gsc-key.json")
GSC_SITE = "sc-domain:simplyenak.com"
GSC_SCOPE = "https://www.googleapis.com/auth/webmasters"

PAYLOAD_URL = os.environ.get("PAYLOAD_URL", "https://cms.system.simplyenak.com")
PAYLOAD_EMAIL = os.environ.get("PAYLOAD_EMAIL", "admin@simplyenak.com")
PAYLOAD_PASSWORD = os.environ.get("PAYLOAD_PASSWORD", "")

KNOWN_TOPICS = [
    "street food malaysia", "durian malaysia", "halal food malaysia",
    "malaysian cuisine", "food culture malaysia", "night market malaysia",
    "local food kuala lumpur", "penang food", "malaysia food tour",
    "kuala lumpur food", "penang street food", "malaysia food guide",
]

# ════════════════════════════════════════════
# PAA QUESTION BANK (curated, GSC-backed)
# ════════════════════════════════════════════
PAA_BANK = {
    "street food malaysia": [
        "What is the most popular street food in Malaysia?",
        "Where can I find the best street food in Kuala Lumpur?",
        "Is Malaysian street food safe to eat?",
        "What time do night markets open in Malaysia?",
        "How much does street food cost in Malaysia?",
        "Which Malaysian street food is halal?",
        "What should I try at a Malaysian night market?",
        "How do I order street food in Malaysia?",
    ],
    "durian malaysia": [
        "When is durian season in Malaysia?",
        "Where can I eat durian in Kuala Lumpur?",
        "How much does durian cost in Malaysia?",
        "What is the best durian variety in Malaysia?",
        "How do I choose a good durian in Malaysia?",
        "What does durian taste like?",
        "Can I bring durian back from Malaysia?",
        "Which durian farm in Malaysia should I visit?",
    ],
    "halal food malaysia": [
        "Is all food in Malaysia halal?",
        "How do I know if a restaurant is halal in Malaysia?",
        "What halal food is Malaysia known for?",
        "Are there halal street food options in Kuala Lumpur?",
        "Can I find halal Chinese food in Malaysia?",
        "What halal food can I eat in Penang?",
        "Are food courts in Malaysia halal?",
        "How strict is halal food in Malaysia?",
    ],
    "malaysian cuisine": [
        "What is traditional Malaysian cuisine?",
        "How is Malaysian food different from Thai food?",
        "What are the staple ingredients in Malaysian cooking?",
        "Why is Malaysian food so flavourful?",
        "What is a typical Malaysian breakfast?",
        "What is the national dish of Malaysia?",
        "How spicy is Malaysian food?",
        "What desserts are popular in Malaysia?",
    ],
    "food culture malaysia": [
        "What is the food culture like in Malaysia?",
        "Why do Malaysians eat with their hands?",
        "What is a typical Malaysian meal like?",
        "Do Malaysians eat pork?",
        "What time do Malaysians eat dinner?",
        "What is the dining etiquette in Malaysia?",
        "Why is food so important in Malaysian culture?",
        "What is a Malaysian food court called?",
    ],
    "night market malaysia": [
        "What nights are night markets in Kuala Lumpur?",
        "What can I eat at a Malaysian night market?",
        "Are night markets in Malaysia worth visiting?",
        "What time does the night market open in KL?",
        "Which is the best night market in Kuala Lumpur?",
        "Are night markets in Malaysia halal?",
        "How do I bargain at a Malaysian night market?",
        "What is the biggest night market in Malaysia?",
    ],
    "local food kuala lumpur": [
        "What food is Kuala Lumpur known for?",
        "Where do locals eat in Kuala Lumpur?",
        "What local dishes should I try in Kuala Lumpur?",
        "Is it expensive to eat local food in KL?",
        "What food is Chinatown KL known for?",
        "What breakfast should I eat in Kuala Lumpur?",
    ],
    "penang food": [
        "What food is Penang famous for?",
        "Where can I find the best char kway teow in Penang?",
        "Is Penang food halal?",
        "What is the best Penang street food?",
        "Where is Penang's best hawker centre?",
        "What should I eat in Georgetown Penang?",
        "What dessert is Penang known for?",
    ],
    "malaysia food tour": [
        "How much does a food tour cost in Malaysia?",
        "What is included in a Malaysian food tour?",
        "Are food tours in Kuala Lumpur worth it?",
        "Which Malaysian city has the best food tour?",
        "How long is a typical food tour in Malaysia?",
        "Do food tours in Malaysia cater to dietary restrictions?",
        "What are the best food tours in Penang?",
        "Are Malaysian food tours halal-friendly?",
    ],
}


def slugify(text):
    """Convert any text to a URL-safe slug."""
    text = text.lower().strip().rstrip("?").replace("'", "")
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")[:80]


def sanitise_brand_voice(text):
    """Clean text for Simply Enak brand voice: remove banned words/patterns."""
    text = text.replace("\u2014", " - ")  # em-dash
    text = re.sub(r"\bauthentic\b", "real", text, flags=re.IGNORECASE)
    text = re.sub(r"\bamazing\b", "wonderful", text, flags=re.IGNORECASE)
    text = re.sub(r"\bincredible\b", "great", text, flags=re.IGNORECASE)
    text = re.sub(r"\bunforgettable\b", "memorable", text, flags=re.IGNORECASE)
    text = re.sub(r"\bvibrant\b", "lively", text, flags=re.IGNORECASE)
    text = re.sub(r"\bbustling\b", "busy", text, flags=re.IGNORECASE)
    text = re.sub(r"\btruly\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\bvery\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\breally\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\bmust-try\b", "worth trying", text, flags=re.IGNORECASE)
    text = re.sub(r"\bmust-visit\b", "worth visiting", text, flags=re.IGNORECASE)
    text = re.sub(r"\bhidden gems?\b", "local favourites", text, flags=re.IGNORECASE)
    text = re.sub(r"\bdive into\b", "explore", text, flags=re.IGNORECASE)
    text = re.sub(r"\bembark on\b", "start", text, flags=re.IGNORECASE)
    text = re.sub(r"\bleading\b", "well-known", text, flags=re.IGNORECASE)
    text = re.sub(r"\bpremier\b", "top-rated", text, flags=re.IGNORECASE)
    text = re.sub(r"\bworld-class\b", "excellent", text, flags=re.IGNORECASE)
    text = re.sub(r"  +", " ", text).strip()
    return text


# ════════════════════════════════════════════
# ANSWER GENERATION
# ════════════════════════════════════════════
# Topic-specific answers (curated, brand-voice checked)
TOPIC_ANSWERS = {
    "street food malaysia": {
        "What is the most popular street food in Malaysia?": (
            "Nasi lemak is widely considered Malaysia's most popular street food. "
            "This fragrant coconut rice dish comes with sambal, anchovies, peanuts, "
            "and a hard-boiled egg, wrapped in banana leaf. You can find it at "
            "nearly every street corner in Kuala Lumpur and Penang from early morning "
            "until late evening. Each stall puts its own spin on the sambal. "
            "Our food tours always include a nasi lemak stop so you can taste "
            "why Malaysians call it their national dish."
        ),
        "Where can I find the best street food in Kuala Lumpur?": (
            "Jalan Alor is the most famous street food street in Kuala Lumpur, "
            "packed with outdoor stalls and busy until midnight. But locals know "
            "the best food is often found in food courts and hawker centres like "
            "SS2 in Petaling Jaya, the Bangsar Night Market on Wednesdays, and "
            "the food court at Lot 10 on Bukit Bintang. Chinatown's Petaling Street "
            "also has great options. The trick is to go where the queues are."
        ),
        "Is Malaysian street food safe to eat?": (
            "Yes, Malaysian street food is generally very safe to eat. Hawker "
            "centres and food courts are regulated by local health authorities, "
            "and popular stalls maintain high standards because their reputation "
            "depends on it. The key is eating at busy stalls with high turnover. "
            "If you have a sensitive stomach, start with cooked food prepared "
            "fresh in front of you. A Simply Enak guide can recommend the safest "
            "and cleanest options at every stop."
        ),
    },
    "durian malaysia": {
        "When is durian season in Malaysia?": (
            "Durian season in Malaysia typically runs from June to August, "
            "with a secondary season from December to January. The peak months "
            "are July and August when the best quality durians are harvested. "
            "During these months, you will find durian stalls and dedicated "
            "durian restaurants across Kuala Lumpur, Penang, and Johor. "
            "Prices are lowest during peak season. Our durian tours are "
            "scheduled around the peak season to give you the best experience."
        ),
        "Where can I eat durian in Kuala Lumpur?": (
            "Kuala Lumpur has several excellent places to eat durian. The SS2 "
            "area in Petaling Jaya is famous for its durian stalls, especially "
            "along the main road where vendors set up shop during the season. "
            "There is also Durian Man in Cheras and Jin Xian Hong in Pudu for "
            "a sit-down durian experience. Many of these places let you choose "
            "your fruit and open it right in front of you. A Simply Enak durian "
            "tour takes you to the best stalls."
        ),
        "How do I choose a good durian in Malaysia?": (
            "Choosing a good durian takes practice. Look for a fruit that feels "
            "heavy for its size. Give it a gentle shake; if you hear the seeds "
            "rattle, the fruit is overripe. The stem should be fresh and green, "
            "not dry or brown. Press the spikes, they should give slightly. "
            "Different varieties have different characteristics. Musang King is "
            "prized for its creamy texture and bright yellow flesh. On a Simply "
            "Enak tour, our guides show you exactly what to look for."
        ),
    },
    "halal food malaysia": {
        "Is all food in Malaysia halal?": (
            "Not all food in Malaysia is halal, but the majority is. Malaysia "
            "has a strong halal certification system through JAKIM, and most "
            "restaurants and food stalls display their halal status clearly. "
            "Chinese restaurants and stalls are generally not halal-certified, "
            "while Malay and Indian Muslim establishments are. If you are unsure, "
            "look for the halal certification logo or simply ask the vendor. "
            "On our food tours, every stop is halal-friendly."
        ),
        "How do I know if a restaurant is halal in Malaysia?": (
            "Halal-certified restaurants in Malaysia display a green JAKIM "
            "halal logo on their signage or near the entrance. You can also "
            "look for the words 'Makanan Halal' or 'Halal' on the menu. "
            "Malay restaurants are almost always halal, as are Indian Muslim "
            "stalls. Chinese restaurants that serve halal food advertise it "
            "prominently. Our Simply Enak food tours only visit halal-friendly "
            "stops, so there is never any guesswork."
        ),
    },
    "penang food": {
        "What food is Penang famous for?": (
            "Penang is most famous for char kway teow, flat rice noodles "
            "stir-fried over high heat with prawns, cockles, bean sprouts, "
            "and egg, all seasoned with dark soy sauce and chilli. But the "
            "list goes on: Penang laksa, Hokkien mee, cendol, and roti canai "
            "are all Penang icons. Georgetown was named one of the world's "
            "top food cities. The best way to try everything is on a guided "
            "food walk through the streets of Georgetown."
        ),
        "Where can I find the best char kway teow in Penang?": (
            "Sisters Char Kway Teow at Macalister Lane is widely considered "
            "the gold standard. Lorong Selamat's char kway teow stall is "
            "another favourite that has been operating for decades. For "
            "something less crowded, the stall at Chulia Street Night Market "
            "serves a solid version. Every Penang local has their own favourite. "
            "The secret is the wok hei, that smoky flavour from cooking over "
            "intense heat in a well-seasoned wok."
        ),
    },
}


# Generic answer templates
GENERAL_TEMPLATES = [
    {
        "patterns": [r"^[Ww]hat (is|are|was|were) "],
        "answer": lambda q: (
            f"If you are wondering what {q.lower().rstrip('?')} is, you are not alone. "
            f"Visitors ask this all the time. In Malaysia, the answer depends on "
            f"where you go. In Kuala Lumpur, you will find it around Jalan Alor or "
            f"Petaling Street, where vendors sell versions of this for RM 5-10. "
            f"In Penang, the hawker stalls around George Town offer their own take. "
            f"A practical tip: go during peak hours when turnover is highest, "
            f"and ask the stall owner what they recommend."
        )
    },
    {
        "patterns": [r"^[Ww]here (can I|do I|to) "],
        "answer": lambda q: (
            f"The best places depend on which city you are in. "
            f"In Kuala Lumpur, try Jalan Alor in Bukit Bintang for evening street food "
            f"or Petaling Street in Chinatown for hawker stalls during the day. "
            f"In Penang, head to Chulia Street Night Market or Gurney Drive Hawker Centre. "
            f"A local tip: stalls with queues are usually worth the wait. "
            f"If you only have time for one area, Jalan Alor gives you the widest "
            f"variety of Malay, Chinese, and Indian dishes in one stretch."
        )
    },
    {
        "patterns": [r"^[Hh]ow (much|do|does|can|to) "],
        "answer": lambda q: (
            f"This depends on what you order and where. "
            f"A plate of nasi lemak at a KL hawker centre costs RM 3-5, while "
            f"char kway teow in Penang runs RM 6-8. Satay is RM 1.50 per stick. "
            f"Most street food dishes fall between RM 3 and RM 15. "
            f"Pro tip: bring small bills because cash is preferred at most stalls. "
            f"If you are on a guided food tour, tastings are usually included "
            f"in the price, which ranges from RM 150-450 per person."
        )
    },
    {
        "patterns": [r"^[Ii]s |^[Aa]re "],
        "answer": lambda q: (
            f"The short answer is yes, with some caveats. "
            f"Malaysia's food scene is generally safe for visitors. "
            f"Popular spots like Jalan Alor in KL and Gurney Drive in Penang "
            f"have high turnover, meaning ingredients are fresh. "
            f"A simple rule: eat where you see locals eating. "
            f"If a stall has a queue at lunchtime, the food is both good and safe. "
            f"For specific concerns like spice level or ingredients, just ask — "
            f"most stall operators are happy to explain what is in each dish."
        )
    },
    {
        "patterns": [r"^[Ww]hich "],
        "answer": lambda q: (
            f"The answer depends on what you are after. "
            f"For variety, Kuala Lumpur's Jalan Alor food street has grilled seafood, "
            f"Hokkien mee, and satay all within 200 metres. "
            f"For the best char kway teow, Penang's Sisters stall on Macalister Lane "
            f"is a solid choice — they have been serving it for decades. "
            f"Pricing tip: hawker food costs RM 3-10 per dish, so order a few "
            f"different things and share with your group."
        )
    },
    {
        "patterns": [r"^[Ww]hen "],
        "answer": lambda q: (
            f"Timing varies by what you want to eat. "
            f"Breakfast stalls at KL's Chow Kit Market start at 6am and close by noon. "
            f"Lunch hawker centres like SS2 in Petaling Jaya are busiest 11am-2pm. "
            f"Evening food streets like Jalan Alor fire up around 5pm and run to midnight. "
            f"For durian, peak season is June to August. "
            f"The practical approach: plan your eating around the time of day — "
            f"morning for market food, evening for street food."
        )
    },
    {
        "patterns": [r"difference", r"or\?$"],
        "answer": lambda q: (
            f"The differences come down to regional styles and local ingredients. "
            f"Penang's char kway teow uses fresh cockles and has a strong wok hei "
            f"(smoky flavour), while the KL version leans sweeter with more dark soy sauce. "
            f"Northern Malaysian food near Penang is spicier with Thai influences; "
            f"southern styles around KL use more coconut milk. "
            f"Chinese Malaysian stalls use soy-based seasonings, while Indian Malaysian "
            f"food features cardamom, curry leaves, and lentils."
        )
    },
    {
        "patterns": [r"^[Cc]an I "],
        "answer": lambda q: (
            f"Generally yes. Malaysia's food scene is used to visitors. "
            f"Most hawker stalls in KL and Penang can adjust spice levels on request. "
            f"Vegetarian options are available — Brickfields in KL has banana leaf rice "
            f"with unlimited vegetables for RM 8-15. "
            f"For dietary needs like gluten-free, look for rice-based dishes "
            f"like nasi lemak or grilled items. "
            f"Simply Enak's guides handle all communication with stall owners, "
            f"so just tell them your requirements when booking."
        )
    },
]


def generate_answer(question, topic=None):
    """Generate a brand-voice-clean ~120-word answer for a PAA question."""
    q_lower = question.strip().lower().rstrip("?").strip()
    # 1. Check topic-specific bank
    if topic and topic.lower() in TOPIC_ANSWERS:
        for bank_q, answer in TOPIC_ANSWERS[topic.lower()].items():
            bq = bank_q.lower().strip().rstrip("?").strip()[:40]
            if q_lower[:40] == bq:
                return sanitise_brand_voice(answer)
    # 2. Match by pattern
    for tpl in GENERAL_TEMPLATES:
        for pat in tpl["patterns"]:
            if re.search(pat, question):
                raw = tpl["answer"](question)
                return sanitise_brand_voice(raw)
    # 3. Fallback
    fallback = (
        f"This is a common question from visitors to Malaysia. "
        f"The food scene in Kuala Lumpur and Penang offers something for "
        f"every preference and budget. The best approach is to try a few "
        f"different options and see what you like. Simply Enak's food tours "
        f"are designed to give you a broad introduction so you can discover "
        f"your favourites with guidance from a local expert."
    )
    if topic:
        fallback = (
            f"Visitors to Malaysia often want to know more about {topic}. "
            f"The short answer is that Malaysia's food scene is diverse, "
            f"and there is something for every taste. The best approach is "
            f"to try a few different options with a local guide who knows "
            f"the ins and outs of the food scene. Simply Enak's tours in "
            f"Kuala Lumpur and Penang cover the best this topic has to offer."
        )
    return sanitise_brand_voice(fallback)


# ════════════════════════════════════════════
# GSC FUNCTIONS
# ════════════════════════════════════════════

def gsc_get_token():
    """Get GSC auth token from service account."""
    if not os.path.exists(GSC_CREDENTIALS):
        return None
    try:
        from google.oauth2 import service_account
        from google.auth.transport.requests import Request
        creds = service_account.Credentials.from_service_account_file(
            GSC_CREDENTIALS, scopes=[GSC_SCOPE])
        creds.refresh(Request())
        return creds.token
    except Exception as e:
        print(f"  GSC auth error: {e}", file=sys.stderr)
        return None


def gsc_get_question_queries(days=28, limit=30):
    """Get question-like queries from GSC search analytics."""
    token = gsc_get_token()
    if not token:
        print("  GSC credentials not found or auth failed.", file=sys.stderr)
        return []
    encoded = urllib.parse.quote(GSC_SITE, safe="")
    url = f"https://www.googleapis.com/webmasters/v3/sites/{encoded}/searchAnalytics/query"
    from datetime import timedelta
    end = datetime.now().strftime("%Y-%m-%d")
    start = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
    body = json.dumps({
        "startDate": start, "endDate": end,
        "dimensions": ["query"], "rowLimit": 25000, "dataState": "all"
    }).encode()
    req = urllib.request.Request(url, data=body)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=30).read())
        rows = resp.get("rows", [])
    except Exception as e:
        print(f"  GSC query error: {e}", file=sys.stderr)
        return []
    # Filter for question-like queries
    wh_words = r"^(what|where|how|why|when|which|can|does|do|is|are|will)"
    questions = []
    for row in rows:
        query = row.get("keys", [""])[0]
        if re.match(wh_words, query.strip(), re.IGNORECASE):
            questions.append({
                "query": query,
                "impressions": row.get("impressions", 0),
                "clicks": row.get("clicks", 0),
                "position": round(row.get("position", 0), 1),
            })
    questions.sort(key=lambda x: x["impressions"], reverse=True)
    return questions[:limit]


def gsc_striking_distance_topics():
    """Find striking distance keywords and map to topics."""
    token = gsc_get_token()
    if not token:
        return []
    encoded = urllib.parse.quote(GSC_SITE, safe="")
    url = f"https://www.googleapis.com/webmasters/v3/sites/{encoded}/searchAnalytics/query"
    from datetime import timedelta
    end = datetime.now().strftime("%Y-%m-%d")
    start = (datetime.now() - timedelta(days=28)).strftime("%Y-%m-%d")
    body = json.dumps({
        "startDate": start, "endDate": end,
        "dimensions": ["query"], "rowLimit": 25000, "dataState": "all"
    }).encode()
    req = urllib.request.Request(url, data=body)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=30).read())
        rows = resp.get("rows", [])
    except Exception as e:
        print(f"  GSC query error: {e}", file=sys.stderr)
        return []
    # Map queries to known topics
    topic_scores = {t: 0 for t in KNOWN_TOPICS}
    for row in rows:
        q = row.get("keys", [""])[0].lower()
        pos = row.get("position", 100)
        imp = row.get("impressions", 0)
        # Score based on keyword match + striking distance (pos 5-20)
        if 5 <= pos <= 25:
            for topic in KNOWN_TOPICS:
                words = topic.split()
                if any(w in q for w in words):
                    topic_scores[topic] += imp
    scored = [(t, s) for t, s in topic_scores.items() if s > 0]
    scored.sort(key=lambda x: x[1], reverse=True)
    return [t for t, s in scored]


# ════════════════════════════════════════════
# PAYLOAD API FUNCTIONS
# ════════════════════════════════════════════

_payload_token = None


def payload_login():
    global _payload_token
    if _payload_token:
        return _payload_token
    data = json.dumps({"email": PAYLOAD_EMAIL, "password": PAYLOAD_PASSWORD}).encode()
    req = urllib.request.Request(
        f"{PAYLOAD_URL}/api/users/login", data=data,
        headers={"Content-Type": "application/json"})
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
        _payload_token = resp.get("token", "")
        return _payload_token
    except Exception as e:
        print(f"  Payload login error: {e}", file=sys.stderr)
        return None


# ── Strategic tour targets (from .hermes/plans/tour-strategy.md) ──
# The CTA at the end of every PAA story should steer toward a strategic tour.
STRATEGIC_TOURS = {
    "private-tours": {
        "url": "/tours/private-tours/",
        "title": "Private Multi-Day Food Tours",
        "anchor": "private multi-day food tour in Malaysia",
        "pillar": 2,
        "description": "Multi-day group experiences and packages",
    },
    "tailored-tours": {
        "url": "/tours/tailored-tours/",
        "title": "Tailored Food Experiences",
        "anchor": "custom food tour experience",
        "pillar": 2,
        "description": "Bespoke multi-day itineraries with sustainability & social impact",
    },
    "corporate-groups": {
        "url": "/tours/corporate-groups/",
        "title": "Corporate Food Experiences",
        "anchor": "corporate food experience in Kuala Lumpur",
        "pillar": 3,
        "description": "B2B teambuilding, client entertainment, incentive trips",
    },
    "ultimate-malaysia-food-experience": {
        "url": "/tours/packages/ultimate-malaysia-food-experience/",
        "title": "Ultimate Malaysia Food Experience",
        "anchor": "3-day KL and Penang food tour package",
        "pillar": 2,
        "description": "KL + Penang combo, 3-day multi-day package, from RM2,500",
    },
    "kuala-lumpur-food-experience": {
        "url": "/tours/packages/kuala-lumpur-food-experience/",
        "title": "Kuala Lumpur Food Experience",
        "anchor": "4-day Kuala Lumpur food tour package",
        "pillar": 2,
        "description": "KL deep dive, 4-day multi-day package, from RM3,500",
    },
    "penang-food-experience": {
        "url": "/tours/packages/penang-food-experience/",
        "title": "Penang Food Experience",
        "anchor": "4-day Penang food tour package",
        "pillar": 2,
        "description": "Penang deep dive, 4-day multi-day package, from RM3,000",
    },
}

def get_strategic_cta(topic=None):
    """Pick the right CTA based on topic. Returns (anchor_text, url).

    - penang-specific topics → penang-food-experience
    - kuala lumpur-specific topics → kuala-lumpur-food-experience
    - corporate/business → corporate-groups
    - sustainability → tailored-tours
    - everything else → ultimate-malaysia-food-experience (flagship combo)
    """
    if topic:
        t = topic.lower()
        if any(w in t for w in ["corporate", "business", "b2b", "team"]):
            tgt = STRATEGIC_TOURS["corporate-groups"]
            return (f"Book your {tgt['anchor']}", tgt["url"])
        if any(w in t for w in ["sustainable", "social", "eco", "community", "impact"]):
            tgt = STRATEGIC_TOURS["tailored-tours"]
            return (f"Book a {tgt['anchor']}", tgt["url"])
        if any(w in t for w in ["penang", "george town"]):
            tgt = STRATEGIC_TOURS["penang-food-experience"]
            return (f"Explore our {tgt['anchor']}", tgt["url"])
        if any(w in t for w in ["kuala lumpur", "kl", "chow kit", "brickfields", "kampung baru"]):
            tgt = STRATEGIC_TOURS["kuala-lumpur-food-experience"]
            return (f"Explore our {tgt['anchor']}", tgt["url"])
    # Default to the flagship combo
    tgt = STRATEGIC_TOURS["ultimate-malaysia-food-experience"]
    return (f"Explore our {tgt['anchor']}", tgt["url"])


def create_payload_story(slug, title, answer_text, topic=None):
    """Create a Payload Story from a Q&A pair."""
    token = payload_login()
    if not token:
        return None
    excerpt = f"FAQ: {title}"
    content_md = (
        f"## {title}\n\n"
        f"{answer_text}\n\n"
        f"---\n\n"
        f"*Planning a trip to Malaysia? Simply Enak's food tours in Kuala Lumpur "
        f"and Penang take you straight to the best {topic} spots. "
        f"Book your tour today.*\n"
    )
    # Simple rich text for Payload
    minimal_rich = {
        "root": {
            "type": "root", "format": "", "indent": 0, "version": 1,
            "children": [{
                "type": "paragraph",
                "children": [{"type": "text", "text": excerpt}]
            }],
            "direction": "ltr"
        }
    }
    # Auto-derive meta fields so every story has SEO title + description.
    # Without these, stories rank with empty <title> and no SERP snippet.
    meta_title = title[:60] if len(title) > 60 else title
    meta_description = answer_text[:160] if len(answer_text) > 160 else answer_text

    data = json.dumps({
        "title": title,
        "slug": slug,
        "excerpt": excerpt,
        "meta": {
            "title": meta_title,
            "description": meta_description,
        },
        "content": minimal_rich,
        "content_markdown": content_md,
        "author": 1,
        "_status": "published",
        "status": "published",
        "workflowStatus": "published",
        "publishedDate": datetime.now().isoformat(),
    }).encode()
    req = urllib.request.Request(
        f"{PAYLOAD_URL}/api/stories?depth=0", data=data, method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        })
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=30).read())
        story_id = resp.get("id", resp.get("message", "?"))
        is_new = "successfully" in resp.get("message", "").lower() or resp.get("id")
        if is_new:
            print(f"    Created story slug={slug}")
        else:
            print(f"    Story exists or response received slug={slug}")
        return {"id": story_id, "is_new": is_new, "resp": resp}
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        if "unique" in body.lower() and "slug" in body.lower():
            print(f"    Story already exists: {slug}")
            return {"status": "exists"}
        print(f"    Payload error HTTP {e.code}: {body[:200]}", file=sys.stderr)
        return None


# ════════════════════════════════════════════
# ALSOASK SCRAPER
# ════════════════════════════════════════════

def alsoask_get_questions(topic, limit=10):
    """Scrape PAA questions from alsoask.com using the free API."""
    import urllib.parse
    encoded = urllib.parse.quote(topic)
    url = f"https://alsoask.com/api/auto?q={encoded}&lang=en&limit={limit}"
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (compatible; SimplyEnakBot/1.0)",
            "Accept": "application/json",
        })
        resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
        questions = []
        if isinstance(resp, list):
            for item in resp:
                q = item.get("question", item.get("query", ""))
                if q:
                    questions.append(q)
        elif isinstance(resp, dict):
            for key in ("questions", "data", "results"):
                items = resp.get(key, [])
                if isinstance(items, list):
                    for item in items:
                        q = item.get("question", item.get("query", item if isinstance(item, str) else ""))
                        if q:
                            questions.append(q)
        return questions[:limit]
    except Exception as e:
        print(f"  Alsoask.com scrape error: {e}", file=sys.stderr)
        return []


# ════════════════════════════════════════════
# MAIN PROCESSING
# ════════════════════════════════════════════

def parse_args():
    p = argparse.ArgumentParser(description="PAA Content Factory for Simply Enak")
    p.add_argument("--topic", "-t", help="Topic or niche (e.g. 'street food malaysia')")
    p.add_argument("--niche", help="Alias for --topic", dest="topic")
    p.add_argument("--limit", "-l", type=int, default=5, help="Max questions to process (default: 5)")
    p.add_argument("--dry-run", "-n", action="store_true", help="Show what would be created without hitting Payload")
    p.add_argument("--gsc", action="store_true", help="Also fetch PAA from GSC question queries")
    p.add_argument("--alsoask", action="store_true", help="Also fetch PAA from alsoask.com")
    p.add_argument("--days", type=int, default=28, help="GSC lookback days (default: 28)")
    return p.parse_args()


def get_questions_for_topic(topic, limit, use_gsc=False, use_alsoask=False, days=28):
    """Get PAA questions for a topic from all available sources."""
    questions = []
    topic_key = topic.lower().strip()

    # 1. Curated bank
    if topic_key in PAA_BANK:
        for q in PAA_BANK[topic_key]:
            questions.append({"source": "bank", "question": q})
        print(f"  Curated bank: {len(PAA_BANK[topic_key])} questions found")

    # 2. Alsoask.com (free PAA scraper)
    if use_alsoask:
        also_qs = alsoask_get_questions(topic, limit=limit * 2)
        for q in also_qs:
            # Deduplicate against bank
            q_norm = q.lower().strip().rstrip("?").strip()
            seen = {x["question"].lower().strip().rstrip("?").strip() for x in questions}
            if q_norm not in seen:
                questions.append({"source": "alsoask", "question": q})
        if also_qs:
            print(f"  Alsoask.com: {len(also_qs)} questions found")
        else:
            print("  Alsoask.com: no questions returned or service unreachable")

    # 3. GSC question queries
    if use_gsc:
        gsc_qs = gsc_get_question_queries(days=days, limit=limit * 3)
        gsc_filtered = [q for q in gsc_qs if any(
            w in q["query"].lower() for w in topic_key.split()
        )]
        for q in gsc_filtered:
            q_norm = q["query"].lower().strip().rstrip("?").strip()
            seen = {x["question"].lower().strip().rstrip("?").strip() for x in questions}
            if q_norm not in seen:
                questions.append({"source": "gsc", "question": q["query"]})
        if gsc_filtered:
            print(f"  GSC question queries: {len(gsc_filtered)} found")

    # Remove any empty questions, deduplicate final
    seen = set()
    unique = []
    for item in questions:
        q = item["question"].strip()
        q_key = q.lower().rstrip("?").strip()
        if q and q_key not in seen:
            seen.add(q_key)
            unique.append(item)
    return unique[:limit]


def process_questions(questions, topic, dry_run=False):
    """Generate answers and create Payload Stories for each question."""
    results = []
    for i, item in enumerate(questions):
        q = item["question"]
        source = item["source"]
        slug = f"faq-{slugify(q)}"[:80]
        # Truncate slug to 80 chars max
        slug = slug[:80].rstrip("-")
        title = q.rstrip("?").strip()

        print(f"\n  [{i+1}/{len(questions)}] ({source}) {title}")
        print(f"         slug: {slug}")

        # Generate answer
        answer = generate_answer(q, topic)
        print(f"         answer ({len(answer.split())} words): {answer[:120]}...")

        if dry_run:
            results.append({
                "slug": slug,
                "title": title,
                "answer": answer,
                "url": f"/stories/faq/{slug}/",
                "source": source,
                "action": "DRY RUN (would create)"
            })
        else:
            result = create_payload_story(slug, title, answer, topic)
            if result:
                is_new = result.get("is_new", False) or result.get("id")
                results.append({
                    "slug": slug,
                    "title": title,
                    "url": f"/stories/faq/{slug}/",
                    "source": source,
                    "action": "CREATED" if is_new else "EXISTS"
                })
            else:
                results.append({
                    "slug": slug,
                    "title": title,
                    "source": source,
                    "action": "FAILED"
                })
    return results


def main():
    args = parse_args()
    topic = args.topic
    limit = args.limit
    dry_run = args.dry_run

    print("=" * 60)
    print("  PAA CONTENT FACTORY")
    print("=" * 60)

    # Determine topic(s)
    if topic:
        topics = [topic]
        print(f"\nTarget topic: {topic}")
    else:
        # Auto-detect from GSC striking distance
        print("\nNo topic specified. Auto-detecting from GSC striking distance data...")
        topics = gsc_striking_distance_topics()
        if not topics:
            print("  GSC auto-detect returned nothing. Falling back to known topics.")
            topics = KNOWN_TOPICS[:3]  # Top 3
        print(f"  Detected topics: {topics[:3]}")

    all_results = []
    for topic in topics[:3]:  # Max 3 topics per run
        print(f"\n{'─' * 50}")
        print(f"TOPIC: {topic}")
        print(f"{'─' * 50}")

        questions = get_questions_for_topic(
            topic, limit,
            use_gsc=args.gsc,
            use_alsoask=args.alsoask,
            days=args.days
        )

        if not questions:
            print("  No PAA questions found for this topic.")
            continue

        print(f"\n  Processing {len(questions)} questions...")
        results = process_questions(questions, topic, dry_run=dry_run)
        all_results.extend(results)

    # Summary
    print(f"\n{'=' * 60}")
    print("  SUMMARY")
    print(f"{'=' * 60}")
    if dry_run:
        print(f"  DRY RUN — no Payload stories were created.")
    print(f"  Total Q&A pairs processed: {len(all_results)}")
    created = [r for r in all_results if r.get("action") == "CREATED"]
    existed = [r for r in all_results if r.get("action") == "EXISTS"]
    failed = [r for r in all_results if r.get("action") == "FAILED"]
    dry_run_items = [r for r in all_results if r.get("action") == "DRY RUN (would create)"]

    if dry_run_items:
        print(f"\n  Would create {len(dry_run_items)} stories:")
        for r in dry_run_items:
            print(f"    - {r['title']}")
            print(f"      URL: {r['url']}")
    if created:
        print(f"  Created: {len(created)}")
        for r in created:
            print(f"    + {r['title']}")
    if existed:
        print(f"  Already existed: {len(existed)}")
    if failed:
        print(f"  Failed: {len(failed)}")

    # JSON output for cron/programmatic use
    print(f"\n=== JSON_SUMMARY ===")
    print(json.dumps(all_results, indent=2))


if __name__ == "__main__":
    main()

