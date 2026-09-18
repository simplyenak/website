# Question Backlog — Simply Enak

Single place where customer/AI questions pile up before becoming content. Sources feed in, weekly triage promotes them into Payload `content_briefs` and then stories.

## Sources (how questions get here)

1. **AI citation gaps (automatic):** every Friday the weekly citation run rewrites `~/.hermes-website/seo-reports/ai-citation-gaps.json`. Questions where model families answered but never cited us. Triage those here.
2. **WhatsApp / booking emails:** any question asked by a real prospect goes in verbatim, with date. These outrank everything: real buyer language beats guessed keywords.
3. **Guide conversations:** questions guests ask on tour ("why is durian banned in hotels", "what do I order if I don't eat pork"). Add after each tour run.
4. **Review replies:** questions embedded in TripAdvisor/Google reviews and Q&A.

## Triage rules (weekly, 10 minutes)

- Question already answered well by a live page → skip, note the URL.
- Question with buyer intent and no page → promote to `content_briefs` in Payload, mark `promoted`.
- Question asked 3+ times in any source → priority, regardless of volume estimates.
- One page can absorb up to ~5 related questions (FAQ block). Group, don't fragment.

## Backlog

| # | Question | Source | First seen | Status | Notes |
|---|---|---|---|---|---|
| 1 | How much does a food tour in Kuala Lumpur cost? | AI gap (glm) + pricing play | 2026-09-08 | **draft in Payload** | `how-much-does-food-tour-kuala-lumpur-cost`, draft awaiting Maarten's review |
| 2 | Kuala Lumpur street food tour — which one to pick? | AI gap | 2026-09-07 | open | comparison angle, links to thingstodokualalumpur-style intent |
| 3 | Penang food tour — who runs the best one? | AI gap | 2026-09-07 | open | George Tour content exists? check cannibalization first |
| 4 | George Town street food tour — what do you eat? | AI gap | 2026-09-07 | open | dish-led page |
| 5 | Penang food guide — where do locals eat? | AI gap | 2026-09-07 | open | big head term; needs internal linking from tours |
| 6 | Durian tour Malaysia — where and when? | AI gap | 2026-09-07 | open | existing durian-season story covers timing; tour page covers where; maybe interlink fix |
| 7 | Durian tasting Kuala Lumpur — what does it cost? | AI gap | 2026-09-07 | open | could fold into pricing story v2 (Penang+KL) |
| 8 | When is durian season in Malaysia? | AI gap | 2026-09-07 | **content exists** | `durian-season-malaysia` live; models still don't cite it — check indexing + links to it |
| 9 | What to eat in Penang? | AI gap | 2026-09-07 | open | pillar candidate; satellite whattoeatinmalaysia.com overlap? |
| 10 | Kuala Lumpur food guide | AI gap | 2026-09-07 | open | pillar candidate |
| 11 | Food experiences Kuala Lumpur | AI gap | 2026-09-07 | open | category page might already target this |
| 12 | Things to do in Kuala Lumpur for food lovers | AI gap | 2026-09-07 | open | listicle on site |
| 13 | Kuala Lumpur and Penang food trip — how to plan? | AI gap | 2026-09-07 | open | multi-day angle = strategic (tours strategic per strategy map) |
| 14 | Is a food tour worth it in Kuala Lumpur? | AI pricing query | 2026-09-08 | open | FAQ section inside pricing story covers it; watch if it needs its own page |
| 15 | (space for first WhatsApp/real-customer question) | — | — | — | — |

## Notes

- Latest AI gap file: `~/.hermes-website/seo-reports/ai-citation-gaps.json` (rewritten every Friday 06:35 run).
- 2026-09-07 full run context: 6/20 cited, all by glm only. gpt/claude/gemini scores were 0 that run; some may be API failures, not true non-citations. Re-read `ai-citation-history.json` per-query error fields before treating a gap as final.
