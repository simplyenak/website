# Simply Enak SEO Data Collection & Baseline Report

**Created:** March 3, 2026  
**Status:** ⚠️ API Access Required  
**Property ID:** GA4-262711985 (from MCP config)

---

## 🔧 API Access Status

Your MCP configuration has these APIs connected:

| API | Credential | Status | Data Retrieved |
|-----|------------|--------|----------------|
| **Google Analytics** | corded-racer-472513-u4 | ⚠️ Needs testing | ❌ Not yet |
| **Google Search Console** | se-n8n-c31b1ed18559 | ⚠️ Needs testing | ❌ Not yet |
| **Cloudflare** | API Token | ✅ Connected | ⚠️ Performance only |
| **GitHub** | PAT Token | ✅ Connected | ✅ Repo access |
| **BigQuery** | se-n8n project | ⚠️ Needs testing | ❌ Not yet |

---

## 📊 Data Collection Plan

### Step 1: Google Analytics Data (Required)

**Property:** `262711985` (from your MCP config)

**Metrics to Pull:**
```sql
-- Run via GA4 API or BigQuery
SELECT
  date,
  page_path,
  sessions,
  users,
  conversions,
  average_session_duration,
  bounce_rate
FROM `se-n8n.analytics.events`
WHERE date >= '2026-02-01'
  AND date <= '2026-03-03'
ORDER BY sessions DESC
```

**What We Need:**
- [ ] Total sessions (last 30 days)
- [ ] Top 10 pages by traffic
- [ ] Conversion rate (booking completions)
- [ ] Traffic sources breakdown
- [ ] Mobile vs. desktop split
- [ ] Average session duration

**How to Get It:**

Option A - Use GA4 Interface:
1. Go to https://analytics.google.com
2. Select property: `corded-racer-472513-u4`
3. Reports → Engagement → Pages and screens
4. Date range: Last 28 days
5. Export to CSV

Option B - Use BigQuery (if connected):
```bash
bq query --use_legacy_sql=false "
SELECT page_path, COUNT(*) as sessions 
FROM \`se-n8n.analytics.events\`
WHERE _TABLE_SUFFIX BETWEEN '20260201' AND '20260303'
GROUP BY page_path 
ORDER BY sessions DESC 
LIMIT 20"
```

---

### Step 2: Google Search Console Data (Required)

**Property:** `https://simplyenak.com`

**Metrics to Pull:**
- [ ] Total impressions (last 28 days)
- [ ] Total clicks
- [ ] Average CTR
- [ ] Average position
- [ ] Top 20 keywords by impressions
- [ ] Top 10 pages by clicks
- [ ] Index coverage status

**How to Get It:**

Option A - Use GSC Interface:
1. Go to https://search.google.com/search-console
2. Select property: `simplyenak.com`
3. Performance → Search results
4. Date range: Last 28 days
5. Export to CSV

Option B - Use API (if MCP server working):
```bash
# Using your MCP-configured API
curl -X POST "https://searchconsole.googleapis.com/v1/searchAnalytics/query" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "startDate": "2026-02-01",
    "endDate": "2026-03-03",
    "resourceId": "https://simplyenak.com",
    "dimensions": ["query", "page"],
    "rowLimit": 50
  }'
```

---

### Step 3: Cloudflare Analytics (Partial Data Available)

**Account ID:** `464881de51ec2f03bea6104e467bf3fb`

**Metrics to Pull:**
- [ ] Total requests (last 28 days)
- [ ] Bandwidth used
- [ ] Cache hit rate
- [ ] Page load time (p75, p95)
- [ ] Core Web Vitals scores
- [ ] Threats blocked

**How to Get It:**

Option A - Cloudflare Dashboard:
1. Go to https://dash.cloudflare.com
2. Select zone: `simplyenak.com`
3. Analytics & Logs → Traffic
4. Date range: Last 28 days

Option B - Use API:
```bash
curl -X GET "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/analytics/dashboard" \
  -H "Authorization: Bearer DHprtg_nO-QCaeFwJABeWOoLiG3T4ppNBRjF1HDD" \
  -G --data-urlencode "since=2026-02-01" \
  --data-urlencode "until=2026-03-03"
```

---

### Step 4: Technical SEO Audit (Can Do Now)

#### Crawl Status

**Tool:** Use `site:` operator

```bash
# Check indexed pages
curl -s "https://www.google.com/search?q=site:simplyenak.com" | \
  grep -oP 'About [0-9,]+ results' || echo "Check manually"
```

**Manual Check:**
1. Go to Google
2. Search: `site:simplyenak.com`
3. Note: "About X results" number
4. Compare to expected page count

#### Current Rankings (Manual Check)

| Keyword | Current Position | Search Volume | Target |
|---------|------------------|---------------|--------|
| food tour kuala lumpur | _check manually_ | 12,100 | Top 3 |
| kl food tour | _check manually_ | 8,900 | Top 3 |
| penang food tour | _check manually_ | 2,900 | Top 3 |
| georgetown food tour | _check manually_ | 1,600 | Top 3 |
| vegetarian food tour kl | _check manually_ | 880 | Top 1 |

**How to Check:**
1. Open incognito browser
2. Search each keyword
3. Note position (1-100)
4. Record in table above

---

### Step 5: Competitor Benchmarking

**Competitors to Track:**

| Competitor | Domain | Estimated Traffic | Keywords |
|------------|--------|-------------------|----------|
| A Chef's Tour | achefstour.com | _check with SimilarWeb_ | _check with Ubersuggest_ |
| Secret Food Tours | secretfoodtours.com | _check_ | _check_ |
| Malaysia Taste | malaysiataste.com | _check_ | _check_ |

**Free Tools:**
- SimilarWeb (free tier): Traffic estimates
- Ubersuggest (free tier): Keyword research
- Facebook Ad Library: See their ad spend

---

## 📈 Baseline Metrics Template

### Traffic Overview (Last 28 Days)

| Metric | Value | Source |
|--------|-------|--------|
| Total Sessions | _fill in_ | GA4 |
| Total Users | _fill in_ | GA4 |
| Pageviews | _fill in_ | GA4 |
| Bounce Rate | _fill in_ | GA4 |
| Avg Session Duration | _fill in_ | GA4 |
| Conversions (Bookings) | _fill in_ | GA4 |
| Conversion Rate | _fill in_ | GA4 |

### Search Performance (Last 28 Days)

| Metric | Value | Source |
|--------|-------|--------|
| Total Impressions | _fill in_ | GSC |
| Total Clicks | _fill in_ | GSC |
| Average CTR | _fill in_ | GSC |
| Average Position | _fill in_ | GSC |
| Indexed Pages | _fill in_ | GSC / site: search |

### Technical Performance

| Metric | Value | Source |
|--------|-------|--------|
| Page Load Time (p75) | _fill in_ | Cloudflare / PageSpeed |
| Mobile Friendly | _fill in_ | PageSpeed Insights |
| Core Web Vitals Pass | _fill in_ | PageSpeed Insights |
| HTTPS Valid | _fill in_ | Browser check |
| Schema Markup Valid | _fill in_ | Rich Results Test |

---

## 🎯 Quick Wins (Can Do Without Full Data)

### 1. Check Current Meta Tags

**Homepage:**
```bash
curl -s https://simplyenak.com | grep -oP '<title>\K[^<]+'
curl -s https://simplyenak.com | grep -oP 'name="description" content="\K[^"]+'
```

**Expected:**
- Title: "Simply Enak – Food Tours and more" (needs optimization)
- Description: "Simply Enak offers premium Malaysian food tours..." (needs optimization)

**Recommended:**
- Title: "Malaysian Food Tours | Authentic Street Food | Simply Enak"
- Description: "Walk with a local. Taste real stories. Small group food tours in KL & Penang. Generational vendors, 15+ years experience. From RM 285."

### 2. Check Schema Markup

```bash
curl -s https://simplyenak.com | grep -oP 'application/ld\+json"[\s\S]*?</script>' | head -1
```

**Expected:** Should have LocalBusiness schema

**If missing:** Add schema from `/docs/seo/schema-localbusiness.json`

### 3. Check TripAdvisor Integration

**Current:** 5-star, 6x Travellers' Choice

**Action:**
- [ ] Add TripAdvisor widget to homepage
- [ ] Link to your TripAdvisor profile from every page
- [ ] Add review schema markup

---

## 📋 Action Items

### Immediate (This Week)

- [ ] **Pull GA4 data** - Use interface or BigQuery
- [ ] **Pull GSC data** - Use interface or API
- [ ] **Check keyword rankings** - Manual search for top 10 keywords
- [ ] **Audit meta tags** - Compare to recommendations
- [ ] **Check schema markup** - Use Rich Results Test

### Short-Term (Next 2 Weeks)

- [ ] **Fix meta tags** - Update homepage + tour pages
- [ ] **Add FAQ schema** - Use `/docs/seo/schema-faq.json`
- [ ] **Create vendor story #1** - "Aunty Lim: 42 Years of Laksa"
- [ ] **Set up review request emails** - Post-tour automation

### Medium-Term (Next Month)

- [ ] **Publish 3 blog posts** - Vendor stories, cultural guides
- [ ] **Build 5 backlinks** - Travel bloggers, Tourism Malaysia
- [ ] **Optimize for AI search** - Follow GEO optimization guide
- [ ] **Track review count** - Target 200+ by end of Q2

---

## 🔗 Useful Links

**Your Properties:**
- GA4: https://analytics.google.com (Property: 262711985)
- GSC: https://search.google.com/search-console (Property: simplyenak.com)
- Cloudflare: https://dash.cloudflare.com (Account: 464881de51ec2f03bea6104e467bf3fb)

**SEO Tools:**
- Rich Results Test: https://search.google.com/test/rich-results
- PageSpeed Insights: https://pagespeed.web.dev
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- Schema Validator: https://validator.schema.org

**Competitor Research (Free Tiers):**
- SimilarWeb: https://similarweb.com
- Ubersuggest: https://neilpatel.com/ubersuggest
- Facebook Ad Library: https://facebook.com/ads/library

---

**Next Steps:**

1. **Fill in the baseline metrics** using your GA4 + GSC access
2. **Share the data** and I'll create a data-driven SEO plan
3. **Prioritize quick wins** from the action items above

**Document Status:** ⏳ Waiting for Data  
**Owner:** Simply Enak Team  
**Next Update:** After GA4 + GSC data pull
