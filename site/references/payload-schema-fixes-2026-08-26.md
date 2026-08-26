# Payload Schema Drift - Known Issues (2026-08-26)

## Enum Value Drift: Missing 'scheduled' Status

### Problem
Payload admin queries for `status='scheduled'` but the enum doesn't include it. This causes 873+ error logs.

### Symptom
```
invalid input value for enum enum_stories_status: "scheduled"
```

### Fix Applied (2026-08-26)
Added 'scheduled' to these enums via direct ALTER TYPE:

```sql
-- Stories collection
ALTER TYPE enum_stories_status ADD VALUE IF NOT EXISTS 'scheduled';
ALTER TYPE enum_stories_workflow_status ADD VALUE IF NOT EXISTS 'scheduled';

-- Content briefs
ALTER TYPE enum_content_briefs_status ADD VALUE IF NOT EXISTS 'scheduled';

-- Locations and neighborhoods
ALTER TYPE enum_locations_status ADD VALUE IF NOT EXISTS 'scheduled';
ALTER TYPE enum_neighborhoods_status ADD VALUE IF NOT EXISTS 'scheduled';
```

### How to Apply to New Enums
When adding a new select field option to a Payload collection:

```bash
# 1. Check current enum values
ssh simplyenak "docker exec simplyenakbackend_payload-postgres.1 rpcabp0f99ig4llx9qu0vdc0y psql -U payload -d payload_production -c \"SELECT enum_range(null::enum_<table>_<column>);\""

# 2. Add missing values one at a time
ssh simplyenak "docker exec simplyenakbackend_payload-postgres.1 rpcabp0f99ig4llx9qu0vdc0y psql -U payload -d payload_production -c \"ALTER TYPE enum_<table>_<column> ADD VALUE 'new_value';\""
```

**Important**: Run each ALTER TYPE as a separate statement (not in a transaction block with other operations).

### Prevention
Add ALTER TYPE statements to `fix-schema-drift.sql` so they apply on container startup.

### Detection
```bash
# Check for scheduled enum errors
ssh simplyenak "docker logs simplyenakbackend_payload.1.q5epwdtzzgqvyjljkaj4uc0p9 --tail 100 2>&1 | grep 'scheduled'"

# Count errors
ssh simplyenak "docker logs simplyenakbackend_payload.1.q5epwdtzzgqvyjljkaj4uc0p9 2>&1 | grep -c 'cannot be queried'"
```

## Double H1 Pattern in Story Templates

### Problem
When a locale has translated titles but NO content translations, the template renders both:
1. The translated title in the template's `<h1>` (from `post.title`)
2. The English content with its own `<h1>` from `content_markdown`

### Fix Applied (2026-08-26)
Strip ALL `<h1>` tags from fallback content when no translation exists:

```javascript
// In src/pages/{locale}/stories/[slug].astro
let finalContent = contentHtml;
if (story.translations) {
  const locale = Astro.url.pathname.split('/')[1];
  const trans = story.translations.find((t) => t.languages_code === locale);
  if (trans?.content && typeof trans.content === 'string' && !trans.content.startsWith('[object Object]')) {
    // Use translated content (strip leading # Title and code fences)
    let translatedMarkdown = trans.content;
    translatedMarkdown = translatedMarkdown.replace(/^```[a-z]*\n?/, '').replace(/```$/, '');
    translatedMarkdown = translatedMarkdown.replace(/^#[^\n]+\n\n?/, '');
    finalContent = marked.parse(translatedMarkdown);
  } else if (!trans?.content) {
    // No translation - use original content but strip h1 tags
    let cleanContent = contentHtml;
    cleanContent = cleanContent.replace(/<h1[^>]*>.*?<\/h1>/gis, '');
    finalContent = cleanContent;
  }
}
```

### Verification
```bash
# Should return 1 (only the template's h1, not the content's h1)
curl -sL "https://simplyenak.com/{locale}/stories/{slug}/" | grep -c '<h1'
```

### Files Modified
- `site/src/pages/de/stories/[slug].astro`
- `site/src/pages/fr/stories/[slug].astro`
- `site/src/pages/ja/stories/[slug].astro`
- `site/src/pages/zh/stories/[slug].astro`
- `site/src/pages/ms/stories/[slug].astro`
- `site/src/pages/nl/stories/[slug].astro`
- `site/src/pages/es/stories/[slug].astro`
- `site/src/pages/ru/stories/[slug].astro`
- `site/src/pages/pt/stories/[slug].astro`

## Translation Coverage Status (2026-08-26)

| Locale | Titles | Full Content |
|--------|--------|--------------|
| es | 92/92 | 58/92 |
| nl | 91/92 | 57/92 |
| fr | 91/92 | 22/92 |
| de | 90/92 | 7/92 |
| ms | 42/92 | 0/92 |
| zh | 40/92 | 0/92 |
| ru | 40/92 | 0/92 |
| pt | 42/92 | 0/92 |
| ja | 12/92 | 0/92 |

Blocked on: Invalid Omniroute API key (401) and invalid Gemini API key.
