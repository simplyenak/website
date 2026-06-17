#!/bin/bash
set -euo pipefail

echo "=== Step 1: Creating directory structure ==="
mkdir -p /etc/dokploy/compose/simplyenak-backend-7x9k2m/code

echo "=== Step 2: Checking dokploy-network ==="
if docker network ls 2>/dev/null | grep -q dokploy-network; then
  echo "  dokploy-network: exists"
else
  echo "  dokploy-network: creating..."
  docker network create --driver=overlay --attachable dokploy-network 2>/dev/null || true
fi

echo "=== Step 3: Writing docker-compose.yml ==="
cat > /etc/dokploy/compose/simplyenak-backend-7x9k2m/code/docker-compose.yml << 'YAML'
services:
  payload:
    image: simplyenak/website-backend:production
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      labels:
        - traefik.enable=true
        - traefik.swarm.network=dokploy-network
        - traefik.http.routers.simplyenak-payload-web.rule=Host(`cms.system.simplyenak.com`)
        - traefik.http.routers.simplyenak-payload-web.entrypoints=web
        - traefik.http.routers.simplyenak-payload-web.middlewares=redirect-to-https@file
        - traefik.http.routers.simplyenak-payload-websecure.rule=Host(`cms.system.simplyenak.com`)
        - traefik.http.routers.simplyenak-payload-websecure.entrypoints=websecure
        - traefik.http.routers.simplyenak-payload-websecure.tls.certresolver=letsencrypt
        - traefik.http.services.simplyenak-payload.loadbalancer.server.port=3000
        - traefik.http.routers.simplyenak-payload-web.service=simplyenak-payload
        - traefik.http.routers.simplyenak-payload-websecure.service=simplyenak-payload
    environment:
      DATABASE_URL: "postgres://payload:C364058fc237dc6306d6953d50ab5ed6e344b6d162ef8ea32e95843bb64e7ea2@payload-postgres:5432/payload_production"
      PAYLOAD_SECRET: "***REMOVED***"
      NODE_ENV: "production"
      PORT: "3000"
      HOSTNAME: "0.0.0.0"
      PAYLOAD_PUBLIC_SERVER_URL: "https://cms.system.simplyenak.com"
      NEXT_PUBLIC_SERVER_URL: "https://cms.system.simplyenak.com"
      S3_ACCESS_KEY_ID: "***REMOVED***"
      S3_SECRET_ACCESS_KEY: "PLACEHOLDER_GET_FROM_SCALEWAY"
      S3_BUCKET: "se-website-images"
      S3_REGION: "nl-ams"
      S3_ENDPOINT: "https://s3.nl-ams.scw.cloud"
      PAYLOAD_TELEMETRY: "false"
      NEXT_TELEMETRY_DISABLED: "1"
      PAYLOAD_ACCEPT_SCHEMA_CHANGES: "true"
      PAYLOAD_DB_POSTGRES_ACCEPT_SCHEMA_CHANGES: "true"
    depends_on:
      - payload-postgres
    networks:
      - dokploy-network
      - default

  payload-postgres:
    image: postgres:16-alpine
    deploy:
      placement:
        constraints:
          - node.role == manager
    volumes:
      - payload-production-db:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: "payload_production"
      POSTGRES_USER: "payload"
      POSTGRES_PASSWORD: "C364058fc237dc6306d6953d50ab5ed6e344b6d162ef8ea32e95843bb64e7ea2"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U payload"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - dokploy-network
      - default

volumes:
  payload-production-db:

networks:
  dokploy-network:
    external: true
YAML

echo "=== Step 4: Deploying stack ==="
cd /etc/dokploy/compose/simplyenak-backend-7x9k2m/code
docker stack deploy -c docker-compose.yml simplyenak-backend 2>&1

echo ""
echo "=== Step 5: Checking stack status ==="
sleep 3
docker stack services simplyenak-backend 2>&1 || true

echo ""
echo "=== Step 6: Container status ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "simplyenak|payload" || echo "No payload containers found yet"

echo ""
echo "=== Deployment complete ==="