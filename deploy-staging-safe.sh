#!/bin/bash

# Safe Staging Deployment Script for Simply Enak
# Deploys to staging-kl-page branch (preview environment)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🧪 Simply Enak - Staging Deployment"
echo "===================================="
echo ""

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

if [[ "$CURRENT_BRANCH" == "main" ]]; then
    echo "❌ ERROR: You're on the main branch!"
    echo "   Please switch to staging-kl-page branch first:"
    echo "   git checkout staging-kl-page"
    exit 1
fi

echo "✓ Not on main branch (safe to deploy to staging)"
echo ""

read -p "Deploy current branch '$CURRENT_BRANCH' to staging preview? (y/N): " CONFIRM
if [[ "$CONFIRM" != "y" ]] && [[ "$CONFIRM" != "Y" ]]; then
    echo "Deployment cancelled"
    exit 0
fi

echo ""
echo "Building staging assets..."
cd "$SCRIPT_DIR/frontend"

# Build
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✓ Build completed"

echo ""
echo "Deploying to Cloudflare Pages (staging preview)..."

# Deploy to staging (uses current branch)
wrangler pages deploy dist --project-name=website --branch="$CURRENT_BRANCH"

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi

echo ""
echo "✅ Staging deployment completed!"
echo ""
echo "Your staging site will be available at:"
echo "  https://[deployment-id].website-40z.pages.dev"
echo ""
echo "⚠️  Remember: This is STAGING only. To deploy to production:"
echo "  1. Merge your changes to main branch (after review)"
echo "  2. Run: ./safe-deploy-production.sh"
echo ""
