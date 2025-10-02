# Cloudflare Optimization Guide - simplyenak.com
**Date**: 2025-10-02
**Domain**: simplyenak.com
**Expected Impact**: +10-15 PageSpeed points

---

## Overview

Cloudflare optimization offers the biggest performance gains with ZERO code changes and instant rollback capability. All settings are toggleable in the UI.

**Time Required**: 30-45 minutes
**Risk Level**: Very Low (all changes reversible via UI)
**Code Changes**: None

---

## Prerequisites

- ✅ Cloudflare account access
- ✅ simplyenak.com zone access
- ✅ API Token created (yBacoOGAPjoxadEdT8Hsw10XcJr0f4tfSHWzlTx5)
- ✅ Permissions: Zone Settings, Cache, Page Rules, Analytics

---

## Part 1: Speed Optimization (15 mins)

### Step 1: Auto Minify
**Path**: `Speed` → `Optimization` → `Auto Minify`

**Settings**:
```
✅ JavaScript
✅ CSS
✅ HTML
```

**What it does**: Removes whitespace, comments, and unnecessary characters from code
**Impact**: -10-20% file size, faster download
**Risk**: Very low (can disable instantly)

---

### Step 2: Brotli Compression
**Path**: `Speed` → `Optimization` → `Brotli`

**Setting**:
```
✅ Enabled (should be default)
```

**What it does**: Better compression than gzip (15-20% smaller)
**Impact**: Faster downloads, especially on slow connections
**Risk**: None (browser fallback to gzip)

**Verify**:
```bash
curl -H "Accept-Encoding: br" -I https://simplyenak.com | grep -i encoding
# Should show: content-encoding: br
```

---

### Step 3: Early Hints
**Path**: `Speed` → `Optimization` → `Early Hints`

**Setting**:
```
✅ Enable
```

**What it does**: Sends Link headers before full response (HTTP 103)
**Impact**: Faster resource discovery, -100-200ms FCP
**Risk**: None (graceful fallback)

---

### Step 4: HTTP/3 (QUIC)
**Path**: `Network` → `HTTP/3 (with QUIC)`

**Setting**:
```
✅ Enable
```

**What it does**: Faster, more reliable connections (especially mobile)
**Impact**: -10-20% connection time
**Risk**: None (fallback to HTTP/2)

---

## Part 2: Image Optimization (10 mins)

### Step 5: Polish
**Path**: `Speed` → `Optimization` → `Polish`

**Settings**:
```
Mode: ✅ Lossless
WebP: ✅ Enabled
```

**What it does**:
- Strips metadata from images
- Converts to WebP for supporting browsers
- No visual quality loss

**Impact**: -20-30% image size
**Risk**: Very low (original images preserved)

**Note**: Astro already optimizes images, but Polish adds another layer

---

### Step 6: Mirage
**Path**: `Speed` → `Optimization` → `Mirage`

**Setting**:
```
✅ Enable
```

**What it does**:
- Lazy loads images automatically
- Serves lower quality on slow connections
- Progressive JPEG rendering

**Impact**: Faster mobile loading
**Risk**: None (Astro's lazy loading still works)

---

## Part 3: Caching Configuration (15 mins)

### Step 7: Browser Cache TTL
**Path**: `Caching` → `Configuration` → `Browser Cache TTL`

**Setting**:
```
Current: Respect Existing Headers (default)
Change to: 1 year
```

**What it does**: Tells browsers to cache static files longer
**Impact**: Repeat visitors load instantly
**Risk**: Low (can purge cache if needed)

**Assets affected**:
- CSS files
- JavaScript files
- Images
- Fonts

---

### Step 8: Caching Level
**Path**: `Caching` → `Configuration` → `Cache Level`

**Setting**:
```
Current: Standard (default)
Recommended: Keep as Standard
Advanced option: Aggressive (test first)
```

**Standard**: Caches static files only (recommended)
**Aggressive**: Caches HTML too (requires testing)

**For Now**: Keep as **Standard** (safer)

---

## Part 4: Page Rules (15 mins) ⚠️ IMPORTANT

Cloudflare Free plan: **3 Page Rules** maximum

### Rule 1: Cache Astro Assets (Highest Priority)
**Pattern**: `*simplyenak.com/_astro/*`

**Settings**:
```
Cache Level: Cache Everything
Edge Cache TTL: 1 month
Browser Cache TTL: 1 year
```

**What it does**: Aggressively caches JavaScript, CSS, optimized images
**Impact**: Near-instant loading for returning visitors
**Files matched**:
- `/_astro/*.js`
- `/_astro/*.css`
- `/_astro/*.webp`

**Priority**: 1 (highest)

---

### Rule 2: Cache Images (Medium Priority)
**Pattern**: `*simplyenak.com/*.{jpg,jpeg,png,webp,gif,svg,ico}`

**Settings**:
```
Cache Level: Cache Everything
Edge Cache TTL: 1 month
Polish: Lossless
```

**What it does**: Caches all image formats
**Impact**: Faster image loading globally
**Files matched**:
- `/favicon.ico`
- Any images in public folder

**Priority**: 2

---

### Rule 3: API Bypass (Lowest Priority)
**Pattern**: `api.system.simplyenak.com/*`

**Settings**:
```
Cache Level: Bypass
Security Level: Medium
```

**What it does**: Never caches Strapi API responses (dynamic content)
**Impact**: Always fresh data from backend
**Critical**: Prevents stale content

**Priority**: 3

---

## Part 5: Additional Settings (Optional)

### Rocket Loader (SKIP - Not Recommended)
**Path**: `Speed` → `Optimization` → `Rocket Loader`

**Setting**: ❌ **Leave Disabled**

**Why Skip**:
- Can conflict with Vue/React
- May break TicketingHub widget
- Astro already optimizes JS loading

---

### Always Online
**Path**: `Caching` → `Configuration` → `Always Online`

**Setting**: ✅ Enable

**What it does**: Serves cached version if origin is down
**Impact**: Better uptime
**Risk**: None

---

## Verification Steps

### After All Changes

#### 1. Check Auto Minify
```bash
curl -s https://simplyenak.com | wc -c
# HTML should be smaller (no whitespace)
```

#### 2. Check Brotli
```bash
curl -H "Accept-Encoding: br" -I https://simplyenak.com
# Look for: content-encoding: br
```

#### 3. Check HTTP/3
```bash
curl -I --http3 https://simplyenak.com
# Look for: alt-svc: h3=":443"
```

#### 4. Check Polish
Visit any image URL and check response headers:
```bash
curl -I https://simplyenak.com/_astro/some-image.webp
# Look for: cf-polished: qual=100, origFmt=webp
```

#### 5. Check Caching
```bash
curl -I https://simplyenak.com/_astro/client.DVxemvf8.js
# Look for: cf-cache-status: HIT
# Look for: cache-control: public, max-age=31536000
```

---

## Testing Checklist

### Before Enabling All Settings
- [ ] Save current PageSpeed score (baseline)
- [ ] Note current load time

### After Each Change
- [ ] Test homepage loads
- [ ] Test booking widget works
- [ ] Check browser console (no errors)
- [ ] Test on mobile

### Final Validation
- [ ] Run PageSpeed (mobile & desktop)
- [ ] Test all page types (home, tour, story, contact)
- [ ] Verify GA4 tracking works
- [ ] Test TicketingHub booking flow ⚠️ CRITICAL
- [ ] Check Cloudflare Analytics

---

## Expected Results

### Performance Improvements

| Setting | PageSpeed Impact | Notes |
|---------|------------------|-------|
| Auto Minify | +2-3 points | Smaller files |
| Brotli | +1-2 points | Better compression |
| Early Hints | +2-4 points | Faster resource discovery |
| HTTP/3 | +1-2 points | Especially mobile |
| Polish | +2-3 points | Smaller images |
| Mirage | +1-2 points | Mobile optimization |
| Page Rules | +3-5 points | Caching benefits |
| **TOTAL** | **+12-21 points** | Cumulative effect |

### Resource Loading

| Resource | Before | After | Improvement |
|----------|--------|-------|-------------|
| HTML | ~70KB | ~60KB | -15% (minify) |
| CSS | ~12KB | ~10KB | -17% (minify) |
| JS | ~180KB | ~150KB | -17% (minify+brotli) |
| Images | Various | -20-30% | Polish |
| Cache Hit | ~20% | ~80-90% | Page Rules |

---

## Rollback Plan

### If Issues Occur

#### Disable Individual Settings
**Path**: Same as where you enabled

Just toggle **OFF**:
- Auto Minify → Uncheck boxes
- Polish → Disable
- Mirage → Disable
- HTTP/3 → Disable
- Early Hints → Disable

**Effect**: Instant (next request)

#### Delete Page Rules
**Path**: `Rules` → `Page Rules`

Click **Delete** on any problematic rule
**Effect**: Immediate

#### Purge Cache
**Path**: `Caching` → `Configuration` → `Purge Everything`

**Use if**:
- Seeing old content
- Changes not reflecting
- Images broken

**Warning**: Temporary performance dip (cache rebuilds)

---

## Monitoring

### Cloudflare Analytics
**Path**: `Analytics & Logs` → `Web Analytics`

**Monitor**:
- Requests per day
- Bandwidth saved
- Cache hit ratio (target: 80%+)
- Error rate (should be <0.1%)

### Cache Performance
**Path**: `Caching` → `Analytics`

**Key Metrics**:
- Cache Hit Ratio (target: 80-90%)
- Saved Bandwidth (GB)
- Requests cached

### Performance
**Before**: Run PageSpeed baseline
**After**: Compare metrics:
- FCP improvement
- LCP improvement
- TBT improvement
- Overall score

---

## Advanced: Using Cloudflare MCP (Optional)

If MCP connection succeeds, you can configure via command line.

**Check connection**:
```bash
claude mcp list
# Should show: cloudflare - ✓ Connected
```

**Example commands** (if MCP works):
- `List all zones`
- `Get zone settings for simplyenak.com`
- `Enable auto minify for simplyenak.com`
- `Create page rule for caching`

**Note**: Dashboard UI is recommended for first-time setup

---

## Summary Table

| Step | Setting | Impact | Time | Risk |
|------|---------|--------|------|------|
| 1 | Auto Minify | +2-3 pts | 2 min | Low |
| 2 | Brotli | +1-2 pts | 1 min | None |
| 3 | Early Hints | +2-4 pts | 1 min | None |
| 4 | HTTP/3 | +1-2 pts | 1 min | None |
| 5 | Polish | +2-3 pts | 2 min | Low |
| 6 | Mirage | +1-2 pts | 1 min | None |
| 7 | Browser Cache | +1-2 pts | 2 min | Low |
| 8 | Page Rules | +3-5 pts | 15 min | Low |
| 9 | Always Online | 0 pts | 1 min | None |
| **TOTAL** | **All Settings** | **+13-24 pts** | **30-45 min** | **Low** |

---

## Next Session Checklist

For next optimization session:

- [ ] Update `.claude/memory.md` with Cloudflare settings applied
- [ ] Document before/after PageSpeed scores
- [ ] Note cache hit ratio improvement
- [ ] Record any issues encountered
- [ ] Plan Phase 4 if needed (Advanced optimizations)

---

## Support Resources

**Cloudflare Docs**:
- Speed: https://developers.cloudflare.com/speed/
- Caching: https://developers.cloudflare.com/cache/
- Page Rules: https://developers.cloudflare.com/rules/page-rules/

**Cloudflare Dashboard**: https://dash.cloudflare.com/

**Your Zone**: simplyenak.com

**API Token**: yBacoOGAPjoxadEdT8Hsw10XcJr0f4tfSHWzlTx5 (stored in MCP config)

---

## Final Notes

✅ **Safest optimizations** (do first):
- Auto Minify
- Brotli
- Early Hints
- HTTP/3

⚠️ **Test thoroughly**:
- Polish (check image quality)
- Page Rules (verify caching doesn't break dynamic content)

❌ **Skip for now**:
- Rocket Loader (can break React/Vue)
- Aggressive caching (needs testing)

**After applying all settings**: Wait 24 hours to see full impact (cache needs to warm up)
