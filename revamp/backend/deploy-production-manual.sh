#!/bin/bash
set -euo pipefail

# Environment variables for Simply Enak Production Backend
export DATABASE_URL="postgres://payload:c364058fc237dc6306d6953d50ab5ed6e344b6d162ef8ea32e95843bb64e7ea2@payload-postgres:5432/payload_production"
export PAYLOAD_SECRET="a37098084d1606b91de4b65cb867d6d161949e190ef2ab2d530a29656ea2ded5"
export PAYLOAD_DB_PASSWORD="c364058fc237dc6306d6953d50ab5ed6e344b6d162ef8ea32e95843bb64e7ea2"
export S3_ACCESS_KEY_ID="SCW2QE3G5S6PEQ5DXXWC"
export S3_SECRET_ACCESS_KEY="CHANGE_ME_GET_FROM_SCALEWAY"
export S3_BUCKET="se-website-images"
export S3_REGION="nl-ams"
export S3_ENDPOINT="https://s3.nl-ams.scw.cloud"

# Verify all required variables are set
echo "=== Verifying environment variables ==="
for var in DATABASE_URL PAYLOAD_SECRET PAYLOAD_DB_PASSWORD S3_ACCESS_KEY_ID S3_SECRET_ACCESS_KEY S3_BUCKET S3_REGION S3_ENDPOINT; do
  if [ -z "${!var:-}" ]; then
    echo "ERROR: $var is not set"
    exit 1
  fi
  echo "  $var: ${!var:0:20}..."
done

# Check that dokploy-network exists
echo ""
echo "=== Checking dokploy-network ==="
if ! docker network ls | grep -q dokploy-network; then
  echo "ERROR: dokploy-network not found. Create it first."
  exit 1
fi
echo "  dokploy-network: OK"

# Deploy the stack
echo ""
echo "=== Deploying simplyenak-backend stack ==="
cd /var/home/maarten/website-optimization/revamp/backend
docker stack deploy -c docker-compose.production.deploy.yml simplyenak-backend

echo ""
echo "=== Stack deployed. Checking status... ==="
sleep 5
docker stack services simplyenak-backend
echo ""
docker service ps simplyenak-backend_payload 2>/dev/null || true
echo ""
echo "Done! Check logs with: docker service logs simplyenak-backend_payload"
