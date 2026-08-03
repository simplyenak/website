# SEO Audit Update — August 3, 2026

## Simply Enak

### Current State
- **FAQ duplicates**: STILL PRESENT — 7 identical "Can children join this tour?" questions in FAQPage schema
- **Meta description**: Not yet updated (cache may be stale)
- **CTR**: 0.93% (3 days) — still low
- **Schema**: 1 combined block with:
  - LocalBusiness + TravelAgency
  - Organization
  - Person (founders)
  - WebSite + SearchAction
  - ItemList (reviews)
  - FAQPage (with duplicates)
  - AggregateRating

### Issues Needing Fix

1. **FAQ duplicates** — Need Payload CMS intervention:
   - Find 7x "Can children join this tour?" entries
   - Keep 1 with `page_visibility: all`
   - Delete 6 duplicates
   - Re-sync site

2. **Meta optimization** — Add price/rating for CTR:
   - Current: "Small-group food tours in KL, Penang and Ipoh with guides who grew up here..."
   - Proposed: "Small-group food tours from RM285 | 5.0★ (76 reviews). Eat at family-run stalls with local guides."

3. **Tour pages** — Missing schema on individual tour pages

## CTE

### Current State
- Content quality: 95/100
- Schema: Organization only
- Languages: English
- No GSC integration

### Recommendations
1. Add B2B schema (ProfessionalService, Offer)
2. Add GSC tracking
3. Consider Malay for local B2B
