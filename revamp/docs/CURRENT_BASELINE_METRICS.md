# Simply Enak — Current Website Metrics Baseline

**Document Created:** March 24, 2026  
**Purpose:** Baseline metrics for current production site (simplyenak.com) to compare against new staging site performance

---

## Analytics Configuration

| Property | Value |
|----------|-------|
| **Google Analytics Property ID** | 262711985 |
| **Domain** | simplyenak.com |
| **Platform** | Astro 5 SSG |
| **CMS** | Directus (self-hosted) |
| **Hosting** | Cloudflare Pages |
| **Form Handler** | Cloudflare Worker (`contact.simplyenak.com`) |

---

## Current Metrics (PRODUCTION BASELINE)

**Data Source:** Google Analytics 4 (Property ID: 262711985)  
**Retrieved:** March 26, 2026

### Last 30 Days (Baseline)
| Metric | Value | Date Range |
|--------|-------|------------|
| Active Users | 15 | Feb 24 - Mar 26, 2026 |
| Sessions | 29 | Feb 24 - Mar 26, 2026 |
| Conversions | 0 | Feb 24 - Mar 26, 2026 |
| Engagement Rate | 69.64% | Feb 24 - Mar 26, 2026 |
| Average Session Duration | 722s (12 min) | Feb 24 - Mar 26, 2026 |
| Bounce Rate | ~20% (estimated) | Feb 24 - Mar 26, 2026 |

**Note:** Very low traffic in last 30 days (only 8 days with data). Site may be in staging/development mode.

### Last 90 Days (Trend)
| Metric | Value | Change vs. Previous 30 Days |
|--------|-------|-----------------------------|
| Active Users | 513 | N/A (no prior data) |
| Sessions | 528 | N/A (no prior data) |
| Conversions | 0 | N/A (no prior data) |

### Top Pages (by Sessions - Last 30 Days)
| Page Path | Sessions | Avg. Time on Page | Bounce Rate |
|-----------|----------|-------------------|-------------|
| / (Homepage) | 15 | 231s | 20.0% |
| /tours/ | 11 | 478s | 0.0% |
| /about/ | 8 | 605s | 12.5% |
| /stories/ | 7 | 226s | 14.3% |
| /contact/ | 5 | 70s | 40.0% |
| /directions/ | 5 | 87s | 40.0% |
| /ms/ | 3 | 9s | 0.0% |
| /tours/locations/kuala-lumpur/ | 3 | 31s | 0.0% |
| /how-to-prepare/ | 2 | 623s | 0.0% |
| /stories/traveling-during-fasting-month/ | 2 | 0s | 100.0% |

### Traffic Sources
| Source | Sessions | % of Total |
|--------|----------|------------|
| Direct | 25 | 86.2% |
| Organic Search | 2 | 6.9% |
| Cross-network | 1 | 3.4% |
| Unassigned | 1 | 3.4% |
| **Total** | **29** | **100%** |

**Insight:** Very high direct traffic (86.2%) suggests most visitors are:
- Team members testing
- People with direct link (bookmarks, emails)
- Low organic search visibility (only 2 sessions from search)

This should shift after launch with proper SEO — target: 40-60% organic search.

### Conversion Funnel (Current)
| Step | Users | Conversion Rate |
|------|-------|-----------------|
| Tour page view | ___ | — |
| Booking form start | ___ | ___% |
| Booking form complete | ___ | ___% |
| Thank you page | ___ | ___% |

---

## Search Console Metrics (To Be Populated)

### Last 3 Months (Search Performance)
| Metric | Value | Change |
|--------|-------|--------|
| Total Clicks | ___ | +/− ___% |
| Total Impressions | ___ | +/− ___% |
| Average CTR | ___% | +/− ___% |
| Average Position | ___ | +/− ___ |

### Top Keywords (by Clicks)
| Keyword | Clicks | Impressions | CTR | Position |
|---------|--------|-------------|-----|----------|
| kuala lumpur food tour | ___ | ___ | ___% | ___ |
| penang food tour | ___ | ___ | ___% | ___ |
| malaysian food tour | ___ | ___ | ___% | ___ |
| street food tour kl | ___ | ___ | ___% | ___ |
| vegetarian food tour malaysia | ___ | ___ | ___% | ___ |

### Index Coverage
| Status | Pages |
|--------|-------|
| Indexed | ___ |
| Excluded | ___ |
| Error | ___ |
| Valid with Warnings | ___ |

---

## Core Web Vitals (Current Production)

**Source:** PageSpeed Insights / Chrome UX Report

### Mobile
| Metric | Value | Status |
|--------|-------|--------|
| LCP (Largest Contentful Paint) | ___s | 🟢/🟡/🔴 |
| FID (First Input Delay) | ___ms | 🟢/🟡/🔴 |
| CLS (Cumulative Layout Shift) | ___ | 🟢/🟡/🔴 |
| Overall Score | ___/100 | — |

### Desktop
| Metric | Value | Status |
|--------|-------|--------|
| LCP (Largest Contentful Paint) | ___s | 🟢/🟡/🔴 |
| FID (First Input Delay) | ___ms | 🟢/🟡/🔴 |
| CLS (Cumulative Layout Shift) | ___ | 🟢/🟡/🔴 |
| Overall Score | ___/100 | — |

---

## Business Metrics (From Directus/Booking System)

### Monthly Bookings (Last 3 Months)
| Month | Bookings | Revenue (RM) | Avg. Booking Value |
|-------|----------|--------------|-------------------|
| [Month 1] | ___ | ___ | ___ |
| [Month 2] | ___ | ___ | ___ |
| [Month 3] | ___ | ___ | ___ |

### Tour Popularity
| Tour | % of Total Bookings | Avg. Group Size |
|------|---------------------|-----------------|
| KL Food Tour | ___% | ___ |
| Vegetarian Food Tour | ___% | ___ |
| Penang Food Tour | ___% | ___ |
| Private Tours | ___% | ___ |
| Corporate Groups | ___% | ___ |

### Inquiry Sources
| Source | Inquiries/Month | Conversion Rate |
|--------|-----------------|-----------------|
| Contact Form | ___ | ___% |
| WhatsApp | ___ | ___% |
| Phone | ___ | ___% |
| Email | ___ | ___% |

---

## Technical Performance (Current Production)

### Page Load Times (from GA4 or PageSpeed)
| Page | Load Time (3G) | Load Time (4G) | Load Time (WiFi) |
|------|----------------|----------------|------------------|
| Homepage | ___s | ___s | ___s |
| Tour Detail | ___s | ___s | ___s |
| Location Page | ___s | ___s | ___s |
| Blog Post | ___s | ___s | ___s |

### Asset Sizes
| Asset Type | Avg. Size | Optimized? |
|------------|-----------|------------|
| Images | ___ KB | ☐ Yes ☐ No |
| CSS | ___ KB | ☐ Yes ☐ No |
| JavaScript | ___ KB | ☐ Yes ☐ No |
| Total Page Weight | ___ KB | — |

---

## SEO Health (Current Production)

### Technical SEO
| Check | Status | Notes |
|-------|--------|-------|
| XML Sitemap | ☐ Valid ☐ Missing ☐ Errors | |
| Robots.txt | ☐ Valid ☐ Missing ☐ Errors | |
| Canonical Tags | ☐ All Pages ☐ Some ☐ None | |
| Hreflang Tags | ☐ All Languages ☐ Some ☐ None | |
| Schema Markup | ☐ Valid ☐ Partial ☐ None | |
| HTTPS Enforced | ☐ Yes ☐ No | |
| Mobile-Friendly | ☐ Yes ☐ No | |

### Content SEO
| Check | Status | Notes |
|-------|--------|-------|
| Unique Title Tags | ☐ All ☐ Some ☐ None | |
| Unique Meta Descriptions | ☐ All ☐ Some ☐ None | |
| H1 Tags Present | ☐ All ☐ Some ☐ None | |
| Internal Linking | ☐ Good ☐ Fair ☐ Poor | |
| Image Alt Text | ☐ All ☐ Some ☐ None | |

---

## Post-Launch Comparison Targets

Once the new staging site launches, compare against these baselines:

### SEO Targets (4-8 Weeks Post-Launch)
| Metric | Baseline | Target | Actual |
|--------|----------|--------|--------|
| Organic Sessions | ___ | +400% | ___ |
| Keyword Rankings (Top 3) | ___ | 10+ keywords | ___ |
| Search Impressions | ___ | 10,000+/month | ___ |

### Conversion Targets
| Metric | Baseline | Target | Actual |
|--------|----------|--------|--------|
| Tour Page → Booking | ___% | 5-6% | ___ |
| Contact Form Completion | ___% | 30%+ | ___ |
| WhatsApp CTA Clicks | ___ | +200% | ___ |

### Performance Targets
| Metric | Baseline | Target | Actual |
|--------|----------|--------|--------|
| Lighthouse Score | ___ | 90+ | ___ |
| Mobile Load Time | ___s | <3s | ___ |
| Core Web Vitals Pass | ☐ Yes ☐ No | Yes | ___ |

---

## How to Access Analytics Data

### Option 1: Google Analytics UI (Manual)
1. Go to https://analytics.google.com
2. Log in with booking@simplyenak.com
3. Select Property: "Simply Enak" (ID: 262711985)
4. Navigate to Reports → Engagement → Pages and screens
5. Export data as CSV

### Option 2: Google Analytics API (Programmatic)
```bash
# Using gws CLI (if analytics module is available)
gws analytics:reports run --property=262711985 --metrics=activeUsers,sessions,conversions --date-range=last-30-days

# Or use Python with google-analytics-data library
pip install google-analytics-data
```

### Option 3: Search Console UI (Manual)
1. Go to https://search.google.com/search-console
2. Select Property: simplyenak.com
3. Navigate to Performance → Search results
4. Export data as CSV

### Option 4: Search Console API (Programmatic)
```bash
# Using gws CLI
gws search-console query --property=https://simplyenak.com --start-date=2026-02-24 --end-date=2026-03-24
```

### Option 5: PageSpeed Insights API
```bash
# Test current homepage
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://simplyenak.com&strategy=mobile&key=YOUR_API_KEY"
```

---

## Next Steps

1. **[ ] Grant analytics access** — Add maarten@simplyenak.com or appropriate account to GA4 property
2. **[ ] Populate baseline metrics** — Fill in all "___" values above
3. **[ ] Set up tracking on staging** — Ensure new site has GA4 configured (but separate property or filtered)
4. **[ ] Define success metrics** — Agree on what "success" looks like post-launch
5. **[ ] Schedule post-launch review** — 4 weeks and 8 weeks after production deploy

---

*Baseline Metrics Document v1.0 — Simply Enak*  
*Created: March 24, 2026*  
*To be populated with current production data before staging launch*
