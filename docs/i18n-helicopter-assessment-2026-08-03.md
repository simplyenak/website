# i18n Architecture Assessment — Helicopter View (2026-08-03)

## Verdict: The approach is architecturally sound but has one systemic flaw (Malay contamination) and one design smell (page duplication that caused it).

## What's correct

1. **Payload as source of truth with translations array** — the `translations[]` (languages_code + field overrides) model is exactly how Payload's localized fields should be consumed, and the sync script's translation-preservation logic proves the data flow was thought through.
2. **Three-tier fallback** (live Payload → JSON snapshots → hardcoded) is defensive and works — proven by landing pages (15/15 dietary, 12/12 specialty translated and rendering).
3. **applyLocaleTranslations() merge** is correct: merges translated fields on top, skips null/empty.
4. **Static locale-prefix URLs** (/ms, /de, ...) is a legitimate choice for a static Astro site — no server-side locale negotiation needed, works with Cloudflare Pages, cheap.
5. **The heal-i18n pipeline** (check → translate --smart → push to Payload → verify) is the right shape. It just was never scheduled.

## What's wrong

1. **SYSTEMIC: Malay contamination in 8 locales** (de/es/fr/nl/ru/ja/zh/pt × 5 pages each = 40 files). Root cause: the per-locale pages were created by copying the MS version as a template, and the Malay hero/metadata text was left as `??` fallbacks. These fire whenever Payload lacks the field. This is a *template-copy accident*, and it's the strongest argument against the duplicate-file approach: nothing forces the copies to stay correct.

2. **Inconsistent locale plumbing**: ms/index.astro correctly does `getAllTours(lang)`, but ms/tours/[slug].astro calls `getAllTours()` with no locale. Some pages use shared components with a locale prop (SegmentPage — the good pattern), others are full per-locale copies (the bad pattern). The codebase mixes both.

3. **Silent English fallback hides gaps**: t() falls back to EN silently, so missing keys look "fine" in QA. Worse, the EN copyright key itself is Malay — a literal template artifact that ships to all 10 locales.

4. **hreflang is generated blindly** for all 10 locales on every page — pointing at pages that exist but contain English content. Not harmful per se (pages exist, lang attribute correct) but the content mismatch makes the hreflang signal weak/wrong until content is translated.

5. **The pipeline is unscheduled**: heal-i18n.sh exists and works but no cron runs it. Documentation says "every 4h" — nothing was created.

## Architecture verdict: keep, don't rewrite

The duplicate-page approach is working and mostly correct; rewriting to dynamic [lang] routes would be a large, risky refactor for marginal benefit at this site's scale (30 files/locale). The right move is:

1. **Fix the contamination** (data/fallback hygiene)
2. **Standardize on the shared-component pattern** (SegmentPage-style) for new/refactored pages — pass locale prop, avoid per-locale copies where feasible
3. **Make fallbacks explicit**: when a locale field is missing, prefer English over stale-wrong-language (any wrong language is worse than English)
4. **Schedule the heal pipeline** so content translation actually happens
5. **Revisit hreflang** after content is translated

## The one real decision point for the future

If translation coverage stays partial forever, the site should decide: either (a) fully translate content (heal pipeline + human review for ms/zh), or (b) shrink the locale set to the 2-3 languages with real demand. Half-translated 10-locale sites send weak signals to both Google and humans. The landing pages prove the machinery works — it's a content-completion decision, not an architecture one.
