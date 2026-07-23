#!/bin/bash
# Auto-sync: Pull latest Payload CMS content → trigger deploy
# Runs in site/ directory
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

echo "=== Payload Auto-Sync: $(date -u '+%Y-%m-%dT%H:%M:%SZ') ==="

# 1. Pull latest from main first to avoid conflicts
git fetch origin main 2>&1 || echo "(no remote)"
git reset --hard origin/main 2>&1 || echo "(staying local)"

# 2. Run sync
echo "--- Syncing from Payload CMS ---"
npm run sync 2>&1

# 3. Check for changes
if git diff --quiet; then
    echo "✅ No content changes — nothing to deploy."
    exit 0
fi

# 4. Show what changed
echo "--- Changes detected ---"
git diff --stat

# 5. Commit and push
echo "--- Committing and pushing ---"
git add src/data/content/
git commit -m "chore: auto-sync Payload CMS content $(date '+%Y-%m-%d')"
git push origin main 2>&1

echo "✅ Push complete — deploy triggered."
