# simplyenak.com - FINAL SAFE Optimization Plan
**Date**: 2025-10-02
**⚠️ Priority**: Preserve ALL functionality - GA4, TicketingHub, Turnstile

---

## Critical Scripts Inventory (DO NOT BREAK)

### 1. **TicketingHub Booking Engine** ⚠️ CRITICAL
**Location**: `/tours/[slug].astro` line 81-84
**Purpose**: Payment and booking widget
**Must**: Load synchronously, render immediately in sidebar
**Code**:
```html
<script
  is:inline
  src="https://assets.ticketinghub.com/checkout.js"
  data-widget={tour.TicketingHubID}
></script>
```
**Optimization**: ❌ **DO NOT MODIFY** - Revenue critical

### 2. **Google Analytics GA4** ⚠️ CRITICAL
**Location**: `Layout.astro` lines 66-158
**Functions used**:
- `window.trackTourInterest()` - ToursCard.astro, TourDetailsHero.astro
- `window.trackContactForm()` - ContactForm.vue
- `window.trackTourBooking()` - Future use
- `window.trackCalendarView()` - Future use

**Optimization**: ✅ Can optimize (see below)

### 3. **Cloudflare Turnstile** ✅ ALREADY OPTIMIZED
**Location**: `Layout.astro` lines 54-64
**Status**: Already has `async` and `defer`
**Optimization**: ❌ Leave as-is (already optimal)

---

## SAFE Optimization Strategy (Zero Revenue Risk)

### Phase 1: Zero-Risk Improvements (15 mins)

#### 1.1 Add Resource Hints ONLY
**File**: `frontend/src/layouts/Layout.astro`
**Add to `<head>` after line 38**:

```html
<!-- Performance: Preconnect to critical origins -->
<link rel="preconnect" href="https://api.system.simplyenak.com" crossorigin>
<link rel="preconnect" href="https://www.googletagmanager.com">
<link rel="preconnect" href="https://assets.ticketinghub.com">
<link rel="dns-prefetch" href="https://www.google-analytics.com">
<link rel="dns-prefetch" href="https://challenges.cloudflare.com">
```

**Impact**: +2-5 PageSpeed points
**Risk**: Zero (only adds hints, doesn't modify scripts)

#### 1.2 Add fetchpriority to Hero Images
**Files to modify**:
- `Home/HeroSection.astro` line 43
- `GlobalHero.astro`
- `TourDetailsHero.astro` line 64

**Change**:
```astro
<!-- Before -->
<Image
  src={getFullMediaUrl(heroSection.bgImage)}
  alt="Hero Image"
  width={1920}
  height={1080}
/>

<!-- After -->
<Image
  src={getFullMediaUrl(heroSection.bgImage)}
  alt="Hero Image"
  width={1920}
  height={1080}
  loading="eager"
  fetchpriority="high"
/>
```

**Impact**: +3-5 PageSpeed points (better LCP)
**Risk**: Zero (Astro handles this natively)

---

### Phase 2: Astro Config Optimization (30 mins)

#### 2.1 Update astro.config.mjs
**File**: `frontend/astro.config.mjs`

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

  // ✨ NEW: Ensure HTML compression (explicit)
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
    // ✨ NEW: Optimize build  output
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

**Impact**: +5-10 PageSpeed points
**Risk**: Low (Astro built-in features, well-tested)

**Test**: Run `npm run build && npm run preview` and verify booking widget still works

---

### Phase 3: Cloudflare Settings (1 hour)

#### 3.1 Speed → Optimization
Log into Cloudflare Dashboard for `simplyenak.com`:

```
Auto Minify:
  ✅ JavaScript
  ✅ CSS
  ✅ HTML

Brotli: ✅ (verify enabled)
Early Hints: ✅ Enable
HTTP/3 (QUIC): ✅ Enable
```

#### 3.2 Speed → Optimization → Image Optimization
```
Polish: Lossless
Mirage: ✅ Enable
```

#### 3.3 Caching → Configuration
```
Browser Cache TTL: 1 year
```

#### 3.4 Create Page Rules
**Rule 1**: Astro Assets (Static)
```
Pattern: *simplyenak.com/_astro/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 year
```

**Rule 2**: Images
```
Pattern: *simplyenak.com/*.{jpg,jpeg,png,webp,gif,svg,ico}
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Polish: Lossless
```

**Rule 3**: API Bypass (Strapi)
```
Pattern: api.system.simplyenak.com/*
Settings:
  - Cache Level: Bypass
  - Security Level: Medium
```

**Impact**: +10-15 PageSpeed points
**Risk**: Low (can toggle off in UI instantly)

---

## Phase 4: Advanced (OPTIONAL - Only if needed)

### 4.1 GA4 Script Optimization (Requires Testing)

⚠️ **Only do this if you need 90+ PageSpeed score**

**Current**: 104 lines of GA4 in `<head>` (blocks rendering)
**New**: Split into core + deferred functions

**See**: `SAFE_SCRIPT_OPTIMIZATION.md` for detailed implementation

**Impact**: +10-15 PageSpeed points
**Risk**: Medium (requires thorough testing of tracking)

**Prerequisites**:
1. Staging environment for testing
2. Access to GA4 real-time reports
3. QA test plan for all tracking events

---

## What NOT to Touch

### ❌ Never Modify
1. **TicketingHub script** - Revenue critical, must be synchronous
2. **TicketingHub widget attribute** - `data-widget={tour.TicketingHubID}`
3. **Turnstile error handler** - Already optimized with retry logic
4. **GA4 tracking function signatures** - Used across components

### ⚠️ Handle with Care
1. **GA4 inline scripts** - Components depend on `window.trackX()` functions
2. **Tracking onclick handlers** - Must fire before navigation
3. **`is:inline` directives** - Astro won't process these, intentional

---

## Testing Checklist

### Before Deployment
- [ ] Build succeeds: `npm run build`
- [ ] Preview works: `npm run preview`
- [ ] Home page loads correctly
- [ ] Tour detail page loads
- [ ] **TicketingHub widget renders** ⚠️ CRITICAL
- [ ] Contact form submits
- [ ] No console errors

### After Deployment
- [ ] Check Google Analytics real-time
- [ ] Test booking flow end-to-end
- [ ] Monitor for JavaScript errors (Sentry/console)
- [ ] Check PageSpeed score improvement
- [ ] Verify Cloudflare cache headers

---

## Expected Results

### Phase 1 + 2 + 3 (Recommended - Low Risk)
**Time**: 2 hours
**Impact**: +15-25 PageSpeed points
**Risk**: Low
**Revenue Impact**: Zero

| Metric | Improvement |
|--------|-------------|
| FCP | -20-30% |
| LCP | -15-25% |
| TBT | -10-20% |
| Overall Score | +15-25 points |

### Phase 1 + 2 + 3 + 4 (Advanced - Medium Risk)
**Time**: 4 hours (including testing)
**Impact**: +25-35 PageSpeed points
**Risk**: Medium (GA4 tracking changes)
**Revenue Impact**: Possible if GA4 breaks

---

## Rollback Plan

### If TicketingHub Breaks
```bash
git revert HEAD
npm run build
# Deploy immediately
```

### If GA4 Tracking Breaks
```bash
git checkout HEAD -- frontend/src/layouts/Layout.astro
npm run build
# Verify in GA4 real-time
```

### If Cloudflare Issues
- Toggle settings off in UI (instant)
- Delete page rules if caching issues
- No code deployment needed

---

## Deployment Strategy

### Option A: Cautious (Recommended)
1. **Week 1**: Phase 1 only (resource hints + fetchpriority)
2. **Week 2**: Phase 2 (Astro config) - monitor GA4 + bookings
3. **Week 3**: Phase 3 (Cloudflare) - monitor carefully
4. **Week 4+**: Phase 4 only if needed for 90+ score

### Option B: Aggressive (If you have staging)
1. Deploy all Phases 1-3 to staging
2. Test thoroughly (booking flow, GA4, forms)
3. Monitor for 48 hours
4. Deploy to production
5. Skip Phase 4 unless critical

---

## Key Success Metrics

### Must Maintain
- ✅ TicketingHub bookings process successfully
- ✅ GA4 events fire correctly
- ✅ Contact form submissions tracked
- ✅ No increase in bounce rate

### Should Improve
- 📈 PageSpeed score +15-25 points minimum
- 📈 Core Web Vitals (LCP, FCP, TBT)
- 📈 Cloudflare cache hit ratio
- 📈 Lower bandwidth usage

---

## Summary Recommendation

**START HERE**: Phase 1 + Phase 2 + Phase 3
- **Total time**: 2-3 hours
- **Expected gain**: +15-25 PageSpeed points
- **Risk level**: Low
- **Revenue risk**: Zero

**DO NOT** touch TicketingHub scripts under any circumstances.
**DO NOT** proceed to Phase 4 without staging environment and QA approval.

**Focus on**: Cloudflare settings (biggest bang for buck, zero code changes)
