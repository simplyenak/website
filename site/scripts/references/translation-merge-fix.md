# Translation Merge Fix — 2026-08-24

## Problem
Translation monitoring files (`src/i18n/translations/stories-translations-{lang}.json`) use sequential numeric keys (1, 2, 3...), but stories in `stories.json` have non-sequential Payload IDs (1, 2, 268, 301...). The merge script was incorrectly matching by story ID instead of array position.

## Key Insight
Both files are sorted identically — by Payload creation order. The Nth entry in the translation file corresponds to the Nth story in stories.json, regardless of the actual story ID.

## Solution
The merge script (`scripts/merge-stories-translations.mjs`) now matches by array index:
```javascript
for (let i = 0; i < stories.length; i++) {
  const idx = String(i + 1); // Translation files use 1-based keys
  const transData = translationsByLang[lang]?.[idx];
  // ... merge by index, not by story.id
}
```

## Coverage Results
After fix:
- de: 90/92 stories have translations, 4 have full content
- fr: 89/92 stories have translations, 7 have full content
- Other locales: 30-42 stories with translations, 0-1 with content

## Known Issue: [object Object] in Content
Some translations have `content: "[object Object]"` instead of actual markdown. This happens when the LLM response is parsed incorrectly. The `cleanMarkdown()` function should handle this, but occasionally it doesn't strip the value properly.

Fix in translate-missing-stories-fast.mjs:
```javascript
const contentResult = await llmCall(contentPrompt);
translation.content = typeof contentResult === 'string' ? contentResult : JSON.stringify(contentResult);
```

Also added h1 stripping in locale templates to avoid duplicate headings.
