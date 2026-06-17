# Pre-Launch Status

Goal: `staging.simplyenak.com` → live as `simplyenak.com`.

**REALISTIC STATUS:** 🔴 **NOT READY FOR PRODUCTION**

**Critical Blockers:** 7 remaining sections (Security ✅ fully done)
**Estimated Launch:** Mid-to-late April 2026 (2-3 weeks from now)

---

## 🚨 CRITICAL BLOCKERS (Must Fix Before Launch)

### Content — NOT READY
- [ ] **7 Blog Posts Are Empty Stubs** — TL;DR only, no actual content
  - `understanding-mamak-culture`
  - `satay-master-kampung-baru`
  - `char-kway-teow-history`
  - `mamak-culture-complete-guide`
  - `teh-tarik-pouring-technique`
  - `understanding-mamak-culture` (hero image missing)
  - `why-we-dont-do-tourist-food` (hero image missing)
  - **Effort:** 14-21 hours (2-3 hours per post)
  - **Owner:** Pauline/Maarten

- [ ] **Founder Portrait Missing** — Homepage hero uses `placehold.co` fallback
  - **Effort:** 30 min (upload to Directus)
  - **Owner:** Pauline/Maarten

- [ ] **Vendor Photos Not Uploaded** — Tour vendor sections blank
  - **Effort:** 2-4 hours
  - **Owner:** Pauline/Maarten

### Translations — IN PROGRESS
- [x] **All 9 languages translated** — Full `--force` re-run completed (Qwen cloud, numbered-list batching). de, ms, zh, es, fr, nl, ru, ja, pt all done.
  - ⚠️ `pt` still needs targeted re-run — `--lang` flag added to script (was missing), but Qwen daily quota hit during attempt. Run when quota resets: `node scripts/translate-content.mjs --force --lang pt` then `npm run sync` + push.
  - Flavours of Malaysia and Eat Drink George Town got correct `pt` in this session; remaining 35 records still have old "Brazilian Portuguese" translation.
- [ ] **8 languages need native speaker verification** — ms, zh, es, fr, nl, ru, ja, pt
  - **Effort:** 8-16 hours (2 hours per language)
  - **Owner:** Pauline/Maarten + native speakers

### Security — ✅ COMPLETE
- [x] **Comment System** — Removed. `Comments.astro` deleted (showed fake hardcoded comments with a dead form). Already de-wired from stories template.
- [x] **Form Rate Limiting** — IP-based rate limiting deployed via KV (5 req/hr contact/inquiry, 3 req/hr newsletter). KV namespace `RATE_LIMIT` bound to worker. Fails open if KV unreachable.
- [x] **CSP Headers** — Audited and tightened. Added `upgrade-insecure-requests`, added `contact.simplyenak.com` to `connect-src`, removed stale `google-analytics.com` from `script-src`. `'unsafe-inline'` remains — required by Astro SSG (can't use nonces on static pages).

### Accessibility (WCAG 2.1 AA) — NOT FULLY COMPLIANT
- [ ] **Screen Reader Testing** — NVDA, JAWS, VoiceOver not tested
- [ ] **Keyboard Navigation** — Not fully tested
- [ ] **Color Blindness** — Not simulated
- [ ] **Zoom 200%** — Not tested
- [ ] **Touch Targets** — Not verified (44px minimum)
  - **Effort:** 8-16 hours comprehensive testing
  - **Owner:** Development + accessibility consultant

### Analytics — PARTIALLY DONE
- [x] **Conversion Tracking** — Core events now wired:
  - `purchase` — fires on `/thank-you/` after TicketingHub booking (was already done)
  - `generate_lead` (method: tour_inquiry_form) — fires on `/thank-you-inquiry/`
  - `generate_lead` (method: contact_form) — fires on `/thank-you-contact/`
  - `contact` (method: whatsapp) — fires on any wa.me click site-wide via event delegation; source label identifies origin (e.g. `sidebar:KL Street Food`)
  - `view_item` — fires on tour card clicks and tour detail page load
- [ ] **Search Console** — Property not verified, sitemap not submitted
  - **Effort:** 1-2 hours
  - **Owner:** Development

### Legal — NOT REVIEWED
- [ ] **Privacy Policy** — May not cover all third-party services
- [ ] **Terms & Conditions** — May not cover bookings, cancellations, liability
- [ ] **Cookie Policy** — May not list all cookies
  - **Effort:** 6-12 hours legal review
  - **Owner:** Legal team

### Design — PARTIALLY DONE
- [x] **Tour Detail Pages** — Mobile itinerary time column narrowed (w-14 on mobile), padding reduced (py-6 on mobile)
- [x] **Location Pages** — Food culture cards now show 4-column grid on desktop (lg:grid-cols-4)
- [x] **Tours Index** — Signature tour cards: single column on mobile, tagline/duration/CTA now visible on mobile; segment bento grids height responsive (240px mobile, 300px desktop)
- [x] **Form inputs** — All inputs/textareas in TourSidebar now have min-h-[44px]
- [ ] **Blog Post Layout** — Typography improvements (line-height, max-width) — marked done in plan but needs verification
- [ ] **Mobile Navigation** — Focus order needs improvement
- [ ] **12 remaining high-priority design issues** — see COMPREHENSIVE_DESIGN_AUDIT.md
  - **Effort:** 8-12 hours remaining
  - **Owner:** Development

---

## ✅ COMPLETED (March 28, 2026 — session 6)

### Blog section overhaul

- ✅ **Story categories wired** — `tags` arrays set on all 17 stories; old `category` field (internal labels like "Food Guide") superseded by `tags` (user-facing taxonomy)
- ✅ **`tour_ids` wired** — 13 substantial stories linked to relevant real tours for sidebar CTAs
- ✅ **Duplicate stub removed** — `11-foods-hari-raya` deleted from stories.json; redirect added to `_redirects`
- ✅ **`_redirects` fixed** — 5 stories were being 301'd to `/stories/` home even though their pages exist; 2 redirect targets pointed to non-existent slugs — all corrected
- ✅ **Archive page: category filter** — 5 filter pills (All, Food Culture, Travel Tips, Culture & Heritage, People & Stories) with client-side JS show/hide
- ✅ **Archive page: URL pre-filter** — `?filter=Culture+%26+Heritage` etc. auto-applies on load; "View all" links from index now deep-link into correct category
- ✅ **Index page: stub filtering** — featured slot and all 4 category grids now exclude placeholder stubs (content < 500 chars)
- ✅ **Index page: "View all" links** — added to all 3 sections (Insider Expertise, Malaysian Culture 101); vendor stories View All updated to pre-filter by category
- ✅ **Related stories by category** — `[slug].astro` now shows same-category stories first; falls back to any non-stub if no match
- ✅ **H4 → H2 heading promotion** — all 13 substantial old posts promoted; every story now has at least one H2 (was: all H4 only, invisible to ToC + wrong for SEO/a11y)
- ✅ **ToC anchors now work** — client-side script injects `id` attributes on H2/H3 headings so "On this page" links actually scroll
- ✅ **ToC capped at 8 entries** — mobile ToC (`[slug].astro`) and sidebar (`Sidebar.astro`) both capped; was showing 20 entries on some posts
- ✅ **Schema `articleSection` fixed** — was sending internal label ("Culture & Festivals"); now sends canonical taxonomy value ("Culture & Heritage")
- ✅ **Related stories category label fixed** — was showing old `s.category` field ("Food Guide"); now shows `s.categories[0]` ("Food Culture")
- ✅ **Prose headings: uppercase removed** — `prose-headings:uppercase` and `prose-h3:capitalize` removed; headings now render in their natural casing
- ✅ **Brand voice cleaned in all 13 posts** — banned words removed across full content: vibrant, mouthwatering, delicious, incredible, amazing, discover, explore, immerse, authentic, unique, journey, must-see → 0 violations remain

---

## ✅ COMPLETED (March 28, 2026 — session 5)

- ✅ **Form rate limiting** — IP-based KV rate limiting deployed to `contact.simplyenak.com` worker (5 req/hr contact/inquiry, 3 req/hr newsletter; fails open; 2-hour auto-expiring keys)

---

## ✅ COMPLETED (March 28, 2026 — session 4)

- ✅ **All 54 Directus image records** — ADA-compliant descriptions + descriptive titles/filenames updated
- ✅ **22 broken image URLs fixed** — placeholder S3 paths that never existed replaced with working alternatives across 8 JSON files
- ✅ **Hardcoded alt text fixed** — 4 components updated: TextWithLeftRightImage, StoriesDetailsHero, TourDetailsHero, TourQuiz now use dynamic title props
- ✅ **Alt text pipeline from Directus** — sync script fetches all file descriptions at sync time; adds `hero_image_alt` / `gallery_image_alts` fields to tours and stories automatically (activates when images are re-uploaded via Directus)
- ✅ **_worker.js JSDoc comment fix** — `*/` inside block comment was breaking CF Pages build
- ✅ **Comment system removed** — `Comments.astro` deleted (fake hardcoded content, dead form)
- ✅ **Conversion tracking wired** — tour inquiry, contact form, and WhatsApp clicks now tracked in GA4
- ✅ **CSP hardened** — `upgrade-insecure-requests`, forms worker in `connect-src`, stale origins removed
- ✅ **Staging accidentally live Mar 24–27** — investigated GA; ~34 sessions, all MY/SG/regional, likely internal testing only, no real bookings affected

---

## ✅ INFRASTRUCTURE (Completed March 28, 2026)

- ✅ **Production deploy locked down** — `simplyenak/website` GitHub Actions changed to `workflow_dispatch` only; was accidentally auto-deploying on push. Fixed `projectName` from `staging` → `website`. (`deploy-production.yml` on main)
- ✅ **Removed `staging` remote from website repo** — was pointing to `simplyenak/revamp`, caused staging code to be accessible inside production repo
- ✅ **Directus connected to Scaleway S3** — new uploads via Directus admin now go to `se-website-images` bucket (`nl-ams`). Config in `directus/.env`
- ✅ **S3 bucket made public** — `se-website-images` was private (causing broken images on production); set to public March 28
- ✅ **CDN image setup documented** — checklist in `agent_docs/cloudflare.md` + Phase 2 steps updated in `project-plan.md` for Directus → Dokploy migration
- ✅ **System settings saved** — `memory/system_settings.md` covers Directus start cmd, S3 creds, Podman vs Docker, CF tokens

---

## ✅ COMPLETED (Ready to Launch)

- ✅ **Brand voice violations** — fixed in all pages
- ✅ **Old/duplicate pages** — removed
- ✅ **Vendor story wiring** — `stories/[slug].astro` complete
- ✅ **Responsive breakpoints** — added to all pages
- ✅ **Founding year fixed** — 2011 consistent
- ✅ **Maarten as co-founder** — schema updated
- ✅ **TypeScript clean** — all errors resolved
- ✅ **All static elements** — reading from CMS with fallbacks
- ✅ **Impeccable Design System** — accessibility + animations
- ✅ **Directus Governance** — pre-commit hook
- ✅ **SocialProof Component** — Directus-ready
- ✅ **Scroll Animations** — implemented
- ✅ **Media page** — complete with 5 sections
- ✅ **Press coverage verified** — all dates corrected
- ✅ **WCAG AA contrast** — fixed in all sections
- ✅ **Phase 1A SEO/schema fixes** — all done
- ✅ **Forms Worker built** — contact, tour inquiry, newsletter
- ✅ **Translation pipeline** — script rebuilt (numbered-list batching, ~70% fewer API calls, Qwen cloud)
- ⚠️ **Directus Flows auto-translate** — blocked until Directus moves to Dokploy (localhost can't receive webhooks)
- ✅ **CF Pages project** — created and connected
- ✅ **Segment tag system** — working

---

## MEDIUM PRIORITY (Can Fix Post-Launch)

- [x] Backup file cleanup — already done (no backup dirs found)
- [x] Language switcher bug fixed — all languages were showing Dutch; fixed by using getLangFromUrl() instead of Astro.params.lang in header.astro
- [x] Directus translation tables created — dietary_landing_pages, specialty_landing_pages, travel_type_landing_pages, faq_page all have translations tables + faq_page singleton seeded
- [x] **500.astro created** — custom server error page matching 404 pattern
- [ ] Image fallback handling in TestimonialsSection
- [x] `llms.txt` — already comprehensive (tours, vendors, stats, press coverage)
- [ ] Create Wikidata entry
- [ ] Populate itinerary `cultural_context` in Directus
- [ ] Add Bing Webmaster Tools
- [ ] Run Lighthouse audit

---

## MANUAL STEPS (No Code)

- [ ] Set branch protection on `simplyenak/website` main
- [ ] Update Dokploy to pull `:production` Docker tag
- [ ] **LAUNCH DECISION** — When content is ready

---

---

## ✅ COMPLETED (March 30, 2026 — session 7)

### Directus CMS — now live on Dokploy server
- ✅ **Directus deployed to `cms.simplyenak.com`** — Docker Swarm stack on server 45.136.28.238, PostgreSQL backend
- ✅ **Admin password secured** — changed from default to `CMS-SimplyEnak-2026SecureKey`
- ✅ **Static admin token set** — `349891920f12ffbb84b1ad8dfe7e09a67dca0d9e16c43a4134eeb67b8c1a8bf3` (never expires, used for CI/CD)
- ✅ **All 11 collections + fields bootstrapped** — tours, stories, vendors, tours_vendors, testimonials, site_settings, home_page, location_landing_pages, dietary_landing_pages, specialty_landing_pages, travel_type_landing_pages — all with real PostgreSQL tables
- ✅ **S3 storage configured** — new uploads via Directus admin go to `se-website-images` Scaleway bucket; CDN `cdn.simplyenak.com`
- ✅ **DNS record added** — `cms.simplyenak.com` → server via Traefik + Let's Encrypt TLS
- ✅ **Schema snapshot exported** — `directus/schema-snapshot.json` committed (112KB)

### CI/CD — Directus schema workflow
- ✅ **`.github/workflows/directus-schema.yml`** — triggers on push to `main` when bootstrap or snapshot changes; also manual dispatch with bootstrap/snapshot mode
- ✅ **`directus/bootstrap-schema.js`** — idempotent schema setup; fixed to include `schema: { name }` in POST body (required for Directus to create real PG tables, not just metadata); detects and self-heals metadata-only ghost collections
- ✅ **Simplified to static token** — removed login step; uses `secrets.DIRECTUS_TOKEN` directly (session tokens expire in 15 min; static token doesn't)
- ⚠️ **GitHub secrets still need adding manually** — `DIRECTUS_TOKEN` + `DIRECTUS_URL` in `simplyenak/revamp → Settings → Secrets → Actions`

### SEO / Structured data fixes
- ✅ **FAQPage schema removed** from tour detail, dietary, and location pages — Google restricted to gov/health sites only
- ✅ **GeoCoordinates added** to TouristDestination on location pages (KL, Penang, Ipoh, Melaka)
- ✅ **H2 overload fixed** on tour pages — "Everything You Need to Know" and "Your X Walk" demoted to H3
- ✅ **`structuredData` null filtering** — `.filter(Boolean)` applied so null schemas don't pass

### Brand voice fixes
- ✅ **WhyChooseUs.astro** — em-dash removed, "cultural immersion/incredible" replaced
- ✅ **corporate-groups.astro** — "authentic local culture", "unforgettable experience" removed from fallbacks
- ✅ **private-tours.astro** — "delicious options" → "eats well at every stop"
- ✅ **neighborhoods/[slug].astro** — "amazing" removed, "Experience" → "Walk"
- ✅ **tours/index.astro FAQ** — "explore" → "follow" for vegetarian heritage tours

### Design / layout
- ✅ **`primary-btn` → `cta-primary`** standardised across 12 files + Layout haptic handler + types
- ✅ **`md:grid-cols-2`** added to Featured Tours grid (tablet gap fix)
- ✅ **`px-4` chip bar padding** on tours index (was px-2)
- ✅ **500.astro created** — custom error page with warm brand copy + WhatsApp CTA

---

**Last Updated:** March 30, 2026 (session 7 — Directus on Dokploy, CI/CD schema, brand voice sweep, design fixes)
**Next Review:** Add GitHub secrets (DIRECTUS_TOKEN + DIRECTUS_URL) manually; blog post content (7 stubs — Pauline/Maarten); vendor/founder photos; re-run `pt` translation when Qwen quota resets; accessibility testing; remaining high-priority design issues
