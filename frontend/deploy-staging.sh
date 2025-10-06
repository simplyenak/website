#!/bin/bash
# Cloudflare Deployment Script
# Usage: ./deploy-staging.sh

echo "Setting up Cloudflare environment..."
export CLOUDFLARE_API_TOKEN="DHprtg_nO-QCaeFwJABeWOoLiG3T4ppNBRjF1HDD"
export CLOUDFLARE_ACCOUNT_ID="464881de51ec2f03bea6104e467bf3fb"

echo "Building project..."
npm run build

echo "Deploying to staging..."
wrangler pages deploy dist --project-name staging --branch staging-kl-page --commit-dirty=true

echo "Deployment complete!"
echo "Staging URL: https://staging-5zf.pages.dev/"