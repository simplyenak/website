#!/bin/bash

# Safe Production Deployment Script for Simply Enak
# This script ensures proper validation before deploying to production

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Simply Enak - Safe Production Deployment"
echo "==========================================="
echo ""

# Step 1: Run validation checks
echo "Step 1: Running pre-deployment validation..."
bash "$SCRIPT_DIR/validate-deployment.sh" production

if [ $? -ne 0 ]; then
    echo "❌ Validation failed. Deployment cancelled."
    exit 1
fi

echo ""
echo "Step 2: Building production assets..."
cd "$SCRIPT_DIR/frontend"

# Clean previous build
rm -rf dist
echo "✓ Cleaned previous build"

# Set production site URL
export PUBLIC_SITE_URL="https://simplyenak.com"

# Build
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Deployment cancelled."
    exit 1
fi

echo "✓ Build completed successfully"

echo ""
echo "Step 3: Deploying to Cloudflare Pages (production)..."

# Deploy to production (main branch)
wrangler pages deploy dist --project-name=website --branch=main

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi

echo ""
echo "✅ Production deployment completed successfully!"
echo ""
echo "Next steps:"
echo "  1. Wait 2-3 minutes for Cloudflare to propagate"
echo "  2. Visit https://simplyenak.com/ to verify"
echo "  3. Clear your browser cache (Ctrl+Shift+R)"
echo "  4. Check Google Analytics for traffic recovery"
echo ""
