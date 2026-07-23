# SEO Ranking Strategy — Simply Enak

**Colony Page Architecture + Ranking-Phased Action System**

> Status: **Active** | Last Updated: 2026-07-22
> Pipeline script: `scripts/seo-ranking-pipeline.py`
> Cronnable: `hermes cron add seo-ranking-pipeline --cmd 'python3 scripts/seo-ranking-pipeline.py --cron'`

---

## Table of Contents

1. [Current Site Map](#1-current-site-map)
2. [Colony Page Architecture](#2-colony-page-architecture)
3. [Ranking Phase System](#3-ranking-phase-system)
4. [Phase Actions (Full Reference)](#4-phase-actions-full-reference)
5. [Automated Pipeline](#5-automated-pipeline)
6. [Colony → Tour Linking Strategy](#6-colony--tour-linking-strategy)
7. [GSC/GA Data Integration Point](#7-gscga-data-integration-point)
8. [Monitoring & Maintenance](#8-monitoring--maintenance)

---

## 1. Current Site Map

### Page Inventory (English, simplyenak.com)

Total English pages discovered: **~125+** across 5 page types.

#### Core Pages (priority 0.7–1.0)
| URL | Type | Priority | Notes |
|-----|------|----------|-------|
| `/` | Homepage | 1.0 | Links to ~30+ pages, diluting authority |
| `/about` | Supporting | 0.8 | Brand page |
| `/contact` | Supporting | 0.8 | |
| `/tours` | Supporting | 0.9 | Tour index/listing |
| `/stories` | Supporting | 0.7 | Blog listing |
| `/directions` | Supporting | 0.6 | |
| `/faq` | Supporting | — | |
| `/how-it-works` | Supporting | — | |
| `/how-to-prepare` | Supporting | — | |
| `/tour-quiz` | Supporting | — | Tour finder |
| `/testimonials` | Supporting | — | |
| `/track-record` | Supporting | — | |
| `/kuala-lumpur-food-tour` | Landing | 0.9 | Key commercial landing page |
| `/get-best-food-experience-simply-enak` | Landing | 0.7 | Brand landing |
| `/custom-tours` | Supporting | 0.7 | |

#### Individual Tour Pages (priority 0.9, high commercial intent)
These are the **money pages** — each represents a bookable product:

| URL | Tour Name | Location | Price |
|-----|-----------|----------|-------|
| `/tours/kuala-lumpur-street-food` | KL Street Food | KL | RM 285 |
| `/tours/flavours-of-malaysia` | Flavours of Malaysia | KL | RM 289 |
| `/tours/penang-street-food` | Penang Street Food | Penang | RM 289 |
| `/tours/georgetown-night-food-durian` | Eat Drink George Town | Penang | RM 359 |
| `/tours/secrets-of-kl-nightlife-street-art-and-cocktails` | Secrets of KL | KL | RM 359 |

#### Tour Sub-Pages
| URL | Type |
|-----|------|
| `/tours/private-tours` | Private tour page |
| `/tours/tailored-tours` | Tailored experience |
| `/tours/corporate-groups` | Corporate groups |
| `/tours/why-simply-enak` | Tour comparison |

#### Colony Pages (Hub Pages) — 43 total

**Location Hubs (13):** Pages at `/tours/locations/` targeting "[City] Food Tours" queries.

| Slug | City/Area | Keyword Angle |
|------|-----------|---------------|
| `food-tours-kuala-lumpur` | KL | "Kuala Lumpur food tours" |
| `food-tours-penang` | Penang | "Penang food tours" |
| `food-tours-melaka` | Melaka | "Melaka food tours" |
| `food-tours-ipoh` | Ipoh | "Ipoh food tours" |
| `food-tours-klang` | Klang | "Klang food tours" |
| `chow-kit-market-food-tour` | KL | "Chow Kit market food tour" |
| `chinatown-food-tour-kuala-lumpur` | KL | "Chinatown food tour KL" |
| `little-india-food-tour-kuala-lumpur` | KL | "Little India food tour KL" |
| `kampung-baru-food-tour` | KL | "Kampung Baru food tour" |
| `chowrasta-market-food-tour` | Penang | "Chowrasta market food tour" |
| `georgetown-heritage-food-tour` | Penang | "George Town heritage food tour" |
| `gurney-drive-food-tour` | Penang | "Gurney Drive food tour" |
| `little-india-food-tour-penang` | Penang | "Little India food tour Penang" |

**Dietary Hubs (15):** Pages at `/tours/dietary/` targeting dietary/restriction queries.

| Slug | Dietary | Location |
|------|---------|----------|
| `vegetarian-food-tours` | Vegetarian | Malaysia-wide |
| `vegetarian-food-tours-kuala-lumpur` | Vegetarian | KL |
| `vegetarian-food-tours-penang` | Vegetarian | Penang |
| `vegan-food-tours` | Vegan | Malaysia-wide |
| `vegan-food-tours-kuala-lumpur` | Vegan | KL |
| `vegan-food-tours-penang` | Vegan | Penang |
| `halal-food-tours` | Halal | Malaysia-wide |
| `halal-food-tours-kuala-lumpur` | Halal | KL |
| `halal-food-tours-penang` | Halal | Penang |
| `gluten-free-food-tours` | Gluten-Free | Malaysia-wide |
| `gluten-free-food-tours-kuala-lumpur` | Gluten-Free | KL |
| `gluten-free-food-tours-penang` | Gluten-Free | Penang |
| `jain-food-tours` | Jain | Malaysia-wide |
| `jain-food-tours-kuala-lumpur` | Jain | KL |
| `jain-food-tours-penang` | Jain | Penang |

**Specialty Hubs (12):** Pages at `/tours/specialty/` targeting experience-type queries.

| Slug | Specialty | Location |
|------|-----------|----------|
| `street-food-tours` | Street Food | Malaysia-wide |
| `street-food-tours-kuala-lumpur` | Street Food | KL |
| `street-food-tours-penang` | Street Food | Penang |
| `market-tours` | Market | Malaysia-wide |
| `market-tours-kuala-lumpur` | Market | KL |
| `market-tours-penang` | Market | Penang |
| `heritage-food-tours` | Heritage | Malaysia-wide |
| `heritage-food-tours-kuala-lumpur` | Heritage | KL |
| `heritage-food-tours-penang` | Heritage | Penang |
| `night-food-tours` | Night Food | Malaysia-wide |
| `night-food-tours-kuala-lumpur` | Night Food | KL |
| `night-food-tours-penang` | Night Food | Penang |

**Segment Hubs (8):** Pages at `/tours/segments/` targeting travel-type queries.

| Slug | Segment | Location |
|------|---------|----------|
| `food-tours-for-families-kuala-lumpur` | Families | KL |
| `food-tours-for-families-penang` | Families | Penang |
| `food-tours-for-couples-kuala-lumpur` | Couples | KL |
| `food-tours-for-couples-penang` | Couples | Penang |
| `food-tours-for-foodies-kuala-lumpur` | Foodies | KL |
| `food-tours-for-foodies-penang` | Foodies | Penang |
| `food-tours-for-chefs` | Chefs | (general) |
| `food-tours-for-wedding-groups` | Wedding Groups | (general) |

#### Blog / Stories — 76 articles

Blog posts at `/stories/[slug]` — organized as detailed food guides:
- **City guides** (~30): food-guide-kuala-lumpur, food-guide-penang, food-guide-ipoh, food-guide-melaka, etc.
- **Specialty guides** (~12): street-food-guide-kuala-lumpur, night-food-guide-penang, market-guide-malaysia, etc.
- **Dietary guides** (~14): vegetarian-guide-kuala-lumpur, vegan-guide-penang, halal-guide-kuala-lumpur, etc.
- **Travel type guides** (~8): families-guide-kuala-lumpur, couples-guide-penang, chefs-guide-kuala-lumpur, etc.
- **Seasonal/curated** (~8): cal-2026-* series, nasi-lemak-guide, etc.
- **Legacy blog** (16): Markdown posts in `src/data/post/` — durian, street food, safety, etc.

#### Utility Pages (low priority)
- `/privacy-policy`, `/privacy`, `/terms-conditions`, `/terms`
- `/thank-you`, `/thank-you-contact`, `/thank-you-booking`, `/thank-you-booking-kuala-lumpur`, `/thank-you-booking-penang`, `/thank-you-inquiry`, `/thank-you-registration`

---

## 2. Colony Page Architecture

### Concept

Colony pages are **hub pages** that rank for informational/longtail keywords (especially People Also Ask queries) and **pass link equity** to commercial tour pages. Think of them as the "ants" that feed the "queen" (tour pages).

```
                     ┌──────────────────────┐
                     │   Tour Page          │  ← Money page, bookable
                     │  (commercial intent)  │
                     └──────────┬───────────┘
                                │ ↑ link equity
           ┌────────────────────┼────────────────────┐
           │                    │                    │
    ┌──────▼──────┐    ┌───────▼───────┐    ┌───────▼──────┐
    │ Location     │    │ Dietary       │    │ Segment      │
    │ Colony Pages │    │ Colony Pages  │    │ Colony Pages  │
    └──────────────┘    └───────────────┘    └──────────────┘
           │                    │                    │
           │ ↑ link equity     │ ↑ link equity      │ ↑ link equity
    ┌──────▼──────┐    ┌───────▼───────┐    ┌───────▼──────┐
    │ Blog Posts  │    │ Blog Posts    │    │ Blog Posts   │
    │ (stories)   │    │ (stories)     │    │ (stories)    │
    └──────────────┘    └───────────────┘    └──────────────┘
```

### Tier Structure

| Tier | Page Type | Role | Keyword Focus | Links To |
|------|-----------|------|--------------|----------|
| **Tier 1** | Individual Tours | Conversion | "[tour name] food tour", booking | Booking system |
| **Tier 2** | Colony Pages (hubs) | Ranking + bridging | "[city] food tours", "vegetarian food tour KL" | Tour pages |
| **Tier 3** | Blog Posts | Top-of-funnel | "where to eat in KL", "best street food Penang" | Colony pages + tours |
| **Tier 4** | Support pages | Trust | "about", "faq", "how it works" | Tours, colony |

### Why Colony Pages Work for Simply Enak

1. **Low-difficulty keywords**: Colony pages target longtail keyword combos like "vegetarian food tours in Kuala Lumpur" — lower competition than "KL food tour"
2. **PAA targeting**: Colony pages with FAQ sections naturally answer "People Also Ask" boxes
3. **Link equity funnel**: Blog → Colony → Tour creates a clean authority flow
4. **Silo structure**: Each colony type (location/dietary/specialty/segment) forms a topical cluster
5. **Existing asset**: 43 colony pages already exist — 0 rank for most because they lack content depth and internal linking

### Colony Page Content Requirements

Every colony page needs:
- **Hero section** with H1 targeting the primary longtail keyword
- **2–3 content sections** (300+ words each) answering related questions
- **FAQ section** with 5–8 Q&A items (schema markup) for PAA boxes
- **Tour cards/links** to 3–5 relevant commercial tours (contextual, not just a list)
- **CTA** pointing to the most relevant tour or /tours listing
- **Internal links** from 2–3 related blog posts
- **Meta description** (150–160 chars) with primary keyword and a reason to click

---

## 3. Ranking Phase System

Each page on the site is assigned to one of 5 ranking phases. The phase determines what SEO actions to take.

```
Phase 1 ──────► Phase 2 ──────► Phase 3 ──────► Phase 4 ──────► Phase 5
Foundation    Enrichment      Authority        Conversion      Maintenance
(Rank 50+)    (Rank 20–50)    (Rank 10–20)     (Rank 5–10)     (Rank 1–5)
```

### Phase Progression Rules

| Transition | Gate Condition | Action Required |
|------------|---------------|-----------------|
| Phase 1 → 2 | Page is indexed, 30+ days old | Content expanded to 1500+ words |
| Phase 2 → 3 | Position held for 14+ days at 20–50 | Begin backlink campaign |
| Phase 3 → 4 | Position held for 21+ days at 10–20 | Switch to CRO focus |
| Phase 4 → 5 | Position stable at 5–10 for 30+ days | Ongoing monitoring |
| Phase 5 regress | Drops below position 5 | Refresh content + re-build links |

### Phase Overview

| Phase | Name | Rank Range | Action Focus | Effort |
|-------|------|-----------|-------------|--------|
| 1 | Foundation | 50+ / Unranked | Technical SEO, indexing, basics | Medium |
| 2 | Enrichment | 20–50 | Content depth, FAQ, internal links | High |
| 3 | Authority | 10–20 | Backlinks, social signals, reviews | High |
| 4 | Conversion | 5–10 | CRO, CTAs, trust signals, snippets | Medium |
| 5 | Maintenance | 1–5 | Monitor, refresh, defend | Low |

---

## 4. Phase Actions (Full Reference)

### Phase 1: Foundation SEO

**Goal:** Make the page indexable and technically sound so it can compete.

- [ ] Set unique, keyword-rich `<title>` tags (40–60 chars)
- [ ] Write compelling `<meta name="description">` (150–160 chars)
- [ ] Ensure proper heading hierarchy (H1 → H2 → H3 → body)
- [ ] Verify page is indexable (no `noindex`, no canonical issues)
- [ ] Add Open Graph (`og:title`, `og:description`, `og:image`) meta tags
- [ ] Add Twitter Card meta tags
- [ ] Verify Core Web Vitals pass (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] Add structured data (Product for tours, FAQ for colony pages, BreadcrumbList)
- [ ] Submit URL to Google Search Console for indexing
- [ ] Ensure mobile-friendly rendering (test with Mobile-Friendly Test)
- [ ] Page included in XML sitemap with proper priority
- [ ] Internal link from at least 2 other site pages
- [ ] Image alt text on all images

**Typical time:** 1–2 hours per page

---

### Phase 2: Content Enrichment

**Goal:** Demonstrate topical depth and relevance to climb to top 20.

- [ ] Expand body content to 1500–2500 words covering secondary keywords
- [ ] Add FAQ section with structured data markup (targets PAA boxes)
- [ ] Add 3–5 contextual internal links to related tours/pages
- [ ] Improve readability: shorter paragraphs, bullet points, comparison tables
- [ ] Add multimedia: original images with descriptive alt text, optional video
- [ ] Add "People also ask" targeted subheadings (H2s in question format)
- [ ] Create contextual cross-links from related blog posts
- [ ] Update `lastmod` date to signal freshness to search engines
- [ ] Add table of contents for long-form pages (>1500 words)
- [ ] Include 1–2 external citations linking to authoritative sources
- [ ] Add schema markup for Q&A, FAQ, or HowTo as appropriate
- [ ] Improve intro paragraph to hook reader and include primary keyword

**Typical time:** 2–4 hours per page

---

### Phase 3: Authority Building

**Goal:** Build enough off-page signals to break into top 10.

- [ ] Acquire 3–5 contextual backlinks from food/travel bloggers in Malaysia
- [ ] Submit to relevant directories (TripAdvisor attraction page, Google Business Profile, Yelp)
- [ ] Share on social media with structured hashtags (#KLFoodTour, #MalaysiaFood)
- [ ] Earn mentions through HARO / guest posting in food-travel niche
- [ ] Build links from colony pages → this commercial page (internal link equity)
- [ ] Get listed on partner/vendor websites with backlinks (hotels, travel agents)
- [ ] Encourage Google reviews (review schema already in place)
- [ ] Create "best of" listicles that cite/target this page
- [ ] Participate in relevant subreddits/forums (r/malaysia, r/travel)
- [ ] Update content quarterly to maintain topical authority
- [ ] Guest post on travel blogs with link back to this page
- [ ] Partner with local influencers for social proof

**Typical time:** 5–10 hours per page (across weeks)

---

### Phase 4: Conversion Optimization

**Goal:** Maximize booking conversion rate from search traffic.

- [ ] Add prominent booking CTA above the fold (visible without scrolling)
- [ ] Add social proof: testimonials, review scores (e.g., "★ 4.9 TripAdvisor"), trust badges
- [ ] A/B test title tags for improved organic CTR
- [ ] Add urgency signals: "Limited to 9 guests", "Booked 12 times today"
- [ ] Optimize for featured snippets: answer common questions in <50 words, use lists
- [ ] Add comparison table vs competitors showing unique value prop
- [ ] Implement exit-intent popup with discount or lead magnet (e.g., food guide PDF)
- [ ] Reduce form friction: shorten booking flow, add prominent WhatsApp button
- [ ] Add FAQ schema to occupy more SERP real estate (double listing)
- [ ] Monitor CTR in GSC and adjust meta descriptions if below 3%
- [ ] Add price anchoring and "what's included" breakdown
- [ ] Verify mobile booking flow works end-to-end

**Typical time:** 3–6 hours per page

---

### Phase 5: Maintenance & Defense

**Goal:** Keep top positions and fend off competitors.

- [ ] Monitor position daily via GSC or rank tracking tool
- [ ] Refresh content quarterly with new information, seasonal updates, new data
- [ ] Watch competitor pages for new content, features, or pricing changes
- [ ] Respond to new reviews (positive and negative) within 48 hours
- [ ] Continue building 1–2 new backlinks per quarter at sustaining pace
- [ ] Monitor and fix any technical SEO regressions (crawl errors, speed drops)
- [ ] Update internal links as new content is published
- [ ] Track branded vs non-branded traffic split in GA4
- [ ] Watch for Google algorithm updates and adjust content if needed
- [ ] Test new CTA variations every 90 days to sustain/lift conversion rate
- [ ] Maintain Google Business Profile with updated hours, photos, posts

**Typical time:** 1 hour per page per month

---

## 5. Automated Pipeline

### Pipeline Script

**Location:** `scripts/seo-ranking-pipeline.py`

The Python script implements the ranking phase system as an automated pipeline.

### What It Does

1. **Fetches sitemap** — Reads `https://simplyenak.com/sitemap.xml` (or local fallback)
2. **Classifies each page** by type (tour, colony, blog, supporting, utility)
3. **Assigns estimated rank** based on page metadata (priority, type, path signals)
4. **Determines phase** for each page based on its estimated rank
5. **Generates reports** — CSV, Markdown, and JSON outputs with per-page actions
6. **Generates link map** — Colony → tour internal linking recommendations
7. **Outputs to** `.hermes/seo-reports/`

### Usage

```bash
# Run once (English pages only)
python3 scripts/seo-ranking-pipeline.py

# Run for all languages
python3 scripts/seo-ranking-pipeline.py --locale all

# Cron mode (quiet, writes to .hermes/seo-reports/cron/)
python3 scripts/seo-ranking-pipeline.py --cron --locale en

# With real GSC data (when available)
python3 scripts/seo-ranking-pipeline.py --rank-data ./gsc-export.csv

# Specify custom sitemap
python3 scripts/seo-ranking-pipeline.py --sitemap https://simplyenak.com/sitemap-0.xml --locale all
```

### Cron Setup

```bash
# Add daily cron job via Hermes
hermes cron add seo-ranking-pipeline \
  --cmd 'python3 /path/to/scripts/seo-ranking-pipeline.py --cron' \
  --schedule '@daily' \
  --description 'Daily SEO ranking phase analysis'
```

### Cronnable Skill

A dedicated skill (`simplyenak-ranking-phase-pipeline`) has been created with full instructions for running and maintaining this pipeline. Load it with:

```bash
skill_view('simplyenak-ranking-phase-pipeline')
```

### Output Reports

| Report | Format | Purpose |
|--------|--------|---------|
| `seo-ranking-pipeline_[timestamp].csv` | CSV | Import into sheets, sort by phase |
| `seo-ranking-pipeline_[timestamp].md` | Markdown | Human-readable per-phase breakdown |
| `seo-ranking-pipeline_[timestamp].json` | JSON | Programmatic consumption, dashboards |
| `colony-link-map_[timestamp].md` | Markdown | Colony → tour internal linking recs |

### Report Structure (CSV)

```
url,page_type,subtype,priority,estimated_rank,phase_id,phase_label,top_action,actions
```

---

## 6. Colony → Tour Linking Strategy

### Core Principle

Every colony page must link to at least 3 relevant tour pages using **contextual anchor text** within the body content — not just a list at the bottom.

### Linking Rules

| Colony Type | Link Target Strategy |
|-------------|---------------------|
| Location hub (`/tours/locations/food-tours-kuala-lumpur`) | → All KL tours + specialty pages for KL |
| Dietary hub (`/tours/dietary/vegetarian-food-tours-kuala-lumpur`) | → Tours tagged with this dietary option |
| Specialty hub (`/tours/specialty/night-food-tours-penang`) | → Tours with this specialty tag |
| Segment hub (`/tours/segments/food-tours-for-families-kuala-lumpur`) | → Tours with this travel type |

### Anchor Text Best Practices

- ❌ "Click here for our tours" (generic)
- ✅ "Book our **Kuala Lumpur Street Food** tour for the full experience"
- ✅ "Our **Flavours of Malaysia** market tour is perfect for..."
- ✅ "Check out the **Eat Drink George Town** evening tour"

### Link Map (Extracted from Pipeline Output)

The pipeline script generates `colony-link-map_[timestamp].md` with per-colony recommendations. Key connections:

| Colony Page | → | Tour Pages (by relevance) |
|-------------|---|--------------------------|
| `food-tours-kuala-lumpur` | → | KL Street Food, Flavours of Malaysia, Secrets of KL |
| `food-tours-penang` | → | Penang Street Food, Eat Drink George Town |
| `vegetarian-food-tours-kuala-lumpur` | → | KL Street Food, Flavours of Malaysia |
| `night-food-tours-penang` | → | Eat Drink George Town |
| `street-food-tours-penang` | → | Penang Street Food, Eat Drink George Town |
| `food-tours-for-families-kuala-lumpur` | → | KL Street Food, Flavours of Malaysia |

### Blog → Colony Linking

Each blog post should link to 1–2 relevant colony pages. For example:
- A "Where to Eat in KL" post → links to `food-tours-kuala-lumpur` colony page
- A "Vegetarian Guide to Penang" post → links to `vegetarian-food-tours-penang` colony page

### PageRank Flow

```
[Blog Posts] ──link equity──► [Colony Pages] ──link equity──► [Tour Pages]
     ↑                                                              │
     └──────────────────────── link equity ──────────────────────────┘
```

---

## 7. GSC/GA Data Integration Point

### Current State
The pipeline uses **estimated rank positions** based on page type, priority, and URL signals. These are reasonable approximations but are NOT real search position data.

### Data Slot-in Architecture

The pipeline accepts real rank data via `--rank-data <csv>`:

```
url,position
https://simplyenak.com/tours/kuala-lumpur-street-food,15
https://simplyenak.com/tours/locations/food-tours-kuala-lumpur,42
```

### Source Integration Paths

| Data Source | Integration Method | Status |
|------------|-------------------|--------|
| **Google Search Console** | API via `google-auth` + `google-api-python-client` | 🔲 Planned |
| **GSC Export CSV** | `--rank-data <path>` flag (manual download) | ✅ Ready |
| **GA4** | `google-analytics-data` API for traffic/conversion data | 🔲 Planned |
| **Rank Tracker** | Custom rank tracker or third-party API | 🔲 Consider |
| **Ahrefs / SEMrush** | Export CSV → `--rank-data` | ✅ Ready |

### How to Connect GSC

```python
# Integration point in seo-ranking-pipeline.py (approximate):
# 1. Authenticate with Google Search Console API
# 2. Query: sites/<site>/searchAnalytics/query
# 3. Dimensions: page, query, position
# 4. Match page URLs to sitemap entries
# 5. Replace estimated_rank with real GSC position data
# 6. Re-calculate phases based on real data
```

### Phase Recalculation on Real Data

When real GSC positions are connected:
1. Pages currently in Phase 1 that rank 25 → jump to Phase 2
2. Pages currently in Phase 4 that rank 45 → drop back to Phase 2
3. Phase transitions become data-driven rather than estimated
4. The pipeline can also use GSC `clicks` and `impressions` to prioritize pages

---

## 8. Monitoring & Maintenance

### Daily (Automated)
- Pipeline runs via cron (reports generated)
- Any new pages auto-classified into phases
- Phase distribution tracked over time

### Weekly
- Review new pipeline reports
- Check if any pages crossed phase boundaries
- Verify colony → tour links are in place
- Fix any broken internal links

### Monthly
- Content refresh for Phase 3+ pages
- Backlink audit for Phase 3–4 pages
- Conversion rate review for Phase 4–5 pages
- Pipeline performance: are estimated ranks improving?

### Quarterly
- Full site content audit
- Review and update colony page content
- Re-assess keyword targets based on new blog content
- Update the rank estimation model if needed

---

## Appendix A: Priority Initial Actions (0–30 Days)

### Week 1-2: Foundation Fixes
1. Add internal links from 3 colony pages → their relevant tour pages
2. Ensure all sitemap entries have correct `priority` and `changefreq`
3. Fix missing meta descriptions on all colony pages

### Week 2-4: Content Depth
1. Expand top 10 colony pages with FAQ sections (PAA targeting)
2. Add structured data (FAQ schema) to colony pages
3. Add table of contents to longest colony pages

### Week 4-6: Authority Kickstart
1. Identify 5 easiest colony pages to rank (longest tail keywords)
2. Build 2–3 backlinks to each
3. Cross-link from related blog posts

### Week 6-8: Conversion Tuning
1. Review top 5 tour pages for CRO improvements
2. Add testimonial snippets to tour pages
3. Verify mobile booking flow

---

## Appendix B: Quick Reference — Phase Cheat Sheet

```
┌──────────┬──────────────┬────────────────────┬─────────────────────┐
│ Phase    │ Rank Range   │ Focus              │ Effort              │
├──────────┼──────────────┼────────────────────┼─────────────────────┤
│ 1 Found. │ 50+          │ Tech SEO, indexing │ 1-2h/page, one-time │
│ 2 Enrich │ 20–50        │ Content, FAQ, links│ 2-4h/page, one-time │
│ 3 Author │ 10–20        │ Backlinks, signals │ 5-10h/page, ongoing │
│ 4 Convert│ 5–10         │ CRO, CTAs, trust   │ 3-6h/page, one-time │
│ 5 Maint. │ 1–5          │ Monitor, refresh   │ 1h/page/month       │
└──────────┴──────────────┴────────────────────┴─────────────────────┘
```

**File info:** `.hermes/plans/seo-ranking-strategy.md` | Published 2026-07-22
