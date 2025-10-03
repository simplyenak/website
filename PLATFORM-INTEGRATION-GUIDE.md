# Platform Integration Guide for Simply Enak
*Last Updated: 2025-10-03*

This document outlines all platforms where Simply Enak should be listed for maximum exposure and SEO benefits.

---

## ✅ Already Completed

### Google My Business
- **KL Location**: https://www.google.com/search?kgmid=/g/11_rl_t5r&q=Kuala+Lumpur+Food+Tours+by+Simply+Enak
- **Penang Location**: https://www.google.com/search?kgmid=/g/11f9xlvcb1&q=Penang+Food+Tours+by+Simply+Enak
- **Status**: ✅ Linked in schema.org markup
- **Action**: Keep profiles updated with photos, posts, and respond to reviews

### TripAdvisor
- **KL URL**: https://www.tripadvisor.com/Attraction_Review-g298570-d2328058-Reviews-Simply_Enak_Food_Experiences-Kuala_Lumpur_Wilayah_Persekutuan.html
- **Penang URL**: https://www.tripadvisor.com/Attraction_Review-g660694-d8400895-Reviews-Simply_Enak_Food_Experiences-Penang_Island_Penang.html
- **Reviews**: 150+ KL, 379 Penang (5-star rating)
- **Status**: ✅ Integrated in schema as aggregateRating and sameAs
- **Action**: Keep profiles updated and respond to reviews

### Viator
- **Penang Tour**: https://www.viator.com/tours/Penang-Island/Eat-Drink-Georgetown/d50882-17908P1
- **Status**: ✅ Added to schema sameAs
- **Action**: Check if KL tours are listed, add if needed

### GetYourGuide
- **Supplier Profile**: https://www.getyourguide.com/simply-enak-food-experiences-s4050/
- **Status**: ✅ Added to schema sameAs
- **Action**: Keep profile updated with latest tours

### WhatsApp Business API
- **Status**: ✅ Active with API
- **Action**: Ensure blue checkmark verification is active, optimize automated booking messages

---

## 🔧 In Progress (Add Verification Tomorrow)

### 1. Bing Webmaster Tools
- **URL**: https://www.bing.com/webmasters
- **Current Status**: Meta tag placeholder added to website
- **File Location**: `/home/maarten/website-optimization/frontend/src/components/SEO.astro:157`
- **Steps**:
  1. Go to Bing Webmaster Tools and sign in
  2. Add site: `https://simplyenak.com`
  3. Choose "HTML Meta Tag" verification
  4. Copy the verification code
  5. Replace `YOUR_BING_VERIFICATION_CODE` in SEO.astro
  6. Deploy and verify
- **Benefits**: Indexed on Bing search (2nd largest search engine)

### 2. Yandex Webmaster
- **URL**: https://webmaster.yandex.com/
- **Current Status**: Not yet added
- **Verification Methods**: Meta tag, HTML file, or DNS record
- **Steps**:
  1. Go to Yandex Webmaster and sign in
  2. Add site: `https://simplyenak.com`
  3. Choose verification method (recommend Meta tag)
  4. Add meta tag to SEO.astro: `<meta name="yandex-verification" content="YOUR_CODE" />`
  5. Deploy and verify
- **Benefits**:
  - Russia's #1 search engine
  - Popular in Eastern Europe and parts of Asia
  - Supports Schema.org LocalBusiness markup
  - Free

### 3. Apple Business Connect (Apple Maps)
- **URL**: https://businessconnect.apple.com/
- **Current Status**: Not claimed
- **Verification**: Phone call, SMS, or document upload
- **Steps**:
  1. Sign in with Apple ID
  2. Click "Add Location" for both KL and Penang
  3. Enter business details:
     - Name: Kuala Lumpur Food Tours by Simply Enak
     - Name: Penang Food Tours by Simply Enak
     - Address, phone, hours, etc.
  4. Verify via phone or document
  5. Add photos and description
- **Benefits**:
  - 100M+ iPhone users
  - Apple Maps integration
  - Siri recommendations
  - Free

---

## 📋 Tourism & Booking Platforms

### 4. Viator (TripAdvisor Experiences)
- **URL**: https://www.viator.com/
- **Current Status**: Unknown - check if already listed
- **Commission**: 20-30%
- **Steps**:
  1. Check if already listed (TripAdvisor may have auto-listed)
  2. If not, apply at Viator supplier portal
  3. Integrate with booking system or manual management
- **Benefits**:
  - 300,000+ experiences listed
  - TripAdvisor integration
  - Major booking platform

### 5. GetYourGuide
- **URL**: https://www.getyourguide.com/
- **Current Status**: Not listed
- **Commission**: 20-30%
- **Steps**:
  1. Apply at GetYourGuide supplier portal
  2. List all tours (KL and Penang)
  3. Integrate with booking system
- **Benefits**:
  - 140,000+ tours
  - 10,000+ cities
  - Alternative to Viator

### 6. Klook
- **URL**: https://www.klook.com/
- **Current Status**: Not found in search - need to verify if listed
- **Commission**: ~20-25%
- **Why Klook**:
  - HUGE in Asia-Pacific market
  - Popular with Chinese, Korean, Japanese tourists
  - Strong presence in Malaysia
- **Steps**:
  1. Check if already listed
  2. If not, apply at Klook merchant portal
  3. List tours for both locations

### 7. Expedia Local Expert
- **URL**: https://join.localexpertpartnercentral.com/
- **Current Status**: Not listed
- **Commission**: Variable
- **Benefits**:
  - 60M+ monthly visitors
  - Listed on Expedia, Orbitz, Travelocity, Hotels.com, etc.
  - 70% OTA market share
  - Bundle with hotels/flights
- **Steps**:
  1. Apply at Expedia Local Expert portal
  2. List all tours
  3. Tours appear across Expedia Group sites

---

## 🤖 AI Search & Messaging Platforms

### 8. WhatsApp Business API
- **URL**: https://business.whatsapp.com/products/business-platform
- **Current Status**: ✅ Active (API enabled)
- **Cost**: Variable (through provider like Twilio, MessageBird)
- **Benefits**:
  - Blue verification checkmark
  - Automated booking confirmations
  - 98% message open rate
  - 24/7 chatbot support
  - End-to-end encryption
  - Rich media (booking PDFs, maps, etc.)
- **Steps**:
  1. Choose API provider (Twilio, MessageBird, Wati, etc.)
  2. Apply for verification
  3. Set up automated messages for bookings
  4. Integrate with TicketingHub

### 9. Google RCS Business Messaging
- **URL**: https://developers.google.com/business-communications/rcs-business-messaging
- **Current Status**: Not set up
- **Cost**: Pay per message (varies by provider)
- **Benefits**:
  - Rich messaging on Android default SMS app
  - Branded sender with logo
  - Delivery & read receipts
  - Interactive booking buttons
  - Growing from $1.8B to $8.7B by 2029
- **Steps**:
  1. Partner with RCS provider (Twilio, Sinch, etc.)
  2. Get business verification
  3. Design rich message templates
  4. Integrate booking confirmations

### 10. AI Search Optimization (ChatGPT, Perplexity, Claude)
- **Current Status**: Schema.org already optimized for AI search
- **Benefits**:
  - AI search engines use schema.org to understand content
  - Perplexity, ChatGPT, Claude cite structured data sources
  - No registration needed - just good schema markup ✅
- **Action Items**:
  - Keep schema.org updated (already done)
  - Add FAQ schema for common questions
  - Add HowTo schema for tour preparation
  - Monitor AI search citations

### 11. SearchGPT (When Available)
- **URL**: https://openai.com/searchgpt
- **Current Status**: Limited prototype (not public yet)
- **Expected**: Full launch in 2025
- **Benefits**:
  - AI-powered search with citations
  - Will use schema.org markup ✅
  - Interactive search experience
- **Action**: Monitor for public launch, ensure schema is current

---

## 🇲🇾 Malaysia-Specific Directories

### 12. Tourism Malaysia Official Directory
- **URL**: https://www.tourism.gov.my/
- **Registration**: https://www.tourism.gov.my/index.php/industry/view/tourism-business-licensing-registration
- **Steps**:
  1. Ensure business is registered/licensed with MOTAC (Ministry of Tourism)
  2. Apply for MyTQA (Malaysia Tourism Quality Assurance) certification
  3. Get listed on official tourism.gov.my directory
- **Benefits**:
  - Official government recognition
  - High authority backlink
  - Legitimacy and trust
  - Free

### 8. Malaysia.travel
- **URL**: https://www.malaysia.travel/
- **Current Status**: Not listed
- **Steps**:
  1. Contact Tourism Malaysia to request listing
  2. Provide business details and tour information
- **Benefits**:
  - Official Malaysia tourism website
  - International visitor traffic
  - Free

### 9. Malaysia Business Directory
- **Examples**:
  - Business.com.my
  - Yellow Pages Malaysia
  - Yelllo.my
  - Malaysia Central
  - Find Malaysia
- **Steps**: Submit NAP (Name, Address, Phone) to each
- **Benefits**: Local SEO citations, backlinks

---

## 🔍 Search Engine Directories

### 10. Baidu Webmaster Tools (If targeting Chinese tourists)
- **URL**: https://ziyuan.baidu.com/
- **Language**: Chinese
- **Benefits**: China's #1 search engine
- **Note**: Requires Chinese language support

---

## 📊 Review Platforms to Claim/Monitor

### Already Active:
- ✅ TripAdvisor (150+ reviews)
- ✅ Facebook
- ✅ Instagram
- ✅ LinkedIn

### Should Claim:
- **Google Reviews** (via Google My Business) ✅
- **Yelp** (if available in Malaysia)
- **Foursquare**
- **TimeOut KL / Penang**

---

## 🛠️ Schema.org Enhancements

### Current Schema Includes:
- ✅ LocalBusiness with geo coordinates
- ✅ AggregateRating (5-star, 150 reviews)
- ✅ Service schema for tours
- ✅ Google My Business hasMap links
- ✅ Multi-location support (KL + Penang)

### To Add:
1. ✅ **TripAdvisor Profile URLs** to `sameAs` array - DONE
2. ✅ **Viator URLs** to `sameAs` - DONE
3. ✅ **GetYourGuide URLs** to `sameAs` - DONE
4. **Video schema** for YouTube tour videos
5. **FAQ schema** for common tour questions
6. **Event schema** for scheduled tours
7. **HowTo schema** for tour preparation guides

---

## 📝 Implementation Checklist

### Week 1 (This Week):
- [ ] Bing Webmaster verification
- [ ] Yandex Webmaster verification
- [ ] Apple Business Connect (both locations)
- [x] Get TripAdvisor profile URLs ✅
- [x] Check if already on Viator ✅
- [x] Add booking platform URLs to schema ✅

### Week 2:
- [ ] Verify Klook listing status
- [ ] Apply to Expedia Local Expert
- [ ] Malaysia.travel listing request
- [ ] Tourism Malaysia official directory
- [ ] Google RCS Business Messaging setup

### Week 3:
- [ ] Submit to 10+ Malaysia business directories
- [ ] Claim review profiles (Yelp, Foursquare, etc.)
- [ ] Add FAQ schema to website
- [ ] Add Video schema if have YouTube content

### Month 2:
- [ ] Consider Baidu if targeting Chinese market
- [ ] Add FAQ schema to website
- [ ] Add Video schema for YouTube content

---

## 🎯 Priority Order

**Immediate (Do Tomorrow):**
1. Bing Webmaster ✅ (tag already in code)
2. Yandex Webmaster
3. Apple Business Connect

**High Priority (This Week):**
4. Verify Klook listing (HUGE in Asia)
5. Tourism Malaysia official
6. Expedia Local Expert (massive reach)

**Medium Priority (Next 2 Weeks):**
7. Google RCS Business Messaging
8. Malaysia.travel
9. Business directories (bulk submit)
10. FAQ & Video schema

**Nice to Have:**
11. Baidu (if Chinese tourists are target market)
12. Additional review sites
13. HowTo schema for tour prep

**Already Completed:**✅
- Google My Business (both locations)
- TripAdvisor URLs in schema
- Viator URLs in schema
- GetYourGuide URLs in schema
- WhatsApp Business API active
- Bing verification tag added
- Tour pages have 5-star ratings

---

## 📞 Contact Information to Use

**Business Name (KL)**: Kuala Lumpur Food Tours by Simply Enak
**Business Name (Penang)**: Penang Food Tours by Simply Enak
**Phone**: +60 017 287 8929
**Email**: booking@simplyenak.com
**Website**: https://simplyenak.com

**KL Address**:
- Kuala Lumpur City Centre
- Kuala Lumpur, Federal Territory of Kuala Lumpur
- 50088, Malaysia
- Coordinates: 3.1570, 101.7123

**Penang Address**:
- Georgetown Heritage Area
- Georgetown, Penang
- 10200, Malaysia
- Coordinates: 5.4141, 100.3288

---

## 💡 Tips for Maximum Impact

1. **Consistent NAP**: Use exact same Name, Address, Phone across ALL platforms
2. **Photos**: Add high-quality food/tour photos to every listing
3. **Reviews**: Encourage customers to review on multiple platforms
4. **Updates**: Post regularly on GMB, Facebook for SEO boost
5. **Schema**: Keep `sameAs` array updated with all profile URLs
6. **Respond**: Reply to all reviews (positive and negative)
7. **Local Keywords**: Use "Kuala Lumpur food tour", "Penang food tour" consistently

---

## 📈 Expected Results

**After completing all listings:**
- 40-60% increase in organic search traffic
- Better visibility for "food tour Kuala Lumpur" searches
- More international bookings (via Klook, Viator, GetYourGuide)
- Improved local SEO rankings
- Higher trust/credibility with official listings
- Rich snippets in Google search results

---

## 🔗 Useful Resources

- Schema.org LocalBusiness: https://schema.org/LocalBusiness
- Google Search Console: https://search.google.com/search-console
- Bing Webmaster Tools: https://www.bing.com/webmasters
- Yandex Webmaster: https://webmaster.yandex.com/
- Apple Business Connect: https://businessconnect.apple.com/
- Tourism Malaysia: https://www.tourism.gov.my/

---

*Document maintained by: Simply Enak Team*
*Next Review Date: 2025-11-03*
