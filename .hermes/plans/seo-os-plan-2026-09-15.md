# SEO Operating-System Plan (Grist + Hermes + DataForSEO) — 2026-09-15

Source: two "Hermes for SEO" videos (1: Rank Math dashboards; 2: full Hermes SEO-agent setup)
reviewed against our real setup. Decisions below are ours, not the videos'.

## What we already have (do NOT rebuild)

- VPS-hosted Hermes (Hetzner/Dokploy Swarm; their Hostinger KVM2 setup is ours, better spec'd)
- Telegram bot as command channel
- GSC + GA4 via service accounts (`~/.google/credentials/gsc-key.json`, GA4 property-level access)
- Night work while we're away: daily GSC/GA crons, Monday weekly reports (combined GSC+Bing)
- Grist "Website" doc (`nNS1MDqZnRLoeASAdLESkA`, workspace 3): Sites, WeeklySnapshots, DailyTraffic,
  TopPages/TopQueries10, GSCQueries, GSCPages, Channels, Goals, SiteOverview (cross-site rank
  formulas), Opportunities (scored striking-distance/CTR-gap/protect, Action col), Projects,
  ColonyPages, BingSnapshots.
- Content pipelines: striking-to-colony bridge, PAA factory, colony auto-inject, ranking-response
  v2, assumption validator, gsc-auto-index.

**Ignore from the videos:** Rank Math plugin dashboards (WordPress-only — we're Astro+Payload),
the MCP token-burn workflow (our cron+Grist does the same for cents), Hostinger/OpenRouter
setup, Chinese-model cost tips (we route our own models; free-tier preference stands).

## Gaps (verified 2026-09-15)

1. **DataForSEO account has $0 credit** — live `/v3/backlinks/summary/live` call from
   `open-seo_seo` container returns task-level `40200 Payment Required` (auth OK, no credit).
   Pay-per-task; ~$10–20 top-up funds both domains for months. Blocks: backlink/anchor
   dashboards + competitor keyword gaps.
2. **No competitor data** — `GSCQueries` holds only OUR queries. Nobody tracks what
   KL/Penang tour operators rank for that we don't.
3. **Backlink/anchor audit is dead-on-arrival** — `backlink-audit.py` runs GSC branded-share
   + Common Crawl always; anchor section SKIPs without Moz; DataForSEO would replace both but
   the account is unfunded.
4. **No content pipeline Kanban in Grist** — Opportunities is a flat scored list. The video's
   "toggle 30/60/90 buckets" dashboard = Grist kanban widget over a pipeline table. Not built.
5. **No draft → approval → publish loop** — PAA factory auto-publishes 2 stories/day to
   Payload; user mandate is "reviews content personally, no agent auto-fix", and the
   General-Templates PAA output failed the content-value audit (2026-07-23). The video's core
   idea (agent drafts ~60%, asks the owner experience questions, waits for approval, then
   publishes + indexes) is missing — everything we have auto-publishes.
6. **No GSC×DataForSEO cross-check** — his demo: "ranked keywords for domain in market X"
   validates GSC data externally. Cheap one-off monthly check.

## Plan (phases, dependencies marked)

### Phase 1 — Grist pipeline Kanban (no spend, ~2–3h)
- New table `ContentPipeline`: Query, Url (or planned slug), Source (striking/paa/colony/
  manual), Bucket (30/60/90 days — seeded values), Status (todo/drafting/awaiting-approval/
  approved/published/dropped — seeded), Score, Ref (story id or task ref), DraftPath,
  PublishedUrl, PublishedAt, Notes.
- Attach community kanban widget (`varamil.github.io/grist-widget/kanban2/min/index.html`),
  lanes = Status, Access = Full document access (widgets that write need it — grist-ops).
- Cron: `gsc-striking-distance.py --colony-json` output → upsert new opportunities into
  ContentPipeline (todo, bucket by score band), dedupe against existing.
- Verify with GET records after write (grist API read-back rule).

### Phase 2 — Fund DataForSEO (user decision: $10–20 top-up)
- Top up the account whose key sits in `open-seo_seo` env (login info@simplyenak.com).
- Replace backlink-audit.py's SKIP section with DataForSEO anchors+summary (same Dooley
  ratios); monthly cron.

### Phase 3 — Competitor + backlink Grist tables (after Phase 2)
- `Competitors` (Domain, Name, Role, Notes): seed 2–3 KL/Penang tour operators.
  Blue-ocean rule: they clarify direction only, never copy/attack; white-hat data pulls only.
- `CompetitorKeywords` (Competitor ref, WeekStart, Keyword, Position, Volume): weekly
  DataForSEO keyword-research pull per competitor (market MY; lang EN + MS).
- Gist formula/filter view: competitor keyword NOT in `GSCQueries` (last 28d) = our gap
  list; gaps feed ContentPipeline with Source=manual.
- `ReferringDomains` + `AnchorProfile` fed by backlink-audit.py monthly.
- Ranked-keyword cross-check (his demo): monthly DataForSEO domain-overview pull for
  simplyenak.com in MY/EN+MS → Grist `Validation` rows; flag divergence vs GSC >20%.

### Phase 4 — Approval-gated content loop (biggest differentiator, after Phase 1)
- Monday cron: pick top 1–2 ContentPipeline todo rows → LLM draft (brand-voice gate,
  content-quality gate, Google-Maps-place rule for location content, reproducibility test:
  "would a competitor + same prompt produce this?") → post draft + 3–5 owner-experience
  questions to Telegram/Buzz → WAIT for Maarten's answers → incorporate → Payload create
  → `gsc-auto-index.py` → mark published + fill PublishedUrl/PublishedAt.
- PAA factory: gate the auto-publish path — only TOPIC_ANSWERS (curated, passes value
  audit) may auto-publish; GENERAL_TEMPLATES output must route through Phase 4 approval.
  (Or park the factory entirely until Phase 4 works; decision at build time.)
- Everything lands in Grist so the wallboard/kanban is the single source of truth.

### Phase 5 — Reporting add-ons (cheap, after Phase 1)
- Weekly combined report (cron dbc89edca077) gains 3 lines: competitor top-5 gaps,
  pipeline state (n awaiting approval, n published this week), DataForSEO validation delta.
- Grist SiteOverview + kanban remain the browser dashboards (his "3 dashboards" = ours,
  plus kanban).

## Explicitly deferred / parked
- 499/TTFB edge-cache + llms.txt items from Mike-King lessons (⬜ in skill) — separate
  workstream, not part of the video response.
- Multi-client "SEO OS" (his community repo) — we manage our own sites + CTE; Grist
  multi-site views already cover it; his repo would be a duplicate.
- Rank Math MCP — no WordPress, no use.

## Status
- [ ] Maarten: fund DataForSEO ($10–20) — gate for Phases 2–3
- [ ] Phase 1 build (Grist ContentPipeline + kanban + cron feed)
- [ ] Phase 4 build + PAA gate decision
- [ ] Phase 5 report add-on
