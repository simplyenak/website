# Translation Completion + Staging Deployment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Generate 9-language translations for 8 missing content pages, deploy to staging, verify, then prepare for production.

**Architecture:** Each content JSON in `frontend/src/data/content/` has a `translations: []` array. `applyTranslation()` in `directus.js` merges the right language at build time. We patch that array for each missing file. No code changes needed — data only.

**Tech Stack:** Astro SSG, Cloudflare Pages, JSON content snapshots, ruflo orchestration, parallel Claude subagents for translation generation.

---

## Before you start

**Reference files** (use these to understand the expected format):
- `frontend/src/data/content/home-page.json` — well-translated singleton page example
- `frontend/src/data/content/tours.json` — well-translated collection example
- `frontend/src/lib/directus.js:97-114` — `applyTranslation()` function

**Translation rules for all agents:**
- Preserve proper nouns: Simply Enak, Aunty Lim, Uncle Chen, Kampung Baru, Chow Kit, George Town, TicketingHub
- Preserve dish names (char kway teow, nasi lemak, cucur udang, etc.) — do NOT translate them
- Preserve URLs, hrefs, emoji, and JSON structure fields
- Tone: warm, personal, direct — NOT formal travel-brochure language
- Never use the target-language equivalents of: authentic, luxury, discover, unique, best, #1

**Languages:** `ms` (Bahasa Malaysia), `zh` (Chinese Simplified), `de` (German), `es` (Spanish), `fr` (French), `nl` (Dutch), `ru` (Russian), `ja` (Japanese), `pt` (Portuguese)

---

## Task 1: Initialize ruflo

**Files:**
- Creates: `.ruflo/` config in `/var/home/maarten/website-optimization/revamp/`

**Step 1: Run ruflo init**

```bash
cd /var/home/maarten/website-optimization/revamp
ruflo init --minimal
```

Expected: `.ruflo/` directory created, no errors.

**Step 2: Verify**

```bash
ruflo status
```

Expected: status output showing ruflo is initialized.

**Step 3: Commit**

```bash
git add .ruflo/
git commit -m "chore: initialize ruflo orchestration"
```

---

## Task 2: Tier 1 — Translate `private-tours-page.json`

**Files:**
- Modify: `frontend/src/data/content/private-tours-page.json`

**Fields to translate** (21 fields):
`seo_title`, `seo_description`, `hero_title`, `hero_highlight`, `hero_subtitle`, `why_title`, `why_subtitle`, `audiences_title`, `inclusions_heading`, `on_every_tour_label`, `private_extras_label`, `pricing_heading`, `pricing_body`, `pricing_cta_whatsapp`, `pricing_cta_whatsapp_message`, `pricing_cta_message`, `available_privately_heading`, `available_privately_subtext`, `corporate_callout`, `corporate_cta_text`

> Skip: `corporate_cta_href` (URL — do not translate)

**Step 1: Read current English content**

Read `frontend/src/data/content/private-tours-page.json` and extract the 20 fields above.

**Step 2: Dispatch 9 parallel translation agents**

Each agent receives:
- The English source values for all 20 fields
- Their target language code and language name
- The translation rules from "Before you start"
- Instructions to return a JSON object: `{ "languages_code": "<lang>", "<field>": "<translation>", ... }`

**Step 3: Collect results and build translations array**

Combine the 9 language objects into the `translations` array. Assign sequential IDs starting from 1.

Example structure:
```json
{
  "translations": [
    {
      "id": 1,
      "languages_code": "ms",
      "seo_title": "...",
      "hero_title": "...",
      ...
    },
    {
      "id": 2,
      "languages_code": "zh",
      ...
    }
  ]
}
```

**Step 4: Patch the JSON file**

Read the file, set `data.translations = <new array>`, write back with 2-space indent.

**Step 5: Verify JSON is valid**

```bash
python3 -c "import json; json.load(open('frontend/src/data/content/private-tours-page.json')); print('OK')"
```

---

## Task 3: Tier 1 — Translate `join-in-tours-page.json`

**Files:**
- Modify: `frontend/src/data/content/join-in-tours-page.json`

**Fields to translate** (13 fields — skip JSON blob fields):
`seo_title`, `seo_description`, `hero_title`, `hero_highlight`, `hero_subtitle`, `how_it_works_title`, `how_it_works_subtitle`, `solo_heading`, `solo_body`, `solo_testimonial_quote`, `solo_testimonial_attribution`, `all_tours_heading`, `all_tours_subtext`, `faqs_heading`

> Skip: `what_it_means_json`, `faqs_json` — these are JSON blobs with nested structure; leave untranslated for now (English fallback is acceptable).

Follow the same Step 1–5 pattern as Task 2.

---

## Task 4: Tier 1 — Translate `track-record-page.json`

**Files:**
- Modify: `frontend/src/data/content/track-record-page.json`

**Fields to translate** (7 fields):
`seo_title`, `seo_description`, `hero_title`, `hero_highlight`, `hero_subtitle`, `philosophy_quote`, `how_we_work_eyebrow`

> Note: `hero_title` is "14 Years of People Who Trusted Us With Their Table" — translate the words but keep "14 Years" as a numeral.

Follow the same Step 1–5 pattern as Task 2.

---

## Task 5: Tier 1 — Translate `how-to-prepare-page.json`

**Files:**
- Modify: `frontend/src/data/content/how-to-prepare-page.json`

**Fields to translate** (12 fields):
`seo_title`, `seo_description`, `hero_title`, `hero_highlight`, `hero_description`, `what_to_wear_heading`, `what_to_bring_heading`, `what_to_expect_heading`, `dietary_heading`, `dietary_intro`, `dietary_note`, `directions_cta_text`, `directions_cta_button`

Follow the same Step 1–5 pattern as Task 2.

---

## Task 6: Tier 1 — Translate `directions-page.json`

**Files:**
- Modify: `frontend/src/data/content/directions-page.json`

**Fields to translate** (5 fields):
`seo_title`, `seo_description`, `hero_title`, `hero_highlight`, `hero_description`

Follow the same Step 1–5 pattern as Task 2.

---

## ⏸ CHECKPOINT 1 — Human review before commit

**Do NOT proceed until human approves.**

Present to the user:
1. A diff summary of what changed (how many translation entries added per file)
2. Sample translations for 2 files × 3 languages (suggest: `private-tours-page` in `ms`, `zh`, `de`)
3. Ask: "Does this look accurate and on-brand? Reply 'yes' to commit and push to staging, or point out specific issues."

**If approved → Task 7. If issues → re-run specific language agent for that file.**

---

## Task 7: Commit Tier 1 and push to staging

**Step 1: Stage Tier 1 files**

```bash
cd /var/home/maarten/website-optimization/revamp
git add frontend/src/data/content/private-tours-page.json \
        frontend/src/data/content/join-in-tours-page.json \
        frontend/src/data/content/track-record-page.json \
        frontend/src/data/content/how-to-prepare-page.json \
        frontend/src/data/content/directions-page.json
```

**Step 2: Commit**

```bash
git commit -m "feat(i18n): add 9-language translations for 5 priority pages

Pages: private-tours, join-in-tours, track-record, how-to-prepare, directions
Languages: ms zh de es fr nl ru ja pt

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

**Step 3: Push to trigger staging deploy**

```bash
gh auth setup-git
git push origin main
```

Expected: push succeeds, Cloudflare Pages auto-build triggers on `simplyenak/revamp` main branch.

**Step 4: Monitor build**

```bash
source /var/home/maarten/.cloudflare/tokens.env
CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN_MANAGE /usr/local/sbin/wrangler pages deployment list --project-name staging 2>/dev/null | head -20
```

Wait for build to complete (usually 2-3 minutes).

---

## ⏸ CHECKPOINT 2 — Human staging verification

**Do NOT proceed until human approves.**

Ask the user to check `https://staging.simplyenak.com` and verify:
1. Navigate to `/ms/tours/private-tours/` — does the page show Malay text?
2. Navigate to `/de/track-record/` — does it show German?
3. Navigate to `/zh/tours/join-in/` — does it show Chinese?
4. Check that English fallback still works at `/tours/private-tours/`

Ask: "Staging looks good in non-English? Reply 'yes' to start Tier 2, or describe what's wrong."

---

## Task 8: Tier 2 — Translate `stories-index-page.json`

**Files:**
- Modify: `frontend/src/data/content/stories-index-page.json`

**Fields to translate** (7 fields):
`seo_title`, `seo_description`, `hero_title`, `hero_highlight`, `hero_subtitle`, `nav_vendor_stories`, `nav_culture_heritage`

> Skip: `newsletter_success`, `newsletter_error_email`, `newsletter_error_config` — UI error messages, English fallback fine.

Follow the same Step 1–5 pattern as Task 2.

---

## Task 9: Tier 2 — Translate `stories-archive-page.json`

**Files:**
- Modify: `frontend/src/data/content/stories-archive-page.json`

**Fields to translate** (4 fields):
`seo_title`, `seo_description`, `hero_title`, `hero_subtitle`

Follow the same Step 1–5 pattern as Task 2.

---

## Task 10: Tier 2 — Translate `corporate-groups-page.json`

**Files:**
- Modify: `frontend/src/data/content/corporate-groups-page.json`

**Fields to translate** (27 fields):
`seo_title`, `seo_description`, `hero_eyebrow`, `hero_title`, `hero_subtitle`, `offer_eyebrow`, `offer_heading`, `offer_body_1_strong`, `offer_body_1_rest`, `offer_perfect_for_label`, `offer_body_2`, `benefits_eyebrow`, `benefits_title`, `kl_eyebrow`, `kl_heading`, `kl_subtext`, `penang_eyebrow`, `penang_heading`, `penang_subtext`, `tour_badge_bestseller`, `how_eyebrow`, `how_heading`, `cta_heading`, `cta_body`, `cta_email_label`, `cta_whatsapp_label`, `cta_private_text`, `cta_private_link_label`

> Skip: `cta_private_href` (URL).

Follow the same Step 1–5 pattern as Task 2.

---

## ⏸ CHECKPOINT 3 — Human review Tier 2

**Do NOT proceed until human approves.**

Present sample translations (suggest: `corporate-groups-page` in `ms` and `ja`).
Ask: "Tier 2 translations look good? Reply 'yes' to commit."

---

## Task 11: Commit Tier 2

**Step 1: Stage Tier 2 files**

```bash
git add frontend/src/data/content/stories-index-page.json \
        frontend/src/data/content/stories-archive-page.json \
        frontend/src/data/content/corporate-groups-page.json
```

**Step 2: Commit and push**

```bash
git commit -m "feat(i18n): add 9-language translations for stories and corporate pages

Pages: stories-index, stories-archive, corporate-groups
Languages: ms zh de es fr nl ru ja pt

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

git push origin main
```

---

## ⏸ CHECKPOINT 4 — Production deploy (MANUAL — human only)

**This step is always manual. Claude does NOT push to production.**

Remind the user:
- Production repo: `simplyenak/website`
- Production deploy: GitHub Actions `workflow_dispatch` only
- URL: github.com/simplyenak/website → Actions → Deploy → Run workflow

When the user is ready, they trigger the workflow themselves.

---

## Verification checklist (post-production)

- [ ] `/ms/tours/private-tours/` renders in Malay
- [ ] `/zh/track-record/` renders in Chinese
- [ ] `/de/tours/join-in/` renders in German
- [ ] `/tours/private-tours/` still renders in English (default lang, no prefix)
- [ ] No build errors in CF Pages dashboard
- [ ] `hreflang` tags present in page `<head>` (check View Source)
