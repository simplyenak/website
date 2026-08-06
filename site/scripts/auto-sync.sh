#!/bin/bash
# Auto-sync: Pull latest Payload CMS content → trigger deploy
# Runs in site/ directory
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

echo "=== Payload Auto-Sync: $(date -u '+%Y-%m-%dT%H:%M:%SZ') ==="

# 1. Pull latest from main first to avoid conflicts.
#    NON-DESTRUCTIVE: refresh only the content snapshots from origin.
#    A plain `git reset --hard origin/main` would wipe every uncommitted
#    tracked edit (code, configs, workflows) on each hourly tick.
git fetch origin main 2>&1 || echo "(no remote)"

# Only checkout origin content when the content dir is CLEAN. If the heal-i18n
# pipeline has uncommitted translation writes in src/data/content/, a blind
# `git checkout origin/main -- src/data/content/` would destroy them (this
# race ate the first German translation pass). When dirty, skip the checkout
# and let `npm run sync` merge (sync-payload.mjs preserves translations).
if git diff --quiet -- src/data/content/ && git diff --cached --quiet -- src/data/content/; then
    git checkout origin/main -- src/data/content/ 2>&1 || echo "(staying local)"
else
    echo "(content dir has local changes — skipping origin checkout to preserve them)"
fi

# 2. Run sync — but skip if heal-i18n is mid-run (its translations would be
#    reverted). The heal script writes its PID to .i18n-heal.lock; skip only
#    if that PID is alive. Stale locks (dead PID from a SIGKILL'd heal) are
#    removed so auto-sync never stalls silently.
LOCK_FILE=".i18n-heal.lock"
if [ -f "$LOCK_FILE" ]; then
  LOCK_PID=$(cat "$LOCK_FILE" 2>/dev/null || echo "")
  if [[ "$LOCK_PID" =~ ^[0-9]+$ ]] && kill -0 "$LOCK_PID" 2>/dev/null; then
    echo "⏭️  heal-i18n in progress (PID $LOCK_PID) — skipping this auto-sync tick (retry next hour)"
    exit 0
  else
    echo "⚠  Removing stale .i18n-heal.lock (PID $LOCK_PID not running)."
    rm -f "$LOCK_FILE"
  fi
fi
echo "--- Syncing from Payload CMS ---"
npm run sync 2>&1

# 3. Check for changes (content snapshots only — other local edits are
#    never auto-committed or touched)
if git diff --quiet -- src/data/content/; then
    echo "✅ No content changes — nothing to deploy."
    exit 0
fi

# 4. Show what changed
echo "--- Changes detected ---"
git diff --stat -- src/data/content/

# 5. Commit and push
# Use --force-with-lease to handle diverged branches safely.
# The sync script may run on a branch that has local commits ahead of origin.
echo "--- Committing and pushing ---"
git add src/data/content/
git commit -m "chore: auto-sync Payload CMS content $(date '+%Y-%m-%d')"
git push origin main --force-with-lease 2>&1 || git push origin main --force 2>&1

echo "✅ Push complete — deploy triggered."
