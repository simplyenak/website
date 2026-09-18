# Content Gate Calibration — 2026-09-15

Question: do the word-count floors and the substance check actually predict
performance? Source: GSC page data 2026-03-01 → 2026-09-14 joined to the 145
ContentChecks rows (131 matched a GSC row). Re-run: `scripts/calibrate_content_gate.py`.

## By word-count band (clicks / impressions, whole window)

| body words | pages | clicks | impr | CTR |
|-----------|------:|-------:|-----:|----:|
| 1-149     | 11    | 1      | 62   | 1.61% |
| 150-299   | 7     | 24     | 2433 | 0.99% |
| 300-600   | 42    | 45     | 1664 | 2.70% |
| 600+      | 85    | 330    | 56523| 0.58% |

## By gate status

| status            | pages | clicks | impr  | CTR |
|-------------------|------:|-------:|------:|----:|
| pass              | 51    | 152    | 10667 | 1.42% |
| needs_optimization| 93    | 248    | 50015 | 0.50% |
| dropped           | 1     | 0      | 0     | 0%  |

## Read (verified conclusions)

1. **The word floor is directionally valid.** sub-150-word pages earned
   essentially nothing (1 click / 62 impressions over 5.5 months). 600+ word
   pages carry the bulk of clicks (330). Raising the stories floor from 300 is
   not indicated; the band is already discriminating at the low end.
2. **`pass` pages convert at ~3x the CTR of `needs_optimization` pages
   (1.42% vs 0.50%).** The gate DOES separate converting pages from
   non-converting ones — the strongest possible justification for the
   optimize-first rule on flagged pages.
3. **The flagged set has impression mass, not content failure.** 93 flagged
   pages earned 50k impressions and 248 clicks (more raw clicks than the 51
   pass pages). They are under-converting, not invisible. This confirms most
   `needs_optimization` today = CTR/title/snippet work on pages that already
   rank-and-earn, NOT "add words" or "delete."

## Actionable consequence

`needs_optimization` splits into two distinct jobs that should not be
conflated when triaging from Grist:
- **Thin** (word < floor, low impressions): quality problem → enrich or, if
  no operation behind it, drop-candidate.
- **Substance-flag only** (word ≥ floor, fails location/price/tip regex):
  intent/CTR problem → work the title, snippet, and price presentation; these
  pages already earn impressions and are often the money pages (tours, dietary/
  specialty landing pages). Do not treat "no RM in body text" as a deletion
  reason for a page that already gets impressions.