# Tour Content Enrichment Plan

## Overview

The BoFU artifact prompts are structured content — sensory descriptions, targeted FAQs, testimonials, specific dishes. Instead of publishing these as separate pages, we integrate them into the existing tour pages to strengthen conversion and SEO.

The tour page template already supports:
- ✅ FAQ section (section exists, but 0/8 tours have FAQ data in Payload)
- ✅ Review import (shows 6 reviews filtered by location)
- ✅ Itinerary with descriptions
- ✅ Structured data (TouristTrip + Product schema)
- ❌ No "what you'll learn" / cultural context per stop
- ❌ Short descriptions are functional, not sensory

## Priority Actions

### A. Add Tour-Specific FAQs to Payload

**Biggest SEO impact.** The FAQ template exists, the FAQ schema is ready — zero data is supplied. Adding 4-6 FAQs per tour with question-format H3 headings and visible answers triggers FAQ rich results.

Each FAQ needs to be created in Payload (`faqs` collection) with:
- `question` + `answer`
- `page_visibility: ["kuala-lumpur-street-food"]` (matching tour slug)
- `_status: "published"`

### B. Enrich Short Descriptions with Sensory Language

Current short descriptions are functional ("The essential KL food tour for first-time visitors"). Adding sensory cues and keyword targets increases CTR from search.

### C. Add "What You'll Learn" to Full Descriptions

Each tour's full description should include a section on cultural context — what each dish reveals about Malaysia's history, migration patterns, and community traditions.

---

## Tour-by-Tour FAQ Content

### 1. Kuala Lumpur Street Food (slug: kuala-lumpur-street-food, RM 285)

**FAQs to add to Payload:**

Q: "What dishes will I taste on the KL Street Food tour?"
A: "You'll try 8-10 dishes across 5 stops, including yong tau foo (stuffed tofu and vegetables) from a stall that has been making it since 1978, KL's best curry laksa, char siu BBQ pork buns fresh from the steamer, chee cheong fun (rice noodle rolls), and a local dessert. Everything is family-recipe, not tourist portions."

Q: "How much walking is involved?"
A: "About 3.5 hours of gentle walking through Chinatown's covered alleys and heritage lanes. The pace is relaxed — we stop at each stall to eat, sit when available, and your guide plans the route with rest stops. Comfortable shoes recommended."

Q: "Can you accommodate dietary restrictions?"
A: "Yes — vegetarian, vegan, halal, and gluten-free are all covered at no extra charge. Simply tell us when booking. We plan the route around your needs and will substitute dishes at any stop. We do this for every tour, not as an exception."

Q: "Is this tour suitable for first-time visitors to KL?"
A: "This is the tour we recommend for first-timers. It covers KL's food story in the most walkable neighborhood — Chinatown and its surrounding heritage zone. You'll leave with a map of where to eat for the rest of your trip and a WhatsApp contact for questions."

**Description enrichment:**
- Current short: "The essential Kuala Lumpur food tour for first-time visitors. Walk through Chinatown back lanes, sample 15-18 dishes across heritage stalls, and leave with a map of where to eat for the rest of your trip."
- Suggested: "Walk through Chinatown's back lanes as your guide takes you to stalls that have been feeding the city for generations. Taste yong tau foo from a family that's been making it since 1978, watch BBQ pork buns come fresh from the steamer, and try KL's best curry laksa — a coconut-rich broth that defines Malaysian comfort food. 8-10 tastings, 5 stops, one neighborhood that tells KL's entire food story."

### 2. Flavours of Malaysia (slug: flavours-of-malaysia, RM 289)

**FAQs to add:**

Q: "What makes this tour different from the KL Street Food tour?"
A: "Flavours of Malaysia visits two neighborhoods instead of one — Chow Kit wet market (KL's oldest and largest) and Kampung Baru (a Malay village in the city center). The KL Street Food tour stays in Chinatown. This tour goes deeper into how Malaysia's different communities shop, cook, and eat."

Q: "Is the wet market visit suitable for everyone?"
A: "Yes. Chow Kit is a real working market — you'll see raw meat, live fish, and spice stalls. Some visitors find the fish section confronting, but your guide will warn you before each section and you can skip any area. The spice tasting (belacan, dried shrimp, star anise) is the highlight for most guests."

Q: "How many dishes will I try?"
A: "About 10 tastings across 6 stops. The quantities are generous — come hungry. Dishes include nasi lemak from a 40-year-old Kampung Baru stall, freshly fried pisang goreng, beef rendang slow-cooked overnight, and a selection of kuih (Malaysian traditional sweets)."

**Description enrichment:**
- Current short: "Brand new to Malaysia? This is everything you need to know! Perfect introduction to Malaysian culture."
- Suggested: "Start in KL's oldest wet market as the city wakes up — watch spice sellers weigh belacan, fishmongers haul the morning catch, and aunties hand-roll traditional biscuits. Then cross to Kampung Baru, a Malay village in the shadow of KLCC, for nasi lemak wrapped in banana leaf and rendang that simmered overnight. Two neighborhoods, three cultures, one morning that explains why Malaysia eats the way it does."

### 3. Inside Pudu (slug: inside-pudu, RM 289)

**FAQs to add:**

Q: "What is Pudu and why should I visit?"
A: "Pudu is KL's oldest Chinese neighborhood — the landing point for Cantonese and Hakka immigrants who built the city's food culture. It has been left almost untouched by tourism. Most visitors walk right past it. This tour takes you through streets that look the same as they did 50 years ago, past clan association temples and hawker stalls that have served the same families for generations."

Q: "What will I eat?"
A: "Dishes you won't find on tourist menus — Hakka specialties, claypot chicken rice from a stall that's been operating since the 1960s, handmade noodles from a family that still presses them by hand, and classic Cantonese roast meats from a shop where the owner starts preparing at 4 AM."

**Description enrichment:**
- Current short: "(none)"
- Suggested: "Walk through KL's most authentic Chinese neighborhood — a living museum of Cantonese and Hakka food culture that tourism forgot. Meet at the last gate of Pudu Jail (built 1891), then follow your guide through streets where the same families have been cooking the same recipes for generations. Taste handmade noodles, claypot chicken rice, and roast meats from stalls you'd never find on Google Maps."

### 4. Secrets of KL — Nightlife, Street Art & Cocktails (slug: secrets-of-kl-nightlife-street-art-and-cocktails, RM 359)

**FAQs to add:**

Q: "Is this a food tour or a bar crawl?"
A: "Both. You'll eat at a late-night spot that only locals know — not a tourist restaurant — and visit three bars: a hidden rooftop with skyline views, a speakeasy behind a fake shopfront, and a cocktail bar that reinterprets Malaysian flavors (think pandan gin, screwpine syrup, gula Melaka old fashioned). It's a night out, not just dinner."

Q: "Do I need to know about street art to enjoy this tour?"
A: "No. Your guide will point out the key murals and tell you about the artists, the stories behind each piece, and how KL's street art scene emerged from its creative underground. You'll see the city differently by the end."

### 5. Penang Street Food (slug: penang-street-food, RM 289)

**FAQs to add:**

Q: "Why is Penang called Malaysia's food capital?"
A: "Because of its history as a British trading port — Malay, Chinese, Indian, Peranakan, and Eurasian communities all settled here and their cuisines blended over 200 years. Dishes like Penang laksa (sour, spicy fish broth), char kway teow (flat noodles wok-fried with local prawns), and cendol (shaved ice with coconut milk and gula Melaka) were born here and you won't find the same versions anywhere else."

Q: "What dishes must I try in Penang?"
A: "On this tour: Penang Assam Laksa (a UNESCO-recognised dish), Char Kway Teow from a stall that's been wok-frying it for 40+ years, Hokkien Mee (prawn noodle soup), Nasi Kandar (rice with curries, a Penang Muslim Indian specialty), Cendol with gula Melaka, and O-Chien (oyster omelette). Most are dishes invented in Penang."

**Description enrichment:**
- Current short: "What makes Penang the 'food capital' of Malaysia? Simply Enak will guide you through the cultural fusion that created dishes you'll only find here."
- Suggested: "Penang earned its title as Malaysia's food capital through 200 years of cultural fusion — Malay, Chinese, Indian, Peranakan, and Eurasian. On this morning walk through George Town, you'll taste the dishes that prove it: Assam Laksa (a UNESCO-recognised sour fish broth), Char Kway Teow tossed over charcoal flame, Nasi Kandar from a Muslim Indian stall, and Cendol with melted gula Melaka. Your guide connects each dish to the community that created it."

### 6. Georgetown's Best Hawkers and the Durian Strip (slug: georgetown-night-food-durian, RM 289)

**FAQs to add:**

Q: "Does this tour include durian?"
A: "Yes — during durian season (typically June-September), the tour ends at the Jalan Macalister durian strip where you can try different varieties. Your guide will teach you how to pick a good one, how to open it properly, and which varieties are worth paying more for. Durian is optional — if you're not a fan, there are plenty of other desserts."

Q: "What is the best time of day for this tour?"
A: "Sunset. The heat fades, the hawkers start their charcoal fires, and the streets take on a completely different character. You'll see George Town as locals know it — the clan jetties lit up across the water, the pre-war shophouses catching the last light, the smells of dinner being cooked in the open air."

### 7. Vegetarian Tour (slug: kl-vegetarian-food-tour, RM 450)

**FAQs to add:**

Q: "Can you guarantee no hidden animal products?"
A: "Yes. Your guide knows exactly which stalls use oyster sauce, shrimp paste, or pork lard, and which substitutions work. We take you to Buddhist monastery canteens (strictly vegan), Indian banana leaf restaurants (vegetarian by default), and Chinese vegetarian stalls that specialize in meat-free mock meats. No surprises."

Q: "What if I'm vegan, not just vegetarian?"
A: "No problem. The Buddhist stops are already vegan. At Indian stops, we request no ghee. At Chinese stops, we skip egg-based dishes. Just tell us when booking and your guide plans the route accordingly."

### 8. Georgetown variant (slug: georgetown-night-food-durian - Copy)

Same FAQs and enrichment as #6.

---

## Implementation

These changes go into **Payload CMS** (canonical source):

1. **FAQs**: Create entries in the `faqs` collection with `page_visibility` set to each tour's page key. The template already supports this filtering.
2. **Short descriptions**: Update `shortDescription` in the `tours` collection via PATCH API.
3. **Full descriptions**: Add "What You'll Learn" section to `fullDescription`.

After Payload updates, run `npm run sync` in `site/` to pull changes into JSON snapshots, then deploy.

**Ready to implement?** The FAQ content above is written and formatted. A single API script can create all ~35 FAQ entries at once.
