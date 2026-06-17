# Pre-Launch Sprint Plan — Combined Design + Content

**Created:** March 26, 2026  
**Goal:** Launch-ready by mid-to-late April 2026 (2-3 weeks)  
**Total Effort:** 120-160 hours (3-4 weeks full-time)

---

## Sprint Overview

| Sprint | Duration | Focus | Owner |
|--------|----------|-------|-------|
| **Sprint 1** | Week 1 (Mar 31 - Apr 4) | Critical Design + Content Writing | Dev + Content |
| **Sprint 2** | Week 2 (Apr 7 - 11) | High Priority Design + Translations | Dev + Content |
| **Sprint 3** | Week 3 (Apr 14 - 18) | Medium Priority + Testing | Dev + Legal |
| **Buffer Week** | Week 4 (Apr 21 - 25) | Polish + Launch Prep | All |

---

## Sprint 1: Critical Fixes (Week 1: Mar 31 - Apr 4)

### ✅ COMPLETED (Design)

#### Critical Design Issues — ALL FIXED
- [x] Blog post content width (max-w-prose)
- [x] Blog post font size (18-20px)
- [x] Blog post line height (1.85)
- [x] Tour itinerary visual hierarchy
- [x] Food culture cards mobile layout

**Effort:** 8 hours ✅
**Status:** COMPLETE

---

### 🚨 REMAINING: Critical Content Issues

#### 1. Write 7 Blog Posts (14-21 hours)
**Owner:** Pauline/Maarten
**Due:** End of Week 1

| Post | Status | Word Count | ETA |
|------|--------|------------|-----|
| `understanding-mamak-culture` | ❌ Stub only | 1,000-1,200 | 3 hours |
| `satay-master-kampung-baru` | ❌ Stub only | 800-1,000 | 2-3 hours |
| `char-kway-teow-history` | ❌ Stub only | 1,000-1,200 | 3 hours |
| `mamak-culture-complete-guide` | ❌ Stub only | 1,200-1,500 | 3-4 hours |
| `teh-tarik-pouring-technique` | ❌ Stub only | 800-1,000 | 2-3 hours |
| `why-we-dont-do-tourist-food` | ❌ Stub only | 1,000-1,200 | 3 hours |
| [7th post TBD] | ❌ Not started | 800-1,000 | 2-3 hours |

**Total:** 14-21 hours

**Action Required:**
- Pauline/Maarten to write posts in Directus
- Include: vendor names, specific dishes, cultural context
- Add hero images for all posts

---

#### 2. Upload Missing Images (4-8 hours)
**Owner:** Pauline/Maarten
**Due:** End of Week 1

| Image | Status | Location | ETA |
|-------|--------|----------|-----|
| Founder portrait | ❌ Placeholder | Homepage hero | 30 min |
| Blog hero: mamak culture | ❌ Missing | Blog post | 30 min |
| Blog hero: tourist food | ❌ Missing | Blog post | 30 min |
| Vendor photos (10-15) | ❌ Missing | Tour pages | 2-4 hours |
| Testimonial images | ⚠️ Some missing | Testimonials | 1-2 hours |

**Total:** 4-8 hours

**Action Required:**
- Upload to Directus media library
- Ensure all have alt text
- Use WebP format, max 800KB for heroes

---

#### 3. Translations — Handled by Another Agent ✅
**Owner:** Another agent (not Development)
**Due:** End of Week 1 (run) + End of Week 2 (verify)

**Status:** Translations are being handled separately. Development team to coordinate with agent running translations.

| Language | Run Status | Verify Status | Native Speaker |
|----------|------------|---------------|----------------|
| de (German) | ⏳ Another agent | ❌ Not verified | TBD |
| ms (Bahasa) | ⏳ Another agent | ❌ Not verified | TBD |
| zh (Chinese) | ⏳ Another agent | ❌ Not verified | TBD |
| es (Spanish) | ⏳ Another agent | ❌ Not verified | TBD |
| fr (French) | ⏳ Another agent | ❌ Not verified | TBD |
| nl (Dutch) | ⏳ Another agent | ❌ Not verified | TBD |
| ru (Russian) | ⏳ Another agent | ❌ Not verified | TBD |
| ja (Japanese) | ⏳ Another agent | ❌ Not verified | TBD |
| pt (Portuguese) | ⏳ Another agent | ❌ Not verified | TBD |

**Action Required:**
- Pauline/Maarten to coordinate with agent running translations
- Find native speakers for each language (Week 2)
- Send staging URL + specific pages to check
- Collect feedback, fix obvious errors in Directus

**Note:** If native speakers unavailable for some languages, launch with English fallback for those languages only.

---

#### 4. Directus Technical Review (NEW — 4-8 hours)
**Owner:** Development
**Due:** End of Week 1

**Goal:** Audit Directus schema and content for:
- Duplicate/redundant fields
- Content that can be reused across pages
- Fields that can be simplified or consolidated
- Missing relationships between collections
- Data that should be global vs. per-page

**Audit Areas:**

| Collection | Review Focus | ETA |
|------------|--------------|-----|
| `tours` | Duplicate fields, reusable content | 1-2 hours |
| `location-landing-pages` | Shared content blocks | 1 hour |
| `dietary-landing-pages` | Reusable dietary info | 1 hour |
| `specialty-landing-pages` | Content overlap with tours | 1 hour |
| `travel-type-landing-pages` | Shared audience info | 1 hour |
| `stories` | Author bios, categories | 30 min |
| `site_settings` | Global content consolidation | 1 hour |
| `vendors` | Reuse across multiple tours | 1 hour |
| `testimonials` | Tagging, filtering, reuse | 30 min |
| `faqs` | Shared vs. page-specific FAQs | 30 min |

**Total:** 4-8 hours

**Deliverables:**
- Directus audit report with recommendations
- List of fields to consolidate
- List of content that can be reused
- Schema simplification proposals
- Migration plan (if needed)

**Expected Outcomes:**
- Reduce content duplication
- Make content updates easier
- Improve content consistency
- Simplify future maintenance

---

### Sprint 1 Deliverables

**By End of Week 1 (Apr 4):**
- ✅ 5 critical design issues fixed
- ✅ 7 blog posts written (1,000+ words each)
- ✅ All hero images uploaded
- ✅ Vendor photos uploaded (10-15)
- ✅ All 9 translations run (by another agent)
- ✅ Directus technical review complete

**Gate to Sprint 2:** All blog posts written, all images uploaded, Directus audit complete.

---

## Sprint 2: High Priority (Week 2: Apr 7 - 11)

### Translation Verification (8-16 hours)

#### Verify All Translations with Native Speakers
**Owner:** Pauline/Maarten (coordinate native speakers)
**Due:** End of Week 2

- [ ] de (German) — verified by native speaker
- [ ] ms (Bahasa Malaysia) — verified by native speaker
- [ ] zh (Chinese) — verified by native speaker
- [ ] es (Spanish) — verified by native speaker
- [ ] fr (French) — verified by native speaker
- [ ] nl (Dutch) — verified by native speaker
- [ ] ru (Russian) — verified by native speaker
- [ ] ja (Japanese) — verified by native speaker
- [ ] pt (Portuguese) — verified by native speaker

**Total:** 8-16 hours (2 hours per language)

**Action Required:**
- Pauline/Maarten to find native speakers for each language
- Send them staging URL + specific pages to check
- Collect feedback, fix obvious errors in Directus

**Note:** If native speakers unavailable for some languages, launch with English fallback for those languages only.

### High Priority Design Issues (12-20 hours)

#### Tour Detail Pages (4-6 hours)
**Owner:** Development

- [ ] "What Makes This Tour Different" section — better visual separation
- [ ] Mobile: Itinerary cards less cramped
- [ ] Mobile: Gallery images full-width
- [ ] Desktop: Sidebar booking widget sticky

#### Location Pages (3-4 hours)
**Owner:** Development

- [ ] Heritage section typography (line-height, spacing)
- [ ] Dishes grid: standardized card heights
- [ ] "Why Food Tours Matter" section: better visual contrast
- [ ] Mobile: Hero text size reduced

#### Dietary/Segment Pages (2-3 hours)
**Owner:** Development

- [ ] Safe dishes grid: add images to dish cards
- [ ] Dishes to avoid: better warning styling
- [ ] Mobile: Increase section padding

#### Tours Index Page (2-3 hours)
**Owner:** Development

- [ ] Segment cards: better visual hierarchy
- [ ] Segment cards: better mobile stacking
- [ ] CTA visibility: make primary CTA more prominent

#### Global Components (2-4 hours)
**Owner:** Development

- [ ] Primary button: ensure 44px minimum on mobile
- [ ] Card heights: use flexbox for equal heights
- [ ] Form inputs: 44px minimum height
- [ ] Language dropdown: larger touch targets on mobile

---

### High Priority Content Issues (8-12 hours)

#### 1. Verify 8 Language Translations (8-16 hours)
**Owner:** Development + Native Speakers

| Language | Status | Reviewer | ETA |
|----------|--------|----------|-----|
| ms (Bahasa) | ❌ Not verified | TBD | 2 hours |
| zh (Chinese) | ❌ Not verified | TBD | 2 hours |
| es (Spanish) | ❌ Not verified | TBD | 2 hours |
| fr (French) | ❌ Not verified | TBD | 2 hours |
| nl (Dutch) | ❌ Not verified | TBD | 2 hours |
| ru (Russian) | ❌ Not verified | TBD | 2 hours |
| ja (Japanese) | ❌ Not verified | TBD | 2 hours |
| pt (Portuguese) | ❌ Not verified | TBD | 2 hours |

**Total:** 8-16 hours (2 hours per language)

**Action Required:**
- Run `npm run translate:smart` for each language
- Have native speaker review each translation
- Fix obvious errors in Directus

---

### Sprint 2 Deliverables

**By End of Week 2 (Apr 11):**
- ✅ All high priority design issues fixed
- ✅ All 9 translations run + verified (or English fallback noted)
- ✅ Mobile touch targets all 44px minimum
- ✅ Card heights consistent across site

**Gate to Sprint 3:** All high priority items complete + translations verified before accessibility testing.

---

## Sprint 3: Medium Priority + Testing (Week 3: Apr 14 - 18)

### Medium Priority Design (16-24 hours)

#### Accessibility Testing (8-16 hours)
**Owner:** Development + Accessibility Consultant

- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Keyboard-only navigation testing
- [ ] Color blindness simulation
- [ ] Zoom to 200% testing
- [ ] Touch target size verification (44px minimum)
- [ ] Fix all issues found

#### Performance Testing (4-8 hours)
**Owner:** Development

- [ ] Run Lighthouse audit (target: 90+/100)
- [ ] Run PageSpeed Insights (mobile + desktop)
- [ ] Test on 3G/4G connections
- [ ] Optimize images not lazy-loaded
- [ ] Defer third-party scripts

#### Mobile Optimization (4-6 hours)
**Owner:** Development

- [ ] Test at 375px (iPhone SE)
- [ ] Test at 414px (iPhone Max)
- [ ] Test at 768px (iPad)
- [ ] Fix mobile navigation animation
- [ ] Improve mobile menu link spacing

---

### Medium Priority Content (6-12 hours)

#### Legal Review (6-12 hours)
**Owner:** Legal Team

- [ ] Review Privacy Policy (covers GA4, Cloudflare, LiveChat, Resend)
- [ ] Review Terms & Conditions (bookings, cancellations, liability)
- [ ] Review Cookie Policy (lists all cookies)
- [ ] Update policies based on review

---

### Analytics Configuration (4-8 hours)
**Owner:** Development

- [ ] Configure conversion tracking (bookings, forms, WhatsApp)
- [ ] Verify Search Console property
- [ ] Submit sitemap
- [ ] Set up goal funnels in GA4

---

### Sprint 3 Deliverables

**By End of Week 3 (Apr 18):**
- ✅ WCAG 2.1 AA compliant (tested)
- ✅ Lighthouse score 90+/100
- ✅ All legal policies reviewed
- ✅ Analytics tracking configured
- ✅ Mobile tested at all breakpoints

---

## Buffer Week: Polish + Launch Prep (Week 4: Apr 21 - 25)

### Low Priority Design (6-10 hours)

- [ ] Backup file cleanup
- [ ] Image fallback handling
- [ ] Add `llms.txt` for AI crawlers
- [ ] Create Wikidata entry
- [ ] Add Bing Webmaster Tools
- [ ] Run final Lighthouse audit
- [ ] Add custom 500 page

### Launch Preparation (8-12 hours)

**Owner:** All

- [ ] Final QA pass (all pages, all devices)
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Form testing (contact, tour inquiry, newsletter)
- [ ] Booking flow testing (all tours)
- [ ] 404 page testing
- [ ] Redirect testing
- [ ] Email delivery testing (Resend)

### Launch Decision Meeting

**When:** End of Week 4 (Apr 25)  
**Attendees:** Pauline, Maarten, Development  
**Decision:** LAUNCH or DELAY

**Launch Criteria:**
- ✅ All critical issues: FIXED
- ✅ All high priority issues: FIXED
- ✅ All medium priority issues: FIXED or DEFERRED
- ✅ Blog posts: 7+ published
- ✅ Images: All uploaded
- ✅ Translations: All verified
- ✅ Accessibility: WCAG 2.1 AA compliant
- ✅ Performance: Lighthouse 90+/100
- ✅ Legal: All policies reviewed
- ✅ Analytics: Tracking configured

---

## Risk Mitigation

### Risk 1: Blog Content Delayed
**Mitigation:** If blog posts not ready by end of Week 1, delay launch by 1 week OR launch with noindex on all blog posts.

### Risk 2: Translation Running Issues (Week 1)
**Mitigation:** Run translations early in Week 1. If broken layouts from text expansion, fix immediately before content team writes blog posts.

### Risk 3: Native Speakers Unavailable (Week 2)
**Mitigation:** 
- **Option A:** Launch with English fallback for unavailable languages
- **Option B:** Use professional translation service for critical languages only (de, zh, ja)
- **Option C:** Add language switcher notice ("More languages coming soon")

### Risk 4: Translation Quality Issues
**Mitigation:** If native speakers find major errors, fix in Week 2. If minor errors, note for post-launch fix.

### Risk 5: Directus Schema Issues Found
**Mitigation:** If Directus audit finds major schema issues, implement critical fixes in Week 2, defer non-critical to post-launch.

### Risk 6: Accessibility Issues Found
**Mitigation:** Budget 2-3 days in Buffer Week for accessibility fixes. If critical issues found, delay launch.

### Risk 7: Legal Review Delayed
**Mitigation:** If legal review not complete, launch with basic privacy policy, add "Under Review" notice, schedule review within 2 weeks post-launch.

---

## Resource Requirements

### Development Team
- **Week 1:** 12-16 hours (critical design + Directus audit)
- **Week 2:** 20-32 hours (high priority design)
- **Week 3:** 24-40 hours (testing + fixes)
- **Week 4:** 12-20 hours (polish + launch)

**Total:** 68-108 hours (8.5-13.5 days)

### Content Team (Pauline/Maarten)
- **Week 1:** 22-37 hours (blog posts + images + coordinate translations)
- **Week 2:** 8-16 hours (translation review with native speakers)
- **Week 3:** 2-4 hours (content QA)
- **Week 4:** 4-8 hours (launch prep)

**Total:** 36-65 hours (4.5-8 days)

### Translations Agent
- **Week 1:** Run all 9 translations
- **Week 2:** Support native speaker verification

**Total:** Coordinated separately

### Native Speakers (Volunteers or Paid)
- **Week 2:** 2 hours per language × 9 languages = 18 hours total
- **Languages:** de, ms, zh, es, fr, nl, ru, ja, pt

**Total:** 18 hours (2 hours per language)

### Legal Team
- **Week 3:** 6-12 hours (policy review)

**Total:** 6-12 hours (1-1.5 days)

### Accessibility Consultant
- **Week 3:** 8-16 hours (testing + recommendations)

**Total:** 8-16 hours (1-2 days)

---

## Success Metrics

**Launch Week (Target: Apr 28 - May 2):**
- Organic sessions: 50-100/week
- Conversion rate: 3-5%
- Bounce rate: <40%
- Avg session duration: 2-4 minutes

**4 Weeks Post-Launch:**
- Organic sessions: 200-400/week
- Conversion rate: 5-6%
- Bounce rate: <35%
- Avg session duration: 3-5 minutes
- Keyword rankings: Top 10 for "Kuala Lumpur food tour", "Penang food tour"

**8 Weeks Post-Launch:**
- Organic sessions: 500-1,000/week
- Conversion rate: 5-6%
- Bounce rate: <30%
- Keyword rankings: Top 5 for primary keywords

---

## Next Steps

1. **Today (Mar 26):** Review this plan with Pauline/Maarten
2. **Mar 27-30:** Content team starts blog writing
3. **Mar 31:** Sprint 1 kickoff
4. **Apr 4:** Sprint 1 review (blog posts MUST be done)
5. **Apr 7:** Sprint 2 kickoff
6. **Apr 11:** Sprint 2 review
7. **Apr 14:** Sprint 3 kickoff
8. **Apr 18:** Sprint 3 review
9. **Apr 21-25:** Buffer week + launch prep
10. **Apr 25:** Launch decision meeting
11. **Apr 28:** LAUNCH (if approved)

---

*Sprint Plan v1.0 — Simply Enak*  
*Created: March 26, 2026*  
*Based on: COMPREHENSIVE_DESIGN_AUDIT.md, PRE_LAUNCH_BLOCKERS_REALISTIC.md, project-status.md*
