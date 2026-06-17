#!/usr/bin/env bash
# Payload CMS Database Restore
# Usage: ./scripts/restore-db.sh <backup-file.sql.gz>
#
# WARNING: This will DESTROY the current database and replace it with the backup.
# Always create a pre-migration backup first if unsure.
#
# Example:
#   ./scripts/restore-db.sh backups/payload-local-20260415_135400-post-restore.sql.gz
#   ./scripts/restore-db.sh backups/PRE-MIGRATION-20260415_140000.sql.gz

set -euo pipefail

DB_NAME="payload-local"

if [ -z "${1:-}" ]; then
    echo "Usage: $0 <backup-file.sql.gz>"
    echo ""
    echo "Available backups:"
    ls -lht /var/home/maarten/website-optimization/payload-local/backups/*.sql.gz 2>/dev/null | awk '{print "  " $NF " (" $5 ")"}'
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: File not found: $BACKUP_FILE"
    exit 1
fi

echo "=== WARNING ==="
echo "This will permanently replace the '$DB_NAME' database."
echo "Backup file: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"
echo ""

# Auto-create safety backup of current state
SAFETY_BACKUP="/var/home/maarten/website-optimization/payload-local/backups/SAFETY-BEFORE-RESTORE-$(date +%Y%m%d_%H%M%S).sql.gz"
echo "Creating safety backup of current database: $SAFETY_BACKUP"
pg_dump -U postgres "$DB_NAME" | gzip > "$SAFETY_BACKUP" 2>/dev/null || true
echo ""

read -p "Type 'yes' to proceed with restore: " confirm
if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 0
fi

echo ""
echo "Step 1: Dropping current database..."
psql -U postgres -c "DROP DATABASE IF EXISTS \"$DB_NAME\";"

echo "Step 2: Creating fresh database..."
psql -U postgres -c "CREATE DATABASE \"$DB_NAME\";"

echo "Step 3: Restoring from backup..."
gunzip -c "$BACKUP_FILE" | psql -U postgres "$DB_NAME" 2>&1 | tail -5

echo ""
echo "=== Restore Complete ==="

# Verify
echo "Checking data counts:"
psql -U postgres "$DB_NAME" -c "
SELECT 'tours' as tbl, count(*) FROM tours
UNION ALL SELECT 'stories', count(*) FROM stories
UNION ALL SELECT 'media', count(*) FROM media
UNION ALL SELECT 'faqs', count(*) FROM faqs
UNION ALL SELECT 'dietary_options', count(*) FROM dietary_options
UNION ALL SELECT 'food_items', count(*) FROM food_items
UNION ALL SELECT 'vendors', count(*) FROM vendors
UNION ALL SELECT 'landing_pages', count(*) FROM landing_pages
UNION ALL SELECT 'site_settings', count(*) FROM site_settings
ORDER BY tbl;
"

echo ""
echo "Safety backup saved at: $SAFETY_BACKUP"
echo "If something went wrong, restore it with:"
echo "  $0 $SAFETY_BACKUP"
