import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "tours_differentiators_tourist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "tours_differentiators_us" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "_tours_v_version_differentiators_tourist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tours_v_version_differentiators_us" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "tours_differentiators_tourist" ADD CONSTRAINT "tours_differentiators_tourist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_differentiators_us" ADD CONSTRAINT "tours_differentiators_us_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_version_differentiators_tourist" ADD CONSTRAINT "_tours_v_version_differentiators_tourist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_version_differentiators_us" ADD CONSTRAINT "_tours_v_version_differentiators_us_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "tours_differentiators_tourist_order_idx" ON "tours_differentiators_tourist" USING btree ("_order");
  CREATE INDEX "tours_differentiators_tourist_parent_id_idx" ON "tours_differentiators_tourist" USING btree ("_parent_id");
  CREATE INDEX "tours_differentiators_us_order_idx" ON "tours_differentiators_us" USING btree ("_order");
  CREATE INDEX "tours_differentiators_us_parent_id_idx" ON "tours_differentiators_us" USING btree ("_parent_id");
  CREATE INDEX "_tours_v_version_differentiators_tourist_order_idx" ON "_tours_v_version_differentiators_tourist" USING btree ("_order");
  CREATE INDEX "_tours_v_version_differentiators_tourist_parent_id_idx" ON "_tours_v_version_differentiators_tourist" USING btree ("_parent_id");
  CREATE INDEX "_tours_v_version_differentiators_us_order_idx" ON "_tours_v_version_differentiators_us" USING btree ("_order");
  CREATE INDEX "_tours_v_version_differentiators_us_parent_id_idx" ON "_tours_v_version_differentiators_us" USING btree ("_parent_id");
  ALTER TABLE "media" DROP COLUMN "prefix";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "tours_differentiators_tourist" CASCADE;
  DROP TABLE "tours_differentiators_us" CASCADE;
  DROP TABLE "_tours_v_version_differentiators_tourist" CASCADE;
  DROP TABLE "_tours_v_version_differentiators_us" CASCADE;
  ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT 'payload-media';`)
}
