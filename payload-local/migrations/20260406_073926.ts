import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Replace separate travel_type_landing_pages / specialty_landing_pages relation columns
 * with the unified landing_pages relation in tours_rels and _tours_v_rels.
 *
 * This migration was originally applied on 2026-04-06 but the file was lost during
 * the DB restore on 2026-04-15. Recreated from the Apr 14 snapshot state.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Fix tours_rels: replace old split columns with unified landing_pages_id
    ALTER TABLE "tours_rels" DROP COLUMN IF EXISTS "travel_type_landing_pages_id";
    ALTER TABLE "tours_rels" DROP COLUMN IF EXISTS "specialty_landing_pages_id";
    ALTER TABLE "tours_rels" ADD COLUMN IF NOT EXISTS "landing_pages_id" integer;
    ALTER TABLE "tours_rels"
      ADD CONSTRAINT "tours_rels_landing_pages_fk"
      FOREIGN KEY ("landing_pages_id") REFERENCES "public"."landing_pages"("id")
      ON DELETE cascade ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "tours_rels_landing_pages_id_idx"
      ON "tours_rels" USING btree ("landing_pages_id");

    -- Fix _tours_v_rels: same replacement + add missing travel_types and specialty_experiences
    ALTER TABLE "_tours_v_rels" DROP COLUMN IF EXISTS "travel_type_landing_pages_id";
    ALTER TABLE "_tours_v_rels" DROP COLUMN IF EXISTS "specialty_landing_pages_id";
    ALTER TABLE "_tours_v_rels" ADD COLUMN IF NOT EXISTS "landing_pages_id" integer;
    ALTER TABLE "_tours_v_rels" ADD COLUMN IF NOT EXISTS "travel_types_id" integer;
    ALTER TABLE "_tours_v_rels" ADD COLUMN IF NOT EXISTS "specialty_experiences_id" integer;
    ALTER TABLE "_tours_v_rels"
      ADD CONSTRAINT "_tours_v_rels_landing_pages_fk"
      FOREIGN KEY ("landing_pages_id") REFERENCES "public"."landing_pages"("id")
      ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_tours_v_rels"
      ADD CONSTRAINT "_tours_v_rels_travel_types_fk"
      FOREIGN KEY ("travel_types_id") REFERENCES "public"."travel_types"("id")
      ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_tours_v_rels"
      ADD CONSTRAINT "_tours_v_rels_specialty_experiences_fk"
      FOREIGN KEY ("specialty_experiences_id") REFERENCES "public"."specialty_experiences"("id")
      ON DELETE cascade ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "_tours_v_rels_landing_pages_id_idx"
      ON "_tours_v_rels" USING btree ("landing_pages_id");
    CREATE INDEX IF NOT EXISTS "_tours_v_rels_travel_types_id_idx"
      ON "_tours_v_rels" USING btree ("travel_types_id");
    CREATE INDEX IF NOT EXISTS "_tours_v_rels_specialty_experiences_id_idx"
      ON "_tours_v_rels" USING btree ("specialty_experiences_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_tours_v_rels" DROP CONSTRAINT IF EXISTS "_tours_v_rels_specialty_experiences_fk";
    ALTER TABLE "_tours_v_rels" DROP CONSTRAINT IF EXISTS "_tours_v_rels_travel_types_fk";
    ALTER TABLE "_tours_v_rels" DROP CONSTRAINT IF EXISTS "_tours_v_rels_landing_pages_fk";
    ALTER TABLE "_tours_v_rels" DROP COLUMN IF EXISTS "specialty_experiences_id";
    ALTER TABLE "_tours_v_rels" DROP COLUMN IF EXISTS "travel_types_id";
    ALTER TABLE "_tours_v_rels" DROP COLUMN IF EXISTS "landing_pages_id";
    ALTER TABLE "_tours_v_rels" ADD COLUMN IF NOT EXISTS "travel_type_landing_pages_id" integer;
    ALTER TABLE "_tours_v_rels" ADD COLUMN IF NOT EXISTS "specialty_landing_pages_id" integer;

    ALTER TABLE "tours_rels" DROP CONSTRAINT IF EXISTS "tours_rels_landing_pages_fk";
    ALTER TABLE "tours_rels" DROP COLUMN IF EXISTS "landing_pages_id";
    ALTER TABLE "tours_rels" ADD COLUMN IF NOT EXISTS "travel_type_landing_pages_id" integer;
    ALTER TABLE "tours_rels" ADD COLUMN IF NOT EXISTS "specialty_landing_pages_id" integer;
  `)
}
