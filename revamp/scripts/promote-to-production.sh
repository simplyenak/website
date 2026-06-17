#!/bin/bash
# Promote to Production Script
# Triggers the production GitHub Actions workflow with confirmation
# Usage: ./scripts/promote-to-production.sh

set -e

echo "=============================================="
echo " Simply Enak — Promote to Production"
echo "=============================================="
echo ""

# Check for required tools
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "   Install: https://cli.github.com/"
    exit 1
fi

# Verify logged in to GitHub CLI
if ! gh auth status &>/dev/null; then
    echo "❌ Not logged into GitHub CLI. Run: gh auth login"
    exit 1
fi

REPO="simplyenak/revamp"
WORKFLOW="promote-to-production.yml"

echo "This will trigger the production deployment workflow."
echo "The workflow will:"
echo "  1. Build Docker image → simplyenak/website-backend:production"
echo "  2. Build Astro frontend → deploy to simplyenak.com"
echo ""

read -rp "Type 'deploy' to confirm: " CONFIRM

if [ "$CONFIRM" != "deploy" ]; then
    echo "❌ Aborted: confirmation must be 'deploy'"
    exit 1
fi

echo ""
echo "🚀 Triggering production workflow..."

# Trigger the workflow
RUN_URL=$(gh workflow run "$WORKFLOW" --ref main --json url 2>&1)

if [ $? -eq 0 ]; then
    echo "✅ Workflow triggered successfully!"
    echo "   View run: $RUN_URL"
    echo ""
    echo "Next steps:"
    echo "  1. Monitor the workflow run in GitHub Actions"
    echo "  2. Wait for Docker image to build (~5-10 min)"
    echo "  3. Dokploy will auto-pull the new :production image"
    echo "  4. Cloudflare Pages will deploy the new frontend"
    echo ""
    echo "To monitor: gh run watch"
else
    echo "❌ Failed to trigger workflow"
    echo "   Error: $RUN_URL"
    exit 1
fi