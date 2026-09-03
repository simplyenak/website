# New-Site Portfolio Strategy — whatcanieatinmy.com + What to Eat in Malaysia

Created 2026-09-02 (autonomous run). Status: GA4 live on both; GSC pending one manual enable (see Blockers).

## Portfolio map (hub + spoke + satellites)

| Site | Role | Audience | Job |
|---|---|---|---|
| simplyenak.com | HUB, brand | Travelers | Bookings, brand, entity home |
| culinarytravelexperts.com | B2B spoke | Agents, DMCs | Trade knowledge, zero keyword overlap |
| whenisdurianseason.com | Satellite | Travel planners | Linkable live-data asset, 301 later |
| whatcanieatinmy.com | Satellite | Restricted-diet travelers | Linkable tool; links -> hub tours |
| whattoeatinmalaysia.pages.dev | Satellite (monetizing) | Food travelers | Checklist + state guides + packages; affiliate + paid guides |

Rule kept from multi-domain-brand-seo: satellites NEVER target the hub's keywords. They own question-intent queries ("can vegetarians eat...", "what to eat in penang") and pass relevance + link equity upward.

## Amplification mechanics (how they feed each other)

1. Cross-links, contextual not footer:
   - whatcanieatinmy.com restriction pages -> "taste these safely with a guide" -> simplyenak.com tour pages (deep links, per-diet where possible)
   - WTM state guides -> whenisdurianseason.com (seasonal fruit sections) and -> simplyenak.com KL/Penang/Melaka tours
   - simplyenak.com blog food-stories -> both tools as "plan your own checklist" references
   - CTE FAM/destination guides -> WTM state guides as client-facing resources (B2B citing B2C asset builds both)
2. Entity wiring (Knowledge Panels project): every satellite publisher schema = @id simplyenak.com/#organization. One brand, many front doors.
3. GA4 cross-domain: each site has its own property (clean per-site data), and simplyenak.com property can add the satellite domains via Data Streams > "Define recommended / linked domains" later once traffic justifies it.
4. Content flywheel: WTM guides produce dish-level pages -> whatcanieatinmy turns same dishes into diet-filtered pages -> hub tours cite both. One Payload dishes collection already feeds both (push/sync scripts exist in both repos).

## Analytics — DONE (live-verified)

| Site | GA4 property | Measurement ID | Verified in HTML |
|---|---|---|---|
| whatcanieatinmy.com | properties/552457954 "What Can I Eat In My" | G-SQTJJ9Y18R | yes (curl, custom domain) |
| whattoeatinmalaysia | properties/552447111 "What to Eat in Malaysia" | G-BR426YRT1T | yes (curl, pages.dev) |

Account 26461363. gtag added to Default.astro of both, built, deployed via wrangler.

## Sitemaps — DONE (live-verified)

- whatcanieatinmy.com/sitemap.xml (home + restriction pages)
- whattoeatinmalaysia.pages.dev/sitemap.xml (home, guides index, state guides, packages, login)
- Generated at build: src/pages/sitemap.xml.ts in both repos.

## GSC — DONE (live-verified 2026-09-03)

Site Verification API enabled by Maarten. Both domain properties verified via DNS TXT (records added through CF API), sitemaps submitted and already downloaded by Google, 0 errors:
- sc-domain:whatcanieatinmy.com — 9 URLs submitted
- sc-domain:whattoeatinmalaysia.com — 20 URLs submitted
Obsolete pages.dev URL-prefix property deleted.
