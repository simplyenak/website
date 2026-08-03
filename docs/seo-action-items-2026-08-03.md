# SEO Action Items — August 2026

## Simply Enak

### P0 — Fix Immediately (Requires Payload CMS Access)

**FAQ Duplicates**
- **Problem**: 7x identical "Can children join this tour?" in FAQPage schema
- **IDs to delete**: 30, 31, 32, 33, 34, 35
- **Keep**: ID 36 (or the one with `page_visibility: ['all']`)
- **Action**: Login to Payload CMS admin, delete 6 duplicates
- **Impact**: Removes schema markup errors, improves FAQ rich result eligibility

### P1 — High Impact Improvements

**Add Tour-Level Schema**
- **Problem**: Tour pages have 0 schema blocks
- **Fix**: Add `TouristAttraction` or `Event` schema to each tour page
- **Fields needed**: name, description, image, location, organizer, startDate (if applicable)
- **Impact**: Better SERP appearance, potential for event rich results

**Add Email Capture**
- **Problem**: No newsletter/signup form found on homepage
- **Fix**: Add email capture widget (Mailchimp, ConvertKit, or simple form)
- **Purpose**: Build audience signal for Google Discover
- **Impact**: Enables retargeting, builds direct traffic channel

**Improve CTR (Currently 0.93%)**
- **Problem**: 24K impressions but only 224 clicks
- **Fix**: Add price/rating to meta description
  - Current: "Small-group food tours in KL, Penang and Ipoh..."
  - Proposed: "Small-group food tours from RM285 | 5.0★ (76 reviews). Eat at family-run stalls with local guides."
- **Impact**: Expected CTR lift to 2-3%

**Add FAQ Schema to Tour Pages**
- **Problem**: FAQ schema only on homepage, not on individual tour pages
- **Fix**: Add relevant FAQ to each tour (e.g., "What's included?", "What to bring?")
- **Impact**: Better SERP appearance for tour-specific queries

### P2 — Medium Impact

**Internal Linking Optimization**
- **Current**: 132 links on homepage (good)
- **Improvement**: Add "Related Tours" section on each tour page
- **Impact**: Better crawlability, keeps users on site longer

**Add Breadcrumb Schema**
- **Problem**: No breadcrumb structured data
- **Fix**: Add `BreadcrumbList` schema to all pages
- **Impact**: Better SERP appearance with breadcrumb trails

**Story Content Strategy**
- **Current**: ~30 stories in sitemap
- **Recommendation**: Publish 3-5 stories/week for Google Discover
- **Topics**: Durian season (hot query), local food guides, cultural stories
- **Impact**: Discover traffic potential

## Culinary Travel Experts (CTE)

### P0 — Critical Missing Pieces

**GSC Integration**
- **Problem**: No Google Search Console verification tag found
- **Fix**: Add `<meta name="google-site-verification" content="...">` to head
- **Action**: Verify property at https://search.google.com/search-console
- **Impact**: Enable search performance tracking

**Add B2B Schema**
- **Current**: Only `Organization` schema
- **Add**:
  - `ProfessionalService` with `serviceType: "Tour Operator"`
  - `Offer` for corporate packages
  - `AggregateRating` (if reviews exist)
- **Impact**: Better B2B visibility

### P1 — Growth Opportunities

**Add Malay Version**
- **Problem**: Only English sitemap
- **Fix**: Add `/ms` locale for Malaysian B2B market
- **Impact**: Local presence, better trust with Malaysian partners

**Add Article Schema to Stories**
- **Problem**: No `BlogPosting` or `Article` schema on story pages
- **Fix**: Add schema with:
  - headline
  - image
  - author (Person schema)
  - datePublished, dateModified
  - publisher
- **Impact**: Eligibility for Google Discover, news carousels

**Email Capture for B2B**
- **Problem**: No lead capture for travel professionals
- **Fix**: Add "Register for FAM trips" or "Download destination guide" form
- **Impact**: Lead generation for B2B

## Scripts Ready to Run

Once Payload API credentials are provided, I can run:
```bash
# Delete FAQ duplicates
curl -X DELETE "https://cms.system.simplyenak.com/api/faqs/{id}" \
  -H "Authorization: users API-Key {token}"
```

**IDs to delete**: 30, 31, 32, 33, 34, 35
