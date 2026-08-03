#!/usr/bin/env bash
# verify-i18n.sh — post-operation verification gate
#
# Runs ALL the i18n integrity checks after any translation/sync operation.
# This encodes the session's lesson: "the script ran" / "HTTP 200" is NOT
# success — the artifacts must be verified (contamination clean, coverage
# complete, schema conformant, files parse).
#
# Usage: bash scripts/verify-i18n.sh [--strict]
#   --strict  → exit 1 on ANY failure (for CI / heal gate)
#   default   → exit 1 only on contamination (the hard invariant)
#
# Exits 0 if OK, 1 if checks fail.

cd "$(dirname "$0")/.."
STRICT="${1:-}"

fail=0

echo ""
echo "═══ i18n verification ═══"

# 1. EN contamination — the hard invariant (never ship non-English as EN base)
echo "▸ EN contamination check..."
if ! CONTAM=$(node eval/check-en-contamination.mjs 2>/dev/null); then
  echo "  ❌ EN base contaminated:"
  echo "$CONTAM" | python3 -c "
import json,sys
d=json.load(sys.stdin)
for c in d.get('contaminated',[])[:10]:
    print('    %s/%s.%s [%s]: %s' % (c['collection'],c['id'],c['field'],c['lang'],c['snippet'][:40]))
" 2>/dev/null
  fail=1
else
  echo "  ✅ EN base clean."
fi

# 2. UI file parses (catches the complete-ui-translations truncation bug)
echo "▸ ui.ts syntax check..."
if (cd site && node --check src/i18n/ui.ts 2>/dev/null); then
  echo "  ✅ ui.ts parses."
else
  echo "  ❌ ui.ts is syntactically broken."
  fail=1
fi

# 3. JSON snapshots are valid JSON
echo "▸ content JSON validity..."
if (cd site && node -e "
const fs=require('fs'),path=require('path');
const dir='src/data/content';
let bad=0;
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('.json')) continue;
  try { JSON.parse(fs.readFileSync(path.join(dir,f),'utf-8')); }
  catch(e){ bad++; console.log('  broken:', f); }
}
process.exit(bad?1:0);
" 2>/dev/null); then
  echo "  ✅ All content JSON valid."
else
  echo "  ❌ Some content JSON files are broken."
  fail=1
fi

# 4. i18n coverage (strict only — informational otherwise)
if [ -n "$STRICT" ]; then
  echo "▸ i18n coverage check..."
  if (cd site && node ../eval/check-i18n-coverage.mjs 2>/dev/null | python3 -c "import json,sys; sys.exit(0 if json.load(sys.stdin).get('passed') else 1)"); then
    echo "  ✅ Coverage complete."
  else
    echo "  ⚠  Coverage incomplete (see check-i18n-coverage.mjs)."
    fail=1
  fi
fi

# 5. Schema conformance (strict only — needs admin key)
if [ -n "$STRICT" ] && [ -n "$PAYLOAD_ADMIN_API_KEY" ]; then
  echo "▸ Schema conformance..."
  if (cd site && node --env-file=.env ../eval/check-schema-conformance.mjs --fail 2>/dev/null); then
    echo "  ✅ Schema conformant."
  else
    echo "  ❌ Schema mismatch (site reads fields Payload lacks)."
    fail=1
  fi
fi

echo ""
if [ $fail -eq 0 ]; then
  echo "═══ VERIFICATION PASSED ═══"
else
  echo "═══ VERIFICATION FAILED — fix before trusting this state ═══"
fi
exit $fail
