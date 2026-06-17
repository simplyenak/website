# Simply Enak Website Improvement Design
**Date**: 2026-03-03
**Scope**: Option B — Tier 1 high-impact pages
**Approach**: Visual quality + conversion, both simultaneously
**Target**: CTR from 0.26% → 1.0%+ across organic and AI-referred traffic

---

## 1. Context & Baseline

### Performance Baseline (as of Oct 2025)
| Page | Impressions | Clicks | CTR |
|------|------------|--------|-----|
| Durian blog | 2,247 | 13 | 0.58% |
| Homepage | 244 | 7 | 2.87% |
| Hari Raya blog | 215 | 3 | 1.40% |
| About page | 80 | 0 | 0% |
| Stories | 15 | 0 | 0% |
| Tour pages | minimal | 0 | 0% |

Overall organic: ~13 visitors/month. A 5x improvement = RM 222k–279k revenue potential.

### Traffic Mix
- **Organic search** (cold, researching, price-sensitive)
- **Social / referral** (warm, already trust the brand concept)
- **AI-referred** (pre-sold on quality, highest intent, looking to confirm & book)

Each traffic type lands with different intent. AI-referred visitors especially arrive knowing what they want — the page must immediately confirm and remove friction.

---

## 2. Brand Foundation (non-negotiable)

All work must pass the **Three-Feeling Test**: does this page make the visitor feel WELCOMED, FASCINATED, CONNECTED?

### Voice rules
- **Show, don't claim** — "Aunty Lim has been making her laksa the same way since 1977" not "authentic local experience"
- **Specific over generic** — vendor names, dish names, neighborhoods, years
- **Active voice, contractions** — "we'll take you" not "guests will be taken"
- **Forbidden words**: authentic, premium, world-class, discover, immerse, unique, exceptional, amazing, traditional (without context), customers/clients/participants

### Design system
- **Primary**: `#b52d38` (deep red)
- **Orange**: `#ffa333` (accent, CTAs, highlights)
- **Dark**: `#1a1a1a` (hero backgrounds, CTA section)
- **Cream**: `#f9f6f2` (section alternates)
- **Fonts**: Merriweather (headings, pull quotes, emotional moments) / PT Sans (body)
- **Texture**: dot-grid / diamond batik patterns on dark sections
- **Motion**: staggered fadeUp, reduced-motion respected

---

## 3. Tier 1 Pages — Priority Order

### Priority rationale
1. **Tour detail pages** (`/tours/[slug]`) — highest commercial intent, most likely to convert
2. **Homepage hero** — already has 2.87% CTR but visual quality gap vs. content quality
3. **Contact page** — terminal conversion point; must reduce friction to zero
4. **Stories section** — SEO growth lever; blog-style content drives organic discovery

---

## 4. Page Designs

### 4a. Tour Detail Pages (`/tours/[slug]`)

**Goal**: Convert visitors who already want a food tour into a booking. The page answers: "Why *this* tour? Why *now*? How do I book?"

**Visitor intent layers**:
- Cold organic: still comparing options → needs specifics, social proof, risk removal
- AI-referred: already decided → needs confirmation, easy booking path

**Section structure** (top to bottom):

1. **Hero** — full-bleed food photo, tour name as H1, 3-stat bar (duration · group size · price), primary "Book This Tour" CTA above the fold. No hero text overlay clutter.

2. **The hook** — 2–3 sentence visceral description. Specific dish names. One sensory moment. Written like Aunty Lim writing to a friend ("You'll be licking your fingers at Chow Kit by 9am").

3. **What you'll taste** — visual dish cards (photo + name + one-line story). Not a bullet list. 8–12 dishes. Vendor name on each where possible.

4. **Meet your guide / vendor spotlight** — 1–2 vendor cards with photo, name, years at the stall, specialty. Humanises the experience. Links to vendor's story page if it exists.

5. **Tour details** — clean info block: meeting point, duration, group max, dietary options, what's included/excluded, price. Scannable, no prose.

6. **Social proof** — 3 selected reviews (not star-average, but chosen quotes with first name + country). TripAdvisor badge + Google badge side by side.

7. **FAQ accordion** — 5–7 Qs covering: dietary needs, meeting point, what to wear, cancellation, custom groups. Expanded by default on mobile.

8. **Book strip** — sticky bottom bar on mobile: price + "Book Now" → contact page. On desktop: inline "Ready to book?" card before footer.

**Design notes**:
- Image-heavy. Real photos from the tour, not stock.
- Dish cards use a warm cream background (`#f9f6f2`) to evoke food warmth.
- Vendor spotlight uses the dark card style (dark bg, orange accent border) matching Track Record page.
- WhatsApp button as secondary CTA throughout ("Got a question? Chat with us").

---

### 4b. Homepage Hero (update only — rest of homepage stays)

**Goal**: Increase CTR from search. The H1 must be findable AND compelling.

**What's already good**: cinematic overlay, stamp animation, ticker strip, social proof row.

**What to refine**:
- H1 currently: "Food Tours that Reveal the Hidden Culture and Heritage of Malaysia" — good for SEO, weak on emotional pull for cold traffic.
- Subtitle currently: "Walk with a local. Taste real stories. See the Malaysia most tourists miss." — strong but generic opener.
- Price info: "From RM 180" is incorrect (current pricing RM 285–359). Must fix.

**Revised copy direction**:
- H1 stays: keyword intent is correct. Possibly swap highlighted phrase to "Real Food. Real Stories." for more punch.
- Subtitle: add a specific hook e.g. "We've been eating at these stalls for 20 years. Now we want to show you."
- Price: update to "From RM 285 · 4–5 hours · Max 8 people"
- CTAs: "See Our Tours" stays primary. Consider changing secondary from "Our Story" to "How It Works" → less ambiguous.

**No structural changes** — the cinematic design is solid. This is copy and data accuracy only.

---

### 4c. Contact Page (`/contact/`)

**Goal**: Someone who clicks "Book Now" must complete an enquiry. Every point of friction is a lost booking.

**Current issues to diagnose first** (via Playwright):
- Form field count (more than 5 = drop-off risk)
- Response time expectation visibility
- Mobile keyboard experience on inputs
- Confirmation message after submit

**Design principles**:
- Headline: warm, not transactional. "Let's plan your table" not "Contact Us"
- Lead with trust: "We reply within 3 hours · Free cancellation up to 24h"
- Form fields: Name, Email, Tour Interest (dropdown), Preferred Date (optional), Message (optional). Max 5 fields.
- WhatsApp CTA as equal-weight alternative: some people never fill forms.
- After submit: immediate on-page "We'll be in touch within 3 hours" confirmation + option to WhatsApp if urgent.
- No CAPTCHA friction if using Cloudflare Turnstile (invisible).

**Mobile**: Sticky WhatsApp button. Form inputs large enough for thumbs. Date picker native (HTML `<input type="date">`).

---

### 4d. Stories Section (`/stories/`)

**Goal**: Drive organic SEO traffic through heritage storytelling. Build topical authority around Malaysian food culture. Secondary: convert readers into tour enquiries.

**Content strategy**:
- **Hub page** (`/stories/`): editorial magazine layout. Featured story large, grid of 6–8 recent stories below. Tags/categories sidebar or filter strip.
- **Story pages** (`/stories/[slug]`): long-form. 800–1,500 words. One vendor per story ideally. Written from a personal POV ("The first time I watched Uncle Chen make char kway teow, I thought he'd set the wok on fire").
- Stories that link to tours naturally at the end: "Uncle Chen cooks on the KL Heritage Walk every Saturday morning. →"

**SEO angle**: Target long-tail queries like "best char kway teow Kuala Lumpur" and "Chow Kit market food guide" — discovery content that brings cold traffic who then find the tours.

**Design**:
- Story pages: editorial feel. Wide readable column (max 65ch), large pull quotes, inline photos.
- Hub page: masonry or 3-column card grid. Story thumbnail, title, tag, first-line teaser.
- No generic "Learn More" CTAs — each story ends with a natural invitation.

---

## 5. Component Reuse Plan

All pages use existing component system — no new components required for Tier 1:

| Component | Used in |
|-----------|---------|
| `GlobalHero` | Tour detail hero |
| `Section` / `Section variant="light"` | All pages alternating |
| `Card` / `Card variant="featured"` | Dish cards, vendor cards, reviews |
| `Badge` | Tour tags, dietary labels |
| `CTASection` | All pages (bottom) |

New small components needed:
- `DishCard.astro` — photo + name + one-line story + vendor name. Used in tour detail.
- `ReviewCard.astro` — quote + attribution + platform badge. Used in tour detail + homepage.

Both are < 30 lines each. Purely presentational, no interactivity.

---

## 6. Content Requirements

The design is only as good as the content behind it. These are the content gaps to fill:

| Page | Content needed |
|------|----------------|
| Tour detail (all 5) | Real dish photos per tour, vendor names + years, 3 selected reviews per tour |
| Homepage | Correct price (RM 285), updated guest count |
| Contact | Confirm form fields, response time SLA |
| Stories | 3–5 new story drafts (vendor spotlights preferred) |

Content can be filled incrementally. Pages ship with placeholder cards that get replaced as content arrives.

---

## 7. Implementation Sequence

```
Week 1:  Tour detail page template redesign (tours/[slug].astro)
         → DishCard + ReviewCard components
         → Content: fill in KL Street Food Tour as pilot

Week 2:  Contact page redesign
         → Form field reduction, trust signals, WhatsApp parity
         → Test on mobile via Playwright

Week 3:  Stories hub + story template
         → Hub layout
         → 1 pilot story page (vendor spotlight)

Week 4:  Homepage copy updates (price, subtitle, CTA text)
         → A/B consideration for H1 highlighted text
         → Sitemap/meta description updates for SEO lift
```

---

## 8. Validation

Each page change is validated via:
1. **Playwright screenshot** at 1440×900 + 390×844 before push
2. **Build check**: `cd frontend && npm run build` — zero errors
3. **Staging deploy**: push to `simplyenak/revamp` main → GHA auto-deploys to `staging.simplyenak.com`
4. **Manual review** on staging: visual + link check + form submit test

Skills used during implementation:
- `frontend-design` — visual execution and design decisions
- `brand-guidelines` / `example-skills:brand-guidelines` — voice and copy checks
- `example-skills:webapp-testing` (Playwright) — screenshot validation
- `engineering-workflow-skills:git-pushing` — commit + push workflow

---

## 9. Success Metrics

| Metric | Current | 90-day Target |
|--------|---------|---------------|
| Overall organic CTR | 0.26% | 1.0% |
| Tour page clicks (organic) | ~0 | 15+/month |
| Stories clicks | 0 | 10+/month |
| Contact form completions | unknown | track & baseline |
| Booking enquiries via WhatsApp | unknown | track & baseline |

---

*Design approved and ready for implementation planning.*
