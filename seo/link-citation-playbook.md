# Link + Citation Playbook (from video findings, Sep 2026)

Two source videos: (1) agency link-building deep dive (link insertions, anchor parity), (2) AI-agent-era search (pricing transparency, citation optimization). This file maps their usable findings to what is actually implemented in this repo.

## Rejected on purpose

- **Paid links.** Speaker's own first line: violates Google spam policy. Simply Enak is building entity equity and knowledge-panel candidacy; a manual action is asymmetric risk. Same call as declining black-hat GBP. All outreach below is earned/comp/PR based.
- **Templated "variable" AI content at scale.** Commodity slop with extra steps. Non-commodity for us = founder specifics (names, years, dishes), which the brand rules already enforce.

## Implemented

| Finding | Artifact | State |
|---|---|---|
| Link insertions into trafficked, relevant pages (not guest posts) | `seo/link-targets.csv` — 22 targets (8 P1 food-tour listicles, 10 P2 KL food guides), all verified fetched, none mention Enak yet, 8 with contact email | live, outreach not started |
| Traffic criterion for links | SERP-surfaced (ranking for money queries = indexed + trafficked); `traffic_check_ahrefs` column = PENDING (no API key) | partial, honest |
| Anchor parity audit vs ranking competitors | `scripts/seo-automation/anchor-parity-audit.py` | written, UNTESTED until `AHREFS_API_KEY` added to site/.env |
| Transparent pricing ranges | Pricing story draft in Payload (`how-much-does-food-tour-kuala-lumpur-cost`, draft status) + `seo/drafts/how-much-does-food-tour-kuala-lumpur-cost.md` | awaiting Maarten's review, then publish + sync |
| AI visibility tracking | `scripts/ai-citation-check.py` (existed, weekly Fri 06:35 cron, Telegram) + 3 new pricing queries (now 23) | live |
| Gap-to-brief loop | citation run now rewrites `~/.hermes-website/seo-reports/ai-citation-gaps.json`; triaged in `seo/question-backlog.md` | live, first gaps seeded |
| Question mining from customers | `seo/question-backlog.md` — sources: AI gaps (auto), WhatsApp, booking emails, guide conversations | process live, needs feeding |

## The one-motion-two-payoffs note

Listicles that rank for "best food tours in Kuala Lumpur" are the same pages LLMs cite when recommending tours. Outreach for insertion gets the ranking link and the citation training data together. OTA-heavy SERPs (thingstodokualalumpur.com comparison page) also matter for the direct-vs-marketplace price story.

## Open blockers

1. ~~`AHREFS_API_KEY`~~ RESOLVED 2026-09-08: Ahrefs dropped. `scripts/seo-automation/anchor-parity-audit.py` now uses the DataForSEO API — the same engine that powers our self-hosted OpenSEO (seo.simplyenak.com, stack `open-seo_seo`). Key stored in site/.env per credential policy. Anchor parity uses `/v3/backlinks/anchors/live` (endpoint verified valid); `--traffic` mode fills link-targets.csv with referring-domain counts via `/v3/backlinks/summary/live`. BLOCKED ON CREDIT: the DataForSEO balance is **-$0.009** — all paid endpoints 402. Top up the account (info@simplyenak.com login) and both the script AND the OpenSEO web UI backlink pages revive. Note: only the Backlinks module is enabled on this account (dataforseo_labs endpoints 404), and seo.simplyenak.com sits behind Cloudflare Access.
2. Pricing story needs Maarten's fact-check on: OTA-vs-direct price claims (kept generic on purpose), neighbourhood names per tour, "small groups" phrasing.
4. Citation tracker engine health (2026-09-08 diagnosis): the Sep-7 "6/20" was effectively GLM-only — gpt (429/418 antibot), claude (429 cooldown), gemini (403/400) all circuit-breakered after 3 tries. Fixed: `auto/claude-sonnet` verified working and set as claude's first candidate. STILL BROKEN at gateway level: gpt family (github/gh 429, aug 502, ddgw antibot) and gemini family (400/403 on all candidates). Needs omniroute provider attention on the server (omniroute-troubleshooting skill). Until then the KPI trend is 2-of-4 families.
5. Outreach template ready at `seo/outreach-template.md`; GSC 28-day baseline snapshot in `.hermes/seo-reports/impressions-clicks/` for before/after comparison. Striking-distance anchors worth lifting via links: kampung-baru-food-tour (pos 8.0), durian-season-malaysia EN+NL (pos 5.6/6.1, leaky CTR), georgetown-night-food-durian (pos 8.7).
6. Pricing story is EN-only; stories collection is not localized. After publish, route through i18n pipeline or accept EN-only.

## Weekly loop (10 min)

1. Friday: citation run lands in Telegram; open `ai-citation-gaps.json`.
2. Triage gaps + new WhatsApp questions into `seo/question-backlog.md`.
3. Pick 1: promote to content_briefs or write FAQ section into existing page.
4. Outreach: 5 targets/week from `seo/link-targets.csv` P1 first; comped-tour angle, no paid links.
