#!/bin/bash
# Post-sync fix: Detect and fix wrong-language meta descriptions
# Runs after auto-sync to fix Portuguese/Spanish meta on English pages
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

echo "=== Post-Sync Fix: $(date -u '+%Y-%m-%dT%H:%M:%SZ') ==="

# Run the Python fix script
python3 scripts/fix-wrong-language-meta.py --auto

echo "✅ Post-sync fix complete."
