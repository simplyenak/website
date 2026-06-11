import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Fix _landing_pages_v: replace old-style `version jsonb` column with flat version_* columns.
 *
 * The Apr-3 DB backup created _landing_pages_v with a legacy JSONB `version` column
 * (Payload v2 style). Drizzle expects flat version_* columns (Payload v3 style).
 *
 * The child tables (_landing_pages_v_version_challenges, etc.) and the locales table
 * (_landing_pages_v_locales) already exist and are correct — only the base table is wrong.
 *
 * All new columns use ADD COLUMN IF NOT EXISTS so this is safe to re-run.
 * Drops use DROP COLUMN IF EXISTS for the same reason.
 *
 * Data loss: none — the table had 0 rows and the jsonb column was never written by Payload v3.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Add flat version_* columns (non-localized / structural fields)
    ALTER TABLE "_landing_pages_v"
      ADD COLUMN IF NOT EXISTS "version_slug"              varchar,
      ADD COLUMN IF NOT EXISTS "version_type"              varchar(20),
      ADD COLUMN IF NOT EXISTS "version_status"            varchar(50) DEFAULT 'draft',
      ADD COLUMN IF NOT EXISTS "version_icon"              varchar,
      ADD COLUMN IF NOT EXISTS "version_color"             varchar,
      ADD COLUMN IF NOT EXISTS "version_hero_image_id"     integer,
      ADD COLUMN IF NOT EXISTS "version_published_at"      timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "version_updated_at"        timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "version_created_at"        timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "version__status"           "enum__landing_pages_v_version_status" DEFAULT 'draft';

    -- Add flat version_* columns (localized text fields — stored flat, not in _locales)
    ALTER TABLE "_landing_pages_v"
      ADD COLUMN IF NOT EXISTS "version_title"                  varchar,
      ADD COLUMN IF NOT EXISTS "version_hero_title"             varchar,
      ADD COLUMN IF NOT EXISTS "version_hero_subtitle"          varchar,
      ADD COLUMN IF NOT EXISTS "version_hero_description"       varchar,
      ADD COLUMN IF NOT EXISTS "version_intro_heading"          varchar,
      ADD COLUMN IF NOT EXISTS "version_intro_content"          varchar,
      ADD COLUMN IF NOT EXISTS "version_challenges_heading"     varchar,
      ADD COLUMN IF NOT EXISTS "version_options_heading"        varchar,
      ADD COLUMN IF NOT EXISTS "version_options_content"        varchar,
      ADD COLUMN IF NOT EXISTS "version_features_heading"       varchar,
      ADD COLUMN IF NOT EXISTS "version_tips_heading"           varchar,
      ADD COLUMN IF NOT EXISTS "version_tips_content"           varchar,
      ADD COLUMN IF NOT EXISTS "version_safe_dishes_heading"    varchar,
      ADD COLUMN IF NOT EXISTS "version_avoid_dishes_heading"   varchar,
      ADD COLUMN IF NOT EXISTS "version_tours_heading"          varchar,
      ADD COLUMN IF NOT EXISTS "version_meta_title"             varchar,
      ADD COLUMN IF NOT EXISTS "version_meta_description"       varchar,
      ADD COLUMN IF NOT EXISTS "version_meta_image_id"          integer;

    -- Drop legacy JSONB columns (were never written by Payload v3)
    ALTER TABLE "_landing_pages_v"
      DROP COLUMN IF EXISTS "version",
      DROP COLUMN IF EXISTS "version_label";

    -- Index on parent_id for version lookups (safe to create if missing)
    CREATE INDEX IF NOT EXISTS "_landing_pages_v_parent_id_idx"
      ON "_landing_pages_v" USING btree ("parent_id");

    CREATE INDEX IF NOT EXISTS "_landing_pages_v_version_created_at_idx"
      ON "_landing_pages_v" USING btree ("version_created_at");

    CREATE INDEX IF NOT EXISTS "_landing_pages_v_latest_idx"
      ON "_landing_pages_v" USING btree ("latest");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Restore legacy JSONB structure
    ALTER TABLE "_landing_pages_v"
      ADD COLUMN IF NOT EXISTS "version" jsonb,
      ADD COLUMN IF NOT EXISTS "version_label" text;

    -- Drop the flat columns added in up()
    ALTER TABLE "_landing_pages_v"
      DROP COLUMN IF EXISTS "version_slug",
      DROP COLUMN IF EXISTS "version_type",
      DROP COLUMN IF EXISTS "version_status",
      DROP COLUMN IF EXISTS "version_icon",
      DROP COLUMN IF EXISTS "version_color",
      DROP COLUMN IF EXISTS "version_hero_image_id",
      DROP COLUMN IF EXISTS "version_published_at",
      DROP COLUMN IF EXISTS "version_updated_at",
      DROP COLUMN IF EXISTS "version_created_at",
      DROP COLUMN IF EXISTS "version__status",
      DROP COLUMN IF EXISTS "version_title",
      DROP COLUMN IF EXISTS "version_hero_title",
      DROP COLUMN IF EXISTS "version_hero_subtitle",
      DROP COLUMN IF EXISTS "version_hero_description",
      DROP COLUMN IF EXISTS "version_intro_heading",
      DROP COLUMN IF EXISTS "version_intro_content",
      DROP COLUMN IF EXISTS "version_challenges_heading",
      DROP COLUMN IF EXISTS "version_options_heading",
      DROP COLUMN IF EXISTS "version_options_content",
      DROP COLUMN IF EXISTS "version_features_heading",
      DROP COLUMN IF EXISTS "version_tips_heading",
      DROP COLUMN IF EXISTS "version_tips_content",
      DROP COLUMN IF EXISTS "version_safe_dishes_heading",
      DROP COLUMN IF EXISTS "version_avoid_dishes_heading",
      DROP COLUMN IF EXISTS "version_tours_heading",
      DROP COLUMN IF EXISTS "version_meta_title",
      DROP COLUMN IF EXISTS "version_meta_description",
      DROP COLUMN IF EXISTS "version_meta_image_id";
  `)
}
