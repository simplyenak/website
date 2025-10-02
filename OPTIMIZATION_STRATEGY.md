# simplyenak.com - Complete Optimization Strategy
**Date**: 2025-10-02
**Site**: https://simplyenak.com
**API**: https://api.system.simplyenak.com

---

## Executive Summary

**Current Status**: Site is already well-optimized with Astro.js
- ✅ Images: Auto-optimized with Astro `<Image>` component
- ✅ SEO: Sitemap, robots.txt, structured data
- ✅ Hosting: Cloudflare Pages with CDN
- ⚠️ Scripts: Performance bottleneck in Layout.astro
- ⚠️ Astro config: Missing optimization flags
- ⚠️ Cloudflare: Default settings, not optimized

**Optimization Potential**: 30-50 point PageSpeed improvement

---

## Phase 1: Astro Configuration (30 mins)

### 1.1 Add Prefetch Integration
**File**: `frontend/astro.config.mjs`
**Impact**: Faster page transitions (MPA feel)

```javascript
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vue from "@astrojs/vue";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://simplyenak.com",

  adapter: cloudflare(),
  output: "server",

  // ✨ NEW: Enable HTML compression (already default but explicit)
  compressHTML: true,

  // ✨ NEW: Optimize CSS delivery
  build: {
    inlineStylesheets: 'auto', // Inline small CSS (<4kb)
  },

  // ✨ NEW: Enable prefetch for faster navigation
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        ...(import.meta.env.PROD
          ? { "react-dom/server": "react-dom/server.edge" }
          : {}),
      },
    },
    // ✨ NEW: Optimize build output
    build: {
      cssCodeSplit: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue'],
            'react-vendor': ['react', 'react-dom'],
          }
        }
      }
    },
  },

  integrations: [vue(), react(), sitemap()],
});
```

**Expected Impact**: +5-10 PageSpeed points

---

## Phase 2: Script Optimization (1 hour)

### 2.1 Move Analytics to Footer
**File**: `frontend/src/layouts/Layout.astro`
**Issue**: 104 lines of GA4 script in `<head>` blocks rendering
**Impact**: Faster FCP, reduced TBT

**Current** (lines 66-158): In `<head>`
**New**: Move to bottom of `<body>` or separate file

```astro
<!-- In <head>, add preconnect only -->
<link rel="preconnect" href="https://www.googletagmanager.com">
<link rel="dns-prefetch" href="https://www.google-analytics.com">
<link rel="preconnect" href="https://api.system.simplyenak.com">

<!-- Move GA4 to end of </body> -->
<script is:inline defer src="/scripts/analytics.js"></script>
```

**Create**: `frontend/public/scripts/analytics.js`
```javascript
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-262711985', {
  send_page_view: true,
  custom_map: {
    tour_type: 'custom_parameter_1',
    booking_source: 'custom_parameter_2',
  },
});

// ... rest of GA4 functions
```

**Expected Impact**: +10-15 PageSpeed points (huge FCP improvement)

### 2.2 Defer Turnstile Loading
**File**: `frontend/src/layouts/Layout.astro` (lines 54-64)
**Current**: Loads on all pages
**New**: Load only on contact/booking pages

**Option A**: Keep script, already has `async` and `defer`
**Option B**: Move to ContactForm.vue component

```vue
<!-- In ContactForm.vue -->
<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  if (!document.querySelector('[src*="turnstile"]')) {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
});
</script>
```

**Expected Impact**: +3-5 PageSpeed points

---

## Phase 3: Resource Hints (15 mins)

### 3.1 Add Preconnect/DNS-Prefetch
**File**: `frontend/src/layouts/Layout.astro`
**Add to `<head>`**:

```html
<!-- Critical resources -->
<link rel="preconnect" href="https://api.system.simplyenak.com" crossorigin>
<link rel="preconnect" href="https://www.googletagmanager.com">
<link rel="dns-prefetch" href="https://www.google-analytics.com">
<link rel="dns-prefetch" href="https://challenges.cloudflare.com">

<!-- If using fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**Expected Impact**: +2-5 PageSpeed points

---

## Phase 4: Image Optimization Tweaks (30 mins)

### 4.1 Add fetchpriority to Hero Images
**Files to update**:
- `frontend/src/components/Home/HeroSection.astro`
- `frontend/src/components/GlobalHero.astro`
- `frontend/src/components/TourDetails/TourDetailsHero.astro`
- `frontend/src/components/StoriesDetails/StoriesDetailsHero.astro`

**Current** (HeroSection.astro:43):
```astro
<Image
  src={getFullMediaUrl(heroSection.bgImage)}
  alt="Hero Image"
  class="absolute inset-0 object-cover size-full"
  width={1920}
  height={1080}
/>
```

**Optimized**:
```astro
<Image
  src={getFullMediaUrl(heroSection.bgImage)}
  alt="Hero Image"
  class="absolute inset-0 object-cover size-full"
  width={1920}
  height={1080}
  loading="eager"
  fetchpriority="high"
/>
```

**Expected Impact**: +3-5 PageSpeed points (better LCP)

---

## Phase 5: Cloudflare Optimization (1 hour)

### 5.1 Enable Performance Features
**Via Cloudflare Dashboard** (simplyenak.com zone):

#### Speed → Optimization
```
Auto Minify:
  ✅ JavaScript
  ✅ CSS
  ✅ HTML

Brotli: ✅ Enabled (default, verify)
Early Hints: ✅ Enable
HTTP/3 (with QUIC): ✅ Enable
```

#### Caching → Configuration
```
Browser Cache TTL: 1 year (for static assets)
Cache Level: Standard (or Aggressive for testing)
Always Online: ✅ Enable
```

#### Speed → Optimization → Image Optimization
```
Polish: Lossless
Mirage: ✅ Enable (mobile optimization)
```

**Expected Impact**: +10-15 PageSpeed points

### 5.2 Create Page Rules
**Speed → Rules → Page Rules** (3 available on free plan)

**Rule 1**: Static Assets Caching
```
URL Pattern: *simplyenak.com/_astro/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 year
```

**Rule 2**: Image Caching
```
URL Pattern: *simplyenak.com/*.{jpg,jpeg,png,webp,gif,svg}
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Polish: Lossless
```

**Rule 3**: API Bypass (for Strapi)
```
URL Pattern: api.system.simplyenak.com/*
Settings:
  - Cache Level: Bypass
```

**Expected Impact**: +5-10 PageSpeed points

---

## Phase 6: Advanced Optimizations (Optional, 2-4 hours)

### 6.1 Install astro-compress
```bash
npm install astro-compress
```

**Update astro.config.mjs**:
```javascript
import compress from "astro-compress";

export default defineConfig({
  // ... existing config
  integrations: [
    vue(),
    react(),
    sitemap(),
    compress({
      CSS: true,
      HTML: true,
      JavaScript: true,
      Image: false, // Astro already optimizes images
      SVG: true,
    })
  ],
});
```

### 6.2 Implement View Transitions
**For instant page navigation**:

```astro
---
// In Layout.astro
import { ViewTransitions } from 'astro:transitions';
---

<head>
  <!-- ... existing head content -->
  <ViewTransitions />
</head>
```

### 6.3 Critical CSS Extraction
Use Astro's `inlineStylesheets: 'always'` for critical pages

**Expected Impact**: +5-10 PageSpeed points

---

## Testing & Validation

### Before Each Change
```bash
# Run PageSpeed test
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://simplyenak.com&strategy=mobile"
```

### After All Changes
1. **PageSpeed Insights**: https://pagespeed.web.dev/
2. **WebPageTest**: https://www.webpagetest.org/
3. **Chrome DevTools Lighthouse**
4. **Cloudflare Web Analytics**: Monitor real-world metrics

---

## Summary: Expected Improvements

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| PageSpeed (Mobile) | TBD | 85+ | +30-50 |
| FCP | TBD | <1.8s | -40% |
| LCP | TBD | <2.5s | -30% |
| TBT | TBD | <200ms | -50% |
| CLS | TBD | <0.1 | Maintain |

---

## Implementation Order (Recommended)

1. ✅ **Phase 1**: Astro config (30min) - Safe, immediate benefit
2. ✅ **Phase 3**: Resource hints (15min) - No risk, easy win
3. ✅ **Phase 4**: fetchpriority (30min) - Simple addition
4. ✅ **Phase 5**: Cloudflare settings (1hr) - Biggest impact
5. ⚠️ **Phase 2**: Script optimization (1hr) - Test thoroughly
6. 🔄 **Phase 6**: Advanced (optional) - If needed for 90+ score

**Total Estimated Time**: 3-4 hours for Phases 1-5
**Total Expected Impact**: +30-50 PageSpeed points

---

## Rollback Plan

All changes are reversible:
- Astro config: Git revert
- Cloudflare: UI toggle switches
- Scripts: Keep old code commented

**Deployment Strategy**:
1. Test on staging first
2. Monitor analytics for errors
3. A/B test if possible
4. Full rollout after 24h monitoring
