# Homepage Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restructure the Simply Enak homepage from 15 sections to 10, add three new components (SocialProofStrip, RightForYouSection, PrivateToursCTA), revise the hero copy for SEO, replace the testimonials carousel with a static grid, and prominently surface private/tailored tours.

**Architecture:** All content comes from `frontend/src/data/content/home-page.json` (Payload CMS snapshot). New sections use new fields in that JSON — hard-code sensible defaults directly in the component props for now, wire to CMS fields in a second pass. No new routes. No backend changes. All work is in `revamp/frontend/src/`.

**Tech Stack:** Astro (SSG), TailwindCSS, existing brand tokens (orange, dark, cream), Merriweather font. No new npm packages.

**Design doc:** `docs/plans/2026-04-22-homepage-redesign-design.md`  
**Backup:** `src/pages/_index-backup-2026-04-22.astro` ✅

---

## Task 1: Reorder sections in index.astro (no component changes)

This is the fastest validation — reorder only, so we can see the structural improvement immediately with zero risk.

**Files:**
- Modify: `frontend/src/pages/index.astro`

**Step 1: Open and read the current index.astro**

Read `frontend/src/pages/index.astro` to confirm current section order (15 sections).

**Step 2: Rewrite index.astro with new section order**

New order (keep existing imports, just reorder the JSX blocks and remove 3 sections):

```astro
<Layout ...>
  <HeroSection ... />                    {/* 1 - revised copy comes in Task 4 */}
  {/* SocialProofStrip — Task 2 */}
  <ManifestoSection ... />               {/* 3 - compress in Task 6 */}
  {/* RightForYouSection — Task 3 */}
  <OurToursSection ... />                {/* 5 - moved up */}
  {/* PrivateToursCTA — Task 5 */}
  <GradientTransition />
  <OurValuesSection ... />               {/* 7 - moved up */}
  <TestimonialsSection ... />            {/* 8 - static grid in Task 7 */}
  <StoriesSection ... />
  <FAQSection ... />
  <CTASection ... />
</Layout>
```

**Remove these imports and JSX blocks entirely:**
- `import TourConfigurator` — delete import + `<Section id="find-your-tour">` block
- `import SegmentDiscoverySection` — delete import + `<SegmentDiscoverySection ... />`
- `import OurValuesStoriesSection` — delete import + `<OurValuesStoriesSection ... />`
- `import PartnersSection` — delete import + `<PartnersSection ... />` (logos move to ManifestoSection in Task 6)
- `import ThreePillarsSection` — delete import + `<ThreePillarsSection ... />` (pillars move to ManifestoSection in Task 6)
- `import MediaSection` — delete import + the conditional MediaSection block (no video yet)

**Keep but reorder:**
- MeetTheVendorsSection: keep between OurToursSection and PrivateToursCTA (conditional on `siteSettings?.show_vendors`)

**Step 3: Run build to verify no errors**

```bash
cd /var/home/maarten/website-optimization/revamp/frontend && npm run build 2>&1 | tail -30
```

Expected: build succeeds, page count may drop slightly (removed sections don't add pages).

**Step 4: Commit**

```bash
cd /var/home/maarten/website-optimization/revamp && git add frontend/src/pages/index.astro && git commit -m "refactor(home): reorder sections, remove TourConfigurator/Segment/ValuesStories"
```

---

## Task 2: Create SocialProofStrip component

A thin full-width dark bar between the hero and manifesto. Media logos + 3 stat pills.

**Files:**
- Create: `frontend/src/components/Home/SocialProofStrip.astro`
- Modify: `frontend/src/pages/index.astro` (add import + usage)

**Step 1: Create the component**

```astro
---
// SocialProofStrip.astro
// Thin credibility bar between hero and manifesto.
// Media logos + key stats. Hard-coded initially; move to CMS fields later.
---

<div class="bg-dark border-t border-white/[0.06] border-b border-white/[0.06]">
  <div class="main-container py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">

    <!-- As seen in label -->
    <span class="text-white/30 text-[10px] uppercase tracking-[0.2em] font-bold hidden sm:block">
      As featured in
    </span>

    <!-- Media logos (text fallbacks — replace with SVGs/images when available) -->
    <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
      <span class="text-white/40 text-xs font-semibold tracking-wide uppercase">CNN Travel</span>
      <span class="text-white/20 text-xs" aria-hidden="true">·</span>
      <span class="text-white/40 text-xs font-semibold tracking-wide uppercase">Lonely Planet</span>
      <span class="text-white/20 text-xs" aria-hidden="true">·</span>
      <span class="text-white/40 text-xs font-semibold tracking-wide uppercase">TripAdvisor</span>
    </div>

    <!-- Divider -->
    <div class="hidden md:block w-px h-5 bg-white/10" aria-hidden="true"></div>

    <!-- Stats pills -->
    <div class="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] text-white/50">
      <span><strong class="text-white/75">5,000+</strong> guests from 50+ countries</span>
      <span class="text-white/20" aria-hidden="true">·</span>
      <span><strong class="text-white/75">14 years</strong> in business</span>
      <span class="text-white/20" aria-hidden="true">·</span>
      <span>TripAdvisor <strong class="text-white/75">Travellers' Choice</strong></span>
    </div>

  </div>
</div>
```

**Step 2: Add to index.astro**

After `import HeroSection`, add:
```astro
import SocialProofStrip from "@/components/Home/SocialProofStrip.astro";
```

In the template, add `<SocialProofStrip />` immediately after `<HeroSection ... />`.

**Step 3: Build and verify**

```bash
cd /var/home/maarten/website-optimization/revamp/frontend && npm run build 2>&1 | tail -20
```

Expected: 0 errors.

**Step 4: Commit**

```bash
cd /var/home/maarten/website-optimization/revamp && git add frontend/src/components/Home/SocialProofStrip.astro frontend/src/pages/index.astro && git commit -m "feat(home): add SocialProofStrip between hero and manifesto"
```

---

## Task 3: Create RightForYouSection component

Two-column honest qualifier: "This tour is for you if / Probably not for you if".

**Files:**
- Create: `frontend/src/components/Home/RightForYouSection.astro`
- Modify: `frontend/src/pages/index.astro`

**Step 1: Create the component**

```astro
---
// RightForYouSection.astro
// Honest two-column qualifier. Filters unqualified leads, builds trust with good-fit visitors.
// Inspired by Lost Plate's approach to transparent expectation-setting.

interface Props {
  heading?: string;
  forYouItems?: string[];
  notForYouItems?: string[];
}

const {
  heading = "Is this the right tour for you?",
  forYouItems = [
    "You want to eat where our guides' families eat — not where tourists go",
    "You're happy walking through a wet market at 8am with a coffee in hand",
    "You want to know the person behind the dish, not just the dish itself",
    "You're travelling solo, as a couple, family, or small group",
    "You'd rather spend RM 300 on a real meal than RM 300 on a hotel breakfast",
  ],
  notForYouItems = [
    "You need air-conditioning and comfort stops throughout",
    "You want a packed itinerary of monuments, temples, and photo stops",
    "You're in a hurry — we take our time at every stall",
    "You have severe allergies that can't be accommodated at open-air hawker stalls",
  ],
} = Astro.props;
---

<section class="bg-cream py-16 md:py-20">
  <div class="main-container">

    <h2 class="font-merriweather text-2xl md:text-3xl font-bold text-primary text-center mb-12">
      {heading}
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-4xl mx-auto rounded-xl overflow-hidden border border-gray-200 shadow-sm">

      <!-- For you column -->
      <div class="bg-white p-8 md:p-10 border-l-4 border-orange">
        <div class="flex items-center gap-2 mb-6">
          <span class="text-orange text-lg" aria-hidden="true">✓</span>
          <h3 class="font-merriweather font-bold text-primary text-lg">Right for you if…</h3>
        </div>
        <ul class="space-y-4">
          {forYouItems.map((item) => (
            <li class="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
              <span class="text-orange mt-0.5 flex-shrink-0" aria-hidden="true">→</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <!-- Not for you column -->
      <div class="bg-gray-50 p-8 md:p-10 border-t md:border-t-0 md:border-l border-gray-200">
        <div class="flex items-center gap-2 mb-6">
          <span class="text-gray-400 text-lg" aria-hidden="true">○</span>
          <h3 class="font-merriweather font-bold text-gray-500 text-lg">Probably not if…</h3>
        </div>
        <ul class="space-y-4">
          {notForYouItems.map((item) => (
            <li class="flex items-start gap-3 text-sm text-gray-400 leading-relaxed">
              <span class="mt-0.5 flex-shrink-0 text-gray-300" aria-hidden="true">—</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

    </div>
  </div>
</section>
```

**Step 2: Add to index.astro**

Import and add `<RightForYouSection />` after `<ManifestoSection ... />` (section 4, between manifesto and tours).

No props needed yet — uses defaults. Later wire to `content?.right_for_you_*` fields.

**Step 3: Build**

```bash
cd /var/home/maarten/website-optimization/revamp/frontend && npm run build 2>&1 | tail -20
```

**Step 4: Commit**

```bash
cd /var/home/maarten/website-optimization/revamp && git add frontend/src/components/Home/RightForYouSection.astro frontend/src/pages/index.astro && git commit -m "feat(home): add RightForYouSection — honest qualifier for comparison shoppers"
```

---

## Task 4: Revise HeroSection copy and CTAs

Fix the H1 for SEO, rebalance the two CTAs, remove the "Since 2011" circle badge.

**Files:**
- Modify: `frontend/src/data/content/home-page.json` — update hero copy fields
- Modify: `frontend/src/components/Home/HeroSection.astro` — rebalance CTA layout, fix H1 DOM

**Step 1: Update content JSON fields**

In `frontend/src/data/content/home-page.json`, update these fields:

```json
"hero_title": "Malaysian Food Tours in KL & Penang",
"hero_highlight": "With Guides Who Grew Up Eating Here",
"hero_title_end": "",
"hero_subtitle": "The places Kuala Lumpur and Penang actually eat — not the ones on the tourist map.",
"hero_eyebrow": "Small groups · Family-run stalls · Since 2011",
"hero_cta_primary": "Browse Join-In Tours",
"hero_cta_primary_url": "/tours/",
"hero_cta_secondary": "Plan a Private Tour",
"hero_cta_secondary_url": "/contact/",
"hero_price_info": "From RM 285 · 4–5 hours · Max 8 people · Free cancellation"
```

**Step 2: Fix H1 DOM in HeroSection.astro**

The current H1 breaks the phrase across multiple `<span>` nodes with `transform: rotate`. Google may not read this as a coherent keyword phrase. Restructure so "Malaysian Food Tours in KL & Penang" renders as readable text, and the highlight `<span>` wraps only the second line.

Find this block in `HeroSection.astro`:
```astro
<h1 class="fade-2 font-merriweather font-bold text-white leading-[1.08] mb-4 max-w-5xl mx-auto"
    style="font-size: clamp(1.6rem, 6vw, 4rem);">
  {heroSection.title}<br />
  <span class="inline-block bg-orange text-black px-4 py-1.5 rounded-sm shadow-xl mt-3 mb-1 font-black"
        style="transform: rotate(-0.7deg); font-size: clamp(1.4rem, 5vw, 3.5rem);">
    {heroSection.highlightedText}
  </span><br />
  <span class="text-gray-300">{heroSection.titleEnd}</span>
</h1>
```

Replace with (keeps visual style, fixes SEO DOM order):
```astro
<h1 class="fade-2 font-merriweather font-bold text-white leading-[1.15] mb-4 max-w-4xl mx-auto"
    style="font-size: clamp(1.5rem, 5vw, 3.25rem);">
  {heroSection.title && (
    <span class="block text-white mb-2">{heroSection.title}</span>
  )}
  {heroSection.highlightedText && (
    <span
      class="inline-block bg-orange text-black px-4 py-1.5 rounded-sm shadow-xl font-black"
      style="transform: rotate(-0.7deg); font-size: clamp(1.3rem, 4.5vw, 3rem);"
    >
      {heroSection.highlightedText}
    </span>
  )}
</h1>
```

**Step 3: Remove the "Since 2011" badge circle**

Delete this block from HeroSection.astro (lines ~116–122):
```astro
{(heroSection.establishedLabel || heroSection.establishedYear || heroSection.locationLabel) && (
  <div class="fade-1 inline-flex flex-col items-center justify-center w-20 h-20 ...">
    ...
  </div>
)}
```

The info is now in the eyebrow text.

**Step 4: Make secondary CTA equal weight visually**

Find the CTA buttons block. The secondary button currently uses `cta-secondary` (outline). Change to give both buttons more equal visual weight — the private tour CTA should not look like an afterthought:

```astro
<div class="fade-4 flex flex-col sm:flex-row gap-4 justify-center mb-6">
  <a href={heroSection.ctaPrimaryUrl} class="cta-primary cta-primary-lg group inline-flex">
    {heroSection.ctaPrimaryText}
    <svg .../>
  </a>
  {heroSection.ctaSecondaryText && (
    <a href={heroSection.ctaSecondaryUrl}
       class="cta-secondary inline-flex"
       style="border-color: rgba(255,163,51,0.5); color: rgba(255,255,255,0.85);">
      {heroSection.ctaSecondaryText}
    </a>
  )}
</div>
```

(The `border-color: rgba(255,163,51,0.5)` gives the secondary CTA an orange tint, making it feel intentional rather than subordinate.)

**Step 5: Build**

```bash
cd /var/home/maarten/website-optimization/revamp/frontend && npm run build 2>&1 | tail -20
```

**Step 6: Commit**

```bash
cd /var/home/maarten/website-optimization/revamp && git add frontend/src/data/content/home-page.json frontend/src/components/Home/HeroSection.astro && git commit -m "feat(home): update hero copy for SEO, rebalance CTAs, remove badge circle"
```

---

## Task 5: Create PrivateToursCTA component

Full-bleed dark section between OurToursSection and OurValuesSection.

**Files:**
- Create: `frontend/src/components/Home/PrivateToursCTA.astro`
- Modify: `frontend/src/pages/index.astro`

**Step 1: Create the component**

```astro
---
// PrivateToursCTA.astro
// Full-bleed dark section surfacing private/tailored tours.
// 32% of guests choose private — this needs its own prominent section.

import { siteConfig } from '@/lib/site-config';

interface Props {
  heading?: string;
  whatsappNumber?: string;
}

const {
  heading = "Travelling with a group? We'll build the tour around you.",
  whatsappNumber,
} = Astro.props;

const wa = whatsappNumber ?? siteConfig.whatsappNumber;
const waUrl = wa ? `https://wa.me/${wa.replace(/\D/g, '')}?text=${encodeURIComponent("Hi! I'm interested in a private food tour.")}` : '/contact/';

const features = [
  "Route adapted to your group's interests and dietary needs",
  "Your own private guide — no strangers, no compromises on pace",
  "Corporate groups, family reunions, incentive travel — we've done them all",
];

const stats = [
  "32% of our guests choose private",
  "Groups of 2–20 people",
  "Custom itineraries",
];
---

<section class="relative bg-dark text-white overflow-hidden py-16 md:py-24">

  <!-- Subtle dot-grid texture -->
  <div class="absolute inset-0 pointer-events-none" style="background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 28px 28px;" aria-hidden="true"></div>

  <!-- Top accent rule -->
  <div class="absolute top-0 inset-x-0 h-px" style="background: linear-gradient(90deg, transparent 0%, rgba(255,163,51,0.3) 50%, transparent 100%);" aria-hidden="true"></div>

  <div class="relative z-10 main-container">
    <div class="max-w-3xl">

      <span class="text-eyebrow text-orange block mb-4">Private &amp; Group Tours</span>

      <h2 class="font-merriweather font-bold text-white leading-[1.1] mb-6"
          style="font-size: clamp(1.5rem, 4vw, 2.75rem);">
        {heading}
      </h2>

      <ul class="space-y-4 mb-10">
        {features.map((f) => (
          <li class="flex items-start gap-3 text-white/70 leading-relaxed">
            <span class="text-orange mt-0.5 flex-shrink-0 font-bold" aria-hidden="true">→</span>
            {f}
          </li>
        ))}
      </ul>

      <a
        href={waUrl}
        class="cta-primary cta-primary-lg inline-flex group"
        aria-label="Enquire about a private food tour on WhatsApp"
      >
        Tell Us About Your Group
        <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
        </svg>
      </a>

      <!-- Stats row -->
      <div class="flex flex-wrap gap-x-6 gap-y-2 mt-8">
        {stats.map((s, i) => (
          <>
            <span class="text-white/40 text-xs">{s}</span>
            {i < stats.length - 1 && <span class="text-white/20 text-xs" aria-hidden="true">·</span>}
          </>
        ))}
      </div>

    </div>
  </div>

  <!-- Bottom rule -->
  <div class="absolute bottom-0 inset-x-0 h-px bg-white/[0.05]" aria-hidden="true"></div>

</section>
```

**Step 2: Add to index.astro**

Import and place `<PrivateToursCTA whatsappNumber={siteSettings?.whatsapp_number} />` after `OurToursSection` (and after the optional `MeetTheVendorsSection`), before `GradientTransition`.

**Step 3: Build**

```bash
cd /var/home/maarten/website-optimization/revamp/frontend && npm run build 2>&1 | tail -20
```

**Step 4: Commit**

```bash
cd /var/home/maarten/website-optimization/revamp && git add frontend/src/components/Home/PrivateToursCTA.astro frontend/src/pages/index.astro && git commit -m "feat(home): add PrivateToursCTA section — surfaces 32% private tour demand"
```

---

## Task 6: Compress ManifestoSection (add compact pillars + remove ThreePillarsSection)

Absorb the three pillars into the bottom of ManifestoSection as a compact text-only row. This eliminates a full separate section without losing the content.

**Files:**
- Modify: `frontend/src/components/Home/ManifestoSection.astro`

**Step 1: Add compact pillars row to ManifestoSection**

At the bottom of the component, after the closing `</div>` of the flex layout (before `<!-- Bottom rule -->`), add:

```astro
<!-- Compact three pillars — replaces separate ThreePillarsSection -->
<div class="relative z-10 border-t border-white/[0.06] mt-0">
  <div class="main-container">
    <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.07] py-10">
      {[
        { label: "The People", body: "Vendors who have fed their neighbourhood for generations. We introduce you by name." },
        { label: "The Food", body: "Chinese, Malay, Indian, Peranakan — cooking side by side for 200 years. Every dish has a history." },
        { label: "The Place", body: "The back lanes, the shophouses, the stalls that refuse to be replaced. Coming here is how they survive." },
      ].map((p) => (
        <div class="py-6 md:py-0 md:px-8 first:md:pl-0 last:md:pr-0">
          <span class="text-orange text-[10px] font-bold tracking-[0.25em] uppercase block mb-2">{p.label}</span>
          <p class="text-white/55 text-sm leading-relaxed">{p.body}</p>
        </div>
      ))}
    </div>
  </div>
</div>
```

Note: This content is hard-coded here. If it needs to be CMS-managed later, add props and wire to `content?.pillar_*` fields.

**Step 2: Verify ThreePillarsSection is already removed from index.astro**

(Was removed in Task 1. Confirm.)

**Step 3: Build**

```bash
cd /var/home/maarten/website-optimization/revamp/frontend && npm run build 2>&1 | tail -20
```

**Step 4: Commit**

```bash
cd /var/home/maarten/website-optimization/revamp && git add frontend/src/components/Home/ManifestoSection.astro && git commit -m "feat(home): embed compact pillars in ManifestoSection, remove ThreePillarsSection dependency"
```

---

## Task 7: Replace TestimonialsSection carousel with static 3-up grid

Remove Swiper entirely from this section. Three static cards, platform badges below.

**Files:**
- Modify: `frontend/src/components/Home/TestimonialsSection.astro`

**Step 1: Rewrite TestimonialsSection.astro**

Replace the entire file content with:

```astro
---
import { getLangFromUrl, localizePath } from "@/i18n/utils";

interface Props {
  eyebrow?: string;
  heading?: string;
  ctaText?: string;
  cards?: { title: string; review: string; name: string; country: string; image?: string }[];
}

const { eyebrow, heading, ctaText, cards: propCards } = Astro.props;
const lang = getLangFromUrl(Astro.url);

// Show at most 3 cards — static grid, no carousel
const displayCards = (propCards && propCards.length > 0 ? propCards : []).slice(0, 3);
---

{displayCards.length > 0 && (
  <section class="py-16 md:py-20 bg-cream">
    <div class="main-container">

      <div class="text-center mb-12">
        {eyebrow && <span class="text-eyebrow text-orange block mb-3">{eyebrow}</span>}
        {heading && <h2 class="font-merriweather text-3xl md:text-4xl font-bold text-primary mb-4">{heading}</h2>}
      </div>

      <!-- Static 3-up grid — no Swiper, no auto-play -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayCards.map((testimonial) => (
          <div class="bg-white shadow-sm rounded-xl p-6 md:p-8 border-l-4 border-orange flex flex-col">
            <div class="text-orange text-lg mb-4" aria-label="5 out of 5 stars">★★★★★</div>
            <p class="text-gray-700 leading-relaxed italic text-sm flex-1">"{testimonial.review}"</p>
            <div class="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
              <div class="size-11 rounded-full overflow-hidden bg-amber-100 flex-shrink-0 flex items-center justify-center">
                {testimonial.image
                  ? <img src={testimonial.image} alt={testimonial.name} class="size-full object-cover" height={44} width={44} loading="lazy" />
                  : <svg class="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                }
              </div>
              <div>
                <p class="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                <p class="text-xs text-gray-500">{testimonial.country}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <!-- Platform badges -->
      <div class="flex flex-wrap items-center justify-center gap-6 mt-10 py-6 border-t border-gray-200">
        <div class="flex items-center gap-2.5">
          <svg class="w-6 h-6" viewBox="0 0 24 24" aria-label="TripAdvisor">
            <circle cx="12" cy="12" r="10" fill="#00AF87"/>
            <path d="M12 7l1.5 3.5 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5L7 11l3.5-.5z" fill="white"/>
          </svg>
          <span class="text-sm text-gray-600">4.9 ★ on TripAdvisor</span>
        </div>
        <span class="text-gray-300" aria-hidden="true">·</span>
        <div class="flex items-center gap-2.5">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-label="Google">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span class="text-sm text-gray-600">4.9 ★ on Google</span>
        </div>
      </div>

      {ctaText && (
        <div class="text-center mt-6">
          <a href={localizePath('/tours/', lang)} class="cta-primary cta-primary-lg inline-flex text-white font-bold uppercase text-sm px-8 py-4">
            {ctaText}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left: 0.5rem;">
              <path d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      )}

    </div>
  </section>
)}
```

Note: The `<script>` block importing Swiper is gone entirely. No more Swiper dependency for this section.

**Step 2: Build**

```bash
cd /var/home/maarten/website-optimization/revamp/frontend && npm run build 2>&1 | tail -20
```

**Step 3: Commit**

```bash
cd /var/home/maarten/website-optimization/revamp && git add frontend/src/components/Home/TestimonialsSection.astro && git commit -m "refactor(home): replace Swiper carousel with static 3-up testimonials grid + platform badges"
```

---

## Task 8: Update meta title and description

**Files:**
- Modify: `frontend/src/data/content/home-page.json`

**Step 1: Update meta fields**

In `home-page.json`, change:
```json
"meta_title": "Malaysian Food Tours in KL & Penang | Simply Enak | Since 2011",
"meta_description": "Small-group food tours with guides who grew up eating at these stalls. Join-in or private tours in Kuala Lumpur and Penang. Max 8 people. From RM 285."
```

**Step 2: Build and verify meta tags render correctly**

```bash
cd /var/home/maarten/website-optimization/revamp/frontend && npm run build 2>&1 | tail -10
```

Spot-check: `grep -r 'Malaysian Food Tours' dist/index.html` should find the title tag.

**Step 3: Commit**

```bash
cd /var/home/maarten/website-optimization/revamp && git add frontend/src/data/content/home-page.json && git commit -m "seo(home): update meta title and description with target keywords"
```

---

## Task 9: Final build verification

**Step 1: Full clean build**

```bash
cd /var/home/maarten/website-optimization/revamp/frontend && rm -rf dist && npm run build 2>&1 | tail -40
```

Expected: 0 errors, page count reported.

**Step 2: Verify key elements in built HTML**

```bash
# H1 contains target keyword
grep -o 'Malaysian Food Tours[^<]*' /var/home/maarten/website-optimization/revamp/frontend/dist/index.html | head -3

# Meta title updated
grep '<title>' /var/home/maarten/website-optimization/revamp/frontend/dist/index.html

# Meta description updated
grep 'meta name="description"' /var/home/maarten/website-optimization/revamp/frontend/dist/index.html
```

**Step 3: Push to staging**

```bash
cd /var/home/maarten/website-optimization/revamp && git push origin main
```

Cloudflare Pages auto-deploys from `main`. Check `staging.simplyenak.com` once deployed (~2 min).

---

## Out of Scope (future tasks)

- Wiring new sections (`RightForYouSection`, `PrivateToursCTA`) to Payload CMS fields
- Adding "Tour that inspired this →" links to StoriesSection cards
- `stories/[slug].astro` vendor tour plumbing (separate task, pre-existing)
- Real testimonials replacing placeholder names (blocked on Maarten)
- Blog → tour conversion CTAs within blog posts themselves
