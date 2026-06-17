# Simply Enak Translation Workflow

## Overview
This document describes the complete workflow for managing translations of the Simply Enak landing page using Directus.

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `homepage_translations_template.csv` | CSV template with English content ready for translation |
| `extract_translations_for_csv.py` | Extracts content from Directus to CSV |
| `import_homepage_translations.py` | Imports translated CSV back to Directus |
| `setup_translations_interface.py` | Configures Directus UI for translations |
| `TRANSLATION_WORKFLOW.md` | This workflow document |

---

## 🔄 Translation Workflow

### Phase 1: Extract Content (Done ✅)

```bash
python3 extract_translations_for_csv.py
```

**What it does:**
- Connects to Directus
- Extracts all translatable content from home page
- Creates `homepage_translations_template.csv` with English content
- Includes context and character limits for each field

**Output:**
- 25 translatable fields organized by section
- English content pre-filled
- Empty columns for MS, ZH, DE, ES ready for translation

---

### Phase 2: Translate Content

**Option A: Professional Translation Service**
1. Send `homepage_translations_template.csv` to translator
2. Specify target languages: MS, ZH, DE, ES
3. Request they maintain context and character limits
4. Receive completed CSV back

**Option B: Manual Translation**
1. Open `homepage_translations_template.csv` in Excel/Google Sheets
2. Fill in translations column by column:
   - `ms` = Bahasa Malaysia
   - `zh` = Chinese (Simplified)
   - `de` = German
   - `es` = Spanish
3. Save the file when complete

**Option C: AI Translation (Quick Draft)**
```bash
# Use AI to generate first draft translations
# Then have native speaker review
```

**Translation Guidelines:**
- Keep character limits in mind (especially for SEO fields)
- Maintain brand voice: warm, authentic, friendly
- Don't translate: "RM", URLs, proper nouns (Simply Enak)
- Adapt cultural references when needed

---

### Phase 3: Import Translations

```bash
python3 import_homepage_translations.py
```

**What it does:**
- Reads completed CSV
- Creates/updates entries in `home_page_translations` collection
- Imports all 5 languages (EN, MS, ZH, DE, ES)
- Reports success/failure for each language

**Expected Output:**
```
✅ English (en): 25 fields
✅ Bahasa Malaysia (ms): 25 fields
✅ Chinese (zh): 25 fields
✅ German (de): 25 fields
✅ Spanish (es): 25 fields
```

---

### Phase 4: Verify in Directus

1. **Go to Directus:** http://localhost:8055
2. **Navigate to:** Content → Home Page
3. **Look for:** Language selector (top right corner)
4. **Switch between languages** to verify translations
5. **Edit if needed** directly in the UI

**Alternative Verification:**
- Content → Home Page Translations
- View all translation entries by language

---

## 🎨 Using Translations in Directus

### For Content Editors:

**Editing Home Page Content:**
1. Go to Content → Home Page
2. Select language from dropdown (top right)
3. Edit content in that language
4. Click Save (top right)
5. Switch to another language and repeat

**Adding New Translations:**
1. Content → Home Page Translations
2. Click "+ Create Item"
3. Select:
   - Home Page: 1
   - Language: [select language]
4. Fill in all fields
5. Save

---

## 📊 Current Status

| Section | Fields | EN | MS | ZH | DE | ES |
|---------|--------|----|----|----|----|----|
| Hero | 8 | ✅ | ⏳ | ⏳ | ⏳ | ⏳ |
| About | 4 | ✅ | ⏳ | ⏳ | ⏳ | ⏳ |
| Tours | 1 | ✅ | ⏳ | ⏳ | ⏳ | ⏳ |
| Values | 2 | ✅ | ⏳ | ⏳ | ⏳ | ⏳ |
| Testimonials | 1 | ✅ | ⏳ | ⏳ | ⏳ | ⏳ |
| Media | 1 | ✅ | ⏳ | ⏳ | ⏳ | ⏳ |
| FAQ | 1 | ✅ | ⏳ | ⏳ | ⏳ | ⏳ |
| CTA | 2 | ✅ | ⏳ | ⏳ | ⏳ | ⏳ |
| Final CTA | 3 | ✅ | ⏳ | ⏳ | ⏳ | ⏳ |
| SEO | 2 | ✅ | ⏳ | ⏳ | ⏳ | ⏳ |
| **TOTAL** | **25** | **✅** | **⏳** | **⏳** | **⏳** | **⏳** |

✅ = Complete | ⏳ = Pending

---

## 🔧 Technical Details

### Database Structure:

**home_page (singleton):**
- Contains English content (default)
- Non-translatable fields (images, URLs, etc.)

**home_page_translations:**
- `id` (primary key)
- `home_page_id` (FK to home_page.id)
- `languages_code` (FK to languages.code)
- 25 translatable text fields

**languages:**
- `code`: en, ms, zh, de, es
- `name`: English, Bahasa Malaysia, etc.
- `direction`: ltr

### API Endpoints:

```bash
# Get home page (English)
GET /items/home_page

# Get translations for specific language
GET /items/home_page_translations?filter={
  "home_page_id": {"_eq": 1},
  "languages_code": {"_eq": "ms"}
}

# Update translation
PATCH /items/home_page_translations/{id}
```

---

## 📝 Next Steps

1. **Fill in translations** in `homepage_translations_template.csv`
2. **Run import script:** `python3 import_homepage_translations.py`
3. **Verify in Directus:** Check each language displays correctly
4. **Update website frontend** to use translations based on URL/language
5. **Set up language routing** on website (e.g., /ms/, /zh/, etc.)

---

## 🆘 Troubleshooting

**Issue:** Language selector not showing in Directus
- **Solution:** Run `setup_translations_interface.py` again
- **Check:** home_page collection has translations enabled in Settings → Data Model

**Issue:** Import script fails
- **Solution:** Check CSV format, ensure no special characters breaking parsing
- **Check:** Directus is running and accessible

**Issue:** Translations not appearing on website
- **Solution:** Frontend needs to be updated to read from translations
- **Check:** API calls include language parameter

---

## 📞 Support

For questions or issues:
1. Check this workflow document
2. Review Directus localization docs: https://docs.directus.io/guides/localization
3. Contact system administrator

---

**Last Updated:** March 9, 2026
**Version:** 1.0
**Status:** Interface configured, awaiting translations
