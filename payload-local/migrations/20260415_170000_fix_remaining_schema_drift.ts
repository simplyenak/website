import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Fix remaining schema drift from the Apr 3 DB backup.
 *
 * Affected tables:
 *   contact_page         — add intro_title, intro_subtitle, parent_id
 *   _contact_page_v      — add version_intro_title, version_intro_subtitle
 *   home_page_blocks_hero_block — bg_image varchar → bg_image_id integer FK
 *   tours_gallery_images — image varchar → image_id integer FK
 *   site_settings        — add company_established + many other columns added after backup
 *                          (hero_image varchar → hero_image_id integer FK,
 *                           og_image varchar → og_image_id integer FK)
 *
 * All ADD COLUMN use IF NOT EXISTS; all DROP COLUMN use IF EXISTS — safe to re-run.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- ================================================================
    -- contact_page: add intro_title, intro_subtitle, parent_id
    -- ================================================================
    ALTER TABLE "contact_page"
      ADD COLUMN IF NOT EXISTS "intro_title"   varchar,
      ADD COLUMN IF NOT EXISTS "intro_subtitle" varchar,
      ADD COLUMN IF NOT EXISTS "parent_id"     integer;

    -- Self-referencing FK for nestedDocsPlugin breadcrumbs
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'contact_page_parent_id_fk'
          AND table_name = 'contact_page'
      ) THEN
        ALTER TABLE "contact_page"
          ADD CONSTRAINT "contact_page_parent_id_fk"
            FOREIGN KEY ("parent_id") REFERENCES "public"."contact_page"("id")
            ON DELETE set null ON UPDATE no action;
      END IF;
    END$$;

    CREATE INDEX IF NOT EXISTS "contact_page_parent_id_idx"
      ON "contact_page" USING btree ("parent_id");

    -- ================================================================
    -- _contact_page_v: add version_intro_title, version_intro_subtitle
    -- ================================================================
    ALTER TABLE "_contact_page_v"
      ADD COLUMN IF NOT EXISTS "version_intro_title"   varchar,
      ADD COLUMN IF NOT EXISTS "version_intro_subtitle" varchar;

    -- ================================================================
    -- home_page_blocks_hero_block: bg_image varchar → bg_image_id int FK
    -- ================================================================
    ALTER TABLE "home_page_blocks_hero_block"
      ADD COLUMN IF NOT EXISTS "bg_image_id" integer;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'home_page_blocks_hero_block_bg_image_id_fk'
          AND table_name = 'home_page_blocks_hero_block'
      ) THEN
        ALTER TABLE "home_page_blocks_hero_block"
          ADD CONSTRAINT "home_page_blocks_hero_block_bg_image_id_fk"
            FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id")
            ON DELETE set null ON UPDATE no action;
      END IF;
    END$$;

    CREATE INDEX IF NOT EXISTS "home_page_blocks_hero_block_bg_image_id_idx"
      ON "home_page_blocks_hero_block" USING btree ("bg_image_id");

    ALTER TABLE "home_page_blocks_hero_block"
      DROP COLUMN IF EXISTS "bg_image";

    -- ================================================================
    -- tours_gallery_images: image varchar → image_id integer FK
    -- ================================================================
    ALTER TABLE "tours_gallery_images"
      ADD COLUMN IF NOT EXISTS "image_id" integer;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'tours_gallery_images_image_id_fk'
          AND table_name = 'tours_gallery_images'
      ) THEN
        ALTER TABLE "tours_gallery_images"
          ADD CONSTRAINT "tours_gallery_images_image_id_fk"
            FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
            ON DELETE set null ON UPDATE no action;
      END IF;
    END$$;

    CREATE INDEX IF NOT EXISTS "tours_gallery_images_image_id_idx"
      ON "tours_gallery_images" USING btree ("image_id");

    ALTER TABLE "tours_gallery_images"
      DROP COLUMN IF EXISTS "image";

    -- ================================================================
    -- site_settings: add company_established + other post-backup fields
    -- ================================================================
    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "company_established"     numeric,
      ADD COLUMN IF NOT EXISTS "registration_no"         varchar,
      ADD COLUMN IF NOT EXISTS "hero_image_id"           integer,
      ADD COLUMN IF NOT EXISTS "og_image_id"             integer,
      ADD COLUMN IF NOT EXISTS "tour_price"              numeric,
      ADD COLUMN IF NOT EXISTS "tour_currency"           varchar DEFAULT 'MYR',
      ADD COLUMN IF NOT EXISTS "max_people_per_tour"     numeric,
      ADD COLUMN IF NOT EXISTS "tour_duration"           varchar,
      ADD COLUMN IF NOT EXISTS "heritage_vendors_count"  varchar,
      ADD COLUMN IF NOT EXISTS "years_operating"         varchar,
      ADD COLUMN IF NOT EXISTS "guests_hosted"           varchar,
      ADD COLUMN IF NOT EXISTS "rating"                  varchar,
      ADD COLUMN IF NOT EXISTS "review_count"            varchar,
      ADD COLUMN IF NOT EXISTS "forms_webhook_url"       varchar,
      ADD COLUMN IF NOT EXISTS "business_hours"          varchar,
      ADD COLUMN IF NOT EXISTS "booking_url"             varchar,
      ADD COLUMN IF NOT EXISTS "tagline"                 varchar,
      ADD COLUMN IF NOT EXISTS "description"             text,
      ADD COLUMN IF NOT EXISTS "address"                 text,
      ADD COLUMN IF NOT EXISTS "social_facebook"         varchar,
      ADD COLUMN IF NOT EXISTS "social_instagram"        varchar,
      ADD COLUMN IF NOT EXISTS "social_youtube"          varchar,
      ADD COLUMN IF NOT EXISTS "social_tripadvisor"      varchar,
      ADD COLUMN IF NOT EXISTS "social_tripadvisor_penang" varchar,
      ADD COLUMN IF NOT EXISTS "social_linkedin_company" varchar,
      ADD COLUMN IF NOT EXISTS "social_linkedin_maarten" varchar,
      ADD COLUMN IF NOT EXISTS "social_linkedin_pauline" varchar,
      ADD COLUMN IF NOT EXISTS "press_natgeo_url"        varchar,
      ADD COLUMN IF NOT EXISTS "press_lonelyplanet_url"  varchar,
      ADD COLUMN IF NOT EXISTS "press_cnn_url"           varchar,
      ADD COLUMN IF NOT EXISTS "press_routard_url"       varchar,
      ADD COLUMN IF NOT EXISTS "press_timeout_penang_url" varchar,
      ADD COLUMN IF NOT EXISTS "gmb_kl_url"              varchar,
      ADD COLUMN IF NOT EXISTS "gmb_penang_url"          varchar,
      ADD COLUMN IF NOT EXISTS "main_navigation"         jsonb,
      ADD COLUMN IF NOT EXISTS "mobile_navigation"       jsonb,
      ADD COLUMN IF NOT EXISTS "footer_navigation"       jsonb,
      ADD COLUMN IF NOT EXISTS "footer_copyright_text"   varchar,
      ADD COLUMN IF NOT EXISTS "sub_page_menus"          jsonb,
      ADD COLUMN IF NOT EXISTS "show_vendors"            boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "meta_title"              varchar,
      ADD COLUMN IF NOT EXISTS "meta_description"        text;

    -- hero_image_id FK
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'site_settings_hero_image_id_fk'
          AND table_name = 'site_settings'
      ) THEN
        ALTER TABLE "site_settings"
          ADD CONSTRAINT "site_settings_hero_image_id_fk"
            FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id")
            ON DELETE set null ON UPDATE no action;
      END IF;
    END$$;

    -- og_image_id FK
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'site_settings_og_image_id_fk'
          AND table_name = 'site_settings'
      ) THEN
        ALTER TABLE "site_settings"
          ADD CONSTRAINT "site_settings_og_image_id_fk"
            FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id")
            ON DELETE set null ON UPDATE no action;
      END IF;
    END$$;

    CREATE INDEX IF NOT EXISTS "site_settings_hero_image_id_idx"
      ON "site_settings" USING btree ("hero_image_id");
    CREATE INDEX IF NOT EXISTS "site_settings_og_image_id_idx"
      ON "site_settings" USING btree ("og_image_id");

    -- Drop old text image columns if they exist (replaced by *_id integer FKs)
    ALTER TABLE "site_settings"
      DROP COLUMN IF EXISTS "hero_image",
      DROP COLUMN IF EXISTS "og_image";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Restore site_settings
    ALTER TABLE "site_settings"
      DROP CONSTRAINT IF EXISTS "site_settings_og_image_id_fk",
      DROP CONSTRAINT IF EXISTS "site_settings_hero_image_id_fk",
      DROP COLUMN IF EXISTS "company_established",
      DROP COLUMN IF EXISTS "registration_no",
      DROP COLUMN IF EXISTS "hero_image_id",
      DROP COLUMN IF EXISTS "og_image_id",
      DROP COLUMN IF EXISTS "tour_price",
      DROP COLUMN IF EXISTS "tour_currency",
      DROP COLUMN IF EXISTS "max_people_per_tour",
      DROP COLUMN IF EXISTS "tour_duration",
      DROP COLUMN IF EXISTS "heritage_vendors_count",
      DROP COLUMN IF EXISTS "years_operating",
      DROP COLUMN IF EXISTS "guests_hosted",
      DROP COLUMN IF EXISTS "rating",
      DROP COLUMN IF EXISTS "review_count",
      DROP COLUMN IF EXISTS "forms_webhook_url",
      DROP COLUMN IF EXISTS "business_hours",
      DROP COLUMN IF EXISTS "booking_url",
      DROP COLUMN IF EXISTS "tagline",
      DROP COLUMN IF EXISTS "description",
      DROP COLUMN IF EXISTS "address",
      DROP COLUMN IF EXISTS "social_facebook",
      DROP COLUMN IF EXISTS "social_instagram",
      DROP COLUMN IF EXISTS "social_youtube",
      DROP COLUMN IF EXISTS "social_tripadvisor",
      DROP COLUMN IF EXISTS "social_tripadvisor_penang",
      DROP COLUMN IF EXISTS "social_linkedin_company",
      DROP COLUMN IF EXISTS "social_linkedin_maarten",
      DROP COLUMN IF EXISTS "social_linkedin_pauline",
      DROP COLUMN IF EXISTS "press_natgeo_url",
      DROP COLUMN IF EXISTS "press_lonelyplanet_url",
      DROP COLUMN IF EXISTS "press_cnn_url",
      DROP COLUMN IF EXISTS "press_routard_url",
      DROP COLUMN IF EXISTS "press_timeout_penang_url",
      DROP COLUMN IF EXISTS "gmb_kl_url",
      DROP COLUMN IF EXISTS "gmb_penang_url",
      DROP COLUMN IF EXISTS "main_navigation",
      DROP COLUMN IF EXISTS "mobile_navigation",
      DROP COLUMN IF EXISTS "footer_navigation",
      DROP COLUMN IF EXISTS "footer_copyright_text",
      DROP COLUMN IF EXISTS "sub_page_menus",
      DROP COLUMN IF EXISTS "show_vendors",
      DROP COLUMN IF EXISTS "meta_title",
      DROP COLUMN IF EXISTS "meta_description",
      ADD COLUMN IF NOT EXISTS "hero_image" varchar,
      ADD COLUMN IF NOT EXISTS "og_image" varchar;

    -- Restore tours_gallery_images
    ALTER TABLE "tours_gallery_images"
      DROP CONSTRAINT IF EXISTS "tours_gallery_images_image_id_fk",
      DROP COLUMN IF EXISTS "image_id",
      ADD COLUMN IF NOT EXISTS "image" varchar;

    -- Restore home_page_blocks_hero_block
    ALTER TABLE "home_page_blocks_hero_block"
      DROP CONSTRAINT IF EXISTS "home_page_blocks_hero_block_bg_image_id_fk",
      DROP COLUMN IF EXISTS "bg_image_id",
      ADD COLUMN IF NOT EXISTS "bg_image" varchar;

    -- Restore _contact_page_v
    ALTER TABLE "_contact_page_v"
      DROP COLUMN IF EXISTS "version_intro_title",
      DROP COLUMN IF EXISTS "version_intro_subtitle";

    -- Restore contact_page
    ALTER TABLE "contact_page"
      DROP CONSTRAINT IF EXISTS "contact_page_parent_id_fk",
      DROP COLUMN IF EXISTS "intro_title",
      DROP COLUMN IF EXISTS "intro_subtitle",
      DROP COLUMN IF EXISTS "parent_id";
  `)
}
