# Simply Enak Website Design Audit

**Date:** 2026-04-29
**Scope:** Homepage, Tour page, About, Stories, Contact
**Method:** Automated brand voice scan, accessibility checks, structural analysis

---

## Executive Summary

| Page | Score | Status |
|------|-------|--------|
| Homepage | B+ | 3 brand voice violations, 8 missing alt texts |
| Tour Page | A- | "best"/"must-have" in description, empty list items |
| About | A | Clean |
| Stories | A | Clean |
| Contact | A | Clean |
| **Sitewide** | B | Placeholder footer license, some empty elements |

**Overall:** Strong foundation. Most issues are content-level fixes, not structural.

---

## 1. Brand Voice Issues

### Forbidden Words Found

| Word | Location | Page | Severity |
|------|----------|------|----------|
| **authentic** | Homepage body text | Home | Medium |
| **delicious** | Homepage body text | Home | Medium |
| **best** | Homepage body text | Home | Medium |
| **best** | "one of the best Rendangs in town" | Tour | Low |
| **must-have** | "must-have dish when in Kuala Lumpur" | Tour | Low |

**Guideline:** Never use: authentic, premium, luxury, discover, explore, immerse, customer, delicious, traditional (without story), unique, best, #1, must-see.

**Fix:** Replace with specific, experiential language. Examples:
- "authentic" → "the same recipe since 1952"
- "delicious" → "the kind of flavour that makes you pause mid-bite"
- "best" → "the Rendang Pauline's aunt still makes for family dinners"
- "must-have" → "the dish locals queue 20 minutes for"

### Exclamation Mark Discipline

| Page | Count | Status |
|------|-------|--------|
| Homepage | 2 | Good (within "one per paragraph" rule) |
| Tour | 0 | Good |
| About | 0 | Good |
| Stories | 0 | Good |
| Contact | 0 | Good |

### "Friends" Claims

No pages contain "we are friends" or "we're friends" claims. The brand guideline "show, don't tell" is well enforced across all pages.

---

## 2. Accessibility Issues

### Missing Alt Text

| Page | Images Total | Missing Alt | % Complete |
|------|-------------|-------------|------------|
| Homepage | 37 | **8** | 78% |
| Tour | 3 | 0 | 100% |
| About | 3 | 0 | 100% |
| Stories | 3 | 0 | 100% |
| Contact | 3 | 0 | 100% |

**Homepage images without alt text:** Likely in the "Why Simply Enak" section (6 feature icons) and possibly the hero background or press logos. These need descriptive alt text for screen readers.

### Empty Content Elements

| Type | Count | Location |
|------|-------|----------|
| Empty paragraphs | 5 | Various pages |
| Empty headings | 1 | Contact page (unnamed h2 before form) |
| Empty list items | 5 | Tour page "Why You'll Love This Tour" section |

**Note:** The 5 empty list items on tour pages are structural placeholders where content is missing from the CMS. They render as blank bullet points.

### Heading Structure

| Page | H1 Count | H2 Count | Status |
|------|----------|----------|--------|
| Homepage | 1 | 9 | Good |
| Tour | 1 | 5 | Good |
| About | 1 | 5 | Good |
| Stories | 1 | 5 | Good |
| Contact | 1 | 3 | Good |

All pages have exactly one H1. Hierarchy is logical.

---

## 3. Content Quality Issues

### Placeholder Data

**Footer Company License:** `00000-000-000-00`
- This is clearly placeholder text
- Should be replaced with the actual business registration number

### Duplicate Copyright

Footer shows: `2026 COPYRIGHT 2023 SIMPLY ENAK FOOD EXPERIENCES`
- Double copyright notice is redundant
- Simplify to: `2026 Simply Enak Food Experiences. All Rights Reserved.`

### Tour Description Quality

The tour description on the Secrets of KL page is very long (350+ words) and dense. Consider:
- Breaking into scannable paragraphs
- Adding subheadings ("What you'll taste", "What you'll see")
- Moving some content to expandable sections

### "Why You'll Love This Tour" Section

5 list items exist but have minimal or no content. This section appears to be a CMS content gap - the structure is there but the bullet points are empty.

---

## 4. Structural Issues

### Links

| Check | Result |
|-------|--------|
| Empty links (`href="#"` or `href=""`) | 0 found |
| Broken internal links | 0 found (from prior check) |
| External links | All have descriptive text |

### Navigation

- Consistent across all pages
- Skip-to-content link present
- Mobile navigation available
- Footer navigation complete

### Breadcrumbs

- Present on Tour, About, Contact, Stories pages
- Missing on Homepage (correct - homepage doesn't need breadcrumbs)
- Semantic markup with `aria-label="Breadcrumb"`

---

## 5. Positive Findings

### What Works Well

1. **Strong brand voice enforcement** - Only the homepage has forbidden words; all other pages are clean
2. **Good heading hierarchy** - One H1 per page, logical progression
3. **No "friends" claims** - Brand guideline "show don't tell" is respected
4. **Consistent navigation** - Header and footer identical across all pages
5. **Semantic HTML** - Proper use of `<nav>`, `<main>`, `<article>`, `<section>`
6. **Skip link** - Accessibility feature for keyboard users
7. **Contact form** - Well-structured with required fields
8. **Social proof** - TripAdvisor and Google ratings prominently displayed
9. **Multi-language support** - 8 language variants generated
10. **Cookie consent** - Present and functional

### Design Strengths

- Clean, uncluttered layout
- Good visual hierarchy with clear section breaks
- Consistent typography
- Tour cards are well-structured with price, duration, location
- Testimonials section adds credibility
- "Right for you / Probably not" filter is a strong conversion tool

---

## 6. Recommendations by Priority

### High Priority (Fix Before Go-Live)

1. **Replace placeholder company license** in footer with actual registration number
2. **Add alt text to 8 homepage images** - especially the 6 "Why Simply Enak" icons
3. **Fix 5 empty list items** in "Why You'll Love This Tour" section on tour pages
4. **Remove/replace forbidden words** on homepage: "authentic", "delicious", "best"

### Medium Priority (Fix Soon After Launch)

5. **Fix unnamed h2 heading** on contact page
6. **Remove 5 empty paragraphs** from various pages
7. **Simplify footer copyright** text
8. **Break up long tour descriptions** into scannable sections
9. **Review "best"/"must-have"** in tour descriptions - replace with specific language

### Low Priority (Nice to Have)

10. **Add breadcrumbs to homepage** (optional, but good for consistency)
11. **Consider adding structured data** review for testimonials
12. **Add FAQ schema markup** to tour pages

---

## 7. Fix Checklist

```
[ ] Replace "00000-000-000-00" with real company license
[ ] Add alt text to 8 homepage images
[ ] Fix empty "Why You'll Love This Tour" list items (5)
[ ] Remove "authentic" from homepage copy
[ ] Remove "delicious" from homepage copy
[ ] Remove "best" from homepage copy
[ ] Fix unnamed h2 on contact page
[ ] Remove empty paragraphs (5)
[ ] Simplify footer copyright notice
[ ] Review all tour descriptions for "best"/"must-have"
```
