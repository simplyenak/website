# Design: Translation Completion + Staging Deployment
_Date: 2026-03-29_

## Problem

8 content JSON files have zero non-English translations, making non-English routes
(`/ms/`, `/zh/`, `/de/`, etc.) fall back silently to English for entire pages.
The translation system is already wired up correctly — `applyTranslation()` in
`directus.js` merges a `translations[]` array into each item at build time.
The gap is purely missing data in those arrays.

## Approach: Two-tier parallel swarm + staged deployment

### Tier 1 — High-priority conversion pages (5 files)

| File | Reason |
|---|---|
| `private-tours-page.json` | Primary conversion page |
| `join-in-tours-page.json` | Primary conversion page |
| `track-record-page.json` | Trust signal |
| `how-to-prepare-page.json` | Pre-booking anxiety reduction |
| `directions-page.json` | Practical logistics |

### Tier 2 — Content / secondary pages (3 files)

| File | Reason |
|---|---|
| `stories-index-page.json` | Content discovery |
| `stories-archive-page.json` | Content discovery |
| `corporate-groups-page.json` | Corporate segment |

### Languages
`ms zh de es fr nl ru ja pt` (9 languages; English stays as base content in the file)

### Translation method
Each agent reads the English base fields from the target file, generates translations
for its assigned language, and patches the `translations: []` array in-place.
Format matches existing translated files (home-page, tours, stories, etc.).

### Brand voice rules for agents
- Preserve specific names: Aunty Lim, Uncle Chen, Kampung Baru, dish names
- Translate meaning faithfully — warm and personal, not formal brochure-speak
- Never inject forbidden words in any language: authentic, luxury, discover, unique, best

---

## Workflow & Human Checkpoints

```
ruflo init (revamp/)
    │
    ▼
TIER 1: Parallel swarm — 9 agents × 5 pages
    │
    ▼
⏸ CHECKPOINT 1: Human reviews sample files (2-3 pages × 2-3 languages)
    │ approve → continue  │  revise → re-run specific agent
    ▼
git commit + push main → staging auto-deploy (CF Pages)
    │
    ▼
⏸ CHECKPOINT 2: Human checks staging.simplyenak.com in 2-3 languages
    │ approve → continue  │  issues → fix before Tier 2
    ▼
TIER 2: Parallel swarm — 9 agents × 3 pages
    │
    ▼
⏸ CHECKPOINT 3: Human reviews sample
    │ approve → commit + push
    ▼
⏸ CHECKPOINT 4: Production deploy — MANUAL only via GitHub workflow_dispatch
```

---

## Files changed

- `frontend/src/data/content/private-tours-page.json`
- `frontend/src/data/content/join-in-tours-page.json`
- `frontend/src/data/content/track-record-page.json`
- `frontend/src/data/content/how-to-prepare-page.json`
- `frontend/src/data/content/directions-page.json`
- `frontend/src/data/content/stories-index-page.json`
- `frontend/src/data/content/stories-archive-page.json`
- `frontend/src/data/content/corporate-groups-page.json`

## Out of scope (this iteration)
- `legal-pages.json` — acceptable to stay English
- `vendors.json`, `social-proof.json`, `navigation.json` — low user impact
- Production deployment — always manual
