# Simply Enak Website Language Setup — Current State & Ideal State

> Created: 2026-08-02

## Current Setup

### Architecture Overview

The site uses a **static locale-prefix approach** with Astro:
- English content at root paths (`/`, `/tours`, `/stories`)
- 9 other languages at prefixed paths (`/ms/`, `/zh/`, `/de/`, etc.)
- Each locale has its own set of physical `.astro` files (19 per language)

### What Works

| Area | Status |
|------|--------|
| **URL structure** | ✅ `/ms/tours`, `/zh/stories`, etc. |
| **hreflang tags** | ✅ Generated in Layout.astro for all 10 locales |
| **Sitemap i18n** | ✅ Configured in astro.config.ts with 10 locales |
| **Language switcher** | ✅ Header component with flag emojis |
| **PageLayout lang detection** | ✅ Detects from URL, passes to Layout |
| **Content translation (UI strings)** | ✅ Partial — ms and zh are reasonably complete |
| **Content data translations** | ✅ System exists in Payload (translations array) |
| **Translation sync script** | ✅ `translate-content.mjs` with Gemini AI |
| **i18n heal cron** | ✅ Documented in docs/i18n-heal-cron.md |
| **Push to Payload** | ✅ `push-translations-payload.mjs` exists |

### What's Broken / Incomplete

#### 1. Content Translations Not Populated
- **tours.json**: 0 of 8 tours have translations
- **stories.json**: 0 of 91 stories have translations  
- **faqs.json**: 0 of 27 FAQs have translations
- **testimonials.json**: 0 of 81 reviews have translations

The Payload CMS has a `translations` field on all collections, but the sync script isn't populating it for non-English locales.

#### 2. UI Translation Coverage is Sparse
- EN has 194 keys
- ms: 92 keys (47%) — best coverage
- zh: 153 keys (79%)
- de: 153 keys (79%)
- es/fr/nl/ru/ja/pt: 113-155 keys (58-80%)

Many keys fall back to English silently.

#### 3. Hardcoded Text in Pages
Multiple pages have hardcoded text that bypasses the `t()` translation function:
- `ms/index.astro`: Philosophy section headings ("Orang Tempatan", "Cerita-Cerita", "Lokasi")
- Segment page titles, CTA text, section headers scattered across locale pages
- Footer copyright stays in Malay/Rojak even on EN pages

#### 4. No Dynamic Route Sharing
Each locale has 19 duplicate page files. For 10 locales + root = ~200 page files. Any content change must be replicated across all locales.

#### 5. Sitemap hreflang URLs May Be Wrong
Layout.astro generates hreflang URLs by replacing the current prefix with each language prefix. But many pages (tours/[slug], stories/[slug]) only exist in English — the hreflang points to non-existent pages.

#### 6. No lang attribute on non-EN pages
PageLayout passes `lang` prop only when `currentLang !== 'en'`, but Layout.astro has fallback logic that may not always work correctly.

## Ideal Setup

### Content Translation Strategy

```
Payload CMS (source of truth)
    |
    v
translations array on each document
    |  (ms, zh, de, es, fr, nl, ru, ja, pt)
    v
sync script pulls translations
    |
    v
JSON snapshots in site/src/data/content/
    |
    v
Pages read from snapshots, apply locale filter
```

### Page Architecture

Option A: Keep current duplicate files (simple, works)
Option B: Dynamic [lang] routes (DRY, but more complex)
Option C: Hybrid — shared components, locale-specific only where needed

### Translation Pipeline

```
1. Content created/updated in Payload (EN)
2. translate-content.mjs runs (cron every 4h)
   - Detects new/updated EN content
   - Calls Gemini AI to translate
   - Writes translations back to JSON snapshots
3. push-translations-payload.mjs (manual or cron)
   - Pushes translations back to Payload for persistence
4. npm run build
   - Astro generates all locale pages
5. Deploy to Cloudflare Pages
```

### Key Improvements Needed

1. **Populate content translations** — run translate-content.mjs for all collections
2. **Complete UI translations** — fill missing keys in ui.ts for all 9 languages
3. **Fix hardcoded text** — migrate to t() function or Payload fields
4. **Fix hreflang** — only generate for pages that actually exist in each locale
5. **Add canonical URLs** — explicit canonical per page to prevent duplication
6. **Reduce file duplication** — consider dynamic [lang] routes or shared layouts

## Implementation Plan

### Phase 1: Content Translations (Priority: High)
- [ ] Run translate-content.mjs for tours, stories, faqs, testimonials
- [ ] Verify translation quality (spot check ms and zh)
- [ ] Set up cron to run on content updates

### Phase 2: UI Translation Completeness (Priority: Medium)
- [ ] Audit missing keys per language
- [ ] Translate missing keys (auto-fill with Gemini, review ms/zh manually)
- [ ] Add missing keys to ui.ts

### Phase 3: Hardcoded Text Cleanup (Priority: Medium)
- [ ] Find all hardcoded text in locale pages
- [ ] Convert to t() calls or Payload fields
- [ ] Add missing translation keys

### Phase 4: SEO Fixes (Priority: High)
- [ ] Fix hreflang to only include existing pages
- [ ] Add explicit canonical URLs to all pages
- [ ] Verify sitemap includes all locale pages

### Phase 5: Architecture Improvements (Priority: Low)
- [ ] Evaluate dynamic [lang] route approach
- [ ] Consider shared layout/components for locale pages
- [ ] Reduce duplication while maintaining build performance
