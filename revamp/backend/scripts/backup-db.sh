#!/usr/bin/env bash
# Payload CMS Database Backup
# Usage: ./scripts/backup-db.sh [--pre-migration]
#
# Creates timestamped gzipped SQL dumps.
# --pre-migration flag creates a checkpoint backup with a README.
#
# Backups are stored in: payload-local/backups/
# Keeps the 10 most recent regular backups.
# Pre-migration backups are NEVER auto-deleted.

set -euo pipefail

BACKUP_DIR="/var/home/maarten/website-optimization/payload-local/backups"
DB_NAME="payload-local"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
KEEP_REGULAR=10

mkdir -p "$BACKUP_DIR"

# Fix ownership if needed
if [ ! -w "$BACKUP_DIR" ]; then
    echo "Fixing backup dir ownership..."
    sudo chown maarten:maarten "$BACKUP_DIR"
fi

if [ "${1:-}" = "--pre-migration" ]; then
    # Pre-migration checkpoint — never auto-deleted
    BACKUP_FILE="$BACKUP_DIR/PRE-MIGRATION-${TIMESTAMP}.sql.gz"
    echo "=== PRE-MIGRATION BACKUP ==="
    echo "Creating checkpoint backup: $BACKUP_FILE"
    pg_dump -U postgres "$DB_NAME" | gzip > "$BACKUP_FILE"
    echo ""
    echo "Backup size: $(du -h "$BACKUP_FILE" | cut -f1)"
    echo ""
    echo "To restore this backup:"
    echo "  psql -U postgres -c 'DROP DATABASE \"payload-local\";'"
    echo "  psql -U postgres -c 'CREATE DATABASE \"payload-local\";'"
    echo "  gunzip -c $BACKUP_FILE | psql -U postgres \"payload-local\""
    echo ""
    echo "This backup will NOT be auto-deleted by backup-db.sh."
else
    # Regular backup
    BACKUP_FILE="$BACKUP_DIR/payload-local-${TIMESTAMP}.sql.gz"
    echo "Creating backup: $BACKUP_FILE"
    pg_dump -U postgres "$DB_NAME" | gzip > "$BACKUP_FILE"
    echo "Backup size: $(du -h "$BACKUP_FILE" | cut -f1)"

    # Cleanup old regular backups (keep most recent N)
    REGULAR_BACKUPS=$(ls -1t "$BACKUP_DIR"/payload-local-*.sql.gz 2>/dev/null | tail -n +$((KEEP_REGULAR + 1)))
    if [ -n "$REGULAR_BACKUPS" ]; then
        echo ""
        echo "Cleaning up old backups (keeping $KEEP_REGULAR)..."
        echo "$REGULAR_BACKUPS" | while read -r old_file; do
            echo "  Removing: $(basename "$old_file")"
            rm -f "$old_file"
        done
    fi
fi

# Summary
echo ""
echo "=== Backup Summary ==="
echo "All backups:"
ls -lht "$BACKUP_DIR"/*.sql.gz 2>/dev/null | awk '{print "  " $NF " (" $5 ")"}'
