# Simply Enak Language Setup — Deep Dive Analysis

> Created: 2026-08-02
> This is a technical deep dive into the actual data flow, not just surface-level observations.

## Executive Summary

The i18n system is **architecturally sound** but **content is missing**. The translation pipeline exists and works — it just hasn't been run on the main content collections.

---

## Current Architecture

### Data Flow (3-Tier Fallback)

```
1. Live Payload API (tier 1)
   ↓ falls back to
2. JSON snapshots (tier 2) — src/data/content/*.json
   ↓ falls back to
3. Hardcoded data (tier 3) — src/data/tours.js, src/data/segments.js
```

### Translation Application

When a non-English locale is requested:
1. `content.ts` fetches data with `locale` parameter
2. `applyLocaleTranslations()` merges translations onto items
3. Translations are stored in `item.translations[]` array
4. Each translation has `languages_code` (en, ms, zh, etc.) and field values

### What Works

| Component | Status |
|-----------|--------|
| URL routing | `/ms/tours`, `/zh/stories` ✅ |
| hreflang | Generated in Layout.astro ✅ |
| Sitemap i18n | Configured ✅ |
| Language switcher | Header component ✅ |
| Translation merge logic | `applyLocaleTranslations()` ✅ |
| Landing page translations | 100% populated ✅ |
| UI string translations | Partial (ms 47%, others 58-80%) ⚠️ |

---

## Content Translation Status

### Fully Translated (100%)
- `dietary-landing-pages.json` — 15/15 items
- `specialty-landing-pages.json` — 12/12 items
- `tours-page.json` — 1/1 item (singleton)
- `stories-page.json` — 1/1 item (singleton)

### Partially Translated (68%)
- `location-landing-pages.json` — 13/19 items

### NOT Translated (0%)
- `tours.json` — 0/8 items ❌
- `stories.json` — 0/91 items ❌
- `faqs.json` — 0/27 items ❌
- `testimonials.json` — 0/81 items ❌
- `home-page.json` — 0/1 item ❌
- `about-page.json` — 0/1 item ❌
- `contact-page.json` — 0/1 item ❌
- All other page configs — 0% ❌

---

## The Real Problem

**The system works, but content was never translated.**

The frontend correctly:
1. Calls `getAllTours('ms')` → `resolveTours('ms')`
2. Checks if snapshot has translations: `if (locale && locale !== 'en' && snapshotTours.length > 0)`
3. Applies translations: `applyLocaleTranslations(item, 'ms')`
4. Merges translated fields onto the item

But since `tours.json` has no translations array, step 3 is a no-op and English content is returned.

---

## UI String Coverage Gap

| Language | Keys | Coverage |
|----------|------|----------|
| EN | 194 | 100% |
| ms | 92 | 47% |
| zh | 153 | 79% |
| de | 153 | 79% |
| es | 150 | 77% |
| fr | 150 | 77% |
| nl | 155 | 80% |
| ru | 116 | 60% |
| ja | 113 | 58% |
| pt | 116 | 60% |

Missing keys fall back to English silently.

---

## Hardcoded Text Issues

Files with hardcoded non-English text that should use `t()`:
- `ms/index.astro`: Philosophy section headings ("Orang Tempatan", "Cerita-Cerita", "Lokasi")
- `ms/index.astro`: "PILIH PENGALAMAN ANDA" hardcoded
- `ms/index.astro`: "Pusingan Makanan" hardcoded
- Various pages have hardcoded CTAs and labels

---

## Implementation Plan

### Phase 1: Content Translations (Critical)

Run the existing translation script on missing collections:

```bash
cd site
node scripts/translate-content.mjs --collection tours
node scripts/translate-content.mjs --collection stories
node scripts/translate-content.mjs --collection faqs
node scripts/translate-content.mjs --collection testimonials
node scripts/translate-content.mjs --collection home-page
```

Requires: `GEMINI_API_KEY` or `OMNIROUTE_API_KEY`

### Phase 2: UI Translation Completeness

1. Generate list of missing keys per language
2. Run translation script for UI strings (or use translate-content.mjs with --lang flag)
3. Review ms and zh translations manually

### Phase 3: Hardcoded Text Cleanup

1. Find all hardcoded text in locale pages
2. Convert to `t()` calls
3. Add missing keys to `ui.ts`

### Phase 4: Verify and Test

1. Build site and check all locales render correctly
2. Verify hreflang only points to existing pages
3. Check canonical URLs are correct

---

## Files to Modify

| File | Purpose |
|------|---------|
| `site/src/data/content/*.json` | Add translations arrays |
| `site/src/i18n/ui.ts` | Complete UI translations |
| `site/src/pages/*/index.astro` | Replace hardcoded text |

---

## Scripts Available

| Script | Purpose |
|--------|---------|
| `scripts/translate-content.mjs` | Translate content collections |
| `scripts/push-translations-payload.mjs` | Push translations to CMS |
| `scripts/sync-payload.mjs` | Sync from CMS to snapshots |

---

## Recommendation

Start with Phase 1 — run the translation script on the 5 missing collections. This is the highest-impact, lowest-risk change. The infrastructure is ready; it just needs content.
