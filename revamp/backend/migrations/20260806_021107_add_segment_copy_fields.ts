import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "landing_pages_translations" ADD COLUMN "hero_hook" varchar;
  ALTER TABLE "landing_pages_translations" ADD COLUMN "problem_heading" varchar;
  ALTER TABLE "landing_pages_translations" ADD COLUMN "problem_content" varchar;
  ALTER TABLE "landing_pages_translations" ADD COLUMN "body_markdown" varchar;
  ALTER TABLE "landing_pages" ADD COLUMN "hero_hook" varchar;
  ALTER TABLE "landing_pages" ADD COLUMN "problem_heading" varchar;
  ALTER TABLE "landing_pages" ADD COLUMN "problem_content" varchar;
  ALTER TABLE "landing_pages" ADD COLUMN "body_markdown" varchar;
  ALTER TABLE "_landing_pages_v_version_translations" ADD COLUMN "hero_hook" varchar;
  ALTER TABLE "_landing_pages_v_version_translations" ADD COLUMN "problem_heading" varchar;
  ALTER TABLE "_landing_pages_v_version_translations" ADD COLUMN "problem_content" varchar;
  ALTER TABLE "_landing_pages_v_version_translations" ADD COLUMN "body_markdown" varchar;
  ALTER TABLE "_landing_pages_v" ADD COLUMN "version_hero_hook" varchar;
  ALTER TABLE "_landing_pages_v" ADD COLUMN "version_problem_heading" varchar;
  ALTER TABLE "_landing_pages_v" ADD COLUMN "version_problem_content" varchar;
  ALTER TABLE "_landing_pages_v" ADD COLUMN "version_body_markdown" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "landing_pages_translations" DROP COLUMN "hero_hook";
  ALTER TABLE "landing_pages_translations" DROP COLUMN "problem_heading";
  ALTER TABLE "landing_pages_translations" DROP COLUMN "problem_content";
  ALTER TABLE "landing_pages_translations" DROP COLUMN "body_markdown";
  ALTER TABLE "landing_pages" DROP COLUMN "hero_hook";
  ALTER TABLE "landing_pages" DROP COLUMN "problem_heading";
  ALTER TABLE "landing_pages" DROP COLUMN "problem_content";
  ALTER TABLE "landing_pages" DROP COLUMN "body_markdown";
  ALTER TABLE "_landing_pages_v_version_translations" DROP COLUMN "hero_hook";
  ALTER TABLE "_landing_pages_v_version_translations" DROP COLUMN "problem_heading";
  ALTER TABLE "_landing_pages_v_version_translations" DROP COLUMN "problem_content";
  ALTER TABLE "_landing_pages_v_version_translations" DROP COLUMN "body_markdown";
  ALTER TABLE "_landing_pages_v" DROP COLUMN "version_hero_hook";
  ALTER TABLE "_landing_pages_v" DROP COLUMN "version_problem_heading";
  ALTER TABLE "_landing_pages_v" DROP COLUMN "version_problem_content";
  ALTER TABLE "_landing_pages_v" DROP COLUMN "version_body_markdown";`)
}
