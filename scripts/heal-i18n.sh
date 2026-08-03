#!/usr/bin/env bash
# heal-i18n.sh — Self-healing translation pipeline for Simply Enak
#
# Flow:
#   1. Check i18n health — skip if nothing to do
#   2. Translate missing/stale content across all collections
#   3. Push translations to Payload via REST API
#   4. Commit and push to GitHub → triggers redeploy (deploy-site.yml push trigger)
#
# Env: PAYLOAD_URL, PAYLOAD_TOKEN, GEMINI_API_KEY (or OMNIROUTE_API_KEY)
# Set TRANSLATE_PROVIDER=omniroute to use Omniroute (default: gemini)
#
# Robustness notes:
#   - Loads site/.env explicitly (cron shells don't inherit it)
#   - git pull --rebase before push (auto-sync may have committed meanwhile)
#   - SKIP_GIT=true for CI/dry runs; --collection/--lang passthrough for testing

set -euo pipefail
cd "$(dirname "$0")/.."

SKIP_GIT="${SKIP_GIT:-false}"
# Optional passthrough: heal-i18n.sh --collection tours --lang ms
EXTRA_ARGS=("$@")

# Load site/.env so this works from a bare cron shell (no inherited env)
if [ -f site/.env ]; then
    set -a
    # shellcheck disable=SC1091
    source site/.env
    set +a
fi

echo ""
echo "▸ Checking i18n coverage..."
HEALTH=$(cd site && node ../eval/check-i18n-coverage.mjs 2>/dev/null || echo "{}")
PASSED=$(echo "$HEALTH" | python3 -c "import json,sys; d=json.load(sys.stdin); exit(0 if d.get('passed') else 1)" 2>/dev/null && echo "true" || echo "false")

if [ "$PASSED" = "true" ]; then
    echo "  ✅ Translations current — nothing to heal."
    exit 0
fi

UNTRANSLATED=$(echo "$HEALTH" | python3 -c "import json,sys; print(json.load(sys.stdin).get('totalUntranslated','?'))" 2>/dev/null || echo "?")
STALE=$(echo "$HEALTH" | python3 -c "import json,sys; print(json.load(sys.stdin).get('totalStale','?'))" 2>/dev/null || echo "?")
echo "  Found ${UNTRANSLATED} untranslated + ${STALE} stale items."

# ── Staggered rollout ───────────────────────────────────────────────────────
# Translate ONE language per run (the one with the most missing items), so the
# 4h cron naturally walks all 9 languages over ~36h without hammering the
# provider. If --lang was passed explicitly, honour it (test/manual mode).
LANG_ARG=$(echo "$EXTRA_ARGS" | grep -o '\-\-lang [a-z,]*' | head -1 | awk '{print $2}' || true)
if [ -z "$LANG_ARG" ]; then
    LANG_ARG=$(echo "$HEALTH" | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    by = d.get('untranslatedByLang', {})
    if not by:
        sys.exit(0)
    # Pick the language with the most untranslated pairs (stable order)
    worst = max(sorted(by.keys()), key=lambda l: by.get(l, 0))
    if by.get(worst, 0) > 0:
        print(worst)
except Exception:
    pass
" 2>/dev/null || true)
    if [ -n "$LANG_ARG" ]; then
        echo "  Stagger: translating language '$LANG_ARG' this run (worst gap)."
    fi
fi

echo ""
echo "▸ Translating missing and stale content..."
# Provider default: omniroute (gateway) with GLM-5.2 — validated for translation
# quality (2026-08-03). Alternatives: agnes (apihub.agnes-ai.com, direct),
# gemini (needs valid key). Set TRANSLATE_PROVIDER to switch.
TRANSLATE_PROVIDER="${TRANSLATE_PROVIDER:-omniroute}"
OMNIROUTE_MODEL="${OMNIROUTE_MODEL:-zai/glm-5.2}"
export TRANSLATE_PROVIDER OMNIROUTE_MODEL
# One language per run (staggered). All collections, that language.
if [ -n "$LANG_ARG" ]; then
    node site/scripts/translate-content.mjs --lang "$LANG_ARG" "${EXTRA_ARGS[@]}" 2>&1 | tail -10
else
    node site/scripts/translate-content.mjs "${EXTRA_ARGS[@]}" 2>&1 | tail -10
fi
echo "  ✅ Translation complete"

echo ""
echo "▸ Pushing translations to Payload..."
node site/scripts/push-translations-payload.mjs 2>&1 | tail -10
echo "  ✅ Push complete"

echo ""
echo "▸ Verifying..."
FINAL=$(cd site && node ../eval/check-i18n-coverage.mjs 2>/dev/null || echo "{}")
FINAL_PASSED=$(echo "$FINAL" | python3 -c "import json,sys; d=json.load(sys.stdin); exit(0 if d.get('passed') else 1)" 2>/dev/null && echo "true" || echo "false")
if [ "$FINAL_PASSED" = "true" ]; then
    echo "  ✅ All translations now current!"
else
    REMAINING=$(echo "$FINAL" | python3 -c "import json,sys; print(json.load(sys.stdin).get('totalUntranslated','?'))" 2>/dev/null || echo "?")
    echo "  ⚠  ${REMAINING} items still need translation (may need human review)"
fi

if [ "$SKIP_GIT" != "true" ]; then
    echo ""
    echo "▸ Committing and pushing to GitHub..."
    git add site/src/data/content/
    git commit -m "auto: i18n translations (self-healing)" 2>/dev/null || echo "  Nothing new to commit"
    git pull --rebase origin main 2>&1 | tail -2 || echo "  (rebase skipped — will push anyway)"
    git push origin main 2>&1 | tail -3
    echo "  ✅ Pushed — deploy triggered via push hook"
fi

echo ""
echo "  Done."
