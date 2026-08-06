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
-- Fix array sub-tables: _locale NOT NULL constraint on non-localized collections
-- Payload 3 may create array sub-tables with NOT NULL _locale even on
-- collections WITHOUT localization enabled. This causes inserts to fail
-- with "null value in column _locale violates not-null constraint".
-- ============================================================

DO $$ BEGIN
  RAISE NOTICE 'Fixing _locale NOT NULL on array sub-tables...';
END $$;

ALTER TABLE how_to_prepare_page_what_to_wear ALTER COLUMN _locale DROP NOT NULL;
ALTER TABLE how_to_prepare_page_what_to_bring ALTER COLUMN _locale DROP NOT NULL;
ALTER TABLE how_to_prepare_page_what_to_expect ALTER COLUMN _locale DROP NOT NULL;
ALTER TABLE how_to_prepare_page_dietary_notes ALTER COLUMN _locale DROP NOT NULL;
ALTER TABLE how_it_works_page_steps ALTER COLUMN _locale DROP NOT NULL;
ALTER TABLE how_it_works_page_inclusions ALTER COLUMN _locale DROP NOT NULL;
ALTER TABLE how_it_works_page_formats ALTER COLUMN _locale DROP NOT NULL;

-- Also fix version sub-tables
ALTER TABLE _how_to_prepare_page_v_version_what_to_wear ALTER COLUMN _locale DROP NOT NULL;
ALTER TABLE _how_to_prepare_page_v_version_what_to_bring ALTER COLUMN _locale DROP NOT NULL;
ALTER TABLE _how_to_prepare_page_v_version_what_to_expect ALTER COLUMN _locale DROP NOT NULL;
ALTER TABLE _how_to_prepare_page_v_version_dietary_notes ALTER COLUMN _locale DROP NOT NULL;
ALTER TABLE _how_it_works_page_v_version_steps ALTER COLUMN _locale DROP NOT NULL;
ALTER TABLE _how_it_works_page_v_version_inclusions ALTER COLUMN _locale DROP NOT NULL;
ALTER TABLE _how_it_works_page_v_version_formats ALTER COLUMN _locale DROP NOT NULL;

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

-- Create stories_rels — missing relation table from specialty_experiences field addition
CREATE TABLE IF NOT EXISTS stories_rels (
    id INTEGER NOT NULL DEFAULT nextval('stories_rels_id_seq'::regclass),
    "order" INTEGER,
    parent_id INTEGER NOT NULL,
    path VARCHAR(255) NOT NULL,
    specialty_experiences_id INTEGER
);
ALTER TABLE stories_rels ADD PRIMARY KEY IF NOT EXISTS (id);
CREATE INDEX IF NOT EXISTS stories_rels_parent_idx ON stories_rels (parent_id);
CREATE INDEX IF NOT EXISTS stories_rels_path_idx ON stories_rels (path);
CREATE INDEX IF NOT EXISTS stories_rels_order_idx ON stories_rels ("order");
CREATE INDEX IF NOT EXISTS stories_rels_specialty_experiences_idx ON stories_rels (specialty_experiences_id);

-- Also create the version table if it doesn't exist
CREATE TABLE IF NOT EXISTS _stories_v_rels (
    id INTEGER,
    "order" INTEGER,
    parent_id INTEGER,
    path VARCHAR(255),
    specialty_experiences_id INTEGER
);

-- ============================================================
-- CTE collections (cte_posts / cte_pages)
-- Payload push:true does NOT create these tables on this deployment.
-- Schema must match src/collections/CtePosts.ts / CtePages.ts:
--   - single upload/relationship fields become direct <field>_id columns
--   - no versions => no _status column
--   - workflow_status is a proper Postgres ENUM (draft/in_review/approved/published)
-- ============================================================

-- workflow_status as proper Postgres ENUMs (matches what Payload generates for
-- select fields). Created BEFORE the tables reference them; existing VARCHAR
-- columns are migrated with the USING cast so idempotent re-runs are safe.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_cte_posts_workflow_status') THEN
    CREATE TYPE enum_cte_posts_workflow_status AS ENUM ('draft', 'in_review', 'approved', 'published');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_cte_pages_workflow_status') THEN
    CREATE TYPE enum_cte_pages_workflow_status AS ENUM ('draft', 'in_review', 'approved', 'published');
  END IF;
END $$;

CREATE SEQUENCE IF NOT EXISTS cte_posts_id_seq START WITH 1;

CREATE TABLE IF NOT EXISTS cte_posts (
    id integer NOT NULL DEFAULT nextval('cte_posts_id_seq'::regclass),
    title text,
    slug character varying,
    excerpt text,
    content_markdown text,
    featured_image_id integer,
    published_date timestamp with time zone,
    meta_title text,
    meta_description text,
    workflow_status enum_cte_posts_workflow_status DEFAULT 'draft',
    author_id integer,
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS cte_posts_slug_idx ON cte_posts (slug);

CREATE SEQUENCE IF NOT EXISTS cte_pages_id_seq START WITH 1;

CREATE TABLE IF NOT EXISTS cte_pages (
    id integer NOT NULL DEFAULT nextval('cte_pages_id_seq'::regclass),
    title text,
    slug character varying,
    content_markdown text,
    featured_image_id integer,
    meta_title text,
    meta_description text,
    workflow_status enum_cte_pages_workflow_status DEFAULT 'draft',
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS cte_pages_slug_idx ON cte_pages (slug);

-- payload_locked_documents_rels: add CTE columns (Payload's document-locking
-- join table gets one column per collection; push:true never added these when
-- cte_posts/cte_pages were introduced — missing them 500s forgot-password and
-- the admin edit view)
ALTER TABLE payload_locked_documents_rels ADD COLUMN IF NOT EXISTS cte_posts_id INTEGER;
ALTER TABLE payload_locked_documents_rels ADD COLUMN IF NOT EXISTS cte_pages_id INTEGER;

-- Migrate pre-existing VARCHAR columns to the enum types (no-op on fresh DBs).
-- The existing DEFAULT must be dropped first — Postgres can't auto-cast a
-- varchar default during a column type change.
ALTER TABLE cte_posts ALTER COLUMN workflow_status DROP DEFAULT;
ALTER TABLE cte_posts ALTER COLUMN workflow_status TYPE enum_cte_posts_workflow_status
  USING workflow_status::enum_cte_posts_workflow_status;
ALTER TABLE cte_posts ALTER COLUMN workflow_status SET DEFAULT 'draft';
ALTER TABLE cte_pages ALTER COLUMN workflow_status DROP DEFAULT;
ALTER TABLE cte_pages ALTER COLUMN workflow_status TYPE enum_cte_pages_workflow_status
  USING workflow_status::enum_cte_pages_workflow_status;
ALTER TABLE cte_pages ALTER COLUMN workflow_status SET DEFAULT 'draft';

-- landing_pages.travel_tips array sub-tables: _locale NOT NULL bug (Payload
-- creates array sub-tables with NOT NULL _locale even for non-localized
-- collections — PATCH on the parent 500s). Added with the travel_tips field
-- (2026-08-06); keep both main and version sub-tables aligned.
ALTER TABLE landing_pages_travel_tips ALTER COLUMN _locale DROP NOT NULL;
ALTER TABLE _landing_pages_v_version_travel_tips ALTER COLUMN _locale DROP NOT NULL;

DO $$ BEGIN
  RAISE NOTICE 'Schema drift fix complete.';
END $$;
