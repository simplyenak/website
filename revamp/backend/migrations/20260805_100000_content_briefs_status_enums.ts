import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- content_briefs.status/_status: convert legacy VARCHAR columns to the
    -- config-defined enums (prod was VARCHAR because push:true never created
    -- the enum types; the baseline declares them as enums, so this migration
    -- aligns prod with the baseline snapshot).
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_content_briefs_status') THEN
        CREATE TYPE "public"."enum_content_briefs_status" AS ENUM('draft', 'needs-questions', 'questions-asked', 'answers-received', 'writing', 'ready-to-publish', 'published');
      END IF;
    END $$;
    ALTER TABLE "content_briefs" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "content_briefs" ALTER COLUMN "status" TYPE "public"."enum_content_briefs_status" USING "status"::"public"."enum_content_briefs_status";
    ALTER TABLE "content_briefs" ALTER COLUMN "status" SET DEFAULT 'needs-questions';
    ALTER TABLE "content_briefs" ALTER COLUMN "_status" DROP DEFAULT;
    ALTER TABLE "content_briefs" ALTER COLUMN "_status" TYPE "public"."enum_content_briefs_status" USING "_status"::"public"."enum_content_briefs_status";
    ALTER TABLE "content_briefs" ALTER COLUMN "_status" SET DEFAULT 'draft';

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__content_briefs_v_version_status') THEN
        CREATE TYPE "public"."enum__content_briefs_v_version_status" AS ENUM('draft', 'needs-questions', 'questions-asked', 'answers-received', 'writing', 'ready-to-publish', 'published');
      END IF;
    END $$;
    ALTER TABLE "_content_briefs_v" ALTER COLUMN "version_status" DROP DEFAULT;
    ALTER TABLE "_content_briefs_v" ALTER COLUMN "version_status" TYPE "public"."enum__content_briefs_v_version_status" USING "version_status"::"public"."enum__content_briefs_v_version_status";
    ALTER TABLE "_content_briefs_v" ALTER COLUMN "version_status" SET DEFAULT 'draft';
    ALTER TABLE "_content_briefs_v" ALTER COLUMN "version__status" DROP DEFAULT;
    ALTER TABLE "_content_briefs_v" ALTER COLUMN "version__status" TYPE "public"."enum__content_briefs_v_version_status" USING "version__status"::"public"."enum__content_briefs_v_version_status";
    ALTER TABLE "_content_briefs_v" ALTER COLUMN "version__status" SET DEFAULT 'draft';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_content_briefs_v" ALTER COLUMN "version__status" DROP DEFAULT;
    ALTER TABLE "_content_briefs_v" ALTER COLUMN "version__status" TYPE varchar USING "version__status"::varchar;
    ALTER TABLE "_content_briefs_v" ALTER COLUMN "version_status" DROP DEFAULT;
    ALTER TABLE "_content_briefs_v" ALTER COLUMN "version_status" TYPE varchar USING "version_status"::varchar;
    ALTER TABLE "content_briefs" ALTER COLUMN "_status" DROP DEFAULT;
    ALTER TABLE "content_briefs" ALTER COLUMN "_status" TYPE varchar USING "_status"::varchar;
    ALTER TABLE "content_briefs" ALTER COLUMN "_status" SET DEFAULT 'draft';
    ALTER TABLE "content_briefs" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "content_briefs" ALTER COLUMN "status" TYPE varchar USING "status"::varchar;
    ALTER TABLE "content_briefs" ALTER COLUMN "status" SET DEFAULT 'needs-questions';
    DROP TYPE IF EXISTS "public"."enum__content_briefs_v_version_status";
    DROP TYPE IF EXISTS "public"."enum_content_briefs_status";
  `)
}
