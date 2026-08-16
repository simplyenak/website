#!/bin/bash
set -euo pipefail

# Simply Enak Production Backend — manual deploy
# Credentials are read from the environment (export them, or source site/.env).
# NEVER hardcode credentials here (AGENTS.md credential policy).

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
