import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tours" ADD COLUMN "ticketing_hub_id" varchar;
  ALTER TABLE "tours" ADD COLUMN "is_bookable" boolean DEFAULT false;
  ALTER TABLE "_tours_v" ADD COLUMN "version_ticketing_hub_id" varchar;
  ALTER TABLE "_tours_v" ADD COLUMN "version_is_bookable" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tours" DROP COLUMN "ticketing_hub_id";
  ALTER TABLE "tours" DROP COLUMN "is_bookable";
  ALTER TABLE "_tours_v" DROP COLUMN "version_ticketing_hub_id";
  ALTER TABLE "_tours_v" DROP COLUMN "version_is_bookable";`)
}
