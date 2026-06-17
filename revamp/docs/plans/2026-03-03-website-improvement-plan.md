# Website Improvement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Increase organic CTR from 0.26% toward 1.0% by improving visual quality and conversion on tour detail pages, the homepage, contact page, and stories section.

**Architecture:** All pages are Astro SSG (`export const prerender = true`). Data comes from committed JSON snapshots via `frontend/src/lib/directus.js`. Two new small presentational components (`DishCard`, `ReviewCard`) are added to `frontend/src/components/TourDetails/`. Everything else is modifications to existing files.

**Tech Stack:** Astro 5 · TailwindCSS 4 · Cloudflare Pages (via GitHub Actions auto-deploy on push to main)

**Brand rules to follow on every task:**
- Show, don't claim: use vendor names, dish names, years, neighborhoods
- Forbidden words: authentic, premium, world-class, discover, immerse, unique, amazing, traditional (without context)
- Voice: warm, active, contractions, sensory detail
- Three-Feeling Test: WELCOMED · FASCINATED · CONNECTED

---

## Task 1: Create `DishCard.astro` component

**Files:**
- Create: `frontend/src/components/TourDetails/DishCard.astro`

**Context:** Tour detail pages need a visually engaging way to show dishes. Currently highlights are plain bullet lists. `DishCard` will be a cream-background card with an optional image, dish name, and one-line story. No interactivity needed.

**Step 1: Create the file**

```astro
---
interface Props {
  name: string;
  story: string;
  image?: string;
  vendor?: string;
}

const { name, story, image, vendor } = Astro.props;
---

<div class="flex flex-col bg-[#f9f6f2] rounded-xl overflow-hidden border border-orange/10 h-full">
  {image && (
    <div class="h-40 overflow-hidden shrink-0">
      <img
        src={image}
        alt={name}
        class="w-full h-full object-cover"
        loading="lazy"
        width={400}
        height={160}
      />
    </div>
  )}
  <div class="p-4 flex flex-col gap-1 flex-1">
    <p class="font-merriweather font-bold text-primary text-sm leading-snug">{name}</p>
    <p class="text-gray-600 text-xs leading-relaxed flex-1">{story}</p>
    {vendor && (
      <p class="text-[10px] uppercase tracking-widest text-orange font-bold mt-2">{vendor}</p>
    )}
  </div>
</div>
```

**Step 2: Verify build**

```bash
cd /var/home/maarten/website-optimization/revamp/frontend && npm run build 2>&1 | tail -10
```
Expected: `X pages built` with no errors.

**Step 3: Commit**

```bash
cd /var/home/maarten/website-optimization/revamp
git add frontend/src/components/TourDetails/DishCard.astro
git commit -m "feat: add DishCard component for tour detail pages"
```

---

## Task 2: Create `ReviewCard.astro` component

**Files:**
- Create: `frontend/src/components/TourDetails/ReviewCard.astro`

**Context:** Social proof is a key conversion lever (+20–35% per Unbounce research). ReviewCard shows a quote, attribution (name + country), platform, and optionally the tour name.

**Step 1: Create the file**

```astro
---
interface Props {
  quote: string;
  name: string;
  location: string;
  platform?: "TripAdvisor" | "Google";
  tour?: string;
}

const { quote, name, location, platform = "TripAdvisor", tour } = Astro.props;

const platformColor = platform === "Google" ? "#4285F4" : "#00AF87";
const platformLabel = platform === "Google" ? "Google Review" : "TripAdvisor";
---

<div class="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
  <!-- Decorative quote mark -->
  <span
    class="absolute top-3 left-5 font-merriweather font-bold leading-none select-none pointer-events-none"
    style={`font-size: 4rem; color: var(--color-orange); opacity: 0.15; line-height: 1;`}
    aria-hidden="true"
  >&ldquo;</span>

  <!-- Stars -->
  <div class="text-orange text-xs mb-3 relative z-10">★★★★★</div>

  <!-- Quote -->
  <p class="text-gray-700 text-sm leading-relaxed italic flex-1 relative z-10">"{quote}"</p>

  <!-- Attribution -->
  <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
    <div>
      <p class="font-semibold text-gray-800 text-sm">{name}</p>
      <p class="text-gray-500 text-xs">{location}{tour ? ` · ${tour}` : ''}</p>
    </div>
    <span class="text-[10px] font-bold uppercase tracking-wider" style={`color: ${platformColor};`}>
      {platformLabel}
    </span>
  </div>
</div>
```

**Step 2: Verify build**

```bash
cd /var/home/maarten/website-optimization/revamp/frontend && npm run build 2>&1 | tail -10
```

**Step 3: Commit**

```bash
cd /var/home/maarten/website-optimization/revamp
git add frontend/src/components/TourDetails/ReviewCard.astro
git commit -m "feat: add ReviewCard component for social proof sections"
```

---

## Task 3: Improve tour detail hero + add hook section

**Files:**
- Modify: `frontend/src/pages/tours/[slug].astro`

**Context:** The current hero has the photo at `opacity-60` with a simple gradient overlay. The visual quality is good but the hook — a visceral, sensory opening paragraph — is missing. The hook should appear right below the hero, full-width, before the sidebar layout. This is the "taste it before you eat it" moment.

**Step 1: Read the current hero section (lines ~95–145)**

```bash
sed -n '90,150p' /var/home/maarten/website-optimization/revamp/frontend/src/pages/tours/[slug].astro
```

**Step 2: Improve hero gradient for more visual impact**

Find this in the hero section:
```html
<div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
```

Replace with a richer gradient that keeps the photo visible at the top:
```html
<div class="absolute inset-0" style="background: linear-gradient(to top, rgba(26,26,26,0.97) 0%, rgba(26,26,26,0.55) 45%, rgba(26,26,26,0.15) 100%);"></div>
```

**Step 3: Add hook paragraph below hero, before the main grid**

Locate the comment `<!-- ===================== MAIN CONTENT + SIDEBAR ===================== -->` and insert a hook section immediately above it:

```astro
<!-- ===================== HOOK ===================== -->
{tour.short_description && (
  <div class="bg-[#f9f6f2] border-b border-orange/15">
    <div class="main-container py-8 md:py-10">
      <p class="font-merriweather italic text-gray-700 text-lg md:text-xl leading-relaxed max-w-3xl">
        {tour.short_description}
      </p>
    </div>
  </div>
)}
```

**Step 4: Verify build and check output**

```bash
cd /var/home/maarten/website-optimization/revamp/frontend && npm run build 2>&1 | tail -10
```

**Step 5: Commit**

```bash
cd /var/home/maarten/website-optimization/revamp
git add frontend/src/pages/tours/[slug].astro
git commit -m "feat: improve tour detail hero gradient and add hook section"
```

---

## Task 4: Check itinerary tastings and add DishCard to itinerary stops

**Files:**
- Modify: `frontend/src/pages/tours/[slug].astro`

**Context:** The "Why You'll Love This Tour" highlights section (green checkmark grid) is already well-designed — leave it untouched. However, each `itinerary` stop has a `tastings?: string[]` field listing specific dishes at that stop. Currently tastings are probably rendered as a plain sub-list. `DishCard` can enhance how they look within the itinerary without changing the itinerary structure.

**Step 1: Read the current itinerary section**

```bash
grep -n -A 30 "3. Itinerary" /var/home/maarten/website-optimization/revamp/frontend/src/pages/tours/[slug].astro | head -50
```

**Step 2: Check if tastings are rendered inside itinerary stops**

If tastings are shown as `<ul><li>` items, replace that sub-list with DishCard rows. If tastings are not rendered at all, add them.

Add the import:
```astro
import DishCard from "@/components/TourDetails/DishCard.astro";
```

**Step 3: Inside the itinerary stop loop, enhance tastings display**

Find the tastings sub-rendering (something like `{stop.tastings?.map(t => <li>{t}</li>)}`) and update to:

```astro
{stop.tastings && stop.tastings.length > 0 && (
  <div class="mt-3 grid grid-cols-2 gap-2">
    {stop.tastings.map((t: string) => (
      <DishCard name={t} story="" />
    ))}
  </div>
)}
```

If no tastings are rendered at all yet, this is additive and safe.

**Step 4: Verify build**

```bash
cd /var/home/maarten/website-optimization/revamp/frontend && npm run build 2>&1 | tail -10
```

**Step 5: Commit**

```bash
cd /var/home/maarten/website-optimization/revamp
git add frontend/src/pages/tours/[slug].astro
git commit -m "feat: add DishCard to itinerary tasting items"
```

---

## Task 5: Add ReviewCard social proof section to tour detail

**Files:**
- Modify: `frontend/src/pages/tours/[slug].astro`

**Context:** `testimonials` is already fetched via `getFeaturedTestimonials()`. We need to render 3 of them using ReviewCard, with a heading and platform badges. Place this section below the itinerary, before the FAQ.

**Step 1: Add the import**

```astro
import ReviewCard from "@/components/TourDetails/ReviewCard.astro";
```

**Step 2: Inspect the testimonials data shape**

```bash
grep -n "testimonial" /var/home/maarten/website-optimization/revamp/frontend/src/lib/directus.js | head -20
```

This will show the fields available (typically: `quote`, `reviewer_name`, `reviewer_location`, `platform`, `tour_name` or similar).

**Step 3: Add the social proof section**

Find the `<!-- 4. Photo Gallery -->` comment (or wherever testimonials are currently rendered). Insert the ReviewCard section before the gallery or FAQ:

```astro
<!-- Social Proof -->
{testimonials.length > 0 && (
  <section class="mb-10">
    <h2 class="font-merriweather font-bold text-xl text-primary mb-2">
      What Guests Say
    </h2>
    <p class="text-gray-500 text-sm mb-6">
      ★★★★★ on TripAdvisor & Google &nbsp;·&nbsp; {testimonials.length}+ reviews
    </p>
    <div class="grid md:grid-cols-3 gap-4">
      {testimonials.slice(0, 3).map((t: any) => (
        <ReviewCard
          quote={t.quote ?? t.content ?? t.review ?? ''}
          name={t.reviewer_name ?? t.name ?? 'Guest'}
          location={t.reviewer_location ?? t.location ?? ''}
          platform={t.platform === 'Google' ? 'Google' : 'TripAdvisor'}
          tour={tour.name}
        />
      ))}
    </div>
  </section>
)}
```

Note: adapt the field names (`t.quote`, `t.reviewer_name`, etc.) based on what Step 2 reveals about the actual data shape.

**Step 4: Verify build**

```bash
cd /var/home/maarten/website-optimization/revamp/frontend && npm run build 2>&1 | tail -10
```

**Step 5: Commit**

```bash
cd /var/home/maarten/website-optimization/revamp
git add frontend/src/pages/tours/[slug].astro
git commit -m "feat: add ReviewCard social proof section to tour detail"
```

---

## Task 6: Add mobile sticky booking strip to tour detail

**Files:**
- Modify: `frontend/src/pages/tours/[slug].astro`

**Context:** On mobile, the sidebar is hidden and the main booking CTA is buried. A sticky bottom bar on mobile showing price + "Book This Tour" button removes the need to scroll. Hidden on `md:` and above where the sidebar handles booking.

**Step 1: Add sticky strip just before `</Layout>`**

At the very bottom of the template, before `</Layout>`, add:

```astro
<!-- Mobile sticky booking strip -->
{tour.price && (
  <div class="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-dark border-t border-orange/20 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
    <div class="leading-none">
      <div class="text-[10px] uppercase tracking-widest text-gray-400">From</div>
      <div class="font-merriweather font-bold text-orange text-xl">{tour.currency ?? 'RM'} {tour.price}</div>
    </div>
    <a
      href="/contact/"
      class="flex-1 max-w-[200px] inline-flex items-center justify-center px-5 py-3 bg-primary text-white font-bold text-xs uppercase tracking-[0.12em] rounded-sm shadow-xl"
    >
      Book This Tour
    </a>
  </div>
)}
```

**Step 2: Add bottom padding to main content so the sticky bar doesn't cover it on mobile**

Find the `<Layout>` opening tag and add a wrapping `<div class="pb-20 md:pb-0">` around the page content, or add `pb-20 md:pb-0` to the last section before `</Layout>`.

**Step 3: Verify build**

```bash
cd /var/home/maarten/website-optimization/revamp/frontend && npm run build 2>&1 | tail -10
```

**Step 4: Take a Playwright screenshot at mobile viewport to confirm the strip shows**

Use `example-skills:webapp-testing` skill if available, or run:
```bash
# Start preview server in background, take screenshot with playwright, then kill
cd /var/home/maarten/website-optimization/revamp/frontend && npm run preview &
sleep 5
# then use playwright MCP to screenshot localhost:4321/tours/kl-street-food-tour/ at 390x844
```

**Step 5: Commit**

```bash
cd /var/home/maarten/website-optimization/revamp
git add frontend/src/pages/tours/[slug].astro
git commit -m "feat: add mobile sticky booking strip to tour detail"
```

---

## Task 7: Fix homepage copy — price, subtitle, secondary CTA

**Files:**
- Modify: `frontend/src/components/Home/HeroSection.astro`

**Context:** Three data accuracy issues in the hero: (1) price shows "From RM 180" but correct minimum is RM 285, (2) secondary CTA says "Our Story" which is ambiguous, (3) subtitle can be more personal per brand guidelines.

**Step 1: Read current values**

```bash
grep -n "180\|priceInfo\|ctaSecondary\|subtitle" /var/home/maarten/website-optimization/revamp/frontend/src/components/Home/HeroSection.astro
```

**Step 2: Update the three values**

Find:
```js
priceInfo: Astro.props.priceInfo ?? "From RM 180 · 4–5 hours · Max 8 people",
```
Replace with:
```js
priceInfo: Astro.props.priceInfo ?? "From RM 285 · 4–5 hours · Max 8 people",
```

Find:
```js
subtitle: Astro.props.subtitle ?? "Walk with a local. Taste real stories. See the Malaysia most tourists miss.",
```
Replace with:
```js
subtitle: Astro.props.subtitle ?? "We've been eating at these stalls for 20 years. Let us take you there.",
```

Find:
```js
ctaSecondaryText: Astro.props.ctaSecondaryText ?? "Our Story",
```
Replace with:
```js
ctaSecondaryText: Astro.props.ctaSecondaryText ?? "How It Works",
ctaSecondaryUrl: Astro.props.ctaSecondaryUrl ?? "/about/",
```

**Step 3: Verify build**

```bash
cd /var/home/maarten/website-optimization/revamp/frontend && npm run build 2>&1 | tail -10
```

**Step 4: Commit**

```bash
cd /var/home/maarten/website-optimization/revamp
git add frontend/src/components/Home/HeroSection.astro
git commit -m "fix: correct hero price (RM 285), improve subtitle and secondary CTA"
```

---

## Task 8: Improve contact page — warm headline and WhatsApp parity

**Files:**
- Modify: `frontend/src/pages/contact.astro`
- Read first: `frontend/src/components/Contact/GetInTouchSection.astro`

**Context:** The contact page uses a `GetInTouchSection` component. We need to: (1) ensure the hero headline is warm not transactional, (2) check form field count (max 5), (3) add WhatsApp as equal-weight alternative if it isn't already prominent.

**Step 1: Read the current contact page hero data**

```bash
sed -n '30,80p' /var/home/maarten/website-optimization/revamp/frontend/src/pages/contact.astro
```

**Step 2: Update the hero title if it's transactional**

Find the `heroSection.title` value. If it says "Contact Us" or similar, update to something like:
```
"Let's Plan Your Table"
```

And the hero description to:
```
"Tell us what you're curious about. We read every message and reply within 3 hours."
```

**Step 3: Read GetInTouchSection to check form fields**

```bash
cat /var/home/maarten/website-optimization/revamp/frontend/src/components/Contact/GetInTouchSection.astro
```

Count the form fields. If more than 5, identify which to make optional or remove. The ideal set is:
- Name (required)
- Email (required)
- Tour interested in (dropdown, required)
- Preferred date (optional, `<input type="date">`)
- Message (optional textarea)

**Step 4: If form has > 5 required fields, make extras optional**

Add `(optional)` label text and remove `required` attribute from the least critical fields. Do NOT restructure the form — just relax constraints.

**Step 5: Add WhatsApp CTA near the form submit button if not already present**

In `GetInTouchSection.astro`, find the submit button and add below it:
```astro
<p class="text-center text-sm text-gray-500 mt-4">
  Prefer to chat?
  <a
    href="https://wa.me/60172878929"
    target="_blank"
    rel="noopener noreferrer"
    class="text-[#25D366] font-semibold hover:underline"
  >
    WhatsApp us instead →
  </a>
</p>
```

**Step 6: Verify build**

```bash
cd /var/home/maarten/website-optimization/revamp/frontend && npm run build 2>&1 | tail -10
```

**Step 7: Commit**

```bash
cd /var/home/maarten/website-optimization/revamp
git add frontend/src/pages/contact.astro frontend/src/components/Contact/GetInTouchSection.astro
git commit -m "feat: warm contact page headline, WhatsApp parity, form friction reduction"
```

---

## Task 9: Improve stories index — editorial grid layout

**Files:**
- Modify: `frontend/src/pages/stories/index.astro`

**Context:** The stories index page is a key SEO lever — each story drives long-tail organic traffic. The current layout groups stories by category (People & Stories, Food Culture, Culture & Heritage). We want to make it more visually editorial: a large featured story at top, then a 3-column card grid below, with category filter badges.

**Step 1: Read the full current stories/index.astro**

```bash
cat /var/home/maarten/website-optimization/revamp/frontend/src/pages/stories/index.astro
```

**Step 2: Identify the featured story**

Add a variable to pick the featured story (first story, or any `featured: true` flag):
```astro
const featuredStory = allStories[0];
const remainingStories = allStories.slice(1);
```

**Step 3: Add a featured story row above the grid**

Find where the stories grid starts and insert before it:
```astro
<!-- Featured Story -->
{featuredStory && (
  <Section>
    <a href={`/stories/${featuredStory.slug}/`} class="group grid md:grid-cols-2 gap-8 items-center">
      <div class="rounded-xl overflow-hidden h-64 md:h-80">
        <img
          src={featuredStory.cover_image ?? featuredStory.image}
          alt={featuredStory.title}
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="eager"
          width={800}
          height={500}
        />
      </div>
      <div>
        <Badge>{featuredStory.categories?.[0] ?? 'Story'}</Badge>
        <h2 class="font-merriweather font-bold text-2xl md:text-3xl text-primary mt-3 mb-3 leading-snug group-hover:text-orange transition-colors">
          {featuredStory.title}
        </h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          {featuredStory.excerpt ?? featuredStory.description ?? ''}
        </p>
        <span class="text-primary font-semibold text-sm group-hover:underline">Read the story →</span>
      </div>
    </a>
  </Section>
)}
```

**Step 4: Update the stories grid to 3 columns**

Find the current stories grid rendering and ensure it uses `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` with consistent card height. Adapt field names to match what `getAllStories()` actually returns (check the data shape from Step 1).

**Step 5: Verify build**

```bash
cd /var/home/maarten/website-optimization/revamp/frontend && npm run build 2>&1 | tail -10
```

**Step 6: Commit**

```bash
cd /var/home/maarten/website-optimization/revamp
git add frontend/src/pages/stories/index.astro
git commit -m "feat: editorial layout for stories index — featured story + 3-col grid"
```

---

## Task 10: Push to staging and validate

**Step 1: Push all commits to trigger auto-deploy**

```bash
cd /var/home/maarten/website-optimization/revamp
git push
```

The GitHub Actions workflow `Deploy Frontend to Cloudflare Pages` auto-triggers and deploys to `staging.simplyenak.com`.

**Step 2: Wait for deploy and check workflow status**

```bash
gh run list --repo simplyenak/revamp --limit 3
```

Wait for status to be `completed` / success.

**Step 3: Take Playwright screenshots**

Use `example-skills:webapp-testing` or Playwright MCP to screenshot these at 1440×900 and 390×844:
- `https://staging.simplyenak.com/tours/kl-street-food-tour/`
- `https://staging.simplyenak.com/`
- `https://staging.simplyenak.com/contact/`
- `https://staging.simplyenak.com/stories/`

**Step 4: Validate checklist**

For each page:
- [ ] No horizontal scroll on mobile
- [ ] CTA visible above fold on mobile without sticky bar covering content
- [ ] Price shows RM 285 on homepage
- [ ] Tour detail DishCards render (even without images, name + story shows)
- [ ] ReviewCards render if testimonials exist in Directus data
- [ ] Contact page WhatsApp link visible
- [ ] Stories shows featured story + grid below
- [ ] Build produced zero TypeScript errors

**Step 5: Fix any issues found, then commit + push**

---

## Notes for implementer

- **Data fields**: The Directus JSON snapshots in `frontend/src/data/content/*.json` are the source of truth. If a field like `t.reviewer_name` doesn't exist, check the actual JSON structure with `cat frontend/src/data/content/testimonials.json | head -30`.
- **No new pages**: All work modifies existing files or adds small components. The sitemap does not need updating.
- **Brand voice check**: Before committing any copy change, re-read it against the "Show, don't claim" rule. If you wrote "authentic", replace it with a specific detail.
- **Images**: If `tour.gallery_images` or testimonial photos are empty, components degrade gracefully (DishCard hides the image div, ReviewCard still shows the quote).
- **TourSidebar**: Leave `TourSidebar.astro` untouched — it handles the desktop booking UI and is already functional.
