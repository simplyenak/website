# Cloudflare Worker Review: `cdn-rewriter.js`

**File:** `/var/home/maarten/website-optimization/site/workers/cdn-rewriter.js`
**Lines:** 218
**Reviewed:** 2026-07-29

---

## Issue #1 — CRITICAL: Redirect map is ~50% duplicated due to missing trailing-slash normalization

**Lines:** 10–90 (68 entries, ~34 are trailing-slash duplicates)

Every redirect in `REDIRECTS` appears twice — once with a trailing slash, once without:
```js
"/terms-conditions": "/terms",
"/terms-conditions/": "/terms",
"/street-food-culture": "/stories/must-try-malaysian-street-food",
"/street-food-culture/": "/stories/must-try-malaysian-street-food",
```

This pattern repeats for **30 of the ~34 non-locale redirects**. The map is 2× larger than needed, harder to maintain (miss a variant = broken redirect), and wastes Worker CPU on every request doing 68 lookups instead of ~35.

**Fix:** Normalize the incoming pathname before lookup by stripping trailing slashes (except for root `/`). Store only the no-trailing-slash version in `REDIRECTS`.

```js
// Before line 105:
var lookupPath = url.pathname.replace(/\/$/, '') || '/';
// Then line 111 becomes:
var redirectTarget = REDIRECTS[lookupPath];
```

This cuts the map from 68 to ~36 entries and eliminates the duplication risk.

---

## Issue #2 — HIGH: Every static asset request incurs Worker overhead before bypassing

**Lines:** 105–128

Every request on `simplyenak.com/*` — including images (`logo.jpg`), CSS (`style.css`), JS (`bundle.js`), fonts, PDFs — must run through:

1. **Line 105:** `.html` endsWith check
2. **Line 111:** 68-entry `REDIRECTS` hash lookup
3. **Line 119–121:** Accept header parsing

Before finally being passed through to origin (line 122). For a site with heavy image/CSS traffic, this is significant unnecessary Worker invocation cost.

**Fix:** Add an early-exit URL pattern check before any redirect logic:

```js
var STATIC_PATTERN = /\.(jpg|jpeg|png|webp|gif|svg|css|js|ico|woff2|pdf|mp4|webm)(\?.*)?$/;
function isStaticAsset(path) {
  return STATIC_PATTERN.test(path);
}

// In handleRequest, before line 105:
if (isStaticAsset(url.pathname)) {
  var originResponse = await fetch(/*...*/);
  return addCaching(originResponse, url.pathname);
}
```

This also corrects a secondary flaw: the current Accept-header check on line 121 treats `Accept: text/html,image/webp,*/*` as HTML-worthy (it contains `text/html`), incorrectly sending some asset requests through the full HTML pipeline.

---

## Issue #3 — HIGH: S3→CDN replacement detection is unreliable / false positive

**Lines:** 173–177

```js
html = html.replace(/https:\/\/se-website-images\.s3\.nl-ams\.scw\.cloud/g, CDN_ROOT);
if (html.indexOf(CDN_ROOT) >= 0) didReplace = true;

if (!didReplace && html.indexOf("S3_ORIGIN") == -1) {
```

Three problems:

1. **False-positive detection** (line 175): After the `.replace()`, the code checks `html.indexOf(CDN_ROOT)` to decide if a replacement happened. But `CDN_ROOT` (`https://cdn.simplyenak.com`) could legitimately appear in page content — a blog post linking to a CDN image, a user review mentioning the CDN URL, etc. This would set `didReplace = true` even when no S3 URLs were present, sending the response through the "changed" cache path unnecessarily.

2. **Magic string anti-pattern** (line 177): The string `"S3_ORIGIN"` appears to be a fallback check. But it's a literal string that might appear in real content. If someone writes "Our old S3_ORIGIN was..." it breaks the heuristic. There's no documentation of what `S3_ORIGIN` is or where it comes from.

3. **Both branches set identical cache headers** (lines 180, 189): The "no changes" branch and "changes made" branch both set `"public, s-maxage=300, max-age=0, must-revalidate"`. The entire branching logic (lines 177–194) is dead complexity — both paths converge on the same outcome.

**Fix:** Track the replacement properly by comparing string lengths or checking for the S3 pattern's presence before the replace:

```js
var hasS3Url = html.indexOf('se-website-images.s3.nl-ams.scw.cloud') !== -1;
html = html.replace(/https:\/\/se-website-images\.s3\.nl-ams\.scw\.cloud/g, CDN_ROOT);

// Only one cache path needed — both cases produce the same headers
var responseHeaders = new Headers(response.headers);
responseHeaders.set("cache-control", "public, s-maxage=300, max-age=0, must-revalidate");
return new Response(html, { status: response.status, headers: responseHeaders });
```

---

## Issue #4 — MEDIUM: Query strings silently dropped on all redirects

**Lines:** 107, 113, 151, 158

All four `Response.redirect()` calls construct target URLs without preserving query parameters:

| Line | Redirect type | Construction |
|------|--------------|-------------|
| 107 | `.html` strip | `'https://simplyenak.com' + cleaned` |
| 113 | Static map | `'https://simplyenak.com' + redirectTarget` |
| 151 | Locale fallback | `'https://simplyenak.com' + englishPath` |
| 158 | `?lang=` cleanup | `'https://simplyenak.com' + url.pathname` |

If a user arrives at `/page.html?utm_source=google` or `/tours/old-name?ref=partner`, all tracking/analytics/partner parameters are silently stripped. This can break campaign attribution, affiliate links, and marketing analytics.

**Fix:** Append `url.search` to the redirect target on lines 107 and 113. For lines 151 and 158, the entire point is to drop the locale/lang parameter, so not preserving query strings there is arguably correct — but even then, other query params (non-locale) should be preserved:

```js
// Line 107 -> preserve query string
return Response.redirect('https://simplyenak.com' + cleaned + url.search, 301);

// Line 113 -> preserve query string
return Response.redirect("https://simplyenak.com" + redirectTarget + url.search, 301);

// Lines 151, 158 -> strip locale query but keep others
// For locale 404: drop lang-related query params, keep others
var langParamsRemoved = url.search.replace(/[?&]lang=[a-z]{2}/, '');
// Use langParamsRemoved on the redirect
```

---

## Issue #5 — MEDIUM: HTML rewriting is underspecified; caching has structural issues

### 5a: No `removeSection()` function exists (contrary to task description)

The file has no function named `removeSection` or anything like it. The only HTML transformation is the S3→CDN URL regex replacement on lines 173–175. If section-stripping (navigation, cookie banners, etc.) was intended, it was never implemented. This means the Worker's HTML rewriting capability is effectively **one regex replace**.

### 5b: Dead global variable (line 1)

```js
var CDN_ORIGIN = "https://cdn.simplyenak.com";
var CDN_ROOT = "https://cdn.simplyenak.com";   // line 3, identical value
```

`CDN_ORIGIN` (line 1) is never referenced after its declaration. `CDN_ROOT` (line 3) is used for the S3→CDN replacement. Remove line 1.

### 5c: `addCaching()` uses O(n) manual loop instead of `endsWith()` (lines 202–208)

```js
for (var i = 0; i < CACHED_EXTENSIONS.length; i++) {
    if (path.indexOf(CACHED_EXTENSIONS[i], path.length - CACHED_EXTENSIONS[i].length) !== -1) {
```

The intent is `path.endsWith(ext)`. Cloudflare Workers run on V8 and `String.prototype.endsWith()` is available. The manual implementation is less readable and marginally slower.

**Fix:**
```js
var shouldCache = CACHED_EXTENSIONS.some(function(ext) { return path.endsWith(ext); });
```

### 5d: Duplicated cache-control logic (lines 179–184 vs 188–194)

Both the "no changes needed" path (lines 179–184) and the "changes made" path (lines 188–194) set **identical** `Cache-Control` headers. The entire branching on lines 177–185 could be collapsed into a single path after the S3→CDN replacement (see Issue #3 fix).

### 5e: HTML responses get no browser cache (lines 180, 189)

```js
"public, s-maxage=300, max-age=0, must-revalidate"
```

`max-age=0, must-revalidate` means browsers always re-validate with the edge on repeat visits. For a content site with mostly stable pages, bumping this to `s-maxage=300, max-age=300` would reduce origin load without significantly staleness risk (content doesn't change faster than 5 minutes).

---

## Summary

| # | Severity | Issue | Lines |
|---|----------|-------|-------|
| 1 | **Critical** | Redirect map ~50% duplicated — missing trailing-slash normalization | 10–90 |
| 2 | **High** | Every static asset runs Worker redirect logic unnecessarily | 105–128 |
| 3 | **High** | S3→CDN replacement detection uses fragile heuristics (false positives) | 173–177 |
| 4 | **Medium** | All 4 redirect paths drop query strings | 107, 113, 151, 158 |
| 5 | **Medium** | No `removeSection()`, dead variable, duplicated cache paths, O(n) ext check | 1, 177–194, 202–208 |
