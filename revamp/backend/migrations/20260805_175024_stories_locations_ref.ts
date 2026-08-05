import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "stories" ADD COLUMN IF NOT EXISTS "locations_ref" jsonb NULL;
    ALTER TABLE "_stories_v" ADD COLUMN IF NOT EXISTS "version_locations_ref" jsonb NULL;

    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stories_rels' AND column_name = 'locations_ref_id') THEN
        ALTER TABLE "stories_rels" ADD COLUMN "locations_ref_id" integer;
        CREATE INDEX IF NOT EXISTS "stories_rels_locations_ref_idx" ON "stories_rels" ("locations_ref_id");
        ALTER TABLE "stories_rels" ADD CONSTRAINT "stories_rels_locations_ref_fk" FOREIGN KEY ("locations_ref_id") REFERENCES "locations"("id") ON DELETE CASCADE;
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_stories_v_rels' AND column_name = 'locations_ref_id') THEN
        ALTER TABLE "_stories_v_rels" ADD COLUMN "locations_ref_id" integer;
        CREATE INDEX IF NOT EXISTS "_stories_v_rels_locations_ref_idx" ON "_stories_v_rels" ("locations_ref_id");
        ALTER TABLE "_stories_v_rels" ADD CONSTRAINT "_stories_v_rels_locations_ref_fk" FOREIGN KEY ("locations_ref_id") REFERENCES "locations"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "stories" DROP COLUMN IF EXISTS "locations_ref";
    ALTER TABLE "_stories_v" DROP COLUMN IF EXISTS "version_locations_ref";
    ALTER TABLE "stories_rels" DROP CONSTRAINT IF EXISTS "stories_rels_locations_ref_fk";
    ALTER TABLE "stories_rels" DROP COLUMN IF EXISTS "locations_ref_id";
    ALTER TABLE "_stories_v_rels" DROP CONSTRAINT IF EXISTS "_stories_v_rels_locations_ref_fk";
    ALTER TABLE "_stories_v_rels" DROP COLUMN IF EXISTS "locations_ref_id";
  `)
}
