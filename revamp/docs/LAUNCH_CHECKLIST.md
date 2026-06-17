# Simply Enak — Website Launch Checklist

**Created:** March 30, 2026  
**Launch Target:** [DATE TBD]

---

## ✅ CONTENT & SEO (Complete)

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Meta titles (5 tours) | ✅ Done | Content | All unique, optimized |
| Meta descriptions (5 tours) | ✅ Done | Content | Include duration, price, social proof |
| Internal linking | ✅ Done | Dev | All dietary + location links working |
| Schema markup | ✅ Done | Dev | TouristTrip, FAQ, Review, AggregateRating |
| Tour itineraries | ✅ Created | Content | Ready to import to Directus |
| Join-in page | ✅ Ready | Content | Has fallback content |
| Private tours page | ✅ Ready | Content | Has fallback content |
| Image assets (5 tours) | ✅ Ready | Content | Hero + gallery for all 5 tours |

---

## ⏳ PRE-LAUNCH (Your Actions)

### **1. Import Tour Itineraries to Directus**

**File:** `/docs/TOUR_ITINERARIES_FOR_DIRECTUS.md`

| Tour | Slug | Status |
|------|------|--------|
| KL Street Food | `kl-street-food` | ✅ **DONE** (6 stops) |
| Penang Street Food | `penang-street-food` | ✅ **DONE** (6 stops) |
| Eat Drink George Town | `eat-drink-george-town` | ✅ **DONE** (5 stops) |
| Flavours of Malaysia | `flavours-of-malaysia` | ✅ **DONE** (5 stops) |
| Secrets of KL Nightlife | `secrets-of-kl-nightlife` | ✅ **DONE** (5 stops) |

**How it was done:**
- Used Ruflo + Python script to extract itineraries from markdown
- Updated `frontend/src/data/content/tours.json` directly
- All 5 tours verified with complete itinerary data

**Next:** Copy the itinerary JSON to Directus UI, OR commit tours.json to git

---

### **2. Review Join-in Tours Page Content**

**Directus:** Join-in Tours Page

| Field | Current Content | Action |
|-------|-----------------|--------|
| `hero_title` | "Good Food, Good Company" | ✅ OK / ⏳ Edit |
| `hero_highlight` | "Good Company" | ✅ OK / ⏳ Edit |
| `hero_subtitle` | "Join a small group of curious eaters..." | ✅ OK / ⏳ Edit |
| `what_it_means_json` | 3 items (Small groups, Per-person pricing, Meet fellow travellers) | ✅ OK / ⏳ Edit |
| `faqs_json` | 3 FAQs | ✅ OK / ⏳ Edit |

---

### **3. Review Private Tours Page Content**

**Directus:** Private Tours Page

| Field | Current Content | Action |
|-------|-----------------|--------|
| `hero_title` | [From Directus] | ✅ OK / ⏳ Edit |
| `why_private_json` | 3 items (Your guide your group, Your schedule, Your interests) | ✅ OK / ⏳ Edit |
| `audiences_json` | 4 items (Families, Couples, Corporate, Special occasions) | ✅ OK / ⏳ Edit |
| `on_every_tour` | 5 items | ✅ OK / ⏳ Edit |
| `private_extras` | 5 items | ✅ OK / ⏳ Edit |

---

## ⏳ TECHNICAL LAUNCH (Dev Team)

### **4. Build & Deploy to Staging**

| Task | Status | Owner | Date |
|------|--------|-------|------|
| Build Astro site | ⏳ Pending | Dev | |
| Deploy to Cloudflare Pages (staging) | ⏳ Pending | Dev | |
| Verify all 5 tour pages render | ⏳ Pending | QA | |
| Verify Join-in page renders | ⏳ Pending | QA | |
| Verify Private Tours page renders | ⏳ Pending | QA | |
| Test all internal links | ⏳ Pending | QA | |
| Test forms (contact, booking) | ⏳ Pending | QA | |
| Verify GA4 tracking | ⏳ Pending | Dev | |
| Verify GSC tracking | ⏳ Pending | Dev | |
| Submit sitemap to GSC | ⏳ Pending | SEO | |

---

### **5. Cross-Browser & Mobile Testing**

| Browser/Device | Status | Owner | Date |
|----------------|--------|-------|------|
| Chrome (Desktop) | ⏳ Pending | QA | |
| Chrome (Mobile) | ⏳ Pending | QA | |
| Safari (Desktop) | ⏳ Pending | QA | |
| Safari (Mobile/iOS) | ⏳ Pending | QA | |
| Firefox (Desktop) | ⏳ Pending | QA | |
| Mobile responsiveness | ⏳ Pending | QA | |
| Page speed (Core Web Vitals) | ⏳ Pending | Dev | |

---

## ✅ LAUNCH APPROVAL (Your Sign-off)

### **6. Staging Review**

| Page | URL | Review Status | Approved |
|------|-----|---------------|----------|
| Homepage | https://staging.simplyenak.com/ | ⏳ Pending | ☐ |
| KL Street Food | https://staging.simplyenak.com/tours/kl-street-food/ | ⏳ Pending | ☐ |
| Penang Street Food | https://staging.simplyenak.com/tours/penang-street-food/ | ⏳ Pending | ☐ |
| Eat Drink George Town | https://staging.simplyenak.com/tours/eat-drink-george-town/ | ⏳ Pending | ☐ |
| Flavours of Malaysia | https://staging.simplyenak.com/tours/flavours-of-malaysia/ | ⏳ Pending | ☐ |
| Secrets of KL Nightlife | https://staging.simplyenak.com/tours/secrets-of-kl-nightlife/ | ⏳ Pending | ☐ |
| Join-in Tours | https://staging.simplyenak.com/tours/join-in-tours/ | ⏳ Pending | ☐ |
| Private Tours | https://staging.simplyenak.com/tours/private-tours/ | ⏳ Pending | ☐ |

---

### **7. Production Deploy**

| Task | Status | Owner | Date |
|------|--------|-------|------|
| Final content review | ⏳ Pending | You | |
| Approve for production | ⏳ Pending | You | |
| Deploy to production repo | ⏳ Pending | Dev | |
| Trigger GitHub Actions deploy | ⏳ Pending | You | |
| Verify production site | ⏳ Pending | All | |
| Monitor for errors (24hrs) | ⏳ Pending | Dev | |

---

## 📊 POST-LAUNCH (Week 1)

| Task | Status | Owner | Date |
|------|--------|-------|------|
| Check GSC for indexing | ⏳ Pending | SEO | |
| Check GA4 for traffic | ⏳ Pending | SEO | |
| Test all booking flows | ⏳ Pending | QA | |
| Fix any broken links | ⏳ Pending | Dev | |
| Monitor page speed | ⏳ Pending | Dev | |

---

## 📁 Reference Files

| File | Purpose |
|------|---------|
| `/docs/TOUR_ITINERARIES_FOR_DIRECTUS.md` | 5 tour itineraries ready to import |
| `/docs/KEYWORD_STRATEGY_2026.md` | SEO keyword strategy |
| `/docs/NEXT_STEPS_ACTION_PLAN.md` | 4-week action plan |
| `/docs/AI_OPTIMIZATION_PROGRESS_2026-03-30.md` | Progress report |
| `/docs/TJ_ROBERTSON_AI_SEARCH_OPTIMIZATION.md` | AI search optimization guide |

---

## 🎯 Launch Blockers (Must Fix Before Launch)

- [ ] **Itineraries imported to Directus** (5 tours)
- [ ] **Staging site deployed and tested**
- [ ] **All forms working (contact, booking)**
- [ ] **GA4 + GSC tracking verified**
- [ ] **Final approval from you**

---

**Next Action:** Import tour itineraries to Directus (Step 1)
