#!/usr/bin/env bash
# heal-i18n.sh — Self-healing translation pipeline for Simply Enak
#
# Flow:
#   1. Check i18n health — skip if nothing to do
#   2. Translate missing/stale content across all collections
#   3. Push translations to Payload via REST API
#   4. Commit and push to GitHub → triggers redeploy
#
# Env: PAYLOAD_URL, PAYLOAD_TOKEN, GEMINI_API_KEY

set -euo pipefail
cd "$(dirname "$0")/.."

SKIP_GIT="${SKIP_GIT:-false}"

echo ""
echo "▸ Checking i18n coverage..."
HEALTH=$(node eval/check-i18n-coverage.mjs 2>/dev/null)
PASSED=$(echo "$HEALTH" | python3 -c "import json,sys; d=json.load(sys.stdin); exit(0 if d.get('passed') else 1)" 2>/dev/null && echo "true" || echo "false")

if [ "$PASSED" = "true" ]; then
    echo "  ✅ All MS translations current — nothing to heal."
    exit 0
fi

UNTRANSLATED=$(echo "$HEALTH" | python3 -c "import json,sys; print(json.load(sys.stdin).get('totalUntranslated','?'))" 2>/dev/null || echo "?")
STALE=$(echo "$HEALTH" | python3 -c "import json,sys; print(json.load(sys.stdin).get('totalStale','?'))" 2>/dev/null || echo "?")
echo "  Found ${UNTRANSLATED} untranslated + ${STALE} stale items."

echo ""
echo "▸ Translating missing and stale content..."
node scripts/translate-content.mjs --smart 2>&1 | tail -10
echo "  ✅ Translation complete"

echo ""
echo "▸ Pushing MS translations to Payload..."
node scripts/push-translations-payload.mjs 2>&1 | tail -10
echo "  ✅ Push complete"

echo ""
echo "▸ Verifying..."
FINAL=$(node eval/check-i18n-coverage.mjs 2>/dev/null)
FINAL_PASSED=$(echo "$FINAL" | python3 -c "import json,sys; d=json.load(sys.stdin); exit(0 if d.get('passed') else 1)" 2>/dev/null && echo "true" || echo "false")
if [ "$FINAL_PASSED" = "true" ]; then
    echo "  ✅ All MS translations now current!"
else
    REMAINING=$(echo "$FINAL" | python3 -c "import json,sys; print(json.load(sys.stdin).get('totalUntranslated','?'))" 2>/dev/null || echo "?")
    echo "  ⚠  ${REMAINING} items still need translation (may need human review)"
fi

if [ "$SKIP_GIT" != "true" ]; then
    echo ""
    echo "▸ Committing and pushing to GitHub..."
    git add site/src/data/content/
    git commit -m "auto: i18n translations (self-healing)" 2>/dev/null || echo "  Nothing new to commit"
    git push origin main 2>&1 | tail -3
    echo "  ✅ Pushed — redeploy triggered"
fi

echo ""
echo "  Done."
