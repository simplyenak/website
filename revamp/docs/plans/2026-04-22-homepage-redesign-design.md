# Homepage Redesign Design Document
**Date:** 2026-04-22  
**Status:** Approved  
**Scope:** `revamp/frontend/src/pages/index.astro` and related Home components

---

## Context & Problem Statement

### Traffic data (GSC, Jan 2025 – Apr 2026)
- Homepage: 36,816 impressions, **1.77% CTR**, avg position **28.75**
- "food tour kuala lumpur": 2,066 impressions, position 10.2, 11 clicks (0.5% CTR)
- "food tour penang": 583 impressions, position 3.5, 25 clicks (4.3% CTR)
- Branded queries ("simply enak"): position 1, 67% CTR — not the problem

### On-page data (GA4)
- Homepage bounce rate: **11.9%** (excellent)
- Average session: **4.3 minutes** (engaged)
- Conclusion: **people who arrive convert well — the problem is getting them to arrive**

### Business context
- Private/tailored tours = **32% of guests and growing fast** — not visible on homepage
- Primary traffic source: Google organic (comparison shoppers, multiple tabs open)
- Primary differentiator: local insider knowledge — places visitors cannot find themselves
- 5,000+ guests, since 2011, max 8 per tour

### Reference sites analysed
- **Lost Plate** (lostplate.com/xian-full-day-tour/): Price + duration upfront, specific food descriptions, transparent "not for you" filtering, multiple CTAs throughout
- **Providend** (providend.com): Emotional hook first, explicit structural differentiator front-and-centre, philosophy before features, third-party validation early

---

## Goals

1. Improve Google ranking for "food tour kuala lumpur" (pos 10 → pos 5 target) and "food tour penang" (pos 3.5 → pos 1 target) via better on-page SEO signals
2. Communicate private/tailored tour capability prominently — dedicated section with direct WhatsApp CTA
3. Immediately differentiate from generic tour operators for comparison shoppers (8-second window)
4. Reduce section count from 15 → 10 to reduce scroll fatigue
5. Keep brand identity (orange, dark, cream, Merriweather) intact

---

## What Changes vs. What Stays

### Cut entirely
- `TourConfigurator` / Experience Profiler — move to `/tours/` page
- `SegmentDiscoverySection` (tag chips) — move to `/tours/` page  
- `OurValuesStoriesSection` ("What We Believe" beliefs list) — content overlaps with Manifesto

### Compressed
- Manifesto + Partners + ThreePillars → single `ManifestoSection` (dark, one section)

### New components
- `SocialProofStrip` — thin full-width dark bar below hero fold
- `RightForYouSection` — two-column honest qualifier
- `PrivateToursCTA` — full-bleed dark callout section

### Revised components
- `HeroSection` — new copy, rebalanced CTAs
- `TestimonialsSection` — static 3-up grid, no Swiper carousel

---

## Section Architecture (index.astro)

```
1.  HeroSection               (revised)
2.  SocialProofStrip          (new)
3.  ManifestoSection          (compressed — absorbs Partners logos)
4.  RightForYouSection        (new)
5.  OurToursSection           (moved up from position 8)
6.  PrivateToursCTA           (new)
7.  OurValuesSection          (moved up — "What to Expect in 4 Steps")
8.  TestimonialsSection       (revised — static grid)
9.  StoriesSection            (kept)
10. FAQSection + CTASection   (kept)
```

---

## Section Specifications

### 1. HeroSection (revised)

**Goal:** Pass Google's keyword relevance check AND answer "why Simply Enak" in 8 seconds.

**H1 copy:**
```
Malaysian Food Tours in KL & Penang
With Guides Who Grew Up Eating Here
```
- "Malaysian Food Tours" + city names in H1 = direct SEO signal
- "Grew Up Eating Here" = differentiator (d): local knowledge, not curated tourist route

**Eyebrow:** `Small groups · Family-run stalls · Since 2011`

**Subtitle:** `The places Kuala Lumpur and Penang actually eat — not the ones on the tourist map.`

**CTAs — equal weight, two separate paths:**
- Primary: `Browse Join-In Tours →` (→ `/tours/`)
- Secondary: `Plan a Private Tour` (→ WhatsApp or `/contact/`)

**Trust bar (below CTAs):**
`★ 4.9 on TripAdvisor · 5,000+ guests · Max 8 per tour · Free cancellation`

**Remove:** "Since 2011" badge circle (redundant with eyebrow), `hero_established_*` props

**SEO:** H1 must render as plain text (not split across spans with `rotate`) so Google reads it as one coherent phrase. The highlight span can wrap "KL & Penang" but the full keyword phrase must be intact in the DOM.

---

### 2. SocialProofStrip (new component)

**Visual:** Single dark row, full-width, ~64px tall. Between hero and manifesto.

**Content:** Logos of media features (CNN, etc.) + 3 stat pills:
`5,000+ guests from 50+ countries · 14 years in business · TripAdvisor Travellers' Choice`

**Implementation:** New component `src/components/Home/SocialProofStrip.astro`. Content from `site-settings.json` (media logos array + stats). No new Payload fields needed initially — hard-code the 3 stats, pull logos from existing `partners` data if available.

---

### 3. ManifestoSection (compressed)

**Keep:** Current ManifestoSection design is strong. Pauline quote, attribution, dark background.

**Add:** Below the manifesto text, embed a compact logo row (CNN, TripAdvisor Travellers' Choice, etc.) as third-party validation. This replaces the separate `PartnersSection`.

**Remove:** Separate `PartnersSection` component from index.astro.

**Three Pillars:** Reduce from full `ThreePillarsSection` (3 image cards) to a compact 3-column text-only row embedded at the bottom of the Manifesto section:
```
PEOPLE          FOOD             PLACE
The vendors     14 flavours,     The back lanes
who fed the     200 years of     that refuse
neighbourhood   layering         to disappear
```
Small, typographic. No images. Links to a fuller page if needed.

---

### 4. RightForYouSection (new component)

**Visual:** Cream background. Two columns side-by-side.

Left column — "This tour is for you if...":
- You want to eat where Pauline's family eats, not where tourists go
- You're happy walking through a wet market at 8am
- You want to know the person behind the dish, not just the dish
- You're travelling as a couple, family, or small group (or solo — we'll pair you with others)

Right column — "Probably not for you if...":
- You need air-conditioning and comfort stops
- You want a packed itinerary of temples and monuments
- You're in a hurry — we take our time
- You have severe food allergies that can't be accommodated at hawker stalls

**Design detail:** Left column has orange left-border accent. Right column is more muted (gray/70 text). A vertical divider between them. Heading: *"Is this the right tour for you?"*

**Purpose:** Filters unqualified enquiries, builds huge trust with qualified visitors, reduces post-booking disappointment.

**Content source:** New `right_for_you_*` fields in `home-page.json` (Payload). Or hard-code initially and move to CMS later.

---

### 5. OurToursSection (moved up)

No visual changes. Move from position 8 to position 5 in `index.astro`.

**One addition:** Below the tour cards grid, add a small text line:
`All tours also available as private departures. →` (links to `/contact/` or WhatsApp)

---

### 6. PrivateToursCTA (new component)

**Visual:** Full-bleed dark section (same dark as hero/manifesto) with a food photography background (low opacity overlay). Feels distinct from the tour cards above.

**Heading:** `Travelling with a group? We'll build the tour around you.`

**Body (3 bullet points):**
- Route adapted to your group's interests and dietary needs
- Your own private guide — no strangers, no compromises
- Corporate groups, family reunions, incentive travel — we've done them all

**CTA:** `Tell Us About Your Group →` → WhatsApp direct link

**Stats row below CTA:** `32% of our guests choose private · Groups of 2–20 · Custom itineraries`

**Content source:** New `private_tours_*` fields in `home-page.json`. Or hard-code initially.

---

### 7. OurValuesSection (moved up — "What to Expect")

No changes to component. Move from position 11 to position 7. Currently renders after testimonials — should render before.

---

### 8. TestimonialsSection (static grid, no carousel)

**Remove:** Swiper.js dependency from this section entirely.

**New layout:** 3 testimonial cards in a CSS grid (`grid-cols-1 md:grid-cols-3`). Static. Each card:
- Orange ★★★★★
- Review text (italic)
- Author name + country
- Author photo (or fallback icon)

**Below the grid:** Platform badges row:
```
[TripAdvisor logo]  4.9 ★  ·  [Google logo]  4.9 ★
```
Links to TripAdvisor and Google listings respectively.

**CTA below:** "Read all reviews on TripAdvisor →"

**Content source:** First 3 testimonials from `testimonials.json` (same as now, just rendered statically).

---

### 9. StoriesSection

No structural changes. Consider adding a "Join the tour that inspired this →" link below each story card pointing to the relevant tour. This creates a blog → tour conversion path for the significant blog traffic.

---

### 10. FAQSection + CTASection

No changes.

---

## SEO Changes

### Meta title (site-settings.json)
**Current:** `Simply Enak | Your Neighborhood Friends in Malaysia`  
**Proposed:** `Malaysian Food Tours in KL & Penang | Simply Enak | Since 2011`

### Meta description
**Proposed:** `Small-group food tours with guides who grew up eating at these stalls. Join-in or private tours in Kuala Lumpur and Penang. Max 8 people. From RM 285.`

### H1 DOM structure
Ensure H1 renders as a single coherent text string for Google. Avoid breaking keyword phrases across separate DOM nodes with transforms.

---

## New Payload Fields Required

| Field | Section | Type |
|-------|---------|------|
| `private_tours_heading` | PrivateToursCTA | text |
| `private_tours_body` | PrivateToursCTA | textarea |
| `private_tours_cta_text` | PrivateToursCTA | text |
| `private_tours_stat1/2/3` | PrivateToursCTA | text |
| `right_for_you_heading` | RightForYouSection | text |
| `right_for_you_items` | RightForYouSection | array |
| `not_for_you_items` | RightForYouSection | array |

These can be hard-coded in the components initially, then moved to Payload fields in a second pass.

---

## Files to Create

- `src/components/Home/SocialProofStrip.astro` (new)
- `src/components/Home/RightForYouSection.astro` (new)
- `src/components/Home/PrivateToursCTA.astro` (new)

## Files to Modify

- `src/pages/index.astro` — new section order, new imports, remove TourConfigurator/SegmentDiscovery
- `src/components/Home/HeroSection.astro` — copy changes, CTA rebalance, H1 DOM fix
- `src/components/Home/ManifestoSection.astro` — add compact pillars row + partner logos
- `src/components/Home/TestimonialsSection.astro` — remove Swiper, static 3-up grid

## Files to Leave Unchanged

- `OurToursSection.astro` (just moved in index.astro)
- `OurValuesSection.astro` (just moved in index.astro)
- `StoriesSection.astro` (optional story→tour links can be added later)
- `FAQSection.astro`
- `CTASection.astro`
- `GradientTransition.astro` (keep between manifesto and tours)

---

## Implementation Order

1. Back up index.astro ✅ (done: `_index-backup-2026-04-22.astro`)
2. Reorder sections in index.astro (no component changes — fast validation)
3. Create `SocialProofStrip.astro`
4. Create `RightForYouSection.astro`
5. Create `PrivateToursCTA.astro`
6. Revise `HeroSection.astro` (copy + CTAs)
7. Revise `ManifestoSection.astro` (add pillars + logos, remove separate ThreePillarsSection)
8. Revise `TestimonialsSection.astro` (static grid)
9. Update meta title + description in content JSON
10. Build test — verify 0 errors
