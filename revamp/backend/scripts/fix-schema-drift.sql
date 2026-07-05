-- ============================================================
-- Schema Drift Fix — run on Payload CMS PostgreSQL database
-- 
-- Payload 3's `push: true` often misses version table columns
-- and sub-tables for collections with versions.drafts enabled.
-- This script fills those gaps.
--
-- Run: psql $DATABASE_URL -f fix-schema-drift.sql
-- ============================================================

DO $$ BEGIN
  RAISE NOTICE 'Fixing content_briefs version tables...';
END $$;

-- _content_briefs_v: missing columns for version meta
ALTER TABLE _content_briefs_v ADD COLUMN IF NOT EXISTS version_updated_at TIMESTAMPTZ;
ALTER TABLE _content_briefs_v ADD COLUMN IF NOT EXISTS version_created_at TIMESTAMPTZ;
ALTER TABLE _content_briefs_v ADD COLUMN IF NOT EXISTS version__status VARCHAR(255);
ALTER TABLE _content_briefs_v ADD COLUMN IF NOT EXISTS snapshot JSONB;
ALTER TABLE _content_briefs_v ADD COLUMN IF NOT EXISTS published_locale TEXT;
ALTER TABLE _content_briefs_v ADD COLUMN IF NOT EXISTS autosave BOOLEAN;
ALTER TABLE _content_briefs_v ADD COLUMN IF NOT EXISTS latest BOOLEAN DEFAULT false;

-- _content_briefs_v_version_questions: version sub-table for array
CREATE TABLE IF NOT EXISTS _content_briefs_v_version_questions (
    _order INTEGER,
    _parent_id INTEGER,
    _locale TEXT,
    id INTEGER,
    question TEXT,
    answer TEXT,
    quality VARCHAR(255),
    follow_up TEXT,
    intended_for VARCHAR(255),
    _uuid VARCHAR(255)
);

-- _content_briefs_v_rels: version relationship table
CREATE TABLE IF NOT EXISTS _content_briefs_v_rels (
    id INTEGER,
    "order" INTEGER,
    parent_id INTEGER,
    path VARCHAR(255),
    landing_pages_id INTEGER
);

-- Mark the latest version for existing documents
UPDATE _content_briefs_v SET latest = true
WHERE id IN (
  SELECT DISTINCT ON (parent_id) id
  FROM _content_briefs_v
  ORDER BY parent_id, updated_at DESC
);

-- ============================================================
-- Add other missing version sub-tables for ALL collections
-- ============================================================

DO $$ BEGIN
  RAISE NOTICE 'Checking _tours_v_rels...';
END $$;
CREATE TABLE IF NOT EXISTS _tours_v_rels (
    id INTEGER, "order" INTEGER, parent_id INTEGER, path VARCHAR(255),
    dietary_options_id INTEGER, specialty_experiences_id INTEGER,
    travel_types_id INTEGER, locations_id INTEGER, neighborhoods_id INTEGER,
    featured_image_id INTEGER, gallery_images_id INTEGER,
    gallery_image_alts_id INTEGER, guide_id INTEGER
);

DO $$ BEGIN
  RAISE NOTICE 'Checking _stories_v_rels...';
END $$;
CREATE TABLE IF NOT EXISTS _stories_v_rels (
    id INTEGER, "order" INTEGER, parent_id INTEGER, path VARCHAR(255),
    featured_image_id INTEGER, gallery_id INTEGER, author_id INTEGER
);

DO $$ BEGIN
  RAISE NOTICE 'Checking _landing_pages_v_rels...';
END $$;
CREATE TABLE IF NOT EXISTS _landing_pages_v_rels (
    id INTEGER, "order" INTEGER, parent_id INTEGER, path VARCHAR(255),
    hero_image_id INTEGER, image_id INTEGER
);

-- ============================================================
-- Fix media_rels columns (taxonomy relationships)
-- ============================================================
DO $$ BEGIN
  RAISE NOTICE 'Checking media_rels taxonomy columns...';
END $$;
ALTER TABLE media_rels ADD COLUMN IF NOT EXISTS "order" INTEGER;
ALTER TABLE media_rels ADD COLUMN IF NOT EXISTS neighborhoods_id INTEGER;
ALTER TABLE media_rels ADD COLUMN IF NOT EXISTS food_items_id INTEGER;
ALTER TABLE media_rels ADD COLUMN IF NOT EXISTS dietary_options_id INTEGER;
ALTER TABLE media_rels ADD COLUMN IF NOT EXISTS travel_types_id INTEGER;
ALTER TABLE media_rels ADD COLUMN IF NOT EXISTS specialty_experiences_id INTEGER;
ALTER TABLE media_rels ADD COLUMN IF NOT EXISTS vendors_id INTEGER;

-- ============================================================
-- Fix missing main-table columns (Payload push:true misses these)
-- ============================================================

DO $$ BEGIN
  RAISE NOTICE 'Checking how_it_works_page for missing columns...';
END $$;
ALTER TABLE how_it_works_page ADD COLUMN IF NOT EXISTS steps_heading TEXT;
ALTER TABLE how_it_works_page ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE how_it_works_page ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- ============================================================
-- Add missing version_* columns to any version table that lacks them
DO $$
DECLARE
    tbl TEXT;
    parent TEXT;
    col RECORD;
    vcol TEXT;
BEGIN
    FOR tbl IN
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name ~ '^_[a-z_]+_v$'
          AND table_name NOT LIKE '%\_v\_%'
    LOOP
        -- Add common Payload version meta columns
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS snapshot JSONB', tbl);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS published_locale TEXT', tbl);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS autosave BOOLEAN', tbl);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS latest BOOLEAN DEFAULT false', tbl);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS version_updated_at TIMESTAMPTZ', tbl);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS version_created_at TIMESTAMPTZ', tbl);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS version__status VARCHAR(255)', tbl);

        -- Derive parent table name (strip leading '_' and trailing '_v')
        parent := substring(tbl FROM 2)::text;
        parent := substring(parent FROM 1 FOR length(parent) - 2);

        -- Try to find and sync missing field-specific version columns
        -- If the parent table doesn't exist, skip
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = parent) THEN
            FOR col IN
                SELECT column_name, data_type, character_maximum_length
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = parent
                  AND column_name NOT IN ('id', 'created_at', 'updated_at', '_status')
                  AND column_name NOT LIKE '%\_locale'
            LOOP
                -- Determine the expected version column name
                -- Upload/relationship fields get '_id' suffix in version table
                IF col.data_type IN ('integer', 'bigint') AND EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public'
                      AND table_name = parent
                      AND column_name = col.column_name
                      AND col.column_name IN (
                          SELECT SUBSTRING(column_name FROM 1 FOR length(column_name) - 3)
                          FROM information_schema.columns
                          WHERE table_schema = 'public'
                            AND table_name = parent
                            AND column_name LIKE '%\\_id'
                      )
                ) THEN
                    -- This column_name is already an FK ID (ends with _id)
                    vcol := 'version_' || col.column_name;
                ELSIF col.data_type = 'integer' AND EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public'
                      AND table_name = parent
                      AND column_name = col.column_name || '_id'
                ) THEN
                    -- This column has a corresponding FK ID column
                    vcol := 'version_' || col.column_name || '_id';
                ELSE
                    vcol := 'version_' || col.column_name;
                END IF;

                -- Add the column if it doesn't exist
                BEGIN
                    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS %I ' ||
                        CASE
                            WHEN col.data_type IN ('character varying', 'character') AND col.character_maximum_length IS NOT NULL
                                THEN col.data_type || '(' || col.character_maximum_length || ')'
                            WHEN col.data_type = 'USER-DEFINED' THEN 'TEXT'
                            ELSE col.data_type
                        END,
                        tbl, vcol);
                EXCEPTION WHEN OTHERS THEN
                    RAISE NOTICE 'Could not add column %.%: %', tbl, vcol, SQLERRM;
                END;
            END LOOP;
        END IF;
    END LOOP;
END $$;

-- Mark latest on all version tables
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name ~ '^_[a-z_]+_v$'
          AND table_name NOT LIKE '%\_v\_%'
          AND EXISTS (
              SELECT 1 FROM information_schema.columns
              WHERE table_name = tbl AND column_name = 'latest'
          )
    LOOP
        EXECUTE format(
            'UPDATE %I SET latest = true WHERE id IN (SELECT DISTINCT ON (parent_id) id FROM %I ORDER BY parent_id, COALESCE(version_updated_at, updated_at) DESC)',
            tbl, tbl
        );
    END LOOP;
END $$;

DO $$ BEGIN
  RAISE NOTICE 'Schema drift fix complete.';
END $$;
