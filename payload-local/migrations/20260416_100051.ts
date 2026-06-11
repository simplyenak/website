import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "countries_served" varchar DEFAULT '50+ countries';
  ALTER TABLE "site_settings" ADD COLUMN "label_the_experience" varchar DEFAULT 'The Experience';
  ALTER TABLE "site_settings" ADD COLUMN "label_straight_from_guests" varchar DEFAULT 'Straight from Our Guests';
  ALTER TABLE "site_settings" ADD COLUMN "label_stop_by_stop" varchar DEFAULT 'Stop by Stop';
  ALTER TABLE "site_settings" ADD COLUMN "label_why_join_us" varchar DEFAULT 'Why Join Us';
  ALTER TABLE "site_settings" ADD COLUMN "label_the_full_story" varchar DEFAULT 'The Full Story';
  ALTER TABLE "site_settings" ADD COLUMN "label_on_the_tour" varchar DEFAULT 'On the Tour';
  ALTER TABLE "site_settings" ADD COLUMN "label_the_people" varchar DEFAULT 'The People';
  ALTER TABLE "site_settings" ADD COLUMN "label_private_tailored" varchar DEFAULT 'Private & Tailored';
  ALTER TABLE "site_settings" ADD COLUMN "label_what_you_get" varchar DEFAULT 'What You Get';
  ALTER TABLE "site_settings" ADD COLUMN "label_where_to_find_us" varchar DEFAULT 'Where to Find Us';
  ALTER TABLE "site_settings" ADD COLUMN "label_good_to_know" varchar DEFAULT 'Good to Know';
  ALTER TABLE "site_settings" ADD COLUMN "label_common_questions" varchar DEFAULT 'Common Questions';
  ALTER TABLE "site_settings" ADD COLUMN "label_background" varchar DEFAULT 'Background';
  ALTER TABLE "site_settings" ADD COLUMN "label_come_with_us" varchar DEFAULT 'Come With Us';
  ALTER TABLE "site_settings" ADD COLUMN "label_insider_guides" varchar DEFAULT 'Insider Guides';
  ALTER TABLE "site_settings" ADD COLUMN "label_local_specialties" varchar DEFAULT 'Local Specialties';
  ALTER TABLE "site_settings" ADD COLUMN "label_food_culture" varchar DEFAULT 'Food & Culture';
  ALTER TABLE "site_settings" ADD COLUMN "label_culture_heritage" varchar DEFAULT 'Culture & Heritage';
  ALTER TABLE "site_settings" ADD COLUMN "label_vendor_stories" varchar DEFAULT 'Vendor Stories';
  ALTER TABLE "site_settings" ADD COLUMN "label_walk_it_with_us" varchar DEFAULT 'Walk it With Us';
  ALTER TABLE "site_settings" ADD COLUMN "label_stay_in_loop" varchar DEFAULT 'Stay in the Loop';
  ALTER TABLE "site_settings" ADD COLUMN "label_good_for" varchar DEFAULT 'Good for';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "countries_served";
  ALTER TABLE "site_settings" DROP COLUMN "label_the_experience";
  ALTER TABLE "site_settings" DROP COLUMN "label_straight_from_guests";
  ALTER TABLE "site_settings" DROP COLUMN "label_stop_by_stop";
  ALTER TABLE "site_settings" DROP COLUMN "label_why_join_us";
  ALTER TABLE "site_settings" DROP COLUMN "label_the_full_story";
  ALTER TABLE "site_settings" DROP COLUMN "label_on_the_tour";
  ALTER TABLE "site_settings" DROP COLUMN "label_the_people";
  ALTER TABLE "site_settings" DROP COLUMN "label_private_tailored";
  ALTER TABLE "site_settings" DROP COLUMN "label_what_you_get";
  ALTER TABLE "site_settings" DROP COLUMN "label_where_to_find_us";
  ALTER TABLE "site_settings" DROP COLUMN "label_good_to_know";
  ALTER TABLE "site_settings" DROP COLUMN "label_common_questions";
  ALTER TABLE "site_settings" DROP COLUMN "label_background";
  ALTER TABLE "site_settings" DROP COLUMN "label_come_with_us";
  ALTER TABLE "site_settings" DROP COLUMN "label_insider_guides";
  ALTER TABLE "site_settings" DROP COLUMN "label_local_specialties";
  ALTER TABLE "site_settings" DROP COLUMN "label_food_culture";
  ALTER TABLE "site_settings" DROP COLUMN "label_culture_heritage";
  ALTER TABLE "site_settings" DROP COLUMN "label_vendor_stories";
  ALTER TABLE "site_settings" DROP COLUMN "label_walk_it_with_us";
  ALTER TABLE "site_settings" DROP COLUMN "label_stay_in_loop";
  ALTER TABLE "site_settings" DROP COLUMN "label_good_for";`)
}
