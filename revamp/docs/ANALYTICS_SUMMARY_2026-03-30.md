# Simply Enak Analytics Summary — March 30, 2026

## **Data Sources**

- **Google Analytics 4:** Property ID 262711985 (✅ Connected)
- **Google Search Console:** https://simplyenak.com/ (❌ Permission issue - needs fix)
- **Period:** Last 90 days (January - March 2026)

---

## **Key Metrics**

| Metric | Value | Insight |
|--------|-------|---------|
| **Total Sessions** | 499 | ~5-6 sessions/day average |
| **Total Users** | 498 | Almost all unique visitors |
| **Top Page** | Homepage (simplyenak.com) | 499 sessions (100%) |
| **Tour Page Traffic** | 1-4 sessions each | Not ranking for keywords |

---

## **Top Pages by Traffic**

| Rank | Page | Sessions | Users | Notes |
|------|------|----------|-------|-------|
| 1 | Homepage | 499 | 498 | All traffic lands here |
| 2 | trafficheap.com | 499 | 498 | Referral? (investigate) |
| 3 | KL Street Food Tour | 4 | 3 | `/tours/kl-street-food/` |
| 4 | Vegetarian Food Tours | 4 | 3 | `/tours/dietary/vegetarian/` |
| 5 | Penang Street Food Tour | 3 | 3 | `/tours/penang-street-food/` |
| 6 | Penang Food Tours | 3 | 3 | `/tours/penang-food-tour/` |
| 7 | How to Prepare | 2 | 2 | `/how-to-prepare/` |
| 8 | Durian Guide | 2 | 2 | Blog content |
| 9 | Family Tours | 1 | 1 | `/tours/family-tours/` |
| 10 | Night Tours | 1 | 1 | `/tours/night-tours/` |
| 11 | Press & Media | 1 | 1 | `/media/` |

---

## **Critical Insights**

### **1. Homepage Dependency**
- 99% of traffic goes to homepage
- Tour pages exist but get almost no organic traffic
- **Action:** Optimize tour pages for AI search citations

### **2. Content Pages Not Ranking**
- Existing tour pages get 1-4 sessions in 90 days
- Pages exist but don't rank for relevant keywords
- **Action:** Add FAQ schema, fact density, entity consistency per TJ Robertson framework

### **3. trafficheap.com Anomaly**
- 499 sessions from trafficheap.com (same as homepage)
- **Action:** Investigate — could be tracking issue or referral spam

---

## **Keyword Opportunities (Based on Existing Pages)**

| Page | Current Traffic | Target Keyword | Priority |
|------|-----------------|----------------|----------|
| `/tours/kl-street-food/` | 4 sessions | `chinatown kl food tour` | P0 |
| `/tours/dietary/vegetarian/` | 4 sessions | `vegetarian food tour kl` | P0 |
| `/tours/penang-street-food/` | 3 sessions | `penang georgetown food tour` | P0 |
| `/how-to-prepare/` | 2 sessions | `what to wear food tour kl` | P1 |
| `/tours/family-tours/` | 1 session | `family food tour kl` | P1 |

---

## **Pages to Create (TJ Robertson Framework)**

Based on TJ Robertson's AI search research, these pages get cited most:

| Page | Purpose | Priority |
|------|---------|----------|
| `/faq/` | 20+ questions in 40-60 word answers | P0 |
| `/reviews/` | 10+ full testimonials with schema | P0 |
| `/vs/other-kl-food-tours/` | Comparison page (AI citation magnet) | P0 |
| `/tours/private-tours/` | High-intent commercial page | P0 |
| `/vendor-stories/` | Entity-rich vendor stories | P1 |

---

## **GSC Data Issue**

**Status:** ❌ Permission denied

**Error:**
```
User does not have sufficient permission for site 'https://simplyenak.com/'
```

**Fix Required:**
1. Check service account email in `/var/home/maarten/.config/claude/gsc-service-account.json`
2. Go to https://search.google.com/search-console
3. Settings → Users and permissions → Add user
4. Add the service account email with "Restricted" access

---

## **Recommended Actions (This Week)**

### **Immediate (Day 1-2)**
1. Fix GSC permissions
2. Investigate trafficheap.com referral
3. Pull full GSC keyword data

### **Short-Term (Week 1)**
1. Build FAQ page (`/faq/`) with 20+ questions
2. Build Reviews page (`/reviews/`) with 10+ testimonials
3. Add FAQ schema to existing tour pages

### **Medium-Term (Week 2-4)**
1. Create comparison page (`/vs/other-kl-food-tours/`)
2. Optimize vegetarian tour page for AI citations
3. Add vendor stories with specific names (Aunty Lim, Uncle Tan)

### **Ongoing (Monthly)**
1. Test AI citations: ChatGPT, Google AI, Perplexity
2. Track which keywords trigger recommendations
3. Update underperforming pages with more fact density

---

## **Files Updated**

1. `/revamp/docs/KEYWORD_STRATEGY_2026.md` — Full keyword strategy with actual GA4 data
2. `/revamp/docs/TJ_ROBERTSON_AI_SEARCH_OPTIMIZATION.md` — TJ Robertson research framework
3. This file — Analytics summary

---

**Next Review:** April 30, 2026 (pull fresh GA4 + GSC data)
