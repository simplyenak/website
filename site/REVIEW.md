# Code & Quality Review: Simply Enak Pages and Components

> Generated 2026-07-29. Focus: SEO, A11y, Performance, Code Quality, Brand Voice.

---

## 1. pages/index.astro (Homepage)

### 1.1 — Empty alt on LCP hero image (Lines 106-107)
**Severity:** High | **Category:** Accessibility / SEO  
```astro
<img alt="" class="w-full h-full object-cover opacity-40" src={getImageUrl(hp.hero.heroImage)} fetchpriority="high" />
```
The hero image is the Largest Contentful Paint (LCP) element. An empty `alt=""` tells screen readers to skip it, and Google may interpret it as decorative. Since this is the primary visual branding of the page, it should have a meaningful alt (e.g. `alt="Malaysian street food being prepared at a hawker stall"`).
**Fix:** Pass `alt` from Payload's `hp.hero.heroImageAlt` (or compute a descriptive fallback from the page title). Change `alt=""` to `alt={heroAlt}` where `heroAlt` comes from CMS data.

### 1.2 — Render-blocking inline `<script>` for chip animation (Lines 201-221)
**Severity:** Medium | **Category:** Performance  
A 1.2KB inline `<script is:inline>` randomly highlights segment chips every 10 seconds. This blocks rendering until parsed/executed.
**Fix:** Either (a) move to an external `.js` file with `type="module"` and defer, or (b) add `defer` or move it to before `</body>` using a `<Fragment slot="scripts">` pattern. Alternatively, replace the JS randomizer with a CSS-only approach (e.g. `nth-child` pseudo-random).

### 1.3 — Hardcoded philosophy card content (Lines 27-46)
**Severity:** Medium | **Category:** Brand Voice / Code Quality  
Three philosophy cards ("The People", "The Stories", "The Location") are hardcoded in JS. This bypasses the Payload CMS entirely — editors cannot update brand messaging without code changes.
**Fix:** Source these from Payload's homepage data (`hp.philosophyCards`) which already has `philosophy` section (eyebrow/heading used at lines 228-229). Add card sub-fields to the Payload collection or fetch them from a reusable "brand blocks" collection.

### 1.4 — Missing `lang`-aware homepage metadata title (Line 55)
**Severity:** Low | **Category:** SEO / i18n  
```js
const metadata = {
  title: 'Malaysian Food Tours in KL & Penang',
  description: 'Small-group food tours...',
};
```
The title is hardcoded English, not sourced from Payload's SEO config. Each locale should serve translated titles.
**Fix:** Use `hp.seo_title || hp.title || 'Malaysian Food Tours in KL & Penang'` and add `seo_title` / `seo_description` fields to the Homepage collection in Payload.

### 1.5 — Inline SVG icon paths for philosophy cards (Lines 48-51)
**Severity:** Low | **Category:** Performance / Code Quality  
Full SVG path data for icons (`people`, `stories`, `location`) is inlined as strings in JS frontmatter and rendered inline. Each is ~200-400 bytes of non-reusable SVG data.
**Fix:** Use the existing `Icon` component from `astro-icon/components` with Tabler icon names (e.g. `<Icon name="tabler:users" />`) instead of raw SVG paths.

---

## 2. pages/tours/index.astro (Tours Listing)

### 2.1 — Missing canonical URL in metadata (Lines 16-19)
**Severity:** High | **Category:** SEO  
```js
const metadata = {
  title: tp.seo_title || 'Food Tours in Malaysia',
  description: tp.seo_description || 'Explore our range...',
};
```
No `canonical` property. The auto-generated canonical from the URL might produce duplicate-content signals with i18n alternate paths (e.g. `/tours` vs `/ms/tours`).
**Fix:** Add `canonical: 'https://simplyenak.com/tours'` to the metadata object.

### 2.2 — No `loading="lazy"` on below-fold images (Line 210, 307, city cards, specialty cards, etc.)
**Severity:** High | **Category:** Performance  
All `<img>` tags in dietary/city/specialty/travel-type sections lack `loading="lazy"`. These cards appear far below the fold and should not compete with above-fold resources.
**Fix:** Add `loading="lazy"` to every image below the hero/initial viewport. Example at line 210:
```astro
<img src={...} alt={s.name} class="..." loading="lazy" />
```

### 2.3 — Hardcoded fallback CDN image URLs (Lines 210, 307)
**Severity:** Medium | **Category:** Code Quality / SEO  
```astro
src={dietaryImageMap[s.slug] || getImageUrl(tp.dietary_image) || 'https://se-website-images.s3.nl-ams.scw.cloud/vegetarian-heritage.jpg'}
```
Fallback URLs to Scaleway bucket are hardcoded. If images are removed from Payload, broken images will appear and the hardcoded CDN path will 404 if the bucket key changes.
**Fix:** Use a single constant fallback image path from site config, or remove hardcoded fallbacks entirely and handle missing images gracefully with CSS placeholders/background patterns.

### 2.4 — No `ItemList` / `CollectionPage` structured data (meta description only)
**Severity:** Medium | **Category:** SEO  
The page lists multiple tours but has no `ItemList` or `CollectionPage` schema markup to tell Google this is a curated collection.
**Fix:** Add `ItemList` schema with the signature tours as items, and/or `CollectionPage` type on the BreadcrumbList's item.

### 2.5 — Section `<nav>` labels too generic (Line 60)
**Severity:** Low | **Category:** Accessibility  
```astro
<nav class="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm" aria-label="Tours page sections">
```
The `aria-label` is correct on the `<nav>` itself, but the individual anchor links lack distinct descriptors for screen reader context beyond their visible text. If two sections have similar names, a screen reader user loses orientation.
**Fix:** Add `aria-label` to individual `href="#city"` links mapping to section headings, or use `aria-describedby` on nav items to reference section heading IDs.

---

## 3. pages/tours/[slug].astro (Individual Tour)

### 3.1 — No explicit canonical URL (Lines 126-129)
**Severity:** High | **Category:** SEO  
```js
const meta = {
  title: `${tour.name} | ${tour.tagline || 'Guided Food Tour'}`,
  description: tour.shortDesc || tour.tagline || "",
};
```
No `canonical` set. Each tour slug should self-declare its canonical URL to prevent i18n and parameter-based duplication.
**Fix:** Add `canonical: `https://simplyenak.com/tours/${tour.slug}`` to the meta object.

### 3.2 — Hardcoded brand-voice-violating fallback (Line 421)
**Severity:** Medium | **Category:** Brand Voice  
```astro
<p class="text-sm text-muted mt-0.5">{food.desc || foodDescriptions[food.name] || 'Authentic Malaysian dish'}</p>
```
The brand voice guidelines prohibit the word 'authentic'. This fallback also hardcodes text that should come from Payload.
**Fix:** Change fallback to `'Traditional Malaysian dish'` or `'Local Malaysian specialty'`. Better yet, ensure `foodDescriptions` is always populated from Payload and remove the fallback string.

### 3.3 — Hardcoded section headings "What's on the Menu" / "Food You'll Taste" (Lines 412-413)
**Severity:** Medium | **Category:** Brand Voice / i18n  
```astro
<p class="font-bold text-xs uppercase text-accent mb-2 tracking-[0.2em]">What's on the Menu</p>
<h2 class="font-bold font-heading text-default text-2xl md:text-3xl">Food You'll Taste</h2>
```
These headings are hardcoded English, not using the `t()` translation function or sourced from Payload. Non-English locales miss them.
**Fix:** Use translation keys (e.g. `{t('tour.whatsOnTheMenu')}`) or source from the tour's Payload data.

### 3.4 — Breadcrumb inside sticky nav not using schema markup (Lines 226-253)
**Severity:** Low | **Category:** SEO  
The visual breadcrumb at lines 247-251 (`Home > Tours > Tour Name`) is plain HTML, not marked up with `itemprop` or wrapped as `BreadcrumbList` schema. However, `PageLayout` generates a BreadcrumbList schema globally — but its breadcrumb is built from URL path segments, not the section context. The visual breadcrumb and the schema breadcrumb may diverge.
**Fix:** Either wrap the visual breadcrumb in `itemscope itemtype="https://schema.org/BreadcrumbList"` with `itemprop` attributes, or ensure the global schema matches exactly.

### 3.5 — Star rating inline SVGs repeated per review (Lines 624-626)
**Severity:** Low | **Category:** Performance / Code Quality  
```astro
{Array.from({ length: r.rating }).map(() => (
  <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927..."/></svg>
))}
```
A full SVG path for each star is inlined per review. With 6 reviews × 5 stars = 30 repeated SVG path elements.
**Fix:** Define a star SVG once as a `<symbol>` or use an Astro component that renders via `<Icon name="tabler:star-filled" />` (from the existing `astro-icon` dependency).

---

## 4. pages/stories/[slug].astro (Individual Story)

### 4.1 — Author hardcoded as 'Pauline' (Line 41)
**Severity:** Medium | **Category:** Code Quality  
```js
author: 'Pauline',
```
The story author is hardcoded, not sourced from Payload's `story.author` field. If Pauline is unavailable or multiple authors contribute, this will be incorrect.
**Fix:** Use `story.author || 'Simply Enak'` so the field is dynamic. Add an `author` relationship field to the Story collection in Payload if not already present.

### 4.2 — Canonical URL computed but not passed in `meta` (Line 50 vs 52-55)
**Severity:** Medium | **Category:** SEO  
```js
const url = getCanonical(getPermalink(post.permalink, 'post'));   // Line 50
const meta = {
  title: story.meta_title || story.title || '',
  description: story.excerpt || '',
};                                                                 // Lines 52-55
```
`url` is computed but never included in the `meta` object's `canonical` property. The `<Layout>` auto-generates a canonical from the URL path, but without the explicit canonical the multi-language alternate URLs may create duplicate-content ambiguity.
**Fix:** Add `canonical: typeof url === 'string' ? url : String(url)` to the `meta` object.

### 4.3 — Duplicate metadata logic (Lines 46 vs 52-55)
**Severity:** Low | **Category:** Code Quality  
```js
// Line 46 — inside post object
metadata: { title: story.meta_title || story.title, description: story.excerpt || '' },
// Lines 52-55 — meta for Layout
const meta = {
  title: story.meta_title || story.title || '',
  description: story.excerpt || '',
};
```
The same fallback logic appears in two places with slightly different fallback handling (`''` vs `||`). This is maintenance debt — changing one will break sync.
**Fix:** Compute metadata once:
```js
const metaTitle = story.meta_title || story.title || '';
const metaDesc = story.excerpt || '';
```
Then use `metaTitle` and `metaDesc` in both objects.

### 4.4 — Category fallback hardcoded (Lines 43-44)
**Severity:** Low | **Category:** Code Quality / Brand Voice  
```js
category: story.category
  ? { title: story.category, slug: story.category.toLowerCase().replace(/\s+/g, '-') }
  : { title: 'Food & Culture Guides', slug: 'food-culture-guides' },
```
Fallback category is hardcoded in English. For non-English pages, this should be a localized default or originate from a Payload relationship.
**Fix:** Make category a required Payload relationship field on the Story collection, or use a site-config default via the `t()` translation function.

### 4.5 — `post.tags` is always empty (Line 45)
**Severity:** Low | **Category:** SEO / Code Quality  
```js
tags: [],
```
Tags are hardcoded to an empty array, meaning RelatedPosts will always show nothing (see RelatedPosts.astro line 15).
**Fix:** Map from `story.tags` ➔ `post.tags` if Payload has a tags/ keywords field on the Story collection.

---

## 5. components/blog/SinglePost.astro

### 5.1 — Featured image alt text semantically wrong (Line 123)
**Severity:** High | **Category:** Accessibility / SEO  
```astro
<img src={post.image} alt={post.excerpt || post.title} class="w-full rounded-xl shadow-md" loading="eager" />
```
Using `post.excerpt` or `post.title` as alt text describes the article's content — not the image itself. A screen reader user hears the article summary read twice (once from alt, once from the surrounding text), and search engines get duplicate-signal confusion.
**Fix:** Add a dedicated `featuredImageAlt` field on the Post type/collection and fall back to `post.image.alt` if available. If the image is purely decorative, use `alt=""`.

### 5.2 — `loading="eager"` on featured image that may be below the fold (Line 125)
**Severity:** Medium | **Category:** Performance  
The featured image sits inside the content area (line 119-128), after the hero section. Depending on hero height it may or may not be in the initial viewport. `loading="eager"` forces immediate load regardless.
**Fix:** Use `loading="lazy"` for the featured image when it's below the hero. If it's always the first content image, `loading="eager"` is acceptable — but audit hero height.

### 5.3 — BlogPosting schema missing `mainEntityOfPage` (Lines 34-52)
**Severity:** Medium | **Category:** SEO  
```js
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  ...
})} />
```
Google's structured data guidelines recommend `mainEntityOfPage` pointing to the canonical URL for article-type schema.
**Fix:** Add `"mainEntityOfPage": { "@type": "WebPage", "@id": url }` where `url` is the component's `url` prop.

### 5.4 — Missing `<article>` semantic element (Line 131)
**Severity:** Medium | **Category:** Accessibility / Semantic HTML  
```astro
<div class="prose prose-lg max-w-none dark:prose-invert ..." set:html={contentHtml}>
  <slot />
</div>
```
The content wrapper is a `<div>`. Screen readers and search engines benefit from `<article>` semantics that signal self-contained, independently-distributable content.
**Fix:** Change `<div class="prose...">` to `<article class="prose...">` with appropriate landmark role.

### 5.5 — Hero section has no hero image — gradient-only (Lines 60-66)
**Severity:** Low | **Category:** SEO / Visual Design  
The hero background is a CSS gradient (`bg-gradient-to-br from-primary/90 via-primary/70 to-accent/60`) with no background image. This misses an opportunity for social sharing and LCP optimization. Combined with a plain "Simply Enak" site name, the hero lacks visual richness.
**Fix:** Consider adding a subtle background image pattern from Payload's site branding (or reuse `post.image` as a hero background with gradient overlay).

---

## 6. components/blog/RelatedPosts.astro

### 6.1 — Renders empty section when no related posts exist (Lines 15, 19-31)
**Severity:** Medium | **Category:** Performance / Code Quality  
```astro
const relatedPosts = post.tags ? await getRelatedPosts(post, 4) : [];
...
{APP_BLOG.isRelatedPostsEnabled ? (
  <BlogHighlightedPosts ... postIds={relatedPosts.map((post) => post.id)} />
) : null}
```
If `post.tags` is falsy OR `getRelatedPosts` returns empty, the `<BlogHighlightedPosts>` component still renders an empty container with its title and "View All Posts" link. This wastes bandwidth and shows users an empty section.
**Fix:** Guard with `relatedPosts.length > 0 &&`:
```astro
{APP_BLOG.isRelatedPostsEnabled && relatedPosts.length > 0 && (
  <BlogHighlightedPosts ... postIds={relatedPosts.map((p) => p.id)} />
)}
```

### 6.2 — Hardcoded "Related Posts" title (Line 26)
**Severity:** Low | **Category:** i18n / Brand Voice  
```astro
title="Related Posts"
linkText="View All Posts"
```
These strings are hardcoded English, not translatable via the `t()` function or sourced from Payload.
**Fix:** Accept these as optional component props with defaults, or use the `t()` translation function if available in the component scope.

### 6.3 — Imports `APP_BLOG` from `astrowind:config` but config may not exist in this codebase (Line 2)
**Severity:** Low | **Category:** Code Quality  
```astro
import { APP_BLOG } from 'astrowind:config';
```
If this is a custom setup without AstroWind's config module, this import could fail or return undefined. The feature gate `APP_BLOG.isRelatedPostsEnabled` may never trigger.
**Fix:** Verify `astrowind:config` exports correctly, or replace the gate with a simpler prop like `showRelatedPosts`.

---

## 7. components/widgets/Header.astro

### 7.1 — Missing `aria-expanded` on dropdown toggle buttons (Lines 104-110)
**Severity:** High | **Category:** Accessibility  
```astro
<button type="button" class="hover:text-link dark:hover:text-white px-4 py-3 flex items-center whitespace-nowrap">
  {text}
  <Icon name="tabler:chevron-down" class="w-3.5 h-3.5 ml-0.5 rtl:ml-0 rtl:mr-0.5 hidden md:inline" />
</button>
```
The dropdown buttons for "Tours" etc. never set `aria-expanded="true/false"` to communicate menu state to screen readers. Astro static rendering means this state needs JavaScript to toggle the attribute.
**Fix:** Add `aria-expanded="false"` statically and ensure the mobile-menu JavaScript toggles `aria-expanded` when the dropdown opens/closes. Also add `aria-haspopup="true"`.

### 7.2 — Missing `aria-current="page"` on active nav links (Line 118-124)
**Severity:** Medium | **Category:** Accessibility  
```astro
<a class:list={[
  'first:rounded-t ...',
  { 'aw-link-active': href2 === currentPath },
  itemClass,
]} href={href2}>
```
Active link gets a CSS class (`aw-link-active`) but no `aria-current="page"` attribute. Screen readers won't announce the current page in navigation context.
**Fix:** Add `aria-current={href2 === currentPath ? 'page' : undefined}` to the anchor tag.

### 7.3 — Language switcher uses emoji flags (Line 56)
**Severity:** Medium | **Category:** Accessibility  
```js
const langFlags: any = { ms: '🇲🇾', zh: '🇨🇳', de: '🇩🇪', ... };
```
Emoji flags are visually inconsistent across platforms (Windows shows two-letter codes instead of flags) and screen readers may announce "Flag of Malaysia" which adds verbosity without clarifying the language option.
**Fix:** Use language abbreviations as text labels (e.g. "EN" / "MS" / "ZH") or SVG flag icons with proper `aria-label`.

### 7.4 — `ToggleMenu` component may lack proper ARIA (Line 5)
**Severity:** Medium | **Category:** Accessibility  
```astro
import ToggleMenu from '~/components/common/ToggleMenu.astro';
```
Without inspecting ToggleMenu, it's a risk: mobile hamburger menus commonly lack `aria-controls`, `aria-expanded`, and `role="dialog"` for the overlay.
**Fix:** Verify ToggleMenu has: `aria-controls="main-nav"`, `aria-expanded`, and the mobile nav panel has `role="navigation"` with `aria-label="Main menu"`.

### 7.5 — Search/toggle theme buttons missing `aria-label` 
**Severity:** Low | **Category:** Accessibility  
The `ToggleTheme` component (imported line 4) and any search buttons may lack `aria-label`. Without seeing ToggleTheme internals, this is a warning to audit that component for missing accessible labels on icon-only buttons.
**Fix:** Ensure all icon-only buttons have `aria-label` (e.g. `aria-label="Toggle dark mode"`, `aria-label="Search"`).

---

## 8. components/widgets/Footer.astro

### 8.1 — `Fragment set:html={footNote}` — potential XSS with user-generated HTML (Line 106)
**Severity:** Medium | **Category:** Security / Code Quality  
```astro
<div class="text-sm mr-4 dark:text-muted">
  <Fragment set:html={footNote} />
</div>
```
Using `set:html` without sanitization means if `footNote` ever contains user-generated content or HTML from an untrusted source, XSS is possible.
**Fix:** If `footNote` comes from site config (trusted), this is acceptable. If it comes from Payload CMS or user input, sanitize with a library like `DOMPurify` or pass as plain text only. For the copyright year, use a function:
```astro
<Fragment set:html={`© ${new Date().getFullYear()} ${SITE?.name}. All rights reserved.`} />
```

### 8.2 — No Organization structured data (Missing `sameAs` for social links)
**Severity:** Medium | **Category:** SEO  
The footer renders social media links but never injects `Organization` schema with `sameAs` URLs pointing to those profiles. Google uses `sameAs` to validate social presence for brand SERP features.
**Fix:** Add a `<script type="application/ld+json">` in the Layout or Footer that includes:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Simply Enak",
  "url": "https://simplyenak.com",
  "sameAs": ["https://instagram.com/simplyenak", "https://facebook.com/simplyenak", ...]
}
```

### 8.3 — `intersect-once` animation class may cause jarring reflow on initial load (Line 33)
**Severity:** Low | **Category:** Performance  
```astro
<div class="relative max-w-7xl mx-auto px-4 sm:px-6 dark:text-slate-300 intersect-once intersect-quarter intersect-no-queue motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade">
```
The footer starts invisible (`opacity-0`) and fades in via intersection observer. If the user loads the page and scrolls immediately, the footer may appear blank or jump in late. This adds JS overhead from intersection observers.
**Fix:** Consider removing the fade animation from the footer — it's the last thing on the page and doesn't benefit from entry animation. Or set `intersect-no-queue` (already present) and verify it works.

### 8.4 — Social link `<a>` elements contain empty `text` via `set:html` (Line 95)
**Severity:** Low | **Category:** Accessibility  
```astro
<a ... aria-label={ariaLabel} href={href}>
  {icon && <Icon name={icon} class="w-5 h-5" />}
  <Fragment set:html={text} />  <!-- text may be empty -->
</a>
```
When `text` is empty, the `<a>` element's visible content is only the icon. The `aria-label` on the `<a>` itself is correct, but the empty `set:html` fragment is unnecessary and could confuse some parsers.
**Fix:** Only render `<Fragment set:html={text} />` when `text` is truthy: `{text && <Fragment set:html={text} />}`.

### 8.5 — Company links use `Fragment set:html={text}` without sanitization (Line 73)
**Severity:** Low | **Category:** Security  
```astro
<Fragment set:html={text} />
```
Same pattern as 8.1 — `text` is rendered as raw HTML. If these links come from Payload or a CMS where editors can add rich text, this is a risk.
**Fix:** Same as 8.1 — sanitize or use plain text.

---

## Cross-Cutting Issues

| Issue | Affected Files | Severity |
|---|---|---|
| Missing explicit `canonical` on all page-level metadata | index.astro, tours/index.astro, tours/[slug].astro, stories/[slug].astro | **High** SEO |
| Empty or semantically wrong `alt` on hero/LCP images | index.astro (line 106), SinglePost.astro (line 123) | **High** A11y/SEO |
| Missing `loading="lazy"` on below-fold images | tours/index.astro (lines 210, 307+) | **High** Perf |
| Hardcoded brand text not from Payload | index.astro (philosophy cards), tours/[slug].astro (headings, fallbacks) | **Medium** Brand Voice |
| `set:html` without sanitization on potentially user-sourced content | Footer.astro (footNote, link text) | **Medium** Security |
| Missing `aria-expanded`/`aria-current` in navigation | Header.astro (dropdown buttons, active links) | **Medium** A11y |
| Inline SVGs repeated (star ratings, icon paths) | tours/[slug].astro (review stars), index.astro (philosophy icons) | **Low** Perf |
| Hardcoded `tags: []` prevents related posts | stories/[slug].astro, RelatedPosts.astro | **Low** SEO |
| No `Organization` schema with social `sameAs` | Footer.astro / Layout.astro | **Medium** SEO |
| Render-blocking inline script | index.astro (lines 201-221) | **Medium** Perf |
