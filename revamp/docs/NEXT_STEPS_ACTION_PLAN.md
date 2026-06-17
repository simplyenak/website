# Simply Enak — Next Steps Action Plan
## AI Search Optimization Implementation

**Created:** March 30, 2026  
**Based on:** GA4 + GSC data analysis + TJ Robertson GEO framework  
**Timeline:** Week 1-4 (March 31 - April 27, 2026)

---

## **Week 1: Quick Wins (March 31 - April 6)**

### **Priority 1: Penang Tour Page Optimization**

**Target Keywords:**
- `food tour penang` (position 2.7, 8 clicks, 251 impressions)
- `food tour penang georgetown` (position 2.8, 3 clicks, 43 impressions)

**Why:** Already on page 1 — small improvements can push to top 3

**Tasks:**

#### **1.1 Add FAQ Schema to Penang Tour Page**
**File:** `/frontend/src/pages/tours/penang-street-food.astro`

**Action:** Add 5-7 FAQs specific to Penang tours:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What's included in the Penang street food tour?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You'll taste 10-12 different dishes across 8-10 food stalls in Georgetown. Your guide shares stories about Penang's food heritage, including why certain dishes are unique to Penang vs. KL. Small groups (max 9 people), local prices, no tourist traps."
      }
    },
    {
      "@type": "Question",
      "name": "How long is the Penang food tour?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The tour runs 4-5 hours at a leisurely pace through Georgetown's UNESCO heritage zone. We stop at each stall for 20-30 minutes, giving you time to digest, take photos, and hear vendor stories. Not rushed — more like exploring with knowledgeable friends."
      }
    },
    {
      "@type": "Question",
      "name": "Is the Penang tour vegetarian-friendly?",
      "acceptedAnswer": {
        "text": "Yes! Penang has excellent vegetarian options. We visit stalls with dedicated vegetarian prep areas, know which dishes use belacan (shrimp paste), and can accommodate vegan, gluten-free, and Jain diets. Let us know when booking and we'll adjust the route."
      }
    }
  ]
}
```

**Owner:** Content team  
**Time:** 2 hours  
**Expected Impact:** +20-30% CTR, push from 2.7 → 1.8

---

#### **1.2 Expand Penang Tour Content**
**File:** `/frontend/src/data/content/penang-street-food.json` (or equivalent)

**Add:**
- **Vendor names:** "Aunty Tan's char koay teow stall (40 years)", "Uncle Lim's cendol (since 1985)"
- **Specific dishes:** "Assam laksa (Penang-specific, not found in KL)", "Cendol with Gula Melaka"
- **Statistics:** "8-10 stalls", "10-12 tastings", "Georgetown UNESCO zone", "4-5 hours"
- **Cultural context:** "Why Penang food differs from KL (Hokkien vs. Cantonese influence)"

**Owner:** Content team  
**Time:** 3 hours  
**Expected Impact:** Better AI citations, improved relevance score

---

#### **1.3 Update Title & Meta Description**
**File:** `/frontend/src/pages/tours/penang-street-food.astro`

**Current (assumed):** "Penang Street Food Tour | Simply Enak"

**New:**
```astro
<title>Penang Food Tour: Georgetown Street Food | Simply Enak (4.9⭐)</title>
<meta name="description" content="4-5 hour Georgetown food tour with 10+ tastings. Small groups (max 9), generational vendors, vegetarian options. 4.9 from 520+ reviews. From RM 285." />
```

**Why:** Include rating, group size, duration, price — all decision factors

**Owner:** SEO team  
**Time:** 30 minutes  
**Expected Impact:** +50% CTR (from 1.6% → 2.4%)

---

### **Priority 2: KL Tour Page CTR Improvement**

**Target Keyword:**
- `food tour kuala lumpur` (position 10.4, 5 clicks, 1,194 impressions!)

**Why:** 1,194 impressions but only 5 clicks = massive opportunity

**Tasks:**

#### **2.1 Create Comparison Table on KL Tour Page**
**File:** `/frontend/src/pages/tours/kuala-lumpur-street-food.astro`

**Add:** "Simply Enak vs. Other KL Food Tours" mini-table:

| Feature | Simply Enak | Other Tours |
|---------|-------------|-------------|
| Group Size | Max 9 | 15-20 |
| Vendor Relationships | 14 years | Varies |
| Dietary Accommodation | All needs | Limited |
| Booking | Direct, no fees | Platform fees |
| Cancellation | 48 hours free | 24-72 hours |

**Owner:** Content team  
**Time:** 2 hours  
**Expected Impact:** Better differentiation, improved CTR

---

#### **2.2 Add "Why Choose Us" Section**
**File:** `/frontend/src/pages/tours/kuala-lumpur-street-food.astro`

**Content:**
```markdown
## Why Choose Our KL Food Tour?

**14 Years in KL (Since 2011)**
We've known Aunty Lim since 2011. Uncle Tan since 2012. These aren't business partnerships — they're friendships built over 312+ tours.

**Max 9 People, Always**
Not "up to 15." Not "usually 12." Maximum 9 people, every tour. Because you can actually hear the stories.

**We Don't Negotiate Vendor Prices**
Other tours ask for discounts. We don't. Vendors tell us their prices — we pay them. Immediately, in cash, at the stall.

**Dietary Experts**
Vegetarian, vegan, halal, gluten-free, Jain — we've accommodated every dietary need since 2011. We know which stalls use belacan, which use lard, which have allergen-free prep.
```

**Owner:** Content team  
**Time:** 2 hours  
**Expected Impact:** Better conversion, improved dwell time

---

#### **2.3 Update KL Tour Title/Meta**
**File:** `/frontend/src/pages/tours/kuala-lumpur-street-food.astro`

**New:**
```astro
<title>KL Food Tour: Kuala Lumpur Street Food | Simply Enak (4.9⭐)</title>
<meta name="description" content="4-5 hour KL street food tour in Chinatown & Chow Kit. 10+ tastings, small groups (max 9), vegetarian options. 4.9 from 520+ reviews. From RM 285." />
```

**Owner:** SEO team  
**Time:** 30 minutes  
**Expected Impact:** CTR improvement from 0.4% → 1.0%+

---

## **Week 2: Content Expansion (April 7-13)**

### **Priority 3: Durian Content Series**

**Target:** `/stories/eating-durians/` gets 12 clicks (3rd top page)

**Why:** Durian is a hidden gem — expand into a content series

**Tasks:**

#### **3.1 Create Durian Guide Hub Page**
**New File:** `/frontend/src/pages/stories/durian-guide.astro`

**Content:**
- "Complete Guide to Durian in Malaysia"
- "When is Durian Season?" (June-August, December-January)
- "How to Eat Durian" (step-by-step)
- "Durian Varieties" (Musang King, D24, Red Prawn)
- "Where to Buy Durian in KL" (Chow Kit, Jalan Alor, etc.)
- "Durian Etiquette" (where you can/can't eat it)

**Owner:** Content team  
**Time:** 6 hours  
**Expected Impact:** 50+ clicks/month from durian-related searches

---

#### **3.2 Interlink Durian Content**
**Files:** All tour pages, homepage, stories index

**Action:** Add contextual links:
- From KL tour page: "Ask us about durian season tours"
- From homepage: "Read our durian guide"
- From stories index: Link to durian guide as featured content

**Owner:** Content team  
**Time:** 1 hour  
**Expected Impact:** Improved internal linking, better crawl depth

---

### **Priority 4: Vegetarian Tour Page**

**Target Keywords:**
- `vegetarian food tour kl` (not in top 50)
- `vegetarian food tour malaysia` (not in top 50)

**Why:** High intent, low competition, matches Simply Enak expertise

**Tasks:**

#### **4.1 Create Dedicated Vegetarian Tour Page**
**New File:** `/frontend/src/pages/tours/vegetarian-food-tour.astro`

**Content:**
- "Vegetarian Food Tour: KL's Best Plant-Based Street Food"
- "10+ vegetarian tastings across 8-10 stalls"
- "Buddhist vegetarian stalls (素食), Indian vegetarian, modern plant-based"
- "We know which stalls use belacan, which use lard, which are 100% vegetarian"
- "Small groups (max 9), 4-5 hours, from RM 285"

**Schema:** FAQPage + Recipe (for featured dishes)

**Owner:** Content team  
**Time:** 5 hours  
**Expected Impact:** Rank in top 10 for "vegetarian food tour kl"

---

#### **4.2 Create Vegetarian FAQ Page**
**New File:** `/frontend/src/pages/tours/dietary/vegetarian-faq.astro`

**FAQs:**
- "Is Malaysian food vegetarian-friendly?"
- "What is belacan and why should vegetarians avoid it?"
- "Are there vegan food tours in KL?"
- "Can you accommodate Jain dietary needs?"
- "What's the difference between Buddhist vegetarian and regular vegetarian?"

**Owner:** Content team  
**Time:** 3 hours  
**Expected Impact:** Long-tail keyword capture, AI citations

---

## **Week 3: Link Building & Authority (April 14-20)**

### **Priority 5: Earn Brand Mentions**

**Per TJ Robertson:** Brand mentions on cited pages = AI visibility

**Tasks:**

#### **5.1 Travel Blogger Outreach**
**Target:** 10 travel bloggers who've written about Malaysia

**Outreach Template:**
```
Subject: Hosting you on Simply Enak's award-winning food tour

Hi [Name],

I'm [Your name] from Simply Enak. We've been running food tours in KL and Penang since 2011, hosting 5,000+ guests with a 4.9 rating.

I noticed you wrote about [their Malaysia post]. We'd love to host you on a private food tour — no strings attached. Just an honest experience of Malaysian food culture.

If you enjoy it, a mention on your blog would mean the world. If not, no worries — we just want to share our food with fellow travelers.

Let me know if you're interested!

Best,
[Name]
```

**Owner:** Marketing team  
**Time:** 4 hours (research + outreach)  
**Expected Impact:** 3-5 blog mentions in 30 days

---

#### **5.2 TripAdvisor Forum Engagement**
**Target:** r/malaysia, r/travel, TripAdvisor KL forums

**Action:**
- Answer questions: "What should I do in KL?" → Provide value FIRST
- Mention Simply Enak naturally: "We've been doing food tours since 2011..."
- Don't spam — be genuinely helpful

**Owner:** Marketing team  
**Time:** 2 hours/week  
**Expected Impact:** 10-20 targeted visitors/week

---

### **Priority 6: Update Existing Content**

**Target:** Pages with impressions but low CTR

**Tasks:**

#### **6.1 Update Meta Descriptions**
**Pages:**
- `/tours/penang-street-food` (1.6% CTR → target 2.5%)
- `/stories/eating-durians/` (1.0% CTR → target 2.0%)
- `/tours/kuala-lumpur-street-food` (1.1% CTR → target 2.0%)

**Formula:** [Duration] + [What's Included] + [Social Proof] + [Price]

**Example:**
```
Old: "Penang street food tour with Simply Enak"
New: "4-5 hour Georgetown food tour. 10+ tastings, small groups (max 9), vegetarian options. 4.9 from 520+ reviews. From RM 285. Book direct, no fees."
```

**Owner:** SEO team  
**Time:** 2 hours  
**Expected Impact:** +50% CTR across updated pages

---

## **Week 4: Measurement & Iteration (April 21-27)**

### **Priority 7: Test AI Citations**

**Per TJ Robertson:** Monthly AI citation testing

**Tasks:**

#### **7.1 AI Citation Audit**
**Tools:** ChatGPT, Google AI Overview, Perplexity

**Queries to Test:**
```
ChatGPT:
- "Best food tour in Kuala Lumpur"
- "Vegetarian food tours Malaysia"
- "Simply Enak reviews"
- "Penang food tour recommendations"

Google AI Overview:
- "KL food tour comparison"
- "Halal food tour Penang"
- "Chow Kit market tour guide"

Perplexity:
- "Most authentic food tour Kuala Lumpur"
- "Small group food tour KL"
- "Simply Enak vs Chef's Tour"
```

**Track:**
- Are we cited?
- Which pages are cited?
- Which competitors are cited instead?

**Owner:** SEO team  
**Time:** 2 hours  
**Deliverable:** AI Citation Report (spreadsheet)

---

#### **7.2 GSC Data Pull & Analysis**
**File:** `claude-brain/sync/gsc-data-2026-04.json`

**Compare:**
- Week 1 rankings vs. Week 4 rankings
- CTR improvements
- New keywords appearing

**Owner:** SEO team  
**Time:** 2 hours  
**Deliverable:** Monthly SEO Report

---

#### **7.3 Iterate Based on Data**
**Action:** Double down on what's working

**If Penang pages improved:**
- Create more Penang-specific content
- Add Penang vendor stories
- Build Penang-specific backlinks

**If KL pages didn't improve:**
- A/B test different title tags
- Add more comparison content
- Build more internal links from high-authority pages

**Owner:** SEO + Content teams  
**Time:** 3 hours  
**Deliverable:** Updated priority list for Month 2

---

## **Success Metrics (End of Month 1)**

| Metric | Current | Target | How |
|--------|---------|--------|-----|
| `food tour penang` position | 2.7 | 1.8 | FAQ schema + content expansion |
| `food tour kuala lumpur` CTR | 0.4% | 1.0% | Better titles + comparison table |
| Total GSC clicks | 181/90d | 250/90d | All optimizations above |
| AI citations | Unknown | Top 3 for 5+ queries | Monthly testing + optimization |
| Branded search % | 70% | 60% | Grow non-branded traffic faster |

---

## **Tools & Resources**

### **Access Required:**
- [ ] Google Search Console (✅ Already connected)
- [ ] Google Analytics 4 (✅ Already connected)
- [ ] ChatGPT Plus (for AI testing)
- [ ] Perplexity Pro (optional, for AI testing)
- [ ] Ahrefs/Semrush (optional, for competitor research)

### **Templates:**
- [ ] Outreach email template (see 5.1)
- [ ] AI Citation tracking spreadsheet
- [ ] Monthly SEO report template

### **Files to Create:**
- [ ] `/tours/vegetarian-food-tour.astro`
- [ ] `/tours/dietary/vegetarian-faq.astro`
- [ ] `/stories/durian-guide.astro`
- [ ] AI Citation tracking spreadsheet

---

## **Ownership & Accountability**

| Task | Owner | Due Date | Status |
|------|-------|----------|--------|
| 1.1 Penang FAQ Schema | Content | April 3 | ⏳ Pending |
| 1.2 Penang Content Expansion | Content | April 4 | ⏳ Pending |
| 1.3 Penang Title/Meta | SEO | April 3 | ⏳ Pending |
| 2.1 KL Comparison Table | Content | April 5 | ⏳ Pending |
| 2.2 KL "Why Choose Us" | Content | April 5 | ⏳ Pending |
| 2.3 KL Title/Meta | SEO | April 5 | ⏳ Pending |
| 3.1 Durian Guide Hub | Content | April 10 | ⏳ Pending |
| 3.2 Durian Interlinking | Content | April 11 | ⏳ Pending |
| 4.1 Vegetarian Tour Page | Content | April 12 | ⏳ Pending |
| 4.2 Vegetarian FAQ | Content | April 13 | ⏳ Pending |
| 5.1 Blogger Outreach | Marketing | April 17 | ⏳ Pending |
| 5.2 Forum Engagement | Marketing | Ongoing | ⏳ Pending |
| 6.1 Meta Description Updates | SEO | April 18 | ⏳ Pending |
| 7.1 AI Citation Audit | SEO | April 24 | ⏳ Pending |
| 7.2 GSC Data Pull | SEO | April 25 | ⏳ Pending |
| 7.3 Iterate Based on Data | SEO + Content | April 27 | ⏳ Pending |

---

**Next Review:** April 27, 2026 (Month 1 retrospective + Month 2 planning)

**Questions?** Reach out to [SEO Lead] or [Content Lead]
