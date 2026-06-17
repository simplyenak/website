# Simply Enak — Current Website Analytics Baseline

**Retrieved:** March 26, 2026  
**Property:** Google Analytics 4 (ID: 262711985)  
**Domain:** simplyenak.com (production)

---

## Executive Summary

**Current State:** Pre-launch / Development mode
- Very low traffic (15 users, 29 sessions in last 30 days)
- Only 8 days with data in last 30 days
- No conversions tracked yet
- High direct traffic (86.2%) suggests team testing

**Key Insight:** This is NOT representative of normal traffic — site appears to be in staging/development. Baselines will be more meaningful after production launch.

---

## Last 30 Days (Feb 24 - Mar 26, 2026)

| Metric | Value | Notes |
|--------|-------|-------|
| **Active Users** | 15 | Only 8 days with data |
| **Sessions** | 29 | ~1 session/day average |
| **Conversions** | 0 | Not configured or no bookings |
| **Engagement Rate** | 69.64% | Good engagement when visitors arrive |
| **Avg Session Duration** | 722s (12 min) | Very high — likely team members |
| **Bounce Rate** | ~20% | Low — visitors explore multiple pages |

---

## Last 90 Days Trend

| Metric | Total (90d) | Notes |
|--------|-------------|-------|
| **Active Users** | 513 | ~5.7 users/day average |
| **Sessions** | 528 | ~5.9 sessions/day average |
| **Conversions** | 0 | Not configured |

---

## Top 10 Pages (by Sessions)

| Rank | Page Path | Sessions | Avg Duration | Bounce Rate | Insight |
|------|-----------|----------|--------------|-------------|---------|
| 1 | / (Homepage) | 15 | 231s | 20.0% | Main entry point |
| 2 | /tours/ | 11 | 478s | 0.0% | High engagement, no bounce |
| 3 | /about/ | 8 | 605s | 12.5% | Visitors read company story |
| 4 | /stories/ | 7 | 226s | 14.3% | Blog content being read |
| 5 | /contact/ | 5 | 70s | 40.0% | Short visits, some bounce |
| 6 | /directions/ | 5 | 87s | 40.0% | Quick info lookup |
| 7 | /ms/ | 3 | 9s | 0.0% | Malay language version |
| 8 | /tours/locations/kuala-lumpur/ | 3 | 31s | 0.0% | Location page interest |
| 9 | /how-to-prepare/ | 2 | 623s | 0.0% | Long read time — valuable content |
| 10 | /stories/traveling-during-fasting-month/ | 2 | 0s | 100.0% | Immediate bounce |

---

## Traffic Sources

| Source | Sessions | % | Insight |
|--------|----------|---|---------|
| **Direct** | 25 | 86.2% | Team testing, bookmarks, emails |
| **Organic Search** | 2 | 6.9% | Very low — SEO not yet effective |
| **Cross-network** | 1 | 3.4% | Display ads or discovery |
| **Unassigned** | 1 | 3.4% | Tracking gap |

**Target Post-Launch:**
- Organic Search: 40-60%
- Direct: 20-30%
- Referral: 10-20%
- Social: 5-10%

---

## Conversion Funnel (Current)

**Cannot be measured yet** — conversion tracking not configured.

**To Track:**
1. Tour page view → Booking form start
2. Booking form start → Complete
3. Contact form submission
4. WhatsApp CTA clicks

---

## Core Web Vitals

**Not yet measured** — needs PageSpeed Insights API or Chrome UX Report.

**Target Post-Launch:**
- LCP: <2.5s
- FID: <100ms
- CLS: <0.1
- Overall Score: 90+/100

---

## SEO Health (Preliminary)

### What's Working
- ✅ XML sitemap present
- ✅ Structured data implemented (TouristTrip, BreadcrumbList, etc.)
- ✅ Mobile-responsive design
- ✅ HTTPS enforced

### What Needs Work
- ⚠️ Organic search traffic very low (2 sessions in 30 days)
- ⚠️ No keyword rankings data available yet
- ⚠️ Search Console integration needed

---

## Post-Launch Targets (4-8 Weeks)

| Metric | Current Baseline | Target | Improvement Needed |
|--------|------------------|--------|-------------------|
| Monthly Sessions | 29 | 1,000+ | +3,300% |
| Organic Search % | 6.9% | 50% | +43 pp |
| Conversion Rate | 0% | 5-6% | New tracking |
| Avg Session Duration | 722s | 180-300s | Normalize (currently inflated by team) |
| Bounce Rate | 20% | 25-35% | Normalize |

---

## Action Items

### Immediate (Before Launch)
- [ ] Configure conversion tracking in GA4
- [ ] Set up Google Search Console property verification
- [ ] Enable enhanced measurement (scrolls, outbound clicks, site search)
- [ ] Create GA4 exploration for funnel visualization

### Week 1 Post-Launch
- [ ] Monitor daily sessions (target: 30-50/day)
- [ ] Check organic search traffic (target: 20%+ of total)
- [ ] Verify conversion tracking firing correctly
- [ ] Review top pages for content optimization opportunities

### Week 2-4 Post-Launch
- [ ] Analyze traffic source trends
- [ ] Identify high-performing keywords
- [ ] Optimize underperforming pages (high bounce, low duration)
- [ ] A/B test CTAs on tour pages

### Week 4-8 Post-Launch
- [ ] Full performance review vs. targets
- [ ] Adjust SEO strategy based on keyword rankings
- [ ] Scale what's working (double down on high-converting pages)
- [ ] Plan Phase 2 optimizations

---

## Data Access

### Google Analytics 4
- **Property ID:** 262711985
- **Credentials:** `/home/maarten/.google/credentials/ga4-key.json`
- **Service Account:** `***REMOVED***`
- **Access URL:** https://analytics.google.com

### How to Pull Data
```bash
# Using Node.js with @google-analytics/data
cd /var/home/maarten/website-optimization
node scripts/pull-analytics.js
```

---

**Next Update:** 7 days post-production launch  
**Owner:** Development Team  
**Document Location:** `/var/home/maarten/website-optimization/revamp/docs/CURRENT_BASELINE_METRICS.md`
