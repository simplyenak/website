#!/bin/sh
# ============================================================
# Schema Validation — Payload CMS PostgreSQL
# Checks that version tables (_v, _v_rels, _v_version_*)
# exist for every collection that has versions.drafts enabled.
#
# Run: ./scripts/validate-schema.sh
# ============================================================
set -e

# Build DATABASE_URL from env if provided as separate vars
if [ -z "$DATABASE_URL" ]; then
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

# If no database is reachable, skip validation
if ! psql "$DATABASE_URL" -c "SELECT 1" >/dev/null 2>&1; then
  echo "[schema-validate] ⚠  Cannot connect to database — skipping schema validation"
  exit 0
fi

# ── Collections WITH versions enabled (auto-discovered from collection configs) ──
# Format: "slug" or "slug _v_rels_needed"
# Each entry: slug, needs_rels (true/false), notes
# Add new collections to this list when you add versions to a collection.
COLLECTIONS='
tours                true    "Has dietary_options, specialty_experiences, travel_types etc. rels"
stories              true    "Has featured_image, gallery, author rels"
landing_pages        true    "Has hero_image, image rels"
content_briefs       true    "Has questions array sub-table + landing_pages rels"
testimonials         false
faqs                 false
media_coverage       false
vendors              false
pages                false
tour_masters         true    "Has dietary_options, food_items, media, tours rels"
tour_quiz            false
comparison_page      false
contact_page         false
corporate_groups_page false
directions_page      false
home_page            false
how_it_works_page    false
how_to_prepare_page  false
legal_pages          false
locations            false
menus                false
neighborhoods        false
private_tours_page   false
site_settings        false
specialty_experiences false
stories_page         false
tailored_tours_page  false
thank_you_pages      false
tours_page           false
track_record_page    false
travel_types         false
about_page           false
'

# ── Collections WITHOUT versions (explicitly tracked to catch accidental renames) ──
# These are expected to NOT have _v tables.
NO_VERSION_COLLECTIONS='
users
media
dietary_options
food_items
cte_posts
cte_pages
'

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  Payload CMS Schema Validation"
echo "═══════════════════════════════════════════════════════════════"
echo ""

ERRORS=0
WARNINGS=0
PASSED=0
MISSING_V_TABLES=""
MISSING_RELS_TABLES=""

# ── Phase 1: Check version-enabled collections ──
echo "── Phase 1: Version tables ──"

while IFS='|' read -r slug needs_rels notes; do
  # Skip empty lines and comments
  [ -z "$slug" ] && continue
  case "$slug" in
    \#*) continue ;;
  esac

  # Snugify: Payload converts hyphens to underscores in table names
  table_slug=$(echo "$slug" | tr '-' '_')
  v_table="_${table_slug}_v"

  exists=$(psql "$DATABASE_URL" -t -A -c "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='$v_table');" 2>/dev/null)

  if [ "$exists" = "t" ]; then
    echo "  ✅ $slug → $v_table exists"
    PASSED=$((PASSED + 1))
  else
    echo "  ❌ $slug → $v_table MISSING"
    ERRORS=$((ERRORS + 1))
    MISSING_V_TABLES="$MISSING_V_TABLES  - $slug ($v_table)\n"
  fi

  # Check _v_rels if needed
  if [ "$needs_rels" = "true" ]; then
    rels_table="_${table_slug}_v_rels"
    rels_exists=$(psql "$DATABASE_URL" -t -A -c "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='$rels_table');" 2>/dev/null)

    if [ "$rels_exists" = "t" ]; then
      echo "       └─ $rels_table ✓"
    else
      echo "       └─ $rels_table MISSING ⚠"
      WARNINGS=$((WARNINGS + 1))
      MISSING_RELS_TABLES="$MISSING_RELS_TABLES  - $slug ($rels_table)\n"
    fi
  fi

  # Check for _v_version_* array sub-tables
  # (Only collections with array fields need these)
  sub_tables=$(psql "$DATABASE_URL" -t -A -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE '_${table_slug}_v_version_%' ORDER BY table_name;" 2>/dev/null)
  if [ -n "$sub_tables" ]; then
    while IFS= read -r sub; do
      [ -z "$sub" ] && continue
      echo "       └─ $sub ✓ (array sub-table)"
    done <<EOF
$sub_tables
EOF
  fi

done <<EOF
$(echo "$COLLECTIONS" | sed 's/^[[:space:]]*//' | grep -v '^$' | awk '{print $1 "|" $2 "|" $3}')
EOF

# ── Phase 2: Check collections that should NOT have _v tables ──
echo ""
echo "── Phase 2: Verify no unexpected version tables ──"

for slug in $NO_VERSION_COLLECTIONS; do
  [ -z "$slug" ] && continue
  table_slug=$(echo "$slug" | tr '-' '_')
  v_table="_${table_slug}_v"

  exists=$(psql "$DATABASE_URL" -t -A -c "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='$v_table');" 2>/dev/null)

  if [ "$exists" = "t" ]; then
    echo "  ⚠  $slug has unexpected $v_table (collection has no versions config)"
    WARNINGS=$((WARNINGS + 1))
  else
    echo "  ✅ $slug correctly has no version table"
    PASSED=$((PASSED + 1))
  fi
done

# ── Phase 3: Check _v table column completeness ──
echo ""
echo "── Phase 3: Check _v table columns ──"

REQUIRED_V_COLUMNS="snapshot published_locale autosave latest version_updated_at version_created_at version__status"

for slug in $(echo "$COLLECTIONS" | sed 's/^[[:space:]]*//' | grep -v '^$' | awk '{print $1}'); do
  table_slug=$(echo "$slug" | tr '-' '_')
  v_table="_${table_slug}_v"

  exists=$(psql "$DATABASE_URL" -t -A -c "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='$v_table');" 2>/dev/null)

  if [ "$exists" != "t" ]; then
    continue  # Already reported in Phase 1
  fi

  for col in $REQUIRED_V_COLUMNS; do
    col_exists=$(psql "$DATABASE_URL" -t -A -c "SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='$v_table' AND column_name='$col');" 2>/dev/null)
    if [ "$col_exists" != "t" ]; then
      echo "  ⚠  $v_table missing column: $col"
      WARNINGS=$((WARNINGS + 1))
    fi
  done
done

# ── Summary ──
echo ""
echo "───────────────────────────────────────────────────────────"
echo "  Results: $PASSED passed, $ERRORS errors, $WARNINGS warnings"
echo "───────────────────────────────────────────────────────────"

if [ -n "$MISSING_V_TABLES" ]; then
  echo ""
  echo "❌ MISSING VERSION TABLES (fix urgently):"
  printf "$MISSING_V_TABLES"
  echo ""
  echo "   Run: psql \$DATABASE_URL -f scripts/fix-schema-drift.sql"
  echo "   Or:  pnpm run schema:fix"
fi

if [ -n "$MISSING_RELS_TABLES" ]; then
  echo ""
  echo "⚠  MISSING RELATIONSHIP SUB-TABLES:"
  printf "$MISSING_RELS_TABLES"
  echo ""
  echo "   Add CREATE TABLE IF NOT EXISTS statements to"
  echo "   scripts/fix-schema-drift.sql for these collections."
fi

echo ""

# Exit with error if critical version tables are missing
if [ "$ERRORS" -gt 0 ]; then
  exit 1
fi

exit 0
