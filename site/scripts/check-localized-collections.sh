#!/usr/bin/env bash
# check-localized-collections.sh
#
# Verifies which Payload collections actually have localized:true fields by
# reading the collection source files (the schema of truth). Used by
# push-translations-payload.mjs to decide whether ?locale= PATCHes are safe.
#
# Output: one line per collection with a localized field count, e.g.:
#   tours 4
#   faqs 0
#   stories 0
#
# Collections with 0 localized fields must NOT receive ?locale= PATCHes —
# Payload writes the value into the shared (en) field, corrupting English.
# See docs/i18n-helicopter-assessment-2026-08-03.md.

COLLECTIONS_DIR="${1:-revamp/backend/src/collections}"

if [ ! -d "$COLLECTIONS_DIR" ]; then
  echo "ERROR: collections dir not found: $COLLECTIONS_DIR" >&2
  exit 1
fi

for f in "$COLLECTIONS_DIR"/*.ts; do
  [ -f "$f" ] || continue
  name=$(basename "$f" .ts)
  # Count localized:true occurrences in the file (field-level marker)
  count=$(grep -c "localized: true" "$f" 2>/dev/null || echo 0)
  # Map CamelCase filename → Payload collection slug (kebab/snake lower)
  # Payload uses the collection 'slug' field; the filename is our best proxy.
  # Common mappings: FAQs→faqs, Tours→tours, LandingPages→landing_pages,
  # AboutPage→about_page. The push script matches by slug — output the raw
  # filename + count and let the caller map.
  echo "$name $count"
done
