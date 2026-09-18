# Branded Demand Surge — Attribution Note (2026-09-15)

Question: what drove the June-Aug 2026 jump in branded impressions?

## Data (GSC, queries for "simply enak")

| month   | impressions | clicks | CTR |
|---------|----:|----:|----:|
| 2026-02 | 37  | 28  | 76% |
| 2026-03 | 73  | 47  | 64% |
| 2026-04 | 41  | 30  | 73% |
| 2026-05 | 64  | 39  | 61% |
| 2026-06 | 374 | 90  | 24% |
| 2026-07 | 1162| 118 | 10% |
| 2026-08 | 537 | 80  | 15% |
| 2026-09 | 94  | 20  | 21% |  (to Sep 13)

## Read

The leading hypothesis is **impression inflation from the locale expansion, not
a real demand spike.**

- Impressions multiplied ~7-10x (37-73 → 374/1162/537) while clicks only
  ~2-4x (28-47 → 90-118) and CTR collapsed from ~65-75% to ~10-24%.
- If travelers were actively searching the brand more, clicks would rise with
  impressions and CTR would stay high. Instead CTR tanked — the extra
  impressions are low-surface: newly-indexed locale URLs and brand-term
  matches that render but don't convert. That timing aligns with the i18n
  multi-locale rollout.
- This shrinks, not grows, the "brand demand is booming" reading. The earlier
  volatility write-up treated the branded jump as the strongest signal —
  correct that it is the largest CLICK cluster, but do not read the impression
  surge as new demand.

## Confidence / caveat

Query-level only — the underlying page dimension was not fetched. To confirm
the mechanism (which pages get the branded impressions: homepage vs locale
URLs), pull GSC with dimensions ["query","page"] filtered to "simply enak".

## Action

Do not market to "growing brand demand." Keep the brand as the top-click
cluster and continue the direct/brand weight, but attribute the whole-window
impression jump to content/locale breadth. Re-measure after a full quarter
of stable i18n.