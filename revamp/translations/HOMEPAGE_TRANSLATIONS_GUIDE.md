# Setting Up Home Page Translations in Directus

## Overview
This guide will help you set up proper translations for the Simply Enak home page using Directus's built-in translations system.

## Current State
- ✅ Languages collection exists with 5 languages: English, Bahasa Malaysia, Chinese, Deutsch, Español
- ✅ `home_page` singleton collection exists with all content fields
- ⚠️ Currently using manual translation fields (`hero_title_ms`, `hero_title_zh`, etc.)
- ⚠️ Need to set up proper Directus translations interface

## Option 1: Set Up Translations via Directus UI (Recommended)

### Step 1: Create the Translations Collection

1. **Go to Directus** → http://localhost:8055
2. **Navigate to** Settings (⚙️) → Data Model
3. **Click** "Create Collection"
4. **Configure:**
   - Name: `Home Page Translations`
   - Key: `home_page_translations`
   - Icon: `translate`
   - Note: "Translations for home page content"
5. **Click** "Create Collection"

### Step 2: Add Fields to Translations Collection

Add the following fields to `home_page_translations`:

| Field Name | Type | Interface | Note |
|------------|------|-----------|------|
| `home_page_id` | Integer | Input | Reference to home page (PK) |
| `languages_code` | String | Select Dropdown | Language code (FK to languages.code) |
| `hero_title` | String | Input | Hero section title |
| `hero_highlight` | String | Input | Hero highlight text |
| `hero_title_end` | String | Input | Hero title ending |
| `hero_subtitle` | Text | Multiline | Hero subtitle |
| `hero_description` | Text | Rich Text | Hero description |
| `hero_cta_primary_text` | String | Input | Primary CTA button |
| `hero_cta_secondary_text` | String | Input | Secondary CTA button |
| `about_title` | String | Input | About section title |
| `about_subtitle` | String | Input | About subtitle |
| `about_description` | Text | Rich Text | About description |
| `about_heritage` | Text | Rich Text | Heritage text |
| `featured_tours_title` | String | Input | Featured tours title |
| `values_title` | String | Input | Values title |
| `values_subtitle` | String | Input | Values subtitle |
| `testimonials_title` | String | Input | Testimonials title |
| `media_title` | String | Input | Media title |
| `faq_title` | String | Input | FAQ title |
| `cta_title` | String | Input | CTA title |
| `cta_subtitle` | Text | Multiline | CTA subtitle |
| `final_cta_title` | String | Input | Final CTA title |
| `final_cta_description` | Text | Multiline | Final CTA description |
| `final_cta_button_text` | String | Input | Final CTA button |
| `meta_title` | String | Input | SEO meta title |
| `meta_description` | Text | Multiline | SEO meta description |

### Step 3: Configure Relationships

1. **home_page_id field:**
   - Type: Integer
   - Interface: Input (hidden)
   - Special: Foreign Key
   - Foreign Key Table: `home_page`
   - Foreign Key Column: `id`

2. **languages_code field:**
   - Type: String
   - Interface: Select Dropdown
   - Options: Custom values (en, ms, zh, de, es)
   - Special: Foreign Key
   - Foreign Key Table: `languages`
   - Foreign Key Column: `code`

### Step 4: Add Translations Interface to Home Page

1. **Go to** Settings → Data Model → `home_page`
2. **For each translatable field:**
   - Click the field (e.g., `hero_title`)
   - Scroll to "Translations" section
   - Enable translations
   - Select `home_page_translations` as the translations collection
   - Map the field to the corresponding translation field

### Step 5: Migrate Existing Translations

Once the structure is set up, run the migration script:

```bash
python3 migrate_homepage_translations.py
```

---

## Option 2: Quick Start with Existing Manual Fields

If you want to keep using the manual translation fields for now:

### Current Manual Translation Fields

The home_page collection already has these manual translation fields:

**Bahasa Malaysia (ms):**
- `hero_title_ms`
- `hero_highlight_ms`
- `hero_subtitle_ms`
- `about_title_ms`
- `about_description_ms`

**Chinese (zh):**
- `hero_title_zh`
- `hero_highlight_zh`
- `hero_subtitle_zh`
- `about_title_zh`
- `about_description_zh`

**German (de):**
- `hero_title_de`
- `hero_highlight_de`
- `hero_subtitle_de`
- `about_title_de`
- `about_description_de`

**Spanish (es):**
- `hero_title_es`
- `hero_highlight_es`
- `hero_subtitle_de`
- `about_title_es`
- `about_description_es`

### To Add More Manual Translations:

1. Go to Settings → Data Model → `home_page`
2. Click "+ Add Field"
3. Create fields like:
   - `hero_title_fr` (French)
   - `hero_title_ja` (Japanese)
   - etc.

---

## Testing Translations

### In Directus:
1. Go to Content → Home Page
2. You should see a language selector at the top
3. Switch between languages and verify translations appear

### On Website:
```bash
# Test with different language prefixes
http://localhost:8055/  # Default (English)
http://localhost:8055/ms  # Bahasa Malaysia
http://localhost:8055/zh  # Chinese
```

---

## Next Steps After Setup

1. **Add Translations for Key Sections:**
   - Hero section (title, subtitle, description, CTAs)
   - About section (title, description, heritage)
   - Featured tours title
   - Values section
   - Final CTA

2. **Update Website Frontend:**
   - Modify Astro components to read from translations
   - Add language detection/routing
   - Implement language switcher

3. **Content Translation:**
   - Translate to Bahasa Malaysia (primary market)
   - Translate to Chinese (significant tourist market)
   - Optional: German, Spanish for broader appeal

---

## Files Created

| File | Purpose |
|------|---------|
| `setup_homepage_translations.py` | Script to create translations collection |
| `migrate_homepage_translations.py` | Script to migrate existing manual translations |
| `check_homepage_structure.py` | Diagnostic script to check current structure |
| `check_directus_collections.py` | Diagnostic script to check all collections |

---

## Support

For issues or questions:
1. Check Directus docs: https://docs.directus.io/guides/localization/
2. Review existing translations setup (tours_translations, faqs_translations)
3. Contact system administrator
