#!/bin/bash
# CTE Auto-sync: Pull CTE content from Payload CMS → commit → trigger deploy
# Mirrors site/scripts/auto-sync.sh for the CTE site.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO_ROOT"

echo "=== CTE Auto-Sync: $(date -u '+%Y-%m-%dT%H:%M:%SZ') ==="

# 1. Pull latest from main first (non-destructive — content dir only).
git fetch origin main 2>&1 || echo "(no remote)"

# Refresh CTE content snapshots from origin when the dir is clean (protects
# uncommitted translation/content writes from being clobbered, same as the
# main site's auto-sync).
if git diff --quiet -- cte/src/data/content/ && git diff --cached --quiet -- cte/src/data/content/; then
    git checkout origin/main -- cte/src/data/content/ 2>&1 || echo "(staying local)"
else
    echo "(cte content dir has local changes — skipping origin checkout to preserve them)"
fi

# 2. Run the CTE sync. PAYLOAD_URL/PAYLOAD_TOKEN live in site/.env.
set -a
source site/.env
set +a
echo "--- Syncing CTE content from Payload ---"
node cte/scripts/sync-cte-content.mjs

# 3. Check for changes (CTE content snapshots only)
if git diff --quiet -- cte/src/data/content/; then
    echo "✅ No CTE content changes — nothing to deploy."
    exit 0
fi

# 4. Show what changed
echo "--- Changes detected ---"
git diff --stat -- cte/src/data/content/

# 5. Commit and push
echo "--- Committing and pushing ---"
git add cte/src/data/content/
git commit -m "chore: auto-sync CTE content from Payload $(date '+%Y-%m-%d')"
git push origin main 2>&1

echo "--- Verifying deploy-cte.yml ---"
# Best-effort: watch the deploy run and fail loudly if it errors (gh must be
# available; if not, warn but don't block the sync).
if command -v gh >/dev/null 2>&1; then
  RUN_ID=$(gh run list --workflow deploy-cte.yml --limit 1 --json databaseId -q '.[0].databaseId' 2>/dev/null || echo "")
  if [ -n "$RUN_ID" ]; then
    for i in $(seq 1 30); do
      STATE=$(gh run view "$RUN_ID" --json status,conclusion -q '.status' 2>/dev/null || echo "")
      [ "$STATE" = "completed" ] && break
      sleep 10
    done
    CONCLUSION=$(gh run view "$RUN_ID" --json conclusion -q '.conclusion' 2>/dev/null || echo "unknown")
    if [ "$CONCLUSION" = "success" ]; then
      echo "✅ CTE deploy succeeded (run $RUN_ID)"
    else
      echo "❌ CTE deploy FAILED (run $RUN_ID, conclusion: $CONCLUSION) — check https://github.com/simplyenak/website/actions"
      exit 1
    fi
  else
    echo "⚠  Could not find deploy-cte.yml run — skipping verification"
  fi
else
  echo "⚠  gh CLI not available — skipping deploy verification"
fi

echo "✅ Push complete — CTE deploy triggered."
