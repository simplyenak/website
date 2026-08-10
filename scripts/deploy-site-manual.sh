#!/bin/bash
# Manual deploy script for Simply Enak site to Cloudflare Pages
# Use when GitHub Actions billing is down
#
# Usage:
#   ./scripts/deploy-site-manual.sh

set -euo pipefail

# Load credentials
if [ -f "$HOME/.cloudflare/tokens.env" ]; then
  source "$HOME/.cloudflare/tokens.env"
fi

ACCOUNT_ID="464881de51ec2f03bea6104e467bf3fb"
PROJECT_NAME="website"
SITE_DIR="/var/home/maarten/website-optimization/site/dist"
WORKER_DIR="/var/home/maarten/website-optimization/site/workers/cdn-rewriter.js"
WORKER_NAME="simplyenak-cdn-rewriter"

# Use the main token for Pages if available, otherwise fall back
PAGES_TOKEN="${CLOUDFLARE_API_TOKEN_PAGES:-$CLOUDFLARE_API_TOKEN}"
WORKERS_TOKEN="${CLOUDFLARE_API_TOKEN_WORKERS:-$CLOUDFLARE_API_TOKEN}"

echo "=== Simply Enak Manual Deploy ==="
echo "Account: $ACCOUNT_ID"
echo "Project: $PROJECT_NAME"
echo ""

# Check if dist exists
if [ ! -d "$SITE_DIR" ]; then
  echo "Building site first..."
  cd /var/home/maarten/website-optimization/site
  npm ci 2>/dev/null || npm install 2>/dev/null || true
  npm run build
fi

if [ ! -d "$SITE_DIR" ]; then
  echo "❌ Build directory not found: $SITE_DIR"
  exit 1
fi

echo "✓ Build directory exists $(du -sh "$SITE_DIR" | cut -f1)"

# Create manifest for Cloudflare Pages upload
MANIFEST_FILE="/tmp/site-manifest.json"
echo "Creating assets manifest..."

# Build JSON manifest of all files
echo '{"assets":[' > "$MANIFEST_FILE"
first=true
find "$SITE_DIR" -type f | while read -r file; do
  relpath="${file#$SITE_DIR/}"
  if [ "$first" = true ]; then
    first=false
  else
    echo "," >> "$MANIFEST_FILE"
  fi
  printf '{"path":"%s"}' "$relpath" >> "$MANIFEST_FILE"
done
echo ']}' >> "$MANIFEST_FILE"

echo "✓ Manifest created"

# Create a zip of the dist folder for upload
TMPTAR="/tmp/site-deploy.tar.gz"
echo "Creating archive..."
(cd /var/home/maarten/website-optimization/site && tar -czf "$TMPTAR" dist/)
echo "✓ Archive created $(du -sh "$TMPTAR" | cut -f1)"

echo ""
echo "Deploying to Cloudflare Pages..."

# Create deployment with manifest
DEPLOY_RESPONSE=$(curl -s -X POST \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME/deployments" \
  -H "Authorization: Bearer $PAGES_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"manual-deploy-$(date +%s)\",
    \"production\": true,
    \"source\": \"upload\",
    \"manifest\": $(cat \"$MANIFEST_FILE\")
  }")

DEPLOY_ID=$(echo "$DEPLOY_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$DEPLOY_ID" ]; then
  echo "Failed to create deployment:"
  echo "$DEPLOY_RESPONSE"
  exit 1
fi

echo "✓ Deployment created: $DEPLOY_ID"
echo ""
echo "Uploading assets..."

# Get upload URL
UPLOAD_RESPONSE=$(curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME/deployments/$DEPLOY_ID/upload" \
  -H "Authorization: Bearer $PAGES_TOKEN")

UPLOAD_URL=$(echo "$UPLOAD_RESPONSE" | grep -o '"upload_url":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$UPLOAD_URL" ]; then
  echo "Failed to get upload URL:"
  echo "$UPLOAD_RESPONSE"
  exit 1
fi

echo "✓ Upload URL received"

# Upload to Cloudflare
curl -s -X PUT \
  "$UPLOAD_URL" \
  -H "Authorization: Bearer $PAGES_TOKEN" \
  --data-binary @"$TMPTAR" > /dev/null

echo "✓ Upload complete"

# Clean up
rm -f "$TMPTAR" "$MANIFEST_FILE"

echo ""
echo "Deployment in progress..."
echo "Monitor at: https://dash.cloudflare.com/$ACCOUNT_ID/pages/view/$PROJECT_NAME/deployments"
echo ""
echo "Waiting for deployment to complete..."

# Poll for completion
for i in $(seq 1 30); do
  sleep 5
  STATUS_RESPONSE=$(curl -s \
    "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME/deployments/$DEPLOY_ID" \
    -H "Authorization: Bearer $PAGES_TOKEN")
  
  STATUS=$(echo "$STATUS_RESPONSE" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
  
  case "$STATUS" in
    "success")
      echo ""
      echo "✅ Site deployment successful!"
      echo "Live URL: https://simplyenak.com"
      break
      ;;
    "error")
      echo ""
      echo "❌ Deployment failed!"
      echo "$STATUS_RESPONSE"
      exit 1
      ;;
    *)
      echo "  Status: $STATUS (attempt $i/30)"
      ;;
  esac
done

# Deploy Worker if exists
if [ -f "$WORKER_DIR" ]; then
  echo ""
  echo "Deploying Cloudflare Worker..."
  
  WORKER_RESPONSE=$(curl -s -X PUT \
    "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/scripts/$WORKER_NAME" \
    -H "Authorization: Bearer $WORKERS_TOKEN" \
    -F "metadata={\"body_part\":\"script\",\"compatibility_date\":\"2024-12-01\"}" \
    -F "script=@$WORKER_DIR;type=application/javascript")
  
  WORKER_SUCCESS=$(echo "$WORKER_RESPONSE" | grep -o '"success":true' | head -1)
  
  if [ "$WORKER_SUCCESS" = "success:true" ]; then
    echo "✅ Worker deployed successfully!"
  else
    echo "⚠️  Worker deployment may have failed:"
    echo "$WORKER_RESPONSE"
  fi
fi

echo ""
echo "Done!"