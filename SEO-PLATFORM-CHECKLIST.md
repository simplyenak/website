# SEO & Business Listing Platform Checklist
**Simply Enak Food Tours - Maximize Online Exposure**

Last Updated: 2025-10-02

---

## ✅ COMPLETED

### Search Engines
- [x] **Google My Business** - Both locations claimed
  - KL: https://www.google.com/search?kgmid=/g/11_rl_t5r&q=Kuala+Lumpur+Food+Tours+by+Simply+Enak
  - Penang: https://www.google.com/search?kgmid=/g/11f9xlvcb1&q=Penang+Food+Tours+by+Simply+Enak
  - ✅ Linked in website schema

- [x] **TripAdvisor** - Active with 150+ reviews (5-star rating)
  - KL: https://www.tripadvisor.com/Attraction_Review-g298570-d2328058-Reviews-Simply_Enak_Food_Experiences-Kuala_Lumpur_Wilayah_Persekutuan.html
  - Status: Need to add TripAdvisor URLs to schema `sameAs` field

### Website SEO
- [x] Schema.org LocalBusiness markup implemented
- [x] Geo coordinates for KL and Georgetown
- [x] AggregateRating (5-star, 150 reviews)
- [x] Service schema for tours
- [x] Multi-location schema support

---

## 📋 TO-DO - SEARCH ENGINE VERIFICATION

### 1. Bing Webmaster Tools
**Priority: HIGH** | **Time: 10 mins** | **Cost: FREE**

**Steps:**
1. Go to: https://www.bing.com/webmasters
2. Sign in with Microsoft account
3. Click "Add a site" → Enter: `https://simplyenak.com`
4. Choose "HTML Meta Tag" verification method
5. Copy the verification code (format: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
6. Replace in: `/home/maarten/website-optimization/frontend/src/components/SEO.astro` line 157
   - Change: `content="YOUR_BING_VERIFICATION_CODE"`
   - To: `content="YOUR_ACTUAL_CODE"`
7. Deploy website
8. Return to Bing and click "Verify"
9. Submit sitemap: `https://simplyenak.com/sitemap.xml`

**Benefits:**
- Bing has 10%+ global search market share
- Used by ChatGPT for search results
- Same schema.org markup works for Bing

---

### 2. Yandex Webmaster
**Priority: MEDIUM** | **Time: 10 mins** | **Cost: FREE**

**Steps:**
1. Go to: https://webmaster.yandex.com/
2. Sign in/create Yandex account
3. Click "Add site" → Enter: `https://simplyenak.com`
4. Choose "Meta tag" verification
5. Copy verification code
6. Add to SEO.astro (after Bing tag):
   ```html
   <meta name="yandex-verification" content="YOUR_YANDEX_CODE" />
   ```
7. Deploy and verify
8. Submit sitemap

**Benefits:**
- #1 search engine in Russia
- Popular in Eastern Europe and Central Asia
- Many Russian/Eastern European tourists visit Malaysia

**Verification Methods:**
- Meta tag (recommended)
- HTML file upload
- DNS TXT record

---

### 3. Apple Business Connect (Apple Maps)
**Priority: HIGH** | **Time: 15 mins** | **Cost: FREE**

**Steps:**
1. Go to: https://businessconnect.apple.com/
2. Sign in with Apple ID
3. Click "Add Location"
4. **For KL Location:**
   - Business Name: Kuala Lumpur Food Tours by Simply Enak
   - Address: Kuala Lumpur City Centre, Kuala Lumpur, 50088
   - Phone: +60 017 287 8929
   - Website: https://simplyenak.com
   - Category: Tour Operator / Food & Drink Tour
   - Hours: Mon-Sun 9:00-22:00
5. **For Georgetown Location:**
   - Business Name: Penang Food Tours by Simply Enak
   - Address: Georgetown Heritage Area, Georgetown, Penang, 10200
   - Phone: +60 017 287 8929
   - Website: https://simplyenak.com
   - Category: Tour Operator / Food & Drink Tour
   - Hours: Mon-Sun 9:00-22:00
6. Verification via phone call or SMS
7. Add photos, logo, descriptions

**Benefits:**
- 100M+ iPhone users worldwide
- High-income tourist demographic
- Shows in Siri, Spotlight, Apple Maps
- No meta tag needed (managed via portal)

---

## 📋 TO-DO - TOURISM PLATFORMS

### 4. Viator (TripAdvisor Experiences)
**Priority: HIGH** | **Time: 30 mins** | **Cost: 20-30% commission**

**Steps:**
1. Go to: https://www.viator.com/suppliers
2. Or via TripAdvisor → "List Your Experience"
3. Create supplier account
4. List each tour with:
   - Photos, descriptions, pricing
   - Availability calendar
   - Cancellation policy
   - Meeting points
5. Connect booking system (if needed)

**Benefits:**
- 300,000+ experiences listed
- Owned by TripAdvisor (cross-promotion)
- Massive booking volume
- International exposure

**Commission:** 20-30% per booking

**Already Listed?** Check if you're already on Viator through TripAdvisor

---

### 5. GetYourGuide
**Priority: MEDIUM** | **Time: 30 mins** | **Cost: 20-30% commission**

**Steps:**
1. Go to: https://supplier.getyourguide.com/
2. Click "Become a partner"
3. Create supplier account
4. List tours with details
5. Set up payment/booking integration

**Benefits:**
- 140,000+ tours in 10,000+ cities
- Strong in European market
- Instant booking capability
- Competitor to Viator (good to be on both)

**Commission:** 20-30% per booking

---

### 6. Klook
**Priority: HIGH** | **Time: 30 mins** | **Cost: 15-25% commission**

**Why High Priority:** Klook is HUGE in Asia-Pacific region!

**Steps:**
1. Go to: https://affiliate.klook.com/partner/supplier
2. Click "Become a Klook Partner"
3. Submit supplier application
4. List experiences

**Benefits:**
- #1 platform for Asian tourists
- Strong presence in Malaysia, Singapore, Hong Kong, Japan, Korea
- Lower commission than Viator/GetYourGuide
- Target audience already in/near Malaysia

**Commission:** 15-25% per booking

---

## 📋 TO-DO - MALAYSIA TOURISM AUTHORITIES

### 7. Tourism Malaysia Official Directory
**Priority: HIGH** | **Time: 1-2 hours** | **Cost: FREE**

**Steps:**
1. Go to: https://www.tourism.gov.my/index.php/industry/view/tourism-business-licensing-registration
2. Check current registration status
3. Register business if not already registered
4. Apply for **MyTQA (Malaysia Tourism Quality Assurance)** certification
5. Request listing on official tourism directories

**Benefits:**
- Government recognition and credibility
- MyTQA badge for website
- Listed on official Malaysia tourism sites
- Required for certain tourism activities

**Contact:**
- Tourism Malaysia: https://www.tourism.gov.my
- MOTAC (Ministry of Tourism, Arts & Culture): https://www.motac.gov.my

---

### 8. Malaysia.travel (Official Tourism Website)
**Priority: MEDIUM** | **Time: 30 mins** | **Cost: FREE**

**Steps:**
1. Go to: https://www.malaysia.travel/
2. Look for "List Your Business" or contact form
3. Submit business information
4. Request listing under "Food Tours" or "Experiences"

**Benefits:**
- Official government tourism website
- High domain authority (SEO boost)
- International tourist traffic
- Free backlink

---

## 📋 TO-DO - MALAYSIA BUSINESS DIRECTORIES

### 9. Top Malaysia Business Directories (FREE)
**Priority: MEDIUM** | **Time: 2-3 hours total** | **Cost: FREE**

Submit to these directories for local SEO and backlinks:

1. **Business List Malaysia**: https://www.businesslist.my/
   - 11+ years, verified listings

2. **Yellow Place**: https://yellowplace.my/
   - Founded 2016, manually verified

3. **Malaysia Business Directory**: http://malaysia-business-directory.com/
   - General business directory

4. **Hotfrog Malaysia**: https://www.hotfrog.com.my/
   - International presence

5. **Yelp Malaysia**: https://www.yelp.my/
   - User reviews and ratings

6. **Kompass Malaysia**: https://my.kompass.com/
   - B2B directory

7. **Malaysiayp**: Various local directories

**Information Needed (NAP Consistency):**
- Name: Simply Enak
- Address KL: Kuala Lumpur City Centre, Kuala Lumpur, 50088
- Address Penang: Georgetown Heritage Area, Georgetown, Penang, 10200
- Phone: +60 017 287 8929
- Website: https://simplyenak.com
- Email: booking@simplyenak.com
- Category: Food Tours, Tour Operator, Cultural Experiences
- Description: (Use consistent description from website)

**IMPORTANT:** Keep NAP (Name, Address, Phone) identical across ALL directories!

---

## 📋 TO-DO - SOCIAL PROOF & REVIEW PLATFORMS

### 10. Link TripAdvisor to Schema
**Priority: HIGH** | **Time: 5 mins** | **Cost: FREE**

**Steps:**
1. Find your TripAdvisor profile URLs for both locations
2. Add to `/home/maarten/website-optimization/frontend/src/utils/seo.ts`
3. Update `sameAs` array in schema to include:
   ```typescript
   sameAs: [
     "https://www.facebook.com/simplyenak",
     "https://www.instagram.com/simplyenak",
     "https://www.linkedin.com/company/simply-enak",
     "https://www.tripadvisor.com/...", // Add KL profile
     "https://www.tripadvisor.com/...", // Add Penang profile (if separate)
   ]
   ```

**Benefits:**
- Google recognizes TripAdvisor authority
- Links reviews to your business
- Improves E-E-A-T (Experience, Expertise, Authoritativeness, Trust)

---

### 11. Add TripAdvisor Widget to Website
**Priority: MEDIUM** | **Time: 15 mins** | **Cost: FREE**

**Steps:**
1. Go to TripAdvisor → Your Business → "Get Your Widget"
2. Choose widget type (reviews, rating badge, etc.)
3. Copy embed code
4. Add to website homepage or footer

**Benefits:**
- Shows live reviews on your site
- Builds trust with visitors
- Increases TripAdvisor profile views

---

## 📋 FUTURE ENHANCEMENTS

### 12. Google Travel Integration
**Priority: LOW** | **Time: Varies** | **Cost: FREE**

Google Travel pulls from:
- Google My Business (✅ Already done)
- Tour booking platforms (Viator, GetYourGuide, etc.)
- Schema.org markup (✅ Already done)

**Action:** Once listed on Viator/GetYourGuide, tours may appear in Google Travel automatically

---

### 13. Additional Schema Enhancements
**Priority: LOW** | **Time: 1-2 hours**

Add these schema types:
- **FAQ Schema** - Common questions about tours
- **Video Schema** - If you have tour videos on YouTube
- **Event Schema** - For scheduled tours
- **Breadcrumb Schema** - For better navigation in search results

---

## 🎯 RECOMMENDED PRIORITY ORDER

**Week 1 (Quick Wins):**
1. ✅ Bing Webmaster Tools (10 mins)
2. ✅ Apple Business Connect (15 mins)
3. ✅ Link TripAdvisor to schema (5 mins)
4. ✅ Yandex Webmaster (10 mins)

**Week 2 (Tourism Platforms):**
5. 📝 Klook listing (Asian market - HIGH value)
6. 📝 Viator listing (International bookings)
7. 📝 Tourism Malaysia registration check

**Week 3 (Directories):**
8. 📝 Malaysia.travel listing
9. 📝 Business directories (batch submission)
10. 📝 GetYourGuide listing

**Week 4 (Optimization):**
11. 📝 TripAdvisor widget on website
12. 📝 Additional schema enhancements
13. 📝 Monitor analytics and adjust

---

## 📊 TRACKING PROGRESS

**Current Status:**
- ✅ Google My Business: DONE
- ✅ Website Schema: DONE
- ✅ GMB Links Added: DONE
- ⏳ Bing Verification: Tag added, awaiting verification
- ⏳ Yandex: Not started
- ⏳ Apple Maps: Not started
- ✅ TripAdvisor: Listed (need to link in schema)
- ⏳ Viator: Unknown status
- ⏳ GetYourGuide: Unknown status
- ⏳ Klook: Unknown status

**Next Session Goals:**
1. Complete Bing verification
2. Add Yandex verification tag
3. Set up Apple Business Connect
4. Link TripAdvisor profiles to schema

---

## 📞 CONTACT INFO FOR PLATFORMS

**Search Engines:**
- Bing Webmaster: https://www.bing.com/webmasters
- Yandex Webmaster: https://webmaster.yandex.com/
- Apple Business: https://businessconnect.apple.com/

**Tourism Platforms:**
- Viator Suppliers: https://www.viator.com/suppliers
- GetYourGuide: https://supplier.getyourguide.com/
- Klook Partners: https://affiliate.klook.com/partner/supplier

**Malaysia Tourism:**
- Tourism Malaysia: https://www.tourism.gov.my
- MOTAC: https://www.motac.gov.my
- Malaysia.travel: https://www.malaysia.travel/

---

## 💡 NOTES

**NAP Consistency:**
Always use the same Name, Address, Phone format across all platforms. Inconsistent NAP data confuses search engines and hurts local SEO.

**Schema.org Benefits:**
Your existing schema.org markup works for:
- ✅ Google
- ✅ Bing
- ✅ Yandex
- ✅ Yahoo
- ✅ Baidu (China)

No need to create separate markup for each search engine!

**Commission-Based Platforms:**
Viator, GetYourGuide, and Klook charge 15-30% commission but provide:
- Pre-qualified customers ready to book
- No upfront costs
- International exposure
- Automated booking systems

**ROI Considerations:**
- Free listings (directories, GMB, etc.): Maximum exposure, zero cost
- Commission platforms: Pay only when you get bookings
- Focus on platforms where your target customers search

---

**Questions or need help with any platform?**
Reference this doc and tackle them one at a time. Each platform completed = more visibility and bookings!
