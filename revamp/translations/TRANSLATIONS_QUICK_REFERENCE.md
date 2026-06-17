# 🌍 Quick Reference: Home Page Translations

## 🚀 Quick Start

### View Translations in Directus
```
1. Go to: http://localhost:8055
2. Click: Content → Home Page
3. Look for: Language selector (top right)
4. Choose: EN | MS | ZH | DE | ES
```

### Add/Edit Translations
```
1. Content → Home Page
2. Select language
3. Edit content
4. Click Save
```

---

## 📊 Translation Status

| Language | Code | Status | Fields |
|----------|------|--------|--------|
| English | en | ✅ Complete | 25/25 |
| Bahasa Malaysia | ms | ✅ Sample | 25/25 |
| Chinese | zh | ⏳ Pending | 0/25 |
| German | de | ⏳ Pending | 0/25 |
| Spanish | es | ⏳ Pending | 0/25 |

---

## 🔧 Scripts

| Command | What it Does |
|---------|-------------|
| `python3 extract_translations_for_csv.py` | Extract English content to CSV |
| `python3 import_homepage_translations.py` | Import translations from CSV |
| `python3 setup_translations_interface.py` | Configure Directus UI |

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `homepage_translations_template.csv` | Fill this with translations |
| `homepage_translations_sample_ms.csv` | Example (Bahasa Malaysia) |
| `TRANSLATION_WORKFLOW.md` | Full workflow guide |

---

## 📝 To Add New Translations

1. **Open CSV:**
   ```
   homepage_translations_template.csv
   ```

2. **Fill in columns:**
   - `ms` = Bahasa Malaysia
   - `zh` = Chinese
   - `de` = German
   - `es` = Spanish

3. **Run import:**
   ```bash
   python3 import_homepage_translations.py
   ```

4. **Verify in Directus:**
   - Content → Home Page
   - Switch language
   - Check content

---

## 🎯 Translation Tips

✅ **Do:**
- Keep character limits in mind
- Maintain warm, friendly tone
- Adapt cultural references
- Have native speakers review

❌ **Don't:**
- Translate: "RM", URLs, "Simply Enak"
- Exceed SEO character limits
- Use Google Translate without review

---

## 📞 Help

- **Workflow Guide:** `/website/TRANSLATION_WORKFLOW.md`
- **Setup Guide:** `/website/HOMEPAGE_TRANSLATIONS_GUIDE.md`
- **Directus Docs:** https://docs.directus.io/guides/localization

---

**Quick Link:** http://localhost:8055/admin/content/home_page
