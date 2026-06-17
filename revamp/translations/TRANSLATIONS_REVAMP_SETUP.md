# 🌍 Revamp Project - Translations Setup

**Project:** /revamp/ (staging.simplyenak.com)  
**Status:** ✅ Directus Ready | ⏳ Frontend Integration Needed  
**Last Updated:** March 9, 2026

---

## 📊 Current State

### ✅ Directus (Backend)
- `home_page_translations` collection created
- Translations interface configured
- English content matches staging.simplyenak.com
- Bahasa Malaysia sample translations complete
- 25 translatable fields across 10 sections

### ✅ Existing i18n System (Frontend)
- UI translations already set up in `/revamp/frontend/src/i18n/`
- Languages configured: EN, DE, ES
- Ready to add: MS (Bahasa Malaysia), ZH (Chinese)
- Uses Astro i18n integration

### ⏳ What's Needed
- Connect Directus translations to frontend i18n
- Add MS and ZH to language config
- Update homepage components to use translated content from Directus

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Directus (Backend)                 │
│  ┌─────────────────────────────────────────────┐   │
│  │ home_page (singleton)                       │   │
│  │ - English content (default)                 │   │
│  │ - Non-translatable fields (images, etc.)    │   │
│  └─────────────────────────────────────────────┘   │
│                          ↓                          │
│  ┌─────────────────────────────────────────────┐   │
│  │ home_page_translations                      │   │
│  │ - home_page_id (FK)                         │   │
│  │ - languages_code (FK) → en, ms, zh, de, es  │   │
│  │ - 25 translatable text fields               │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                          ↓
              API Calls (fetch translations)
                          ↓
┌─────────────────────────────────────────────────────┐
│            Astro Frontend (/revamp/frontend)        │
│  ┌─────────────────────────────────────────────┐   │
│  │ /src/i18n/                                  │   │
│  │ - ui.ts (UI translations)                   │   │
│  │ - utils.ts (helper functions)               │   │
│  └─────────────────────────────────────────────┘   │
│                          ↓                          │
│  ┌─────────────────────────────────────────────┐   │
│  │ /src/pages/index.astro                      │   │
│  │ - Fetches from Directus                     │   │
│  │ - Uses translated content                   │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Directus Collections

### home_page (singleton)
Contains English content and non-translatable fields:
- `hero_background_image` (URL)
- `location_cards` (JSON)
- `dietary_cards` (JSON)
- `travel_type_cards` (JSON)
- `specialty_cards` (JSON)
- `featured_tours` (JSON - tour IDs)
- `values` (JSON)
- `testimonials` (JSON)
- `final_cta_button_url` (URL)
- `media_video_url` (URL)
- etc.

### home_page_translations
Contains translated text content:
- `home_page_id` (FK to home_page.id)
- `languages_code` (FK to languages.code)
- `hero_title`, `hero_subtitle`, `hero_description`
- `hero_cta_primary_text`, `hero_cta_secondary_text`
- `about_title`, `about_description`, `about_heritage`
- `featured_tours_title`
- `values_title`, `values_subtitle`
- `testimonials_title`
- `media_title`
- `faq_title`
- `cta_title`, `cta_subtitle`
- `final_cta_title`, `final_cta_description`, `final_cta_button_text`
- `meta_title`, `meta_description`

### languages
Available languages:
- `en` - English
- `ms` - Bahasa Malaysia
- `zh` - Chinese (Simplified)
- `de` - German
- `es` - Spanish

---

## 🔧 Setup Steps

### 1. Directus (Already Done ✅)

```bash
# Run these scripts from /var/home/maarten/website-optimization/
python3 setup_translations_interface.py     # Configure Directus UI
python3 extract_translations_for_csv.py     # Extract content
python3 import_homepage_translations.py     # Import translations
```

### 2. Frontend Integration (TODO)

#### A. Update i18n Config
Edit `/revamp/frontend/src/i18n/ui.ts`:

```typescript
export const languages = {
  en: "English",
  ms: "Bahasa Malaysia",  // Add
  zh: "中文",              // Add
  de: "Deutsch",
  es: "Español",
} as const;
```

#### B. Update Astro Config
Edit `/revamp/astro.config.mjs`:

```javascript
export default defineConfig({
  i18n: {
    locales: ['en', 'ms', 'zh', 'de', 'es'],
    defaultLocale: 'en',
  },
  // ... rest of config
});
```

#### C. Update Directus Lib
Create/Update `/revamp/frontend/src/lib/directus.ts`:

```typescript
import { createDirectus, rest, readItems } from '@directus/sdk';

const directus = createDirectus('https://api.system.simplyenak.com').with(rest());

export async function getHomePageTranslations(lang: string = 'en') {
  const translations = await directus.request(
    readItems('home_page_translations', {
      filter: {
        home_page_id: { _eq: 1 },
        languages_code: { _eq: lang }
      }
    })
  );
  
  return translations[0] || null;
}
```

#### D. Update Homepage Component
Edit `/revamp/frontend/src/pages/index.astro`:

```astro
---
import { getHomePageTranslations } from "@/lib/directus";

// Get language from URL or Astro i18n
const lang = Astro.params.lang || 'en';

// Fetch translations
const translations = await getHomePageTranslations(lang);

// Fallback to English if translation not found
const content = translations || await getHomePageTranslations('en');
---

<html lang={lang}>
  <head>
    <title>{content.meta_title}</title>
    <meta name="description" content={content.meta_description} />
  </head>
  <body>
    <HeroSection
      title={content.hero_title}
      highlight={content.hero_highlight}
      subtitle={content.hero_subtitle}
      // ... pass all translated props
    />
    <!-- etc -->
  </body>
</html>
```

---

## 📝 Translation Workflow

### For UI Strings (nav, buttons, labels):
1. Edit `/revamp/frontend/src/i18n/ui.ts`
2. Add translations for each language
3. Use in components: `t('nav.tours')`

### For Page Content (hero, about, tours, etc.):
1. Go to Directus → Content → Home Page Translations
2. Select language
3. Edit content
4. Save
5. Frontend fetches automatically

### For New Languages:
1. Add to Directus languages collection
2. Add to `i18n/ui.ts` languages object
3. Add to `astro.config.mjs` locales
4. Create translations in Directus
5. Update frontend components

---

## 🚀 Quick Start (For Developers)

### Add Bahasa Malaysia to Frontend:

1. **Update i18n/ui.ts:**
```typescript
export const languages = {
  en: "English",
  ms: "Bahasa Malaysia",  // Add this
  de: "Deutsch",
  es: "Español",
} as const;

export const ui = {
  // ... existing en, de, es
  
  ms: {
    "nav.tours": "Pusingan",
    "nav.stories": "Cerita",
    "nav.about": "Tentang",
    "nav.contact": "Hubungi",
    "nav.bookNow": "Tempah Sekarang",
    // ... add all UI keys
  },
} as const;
```

2. **Test in Directus:**
   - Go to Content → Home Page Translations
   - Verify MS translations exist
   - Edit if needed

3. **Test Frontend:**
   - Run dev server: `npm run dev`
   - Visit: http://localhost:4321/ms/
   - Verify translations appear

---

## 📊 Translation Status

| Language | Directus | Frontend i18n | Status |
|----------|----------|---------------|--------|
| **English** | ✅ 25/25 | ✅ Complete | 🟢 Live |
| **Bahasa Malaysia** | ✅ 25/25 | ⏳ Pending | 🟡 Ready |
| **Chinese** | ⏳ 0/25 | ⏳ Pending | ⚪ Pending |
| **German** | ⏳ 0/25 | ✅ UI Only | 🟡 Partial |
| **Spanish** | ⏳ 0/25 | ✅ UI Only | 🟡 Partial |

---

## 📁 Key Files

| File | Purpose | Status |
|------|---------|--------|
| `/revamp/frontend/src/i18n/ui.ts` | UI translations | ✅ EN/DE/ES |
| `/revamp/frontend/src/i18n/utils.ts` | i18n helpers | ✅ Exists |
| `/revamp/frontend/src/pages/index.astro` | Homepage | ⏳ Needs update |
| `/revamp/astro.config.mjs` | Astro config | ⏳ Add locales |
| `/var/home/maarten/website-optimization/homepage_translations_template.csv` | Translation CSV | ✅ Ready |
| `/var/home/maarten/website-optimization/import_homepage_translations.py` | Import script | ✅ Ready |

---

## 🎯 Next Steps

1. **Review MS translations in Directus**
   - Content → Home Page Translations
   - Verify Bahasa Malaysia content

2. **Add MS to frontend i18n**
   - Update `/revamp/frontend/src/i18n/ui.ts`
   - Add MS UI translations

3. **Update homepage to use Directus**
   - Modify `/revamp/frontend/src/pages/index.astro`
   - Fetch from `home_page_translations`

4. **Add language routing**
   - Update `astro.config.mjs`
   - Add `[lang]` dynamic route if needed

5. **Test all languages**
   - EN: http://localhost:4321/
   - MS: http://localhost:4321/ms/
   - DE: http://localhost:4321/de/
   - ES: http://localhost:4321/es/

---

## 🔗 Resources

- **Directus:** http://localhost:8055
- **Staging:** https://staging.simplyenak.com
- **i18n Guide:** https://docs.astro.build/en/guides/internationalization/
- **Directus SDK:** https://docs.directus.io/sdk/

---

**Created:** March 9, 2026  
**Project:** /revamp/  
**Status:** Directus Ready, Frontend Integration Needed
