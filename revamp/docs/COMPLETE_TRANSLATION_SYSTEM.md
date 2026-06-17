# Complete Translation System Guide

## Overview

All content is now synchronized from Directus to JSON snapshots. The build process uses these JSON files - no active Directus connection needed at build time.

## Collections with Translation Support

### ✅ Fully Configured (syncs translations)

| Collection | Translation Collection | JSON File | Status |
|------------|----------------------|-----------|--------|
| `home_page` | `home_page_translations` | `home-page.json` + `*.json` | ✅ Syncs |
| `tours` | `tours_translations` | `tours.json` | ✅ Syncs |
| `stories` | `stories_translations` | `stories.json` | ✅ Syncs |
| `vendors` | `vendors_translations` | `vendors.json` | ✅ Syncs |
| `faqs` | `faqs_translations` | `faqs.json` | ✅ Syncs |
| `testimonials` | `testimonials_translations` | `testimonials.json` | ✅ Syncs |
| `site_settings` | `site_settings_translations` | `site-settings.json` | ✅ Syncs |
| `about_page` | `about_page_translations` | `about-page.json` | ✅ Syncs |
| `location_landing_pages` | `location_landing_pages_translations` | `location-landing-pages.json` | ✅ Syncs |
| `dietary_landing_pages` | `dietary_landing_pages_translations` | `dietary-landing-pages.json` | ✅ Syncs |
| `specialty_landing_pages` | `specialty_landing_pages_translations` | `specialty-landing-pages.json` | ✅ Syncs |
| `travel_type_landing_pages` | `travel_type_landing_pages_translations` | `travel-type-landing-pages.json` | ✅ Syncs |
| `legal_pages` | `legal_pages_translations` | `legal-pages.json` | ✅ Syncs |
| `thank_you_pages` | `thank_you_pages_translations` | `thank-you-pages.json` | ✅ Syncs |
| `media_coverage` | `media_coverage_translations` | `media-coverage.json` | ✅ Syncs |

## How Translations Work

### 1. Data Layer (Directus → JSON)

Run `npm run sync` to fetch all content with translations:

```bash
cd /var/home/maarten/website-optimization/revamp/frontend
npm run sync
```

This generates:
- `frontend/src/data/content/*.json` - Main content with `translations` array
- `frontend/src/i18n/translations/*.json` - Home page translations per language

### 2. Build Time (Astro)

Pages use the `applyTranslation()` helper from `directus.js`:

```javascript
import { getTours, applyTranslation } from '@/lib/directus';

const lang = 'ms'; // from URL
const tours = await getTours();
const msTours = tours.map(t => applyTranslation(t, lang));
```

### 3. Runtime (No API calls)

All content is baked into HTML at build time. No JavaScript needed for translations.

## Supported Languages

| Code | Name | Native Name |
|------|------|-------------|
| `en` | English | English (default) |
| `ms` | Bahasa Malaysia | Bahasa Malaysia |
| `zh` | Chinese | 中文 |
| `de` | German | Deutsch |
| `es` | Spanish | Español |
| `fr` | French | Français |
| `nl` | Dutch | Nederlands |
| `ru` | Russian | Русский |
| `ja` | Japanese | 日本語 |
| `pt` | Portuguese | Português |

## URL Structure

```
/                           → English home
/ms/                        → Malay home
/de/                        → German home
/tours/                     → English tours
/ms/tours/                  → Malay tours
/tours/kl-street-food       → English tour detail
/ms/tours/kl-street-food    → Malay tour detail
```

## Workflow

### Adding New Translations in Directus

1. Go to Directus admin
2. Open the collection (e.g., `tours`)
3. Edit an item
4. Scroll to `translations` relation
5. Add translations for each language
6. Save

### Syncing to JSON

```bash
cd frontend
npm run sync
git add src/data/content/ src/i18n/translations/
git commit -m "Sync translations from Directus"
git push
```

### Creating New Localized Pages

For any new page type, create localized versions:

```
src/pages/
├── about.astro              # English (default)
├── ms/
│   └── about.astro          # Malay
├── de/
│   └── about.astro          # German
└── ...
```

Each localized page:
1. Imports language-specific JSON
2. Merges with base content
3. Passes to components

## Translation Field Mapping

### Home Page Fields

```yaml
hero_title: string
hero_highlight: string
hero_subtitle: string
hero_description: text
hero_cta_primary: string
hero_cta_secondary: string
manifesto_headline: string
pillar_people_heading: string
pillar_food_heading: string
pillar_place_heading: string
vendors_title: string
segment_heading: string
expect_title: string
cta_title: string
cta_subtitle: string
# ... 84 total fields
```

### Tours Fields

```yaml
name: string
description: text
highlights: json
itinerary: json
whats_included: json
whats_excluded: json
price_info: string
duration_info: string
# ... all tour fields
```

## Missing Translations Fallback

If a translation is missing for a language:
1. Falls back to English (base content)
2. Logs warning in console during sync

## Checking Translation Coverage

```bash
# Check which languages have translations for each collection
cd frontend
node -e "
const fs = require('fs');
const tours = require('./src/data/content/tours.json');
tours.forEach(t => {
  console.log(t.name, ':', t.translations?.length || 0, 'translations');
});
"
```

## Common Issues

### Issue: Page shows English content

**Cause:** Translation not in Directus or sync not run

**Fix:**
1. Add translation in Directus
2. Run `npm run sync`
3. Rebuild `npm run build`
4. Deploy

### Issue: Navigation switches to English

**Cause:** Links don't have language prefix

**Fix:** Use `localizePath()` helper in Layout/Header/Footer

### Issue: Build fails with missing translations

**Cause:** Translation collection not in Directus

**Fix:** Create translation collection schema in Directus first

## Next Steps for 100% Coverage

1. ✅ Sync script updated for all collections
2. ✅ Home page translations working
3. ⏳ Create localized pages for all page types:
   - `/[lang]/about/`
   - `/[lang]/tours/`
   - `/[lang]/tours/[slug]/`
   - `/[lang]/stories/`
   - `/[lang]/stories/[slug]/`
   - `/[lang]/contact/`
   - `/[lang]/faq/`
   - `/[lang]/how-it-works/`
   - `/[lang]/how-to-prepare/`
   - `/[lang]/track-record/`
   - `/[lang]/directions/`
   - `/[lang]/media/`
   - Landing pages: `/[lang]/tours/locations/[slug]/`, etc.

4. ⏳ Add translation schemas for missing collections in Directus:
   - `directions_page_translations`
   - `contact_page_translations`
   - `how_it_works_page_translations`
   - `how_to_prepare_page_translations`
   - `track_record_page_translations`
   - `media_page_translations`
