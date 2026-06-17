# Simply Enak — Pre-Launch QA Checklist

**Project:** Landing Page & Blog Optimization  
**Staging URL:** https://staging.simplyenak.com  
**Production URL:** https://simplyenak.com  
**Date Created:** March 24, 2026

---

## How to Use This Checklist

- **Green tick (✅)** = Pass
- **Red X (❌)** = Fail (needs fix)
- **N/A** = Not applicable to this page type
- **Notes** = Add observations, screenshots, or links to issues

**Before you start:**
1. Open this checklist in your browser or print it
2. Test on **desktop (1920px, 1440px, 1024px)** and **mobile (375px, 414px)**
3. Use Chrome DevTools for Lighthouse, accessibility audits
4. Test on **Chrome, Safari, Firefox** at minimum

---

## 1. SEO (Search Engine Optimization) — 25 Points

### Technical SEO
- [ ] **Page loads in <3 seconds** (Lighthouse Performance >90)
- [ ] **No 404 errors** on internal links (check with Screaming Frog or similar)
- [ ] **Canonical URLs** set correctly on all pages
- [ ] **XML sitemap** includes all new pages (`/sitemap-index.xml`)
- [ ] **Robots.txt** allows crawling of all public pages
- [ ] **No index/noindex conflicts** (check meta robots tags)
- [ ] **HTTPS enforced** on all pages
- [ ] **Mobile-responsive** (Google Mobile-Friendly Test passes)

### On-Page SEO
- [ ] **Unique title tags** (50-60 characters, includes primary keyword)
- [ ] **Unique meta descriptions** (150-160 characters, includes keyword + CTA)
- [ ] **H1 tags** present and unique per page (includes primary keyword)
- [ ] **H2-H6 hierarchy** is logical (no skipped levels)
- [ ] **Image alt text** on all images (descriptive, includes keywords naturally)
- [ ] **Internal linking** — 3-5 links per page to related content
- [ ] **URL structure** is clean (`/tours/kuala-lumpur-food-tour/` not `/tours/?id=123`)
- [ ] **Breadcrumb navigation** present on all pages
- [ ] **Schema markup** validates (TouristTrip, FAQPage, BreadcrumbList, ItemList)

### Local SEO
- [ ] **NAP consistency** (Name, Address, Phone) in footer
- [ ] **Google Business Profile** link present
- [ ] **LocalBusiness schema** on homepage and contact page
- [ ] **Location pages** have unique local content (not duplicate)

### Keyword Optimization
- [ ] **Primary keyword** in H1, first 100 words, 2-3 H2s
- [ ] **Secondary keywords** in H2/H3s naturally
- [ ] **No keyword stuffing** (reads naturally)
- [ ] **LSI keywords** present (related terms, synonyms)

**SEO Score Target:** 90+/100 (Lighthouse)  
**Issues Found:** _________________________________________________

---

## 2. GEO (Generative Engine Optimization) — 15 Points

### E-E-A-T Signals
- [ ] **Author attribution** on all blog posts (Pauline, Maarten, or team)
- [ ] **About page** clearly states who runs Simply Enak
- [ ] **Experience highlighted** (15+ years, est. 2011)
- [ ] **Expertise demonstrated** (cultural knowledge, vendor relationships)
- [ ] **Trust signals** visible (TripAdvisor, media logos, guest count)
- [ ] **Contact information** easy to find

### AI Citation Readiness
- [ ] **FAQ schema** implemented on all relevant pages
- [ ] **Question-format headings** (What/How/Why/Is) for AI extraction
- [ ] **Clear, concise answers** (2-3 sentences) for AI snippets
- [ ] **Structured data** validates without errors
- [ ] **Entity relationships** clear (Simply Enak → Tours → Vendors → Locations)
- [ ] **`sameAs` links** to social profiles, media features

### Content Structure for AI
- [ ] **Answer-first paragraphs** (key info in first 1-2 sentences)
- [ ] **Bullet points and lists** for easy extraction
- [ ] **Clear definitions** of cultural terms (laksa, char kway teow, etc.)
- [ ] **Statistics and numbers** (15+ years, 5,000+ guests, 4.9 rating)
- [ ] **Named entities** (Aunty Lim, Master Chen, specific vendors)

**GEO Score Target:** 85+/100  
**Issues Found:** _________________________________________________

---

## 3. Security — 15 Points

### Data Protection
- [ ] **No secrets in code** (API keys, tokens in environment variables only)
- [ ] **Forms use honeypot** fields (no visible captcha needed)
- [ ] **Email addresses** obfuscated or behind forms (not plain text)
- [ ] **HTTPS enforced** on all pages
- [ ] **Security headers** present (CSP, X-Frame-Options, X-Content-Type-Options)

### Access Control
- [ ] **Staging site password-protected** (Cloudflare Access or similar)
- [ ] **Admin/CMS not exposed** publicly
- [ ] **Rate limiting** on forms (prevent spam)

### Input Validation
- [ ] **Form inputs validated** client-side and server-side
- [ ] **SQL injection prevention** (using parameterized queries)
- [ ] **XSS prevention** (sanitizing user inputs)

### Dependencies
- [ ] **No outdated packages** with known vulnerabilities (`npm audit`)
- [ ] **Third-party scripts** minimized (only essential scripts loaded)
- [ ] **CSP whitelist** minimal (no unnecessary origins)

**Security Score Target:** 100% compliance  
**Issues Found:** _________________________________________________

---

## 4. Blog Writing Quality — 20 Points

### Brand Voice Compliance
- [ ] **No forbidden words** (authentic, premium, luxury, discover, explore, immerse, customer, delicious, traditional without story, unique, best, #1, must-see)
- [ ] **Three-Feeling Test** passes (WELCOMED + FASCINATED + CONNECTED)
- [ ] **Specific names** used (Aunty Lim, Master Chen, not "local vendor")
- [ ] **Sensory details** present (taste, smell, sound descriptions)
- [ ] **Active invitation** tone (contractions, one `!` max per paragraph)
- [ ] **Show don't tell** (specific details > generic claims)

### Content Quality
- [ ] **Word count** appropriate (1,500-2,500 for pillar posts, 800-1,200 for regular)
- [ ] **Headings present** (H2/H3 every 200-300 words)
- [ ] **Paragraph length** readable (2-4 sentences max)
- [ ] **Sentence length** varied (mix of short and medium sentences)
- [ ] **Internal links** to tours, other blog posts, about page
- [ ] **External links** to authoritative sources (if needed)
- [ ] **Images optimized** (WebP format, alt text, compressed)
- [ ] **Call-to-action** at end (relevant to post content)

### SEO for Blog
- [ ] **Meta description** written for each post
- [ ] **Featured image** set (1200x630px for social sharing)
- [ ] **Categories/tags** assigned correctly
- [ ] **Author attribution** present
- [ ] **Published date** visible
- [ ] **Read time** displayed

**Blog Writing Score Target:** 90+/100  
**Issues Found:** _________________________________________________

---

## 5. UI (User Interface) — 20 Points

### Visual Hierarchy
- [ ] **Headings clear** and distinct (H1 > H2 > H3 visually)
- [ ] **CTAs stand out** (primary color, adequate size)
- [ ] **Whitespace adequate** (content not cramped)
- [ ] **Typography consistent** (Merriweather for headings, PT Sans for body)
- [ ] **Color contrast** meets WCAG AA (4.5:1 for text, 3:1 for large text)

### Components
- [ ] **Buttons consistent** (same style for same action types)
- [ ] **Cards aligned** properly (grid layouts don't break)
- [ ] **Icons clear** and recognizable
- [ ] **Images consistent** quality and style
- [ ] **Badges readable** (text size, color contrast)

### Responsive Design
- [ ] **Mobile (375px)** — all content readable, no horizontal scroll
- [ ] **Tablet (768px)** — layouts adapt appropriately
- [ ] **Desktop (1920px)** — content doesn't stretch too wide
- [ ] **Breakpoints tested** (375px, 768px, 1024px, 1440px, 1920px)

### Brand Compliance
- [ ] **Brand colors** used correctly (primary #b52d38, secondary #885e40, accent #ffa333)
- [ ] **Logo present** and links to homepage
- [ ] **Footer consistent** across all pages
- [ ] **Navigation consistent** across all pages

**UI Score Target:** 95+/100  
**Issues Found:** _________________________________________________

---

## 6. UX (User Experience) — 20 Points

### Navigation
- [ ] **Menu easy to find** (top right, standard position)
- [ ] **Breadcrumbs work** (clickable, accurate hierarchy)
- [ ] **Internal links work** (no 404s)
- [ ] **Search function** works (if applicable)
- [ ] **404 page helpful** (suggests next steps)

### Conversion Paths
- [ ] **CTAs clear** (user knows what happens when clicked)
- [ ] **No dead ends** (every page has next step)
- [ ] **Forms have feedback** (success/error messages)
- [ ] **WhatsApp button works** (pre-filled message correct)
- [ ] **Booking flow smooth** (no unnecessary steps)

### Performance
- [ ] **Page loads <3 seconds** on 4G
- [ ] **Images lazy-loaded** (below fold)
- [ ] **No layout shift** (CLS <0.1)
- [ ] **Interactions responsive** (FID <100ms)

### Mobile UX
- [ ] **Touch targets 44px minimum** (buttons, links)
- [ ] **Sticky mobile CTA** present on tour pages
- [ ] **No horizontal scroll** on any page
- [ ] **Forms easy to complete** on mobile
- [ ] **Text readable** without zooming (16px minimum)

### User Flow
- [ ] **Homepage → Tour page → Booking** (smooth flow)
- [ ] **Blog post → Tour page** (relevant internal links)
- [ ] **Location page → Tour page** (clear CTAs)
- [ ] **Exit intent** captured (if applicable)

**UX Score Target:** 90+/100  
**Issues Found:** _________________________________________________

---

## 7. Branding — 15 Points

### Brand Voice
- [ ] **Tone consistent** (warm, knowledgeable, friend-to-friend)
- [ ] **No tourism brochure language** (reads like human conversation)
- [ ] **Specific details** over generic claims
- [ ] **Stories over features** (vendor names, years, relationships)

### Visual Brand
- [ ] **Logo usage correct** (clear space, minimum size)
- [ ] **Colors consistent** (no off-brand colors)
- [ ] **Typography consistent** (no random fonts)
- [ ] **Image style consistent** (real photos, no generic stock)

### Brand Promise
- [ ] **15+ years experience** mentioned appropriately
- [ ] **Small groups (max 8-9)** highlighted
- [ ] **Vendor relationships** emphasized (not transactions)
- [ ] **Cultural expertise** demonstrated (not claimed)

### Differentiation
- [ ] **"What Makes This Tour Different"** section present on tour pages
- [ ] **Comparison tables** clear (Most Tourists vs. With Simply Enak)
- [ ] **Unique value proposition** clear on all pages

**Branding Score Target:** 95+/100  
**Issues Found:** _________________________________________________

---

## 8. Content Writing — 20 Points

### Clarity
- [ ] **No jargon** without explanation
- [ ] **Short sentences** (avg. 15-20 words)
- [ ] **Active voice** (not passive)
- [ ] **Concrete over abstract** (specific examples)

### Engagement
- [ ] **Hooks in first sentence** (grabs attention)
- [ ] **Questions to reader** (engages directly)
- [ ] **Sensory language** (taste, smell, sound, sight, touch)
- [ ] **Emotional connection** (why this matters, not just what)

### Accuracy
- [ ] **Facts verified** (dates, names, prices)
- [ ] **No exaggeration** (claims backed by proof)
- [ ] **Cultural sensitivity** (respectful of traditions)
- [ ] **Up-to-date information** (current prices, hours, availability)

### Consistency
- [ ] **Terminology consistent** (tour vs. experience vs. walk)
- [ ] **Formatting consistent** (lists, headings, quotes)
- [ ] **Tense consistent** (present tense for tours, past for stories)
- [ ] **Voice consistent** (same tone across all pages)

### Simply Enak Specific
- [ ] **Vendor names** included (not "local vendor")
- [ ] **Years of operation** mentioned (since 1982, 40 years, etc.)
- [ ] **Specific dishes** named (not "local delicacies")
- [ ] **Cultural context** provided (why this matters)

**Content Writing Score Target:** 90+/100  
**Issues Found:** _________________________________________________

---

## 9. ADA / Accessibility (WCAG 2.1 AA) — 25 Points

### Perceivable
- [ ] **Alt text** on all informative images
- [ ] **Decorative images** have empty alt (`alt=""`)
- [ ] **Color contrast** meets AA (4.5:1 text, 3:1 large text)
- [ ] **Text resizable** to 200% without breaking
- [ ] **Video captions** present (if applicable)
- [ ] **Audio descriptions** present (if applicable)

### Operable
- [ ] **Keyboard navigation** works (Tab through all interactive elements)
- [ ] **Focus indicators** visible (outline on focused elements)
- [ ] **No keyboard traps** (can tab away from all elements)
- [ ] **Skip to main content** link present and works
- [ ] **Page titles** descriptive and unique
- [ ] **Link text** descriptive (not "click here")
- [ ] **Multiple ways to navigate** (menu, breadcrumbs, search, sitemap)

### Understandable
- [ ] **Language declared** (`<html lang="en">`)
- [ ] **Language changes marked** (if multiple languages)
- [ ] **Predictable navigation** (consistent across pages)
- [ ] **Consistent functionality** (same icons = same actions)
- [ ] **Error messages** helpful (explain what went wrong, how to fix)
- [ ] **Labels on form fields** (visible, not just placeholders)
- [ ] **Instructions provided** (how to complete forms)

### Robust
- [ ] **Valid HTML** (no syntax errors)
- [ ] **ARIA labels** used correctly (not overused)
- [ ] **Status messages** announced to screen readers
- [ ] **Custom components** accessible (dropdowns, modals, tabs)

### Mobile Accessibility
- [ ] **Touch targets 44px minimum**
- [ ] **No pinch-zoom disabled**
- [ ] **Orientation** works in portrait and landscape
- [ ] **Motion reduced** for users who prefer reduced motion

**Accessibility Score Target:** 95+/100 (WAVE, axe DevTools)  
**Issues Found:** _________________________________________________

---

## 10. Simply Enak Specific Requirements — 20 Points

### From QWEN.md
- [ ] **Wrangler CLI used** for all Cloudflare operations
- [ ] **Directus content synced** before editing (`npm run sync`)
- [ ] **Files read before editing** (no guessing at structure)
- [ ] **Brand voice enforced** (no forbidden words)
- [ ] **Three-feeling test** applied (WELCOMED + FASCINATED + CONNECTED)

### From Brand Docs
- [ ] **No em-dashes (—)** in content
- [ ] **No "it's not just X, it's Y"** pattern
- [ ] **No identity statements** ("We're not tour operators")
- [ ] **Positive framing** (what we ARE, not what we're NOT)
- [ ] **Short sentences** (break up complex ideas)

### Conversion Requirements
- [ ] **Above-fold CTA** on all pages
- [ ] **Trust badges** visible (5,000+ guests, 4.9 rating, TripAdvisor)
- [ ] **Social proof** in hero or immediately below
- [ ] **Multiple CTAs** per page (primary, secondary, WhatsApp)
- [ ] **Sticky mobile CTA** on tour pages
- [ ] **Internal linking** (3-5 links per page)

### Content Requirements
- [ ] **Heritage/food culture content** on location pages (~1,000 words)
- [ ] **"What Makes This Tour Different"** on tour pages
- [ ] **FAQ section** on all relevant pages
- [ ] **Vendor stories** included (names, years, relationships)
- [ ] **Cultural context** provided (why dishes matter)

### Technical Requirements
- [ ] **FAQ schema** on all FAQ pages
- [ ] **TouristTrip schema** on tour pages
- [ ] **BreadcrumbList schema** on all pages
- [ ] **ItemList schema** on tour listing pages
- [ ] **Noindex removed** from pages that should rank

**Simply Enak Requirements Score Target:** 100/100  
**Issues Found:** _________________________________________________

---

## 11. Additional Categories You May Have Missed

### 12. Performance — 15 Points
- [ ] **Lighthouse Performance** >90
- [ ] **First Contentful Paint** <1.5s
- [ ] **Largest Contentful Paint** <2.5s
- [ ] **Time to Interactive** <3.5s
- [ ] **Cumulative Layout Shift** <0.1
- [ ] **Total Blocking Time** <200ms
- [ ] **Image optimization** (WebP, compressed, lazy-loaded)
- [ ] **Code splitting** working (only load what's needed)
- [ ] **Caching headers** set correctly
- [ ] **CDN delivery** for static assets

**Performance Score Target:** 90+/100 (Lighthouse)

---

### 13. Analytics & Tracking — 10 Points
- [ ] **Google Analytics 4** installed and firing
- [ ] **Consent mode** implemented (cookie banner)
- [ ] **Conversion tracking** set up (bookings, form submissions)
- [ ] **Event tracking** configured (CTA clicks, WhatsApp clicks)
- [ ] **Goal funnels** defined in GA4
- [ ] **Search Console** verified
- [ ] **Sitemap submitted** to Search Console
- [ ] **No tracking on staging** (or separate property)

**Analytics Score Target:** 100% tracking accuracy

---

### 14. Internationalization (i18n) — 15 Points
- [ ] **Multi-language support** working (EN, MS, ZH, DE, ES, FR, NL, RU, JA, PT)
- [ ] **Hreflang tags** correct on all pages
- [ ] **Language switcher** works
- [ ] **Translations accurate** (not machine-translated)
- [ ] **RTL support** if needed (not applicable for now)
- [ ] **Date/time formats** localized
- [ ] **Currency formats** correct (RM for Malaysia)

**i18n Score Target:** 95+/100

---

### 15. Legal & Compliance — 10 Points
- [ ] **Privacy Policy** accessible and up-to-date
- [ ] **Terms & Conditions** accessible
- [ ] **Cookie consent** banner present and functional
- [ ] **GDPR compliance** (EU visitors)
- [ ] **PDPA compliance** (Malaysia)
- [ ] **Accessibility statement** (optional but recommended)
- [ ] **Copyright notice** in footer
- [ ] **Business registration** details (if required)

**Legal Score Target:** 100% compliance

---

## Summary Dashboard

| Category | Score | Status | Priority Fixes |
|----------|-------|--------|----------------|
| 1. SEO | ___/25 | 🟡🟢🔴 | |
| 2. GEO | ___/15 | 🟡🟢🔴 | |
| 3. Security | ___/15 | 🟡🟢🔴 | |
| 4. Blog Writing | ___/20 | 🟡🟢🔴 | |
| 5. UI | ___/20 | 🟡🟢🔴 | |
| 6. UX | ___/20 | 🟡🟢🔴 | |
| 7. Branding | ___/15 | 🟡🟢🔴 | |
| 8. Content Writing | ___/20 | 🟡🟢🔴 | |
| 9. Accessibility | ___/25 | 🟡🟢🔴 | |
| 10. Simply Enak Requirements | ___/20 | 🟡🟢🔴 | |
| 11. Performance | ___/15 | 🟡🟢🔴 | |
| 12. Analytics | ___/10 | 🟡🟢🔴 | |
| 13. Internationalization | ___/15 | 🟡🟢🔴 | |
| 14. Legal & Compliance | ___/10 | 🟡🟢🔴 | |
| **TOTAL** | **___/250** | 🟡🟢🔴 | |

**Legend:**
- 🟢 = Pass (90%+)
- 🟡 = Needs Work (70-89%)
- 🔴 = Critical Issues (<70%)

---

## Priority Action Plan

### Critical (Fix Before Production)
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### High Priority (Fix Within 1 Week)
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### Medium Priority (Fix Within 2-4 Weeks)
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### Low Priority (Nice to Have)
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

---

## Sign-Off

**QA Completed By:** _________________________________  
**Date:** _________________________________  
**Overall Score:** ________/250 (____%)  
**Ready for Production?** ☐ Yes ☐ No ☐ Needs Review

**Production Deployment Approved By:** _________________________________  
**Date:** _________________________________

---

*Pre-Launch QA Checklist v1.0 — Simply Enak*  
*Created: March 24, 2026*  
*Based on SEO, GEO, Security, Accessibility (WCAG 2.1 AA), Brand Guidelines, and Simply Enak Requirements*
