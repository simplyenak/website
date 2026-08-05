import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "stories" ADD COLUMN IF NOT EXISTS "locations_ref" jsonb NULL;
    ALTER TABLE "_stories_v" ADD COLUMN IF NOT EXISTS "version_locations_ref" jsonb NULL;

    CREATE TABLE IF NOT EXISTS "stories_rels" (
      "id" serial NOT NULL PRIMARY KEY,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar(255),
      "locations_ref_id" integer
    );

    CREATE SEQUENCE IF NOT EXISTS "stories_rels_id_seq";
    ALTER TABLE "stories_rels" ALTER COLUMN "id" SET DEFAULT nextval('"stories_rels_id_seq"'::regclass);
    CREATE INDEX IF NOT EXISTS "stories_rels_parent_idx" ON "stories_rels" ("parent_id");
    CREATE INDEX IF NOT EXISTS "stories_rels_order_idx" ON "stories_rels" ("order");
    CREATE INDEX IF NOT EXISTS "stories_rels_path_idx" ON "stories_rels" ("path");
    CREATE INDEX IF NOT EXISTS "stories_rels_locations_ref_idx" ON "stories_rels" ("locations_ref_id");
    ALTER TABLE "stories_rels" ADD CONSTRAINT "stories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "stories"("id") ON DELETE CASCADE;
    ALTER TABLE "stories_rels" ADD CONSTRAINT "stories_rels_locations_ref_fk" FOREIGN KEY ("locations_ref_id") REFERENCES "locations"("id") ON DELETE CASCADE;

    CREATE TABLE IF NOT EXISTS "_stories_v_rels" (
      "id" serial NOT NULL PRIMARY KEY,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar(255),
      "locations_ref_id" integer
    );

    CREATE SEQUENCE IF NOT EXISTS "_stories_v_rels_id_seq";
    ALTER TABLE "_stories_v_rels" ALTER COLUMN "id" SET DEFAULT nextval('"_stories_v_rels_id_seq"'::regclass);
    CREATE INDEX IF NOT EXISTS "_stories_v_rels_parent_idx" ON "_stories_v_rels" ("parent_id");
    CREATE INDEX IF NOT EXISTS "_stories_v_rels_order_idx" ON "_stories_v_rels" ("order");
    CREATE INDEX IF NOT EXISTS "_stories_v_rels_path_idx" ON "_stories_v_rels" ("path");
    CREATE INDEX IF NOT EXISTS "_stories_v_rels_locations_ref_idx" ON "_stories_v_rels" ("locations_ref_id");
    ALTER TABLE "_stories_v_rels" ADD CONSTRAINT "_stories_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "_stories_v"("id") ON DELETE CASCADE;
    ALTER TABLE "_stories_v_rels" ADD CONSTRAINT "_stories_v_rels_locations_ref_fk" FOREIGN KEY ("locations_ref_id") REFERENCES "locations"("id") ON DELETE CASCADE;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "stories" DROP COLUMN IF EXISTS "locations_ref";
    ALTER TABLE "_stories_v" DROP COLUMN IF EXISTS "version_locations_ref";
    ALTER TABLE "stories_rels" DROP CONSTRAINT IF EXISTS "stories_rels_parent_fk";
    ALTER TABLE "stories_rels" DROP CONSTRAINT IF EXISTS "stories_rels_locations_ref_fk";
    DROP TABLE IF EXISTS "stories_rels";
    ALTER TABLE "_stories_v_rels" DROP CONSTRAINT IF EXISTS "_stories_v_rels_parent_fk";
    ALTER TABLE "_stories_v_rels" DROP CONSTRAINT IF EXISTS "_stories_v_rels_locations_ref_fk";
    DROP TABLE IF EXISTS "_stories_v_rels";
  `)
}
