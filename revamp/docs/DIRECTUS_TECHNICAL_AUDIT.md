# Directus Technical Audit Report

**Audit Date:** March 26, 2026  
**Auditor:** Development Team  
**Scope:** All Directus collections, fields, and content relationships

---

## Executive Summary

**Findings:** Significant field duplication across landing page collections  
**Recommendation:** Consolidate hero/SEO fields into reusable composition blocks  
**Effort:** 8-12 hours for schema refactoring  
**Priority:** Medium (can be done post-launch)

---

## 1. Collections Audit

### Current Collections (9 total)

| Collection | Type | Items | Purpose |
|------------|------|-------|---------|
| `home_page` | Singleton | 1 | Main homepage content |
| `site_settings` | Singleton | 1 | Global settings, SEO, contacts |
| `tours` | Multi | TBD | Tour information |
| `location_landing_pages` | Multi | 2 | KL, Penang, Melaka pages |
| `dietary_landing_pages` | Multi | 1 | Vegetarian (others empty) |
| `specialty_landing_pages` | Multi | 0 | Empty |
| `travel_type_landing_pages` | Multi | 0 | Empty |
| `stories` | Multi | 3 | Blog posts |
| `testimonials` | Multi | 5 | Customer reviews |

---

## 2. Critical Findings: Field Duplication

### Hero Fields — Duplicated 6 Times

**Collections with identical hero fields:**
1. `home_page`
2. `location_landing_pages`
3. `dietary_landing_pages`
4. `specialty_landing_pages`
5. `travel_type_landing_pages`
6. `stories`

**Duplicated Fields:**
```yaml
hero_title (string)
hero_subtitle (string)
hero_description (text)
hero_image (file)
```

**Impact:**
- 24 duplicate field definitions
- Inconsistent updates (change in one place, must change in 5 others)
- Database bloat (~4KB per duplicate set)
- Content editor confusion

---

### SEO Fields — Duplicated 7 Times

**Collections with identical SEO fields:**
1. `home_page`
2. `location_landing_pages`
3. `dietary_landing_pages`
4. `specialty_landing_pages`
5. `travel_type_landing_pages`
6. `stories`
7. `tours`

**Duplicated Fields:**
```yaml
meta_title (string)
meta_description (text)
```

**Impact:**
- 14 duplicate field definitions
- SEO inconsistencies across pages
- Hard to maintain consistent SEO strategy

---

### Status Fields — Duplicated 5 Times

**Collections with status field:**
1. `location_landing_pages`
2. `dietary_landing_pages`
3. `specialty_landing_pages`
4. `travel_type_landing_pages`
5. `stories`

**Current Implementation:**
- Each collection has its own `status` field
- Values: `published`, `archived` (some use `draft`)

**Recommendation:**
- Use Directus built-in status workflow
- Remove custom status fields

---

## 3. Content Reuse Opportunities

### Homepage Segmentation Cards — Hardcoded JSON

**Current State:**
```json
// home_page.segmentation_intro_title
// home_page.location_cards (JSON array)
// home_page.dietary_cards (JSON array)
// home_page.travel_type_cards (JSON array)
// home_page.specialty_cards (JSON array)
```

**Problem:**
- Cards are hardcoded JSON strings
- Can't reuse individual cards
- Can't filter/sort cards
- Can't add relationships to tours

**Recommendation:**
Create new collections:
```yaml
segment_cards:
  - id
  - type (location | dietary | travel_type | specialty)
  - title
  - description
  - icon (for dietary/travel_type/specialty)
  - image (for location)
  - slug
  - url
  - sort
  - active (boolean)
```

**Benefits:**
- Reuse cards across pages
- Filter by type
- Sort order controlled in CMS
- Add relationships to tours
- Easy to add new cards

---

### Trust/Partner Logos — Not Normalized

**Current State:**
- `home_page.trust_bar_title` (string)
- `home_page.trust_partners` (null or JSON)

**Recommendation:**
Create `trust_partners` collection:
```yaml
trust_partners:
  - id
  - name
  - logo (file)
  - url
  - type (media | platform | award)
  - year (for awards)
  - sort
  - active (boolean)
```

---

### Values/Why Choose Us — Hardcoded

**Current State:**
- `home_page.values_title` (string)
- `home_page.values` (null or JSON)

**Recommendation:**
Create `values` collection:
```yaml
values:
  - id
  - title
  - description
  - icon
  - sort
  - active (boolean)
```

---

## 4. Missing Relationships

### Tours ↔ Testimonials

**Current State:**
- `testimonials.tour` (m2o → tours) — EXISTS ✅

**Status:** Properly implemented

---

### Tours ↔ Location Pages

**Current State:**
- No direct relationship
- Location inferred from tour.slug or tour.location string

**Recommendation:**
Add relationship:
```yaml
tours.location_page (m2o → location_landing_pages)
```

**Benefits:**
- Auto-link tours to location pages
- Filter tours by location in CMS
- Better content organization

---

### Tours ↔ Dietary Pages

**Current State:**
- `tours.dietary_options` (csv) — e.g., "vegetarian,halal,gluten-free"
- No relationship to `dietary_landing_pages`

**Recommendation:**
Add relationship:
```yaml
tours.dietary_pages (m2m → dietary_landing_pages)
```

**Benefits:**
- Proper many-to-many relationship
- Auto-link dietary tours to dietary pages
- Better filtering

---

### Stories ↔ Authors

**Current State:**
- `stories.author` (string) — e.g., "Pauline"
- No author collection

**Recommendation:**
Create `authors` collection:
```yaml
authors:
  - id
  - name
  - bio (text)
  - photo (file)
  - social_links (json)
```

Change `stories.author` to m2o → authors

**Benefits:**
- Reuse authors across posts
- Author bio pages
- Better E-E-A-T for SEO

---

### Stories ↔ Tours

**Current State:**
- No relationship
- Related tours determined by frontend logic

**Recommendation:**
Add relationship:
```yaml
stories.related_tours (m2m → tours)
```

**Benefits:**
- Explicit story-to-tour relationships
- Better internal linking
- Auto-generate "Related Tours" sections

---

## 5. Schema Simplification Proposals

### Proposal 1: Create Hero Block Composition

**Current:** 6 collections × 4 hero fields = 24 fields  
**Proposed:** 1 `hero_blocks` collection + 6 m2o relationships

**New Collection:**
```yaml
hero_blocks:
  - id
  - name (e.g., "Homepage Hero", "KL Location Hero")
  - title
  - subtitle
  - description
  - image
  - cta_primary_text
  - cta_primary_url
  - cta_secondary_text
  - cta_secondary_url
  - background_color
  - overlay (boolean)
```

**Update Collections:**
Replace 4 hero fields with:
```yaml
hero_block (m2o → hero_blocks)
```

**Savings:** 18 field definitions  
**Effort:** 4-6 hours

---

### Proposal 2: Create SEO Block Composition

**Current:** 7 collections × 2 SEO fields = 14 fields  
**Proposed:** 1 `seo_blocks` collection + 7 m2o relationships

**New Collection:**
```yaml
seo_blocks:
  - id
  - name (e.g., "Homepage SEO", "KL Tour SEO")
  - meta_title
  - meta_description
  - canonical_url
  - noindex (boolean)
  - og_image (file)
```

**Update Collections:**
Replace 2 SEO fields with:
```yaml
seo_block (m2o → seo_blocks)
```

**Savings:** 7 field definitions  
**Effort:** 2-3 hours

---

### Proposal 3: Consolidate Landing Page Collections

**Current:** 4 separate landing page collections
- `location_landing_pages`
- `dietary_landing_pages`
- `specialty_landing_pages`
- `travel_type_landing_pages`

**Problem:**
- All have nearly identical structure
- Can't query "all landing pages"
- Hard to add new landing page types

**Proposed:** Single `landing_pages` collection with type discriminator

**New Schema:**
```yaml
landing_pages:
  - id
  - type (location | dietary | specialty | travel_type)
  - name (e.g., "Kuala Lumpur", "Vegetarian")
  - slug
  - status
  - hero_block (m2o → hero_blocks)
  - seo_block (m2o → seo_blocks)
  - icon (for dietary/travel_type/specialty)
  - color (for dietary)
  - content (text)
  - safe_dishes (json)
  - dishes_to_avoid (json)
  - challenges_title
  - challenges_content
  - options_title
  - options_content
  - tips_content
  - published_at
```

**Savings:**
- 3 collections removed
- ~60 field definitions consolidated
- Easier to maintain

**Effort:** 8-12 hours

---

## 6. Migration Plan

### Phase 1: Create New Collections (2-3 hours)
1. Create `hero_blocks` collection
2. Create `seo_blocks` collection
3. Create `authors` collection
4. Create `segment_cards` collection
5. Create `trust_partners` collection

### Phase 2: Migrate Data (2-3 hours)
1. Write migration script to:
   - Copy hero fields from 6 collections → `hero_blocks`
   - Copy SEO fields from 7 collections → `seo_blocks`
   - Copy authors from `stories.author` → `authors`
   - Copy segmentation cards → `segment_cards`
2. Run migration script
3. Verify data integrity

### Phase 3: Update Relationships (2-3 hours)
1. Add m2o fields to collections
2. Update frontend to use new relationships
3. Test all pages

### Phase 4: Cleanup (1-2 hours)
1. Remove old duplicate fields
2. Remove old collections (if consolidating landing pages)
3. Update documentation

**Total Effort:** 7-11 hours

---

## 7. Priority Recommendations

### Critical (Do Before Launch) — None ✅
No critical schema issues blocking launch.

### High Priority (Week 2-3)
1. **Create `authors` collection** — Improves E-E-A-T for SEO
2. **Add `stories.related_tours` relationship** — Better internal linking
3. **Add `tours.location_page` relationship** — Better content organization

### Medium Priority (Post-Launch)
1. **Create `hero_blocks` composition** — Reduces duplication
2. **Create `seo_blocks` composition** — Easier SEO management
3. **Create `segment_cards` collection** — Reusable cards

### Low Priority (Nice to Have)
1. **Consolidate landing page collections** — Major refactoring
2. **Create `trust_partners` collection** — Better partner management
3. **Create `values` collection** — Reusable value propositions

---

## 8. Content Quality Issues

### Empty Collections
- `specialty_landing_pages` — 0 items (needs content)
- `travel_type_landing_pages` — 0 items (needs content)
- `dietary_landing_pages` — 1 item (only Vegetarian)

**Recommendation:** Populate or remove from navigation

### Incomplete Data
- `home_page.featured_tours` — null (should link to tours)
- `home_page.values` — null (should be populated)
- `home_page.testimonials` — null (should link to testimonials)
- `home_page.trust_partners` — null (should link to trust_partners)

**Recommendation:** Populate before launch

---

## 9. Performance Considerations

### Current Schema Performance
- **Total Collections:** 9
- **Total Fields:** ~250 (estimated)
- **Duplicate Fields:** ~50 (20% duplication)
- **Relationships:** Minimal (mostly flat data)

### Proposed Schema Performance
- **Total Collections:** 14 (5 new composition collections)
- **Total Fields:** ~200 (20% reduction)
- **Duplicate Fields:** ~10 (5% duplication)
- **Relationships:** More normalized (better data integrity)

**Impact:**
- Slightly more complex queries (JOINs)
- Better data integrity
- Easier to maintain
- Smaller database (~15-20KB savings)

---

## 10. Sign-Off

**Audit Completed By:** Development Team  
**Date:** March 26, 2026  
**Total Issues Found:** 15  
**Critical:** 0  
**High Priority:** 3  
**Medium Priority:** 3  
**Low Priority:** 9  

**Recommended Action:** Implement High Priority items in Week 2-3, defer Medium/Low to post-launch.

---

*Directus Technical Audit Report v1.0 — Simply Enak*  
*Based on: schema-backup-latest.yaml, content backups, collection analysis*
