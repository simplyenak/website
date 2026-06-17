# Go-Live Runbook

> **CRITICAL RULE:** NEVER deploy to the `website` project. All deploys go to `staging`.

---

## Quick Reference

| Item | Value |
|---|---|
| **CF Pages project** | `staging` |
| **Staging domain** | `staging.simplyenak.com` |
| **Production domain** | `simplyenak.com` (points to `website` project — DO NOT TOUCH) |
| **Repo root** | `/var/home/maarten/website-optimization/revamp` |
| **Build dir** | `revamp/frontend/dist` |
| **Payload dev server** | `pm2 start "npx next dev --webpack" --name payload-dev` |
| **Postgres** | `sudo -u postgres /usr/bin/pg_ctl -D /var/lib/pgsql/data start` |

---

## Pre-Launch Checklist

### 1. Verify Payload DB is Healthy

```bash
# Check Postgres is running
sudo -u postgres /usr/bin/pg_ctl -D /var/lib/pgsql/data status

# Check Payload is responding
curl -s http://localhost:1337/api/tours -o /dev/null -w "%{http_code}"
# Should return: 200
```

If Postgres is down:
```bash
sudo -u postgres /usr/bin/pg_ctl -D /var/lib/pgsql/data start
```

If Payload is down:
```bash
pm2 list  # check if running
pm2 delete payload-dev 2>/dev/null
cd /var/home/maarten/website-optimization/payload-local
pm2 start "npx next dev --webpack" --name payload-dev --cwd /var/home/maarten/website-optimization/payload-local --restart-delay 3000
# Wait ~12s for it to boot
```

### 2. Sync Content from Payload

```bash
cd /var/home/maarten/website-optimization/revamp/frontend
npm run sync
# Verify no errors
```

### 3. Verify Content Quality

```bash
# Check no empty JSON files
for f in src/data/content/*.json; do
  [ ! -s "$f" ] && echo "EMPTY: $f"
done

# Check no placeholder text
grep -rn 'lorem ipsum\|placeholder\|TBD\|DRAFT' src/data/content/*.json

# Check all tours have required fields
python3 -c "
import json
tours = json.load(open('src/data/content/tours.json'))
real = ['kl-street-food', 'flavours-of-malaysia', 'eat-drink-george-town', 'penang-street-food', 'secrets-of-kl-nightlife']
for t in tours:
    if t.get('slug') in real and t.get('status') == 'published':
        if not t.get('name'): print(f'Missing name: {t[\"slug\"]}')
        if not t.get('price'): print(f'Missing price: {t[\"slug\"]}')
        if not t.get('duration'): print(f'Missing duration: {t[\"slug\"]}')
print('Content check complete')
"
```

### 4. Verify Environment Variables

Set these on the CF Pages project **before** deploying:

| Variable | Value | Where |
|---|---|---|
| `PUBLIC_FORMS_WEBHOOK` | Your n8n/contact webhook URL | CF Pages → staging → Settings → Environment Variables |

If not set, the contact form falls back to `https://contact.simplyenak.com` (already live).

---

## Deploy Procedure

### Step 1: Clean Build

```bash
cd /var/home/maarten/website-optimization/revamp/frontend
rm -rf dist
npx astro build
# Verify: should show "647 page(s) built" with no errors
```

### Step 2: Deploy to Staging

```bash
source /var/home/maarten/.cloudflare/tokens.env
CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN_WORKERS /usr/local/sbin/wrangler pages deploy \
  /var/home/maarten/website-optimization/revamp/frontend/dist \
  --project-name staging \
  --commit-dirty
```

**Expected output:** `✨ Deployment complete! Take a peek over at https://XXXXXX.staging-5zf.pages.dev`

### Step 3: Verify Deployed Site

```bash
# Check staging is responding (use Basic auth credentials)
curl -sI -u "username:password" https://staging.simplyenak.com/ | head -5

# Verify key pages
curl -sI -u "username:password" https://staging.simplyenak.com/tours/ | grep "HTTP/2"
curl -sI -u "username:password" https://staging.simplyenak.com/tours/kl-street-food/ | grep "HTTP/2"
curl -sI -u "username:password" https://staging.simplyenak.com/tours/private-tours/ | grep "HTTP/2"
curl -sI -u "username:password" https://staging.simplyenak.com/about/ | grep "HTTP/2"
curl -sI -u "username:password" https://staging.simplyenak.com/contact/ | grep "HTTP/2"

# All should return HTTP 200
```

### Step 4: Smoke Test

Manually verify in browser (staging.simplyenak.com):

- [ ] Homepage loads with correct hero text and CTAs
- [ ] "Plan a Private Tour" CTA → navigates to `/tours/private-tours/`
- [ ] Experience Profiler completes and shows profile card
- [ ] "Chat with Our Team Now" button opens MyAlice widget
- [ ] WhatsApp CTA generates pre-filled message with profile
- [ ] All 5 real tours load with correct pricing and CTAs
- [ ] Contact form submits without errors
- [ ] MyAlice chat widget loads on all pages
- [ ] No console errors (F12 → Console)
- [ ] Mobile layout looks correct
- [ ] Language switcher works for at least 3 languages

### Step 5: Verify Redirects

```bash
# Test old URLs redirect on staging
curl -sI -u "username:password" https://staging.simplyenak.com/kuala-lumpur-food-tour/ | grep "location:"
# Should return: location: https://staging.simplyenak.com/tours/locations/kuala-lumpur/

curl -sI -u "username:password" https://staging.simplyenak.com/eating-durians/ | grep "location:"
# Should return: location: https://staging.simplyenak.com/stories/eating-durians/

curl -sI -u "username:password" https://staging.simplyenak.com/guides/penang/ | grep "location:"
# Should return: location: https://staging.simplyenak.com/tours/locations/penang/
```

### Step 6: Verify SEO

```bash
# Check robots.txt is generated (not static file)
curl -s -u "username:password" https://staging.simplyenak.com/robots.txt

# Check sitemap
curl -s -u "username:password" https://staging.simplyenak.com/sitemap-index.xml | head -5

# Check llms.txt
curl -s -u "username:password" https://staging.simplyenak.com/llms.txt | head -10

# Check structured data on homepage
curl -s -u "username:password" https://staging.simplyenak.com/ | grep -o '"@type":"LocalBusiness"' | head -1
# Should find: "@type":"LocalBusiness"

# Check hreflang tags
curl -s -u "username:password" https://staging.simplyenak.com/ | grep 'hreflang' | wc -l
# Should find: 11 (10 languages + x-default)
```

---

## DNS / Domain Switch (Future)

When ready to replace the production site:

1. **Do NOT touch the `website` CF Pages project** — it serves `simplyenak.com`
2. **Options:**
   - **Option A:** Change `simplyenak.com` custom domain from `website` project to `staging` project (risky — downtime possible)
   - **Option B:** Create a new CF Pages project (e.g., `production-v2`), deploy revamp dist to it, then switch the domain (safer)
3. **Before switching:**
   - Run full smoke test on staging
   - Verify all redirects work
   - Test contact form end-to-end
   - Test MyAlice integration with real profile data
   - Test Experience Profiler on staging
4. **After switching:**
   - Verify `simplyenak.com` serves the new site
   - Verify `staging.simplyenak.com` still works for staging
   - Test all old URL redirects on production
   - Check Google Search Console for crawl errors

---

## Rollback Plan

If the deploy breaks something:

### Option A: Re-deploy Previous Version
```bash
# List recent deployments
source /var/home/maarten/.cloudflare/tokens.env
CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN_WORKERS \
  /usr/local/sbin/wrangler pages deployment list --project-name staging

# The previous deployment is still available — you can browse to the old URL
```

### Option B: Revert and Re-deploy
```bash
cd /var/home/maarten/website-optimization/revamp/frontend
# Revert any recent code changes
git checkout -- <file>
# Re-build and re-deploy
rm -rf dist && npx astro build
source /var/home/maarten/.cloudflare/tokens.env
CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN_WORKERS \
  /usr/local/sbin/wrangler pages deploy dist --project-name staging --commit-dirty
```

### Option C: Emergency (Cloudflare Pages UI)
1. Go to Cloudflare Dashboard → Pages → staging
2. Click "Deployments" tab
3. Find the last known-good deployment
4. Click "Retry deployment" on it

---

## Post-Launch Monitoring

### First 24 Hours
- [ ] Monitor CF Pages build/deploy logs for errors
- [ ] Check GA4 for traffic spikes or drops
- [ ] Monitor MyAlice dashboard for incoming chats
- [ ] Test contact form submissions are received
- [ ] Check Search Console for crawl errors
- [ ] Verify OG image displays correctly on social shares

### First Week
- [ ] Review GA4 for bounce rate changes vs old site
- [ ] Check redirect chain performance (no double-redirects)
- [ ] Monitor serverless function / webhook delivery rates
- [ ] Review MyAlice conversations for quality of profile data
- [ ] Check if any old URLs from backlinks are 404ing

---

## Contact Information

| Role | Contact |
|---|---|
| **Primary** | Maarten |
| **Backup** | Pauline |
| **CF Account** | Simply Enak Cloudflare account |
| **MyAlice** | https://myalice.ai |
| **CF Pages** | https://dash.cloudflare.com/?to=/:account/pages |
