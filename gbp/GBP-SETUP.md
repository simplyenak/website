# Simply Enak — Google Business Profile Blueprint (KL, SAB)

**Goal:** Bring more people to simplyenak.com via Google local search (map pack + Maps).
**Business model:** Service-area business (SAB) — no storefront, tours meet at locations.
**Current state:** GBP exists, claimed & verified (KL). Primary category & service areas to be confirmed/optimized in dashboard.

---

## 1. Core Profile Settings (KL)

| Field | Value | Why |
|---|---|---|
| Business name | **Simply Enak** | Must match real-world name exactly. No keyword stuffing — suspension risk |
| Category (primary) | **Sightseeing tour agency** | More specific than "Tour operator" — better relevance signal |
| Additional categories (up to 9) | `Travel agency`, `Tour operator`, `Food tour` (if available), `Event planner` (only if legitimately offered) | More keyword associations — only active services |
| Address | **Hidden** (SAB) | No storefront. Guests don't visit an office |
| Service areas | KL neighborhoods where tours actually run (see §2) | Proximity proxy — this is how Google places you in the map pack |
| Phone | **+60 17-287 8929** | Must match site + all citations exactly |
| Website | `https://simplyenak.com/` | Measure site traffic from GBP |
| Hours | Daily 09:00–20:00 (matches site schema) | Hours = confirmed ranking factor. Being "open" at search time boosts rank |
| Messaging | Enable if staffed | Extra engagement signal + booking channel |

**Booking action (if available in dashboard):** Add "Book online" / appointment link → `https://simplyenak.com/tours/`

---

## 2. Service Areas (KL)

Set as service areas (not address). Start with neighborhoods where tours genuinely run:

- Kuala Lumpur City Centre (KLCC)
- Bukit Bintang
- Chinatown / Petaling Street (Pudu)
- Kampung Baru
- Bangsar
- Brickfields / Little India
- Merdeka Square area
- Chow Kit

**Why:** Each service area = a proximity anchor. When a tourist searches "food tour near me" or "food tour Kuala Lumpur" from any of these, the profile can rank. Don't add areas you don't serve — irrelevance hurts.

**Note:** Tours also run in Penang + Melaka. Those need **separate GBP profiles** (one per city of operation) — see §8. Don't stuff KL service areas with Penang neighborhoods.

---

## 3. Business Description (FINAL)

> Simply Enak runs small-group Malaysian food tours in Kuala Lumpur since 2011. We walk through neighbourhoods where locals actually eat: family-run stalls in Chinatown, hawker legends of Kampung Baru, and late-night gems in Pudu. Expect 10 to 15 tastings, stories behind every recipe, and a guide who grew up with the food. Tours run daily, morning and evening, in English. Vegetarian, vegan, halal and gluten-free options available on private tours. Book online or send us a message on WhatsApp for same-day questions.

**Character count:** 678/750

**Rules:** No banned words (authentic, superlatives, em-dashes). Keywords used naturally: food tours, Kuala Lumpur, neighbourhoods, hawker, tastings.

---

## 4. Photos & Visual Content (10–15 min, then 2–3/month)

Priority order:
1. **Cover photo** (16:9, 1200px+) — a vibrant food spread or guide with guests, geo-tagged to KL
2. **Logo** (square)
3. **Food shots** (10+) — the 10-15 tastings across tours: satay, durian, char kway teow, teh tarik, cendol
4. **Guides at work** (3+) — Pauline, Ezz, Suraiya with guests (people = trust)
5. **Neighborhood shots** (3+) — Petaling Street, Kampung Baru market, hawker stalls
6. **Video** (30s–2min) — a tour highlights reel, uploaded directly (under 75MB)

**Rules:** Real photos only, no stock. Descriptive filenames (`simply-enak-kampung-baru-food-tour.jpg`). Geo-tag EXIF where possible. Add 2-3 new photos monthly — freshness signal + engagement.

---

## 5. Reviews (highest-leverage ongoing activity)

**Current:** 76 reviews at 5.0 (from TripAdvisor, per site schema). Google reviews are a **separate pool** — GBP shows Google reviews, not TripAdvisor ones.

**Target:** 4–8 new Google reviews/month (steady, not bursts).

**Generation flow (post-tour):**
1. After each tour ends, guide mentions "if you enjoyed today, a Google review helps other travelers find us"
2. WhatsApp follow-up within 24h with direct review link (short link from GBP dashboard: `https://g.page/r/<id>/review`)
3. Same link on the thank-you page + post-booking email

**Response rules:**
- Positive: within 48h. Thank by name, mention the specific tour/food, add natural keyword ("Kampung Baru tour", "KL street food")
- Negative: within 12h. Acknowledge, apologize for the experience (not admitting fault), take offline (WhatsApp/email), never argue publicly
- **Every review gets a response** — Google confirms response rate is a ranking factor

---

## 6. Posts (2–3/week — freshness + keyword + CTA to site)

Post types to rotate:
- **Tour highlight** — one tour per post, its neighborhood, 2-3 dishes, CTA → tour page
- **Food story** — a dish/ingredient story (durian season, teh tarik pulling, nasi lemak history)
- **Traveler tip** — "how to eat like a local at a hawker centre", "best time to visit Kampung Baru"
- **Offer/seasonal** — holiday promos, rainy-season flexibility, group bookings

**Every post:** 1 photo, primary keyword in first 100 chars, CTA button to the site.

See `posts-calendar.md` in this folder — 4 weeks of ready-to-post copy.

---

## 7. Q&A (seed once, answer everything, monitor weekly)

Seed 8-10 questions (see `qa-seeds.md`):
- Where do tours meet? / How long are tours? / Vegetarian options? / Do tours run in rain? / What's the group size? / Are tours private?

**Rules:** Owner answers show first. Answer every question — including third-party ones. Upvote your own answers. Monitor weekly for spam/competitor questions. Use keywords naturally in answers.

---

## 8. Multi-City Expansion (Penang + Melaka)

They already run tours in Penang (Georgetown) and Melaka. Ideal end-state:
- **1 GBP per city**: KL (exists), Penang, Melaka
- Each with its own service areas, photos, posts, reviews
- Site already has per-city location pages + TouristTrip schema → link each GBP to its matching location page

**Order:** Land KL perfectly first (it's the biggest market), then clone the setup to Penang, then Melaka.

---

## 9. Site ↔ GBP Alignment (what the site must confirm)

The site schema must match GBP exactly (mismatches = conflicting signals):

| Signal | Site status | Action |
|---|---|---|
| Name | Simply Enak ✓ | — |
| Phone | +60 17-287 8929 ✓ | — |
| Hours | Daily 09:00–20:00 ✓ | — |
| `sameAs` | FB/IG/YT/TripAdvisor/LinkedIn/GYG/Viator/GBP | **Add the GBP Maps URL** to `sameAs` in `StructuredData.astro` ✅ DONE |
| `hasMap` | Added | **Add** Google Maps URL for the GBP listing ✅ DONE |
| LocalBusiness schema | Present ✓ | Keep. SAB-style: address is district-level, areaServed covers KL/Penang/Melaka — fine |
| Description | Site uses "authentic" (banned word) | ⚠️ Should update site to match GBP description, but low priority |

---

## 10. Monitoring & Cadence

| Cadence | Action |
|---|---|
| Daily | Check new reviews (GBP app notification) — respond negatives same day |
| Weekly | 1-2 posts; check Q&A for spam; verify no unauthorized edits |
| Monthly | Add 2-3 photos; review GBP Insights (calls, direction requests, clicks → site) |
| Quarterly | Competitor audit (their categories, review velocity, posts); re-check categories/attributes |

---

## 11. Tooling Status (what exists vs. what's needed)

| Tool | Status | Action |
|---|---|---|
| LocalSEOData API | No API key found locally/server | **Needed** for ranking/audit pulls (~free tier). Add key to `site/.env` |
| GBP Review MCP | Skeleton only (`gbp-review/build/`), no OAuth creds | Optional — for automated review sentiment/response. Needs Google OAuth |
| GBP API automation | Not configured | Only worth it at 10+ locations; manual dashboard is fine for 2-3 profiles |

---

## 12. Immediate Action List (this week)

1. **[Dashboard]** ✅ Verify primary category = Sightseeing tour agency
2. **[Dashboard]** ✅ Add 4-6 service areas
3. **[Dashboard]** ✅ Write description (use §3 draft, finalized)
4. **[Dashboard]** ⏳ Upload 10-15 photos + 1 video (§4)
5. **[Site]** ✅ Add `hasMap` + GBP URL to `sameAs` in StructuredData.astro (schema change, then `npm run build` + CI deploy)
6. **[Reviews]** Generate the Google review short link, add to post-tour WhatsApp flow
7. **[Posts]** Start weekly cadence with posts-calendar.md
