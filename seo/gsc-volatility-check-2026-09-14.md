# GSC Volatility Check — simplyenak.com

Date: 2026-09-14. Trigger: Joy Hawkins / Sterling Sky + Whitespark 8.1M-search study (Sep 2026) claiming organic rankings became 48.7% more volatile after the May 2026 core update, worst on explicit geo terms, and that static position reporting is dead. Question: does our own GSC data show the same pattern, and what should change in how we measure SEO?

Data: GSC API, sc-domain:simplyenak.com, daily query-level rows 2026-02-01 to 2026-09-13 (35,469 rows, 8,030 queries, dataState=all). Windows: PRE = Feb 1 to Apr 30, MAY = excluded as transition, POST = Jun 1 to Sep 13. Position stats use only days with >= 2 impressions; head-to-head needs >= 10 such days per window (40 queries qualified). Script: `scripts/gsc_volatility_check.py`.

## Verdict

Yes, the pattern is real on our money terms, and our data adds a sharper problem than volatility: position slip plus a zero-click reality below the top 3. Position-based reporting should be retired for geo head terms, as the study recommends, but for us the reason is stronger: those SERPs were barely paying out even before the update.

## Finding 1 — Volatility pattern matches the study's shape

Median per-query position std, POST vs PRE, by query class (40 head-to-head queries):

| class | n | std ratio (post/pre) | mean abs day-over-day move | share of queries >1.5x |
|---|---|---|---|---|
| tour + geo (money terms) | 8 | **1.34** | 3.4 → 4.3 ranks/day (+27%) | 37.5% |
| tour, no geo | 4 | 1.02 | 3.3 → 2.5 | 25% |
| informational | 16 | 0.66 (calmer) | 3.0 → 1.9 | 6% |
| other | 11 | 0.43 (calmer) | 2.1 → 1.1 | 9% |
| branded (control) | 1 | flat at #1 | 0.0 → 0.1 ranks/day | - |

Commercial geo terms got more volatile; informational and everything else calmed down; branded held #1 with std 0.2. Same shape as the study (US home services average +48.7%; our geo class +34% median). The selective pattern also rules out a site-wide cause: this is query-class behavior, not a Simply Enak penalty.

## Finding 2 — Money terms slipped position AND got swingier

| query | PRE pos (std) | POST pos (std) | PRE imp/clk | POST imp/clk |
|---|---|---|---|---|
| food tour penang | 2.9 (2.7) | 5.7 (7.3) | 219 / 9 | 308 / 15 |
| penang food tour | 7.6 (6.7) | 11.6 (9.8) | 356 / 8 | 763 / 10 |
| penang food tours | 8.3 (4.6) | 10.8 (5.7) | 440 / 2 | 696 / 3 |
| food tour kuala lumpur | 11.8 (5.1) | 16.6 (5.6) | 1,144 / 6 | 745 / 3 |
| kuala lumpur food tour | 9.8 (10.0) | 14.1 (8.1) | 98 / 0 | 184 / 4 |
| street food tour kuala lumpur | 20.1 (3.6) | 20.9 (10.9) | 28 / 0 | 80 / 0 |
| malaysia food tours | 14.9 (6.9) | 14.2 (2.3) | 1,009 / 0 | 815 / 1 |

"food tour penang" is the cleanest case: we held a tight top-3 (mean 2.9, std 2.7) before May; after, mean 5.7 with std 7.3 means daily positions swing roughly between 1 and 13. "penang food tour" day-over-day movement went from 7.2 to 10.4 ranks. A single rank check on any of these terms is now a coin flip, exactly as the study claims.

## Finding 3 — Top 3 or nothing: the click math

Seven head tour terms, PRE+POST combined: 8,013 impressions produced 61 clicks (0.76% CTR). At mean position 2.9 ("food tour penang" PRE) CTR was 4.1%; at 5.7 it fell to ~1.3-4% with high variance days; at 11-17 CTR is 0.1-0.5%, effectively zero. These SERPs are OTA and ads and AI Overview territory; organic positions 8+ pay nothing. Conclusion: fighting for position 8 to 12 on KL head terms was low-value before May and is lower-value now. The only organic positions worth competing for are top 3, and only "food tour penang" has ever held them.

## Finding 4 — Brand demand is the real growth signal

Branded impressions ("simply enak" + variants): Feb 48, Mar 83, Apr 48, May 69, then Jun 384, Jul 1,192, Aug 582, Sep (partial) 118. Brand held position 1.0 throughout (CTR 67-77%). Branded queries delivered 452 clicks, 16.8% of all site clicks from GSC, the largest single query cluster. Cause not yet attributed (i18n rollout, GBP, PR all candidates). This is the metric that feeds site quality per the conceptual-models skill, and it is the one to report weekly instead of positions.

## Finding 5 — Colony page reality check

"kampung baru street food" (POST only, new page): position 7.5, std 1.1, day-over-day 0.6 — very stable, 871 impressions. But 2 clicks (0.23% CTR). Colony pages win stability (niche SERPs, less OTA pressure) and impressions, but they are not click engines either. Their value must be judged on assisted conversion (WhatsApp/GBP calls), not clicks. Optimize-first rule (Maarten, 2026-09-14): a page that gets neither clicks nor leads first gets an optimization-opportunity check (title/snippet CTR vs expected for its position, intent match, retarget, consolidation, internal links). Drop only when optimization is not the right solution. Kampung Baru qualifies for that check: CTR at pos 7.5 is ~9x below the ~2% expected for that position. Pages with no real operation behind them (audit's Melaka/Ipoh/Klang class) have no optimization that fixes the claim, so for those the check is short and the answer is drop.

## Decisions this supports

1. Retire position-based reporting for geo head terms. Weekly GA4+GSC pipeline reports clicks, impressions, branded search volume, and inquiries instead.
2. Do not invest in chasing positions 8-17 on KL head terms. Either a credible top-3 push (Penang, where we have held it) or bottom-funnel specific pages (the 2026-09 content mandate).
3. Lead-source instrumentation becomes the primary SEO measurement: WhatsApp inquiry "how did you hear about us", GBP calls/direction requests, form source field. GSC clicks under-count actual demand (Joy Hawkins' GBP-calls example, our Kampung Baru page).
4. Brand demand (Finding 4) gets a dedicated weekly line in the report; identify what drove Jun-Jul.

## Caveats

- n = 40 head-to-head queries of 8,030; money-term class has 8. Directionally consistent, not a 8M-row study.
- GSC position is an impression-weighted daily average; volatility here mixes real SERP shuffling with impression mix. Both windows measured the same way, so the PRE/POST comparison is fair.
- May core update attribution is temporal, not causal.
- Study was US/Canada home services; this is MY travel. Magnitudes differ; shape matches.
- Sep is partial (13 days).

## Files

- `seo/gsc-volatility/gsc_query_daily_2026-02-01_2026-09-13.csv` — raw daily query rows
- `seo/gsc-volatility/volatility_summary.csv` — per-query PRE/POST stats, 40 head-to-head
- `seo/gsc-volatility/report_data.json` — class aggregates + site daily totals
- `seo/gsc-volatility/weekly_positions.svg` — chart: weekly positions + branded impressions
- `scripts/gsc_volatility_check.py` — re-runnable puller/analyzer (creds from service account file, no secrets in code)
