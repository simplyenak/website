# Coding Standards — Simply Enak Revamp

This document is the authoritative reference for how code in this repo must be written. Every page, component, and piece of content must follow these rules. Read this before touching any `.astro`, `.ts`, or content `.json` file.

---

## 1. Content must live in Directus JSON — never hardcoded in templates

Every string visible to users must come from `src/data/content/*.json`, not from the template file.

**Wrong:**
```astro
<h1>Corporate & Group Tours</h1>
<p>Hosting colleagues in KL or Penang?</p>
```

**Right:**
```astro
<h1>{corporatePage?.hero_title ?? "Corporate & Group Tours"}</h1>
<p>{corporatePage?.hero_subtitle ?? "Hosting colleagues in KL or Penang?"}</p>
```

The JSON file is the single source of truth that Directus writes to. Templates are rendering engines only.

---

## 2. Every CMS field needs a hardcoded fallback

Use the `??` operator for scalar fields. Use `Array.isArray()` guards for arrays and objects. Never render `undefined`.

**Scalar fallback:**
```astro
{page?.section_heading ?? "Our Team"}
```

**Array fallback:**
```astro
const items = Array.isArray(page?.benefit_items) ? page.benefit_items : [
  { icon: "✓", title: "Default title", body: "Default body." },
];
```

**Why**: The JSON file may be missing a field if it was added to Directus after the last sync. Fallbacks prevent blank pages on production.

---

## 3. Shared site constants live in `src/lib/site-config.ts`

Phone number, email, social URLs, business stats, tour capacity — anything used in more than one place must be defined once in `site-config.ts` and imported everywhere.

```ts
// src/lib/site-config.ts
export const siteConfig = {
  whatsappNumber: '+60172878929',   // digits + country code, no spaces — safe for wa.me URLs
  phone: '+60 17-287 8929',         // display format
  email: 'booking@simplyenak.com',
  social: { instagram: '...', facebook: '...' },
  tourFeatures: { heritageVendors: '40+', guestsHosted: '5,000+' },
  maxPeoplePerTour: 9,
};
```

**Never** hardcode `60172878929`, `booking@simplyenak.com`, or `5,000+` in a template. Import `siteConfig`.

---

## 4. Settings editable by non-devs live in `src/data/content/site-settings.json`

For values a non-developer might update via Directus (WhatsApp number, social URLs, TripAdvisor link), read from `site-settings.json` with `siteConfig` as the fallback:

```astro
---
import { getSiteSettings } from '@/lib/directus';
import { siteConfig } from '@/lib/site-config';
const settings = await getSiteSettings();
const whatsapp = (settings?.whatsapp_number ?? siteConfig.whatsappNumber).replace(/\D/g, '');
const phone = settings?.phone_display ?? siteConfig.phone;
---
<a href={`https://wa.me/${whatsapp}`}>WhatsApp</a>
<a href={`tel:${siteConfig.whatsappNumber}`}>{phone}</a>
```

Chain: `settings?.field → siteConfig.field → hardcoded string`. Three levels.

---

## 5. WhatsApp URLs require digits-only — always strip non-digits

`siteConfig.whatsappNumber` is `'+60172878929'`. wa.me URLs must not contain spaces, dashes, or `+`.

```astro
const whatsapp = (settings?.whatsapp_number ?? siteConfig.whatsappNumber).replace(/\D/g, '');
// → "60172878929"
<a href={`https://wa.me/${whatsapp}`}>...</a>
```

Never paste a display-formatted number (e.g. `+60 17-287 8929`) directly into a URL. It breaks silently.

---

## 6. Page data functions live in `src/lib/directus.js`

Every page that needs CMS content calls a `get*Page(lang)` function from `directus.js`. This function:
- imports the JSON file statically
- calls `applyTranslation(data, lang)` if the page is translatable
- returns the data object

```js
// directus.js
import corporatePageData from '../data/content/corporate-groups-page.json';

export async function getCorporateGroupsPage(lang) {
  return applyTranslation(corporatePageData, lang);
}
```

No page should `import` a content JSON file directly. All imports go through `directus.js`.

---

## 7. Translatable pages must call `applyTranslation(data, lang)`

If a page will ever be read in a language other than English, its `get*Page()` function must call `applyTranslation`. The translation agent writes to `*_translations` fields in the JSON.

```js
export async function getAboutPage(lang) {
  return applyTranslation(aboutPageData, lang);  // correct
}
```

Pages that are NOT translated (e.g. legal boilerplate, internal-only) may skip `applyTranslation` — but this is the exception, not the default.

---

## 8. JSON field naming conventions

- All field names: `snake_case`
- Array fields: `field_name` (the array itself — not `field_names_list` or `field_name_items`)
- Boolean flags: `is_featured`, `has_image`, `show_cta`
- Eyebrow labels: `section_eyebrow` (e.g. `hero_eyebrow`, `benefits_eyebrow`)
- SEO fields: `seo_title`, `seo_description` (always these names, on every page JSON)
- CTA fields: `cta_label`, `cta_href`, `cta_whatsapp_label`

Arrays of objects use consistent internal keys:
- Benefit/feature cards: `{ icon, title, detail }`
- Steps: `{ title, body }`
- Simple list items: plain strings

---

## 9. Components use `siteConfig` for shared data, not inline strings

Any component that renders a phone number, email, WhatsApp link, or stat must import `siteConfig`:

```astro
---
import { siteConfig } from '@/lib/site-config';
---
<a href={`tel:${siteConfig.whatsappNumber}`}>{siteConfig.phone}</a>
```

If the component also accepts a `whatsappNumber` prop (for overriding), default to `siteConfig`:

```astro
const { whatsappNumber = siteConfig.whatsappNumber } = Astro.props;
```

---

## 10. Pages fetch data in `Promise.all` at the top of the frontmatter

```astro
---
const lang = getLangFromUrl(Astro.url);
const [pageCMS, allTours, settings] = await Promise.all([
  getCorpratePage(lang),
  getAllTours(),
  getSiteSettings(),
]);
---
```

Never fetch sequentially when fetches are independent. All data reads happen before any template logic.

---

## 11. `prerender = true` on every page

Every page must export this. This repo is SSG only — no server-side rendering at page level.

```astro
---
export const prerender = true;
---
```

---

## 12. No forbidden brand words in content defaults or fallbacks

Even hardcoded fallback strings must pass the brand voice filter. Never write these words in any `.astro` file or `.json` file:

`authentic`, `premium`, `luxury`, `discover`, `explore`, `immerse`, `customer`, `delicious`, `traditional` (without a specific story), `unique`, `best`, `#1`, `must-see`, `world-class`

See `agent_docs/brand-voice.md` for the full list and substitution guide.

---

## 13. Run `npm run build` before marking any task done

Build output must show 0 errors and at least 100 pages. If the build fails, fix it before pushing.

```bash
cd frontend/
npm run build
```

---

## Quick reference: which file to edit

| Need to change... | Edit this file |
|---|---|
| Page copy (headings, body text, CTAs) | `src/data/content/[page]-page.json` via Directus |
| Phone/email/social links | `src/lib/site-config.ts` |
| Directus-managed contact details | `src/data/content/site-settings.json` |
| Page data fetch logic | `src/lib/directus.js` |
| Template rendering logic | `src/pages/[page].astro` |
| Shared component | `src/components/[Name].astro` |
| Site-wide styles | `src/styles/global.css` |
| Navigation links | `src/data/content/navigation.json` |
