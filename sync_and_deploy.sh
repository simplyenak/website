#!/bin/bash
# Sync env from DB to disk, then deploy via Dokploy
# Run on host (maarten) - no root needed

set -e

DOKPLOY=$(docker ps --filter name=dokploy --format "{{.ID}}" | grep -v postgres | grep -v redis | grep -v traefik | head -1)
PG=$(docker ps --filter name=dokploy-postgres --format "{{.ID}}" | head -1)

echo "DOKPLOY=$DOKPLOY"
echo "PG=$PG"

# Step 1: Write SQL query to file and copy to container
echo 'SELECT env FROM compose WHERE "composeId" = '"'"'anLRMqo5Mx1kQ-hvWg4mQ'"'"';' > /tmp/query.sql
docker cp /tmp/query.sql "$DOKPLOY":/tmp/query.sql
echo "SQL query file copied to Dokploy container"

# Step 2: Sync env from DB to .env file inside Dokploy container
echo "=== Syncing env from DB ==="
docker exec "$DOKPLOY" bash -c "
  rm -f /tmp/env_raw
  docker exec -i $PG psql -U dokploy -d dokploy -A -t < /tmp/query.sql > /tmp/env_raw
  echo \"Raw env bytes: \$(wc -c < /tmp/env_raw)\"
  grep -v '=\$' /tmp/env_raw > /etc/dokploy/compose/compose-index-auxiliary-program-qm58zh/code/.env
  echo \"Synced .env lines: \$(wc -l < /etc/dokploy/compose/compose-index-auxiliary-program-qm58zh/code/.env)\"
  rm -f /tmp/env_raw
"

# Step 3: Verify env has BUZZ_PRIVATE_KEY
echo "=== Verifying .env ==="
docker exec "$DOKPLOY" grep -E "BUZZ|ROCKETCHAT" /etc/dokploy/compose/compose-index-auxiliary-program-qm58zh/code/.env

# Step 4: Deploy with env sourced from .env file
echo "=== Deploying ==="
docker exec "$DOKPLOY" bash -c "cd /etc/dokploy/compose/compose-index-auxiliary-program-qm58zh/code && set -a && . ./.env && set +a && docker stack deploy -c docker-compose.yml compose-index-auxiliary-program-qm58zh"

echo "=== Done ==="
