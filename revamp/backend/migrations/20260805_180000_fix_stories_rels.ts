import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // This migration removes the broken locations_ref_id columns that were
  // accidentally added by the previous failed migration.
  await db.execute(sql`
    ALTER TABLE "stories_rels" DROP CONSTRAINT IF EXISTS "stories_rels_locations_ref_fk";
    ALTER TABLE "stories_rels" DROP COLUMN IF EXISTS "locations_ref_id";
    
    ALTER TABLE "_stories_v_rels" DROP CONSTRAINT IF EXISTS "_stories_v_rels_locations_ref_fk";
    ALTER TABLE "_stories_v_rels" DROP COLUMN IF EXISTS "locations_ref_id";
    
    DROP INDEX IF EXISTS "stories_rels_locations_ref_idx";
    DROP INDEX IF EXISTS "_stories_v_rels_locations_ref_idx";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Reverse: re-add the columns (for rollback if needed)
  await db.execute(sql`
    ALTER TABLE "stories_rels" ADD COLUMN "locations_ref_id" integer;
    CREATE INDEX IF NOT EXISTS "stories_rels_locations_ref_idx" ON "stories_rels" ("locations_ref_id");
    ALTER TABLE "stories_rels" ADD CONSTRAINT "stories_rels_locations_ref_fk" FOREIGN KEY ("locations_ref_id") REFERENCES "locations"("id") ON DELETE CASCADE;
    
    ALTER TABLE "_stories_v_rels" ADD COLUMN "locations_ref_id" integer;
    CREATE INDEX IF NOT EXISTS "_stories_v_rels_locations_ref_idx" ON "_stories_v_rels" ("locations_ref_id");
    ALTER TABLE "_stories_v_rels" ADD CONSTRAINT "_stories_v_rels_locations_ref_fk" FOREIGN KEY ("locations_ref_id") REFERENCES "locations"("id") ON DELETE CASCADE;
  `)
}
