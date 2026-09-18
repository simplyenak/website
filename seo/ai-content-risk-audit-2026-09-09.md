# AI Content Risk Audit — Simply Enak

Date: 2026-09-09. Method: mapped every claim in the "delayed collapse" video (Lily Ray 220-site study) against the live site. Evidence gathered from sitemap-index.xml, live page fetches, and site/src/data/content/ snapshots. Study verified real: lilyraynyc.substack.com, 220+ domains, Ahrefs + Sistrix, data as of May 2026. The video's numbers (54% lost 30%+, 39% lost half) match the source.

Update 2026-09-09: Maarten notes Simply Enak CAN run tours in the zero-tour cities (private, on request). The audit's test is not whether the capability exists, it is whether the page carries evidence of it. Decision matrix for those pages added under Action checklist, P1 item 1. Correction: vendors.json is empty (0 entries), so named-stall evidence exists in team knowledge, not in repo data yet.

## Live footprint (what Google sees)

- Total URLs in sitemaps: 1,514 (EN 182, each of 9 locales 148)
- Landing matrix: 19 location + 15 dietary + 12 specialty + 8 travel-type pages, each x 10 languages = 540 URLs
- Stories: 91 EN (8 FAQ-per-URL, 51 guides, 32 other) x 10 languages = 910 URLs
- Pagination URLs /stories/2/ through /stories/9/ in sitemaps x 10 = 80 junk URLs
- Real operations: 9 tours (7 published), all in KL and Penang. Meeting points: Pasar Seni, Pudu Jail Gate, Mydin Penang Road, Jalan Macalister, Oriental Building, Hilton Garden Inn North

## Point-by-point against the video

### 1. Programmatic location pages (video's "plumber in Sugarland")

**Verdict: partially guilty. The exact failure the video names is live on our site.**

- 7 live location pages show "0 tours available": Melaka, Ipoh, Klang, Chow Kit Market, Kampung Baru, Chowrasta Market, Gurney Drive
- Melaka, Ipoh, Klang have no Simply Enak tours, no meeting points, no operations at all. These are the Sugarland pages: a claim with nothing behind it
- Chow Kit and Kampung Baru are different: tours really do walk those neighborhoods (outreach copy says so), but the tour-to-location mapping in Payload does not tag them, so the pages render empty. Data bug, not a lie, but Google cannot tell the difference
- 6 "near-" pages (near-klia, near-kuala-selangor, near-subang-jaya, near-shah-alam, near-petaling-jaya, near-damansara) still exist in location-landing-pages.json but 404 live. Half-removed

### 2. FAQ farms (one question per URL, PAA-derived)

**Verdict: present, small scale.**

- 8 faq-* story URLs, titles are People-Also-Ask style questions ("Why do Malaysians eat with their hands"), one question per URL, x 10 locales = 80 URLs
- No FAQPage schema on them (one fingerprint absent), but the URL shape is the pattern
- Worse: duplicate intent. "do-malaysians-speak-english" and "faq-do-malaysians-speak-english" and "faq-does-malaysia-speak-english" are three URLs for one question

### 3. Programmatic language pages ("translated into a dozen languages off one template")

**Verdict: our biggest exposure.**

- Every page x 10 languages regardless of measured demand
- Worse than translation: /de/ and /ms/ faq story pages render the ENGLISH title and body inside a lang="de" wrapper (verified live). /ja/ version of the same story 404s. So we have locale URLs that are either English duplicates or missing
- This is the signature the video describes, in its weakest form: same content, multiplied, with a locale costume

### 4. Template overlap (the reproducibility test)

**Verdict: location pages currently fail the competitor test.**

- Pairwise vocabulary overlap between any two location pages: 61-74% (Jaccard). Roughly 1,200 words per page, only 60-110 words unique per city
- A competitor with our template could reproduce 90%+ of any location page tomorrow. The video's test: if yes, the page has no reason to exist
- The passing asset already in the repo: vendors.json (real stall data), guides (Maarten, Pauline), 5,000+ guests since 2011, real routes and prices. It is just not on the location pages

### 5. Best-of listicles and glossary content

**Verdict: borderline, saveable.**

- "must-try-malaysian-street-food", "11-foods-to-try-during-hari-raya", "malaysian-herbs-and-spices", "malaysian-egg-dishes-cooking-methods" are encyclopedic shapes. For a food tour brand they are on-topic, but they only survive the information-gain test if they carry our specifics (which stall, which guide, what it costs this year)
- No off-topic sprawl (no baby names). No competitor-alternative pages. One comparison page, not a farm. These templates are not our problem

### 6. GBP-bounded logic (page count from what the business does)

**Verdict: the bound exists and is clear, the site exceeds it.**

- Real bound: KL + Penang, the tours we run, the neighborhoods they walk, the dietary needs we actually serve
- EN core inside the bound is healthy: roughly 30-40 pages (tours, real neighborhoods, dietary pages backed by real menus)
- Outside the bound: 3 empty city pages, 6 dead near- pages, pagination, and 9 locale mirrors of everything

### 7. What AI should do vs what only we can do

- Our pipeline already uses AI for structure, syncing, translation drafts. That matches the video's "AI does the parts that don't require having been there"
- Missing: the non-reproducible inputs on landing pages. No vendor names, no RM prices from this year, no route specifics, no guide voices on the location pages sampled

## What we already do right

- Real business behind most pages: tours, meeting points, vendors, named guides
- No FAQ schema spam, no paid links (link playbook is earned/PR only), no off-topic content
- Stories are specific to us: dog meat, nyonya symbolism, Pahang food, hidden-meat-problem-vegetarian-kl. These pass the reproducibility test
- Brand entity building instead of template chasing

## Action checklist — execution status 2026-09-09

**P1, this week (stop the bleeding)**

RESOLVED 2026-09-09 with operational truth from Maarten: Penang and KL run join-in AND private. Ipoh, Melaka, Bukit Mertajam, Klang run private only. The near- suburbs (KLIA, Kuala Selangor, Subang Jaya, Shah Alam, PJ, Damansara) are NOT served, stay deleted.

Tier map:
- Tier 1, join-in + private, full listing pages: KL, Penang and their real neighborhoods. Fix content depth (P2 item 8)
- Tier 2, private on request, new page variant WITHOUT the join-in booking module and WITHOUT "from RM285/pax" join-in pricing (show private rate or enquire): Ipoh, Melaka, Klang, NEW Bukit Mertajam page (no page exists yet, add via Payload + segments.js), Gurney Drive (Penang private only, no scheduled tour walks it)
- Tier 0, deleted: the 6 near- pages

1. DONE (code level, better than Payload tags): root cause was SegmentPage ignoring the curated segment.tours lists in segments.js and using a fuzzy city-substring matcher (content.ts tourMatchesTag). Pages whose slug lacked the city name got 0 tours (Chow Kit, Kampung Baru, Chowrasta, Gurney); Georgetown over-matched to 6. Fix: SegmentPage now resolves segment.tours by slug via new getToursBySlugs(); fuzzy matcher remains fallback for segments without curated lists. Also fixed stale slug secrets-of-kl-nightlife → secrets-of-kl-nightlife-street-art-and-cocktails in KL and Malaysia lists. Verified in local build: chow-kit 2, kampung-baru 1, chowrasta 2, georgetown 2 (was 6), gurney 1, pudu 1, chinatown 2, KL 3, Malaysia 5, melaka/ipoh/klang 0 by design
2. DONE: all 6 near- pages deleted from Payload landing_pages (58 → 52 docs, verified 0 remaining) and pruned from location-landing-pages.json (23 → 17). No redirects needed: pages were never deployed (not in live sitemap, 404 since creation). Check GSC for any crawled-404 noise later. Note: npm run sync merge never deletes docs removed from Payload, stale entries must be pruned manually
3. DONE (interim): sticky mobile CTA no longer shows "From RM 285/pax / 0 tours available / Book Now" on zero-tour pages. Shows "Private tour, on request / Designed around your group / Chat with Us" (WhatsApp). Existing "A Tour Built Around You" tailored section carries the body. Full private page (named stops, private rate, lead time, proof) awaits seo/private-city-evidence-sheet.md input from Maarten
4. EXECUTED 2026-09-09: speak-English trio consolidated. Kept stories/do-malaysians-speak-english (2,224w real article). Deleted faq-do-malaysians-speak-english (id 302) and faq-does-malaysia-speak-english (id 303) from Payload — verified only the full article remains for this topic. stories.json 101→99 (sync reflected the deletion). 20 redirects added to Worker REDIRECTS map (EN + 9 locale variants, all to EN canonical; no locale variants of the target exist). REDIRECTS live in site/workers/cdn-rewriter.js — LOCAL ONLY until commit+push (CI deploys the Worker). Remaining 6 faq-* stories quantified, all 28-42 word shells: faq-why-do-malaysians-eat-with-their-hands (34w), faq-what-is-the-food-culture-like-in-malaysia (36w), faq-what-is-included-in-a-malaysian-food-tour (36w), faq-how-much-does-a-food-tour-cost-in-malaysia (38w), faq-what-is-the-most-popular-street-food-in-malaysia (38w), faq-where-can-i-find-the-best-street-food-in-kuala-lumpur (42w). Recommendation: fold answers into /faq page + 301s = 60 URLs removed. Content decision: Maarten's call, not executed.
5. FIXED: /stories/N/ pagination in sitemaps. Root cause: sitemap filter regex /\/stories\/\d+$/ never matched trailing-slash URLs (/stories/2/ passed through), so ~80-110 junk URLs across 10 locales. Fixed to /\/stories\/\d+\/?$/ in astro.config.ts. Verification: pre-fix dist sitemap-en.xml contained stories/2 through stories/11

New defects found during execution:
- flavours-of-malaysia whatsIncluded/whatsExcluded render Portuguese on the EN page ("Guia local falando inglês"). Payload data bug, fix in Payload admin (Maarten reviews content personally)
- Build verified locally only. Changes uncommitted in site/: src/lib/content.ts, src/components/segment/SegmentPage.astro, src/components/LandingPageSections.astro, src/data/segments.js, src/data/content/location-landing-pages.json (+ 32 other snapshot files refreshed by npm run sync from Payload)

**P2, this month (demand-gated i18n)**
6. Pull GSC impressions/clicks by language target + GA4 users by language. Keep locales with real demand; for the rest, cut the locale URLs and hreflang entries entirely. An English body in a German wrapper is worse than no German page
7. Fix the EN-fallback rendering bug so no locale URL ships English content
8. Rewrite the 10 highest-traffic location and dietary pages: push unique share from 5% toward 40%. Modules that only we can write: named stalls from vendors.json, this-year RM prices, route with meeting point, guide by name, what we order and in what sequence

**P3, ongoing (the gate)**
9. Run the competitor reproducibility test on every new page before publish: could a competitor reproduce this tomorrow with the same prompt? If yes, it needs our inputs or it does not ship. Add to the content judge loop
10. Audit the 91 stories against GSC once a quarter: keep what earns impressions or conversions, prune the rest. Narrow beats wide in both 2023 and 2026 recoveries
11. Sitemap hygiene: sitemaps list only URLs that exist with real content (ja 404 in sitemap class of bug)

## Bottom line

We are not running an AI content farm. But we have three of the eight templates at low intensity (empty city pages, FAQ-per-URL, language multiplication), our location pages fail the reproducibility test on overlap alone, and the locale pages are half-translated at best. The fix is not less content, it is bounding pages to what Simply Enak actually operates and loading them with the stall-level detail only we have. That is also the cheapest content we own.
