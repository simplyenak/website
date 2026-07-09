#!/bin/sh
# Payload CMS startup script
# Runs schema drift fix before starting the app
set -e

SCHEMA_FIX="./scripts/fix-schema-drift.sql"

# Build DATABASE_URL from env if provided as separate vars
if [ -z "$DATABASE_URL" ]; then
  # Construct from individual env vars if available
  DB_USER="${DB_USER:-payload}"
  DB_PASS="${DB_PASS:-}"
  DB_HOST="${DB_HOST:-localhost}"
  DB_PORT="${DB_PORT:-5432}"
  DB_NAME="${DB_NAME:-payload_production}"
  if [ -n "$DB_PASS" ]; then
    DATABASE_URL="postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
  else
    DATABASE_URL="postgres://${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
  fi
fi

if [ -f "$SCHEMA_FIX" ] && [ -n "$DATABASE_URL" ]; then
  echo "[startup] Running schema drift fix..."
  psql "$DATABASE_URL" -f "$SCHEMA_FIX" 2>&1 | tail -5
  echo "[startup] Schema drift fix complete."
fi

echo "[startup] Starting Payload CMS..."
exec node /app/server.js
