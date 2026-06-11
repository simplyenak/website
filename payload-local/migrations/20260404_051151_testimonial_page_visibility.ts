import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Add page_visibility column to testimonials
    ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "page_visibility" varchar;
    ALTER TABLE "_testimonials_v" ADD COLUMN IF NOT EXISTS "version_page_visibility" varchar;

    -- Create testimonials_rels table for hasMany relatedTours relationship
    CREATE TABLE IF NOT EXISTS "testimonials_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "tours_id" integer
    );

    -- Create _testimonials_v_rels table for versioned hasMany relatedTours
    CREATE TABLE IF NOT EXISTS "_testimonials_v_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "tours_id" integer
    );

    -- Foreign keys for testimonials_rels
    ALTER TABLE "testimonials_rels"
      ADD CONSTRAINT "testimonials_rels_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "testimonials_rels"
      ADD CONSTRAINT "testimonials_rels_tours_fk"
      FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id")
      ON DELETE cascade ON UPDATE no action;

    -- Foreign keys for _testimonials_v_rels
    ALTER TABLE "_testimonials_v_rels"
      ADD CONSTRAINT "_testimonials_v_rels_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."_testimonials_v"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_testimonials_v_rels"
      ADD CONSTRAINT "_testimonials_v_rels_tours_fk"
      FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id")
      ON DELETE cascade ON UPDATE no action;

    -- Indexes for testimonials_rels
    CREATE INDEX IF NOT EXISTS "testimonials_rels_order_idx" ON "testimonials_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "testimonials_rels_parent_idx" ON "testimonials_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "testimonials_rels_path_idx" ON "testimonials_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "testimonials_rels_tours_id_idx" ON "testimonials_rels" USING btree ("tours_id");

    -- Indexes for _testimonials_v_rels
    CREATE INDEX IF NOT EXISTS "_testimonials_v_rels_order_idx" ON "_testimonials_v_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "_testimonials_v_rels_parent_idx" ON "_testimonials_v_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_testimonials_v_rels_path_idx" ON "_testimonials_v_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "_testimonials_v_rels_tours_id_idx" ON "_testimonials_v_rels" USING btree ("tours_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_testimonials_v_rels" CASCADE;
    DROP TABLE IF EXISTS "testimonials_rels" CASCADE;
    ALTER TABLE "_testimonials_v" DROP COLUMN IF EXISTS "version_page_visibility";
    ALTER TABLE "testimonials" DROP COLUMN IF EXISTS "page_visibility";
  `)
}
