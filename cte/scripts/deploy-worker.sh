#!/bin/bash
# Deploy CTE Cloudflare Worker

WORKER_FILE="workers/cdn-rewriter.js"
WORKER_NAME="culinarytravelexperts-cdn"

# Load Cloudflare credentials
if [ -f "$HOME/.cloudflare/tokens.env" ]; then
  source "$HOME/.cloudflare/tokens.env"
fi

# Get account ID from first domain
ACCOUNT_ID=$(curl -s "https://api.cloudflare.com/client/v4/accounts" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  | jq -r '.result[0].id')

if [ -z "$ACCOUNT_ID" ] || [ "$ACCOUNT_ID" = "null" ]; then
  echo "Error: Could not find Cloudflare account"
  exit 1
fi

echo "Deploying CTE Worker to account: $ACCOUNT_ID"

# Read worker source
WORKER_CODE=$(cat "$WORKER_FILE")

# Create metadata JSON
METADATA=$(cat <<EOF
{
  "main_module": "worker.js",
  "compatibility_date": "2024-01-01"
}
EOF
)

# Deploy using multipart form
curl -s -X PUT "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/scripts/$WORKER_NAME" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -F "worker.js=@$WORKER_FILE" \
  -F "metadata=$METADATA"

echo ""
echo "Worker deployed successfully!"
echo "Check status at: https://dash.cloudflare.com/$ACCOUNT_ID/workers/scripts/$WORKER_NAME"
