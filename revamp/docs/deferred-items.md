# Deferred Items — Register for Later

These items were identified in the audit but deferred because they are either:
- Already resolved (false positives from the audit)
- Large refactors not worth doing mid-launch
- Cosmetic items with zero user impact

---

## M4. Tour index pages are 1000+ lines
**Files:** `src/pages/tours/index.astro` (1155 lines), `src/pages/[lang]/tours/index.astro` (1089 lines)
**Issue:** Monolithic files mixing data fetching, SEO, HTML, inline scripts, and styles. High duplication between English and localized versions.
**Impact:** Maintainability only — no runtime or SEO impact.
**Effort:** Medium — split into components, extract shared layout.
**Priority:** Low — do when redesigning the tours index layout.

---

## L5. og:image dimensions hardcoded to 1200×630
**File:** `src/components/SEO.astro`, lines 264-266
**Issue:** `og:image:width="1200"` and `og:image:height="630"` and `og:image:type="image/jpeg"` are hardcoded, but the actual image may be WebP or have different dimensions.
**Impact:** Minor — social platforms handle mismatched dimensions gracefully.
**Effort:** Low — make dimensions dynamic based on image metadata.
**Priority:** Low — only matters for perfect Open Graph compliance.

---

## L7. Both Vue and React ship as dependencies
**Files:** `@astrojs/react` and `@astrojs/vue` in astro.config.mjs
**Issue:** Both runtime libraries are integrated. Vue is used by `ContactForm.vue`. React is used by 5 `.tsx` components (FaqItem, TourQuiz, etc.).
**Impact:** ~30KB extra JS if a visitor loads a page with both Vue and React components (rare — they're on different pages).
**Effort:** Medium — rewrite ContactForm.vue to React or rewrite .tsx components to Vue.
**Priority:** Low — both are needed. Refactor only when touching those components.

---

## Already Resolved (False Positives)

| Item | Status |
|---|---|
| **M2. No hreflang on translated tour pages** | Already works — all `[lang]/tours/[slug].astro` pass `hreflangPath` to Layout |
| **L1. No `<html lang>` on localized pages** | Already works — `<html lang={lang}>` uses `getLangFromUrl` |
| **M8. Verify if swiper is still needed** | Confirmed active — `TestimonialsSection.astro` uses Swiper for carousel |
| **L2. @tailwindcss/typography unused** | Confirmed active — `prose` classes used in 5+ components |
| **L6. web-haptics unused** | Confirmed active — `Layout.astro` uses WebHaptics for mobile CTA vibration feedback |
