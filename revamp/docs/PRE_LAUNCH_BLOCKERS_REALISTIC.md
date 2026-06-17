# Pre-Launch Blockers — Realistic Status

**Audit Date:** March 26, 2026  
**Honest Assessment:** NOT READY FOR PRODUCTION

---

## 🚨 CRITICAL BLOCKERS (Must Fix Before Launch)

### 1. Content Issues

#### Blog Posts — 7 Stubs with No Content
- [ ] `understanding-mamak-culture` — TL;DR only, no actual post
- [ ] `satay-master-kampung-baru` — TL;DR only, no actual post
- [ ] `char-kway-teow-history` — TL;DR only, no actual post
- [ ] `mamak-culture-complete-guide` — TL;DR only, no actual post
- [ ] `teh-tarik-pouring-technique` — TL;DR only, no actual post
- [ ] `understanding-mamak-culture` — Hero image missing (uses fallback)
- [ ] `why-we-dont-do-tourist-food` — Hero image missing (uses fallback)

**Impact:** Thin content penalty from Google, poor user experience  
**Effort:** 2-3 hours per post = 14-21 hours total  
**Owner:** Content team (Pauline/Maarten)

#### Missing Images
- [ ] Founder portrait in homepage hero — uses `placehold.co` fallback
- [ ] 2 blog post hero images missing
- [ ] Vendor photos not uploaded to Directus
- [ ] Some testimonial images may be null (TestimonialsSection breaks)

**Impact:** Unprofessional appearance, broken layouts  
**Effort:** 2-4 hours  
**Owner:** Content team

---

### 2. Translation Issues

#### German (de) Translations Incomplete
- [ ] Homepage German translation needs re-run (`npm run translate:smart`)
- [ ] Tour pages German translation not verified
- [ ] Location pages German translation not verified

**Impact:** German visitors see broken/partial translations  
**Effort:** 1-2 hours (once Qwen quota resets)  
**Owner:** Development team

#### Other Languages Not Verified
- [ ] Bahasa Malaysia (ms) — not verified
- [ ] Chinese (zh) — not verified
- [ ] Spanish (es) — not verified
- [ ] French (fr) — not verified
- [ ] Dutch (nl) — not verified
- [ ] Russian (ru) — not verified
- [ ] Japanese (ja) — not verified
- [ ] Portuguese (pt) — not verified

**Impact:** Non-English visitors may see broken translations  
**Effort:** 8-16 hours (2 hours per language)  
**Owner:** Development team + native speakers for review

---

### 3. Security Issues

#### Comment System — UI Skeleton Only
- [ ] `src/components/Comments.astro` has no backend
- [ ] No database schema for comments
- [ ] No moderation system
- [ ] No spam protection for comments

**Decision Needed:** Remove entirely OR implement properly  
**Impact:** Broken functionality if users try to comment  
**Effort:** Remove: 30 min | Implement: 8-16 hours  
**Owner:** Development team

#### Form Security — Not Fully Tested
- [ ] Rate limiting on contact form not tested under load
- [ ] Honeypot effectiveness not verified
- [ ] No CAPTCHA fallback for determined spammers

**Impact:** Potential spam flood, email deliverability issues  
**Effort:** 2-4 hours testing + fixes  
**Owner:** Development team

#### CSP Headers — May Be Too Permissive
- [ ] `via.placeholder.com` removed but need to verify no other unnecessary origins
- [ ] Third-party scripts (GA4, Cloudflare, LiveChat) need careful review

**Impact:** XSS vulnerability if too permissive  
**Effort:** 2-4 hours audit  
**Owner:** Development team

---

### 4. Accessibility (WCAG 2.1 AA) — Not Fully Compliant

#### Known Issues from Project Status
- [ ] Some decorative images missing `alt=""`
- [ ] Focus order could be improved on mobile
- [ ] Some link text not descriptive enough ("Read more" → "Read more about [topic]")

**Impact:** Lawsuit risk, excludes users with disabilities  
**Effort:** 4-8 hours  
**Owner:** Development team

#### Not Yet Tested
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Keyboard-only navigation testing
- [ ] Color blindness simulation
- [ ] Zoom to 200% testing
- [ ] Touch target size verification (44px minimum)

**Impact:** Unknown — could be critical issues  
**Effort:** 8-16 hours comprehensive testing  
**Owner:** Development team + accessibility consultant

---

### 5. Content Quality Issues

#### Tour Descriptions — Some Still Generic
From brand voice audit:
- [ ] Some tour descriptions still use generic language
- [ ] Not all vendor stories include specific names/years
- [ ] Some cultural context missing

**Impact:** Brand voice inconsistency, lower conversion  
**Effort:** 4-8 hours rewrite  
**Owner:** Content team

#### Location Pages — Content Depth Varies
- [ ] Some location pages may have <1,000 words
- [ ] Not all have full food culture sections
- [ ] Some missing neighborhood guides

**Impact:** Lower SEO rankings  
**Effort:** 8-16 hours  
**Owner:** Content team

---

### 6. Technical Debt

#### Backup Files Not Cleaned
- [ ] `src/components/Home-backup-*/` — delete
- [ ] `src/components-backup-*/` — delete
- [ ] `src/layouts-backup-*/` — delete
- [ ] `src/styles/global-backup-*.css` — delete
- [ ] `_*.astro.disabled` files — delete

**Impact:** Codebase clutter, potential confusion  
**Effort:** 30 minutes  
**Owner:** Development team

#### Image Fallback Handling
- [ ] `TestimonialsSection.astro` breaks if `testimonial.image` is null
- [ ] Need defensive coding for missing images

**Impact:** Broken layouts if Directus missing images  
**Effort:** 1-2 hours  
**Owner:** Development team

---

### 7. Analytics & Tracking — Not Configured

#### Conversion Tracking
- [ ] Tour booking conversion not tracked
- [ ] Contact form conversion not tracked
- [ ] WhatsApp CTA clicks not tracked
- [ ] Newsletter signup conversion not tracked

**Impact:** Cannot measure success, optimize conversions  
**Effort:** 4-8 hours  
**Owner:** Development team

#### Search Console
- [ ] Property not verified for new site
- [ ] Sitemap not submitted
- [ ] No baseline keyword rankings

**Impact:** Cannot track SEO progress  
**Effort:** 1-2 hours  
**Owner:** Development team

---

## 🟡 HIGH PRIORITY (Should Fix Before Launch)

### 1. SEO Issues

#### Missing Meta Descriptions
- [ ] Not all pages have unique meta descriptions
- [ ] Some may be auto-generated from content

**Impact:** Lower CTR from search results  
**Effort:** 2-4 hours  
**Owner:** Content team

#### Internal Linking Strategy
- [ ] Not all pages have 3-5 internal links
- [ ] Some orphan pages may exist

**Impact:** Lower SEO rankings, poor user navigation  
**Effort:** 4-8 hours  
**Owner:** Content team

---

### 2. Performance — Not Benchmarked

#### Core Web Vitals
- [ ] No Lighthouse scores yet
- [ ] No PageSpeed Insights testing
- [ ] No mobile performance testing on 3G/4G

**Impact:** Unknown — could be critical performance issues  
**Effort:** 4-8 hours testing + optimization  
**Owner:** Development team

#### Image Optimization
- [ ] Not all images confirmed as WebP
- [ ] Some images may not be lazy-loaded
- [ ] Image compression not verified

**Impact:** Slow page loads, high bounce rate  
**Effort:** 2-4 hours  
**Owner:** Development team

---

### 3. Legal & Compliance

#### Privacy Policy
- [ ] Not verified if up-to-date with current data practices
- [ ] May not cover all third-party services (GA4, Cloudflare, LiveChat, Resend)

**Impact:** GDPR violation risk  
**Effort:** 2-4 hours legal review  
**Owner:** Legal team

#### Terms & Conditions
- [ ] Not verified if comprehensive
- [ ] May not cover tour bookings, cancellations, liability

**Impact:** Legal liability  
**Effort:** 4-8 hours legal review  
**Owner:** Legal team

#### Cookie Policy
- [ ] Banner implemented but policy page may be incomplete
- [ ] May not list all cookies used

**Impact:** GDPR violation risk  
**Effort:** 2-4 hours  
**Owner:** Legal team

---

## 🟢 MEDIUM PRIORITY (Can Fix Post-Launch)

1. Add `llms.txt` for AI crawlers
2. Create Wikidata entry for Simply Enak
3. Populate itinerary `cultural_context` in Directus
4. Add Bing Webmaster Tools verification
5. Add searchAction schema
6. Add press mentions to Organization schema
7. Improve mobile focus order
8. Make link text more descriptive
9. Run full Lighthouse audit
10. Add custom 500 page

---

## 📊 REALISTIC PRE-LAUNCH STATUS

| Category | Status | Ready? |
|----------|--------|--------|
| **Content** | 🔴 Critical Issues | ❌ NO |
| **Translations** | 🔴 Critical Issues | ❌ NO |
| **Security** | 🟡 High Priority | ⚠️ PARTIAL |
| **Accessibility** | 🟡 High Priority | ⚠️ PARTIAL |
| **SEO** | 🟡 High Priority | ⚠️ PARTIAL |
| **Performance** | 🟡 Not Tested | ⚠️ UNKNOWN |
| **Legal** | 🟡 High Priority | ⚠️ PARTIAL |
| **Analytics** | 🔴 Not Configured | ❌ NO |
| **Brand Voice** | 🟢 Good | ✅ YES |
| **Design System** | 🟢 Good | ✅ YES |
| **Core Functionality** | 🟢 Good | ✅ YES |

**Overall Status:** 🔴 **NOT READY FOR PRODUCTION**

**Estimated Effort to Launch Ready:** 80-120 hours (2-3 weeks full-time)

**Critical Path:**
1. Content team: Write 7 blog posts (14-21 hours)
2. Content team: Upload all images (4-8 hours)
3. Development: Fix accessibility issues (4-8 hours)
4. Development: Complete translations (8-16 hours)
5. Development: Configure analytics (4-8 hours)
6. Legal: Review policies (6-12 hours)
7. Development: Security audit (4-8 hours)
8. Development: Performance optimization (4-8 hours)

---

## RECOMMENDATION

**DO NOT LAUNCH YET.**

Launch with current state risks:
- Google penalty for thin content
- Poor user experience (missing images, broken translations)
- Accessibility lawsuit risk
- GDPR violation risk
- Inability to measure success (no analytics)
- Spam flood (untested form security)

**Recommended Launch Date:** 2-3 weeks from now (mid-to-late April 2026)

**Interim Solution:** Keep staging password-protected, continue development, launch when blockers resolved.

---

*Honest Pre-Launch Assessment v1.0 — Simply Enak*  
*Created: March 26, 2026*  
*Based on: project-status.md, content audit, security review*
