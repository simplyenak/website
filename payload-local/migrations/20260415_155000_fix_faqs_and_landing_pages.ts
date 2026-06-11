import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Fix schema drift in faqs and landing_pages collections.
 *
 * faqs:     rename tour_id → related_tour_id, add related_story_id, drop legacy varchar columns
 * _faqs_v:  same rename in version table
 * landing_pages: add hero_image_id and meta_image_id (replacing old text hero_image column)
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- ============================================================
    -- faqs: rename tour_id → related_tour_id, add related_story_id
    -- ============================================================
    ALTER TABLE "faqs"
      ADD COLUMN IF NOT EXISTS "related_tour_id" integer,
      ADD COLUMN IF NOT EXISTS "related_story_id" integer;

    -- Migrate existing tour_id data (was stored as numeric)
    UPDATE "faqs"
    SET "related_tour_id" = "tour_id"::integer
    WHERE "tour_id" IS NOT NULL;

    ALTER TABLE "faqs"
      ADD CONSTRAINT "faqs_related_tour_id_fk"
        FOREIGN KEY ("related_tour_id") REFERENCES "public"."tours"("id")
        ON DELETE set null ON UPDATE no action,
      ADD CONSTRAINT "faqs_related_story_id_fk"
        FOREIGN KEY ("related_story_id") REFERENCES "public"."stories"("id")
        ON DELETE set null ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "faqs_related_tour_id_idx"
      ON "faqs" USING btree ("related_tour_id");
    CREATE INDEX IF NOT EXISTS "faqs_related_story_id_idx"
      ON "faqs" USING btree ("related_story_id");

    -- Drop legacy columns (now in separate tables or removed from schema)
    ALTER TABLE "faqs"
      DROP COLUMN IF EXISTS "tour_id",
      DROP COLUMN IF EXISTS "page_visibility",
      DROP COLUMN IF EXISTS "tags";

    -- ============================================================
    -- _faqs_v: same rename for version table
    -- ============================================================
    ALTER TABLE "_faqs_v"
      ADD COLUMN IF NOT EXISTS "version_related_tour_id" integer,
      ADD COLUMN IF NOT EXISTS "version_related_story_id" integer;

    UPDATE "_faqs_v"
    SET "version_related_tour_id" = "version_tour_id"::integer
    WHERE "version_tour_id" IS NOT NULL;

    ALTER TABLE "_faqs_v"
      DROP COLUMN IF EXISTS "version_tour_id",
      DROP COLUMN IF EXISTS "version_page_visibility",
      DROP COLUMN IF EXISTS "version_tags";

    -- ============================================================
    -- landing_pages: add hero_image_id and meta_image_id
    -- ============================================================
    ALTER TABLE "landing_pages"
      ADD COLUMN IF NOT EXISTS "hero_image_id" integer,
      ADD COLUMN IF NOT EXISTS "meta_image_id" integer;

    ALTER TABLE "landing_pages"
      ADD CONSTRAINT "landing_pages_hero_image_id_fk"
        FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action,
      ADD CONSTRAINT "landing_pages_meta_image_id_fk"
        FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "landing_pages_hero_image_id_idx"
      ON "landing_pages" USING btree ("hero_image_id");
    CREATE INDEX IF NOT EXISTS "landing_pages_meta_image_id_idx"
      ON "landing_pages" USING btree ("meta_image_id");

    -- Drop old text hero_image column (never had data; replaced by hero_image_id integer FK)
    ALTER TABLE "landing_pages"
      DROP COLUMN IF EXISTS "hero_image";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Restore landing_pages
    ALTER TABLE "landing_pages"
      DROP CONSTRAINT IF EXISTS "landing_pages_meta_image_id_fk",
      DROP CONSTRAINT IF EXISTS "landing_pages_hero_image_id_fk",
      DROP COLUMN IF EXISTS "meta_image_id",
      DROP COLUMN IF EXISTS "hero_image_id",
      ADD COLUMN IF NOT EXISTS "hero_image" text;

    -- Restore _faqs_v
    ALTER TABLE "_faqs_v"
      ADD COLUMN IF NOT EXISTS "version_tour_id" numeric,
      ADD COLUMN IF NOT EXISTS "version_page_visibility" varchar,
      ADD COLUMN IF NOT EXISTS "version_tags" varchar;
    UPDATE "_faqs_v"
    SET "version_tour_id" = "version_related_tour_id"
    WHERE "version_related_tour_id" IS NOT NULL;
    ALTER TABLE "_faqs_v"
      DROP COLUMN IF EXISTS "version_related_tour_id",
      DROP COLUMN IF EXISTS "version_related_story_id";

    -- Restore faqs
    ALTER TABLE "faqs"
      ADD COLUMN IF NOT EXISTS "tour_id" numeric,
      ADD COLUMN IF NOT EXISTS "page_visibility" varchar,
      ADD COLUMN IF NOT EXISTS "tags" varchar;
    UPDATE "faqs"
    SET "tour_id" = "related_tour_id"
    WHERE "related_tour_id" IS NOT NULL;
    ALTER TABLE "faqs"
      DROP CONSTRAINT IF EXISTS "faqs_related_story_id_fk",
      DROP CONSTRAINT IF EXISTS "faqs_related_tour_id_fk",
      DROP COLUMN IF EXISTS "related_tour_id",
      DROP COLUMN IF EXISTS "related_story_id";
  `)
}
