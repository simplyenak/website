# Safe Script Optimization Strategy
**Priority**: Keep ALL JavaScript working while improving performance

---

## Current JavaScript Dependencies

### GA4 Functions (MUST be available globally)
```javascript
window.trackTourBooking()     // Called from: TBD
window.trackTourInterest()    // Called from: ToursCard.astro line 52, 81
window.trackCalendarView()    // Called from: TBD
window.trackContactForm()     // Called from: ContactForm.vue line 263
```

### External Scripts
1. **Google Analytics** - `gtag()` and `window.dataLayer`
2. **Cloudflare Turnstile** - Bot protection on forms

---

## ✅ SAFE Optimization: Keep Critical JS in <head>

### Option 1: Minimal Head Script (RECOMMENDED)
**Keep ONLY the critical setup in `<head>`, defer the rest**

**In Layout.astro `<head>`**:
```html
<!-- Resource Hints (NEW - safe to add) -->
<link rel="preconnect" href="https://api.system.simplyenak.com" crossorigin>
<link rel="preconnect" href="https://www.googletagmanager.com">
<link rel="dns-prefetch" href="https://www.google-analytics.com">

<!-- GA4 Core Setup (KEEP IN HEAD - needed immediately) -->
<script>
  // Initialize dataLayer FIRST (must be synchronous)
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

  // Define placeholder functions immediately (prevents errors)
  window.trackTourBooking = function(){};
  window.trackTourInterest = function(){};
  window.trackCalendarView = function(){};
  window.trackContactForm = function(){};
</script>

<!-- Load GA4 script async (NEW - performance win) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-262711985"></script>

<!-- Load tracking functions when DOM ready (NEW) -->
<script defer src="/scripts/tracking.js"></script>

<!-- Turnstile - KEEP AS IS (already async + defer) -->
<script>
  (function () {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.defer = true;
    s.crossOrigin = "anonymous";
    s.onerror = () => setTimeout(() => document.head.appendChild(s), 2000);
    document.head.appendChild(s);
  })();
</script>
```

**Create `/frontend/public/scripts/tracking.js`**:
```javascript
// GA4 Tracking Helper Functions
// Loaded with defer - runs after DOM ready

function trackTourBooking(tourName, tourPrice, bookingId) {
  if (typeof gtag === 'undefined') {
    console.warn('GA4 not loaded yet');
    return;
  }

  gtag("event", "purchase", {
    transaction_id: bookingId,
    value: tourPrice,
    currency: "USD",
    items: [{
      item_id: tourName.toLowerCase().replace(/\s+/g, "_"),
      item_name: tourName,
      category: "Food Tours",
      quantity: 1,
      price: tourPrice,
    }],
  });
}

function trackTourInterest(tourName) {
  if (typeof gtag === 'undefined') {
    console.warn('GA4 not loaded yet');
    return;
  }

  gtag("event", "view_item", {
    currency: "USD",
    value: 0,
    items: [{
      item_id: tourName.toLowerCase().replace(/\s+/g, "_"),
      item_name: tourName,
      category: "Food Tours",
    }],
  });
}

function trackCalendarView() {
  if (typeof gtag === 'undefined') {
    console.warn('GA4 not loaded yet');
    return;
  }

  gtag("event", "view_item_list", {
    item_list_name: "Tour Calendar",
    currency: "USD",
  });
}

function trackContactForm() {
  if (typeof gtag === 'undefined') {
    console.warn('GA4 not loaded yet');
    return;
  }

  gtag("event", "generate_lead", {
    currency: "USD",
    value: 0,
    method: "contact_form",
  });
}

// Override window functions with real implementations
window.trackTourBooking = trackTourBooking;
window.trackTourInterest = trackTourInterest;
window.trackCalendarView = trackCalendarView;
window.trackContactForm = trackContactForm;

console.log('Simply Enak tracking initialized');
```

**Benefits**:
- ✅ GA4 `gtag()` available immediately (no errors)
- ✅ Tracking functions have placeholders (onclick won't break)
- ✅ Real tracking loads deferred (better FCP)
- ✅ GA4 script loads async (non-blocking)
- ✅ All functionality preserved

**Performance Impact**: +10-15 PageSpeed points (massive FCP improvement)

---

## ⚠️ Alternative: Keep Everything As-Is

If you want ZERO risk, keep Layout.astro exactly as it is and ONLY add:

```html
<head>
  <!-- ADD THESE - zero risk, good performance boost -->
  <link rel="preconnect" href="https://api.system.simplyenak.com" crossorigin>
  <link rel="preconnect" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://www.google-analytics.com">

  <!-- Everything else stays the same -->
</head>
```

**Performance Impact**: +2-5 PageSpeed points (small win, zero risk)

---

## Testing Plan

### 1. Test in Development
```bash
cd frontend
npm run dev
```

**Check**:
- Open browser console
- Click "Book Now" on any tour
- Verify: "Simply Enak tracking initialized" appears
- Verify: No JS errors

### 2. Test Tracking Functions
**In browser console**:
```javascript
// Should work immediately
window.trackTourInterest('Test Tour');

// Check dataLayer
console.log(window.dataLayer);
```

### 3. Test Form Submission
- Go to contact page
- Submit form
- Check console for `trackContactForm()` call
- Verify in GA4 real-time (google analytics dashboard)

### 4. Test Build
```bash
npm run build
npm run preview
```

Repeat all tests on production build.

---

## Rollback Plan

If anything breaks:

**Git revert**:
```bash
git checkout HEAD -- frontend/src/layouts/Layout.astro
rm frontend/public/scripts/tracking.js
```

**Cloudflare**: No changes yet, nothing to rollback

---

## Recommendation

**Phase A** (ZERO RISK - 15 mins):
1. Add resource hints only
2. Test and deploy
3. Monitor for 24 hours

**Phase B** (LOW RISK - 30 mins):
1. If Phase A successful, implement Option 1
2. Test thoroughly in staging
3. Deploy to production
4. Monitor GA4 real-time reports

**Don't touch Turnstile** - it's already optimized with async+defer

---

## What NOT to do

❌ Move GA4 to end of `<body>` without placeholders
❌ Remove inline scripts completely
❌ Change Turnstile loading (already optimal)
❌ Modify tracking function signatures
❌ Add new dependencies before testing

---

## Summary

**Safest approach**: Add resource hints only (+2-5 points)
**Best approach**: Option 1 with tracking.js (+10-15 points, minimal risk)
**Current code**: Already pretty good! Turnstile is optimized.

Choose based on your risk tolerance. I recommend Option 1 with thorough testing.
