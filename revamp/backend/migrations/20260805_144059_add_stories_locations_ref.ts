import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "stories_rels" ADD COLUMN IF NOT EXISTS "locations_id" integer;
  ALTER TABLE "_stories_v_rels" ADD COLUMN IF NOT EXISTS "locations_id" integer;

  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'stories_rels_locations_fk') THEN
      ALTER TABLE "stories_rels" ADD CONSTRAINT "stories_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_stories_v_rels_locations_fk') THEN
      ALTER TABLE "_stories_v_rels" ADD CONSTRAINT "_stories_v_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $$;

  CREATE INDEX IF NOT EXISTS "stories_rels_locations_id_idx" ON "stories_rels" USING btree ("locations_id");
  CREATE INDEX IF NOT EXISTS "_stories_v_rels_locations_id_idx" ON "_stories_v_rels" USING btree ("locations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "stories_rels" DROP CONSTRAINT IF EXISTS "stories_rels_locations_fk";
  ALTER TABLE "_stories_v_rels" DROP CONSTRAINT IF EXISTS "_stories_v_rels_locations_fk";
  DROP INDEX IF EXISTS "stories_rels_locations_id_idx";
  DROP INDEX IF EXISTS "_stories_v_rels_locations_id_idx";
  ALTER TABLE "stories_rels" DROP COLUMN IF EXISTS "locations_id";
  ALTER TABLE "_stories_v_rels" DROP COLUMN IF EXISTS "locations_id";`)
}
