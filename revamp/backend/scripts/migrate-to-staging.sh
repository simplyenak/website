#!/usr/bin/env bash
# =============================================================================
#  Simply Enak — Repeatable Local → Staging Migration Script
# =============================================================================
#  Usage: ./migrate-to-staging.sh
#  Prerequisites:
#    - Local PostgreSQL running with payload-local database
#    - SSH access to simplyenak (staging server)
#    - Staging Dokploy/Swarm stack running
# =============================================================================

set -euo pipefail

# --- Configuration -----------------------------------------------------------
LOCAL_DB="payload-local"
LOCAL_DB_USER="postgres"
LOCAL_DB_HOST="localhost"
STAGING_HOST="simplyenak"
STAGING_SERVICE="development-payload-qah34c_payload"
STAGING_POSTGRES_CONTAINER="development-payload-qah34c_payload-postgres.1.rv7imcakvk9y0yz0w1w1gmnmm"
STAGING_DB_USER="payload"
STAGING_DB_NAME="payload"
STAGING_DB_PASSWORD="${STAGING_DB_PASSWORD:?Set STAGING_DB_PASSWORD in the environment (AGENTS.md credential policy)}"
DUMP_FILE="/tmp/payload-staging-sync.sql"
REMOTE_DUMP="/tmp/payload-staging-sync.sql"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# =============================================================================
#  STEP 1: Export local database
# =============================================================================
log_info "Step 1/5: Dumping local database '$LOCAL_DB'..."
pg_dump -h "$LOCAL_DB_HOST" -U "$LOCAL_DB_USER" -d "$LOCAL_DB" \
  --no-owner --no-privileges --clean --if-exists \
  > "$DUMP_FILE"
LOCAL_SIZE=$(du -h "$DUMP_FILE" | cut -f1)
log_info "Dump complete: $DUMP_FILE ($LOCAL_SIZE)"

# =============================================================================
#  STEP 2: Sync JSON content → Local DB (optional, run if JSON changed)
# =============================================================================
REVAMP_DIR="/home/maarten/website-optimization/revamp/backend"
if [ -d "$REVAMP_DIR" ]; then
  log_info "Step 2/5: Syncing JSON snapshots to local DB..."
  cd "$REVAMP_DIR"
  # Export env vars for Payload init
  export DATABASE_URL="postgres://${LOCAL_DB_USER}@${LOCAL_DB_HOST}:5432/${LOCAL_DB}"
  export PAYLOAD_SECRET="${PAYLOAD_SECRET:-503b8f...9d40}"
  export PAYLOAD_TELEMETRY=false
  export PAYLOAD_ACCEPT_SCHEMA_CHANGES=true
  
  if npx tsx scripts/import-from-json.mjs 2>&1; then
    log_info "JSON sync completed"
  else
    log_warn "JSON sync had errors (schema drift possible) — continuing with DB dump"
  fi
else
  log_warn "Step 2/5: Skipped — revamp backend not found at $REVAMP_DIR"
fi

# =============================================================================
#  STEP 3: Transfer dump to staging
# =============================================================================
log_info "Step 3/5: Transferring dump to staging server..."
scp "$DUMP_FILE" "${STAGING_HOST}:${REMOTE_DUMP}"
log_info "Transfer complete"

# =============================================================================
#  STEP 4: Import into staging PostgreSQL
# =============================================================================
log_info "Step 4/5: Importing into staging PostgreSQL..."

ssh -o ConnectTimeout=10 "$STAGING_HOST" "
  # Copy dump into container
  docker cp '$REMOTE_DUMP' '$STAGING_POSTGRES_CONTAINER:/tmp/dump.sql'
  
  # Drop and recreate database
  docker exec -i '$STAGING_POSTGRES_CONTAINER' sh -c '
    PGPASSWORD=$STAGING_DB_PASSWORD dropdb -U $STAGING_DB_USER -h localhost $STAGING_DB_NAME 2>/dev/null || true
    PGPASSWORD=$STAGING_DB_PASSWORD createdb -U $STAGING_DB_USER -h localhost $STAGING_DB_NAME
  '
  
  # Import dump
  docker exec -i '$STAGING_POSTGRES_CONTAINER' sh -c '
    PGPASSWORD=$STAGING_DB_PASSWORD psql -U $STAGING_DB_USER -h localhost -d $STAGING_DB_NAME -f /tmp/dump.sql
  '
"
log_info "Staging database import complete"

# =============================================================================
#  STEP 5: Restart staging Payload service
# =============================================================================
log_info "Step 5/5: Rolling update of staging Payload service..."
ssh -o ConnectTimeout=10 "$STAGING_HOST" "docker service update --force '$STAGING_SERVICE'"
log_info "Staging service updated"

# =============================================================================
#  Verification
# =============================================================================
log_info "Verifying staging data..."
sleep 5
ssh -o ConnectTimeout=10 "$STAGING_HOST" "
  docker exec -i '$STAGING_POSTGRES_CONTAINER' sh -c '
    PGPASSWORD=$STAGING_DB_PASSWORD psql -U $STAGING_DB_USER -h localhost -d $STAGING_DB_NAME -c \"
      SELECT '\''tours'\'' as tbl, COUNT(*) FROM tours
      UNION ALL SELECT '\''pages'\'', COUNT(*) FROM pages
      UNION ALL SELECT '\''media'\'', COUNT(*) FROM media;
    \"
  '
"

log_info "Migration complete!"
echo ""
echo "================================================================"
echo "  NEXT: Add S3 env vars in Dokploy UI for persistence"
echo "  (Direct docker service updates are overwritten by Dokploy)"
echo "================================================================"
