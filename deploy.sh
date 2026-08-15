#!/bin/bash
# Local deployment script for Simply Enak website
# Usage: ./deploy.sh [production|staging]
# This deploys directly to Cloudflare Pages without GitHub Actions

set -e

# Check required variables
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "Error: CLOUDFLARE_API_TOKEN not set"
  echo "Set it in ~/.cloudflare/tokens.env and source it:"
  echo "  source ~/.cloudflare/tokens.env"
  exit 1
fi

if [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
  echo "Error: CLOUDFLARE_ACCOUNT_ID not set"
  exit 1
fi

# Default to production
TARGET=${1:-production}

echo "Deploying to $TARGET..."

# Build the site
echo "Building site..."
cd site
npm run build
cd ..

# Deploy
echo "Deploying to $TARGET..."
wrangler pages deploy site/dist --project-name=$TARGET --branch=production 2>&1 | tail -10

echo "Done! Deployment complete."
