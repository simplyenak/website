import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_private_tours_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__private_tours_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "media_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "site_settings_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "private_tours_page_why_private" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"detail" varchar
  );
  
  CREATE TABLE "private_tours_page_audiences" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"label" varchar,
  	"detail" varchar
  );
  
  CREATE TABLE "private_tours_page_on_every_tour" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "private_tours_page_private_extras" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "private_tours_page_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "private_tours_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"hero_title" varchar,
  	"hero_highlight" varchar,
  	"hero_subtitle" varchar,
  	"hero_cta_primary_text" varchar,
  	"hero_cta_primary_href" varchar,
  	"hero_cta_secondary_text" varchar,
  	"hero_cta_secondary_href" varchar,
  	"why_title" varchar,
  	"why_subtitle" varchar,
  	"configurator_eyebrow" varchar,
  	"configurator_heading" varchar,
  	"configurator_body" varchar,
  	"audiences_title" varchar,
  	"inclusions_heading" varchar,
  	"on_every_tour_label" varchar,
  	"private_extras_label" varchar,
  	"pricing_heading" varchar,
  	"pricing_body" varchar,
  	"pricing_cta_whatsapp" varchar,
  	"pricing_cta_whatsapp_message" varchar,
  	"pricing_cta_message" varchar,
  	"available_privately_heading" varchar,
  	"available_privately_subtext" varchar,
  	"corporate_callout" varchar,
  	"corporate_cta_text" varchar,
  	"corporate_cta_href" varchar,
  	"faq_eyebrow" varchar,
  	"faq_heading" varchar,
  	"internal_links_heading" varchar,
  	"view_all_tours_text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_private_tours_page_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_private_tours_page_v_version_why_private" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_private_tours_page_v_version_audiences" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"label" varchar,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_private_tours_page_v_version_on_every_tour" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_private_tours_page_v_version_private_extras" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_private_tours_page_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_private_tours_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_hero_title" varchar,
  	"version_hero_highlight" varchar,
  	"version_hero_subtitle" varchar,
  	"version_hero_cta_primary_text" varchar,
  	"version_hero_cta_primary_href" varchar,
  	"version_hero_cta_secondary_text" varchar,
  	"version_hero_cta_secondary_href" varchar,
  	"version_why_title" varchar,
  	"version_why_subtitle" varchar,
  	"version_configurator_eyebrow" varchar,
  	"version_configurator_heading" varchar,
  	"version_configurator_body" varchar,
  	"version_audiences_title" varchar,
  	"version_inclusions_heading" varchar,
  	"version_on_every_tour_label" varchar,
  	"version_private_extras_label" varchar,
  	"version_pricing_heading" varchar,
  	"version_pricing_body" varchar,
  	"version_pricing_cta_whatsapp" varchar,
  	"version_pricing_cta_whatsapp_message" varchar,
  	"version_pricing_cta_message" varchar,
  	"version_available_privately_heading" varchar,
  	"version_available_privately_subtext" varchar,
  	"version_corporate_callout" varchar,
  	"version_corporate_cta_text" varchar,
  	"version_corporate_cta_href" varchar,
  	"version_faq_eyebrow" varchar,
  	"version_faq_heading" varchar,
  	"version_internal_links_heading" varchar,
  	"version_view_all_tours_text" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__private_tours_page_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "private_tours_page_id" integer;
  ALTER TABLE "media_texts" ADD CONSTRAINT "media_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_texts" ADD CONSTRAINT "site_settings_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "private_tours_page_why_private" ADD CONSTRAINT "private_tours_page_why_private_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."private_tours_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "private_tours_page_audiences" ADD CONSTRAINT "private_tours_page_audiences_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."private_tours_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "private_tours_page_on_every_tour" ADD CONSTRAINT "private_tours_page_on_every_tour_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."private_tours_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "private_tours_page_private_extras" ADD CONSTRAINT "private_tours_page_private_extras_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."private_tours_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "private_tours_page_faqs" ADD CONSTRAINT "private_tours_page_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."private_tours_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_private_tours_page_v_version_why_private" ADD CONSTRAINT "_private_tours_page_v_version_why_private_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_private_tours_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_private_tours_page_v_version_audiences" ADD CONSTRAINT "_private_tours_page_v_version_audiences_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_private_tours_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_private_tours_page_v_version_on_every_tour" ADD CONSTRAINT "_private_tours_page_v_version_on_every_tour_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_private_tours_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_private_tours_page_v_version_private_extras" ADD CONSTRAINT "_private_tours_page_v_version_private_extras_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_private_tours_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_private_tours_page_v_version_faqs" ADD CONSTRAINT "_private_tours_page_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_private_tours_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_private_tours_page_v" ADD CONSTRAINT "_private_tours_page_v_parent_id_private_tours_page_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."private_tours_page"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "media_texts_order_parent" ON "media_texts" USING btree ("order","parent_id");
  CREATE INDEX "site_settings_texts_order_parent" ON "site_settings_texts" USING btree ("order","parent_id");
  CREATE INDEX "private_tours_page_why_private_order_idx" ON "private_tours_page_why_private" USING btree ("_order");
  CREATE INDEX "private_tours_page_why_private_parent_id_idx" ON "private_tours_page_why_private" USING btree ("_parent_id");
  CREATE INDEX "private_tours_page_audiences_order_idx" ON "private_tours_page_audiences" USING btree ("_order");
  CREATE INDEX "private_tours_page_audiences_parent_id_idx" ON "private_tours_page_audiences" USING btree ("_parent_id");
  CREATE INDEX "private_tours_page_on_every_tour_order_idx" ON "private_tours_page_on_every_tour" USING btree ("_order");
  CREATE INDEX "private_tours_page_on_every_tour_parent_id_idx" ON "private_tours_page_on_every_tour" USING btree ("_parent_id");
  CREATE INDEX "private_tours_page_private_extras_order_idx" ON "private_tours_page_private_extras" USING btree ("_order");
  CREATE INDEX "private_tours_page_private_extras_parent_id_idx" ON "private_tours_page_private_extras" USING btree ("_parent_id");
  CREATE INDEX "private_tours_page_faqs_order_idx" ON "private_tours_page_faqs" USING btree ("_order");
  CREATE INDEX "private_tours_page_faqs_parent_id_idx" ON "private_tours_page_faqs" USING btree ("_parent_id");
  CREATE INDEX "private_tours_page_updated_at_idx" ON "private_tours_page" USING btree ("updated_at");
  CREATE INDEX "private_tours_page_created_at_idx" ON "private_tours_page" USING btree ("created_at");
  CREATE INDEX "private_tours_page__status_idx" ON "private_tours_page" USING btree ("_status");
  CREATE INDEX "_private_tours_page_v_version_why_private_order_idx" ON "_private_tours_page_v_version_why_private" USING btree ("_order");
  CREATE INDEX "_private_tours_page_v_version_why_private_parent_id_idx" ON "_private_tours_page_v_version_why_private" USING btree ("_parent_id");
  CREATE INDEX "_private_tours_page_v_version_audiences_order_idx" ON "_private_tours_page_v_version_audiences" USING btree ("_order");
  CREATE INDEX "_private_tours_page_v_version_audiences_parent_id_idx" ON "_private_tours_page_v_version_audiences" USING btree ("_parent_id");
  CREATE INDEX "_private_tours_page_v_version_on_every_tour_order_idx" ON "_private_tours_page_v_version_on_every_tour" USING btree ("_order");
  CREATE INDEX "_private_tours_page_v_version_on_every_tour_parent_id_idx" ON "_private_tours_page_v_version_on_every_tour" USING btree ("_parent_id");
  CREATE INDEX "_private_tours_page_v_version_private_extras_order_idx" ON "_private_tours_page_v_version_private_extras" USING btree ("_order");
  CREATE INDEX "_private_tours_page_v_version_private_extras_parent_id_idx" ON "_private_tours_page_v_version_private_extras" USING btree ("_parent_id");
  CREATE INDEX "_private_tours_page_v_version_faqs_order_idx" ON "_private_tours_page_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_private_tours_page_v_version_faqs_parent_id_idx" ON "_private_tours_page_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_private_tours_page_v_parent_idx" ON "_private_tours_page_v" USING btree ("parent_id");
  CREATE INDEX "_private_tours_page_v_version_version_updated_at_idx" ON "_private_tours_page_v" USING btree ("version_updated_at");
  CREATE INDEX "_private_tours_page_v_version_version_created_at_idx" ON "_private_tours_page_v" USING btree ("version_created_at");
  CREATE INDEX "_private_tours_page_v_version_version__status_idx" ON "_private_tours_page_v" USING btree ("version__status");
  CREATE INDEX "_private_tours_page_v_created_at_idx" ON "_private_tours_page_v" USING btree ("created_at");
  CREATE INDEX "_private_tours_page_v_updated_at_idx" ON "_private_tours_page_v" USING btree ("updated_at");
  CREATE INDEX "_private_tours_page_v_latest_idx" ON "_private_tours_page_v" USING btree ("latest");
  CREATE INDEX "_private_tours_page_v_autosave_idx" ON "_private_tours_page_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_private_tours_page_fk" FOREIGN KEY ("private_tours_page_id") REFERENCES "public"."private_tours_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_private_tours_page_id_idx" ON "payload_locked_documents_rels" USING btree ("private_tours_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "private_tours_page_why_private" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "private_tours_page_audiences" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "private_tours_page_on_every_tour" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "private_tours_page_private_extras" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "private_tours_page_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "private_tours_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_private_tours_page_v_version_why_private" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_private_tours_page_v_version_audiences" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_private_tours_page_v_version_on_every_tour" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_private_tours_page_v_version_private_extras" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_private_tours_page_v_version_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_private_tours_page_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "media_texts" CASCADE;
  DROP TABLE "site_settings_texts" CASCADE;
  DROP TABLE "private_tours_page_why_private" CASCADE;
  DROP TABLE "private_tours_page_audiences" CASCADE;
  DROP TABLE "private_tours_page_on_every_tour" CASCADE;
  DROP TABLE "private_tours_page_private_extras" CASCADE;
  DROP TABLE "private_tours_page_faqs" CASCADE;
  DROP TABLE "private_tours_page" CASCADE;
  DROP TABLE "_private_tours_page_v_version_why_private" CASCADE;
  DROP TABLE "_private_tours_page_v_version_audiences" CASCADE;
  DROP TABLE "_private_tours_page_v_version_on_every_tour" CASCADE;
  DROP TABLE "_private_tours_page_v_version_private_extras" CASCADE;
  DROP TABLE "_private_tours_page_v_version_faqs" CASCADE;
  DROP TABLE "_private_tours_page_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_private_tours_page_fk";
  
  DROP INDEX "payload_locked_documents_rels_private_tours_page_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "private_tours_page_id";
  DROP TYPE "public"."enum_private_tours_page_status";
  DROP TYPE "public"."enum__private_tours_page_v_version_status";`)
}
