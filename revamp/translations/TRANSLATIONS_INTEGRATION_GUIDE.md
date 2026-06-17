# 🌍 Revamp Project - Directus Translations Integration

**Project:** /revamp/ (staging.simplyenak.com)  
**Status:** ✅ Directus Ready | ✅ Frontend i18n Exists | ⏳ Integration Needed  
**Last Updated:** March 9, 2026

---

## ✅ What's Already Working

### 1. Directus Backend (Complete)
- ✅ `home_page_translations` collection created
- ✅ Translations interface configured
- ✅ 25 fields set up for translation
- ✅ English content matches staging.simplyenak.com
- ✅ Bahasa Malaysia sample translations imported

### 2. Frontend i18n System (Existing)
- ✅ `/revamp/frontend/src/i18n/ui.ts` - UI translations
- ✅ Languages: EN, DE, ES configured
- ✅ `applyTranslation()` helper function exists in `directus.js`
- ✅ JSON snapshot workflow for build-time content

### 3. Translation Infrastructure (Complete)
- ✅ CSV import/export scripts
- ✅ Directus configured for translations
- ✅ 5 languages available: EN, MS, ZH, DE, ES

---

## 🏗️ Current Architecture

The revamp project uses **JSON snapshots** at build time:

```
Directus (Backend)
    ↓ (npm run sync)
JSON files in /frontend/src/data/content/
    ↓ (import)
Frontend components
    ↓ (applyTranslation helper)
Translated content by language
```

**Key Files:**
- `/revamp/frontend/src/lib/directus.js` - Content layer with `applyTranslation()` helper
- `/revamp/frontend/src/data/content/home-page.json` - Home page data
- `/revamp/frontend/src/i18n/ui.ts` - UI string translations

---

## 📊 Translation Status

| Component | Directus | Frontend | Status |
|-----------|----------|----------|--------|
| **Home Page Content** | ✅ EN + MS | ⏳ Needs integration | 🟡 Ready |
| **UI Strings** | N/A | ✅ EN/DE/ES | 🟢 Live |
| **Tours** | ✅ With translations | ✅ Via applyTranslation() | 🟢 Live |
| **FAQs** | ✅ With translations | ✅ Via applyTranslation() | 🟢 Live |
| **Stories** | ✅ With translations | ✅ Via applyTranslation() | 🟢 Live |
| **Vendors** | ✅ With translations | ✅ Via applyTranslation() | 🟢 Live |

---

## 🔧 Integration Steps

### Step 1: Add MS and ZH to i18n Config

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

Add MS and ZH UI translations to the `ui` object (similar to existing DE/ES).

### Step 2: Sync Home Page from Directus

```bash
cd /revamp/frontend
npm run sync
```

This pulls the latest content including translations from Directus to:
- `/frontend/src/data/content/home-page.json`

### Step 3: Update Home Page Component

Edit `/revamp/frontend/src/pages/index.astro`:

```astro
---
import { getHomePage, applyTranslation } from "@/lib/directus";

// Get language from Astro params or URL
const lang = Astro.params?.lang || 'en';

// Fetch home page data
const homePage = await getHomePage();

// Apply translations for the current language
const translatedHomePage = applyTranslation(homePage, lang);
---

<!-- Use translated content -->
<HeroSection
  title={translatedHomePage.hero_title}
  highlight={translatedHomePage.hero_highlight}
  subtitle={translatedHomePage.hero_subtitle}
  description={translatedHomePage.hero_description}
  ctaPrimary={translatedHomePage.hero_cta_primary_text}
  ctaSecondary={translatedHomePage.hero_cta_secondary_text}
/>
```

### Step 4: Add Language Routing (Optional)

If you want URL-based language switching (`/ms/`, `/zh/`, etc.):

Edit `/revamp/astro.config.mjs`:

```javascript
export default defineConfig({
  i18n: {
    locales: ['en', 'ms', 'zh', 'de', 'es'],
    defaultLocale: 'en',
    prefixDefaultLocale: false,
  },
  // ...
});
```

Create `/revamp/frontend/src/pages/[lang]/index.astro` or update existing routing.

---

## 📝 Workflow for Adding Translations

### For Content Editors:

1. **Go to Directus:** http://localhost:8055
2. **Navigate to:** Content → Home Page Translations
3. **Select language** from dropdown
4. **Fill in translations** for all 25 fields
5. **Save**
6. **Run sync:** `cd /revamp/frontend && npm run sync`
7. **Deploy** or test locally

### For Developers:

1. **Add new language to i18n/ui.ts**
2. **Add UI translations** (nav, buttons, labels)
3. **Update components** to use `applyTranslation()`
4. **Test locally:** `npm run dev`
5. **Deploy**

---

## 🎯 Quick Start: Add Bahasa Malaysia

### 1. Verify Directus Translations
```
Directus → Content → Home Page Translations
Check: MS translations exist (25 fields)
```

### 2. Add MS to i18n
Edit `/revamp/frontend/src/i18n/ui.ts`:

```typescript
ms: {
  "nav.tours": "Pusingan",
  "nav.stories": "Cerita",
  "nav.about": "Tentang",
  "nav.contact": "Hubungi",
  "nav.bookNow": "Tempah Sekarang",
  "hero.cta.primary": "LIHAT PUSINGAN KAMI",
  "hero.cta.secondary": "MENGAPA PILIH KAMI",
  // ... add all UI keys
}
```

### 3. Test Locally
```bash
cd /revamp/frontend
npm run dev
# Visit: http://localhost:4321 (should show MS if lang detected)
```

---

## 📁 Key Files Reference

| File | Purpose | Status |
|------|---------|--------|
| `/revamp/frontend/src/lib/directus.js` | Content layer with translations | ✅ Exists |
| `/revamp/frontend/src/i18n/ui.ts` | UI translations | ✅ EN/DE/ES |
| `/revamp/frontend/src/pages/index.astro` | Homepage | ⏳ Update needed |
| `/revamp/frontend/src/data/content/home-page.json` | Home page snapshot | ⏳ Sync needed |
| `/var/home/maarten/website-optimization/homepage_translations_template.csv` | Translation CSV | ✅ Ready |
| `/var/home/maarten/website-optimization/import_homepage_translations.py` | Import script | ✅ Ready |

---

## 🚀 Scripts Reference

### Directus Scripts (from /var/home/maarten/website-optimization/):
```bash
# Extract content to CSV
python3 extract_translations_for_csv.py

# Import translations from CSV
python3 import_homepage_translations.py

# Setup Directus interface
python3 setup_translations_interface.py
```

### Frontend Scripts (from /revamp/frontend/):
```bash
# Sync content from Directus
npm run sync

# Development server
npm run dev

# Build
npm run build
```

---

## 🎨 Translation Fields Reference

### Home Page (25 fields):

**Hero Section (8):**
- `hero_title`, `hero_highlight`, `hero_title_end`
- `hero_subtitle`, `hero_description`
- `hero_cta_primary_text`, `hero_cta_secondary_text`
- `hero_price_info`

**About Section (4):**
- `about_title`, `about_subtitle`
- `about_description`, `about_heritage`

**Other Sections (13):**
- `featured_tours_title`
- `values_title`, `values_subtitle`
- `testimonials_title`
- `media_title`
- `faq_title`
- `cta_title`, `cta_subtitle`
- `final_cta_title`, `final_cta_description`, `final_cta_button_text`
- `meta_title`, `meta_description`

---

## 🔗 Resources

- **Directus:** http://localhost:8055
- **Staging:** https://staging.simplyenak.com
- **Revamp Docs:** `/revamp/docs/`
- **i18n Guide:** https://docs.astro.build/en/guides/internationalization/
- **Translation Workflow:** `/revamp/TRANSLATION_WORKFLOW.md`

---

## ✅ Checklist

- [x] Directus translations collection created
- [x] Translations interface configured
- [x] English content synced
- [x] Bahasa Malaysia sample added
- [ ] MS added to frontend i18n
- [ ] ZH added to frontend i18n
- [ ] Homepage component updated to use translations
- [ ] Language switcher component (optional)
- [ ] URL routing for languages (optional)
- [ ] Test all languages
- [ ] Deploy to staging

---

**Created:** March 9, 2026  
**Project:** /revamp/  
**Next Action:** Add MS to i18n/ui.ts and update homepage component
