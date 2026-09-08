import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds a `translations` jsonb column to the content collections that ship
// per-locale translations (the i18n pipeline stores translations[] here, hand-
// editable in the admin). Collections with drafts/versions also get the
// version-translations column on their `_v` table.
//
// NOTE: generated via `payload migrate:create` then FILTERED to translations
// only — the raw generator also emitted an unrelated `experience_notes`
// collection that was never migrated to the DB (separate drift, tracked
// separately, not part of this migration).

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
ALTER TABLE "stories" ADD COLUMN "translations" jsonb;
ALTER TABLE "_stories_v" ADD COLUMN "version_translations" jsonb;
ALTER TABLE "testimonials" ADD COLUMN "translations" jsonb;
ALTER TABLE "_testimonials_v" ADD COLUMN "version_translations" jsonb;
ALTER TABLE "faqs" ADD COLUMN "translations" jsonb;
ALTER TABLE "_faqs_v" ADD COLUMN "version_translations" jsonb;
ALTER TABLE "about_page" ADD COLUMN "translations" jsonb;
ALTER TABLE "contact_page" ADD COLUMN "translations" jsonb;
ALTER TABLE "_contact_page_v" ADD COLUMN "version_translations" jsonb;
ALTER TABLE "home_page" ADD COLUMN "translations" jsonb;
ALTER TABLE "_home_page_v" ADD COLUMN "version_translations" jsonb;
ALTER TABLE "tours_page" ADD COLUMN "translations" jsonb;
ALTER TABLE "stories_page" ADD COLUMN "translations" jsonb;
ALTER TABLE "_stories_page_v" ADD COLUMN "version_translations" jsonb;
`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
ALTER TABLE "stories" DROP COLUMN "translations";
ALTER TABLE "_stories_v" DROP COLUMN "version_translations";
ALTER TABLE "testimonials" DROP COLUMN "translations";
ALTER TABLE "_testimonials_v" DROP COLUMN "version_translations";
ALTER TABLE "faqs" DROP COLUMN "translations";
ALTER TABLE "_faqs_v" DROP COLUMN "version_translations";
ALTER TABLE "about_page" DROP COLUMN "translations";
ALTER TABLE "contact_page" DROP COLUMN "translations";
ALTER TABLE "_contact_page_v" DROP COLUMN "version_translations";
ALTER TABLE "home_page" DROP COLUMN "translations";
ALTER TABLE "_home_page_v" DROP COLUMN "version_translations";
ALTER TABLE "tours_page" DROP COLUMN "translations";
ALTER TABLE "stories_page" DROP COLUMN "translations";
ALTER TABLE "_stories_page_v" DROP COLUMN "version_translations";
`)
}