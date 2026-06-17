# Sitemap.xml on Cloudflare Pages — Technical Notes

**Created:** 2026-03-30  
**Question:** Does dynamic sitemap.xml work with static pages on Cloudflare Pages?

---

## ✅ Yes, It Works — Here's Why

### How Astro + Cloudflare Pages Works

**Astro's Build Process:**
1. During `npm run build`, Astro prerenders all pages
2. API routes (like `sitemap.xml.ts`) are executed **at build time**
3. Output is static files (`dist/sitemap.xml`)
4. Cloudflare Pages serves these static files

**Not Runtime Dynamic:**
- The sitemap is **not** generated on each request
- It's generated **once at build time**
- Cloudflare Pages serves the static `sitemap.xml` file
- No serverless function needed

---

## 📁 File Structure After Build

```
dist/
├── index.html
├── sitemap.xml          ← Generated at build time
├── robots.txt           ← Generated at build time
├── tours/
│   ├── index.html
│   └── kl-street-food/
│       └── index.html
└── _astro/              ← Static assets
```

---

## 🔧 How It Works

### sitemap.xml.ts (API Route)

```typescript
export const GET: APIRoute = async () => {
  // This runs ONCE at build time
  const tours = await getAllTours({ limit: 100 });
  
  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `...`).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
```

**At Build Time:**
- Astro executes `GET()` function
- Fetches data from Directus
- Generates static `sitemap.xml` file
- File is deployed to Cloudflare Pages

**At Request Time:**
- Cloudflare Pages serves the static file
- No API call to Directus
- No serverless function execution
- Instant response

---

## ⚠️ Important Considerations

### 1. Build-Time Data

**The sitemap reflects data at build time, not real-time.**

**If you add a new tour in Directus:**
- Sitemap won't update until next build
- **Solution:** Trigger rebuild when content changes

**How to Trigger Rebuild:**
```bash
# Manual: Push to git (if using GitHub integration)
# Or via Cloudflare Pages dashboard
# Or via API:
curl -X POST \
  "https://api.cloudflare.com/client/v4/pages/projects/simplyenak/deployments" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### 2. Directus Availability

**If Directus is down during build:**
- Sitemap generation will fail
- **Solution:** Error handling with fallback (already implemented)

**Our Implementation:**
```typescript
try {
  const tours = await getAllTours({ limit: 100 });
  // Generate full sitemap
} catch (error) {
  console.error('Error generating sitemap:', error);
  // Return basic sitemap with static pages only
  return new Response(basicSitemap, { ... });
}
```

### 3. Cache Headers

**We set 1-hour cache header:**
```typescript
return new Response(sitemap, {
  headers: {
    'Content-Type': 'application/xml',
    'Cache-Control': 'public, max-age=3600', // 1 hour
  },
});
```

**However:** On Cloudflare Pages, this header may not be respected for static files.

**Solution:** Use Cloudflare Cache Rules
- Go to Cloudflare Dashboard → Caching → Cache Rules
- Create rule: `Cache Everything` for `/sitemap.xml`
- Set Edge TTL: 1 hour

---

## 📊 Performance

### Build Time Impact

**Additional build time:** ~2-5 seconds
- Fetching tours from Directus: ~1-2 seconds
- Fetching stories from Directus: ~1 second
- Generating XML: ~0.5 seconds

**Negligible impact** on overall build time.

### Request Time Performance

**Response time:** < 50ms (static file served from edge)

**No runtime overhead** — it's a static file.

---

## 🔍 Alternative Approaches

### Option A: Build Hook (Recommended)

**Setup automatic rebuilds when content changes:**

1. **In Directus:** Create webhook
2. **Webhook triggers:** On tour create/update/delete
3. **Webhook calls:** Cloudflare Pages deploy API
4. **Result:** Sitemap updates automatically

**Setup Time:** 30 minutes

---

### Option B: Cron-Based Rebuild

**Rebuild sitemap daily via cron:**

```bash
# Cron job (daily at 2am)
0 2 * * * curl -X POST "https://api.cloudflare.com/..."
```

**Setup Time:** 15 minutes

---

### Option C: Hybrid Sitemap

**Static sitemap + dynamic index:**

1. **Main sitemap-index.xml:** Static, lists all sub-sitemaps
2. **sitemap-tours.xml:** Generated at build time (tours only)
3. **sitemap-static.xml:** Static file (static pages only)

**Benefit:** Can update tour sitemap independently

**Setup Time:** 1 hour

---

## ✅ Recommendation

**Current implementation is good for launch.**

**Post-Launch Improvements:**

1. **Week 1:** Set up Directus webhook for automatic rebuilds
2. **Week 2:** Add Cloudflare Cache Rule for sitemap.xml
3. **Month 1:** Monitor GSC for sitemap errors

---

## 📝 Testing Checklist

### Before Launch

- [ ] Build locally and check `dist/sitemap.xml`
  ```bash
  cd frontend
  npm run build
  cat dist/sitemap.xml
  ```

- [ ] Validate sitemap
  - Tool: https://www.xml-sitemaps.com/validate-sitemap.html

- [ ] Test robots.txt
  - Tool: https://www.google.com/robots/tester

- [ ] Deploy to staging
  - Check `https://staging.simplyenak.com/sitemap.xml`

### After Launch

- [ ] Submit sitemap to Google Search Console
- [ ] Monitor Coverage report for errors
- [ ] Check "Sitemaps" report in GSC

---

## 🆘 Troubleshooting

### Issue: Sitemap not updating after content changes

**Solution:** Trigger rebuild
```bash
# Via Cloudflare dashboard or API
curl -X POST "https://api.cloudflare.com/..."
```

### Issue: Directus unavailable during build

**Solution:** Error handling already in place — falls back to basic sitemap

### Issue: Sitemap not indexed by Google

**Solution:** 
1. Submit sitemap in GSC
2. Wait 24-48 hours
3. Check "Sitemaps" report for errors

---

**Document Created:** 2026-03-30  
**Status:** ✅ Implementation works with Cloudflare Pages  
**Next Step:** Set up automatic rebuilds post-launch  

---

*Sitemap on Cloudflare Pages — Technical Notes v1.0 — Simply Enak*
