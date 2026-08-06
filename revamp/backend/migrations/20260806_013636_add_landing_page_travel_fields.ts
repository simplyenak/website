import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "landing_pages_travel_tips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" varchar
  );
  
  CREATE TABLE "_landing_pages_v_version_travel_tips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "landing_pages" ADD COLUMN "intro_content" varchar;
  ALTER TABLE "landing_pages" ADD COLUMN "tips_heading" varchar;
  ALTER TABLE "_landing_pages_v" ADD COLUMN "version_intro_content" varchar;
  ALTER TABLE "_landing_pages_v" ADD COLUMN "version_tips_heading" varchar;
  ALTER TABLE "landing_pages_travel_tips" ADD CONSTRAINT "landing_pages_travel_tips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_version_travel_tips" ADD CONSTRAINT "_landing_pages_v_version_travel_tips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "landing_pages_travel_tips_order_idx" ON "landing_pages_travel_tips" USING btree ("_order");
  CREATE INDEX "landing_pages_travel_tips_parent_id_idx" ON "landing_pages_travel_tips" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_version_travel_tips_order_idx" ON "_landing_pages_v_version_travel_tips" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_version_travel_tips_parent_id_idx" ON "_landing_pages_v_version_travel_tips" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "landing_pages_travel_tips" CASCADE;
  DROP TABLE "_landing_pages_v_version_travel_tips" CASCADE;
  ALTER TABLE "landing_pages" DROP COLUMN "intro_content";
  ALTER TABLE "landing_pages" DROP COLUMN "tips_heading";
  ALTER TABLE "_landing_pages_v" DROP COLUMN "version_intro_content";
  ALTER TABLE "_landing_pages_v" DROP COLUMN "version_tips_heading";`)
}
