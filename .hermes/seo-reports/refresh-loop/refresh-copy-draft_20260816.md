# Refresh Copy — Top 3 Declining Pages (Aug 16, 2026)

Drafted from: refresh-loop brief 2026-07-19 → 08-15 + live GSC top queries (90d)
+ current Payload content. Brand voice enforced: no banned words, no em-dashes
in prose, "Simply Enak" never "Enak" alone.

---

## 1. stories/gluten-free-guide-penang (score 105)

Current: imp 66→32, pos 4.8→7.2, clicks 3→1
Top queries (90d): "is kuey teow gluten free" pos 2.9, "is kway teow gluten
free" pos 1.0, "is thosai gluten free" pos 9.5. The page still ranks #1-3 for
question queries but the volume is tiny and CTR collapsed. Fix: answer the
head question IN the title/description and refresh the intro.

- meta_title (old): Gluten-Free Food Guide to Penang — Simply Enak
- meta_title (new): Is Kuey Teow Gluten Free? A Penang Gluten-Free Food Guide
  (front-loads the #1-ranked query, keeps the guide promise, 58 chars)

- meta_description (old): "Gluten-Free Guide to Penang Penang's food reputation
  is built on noodles. Char kway teow, Hokkien mee, wan tan mee, laksa."
  (defect: H1 text duplicated inside the description)
- meta_description (new): "Kuey teow, laksa, nasi kandar and thosai: which
  Penang dishes are naturally gluten free, which sauces hide wheat, and where
  to eat safely. A local guide." (146 chars)

- Body refresh: tighten paragraph 1 to answer "is kuey teow gluten free" in
  the first 2 sentences (the answer is yes, the noodles are rice flour — the
  sauce is the problem). Info-gain point to add to the intro: "Char kway teow
  is made with flat rice noodles; the gluten hides in the soy and oyster
  sauce, so ask for 'no dark soy'." (Not present in current top-3 SER answers.)

## 2. vegan-guide-penang (score 75)

Current: imp 53→31, pos 9.0→9.2, clicks 3→1
Top queries (90d): "penang vegan", "penang vegetarian", "vegan penang" (all
1 imp, pos 11-12 — striking distance, zero clicks). Title already matches
"vegan penang"; the description is the leak.

- meta_title: keep "Vegan Penang: Where Locals Actually Eat — Simply Enak"
  (already front-loads the query; no change needed)

- meta_description (old): "The Vegan's Guide to Penang Penang is famous for
  its street food. But when you are vegan, the famous dishes are mostly off
  limits." (defect: H1 text duplicated)
- meta_description (new): "Penang's 素食 (sù shí) stalls are vegan by design.
  Where to eat: Lebuh Kimberley, Pulau Tikus market, Kek Lok Si canteen. With
  prices from RM 4.50." (147 chars — answers directly, includes the specific
  places and prices that are the info gain)

- Body refresh: no paragraph rewrite needed — content is strong. Add one
  sentence to the intro: "Penang's vegan scene runs on 素食 (sù shí), the
  Buddhist vegetarian tradition that is vegan by design, not by accommodation."

## 3. food-guide-chow-kit (score 65) — DEAD HEAD QUERY, INTENT CHECK

Current: imp 558→92, pos 5.5→6.1, clicks 11→6
Top queries: head query died ("chow kit food" 54→1 imp, "chow kit market"
23→1 imp over 90d). Remaining intent: "chow kit market opening hours" (13
imp), "chow kit market kuala lumpur" (5 imp), "chow kit food court" (5 imp).
The page already covers opening hours in "When to Go" but the meta does not
surface it. SERP intent check: refresh title/description toward the hours +
location intent that still has demand.

- meta_title (old): Chow Kit Market Food Guide — Simply Enak
- meta_title (new): Chow Kit Market Kuala Lumpur: What to Eat, What to Buy &
  Opening Hours (58 chars — targets the surviving location + hours queries)

- meta_description (old): "Chow Kit Market Food Guide Chow Kit is the opposite
  of a tourist market. It has no gift shops, no air conditioning, and no
  English signage." (defect: H1 duplicated)
- meta_description (new): "Chow Kit is KL's working wet market, open 6 AM to
  2 PM. What to eat (nasi lemak, nasi kerabu, lontong), what to buy, and how
  to get there from the monorail." (146 chars — surfaces hours + food + how
  to get there, all covered in the body)

- Body refresh: no new section needed (When to Go covers hours). Add to the
  intro: "The market is a 5-minute walk from Chow Kit monorail station and
  most stalls close by 2 PM, so come in the morning." (surfaces the two
  practical facts the surviving queries ask about)

---

## Deploy checklist
1. Update meta_title + meta_description in Payload (stories collection)
2. PATCH touches updatedAt → visible "Updated" date + dateModified schema
3. Body intros: 1-sentence additions per page (optional, second pass)
4. Reindex: python3 scripts/seo-automation/refresh-loop.py --reindex
