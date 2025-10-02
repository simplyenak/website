# Cloudflare Optimization Checklist
**Goal: Improve Mobile Score from 52 → 75+**

## Before You Start
1. Log in to Cloudflare Dashboard: https://dash.cloudflare.com/
2. Select your domain: **simplyenak.com**
3. Keep this checklist open to track progress

---

## ✅ Step 1: Polish (Image Optimization) ⭐ HIGHEST IMPACT

**Expected gain: +15 points** (solves 5.72s of image issues)

1. Navigate to: **Speed** → **Optimization**
2. Scroll to **Polish** section
3. Select: **Lossy**
4. Click **Save**

**What this does:**
- Auto-converts images to WebP/AVIF
- Compresses images without visible quality loss
- Serves optimized versions from edge cache
- Works on your S3 images without touching Strapi!

**Fixes PageSpeed issues:**
- ✅ "Serve images in modern formats" (-2.89s)
- ✅ "Properly size images" (-2.83s)

---

## ✅ Step 2: Auto Minify (JS/CSS/HTML)

**Expected gain: +3 points** (reduces unused code)

1. Still in: **Speed** → **Optimization**
2. Scroll to **Auto Minify** section
3. Check all 3 boxes:
   - ☑️ JavaScript
   - ☑️ CSS
   - ☑️ HTML
4. Click **Save**

**What this does:**
- Removes whitespace, comments, unused code
- Reduces file sizes by 20-30%

**Fixes PageSpeed issues:**
- ✅ "Reduce unused CSS" (-0.89s)
- ✅ "Reduce unused JavaScript" (-0.77s)

---

## ✅ Step 3: Brotli Compression

**Expected gain: +2 points** (reduces network payload)

1. Still in: **Speed** → **Optimization**
2. Scroll to **Brotli** section
3. Toggle: **On**
4. Click **Save**

**What this does:**
- Better compression than gzip (15-20% smaller files)
- Reduces "enormous network payloads"

**Fixes PageSpeed issues:**
- ✅ "Avoid enormous network payloads" (partial)

---

## ✅ Step 4: Early Hints

**Expected gain: +2 points** (faster resource loading)

1. Still in: **Speed** → **Optimization**
2. Scroll to **Early Hints** section
3. Toggle: **On**
4. Click **Save**

**What this does:**
- Browser starts loading resources before HTML arrives
- Reduces FCP by 100-200ms

---

## ✅ Step 5: HTTP/3 (QUIC)

**Expected gain: +2 points** (faster connections)

1. Navigate to: **Network**
2. Find **HTTP/3 (with QUIC)** section
3. Toggle: **On**
4. Click **Save**

**What this does:**
- Faster connection establishment
- Better performance on mobile networks

---

## ✅ Step 6: 0-RTT Connection Resumption

**Expected gain: +1 point** (faster repeat visits)

1. Still in: **Network**
2. Find **0-RTT Connection Resumption** section
3. Toggle: **On**
4. Click **Save**

**What this does:**
- Eliminates round-trip for returning visitors
- Instant reconnection

---

## ✅ Step 7: Browser Cache TTL

**Expected gain: +2 points** (caching static assets)

1. Navigate to: **Caching** → **Configuration**
2. Find **Browser Cache TTL** section
3. Select: **4 hours** (or **1 month** for aggressive caching)
4. Click **Save**

**What this does:**
- Tells browsers how long to cache files
- Reduces repeat requests

**Fixes PageSpeed issues:**
- ✅ "Serve static assets with an efficient cache policy"

---

## ✅ Step 8: Purge Cache (IMPORTANT!)

**After completing all settings above:**

1. Navigate to: **Caching** → **Configuration**
2. Click **Purge Everything** button
3. Confirm the purge

**Why:** Forces Cloudflare to apply all new settings immediately.

---

## 🧪 Step 9: Test Results

**Wait 2-3 minutes after cache purge**, then:

1. Visit: https://pagespeed.web.dev/
2. Test: `https://perf-phase2-optimizations.staging-5zf.pages.dev/`
3. Compare new score

**Expected Results:**
- **Mobile: 70-75+** (up from 52) ✅
- **Desktop: 95+** (up from 82) ✅
- **LCP: <2.5s** (down from 3.2s) ✅
- **FCP: <1.8s** (down from 3.5s) ✅

---

## ✅ Optional: Page Rules (Advanced)

**Only if you want maximum performance:**

1. Navigate to: **Rules** → **Page Rules**
2. Click **Create Page Rule**
3. Enter pattern: `simplyenak.com/*.jpg`
4. Add Settings:
   - **Cache Level:** Cache Everything
   - **Edge Cache TTL:** 1 month
   - **Browser Cache TTL:** 1 month
5. Click **Save and Deploy**

**Repeat for:**
- `*.png`
- `*.webp`
- `*.css`
- `*.js`

**Expected gain: +1-2 points**

---

## 📊 Progress Tracker

Mark each step as you complete it:

- [ ] Step 1: Polish (Lossy)
- [ ] Step 2: Auto Minify (JS/CSS/HTML)
- [ ] Step 3: Brotli Compression
- [ ] Step 4: Early Hints
- [ ] Step 5: HTTP/3 (QUIC)
- [ ] Step 6: 0-RTT Connection Resumption
- [ ] Step 7: Browser Cache TTL (4 hours)
- [ ] Step 8: Purge Cache
- [ ] Step 9: Test PageSpeed

---

## 🚨 Troubleshooting

### If score doesn't improve:
1. **Clear Cloudflare cache again** (Caching → Purge Everything)
2. **Wait 5 minutes** for edge servers to update
3. **Test in incognito mode** to avoid browser cache
4. **Check settings are active** (green toggle = on)

### If site breaks:
1. **Disable Auto Minify first** (most likely culprit)
2. **Test site functionality**
3. **Re-enable one at a time** to find issue

### If images look bad:
1. Change Polish from **Lossy** to **Lossless**
2. Purge cache again
3. Test image quality

---

## 📈 Expected Timeline

- **Settings configuration:** 5-10 minutes
- **Cache purge + propagation:** 2-5 minutes
- **PageSpeed test:** 2 minutes
- **Total time:** 10-15 minutes

---

## 🎯 Success Criteria

✅ Mobile score: **70+**
✅ Desktop score: **95+**
✅ LCP: **<2.5s** (green)
✅ All Core Web Vitals: **Passed**
✅ TicketingHub booking widget: **Working**
✅ GA4 tracking: **Working**

---

## 📞 Need Help?

If you get stuck or see errors:
1. Take a screenshot of the Cloudflare setting
2. Share the error message
3. I'll help troubleshoot!

**Let's do this! 🚀**
