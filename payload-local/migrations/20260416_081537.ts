import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "guide_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "guide_image_alt" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "guide_heading" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "guide_body" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "travellers_choice_year" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "currency_usd_rate" numeric;
  ALTER TABLE "site_settings" ADD COLUMN "currency_aud_rate" numeric;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_guide_image_id_media_id_fk" FOREIGN KEY ("guide_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_guide_image_idx" ON "site_settings" USING btree ("guide_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_guide_image_id_media_id_fk";
  
  DROP INDEX "site_settings_guide_image_idx";
  ALTER TABLE "site_settings" DROP COLUMN "guide_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "guide_image_alt";
  ALTER TABLE "site_settings" DROP COLUMN "guide_heading";
  ALTER TABLE "site_settings" DROP COLUMN "guide_body";
  ALTER TABLE "site_settings" DROP COLUMN "travellers_choice_year";
  ALTER TABLE "site_settings" DROP COLUMN "currency_usd_rate";
  ALTER TABLE "site_settings" DROP COLUMN "currency_aud_rate";`)
}
