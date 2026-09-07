# Skill Feedback Proposals — 2026-09 (GSC 28d vs prior 28d)

Generated 2026-09-07 by `scripts/gsc-skill-feedback.py`. Data: `~/.hermes-website/seo-reports/skill-feedback-2026-09.json`.
**PROPOSALS ONLY — nothing applied. Maarten reviews all changes personally.**

## Data summary

Window 2026-08-08..09-04 vs 2026-07-11..08-07. Clicks 187 → 153. Impressions 20,949. Pages 284 (prev 269). No winners above threshold; 3 losers, 2 up-movers, 5 down-movers, 3 new entrants.

Verified on live site (curl, 2026-09-07): `/stories/faq-when-is-durian-season-in-malaysia` returns **hard 404, no redirect**, while `/stories/durian-season-malaysia/` (EN) exists at a new slug. The NL twin of the new slug entered GSC at position 4.6.

Skipped as noise (per rules): homepage loser (queries all branded: "simply enak", "simply enak food tours"); `/ms/` up (junk navigational queries: "rumah enak. com"); `/ms` down (irrelevant queries: "chatpatta chowk", "food in orland park"); `/directions` down (irrelevant queries: "66 east coast road", "camino near me"); `malaysian-chefs-local-cuisine` up (single page, +3.2 < 5, no pattern); `segments/food-tours-for-foodies-kuala-lumpur` down (85 impressions < 100, but cited below as corroboration only).

No `skill-feedback-2026-08.md` exists — first run of this loop, no dedupe needed. (17 older `gsc-striking-*.md` files exist from the other pipeline; unrelated.)

---

## Proposal 1 — target skill: `simplyenak-content-pipeline`

**Status: APPLIED 2026-09-07** (pitfall added to skill; 301 for en/nl/ms old slugs added to Worker REDIRECTS, commit 212a0a53).

**Lesson:** Renaming a story's slug without a 301 from the old URL shows up in GSC as a slow position/click bleed on the dead URL while the new URL starts from zero. The EN durian-season FAQ's "decline" this month is not a content problem — the URL 404s.

**Exact patch text to add** (to the story publish/sync section):

> Slug changes are migrations, not edits. When a story URL changes (e.g. `faq-when-is-durian-season-in-malaysia` → `durian-season-malaysia`), add a 301 old→new in the same deploy that publishes the new slug, then verify the old path returns 301 (not 404) before closing the task. GSC feedback loops cannot see content quality through a 404 — they just report decay.

**Evidence:**
- Page: `https://simplyenak.com/stories/faq-when-is-durian-season-in-malaysia` — live check: HTTP 404, no redirect. New EN slug `/stories/durian-season-malaysia/` live (200).
- GSC: position 7.1 → 12.4, clicks 2 → 0, 107 impressions. Top queries: "durian fruit season", "durian harvest malaysia", "desaru fruit farm durian".
- Supporting: NL twin `/nl/stories/durian-season-malaysia` entered at position 4.6 (6 clicks, 307 impressions) — the content itself still wins when the URL resolves.

## Proposal 2 — target skill: `simplyenak-seo`

**Status: APPLIED 2026-09-07** (section "Locale Pages Are Independent Ranking Assets" added to skill).

**Lesson:** Translated locale pages rank as independent assets for the same non-localized topics. Both new entrants that earned clicks this month are locale pages (nl, zh) pulling impressions on plain English-style topic queries — translated versions of proven EN winners add SERP surface rather than cannibalizing.

**Exact patch text to add:**

> Treat locale versions of proven stories as primary ranking assets, not compliance. When an EN story shows sustained impressions (durian season, Penang food guides), prioritizing its ms/zh/nl translations is a ranking play: locale pages enter SERPs independently (e.g. nl durian-season at 4.6, zh Gurney Drive guide at 9.0 for non-localized queries). Queue translations by EN impression volume, not alphabetical locale order.

**Evidence:**
- Page: `https://simplyenak.com/nl/stories/durian-season-malaysia` — new entrant, position 4.6, 6 clicks, 307 impressions. Top queries: "durian season malaysia 2026", "balik pulau durian season 2026", "durian season".
- Page: `https://simplyenak.com/zh/stories/food-guide-gurney-drive` — new entrant, position 9.0, 8 clicks, 395 impressions. Top queries: "gurney drive food", "gurney drive hawker centre", "gurney street food penang".

## Proposal 3 — target skill: `hook-and-headline-writing`

**Lesson:** On seasonal head terms, the SERP click goes to the page that visibly answers "when, this year". The durian cluster held position but lost half its clicks (CTR collapse at stable rank), and the one durian page that gained carried explicit season framing while the losing page's title ("8 Varieties Worth Paying For") answers a different intent.

**Exact patch text to add:**

> For seasonal topics, the title must answer the timing question and carry the current year where honest (e.g. "Durian Season in Malaysia (2026): Month-by-Month") — not a variety/taste angle. Check the top queries first: when the query family is "X season malaysia 2026" / "when is X season", a varieties-list headline holds rank but loses the click. Update the year in seasonal titles at the start of each season, not at rewrite time.

**Evidence:**
- Page: `https://simplyenak.com/stories/eating-durians` — position 8.2 → 8.0 (held), clicks 19 → 9 on 3,001 impressions (CTR ~0.63% → ~0.30%). Top queries: "durian malaysia", "durian", "durian d21". Live title: "Durian in Malaysia: 8 Varieties Worth Paying For" — no season/year framing.
- Page: `https://simplyenak.com/fr/stories/malaysia-durian-guide` — position 12.0 → 21.7, 101 impressions. Top queries: "dorian malaysia", "durain", "durian fruit in malaysia".
- Counter-case: winning query set is literally "durian season malaysia 2026" (NL page, position 4.6).

## Proposal 4 — target skill: `simplyenak-landing-page-designer`

**Lesson:** The whole commercial tour section slid ~8 positions on "best food tour in kl"-family queries while informational content held. Pattern: the hub and tour pages use descriptive titles ("Food Tours in Malaysia", "Kuala Lumpur Street Food | The Heart of KL Street Food") that don't match best/comparison intent — intent match must come from specifics (stops, areas, duration, what's included), never superlative claims (brand voice).

**Exact patch text to add:**

> For tour pages targeting "best food tour in <city>" queries: match the comparison intent with verifiable specifics in title and H1 coverage — number of stops, neighborhoods covered, tour length, tastings included — instead of descriptive-only headlines. Brand voice bans superlatives, so win the intent slot with concrete numbers (e.g. "Kuala Lumpur Street Food Tour: 8 Stops, 3 Neighborhoods, 4 Hours"). Keep hub pages above ~1,000 words of unique framing; a bare tour-link list loses position on commercial queries.

**Evidence:**
- Page: `https://simplyenak.com/tours` — position 10.9 → 19.2, clicks 12 → 4. Top queries: "simply enak food tours", "private tour", "best". Live main content: ~715 words (hub/list).
- Page: `https://simplyenak.com/tours/kuala-lumpur-street-food` — position 7.9 → 15.0, 316 impressions. Top queries: "best food tour in kl", "best local food tour in kuala lumpur". Live title matches "street food", not "best food tour".
- Corroboration (below noise threshold, not primary evidence): `/tours/segments/food-tours-for-foodies-kuala-lumpur` position 45.8 → 57.0 on the same query family.
- Contrast: informational pages held or gained (must-try-malaysian-street-food new at 10.1 with 1,848 impressions) — the drop is concentrated in commercial-intent pages.

---

## Items NOT proposed (evidence insufficient)

- `must-try-malaysian-street-food` (new entrant, 1,848 impressions): promising, but one month of data; revisit next cycle — if it holds, it becomes evidence for a listicle-format lesson in `simplyenak-content-quality`.
- Entity content (`malaysian-chefs-local-cuisine` +3.2): single page, no pattern yet.
