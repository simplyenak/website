# Astro Islands Optimization Guide
**Current Status**: Good use of islands, some optimization opportunities

---

## Current Islands Architecture

### ✅ Well Optimized

#### ContactForm (Vue)
```astro
<ContactForm client:only="vue" />
```
**Status**: ✅ Perfect
- Only loads Vue.js on pages with contact form
- Uses `client:only` (no SSR overhead)
- Minimal JS for non-contact pages

#### React Components (client:only)
```astro
<BlockRendererClient client:only="react" />
<FaqItem client:only="react" />
```
**Status**: ✅ Good
- No SSR overhead
- Hydrates on client only

---

## ⚠️ Optimization Opportunities

### 1. Change client:load → client:visible

**Current** (loads immediately on page load):
```astro
<!-- stories/index.astro -->
<StoriesCardsSection client:load />

<!-- stories/[...slug].astro -->
<YoutubeVideos client:load />

<!-- StoriesSidebar.astro -->
<StoriesCardsSection client:load />
```

**Optimized** (loads when scrolled into view):
```astro
<!-- Only load when user scrolls to it -->
<StoriesCardsSection client:visible />
<YoutubeVideos client:visible />
```

**Benefits**:
- Faster initial page load
- Lower TBT (Total Blocking Time)
- Better FCP (First Contentful Paint)
- JS only loads when user needs it

**Impact**: +5-10 PageSpeed points
**Risk**: Low (components still load, just deferred)

**Test**: Verify components still work when scrolling

---

### 2. Reduce Vue + React Dual Loading

**Problem**: Some pages load BOTH Vue and React
- Contact page: Vue (ContactForm) + React (BlockRendererClient)
- Tour pages: React components

**Current Bundle Impact**:
```
Vue vendor: ~40-50KB gzipped
React vendor: ~45-55KB gzipped
Total: ~90-105KB just for frameworks
```

**Options**:

#### Option A: Convert ContactForm to React (Recommended)
**Pros**: Single framework, smaller bundle
**Cons**: Requires rewriting ContactForm.vue

**Impact**: -40-50KB on contact page (-50% framework JS)

#### Option B: Keep As-Is
**Pros**: No code changes
**Cons**: Larger bundle on contact page

**Recommendation**: Keep as-is for now (not worth the rewrite effort)

---

### 3. Inline Scripts Using is:inline

**Current Non-Island Scripts**:

#### TicketingHub Widget
```astro
<!-- /tours/[slug].astro -->
<script
  is:inline
  src="https://assets.ticketinghub.com/checkout.js"
  data-widget={tour.TicketingHubID}
></script>
```
**Status**: ❌ Cannot be converted to island
**Reason**: Widget needs `data-widget` attribute on same element
**Optimization**: None needed

#### GA4 Tracking (TourDetailsHero)
```astro
<!-- TourDetailsHero.astro line 74-78 -->
<script is:inline>
  if (typeof window !== "undefined" && window.trackTourInterest) {
    window.trackTourInterest("{hero.title}");
  }
</script>
```
**Issue**: Runs on every page load (even if function not ready)
**Could optimize**: Convert to island pattern or event listener

**Improved Version**:
```astro
<script>
  // Astro auto-processes this (not is:inline)
  document.addEventListener('DOMContentLoaded', () => {
    if (window.trackTourInterest) {
      window.trackTourInterest('{hero.title}');
    }
  });
</script>
```

**Impact**: +1-2 PageSpeed points
**Risk**: Low (just wraps in DOMContentLoaded)

---

## Recommended Changes

### Phase 1: Low-Hanging Fruit (30 mins)

#### Change 1: client:load → client:visible
**Files to modify**:

1. **stories/index.astro** (line 28):
```astro
<!-- Before -->
<StoriesCardsSection client:load />

<!-- After -->
<StoriesCardsSection client:visible />
```

2. **stories/[...slug].astro** (line 69):
```astro
<!-- Before -->
<YoutubeVideos client:load />

<!-- After -->
<YoutubeVideos client:visible />
```

3. **StoriesSidebar.astro** (line 9):
```astro
<!-- Before -->
<StoriesCardsSection client:load />

<!-- After -->
<StoriesCardsSection client:visible />
```

**Expected Impact**: +5-8 PageSpeed points on stories pages
**Risk**: Very low

#### Change 2: Improve GA4 tracking script
**File**: `TourDetailsHero.astro` (line 74-78)

```astro
<!-- Before -->
<script is:inline>
  if (typeof window !== "undefined" && window.trackTourInterest) {
    window.trackTourInterest("{hero.title}");
  }
</script>

<!-- After -->
<script>
  // Runs after page interactive (better timing)
  if (window.trackTourInterest) {
    window.trackTourInterest("{hero.title}");
  }
</script>
```

**Expected Impact**: +1-2 PageSpeed points
**Risk**: Very low (Astro optimizes this automatically)

---

### Phase 2: Advanced (Optional)

#### Use client:media for mobile-specific components
If you have mobile-only components:
```astro
<MobileMenu client:media="(max-width: 768px)" />
```

**Benefit**: Desktop users don't load mobile JS

---

## Islands Best Practices Checklist

### ✅ Currently Following
- [x] Using `client:only` for single-page components
- [x] Separating Vue and React to specific pages
- [x] Using `is:inline` for critical third-party scripts

### ⚠️ Could Improve
- [ ] Convert `client:load` → `client:visible` for below-fold
- [ ] Remove `is:inline` from GA4 tracking (let Astro optimize)
- [ ] Consider `client:idle` for non-critical interactions

### ❌ Avoid
- Don't use `client:load` for below-fold components
- Don't mix Vue + React unless absolutely necessary
- Don't use `is:inline` unless required by external library

---

## Client Directive Reference

```
client:load       - Load JS immediately (use sparingly)
client:idle       - Load when browser is idle (good for widgets)
client:visible    - Load when scrolled into view (best for below-fold)
client:media      - Load on specific media query (mobile/desktop)
client:only       - Skip SSR, client-only (best for heavy components)
```

---

## Testing Plan

### After Changes
1. **Visual Test**:
   - Stories page loads correctly
   - Components appear when scrolling
   - No layout shift

2. **Performance Test**:
   ```bash
   npm run build
   npm run preview
   ```
   - Check Network tab (fewer JS loaded initially)
   - Verify IntersectionObserver firing for `client:visible`

3. **Functionality Test**:
   - All interactive components still work
   - GA4 tracking fires correctly
   - No console errors

---

## Expected Improvements

### With Phase 1 Changes Only

| Metric | Improvement |
|--------|-------------|
| Initial JS Bundle | -15-25% on stories pages |
| TBT | -10-15% |
| FCP | -5-10% |
| PageSpeed Score | +5-10 points |

### Combined with Other Optimizations

| Phase | PageSpeed Gain |
|-------|----------------|
| Resource Hints + fetchpriority | +3-5 |
| Astro Config | +5-10 |
| Islands Optimization | +5-10 |
| Cloudflare Settings | +10-15 |
| **TOTAL** | **+23-40 points** |

---

## Summary

**Current Islands Status**: ✅ Already pretty good!

**Quick Win**: Change 3 instances of `client:load` → `client:visible`

**Keep**: TicketingHub `is:inline` (required), ContactForm `client:only`

**Impact**: +5-10 points for ~30 minutes work

**Risk**: Very low (islands pattern is well-tested)
