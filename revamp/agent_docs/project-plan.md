# Simply Enak — Project Plan
_Last updated: 2026-03-30_

**Goal:** `staging.simplyenak.com` → live as `simplyenak.com`, with solid SEO foundations.

**REALISTIC LAUNCH DATE:** Mid-to-late April 2026 (2-3 weeks from now)

**Total Effort Required:** 120-160 hours (3-4 weeks full-time)

**Key:** `[ME]` = Development | `[YOU]` = Pauline/Maarten | `[TOGETHER]` = we work through it

---

## OPEN QUESTIONS (blocking the plan)

These need answers before the plan can be fully sequenced:

1. **Launch date** — Target: mid-to-late April 2026?
2. **LinkedIn URLs** — for Maarten and Pauline
3. **TripAdvisor listing URL** — for the business page (not individual tours)
4. **Press archive URLs** — National Geographic Traveller (2015), Lonely Planet (2018), CNN Travel (2019)
5. **Meeting points** — confirmed you have multiple; what are they specifically? (KL + Penang)
6. **Review counts** — how many TripAdvisor/Google reviews does Simply Enak actually have? (Currently hardcoded as 1250, 500, and 150 in three different places — all wrong)

---

## CRITICAL BLOCKERS (Must Fix Before Launch)

### Content — NOT READY (14-21 hours)
- `[YOU]` Write 7 blog posts (1,000+ words each):
  - `understanding-mamak-culture`
  - `satay-master-kampung-baru`
  - `char-kway-teow-history`
  - `mamak-culture-complete-guide`
  - `teh-tarik-pouring-technique`
  - `why-we-dont-do-tourist-food`
  - [7th post TBD]
- `[YOU]` Upload founder portrait to Directus (homepage hero)
- `[YOU]` Upload vendor photos to Directus (10-15 photos)
- `[YOU]` Upload blog hero images (2 missing)

### Translations — IN PROGRESS
- `[ANOTHER AGENT]` ✅ Run all 9 translations (de, ms, zh, es, fr, nl, ru, ja, pt) — done via `--force` re-run with improved script
  - ⚠️ `pt` needs targeted re-run (`node scripts/translate-content.mjs --force --lang pt`) — was using "Brazilian Portuguese" prompt, now fixed to "Portuguese"
  - Next: `npm run sync` → push to deploy
- `[YOU]` Verify 8 language translations with native speakers:
  - ms (Bahasa Malaysia)
  - zh (Chinese)
  - es (Spanish)
  - fr (French)
  - nl (Dutch)
  - ru (Russian)
  - ja (Japanese)
  - pt (Portuguese)

### Directus — NEEDS REVIEW (4-8 hours)
- `[ME]` Audit Directus schema and content:
  - Duplicate/redundant fields
  - Content that can be reused
  - Fields to simplify/consolidate
  - Missing relationships between collections
  - Global vs. per-page data
- `[ME]` Create Directus audit report with recommendations
- `[ME]` Implement critical fixes (Week 2), defer non-critical to post-launch

### Security — ✅ COMPLETE
- `[ME]` ✅ Comment system removed (`Comments.astro` deleted)
- `[ME]` ✅ Form rate limiting — KV-based, deployed to worker (5/hr contact, 3/hr newsletter)
- `[ME]` ✅ CSP audited and tightened

### Accessibility (WCAG 2.1 AA) — NOT FULLY COMPLIANT (8-16 hours)
- `[ME]` Screen reader testing (NVDA, JAWS, VoiceOver)
- `[ME]` Keyboard-only navigation testing
- `[ME]` Color blindness simulation
- `[ME]` Zoom to 200% testing
- `[ME]` Touch target size verification (44px minimum)

### Analytics — PARTIALLY DONE
- `[ME]` ✅ Conversion tracking configured (purchase, generate_lead ×2, contact/whatsapp, view_item)
- `[ME]` Verify Search Console property + submit sitemap — defer to go-live (can't verify staging domain)
- `[ME]` Set up goal funnels in GA4 — post-launch

### Legal — NOT REVIEWED (6-12 hours)
- `[YOU]` Legal review: Privacy Policy (covers GA4, Cloudflare, LiveChat, Resend)
- `[YOU]` Legal review: Terms & Conditions (bookings, cancellations, liability)
- `[YOU]` Legal review: Cookie Policy (lists all cookies)

### Design — NEEDS WORK (40-66 hours total)
- `[ME]` **CRITICAL (5 issues — DONE ✅):**
  - Blog post content width (max-w-prose)
  - Blog post font size (18-20px)
  - Blog post line height (1.85)
  - Tour itinerary visual hierarchy
  - Food culture cards mobile layout

- `[ME]` **HIGH PRIORITY (12 issues — Week 2, partially done):**
  - Tour detail pages: "What Makes This Tour Different" section
  - ✅ Tour detail pages: Mobile itinerary less cramped — time column w-14 on mobile, py-6 padding
  - Tour detail pages: Mobile gallery full-width
  - Tour detail pages: Desktop sidebar booking widget sticky
  - Location pages: Heritage section typography
  - Location pages: Dishes grid standardized heights
  - Location pages: "Why Food Tours Matter" better contrast
  - Location pages: Mobile hero text reduced
  - Dietary pages: Safe dishes grid add images
  - Dietary pages: Dishes to avoid better warning
  - ✅ Tours index: Segment cards visual hierarchy — signature tour cards single-column on mobile, full content visible
  - ✅ Tours index: Segment cards mobile layout — bento grid heights responsive (240px mobile → 300px desktop)
  - Global: Primary button 44px minimum
  - Global: Card heights consistent
  - ✅ Global: Form inputs 44px minimum — min-h-[44px] on all TourSidebar inputs/textareas
  - ✅ Location pages: Food culture cards — lg:grid-cols-4 (all 4 cultures on one row on desktop)
  - Global: Language dropdown larger touch targets

- `[ME]` **MEDIUM PRIORITY (18 issues — Week 3):**
  - Mobile-specific optimizations
  - Desktop-specific optimizations
  - Performance optimization (Lighthouse 90+/100)

---

## PHASE 1 — Pre-Launch Blockers
_Must be done before going live. Order matters._

### Sprint 1: Critical Fixes (Week 1: Mar 31 - Apr 4)
**Goal:** All critical content + design complete

**Content Tasks:**
- `[YOU]` Write 7 blog posts (14-21 hours)
- `[YOU]` Upload all missing images (4-8 hours)
- `[ANOTHER AGENT]` Run all 9 translations

**Design Tasks:**
- `[ME]` ✅ Critical design issues (5 issues — COMPLETE)

**Directus Tasks:**
- `[ME]` Directus technical review (4-8 hours)
  - Audit all collections for duplicate fields
  - Identify reusable content
  - Create audit report with recommendations
  - Implement critical fixes in Week 2

**Gate to Sprint 2:** All blog posts written, all images uploaded, Directus audit complete.

### Sprint 2: High Priority (Week 2: Apr 7 - 11)
**Goal:** All high priority design + translations complete

**Design Tasks:**
- `[ME]` Tour detail pages (4-6 hours)
- `[ME]` Location pages (3-4 hours)
- `[ME]` Dietary/segment pages (2-3 hours)
- `[ME]` Tours index page (2-3 hours)
- `[ME]` Global components (2-4 hours)

**Content Tasks:**
- `[YOU]` Verify 8 language translations (8-16 hours)

**Gate to Sprint 3:** All high priority items complete.

### Sprint 3: Medium Priority + Testing (Week 3: Apr 14 - 18)
**Goal:** Accessibility compliant, performance optimized, legal reviewed

**Testing Tasks:**
- `[ME]` Accessibility testing (8-16 hours)
- `[ME]` Performance testing (4-8 hours)
- `[ME]` Mobile optimization (4-6 hours)

**Content/Legal Tasks:**
- `[YOU]` Legal review (6-12 hours)
- `[ME]` Analytics configuration (4-8 hours)

**Gate to Launch:** All medium priority items complete or deferred.

### Buffer Week: Polish + Launch Prep (Week 4: Apr 21 - 25)
**Goal:** Final QA, launch decision

**Tasks:**
- `[ME]` Low priority design (6-10 hours)
- `[ALL]` Launch preparation (8-12 hours)
- `[ALL]` Launch decision meeting (Apr 25)

**Launch Criteria:**
- ✅ All critical issues: FIXED
- ✅ All high priority issues: FIXED
- ✅ All medium priority issues: FIXED or DEFERRED
- ✅ Blog posts: 7+ published
- ✅ Images: All uploaded
- ✅ Translations: All verified
- 🔴 **Directus migrated to Dokploy** — HARD GATE. Do NOT launch without this. (See Phase 2 checklist including S3 + CDN setup)
- ✅ Accessibility: WCAG 2.1 AA compliant
- ✅ Performance: Lighthouse 90+/100
- ✅ Legal: All policies reviewed
- ✅ Analytics: Tracking configured

**Launch Date:** Apr 28, 2026 (if approved)

---

## PHASE 1A — Trivial fixes (Already Complete ✅)

- `[ME]` ✅ Fix `/tours` → `/tours/` trailing slash on homepage CTA
- `[ME]` ✅ Remove API endpoints from sitemap
- `[ME]` ✅ Clean up `robots.txt`
- `[ME]` ✅ Fix `Offer.price` to be a string
- `[ME]` ✅ Add `priceValidUntil` to tour schema
- `[ME]` ✅ Remove `FAQPage` schema from tour and dietary pages
- `[ME]` ✅ Fix `TouristDestination` geo on location pages
- `[ME]` ✅ Remove dead `/api/local-business-json.astro` endpoint
- `[ME]` ✅ Remove `via.placeholder.com` from CSP headers
- `[ME]` ✅ Add `"@context"` guard to schemas
- `[ME]` ✅ Fix inconsistent `reviewCount`
- `[ME]` ✅ Fix `dateModified` on stories
- `[ME]` ✅ Suppress "Further Reading" when stories are stubs
- `[ME]` ✅ Filter `getRelatedStories()` to exclude stubs
- `[ME]` ✅ Fix H2 overload on tour pages

---

## PHASE 1B — Needs your input (Directus content, 30–60 min total)

- `[YOU]` **CRITICAL:** Write 7 blog posts (14-21 hours)
- `[YOU]` **CRITICAL:** Upload founder portrait to Directus
- `[YOU]` **CRITICAL:** Upload vendor photos to Directus
- `[YOU]` Set `author_name` on all stories — "Pauline" or "Maarten"
- `[YOU]` Set founding year to 2011 consistently in `site_settings`
- `[YOU]` Set `PUBLIC_FORMS_WEBHOOK` env var in CF Pages dashboard

---

## PHASE 1C — SEO critical, I implement once you provide URLs

- `[YOU→ME]` Provide TripAdvisor listing URL
- `[YOU→ME]` Provide LinkedIn URLs (Maarten and Pauline)
- `[YOU→ME]` Provide press article URLs
- `[ME]` Add `sameAs` array to Organization schema
- `[ME]` Fix BlogPosting author on stories
- `[ME]` Enrich About page schema
- `[ME]` Add meeting point locations to LocalBusiness schema

---

## PHASE 1D — Hreflang (I implement, medium effort)

- `[ME]` Add `hreflangPath` prop to all page templates
- `[ME]` Add reciprocal hreflang return tags to `/de/`, `/zh/`, `/ms/`, `/es/` index pages

---

## PHASE 1E — Infrastructure (we do together)

- `[TOGETHER]` Add `staging.simplyenak.com` custom domain to CF Pages `revamp` project (✅ DONE)
- `[TOGETHER]` ✅ Move Directus from localhost → Dokploy server — DONE (`cms.simplyenak.com` live, PostgreSQL, all 11 collections bootstrapped)
- `[TODO]` Add `cms.system.simplyenak.com` for staging Directus

---

## PHASE 2 — Directus Migration
_Unlocks several other things. Do immediately after Phase 1._

[Rest of Phase 2 unchanged...]

---

## PHASE 3 — Content Foundations
_Can run in parallel with Phase 2. High SEO impact._

[Rest of Phase 3 unchanged...]

---

## PHASE 4 — Blog Content
_High SEO impact. Must have 7+ posts before launch._

### 4A — Blog post writing (Pauline/Maarten)
- `[YOU]` Write 7 blog posts (1,000+ words each)
- `[YOU]` Include: vendor names, specific dishes, cultural context
- `[YOU]` Add hero images to all posts
- `[ME]` ✅ Auto-noindex posts with <500 words
- `[ME]` ✅ Story categories wired (`tags` arrays on all 17 stories)
- `[ME]` ✅ `tour_ids` linked on 13 substantial stories
- `[ME]` ✅ Duplicate stub removed; stale redirects in `_redirects` fixed
- `[ME]` ✅ Archive — category filter pills + URL param pre-filtering
- `[ME]` ✅ Index — stub filtering, View All links, related stories by category
- `[ME]` ✅ H4 → H2 heading promotion in all 13 existing posts
- `[ME]` ✅ ToC anchor links working; ToC capped at 8 entries
- `[ME]` ✅ Schema `articleSection` + related stories label fixed to use `categories[0]`
- `[ME]` ✅ Prose headings uppercase removed
- `[ME]` ✅ Brand voice violations removed from all 13 existing posts
- ⚠️ **People & Stories section always empty** — only story (`family-recipes-generations`) is a stub. One real vendor story needed before this section appears.
- ⚠️ **E-E-A-T depth** — old posts are cleaned but lack firsthand specificity. Priority for Pauline/Maarten: named vendors, real observations, dates. Biggest remaining SEO lever.

### 4B — Author bios
- `[YOU]` Write 2–3 sentence bio for Pauline and Maarten
- `[ME]` Add `author_bio` field to Directus stories collection
- `[ME]` Render author bio below byline
- `[ME]` Add to Person schema nodes

---

**Document References:**
- `docs/SPRINT_PLAN_COMBINED.md` — Detailed sprint plan with timelines
- `docs/PRE_LAUNCH_BLOCKERS_REALISTIC.md` — Full blocker list
- `docs/COMPREHENSIVE_DESIGN_AUDIT.md` — 45 design issues found
- `agent_docs/project-status.md` — Current status dashboard

---

## PHASE 2 — Directus Migration
_Unlocks several other things. Do immediately after Phase 1._

### Steps (we do together, you execute on Dokploy)
1. `[ME]` Export local Postgres DB (`pg_dump`)
2. `[YOU]` Set up Directus service on Dokploy using `directus-deploy/docker-compose.yml`
3. `[YOU]` Set env vars in Dokploy (KEY, SECRET, DB credentials, S3 credentials, ADMIN credentials)
   - Include `STORAGE_LOCATIONS=s3` and Scaleway S3 credentials
   - Set `STORAGE_S3_PUBLIC_URL=https://cdn.simplyenak.com` ← critical: makes all Directus file URLs CDN URLs, keeps S3 bucket private
4. `[TOGETHER]` Import DB dump to server Postgres
5. `[YOU]` Add DNS record: `cms.simplyenak.com` → Dokploy server
6. `[ME]` Update `cdn-image-proxy` CF Worker to route to the S3 bucket Directus uses
7. `[ME]` Switch content pipeline from JSON snapshots to live SDK calls (`directus.js` Option A)
8. `[ME]` Set `PUBLIC_DIRECTUS_URL=https://cms.simplyenak.com` in CF Pages env vars ← without this, build falls back to localhost and CDN rewriting silently breaks
9. `[ME]` Set `DIRECTUS_URL` + `DIRECTUS_TOKEN` in CF Worker env vars
10. `[ME]` Set up Directus Flow: on content publish → trigger CF Pages rebuild webhook
    - Create hook in CF dashboard: staging project → Settings → Builds → Add deploy hook → copy URL
    - Then: Directus → Flows → New flow → trigger: Event Hook (items.update) → HTTP Request to hook URL
    - Note: Directus must be on Dokploy (accessible from internet) for this to work
11. `[ME]` Deploy updated Worker (`wrangler deploy` from `workers/forms/`)
12. `[ME]` Verify after first deploy: built HTML contains `cdn.simplyenak.com` URLs, S3 bucket still returns 403 direct, CDN returns 200

---

## PHASE 3 — Content Foundations
_Can run in parallel with Phase 2. High SEO impact._

### 3A — Vendor data (I set up schema, you provide names)
- `[YOU]` Provide 2–3 vendor names per flagship tour (name, what they make, how long they've been there)
- `[ME]` Populate vendors in Directus once you provide details
- Result: "Meet the People Behind the Food" sections render on tour pages — currently blank

### 3B — FAQ content (I can draft, you review)
- `[ME]` Draft 8 general FAQs (dietary, cancellation, walking distance, rain, group size, etc.)
- `[YOU]` Review and add any Simply Enak-specific answers
- `[ME]` Populate in Directus FAQs collection

### 3C — Testimonials (needs real data)
- `[YOU]` Pull 5–8 verbatim quotes from TripAdvisor with guest name, date, and platform
- `[ME]` Update testimonials in Directus with dates, platform source, and accurate review count
- `[ME]` Fix hardcoded `reviewCount: 1250` in schema to use real number from Directus

### 3D — Programmatic pages: convert from fake tours to real informational guides
**Full routing matrix and architecture: `agent_docs/programmatic-pages.md`**

The 30+ programmatic slug pages in the DB (dietary, neighbourhood, travel-type variants) should be
genuinely helpful guide pages that route to real tours — not fake tour listings.

Only 7 tours are real bookable products:
`kl-street-food`, `flavours-of-malaysia`, `secrets-of-kl-nightlife`, `eat-drink-george-town`,
`penang-street-food`, _(pudu tour)_, _(vegetarian private)_

**Code tasks:**
- `[ME]` Add `is_bookable` boolean field to `tours` Directus collection
- `[ME]` Differentiate `tours/[slug].astro` template: real tours show booking widget, informational pages show guide content + routing CTAs
- `[ME]` Implement CTA routing per matrix in `programmatic-pages.md`
- `[ME]` Create Ipoh, Melaka, Klang entries in `location-landing-pages` Directus collection
- `[ME]` Add these 3 city pages to `tours/locations/[slug].astro` (custom enquiry CTA only)

**Content tasks:**
- `[ME]` Draft neighbourhood guide content (Brickfields, Chinatown, Chow Kit, Kampung Baru, Georgetown Heritage, Gurney Drive, Little India Penang, Chowrasta Market)
- `[ME]` Draft dietary guide content (what halal/veg/vegan/GF means on a food tour in KL + Penang)
- `[YOU]` Review and add specific stall names, dishes, neighbourhood details

### 3E — Author bios
- `[YOU]` Write a 2–3 sentence bio for Pauline and one for Maarten (in your own voice)
- `[ME]` Add `author_bio` field to Directus stories collection
- `[ME]` Render author bio below byline on story pages
- `[ME]` Add to Person schema nodes with `description` and `sameAs` (LinkedIn)

### 3F — Press mentions
- `[YOU]` Find URLs for: National Geographic Traveller (2015), Lonely Planet (2018), CNN Travel (2019)
- `[ME]` Add source links to Track Record page cards and structured data

---

## PHASE 4 — Blog Content
_After Directus migration. Content goes directly into Directus, no code needed._

### 4A — Decision gate
- `[YOU]` Answer: 3 posts at launch, or all noindexed post-launch?

### 4B — If writing before launch (3 recommended posts)
Priority order:
1. `why-we-dont-do-tourist-food` — brand positioning, strong SEO target
2. `understanding-mamak-culture` — culture explainer, high search volume
3. `satay-master-kampung-baru` — vendor story (if Pak Din is real)

See `agent_docs/blog-writing-guide.md` for full guidance per post.
See `memory/questions_outstanding.md` for the 30 personal questions that need answering first.

### 4C — SEO content gaps to fill over first 90 days
- "food tour Malaysia" — hub page or expanded tour index
- "halal food tour Kuala Lumpur" — Kampung Baru tour slug/title needs "halal" added
- "vegetarian food tour Malaysia" — connect dietary pages with a hub piece
- "Penang food tour what to eat" — story or tour page expansion
- "Is a food tour worth it?" — consideration-stage story post

---

## PHASE 5 — GEO / AI Citation Strategy
_Parallel to post-launch SEO. Makes Simply Enak appear in ChatGPT, Perplexity, Google AI Overviews._

Full strategy in `agent_docs/geo-ai-strategy.md`. Guest data in `memory/simply_enak_guest_data.md`.

### Done ✓
- `[ME]` ✓ Dynamic `llms.txt` at `/llms.txt` — builds from Directus data (tours, vendors, FAQs)
- `[ME]` ✗ FAQPage schema — REMOVED (Google restricted to gov/health sites only; was hurting not helping)
- `[ME]` ✓ sameAs expanded: both TripAdvisor listings, LinkedIn, Viator, GetYourGuide, press URLs
- `[ME]` ✓ Rating fixed 5 → 4.9, priceRange updated to "RM 285–359"
- `[ME]` ✓ Guest count updated to 5,000+ everywhere (was 1,250+)
- `[ME]` ✓ "50+ countries" confirmed from phone data (49 identified)
- `[ME]` ✓ Brand name attribution — "Simply Enak" explicitly named in all key stats
- `[ME]` ✓ llms.txt includes verified stats, press coverage, top markets

### Remaining
- `[ME]` Add brand name explicitly in tour page body copy ("Let Simply Enak take you through…")
- `[ME]` Wikidata entry for Simply Enak → add `sameAs` link to Organization schema
- `[ME]` Guide author pages with Person schema + credentials
- `[YOU]` LinkedIn URLs for Maarten + Pauline (for Person schema sameAs)
- `[YOU→ME]` Blog posts with named statistics — biggest long-term GEO lever
- `[YOU]` Wikidata account to claim/create entry (or I draft for you to submit)

---

## PHASE 6 — Post-Launch SEO
_After go-live. Nice to have, not blocking._

- `[ME]` Add IndexNow submission to CF Pages build pipeline (key file already in `public/`)
- `[ME]` Add Bing Webmaster Tools verification meta tag
- `[ME]` Add `SearchAction` to WebSite schema node (sitelinks searchbox eligibility)
- `[ME]` Add `ItemList` of tours to location and dietary pages
- `[ME]` Preload Merriweather WOFF2 font to reduce LCP/CLS
- `[ME]` Route tour hero images through `cdn.simplyenak.com` proxy instead of direct S3
- `[ME]` Migrate `<img>` to Astro `<Image />` on tour cards + tour heroes (WebP + srcset + CLS fix) — do after story hero images are fixed (403s would break build)
- `[YOU]` Set up Google Business Profile as service-area business (hide private address, set KL + Penang as service areas)
- `[YOU]` Register Bing Webmaster Tools

---

## PHASE 5B — Accessibility (WCAG 2.1 AA)
_After go-live. Not a blocker, but important for legal coverage and inclusive UX._

- `[ME]` Audit colour contrast ratios — orange-on-cream, orange-on-dark, text-on-hero-image (need 4.5:1 for body, 3:1 for large text)
- `[ME]` Audit all `<img>` tags — verify meaningful alt text on content images, empty alt on decorative images
- `[ME]` Audit form labels — contact form, tour inquiry, newsletter input must have explicit `<label>` elements (not just placeholder)
- `[ME]` Audit focus states — all interactive elements (buttons, links, form inputs) must have visible focus ring
- `[ME]` Audit keyboard navigation — all interactive elements reachable and operable without mouse
- `[ME]` Fix any issues found in audit
- `[ME]` Test with screen reader (VoiceOver / NVDA) on key pages: homepage, tour detail, contact
- `[YOU]` Review ADA compliance summary — decide if privacy policy needs accessibility statement

---

## PHASE 6 — Ongoing
- `[ME]` ✅ All translations run — see Sprint 1 notes. Still need: pt re-run + sync + push
- `[ME]` Delete backup files (`Home-backup-*/`, `components-backup-*/`, etc.) — low priority
- `[YOU]` Answer the 30 blog content questions (see `memory/questions_outstanding.md`)
- `[YOU]` Write or dictate blog posts — I format and publish to Directus

---

## PHASE 7 — Programmatic Pages Content (Post-Launch)
_Critical for long-term SEO success. 1,035 pages need unique content._

**Interview First, Write Later:** Before writing any content, conduct a 60-90 minute interview with Pauline/Maarten using the questions in `docs/CONTENT_INTERVIEW_QUESTIONS.md`. This will gather all the vendor names, specific dishes, cultural insights, and stories needed for 150-220 hours of content in just 90 minutes of speaking.

### 7A — Noindex thin content (Before Launch) — ✅ DONE
- `[ME]` Add noindex to dietary pages with thin content
- `[ME]` Add noindex to specialty pages with thin content
- `[ME]` Add noindex to travel-type pages with thin content
- `[ME]` Add noindex to location×segment pages with thin content
- **Result:** 220 pages indexed, 1,035 pages noindexed until content ready

### 7B — Content Interview (Week 1-2) — 90 minutes
- `[YOU]` Schedule 60-90 minute interview with Pauline/Maarten
- `[ME]` Prepare recording setup (Zoom or phone recorder)
- `[YOU]` Conduct interview using `docs/CONTENT_INTERVIEW_QUESTIONS.md` (90 questions)
  - **Session 1 (60 min):** Questions 1-60 (content creation)
  - **Session 2 (30 min):** Questions 61-90 (profile-boosting)
- `[ME]` Transcribe interview (use Otter.ai, Rev.com, or similar)
- `[ME]` Extract vendor names, dish names, stories, and organize by page type
- **Output:** Enough raw material for 100+ pieces of unique content
- **See:** `docs/INTERVIEW_QUESTIONS_CONTENT_MAPPING.md` for question→content mapping

### 7C — Standalone segment pages (Week 2-4) — 50-70 hours
- `[YOU/WRITER]` Write 13 standalone segment pages (800-1,200 words each):
  - 5 dietary pages (vegetarian, halal, gluten-free, vegan, jain)
  - 4 specialty pages (street-food, market-tour, heritage, night-tour)
  - 4 travel-type pages (family, couples, solo, foodie)
- `[YOU]` Include: specific vendors, dishes, challenges, solutions, FAQs (from interview transcript)
- `[ME]` Remove noindex as content is added

### 7D — Location×segment pages (Month 2-3) — 100-150 hours
- `[YOU/WRITER]` Write ~50 location×segment pages (300-500 words each):
  - 10 dietary × 2 locations (KL, Penang)
  - 4 specialty × 2 locations
  - ~36 other combinations
- `[YOU]` Include: location-specific context, vendors, dishes (from interview transcript)
- `[ME]` Remove noindex as content is added

### 7E — Monitor & adjust (Ongoing)
- `[ME]` Track indexed pages in Search Console
- `[ME]` Monitor rankings for segment keywords
- `[YOU]` Adjust content strategy based on performance

**Total Content Effort:** 150-220 hours (4-6 weeks full-time)
**Recommendation:** Hire professional content writer + Pauline/Maarten review
**Shortcut:** 90-minute interview → transcript → content (10x faster than writing from scratch)

---

## Document References
- `docs/SPRINT_PLAN_COMBINED.md` — Detailed sprint plan with timelines
- `docs/PRE_LAUNCH_BLOCKERS_REALISTIC.md` — Full blocker list
- `docs/COMPREHENSIVE_DESIGN_AUDIT.md` — 45 design issues found
- `docs/DIRECTUS_TECHNICAL_AUDIT.md` — Directus schema audit
- `docs/SEO_DEEP_DIVE_AUDIT_REPORT.md` — SEO audit of 1,150 pages
- `docs/ACCESSIBILITY_TEST_REPORT.md` — Accessibility testing plan
- `docs/PERFORMANCE_FIXES_PUNCH_LIST.md` — Performance optimization punch list
- `docs/PROGRAMMATIC_PAGES_CONTENT_PLAN.md` — Content creation plan for 1,035 pages
- `docs/CONTENT_INTERVIEW_QUESTIONS.md` — **90 questions for Pauline/Maarten interview (START HERE)**
- `docs/INTERVIEW_QUESTIONS_CONTENT_MAPPING.md` — **Which questions → which content**
- `agent_docs/project-status.md` — Current status dashboard
- `agent_docs/blog-writing-guide.md` — How to write blog posts in Simply Enak voice
- `agent_docs/geo-ai-strategy.md` — GEO / AI citation strategy
All the trivial and code-only fixes listed in 1A. No input needed from you.
Shall I start?
