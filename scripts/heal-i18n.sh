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

# Lock file — tells auto-sync.sh to skip its sync step while the heal cycle
# runs (prevents mid-run reverts of freshly translated collections).
# Robustness: the file stores the PID of the heal process. auto-sync skips
# only if that PID is still alive; stale locks (dead PID, or older than 3h
# from a SIGKILL that skipped the EXIT trap) are removed automatically.
LOCK_FILE=".i18n-heal.lock"
LOCK_STALE_AGE=10800 # 3 hours — a heal cycle takes ~20-60 min max

lock_is_stale() {
  # No PID recorded → stale (created by an old version or a crashed run)
  [ ! -s "$LOCK_FILE" ] && return 0
  local pid
  pid=$(cat "$LOCK_FILE" 2>/dev/null || echo "")
  # PID not a number, or process not running → stale
  [[ ! "$pid" =~ ^[0-9]+$ ]] && return 0
  if ! kill -0 "$pid" 2>/dev/null; then
    return 0
  fi
  return 1
}

acquire_lock() {
  if [ -f "$LOCK_FILE" ]; then
    if lock_is_stale; then
      echo "  ⚠  Stale .i18n-heal.lock removed (dead PID or crashed run)."
      rm -f "$LOCK_FILE"
    else
      echo "⏭️  Another heal cycle is running (.i18n-heal.lock exists, PID $(cat "$LOCK_FILE")) — exiting."
      exit 0
    fi
  fi
  echo $$ > "$LOCK_FILE"
  trap 'rm -f "$LOCK_FILE"' EXIT
}
acquire_lock

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
echo "▸ Checking EN contamination (abort if dirty — never translate garbage)..."
CONTAM_REPORT=$(cd site && node ../eval/check-en-contamination.mjs 2>/dev/null || echo "{}")
CONTAM=$(echo "$CONTAM_REPORT" | python3 -c "import json,sys; print(json.load(sys.stdin).get('contaminatedCount','?'))" 2>/dev/null || echo "?")
if [ "$CONTAM" != "0" ]; then
    echo "❌ $CONTAM EN base fields are contaminated (non-English content)."
    echo "$CONTAM_REPORT" | python3 -c "
import json,sys
d=json.load(sys.stdin)
for c in d.get('contaminated',[])[:10]:
    print('  %s/%s.%s [%s]: %s' % (c['collection'],c['id'],c['field'],c['lang'],c['snippet'][:40]))
" 2>/dev/null
    echo "Fix the EN base fields in Payload CMS admin FIRST, then re-run heal."
    echo "Translating contaminated English would propagate the wrong language into all 9 locales."
    exit 1
fi
echo "  ✅ EN base clean."

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
LANG_ARG=""
for arg in "${EXTRA_ARGS[@]:-}"; do
  if [ "$LANG_ARG" = "" ] && [ "$arg" = "--lang" ]; then LANG_ARG="PENDING"; fi
  if [ "$LANG_ARG" = "PENDING" ] && [[ "$arg" =~ ^[a-z,]+$ ]]; then LANG_ARG="$arg"; break; fi
done
[ "$LANG_ARG" = "PENDING" ] && LANG_ARG=""
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
# COST GUARD: default to --only-missing so the heal loop fills only real gaps
# (never re-translates already-complete items — the 2026-08-03 session burned
# hours of API calls on redundant force re-translations). Pass --force
# explicitly to override. HEAL_MAX_FIELDS caps the per-run budget (default
# 2000 fields ≈ one full language pass; raise for bulk backfills).
HEAL_MAX_FIELDS="${HEAL_MAX_FIELDS:-2000}"
export HEAL_MAX_FIELDS
# Partial-failure handling: translate-content.mjs exits 1 when ANY field errors
# (e.g. a collection that 500s on PATCH). Under set -e that would abort BEFORE
# the git commit/push below, losing the successful translations to the next
# auto-sync revert. Capture the exit code and keep going — commit what worked.
TRANSLATE_STATUS=0
if [ -n "$LANG_ARG" ]; then
    if [[ " ${EXTRA_ARGS[*]} " =~ " --force " ]] || [[ " ${EXTRA_ARGS[*]} " =~ " --only-missing " ]]; then
        set +e
        node site/scripts/translate-content.mjs --lang "$LANG_ARG" "${EXTRA_ARGS[@]}" 2>&1 | tail -10
        TRANSLATE_STATUS=${PIPESTATUS[0]}
        set -e
    else
        set +e
        node site/scripts/translate-content.mjs --lang "$LANG_ARG" --only-missing "${EXTRA_ARGS[@]}" 2>&1 | tail -10
        TRANSLATE_STATUS=${PIPESTATUS[0]}
        set -e
    fi
else
    if [[ " ${EXTRA_ARGS[*]} " =~ " --force " ]] || [[ " ${EXTRA_ARGS[*]} " =~ " --only-missing " ]]; then
        set +e
        node site/scripts/translate-content.mjs "${EXTRA_ARGS[@]}" 2>&1 | tail -10
        TRANSLATE_STATUS=${PIPESTATUS[0]}
        set -e
    else
        set +e
        node site/scripts/translate-content.mjs --only-missing "${EXTRA_ARGS[@]}" 2>&1 | tail -10
        TRANSLATE_STATUS=${PIPESTATUS[0]}
        set -e
    fi
fi
if [ "$TRANSLATE_STATUS" -ne 0 ]; then
    echo "  ⚠  translate-content.mjs exited $TRANSLATE_STATUS (some fields failed) — continuing to secure what succeeded."
fi
echo "  ✅ Translation pass complete"

# ── CRITICAL: secure translations to origin BEFORE anything else ────────────
# The Payload Auto-Sync cron (every 60m) runs `git checkout origin/main --
# src/data/content/`, which reverts any uncommitted translation writes.
# Commit + push IMMEDIATELY so origin has them and the next auto-sync pulls
# them back instead of clobbering. (This race ate the first German pass.)
if [ "$SKIP_GIT" != "true" ]; then
    echo ""
    echo "▸ Securing translations to origin (before auto-sync can revert)..."
    git add site/src/data/content/
    if ! git diff --cached --quiet; then
        git commit -m "auto: i18n translations ($(date '+%Y-%m-%d'))" 2>&1 | tail -1
        git pull --rebase origin main 2>&1 | tail -1 || echo "  (rebase skipped)"
        git push origin main 2>&1 | tail -1
        echo "  ✅ Secured to origin — deploy triggered via push hook"
    else
        echo "  Nothing new to commit."
    fi
fi

echo ""
echo "▸ Pushing translations to Payload..."
# Admin API key (PAYLOAD_ADMIN_API_KEY) enables native localized-field writes.
# Full push — translations persist in Payload as the source of truth.
node site/scripts/push-translations-payload.mjs 2>&1 | tail -5
echo "  ✅ Push complete — translations live in Payload"

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

# ── Full post-operation verification (the 2026-08-03 lesson: verify the
#    artifacts, not just the script's exit code) ──
echo ""
echo "▸ Running full verification gate..."
bash scripts/verify-i18n.sh --strict || echo "  ⚠  Verification FAILED — inspect above before trusting this state."

echo ""
echo "  Done."
