# Deploy Cloudflare Worker for CDN Image Optimization

## What This Does

This Cloudflare Worker will:
- Proxy S3 images through cdn.simplyenak.com
- Enable Cloudflare Polish to convert images to WebP/AVIF
- Add aggressive caching (30 days)
- Reduce image sizes by 40-60%
- **Expected performance gain: +20 Mobile points (52 → 72+)**

## Worker Code

The worker script is located at: `/tmp/cdn-worker.js`

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Only handle /uploads/* paths
    if (!url.pathname.startsWith('/uploads/')) {
      return new Response('Not Found', { status: 404 });
    }

    // Proxy to S3
    const s3Url = `https://se-website-images.s3.nl-ams.scw.cloud${url.pathname}`;

    // Fetch from S3
    const response = await fetch(s3Url, {
      cf: {
        polish: 'lossy', // Enable Cloudflare Polish
        cacheEverything: true,
        cacheTtl: 2592000, // 30 days
      }
    });

    // Return response with CORS headers
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return newResponse;
  }
};
```

## Deployment Steps

### Option 1: Via Cloudflare Dashboard (Easiest)

1. Go to: https://dash.cloudflare.com/
2. Select **Workers & Pages** from left sidebar
3. Click **Create application** button
4. Select **Create Worker** tab
5. Name it: `cdn-image-proxy`
6. Click **Deploy**
7. Click **Edit code** button
8. Replace all code with the script above
9. Click **Save and deploy**
10. Go to **Settings** → **Triggers**
11. Click **Add route**
12. Enter route: `cdn.simplyenak.com/uploads/*`
13. Select zone: `simplyenak.com`
14. Click **Add route**

### Option 2: Via Wrangler CLI (For automation)

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create wrangler.toml
cat > /home/maarten/website-optimization/wrangler.toml << 'EOF'
name = "cdn-image-proxy"
main = "cdn-worker.js"
compatibility_date = "2025-10-02"

[env.production]
routes = [
  { pattern = "cdn.simplyenak.com/uploads/*", zone_name = "simplyenak.com" }
]
EOF

# Deploy
cd /home/maarten/website-optimization
cp /tmp/cdn-worker.js ./
wrangler deploy
```

## After Deployment

1. **Test the Worker:**
   ```bash
   curl -I https://cdn.simplyenak.com/uploads/Food_Experience_optimized_adc493606c.jpg
   ```

   Expected headers:
   ```
   HTTP/2 200
   content-type: image/webp  ← Should show webp if Polish is working
   cache-control: public, max-age=31536000, immutable
   cf-polished: origSize=500000, status=webp  ← Confirms Polish optimization
   ```

2. **Deploy Frontend Changes:**
   ```bash
   cd /home/maarten/website-optimization/frontend
   git add src/utils/getFullMediaUrl.ts
   git commit -m "perf: proxy S3 images through Cloudflare CDN for Polish optimization"
   git push origin perf-phase2-optimizations
   ```

3. **Purge Cloudflare Cache:**
   - Go to: Caching → Configuration
   - Click **Purge Everything**
   - Confirm

4. **Test Performance:**
   - Wait 2-3 minutes after cache purge
   - Visit: https://pagespeed.web.dev/
   - Test: `https://perf-phase2-optimizations.staging-5zf.pages.dev/`
   - Expected: **Mobile 70-75+** (up from 48)

## How It Works

```
User Browser
    ↓ Request: cdn.simplyenak.com/uploads/image.jpg
Cloudflare Edge (Worker)
    ↓ Fetch from: se-website-images.s3.nl-ams.scw.cloud/uploads/image.jpg
    ↓ Apply Polish: Convert to WebP, compress
    ↓ Cache for 30 days
    ↓ Return: cdn.simplyenak.com/uploads/image.jpg (but as WebP, 60% smaller)
User Browser
```

## Frontend Changes Made

Updated `/home/maarten/website-optimization/frontend/src/utils/getFullMediaUrl.ts`:

- Detects S3 URLs containing `se-website-images.s3.nl-ams.scw.cloud`
- Rewrites them to `cdn.simplyenak.com/uploads/...`
- Production only (keeps S3 direct in development)

Example transformation:
```
Before: https://se-website-images.s3.nl-ams.scw.cloud/uploads/image.jpg
After:  https://cdn.simplyenak.com/uploads/image.jpg
```

## Expected Results

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Mobile Score | 48 | **70-75** | +22-27 |
| Desktop Score | ? | **95+** | ? |
| LCP | 10.2s | **<2.5s** | -7.7s |
| Image Format | JPEG | **WebP/AVIF** | Modern |
| Image Size | 100% | **40-60%** | Smaller |
| Network Payload | Large | **30% smaller** | Compressed |

## Why This Works

1. **Cloudflare Polish:** Converts JPEG/PNG → WebP/AVIF automatically
2. **Edge Caching:** Images cached at 300+ Cloudflare locations worldwide
3. **Compression:** Lossy Polish reduces file sizes by 40-60%
4. **Browser Caching:** 1 year cache headers prevent repeat downloads
5. **No Strapi Changes:** S3 storage remains unchanged, only frontend URLs rewritten

## Troubleshooting

### If Worker doesn't trigger:
- Check route pattern is exactly: `cdn.simplyenak.com/uploads/*`
- Verify zone is `simplyenak.com`
- Wait 1-2 minutes for route propagation

### If images don't optimize:
- Verify Polish is enabled (Lossy mode)
- Check `cf-polished` header in curl response
- Purge Cloudflare cache again

### If images 404:
- Check S3 URL is accessible: `curl https://se-website-images.s3.nl-ams.scw.cloud/uploads/...`
- Verify path rewriting is correct in Worker code

## Next Steps

Once deployed and tested:
1. Merge `perf-phase2-optimizations` branch to `main`
2. Deploy to production
3. Monitor PageSpeed scores for 24 hours
4. Verify Core Web Vitals pass in Google Search Console

---

**Ready to deploy?** Choose Option 1 (Dashboard) or Option 2 (CLI) above.
