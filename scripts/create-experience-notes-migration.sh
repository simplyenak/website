#!/bin/bash
# Create migration for experience_notes collection
# Run: bash scripts/create-experience-notes-migration.sh

MIGRATION_NAME="add_experience_notes_collection"
MIGRATION_DIR="/var/home/maarten/website-optimization/revamp/backend/migrations"

# Create migration file
cat > "${MIGRATION_DIR}/${MIGRATION_NAME}.sql" << 'EOF'
-- Migration: Add experience_notes collection
-- Created: 2026-08-06
-- Purpose: Store first-hand experience notes from guides for content enrichment

CREATE TABLE IF NOT EXISTS "experience_notes" (
  "id" varchar(255) PRIMARY KEY NOT NULL,
  "title" text,
  "slug" text,
  "location" text,
  "note_type" text,
  "dishes" jsonb,
  "vendors" jsonb,
  "sensory_details" jsonb,
  "surprises" text,
  "recommendations" jsonb,
  "best_time" text,
  "price_range" text,
  "raw_note" text,
  "submitted_by" text,
  "submitted_email" text,
  "status" text DEFAULT 'draft',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "draft_auth_token" varchar(255),
  "published_at" timestamptz,
  "updated_by" varchar(255),
  "created_by" varchar(255),
  UNIQUE ("slug")
);

COMMENT ON TABLE "experience_notes" IS 'First-hand experience notes from guides — prices, vendors, sensory details, surprises';

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS "experience_notes_location_idx" ON "experience_notes"("location");
CREATE INDEX IF NOT EXISTS "experience_notes_status_idx" ON "experience_notes"("status");
CREATE INDEX IF NOT EXISTS "experience_notes_created_at_idx" ON "experience_notes"("created_at" DESC);
CREATE INDEX IF NOT EXISTS "experience_notes_slug_idx" ON "experience_notes"("slug");

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_experience_notes_updated_at ON "experience_notes";
CREATE TRIGGER update_experience_notes_updated_at
   BEFORE UPDATE ON "experience_notes"
   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EOF

echo "Migration created: ${MIGRATION_DIR}/${MIGRATION_NAME}.sql"
echo ""
echo "To apply:"
echo "  cd /var/home/maarten/website-optimization/revamp/backend"
echo "  npx payload migrate"
echo ""
echo "Then rebuild and redeploy the backend service."
