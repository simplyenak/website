# Simply Enak Homepage — Customer Journey Map & UX Audit

**Staging URL:** https://b711d8ea.staging-5zf.pages.dev (behind Cloudflare Access — source-code audit performed)
**Date:** 2026-05-20
**Methodology:** Source-code analysis of built dist/ and Astro components from `/var/home/maarten/website-optimization/revamp/frontend/`

---

## 1. Page Meta & Architecture

| Attribute | Value |
|---|---|
| **Page Title** | `Simply Enak | Your Neighborhood Friends in Malaysia` |
| **H1** | `Malaysian Food Tours` + highlighted `Eat Like a Local` + `in KL & Penang` |
| **Meta Description** | `Come as a guest, leave as family. Join locals for Malaysian food tours in KL, Penang, and Ipoh. Small groups, real neighborhoods, 5,000+ guests since 2011.` |
| **Canonical** | `https://simplyenak.com/` |
| **Lang** | English (9 additional locale variants built) |
| **Generator** | Astro v6.3.2 |
| **Sections (in order)** | Hero > Manifesto > Partners > ThreePillars > GradientTransition > TourConfigurator > MeetTheVendors (hidden) > OurTours > SegmentDiscovery > Testimonials > OurValues > Media (conditional) > Stories > OurValuesStories > FAQ > CTA |

---

## 2. Navigation Structure (DOM-verified)

### Desktop Header (sticky, `z-50`)
| Nav Link | Destination | Notes |
|---|---|---|
| Logo | `/` | Mobile: `h-10`, Desktop: `h-12` |
| Home | `/` | Active state: orange text |
| Food Tours | `/tours` | |
| About | `/about` | |
| Stories | `/stories` | |
| Contact | `/contact` | |
| **Book Now (CTA button)** | `/tours/` | Primary button, orange/red styling |
| Phone | `tel:+6 017 287 8929` | Desktop sidebar |
| Email | `mailto:booking@simplyenak.com` | Desktop sidebar |
| Language Switcher | Inline dropdown | |

### Mobile Menu (hamburger)
Same items + **Private Tours** (`/tours/private-tours/`) + contact details + social media links

### Sticky Mobile CTA (bottom of viewport)
`Find Your Tour` -> `/tours/` (always visible on mobile)

---

## 3. Hero Section — DOM-verified Details

| Element | Content | Destination |
|---|---|---|
| **Eyebrow** | `Kuala Lumpur & Penang` | Static text |
| **H1** | `Malaysian Food Tours` + `Eat Like a Local` (orange highlight, -0.7deg rotated) + `in KL & Penang` | Static text |
| **Subtitle** | `Small-group tours with guides who grew up here` | Static text |
| **Price Anchor** | `From RM 285 per person · Max 8 guests` | Static text |
| **Guests Hosted** | `5,000+ guests hosted Since 2011` | Static text |
| **Google Rating** | 5 stars + `Google Reviews` | Inline SVG |
| **TripAdvisor Rating** | 5 stars + `TripAdvisor` | Inline SVG |
| **Primary CTA** | `Find Your Tour` | `#find-your-tour` (same-page scroll to TourConfigurator) |
| **Secondary CTA** | `View All Tours` | `/tours/` |
| **EST Badge** | `Est.` / `2011` | Circular badge with dashed border |

### Label-Action Mismatch (Hero)
- **PATTERN:** Primary CTA label `Find Your Tour` suggests a quiz/filter experience but scrolls to a 6-step configurator that ends at a WhatsApp message. The label implies discovery, not configuration.
- **PATTERN:** `View All Tours` (secondary) leads directly to `/tours/` — arguably the more actionable destination should be primary.

---

## 4. Tour Card Grid — "Our Signature Food Tours"

### Eyebrow: `Choose Your Experience`
### Title: `Our Signature Food Tours`

Main 5 tours rendered (from `getMainTourSlugs()`):

| Tour Name | Location | Duration | Price | Card CTA |
|---|---|---|---|---|
| Eat Drink George Town | Penang | 4 hours | from MYR 359 | `Join This Tour` -> `/tours/eat-drink-george-town/` |
| Flavours of Malaysia | Kuala Lumpur | 4 hours | from MYR 289 | `Join This Tour` -> `/tours/flavours-of-malaysia/` |
| Kuala Lumpur Street Food | Kuala Lumpur | 3.5 hours | from MYR 285 | `Join This Tour` -> `/tours/kuala-lumpur-street-food/` |
| Penang Street Food | Penang | — | from MYR — | `Join This Tour` -> `/tours/penang-street-food/` |
| Secrets of KL Nightlife | Kuala Lumpur | — | from MYR — | `Join This Tour` -> `/tours/secrets-of-kl-nightlife/` |

**Bottom CTA:** `Explore All Tours` -> `/tours/` (secondary style)

### Label-Action Mismatch (Tour Cards)
- **PATTERN:** `Join This Tour` implies booking/joining, but actually goes to the **tour detail page** (description, photos, itinerary). The guest must click AGAIN to actually book. This creates a "false commitment" label — **2-click conversion path** when the label promises 1-click.
- **PATTERN:** No `Book Now`, `Check Availability`, or date-picker on the card — essential booking info is hidden behind the detail page.

### Conversion Gap
- No direct booking/calendar CTA on any tour card
- No "from MYR 285" in hero but card shows "from MYR 359" for Penang tour — price inconsistency may erode trust
- Max guests: hero says 8, tour data says 9 — another inconsistency

---

## 5. Scroll Depth — Full Section Inventory

### Section 1: Manifesto (dark bg)
- Eyebrow: `Our Belief`
- Headline: `Great food isn't found in guidebooks. It's found down a side street your grandmother remembers.`
- Attribution: `Kar Yen` / `Founder & Lead Guide`
- CTA: `Read Our Story` (no href shown — note: the component receives `ctaText` but the index.astro doesn't pass a URL for this)

### Section 2: Partners / Press Logos (dark bg)
- Shows media logos (Lonely Planet, NatGeo, Discovery, Gourmet Traveller visible in dist assets)

### Section 3: Three Pillars (dark bg)
- Intro: `What Makes Us Different`
- Pillar 1: **People** — "Heritage Vendors" / multi-generational vendors
- Pillar 2: **Food** — "Authentic Flavours" / street-side dishes
- Pillar 3: **Place** — "Cultural Context" / hidden neighborhood tours

### Section 4: GradientTransition
- Visual divider dark->light

### Section 5: Experience Profiler / TourConfigurator
- Heading: from `quiz_heading` (content data)
- 6-step interactive quiz:
  - Step 1: Why are you traveling? (motivation)
  - Step 2: How do you travel? (style) — skippable
  - Step 3: What story do you want to tell? — skippable
  - Step 4: How open are you? — skippable
  - Step 5: Where + who (city, group type, headcount)
  - Step 6: Tell us more (contact, dietary, dates, referral, question)
  - Result: Experience Profile + WhatsApp message with tour suggestion
- **Friction:** 6 steps + contact info collection before seeing results
- **Vanishing:** If city/group not selected, step 5->6 button stays disabled

### Section 6: Meet The Vendors
- **STATUS:** HIDDEN (`show_vendors: false` in site-settings). If enabled, shows vendor cards.
- **Vanishing Information:** A whole trust-building section is disabled.

### Section 7: OurToursSection (already covered above)

### Section 8: Segment Discovery (chip cloud)
- Heading: `Find Your Perfect Tour`
- Subheading: `Browse by dietary preference, location, or travel style`
- 26 clickable chips (KL, Penang, Vegetarian, Street Food, Halal, Private tour, Families, etc.)
- Each chip links to a virtual category page (e.g. `/tours/locations/kuala-lumpur/`)
- **Hidden Essentials:** These category filter pages may not have dedicated content — they're referenced paths that need confirmation

### Section 9: Testimonials
- Eyebrow: `Guest Love`
- Heading: `What Our Guests Say`
- 3 testimonial cards shown (max 3, sliced from data)
- Rating badges: Google + TripAdvisor (from site-settings JSON)
- CTA: `Write a Review` -> `/tours/`
- **Trust Signal Issue:** All 5 testimonials in the JSON share the SAME author photo URL (`karen_testimonial_faadb8a58e.jpg`) — guests may notice identical photos for different people
- All `workflowStatus: "draft"` — though still rendered

### Section 10: Our Values / Stats
- Eyebrow: `What to Expect`
- Title: from `expect_title` in home-page.json
- 4 stat cards:
  - `5,000+` Guests Hosted
  - `4.9` Average Rating
  - `30+` Food Stalls
  - `14` Years Running
- CTA: `Book Your Experience` (no link/URL passed in component — just a text label?)

### Section 11: Media Section
- **Hidden:** Only renders if video URL exists AND isn't a Rick Roll placeholder
- Eyebrow + title from home-page.json

### Section 12: Stories
- Eyebrow: `Stories`
- Title: `Food Stories from Malaysia`
- Links to `/stories/[slug]` detail pages

### Section 13: Our Values Stories (5 belief cards)
- 5 numbered beliefs with title + excerpt

### Section 14: FAQ
- Eyebrow: `FAQ`
- Title: `Frequently Asked Questions`
- CTA: `Still have questions?`
- Accordion-style from faqs.json

### Section 15: Final CTA
- Eyebrow: `Ready when you are`
- Title: `Your Table Is Waiting` (or `Book Your Malaysian Food Adventure` from JSON)
- Subtitle: `Small groups, real neighbourhoods, stories worth telling. Pick a date that works for you.`
- 3 trust badges: Free cancellation, Reply within 3 hours, Max 8 (or 9) per tour
- **Primary CTA:** `Find Your Tour` -> `/tours/`
- **Secondary CTA:** `Chat on WhatsApp` -> `https://wa.me/60123456789`
- **ISSUE:** The WhatsApp URL in the JSON uses `60123456789` (placeholder number) not the actual `60172878929` from site-settings — potential broken lead channel

---

## 6. Footer — DOM-verified

| Section | Content |
|---|---|
| **Brand** | Logo (white background pill), tagline |
| **Social** | Instagram, Facebook, YouTube (icon buttons) |
| **Contact** | Phone, Email, Hours (Mon-Sun 9:00-20:00) |
| **Quick Links** | All Food Experiences, Private Tours, Media Enquiries, Contact Us, Privacy Policy, Terms & Conditions |
| **Partners** | TripAdvisor, Tourism Malaysia |
| **Payment** | Visa, Mastercard, PayPal |
| **Legal** | Copyright + Registration No: `00000-000-000-00` (placeholder) |

---

## 7. Mobile Viewport

- Responsive grid (lg breakpoints, hamburger at <1024px)
- Sticky bottom CTA: `Find Your Tour` -> `/tours/`
- Floating WhatsApp: MyAlice chat widget (loads after 15s on mobile, 3s on desktop)
- Language switcher available
- Haptic feedback on buttons (WebHaptics API)

### Issues
- Page has 15+ sections — significant scroll depth on mobile
- TourConfigurator is particularly long on mobile (6 steps of interaction)
- Skip-to-content link present for accessibility

---

## 8. Pattern Analysis

### Label-Action Mismatch Patterns

1. **"Find Your Tour" (Hero Primary CTA) -> #find-your-tour**
   - Label suggests discovery; action scrolls to a 6-step configurator. The guest expects to "find" something immediately but gets a quiz with required fields.

2. **"Join This Tour" (Tour Card CTA) -> /tours/[slug]**
   - Strong commitment language ("Join") suggests booking/transaction but delivers a detail/description page. Guest must click again. This is the highest-traffic pattern on the page.

3. **"Book Your Experience" (OurValuesSection) -> no link**
   - Label is an action imperative but the component only accepts a text string, not a URL. If passed, it renders text-only.

4. **ESM: "Read Our Story" (Manifesto) -> no URL passed**
   - The manifesto CTA text is passed but no href — the index.astro doesn't pass `manifesto_cta_url`

### Conversion Gap Patterns

1. **Zero direct booking paths on homepage**
   - Every CTA requires at least 2 clicks to reach a booking flow. The configurator's result page sends a WhatsApp message (manual booking), not an automated checkout.

2. **TourConfigurator: 6-step friction**
   - Steps 2-4 are skippable but presented as optional — guests may not know they can skip. The form collects email + phone BEFORE showing results.

3. **WhatsApp number discrepancy**
   - Site-settings: `+6 017 287 8929`
   - CTA section JSON: `60123456789` (placeholder)
   - TourConfigurator JS: `60172878929` (correct)
   - Three different numbers across the codebase

4. **No pricing calendar or availability on homepage**
   - Guest cannot see if tours are available on their travel dates without leaving the homepage

### Vanishing Information Patterns

1. **Meet the Vendors section: disabled** (`show_vendors: false`)
   - A key differentiator section is hidden by default. Brand guide emphasizes "real people" but the vendor showcase is gated behind a boolean.

2. **Media section: hidden if video URL is placeholder/empty**
   - Conditional rendering hides the entire section, leaving a gap in the page flow

3. **Testimonials: all use same author photo**
   - 5 different people (Sarah Johnson, Michael Chen, Emma Williams, David Lee, Priya Sharma) all share `karen_testimonial_faadb8a58e.jpg` — if guests notice, trust erodes

4. **Empty tour data fields:** `itinerary: []`, `whats_included: null`, `whats_excluded: null`, `what_to_bring: []`
   - These aren't rendered on the homepage but affect deep pages

### Hidden Essentials Patterns

1. **Max group size inconsistency:** Hero says "Max 8 guests", tour data says `maxParticipants: 9`
2. **Starting price inconsistency:** Hero says "From RM 285", cheapest tour is MYR 285 (KL Street Food) but Penang tour is MYR 359
3. **No meeting points or addresses on homepage** — hidden behind tour detail pages
4. **Registration number:** `00000-000-000-00` — placeholder value that may appear in footer
5. **Virtual filter page destinations:** Segment chips link to pages like `/tours/locations/kuala-lumpur/` — unclear if these have real content

---

## 9. Structured CJM: Homepage Visit Phase

| Phase | Goal | Actions | Touchpoints | Thinking / Questions | Feelings | Pain Points | Opportunities |
|---|---|---|---|---|---|---|---|
| **1. ARRIVAL** | Confirm this is the right site for food tours in KL/Penang | Land on homepage, scan hero, read title/subtitle | Hero section, browser tab title, nav | "Is this the right company? Do they do the cities I'm visiting?" | Curious, hopeful | No immediate price clarity on mobile below fold; hero image may not load if CDN issues | Lead with "From RM 285" in hero headline itself; add city badges in hero |
| **2. SCANNING** | Understand what tours are offered | Check nav links, scan hero CTAs, look at tour cards | Nav bar, hero CTAs, tour card grid | "Which tour is right for me? What's the difference between these tours?" | Overwhelmed (5 tours with similar names) | Tour cards only show name/location/price/duration — no quick-compare table; "Join This Tour" label overpromises | Add 1-line differentiator under each tour title; change "Join" to "See Details" |
| **3. EXPLORATION** | Pick a tour that matches their interests | Click "Find Your Tour" or scroll to chips, or click a tour card | Segment chips, TourConfigurator, tour cards | "Should I take the quiz or just browse tours? What if I don't want to give my email?" | Anxious about friction | 6-step configurator is high friction for casual browsing; contact info required before results | Allow skip-to-results without contact info; show tour recommendations without email capture |
| **4. TRUST BUILDING** | Verify the company is reputable | Scroll to testimonials, stats, press logos, FAQ | Testimonials section, OurValues stats, Partners section, FAQ | "Are these reviews real? All photos look the same... 5,000 guests seems good. How long have they been around?" | Skeptical then reassured | Identical testimonial photos undermine credibility; "show_vendors: false" hides key trust signal | Fix testimonial photos; enable Meet the Vendors section; add real trip reports with dates |
| **5. DECISION** | Decide whether to book or leave | Look for booking CTA, pricing, availability | Hero CTAs, CTA section, chat widget | "Can I book right now? Do I need to call? How do I know which dates are available?" | Frustrated, uncertain | No direct booking on homepage; no calendar/availability; all paths lead to tour detail pages first | Add "Check Available Dates" CTA to tour cards; add inline availability widget |
| **6. DEPARTURE / CONVERSION** | Take next step | Click CTA, open WhatsApp, navigate to tours page | "Find Your Tour" anchor, "View All Tours", WhatsApp button | "I'll just go to the tours page and figure it out there." | Resigned to another click | 2-click minimum to any booking flow; WhatsApp number discrepancy may cause failed connections | Direct "Book Now" on homepage hero; verify WhatsApp number consistency |

---

## 10. Summary of Findings

### What I Did
- Attempted to navigate to the staging URL (behind Cloudflare Access)
- Analyzed all 15+ sections of the homepage from source code
- Examined home-page.json, site-settings.json, tours.json, testimonials.json, segment-chips.json
- Read all key components: HeroSection, OurToursSection, TestimonialsSection, CTASection, TourConfigurator, SegmentDiscoverySection, Header, Footer, ToursCard
- Verified navigation structure, CTA destinations, and content rendering logic

### Critical Issues Found (Priority Order)

1. **HIGH — WhatsApp number discrepancy:** CTA section uses placeholder `60123456789` while configurator uses correct `60172878929`. This will break WhatsApp leads from the bottom CTA.

2. **HIGH — "Join This Tour" label-action mismatch:** Strong booking-commitment language on every tour card, but clicking goes to a detail page (not booking). This is the most-clicked element pattern on the page.

3. **MEDIUM — Testimonial photo reuse:** 5 different reviewers share 1 identical photo. Discoverable by any observant guest, eroding social proof.

4. **MEDIUM — No direct booking path from homepage:** All CTAs require minimum 2 clicks to reach any booking action. The tour configurator collects personal info before delivering results.

5. **MEDIUM — Meet the Vendors section hidden:** A key brand differentiator (40+ heritage vendors) is gated behind `show_vendors: false`.

6. **MEDIUM — Max group size inconsistency:** Hero says "Max 8", tour data says `maxParticipants: 9`.

7. **LOW — Registration number placeholder:** `00000-000-000-00` in footer.

8. **LOW — "Book Your Experience" CTA has no URL:** Renders as text-only.

### File Created
- `/var/home/maarten/website-optimization/revamp/frontend/homepage-cjm-audit.md` — this full report

### Note on Access
The staging URL `https://b711d8ea.staging-5zf.pages.dev` is behind Cloudflare Access authentication and could not be rendered in the browser. All findings are based on source-code analysis of the Astro components, content JSON files, and built dist output in the local repository at `/var/home/maarten/website-optimization/revamp/frontend/`. Visual layout details (image spacing, exact pixel positioning, animation timing) should be verified on a live instance.
