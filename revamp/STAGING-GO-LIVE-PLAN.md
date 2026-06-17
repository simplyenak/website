# Staging Go-Live Fix Plan

## Current State Snapshot

- **Branch**: `staging`
- **Project**: Simply Enak Website Revamp (Astro 6 + Payload 3 + Cloudflare Pages)
- **Assessment Date**: 2026-04-24

---

## Phase 1: BLOCKERS (Must Fix Before Any Traffic)

### 1.1 Fix Navigation JSON/Code Mismatch
**File**: `frontend/src/lib/content.js` (lines 512, 533)
**Problem**: `navigationData.header_links` and `navigationData.footer_links` are `undefined`. The actual navigation data lives in `siteSettingsData.main_navigation` and `siteSettingsData.footer_navigation`.
**Impact**: Footer quick links are empty. Header falls back to hardcoded items.
**Fix**:
- Change `navigationData.header_links` → `siteSettingsData.main_navigation`
- Change `navigationData.footer_links` → `siteSettingsData.footer_navigation`
- Check for `mobile_links` / `mobile_navigation` usage and update similarly
- Verify `getHeaderNavItems()`, `getFooterLinks()` return populated arrays
- Verify header.astro and footer.astro render links correctly
- Verify vendors link conditional insertion still works

**STATUS: FIXED 2026-04-24** — `content.js` getter functions updated. `navigation.json` has header (5 links), footer (6 links), mobile (5 links), social, contact data.

### 1.2 Fix Stories Status Filter
**File**: `frontend/src/lib/content.js` (line 312)
**Problem**: All 23 stories have `status: "draft"` but `_status: "published"`. The code filters by `s.status === 'published'`, so **zero stories display**.
**Impact**: /stories page is completely empty.
**Fix**:
- Update `getStories()`, `getFeaturedStories()`, `getStoriesByCategory()`, `getRelatedStories()` to filter by `_status === 'published'` (or both `status === 'published' || _status === 'published'`)
- Alternatively: batch-update all 23 stories in `stories.json` to change `status` from `"draft"` → `"published"` (code fix preferred — data is from Payload export)

**STATUS: FIXED 2026-04-24** — All `._status === 'published'` filters updated across 8 files. Stories JSON has 23 entries, all `_status: "published"`.

### 1.3 Remove/Hide 7 Story Stubs
**File**: `frontend/src/data/content/stories.json`
**Problem**: Stories ids 1-7 have `content` equal to `excerpt` (single sentence). These are 20-30% complete stubs.
**List of stubs**:
1. "The Satay Master of Kampung Baru"
2. "The Heritage Behind Malaysian Food"
3. "Understanding Mamak Culture"
4. "Family Recipes Passed Down Through Generations"
5. "Why We Don't Do 'Tourist' Food"
6. "Why Street Food Is The Soul Of Malaysia"
7. "11 Foods To Try During Hari Raya"
**Fix**:
- Option A: Delete the 7 stub entries from stories.json (cleanest for go-live)
- Option B: Change their `_status` to `"draft"` so they don't show even after the filter fix
- **Recommended**: Option A — remove stubs entirely, keep 16 complete stories

**DECISION: KEEP STUBS — Maarten elected to keep all 23 stories (including stubs) for later completion. No action taken.**

---

## Phase 2: HIGH PRIORITY (Empty Content Zones)

### 2.1 Fill Thank-You Pages
**File**: `frontend/src/data/content/thank-you-pages.json`
**Problem**: 3 pages have empty `message`, empty `cta_section_cta_buttons`, empty `next_steps`.
**Impact**: Users see blank pages after booking.
**Fix**: Populate each thank-you page with:
- A warm confirmation message
- Next steps (check email, what to expect, prepare for tour)
- CTA buttons (Back to Home, Browse More Tours, Contact Us)

### 2.2 Fill Home Page Empty Sections
**File**: `frontend/src/data/content/home-page.json`
**Problem**: 14 fields are null across `about_*`, `vendors_*`, `press_*`, `expect_stat*`, etc.
**Impact**: About section, vendors section, press section render empty or with gaps.
**Fix**: Populate the following fields in all 3 languages (en, ms, de):
- `about_eyebrow`, `about_title`, `about_subtitle`, `about_description`, `about_heritage`, `about_image`
- `vendors_title`, `vendors_description`, `vendors_cta_label`, `vendors_cta_link`
- `expect_stat2_value`, `expect_stat2_label`, `expect_stat3_value`, `expect_stat3_label`, `expect_stat4_value`, `expect_stat4_label` (en is null, ms/de have values)
- `press_title`, `press_subtitle`
- `quiz_heading`, `quiz_subtitle`, `quiz_cta_text`

### 2.3 Fill Values-Stories & Vendors JSON
**File**: `frontend/src/data/content/values-stories.json` and `vendors.json`
**Problem**: Both files are essentially empty arrays.
**Impact**: Values section and vendors section have no data to render.
**Fix**:
- Create `values-stories.json` with 3-4 brand value stories (e.g., "14 Years of Curiosity", "Local-First", "Small Groups, Big Connections")
- Create `vendors.json` with key vendor partners (e.g., featured hawkers, restaurants, artisans)
- Or: remove/deprecate these sections from the home page if not needed for go-live

**DECISION: SWITCH OFF — Maarten elected to hide both sections for staging. `show_vendors: false` and `show_values: false` already set in `site-settings.json` (lines 119-120). `index.astro` gates both sections correctly.**

### 2.4 Fix Social Proof Empty State
**File**: `frontend/src/components/SocialProof.astro` + `frontend/src/data/content/site-settings.json`
**Problem**: Component hardcodes review counts (520, 380, 350) but reads rating/review_count from site-settings which has `null` values.
**Impact**: Platform badges show without real counts, looks untrustworthy.
**Fix**:
- Populate `tripadvisor_reviews_count`, `google_reviews_count`, `facebook_reviews_count` in site-settings.json
- OR: Update SocialProof.astro to pull counts from testimonials.json (count actual testimonials) or hide the counts if data is unavailable
- Ensure `tripadvisor_rating`, `google_rating`, `facebook_rating` are set

### 2.5 Fix Testimonials Visibility
**File**: `frontend/src/data/content/testimonials.json`
**Problem**: All 5 testimonials have `workflowStatus: "draft"` and `_status: "published"`. The code may or may not filter by `workflowStatus`.
**Impact**: Testimonials may not show on home page or tour pages.
**Fix**:
- Check content.js to see which field is used for filtering testimonials
- Update filtering logic OR update testimonial `workflowStatus` to `"published"`
- Verify testimonials render on home page and individual tour pages

---

## Phase 3: MEDIUM PRIORITY (Polish & Trust)

### 3.1 Fix Contact Email Mismatch
**File**: `frontend/src/data/content/site-settings.json`
**Problem**: `contact_email` may not match the actual booking/support email.
**Fix**: Verify and correct `contact_email` to the correct address (e.g., `info@simplyenak.com` or `hello@simplyenak.com`).

### 3.2 Fix Hardcoded Review Counts
**File**: `frontend/src/components/SocialProof.astro`
**Problem**: Platform review counts (520, 380, 350) are hardcoded in the component.
**Fix**:
- Replace hardcoded counts with dynamic values from site-settings.json
- Add fallback: if counts are null, hide the number or show "See reviews" instead of a fake count

### 3.3 Translation Coverage Gaps
**Files**: Multiple `*.json` files in `frontend/src/data/content/`
**Problem**: Not all fields have ms/de translations. Home page has null fields in en for expect_stats.
**Fix**: Fill missing translations for:
- Home page expect stats (en values are null)
- Thank-you page messages
- Any null fields in site-settings.json localized strings

### 3.4 Thin Content on 32 SEO Landing Pages
**Files**: `frontend/src/data/content/seo-landing-pages.json`
**Problem**: 32 pages at 40-60% completion.
**Impact**: Poor SEO value, may hurt rankings.
**Fix**:
- For go-live: ensure all 32 pages have at least 300+ words, a heading, and a clear CTA
- Identify the 5-10 highest-traffic potential pages and prioritize those
- Remove or noindex the weakest pages if they can't be improved quickly

**DECISION: KEEP AS THIN — Maarten elected to keep all 32 (now 15 primary) SEO landing pages as thin content for organic crawlability. These are not linked from navigation; they exist for search engine discovery. Will be enriched post-launch.**

### 3.5 Add OG Images
**File**: `frontend/src/data/content/site-settings.json` + individual page meta
**Problem**: No OG images configured for social sharing.
**Fix**:
- Set a default OG image in site-settings (`og_image` or `meta.image`)
- Ensure each tour page has a `meta.image` fallback to the tour's featured image
- Verify `og:title` and `og:description` are populated for all pages

---

## Phase 4: FINAL QA & GO-LIVE CHECKLIST

### 4.1 Build Verification
- [ ] `npm run build` passes with zero errors
- [ ] All data JSON files are valid (no trailing commas, no syntax errors)
- [ ] No broken links in navigation (header + footer + mobile)

### 4.2 Content Verification
- [ ] Home page renders all sections with content (no blank zones)
- [ ] /stories page shows 16 published stories (no stubs)
- [ ] /tours page shows all 5 bookable tours
- [ ] Each tour page has: description, itinerary, FAQs, testimonials
- [ ] Thank-you pages have confirmation message + next steps + CTAs
- [ ] Social proof section shows real review counts (or hides counts gracefully)
- [ ] Contact page email is correct and clickable

### 4.3 Cross-Language Verification
- [ ] ms and de home pages render correctly (no missing translations)
- [ ] Language switcher works on all major pages
- [ ] No English fallback leaking into ms/de where it shouldn't

### 4.4 SEO & Meta Verification
- [ ] Every page has `<title>` and `<meta name="description">`
- [ ] OG tags present on home page, tour pages, stories pages
- [ ] Canonical URLs set correctly
- [ ] No duplicate meta descriptions

### 4.5 Analytics & Tracking
- [ ] Google Analytics / GTM ID is configured in site-settings
- [ ] Booking conversion events fire correctly
- [ ] No console errors on key pages

---

## Task List by File

| File | Fixes Needed | Phase |
|------|-------------|-------|
| `content.js` | Nav getter fixes, stories filter fix | 1 |
| `stories.json` | Remove 7 stubs, fix status OR update filter | 1 |
| `thank-you-pages.json` | Fill message, CTAs, next_steps | 2 |
| `home-page.json` | Fill about, vendors, press, expect_stats, quiz | 2 |
| `values-stories.json` | Create content or deprecate | 2 |
| `vendors.json` | Create content or deprecate | 2 |
| `site-settings.json` | Fix contact_email, review counts, OG image | 2-3 |
| `SocialProof.astro` | Remove hardcoded counts | 2-3 |
| `testimonials.json` | Fix workflowStatus vs _status | 2 |
| `seo-landing-pages.json` | Fill thin content (32 pages) | 3 |

---

## Decisions Needed From Maarten

1. ~~Story stubs: Delete the 7 stubs or keep as drafts for later completion?~~ **DECIDED: Keep all 23 stories (including stubs) for later completion.**
2. ~~Values/Vendors sections: Fill with real content for go-live, or remove from home page temporarily?~~ **DECIDED: Switch off (`show_vendors: false`, `show_values: false`). Hidden from home page.**
3. ~~SEO landing pages: Which 5-10 are highest priority? Can we remove or noindex the rest?~~ **DECIDED: Keep all 15+ as thin content for organic search. Will enrich post-launch.**
4. **Review counts**: Do you have actual TripAdvisor/Google/Facebook review counts? If not, should we hide counts or show approximate numbers?
5. **Contact email**: What is the correct email for customer inquiries?

---

## UPDATE LOG

| Date | Changes |
|------|---------|
| 2026-04-24 | Initial plan created. Phase 1 blockers identified. |
| 2026-04-24 | **Phase 1 FIXED**: Navigation getter, stories `_status` filter, vendors/values toggled off. Decisions recorded. Build passes (720 pages, 7.76s). |

## Estimated Effort

| Phase | Tasks | Est. Time |
|-------|-------|-----------|
| Phase 1 (Blockers) | 3 fixes | 1-2 hours |
| Phase 2 (High Priority) | 5 fixes | 3-4 hours |
| Phase 3 (Medium Priority) | 5 fixes | 2-3 hours |
| Phase 4 (QA) | 5 checklists | 1-2 hours |
| **Total** | | **7-11 hours** |

---

*Plan created: 2026-04-24*
*Ready for review — shall I start with Phase 1?*
