# HARDCODED CONTENT AUDIT — Simply Enak Website Revamp

**Date:** 2026-04-25  
**Scope:** All `.astro`, `.tsx`, `.ts` files in `src/`  
**Rule:** Every user-facing string must come from a translatable content field (Payload CMS or i18n). No hardcoded defaults, no hardcoded aria-labels, no hardcoded fallback copy.

---

## SUMMARY

**Status: FAILED.** Extensive hardcoded content exists across the entire frontend codebase. An estimated **60–80+ distinct hardcoded strings** were found in 35+ files. The site is NOT ready for multilingual go-live in its current state.

**Categories of violations:**
1. **Complete hardcoded sections** (entire component bodies are static English)
2. **Hardcoded fallback defaults** in prop destructuring (`?? "English string"`)
3. **Hardcoded UI labels** (aria-labels, button text, badges)
4. **Hardcoded schema/SEO data** (JSON-LD structured data)
5. **Hardcoded page-specific content** (comparison pages, neighborhood pages, 404)
6. **Hardcoded guarantees/badges** (tour index pages, booking widgets)

---

## SEVERITY: CRITICAL (Complete Hardcoded Sections)

These components/pages have entire sections of non-translatable English copy baked in. They render identical text regardless of language or CMS configuration.

### 1. `src/components/Home/WhyUsSection.astro`
- **Eyebrow:** `"Why Simply Enak"`
- **Title:** `"What makes us different."`
- **Subtitle:** `"Not rules we wrote down — things we learned after 14 years of doing this."`
- **6× Reason cards** with completely hardcoded headings, body copy, and stats:
  - `"We grew up eating here."` / `"Our guides have been coming to these stalls..."`
  - `"Small enough to matter."` / `"We've kept it at 8 people since the beginning..."`
  - `"We go where the food is good."` / `"No stall pays us to bring you there..."`
  - `"Food is how Malaysia tells its story."` / `"Chinese, Malay, Indian, Peranakan..."`
  - `"Ask your guide anything."` / `"Every tour ends with 15 minutes of open questions..."`
  - `"Built around your group."` / `"Almost a third of our guests choose a private tour..."`

### 2. `src/components/Home/ManifestoSection.astro` — Compact Three Pillars
Lines 118–129 contain a SECOND hardcoded three-pillars block (the component also accepts props):
- `"The People"` / `"Vendors who have fed their neighbourhood for generations..."`
- `"The Food"` / `"Chinese, Malay, Indian, Peranakan — cooking side by side..."`
- `"The Place"` / `"The back lanes, the shophouses, the stalls that refuse..."`

### 3. `src/components/CookieBanner.astro`
- **Entire component is hardcoded English:**
  - `"We use cookies to improve your experience and analyse site traffic..."`
  - `"Privacy Policy"` (link text)
  - `"Decline"` (button)
  - `"Accept"` (button)
  - `aria-label="Cookie consent"`

### 4. `src/components/SocialProof.astro`
- **Hardcoded platform data array** (lines 33–41):
  - `TripAdvisor` — `"Travelers' Choice 2025"`, 520 reviews
  - `Viator` — `"Hall of Fame"`, 380 reviews
  - `GetYourGuide` — `"Top Rated"`, 350 reviews
  - `Tourism Malaysia Certified` — `"🏆"`
  - `Free Cancellation` — `"✓"`
- **Hardcoded rating stars logic:** `"🏆"`, `"⭐"`, `"🌟"`

### 5. `src/pages/vs/other-kl-food-tours.astro`
- **Entire page is hardcoded** — a comparison table with static competitor data:
  - `"Simply Enak"` vs `"Secret Food Tours"`
  - Hardcoded comparison rows: `vendors`, `experience`, `dietary`, `guide`
  - Page title: `"How We Compare to Other KL Food Tours"`

### 6. `src/pages/tours/neighborhoods/[slug].astro`
- **Entirely hardcoded neighborhood data** (Chow Kit only):
  - `"Chow Kit"`, `"Kuala Lumpur"`
  - `"Exotic Tropical Fruits"` / `"Durian, rambutan, mangosteen..."`
  - `"Aromatic Spices"` / `"Fresh and dried spices..."`
  - No CMS lookup by slug — data is baked into the file.

### 7. `src/components/Home/TestimonialsSection.astro` — Platform Badges
- Lines 50–79 contain hardcoded platform badges that render even when `cards` are passed:
  - `"★★★★★"` / `"4.9 on TripAdvisor"`
  - `"★★★★★"` / `"4.9 on Google"`
  - `"5,000+ guests"` / `"since 2011"`

### 8. `src/components/Home/OurToursSection.astro` — Booking Guarantees
- Lines 66–89 contain hardcoded guarantees and private-tour callout:
  - `"Free cancellation up to 24 hours"`
  - `"We reply within 3 hours"`
  - `"Max 8 people per tour"`
  - `"Travelling with a group?"` / `"Plan a private tour →"`

---

## SEVERITY: HIGH (Hardcoded Fallback Defaults)

These files use `??`, `||`, or `=` to inject English defaults when CMS fields are empty. This defeats the purpose of CMS-driven content.

### `src/components/CTASection.astro`
```astro
const title = Astro.props.title ?? "Your Table Is Waiting";
const eyebrow = Astro.props.eyebrow ?? "Ready when you are";
const bookExperienceText = Astro.props.bookExperienceText || "Find Your Tour";
const chatWhatsAppText = Astro.props.chatWhatsAppText || "Chat on WhatsApp";
```

### `src/layouts/Layout.astro`
```astro
const title = "Simply Enak | Malaysian Food Tours in KL & Penang";
const gaId = (siteSettingsData as any).google_analytics_id || 'G-5CY08S07Z8';
```
- Also hardcoded: `aria-label` text in sticky CTA (line 227): `"Find Your Tour"`

### `src/components/Header/header.astro`
```astro
{ name: t('nav.privateTours') || 'Private Tours', href: ... }
```

### `src/components/Footer/footer.astro`
```astro
const site = {
  tagline: settings?.tagline ?? "Simply Enak has been sharing Malaysia's food heritage since 2011...",
  copyright: settings?.footer_copyright_text ?? "Simply Enak. All rights reserved.",
};
```
- Hardcoded alt text: `"Simply Enak Logo"` (line 52)
- Hardcoded partner text: `"TOURISM MALAYSIA"` (line 155)

### `src/components/Header/top-bar.astro`
```astro
const contact = {
  phone: settings?.contact_phone ?? "+6 017 287 8929",
  email: settings?.contact_email ?? "booking@simplyenak.com",
  hours: settings?.contact_hours ?? "Mon – Sun: 9:00 – 20:00",
};
```
- Hardcoded aria-labels: `"Call us at"`, `"Email us at"`
- Hardcoded social labels: `"Follow Simply Enak on Instagram"`, etc.

### `src/pages/[lang]/index.astro` — Home Page Fallbacks
```astro
ctaPrimaryText={content?.hero_cta_primary || 'See Our Tours'}
ctaSecondaryText={content?.hero_cta_secondary || 'How It Works'}
content?.hero_guides || 'Licensed Local Guides'
content?.hero_values || 'Slow Travel Values'
content?.featured_tours_title || 'Find the Right Tour for You'
title: 'See All Our Tours'
content?.segment_view_all || 'View all tours'
content?.media_title || 'Here is What Really Happens on Our Tours'
content?.faq_title || 'Questions We Often Hear'
```

### `src/components/FAQ.astro`
```astro
const { title = "Frequently Asked Questions" } = Astro.props;
```

### `src/components/Home/ThreePillarsSection.astro`
```astro
imageAlt: "Heritage vendors who have cooked the same recipes for decades",
imageAlt: "Malaysian street food at a heritage hawker stall",
imageAlt: "Kuala Lumpur — the neighbourhoods that made Malaysian food culture what it is",
```
- Also hardcoded eyebrow: `"Our Philosophy"` (line 80)

### `src/components/Tours/TourSidebar.astro`
```astro
<h3>{hasWidget ? 'Book This Tour' : 'Request This Tour'}</h3>
<p>{hasWidget ? 'Instant confirmation' : 'We'll confirm within 24 hours'}</p>
{hasWidget ? 'Secure payment' : 'Free cancellation'}
```

### `src/pages/contact.astro`
```astro
const seoTitle = contactPage?.seo_title || "Contact Simply Enak";
```
- Hardcoded aria-labels: `"Open WhatsApp chat"`, `"Copy email address"`, `"Call us now"`
- Hardcoded fallback text: `"Copy email"`

### `src/pages/thank-you.astro`
```astro
const tourName = urlParams.get("tour") || "Food Tour Experience";
```

### `src/pages/404.astro`
```astro
{ label: "All Tours", desc: "Browse all our food tours" }
{ label: "Contact Us", desc: "Book, ask, or plan your trip" }
{ label: "Stories", desc: "Malaysian food culture & guides" }
{ label: "Directions", desc: "Find your meeting point" }
{ label: "About Simply Enak", desc: "Who we are and why we do this" }
{ label: "Prepare for Your Tour", desc: "What to wear, bring, expect" }
```

---

## SEVERITY: MEDIUM (Hardcoded Labels, Badges, Breadcrumbs)

### `src/pages/tours/index.astro` & `[lang]/tours/index.astro`
```astro
'eat-drink-george-town': { label: 'Most Popular', color: 'bg-amber-500' },
'kl-street-food': { label: 'Guest Favourite', color: 'bg-orange-500' },
'secrets-of-kl-nightlife': { label: 'Evening Tour', color: 'bg-purple-600' },
```

### `src/pages/tours/[slug].astro` & `[lang]/tours/[slug].astro`
```astro
{ label: 'Kuala Lumpur', href: '/tours/locations/kuala-lumpur/' }
{ label: 'Penang', href: '/tours/locations/penang/' }
{ label: 'Dietary Tours', href: '/tours/dietary/vegetarian/' }
{ label: 'Neighborhoods', href: '/tours/' }
settings?.label_good_for ?? 'Good for'
settings?.label_why_join_us ?? 'Why Join Us'
```
- Hardcoded price analogy fallback: `"About the price of one hotel breakfast in KL"`

### `src/components/Home/HeroSection.astro`
```astro
alt="Malaysian street food experience"
{heroSection.establishedLabel || 'EST'}
{heroSection.establishedYear || '2011'}
```
- Also hardcoded `aria-label` on CTA: `"Plan a private food tour built around your group"`

### `src/components/Home/MeetTheVendorsSection.astro`
```astro
alt={vendor.name || 'Vendor'}
{vendor.name || 'Vendor'}
{meetOnTourText.replace('{name}', vendor.name ? vendor.name.split(' ').pop() : 'Vendor')}
```

### `src/components/Home/MediaLogosStrip.astro`
```astro
{eyebrow || 'As featured in'}
```

### `src/components/Tours/TourQuiz.astro`
```astro
button: quizConfig.contactCTAButton || 'Let Us Help',
headline: hl?.headline || 'Our Top Picks For You',
```

### `src/components/Tours/TourConfigurator.astro`
```astro
discovery: "Wants to tell friends: 'We found this place that wasn't on any map'",
connection: "Wants to tell friends: 'We met the most amazing people'",
growth: "Wants to tell friends: 'I tried things I never thought I would'",
```
- Also hardcoded step counter: `"Your Experience Profile"`, `"Step ${stepNum} of ${totalSteps}"`

### `src/pages/stories/[slug].astro` & `[lang]/stories/[slug].astro`
```astro
submitBtn.textContent = 'Subscribe';
<h3>Meet {story.author_name ?? 'This Vendor'} on Our Tours</h3>
```

---

## SEVERITY: LOW (Schema/Structured Data & JSON Endpoints)

These are less visible to users but still contain hardcoded English strings. They should ideally be CMS-driven or at least use i18n.

### `src/api/seo-json.astro`
```astro
name: "Simply Enak Food Experiences"
site_name: "Simply Enak"
servesCuisine: ["Malaysian", "Chinese", "Indian", "Malay", "Nyonya"]
addressCountry: "Malaysia"
addressLocality: "Kuala Lumpur"
tourLanguages: ["English", "Malay"]
experienceLevel: "Suitable for all skill levels"
amenities: ["Local guide", "Food samples", ...]
```

### `src/api/hero-json.astro`
```astro
"name": "CULINARY EXPERIENCES FROM THE HEART"
"name": "Book Now"
"name": "View Tours"
primaryCTA: "Book Now"
secondaryCTA: "View Tours"
certificateOfExcellence: "TripAdvisor Certificate of Excellence"
certifiedGuides: "Local expert guides"
smallGroupSize: "Personal attention"
ariaLabel: "Simply Enak Food Tours Hero Section"
```

### `src/api/categories-json.astro`
- Hardcoded category descriptions for:
  - `malaysian-festivities`
  - `malaysian-tropical-fruits`
  - `malaysian-gender-equality`
  - `malaysian-food-culture`
  - `malaysian-street-food`
  - `malaysian-heritage`
  - `practical-travel-tips`

### Schema in Pages
- `src/pages/faq.astro` — JSON-LD `"FAQPage"`, `"Question"`, `"Answer"`
- `src/pages/about.astro` — BreadcrumbList `"Home"`, `"About"`
- `src/pages/track-record.astro` — `"Simply Enak Track Record"`, `"Simply Enak Awards"`
- `src/pages/reviews.astro` — `"AggregateRating"`, `"LocalBusiness"`, `"Simply Enak"`
- `src/pages/directions.astro` — Location filter strings `"Kuala Lumpur"`, `"Penang"`, `"George Town"`
- `src/pages/tours/corporate-groups.astro` — `"Kuala Lumpur"`, `"Penang"`

---

## FILES NOT AUDITED (Require Manual Review)

The following files were not fully inspected but are likely to contain additional hardcoded content based on patterns seen above:

- `src/components/Home/AboutSection.astro`
- `src/components/Home/FAQSection.astro`
- `src/components/Home/OnThePlateSection.astro`
- `src/components/Home/OurValuesSection.astro`
- `src/components/Home/OurValuesStoriesSection.astro`
- `src/components/Home/PartnersSection.astro`
- `src/components/Home/PressBentoSection.astro`
- `src/components/Home/PrivateToursCTA.astro`
- `src/components/Home/RightForYouSection.astro`
- `src/components/Home/SegmentDiscoverySection.astro`
- `src/components/Home/SocialProofStrip.astro`
- `src/components/LandingPage/*.astro` (all landing page components)
- `src/components/Tours/BookingWidget.astro`
- `src/components/Tours/CustomTourCTA.astro`
- `src/components/Tours/OtherBookingSection.astro`
- `src/components/Tours/TestimonialCarousel.astro`
- `src/components/Tours/TourFilterBar.astro`
- `src/components/Tours/TourHighlights.astro`
- `src/components/StoriesDetails/*.astro`
- `src/pages/about.astro`
- `src/pages/about/our-values.astro`
- `src/pages/how-it-works.astro`
- `src/pages/how-to-prepare.astro`
- `src/pages/media.astro`
- `src/pages/privacy-policy.astro`
- `src/pages/terms-conditions.astro`
- `src/pages/track-record.astro`
- `src/pages/reviews.astro`
- `src/pages/thank-you-contact.astro`
- `src/pages/thank-you-inquiry.astro`
- `src/pages/tours/dietary/[slug].astro`
- `src/pages/tours/locations/*.astro`
- `src/pages/tours/specialty/[slug].astro`
- `src/pages/tours/travel-types/[slug].astro`

---

## RECOMMENDED REMEDIATION PLAN

### Phase 1: CMS Schema Extensions (Backend)
1. **Add new collections/singletons to Payload:**
   - `homepage_why_us` — eyebrow, title, subtitle, 6× reason cards (icon, stat, heading, body)
   - `cookie_banner` — message, privacy link text, decline text, accept text
   - `social_proof` — platform entries (name, rating, reviews, badge) — editable array
   - `tour_badge_labels` — key-value map for tour slug → badge label
   - `booking_guarantees` — 3× guarantee lines + private tour callout
   - `testimonial_platform_badges` — TripAdvisor/Google/guest stats text
   - `comparison_page` — competitor entries (dynamic array)
   - `neighborhoods` — slug-driven collection with name, city, highlights
   - `footer_content` — payment method labels, partner text
   - `error_page` — 404 title, description, link list

2. **Extend existing collections:**
   - `site-settings` — add cookie banner fields, CTA defaults, guarantee texts
   - `home-page` — add `why_us_*`, `booking_guarantees_*`, `manifesto_pillars_*` fields
   - `tours` — add `badge_label` field (overrides hardcoded map)

### Phase 2: Component Refactoring (Frontend)
For each file in the audit:
1. Replace hardcoded strings with prop-driven content
2. Set prop defaults to `undefined` (not English strings)
3. Fetch content from CMS JSON in the page file
4. Pass fetched content as props to child components
5. If a prop is `undefined`, the component renders nothing (graceful degradation)

**Example pattern:**
```astro
<!-- BEFORE -->
const title = Astro.props.title ?? "Your Table Is Waiting";

<!-- AFTER -->
const { title } = Astro.props;
---
{title && <h2>{title}</h2>}
```

### Phase 3: i18n Completion
1. Add ALL UI labels to `src/i18n/ui.ts` in all 4 languages (en, ms, de, zh)
2. Replace hardcoded aria-labels with `t('aria.*')` calls
3. Replace hardcoded fallback strings with `t('fallback.*')` calls
4. Ensure schema data can be language-aware (or use `@en`/`@ms` suffixed fields)

### Phase 4: JSON Snapshot Update
1. Export new CMS fields to `src/data/content/*.json`
2. Populate all new JSON files with translated content
3. Ensure build script regenerates these snapshots automatically

---

## ESTIMATED EFFORT

| Phase | Scope | Est. Time |
|-------|-------|-----------|
| 1 — CMS Schema | 10+ new fields/collections | 4–6 hours |
| 2 — Component Refactor | 25+ files | 8–12 hours |
| 3 — i18n Completion | 80+ strings, 4 languages | 6–8 hours |
| 4 — JSON Snapshots | Export + translate | 2–4 hours |
| **Total** | | **20–30 hours** |

---

## GO-LIVE RECOMMENDATION

**DO NOT go live** with multilingual support until at least the CRITICAL and HIGH severity items are resolved. The site currently renders significant amounts of English text on every page regardless of the selected language, which will create a poor user experience for non-English visitors.

**Minimum viable fix for go-live:**
1. Resolve all CRITICAL items (complete hardcoded sections)
2. Resolve all HIGH items (fallback defaults)
3. Populate the CMS JSON files with correct translated content for all new fields
4. Verify with a build + visual inspection in each language
