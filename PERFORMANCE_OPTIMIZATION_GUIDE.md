# Performance Optimization Guide - Simply Enak
**Target: Improve Mobile from 35 → 75+ | Desktop from 82 → 95+**

## 📊 Current Performance (Production)
- **Mobile Score: 35** 🔴
- **Desktop Score: 82** 🟡
- **LCP: 5.325s** (Target: <2.5s)
- **FCP: 3.93s** (Target: <1.8s)
- **TBT: 1,030ms** (Target: <200ms)
- **CLS: 0** ✅

## 🎯 Expected Improvements

### Phase 2 (Code Optimizations) - Already on Staging
**Expected Mobile Gain: +10-15 points**
- ✅ Resource hints (preconnect/dns-prefetch)
- ✅ fetchpriority="high" on hero images
- ✅ Islands optimization (client:visible)
- ✅ HTML/CSS compression
- ✅ Prefetch on hover

### Phase 3 (Cloudflare Optimizations) - To Implement
**Expected Mobile Gain: +15-25 points**
- Image optimization (Polish + Mirage)
- Auto Minify (JS/CSS/HTML)
- Brotli compression
- Early Hints
- HTTP/3 + 0-RTT

### Phase 4 (Image CDN Strategy) - Long-term
**Expected Mobile Gain: +5-10 points**
- Cloudflare Image Resizing (Pro plan)
- Or migrate S3 images to Cloudflare R2 with Image Transform

---

## 🚀 Implementation Steps

### Step 1: Merge Phase 2 to Production
```bash
cd /home/maarten/website-optimization
git checkout main
git merge perf/phase2-optimizations
git push origin main
```

**Result:** Mobile 35 → ~48, Desktop 82 → ~90

---

### Step 2: Cloudflare Speed Optimizations (Dashboard)

#### A. Auto Minify
**Dashboard:** Speed → Optimization → Auto Minify
- ✅ Enable **JavaScript**
- ✅ Enable **CSS**
- ✅ Enable **HTML**

**Impact:** -0.89s unused CSS, -0.77s unused JS = **~5 points**

---

#### B. Brotli Compression
**Dashboard:** Speed → Optimization → Brotli
- ✅ Enable **Brotli**

**Impact:** Reduces 5,793 KiB payload by ~20-30% = **~3 points**

---

#### C. Early Hints
**Dashboard:** Speed → Optimization → Early Hints
- ✅ Enable **Early Hints**

**Impact:** Faster resource discovery = **~3 points**

---

#### D. HTTP/3 (QUIC)
**Dashboard:** Network → HTTP/3
- ✅ Enable **HTTP/3 (with QUIC)**

**Impact:** Faster connection establishment = **~2 points**

---

#### E. 0-RTT Connection Resumption
**Dashboard:** Network → 0-RTT Connection Resumption
- ✅ Enable **0-RTT**

**Impact:** Eliminates round-trip for repeat visitors = **~2 points**

---

#### F. Polish (Image Optimization) ⭐ CRITICAL
**Dashboard:** Speed → Optimization → Polish
- ✅ Enable **Lossy** (recommended)
  - Converts images to WebP/AVIF automatically
  - Compresses without quality loss
  - **Solves: "Serve images in modern formats" (-2.6s)**
  - **Solves: "Properly size images" (-3.86s)**

**Impact:** **~15 points** (biggest win!)

---

#### G. Mirage (Smart Image Loading)
**Dashboard:** Speed → Optimization → Mirage
- ✅ Enable **Mirage**
  - Lazy loads images on slow connections
  - Progressive JPEG loading

**Impact:** **~5 points** for slow 3G/4G users

---

#### H. Browser Cache TTL
**Dashboard:** Caching → Configuration → Browser Cache TTL
- Set to **4 hours** (or 1 month for static assets)

**Impact:** ~2 points for repeat visitors

---

#### I. Page Rules for Static Assets (Optional)
**Dashboard:** Rules → Page Rules → Create Page Rule

**Pattern:** `simplyenak.com/*.jpg` or `simplyenak.com/*.png`
**Settings:**
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
- Browser Cache TTL: 1 month

**Repeat for:**
- `*.webp`
- `*.svg`
- `*.css`
- `*.js`

**Impact:** ~3 points

---

### Step 3: S3 Image Optimization Strategy

**Problem:** Images served from S3 are slow (no CDN, no compression)

**Solutions (Pick One):**

#### Option A: Cloudflare Polish Only (Easiest - Already covered above)
- No code changes needed
- Cloudflare auto-optimizes S3 images on-the-fly
- **Limitation:** Can't resize, only compress

#### Option B: Cloudflare Image Resizing (Requires Pro Plan - $20/mo)
**Dashboard:** Speed → Optimization → Image Resizing
- ✅ Enable Image Resizing

**Update Astro config:**
```javascript
// astro.config.mjs
export default defineConfig({
  image: {
    domains: ['se-website-images.s3.nl-ams.scw.cloud'],
    service: {
      entrypoint: 'astro/assets/services/cloudflare',
      config: {
        // Cloudflare will resize and optimize
      }
    }
  },
  // ... rest of config
});
```

**Impact:** Full control over sizes, formats = **+10 points**

#### Option C: Migrate to Cloudflare R2 (Long-term, Best Performance)
1. Copy S3 images to Cloudflare R2
2. Update Strapi to use R2 (change upload provider)
3. Use R2 with Image Transform

**Impact:** Fastest option, edge-optimized storage = **+15 points**

**Recommended for now:** **Option A (Polish)** - no code changes, solves 80% of issues

---

### Step 4: Advanced - Render-Blocking Resources

**Current Issue:** 4.81s savings available by eliminating render-blocking

**Solutions in astro.config.mjs:**

```javascript
export default defineConfig({
  // ... existing config

  vite: {
    build: {
      cssCodeSplit: true, // ✅ Already added

      // Add critical CSS inlining
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name.endsWith('.css')) {
              return 'assets/styles/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
          manualChunks: {
            'vue-vendor': ['vue'],
            'react-vendor': ['react', 'react-dom'],
            // Add critical scripts
            'critical': [
              // List critical components here
            ]
          }
        }
      }
    }
  }
});
```

**Impact:** ~5 points by splitting CSS/JS better

---

## 📈 Expected Final Results

| Metric | Before | After Phase 2 | After Cloudflare | Target |
|--------|--------|---------------|------------------|--------|
| **Mobile Score** | 35 | ~48 | **70-75+** | 75+ |
| **Desktop Score** | 82 | ~90 | **95+** | 95+ |
| **LCP** | 5.3s | ~3.5s | **<2.5s** | <2.5s |
| **FCP** | 3.9s | ~2.5s | **<1.8s** | <1.8s |
| **TBT** | 1030ms | ~600ms | **<300ms** | <200ms |
| **CLS** | 0 | 0 | **0** | <0.1 |

---

## ✅ Action Checklist

### Immediate (Today)
- [ ] Merge Phase 2 branch to production
- [ ] Enable Cloudflare Auto Minify (JS, CSS, HTML)
- [ ] Enable Cloudflare Brotli
- [ ] Enable Cloudflare Polish (Lossy)
- [ ] Enable Cloudflare Mirage
- [ ] Enable Early Hints
- [ ] Enable HTTP/3
- [ ] Enable 0-RTT
- [ ] Set Browser Cache TTL to 4 hours

### This Week
- [ ] Test PageSpeed after Cloudflare changes
- [ ] Create Page Rules for static assets
- [ ] Monitor Core Web Vitals in Search Console

### Long-term (Optional)
- [ ] Upgrade to Cloudflare Pro for Image Resizing
- [ ] Or migrate S3 to Cloudflare R2
- [ ] Implement critical CSS extraction
- [ ] Consider service worker for offline support

---

## 🔍 Testing & Verification

### After Each Change:
1. Clear Cloudflare cache: **Caching → Configuration → Purge Everything**
2. Test on PageSpeed: https://pagespeed.web.dev/
3. Test on GTmetrix: https://gtmetrix.com/
4. Check Network tab: Verify Brotli (content-encoding: br)
5. Check Images: Verify WebP format in DevTools

### Monitor:
- Google Search Console → Core Web Vitals
- Cloudflare Analytics → Web Analytics
- PageSpeed Insights (weekly)

---

## 🚨 Important Notes

### DO NOT:
- ❌ Don't manually replace S3 images (breaks Strapi references)
- ❌ Don't merge Week 1 image optimization branch (outdated approach)
- ❌ Don't disable GA4, TicketingHub, or Turnstile scripts

### DO:
- ✅ Let Cloudflare Polish handle image optimization automatically
- ✅ Monitor performance weekly
- ✅ Test on real devices (not just PageSpeed)
- ✅ Check revenue impact (TicketingHub conversions)

---

## 📞 Support

If issues occur:
1. Rollback: Disable Cloudflare setting causing issue
2. Check Cloudflare Logs: Security → Overview → Activity Log
3. Test staging first: `perf-phase2-optimizations.staging-5zf.pages.dev`

**Estimated Time to Complete:** 30-45 minutes
**Estimated Performance Gain:** Mobile +35-40 points, Desktop +13-15 points
