# Pages Collection Implementation Plan

## Context
32 non-bookable tours in Payload (status=draft, isBookable=false) function as SEO landing pages / neighborhood guides. They clutter the Tours collection and complicate the booking flow. This plan creates a clean separation.

## Decision: Preserve URLs for Go-Live
- Existing non-bookable pages live at `/tours/[slug]` (e.g. `/tours/food-tour-around-little-india-lebuh-queen/`)
- Moving URLs would break SEO and require CDN redirects
- **Solution**: `/tours/[slug].astro` checks `tours.json` first, then falls back to `pages.json`
- Data separation is achieved at the CMS layer; URLs stay the same
- Post-go-live: can add `/pages/[slug]` route + redirects if desired

## Implementation Steps

### 1. Backend — Create Pages Collection
- File: `backend/src/collections/Pages.ts`
- Schema: title, slug, type, status, tagline, short_description, full_description, location, highlights[], hero_image, meta fields
- Types: neighborhood, segment, dietary, general, city

### 2. Backend — Register Collection
- File: `backend/src/payload.config.ts`
- Add `Pages` import and register in `collections[]` array
- Add to `importExportPlugin` config

### 3. Sync Script — Add Pages Export
- File: `scripts/sync-payload.mjs`
- Add `pages` to coreItems array
- Create `transformPage()` function (similar to `transformTour()`)
- Output: `pages.json`

### 4. Frontend Data Layer
- File: `frontend/src/lib/content.js`
- Import `pagesData` from `@/data/content/pages.json`
- Add `getPageBySlug()`, `getAllPages()` functions

### 5. Frontend Route — Update Tour Detail Page
- File: `frontend/src/pages/tours/[slug].astro`
- Import `getPageBySlug()` from content.js
- In `getStaticPaths()`: also generate paths from pages.json
- In component: check if slug is a page first, then tour; if page, render guide template
- Same update for `frontend/src/pages/[lang]/tours/[slug].astro`

### 6. Migration Data
- File: `backend/scripts/payload-import/pages.json`
- Extract 32 non-bookable tours from existing tours.json
- Transform to Pages schema format

### 7. Post-Migration Cleanup
- After Pages are imported and verified, delete the 32 non-bookable tours from the Tours collection
- Update tours.json to only contain 5 bookable tours

## Files to Create/Modify

**Create:**
- `backend/src/collections/Pages.ts`
- `backend/scripts/payload-import/pages.json`

**Modify:**
- `backend/src/payload.config.ts`
- `scripts/sync-payload.mjs`
- `frontend/src/lib/content.js`
- `frontend/src/pages/tours/[slug].astro`
- `frontend/src/pages/[lang]/tours/[slug].astro`

## Non-Bookable Tour Slugs (32 total)

**Neighborhoods (8):**
- food-tour-around-little-india-lebuh-queen
- food-tour-around-gurney-drive
- food-tour-around-georgetown-heritage
- food-tour-around-bukit-bintang
- food-tour-around-chowrasta
- food-tour-around-jalan-alor
- food-tour-around-kl-heritage
- food-tour-around-jalan-imbi

**City Overviews (2):**
- foodie-tour-penang
- foodie-tour-kuala-lumpur

**Segments — Experience (5):**
- penang-street-food
- kl-street-food
- malaysian-food
- heritage-food
- night-food-tour

**Segments — Audience (7):**
- couples-food-tour
- family-food-tour
- group-food-tour
- vegetarian-food-tour
- vegan-food-tour
- halal-food-tour
- private-food-tour

**Dietary (10):**
- gluten-free-food-tour
- dairy-free-food-tour
- nut-free-food-tour
- shellfish-free-food-tour
- diabetic-friendly-food-tour
- low-carb-food-tour
- keto-food-tour
- paleo-food-tour
- jain-food-tour
- kosher-food-tour
