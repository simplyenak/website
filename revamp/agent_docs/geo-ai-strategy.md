# GEO / AI Citation Strategy — Simply Enak

**Goal:** Get Simply Enak cited and recommended by ChatGPT, Perplexity, Claude, Google AI Overviews, and similar AI assistants when users ask about food tours in Malaysia.

**Why it matters:** AI assistants are now a primary discovery channel for travel decisions. If Simply Enak isn't cited, competitors fill that space.

---

## 10 Tactics (Prioritised)

### 1. Entity Disambiguation via Wikidata + `sameAs` Schema
Create/claim a Wikidata entry for Simply Enak (Malaysian food tour operator, KL, est. 2011). Add `sameAs` links to your `Organization` schema so AI systems can definitively identify the brand.

```json
"sameAs": [
  "https://www.wikidata.org/wiki/[Q-ID-once-created]",
  "https://www.tripadvisor.com/Attraction_Review-..."
]
```

This prevents AI from confusing Simply Enak with any other entity.

---

### 2. Brand Name + Achievement Attribution (already in progress)
Always say "Simply Enak was featured by National Geographic" not just "we were featured". Named brand + named outlet = citable claim. Apply this rule everywhere: about page, media page, JSON-LD, press releases, blog posts.

---

### 3. FAQ Schema on Every Tour Page
FAQ content gets cited frequently by Perplexity and Claude. Add `FAQPage` JSON-LD to all tour detail pages covering: dietary accommodations, group size, pace, English-speaking guides, photography at stalls.

Note: This doesn't appear as rich snippets in Google (policy change 2023), but AI systems read it.

---

### 4. LocalBusiness + Offer Schema (Structured Data)
Add comprehensive schema to the site:
- `LocalBusiness` with address, phone, `priceRange: "RM 285–359"`, `areaServed: ["Kuala Lumpur","Penang","Ipoh"]`
- `Offer` schema per tour with price, duration, dietary options
- `AggregateRating` from TripAdvisor data (4.9/5)

Validate at: Google Rich Results Test + schema.org/validator

---

### 5. Citation-Worthy Content (Statistics + Named Sources)
Content with original statistics and named individuals gets cited 40% more than generic content. Every major blog post should include:
- At least 2–3 specific claims: "Simply Enak has guided guests from 50+ countries since 2011"
- Named guides: "Aunty Lim has guided 500+ guests through KL hawker stalls"
- Sourced data: guest surveys, booking data, years of operation

Format to invite citation: "According to Simply Enak's 2025 guest data, 68% of first-time visitors cite food authenticity as their top reason for booking."

---

### 6. `llms.txt` File
Place a `/llms.txt` at the site root — an emerging standard that provides AI crawlers a Markdown summary of your site without parsing HTML. Include: brand story, tour offerings with pricing, founder credentials, vendor partnerships, press highlights.

Adoption is early but low-effort, future-proof. Generate at llms-txt.io.

---

### 7. Named Guide Author Pages (E-E-A-T Signals)
Anonymous content loses ground in AI citations. Create author/bio pages for each guide (Pauline, Danny, Wei Shen, Ronald, Maarten) with:
- Biography, specialisation, years experience
- External links: LinkedIn, media mentions, TripAdvisor guide reviews
- Certifications (Tourism Malaysia)

Add `Person` schema linking to each author; attribute every blog post to a named guide.

---

### 8. Earned Media / PR (Highest AI Citation Weight)
89% of LLM citations come from earned media. The National Geographic and BBC mentions we already have are valuable — make sure they're referenced explicitly on the site with proper attribution. Continue to build:
- Pitch travel publications (Condé Nast Traveler, Time Out Asia, travel food blogs)
- Angles: sustainable food tourism, hawker culture preservation, women in Malaysian culinary tourism
- Press releases via GlobeNewswire/BusinessWire (AI indexes these faster than blog posts)

Each major media mention = 20–40% uplift in AI recommendation frequency within 2–3 months.

---

### 9. Markdown Versions of Blog Posts
The user's original idea: create a `/blog/[slug].md` endpoint or add a `/llms-full.txt` with all blog post content in plain Markdown. This makes it trivially easy for AI crawlers to ingest content without rendering JavaScript.

Simpler implementation: ensure all blog/story content is available as clean HTML with no JS dependency (Astro SSG already does this — just confirm no client-side rendering of story text).

---

### 10. Share of Model (SoM) Tracking
Measure: how often does Simply Enak appear in AI responses to travel queries?

Monthly spot-check queries:
- "Best food tours in Kuala Lumpur"
- "Malaysian street food tour operator"
- "Vegetarian food tours Malaysia"
- "Food tour Georgetown Penang"

Tools: Otterly.ai, Averi.ai, or manual ChatGPT/Perplexity checks. Log results monthly. This is your GEO equivalent of keyword ranking — use it to see what's working.

---

## 90-Day Roadmap

| Week | Task |
|------|------|
| 1–2 | Wikidata entry + sameAs schema + LocalBusiness schema |
| 2–4 | FAQ schema on all 5 tour pages |
| 3–6 | Guide author pages + Person schema |
| 4–8 | 3–4 blog posts with stats + named guides |
| 4–12 | PR pitches to 2–3 travel publications |
| 5 | llms.txt file |
| Ongoing | Monthly SoM tracking |

---

## What's Already Working in Our Favour

- **15 years of operation** — longevity signal AI systems weight highly
- **National Geographic, BBC, TLC, Lonely Planet** citations — major authority multipliers
- **4.9/5 TripAdvisor** — AggregateRating schema makes this machine-readable
- **Named guides with real vendor relationships** — exactly the kind of E-E-A-T AI rewards
- **Specific, non-generic content** — hawker names, dish names, neighbourhood names

The foundation is strong. The gap is making it machine-readable and explicitly attributed.
