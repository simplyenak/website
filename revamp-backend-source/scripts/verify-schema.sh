#!/bin/bash

# Schema Verification Script for Payload CMS
# Run this after making schema changes to catch common issues

set -e

DB_USER="directus"
DB_HOST="localhost"
DB_NAME="payload-local"
DB_PASSWORD="***REMOVED***"

export PGPASSWORD=$DB_PASSWORD

echo "======================================"
echo "🔍 Payload Schema Verification"
echo "======================================"
echo ""

# Function to check if table exists
check_table() {
  local table=$1
  if psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "\d $table" &>/dev/null; then
    echo "✅ $table"
    return 0
  else
    echo "❌ $table (MISSING)"
    return 1
  fi
}

# Function to check if column exists
check_column() {
  local table=$1
  local column=$2
  local result=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "SELECT 1 FROM information_schema.columns WHERE table_name = '$table' AND column_name = '$column';" 2>/dev/null | tr -d ' ')
  if [ "$result" = "1" ]; then
    echo "  ✅ $column"
  else
    echo "  ❌ $column (MISSING)"
  fi
}

echo "1. Checking Core Tables..."
echo "--------------------------------------"
check_table "users"
check_table "media"
check_table "tours"
check_table "dietary_options"
check_table "payload_locked_documents"
echo ""

echo "2. Checking Version Tables..."
echo "--------------------------------------"
check_table "_tours_v"
check_table "_dietary_options_v"
echo ""

echo "3. Checking Relationship Tables..."
echo "--------------------------------------"
check_table "tours_rels"
check_table "_tours_v_rels"
check_table "payload_locked_documents_rels"
echo ""

echo "4. Checking Required Columns..."
echo "--------------------------------------"
echo "dietary_options:"
check_column "dietary_options" "_status"
check_column "dietary_options" "autosave"

echo "_dietary_options_v:"
check_column "_dietary_options_v" "parent_id"
check_column "_dietary_options_v" "version__status"
check_column "_dietary_options_v" "version_created_at"
check_column "_dietary_options_v" "version_updated_at"
check_column "_dietary_options_v" "version_autosave"

echo "tours_rels:"
check_column "tours_rels" "order"
check_column "tours_rels" "dietary_options_id"
check_column "tours_rels" "travel_type_landing_pages_id"
check_column "tours_rels" "specialty_landing_pages_id"

echo "payload_locked_documents_rels:"
check_column "payload_locked_documents_rels" "dietary_options_id"
echo ""

echo "5. Checking for Orphaned Records..."
echo "--------------------------------------"
ORPHANS=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "
  SELECT COUNT(*) 
  FROM \"_dietary_options_v\" v 
  LEFT JOIN dietary_options d ON v.parent_id = d.id 
  WHERE d.id IS NULL;
" 2>/dev/null | tr -d ' ')

if [ "$ORPHANS" = "0" ]; then
  echo "  ✅ No orphaned version records"
else
  echo "  ⚠️  Found $ORPHANS orphaned version record(s)"
  echo "     Run: DELETE FROM \"_dietary_options_v\" WHERE parent_id NOT IN (SELECT id FROM dietary_options);"
fi
echo ""

echo "6. Checking Version Record Coverage..."
echo "--------------------------------------"
MAIN_COUNT=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM dietary_options;" 2>/dev/null | tr -d ' ')
VERSION_COUNT=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(DISTINCT parent_id) FROM \"_dietary_options_v\" WHERE parent_id IS NOT NULL;" 2>/dev/null | tr -d ' ')

if [ "$MAIN_COUNT" = "$VERSION_COUNT" ]; then
  echo "  ✅ All documents have version records ($MAIN_COUNT/$VERSION_COUNT)"
else
  echo "  ⚠️  Mismatch: $MAIN_COUNT main docs, $VERSION_COUNT version records"
  echo "     Run: INSERT INTO \"_dietary_options_v\" (parent_id, version_name, latest) SELECT id, name, true FROM dietary_options WHERE id NOT IN (SELECT parent_id FROM \"_dietary_options_v\");"
fi
echo ""

echo "7. Checking Environment Variables..."
echo "--------------------------------------"
if grep -q "YOUR_USER" .env 2>/dev/null; then
  echo "  ❌ .env contains placeholder values (YOUR_USER)"
else
  echo "  ✅ .env looks correct"
fi
echo ""

echo "======================================"
echo "✅ Verification Complete"
echo "======================================"
echo ""
echo "If you see any ❌ items above, fix them before testing the admin UI."
echo ""
