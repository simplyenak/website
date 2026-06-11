#!/bin/bash
# Payload CMS Database Schema Helper Scripts
# Usage: ./scripts/db-helpers.sh <command>

DB_NAME="payload-local"
DB_USER="postgres"
DB_PASS="YOUR_DB_PASSWORD"
DB_HOST="localhost"

export PGPASSWORD=$DB_PASS

case "$1" in
  "add-field")
    # Usage: ./scripts/db-helpers.sh add-field <collection> <field_name> <type>
    # Example: ./scripts/db-helpers.sh add-field tours scheduled_publish timestamp
    
    COLLECTION=$2
    FIELD=$3
    TYPE=$4
    
    echo "📝 Adding field '$FIELD' to collection '$COLLECTION'..."
    
    # Main table
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c \
      "ALTER TABLE \"$COLLECTION\" ADD COLUMN IF NOT EXISTS \"$FIELD\" $TYPE;"
    
    # Version table
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c \
      "ALTER TABLE \"_${COLLECTION}_v\" ADD COLUMN IF NOT EXISTS \"version_$FIELD\" $TYPE;"
    
    echo "✅ Field added successfully!"
    ;;
    
  "add-array")
    # Usage: ./scripts/db-helpers.sh add-array <collection> <array_field> <item_column>
    # Example: ./scripts/db-helpers.sh add-array tours dietary_options option
    
    COLLECTION=$2
    ARRAY_FIELD=$3
    ITEM_COLUMN=$4
    
    echo "📝 Adding array field '$ARRAY_FIELD' to collection '$COLLECTION'..."
    
    # Main table relation
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME << EOF
CREATE TABLE IF NOT EXISTS "${COLLECTION}_${ARRAY_FIELD}" (
  _order INTEGER,
  _parent_id INTEGER REFERENCES "${COLLECTION}"(id) ON DELETE CASCADE,
  id SERIAL PRIMARY KEY,
  ${ITEM_COLUMN} TEXT,
  _uuid TEXT
);
CREATE INDEX IF NOT EXISTS "${COLLECTION}_${ARRAY_FIELD}_order_idx" ON "${COLLECTION}_${ARRAY_FIELD}" (_order);
EOF
    
    # Version table relation
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME << EOF
CREATE TABLE IF NOT EXISTS "_${COLLECTION}_v_version_${ARRAY_FIELD}" (
  _order INTEGER,
  _parent_id INTEGER REFERENCES "_${COLLECTION}_v"(id) ON DELETE CASCADE,
  id SERIAL PRIMARY KEY,
  ${ITEM_COLUMN} TEXT,
  _uuid TEXT
);
CREATE INDEX IF NOT EXISTS "_${COLLECTION}_v_version_${ARRAY_FIELD}_order_idx" ON "_${COLLECTION}_v_version_${ARRAY_FIELD}" (_order);
EOF
    
    echo "✅ Array field added successfully!"
    ;;
    
  "clear-richtext")
    # Usage: ./scripts/db-helpers.sh clear-richtext <collection> <field>
    # Example: ./scripts/db-helpers.sh clear-richtext about_page founder_story_text
    
    COLLECTION=$2
    FIELD=$3
    
    echo "🧹 Clearing HTML data from richText field '$FIELD' in '$COLLECTION'..."
    
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c \
      "UPDATE \"$COLLECTION\" SET \"$FIELD\" = NULL WHERE \"$FIELD\"::text LIKE '<%';"
    
    echo "✅ RichText field cleared!"
    ;;
    
  "check-schema")
    # Usage: ./scripts/db-helpers.sh check-schema <collection>
    
    COLLECTION=$2
    
    echo "🔍 Checking schema for collection '$COLLECTION'..."
    echo ""
    echo "=== Main Table ==="
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "\d $COLLECTION"
    
    echo ""
    echo "=== Version Table ==="
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "\d _${COLLECTION}_v"
    
    echo ""
    echo "=== Relation Tables ==="
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c \
      "SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE '${COLLECTION}%' ORDER BY tablename;"
    ;;
    
  "list-version-tables")
    echo "📋 All version tables:"
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c \
      "SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE '%_v%' ORDER BY tablename;"
    ;;
    
  "backup")
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    echo "💾 Creating backup: $BACKUP_FILE"
    pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > $BACKUP_FILE
    echo "✅ Backup created!"
    ;;
    
  "restore")
    # Usage: ./scripts/db-helpers.sh restore <backup_file.sql>
    BACKUP_FILE=$2
    if [ -z "$BACKUP_FILE" ]; then
      echo "❌ Error: Please specify backup file"
      echo "Usage: $0 restore backup_20260402_120000.sql"
      exit 1
    fi
    echo "⚠️  Restoring from backup: $BACKUP_FILE"
    echo "⚠️  This will DELETE all current data!"
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
      psql -h $DB_HOST -U $DB_USER -d $DB_NAME < $BACKUP_FILE
      echo "✅ Restore complete!"
    else
      echo "❌ Restore cancelled"
    fi
    ;;
    
  *)
    echo "Payload CMS Database Helper"
    echo ""
    echo "Usage: $0 <command> [arguments]"
    echo ""
    echo "Commands:"
    echo "  add-field <collection> <field_name> <type>     Add simple field to collection"
    echo "  add-array <collection> <array_field> <column>  Add array field with relation table"
    echo "  clear-richtext <collection> <field>            Clear HTML from Lexical field"
    echo "  check-schema <collection>                      Show table structure"
    echo "  list-version-tables                            List all version tables"
    echo "  backup                                         Create database backup"
    echo "  restore <backup.sql>                           Restore from backup"
    echo ""
    echo "Examples:"
    echo "  $0 add-field tours scheduled_publish TIMESTAMP(3) WITH TIME ZONE"
    echo "  $0 add-array tours dietary_options option"
    echo "  $0 clear-richtext stories content"
    echo "  $0 check-schema tours"
    echo "  $0 backup"
    ;;
esac

unset PGPASSWORD
