# Simply Enak i18n Operations - Session Notes (2026-08-26)

## Double H1 Fix Pattern

When locales have translated titles but no content translations, story templates render both:
1. Translated title in template `<h1>` (from `post.title`)
2. English content with its own `<h1>` from `content_markdown`

### Solution
All 10 locale story templates now strip `<h1>` tags from fallback content:

```javascript
// Pattern to apply to ALL locale templates
let finalContent = contentHtml;
if (story.translations) {
  const locale = Astro.url.pathname.split('/')[1];
  const trans = story.translations.find((t) => t.languages_code === locale);
  if (trans?.content && typeof trans.content === 'string' && !trans.content.startsWith('[object Object]')) {
    // Use translated content (strip # Title and code fences)
    let translatedMarkdown = trans.content;
    translatedMarkdown = translatedMarkdown.replace(/^```[a-z]*\n?/, '').replace(/```$/, '');
    translatedMarkdown = translatedMarkdown.replace(/^#[^\n]+\n\n?/, '');
    finalContent = marked.parse(translatedMarkdown);
  } else if (!trans?.content) {
    // No translation - strip h1 tags from fallback content
    let cleanContent = contentHtml;
    cleanContent = cleanContent.replace(/<h1[^>]*>.*?<\/h1>/gis, '');
    finalContent = cleanContent;
  }
}
```

## Navigation Locale Bug (Fixed)

All non-English locale pages had navigation links pointing to `/ms/` instead of their own locale prefix.

### Root Cause
`site/src/navigation.ts` hardcoded `/ms` for all non-English locales:
```typescript
// BROKEN
const p = (path: string) => lang === 'en' ? getPermalink(path) : getPermalink(`/ms${path}`);
```

### Fix
```typescript
// FIXED
const p = (path: string) => lang === 'en' ? getPermalink(path) : getPermalink(`/${lang}${path}`);
```

## Translation Merge Script Fix

Translation monitoring files use **story IDs as keys** (e.g., "1", "268", "301"), NOT sequential indices.

The merge script (`scripts/merge-stories-translations.mjs`) matches by ID:
- Loads stories.json, builds Map of id → story
- For each translation file, looks up each key in the Map
- Merges translation data into matching story

### Verification
```bash
# Check alignment
node -e "const fs=require('fs');const s=JSON.parse(fs.readFileSync('src/data/content/stories.json'));console.log('First 5 IDs:', s.slice(0,5).map(x=>x.id));const t=JSON.parse(fs.readFileSync('src/i18n/translations/stories-translations-de.json'));console.log('First 5 keys:', Object.keys(t).slice(0,5))"
```

## API Key Issues

Both translation API keys are invalid:
- **Omniroute API key**: 401 Unauthorized
- **Gemini API key**: Invalid (error code 3)

This prevents translating new content or re-translating missing stories.

### Alternative Approaches
1. Get a valid Omniroute API key (for glm-5.2 model)
2. Get a valid Gemini API key
3. Configure a different translation provider (OpenAI, Anthropic, etc.)

## Commit History (2026-08-26)

- `dc59c164` fix: strip h1 from fallback content in all locales without translations
- `1d88dfb1` fix: resolve double h1 on stories without translated content
- `c3176f5a` fix: remove extra quotes from translated titles
- `320dc6f0` feat: complete translations for es/nl/fr locales
- `b78559e1` fix: use actual locale code in navigation instead of hardcoded /ms
