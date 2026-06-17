import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'translator', 'reviewer');
  CREATE TYPE "public"."enum_tours_difficulty" AS ENUM('easy', 'moderate', 'challenging');
  CREATE TYPE "public"."enum_tours_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_tours_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum__tours_v_version_difficulty" AS ENUM('easy', 'moderate', 'challenging');
  CREATE TYPE "public"."enum__tours_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tours_v_version_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum__tours_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_stories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_stories_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum__stories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__stories_v_version_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum__stories_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_testimonials_page_visibility" AS ENUM('tours', 'home', 'about');
  CREATE TYPE "public"."enum_testimonials_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_version_page_visibility" AS ENUM('tours', 'home', 'about');
  CREATE TYPE "public"."enum__testimonials_v_version_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum__testimonials_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_faqs_page_visibility" AS ENUM('all', 'home', 'tours', 'tour-detail', 'private-tours', 'join-in-tours', 'dietary', 'faq', 'how-to-prepare', 'about', 'contact', 'kl-street-food', 'flavours-of-malaysia', 'penang-street-food', 'eat-drink-george-town', 'secrets-of-kl-nightlife');
  CREATE TYPE "public"."enum_faqs_category" AS ENUM('general', 'booking', 'dietary', 'transport', 'private_tours', 'about_us');
  CREATE TYPE "public"."enum_faqs_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum_faqs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faqs_v_version_page_visibility" AS ENUM('all', 'home', 'tours', 'tour-detail', 'private-tours', 'join-in-tours', 'dietary', 'faq', 'how-to-prepare', 'about', 'contact', 'kl-street-food', 'flavours-of-malaysia', 'penang-street-food', 'eat-drink-george-town', 'secrets-of-kl-nightlife');
  CREATE TYPE "public"."enum__faqs_v_version_category" AS ENUM('general', 'booking', 'dietary', 'transport', 'private_tours', 'about_us');
  CREATE TYPE "public"."enum__faqs_v_version_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum__faqs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faqs_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_media_coverage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__media_coverage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__media_coverage_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_dietary_options_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__dietary_options_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__dietary_options_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_food_items_local_names_language" AS ENUM('ms', 'zh', 'hokkien', 'cantonese', 'ta', 'en');
  CREATE TYPE "public"."enum_food_items_allergens_allergen" AS ENUM('shellfish', 'fish', 'peanuts', 'tree_nuts', 'soy', 'wheat', 'eggs', 'dairy', 'sesame', 'msg');
  CREATE TYPE "public"."enum_food_items_flavor_profile_flavor" AS ENUM('sweet', 'sour', 'salty', 'umami', 'bitter', 'savory', 'creamy', 'tangy');
  CREATE TYPE "public"."enum_food_items_category" AS ENUM('main', 'snack', 'dessert', 'beverage', 'coffee_tea', 'juice', 'traditional_drink', 'condiment', 'breakfast', 'soup', 'noodles', 'rice', 'grilled');
  CREATE TYPE "public"."enum_food_items_origin" AS ENUM('malay', 'chinese', 'indian', 'peranakan', 'thai', 'indonesian', 'fusion', 'international');
  CREATE TYPE "public"."enum_food_items_spice_level" AS ENUM('0', '1', '2', '3', '4', '5');
  CREATE TYPE "public"."enum_food_items_preparation_method" AS ENUM('stir_fried', 'steamed', 'grilled', 'deep_fried', 'braised', 'boiled', 'raw', 'fermented', 'cured', 'mixed');
  CREATE TYPE "public"."enum_food_items_availability" AS ENUM('year_round', 'seasonal', 'festival', 'weekend', 'morning', 'night');
  CREATE TYPE "public"."enum_food_items_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__food_items_v_version_local_names_language" AS ENUM('ms', 'zh', 'hokkien', 'cantonese', 'ta', 'en');
  CREATE TYPE "public"."enum__food_items_v_version_allergens_allergen" AS ENUM('shellfish', 'fish', 'peanuts', 'tree_nuts', 'soy', 'wheat', 'eggs', 'dairy', 'sesame', 'msg');
  CREATE TYPE "public"."enum__food_items_v_version_flavor_profile_flavor" AS ENUM('sweet', 'sour', 'salty', 'umami', 'bitter', 'savory', 'creamy', 'tangy');
  CREATE TYPE "public"."enum__food_items_v_version_category" AS ENUM('main', 'snack', 'dessert', 'beverage', 'coffee_tea', 'juice', 'traditional_drink', 'condiment', 'breakfast', 'soup', 'noodles', 'rice', 'grilled');
  CREATE TYPE "public"."enum__food_items_v_version_origin" AS ENUM('malay', 'chinese', 'indian', 'peranakan', 'thai', 'indonesian', 'fusion', 'international');
  CREATE TYPE "public"."enum__food_items_v_version_spice_level" AS ENUM('0', '1', '2', '3', '4', '5');
  CREATE TYPE "public"."enum__food_items_v_version_preparation_method" AS ENUM('stir_fried', 'steamed', 'grilled', 'deep_fried', 'braised', 'boiled', 'raw', 'fermented', 'cured', 'mixed');
  CREATE TYPE "public"."enum__food_items_v_version_availability" AS ENUM('year_round', 'seasonal', 'festival', 'weekend', 'morning', 'night');
  CREATE TYPE "public"."enum__food_items_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__food_items_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_vendors_operating_hours_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'holiday');
  CREATE TYPE "public"."enum_vendors_closed_on_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'holiday');
  CREATE TYPE "public"."enum_vendors_payment_methods_method" AS ENUM('cash', 'credit_card', 'debit_card', 'tng', 'grabpay', 'boost', 'qr_pay', 'online_banking');
  CREATE TYPE "public"."enum_vendors_facilities_facility" AS ENUM('aircon', 'wifi', 'parking', 'wheelchair', 'halal_cert', 'prayer_room', 'outdoor', 'takeaway', 'delivery', 'reservations', 'family');
  CREATE TYPE "public"."enum_vendors_type" AS ENUM('street_stall', 'hawker_stall', 'food_court', 'kopitiam', 'restaurant', 'pasar_malam', 'pasar_pagi', 'home_kitchen', 'food_truck', 'heritage_shop');
  CREATE TYPE "public"."enum_vendors_cuisine_type" AS ENUM('malay', 'chinese', 'indian', 'peranakan', 'thai', 'indonesian', 'western', 'fusion', 'mixed');
  CREATE TYPE "public"."enum_vendors_price_range" AS ENUM('budget', 'moderate', 'upscale', 'fine_dining');
  CREATE TYPE "public"."enum_vendors_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_vendors_location_state" AS ENUM('kl', 'penang', 'selangor', 'melaka', 'johor', 'perak', 'kelantan', 'terengganu', 'kedah', 'pahang', 'ns', 'perlis', 'sabah', 'sarawak');
  CREATE TYPE "public"."enum__vendors_v_version_operating_hours_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'holiday');
  CREATE TYPE "public"."enum__vendors_v_version_closed_on_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'holiday');
  CREATE TYPE "public"."enum__vendors_v_version_payment_methods_method" AS ENUM('cash', 'credit_card', 'debit_card', 'tng', 'grabpay', 'boost', 'qr_pay', 'online_banking');
  CREATE TYPE "public"."enum__vendors_v_version_facilities_facility" AS ENUM('aircon', 'wifi', 'parking', 'wheelchair', 'halal_cert', 'prayer_room', 'outdoor', 'takeaway', 'delivery', 'reservations', 'family');
  CREATE TYPE "public"."enum__vendors_v_version_type" AS ENUM('street_stall', 'hawker_stall', 'food_court', 'kopitiam', 'restaurant', 'pasar_malam', 'pasar_pagi', 'home_kitchen', 'food_truck', 'heritage_shop');
  CREATE TYPE "public"."enum__vendors_v_version_cuisine_type" AS ENUM('malay', 'chinese', 'indian', 'peranakan', 'thai', 'indonesian', 'western', 'fusion', 'mixed');
  CREATE TYPE "public"."enum__vendors_v_version_price_range" AS ENUM('budget', 'moderate', 'upscale', 'fine_dining');
  CREATE TYPE "public"."enum__vendors_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__vendors_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum__vendors_v_version_location_state" AS ENUM('kl', 'penang', 'selangor', 'melaka', 'johor', 'perak', 'kelantan', 'terengganu', 'kedah', 'pahang', 'ns', 'perlis', 'sabah', 'sarawak');
  CREATE TYPE "public"."enum_landing_pages_type" AS ENUM('dietary', 'specialty', 'travel_type', 'location');
  CREATE TYPE "public"."enum_landing_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__landing_pages_v_version_type" AS ENUM('dietary', 'specialty', 'travel_type', 'location');
  CREATE TYPE "public"."enum__landing_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__landing_pages_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_pages_type" AS ENUM('neighborhood', 'segment', 'dietary', 'city', 'general');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_type" AS ENUM('neighborhood', 'segment', 'dietary', 'city', 'general');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_contact_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contact_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contact_page_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_thank_you_pages_cta_section_cta_buttons_variant" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_thank_you_pages_type" AS ENUM('contact', 'tour_inquiry', 'feedback', 'newsletter', 'booking', 'custom');
  CREATE TYPE "public"."enum_thank_you_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__thank_you_pages_v_version_cta_section_cta_buttons_variant" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__thank_you_pages_v_version_type" AS ENUM('contact', 'tour_inquiry', 'feedback', 'newsletter', 'booking', 'custom');
  CREATE TYPE "public"."enum__thank_you_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__thank_you_pages_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_home_page_blocks_cta_block_buttons_variant" AS ENUM('primary', 'secondary', 'whatsapp');
  CREATE TYPE "public"."enum_home_page_blocks_why_us_block_reasons_icon_name" AS ENUM('heritage', 'group', 'trust', 'story', 'chat', 'custom', 'award', 'heart');
  CREATE TYPE "public"."enum_home_page_blocks_guarantees_block_guarantees_icon_name" AS ENUM('check', 'calendar', 'users', 'message', 'lock');
  CREATE TYPE "public"."name" AS ENUM('tripadvisor', 'google', 'trustpilot', 'facebook');
  CREATE TYPE "public"."enum_home_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_page_v_blocks_cta_block_buttons_variant" AS ENUM('primary', 'secondary', 'whatsapp');
  CREATE TYPE "public"."enum__home_page_v_blocks_why_us_block_reasons_icon_name" AS ENUM('heritage', 'group', 'trust', 'story', 'chat', 'custom', 'award', 'heart');
  CREATE TYPE "public"."enum__home_page_v_blocks_guarantees_block_guarantees_icon_name" AS ENUM('check', 'calendar', 'users', 'message', 'lock');
  CREATE TYPE "public"."enum__home_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_page_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_legal_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__legal_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__legal_pages_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_menus_location" AS ENUM('top', 'mobile', 'footer', 'sub_page');
  CREATE TYPE "public"."enum_travel_types_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__travel_types_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__travel_types_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_specialty_experiences_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__specialty_experiences_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__specialty_experiences_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_locations_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__locations_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__locations_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_neighborhoods_location" AS ENUM('kuala-lumpur', 'penang', 'ipoh');
  CREATE TYPE "public"."enum_neighborhoods_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__neighborhoods_v_version_location" AS ENUM('kuala-lumpur', 'penang', 'ipoh');
  CREATE TYPE "public"."enum__neighborhoods_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__neighborhoods_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_site_settings_social_proof_platforms_platform" AS ENUM('tripadvisor', 'google', 'trustpilot', 'facebook');
  CREATE TYPE "public"."enum_site_settings_analytics_type" AS ENUM('google_analytics', 'gtm', 'none');
  CREATE TYPE "public"."enum_site_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_version_social_proof_platforms_platform" AS ENUM('tripadvisor', 'google', 'trustpilot', 'facebook');
  CREATE TYPE "public"."enum__site_settings_v_version_analytics_type" AS ENUM('google_analytics', 'gtm', 'none');
  CREATE TYPE "public"."enum__site_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_comparison_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__comparison_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__comparison_page_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_how_it_works_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__how_it_works_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__how_it_works_page_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_how_to_prepare_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__how_to_prepare_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__how_to_prepare_page_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_corporate_groups_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__corporate_groups_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__corporate_groups_page_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_track_record_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__track_record_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__track_record_page_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_private_tours_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__private_tours_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__private_tours_page_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_directions_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__directions_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__directions_page_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_tour_quiz_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tour_quiz_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tour_quiz_v_published_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_exports_format" AS ENUM('csv', 'json');
  CREATE TYPE "public"."enum_exports_sort_order" AS ENUM('asc', 'desc');
  CREATE TYPE "public"."enum_exports_locale" AS ENUM('all', 'en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt');
  CREATE TYPE "public"."enum_exports_drafts" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_imports_import_mode" AS ENUM('create', 'update', 'upsert');
  CREATE TYPE "public"."enum_imports_status" AS ENUM('pending', 'completed', 'partial', 'failed');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'createCollectionExport', 'createCollectionImport');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'createCollectionExport', 'createCollectionImport');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"full_name" varchar,
  	"department" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"usage" varchar,
  	"prefix" varchar DEFAULT 'payload-media',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "tours_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "tours_whats_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "tours_whats_excluded" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "tours_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"highlight" varchar
  );
  
  CREATE TABLE "tours_start_times" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"time" varchar
  );
  
  CREATE TABLE "tours_itinerary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step" numeric,
  	"title" varchar,
  	"description" varchar,
  	"duration" varchar
  );
  
  CREATE TABLE "tours_differentiators_tourist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "tours_differentiators_us" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "tours_what_to_bring" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "tours_languages_offered" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" varchar
  );
  
  CREATE TABLE "tours_segment_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "tours_gallery_image_alts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"alt" varchar
  );
  
  CREATE TABLE "tours" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"price" numeric,
  	"currency" varchar DEFAULT 'MYR',
  	"duration" varchar,
  	"duration_minutes" numeric,
  	"location" varchar,
  	"max_participants" numeric,
  	"min_participants" numeric DEFAULT 2,
  	"tailored_available" boolean DEFAULT false,
  	"hero_image_id" integer,
  	"ticketing_hub_id" varchar,
  	"is_bookable" boolean DEFAULT false,
  	"booking_url" varchar,
  	"instant_confirmation" boolean DEFAULT true,
  	"scheduled_publish" timestamp(3) with time zone,
  	"tour_frequency" varchar,
  	"dishes_count" numeric,
  	"difficulty" "enum_tours_difficulty" DEFAULT 'easy',
  	"walking_distance" varchar,
  	"directions_html" varchar,
  	"promo_video_url" varchar,
  	"featured" boolean DEFAULT false,
  	"popular" boolean DEFAULT false,
  	"new" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"status" "enum_tours_status" DEFAULT 'draft',
  	"workflow_status" "enum_tours_workflow_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_tours_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "tours_locales" (
  	"name" varchar,
  	"tagline" varchar,
  	"short_description" varchar,
  	"full_description" varchar,
  	"meeting_point" varchar,
  	"tailored_notes" varchar,
  	"cancellation_policy" varchar,
  	"hero_image_alt" varchar,
  	"badge_label" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "tours_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dietary_options_id" integer,
  	"landing_pages_id" integer,
  	"travel_types_id" integer,
  	"specialty_experiences_id" integer,
  	"food_items_id" integer
  );
  
  CREATE TABLE "_tours_v_version_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tours_v_version_whats_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tours_v_version_whats_excluded" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tours_v_version_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"highlight" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tours_v_version_start_times" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"time" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tours_v_version_itinerary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"step" numeric,
  	"title" varchar,
  	"description" varchar,
  	"duration" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tours_v_version_differentiators_tourist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tours_v_version_differentiators_us" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tours_v_version_what_to_bring" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tours_v_version_languages_offered" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"language" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tours_v_version_segment_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tours_v_version_gallery_image_alts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tours_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_price" numeric,
  	"version_currency" varchar DEFAULT 'MYR',
  	"version_duration" varchar,
  	"version_duration_minutes" numeric,
  	"version_location" varchar,
  	"version_max_participants" numeric,
  	"version_min_participants" numeric DEFAULT 2,
  	"version_tailored_available" boolean DEFAULT false,
  	"version_hero_image_id" integer,
  	"version_ticketing_hub_id" varchar,
  	"version_is_bookable" boolean DEFAULT false,
  	"version_booking_url" varchar,
  	"version_instant_confirmation" boolean DEFAULT true,
  	"version_scheduled_publish" timestamp(3) with time zone,
  	"version_tour_frequency" varchar,
  	"version_dishes_count" numeric,
  	"version_difficulty" "enum__tours_v_version_difficulty" DEFAULT 'easy',
  	"version_walking_distance" varchar,
  	"version_directions_html" varchar,
  	"version_promo_video_url" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_popular" boolean DEFAULT false,
  	"version_new" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_status" "enum__tours_v_version_status" DEFAULT 'draft',
  	"version_workflow_status" "enum__tours_v_version_workflow_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__tours_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__tours_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_tours_v_locales" (
  	"version_name" varchar,
  	"version_tagline" varchar,
  	"version_short_description" varchar,
  	"version_full_description" varchar,
  	"version_meeting_point" varchar,
  	"version_tailored_notes" varchar,
  	"version_cancellation_policy" varchar,
  	"version_hero_image_alt" varchar,
  	"version_badge_label" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_tours_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dietary_options_id" integer,
  	"landing_pages_id" integer,
  	"travel_types_id" integer,
  	"specialty_experiences_id" integer,
  	"food_items_id" integer
  );
  
  CREATE TABLE "stories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"author_id" integer,
  	"published_date" timestamp(3) with time zone,
  	"featured_image_id" integer,
  	"status" "enum_stories_status" DEFAULT 'draft',
  	"workflow_status" "enum_stories_workflow_status" DEFAULT 'draft',
  	"scheduled_publish" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_stories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "stories_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_stories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_author_id" integer,
  	"version_published_date" timestamp(3) with time zone,
  	"version_featured_image_id" integer,
  	"version_status" "enum__stories_v_version_status" DEFAULT 'draft',
  	"version_workflow_status" "enum__stories_v_version_workflow_status" DEFAULT 'draft',
  	"version_scheduled_publish" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__stories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__stories_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_stories_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "testimonials_page_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_testimonials_page_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author_name" varchar,
  	"author_location" varchar,
  	"rating" numeric,
  	"author_photo" varchar,
  	"date" timestamp(3) with time zone,
  	"visibility_verified" boolean DEFAULT true,
  	"visibility_featured" boolean DEFAULT false,
  	"platform" varchar,
  	"workflow_status" "enum_testimonials_workflow_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_testimonials_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "testimonials_locales" (
  	"review_text" varchar,
  	"review_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "testimonials_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tours_id" integer
  );
  
  CREATE TABLE "_testimonials_v_version_page_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__testimonials_v_version_page_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_testimonials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_author_name" varchar,
  	"version_author_location" varchar,
  	"version_rating" numeric,
  	"version_author_photo" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_visibility_verified" boolean DEFAULT true,
  	"version_visibility_featured" boolean DEFAULT false,
  	"version_platform" varchar,
  	"version_workflow_status" "enum__testimonials_v_version_workflow_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__testimonials_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__testimonials_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_testimonials_v_locales" (
  	"version_review_text" varchar,
  	"version_review_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_testimonials_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tours_id" integer
  );
  
  CREATE TABLE "faqs_page_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_faqs_page_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" "enum_faqs_category",
  	"related_tour_id" integer,
  	"related_story_id" integer,
  	"sort_order" numeric,
  	"workflow_status" "enum_faqs_workflow_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_faqs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "faqs_locales" (
  	"question" varchar,
  	"answer" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faqs_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_faqs_v_version_page_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__faqs_v_version_page_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_faqs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_category" "enum__faqs_v_version_category",
  	"version_related_tour_id" integer,
  	"version_related_story_id" integer,
  	"version_sort_order" numeric,
  	"version_workflow_status" "enum__faqs_v_version_workflow_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__faqs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__faqs_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_faqs_v_locales" (
  	"version_question" varchar,
  	"version_answer" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_faqs_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "media_coverage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" varchar,
  	"outlet" varchar,
  	"year" numeric,
  	"url" varchar,
  	"logo_domain" varchar,
  	"status" "enum_media_coverage_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_media_coverage_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "media_coverage_locales" (
  	"detail" varchar,
  	"label" varchar,
  	"highlight" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_media_coverage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_category" varchar,
  	"version_outlet" varchar,
  	"version_year" numeric,
  	"version_url" varchar,
  	"version_logo_domain" varchar,
  	"version_status" "enum__media_coverage_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__media_coverage_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__media_coverage_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_media_coverage_v_locales" (
  	"version_detail" varchar,
  	"version_label" varchar,
  	"version_highlight" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "dietary_options" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"icon" varchar,
  	"color" varchar,
  	"status" "enum_dietary_options_status" DEFAULT 'published',
  	"scheduled_publish" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_dietary_options_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "dietary_options_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_dietary_options_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_icon" varchar,
  	"version_color" varchar,
  	"version_status" "enum__dietary_options_v_version_status" DEFAULT 'published',
  	"version_scheduled_publish" timestamp(3) with time zone,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__dietary_options_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__dietary_options_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_dietary_options_v_locales" (
  	"version_name" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "food_items_local_names" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_food_items_local_names_language",
  	"name" varchar,
  	"script" varchar
  );
  
  CREATE TABLE "food_items_ingredients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ingredient" varchar,
  	"is_main" boolean
  );
  
  CREATE TABLE "food_items_allergens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"allergen" "enum_food_items_allergens_allergen"
  );
  
  CREATE TABLE "food_items_flavor_profile" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"flavor" "enum_food_items_flavor_profile_flavor"
  );
  
  CREATE TABLE "food_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"category" "enum_food_items_category",
  	"origin" "enum_food_items_origin",
  	"region" varchar,
  	"spice_level" "enum_food_items_spice_level" DEFAULT '0',
  	"preparation_method" "enum_food_items_preparation_method",
  	"typical_price" numeric,
  	"availability" "enum_food_items_availability" DEFAULT 'year_round',
  	"image_id" integer,
  	"cultural_significance" varchar,
  	"serving_suggestions" varchar,
  	"popular_variations" varchar,
  	"pairings" varchar,
  	"vendor_notes" varchar,
  	"status" "enum_food_items_status" DEFAULT 'draft',
  	"featured" boolean DEFAULT false,
  	"scheduled_publish" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_food_items_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "food_items_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "food_items_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dietary_options_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_food_items_v_version_local_names" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"language" "enum__food_items_v_version_local_names_language",
  	"name" varchar,
  	"script" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_food_items_v_version_ingredients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"ingredient" varchar,
  	"is_main" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_food_items_v_version_allergens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"allergen" "enum__food_items_v_version_allergens_allergen",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_food_items_v_version_flavor_profile" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"flavor" "enum__food_items_v_version_flavor_profile_flavor",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_food_items_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_category" "enum__food_items_v_version_category",
  	"version_origin" "enum__food_items_v_version_origin",
  	"version_region" varchar,
  	"version_spice_level" "enum__food_items_v_version_spice_level" DEFAULT '0',
  	"version_preparation_method" "enum__food_items_v_version_preparation_method",
  	"version_typical_price" numeric,
  	"version_availability" "enum__food_items_v_version_availability" DEFAULT 'year_round',
  	"version_image_id" integer,
  	"version_cultural_significance" varchar,
  	"version_serving_suggestions" varchar,
  	"version_popular_variations" varchar,
  	"version_pairings" varchar,
  	"version_vendor_notes" varchar,
  	"version_status" "enum__food_items_v_version_status" DEFAULT 'draft',
  	"version_featured" boolean DEFAULT false,
  	"version_scheduled_publish" timestamp(3) with time zone,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__food_items_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__food_items_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_food_items_v_locales" (
  	"version_name" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_food_items_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dietary_options_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "vendors_operating_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_vendors_operating_hours_day",
  	"open_time" varchar,
  	"close_time" varchar,
  	"is_closed" boolean,
  	"notes" varchar
  );
  
  CREATE TABLE "vendors_closed_on" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_vendors_closed_on_day"
  );
  
  CREATE TABLE "vendors_payment_methods" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"method" "enum_vendors_payment_methods_method"
  );
  
  CREATE TABLE "vendors_facilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"facility" "enum_vendors_facilities_facility"
  );
  
  CREATE TABLE "vendors_images_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "vendors_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"award" varchar,
  	"year" numeric,
  	"organization" varchar
  );
  
  CREATE TABLE "vendors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"type" "enum_vendors_type",
  	"year_established" numeric,
  	"cuisine_type" "enum_vendors_cuisine_type",
  	"contact_phone" varchar,
  	"contact_whatsapp" varchar,
  	"contact_email" varchar,
  	"contact_website" varchar,
  	"contact_facebook" varchar,
  	"contact_instagram" varchar,
  	"price_range" "enum_vendors_price_range",
  	"images_main_id" integer,
  	"status" "enum_vendors_status" DEFAULT 'draft',
  	"featured" boolean DEFAULT false,
  	"scheduled_publish" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_vendors_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "vendors_locales" (
  	"name" varchar,
  	"description" varchar,
  	"history" varchar,
  	"generation" varchar,
  	"owner_name" varchar,
  	"location_address" varchar,
  	"location_city" varchar,
  	"location_state" "enum_vendors_location_state",
  	"location_postcode" varchar,
  	"location_country" varchar DEFAULT 'Malaysia',
  	"location_latitude" numeric,
  	"location_longitude" numeric,
  	"location_landmark" varchar,
  	"story" varchar,
  	"media_features" varchar,
  	"tips" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "vendors_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"food_items_id" integer,
  	"dietary_options_id" integer
  );
  
  CREATE TABLE "_vendors_v_version_operating_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" "enum__vendors_v_version_operating_hours_day",
  	"open_time" varchar,
  	"close_time" varchar,
  	"is_closed" boolean,
  	"notes" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_vendors_v_version_closed_on" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" "enum__vendors_v_version_closed_on_day",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_vendors_v_version_payment_methods" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"method" "enum__vendors_v_version_payment_methods_method",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_vendors_v_version_facilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"facility" "enum__vendors_v_version_facilities_facility",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_vendors_v_version_images_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_vendors_v_version_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"award" varchar,
  	"year" numeric,
  	"organization" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_vendors_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_type" "enum__vendors_v_version_type",
  	"version_year_established" numeric,
  	"version_cuisine_type" "enum__vendors_v_version_cuisine_type",
  	"version_contact_phone" varchar,
  	"version_contact_whatsapp" varchar,
  	"version_contact_email" varchar,
  	"version_contact_website" varchar,
  	"version_contact_facebook" varchar,
  	"version_contact_instagram" varchar,
  	"version_price_range" "enum__vendors_v_version_price_range",
  	"version_images_main_id" integer,
  	"version_status" "enum__vendors_v_version_status" DEFAULT 'draft',
  	"version_featured" boolean DEFAULT false,
  	"version_scheduled_publish" timestamp(3) with time zone,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__vendors_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__vendors_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_vendors_v_locales" (
  	"version_name" varchar,
  	"version_description" varchar,
  	"version_history" varchar,
  	"version_generation" varchar,
  	"version_owner_name" varchar,
  	"version_location_address" varchar,
  	"version_location_city" varchar,
  	"version_location_state" "enum__vendors_v_version_location_state",
  	"version_location_postcode" varchar,
  	"version_location_country" varchar DEFAULT 'Malaysia',
  	"version_location_latitude" numeric,
  	"version_location_longitude" numeric,
  	"version_location_landmark" varchar,
  	"version_story" varchar,
  	"version_media_features" varchar,
  	"version_tips" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_vendors_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"food_items_id" integer,
  	"dietary_options_id" integer
  );
  
  CREATE TABLE "landing_pages_challenges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "landing_pages_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "landing_pages_tips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" varchar
  );
  
  CREATE TABLE "landing_pages_safe_dishes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "landing_pages_avoid_dishes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "landing_pages_suitable_tours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tour_slug" varchar
  );
  
  CREATE TABLE "landing_pages_travel_tips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" varchar
  );
  
  CREATE TABLE "landing_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"type" "enum_landing_pages_type",
  	"status" "enum_landing_pages_status" DEFAULT 'draft',
  	"icon" varchar,
  	"color" varchar,
  	"hero_image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_landing_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "landing_pages_locales" (
  	"title" varchar,
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"hero_description" varchar,
  	"intro_heading" varchar,
  	"intro_content" varchar,
  	"challenges_heading" varchar,
  	"options_heading" varchar,
  	"options_content" varchar,
  	"features_heading" varchar,
  	"tips_heading" varchar,
  	"tips_content" varchar,
  	"safe_dishes_heading" varchar,
  	"avoid_dishes_heading" varchar,
  	"tours_heading" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_version_challenges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_version_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_version_tips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_version_safe_dishes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_version_avoid_dishes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_version_suitable_tours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tour_slug" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_version_travel_tips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_type" "enum__landing_pages_v_version_type",
  	"version_status" "enum__landing_pages_v_version_status" DEFAULT 'draft',
  	"version_icon" varchar,
  	"version_color" varchar,
  	"version_hero_image_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__landing_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__landing_pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_landing_pages_v_locales" (
  	"version_title" varchar,
  	"version_hero_title" varchar,
  	"version_hero_subtitle" varchar,
  	"version_hero_description" varchar,
  	"version_intro_heading" varchar,
  	"version_intro_content" varchar,
  	"version_challenges_heading" varchar,
  	"version_options_heading" varchar,
  	"version_options_content" varchar,
  	"version_features_heading" varchar,
  	"version_tips_heading" varchar,
  	"version_tips_content" varchar,
  	"version_safe_dishes_heading" varchar,
  	"version_avoid_dishes_heading" varchar,
  	"version_tours_heading" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"type" "enum_pages_type",
  	"status" "enum_pages_status" DEFAULT 'draft',
  	"location" varchar,
  	"hero_image_id" integer,
  	"price" varchar,
  	"duration" varchar,
  	"max_participants" numeric,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"tagline" varchar,
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"hero_description" varchar,
  	"short_description" varchar,
  	"full_description" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_version_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_type" "enum__pages_v_version_type",
  	"version_status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"version_location" varchar,
  	"version_hero_image_id" integer,
  	"version_price" varchar,
  	"version_duration" varchar,
  	"version_max_participants" numeric,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_tagline" varchar,
  	"version_hero_title" varchar,
  	"version_hero_subtitle" varchar,
  	"version_hero_description" varchar,
  	"version_short_description" varchar,
  	"version_full_description" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_page_blocks_hero_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_page_blocks_founder_story_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_page_blocks_stats_block_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_blocks_stats_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_page_blocks_timeline_block_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "about_page_blocks_timeline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_page_blocks_philosophy_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "about_page_blocks_philosophy_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_page_blocks_team_block_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"specialty" varchar,
  	"description" varchar,
  	"photo" varchar
  );
  
  CREATE TABLE "about_page_blocks_team_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_page_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "about_page_locales" (
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contact_page_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"whatsapp_number" varchar,
  	"social_facebook" varchar,
  	"social_instagram" varchar,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_contact_page_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "contact_page_locales" (
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"intro_title" varchar,
  	"intro_subtitle" varchar,
  	"contact_hours" varchar,
  	"faq_content" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_contact_page_v_version_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contact_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_contact_email" varchar,
  	"version_contact_phone" varchar,
  	"version_whatsapp_number" varchar,
  	"version_social_facebook" varchar,
  	"version_social_instagram" varchar,
  	"version_parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__contact_page_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__contact_page_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_contact_page_v_locales" (
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_hero_title" varchar,
  	"version_hero_subtitle" varchar,
  	"version_intro_title" varchar,
  	"version_intro_subtitle" varchar,
  	"version_contact_hours" varchar,
  	"version_faq_content" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "thank_you_pages_next_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step" varchar
  );
  
  CREATE TABLE "thank_you_pages_cta_section_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"variant" "enum_thank_you_pages_cta_section_cta_buttons_variant" DEFAULT 'primary'
  );
  
  CREATE TABLE "thank_you_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_thank_you_pages_type",
  	"slug" varchar,
  	"status" "enum_thank_you_pages_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_thank_you_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "thank_you_pages_locales" (
  	"title" varchar,
  	"hero_section_heading" varchar DEFAULT 'Thank You!',
  	"hero_section_subheading" varchar DEFAULT 'We''ve received your message',
  	"hero_section_icon" varchar DEFAULT '✅',
  	"message" jsonb,
  	"contact_info_show_contact" boolean DEFAULT true,
  	"contact_info_email" varchar,
  	"contact_info_phone" varchar,
  	"contact_info_response_time" varchar DEFAULT 'We''ll respond within 24 hours',
  	"cta_section_show_cta" boolean DEFAULT true,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_thank_you_pages_v_version_next_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"step" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_thank_you_pages_v_version_cta_section_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"variant" "enum__thank_you_pages_v_version_cta_section_cta_buttons_variant" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_thank_you_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_type" "enum__thank_you_pages_v_version_type",
  	"version_slug" varchar,
  	"version_status" "enum__thank_you_pages_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__thank_you_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__thank_you_pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_thank_you_pages_v_locales" (
  	"version_title" varchar,
  	"version_hero_section_heading" varchar DEFAULT 'Thank You!',
  	"version_hero_section_subheading" varchar DEFAULT 'We''ve received your message',
  	"version_hero_section_icon" varchar DEFAULT '✅',
  	"version_message" jsonb,
  	"version_contact_info_show_contact" boolean DEFAULT true,
  	"version_contact_info_email" varchar,
  	"version_contact_info_phone" varchar,
  	"version_contact_info_response_time" varchar DEFAULT 'We''ll respond within 24 hours',
  	"version_cta_section_show_cta" boolean DEFAULT true,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_page_blocks_hero_block_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "home_page_blocks_hero_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"highlight" varchar,
  	"title_end" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"price_info" varchar,
  	"bg_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_manifesto_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"tagline" varchar,
  	"body" varchar,
  	"attribution_role" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_pillars_block_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"heading" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "home_page_blocks_pillars_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_vendors_block_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "home_page_blocks_vendors_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_segments_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"view_all_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_about_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"heritage" varchar,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_stats_block_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"heading" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "home_page_blocks_stats_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_cta_block_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "home_page_blocks_cta_block_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"variant" "enum_home_page_blocks_cta_block_buttons_variant" DEFAULT 'primary'
  );
  
  CREATE TABLE "home_page_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_why_us_block_reasons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_name" "enum_home_page_blocks_why_us_block_reasons_icon_name",
  	"stat" varchar,
  	"heading" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "home_page_blocks_why_us_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_guarantees_block_guarantees" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_name" "enum_home_page_blocks_guarantees_block_guarantees_icon_name",
  	"heading" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "home_page_blocks_guarantees_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"private_tour_callout_title" varchar,
  	"private_tour_callout_body" varchar,
  	"private_tour_callout_cta_label" varchar,
  	"private_tour_callout_cta_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "plat" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "name",
  	"rating" varchar,
  	"review_count" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "home_page_blocks_social_proof_badges_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"guest_stats_total_guests" varchar,
  	"guest_stats_since_year" varchar,
  	"guest_stats_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"faqs" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_home_page_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "home_page_locales" (
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_blocks_hero_block_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_hero_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"highlight" varchar,
  	"title_end" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"price_info" varchar,
  	"bg_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_manifesto_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"tagline" varchar,
  	"body" varchar,
  	"attribution_role" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_pillars_block_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_pillars_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_vendors_block_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_vendors_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_segments_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"view_all_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_about_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"heritage" varchar,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_stats_block_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_stats_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_cta_block_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_cta_block_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"variant" "enum__home_page_v_blocks_cta_block_buttons_variant" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_why_us_block_reasons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_name" "enum__home_page_v_blocks_why_us_block_reasons_icon_name",
  	"stat" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_why_us_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_guarantees_block_guarantees" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_name" "enum__home_page_v_blocks_guarantees_block_guarantees_icon_name",
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_guarantees_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"private_tour_callout_title" varchar,
  	"private_tour_callout_body" varchar,
  	"private_tour_callout_cta_label" varchar,
  	"private_tour_callout_cta_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_plat_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "name",
  	"rating" varchar,
  	"review_count" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_social_proof_badges_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"guest_stats_total_guests" varchar,
  	"guest_stats_since_year" varchar,
  	"guest_stats_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_faqs" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__home_page_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__home_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_home_page_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "legal_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"status" "enum_legal_pages_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_legal_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "legal_pages_locales" (
  	"headline" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_legal_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_status" "enum__legal_pages_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__legal_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__legal_pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_legal_pages_v_locales" (
  	"version_headline" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "menus_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"open_in_new_tab" boolean,
  	"order" numeric
  );
  
  CREATE TABLE "menus" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"location" "enum_menus_location" NOT NULL,
  	"item_count" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "menus_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "travel_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"icon" varchar,
  	"color" varchar,
  	"status" "enum_travel_types_status" DEFAULT 'published',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_travel_types_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "travel_types_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_travel_types_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_icon" varchar,
  	"version_color" varchar,
  	"version_status" "enum__travel_types_v_version_status" DEFAULT 'published',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__travel_types_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__travel_types_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_travel_types_v_locales" (
  	"version_name" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "specialty_experiences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"icon" varchar,
  	"color" varchar,
  	"status" "enum_specialty_experiences_status" DEFAULT 'published',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_specialty_experiences_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "specialty_experiences_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_specialty_experiences_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_icon" varchar,
  	"version_color" varchar,
  	"version_status" "enum__specialty_experiences_v_version_status" DEFAULT 'published',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__specialty_experiences_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__specialty_experiences_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_specialty_experiences_v_locales" (
  	"version_name" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"icon" varchar,
  	"color" varchar,
  	"status" "enum_locations_status" DEFAULT 'published',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_locations_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "locations_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_locations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_icon" varchar,
  	"version_color" varchar,
  	"version_status" "enum__locations_v_version_status" DEFAULT 'published',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__locations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__locations_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_locations_v_locales" (
  	"version_name" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "neighborhoods_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "neighborhoods_food_specialties" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "neighborhoods" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"image_id" integer,
  	"location" "enum_neighborhoods_location",
  	"status" "enum_neighborhoods_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_neighborhoods_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "neighborhoods_locales" (
  	"name" varchar,
  	"description" varchar,
  	"full_description" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "neighborhoods_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tours_id" integer
  );
  
  CREATE TABLE "_neighborhoods_v_version_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_neighborhoods_v_version_food_specialties" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_neighborhoods_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_image_id" integer,
  	"version_location" "enum__neighborhoods_v_version_location",
  	"version_status" "enum__neighborhoods_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__neighborhoods_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__neighborhoods_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_neighborhoods_v_locales" (
  	"version_name" varchar,
  	"version_description" varchar,
  	"version_full_description" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_neighborhoods_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tours_id" integer
  );
  
  CREATE TABLE "site_settings_social_proof_platforms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_proof_platforms_platform",
  	"rating" varchar,
  	"review_count" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar,
  	"company_established" numeric,
  	"registration_no" varchar,
  	"tour_price" numeric,
  	"tour_currency" varchar DEFAULT 'MYR',
  	"max_people_per_tour" numeric,
  	"tour_duration" varchar,
  	"heritage_vendors_count" varchar,
  	"years_operating" varchar,
  	"guests_hosted" varchar,
  	"rating" varchar,
  	"review_count" varchar,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"whatsapp_number" varchar,
  	"forms_webhook_url" varchar,
  	"social_facebook" varchar,
  	"social_instagram" varchar,
  	"social_youtube" varchar,
  	"social_tripadvisor" varchar,
  	"social_tripadvisor_penang" varchar,
  	"social_linkedin_company" varchar,
  	"social_linkedin_maarten" varchar,
  	"social_linkedin_pauline" varchar,
  	"press_natgeo_url" varchar,
  	"press_lonelyplanet_url" varchar,
  	"press_cnn_url" varchar,
  	"press_routard_url" varchar,
  	"press_timeout_penang_url" varchar,
  	"gmb_kl_url" varchar,
  	"gmb_penang_url" varchar,
  	"og_image_id" integer,
  	"hero_image_id" integer,
  	"booking_url" varchar,
  	"main_navigation" jsonb,
  	"mobile_navigation" jsonb,
  	"footer_navigation" jsonb,
  	"sub_page_menus" jsonb,
  	"show_vendors" boolean DEFAULT true,
  	"google_analytics_id" varchar,
  	"google_tag_manager_id" varchar,
  	"facebook_pixel_id" varchar,
  	"head_scripts" varchar,
  	"meta_facebook_verification" varchar,
  	"currency_rate_usd" numeric,
  	"currency_rate_eur" numeric,
  	"currency_rate_gbp" numeric,
  	"currency_rate_sgd" numeric,
  	"currency_rate_aud" numeric,
  	"currency_rate_cad" numeric,
  	"currency_rate_chf" numeric,
  	"currency_rate_cny" numeric,
  	"currency_rates_fetched_at" varchar,
  	"guide_max_bio_length" numeric DEFAULT 250,
  	"guide_max_education_length" numeric DEFAULT 150,
  	"guide_max_expertise_length" numeric DEFAULT 100,
  	"guide_max_highlight_length" numeric DEFAULT 80,
  	"guide_max_personality_length" numeric DEFAULT 100,
  	"guide_max_testimonial_length" numeric DEFAULT 200,
  	"analytics_type" "enum_site_settings_analytics_type" DEFAULT 'google_analytics',
  	"cookie_banner_enabled" boolean DEFAULT true,
  	"cookie_banner_privacy_link" varchar,
  	"cta_defaults_primary_url" varchar,
  	"cta_defaults_secondary_url" varchar,
  	"error_page_cta_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_site_settings_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "site_settings_locales" (
  	"tagline" varchar,
  	"description" varchar,
  	"business_hours" varchar,
  	"address" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"footer_copyright_text" varchar,
  	"contact_page_title" varchar,
  	"contact_page_description" varchar,
  	"faq_page_title" varchar,
  	"faq_page_description" varchar,
  	"corporate_page_title" varchar,
  	"corporate_page_content" jsonb,
  	"guide_meta_description" varchar,
  	"newsletter_section_heading" varchar,
  	"newsletter_placeholder_text" varchar,
  	"newsletter_submit_button" varchar,
  	"newsletter_success_message" varchar,
  	"whatsapp_button_label" varchar,
  	"whatsapp_greeting_message" varchar,
  	"cookie_banner_message" varchar,
  	"cookie_banner_decline_text" varchar,
  	"cookie_banner_accept_text" varchar,
  	"cta_defaults_primary_label" varchar,
  	"cta_defaults_secondary_label" varchar,
  	"cta_defaults_whatsapp_label" varchar,
  	"error_page_title" varchar,
  	"error_page_body" varchar,
  	"error_page_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_site_settings_v_version_social_proof_platforms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__site_settings_v_version_social_proof_platforms_platform",
  	"rating" varchar,
  	"review_count" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_site_name" varchar,
  	"version_company_established" numeric,
  	"version_registration_no" varchar,
  	"version_tour_price" numeric,
  	"version_tour_currency" varchar DEFAULT 'MYR',
  	"version_max_people_per_tour" numeric,
  	"version_tour_duration" varchar,
  	"version_heritage_vendors_count" varchar,
  	"version_years_operating" varchar,
  	"version_guests_hosted" varchar,
  	"version_rating" varchar,
  	"version_review_count" varchar,
  	"version_contact_email" varchar,
  	"version_contact_phone" varchar,
  	"version_whatsapp_number" varchar,
  	"version_forms_webhook_url" varchar,
  	"version_social_facebook" varchar,
  	"version_social_instagram" varchar,
  	"version_social_youtube" varchar,
  	"version_social_tripadvisor" varchar,
  	"version_social_tripadvisor_penang" varchar,
  	"version_social_linkedin_company" varchar,
  	"version_social_linkedin_maarten" varchar,
  	"version_social_linkedin_pauline" varchar,
  	"version_press_natgeo_url" varchar,
  	"version_press_lonelyplanet_url" varchar,
  	"version_press_cnn_url" varchar,
  	"version_press_routard_url" varchar,
  	"version_press_timeout_penang_url" varchar,
  	"version_gmb_kl_url" varchar,
  	"version_gmb_penang_url" varchar,
  	"version_og_image_id" integer,
  	"version_hero_image_id" integer,
  	"version_booking_url" varchar,
  	"version_main_navigation" jsonb,
  	"version_mobile_navigation" jsonb,
  	"version_footer_navigation" jsonb,
  	"version_sub_page_menus" jsonb,
  	"version_show_vendors" boolean DEFAULT true,
  	"version_google_analytics_id" varchar,
  	"version_google_tag_manager_id" varchar,
  	"version_facebook_pixel_id" varchar,
  	"version_head_scripts" varchar,
  	"version_meta_facebook_verification" varchar,
  	"version_currency_rate_usd" numeric,
  	"version_currency_rate_eur" numeric,
  	"version_currency_rate_gbp" numeric,
  	"version_currency_rate_sgd" numeric,
  	"version_currency_rate_aud" numeric,
  	"version_currency_rate_cad" numeric,
  	"version_currency_rate_chf" numeric,
  	"version_currency_rate_cny" numeric,
  	"version_currency_rates_fetched_at" varchar,
  	"version_guide_max_bio_length" numeric DEFAULT 250,
  	"version_guide_max_education_length" numeric DEFAULT 150,
  	"version_guide_max_expertise_length" numeric DEFAULT 100,
  	"version_guide_max_highlight_length" numeric DEFAULT 80,
  	"version_guide_max_personality_length" numeric DEFAULT 100,
  	"version_guide_max_testimonial_length" numeric DEFAULT 200,
  	"version_analytics_type" "enum__site_settings_v_version_analytics_type" DEFAULT 'google_analytics',
  	"version_cookie_banner_enabled" boolean DEFAULT true,
  	"version_cookie_banner_privacy_link" varchar,
  	"version_cta_defaults_primary_url" varchar,
  	"version_cta_defaults_secondary_url" varchar,
  	"version_error_page_cta_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_settings_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_settings_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_site_settings_v_locales" (
  	"version_tagline" varchar,
  	"version_description" varchar,
  	"version_business_hours" varchar,
  	"version_address" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_footer_copyright_text" varchar,
  	"version_contact_page_title" varchar,
  	"version_contact_page_description" varchar,
  	"version_faq_page_title" varchar,
  	"version_faq_page_description" varchar,
  	"version_corporate_page_title" varchar,
  	"version_corporate_page_content" jsonb,
  	"version_guide_meta_description" varchar,
  	"version_newsletter_section_heading" varchar,
  	"version_newsletter_placeholder_text" varchar,
  	"version_newsletter_submit_button" varchar,
  	"version_newsletter_success_message" varchar,
  	"version_whatsapp_button_label" varchar,
  	"version_whatsapp_greeting_message" varchar,
  	"version_cookie_banner_message" varchar,
  	"version_cookie_banner_decline_text" varchar,
  	"version_cookie_banner_accept_text" varchar,
  	"version_cta_defaults_primary_label" varchar,
  	"version_cta_defaults_secondary_label" varchar,
  	"version_cta_defaults_whatsapp_label" varchar,
  	"version_error_page_title" varchar,
  	"version_error_page_body" varchar,
  	"version_error_page_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "comparison_page_competitors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"tagline" varchar
  );
  
  CREATE TABLE "comparison_page_comparison_rows_competitor_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "comparison_page_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"us_value" varchar,
  	"highlight" boolean DEFAULT false
  );
  
  CREATE TABLE "comparison_page_trust_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "comparison_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_section_cta_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_comparison_page_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "comparison_page_locales" (
  	"page_title" varchar,
  	"page_subtitle" varchar,
  	"hero_description" varchar,
  	"comparison_intro" varchar,
  	"cta_section_eyebrow" varchar,
  	"cta_section_title" varchar,
  	"cta_section_body" varchar,
  	"cta_section_cta_label" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_comparison_page_v_version_competitors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"tagline" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_comparison_page_v_version_comparison_rows_competitor_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_comparison_page_v_version_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"us_value" varchar,
  	"highlight" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_comparison_page_v_version_trust_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_comparison_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_cta_section_cta_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__comparison_page_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__comparison_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_comparison_page_v_locales" (
  	"version_page_title" varchar,
  	"version_page_subtitle" varchar,
  	"version_hero_description" varchar,
  	"version_comparison_intro" varchar,
  	"version_cta_section_eyebrow" varchar,
  	"version_cta_section_title" varchar,
  	"version_cta_section_body" varchar,
  	"version_cta_section_cta_label" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "how_it_works_page_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"title" varchar,
  	"detail" varchar
  );
  
  CREATE TABLE "how_it_works_page_inclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "how_it_works_page_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "how_it_works_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_how_it_works_page_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "how_it_works_page_locales" (
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"steps_title" varchar,
  	"inclusions_title" varchar,
  	"formats_title" varchar,
  	"formats_subtitle" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_how_it_works_page_v_version_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"title" varchar,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_how_it_works_page_v_version_inclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_how_it_works_page_v_version_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_how_it_works_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__how_it_works_page_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__how_it_works_page_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_how_it_works_page_v_locales" (
  	"version_hero_title" varchar,
  	"version_hero_subtitle" varchar,
  	"version_steps_title" varchar,
  	"version_inclusions_title" varchar,
  	"version_formats_title" varchar,
  	"version_formats_subtitle" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "how_to_prepare_page_what_to_wear" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "how_to_prepare_page_what_to_bring" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "how_to_prepare_page_what_to_expect" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "how_to_prepare_page_dietary_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "how_to_prepare_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_how_to_prepare_page_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "how_to_prepare_page_locales" (
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"hero_title" varchar,
  	"hero_description" varchar,
  	"dietary_heading" varchar,
  	"dietary_intro" varchar,
  	"directions_cta_text" varchar,
  	"directions_cta_button" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_how_to_prepare_page_v_version_what_to_wear" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_how_to_prepare_page_v_version_what_to_bring" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_how_to_prepare_page_v_version_what_to_expect" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_how_to_prepare_page_v_version_dietary_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_how_to_prepare_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_hero_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__how_to_prepare_page_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__how_to_prepare_page_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_how_to_prepare_page_v_locales" (
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_hero_title" varchar,
  	"version_hero_description" varchar,
  	"version_dietary_heading" varchar,
  	"version_dietary_intro" varchar,
  	"version_directions_cta_text" varchar,
  	"version_directions_cta_button" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "corporate_groups_page_offer_perfect_for" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "corporate_groups_page_benefit_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "corporate_groups_page_how_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "corporate_groups_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_corporate_groups_page_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "corporate_groups_page_locales" (
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"hero_eyebrow" varchar,
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"offer_eyebrow" varchar,
  	"offer_heading" varchar,
  	"offer_body_1" varchar,
  	"offer_body_2" varchar,
  	"benefits_eyebrow" varchar,
  	"benefits_title" varchar,
  	"kl_section_eyebrow" varchar,
  	"kl_section_heading" varchar,
  	"kl_section_subtext" varchar,
  	"penang_section_eyebrow" varchar,
  	"penang_section_heading" varchar,
  	"penang_section_subtext" varchar,
  	"how_eyebrow" varchar,
  	"how_heading" varchar,
  	"cta_heading" varchar,
  	"cta_body" varchar,
  	"cta_email_label" varchar,
  	"cta_whatsapp_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_corporate_groups_page_v_version_offer_perfect_for" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_corporate_groups_page_v_version_benefit_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_corporate_groups_page_v_version_how_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_corporate_groups_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__corporate_groups_page_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__corporate_groups_page_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_corporate_groups_page_v_locales" (
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_hero_eyebrow" varchar,
  	"version_hero_title" varchar,
  	"version_hero_subtitle" varchar,
  	"version_offer_eyebrow" varchar,
  	"version_offer_heading" varchar,
  	"version_offer_body_1" varchar,
  	"version_offer_body_2" varchar,
  	"version_benefits_eyebrow" varchar,
  	"version_benefits_title" varchar,
  	"version_kl_section_eyebrow" varchar,
  	"version_kl_section_heading" varchar,
  	"version_kl_section_subtext" varchar,
  	"version_penang_section_eyebrow" varchar,
  	"version_penang_section_heading" varchar,
  	"version_penang_section_subtext" varchar,
  	"version_how_eyebrow" varchar,
  	"version_how_heading" varchar,
  	"version_cta_heading" varchar,
  	"version_cta_body" varchar,
  	"version_cta_email_label" varchar,
  	"version_cta_whatsapp_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "track_record_page_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "track_record_page_segments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"num" varchar,
  	"emoji" varchar,
  	"name" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "track_record_page_case_studies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"client" varchar,
  	"type" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "track_record_page_press" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"outlet" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "track_record_page_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"award" varchar,
  	"year" numeric,
  	"organization" varchar
  );
  
  CREATE TABLE "track_record_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_track_record_page_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "track_record_page_locales" (
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"philosophy_quote" varchar,
  	"how_we_work_eyebrow" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_track_record_page_v_version_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_track_record_page_v_version_segments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"num" varchar,
  	"emoji" varchar,
  	"name" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_track_record_page_v_version_case_studies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"client" varchar,
  	"type" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_track_record_page_v_version_press" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"outlet" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_track_record_page_v_version_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"award" varchar,
  	"year" numeric,
  	"organization" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_track_record_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__track_record_page_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__track_record_page_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_track_record_page_v_locales" (
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_hero_title" varchar,
  	"version_hero_subtitle" varchar,
  	"version_philosophy_quote" varchar,
  	"version_how_we_work_eyebrow" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
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
  	"snapshot" boolean,
  	"published_locale" "enum__private_tours_page_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "directions_page_meeting_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tour" varchar,
  	"location_name" varchar,
  	"address" varchar,
  	"directions" varchar,
  	"landmark" varchar,
  	"map_url" varchar,
  	"parking_info" varchar,
  	"public_transport" varchar
  );
  
  CREATE TABLE "directions_page_general_tips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tip" varchar
  );
  
  CREATE TABLE "directions_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_directions_page_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "directions_page_locales" (
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"hero_title" varchar,
  	"hero_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_directions_page_v_version_meeting_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tour" varchar,
  	"location_name" varchar,
  	"address" varchar,
  	"directions" varchar,
  	"landmark" varchar,
  	"map_url" varchar,
  	"parking_info" varchar,
  	"public_transport" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_directions_page_v_version_general_tips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tip" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_directions_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_hero_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__directions_page_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__directions_page_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_directions_page_v_locales" (
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_hero_title" varchar,
  	"version_hero_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "tour_quiz_steps_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"icon" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "tour_quiz_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar
  );
  
  CREATE TABLE "tour_quiz_personalities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"title" varchar,
  	"emoji" varchar,
  	"description" varchar,
  	"tour_match" varchar
  );
  
  CREATE TABLE "tour_quiz_scoring_weights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question_id" varchar,
  	"answer_value" varchar,
  	"weights" jsonb
  );
  
  CREATE TABLE "tour_quiz_result_headlines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"headline" varchar,
  	"subtext" varchar
  );
  
  CREATE TABLE "tour_quiz" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_tour_quiz_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "tour_quiz_locales" (
  	"intro_title" varchar DEFAULT 'What Type of Malaysian Foodie Are You?',
  	"intro_description" varchar DEFAULT 'Tell us about your Malaysian food experience and we''ll reveal your foodie personality — plus match you with the perfect tour.',
  	"intro_button_label" varchar DEFAULT 'Take the Quiz',
  	"fallback_headline" varchar DEFAULT 'Our Top Picks For You',
  	"contact_cta_text" varchar DEFAULT 'Still not sure which tour is right for you?',
  	"contact_cta_button" varchar DEFAULT 'Let Us Help You Choose',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "tour_quiz_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tours_id" integer
  );
  
  CREATE TABLE "_tour_quiz_v_version_steps_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"icon" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tour_quiz_v_version_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"question" varchar
  );
  
  CREATE TABLE "_tour_quiz_v_version_personalities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"title" varchar,
  	"emoji" varchar,
  	"description" varchar,
  	"tour_match" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tour_quiz_v_version_scoring_weights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question_id" varchar,
  	"answer_value" varchar,
  	"weights" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tour_quiz_v_version_result_headlines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"headline" varchar,
  	"subtext" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tour_quiz_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__tour_quiz_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__tour_quiz_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_tour_quiz_v_locales" (
  	"version_intro_title" varchar DEFAULT 'What Type of Malaysian Foodie Are You?',
  	"version_intro_description" varchar DEFAULT 'Tell us about your Malaysian food experience and we''ll reveal your foodie personality — plus match you with the perfect tour.',
  	"version_intro_button_label" varchar DEFAULT 'Take the Quiz',
  	"version_fallback_headline" varchar DEFAULT 'Our Top Picks For You',
  	"version_contact_cta_text" varchar DEFAULT 'Still not sure which tour is right for you?',
  	"version_contact_cta_button" varchar DEFAULT 'Let Us Help You Choose',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_tour_quiz_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tours_id" integer
  );
  
  CREATE TABLE "exports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"format" "enum_exports_format" DEFAULT 'csv' NOT NULL,
  	"limit" numeric,
  	"page" numeric DEFAULT 1,
  	"sort" varchar,
  	"sort_order" "enum_exports_sort_order",
  	"locale" "enum_exports_locale" DEFAULT 'all',
  	"drafts" "enum_exports_drafts" DEFAULT 'yes',
  	"collection_slug" varchar DEFAULT 'users' NOT NULL,
  	"where" jsonb DEFAULT '{}'::jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "exports_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "imports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"collection_slug" varchar DEFAULT 'users' NOT NULL,
  	"import_mode" "enum_imports_import_mode",
  	"match_field" varchar DEFAULT 'id',
  	"status" "enum_imports_status" DEFAULT 'pending',
  	"summary_imported" numeric,
  	"summary_updated" numeric,
  	"summary_total" numeric,
  	"summary_issues" numeric,
  	"summary_issue_details" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"tours_id" integer,
  	"stories_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer,
  	"media_coverage_id" integer,
  	"dietary_options_id" integer,
  	"food_items_id" integer,
  	"vendors_id" integer,
  	"landing_pages_id" integer,
  	"pages_id" integer,
  	"about_page_id" integer,
  	"contact_page_id" integer,
  	"thank_you_pages_id" integer,
  	"home_page_id" integer,
  	"legal_pages_id" integer,
  	"menus_id" integer,
  	"travel_types_id" integer,
  	"specialty_experiences_id" integer,
  	"locations_id" integer,
  	"neighborhoods_id" integer,
  	"site_settings_id" integer,
  	"comparison_page_id" integer,
  	"how_it_works_page_id" integer,
  	"how_to_prepare_page_id" integer,
  	"corporate_groups_page_id" integer,
  	"track_record_page_id" integer,
  	"private_tours_page_id" integer,
  	"directions_page_id" integer,
  	"tour_quiz_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_gallery_images" ADD CONSTRAINT "tours_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours_gallery_images" ADD CONSTRAINT "tours_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_whats_included" ADD CONSTRAINT "tours_whats_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_whats_excluded" ADD CONSTRAINT "tours_whats_excluded_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_highlights" ADD CONSTRAINT "tours_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_start_times" ADD CONSTRAINT "tours_start_times_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_itinerary" ADD CONSTRAINT "tours_itinerary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_differentiators_tourist" ADD CONSTRAINT "tours_differentiators_tourist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_differentiators_us" ADD CONSTRAINT "tours_differentiators_us_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_what_to_bring" ADD CONSTRAINT "tours_what_to_bring_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_languages_offered" ADD CONSTRAINT "tours_languages_offered_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_segment_tags" ADD CONSTRAINT "tours_segment_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_gallery_image_alts" ADD CONSTRAINT "tours_gallery_image_alts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours" ADD CONSTRAINT "tours_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours_locales" ADD CONSTRAINT "tours_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours_locales" ADD CONSTRAINT "tours_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_dietary_options_fk" FOREIGN KEY ("dietary_options_id") REFERENCES "public"."dietary_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_landing_pages_fk" FOREIGN KEY ("landing_pages_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_travel_types_fk" FOREIGN KEY ("travel_types_id") REFERENCES "public"."travel_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_specialty_experiences_fk" FOREIGN KEY ("specialty_experiences_id") REFERENCES "public"."specialty_experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_food_items_fk" FOREIGN KEY ("food_items_id") REFERENCES "public"."food_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_version_gallery_images" ADD CONSTRAINT "_tours_v_version_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tours_v_version_gallery_images" ADD CONSTRAINT "_tours_v_version_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_version_whats_included" ADD CONSTRAINT "_tours_v_version_whats_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_version_whats_excluded" ADD CONSTRAINT "_tours_v_version_whats_excluded_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_version_highlights" ADD CONSTRAINT "_tours_v_version_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_version_start_times" ADD CONSTRAINT "_tours_v_version_start_times_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_version_itinerary" ADD CONSTRAINT "_tours_v_version_itinerary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_version_differentiators_tourist" ADD CONSTRAINT "_tours_v_version_differentiators_tourist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_version_differentiators_us" ADD CONSTRAINT "_tours_v_version_differentiators_us_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_version_what_to_bring" ADD CONSTRAINT "_tours_v_version_what_to_bring_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_version_languages_offered" ADD CONSTRAINT "_tours_v_version_languages_offered_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_version_segment_tags" ADD CONSTRAINT "_tours_v_version_segment_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_version_gallery_image_alts" ADD CONSTRAINT "_tours_v_version_gallery_image_alts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v" ADD CONSTRAINT "_tours_v_parent_id_tours_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tours_v" ADD CONSTRAINT "_tours_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tours_v_locales" ADD CONSTRAINT "_tours_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tours_v_locales" ADD CONSTRAINT "_tours_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_rels" ADD CONSTRAINT "_tours_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_rels" ADD CONSTRAINT "_tours_v_rels_dietary_options_fk" FOREIGN KEY ("dietary_options_id") REFERENCES "public"."dietary_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_rels" ADD CONSTRAINT "_tours_v_rels_landing_pages_fk" FOREIGN KEY ("landing_pages_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_rels" ADD CONSTRAINT "_tours_v_rels_travel_types_fk" FOREIGN KEY ("travel_types_id") REFERENCES "public"."travel_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_rels" ADD CONSTRAINT "_tours_v_rels_specialty_experiences_fk" FOREIGN KEY ("specialty_experiences_id") REFERENCES "public"."specialty_experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_rels" ADD CONSTRAINT "_tours_v_rels_food_items_fk" FOREIGN KEY ("food_items_id") REFERENCES "public"."food_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_locales" ADD CONSTRAINT "stories_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_locales" ADD CONSTRAINT "stories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_parent_id_stories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_locales" ADD CONSTRAINT "_stories_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_locales" ADD CONSTRAINT "_stories_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials_page_visibility" ADD CONSTRAINT "testimonials_page_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials_locales" ADD CONSTRAINT "testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials_rels" ADD CONSTRAINT "testimonials_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials_rels" ADD CONSTRAINT "testimonials_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v_version_page_visibility" ADD CONSTRAINT "_testimonials_v_version_page_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_testimonials_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_parent_id_testimonials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v_locales" ADD CONSTRAINT "_testimonials_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_testimonials_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v_rels" ADD CONSTRAINT "_testimonials_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_testimonials_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v_rels" ADD CONSTRAINT "_testimonials_v_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_page_visibility" ADD CONSTRAINT "faqs_page_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_related_tour_id_tours_id_fk" FOREIGN KEY ("related_tour_id") REFERENCES "public"."tours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_related_story_id_stories_id_fk" FOREIGN KEY ("related_story_id") REFERENCES "public"."stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_texts" ADD CONSTRAINT "faqs_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faqs_v_version_page_visibility" ADD CONSTRAINT "_faqs_v_version_page_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_faqs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faqs_v" ADD CONSTRAINT "_faqs_v_parent_id_faqs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faqs_v" ADD CONSTRAINT "_faqs_v_version_related_tour_id_tours_id_fk" FOREIGN KEY ("version_related_tour_id") REFERENCES "public"."tours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faqs_v" ADD CONSTRAINT "_faqs_v_version_related_story_id_stories_id_fk" FOREIGN KEY ("version_related_story_id") REFERENCES "public"."stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faqs_v_locales" ADD CONSTRAINT "_faqs_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faqs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faqs_v_texts" ADD CONSTRAINT "_faqs_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_faqs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_coverage_locales" ADD CONSTRAINT "media_coverage_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media_coverage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_coverage_v" ADD CONSTRAINT "_media_coverage_v_parent_id_media_coverage_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media_coverage"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_coverage_v_locales" ADD CONSTRAINT "_media_coverage_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_media_coverage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dietary_options_locales" ADD CONSTRAINT "dietary_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dietary_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_dietary_options_v" ADD CONSTRAINT "_dietary_options_v_parent_id_dietary_options_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."dietary_options"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_dietary_options_v_locales" ADD CONSTRAINT "_dietary_options_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_dietary_options_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "food_items_local_names" ADD CONSTRAINT "food_items_local_names_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."food_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "food_items_ingredients" ADD CONSTRAINT "food_items_ingredients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."food_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "food_items_allergens" ADD CONSTRAINT "food_items_allergens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."food_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "food_items_flavor_profile" ADD CONSTRAINT "food_items_flavor_profile_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."food_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "food_items" ADD CONSTRAINT "food_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "food_items_locales" ADD CONSTRAINT "food_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."food_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "food_items_rels" ADD CONSTRAINT "food_items_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."food_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "food_items_rels" ADD CONSTRAINT "food_items_rels_dietary_options_fk" FOREIGN KEY ("dietary_options_id") REFERENCES "public"."dietary_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "food_items_rels" ADD CONSTRAINT "food_items_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_food_items_v_version_local_names" ADD CONSTRAINT "_food_items_v_version_local_names_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_food_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_food_items_v_version_ingredients" ADD CONSTRAINT "_food_items_v_version_ingredients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_food_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_food_items_v_version_allergens" ADD CONSTRAINT "_food_items_v_version_allergens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_food_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_food_items_v_version_flavor_profile" ADD CONSTRAINT "_food_items_v_version_flavor_profile_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_food_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_food_items_v" ADD CONSTRAINT "_food_items_v_parent_id_food_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."food_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_food_items_v" ADD CONSTRAINT "_food_items_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_food_items_v_locales" ADD CONSTRAINT "_food_items_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_food_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_food_items_v_rels" ADD CONSTRAINT "_food_items_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_food_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_food_items_v_rels" ADD CONSTRAINT "_food_items_v_rels_dietary_options_fk" FOREIGN KEY ("dietary_options_id") REFERENCES "public"."dietary_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_food_items_v_rels" ADD CONSTRAINT "_food_items_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vendors_operating_hours" ADD CONSTRAINT "vendors_operating_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vendors_closed_on" ADD CONSTRAINT "vendors_closed_on_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vendors_payment_methods" ADD CONSTRAINT "vendors_payment_methods_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vendors_facilities" ADD CONSTRAINT "vendors_facilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vendors_images_gallery" ADD CONSTRAINT "vendors_images_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vendors_images_gallery" ADD CONSTRAINT "vendors_images_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vendors_awards" ADD CONSTRAINT "vendors_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vendors" ADD CONSTRAINT "vendors_images_main_id_media_id_fk" FOREIGN KEY ("images_main_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vendors_locales" ADD CONSTRAINT "vendors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vendors_rels" ADD CONSTRAINT "vendors_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vendors_rels" ADD CONSTRAINT "vendors_rels_food_items_fk" FOREIGN KEY ("food_items_id") REFERENCES "public"."food_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vendors_rels" ADD CONSTRAINT "vendors_rels_dietary_options_fk" FOREIGN KEY ("dietary_options_id") REFERENCES "public"."dietary_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_vendors_v_version_operating_hours" ADD CONSTRAINT "_vendors_v_version_operating_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_vendors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_vendors_v_version_closed_on" ADD CONSTRAINT "_vendors_v_version_closed_on_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_vendors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_vendors_v_version_payment_methods" ADD CONSTRAINT "_vendors_v_version_payment_methods_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_vendors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_vendors_v_version_facilities" ADD CONSTRAINT "_vendors_v_version_facilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_vendors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_vendors_v_version_images_gallery" ADD CONSTRAINT "_vendors_v_version_images_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vendors_v_version_images_gallery" ADD CONSTRAINT "_vendors_v_version_images_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_vendors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_vendors_v_version_awards" ADD CONSTRAINT "_vendors_v_version_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_vendors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_vendors_v" ADD CONSTRAINT "_vendors_v_parent_id_vendors_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."vendors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vendors_v" ADD CONSTRAINT "_vendors_v_version_images_main_id_media_id_fk" FOREIGN KEY ("version_images_main_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vendors_v_locales" ADD CONSTRAINT "_vendors_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_vendors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_vendors_v_rels" ADD CONSTRAINT "_vendors_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_vendors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_vendors_v_rels" ADD CONSTRAINT "_vendors_v_rels_food_items_fk" FOREIGN KEY ("food_items_id") REFERENCES "public"."food_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_vendors_v_rels" ADD CONSTRAINT "_vendors_v_rels_dietary_options_fk" FOREIGN KEY ("dietary_options_id") REFERENCES "public"."dietary_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_challenges" ADD CONSTRAINT "landing_pages_challenges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_highlights" ADD CONSTRAINT "landing_pages_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_tips" ADD CONSTRAINT "landing_pages_tips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_safe_dishes" ADD CONSTRAINT "landing_pages_safe_dishes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_avoid_dishes" ADD CONSTRAINT "landing_pages_avoid_dishes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_suitable_tours" ADD CONSTRAINT "landing_pages_suitable_tours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_travel_tips" ADD CONSTRAINT "landing_pages_travel_tips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages" ADD CONSTRAINT "landing_pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_pages_locales" ADD CONSTRAINT "landing_pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_pages_locales" ADD CONSTRAINT "landing_pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_version_challenges" ADD CONSTRAINT "_landing_pages_v_version_challenges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_version_highlights" ADD CONSTRAINT "_landing_pages_v_version_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_version_tips" ADD CONSTRAINT "_landing_pages_v_version_tips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_version_safe_dishes" ADD CONSTRAINT "_landing_pages_v_version_safe_dishes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_version_avoid_dishes" ADD CONSTRAINT "_landing_pages_v_version_avoid_dishes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_version_suitable_tours" ADD CONSTRAINT "_landing_pages_v_version_suitable_tours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_version_travel_tips" ADD CONSTRAINT "_landing_pages_v_version_travel_tips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v" ADD CONSTRAINT "_landing_pages_v_parent_id_landing_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_pages_v" ADD CONSTRAINT "_landing_pages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_locales" ADD CONSTRAINT "_landing_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_locales" ADD CONSTRAINT "_landing_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_highlights" ADD CONSTRAINT "pages_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_highlights" ADD CONSTRAINT "_pages_v_version_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_hero_block" ADD CONSTRAINT "about_page_blocks_hero_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_founder_story_block" ADD CONSTRAINT "about_page_blocks_founder_story_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_stats_block_stats" ADD CONSTRAINT "about_page_blocks_stats_block_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_blocks_stats_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_stats_block" ADD CONSTRAINT "about_page_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_timeline_block_events" ADD CONSTRAINT "about_page_blocks_timeline_block_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_blocks_timeline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_timeline_block" ADD CONSTRAINT "about_page_blocks_timeline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_philosophy_block_items" ADD CONSTRAINT "about_page_blocks_philosophy_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_blocks_philosophy_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_philosophy_block" ADD CONSTRAINT "about_page_blocks_philosophy_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_team_block_members" ADD CONSTRAINT "about_page_blocks_team_block_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_blocks_team_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_team_block" ADD CONSTRAINT "about_page_blocks_team_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_breadcrumbs" ADD CONSTRAINT "about_page_breadcrumbs_doc_id_about_page_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."about_page"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_breadcrumbs" ADD CONSTRAINT "about_page_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_parent_id_about_page_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."about_page"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_breadcrumbs" ADD CONSTRAINT "contact_page_breadcrumbs_doc_id_contact_page_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."contact_page"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page_breadcrumbs" ADD CONSTRAINT "contact_page_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_parent_id_contact_page_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contact_page"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page_locales" ADD CONSTRAINT "contact_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_page_v_version_breadcrumbs" ADD CONSTRAINT "_contact_page_v_version_breadcrumbs_doc_id_contact_page_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."contact_page"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contact_page_v_version_breadcrumbs" ADD CONSTRAINT "_contact_page_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_page_v" ADD CONSTRAINT "_contact_page_v_parent_id_contact_page_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contact_page"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contact_page_v" ADD CONSTRAINT "_contact_page_v_version_parent_id_contact_page_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contact_page_v_locales" ADD CONSTRAINT "_contact_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "thank_you_pages_next_steps" ADD CONSTRAINT "thank_you_pages_next_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."thank_you_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "thank_you_pages_cta_section_cta_buttons" ADD CONSTRAINT "thank_you_pages_cta_section_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."thank_you_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "thank_you_pages_locales" ADD CONSTRAINT "thank_you_pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."thank_you_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_thank_you_pages_v_version_next_steps" ADD CONSTRAINT "_thank_you_pages_v_version_next_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_thank_you_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_thank_you_pages_v_version_cta_section_cta_buttons" ADD CONSTRAINT "_thank_you_pages_v_version_cta_section_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_thank_you_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_thank_you_pages_v" ADD CONSTRAINT "_thank_you_pages_v_parent_id_thank_you_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."thank_you_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_thank_you_pages_v_locales" ADD CONSTRAINT "_thank_you_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_thank_you_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_hero_block_badges" ADD CONSTRAINT "home_page_blocks_hero_block_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_hero_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_hero_block" ADD CONSTRAINT "home_page_blocks_hero_block_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_blocks_hero_block" ADD CONSTRAINT "home_page_blocks_hero_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_manifesto_block" ADD CONSTRAINT "home_page_blocks_manifesto_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_pillars_block_pillars" ADD CONSTRAINT "home_page_blocks_pillars_block_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_pillars_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_pillars_block" ADD CONSTRAINT "home_page_blocks_pillars_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_vendors_block_links" ADD CONSTRAINT "home_page_blocks_vendors_block_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_vendors_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_vendors_block" ADD CONSTRAINT "home_page_blocks_vendors_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_segments_block" ADD CONSTRAINT "home_page_blocks_segments_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_about_block" ADD CONSTRAINT "home_page_blocks_about_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_blocks_about_block" ADD CONSTRAINT "home_page_blocks_about_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_stats_block_stats" ADD CONSTRAINT "home_page_blocks_stats_block_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_stats_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_stats_block" ADD CONSTRAINT "home_page_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_cta_block_features" ADD CONSTRAINT "home_page_blocks_cta_block_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_cta_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_cta_block_buttons" ADD CONSTRAINT "home_page_blocks_cta_block_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_cta_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_cta_block" ADD CONSTRAINT "home_page_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_why_us_block_reasons" ADD CONSTRAINT "home_page_blocks_why_us_block_reasons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_why_us_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_why_us_block" ADD CONSTRAINT "home_page_blocks_why_us_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_guarantees_block_guarantees" ADD CONSTRAINT "home_page_blocks_guarantees_block_guarantees_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_guarantees_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_guarantees_block" ADD CONSTRAINT "home_page_blocks_guarantees_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "plat" ADD CONSTRAINT "plat_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_social_proof_badges_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_social_proof_badges_block" ADD CONSTRAINT "home_page_blocks_social_proof_badges_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_locales" ADD CONSTRAINT "home_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_hero_block_badges" ADD CONSTRAINT "_home_page_v_blocks_hero_block_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_hero_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_hero_block" ADD CONSTRAINT "_home_page_v_blocks_hero_block_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_hero_block" ADD CONSTRAINT "_home_page_v_blocks_hero_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_manifesto_block" ADD CONSTRAINT "_home_page_v_blocks_manifesto_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_pillars_block_pillars" ADD CONSTRAINT "_home_page_v_blocks_pillars_block_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_pillars_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_pillars_block" ADD CONSTRAINT "_home_page_v_blocks_pillars_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_vendors_block_links" ADD CONSTRAINT "_home_page_v_blocks_vendors_block_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_vendors_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_vendors_block" ADD CONSTRAINT "_home_page_v_blocks_vendors_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_segments_block" ADD CONSTRAINT "_home_page_v_blocks_segments_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_about_block" ADD CONSTRAINT "_home_page_v_blocks_about_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_about_block" ADD CONSTRAINT "_home_page_v_blocks_about_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_stats_block_stats" ADD CONSTRAINT "_home_page_v_blocks_stats_block_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_stats_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_stats_block" ADD CONSTRAINT "_home_page_v_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_cta_block_features" ADD CONSTRAINT "_home_page_v_blocks_cta_block_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_cta_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_cta_block_buttons" ADD CONSTRAINT "_home_page_v_blocks_cta_block_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_cta_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_cta_block" ADD CONSTRAINT "_home_page_v_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_why_us_block_reasons" ADD CONSTRAINT "_home_page_v_blocks_why_us_block_reasons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_why_us_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_why_us_block" ADD CONSTRAINT "_home_page_v_blocks_why_us_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_guarantees_block_guarantees" ADD CONSTRAINT "_home_page_v_blocks_guarantees_block_guarantees_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_guarantees_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_guarantees_block" ADD CONSTRAINT "_home_page_v_blocks_guarantees_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_plat_v" ADD CONSTRAINT "_plat_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_social_proof_badges_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_social_proof_badges_block" ADD CONSTRAINT "_home_page_v_blocks_social_proof_badges_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_parent_id_home_page_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_locales" ADD CONSTRAINT "_home_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_pages_locales" ADD CONSTRAINT "legal_pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_pages_v" ADD CONSTRAINT "_legal_pages_v_parent_id_legal_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."legal_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_legal_pages_v_locales" ADD CONSTRAINT "_legal_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menus_items" ADD CONSTRAINT "menus_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menus_locales" ADD CONSTRAINT "menus_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "travel_types_locales" ADD CONSTRAINT "travel_types_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."travel_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_travel_types_v" ADD CONSTRAINT "_travel_types_v_parent_id_travel_types_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."travel_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_travel_types_v_locales" ADD CONSTRAINT "_travel_types_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_travel_types_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "specialty_experiences_locales" ADD CONSTRAINT "specialty_experiences_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."specialty_experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_specialty_experiences_v" ADD CONSTRAINT "_specialty_experiences_v_parent_id_specialty_experiences_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."specialty_experiences"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_specialty_experiences_v_locales" ADD CONSTRAINT "_specialty_experiences_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_specialty_experiences_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_locales" ADD CONSTRAINT "locations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_locations_v" ADD CONSTRAINT "_locations_v_parent_id_locations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_locations_v_locales" ADD CONSTRAINT "_locations_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_locations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "neighborhoods_highlights" ADD CONSTRAINT "neighborhoods_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."neighborhoods"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "neighborhoods_food_specialties" ADD CONSTRAINT "neighborhoods_food_specialties_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."neighborhoods"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "neighborhoods" ADD CONSTRAINT "neighborhoods_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "neighborhoods_locales" ADD CONSTRAINT "neighborhoods_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."neighborhoods"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "neighborhoods_rels" ADD CONSTRAINT "neighborhoods_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."neighborhoods"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "neighborhoods_rels" ADD CONSTRAINT "neighborhoods_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_neighborhoods_v_version_highlights" ADD CONSTRAINT "_neighborhoods_v_version_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_neighborhoods_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_neighborhoods_v_version_food_specialties" ADD CONSTRAINT "_neighborhoods_v_version_food_specialties_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_neighborhoods_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_neighborhoods_v" ADD CONSTRAINT "_neighborhoods_v_parent_id_neighborhoods_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."neighborhoods"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_neighborhoods_v" ADD CONSTRAINT "_neighborhoods_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_neighborhoods_v_locales" ADD CONSTRAINT "_neighborhoods_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_neighborhoods_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_neighborhoods_v_rels" ADD CONSTRAINT "_neighborhoods_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_neighborhoods_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_neighborhoods_v_rels" ADD CONSTRAINT "_neighborhoods_v_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_proof_platforms" ADD CONSTRAINT "site_settings_social_proof_platforms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_social_proof_platforms" ADD CONSTRAINT "_site_settings_v_version_social_proof_platforms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_parent_id_site_settings_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_locales" ADD CONSTRAINT "_site_settings_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "comparison_page_competitors" ADD CONSTRAINT "comparison_page_competitors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."comparison_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "comparison_page_comparison_rows_competitor_values" ADD CONSTRAINT "comparison_page_comparison_rows_competitor_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."comparison_page_comparison_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "comparison_page_comparison_rows" ADD CONSTRAINT "comparison_page_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."comparison_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "comparison_page_trust_badges" ADD CONSTRAINT "comparison_page_trust_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."comparison_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "comparison_page_locales" ADD CONSTRAINT "comparison_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."comparison_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_comparison_page_v_version_competitors" ADD CONSTRAINT "_comparison_page_v_version_competitors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_comparison_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_comparison_page_v_version_comparison_rows_competitor_values" ADD CONSTRAINT "_comparison_page_v_version_comparison_rows_competitor_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_comparison_page_v_version_comparison_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_comparison_page_v_version_comparison_rows" ADD CONSTRAINT "_comparison_page_v_version_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_comparison_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_comparison_page_v_version_trust_badges" ADD CONSTRAINT "_comparison_page_v_version_trust_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_comparison_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_comparison_page_v" ADD CONSTRAINT "_comparison_page_v_parent_id_comparison_page_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comparison_page"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_comparison_page_v_locales" ADD CONSTRAINT "_comparison_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_comparison_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "how_it_works_page_steps" ADD CONSTRAINT "how_it_works_page_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."how_it_works_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "how_it_works_page_inclusions" ADD CONSTRAINT "how_it_works_page_inclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."how_it_works_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "how_it_works_page_formats" ADD CONSTRAINT "how_it_works_page_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."how_it_works_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "how_it_works_page_locales" ADD CONSTRAINT "how_it_works_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."how_it_works_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_how_it_works_page_v_version_steps" ADD CONSTRAINT "_how_it_works_page_v_version_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_how_it_works_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_how_it_works_page_v_version_inclusions" ADD CONSTRAINT "_how_it_works_page_v_version_inclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_how_it_works_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_how_it_works_page_v_version_formats" ADD CONSTRAINT "_how_it_works_page_v_version_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_how_it_works_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_how_it_works_page_v" ADD CONSTRAINT "_how_it_works_page_v_parent_id_how_it_works_page_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."how_it_works_page"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_how_it_works_page_v_locales" ADD CONSTRAINT "_how_it_works_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_how_it_works_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "how_to_prepare_page_what_to_wear" ADD CONSTRAINT "how_to_prepare_page_what_to_wear_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."how_to_prepare_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "how_to_prepare_page_what_to_bring" ADD CONSTRAINT "how_to_prepare_page_what_to_bring_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."how_to_prepare_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "how_to_prepare_page_what_to_expect" ADD CONSTRAINT "how_to_prepare_page_what_to_expect_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."how_to_prepare_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "how_to_prepare_page_dietary_notes" ADD CONSTRAINT "how_to_prepare_page_dietary_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."how_to_prepare_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "how_to_prepare_page" ADD CONSTRAINT "how_to_prepare_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "how_to_prepare_page_locales" ADD CONSTRAINT "how_to_prepare_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."how_to_prepare_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_how_to_prepare_page_v_version_what_to_wear" ADD CONSTRAINT "_how_to_prepare_page_v_version_what_to_wear_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_how_to_prepare_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_how_to_prepare_page_v_version_what_to_bring" ADD CONSTRAINT "_how_to_prepare_page_v_version_what_to_bring_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_how_to_prepare_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_how_to_prepare_page_v_version_what_to_expect" ADD CONSTRAINT "_how_to_prepare_page_v_version_what_to_expect_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_how_to_prepare_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_how_to_prepare_page_v_version_dietary_notes" ADD CONSTRAINT "_how_to_prepare_page_v_version_dietary_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_how_to_prepare_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_how_to_prepare_page_v" ADD CONSTRAINT "_how_to_prepare_page_v_parent_id_how_to_prepare_page_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."how_to_prepare_page"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_how_to_prepare_page_v" ADD CONSTRAINT "_how_to_prepare_page_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_how_to_prepare_page_v_locales" ADD CONSTRAINT "_how_to_prepare_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_how_to_prepare_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "corporate_groups_page_offer_perfect_for" ADD CONSTRAINT "corporate_groups_page_offer_perfect_for_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."corporate_groups_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "corporate_groups_page_benefit_cards" ADD CONSTRAINT "corporate_groups_page_benefit_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."corporate_groups_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "corporate_groups_page_how_steps" ADD CONSTRAINT "corporate_groups_page_how_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."corporate_groups_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "corporate_groups_page_locales" ADD CONSTRAINT "corporate_groups_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."corporate_groups_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_corporate_groups_page_v_version_offer_perfect_for" ADD CONSTRAINT "_corporate_groups_page_v_version_offer_perfect_for_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_corporate_groups_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_corporate_groups_page_v_version_benefit_cards" ADD CONSTRAINT "_corporate_groups_page_v_version_benefit_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_corporate_groups_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_corporate_groups_page_v_version_how_steps" ADD CONSTRAINT "_corporate_groups_page_v_version_how_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_corporate_groups_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_corporate_groups_page_v" ADD CONSTRAINT "_corporate_groups_page_v_parent_id_corporate_groups_page_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."corporate_groups_page"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_corporate_groups_page_v_locales" ADD CONSTRAINT "_corporate_groups_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_corporate_groups_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "track_record_page_stats" ADD CONSTRAINT "track_record_page_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."track_record_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "track_record_page_segments" ADD CONSTRAINT "track_record_page_segments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."track_record_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "track_record_page_case_studies" ADD CONSTRAINT "track_record_page_case_studies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."track_record_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "track_record_page_press" ADD CONSTRAINT "track_record_page_press_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."track_record_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "track_record_page_awards" ADD CONSTRAINT "track_record_page_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."track_record_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "track_record_page_locales" ADD CONSTRAINT "track_record_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."track_record_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_track_record_page_v_version_stats" ADD CONSTRAINT "_track_record_page_v_version_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_track_record_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_track_record_page_v_version_segments" ADD CONSTRAINT "_track_record_page_v_version_segments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_track_record_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_track_record_page_v_version_case_studies" ADD CONSTRAINT "_track_record_page_v_version_case_studies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_track_record_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_track_record_page_v_version_press" ADD CONSTRAINT "_track_record_page_v_version_press_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_track_record_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_track_record_page_v_version_awards" ADD CONSTRAINT "_track_record_page_v_version_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_track_record_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_track_record_page_v" ADD CONSTRAINT "_track_record_page_v_parent_id_track_record_page_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."track_record_page"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_track_record_page_v_locales" ADD CONSTRAINT "_track_record_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_track_record_page_v"("id") ON DELETE cascade ON UPDATE no action;
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
  ALTER TABLE "directions_page_meeting_points" ADD CONSTRAINT "directions_page_meeting_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."directions_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "directions_page_general_tips" ADD CONSTRAINT "directions_page_general_tips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."directions_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "directions_page" ADD CONSTRAINT "directions_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "directions_page_locales" ADD CONSTRAINT "directions_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."directions_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_directions_page_v_version_meeting_points" ADD CONSTRAINT "_directions_page_v_version_meeting_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_directions_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_directions_page_v_version_general_tips" ADD CONSTRAINT "_directions_page_v_version_general_tips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_directions_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_directions_page_v" ADD CONSTRAINT "_directions_page_v_parent_id_directions_page_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."directions_page"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_directions_page_v" ADD CONSTRAINT "_directions_page_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_directions_page_v_locales" ADD CONSTRAINT "_directions_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_directions_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_quiz_steps_options" ADD CONSTRAINT "tour_quiz_steps_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tour_quiz_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_quiz_steps" ADD CONSTRAINT "tour_quiz_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tour_quiz"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_quiz_personalities" ADD CONSTRAINT "tour_quiz_personalities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tour_quiz"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_quiz_scoring_weights" ADD CONSTRAINT "tour_quiz_scoring_weights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tour_quiz"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_quiz_result_headlines" ADD CONSTRAINT "tour_quiz_result_headlines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tour_quiz"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_quiz_locales" ADD CONSTRAINT "tour_quiz_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tour_quiz"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_quiz_rels" ADD CONSTRAINT "tour_quiz_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tour_quiz"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_quiz_rels" ADD CONSTRAINT "tour_quiz_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_quiz_v_version_steps_options" ADD CONSTRAINT "_tour_quiz_v_version_steps_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tour_quiz_v_version_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_quiz_v_version_steps" ADD CONSTRAINT "_tour_quiz_v_version_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tour_quiz_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_quiz_v_version_personalities" ADD CONSTRAINT "_tour_quiz_v_version_personalities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tour_quiz_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_quiz_v_version_scoring_weights" ADD CONSTRAINT "_tour_quiz_v_version_scoring_weights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tour_quiz_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_quiz_v_version_result_headlines" ADD CONSTRAINT "_tour_quiz_v_version_result_headlines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tour_quiz_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_quiz_v" ADD CONSTRAINT "_tour_quiz_v_parent_id_tour_quiz_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tour_quiz"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tour_quiz_v_locales" ADD CONSTRAINT "_tour_quiz_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tour_quiz_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_quiz_v_rels" ADD CONSTRAINT "_tour_quiz_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tour_quiz_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_quiz_v_rels" ADD CONSTRAINT "_tour_quiz_v_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exports_texts" ADD CONSTRAINT "exports_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_coverage_fk" FOREIGN KEY ("media_coverage_id") REFERENCES "public"."media_coverage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dietary_options_fk" FOREIGN KEY ("dietary_options_id") REFERENCES "public"."dietary_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_food_items_fk" FOREIGN KEY ("food_items_id") REFERENCES "public"."food_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vendors_fk" FOREIGN KEY ("vendors_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_landing_pages_fk" FOREIGN KEY ("landing_pages_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_about_page_fk" FOREIGN KEY ("about_page_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_page_fk" FOREIGN KEY ("contact_page_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_thank_you_pages_fk" FOREIGN KEY ("thank_you_pages_id") REFERENCES "public"."thank_you_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_home_page_fk" FOREIGN KEY ("home_page_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_legal_pages_fk" FOREIGN KEY ("legal_pages_id") REFERENCES "public"."legal_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menus_fk" FOREIGN KEY ("menus_id") REFERENCES "public"."menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_travel_types_fk" FOREIGN KEY ("travel_types_id") REFERENCES "public"."travel_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_specialty_experiences_fk" FOREIGN KEY ("specialty_experiences_id") REFERENCES "public"."specialty_experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_neighborhoods_fk" FOREIGN KEY ("neighborhoods_id") REFERENCES "public"."neighborhoods"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_settings_fk" FOREIGN KEY ("site_settings_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_comparison_page_fk" FOREIGN KEY ("comparison_page_id") REFERENCES "public"."comparison_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_how_it_works_page_fk" FOREIGN KEY ("how_it_works_page_id") REFERENCES "public"."how_it_works_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_how_to_prepare_page_fk" FOREIGN KEY ("how_to_prepare_page_id") REFERENCES "public"."how_to_prepare_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_corporate_groups_page_fk" FOREIGN KEY ("corporate_groups_page_id") REFERENCES "public"."corporate_groups_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_track_record_page_fk" FOREIGN KEY ("track_record_page_id") REFERENCES "public"."track_record_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_private_tours_page_fk" FOREIGN KEY ("private_tours_page_id") REFERENCES "public"."private_tours_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_directions_page_fk" FOREIGN KEY ("directions_page_id") REFERENCES "public"."directions_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tour_quiz_fk" FOREIGN KEY ("tour_quiz_id") REFERENCES "public"."tour_quiz"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tours_gallery_images_order_idx" ON "tours_gallery_images" USING btree ("_order");
  CREATE INDEX "tours_gallery_images_parent_id_idx" ON "tours_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "tours_gallery_images_image_idx" ON "tours_gallery_images" USING btree ("image_id");
  CREATE INDEX "tours_whats_included_order_idx" ON "tours_whats_included" USING btree ("_order");
  CREATE INDEX "tours_whats_included_parent_id_idx" ON "tours_whats_included" USING btree ("_parent_id");
  CREATE INDEX "tours_whats_included_locale_idx" ON "tours_whats_included" USING btree ("_locale");
  CREATE INDEX "tours_whats_excluded_order_idx" ON "tours_whats_excluded" USING btree ("_order");
  CREATE INDEX "tours_whats_excluded_parent_id_idx" ON "tours_whats_excluded" USING btree ("_parent_id");
  CREATE INDEX "tours_whats_excluded_locale_idx" ON "tours_whats_excluded" USING btree ("_locale");
  CREATE INDEX "tours_highlights_order_idx" ON "tours_highlights" USING btree ("_order");
  CREATE INDEX "tours_highlights_parent_id_idx" ON "tours_highlights" USING btree ("_parent_id");
  CREATE INDEX "tours_highlights_locale_idx" ON "tours_highlights" USING btree ("_locale");
  CREATE INDEX "tours_start_times_order_idx" ON "tours_start_times" USING btree ("_order");
  CREATE INDEX "tours_start_times_parent_id_idx" ON "tours_start_times" USING btree ("_parent_id");
  CREATE INDEX "tours_itinerary_order_idx" ON "tours_itinerary" USING btree ("_order");
  CREATE INDEX "tours_itinerary_parent_id_idx" ON "tours_itinerary" USING btree ("_parent_id");
  CREATE INDEX "tours_itinerary_locale_idx" ON "tours_itinerary" USING btree ("_locale");
  CREATE INDEX "tours_differentiators_tourist_order_idx" ON "tours_differentiators_tourist" USING btree ("_order");
  CREATE INDEX "tours_differentiators_tourist_parent_id_idx" ON "tours_differentiators_tourist" USING btree ("_parent_id");
  CREATE INDEX "tours_differentiators_tourist_locale_idx" ON "tours_differentiators_tourist" USING btree ("_locale");
  CREATE INDEX "tours_differentiators_us_order_idx" ON "tours_differentiators_us" USING btree ("_order");
  CREATE INDEX "tours_differentiators_us_parent_id_idx" ON "tours_differentiators_us" USING btree ("_parent_id");
  CREATE INDEX "tours_differentiators_us_locale_idx" ON "tours_differentiators_us" USING btree ("_locale");
  CREATE INDEX "tours_what_to_bring_order_idx" ON "tours_what_to_bring" USING btree ("_order");
  CREATE INDEX "tours_what_to_bring_parent_id_idx" ON "tours_what_to_bring" USING btree ("_parent_id");
  CREATE INDEX "tours_what_to_bring_locale_idx" ON "tours_what_to_bring" USING btree ("_locale");
  CREATE INDEX "tours_languages_offered_order_idx" ON "tours_languages_offered" USING btree ("_order");
  CREATE INDEX "tours_languages_offered_parent_id_idx" ON "tours_languages_offered" USING btree ("_parent_id");
  CREATE INDEX "tours_segment_tags_order_idx" ON "tours_segment_tags" USING btree ("_order");
  CREATE INDEX "tours_segment_tags_parent_id_idx" ON "tours_segment_tags" USING btree ("_parent_id");
  CREATE INDEX "tours_gallery_image_alts_order_idx" ON "tours_gallery_image_alts" USING btree ("_order");
  CREATE INDEX "tours_gallery_image_alts_parent_id_idx" ON "tours_gallery_image_alts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tours_slug_idx" ON "tours" USING btree ("slug");
  CREATE INDEX "tours_hero_image_idx" ON "tours" USING btree ("hero_image_id");
  CREATE INDEX "tours_updated_at_idx" ON "tours" USING btree ("updated_at");
  CREATE INDEX "tours_created_at_idx" ON "tours" USING btree ("created_at");
  CREATE INDEX "tours__status_idx" ON "tours" USING btree ("_status");
  CREATE INDEX "tours_meta_meta_image_idx" ON "tours_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "tours_locales_locale_parent_id_unique" ON "tours_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tours_rels_order_idx" ON "tours_rels" USING btree ("order");
  CREATE INDEX "tours_rels_parent_idx" ON "tours_rels" USING btree ("parent_id");
  CREATE INDEX "tours_rels_path_idx" ON "tours_rels" USING btree ("path");
  CREATE INDEX "tours_rels_dietary_options_id_idx" ON "tours_rels" USING btree ("dietary_options_id");
  CREATE INDEX "tours_rels_landing_pages_id_idx" ON "tours_rels" USING btree ("landing_pages_id");
  CREATE INDEX "tours_rels_travel_types_id_idx" ON "tours_rels" USING btree ("travel_types_id");
  CREATE INDEX "tours_rels_specialty_experiences_id_idx" ON "tours_rels" USING btree ("specialty_experiences_id");
  CREATE INDEX "tours_rels_food_items_id_idx" ON "tours_rels" USING btree ("food_items_id");
  CREATE INDEX "_tours_v_version_gallery_images_order_idx" ON "_tours_v_version_gallery_images" USING btree ("_order");
  CREATE INDEX "_tours_v_version_gallery_images_parent_id_idx" ON "_tours_v_version_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_tours_v_version_gallery_images_image_idx" ON "_tours_v_version_gallery_images" USING btree ("image_id");
  CREATE INDEX "_tours_v_version_whats_included_order_idx" ON "_tours_v_version_whats_included" USING btree ("_order");
  CREATE INDEX "_tours_v_version_whats_included_parent_id_idx" ON "_tours_v_version_whats_included" USING btree ("_parent_id");
  CREATE INDEX "_tours_v_version_whats_included_locale_idx" ON "_tours_v_version_whats_included" USING btree ("_locale");
  CREATE INDEX "_tours_v_version_whats_excluded_order_idx" ON "_tours_v_version_whats_excluded" USING btree ("_order");
  CREATE INDEX "_tours_v_version_whats_excluded_parent_id_idx" ON "_tours_v_version_whats_excluded" USING btree ("_parent_id");
  CREATE INDEX "_tours_v_version_whats_excluded_locale_idx" ON "_tours_v_version_whats_excluded" USING btree ("_locale");
  CREATE INDEX "_tours_v_version_highlights_order_idx" ON "_tours_v_version_highlights" USING btree ("_order");
  CREATE INDEX "_tours_v_version_highlights_parent_id_idx" ON "_tours_v_version_highlights" USING btree ("_parent_id");
  CREATE INDEX "_tours_v_version_highlights_locale_idx" ON "_tours_v_version_highlights" USING btree ("_locale");
  CREATE INDEX "_tours_v_version_start_times_order_idx" ON "_tours_v_version_start_times" USING btree ("_order");
  CREATE INDEX "_tours_v_version_start_times_parent_id_idx" ON "_tours_v_version_start_times" USING btree ("_parent_id");
  CREATE INDEX "_tours_v_version_itinerary_order_idx" ON "_tours_v_version_itinerary" USING btree ("_order");
  CREATE INDEX "_tours_v_version_itinerary_parent_id_idx" ON "_tours_v_version_itinerary" USING btree ("_parent_id");
  CREATE INDEX "_tours_v_version_itinerary_locale_idx" ON "_tours_v_version_itinerary" USING btree ("_locale");
  CREATE INDEX "_tours_v_version_differentiators_tourist_order_idx" ON "_tours_v_version_differentiators_tourist" USING btree ("_order");
  CREATE INDEX "_tours_v_version_differentiators_tourist_parent_id_idx" ON "_tours_v_version_differentiators_tourist" USING btree ("_parent_id");
  CREATE INDEX "_tours_v_version_differentiators_tourist_locale_idx" ON "_tours_v_version_differentiators_tourist" USING btree ("_locale");
  CREATE INDEX "_tours_v_version_differentiators_us_order_idx" ON "_tours_v_version_differentiators_us" USING btree ("_order");
  CREATE INDEX "_tours_v_version_differentiators_us_parent_id_idx" ON "_tours_v_version_differentiators_us" USING btree ("_parent_id");
  CREATE INDEX "_tours_v_version_differentiators_us_locale_idx" ON "_tours_v_version_differentiators_us" USING btree ("_locale");
  CREATE INDEX "_tours_v_version_what_to_bring_order_idx" ON "_tours_v_version_what_to_bring" USING btree ("_order");
  CREATE INDEX "_tours_v_version_what_to_bring_parent_id_idx" ON "_tours_v_version_what_to_bring" USING btree ("_parent_id");
  CREATE INDEX "_tours_v_version_what_to_bring_locale_idx" ON "_tours_v_version_what_to_bring" USING btree ("_locale");
  CREATE INDEX "_tours_v_version_languages_offered_order_idx" ON "_tours_v_version_languages_offered" USING btree ("_order");
  CREATE INDEX "_tours_v_version_languages_offered_parent_id_idx" ON "_tours_v_version_languages_offered" USING btree ("_parent_id");
  CREATE INDEX "_tours_v_version_segment_tags_order_idx" ON "_tours_v_version_segment_tags" USING btree ("_order");
  CREATE INDEX "_tours_v_version_segment_tags_parent_id_idx" ON "_tours_v_version_segment_tags" USING btree ("_parent_id");
  CREATE INDEX "_tours_v_version_gallery_image_alts_order_idx" ON "_tours_v_version_gallery_image_alts" USING btree ("_order");
  CREATE INDEX "_tours_v_version_gallery_image_alts_parent_id_idx" ON "_tours_v_version_gallery_image_alts" USING btree ("_parent_id");
  CREATE INDEX "_tours_v_parent_idx" ON "_tours_v" USING btree ("parent_id");
  CREATE INDEX "_tours_v_version_version_slug_idx" ON "_tours_v" USING btree ("version_slug");
  CREATE INDEX "_tours_v_version_version_hero_image_idx" ON "_tours_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_tours_v_version_version_updated_at_idx" ON "_tours_v" USING btree ("version_updated_at");
  CREATE INDEX "_tours_v_version_version_created_at_idx" ON "_tours_v" USING btree ("version_created_at");
  CREATE INDEX "_tours_v_version_version__status_idx" ON "_tours_v" USING btree ("version__status");
  CREATE INDEX "_tours_v_created_at_idx" ON "_tours_v" USING btree ("created_at");
  CREATE INDEX "_tours_v_updated_at_idx" ON "_tours_v" USING btree ("updated_at");
  CREATE INDEX "_tours_v_snapshot_idx" ON "_tours_v" USING btree ("snapshot");
  CREATE INDEX "_tours_v_published_locale_idx" ON "_tours_v" USING btree ("published_locale");
  CREATE INDEX "_tours_v_latest_idx" ON "_tours_v" USING btree ("latest");
  CREATE INDEX "_tours_v_autosave_idx" ON "_tours_v" USING btree ("autosave");
  CREATE INDEX "_tours_v_version_meta_version_meta_image_idx" ON "_tours_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_tours_v_locales_locale_parent_id_unique" ON "_tours_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_tours_v_rels_order_idx" ON "_tours_v_rels" USING btree ("order");
  CREATE INDEX "_tours_v_rels_parent_idx" ON "_tours_v_rels" USING btree ("parent_id");
  CREATE INDEX "_tours_v_rels_path_idx" ON "_tours_v_rels" USING btree ("path");
  CREATE INDEX "_tours_v_rels_dietary_options_id_idx" ON "_tours_v_rels" USING btree ("dietary_options_id");
  CREATE INDEX "_tours_v_rels_landing_pages_id_idx" ON "_tours_v_rels" USING btree ("landing_pages_id");
  CREATE INDEX "_tours_v_rels_travel_types_id_idx" ON "_tours_v_rels" USING btree ("travel_types_id");
  CREATE INDEX "_tours_v_rels_specialty_experiences_id_idx" ON "_tours_v_rels" USING btree ("specialty_experiences_id");
  CREATE INDEX "_tours_v_rels_food_items_id_idx" ON "_tours_v_rels" USING btree ("food_items_id");
  CREATE UNIQUE INDEX "stories_slug_idx" ON "stories" USING btree ("slug");
  CREATE INDEX "stories_author_idx" ON "stories" USING btree ("author_id");
  CREATE INDEX "stories_featured_image_idx" ON "stories" USING btree ("featured_image_id");
  CREATE INDEX "stories_updated_at_idx" ON "stories" USING btree ("updated_at");
  CREATE INDEX "stories_created_at_idx" ON "stories" USING btree ("created_at");
  CREATE INDEX "stories__status_idx" ON "stories" USING btree ("_status");
  CREATE INDEX "stories_meta_meta_image_idx" ON "stories_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "stories_locales_locale_parent_id_unique" ON "stories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_stories_v_parent_idx" ON "_stories_v" USING btree ("parent_id");
  CREATE INDEX "_stories_v_version_version_slug_idx" ON "_stories_v" USING btree ("version_slug");
  CREATE INDEX "_stories_v_version_version_author_idx" ON "_stories_v" USING btree ("version_author_id");
  CREATE INDEX "_stories_v_version_version_featured_image_idx" ON "_stories_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_stories_v_version_version_updated_at_idx" ON "_stories_v" USING btree ("version_updated_at");
  CREATE INDEX "_stories_v_version_version_created_at_idx" ON "_stories_v" USING btree ("version_created_at");
  CREATE INDEX "_stories_v_version_version__status_idx" ON "_stories_v" USING btree ("version__status");
  CREATE INDEX "_stories_v_created_at_idx" ON "_stories_v" USING btree ("created_at");
  CREATE INDEX "_stories_v_updated_at_idx" ON "_stories_v" USING btree ("updated_at");
  CREATE INDEX "_stories_v_snapshot_idx" ON "_stories_v" USING btree ("snapshot");
  CREATE INDEX "_stories_v_published_locale_idx" ON "_stories_v" USING btree ("published_locale");
  CREATE INDEX "_stories_v_latest_idx" ON "_stories_v" USING btree ("latest");
  CREATE INDEX "_stories_v_autosave_idx" ON "_stories_v" USING btree ("autosave");
  CREATE INDEX "_stories_v_version_meta_version_meta_image_idx" ON "_stories_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_stories_v_locales_locale_parent_id_unique" ON "_stories_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "testimonials_page_visibility_order_idx" ON "testimonials_page_visibility" USING btree ("order");
  CREATE INDEX "testimonials_page_visibility_parent_idx" ON "testimonials_page_visibility" USING btree ("parent_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "testimonials__status_idx" ON "testimonials" USING btree ("_status");
  CREATE UNIQUE INDEX "testimonials_locales_locale_parent_id_unique" ON "testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "testimonials_rels_order_idx" ON "testimonials_rels" USING btree ("order");
  CREATE INDEX "testimonials_rels_parent_idx" ON "testimonials_rels" USING btree ("parent_id");
  CREATE INDEX "testimonials_rels_path_idx" ON "testimonials_rels" USING btree ("path");
  CREATE INDEX "testimonials_rels_tours_id_idx" ON "testimonials_rels" USING btree ("tours_id");
  CREATE INDEX "_testimonials_v_version_page_visibility_order_idx" ON "_testimonials_v_version_page_visibility" USING btree ("order");
  CREATE INDEX "_testimonials_v_version_page_visibility_parent_idx" ON "_testimonials_v_version_page_visibility" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_parent_idx" ON "_testimonials_v" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_version_version_updated_at_idx" ON "_testimonials_v" USING btree ("version_updated_at");
  CREATE INDEX "_testimonials_v_version_version_created_at_idx" ON "_testimonials_v" USING btree ("version_created_at");
  CREATE INDEX "_testimonials_v_version_version__status_idx" ON "_testimonials_v" USING btree ("version__status");
  CREATE INDEX "_testimonials_v_created_at_idx" ON "_testimonials_v" USING btree ("created_at");
  CREATE INDEX "_testimonials_v_updated_at_idx" ON "_testimonials_v" USING btree ("updated_at");
  CREATE INDEX "_testimonials_v_snapshot_idx" ON "_testimonials_v" USING btree ("snapshot");
  CREATE INDEX "_testimonials_v_published_locale_idx" ON "_testimonials_v" USING btree ("published_locale");
  CREATE INDEX "_testimonials_v_latest_idx" ON "_testimonials_v" USING btree ("latest");
  CREATE INDEX "_testimonials_v_autosave_idx" ON "_testimonials_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_testimonials_v_locales_locale_parent_id_unique" ON "_testimonials_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_testimonials_v_rels_order_idx" ON "_testimonials_v_rels" USING btree ("order");
  CREATE INDEX "_testimonials_v_rels_parent_idx" ON "_testimonials_v_rels" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_rels_path_idx" ON "_testimonials_v_rels" USING btree ("path");
  CREATE INDEX "_testimonials_v_rels_tours_id_idx" ON "_testimonials_v_rels" USING btree ("tours_id");
  CREATE INDEX "faqs_page_visibility_order_idx" ON "faqs_page_visibility" USING btree ("order");
  CREATE INDEX "faqs_page_visibility_parent_idx" ON "faqs_page_visibility" USING btree ("parent_id");
  CREATE INDEX "faqs_related_tour_idx" ON "faqs" USING btree ("related_tour_id");
  CREATE INDEX "faqs_related_story_idx" ON "faqs" USING btree ("related_story_id");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "faqs__status_idx" ON "faqs" USING btree ("_status");
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faqs_texts_order_parent" ON "faqs_texts" USING btree ("order","parent_id");
  CREATE INDEX "_faqs_v_version_page_visibility_order_idx" ON "_faqs_v_version_page_visibility" USING btree ("order");
  CREATE INDEX "_faqs_v_version_page_visibility_parent_idx" ON "_faqs_v_version_page_visibility" USING btree ("parent_id");
  CREATE INDEX "_faqs_v_parent_idx" ON "_faqs_v" USING btree ("parent_id");
  CREATE INDEX "_faqs_v_version_version_related_tour_idx" ON "_faqs_v" USING btree ("version_related_tour_id");
  CREATE INDEX "_faqs_v_version_version_related_story_idx" ON "_faqs_v" USING btree ("version_related_story_id");
  CREATE INDEX "_faqs_v_version_version_updated_at_idx" ON "_faqs_v" USING btree ("version_updated_at");
  CREATE INDEX "_faqs_v_version_version_created_at_idx" ON "_faqs_v" USING btree ("version_created_at");
  CREATE INDEX "_faqs_v_version_version__status_idx" ON "_faqs_v" USING btree ("version__status");
  CREATE INDEX "_faqs_v_created_at_idx" ON "_faqs_v" USING btree ("created_at");
  CREATE INDEX "_faqs_v_updated_at_idx" ON "_faqs_v" USING btree ("updated_at");
  CREATE INDEX "_faqs_v_snapshot_idx" ON "_faqs_v" USING btree ("snapshot");
  CREATE INDEX "_faqs_v_published_locale_idx" ON "_faqs_v" USING btree ("published_locale");
  CREATE INDEX "_faqs_v_latest_idx" ON "_faqs_v" USING btree ("latest");
  CREATE INDEX "_faqs_v_autosave_idx" ON "_faqs_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_faqs_v_locales_locale_parent_id_unique" ON "_faqs_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_faqs_v_texts_order_parent" ON "_faqs_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "media_coverage_updated_at_idx" ON "media_coverage" USING btree ("updated_at");
  CREATE INDEX "media_coverage_created_at_idx" ON "media_coverage" USING btree ("created_at");
  CREATE INDEX "media_coverage__status_idx" ON "media_coverage" USING btree ("_status");
  CREATE UNIQUE INDEX "media_coverage_locales_locale_parent_id_unique" ON "media_coverage_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_media_coverage_v_parent_idx" ON "_media_coverage_v" USING btree ("parent_id");
  CREATE INDEX "_media_coverage_v_version_version_updated_at_idx" ON "_media_coverage_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_coverage_v_version_version_created_at_idx" ON "_media_coverage_v" USING btree ("version_created_at");
  CREATE INDEX "_media_coverage_v_version_version__status_idx" ON "_media_coverage_v" USING btree ("version__status");
  CREATE INDEX "_media_coverage_v_created_at_idx" ON "_media_coverage_v" USING btree ("created_at");
  CREATE INDEX "_media_coverage_v_updated_at_idx" ON "_media_coverage_v" USING btree ("updated_at");
  CREATE INDEX "_media_coverage_v_snapshot_idx" ON "_media_coverage_v" USING btree ("snapshot");
  CREATE INDEX "_media_coverage_v_published_locale_idx" ON "_media_coverage_v" USING btree ("published_locale");
  CREATE INDEX "_media_coverage_v_latest_idx" ON "_media_coverage_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_media_coverage_v_locales_locale_parent_id_unique" ON "_media_coverage_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "dietary_options_slug_idx" ON "dietary_options" USING btree ("slug");
  CREATE INDEX "dietary_options_updated_at_idx" ON "dietary_options" USING btree ("updated_at");
  CREATE INDEX "dietary_options_created_at_idx" ON "dietary_options" USING btree ("created_at");
  CREATE INDEX "dietary_options__status_idx" ON "dietary_options" USING btree ("_status");
  CREATE UNIQUE INDEX "dietary_options_locales_locale_parent_id_unique" ON "dietary_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_dietary_options_v_parent_idx" ON "_dietary_options_v" USING btree ("parent_id");
  CREATE INDEX "_dietary_options_v_version_version_slug_idx" ON "_dietary_options_v" USING btree ("version_slug");
  CREATE INDEX "_dietary_options_v_version_version_updated_at_idx" ON "_dietary_options_v" USING btree ("version_updated_at");
  CREATE INDEX "_dietary_options_v_version_version_created_at_idx" ON "_dietary_options_v" USING btree ("version_created_at");
  CREATE INDEX "_dietary_options_v_version_version__status_idx" ON "_dietary_options_v" USING btree ("version__status");
  CREATE INDEX "_dietary_options_v_created_at_idx" ON "_dietary_options_v" USING btree ("created_at");
  CREATE INDEX "_dietary_options_v_updated_at_idx" ON "_dietary_options_v" USING btree ("updated_at");
  CREATE INDEX "_dietary_options_v_snapshot_idx" ON "_dietary_options_v" USING btree ("snapshot");
  CREATE INDEX "_dietary_options_v_published_locale_idx" ON "_dietary_options_v" USING btree ("published_locale");
  CREATE INDEX "_dietary_options_v_latest_idx" ON "_dietary_options_v" USING btree ("latest");
  CREATE INDEX "_dietary_options_v_autosave_idx" ON "_dietary_options_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_dietary_options_v_locales_locale_parent_id_unique" ON "_dietary_options_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "food_items_local_names_order_idx" ON "food_items_local_names" USING btree ("_order");
  CREATE INDEX "food_items_local_names_parent_id_idx" ON "food_items_local_names" USING btree ("_parent_id");
  CREATE INDEX "food_items_ingredients_order_idx" ON "food_items_ingredients" USING btree ("_order");
  CREATE INDEX "food_items_ingredients_parent_id_idx" ON "food_items_ingredients" USING btree ("_parent_id");
  CREATE INDEX "food_items_allergens_order_idx" ON "food_items_allergens" USING btree ("_order");
  CREATE INDEX "food_items_allergens_parent_id_idx" ON "food_items_allergens" USING btree ("_parent_id");
  CREATE INDEX "food_items_flavor_profile_order_idx" ON "food_items_flavor_profile" USING btree ("_order");
  CREATE INDEX "food_items_flavor_profile_parent_id_idx" ON "food_items_flavor_profile" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "food_items_slug_idx" ON "food_items" USING btree ("slug");
  CREATE INDEX "food_items_image_idx" ON "food_items" USING btree ("image_id");
  CREATE INDEX "food_items_updated_at_idx" ON "food_items" USING btree ("updated_at");
  CREATE INDEX "food_items_created_at_idx" ON "food_items" USING btree ("created_at");
  CREATE INDEX "food_items__status_idx" ON "food_items" USING btree ("_status");
  CREATE UNIQUE INDEX "food_items_locales_locale_parent_id_unique" ON "food_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "food_items_rels_order_idx" ON "food_items_rels" USING btree ("order");
  CREATE INDEX "food_items_rels_parent_idx" ON "food_items_rels" USING btree ("parent_id");
  CREATE INDEX "food_items_rels_path_idx" ON "food_items_rels" USING btree ("path");
  CREATE INDEX "food_items_rels_dietary_options_id_idx" ON "food_items_rels" USING btree ("dietary_options_id");
  CREATE INDEX "food_items_rels_media_id_idx" ON "food_items_rels" USING btree ("media_id");
  CREATE INDEX "_food_items_v_version_local_names_order_idx" ON "_food_items_v_version_local_names" USING btree ("_order");
  CREATE INDEX "_food_items_v_version_local_names_parent_id_idx" ON "_food_items_v_version_local_names" USING btree ("_parent_id");
  CREATE INDEX "_food_items_v_version_ingredients_order_idx" ON "_food_items_v_version_ingredients" USING btree ("_order");
  CREATE INDEX "_food_items_v_version_ingredients_parent_id_idx" ON "_food_items_v_version_ingredients" USING btree ("_parent_id");
  CREATE INDEX "_food_items_v_version_allergens_order_idx" ON "_food_items_v_version_allergens" USING btree ("_order");
  CREATE INDEX "_food_items_v_version_allergens_parent_id_idx" ON "_food_items_v_version_allergens" USING btree ("_parent_id");
  CREATE INDEX "_food_items_v_version_flavor_profile_order_idx" ON "_food_items_v_version_flavor_profile" USING btree ("_order");
  CREATE INDEX "_food_items_v_version_flavor_profile_parent_id_idx" ON "_food_items_v_version_flavor_profile" USING btree ("_parent_id");
  CREATE INDEX "_food_items_v_parent_idx" ON "_food_items_v" USING btree ("parent_id");
  CREATE INDEX "_food_items_v_version_version_slug_idx" ON "_food_items_v" USING btree ("version_slug");
  CREATE INDEX "_food_items_v_version_version_image_idx" ON "_food_items_v" USING btree ("version_image_id");
  CREATE INDEX "_food_items_v_version_version_updated_at_idx" ON "_food_items_v" USING btree ("version_updated_at");
  CREATE INDEX "_food_items_v_version_version_created_at_idx" ON "_food_items_v" USING btree ("version_created_at");
  CREATE INDEX "_food_items_v_version_version__status_idx" ON "_food_items_v" USING btree ("version__status");
  CREATE INDEX "_food_items_v_created_at_idx" ON "_food_items_v" USING btree ("created_at");
  CREATE INDEX "_food_items_v_updated_at_idx" ON "_food_items_v" USING btree ("updated_at");
  CREATE INDEX "_food_items_v_snapshot_idx" ON "_food_items_v" USING btree ("snapshot");
  CREATE INDEX "_food_items_v_published_locale_idx" ON "_food_items_v" USING btree ("published_locale");
  CREATE INDEX "_food_items_v_latest_idx" ON "_food_items_v" USING btree ("latest");
  CREATE INDEX "_food_items_v_autosave_idx" ON "_food_items_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_food_items_v_locales_locale_parent_id_unique" ON "_food_items_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_food_items_v_rels_order_idx" ON "_food_items_v_rels" USING btree ("order");
  CREATE INDEX "_food_items_v_rels_parent_idx" ON "_food_items_v_rels" USING btree ("parent_id");
  CREATE INDEX "_food_items_v_rels_path_idx" ON "_food_items_v_rels" USING btree ("path");
  CREATE INDEX "_food_items_v_rels_dietary_options_id_idx" ON "_food_items_v_rels" USING btree ("dietary_options_id");
  CREATE INDEX "_food_items_v_rels_media_id_idx" ON "_food_items_v_rels" USING btree ("media_id");
  CREATE INDEX "vendors_operating_hours_order_idx" ON "vendors_operating_hours" USING btree ("_order");
  CREATE INDEX "vendors_operating_hours_parent_id_idx" ON "vendors_operating_hours" USING btree ("_parent_id");
  CREATE INDEX "vendors_operating_hours_locale_idx" ON "vendors_operating_hours" USING btree ("_locale");
  CREATE INDEX "vendors_closed_on_order_idx" ON "vendors_closed_on" USING btree ("_order");
  CREATE INDEX "vendors_closed_on_parent_id_idx" ON "vendors_closed_on" USING btree ("_parent_id");
  CREATE INDEX "vendors_payment_methods_order_idx" ON "vendors_payment_methods" USING btree ("_order");
  CREATE INDEX "vendors_payment_methods_parent_id_idx" ON "vendors_payment_methods" USING btree ("_parent_id");
  CREATE INDEX "vendors_facilities_order_idx" ON "vendors_facilities" USING btree ("_order");
  CREATE INDEX "vendors_facilities_parent_id_idx" ON "vendors_facilities" USING btree ("_parent_id");
  CREATE INDEX "vendors_images_gallery_order_idx" ON "vendors_images_gallery" USING btree ("_order");
  CREATE INDEX "vendors_images_gallery_parent_id_idx" ON "vendors_images_gallery" USING btree ("_parent_id");
  CREATE INDEX "vendors_images_gallery_image_idx" ON "vendors_images_gallery" USING btree ("image_id");
  CREATE INDEX "vendors_awards_order_idx" ON "vendors_awards" USING btree ("_order");
  CREATE INDEX "vendors_awards_parent_id_idx" ON "vendors_awards" USING btree ("_parent_id");
  CREATE INDEX "vendors_awards_locale_idx" ON "vendors_awards" USING btree ("_locale");
  CREATE UNIQUE INDEX "vendors_slug_idx" ON "vendors" USING btree ("slug");
  CREATE INDEX "vendors_images_images_main_idx" ON "vendors" USING btree ("images_main_id");
  CREATE INDEX "vendors_updated_at_idx" ON "vendors" USING btree ("updated_at");
  CREATE INDEX "vendors_created_at_idx" ON "vendors" USING btree ("created_at");
  CREATE INDEX "vendors__status_idx" ON "vendors" USING btree ("_status");
  CREATE UNIQUE INDEX "vendors_locales_locale_parent_id_unique" ON "vendors_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "vendors_rels_order_idx" ON "vendors_rels" USING btree ("order");
  CREATE INDEX "vendors_rels_parent_idx" ON "vendors_rels" USING btree ("parent_id");
  CREATE INDEX "vendors_rels_path_idx" ON "vendors_rels" USING btree ("path");
  CREATE INDEX "vendors_rels_food_items_id_idx" ON "vendors_rels" USING btree ("food_items_id");
  CREATE INDEX "vendors_rels_dietary_options_id_idx" ON "vendors_rels" USING btree ("dietary_options_id");
  CREATE INDEX "_vendors_v_version_operating_hours_order_idx" ON "_vendors_v_version_operating_hours" USING btree ("_order");
  CREATE INDEX "_vendors_v_version_operating_hours_parent_id_idx" ON "_vendors_v_version_operating_hours" USING btree ("_parent_id");
  CREATE INDEX "_vendors_v_version_operating_hours_locale_idx" ON "_vendors_v_version_operating_hours" USING btree ("_locale");
  CREATE INDEX "_vendors_v_version_closed_on_order_idx" ON "_vendors_v_version_closed_on" USING btree ("_order");
  CREATE INDEX "_vendors_v_version_closed_on_parent_id_idx" ON "_vendors_v_version_closed_on" USING btree ("_parent_id");
  CREATE INDEX "_vendors_v_version_payment_methods_order_idx" ON "_vendors_v_version_payment_methods" USING btree ("_order");
  CREATE INDEX "_vendors_v_version_payment_methods_parent_id_idx" ON "_vendors_v_version_payment_methods" USING btree ("_parent_id");
  CREATE INDEX "_vendors_v_version_facilities_order_idx" ON "_vendors_v_version_facilities" USING btree ("_order");
  CREATE INDEX "_vendors_v_version_facilities_parent_id_idx" ON "_vendors_v_version_facilities" USING btree ("_parent_id");
  CREATE INDEX "_vendors_v_version_images_gallery_order_idx" ON "_vendors_v_version_images_gallery" USING btree ("_order");
  CREATE INDEX "_vendors_v_version_images_gallery_parent_id_idx" ON "_vendors_v_version_images_gallery" USING btree ("_parent_id");
  CREATE INDEX "_vendors_v_version_images_gallery_image_idx" ON "_vendors_v_version_images_gallery" USING btree ("image_id");
  CREATE INDEX "_vendors_v_version_awards_order_idx" ON "_vendors_v_version_awards" USING btree ("_order");
  CREATE INDEX "_vendors_v_version_awards_parent_id_idx" ON "_vendors_v_version_awards" USING btree ("_parent_id");
  CREATE INDEX "_vendors_v_version_awards_locale_idx" ON "_vendors_v_version_awards" USING btree ("_locale");
  CREATE INDEX "_vendors_v_parent_idx" ON "_vendors_v" USING btree ("parent_id");
  CREATE INDEX "_vendors_v_version_version_slug_idx" ON "_vendors_v" USING btree ("version_slug");
  CREATE INDEX "_vendors_v_version_images_version_images_main_idx" ON "_vendors_v" USING btree ("version_images_main_id");
  CREATE INDEX "_vendors_v_version_version_updated_at_idx" ON "_vendors_v" USING btree ("version_updated_at");
  CREATE INDEX "_vendors_v_version_version_created_at_idx" ON "_vendors_v" USING btree ("version_created_at");
  CREATE INDEX "_vendors_v_version_version__status_idx" ON "_vendors_v" USING btree ("version__status");
  CREATE INDEX "_vendors_v_created_at_idx" ON "_vendors_v" USING btree ("created_at");
  CREATE INDEX "_vendors_v_updated_at_idx" ON "_vendors_v" USING btree ("updated_at");
  CREATE INDEX "_vendors_v_snapshot_idx" ON "_vendors_v" USING btree ("snapshot");
  CREATE INDEX "_vendors_v_published_locale_idx" ON "_vendors_v" USING btree ("published_locale");
  CREATE INDEX "_vendors_v_latest_idx" ON "_vendors_v" USING btree ("latest");
  CREATE INDEX "_vendors_v_autosave_idx" ON "_vendors_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_vendors_v_locales_locale_parent_id_unique" ON "_vendors_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_vendors_v_rels_order_idx" ON "_vendors_v_rels" USING btree ("order");
  CREATE INDEX "_vendors_v_rels_parent_idx" ON "_vendors_v_rels" USING btree ("parent_id");
  CREATE INDEX "_vendors_v_rels_path_idx" ON "_vendors_v_rels" USING btree ("path");
  CREATE INDEX "_vendors_v_rels_food_items_id_idx" ON "_vendors_v_rels" USING btree ("food_items_id");
  CREATE INDEX "_vendors_v_rels_dietary_options_id_idx" ON "_vendors_v_rels" USING btree ("dietary_options_id");
  CREATE INDEX "landing_pages_challenges_order_idx" ON "landing_pages_challenges" USING btree ("_order");
  CREATE INDEX "landing_pages_challenges_parent_id_idx" ON "landing_pages_challenges" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_challenges_locale_idx" ON "landing_pages_challenges" USING btree ("_locale");
  CREATE INDEX "landing_pages_highlights_order_idx" ON "landing_pages_highlights" USING btree ("_order");
  CREATE INDEX "landing_pages_highlights_parent_id_idx" ON "landing_pages_highlights" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_highlights_locale_idx" ON "landing_pages_highlights" USING btree ("_locale");
  CREATE INDEX "landing_pages_tips_order_idx" ON "landing_pages_tips" USING btree ("_order");
  CREATE INDEX "landing_pages_tips_parent_id_idx" ON "landing_pages_tips" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_tips_locale_idx" ON "landing_pages_tips" USING btree ("_locale");
  CREATE INDEX "landing_pages_safe_dishes_order_idx" ON "landing_pages_safe_dishes" USING btree ("_order");
  CREATE INDEX "landing_pages_safe_dishes_parent_id_idx" ON "landing_pages_safe_dishes" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_safe_dishes_locale_idx" ON "landing_pages_safe_dishes" USING btree ("_locale");
  CREATE INDEX "landing_pages_avoid_dishes_order_idx" ON "landing_pages_avoid_dishes" USING btree ("_order");
  CREATE INDEX "landing_pages_avoid_dishes_parent_id_idx" ON "landing_pages_avoid_dishes" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_avoid_dishes_locale_idx" ON "landing_pages_avoid_dishes" USING btree ("_locale");
  CREATE INDEX "landing_pages_suitable_tours_order_idx" ON "landing_pages_suitable_tours" USING btree ("_order");
  CREATE INDEX "landing_pages_suitable_tours_parent_id_idx" ON "landing_pages_suitable_tours" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_travel_tips_order_idx" ON "landing_pages_travel_tips" USING btree ("_order");
  CREATE INDEX "landing_pages_travel_tips_parent_id_idx" ON "landing_pages_travel_tips" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_travel_tips_locale_idx" ON "landing_pages_travel_tips" USING btree ("_locale");
  CREATE UNIQUE INDEX "landing_pages_slug_idx" ON "landing_pages" USING btree ("slug");
  CREATE INDEX "landing_pages_hero_image_idx" ON "landing_pages" USING btree ("hero_image_id");
  CREATE INDEX "landing_pages_updated_at_idx" ON "landing_pages" USING btree ("updated_at");
  CREATE INDEX "landing_pages_created_at_idx" ON "landing_pages" USING btree ("created_at");
  CREATE INDEX "landing_pages__status_idx" ON "landing_pages" USING btree ("_status");
  CREATE INDEX "landing_pages_meta_meta_image_idx" ON "landing_pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "landing_pages_locales_locale_parent_id_unique" ON "landing_pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_landing_pages_v_version_challenges_order_idx" ON "_landing_pages_v_version_challenges" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_version_challenges_parent_id_idx" ON "_landing_pages_v_version_challenges" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_version_challenges_locale_idx" ON "_landing_pages_v_version_challenges" USING btree ("_locale");
  CREATE INDEX "_landing_pages_v_version_highlights_order_idx" ON "_landing_pages_v_version_highlights" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_version_highlights_parent_id_idx" ON "_landing_pages_v_version_highlights" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_version_highlights_locale_idx" ON "_landing_pages_v_version_highlights" USING btree ("_locale");
  CREATE INDEX "_landing_pages_v_version_tips_order_idx" ON "_landing_pages_v_version_tips" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_version_tips_parent_id_idx" ON "_landing_pages_v_version_tips" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_version_tips_locale_idx" ON "_landing_pages_v_version_tips" USING btree ("_locale");
  CREATE INDEX "_landing_pages_v_version_safe_dishes_order_idx" ON "_landing_pages_v_version_safe_dishes" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_version_safe_dishes_parent_id_idx" ON "_landing_pages_v_version_safe_dishes" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_version_safe_dishes_locale_idx" ON "_landing_pages_v_version_safe_dishes" USING btree ("_locale");
  CREATE INDEX "_landing_pages_v_version_avoid_dishes_order_idx" ON "_landing_pages_v_version_avoid_dishes" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_version_avoid_dishes_parent_id_idx" ON "_landing_pages_v_version_avoid_dishes" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_version_avoid_dishes_locale_idx" ON "_landing_pages_v_version_avoid_dishes" USING btree ("_locale");
  CREATE INDEX "_landing_pages_v_version_suitable_tours_order_idx" ON "_landing_pages_v_version_suitable_tours" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_version_suitable_tours_parent_id_idx" ON "_landing_pages_v_version_suitable_tours" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_version_travel_tips_order_idx" ON "_landing_pages_v_version_travel_tips" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_version_travel_tips_parent_id_idx" ON "_landing_pages_v_version_travel_tips" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_version_travel_tips_locale_idx" ON "_landing_pages_v_version_travel_tips" USING btree ("_locale");
  CREATE INDEX "_landing_pages_v_parent_idx" ON "_landing_pages_v" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_version_version_slug_idx" ON "_landing_pages_v" USING btree ("version_slug");
  CREATE INDEX "_landing_pages_v_version_version_hero_image_idx" ON "_landing_pages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_landing_pages_v_version_version_updated_at_idx" ON "_landing_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_landing_pages_v_version_version_created_at_idx" ON "_landing_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_landing_pages_v_version_version__status_idx" ON "_landing_pages_v" USING btree ("version__status");
  CREATE INDEX "_landing_pages_v_created_at_idx" ON "_landing_pages_v" USING btree ("created_at");
  CREATE INDEX "_landing_pages_v_updated_at_idx" ON "_landing_pages_v" USING btree ("updated_at");
  CREATE INDEX "_landing_pages_v_snapshot_idx" ON "_landing_pages_v" USING btree ("snapshot");
  CREATE INDEX "_landing_pages_v_published_locale_idx" ON "_landing_pages_v" USING btree ("published_locale");
  CREATE INDEX "_landing_pages_v_latest_idx" ON "_landing_pages_v" USING btree ("latest");
  CREATE INDEX "_landing_pages_v_autosave_idx" ON "_landing_pages_v" USING btree ("autosave");
  CREATE INDEX "_landing_pages_v_version_meta_version_meta_image_idx" ON "_landing_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_landing_pages_v_locales_locale_parent_id_unique" ON "_landing_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_highlights_order_idx" ON "pages_highlights" USING btree ("_order");
  CREATE INDEX "pages_highlights_parent_id_idx" ON "pages_highlights" USING btree ("_parent_id");
  CREATE INDEX "pages_highlights_locale_idx" ON "pages_highlights" USING btree ("_locale");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_hero_image_idx" ON "pages" USING btree ("hero_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_version_highlights_order_idx" ON "_pages_v_version_highlights" USING btree ("_order");
  CREATE INDEX "_pages_v_version_highlights_parent_id_idx" ON "_pages_v_version_highlights" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_highlights_locale_idx" ON "_pages_v_version_highlights" USING btree ("_locale");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_hero_image_idx" ON "_pages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_blocks_hero_block_order_idx" ON "about_page_blocks_hero_block" USING btree ("_order");
  CREATE INDEX "about_page_blocks_hero_block_parent_id_idx" ON "about_page_blocks_hero_block" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_hero_block_path_idx" ON "about_page_blocks_hero_block" USING btree ("_path");
  CREATE INDEX "about_page_blocks_hero_block_locale_idx" ON "about_page_blocks_hero_block" USING btree ("_locale");
  CREATE INDEX "about_page_blocks_founder_story_block_order_idx" ON "about_page_blocks_founder_story_block" USING btree ("_order");
  CREATE INDEX "about_page_blocks_founder_story_block_parent_id_idx" ON "about_page_blocks_founder_story_block" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_founder_story_block_path_idx" ON "about_page_blocks_founder_story_block" USING btree ("_path");
  CREATE INDEX "about_page_blocks_founder_story_block_locale_idx" ON "about_page_blocks_founder_story_block" USING btree ("_locale");
  CREATE INDEX "about_page_blocks_stats_block_stats_order_idx" ON "about_page_blocks_stats_block_stats" USING btree ("_order");
  CREATE INDEX "about_page_blocks_stats_block_stats_parent_id_idx" ON "about_page_blocks_stats_block_stats" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_stats_block_stats_locale_idx" ON "about_page_blocks_stats_block_stats" USING btree ("_locale");
  CREATE INDEX "about_page_blocks_stats_block_order_idx" ON "about_page_blocks_stats_block" USING btree ("_order");
  CREATE INDEX "about_page_blocks_stats_block_parent_id_idx" ON "about_page_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_stats_block_path_idx" ON "about_page_blocks_stats_block" USING btree ("_path");
  CREATE INDEX "about_page_blocks_stats_block_locale_idx" ON "about_page_blocks_stats_block" USING btree ("_locale");
  CREATE INDEX "about_page_blocks_timeline_block_events_order_idx" ON "about_page_blocks_timeline_block_events" USING btree ("_order");
  CREATE INDEX "about_page_blocks_timeline_block_events_parent_id_idx" ON "about_page_blocks_timeline_block_events" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_timeline_block_events_locale_idx" ON "about_page_blocks_timeline_block_events" USING btree ("_locale");
  CREATE INDEX "about_page_blocks_timeline_block_order_idx" ON "about_page_blocks_timeline_block" USING btree ("_order");
  CREATE INDEX "about_page_blocks_timeline_block_parent_id_idx" ON "about_page_blocks_timeline_block" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_timeline_block_path_idx" ON "about_page_blocks_timeline_block" USING btree ("_path");
  CREATE INDEX "about_page_blocks_timeline_block_locale_idx" ON "about_page_blocks_timeline_block" USING btree ("_locale");
  CREATE INDEX "about_page_blocks_philosophy_block_items_order_idx" ON "about_page_blocks_philosophy_block_items" USING btree ("_order");
  CREATE INDEX "about_page_blocks_philosophy_block_items_parent_id_idx" ON "about_page_blocks_philosophy_block_items" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_philosophy_block_items_locale_idx" ON "about_page_blocks_philosophy_block_items" USING btree ("_locale");
  CREATE INDEX "about_page_blocks_philosophy_block_order_idx" ON "about_page_blocks_philosophy_block" USING btree ("_order");
  CREATE INDEX "about_page_blocks_philosophy_block_parent_id_idx" ON "about_page_blocks_philosophy_block" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_philosophy_block_path_idx" ON "about_page_blocks_philosophy_block" USING btree ("_path");
  CREATE INDEX "about_page_blocks_philosophy_block_locale_idx" ON "about_page_blocks_philosophy_block" USING btree ("_locale");
  CREATE INDEX "about_page_blocks_team_block_members_order_idx" ON "about_page_blocks_team_block_members" USING btree ("_order");
  CREATE INDEX "about_page_blocks_team_block_members_parent_id_idx" ON "about_page_blocks_team_block_members" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_team_block_members_locale_idx" ON "about_page_blocks_team_block_members" USING btree ("_locale");
  CREATE INDEX "about_page_blocks_team_block_order_idx" ON "about_page_blocks_team_block" USING btree ("_order");
  CREATE INDEX "about_page_blocks_team_block_parent_id_idx" ON "about_page_blocks_team_block" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_team_block_path_idx" ON "about_page_blocks_team_block" USING btree ("_path");
  CREATE INDEX "about_page_blocks_team_block_locale_idx" ON "about_page_blocks_team_block" USING btree ("_locale");
  CREATE INDEX "about_page_breadcrumbs_order_idx" ON "about_page_breadcrumbs" USING btree ("_order");
  CREATE INDEX "about_page_breadcrumbs_parent_id_idx" ON "about_page_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "about_page_breadcrumbs_locale_idx" ON "about_page_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "about_page_breadcrumbs_doc_idx" ON "about_page_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "about_page_parent_idx" ON "about_page" USING btree ("parent_id");
  CREATE INDEX "about_page_updated_at_idx" ON "about_page" USING btree ("updated_at");
  CREATE INDEX "about_page_created_at_idx" ON "about_page" USING btree ("created_at");
  CREATE UNIQUE INDEX "about_page_locales_locale_parent_id_unique" ON "about_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contact_page_breadcrumbs_order_idx" ON "contact_page_breadcrumbs" USING btree ("_order");
  CREATE INDEX "contact_page_breadcrumbs_parent_id_idx" ON "contact_page_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "contact_page_breadcrumbs_locale_idx" ON "contact_page_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "contact_page_breadcrumbs_doc_idx" ON "contact_page_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "contact_page_parent_idx" ON "contact_page" USING btree ("parent_id");
  CREATE INDEX "contact_page_updated_at_idx" ON "contact_page" USING btree ("updated_at");
  CREATE INDEX "contact_page_created_at_idx" ON "contact_page" USING btree ("created_at");
  CREATE INDEX "contact_page__status_idx" ON "contact_page" USING btree ("_status");
  CREATE UNIQUE INDEX "contact_page_locales_locale_parent_id_unique" ON "contact_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_contact_page_v_version_breadcrumbs_order_idx" ON "_contact_page_v_version_breadcrumbs" USING btree ("_order");
  CREATE INDEX "_contact_page_v_version_breadcrumbs_parent_id_idx" ON "_contact_page_v_version_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "_contact_page_v_version_breadcrumbs_locale_idx" ON "_contact_page_v_version_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "_contact_page_v_version_breadcrumbs_doc_idx" ON "_contact_page_v_version_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "_contact_page_v_parent_idx" ON "_contact_page_v" USING btree ("parent_id");
  CREATE INDEX "_contact_page_v_version_version_parent_idx" ON "_contact_page_v" USING btree ("version_parent_id");
  CREATE INDEX "_contact_page_v_version_version_updated_at_idx" ON "_contact_page_v" USING btree ("version_updated_at");
  CREATE INDEX "_contact_page_v_version_version_created_at_idx" ON "_contact_page_v" USING btree ("version_created_at");
  CREATE INDEX "_contact_page_v_version_version__status_idx" ON "_contact_page_v" USING btree ("version__status");
  CREATE INDEX "_contact_page_v_created_at_idx" ON "_contact_page_v" USING btree ("created_at");
  CREATE INDEX "_contact_page_v_updated_at_idx" ON "_contact_page_v" USING btree ("updated_at");
  CREATE INDEX "_contact_page_v_snapshot_idx" ON "_contact_page_v" USING btree ("snapshot");
  CREATE INDEX "_contact_page_v_published_locale_idx" ON "_contact_page_v" USING btree ("published_locale");
  CREATE INDEX "_contact_page_v_latest_idx" ON "_contact_page_v" USING btree ("latest");
  CREATE INDEX "_contact_page_v_autosave_idx" ON "_contact_page_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_contact_page_v_locales_locale_parent_id_unique" ON "_contact_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "thank_you_pages_next_steps_order_idx" ON "thank_you_pages_next_steps" USING btree ("_order");
  CREATE INDEX "thank_you_pages_next_steps_parent_id_idx" ON "thank_you_pages_next_steps" USING btree ("_parent_id");
  CREATE INDEX "thank_you_pages_next_steps_locale_idx" ON "thank_you_pages_next_steps" USING btree ("_locale");
  CREATE INDEX "thank_you_pages_cta_section_cta_buttons_order_idx" ON "thank_you_pages_cta_section_cta_buttons" USING btree ("_order");
  CREATE INDEX "thank_you_pages_cta_section_cta_buttons_parent_id_idx" ON "thank_you_pages_cta_section_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "thank_you_pages_cta_section_cta_buttons_locale_idx" ON "thank_you_pages_cta_section_cta_buttons" USING btree ("_locale");
  CREATE UNIQUE INDEX "thank_you_pages_slug_idx" ON "thank_you_pages" USING btree ("slug");
  CREATE INDEX "thank_you_pages_updated_at_idx" ON "thank_you_pages" USING btree ("updated_at");
  CREATE INDEX "thank_you_pages_created_at_idx" ON "thank_you_pages" USING btree ("created_at");
  CREATE INDEX "thank_you_pages__status_idx" ON "thank_you_pages" USING btree ("_status");
  CREATE UNIQUE INDEX "thank_you_pages_locales_locale_parent_id_unique" ON "thank_you_pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_thank_you_pages_v_version_next_steps_order_idx" ON "_thank_you_pages_v_version_next_steps" USING btree ("_order");
  CREATE INDEX "_thank_you_pages_v_version_next_steps_parent_id_idx" ON "_thank_you_pages_v_version_next_steps" USING btree ("_parent_id");
  CREATE INDEX "_thank_you_pages_v_version_next_steps_locale_idx" ON "_thank_you_pages_v_version_next_steps" USING btree ("_locale");
  CREATE INDEX "_thank_you_pages_v_version_cta_section_cta_buttons_order_idx" ON "_thank_you_pages_v_version_cta_section_cta_buttons" USING btree ("_order");
  CREATE INDEX "_thank_you_pages_v_version_cta_section_cta_buttons_parent_id_idx" ON "_thank_you_pages_v_version_cta_section_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "_thank_you_pages_v_version_cta_section_cta_buttons_locale_idx" ON "_thank_you_pages_v_version_cta_section_cta_buttons" USING btree ("_locale");
  CREATE INDEX "_thank_you_pages_v_parent_idx" ON "_thank_you_pages_v" USING btree ("parent_id");
  CREATE INDEX "_thank_you_pages_v_version_version_slug_idx" ON "_thank_you_pages_v" USING btree ("version_slug");
  CREATE INDEX "_thank_you_pages_v_version_version_updated_at_idx" ON "_thank_you_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_thank_you_pages_v_version_version_created_at_idx" ON "_thank_you_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_thank_you_pages_v_version_version__status_idx" ON "_thank_you_pages_v" USING btree ("version__status");
  CREATE INDEX "_thank_you_pages_v_created_at_idx" ON "_thank_you_pages_v" USING btree ("created_at");
  CREATE INDEX "_thank_you_pages_v_updated_at_idx" ON "_thank_you_pages_v" USING btree ("updated_at");
  CREATE INDEX "_thank_you_pages_v_snapshot_idx" ON "_thank_you_pages_v" USING btree ("snapshot");
  CREATE INDEX "_thank_you_pages_v_published_locale_idx" ON "_thank_you_pages_v" USING btree ("published_locale");
  CREATE INDEX "_thank_you_pages_v_latest_idx" ON "_thank_you_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_thank_you_pages_v_locales_locale_parent_id_unique" ON "_thank_you_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_blocks_hero_block_badges_order_idx" ON "home_page_blocks_hero_block_badges" USING btree ("_order");
  CREATE INDEX "home_page_blocks_hero_block_badges_parent_id_idx" ON "home_page_blocks_hero_block_badges" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_hero_block_badges_locale_idx" ON "home_page_blocks_hero_block_badges" USING btree ("_locale");
  CREATE INDEX "home_page_blocks_hero_block_order_idx" ON "home_page_blocks_hero_block" USING btree ("_order");
  CREATE INDEX "home_page_blocks_hero_block_parent_id_idx" ON "home_page_blocks_hero_block" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_hero_block_path_idx" ON "home_page_blocks_hero_block" USING btree ("_path");
  CREATE INDEX "home_page_blocks_hero_block_locale_idx" ON "home_page_blocks_hero_block" USING btree ("_locale");
  CREATE INDEX "home_page_blocks_hero_block_bg_image_idx" ON "home_page_blocks_hero_block" USING btree ("bg_image_id");
  CREATE INDEX "home_page_blocks_manifesto_block_order_idx" ON "home_page_blocks_manifesto_block" USING btree ("_order");
  CREATE INDEX "home_page_blocks_manifesto_block_parent_id_idx" ON "home_page_blocks_manifesto_block" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_manifesto_block_path_idx" ON "home_page_blocks_manifesto_block" USING btree ("_path");
  CREATE INDEX "home_page_blocks_manifesto_block_locale_idx" ON "home_page_blocks_manifesto_block" USING btree ("_locale");
  CREATE INDEX "home_page_blocks_pillars_block_pillars_order_idx" ON "home_page_blocks_pillars_block_pillars" USING btree ("_order");
  CREATE INDEX "home_page_blocks_pillars_block_pillars_parent_id_idx" ON "home_page_blocks_pillars_block_pillars" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_pillars_block_pillars_locale_idx" ON "home_page_blocks_pillars_block_pillars" USING btree ("_locale");
  CREATE INDEX "home_page_blocks_pillars_block_order_idx" ON "home_page_blocks_pillars_block" USING btree ("_order");
  CREATE INDEX "home_page_blocks_pillars_block_parent_id_idx" ON "home_page_blocks_pillars_block" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_pillars_block_path_idx" ON "home_page_blocks_pillars_block" USING btree ("_path");
  CREATE INDEX "home_page_blocks_pillars_block_locale_idx" ON "home_page_blocks_pillars_block" USING btree ("_locale");
  CREATE INDEX "home_page_blocks_vendors_block_links_order_idx" ON "home_page_blocks_vendors_block_links" USING btree ("_order");
  CREATE INDEX "home_page_blocks_vendors_block_links_parent_id_idx" ON "home_page_blocks_vendors_block_links" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_vendors_block_links_locale_idx" ON "home_page_blocks_vendors_block_links" USING btree ("_locale");
  CREATE INDEX "home_page_blocks_vendors_block_order_idx" ON "home_page_blocks_vendors_block" USING btree ("_order");
  CREATE INDEX "home_page_blocks_vendors_block_parent_id_idx" ON "home_page_blocks_vendors_block" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_vendors_block_path_idx" ON "home_page_blocks_vendors_block" USING btree ("_path");
  CREATE INDEX "home_page_blocks_vendors_block_locale_idx" ON "home_page_blocks_vendors_block" USING btree ("_locale");
  CREATE INDEX "home_page_blocks_segments_block_order_idx" ON "home_page_blocks_segments_block" USING btree ("_order");
  CREATE INDEX "home_page_blocks_segments_block_parent_id_idx" ON "home_page_blocks_segments_block" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_segments_block_path_idx" ON "home_page_blocks_segments_block" USING btree ("_path");
  CREATE INDEX "home_page_blocks_segments_block_locale_idx" ON "home_page_blocks_segments_block" USING btree ("_locale");
  CREATE INDEX "home_page_blocks_about_block_order_idx" ON "home_page_blocks_about_block" USING btree ("_order");
  CREATE INDEX "home_page_blocks_about_block_parent_id_idx" ON "home_page_blocks_about_block" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_about_block_path_idx" ON "home_page_blocks_about_block" USING btree ("_path");
  CREATE INDEX "home_page_blocks_about_block_locale_idx" ON "home_page_blocks_about_block" USING btree ("_locale");
  CREATE INDEX "home_page_blocks_about_block_image_idx" ON "home_page_blocks_about_block" USING btree ("image_id");
  CREATE INDEX "home_page_blocks_stats_block_stats_order_idx" ON "home_page_blocks_stats_block_stats" USING btree ("_order");
  CREATE INDEX "home_page_blocks_stats_block_stats_parent_id_idx" ON "home_page_blocks_stats_block_stats" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_stats_block_stats_locale_idx" ON "home_page_blocks_stats_block_stats" USING btree ("_locale");
  CREATE INDEX "home_page_blocks_stats_block_order_idx" ON "home_page_blocks_stats_block" USING btree ("_order");
  CREATE INDEX "home_page_blocks_stats_block_parent_id_idx" ON "home_page_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_stats_block_path_idx" ON "home_page_blocks_stats_block" USING btree ("_path");
  CREATE INDEX "home_page_blocks_stats_block_locale_idx" ON "home_page_blocks_stats_block" USING btree ("_locale");
  CREATE INDEX "home_page_blocks_cta_block_features_order_idx" ON "home_page_blocks_cta_block_features" USING btree ("_order");
  CREATE INDEX "home_page_blocks_cta_block_features_parent_id_idx" ON "home_page_blocks_cta_block_features" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_cta_block_features_locale_idx" ON "home_page_blocks_cta_block_features" USING btree ("_locale");
  CREATE INDEX "home_page_blocks_cta_block_buttons_order_idx" ON "home_page_blocks_cta_block_buttons" USING btree ("_order");
  CREATE INDEX "home_page_blocks_cta_block_buttons_parent_id_idx" ON "home_page_blocks_cta_block_buttons" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_cta_block_buttons_locale_idx" ON "home_page_blocks_cta_block_buttons" USING btree ("_locale");
  CREATE INDEX "home_page_blocks_cta_block_order_idx" ON "home_page_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "home_page_blocks_cta_block_parent_id_idx" ON "home_page_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_cta_block_path_idx" ON "home_page_blocks_cta_block" USING btree ("_path");
  CREATE INDEX "home_page_blocks_cta_block_locale_idx" ON "home_page_blocks_cta_block" USING btree ("_locale");
  CREATE INDEX "home_page_blocks_why_us_block_reasons_order_idx" ON "home_page_blocks_why_us_block_reasons" USING btree ("_order");
  CREATE INDEX "home_page_blocks_why_us_block_reasons_parent_id_idx" ON "home_page_blocks_why_us_block_reasons" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_why_us_block_reasons_locale_idx" ON "home_page_blocks_why_us_block_reasons" USING btree ("_locale");
  CREATE INDEX "home_page_blocks_why_us_block_order_idx" ON "home_page_blocks_why_us_block" USING btree ("_order");
  CREATE INDEX "home_page_blocks_why_us_block_parent_id_idx" ON "home_page_blocks_why_us_block" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_why_us_block_path_idx" ON "home_page_blocks_why_us_block" USING btree ("_path");
  CREATE INDEX "home_page_blocks_why_us_block_locale_idx" ON "home_page_blocks_why_us_block" USING btree ("_locale");
  CREATE INDEX "home_page_blocks_guarantees_block_guarantees_order_idx" ON "home_page_blocks_guarantees_block_guarantees" USING btree ("_order");
  CREATE INDEX "home_page_blocks_guarantees_block_guarantees_parent_id_idx" ON "home_page_blocks_guarantees_block_guarantees" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_guarantees_block_guarantees_locale_idx" ON "home_page_blocks_guarantees_block_guarantees" USING btree ("_locale");
  CREATE INDEX "home_page_blocks_guarantees_block_order_idx" ON "home_page_blocks_guarantees_block" USING btree ("_order");
  CREATE INDEX "home_page_blocks_guarantees_block_parent_id_idx" ON "home_page_blocks_guarantees_block" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_guarantees_block_path_idx" ON "home_page_blocks_guarantees_block" USING btree ("_path");
  CREATE INDEX "home_page_blocks_guarantees_block_locale_idx" ON "home_page_blocks_guarantees_block" USING btree ("_locale");
  CREATE INDEX "plat_order_idx" ON "plat" USING btree ("_order");
  CREATE INDEX "plat_parent_id_idx" ON "plat" USING btree ("_parent_id");
  CREATE INDEX "plat_locale_idx" ON "plat" USING btree ("_locale");
  CREATE INDEX "home_page_blocks_social_proof_badges_block_order_idx" ON "home_page_blocks_social_proof_badges_block" USING btree ("_order");
  CREATE INDEX "home_page_blocks_social_proof_badges_block_parent_id_idx" ON "home_page_blocks_social_proof_badges_block" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_social_proof_badges_block_path_idx" ON "home_page_blocks_social_proof_badges_block" USING btree ("_path");
  CREATE INDEX "home_page_blocks_social_proof_badges_block_locale_idx" ON "home_page_blocks_social_proof_badges_block" USING btree ("_locale");
  CREATE INDEX "home_page_updated_at_idx" ON "home_page" USING btree ("updated_at");
  CREATE INDEX "home_page_created_at_idx" ON "home_page" USING btree ("created_at");
  CREATE INDEX "home_page__status_idx" ON "home_page" USING btree ("_status");
  CREATE UNIQUE INDEX "home_page_locales_locale_parent_id_unique" ON "home_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_blocks_hero_block_badges_order_idx" ON "_home_page_v_blocks_hero_block_badges" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_hero_block_badges_parent_id_idx" ON "_home_page_v_blocks_hero_block_badges" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_hero_block_badges_locale_idx" ON "_home_page_v_blocks_hero_block_badges" USING btree ("_locale");
  CREATE INDEX "_home_page_v_blocks_hero_block_order_idx" ON "_home_page_v_blocks_hero_block" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_hero_block_parent_id_idx" ON "_home_page_v_blocks_hero_block" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_hero_block_path_idx" ON "_home_page_v_blocks_hero_block" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_hero_block_locale_idx" ON "_home_page_v_blocks_hero_block" USING btree ("_locale");
  CREATE INDEX "_home_page_v_blocks_hero_block_bg_image_idx" ON "_home_page_v_blocks_hero_block" USING btree ("bg_image_id");
  CREATE INDEX "_home_page_v_blocks_manifesto_block_order_idx" ON "_home_page_v_blocks_manifesto_block" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_manifesto_block_parent_id_idx" ON "_home_page_v_blocks_manifesto_block" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_manifesto_block_path_idx" ON "_home_page_v_blocks_manifesto_block" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_manifesto_block_locale_idx" ON "_home_page_v_blocks_manifesto_block" USING btree ("_locale");
  CREATE INDEX "_home_page_v_blocks_pillars_block_pillars_order_idx" ON "_home_page_v_blocks_pillars_block_pillars" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_pillars_block_pillars_parent_id_idx" ON "_home_page_v_blocks_pillars_block_pillars" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_pillars_block_pillars_locale_idx" ON "_home_page_v_blocks_pillars_block_pillars" USING btree ("_locale");
  CREATE INDEX "_home_page_v_blocks_pillars_block_order_idx" ON "_home_page_v_blocks_pillars_block" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_pillars_block_parent_id_idx" ON "_home_page_v_blocks_pillars_block" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_pillars_block_path_idx" ON "_home_page_v_blocks_pillars_block" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_pillars_block_locale_idx" ON "_home_page_v_blocks_pillars_block" USING btree ("_locale");
  CREATE INDEX "_home_page_v_blocks_vendors_block_links_order_idx" ON "_home_page_v_blocks_vendors_block_links" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_vendors_block_links_parent_id_idx" ON "_home_page_v_blocks_vendors_block_links" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_vendors_block_links_locale_idx" ON "_home_page_v_blocks_vendors_block_links" USING btree ("_locale");
  CREATE INDEX "_home_page_v_blocks_vendors_block_order_idx" ON "_home_page_v_blocks_vendors_block" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_vendors_block_parent_id_idx" ON "_home_page_v_blocks_vendors_block" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_vendors_block_path_idx" ON "_home_page_v_blocks_vendors_block" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_vendors_block_locale_idx" ON "_home_page_v_blocks_vendors_block" USING btree ("_locale");
  CREATE INDEX "_home_page_v_blocks_segments_block_order_idx" ON "_home_page_v_blocks_segments_block" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_segments_block_parent_id_idx" ON "_home_page_v_blocks_segments_block" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_segments_block_path_idx" ON "_home_page_v_blocks_segments_block" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_segments_block_locale_idx" ON "_home_page_v_blocks_segments_block" USING btree ("_locale");
  CREATE INDEX "_home_page_v_blocks_about_block_order_idx" ON "_home_page_v_blocks_about_block" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_about_block_parent_id_idx" ON "_home_page_v_blocks_about_block" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_about_block_path_idx" ON "_home_page_v_blocks_about_block" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_about_block_locale_idx" ON "_home_page_v_blocks_about_block" USING btree ("_locale");
  CREATE INDEX "_home_page_v_blocks_about_block_image_idx" ON "_home_page_v_blocks_about_block" USING btree ("image_id");
  CREATE INDEX "_home_page_v_blocks_stats_block_stats_order_idx" ON "_home_page_v_blocks_stats_block_stats" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_stats_block_stats_parent_id_idx" ON "_home_page_v_blocks_stats_block_stats" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_stats_block_stats_locale_idx" ON "_home_page_v_blocks_stats_block_stats" USING btree ("_locale");
  CREATE INDEX "_home_page_v_blocks_stats_block_order_idx" ON "_home_page_v_blocks_stats_block" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_stats_block_parent_id_idx" ON "_home_page_v_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_stats_block_path_idx" ON "_home_page_v_blocks_stats_block" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_stats_block_locale_idx" ON "_home_page_v_blocks_stats_block" USING btree ("_locale");
  CREATE INDEX "_home_page_v_blocks_cta_block_features_order_idx" ON "_home_page_v_blocks_cta_block_features" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_cta_block_features_parent_id_idx" ON "_home_page_v_blocks_cta_block_features" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_cta_block_features_locale_idx" ON "_home_page_v_blocks_cta_block_features" USING btree ("_locale");
  CREATE INDEX "_home_page_v_blocks_cta_block_buttons_order_idx" ON "_home_page_v_blocks_cta_block_buttons" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_cta_block_buttons_parent_id_idx" ON "_home_page_v_blocks_cta_block_buttons" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_cta_block_buttons_locale_idx" ON "_home_page_v_blocks_cta_block_buttons" USING btree ("_locale");
  CREATE INDEX "_home_page_v_blocks_cta_block_order_idx" ON "_home_page_v_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_cta_block_parent_id_idx" ON "_home_page_v_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_cta_block_path_idx" ON "_home_page_v_blocks_cta_block" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_cta_block_locale_idx" ON "_home_page_v_blocks_cta_block" USING btree ("_locale");
  CREATE INDEX "_home_page_v_blocks_why_us_block_reasons_order_idx" ON "_home_page_v_blocks_why_us_block_reasons" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_why_us_block_reasons_parent_id_idx" ON "_home_page_v_blocks_why_us_block_reasons" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_why_us_block_reasons_locale_idx" ON "_home_page_v_blocks_why_us_block_reasons" USING btree ("_locale");
  CREATE INDEX "_home_page_v_blocks_why_us_block_order_idx" ON "_home_page_v_blocks_why_us_block" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_why_us_block_parent_id_idx" ON "_home_page_v_blocks_why_us_block" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_why_us_block_path_idx" ON "_home_page_v_blocks_why_us_block" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_why_us_block_locale_idx" ON "_home_page_v_blocks_why_us_block" USING btree ("_locale");
  CREATE INDEX "_home_page_v_blocks_guarantees_block_guarantees_order_idx" ON "_home_page_v_blocks_guarantees_block_guarantees" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_guarantees_block_guarantees_parent_id_idx" ON "_home_page_v_blocks_guarantees_block_guarantees" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_guarantees_block_guarantees_locale_idx" ON "_home_page_v_blocks_guarantees_block_guarantees" USING btree ("_locale");
  CREATE INDEX "_home_page_v_blocks_guarantees_block_order_idx" ON "_home_page_v_blocks_guarantees_block" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_guarantees_block_parent_id_idx" ON "_home_page_v_blocks_guarantees_block" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_guarantees_block_path_idx" ON "_home_page_v_blocks_guarantees_block" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_guarantees_block_locale_idx" ON "_home_page_v_blocks_guarantees_block" USING btree ("_locale");
  CREATE INDEX "_plat_v_order_idx" ON "_plat_v" USING btree ("_order");
  CREATE INDEX "_plat_v_parent_id_idx" ON "_plat_v" USING btree ("_parent_id");
  CREATE INDEX "_plat_v_locale_idx" ON "_plat_v" USING btree ("_locale");
  CREATE INDEX "_home_page_v_blocks_social_proof_badges_block_order_idx" ON "_home_page_v_blocks_social_proof_badges_block" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_social_proof_badges_block_parent_id_idx" ON "_home_page_v_blocks_social_proof_badges_block" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_social_proof_badges_block_path_idx" ON "_home_page_v_blocks_social_proof_badges_block" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_social_proof_badges_block_locale_idx" ON "_home_page_v_blocks_social_proof_badges_block" USING btree ("_locale");
  CREATE INDEX "_home_page_v_parent_idx" ON "_home_page_v" USING btree ("parent_id");
  CREATE INDEX "_home_page_v_version_version_updated_at_idx" ON "_home_page_v" USING btree ("version_updated_at");
  CREATE INDEX "_home_page_v_version_version_created_at_idx" ON "_home_page_v" USING btree ("version_created_at");
  CREATE INDEX "_home_page_v_version_version__status_idx" ON "_home_page_v" USING btree ("version__status");
  CREATE INDEX "_home_page_v_created_at_idx" ON "_home_page_v" USING btree ("created_at");
  CREATE INDEX "_home_page_v_updated_at_idx" ON "_home_page_v" USING btree ("updated_at");
  CREATE INDEX "_home_page_v_snapshot_idx" ON "_home_page_v" USING btree ("snapshot");
  CREATE INDEX "_home_page_v_published_locale_idx" ON "_home_page_v" USING btree ("published_locale");
  CREATE INDEX "_home_page_v_latest_idx" ON "_home_page_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_home_page_v_locales_locale_parent_id_unique" ON "_home_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "legal_pages_updated_at_idx" ON "legal_pages" USING btree ("updated_at");
  CREATE INDEX "legal_pages_created_at_idx" ON "legal_pages" USING btree ("created_at");
  CREATE INDEX "legal_pages__status_idx" ON "legal_pages" USING btree ("_status");
  CREATE UNIQUE INDEX "legal_pages_locales_locale_parent_id_unique" ON "legal_pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_legal_pages_v_parent_idx" ON "_legal_pages_v" USING btree ("parent_id");
  CREATE INDEX "_legal_pages_v_version_version_updated_at_idx" ON "_legal_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_legal_pages_v_version_version_created_at_idx" ON "_legal_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_legal_pages_v_version_version__status_idx" ON "_legal_pages_v" USING btree ("version__status");
  CREATE INDEX "_legal_pages_v_created_at_idx" ON "_legal_pages_v" USING btree ("created_at");
  CREATE INDEX "_legal_pages_v_updated_at_idx" ON "_legal_pages_v" USING btree ("updated_at");
  CREATE INDEX "_legal_pages_v_snapshot_idx" ON "_legal_pages_v" USING btree ("snapshot");
  CREATE INDEX "_legal_pages_v_published_locale_idx" ON "_legal_pages_v" USING btree ("published_locale");
  CREATE INDEX "_legal_pages_v_latest_idx" ON "_legal_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_legal_pages_v_locales_locale_parent_id_unique" ON "_legal_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "menus_items_order_idx" ON "menus_items" USING btree ("_order");
  CREATE INDEX "menus_items_parent_id_idx" ON "menus_items" USING btree ("_parent_id");
  CREATE INDEX "menus_items_locale_idx" ON "menus_items" USING btree ("_locale");
  CREATE INDEX "menus_updated_at_idx" ON "menus" USING btree ("updated_at");
  CREATE INDEX "menus_created_at_idx" ON "menus" USING btree ("created_at");
  CREATE UNIQUE INDEX "menus_locales_locale_parent_id_unique" ON "menus_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "travel_types_slug_idx" ON "travel_types" USING btree ("slug");
  CREATE INDEX "travel_types_status_idx" ON "travel_types" USING btree ("status");
  CREATE INDEX "travel_types_updated_at_idx" ON "travel_types" USING btree ("updated_at");
  CREATE INDEX "travel_types_created_at_idx" ON "travel_types" USING btree ("created_at");
  CREATE INDEX "travel_types__status_idx" ON "travel_types" USING btree ("_status");
  CREATE UNIQUE INDEX "travel_types_locales_locale_parent_id_unique" ON "travel_types_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_travel_types_v_parent_idx" ON "_travel_types_v" USING btree ("parent_id");
  CREATE INDEX "_travel_types_v_version_version_slug_idx" ON "_travel_types_v" USING btree ("version_slug");
  CREATE INDEX "_travel_types_v_version_version_status_idx" ON "_travel_types_v" USING btree ("version_status");
  CREATE INDEX "_travel_types_v_version_version_updated_at_idx" ON "_travel_types_v" USING btree ("version_updated_at");
  CREATE INDEX "_travel_types_v_version_version_created_at_idx" ON "_travel_types_v" USING btree ("version_created_at");
  CREATE INDEX "_travel_types_v_version_version__status_idx" ON "_travel_types_v" USING btree ("version__status");
  CREATE INDEX "_travel_types_v_created_at_idx" ON "_travel_types_v" USING btree ("created_at");
  CREATE INDEX "_travel_types_v_updated_at_idx" ON "_travel_types_v" USING btree ("updated_at");
  CREATE INDEX "_travel_types_v_snapshot_idx" ON "_travel_types_v" USING btree ("snapshot");
  CREATE INDEX "_travel_types_v_published_locale_idx" ON "_travel_types_v" USING btree ("published_locale");
  CREATE INDEX "_travel_types_v_latest_idx" ON "_travel_types_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_travel_types_v_locales_locale_parent_id_unique" ON "_travel_types_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "specialty_experiences_slug_idx" ON "specialty_experiences" USING btree ("slug");
  CREATE INDEX "specialty_experiences_status_idx" ON "specialty_experiences" USING btree ("status");
  CREATE INDEX "specialty_experiences_updated_at_idx" ON "specialty_experiences" USING btree ("updated_at");
  CREATE INDEX "specialty_experiences_created_at_idx" ON "specialty_experiences" USING btree ("created_at");
  CREATE INDEX "specialty_experiences__status_idx" ON "specialty_experiences" USING btree ("_status");
  CREATE UNIQUE INDEX "specialty_experiences_locales_locale_parent_id_unique" ON "specialty_experiences_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_specialty_experiences_v_parent_idx" ON "_specialty_experiences_v" USING btree ("parent_id");
  CREATE INDEX "_specialty_experiences_v_version_version_slug_idx" ON "_specialty_experiences_v" USING btree ("version_slug");
  CREATE INDEX "_specialty_experiences_v_version_version_status_idx" ON "_specialty_experiences_v" USING btree ("version_status");
  CREATE INDEX "_specialty_experiences_v_version_version_updated_at_idx" ON "_specialty_experiences_v" USING btree ("version_updated_at");
  CREATE INDEX "_specialty_experiences_v_version_version_created_at_idx" ON "_specialty_experiences_v" USING btree ("version_created_at");
  CREATE INDEX "_specialty_experiences_v_version_version__status_idx" ON "_specialty_experiences_v" USING btree ("version__status");
  CREATE INDEX "_specialty_experiences_v_created_at_idx" ON "_specialty_experiences_v" USING btree ("created_at");
  CREATE INDEX "_specialty_experiences_v_updated_at_idx" ON "_specialty_experiences_v" USING btree ("updated_at");
  CREATE INDEX "_specialty_experiences_v_snapshot_idx" ON "_specialty_experiences_v" USING btree ("snapshot");
  CREATE INDEX "_specialty_experiences_v_published_locale_idx" ON "_specialty_experiences_v" USING btree ("published_locale");
  CREATE INDEX "_specialty_experiences_v_latest_idx" ON "_specialty_experiences_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_specialty_experiences_v_locales_locale_parent_id_unique" ON "_specialty_experiences_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "locations_slug_idx" ON "locations" USING btree ("slug");
  CREATE INDEX "locations_status_idx" ON "locations" USING btree ("status");
  CREATE INDEX "locations_updated_at_idx" ON "locations" USING btree ("updated_at");
  CREATE INDEX "locations_created_at_idx" ON "locations" USING btree ("created_at");
  CREATE INDEX "locations__status_idx" ON "locations" USING btree ("_status");
  CREATE UNIQUE INDEX "locations_locales_locale_parent_id_unique" ON "locations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_locations_v_parent_idx" ON "_locations_v" USING btree ("parent_id");
  CREATE INDEX "_locations_v_version_version_slug_idx" ON "_locations_v" USING btree ("version_slug");
  CREATE INDEX "_locations_v_version_version_status_idx" ON "_locations_v" USING btree ("version_status");
  CREATE INDEX "_locations_v_version_version_updated_at_idx" ON "_locations_v" USING btree ("version_updated_at");
  CREATE INDEX "_locations_v_version_version_created_at_idx" ON "_locations_v" USING btree ("version_created_at");
  CREATE INDEX "_locations_v_version_version__status_idx" ON "_locations_v" USING btree ("version__status");
  CREATE INDEX "_locations_v_created_at_idx" ON "_locations_v" USING btree ("created_at");
  CREATE INDEX "_locations_v_updated_at_idx" ON "_locations_v" USING btree ("updated_at");
  CREATE INDEX "_locations_v_snapshot_idx" ON "_locations_v" USING btree ("snapshot");
  CREATE INDEX "_locations_v_published_locale_idx" ON "_locations_v" USING btree ("published_locale");
  CREATE INDEX "_locations_v_latest_idx" ON "_locations_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_locations_v_locales_locale_parent_id_unique" ON "_locations_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "neighborhoods_highlights_order_idx" ON "neighborhoods_highlights" USING btree ("_order");
  CREATE INDEX "neighborhoods_highlights_parent_id_idx" ON "neighborhoods_highlights" USING btree ("_parent_id");
  CREATE INDEX "neighborhoods_highlights_locale_idx" ON "neighborhoods_highlights" USING btree ("_locale");
  CREATE INDEX "neighborhoods_food_specialties_order_idx" ON "neighborhoods_food_specialties" USING btree ("_order");
  CREATE INDEX "neighborhoods_food_specialties_parent_id_idx" ON "neighborhoods_food_specialties" USING btree ("_parent_id");
  CREATE INDEX "neighborhoods_food_specialties_locale_idx" ON "neighborhoods_food_specialties" USING btree ("_locale");
  CREATE UNIQUE INDEX "neighborhoods_slug_idx" ON "neighborhoods" USING btree ("slug");
  CREATE INDEX "neighborhoods_image_idx" ON "neighborhoods" USING btree ("image_id");
  CREATE INDEX "neighborhoods_updated_at_idx" ON "neighborhoods" USING btree ("updated_at");
  CREATE INDEX "neighborhoods_created_at_idx" ON "neighborhoods" USING btree ("created_at");
  CREATE INDEX "neighborhoods__status_idx" ON "neighborhoods" USING btree ("_status");
  CREATE UNIQUE INDEX "neighborhoods_locales_locale_parent_id_unique" ON "neighborhoods_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "neighborhoods_rels_order_idx" ON "neighborhoods_rels" USING btree ("order");
  CREATE INDEX "neighborhoods_rels_parent_idx" ON "neighborhoods_rels" USING btree ("parent_id");
  CREATE INDEX "neighborhoods_rels_path_idx" ON "neighborhoods_rels" USING btree ("path");
  CREATE INDEX "neighborhoods_rels_tours_id_idx" ON "neighborhoods_rels" USING btree ("tours_id");
  CREATE INDEX "_neighborhoods_v_version_highlights_order_idx" ON "_neighborhoods_v_version_highlights" USING btree ("_order");
  CREATE INDEX "_neighborhoods_v_version_highlights_parent_id_idx" ON "_neighborhoods_v_version_highlights" USING btree ("_parent_id");
  CREATE INDEX "_neighborhoods_v_version_highlights_locale_idx" ON "_neighborhoods_v_version_highlights" USING btree ("_locale");
  CREATE INDEX "_neighborhoods_v_version_food_specialties_order_idx" ON "_neighborhoods_v_version_food_specialties" USING btree ("_order");
  CREATE INDEX "_neighborhoods_v_version_food_specialties_parent_id_idx" ON "_neighborhoods_v_version_food_specialties" USING btree ("_parent_id");
  CREATE INDEX "_neighborhoods_v_version_food_specialties_locale_idx" ON "_neighborhoods_v_version_food_specialties" USING btree ("_locale");
  CREATE INDEX "_neighborhoods_v_parent_idx" ON "_neighborhoods_v" USING btree ("parent_id");
  CREATE INDEX "_neighborhoods_v_version_version_slug_idx" ON "_neighborhoods_v" USING btree ("version_slug");
  CREATE INDEX "_neighborhoods_v_version_version_image_idx" ON "_neighborhoods_v" USING btree ("version_image_id");
  CREATE INDEX "_neighborhoods_v_version_version_updated_at_idx" ON "_neighborhoods_v" USING btree ("version_updated_at");
  CREATE INDEX "_neighborhoods_v_version_version_created_at_idx" ON "_neighborhoods_v" USING btree ("version_created_at");
  CREATE INDEX "_neighborhoods_v_version_version__status_idx" ON "_neighborhoods_v" USING btree ("version__status");
  CREATE INDEX "_neighborhoods_v_created_at_idx" ON "_neighborhoods_v" USING btree ("created_at");
  CREATE INDEX "_neighborhoods_v_updated_at_idx" ON "_neighborhoods_v" USING btree ("updated_at");
  CREATE INDEX "_neighborhoods_v_snapshot_idx" ON "_neighborhoods_v" USING btree ("snapshot");
  CREATE INDEX "_neighborhoods_v_published_locale_idx" ON "_neighborhoods_v" USING btree ("published_locale");
  CREATE INDEX "_neighborhoods_v_latest_idx" ON "_neighborhoods_v" USING btree ("latest");
  CREATE INDEX "_neighborhoods_v_autosave_idx" ON "_neighborhoods_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_neighborhoods_v_locales_locale_parent_id_unique" ON "_neighborhoods_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_neighborhoods_v_rels_order_idx" ON "_neighborhoods_v_rels" USING btree ("order");
  CREATE INDEX "_neighborhoods_v_rels_parent_idx" ON "_neighborhoods_v_rels" USING btree ("parent_id");
  CREATE INDEX "_neighborhoods_v_rels_path_idx" ON "_neighborhoods_v_rels" USING btree ("path");
  CREATE INDEX "_neighborhoods_v_rels_tours_id_idx" ON "_neighborhoods_v_rels" USING btree ("tours_id");
  CREATE INDEX "site_settings_social_proof_platforms_order_idx" ON "site_settings_social_proof_platforms" USING btree ("_order");
  CREATE INDEX "site_settings_social_proof_platforms_parent_id_idx" ON "site_settings_social_proof_platforms" USING btree ("_parent_id");
  CREATE INDEX "site_settings_og_image_idx" ON "site_settings" USING btree ("og_image_id");
  CREATE INDEX "site_settings_hero_image_idx" ON "site_settings" USING btree ("hero_image_id");
  CREATE INDEX "site_settings_updated_at_idx" ON "site_settings" USING btree ("updated_at");
  CREATE INDEX "site_settings_created_at_idx" ON "site_settings" USING btree ("created_at");
  CREATE INDEX "site_settings__status_idx" ON "site_settings" USING btree ("_status");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_settings_v_version_social_proof_platforms_order_idx" ON "_site_settings_v_version_social_proof_platforms" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_social_proof_platforms_parent_id_idx" ON "_site_settings_v_version_social_proof_platforms" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_parent_idx" ON "_site_settings_v" USING btree ("parent_id");
  CREATE INDEX "_site_settings_v_version_version_og_image_idx" ON "_site_settings_v" USING btree ("version_og_image_id");
  CREATE INDEX "_site_settings_v_version_version_hero_image_idx" ON "_site_settings_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_site_settings_v_version_version_updated_at_idx" ON "_site_settings_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_settings_v_version_version_created_at_idx" ON "_site_settings_v" USING btree ("version_created_at");
  CREATE INDEX "_site_settings_v_version_version__status_idx" ON "_site_settings_v" USING btree ("version__status");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "_site_settings_v_snapshot_idx" ON "_site_settings_v" USING btree ("snapshot");
  CREATE INDEX "_site_settings_v_published_locale_idx" ON "_site_settings_v" USING btree ("published_locale");
  CREATE INDEX "_site_settings_v_latest_idx" ON "_site_settings_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_site_settings_v_locales_locale_parent_id_unique" ON "_site_settings_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "comparison_page_competitors_order_idx" ON "comparison_page_competitors" USING btree ("_order");
  CREATE INDEX "comparison_page_competitors_parent_id_idx" ON "comparison_page_competitors" USING btree ("_parent_id");
  CREATE INDEX "comparison_page_competitors_locale_idx" ON "comparison_page_competitors" USING btree ("_locale");
  CREATE INDEX "comparison_page_comparison_rows_competitor_values_order_idx" ON "comparison_page_comparison_rows_competitor_values" USING btree ("_order");
  CREATE INDEX "comparison_page_comparison_rows_competitor_values_parent_id_idx" ON "comparison_page_comparison_rows_competitor_values" USING btree ("_parent_id");
  CREATE INDEX "comparison_page_comparison_rows_competitor_values_locale_idx" ON "comparison_page_comparison_rows_competitor_values" USING btree ("_locale");
  CREATE INDEX "comparison_page_comparison_rows_order_idx" ON "comparison_page_comparison_rows" USING btree ("_order");
  CREATE INDEX "comparison_page_comparison_rows_parent_id_idx" ON "comparison_page_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX "comparison_page_comparison_rows_locale_idx" ON "comparison_page_comparison_rows" USING btree ("_locale");
  CREATE INDEX "comparison_page_trust_badges_order_idx" ON "comparison_page_trust_badges" USING btree ("_order");
  CREATE INDEX "comparison_page_trust_badges_parent_id_idx" ON "comparison_page_trust_badges" USING btree ("_parent_id");
  CREATE INDEX "comparison_page_trust_badges_locale_idx" ON "comparison_page_trust_badges" USING btree ("_locale");
  CREATE INDEX "comparison_page_updated_at_idx" ON "comparison_page" USING btree ("updated_at");
  CREATE INDEX "comparison_page_created_at_idx" ON "comparison_page" USING btree ("created_at");
  CREATE INDEX "comparison_page__status_idx" ON "comparison_page" USING btree ("_status");
  CREATE UNIQUE INDEX "comparison_page_locales_locale_parent_id_unique" ON "comparison_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_comparison_page_v_version_competitors_order_idx" ON "_comparison_page_v_version_competitors" USING btree ("_order");
  CREATE INDEX "_comparison_page_v_version_competitors_parent_id_idx" ON "_comparison_page_v_version_competitors" USING btree ("_parent_id");
  CREATE INDEX "_comparison_page_v_version_competitors_locale_idx" ON "_comparison_page_v_version_competitors" USING btree ("_locale");
  CREATE INDEX "_comparison_page_v_version_comparison_rows_competitor_values_order_idx" ON "_comparison_page_v_version_comparison_rows_competitor_values" USING btree ("_order");
  CREATE INDEX "_comparison_page_v_version_comparison_rows_competitor_values_parent_id_idx" ON "_comparison_page_v_version_comparison_rows_competitor_values" USING btree ("_parent_id");
  CREATE INDEX "_comparison_page_v_version_comparison_rows_competitor_values_locale_idx" ON "_comparison_page_v_version_comparison_rows_competitor_values" USING btree ("_locale");
  CREATE INDEX "_comparison_page_v_version_comparison_rows_order_idx" ON "_comparison_page_v_version_comparison_rows" USING btree ("_order");
  CREATE INDEX "_comparison_page_v_version_comparison_rows_parent_id_idx" ON "_comparison_page_v_version_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX "_comparison_page_v_version_comparison_rows_locale_idx" ON "_comparison_page_v_version_comparison_rows" USING btree ("_locale");
  CREATE INDEX "_comparison_page_v_version_trust_badges_order_idx" ON "_comparison_page_v_version_trust_badges" USING btree ("_order");
  CREATE INDEX "_comparison_page_v_version_trust_badges_parent_id_idx" ON "_comparison_page_v_version_trust_badges" USING btree ("_parent_id");
  CREATE INDEX "_comparison_page_v_version_trust_badges_locale_idx" ON "_comparison_page_v_version_trust_badges" USING btree ("_locale");
  CREATE INDEX "_comparison_page_v_parent_idx" ON "_comparison_page_v" USING btree ("parent_id");
  CREATE INDEX "_comparison_page_v_version_version_updated_at_idx" ON "_comparison_page_v" USING btree ("version_updated_at");
  CREATE INDEX "_comparison_page_v_version_version_created_at_idx" ON "_comparison_page_v" USING btree ("version_created_at");
  CREATE INDEX "_comparison_page_v_version_version__status_idx" ON "_comparison_page_v" USING btree ("version__status");
  CREATE INDEX "_comparison_page_v_created_at_idx" ON "_comparison_page_v" USING btree ("created_at");
  CREATE INDEX "_comparison_page_v_updated_at_idx" ON "_comparison_page_v" USING btree ("updated_at");
  CREATE INDEX "_comparison_page_v_snapshot_idx" ON "_comparison_page_v" USING btree ("snapshot");
  CREATE INDEX "_comparison_page_v_published_locale_idx" ON "_comparison_page_v" USING btree ("published_locale");
  CREATE INDEX "_comparison_page_v_latest_idx" ON "_comparison_page_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_comparison_page_v_locales_locale_parent_id_unique" ON "_comparison_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "how_it_works_page_steps_order_idx" ON "how_it_works_page_steps" USING btree ("_order");
  CREATE INDEX "how_it_works_page_steps_parent_id_idx" ON "how_it_works_page_steps" USING btree ("_parent_id");
  CREATE INDEX "how_it_works_page_steps_locale_idx" ON "how_it_works_page_steps" USING btree ("_locale");
  CREATE INDEX "how_it_works_page_inclusions_order_idx" ON "how_it_works_page_inclusions" USING btree ("_order");
  CREATE INDEX "how_it_works_page_inclusions_parent_id_idx" ON "how_it_works_page_inclusions" USING btree ("_parent_id");
  CREATE INDEX "how_it_works_page_inclusions_locale_idx" ON "how_it_works_page_inclusions" USING btree ("_locale");
  CREATE INDEX "how_it_works_page_formats_order_idx" ON "how_it_works_page_formats" USING btree ("_order");
  CREATE INDEX "how_it_works_page_formats_parent_id_idx" ON "how_it_works_page_formats" USING btree ("_parent_id");
  CREATE INDEX "how_it_works_page_formats_locale_idx" ON "how_it_works_page_formats" USING btree ("_locale");
  CREATE INDEX "how_it_works_page_updated_at_idx" ON "how_it_works_page" USING btree ("updated_at");
  CREATE INDEX "how_it_works_page_created_at_idx" ON "how_it_works_page" USING btree ("created_at");
  CREATE INDEX "how_it_works_page__status_idx" ON "how_it_works_page" USING btree ("_status");
  CREATE UNIQUE INDEX "how_it_works_page_locales_locale_parent_id_unique" ON "how_it_works_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_how_it_works_page_v_version_steps_order_idx" ON "_how_it_works_page_v_version_steps" USING btree ("_order");
  CREATE INDEX "_how_it_works_page_v_version_steps_parent_id_idx" ON "_how_it_works_page_v_version_steps" USING btree ("_parent_id");
  CREATE INDEX "_how_it_works_page_v_version_steps_locale_idx" ON "_how_it_works_page_v_version_steps" USING btree ("_locale");
  CREATE INDEX "_how_it_works_page_v_version_inclusions_order_idx" ON "_how_it_works_page_v_version_inclusions" USING btree ("_order");
  CREATE INDEX "_how_it_works_page_v_version_inclusions_parent_id_idx" ON "_how_it_works_page_v_version_inclusions" USING btree ("_parent_id");
  CREATE INDEX "_how_it_works_page_v_version_inclusions_locale_idx" ON "_how_it_works_page_v_version_inclusions" USING btree ("_locale");
  CREATE INDEX "_how_it_works_page_v_version_formats_order_idx" ON "_how_it_works_page_v_version_formats" USING btree ("_order");
  CREATE INDEX "_how_it_works_page_v_version_formats_parent_id_idx" ON "_how_it_works_page_v_version_formats" USING btree ("_parent_id");
  CREATE INDEX "_how_it_works_page_v_version_formats_locale_idx" ON "_how_it_works_page_v_version_formats" USING btree ("_locale");
  CREATE INDEX "_how_it_works_page_v_parent_idx" ON "_how_it_works_page_v" USING btree ("parent_id");
  CREATE INDEX "_how_it_works_page_v_version_version_updated_at_idx" ON "_how_it_works_page_v" USING btree ("version_updated_at");
  CREATE INDEX "_how_it_works_page_v_version_version_created_at_idx" ON "_how_it_works_page_v" USING btree ("version_created_at");
  CREATE INDEX "_how_it_works_page_v_version_version__status_idx" ON "_how_it_works_page_v" USING btree ("version__status");
  CREATE INDEX "_how_it_works_page_v_created_at_idx" ON "_how_it_works_page_v" USING btree ("created_at");
  CREATE INDEX "_how_it_works_page_v_updated_at_idx" ON "_how_it_works_page_v" USING btree ("updated_at");
  CREATE INDEX "_how_it_works_page_v_snapshot_idx" ON "_how_it_works_page_v" USING btree ("snapshot");
  CREATE INDEX "_how_it_works_page_v_published_locale_idx" ON "_how_it_works_page_v" USING btree ("published_locale");
  CREATE INDEX "_how_it_works_page_v_latest_idx" ON "_how_it_works_page_v" USING btree ("latest");
  CREATE INDEX "_how_it_works_page_v_autosave_idx" ON "_how_it_works_page_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_how_it_works_page_v_locales_locale_parent_id_unique" ON "_how_it_works_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "how_to_prepare_page_what_to_wear_order_idx" ON "how_to_prepare_page_what_to_wear" USING btree ("_order");
  CREATE INDEX "how_to_prepare_page_what_to_wear_parent_id_idx" ON "how_to_prepare_page_what_to_wear" USING btree ("_parent_id");
  CREATE INDEX "how_to_prepare_page_what_to_wear_locale_idx" ON "how_to_prepare_page_what_to_wear" USING btree ("_locale");
  CREATE INDEX "how_to_prepare_page_what_to_bring_order_idx" ON "how_to_prepare_page_what_to_bring" USING btree ("_order");
  CREATE INDEX "how_to_prepare_page_what_to_bring_parent_id_idx" ON "how_to_prepare_page_what_to_bring" USING btree ("_parent_id");
  CREATE INDEX "how_to_prepare_page_what_to_bring_locale_idx" ON "how_to_prepare_page_what_to_bring" USING btree ("_locale");
  CREATE INDEX "how_to_prepare_page_what_to_expect_order_idx" ON "how_to_prepare_page_what_to_expect" USING btree ("_order");
  CREATE INDEX "how_to_prepare_page_what_to_expect_parent_id_idx" ON "how_to_prepare_page_what_to_expect" USING btree ("_parent_id");
  CREATE INDEX "how_to_prepare_page_what_to_expect_locale_idx" ON "how_to_prepare_page_what_to_expect" USING btree ("_locale");
  CREATE INDEX "how_to_prepare_page_dietary_notes_order_idx" ON "how_to_prepare_page_dietary_notes" USING btree ("_order");
  CREATE INDEX "how_to_prepare_page_dietary_notes_parent_id_idx" ON "how_to_prepare_page_dietary_notes" USING btree ("_parent_id");
  CREATE INDEX "how_to_prepare_page_dietary_notes_locale_idx" ON "how_to_prepare_page_dietary_notes" USING btree ("_locale");
  CREATE INDEX "how_to_prepare_page_hero_image_idx" ON "how_to_prepare_page" USING btree ("hero_image_id");
  CREATE INDEX "how_to_prepare_page_updated_at_idx" ON "how_to_prepare_page" USING btree ("updated_at");
  CREATE INDEX "how_to_prepare_page_created_at_idx" ON "how_to_prepare_page" USING btree ("created_at");
  CREATE INDEX "how_to_prepare_page__status_idx" ON "how_to_prepare_page" USING btree ("_status");
  CREATE UNIQUE INDEX "how_to_prepare_page_locales_locale_parent_id_unique" ON "how_to_prepare_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_how_to_prepare_page_v_version_what_to_wear_order_idx" ON "_how_to_prepare_page_v_version_what_to_wear" USING btree ("_order");
  CREATE INDEX "_how_to_prepare_page_v_version_what_to_wear_parent_id_idx" ON "_how_to_prepare_page_v_version_what_to_wear" USING btree ("_parent_id");
  CREATE INDEX "_how_to_prepare_page_v_version_what_to_wear_locale_idx" ON "_how_to_prepare_page_v_version_what_to_wear" USING btree ("_locale");
  CREATE INDEX "_how_to_prepare_page_v_version_what_to_bring_order_idx" ON "_how_to_prepare_page_v_version_what_to_bring" USING btree ("_order");
  CREATE INDEX "_how_to_prepare_page_v_version_what_to_bring_parent_id_idx" ON "_how_to_prepare_page_v_version_what_to_bring" USING btree ("_parent_id");
  CREATE INDEX "_how_to_prepare_page_v_version_what_to_bring_locale_idx" ON "_how_to_prepare_page_v_version_what_to_bring" USING btree ("_locale");
  CREATE INDEX "_how_to_prepare_page_v_version_what_to_expect_order_idx" ON "_how_to_prepare_page_v_version_what_to_expect" USING btree ("_order");
  CREATE INDEX "_how_to_prepare_page_v_version_what_to_expect_parent_id_idx" ON "_how_to_prepare_page_v_version_what_to_expect" USING btree ("_parent_id");
  CREATE INDEX "_how_to_prepare_page_v_version_what_to_expect_locale_idx" ON "_how_to_prepare_page_v_version_what_to_expect" USING btree ("_locale");
  CREATE INDEX "_how_to_prepare_page_v_version_dietary_notes_order_idx" ON "_how_to_prepare_page_v_version_dietary_notes" USING btree ("_order");
  CREATE INDEX "_how_to_prepare_page_v_version_dietary_notes_parent_id_idx" ON "_how_to_prepare_page_v_version_dietary_notes" USING btree ("_parent_id");
  CREATE INDEX "_how_to_prepare_page_v_version_dietary_notes_locale_idx" ON "_how_to_prepare_page_v_version_dietary_notes" USING btree ("_locale");
  CREATE INDEX "_how_to_prepare_page_v_parent_idx" ON "_how_to_prepare_page_v" USING btree ("parent_id");
  CREATE INDEX "_how_to_prepare_page_v_version_version_hero_image_idx" ON "_how_to_prepare_page_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_how_to_prepare_page_v_version_version_updated_at_idx" ON "_how_to_prepare_page_v" USING btree ("version_updated_at");
  CREATE INDEX "_how_to_prepare_page_v_version_version_created_at_idx" ON "_how_to_prepare_page_v" USING btree ("version_created_at");
  CREATE INDEX "_how_to_prepare_page_v_version_version__status_idx" ON "_how_to_prepare_page_v" USING btree ("version__status");
  CREATE INDEX "_how_to_prepare_page_v_created_at_idx" ON "_how_to_prepare_page_v" USING btree ("created_at");
  CREATE INDEX "_how_to_prepare_page_v_updated_at_idx" ON "_how_to_prepare_page_v" USING btree ("updated_at");
  CREATE INDEX "_how_to_prepare_page_v_snapshot_idx" ON "_how_to_prepare_page_v" USING btree ("snapshot");
  CREATE INDEX "_how_to_prepare_page_v_published_locale_idx" ON "_how_to_prepare_page_v" USING btree ("published_locale");
  CREATE INDEX "_how_to_prepare_page_v_latest_idx" ON "_how_to_prepare_page_v" USING btree ("latest");
  CREATE INDEX "_how_to_prepare_page_v_autosave_idx" ON "_how_to_prepare_page_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_how_to_prepare_page_v_locales_locale_parent_id_unique" ON "_how_to_prepare_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "corporate_groups_page_offer_perfect_for_order_idx" ON "corporate_groups_page_offer_perfect_for" USING btree ("_order");
  CREATE INDEX "corporate_groups_page_offer_perfect_for_parent_id_idx" ON "corporate_groups_page_offer_perfect_for" USING btree ("_parent_id");
  CREATE INDEX "corporate_groups_page_offer_perfect_for_locale_idx" ON "corporate_groups_page_offer_perfect_for" USING btree ("_locale");
  CREATE INDEX "corporate_groups_page_benefit_cards_order_idx" ON "corporate_groups_page_benefit_cards" USING btree ("_order");
  CREATE INDEX "corporate_groups_page_benefit_cards_parent_id_idx" ON "corporate_groups_page_benefit_cards" USING btree ("_parent_id");
  CREATE INDEX "corporate_groups_page_benefit_cards_locale_idx" ON "corporate_groups_page_benefit_cards" USING btree ("_locale");
  CREATE INDEX "corporate_groups_page_how_steps_order_idx" ON "corporate_groups_page_how_steps" USING btree ("_order");
  CREATE INDEX "corporate_groups_page_how_steps_parent_id_idx" ON "corporate_groups_page_how_steps" USING btree ("_parent_id");
  CREATE INDEX "corporate_groups_page_how_steps_locale_idx" ON "corporate_groups_page_how_steps" USING btree ("_locale");
  CREATE INDEX "corporate_groups_page_updated_at_idx" ON "corporate_groups_page" USING btree ("updated_at");
  CREATE INDEX "corporate_groups_page_created_at_idx" ON "corporate_groups_page" USING btree ("created_at");
  CREATE INDEX "corporate_groups_page__status_idx" ON "corporate_groups_page" USING btree ("_status");
  CREATE UNIQUE INDEX "corporate_groups_page_locales_locale_parent_id_unique" ON "corporate_groups_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_corporate_groups_page_v_version_offer_perfect_for_order_idx" ON "_corporate_groups_page_v_version_offer_perfect_for" USING btree ("_order");
  CREATE INDEX "_corporate_groups_page_v_version_offer_perfect_for_parent_id_idx" ON "_corporate_groups_page_v_version_offer_perfect_for" USING btree ("_parent_id");
  CREATE INDEX "_corporate_groups_page_v_version_offer_perfect_for_locale_idx" ON "_corporate_groups_page_v_version_offer_perfect_for" USING btree ("_locale");
  CREATE INDEX "_corporate_groups_page_v_version_benefit_cards_order_idx" ON "_corporate_groups_page_v_version_benefit_cards" USING btree ("_order");
  CREATE INDEX "_corporate_groups_page_v_version_benefit_cards_parent_id_idx" ON "_corporate_groups_page_v_version_benefit_cards" USING btree ("_parent_id");
  CREATE INDEX "_corporate_groups_page_v_version_benefit_cards_locale_idx" ON "_corporate_groups_page_v_version_benefit_cards" USING btree ("_locale");
  CREATE INDEX "_corporate_groups_page_v_version_how_steps_order_idx" ON "_corporate_groups_page_v_version_how_steps" USING btree ("_order");
  CREATE INDEX "_corporate_groups_page_v_version_how_steps_parent_id_idx" ON "_corporate_groups_page_v_version_how_steps" USING btree ("_parent_id");
  CREATE INDEX "_corporate_groups_page_v_version_how_steps_locale_idx" ON "_corporate_groups_page_v_version_how_steps" USING btree ("_locale");
  CREATE INDEX "_corporate_groups_page_v_parent_idx" ON "_corporate_groups_page_v" USING btree ("parent_id");
  CREATE INDEX "_corporate_groups_page_v_version_version_updated_at_idx" ON "_corporate_groups_page_v" USING btree ("version_updated_at");
  CREATE INDEX "_corporate_groups_page_v_version_version_created_at_idx" ON "_corporate_groups_page_v" USING btree ("version_created_at");
  CREATE INDEX "_corporate_groups_page_v_version_version__status_idx" ON "_corporate_groups_page_v" USING btree ("version__status");
  CREATE INDEX "_corporate_groups_page_v_created_at_idx" ON "_corporate_groups_page_v" USING btree ("created_at");
  CREATE INDEX "_corporate_groups_page_v_updated_at_idx" ON "_corporate_groups_page_v" USING btree ("updated_at");
  CREATE INDEX "_corporate_groups_page_v_snapshot_idx" ON "_corporate_groups_page_v" USING btree ("snapshot");
  CREATE INDEX "_corporate_groups_page_v_published_locale_idx" ON "_corporate_groups_page_v" USING btree ("published_locale");
  CREATE INDEX "_corporate_groups_page_v_latest_idx" ON "_corporate_groups_page_v" USING btree ("latest");
  CREATE INDEX "_corporate_groups_page_v_autosave_idx" ON "_corporate_groups_page_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_corporate_groups_page_v_locales_locale_parent_id_unique" ON "_corporate_groups_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "track_record_page_stats_order_idx" ON "track_record_page_stats" USING btree ("_order");
  CREATE INDEX "track_record_page_stats_parent_id_idx" ON "track_record_page_stats" USING btree ("_parent_id");
  CREATE INDEX "track_record_page_stats_locale_idx" ON "track_record_page_stats" USING btree ("_locale");
  CREATE INDEX "track_record_page_segments_order_idx" ON "track_record_page_segments" USING btree ("_order");
  CREATE INDEX "track_record_page_segments_parent_id_idx" ON "track_record_page_segments" USING btree ("_parent_id");
  CREATE INDEX "track_record_page_segments_locale_idx" ON "track_record_page_segments" USING btree ("_locale");
  CREATE INDEX "track_record_page_case_studies_order_idx" ON "track_record_page_case_studies" USING btree ("_order");
  CREATE INDEX "track_record_page_case_studies_parent_id_idx" ON "track_record_page_case_studies" USING btree ("_parent_id");
  CREATE INDEX "track_record_page_case_studies_locale_idx" ON "track_record_page_case_studies" USING btree ("_locale");
  CREATE INDEX "track_record_page_press_order_idx" ON "track_record_page_press" USING btree ("_order");
  CREATE INDEX "track_record_page_press_parent_id_idx" ON "track_record_page_press" USING btree ("_parent_id");
  CREATE INDEX "track_record_page_awards_order_idx" ON "track_record_page_awards" USING btree ("_order");
  CREATE INDEX "track_record_page_awards_parent_id_idx" ON "track_record_page_awards" USING btree ("_parent_id");
  CREATE INDEX "track_record_page_awards_locale_idx" ON "track_record_page_awards" USING btree ("_locale");
  CREATE INDEX "track_record_page_updated_at_idx" ON "track_record_page" USING btree ("updated_at");
  CREATE INDEX "track_record_page_created_at_idx" ON "track_record_page" USING btree ("created_at");
  CREATE INDEX "track_record_page__status_idx" ON "track_record_page" USING btree ("_status");
  CREATE UNIQUE INDEX "track_record_page_locales_locale_parent_id_unique" ON "track_record_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_track_record_page_v_version_stats_order_idx" ON "_track_record_page_v_version_stats" USING btree ("_order");
  CREATE INDEX "_track_record_page_v_version_stats_parent_id_idx" ON "_track_record_page_v_version_stats" USING btree ("_parent_id");
  CREATE INDEX "_track_record_page_v_version_stats_locale_idx" ON "_track_record_page_v_version_stats" USING btree ("_locale");
  CREATE INDEX "_track_record_page_v_version_segments_order_idx" ON "_track_record_page_v_version_segments" USING btree ("_order");
  CREATE INDEX "_track_record_page_v_version_segments_parent_id_idx" ON "_track_record_page_v_version_segments" USING btree ("_parent_id");
  CREATE INDEX "_track_record_page_v_version_segments_locale_idx" ON "_track_record_page_v_version_segments" USING btree ("_locale");
  CREATE INDEX "_track_record_page_v_version_case_studies_order_idx" ON "_track_record_page_v_version_case_studies" USING btree ("_order");
  CREATE INDEX "_track_record_page_v_version_case_studies_parent_id_idx" ON "_track_record_page_v_version_case_studies" USING btree ("_parent_id");
  CREATE INDEX "_track_record_page_v_version_case_studies_locale_idx" ON "_track_record_page_v_version_case_studies" USING btree ("_locale");
  CREATE INDEX "_track_record_page_v_version_press_order_idx" ON "_track_record_page_v_version_press" USING btree ("_order");
  CREATE INDEX "_track_record_page_v_version_press_parent_id_idx" ON "_track_record_page_v_version_press" USING btree ("_parent_id");
  CREATE INDEX "_track_record_page_v_version_awards_order_idx" ON "_track_record_page_v_version_awards" USING btree ("_order");
  CREATE INDEX "_track_record_page_v_version_awards_parent_id_idx" ON "_track_record_page_v_version_awards" USING btree ("_parent_id");
  CREATE INDEX "_track_record_page_v_version_awards_locale_idx" ON "_track_record_page_v_version_awards" USING btree ("_locale");
  CREATE INDEX "_track_record_page_v_parent_idx" ON "_track_record_page_v" USING btree ("parent_id");
  CREATE INDEX "_track_record_page_v_version_version_updated_at_idx" ON "_track_record_page_v" USING btree ("version_updated_at");
  CREATE INDEX "_track_record_page_v_version_version_created_at_idx" ON "_track_record_page_v" USING btree ("version_created_at");
  CREATE INDEX "_track_record_page_v_version_version__status_idx" ON "_track_record_page_v" USING btree ("version__status");
  CREATE INDEX "_track_record_page_v_created_at_idx" ON "_track_record_page_v" USING btree ("created_at");
  CREATE INDEX "_track_record_page_v_updated_at_idx" ON "_track_record_page_v" USING btree ("updated_at");
  CREATE INDEX "_track_record_page_v_snapshot_idx" ON "_track_record_page_v" USING btree ("snapshot");
  CREATE INDEX "_track_record_page_v_published_locale_idx" ON "_track_record_page_v" USING btree ("published_locale");
  CREATE INDEX "_track_record_page_v_latest_idx" ON "_track_record_page_v" USING btree ("latest");
  CREATE INDEX "_track_record_page_v_autosave_idx" ON "_track_record_page_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_track_record_page_v_locales_locale_parent_id_unique" ON "_track_record_page_v_locales" USING btree ("_locale","_parent_id");
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
  CREATE INDEX "_private_tours_page_v_snapshot_idx" ON "_private_tours_page_v" USING btree ("snapshot");
  CREATE INDEX "_private_tours_page_v_published_locale_idx" ON "_private_tours_page_v" USING btree ("published_locale");
  CREATE INDEX "_private_tours_page_v_latest_idx" ON "_private_tours_page_v" USING btree ("latest");
  CREATE INDEX "_private_tours_page_v_autosave_idx" ON "_private_tours_page_v" USING btree ("autosave");
  CREATE INDEX "directions_page_meeting_points_order_idx" ON "directions_page_meeting_points" USING btree ("_order");
  CREATE INDEX "directions_page_meeting_points_parent_id_idx" ON "directions_page_meeting_points" USING btree ("_parent_id");
  CREATE INDEX "directions_page_meeting_points_locale_idx" ON "directions_page_meeting_points" USING btree ("_locale");
  CREATE INDEX "directions_page_general_tips_order_idx" ON "directions_page_general_tips" USING btree ("_order");
  CREATE INDEX "directions_page_general_tips_parent_id_idx" ON "directions_page_general_tips" USING btree ("_parent_id");
  CREATE INDEX "directions_page_general_tips_locale_idx" ON "directions_page_general_tips" USING btree ("_locale");
  CREATE INDEX "directions_page_hero_image_idx" ON "directions_page" USING btree ("hero_image_id");
  CREATE INDEX "directions_page_updated_at_idx" ON "directions_page" USING btree ("updated_at");
  CREATE INDEX "directions_page_created_at_idx" ON "directions_page" USING btree ("created_at");
  CREATE INDEX "directions_page__status_idx" ON "directions_page" USING btree ("_status");
  CREATE UNIQUE INDEX "directions_page_locales_locale_parent_id_unique" ON "directions_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_directions_page_v_version_meeting_points_order_idx" ON "_directions_page_v_version_meeting_points" USING btree ("_order");
  CREATE INDEX "_directions_page_v_version_meeting_points_parent_id_idx" ON "_directions_page_v_version_meeting_points" USING btree ("_parent_id");
  CREATE INDEX "_directions_page_v_version_meeting_points_locale_idx" ON "_directions_page_v_version_meeting_points" USING btree ("_locale");
  CREATE INDEX "_directions_page_v_version_general_tips_order_idx" ON "_directions_page_v_version_general_tips" USING btree ("_order");
  CREATE INDEX "_directions_page_v_version_general_tips_parent_id_idx" ON "_directions_page_v_version_general_tips" USING btree ("_parent_id");
  CREATE INDEX "_directions_page_v_version_general_tips_locale_idx" ON "_directions_page_v_version_general_tips" USING btree ("_locale");
  CREATE INDEX "_directions_page_v_parent_idx" ON "_directions_page_v" USING btree ("parent_id");
  CREATE INDEX "_directions_page_v_version_version_hero_image_idx" ON "_directions_page_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_directions_page_v_version_version_updated_at_idx" ON "_directions_page_v" USING btree ("version_updated_at");
  CREATE INDEX "_directions_page_v_version_version_created_at_idx" ON "_directions_page_v" USING btree ("version_created_at");
  CREATE INDEX "_directions_page_v_version_version__status_idx" ON "_directions_page_v" USING btree ("version__status");
  CREATE INDEX "_directions_page_v_created_at_idx" ON "_directions_page_v" USING btree ("created_at");
  CREATE INDEX "_directions_page_v_updated_at_idx" ON "_directions_page_v" USING btree ("updated_at");
  CREATE INDEX "_directions_page_v_snapshot_idx" ON "_directions_page_v" USING btree ("snapshot");
  CREATE INDEX "_directions_page_v_published_locale_idx" ON "_directions_page_v" USING btree ("published_locale");
  CREATE INDEX "_directions_page_v_latest_idx" ON "_directions_page_v" USING btree ("latest");
  CREATE INDEX "_directions_page_v_autosave_idx" ON "_directions_page_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_directions_page_v_locales_locale_parent_id_unique" ON "_directions_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tour_quiz_steps_options_order_idx" ON "tour_quiz_steps_options" USING btree ("_order");
  CREATE INDEX "tour_quiz_steps_options_parent_id_idx" ON "tour_quiz_steps_options" USING btree ("_parent_id");
  CREATE INDEX "tour_quiz_steps_options_locale_idx" ON "tour_quiz_steps_options" USING btree ("_locale");
  CREATE INDEX "tour_quiz_steps_order_idx" ON "tour_quiz_steps" USING btree ("_order");
  CREATE INDEX "tour_quiz_steps_parent_id_idx" ON "tour_quiz_steps" USING btree ("_parent_id");
  CREATE INDEX "tour_quiz_steps_locale_idx" ON "tour_quiz_steps" USING btree ("_locale");
  CREATE INDEX "tour_quiz_personalities_order_idx" ON "tour_quiz_personalities" USING btree ("_order");
  CREATE INDEX "tour_quiz_personalities_parent_id_idx" ON "tour_quiz_personalities" USING btree ("_parent_id");
  CREATE INDEX "tour_quiz_personalities_locale_idx" ON "tour_quiz_personalities" USING btree ("_locale");
  CREATE INDEX "tour_quiz_scoring_weights_order_idx" ON "tour_quiz_scoring_weights" USING btree ("_order");
  CREATE INDEX "tour_quiz_scoring_weights_parent_id_idx" ON "tour_quiz_scoring_weights" USING btree ("_parent_id");
  CREATE INDEX "tour_quiz_result_headlines_order_idx" ON "tour_quiz_result_headlines" USING btree ("_order");
  CREATE INDEX "tour_quiz_result_headlines_parent_id_idx" ON "tour_quiz_result_headlines" USING btree ("_parent_id");
  CREATE INDEX "tour_quiz_result_headlines_locale_idx" ON "tour_quiz_result_headlines" USING btree ("_locale");
  CREATE INDEX "tour_quiz_updated_at_idx" ON "tour_quiz" USING btree ("updated_at");
  CREATE INDEX "tour_quiz_created_at_idx" ON "tour_quiz" USING btree ("created_at");
  CREATE INDEX "tour_quiz__status_idx" ON "tour_quiz" USING btree ("_status");
  CREATE UNIQUE INDEX "tour_quiz_locales_locale_parent_id_unique" ON "tour_quiz_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tour_quiz_rels_order_idx" ON "tour_quiz_rels" USING btree ("order");
  CREATE INDEX "tour_quiz_rels_parent_idx" ON "tour_quiz_rels" USING btree ("parent_id");
  CREATE INDEX "tour_quiz_rels_path_idx" ON "tour_quiz_rels" USING btree ("path");
  CREATE INDEX "tour_quiz_rels_tours_id_idx" ON "tour_quiz_rels" USING btree ("tours_id");
  CREATE INDEX "_tour_quiz_v_version_steps_options_order_idx" ON "_tour_quiz_v_version_steps_options" USING btree ("_order");
  CREATE INDEX "_tour_quiz_v_version_steps_options_parent_id_idx" ON "_tour_quiz_v_version_steps_options" USING btree ("_parent_id");
  CREATE INDEX "_tour_quiz_v_version_steps_options_locale_idx" ON "_tour_quiz_v_version_steps_options" USING btree ("_locale");
  CREATE INDEX "_tour_quiz_v_version_steps_order_idx" ON "_tour_quiz_v_version_steps" USING btree ("_order");
  CREATE INDEX "_tour_quiz_v_version_steps_parent_id_idx" ON "_tour_quiz_v_version_steps" USING btree ("_parent_id");
  CREATE INDEX "_tour_quiz_v_version_steps_locale_idx" ON "_tour_quiz_v_version_steps" USING btree ("_locale");
  CREATE INDEX "_tour_quiz_v_version_personalities_order_idx" ON "_tour_quiz_v_version_personalities" USING btree ("_order");
  CREATE INDEX "_tour_quiz_v_version_personalities_parent_id_idx" ON "_tour_quiz_v_version_personalities" USING btree ("_parent_id");
  CREATE INDEX "_tour_quiz_v_version_personalities_locale_idx" ON "_tour_quiz_v_version_personalities" USING btree ("_locale");
  CREATE INDEX "_tour_quiz_v_version_scoring_weights_order_idx" ON "_tour_quiz_v_version_scoring_weights" USING btree ("_order");
  CREATE INDEX "_tour_quiz_v_version_scoring_weights_parent_id_idx" ON "_tour_quiz_v_version_scoring_weights" USING btree ("_parent_id");
  CREATE INDEX "_tour_quiz_v_version_result_headlines_order_idx" ON "_tour_quiz_v_version_result_headlines" USING btree ("_order");
  CREATE INDEX "_tour_quiz_v_version_result_headlines_parent_id_idx" ON "_tour_quiz_v_version_result_headlines" USING btree ("_parent_id");
  CREATE INDEX "_tour_quiz_v_version_result_headlines_locale_idx" ON "_tour_quiz_v_version_result_headlines" USING btree ("_locale");
  CREATE INDEX "_tour_quiz_v_parent_idx" ON "_tour_quiz_v" USING btree ("parent_id");
  CREATE INDEX "_tour_quiz_v_version_version_updated_at_idx" ON "_tour_quiz_v" USING btree ("version_updated_at");
  CREATE INDEX "_tour_quiz_v_version_version_created_at_idx" ON "_tour_quiz_v" USING btree ("version_created_at");
  CREATE INDEX "_tour_quiz_v_version_version__status_idx" ON "_tour_quiz_v" USING btree ("version__status");
  CREATE INDEX "_tour_quiz_v_created_at_idx" ON "_tour_quiz_v" USING btree ("created_at");
  CREATE INDEX "_tour_quiz_v_updated_at_idx" ON "_tour_quiz_v" USING btree ("updated_at");
  CREATE INDEX "_tour_quiz_v_snapshot_idx" ON "_tour_quiz_v" USING btree ("snapshot");
  CREATE INDEX "_tour_quiz_v_published_locale_idx" ON "_tour_quiz_v" USING btree ("published_locale");
  CREATE INDEX "_tour_quiz_v_latest_idx" ON "_tour_quiz_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_tour_quiz_v_locales_locale_parent_id_unique" ON "_tour_quiz_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_tour_quiz_v_rels_order_idx" ON "_tour_quiz_v_rels" USING btree ("order");
  CREATE INDEX "_tour_quiz_v_rels_parent_idx" ON "_tour_quiz_v_rels" USING btree ("parent_id");
  CREATE INDEX "_tour_quiz_v_rels_path_idx" ON "_tour_quiz_v_rels" USING btree ("path");
  CREATE INDEX "_tour_quiz_v_rels_tours_id_idx" ON "_tour_quiz_v_rels" USING btree ("tours_id");
  CREATE INDEX "exports_updated_at_idx" ON "exports" USING btree ("updated_at");
  CREATE INDEX "exports_created_at_idx" ON "exports" USING btree ("created_at");
  CREATE UNIQUE INDEX "exports_filename_idx" ON "exports" USING btree ("filename");
  CREATE INDEX "exports_texts_order_parent" ON "exports_texts" USING btree ("order","parent_id");
  CREATE INDEX "imports_updated_at_idx" ON "imports" USING btree ("updated_at");
  CREATE INDEX "imports_created_at_idx" ON "imports" USING btree ("created_at");
  CREATE UNIQUE INDEX "imports_filename_idx" ON "imports" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_tours_id_idx" ON "payload_locked_documents_rels" USING btree ("tours_id");
  CREATE INDEX "payload_locked_documents_rels_stories_id_idx" ON "payload_locked_documents_rels" USING btree ("stories_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_media_coverage_id_idx" ON "payload_locked_documents_rels" USING btree ("media_coverage_id");
  CREATE INDEX "payload_locked_documents_rels_dietary_options_id_idx" ON "payload_locked_documents_rels" USING btree ("dietary_options_id");
  CREATE INDEX "payload_locked_documents_rels_food_items_id_idx" ON "payload_locked_documents_rels" USING btree ("food_items_id");
  CREATE INDEX "payload_locked_documents_rels_vendors_id_idx" ON "payload_locked_documents_rels" USING btree ("vendors_id");
  CREATE INDEX "payload_locked_documents_rels_landing_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("landing_pages_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_about_page_id_idx" ON "payload_locked_documents_rels" USING btree ("about_page_id");
  CREATE INDEX "payload_locked_documents_rels_contact_page_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_page_id");
  CREATE INDEX "payload_locked_documents_rels_thank_you_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("thank_you_pages_id");
  CREATE INDEX "payload_locked_documents_rels_home_page_id_idx" ON "payload_locked_documents_rels" USING btree ("home_page_id");
  CREATE INDEX "payload_locked_documents_rels_legal_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("legal_pages_id");
  CREATE INDEX "payload_locked_documents_rels_menus_id_idx" ON "payload_locked_documents_rels" USING btree ("menus_id");
  CREATE INDEX "payload_locked_documents_rels_travel_types_id_idx" ON "payload_locked_documents_rels" USING btree ("travel_types_id");
  CREATE INDEX "payload_locked_documents_rels_specialty_experiences_id_idx" ON "payload_locked_documents_rels" USING btree ("specialty_experiences_id");
  CREATE INDEX "payload_locked_documents_rels_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("locations_id");
  CREATE INDEX "payload_locked_documents_rels_neighborhoods_id_idx" ON "payload_locked_documents_rels" USING btree ("neighborhoods_id");
  CREATE INDEX "payload_locked_documents_rels_site_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("site_settings_id");
  CREATE INDEX "payload_locked_documents_rels_comparison_page_id_idx" ON "payload_locked_documents_rels" USING btree ("comparison_page_id");
  CREATE INDEX "payload_locked_documents_rels_how_it_works_page_id_idx" ON "payload_locked_documents_rels" USING btree ("how_it_works_page_id");
  CREATE INDEX "payload_locked_documents_rels_how_to_prepare_page_id_idx" ON "payload_locked_documents_rels" USING btree ("how_to_prepare_page_id");
  CREATE INDEX "payload_locked_documents_rels_corporate_groups_page_id_idx" ON "payload_locked_documents_rels" USING btree ("corporate_groups_page_id");
  CREATE INDEX "payload_locked_documents_rels_track_record_page_id_idx" ON "payload_locked_documents_rels" USING btree ("track_record_page_id");
  CREATE INDEX "payload_locked_documents_rels_private_tours_page_id_idx" ON "payload_locked_documents_rels" USING btree ("private_tours_page_id");
  CREATE INDEX "payload_locked_documents_rels_directions_page_id_idx" ON "payload_locked_documents_rels" USING btree ("directions_page_id");
  CREATE INDEX "payload_locked_documents_rels_tour_quiz_id_idx" ON "payload_locked_documents_rels" USING btree ("tour_quiz_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "tours_gallery_images" CASCADE;
  DROP TABLE "tours_whats_included" CASCADE;
  DROP TABLE "tours_whats_excluded" CASCADE;
  DROP TABLE "tours_highlights" CASCADE;
  DROP TABLE "tours_start_times" CASCADE;
  DROP TABLE "tours_itinerary" CASCADE;
  DROP TABLE "tours_differentiators_tourist" CASCADE;
  DROP TABLE "tours_differentiators_us" CASCADE;
  DROP TABLE "tours_what_to_bring" CASCADE;
  DROP TABLE "tours_languages_offered" CASCADE;
  DROP TABLE "tours_segment_tags" CASCADE;
  DROP TABLE "tours_gallery_image_alts" CASCADE;
  DROP TABLE "tours" CASCADE;
  DROP TABLE "tours_locales" CASCADE;
  DROP TABLE "tours_rels" CASCADE;
  DROP TABLE "_tours_v_version_gallery_images" CASCADE;
  DROP TABLE "_tours_v_version_whats_included" CASCADE;
  DROP TABLE "_tours_v_version_whats_excluded" CASCADE;
  DROP TABLE "_tours_v_version_highlights" CASCADE;
  DROP TABLE "_tours_v_version_start_times" CASCADE;
  DROP TABLE "_tours_v_version_itinerary" CASCADE;
  DROP TABLE "_tours_v_version_differentiators_tourist" CASCADE;
  DROP TABLE "_tours_v_version_differentiators_us" CASCADE;
  DROP TABLE "_tours_v_version_what_to_bring" CASCADE;
  DROP TABLE "_tours_v_version_languages_offered" CASCADE;
  DROP TABLE "_tours_v_version_segment_tags" CASCADE;
  DROP TABLE "_tours_v_version_gallery_image_alts" CASCADE;
  DROP TABLE "_tours_v" CASCADE;
  DROP TABLE "_tours_v_locales" CASCADE;
  DROP TABLE "_tours_v_rels" CASCADE;
  DROP TABLE "stories" CASCADE;
  DROP TABLE "stories_locales" CASCADE;
  DROP TABLE "_stories_v" CASCADE;
  DROP TABLE "_stories_v_locales" CASCADE;
  DROP TABLE "testimonials_page_visibility" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "testimonials_locales" CASCADE;
  DROP TABLE "testimonials_rels" CASCADE;
  DROP TABLE "_testimonials_v_version_page_visibility" CASCADE;
  DROP TABLE "_testimonials_v" CASCADE;
  DROP TABLE "_testimonials_v_locales" CASCADE;
  DROP TABLE "_testimonials_v_rels" CASCADE;
  DROP TABLE "faqs_page_visibility" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_locales" CASCADE;
  DROP TABLE "faqs_texts" CASCADE;
  DROP TABLE "_faqs_v_version_page_visibility" CASCADE;
  DROP TABLE "_faqs_v" CASCADE;
  DROP TABLE "_faqs_v_locales" CASCADE;
  DROP TABLE "_faqs_v_texts" CASCADE;
  DROP TABLE "media_coverage" CASCADE;
  DROP TABLE "media_coverage_locales" CASCADE;
  DROP TABLE "_media_coverage_v" CASCADE;
  DROP TABLE "_media_coverage_v_locales" CASCADE;
  DROP TABLE "dietary_options" CASCADE;
  DROP TABLE "dietary_options_locales" CASCADE;
  DROP TABLE "_dietary_options_v" CASCADE;
  DROP TABLE "_dietary_options_v_locales" CASCADE;
  DROP TABLE "food_items_local_names" CASCADE;
  DROP TABLE "food_items_ingredients" CASCADE;
  DROP TABLE "food_items_allergens" CASCADE;
  DROP TABLE "food_items_flavor_profile" CASCADE;
  DROP TABLE "food_items" CASCADE;
  DROP TABLE "food_items_locales" CASCADE;
  DROP TABLE "food_items_rels" CASCADE;
  DROP TABLE "_food_items_v_version_local_names" CASCADE;
  DROP TABLE "_food_items_v_version_ingredients" CASCADE;
  DROP TABLE "_food_items_v_version_allergens" CASCADE;
  DROP TABLE "_food_items_v_version_flavor_profile" CASCADE;
  DROP TABLE "_food_items_v" CASCADE;
  DROP TABLE "_food_items_v_locales" CASCADE;
  DROP TABLE "_food_items_v_rels" CASCADE;
  DROP TABLE "vendors_operating_hours" CASCADE;
  DROP TABLE "vendors_closed_on" CASCADE;
  DROP TABLE "vendors_payment_methods" CASCADE;
  DROP TABLE "vendors_facilities" CASCADE;
  DROP TABLE "vendors_images_gallery" CASCADE;
  DROP TABLE "vendors_awards" CASCADE;
  DROP TABLE "vendors" CASCADE;
  DROP TABLE "vendors_locales" CASCADE;
  DROP TABLE "vendors_rels" CASCADE;
  DROP TABLE "_vendors_v_version_operating_hours" CASCADE;
  DROP TABLE "_vendors_v_version_closed_on" CASCADE;
  DROP TABLE "_vendors_v_version_payment_methods" CASCADE;
  DROP TABLE "_vendors_v_version_facilities" CASCADE;
  DROP TABLE "_vendors_v_version_images_gallery" CASCADE;
  DROP TABLE "_vendors_v_version_awards" CASCADE;
  DROP TABLE "_vendors_v" CASCADE;
  DROP TABLE "_vendors_v_locales" CASCADE;
  DROP TABLE "_vendors_v_rels" CASCADE;
  DROP TABLE "landing_pages_challenges" CASCADE;
  DROP TABLE "landing_pages_highlights" CASCADE;
  DROP TABLE "landing_pages_tips" CASCADE;
  DROP TABLE "landing_pages_safe_dishes" CASCADE;
  DROP TABLE "landing_pages_avoid_dishes" CASCADE;
  DROP TABLE "landing_pages_suitable_tours" CASCADE;
  DROP TABLE "landing_pages_travel_tips" CASCADE;
  DROP TABLE "landing_pages" CASCADE;
  DROP TABLE "landing_pages_locales" CASCADE;
  DROP TABLE "_landing_pages_v_version_challenges" CASCADE;
  DROP TABLE "_landing_pages_v_version_highlights" CASCADE;
  DROP TABLE "_landing_pages_v_version_tips" CASCADE;
  DROP TABLE "_landing_pages_v_version_safe_dishes" CASCADE;
  DROP TABLE "_landing_pages_v_version_avoid_dishes" CASCADE;
  DROP TABLE "_landing_pages_v_version_suitable_tours" CASCADE;
  DROP TABLE "_landing_pages_v_version_travel_tips" CASCADE;
  DROP TABLE "_landing_pages_v" CASCADE;
  DROP TABLE "_landing_pages_v_locales" CASCADE;
  DROP TABLE "pages_highlights" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v_version_highlights" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "about_page_blocks_hero_block" CASCADE;
  DROP TABLE "about_page_blocks_founder_story_block" CASCADE;
  DROP TABLE "about_page_blocks_stats_block_stats" CASCADE;
  DROP TABLE "about_page_blocks_stats_block" CASCADE;
  DROP TABLE "about_page_blocks_timeline_block_events" CASCADE;
  DROP TABLE "about_page_blocks_timeline_block" CASCADE;
  DROP TABLE "about_page_blocks_philosophy_block_items" CASCADE;
  DROP TABLE "about_page_blocks_philosophy_block" CASCADE;
  DROP TABLE "about_page_blocks_team_block_members" CASCADE;
  DROP TABLE "about_page_blocks_team_block" CASCADE;
  DROP TABLE "about_page_breadcrumbs" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "about_page_locales" CASCADE;
  DROP TABLE "contact_page_breadcrumbs" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "contact_page_locales" CASCADE;
  DROP TABLE "_contact_page_v_version_breadcrumbs" CASCADE;
  DROP TABLE "_contact_page_v" CASCADE;
  DROP TABLE "_contact_page_v_locales" CASCADE;
  DROP TABLE "thank_you_pages_next_steps" CASCADE;
  DROP TABLE "thank_you_pages_cta_section_cta_buttons" CASCADE;
  DROP TABLE "thank_you_pages" CASCADE;
  DROP TABLE "thank_you_pages_locales" CASCADE;
  DROP TABLE "_thank_you_pages_v_version_next_steps" CASCADE;
  DROP TABLE "_thank_you_pages_v_version_cta_section_cta_buttons" CASCADE;
  DROP TABLE "_thank_you_pages_v" CASCADE;
  DROP TABLE "_thank_you_pages_v_locales" CASCADE;
  DROP TABLE "home_page_blocks_hero_block_badges" CASCADE;
  DROP TABLE "home_page_blocks_hero_block" CASCADE;
  DROP TABLE "home_page_blocks_manifesto_block" CASCADE;
  DROP TABLE "home_page_blocks_pillars_block_pillars" CASCADE;
  DROP TABLE "home_page_blocks_pillars_block" CASCADE;
  DROP TABLE "home_page_blocks_vendors_block_links" CASCADE;
  DROP TABLE "home_page_blocks_vendors_block" CASCADE;
  DROP TABLE "home_page_blocks_segments_block" CASCADE;
  DROP TABLE "home_page_blocks_about_block" CASCADE;
  DROP TABLE "home_page_blocks_stats_block_stats" CASCADE;
  DROP TABLE "home_page_blocks_stats_block" CASCADE;
  DROP TABLE "home_page_blocks_cta_block_features" CASCADE;
  DROP TABLE "home_page_blocks_cta_block_buttons" CASCADE;
  DROP TABLE "home_page_blocks_cta_block" CASCADE;
  DROP TABLE "home_page_blocks_why_us_block_reasons" CASCADE;
  DROP TABLE "home_page_blocks_why_us_block" CASCADE;
  DROP TABLE "home_page_blocks_guarantees_block_guarantees" CASCADE;
  DROP TABLE "home_page_blocks_guarantees_block" CASCADE;
  DROP TABLE "plat" CASCADE;
  DROP TABLE "home_page_blocks_social_proof_badges_block" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_locales" CASCADE;
  DROP TABLE "_home_page_v_blocks_hero_block_badges" CASCADE;
  DROP TABLE "_home_page_v_blocks_hero_block" CASCADE;
  DROP TABLE "_home_page_v_blocks_manifesto_block" CASCADE;
  DROP TABLE "_home_page_v_blocks_pillars_block_pillars" CASCADE;
  DROP TABLE "_home_page_v_blocks_pillars_block" CASCADE;
  DROP TABLE "_home_page_v_blocks_vendors_block_links" CASCADE;
  DROP TABLE "_home_page_v_blocks_vendors_block" CASCADE;
  DROP TABLE "_home_page_v_blocks_segments_block" CASCADE;
  DROP TABLE "_home_page_v_blocks_about_block" CASCADE;
  DROP TABLE "_home_page_v_blocks_stats_block_stats" CASCADE;
  DROP TABLE "_home_page_v_blocks_stats_block" CASCADE;
  DROP TABLE "_home_page_v_blocks_cta_block_features" CASCADE;
  DROP TABLE "_home_page_v_blocks_cta_block_buttons" CASCADE;
  DROP TABLE "_home_page_v_blocks_cta_block" CASCADE;
  DROP TABLE "_home_page_v_blocks_why_us_block_reasons" CASCADE;
  DROP TABLE "_home_page_v_blocks_why_us_block" CASCADE;
  DROP TABLE "_home_page_v_blocks_guarantees_block_guarantees" CASCADE;
  DROP TABLE "_home_page_v_blocks_guarantees_block" CASCADE;
  DROP TABLE "_plat_v" CASCADE;
  DROP TABLE "_home_page_v_blocks_social_proof_badges_block" CASCADE;
  DROP TABLE "_home_page_v" CASCADE;
  DROP TABLE "_home_page_v_locales" CASCADE;
  DROP TABLE "legal_pages" CASCADE;
  DROP TABLE "legal_pages_locales" CASCADE;
  DROP TABLE "_legal_pages_v" CASCADE;
  DROP TABLE "_legal_pages_v_locales" CASCADE;
  DROP TABLE "menus_items" CASCADE;
  DROP TABLE "menus" CASCADE;
  DROP TABLE "menus_locales" CASCADE;
  DROP TABLE "travel_types" CASCADE;
  DROP TABLE "travel_types_locales" CASCADE;
  DROP TABLE "_travel_types_v" CASCADE;
  DROP TABLE "_travel_types_v_locales" CASCADE;
  DROP TABLE "specialty_experiences" CASCADE;
  DROP TABLE "specialty_experiences_locales" CASCADE;
  DROP TABLE "_specialty_experiences_v" CASCADE;
  DROP TABLE "_specialty_experiences_v_locales" CASCADE;
  DROP TABLE "locations" CASCADE;
  DROP TABLE "locations_locales" CASCADE;
  DROP TABLE "_locations_v" CASCADE;
  DROP TABLE "_locations_v_locales" CASCADE;
  DROP TABLE "neighborhoods_highlights" CASCADE;
  DROP TABLE "neighborhoods_food_specialties" CASCADE;
  DROP TABLE "neighborhoods" CASCADE;
  DROP TABLE "neighborhoods_locales" CASCADE;
  DROP TABLE "neighborhoods_rels" CASCADE;
  DROP TABLE "_neighborhoods_v_version_highlights" CASCADE;
  DROP TABLE "_neighborhoods_v_version_food_specialties" CASCADE;
  DROP TABLE "_neighborhoods_v" CASCADE;
  DROP TABLE "_neighborhoods_v_locales" CASCADE;
  DROP TABLE "_neighborhoods_v_rels" CASCADE;
  DROP TABLE "site_settings_social_proof_platforms" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "_site_settings_v_version_social_proof_platforms" CASCADE;
  DROP TABLE "_site_settings_v" CASCADE;
  DROP TABLE "_site_settings_v_locales" CASCADE;
  DROP TABLE "comparison_page_competitors" CASCADE;
  DROP TABLE "comparison_page_comparison_rows_competitor_values" CASCADE;
  DROP TABLE "comparison_page_comparison_rows" CASCADE;
  DROP TABLE "comparison_page_trust_badges" CASCADE;
  DROP TABLE "comparison_page" CASCADE;
  DROP TABLE "comparison_page_locales" CASCADE;
  DROP TABLE "_comparison_page_v_version_competitors" CASCADE;
  DROP TABLE "_comparison_page_v_version_comparison_rows_competitor_values" CASCADE;
  DROP TABLE "_comparison_page_v_version_comparison_rows" CASCADE;
  DROP TABLE "_comparison_page_v_version_trust_badges" CASCADE;
  DROP TABLE "_comparison_page_v" CASCADE;
  DROP TABLE "_comparison_page_v_locales" CASCADE;
  DROP TABLE "how_it_works_page_steps" CASCADE;
  DROP TABLE "how_it_works_page_inclusions" CASCADE;
  DROP TABLE "how_it_works_page_formats" CASCADE;
  DROP TABLE "how_it_works_page" CASCADE;
  DROP TABLE "how_it_works_page_locales" CASCADE;
  DROP TABLE "_how_it_works_page_v_version_steps" CASCADE;
  DROP TABLE "_how_it_works_page_v_version_inclusions" CASCADE;
  DROP TABLE "_how_it_works_page_v_version_formats" CASCADE;
  DROP TABLE "_how_it_works_page_v" CASCADE;
  DROP TABLE "_how_it_works_page_v_locales" CASCADE;
  DROP TABLE "how_to_prepare_page_what_to_wear" CASCADE;
  DROP TABLE "how_to_prepare_page_what_to_bring" CASCADE;
  DROP TABLE "how_to_prepare_page_what_to_expect" CASCADE;
  DROP TABLE "how_to_prepare_page_dietary_notes" CASCADE;
  DROP TABLE "how_to_prepare_page" CASCADE;
  DROP TABLE "how_to_prepare_page_locales" CASCADE;
  DROP TABLE "_how_to_prepare_page_v_version_what_to_wear" CASCADE;
  DROP TABLE "_how_to_prepare_page_v_version_what_to_bring" CASCADE;
  DROP TABLE "_how_to_prepare_page_v_version_what_to_expect" CASCADE;
  DROP TABLE "_how_to_prepare_page_v_version_dietary_notes" CASCADE;
  DROP TABLE "_how_to_prepare_page_v" CASCADE;
  DROP TABLE "_how_to_prepare_page_v_locales" CASCADE;
  DROP TABLE "corporate_groups_page_offer_perfect_for" CASCADE;
  DROP TABLE "corporate_groups_page_benefit_cards" CASCADE;
  DROP TABLE "corporate_groups_page_how_steps" CASCADE;
  DROP TABLE "corporate_groups_page" CASCADE;
  DROP TABLE "corporate_groups_page_locales" CASCADE;
  DROP TABLE "_corporate_groups_page_v_version_offer_perfect_for" CASCADE;
  DROP TABLE "_corporate_groups_page_v_version_benefit_cards" CASCADE;
  DROP TABLE "_corporate_groups_page_v_version_how_steps" CASCADE;
  DROP TABLE "_corporate_groups_page_v" CASCADE;
  DROP TABLE "_corporate_groups_page_v_locales" CASCADE;
  DROP TABLE "track_record_page_stats" CASCADE;
  DROP TABLE "track_record_page_segments" CASCADE;
  DROP TABLE "track_record_page_case_studies" CASCADE;
  DROP TABLE "track_record_page_press" CASCADE;
  DROP TABLE "track_record_page_awards" CASCADE;
  DROP TABLE "track_record_page" CASCADE;
  DROP TABLE "track_record_page_locales" CASCADE;
  DROP TABLE "_track_record_page_v_version_stats" CASCADE;
  DROP TABLE "_track_record_page_v_version_segments" CASCADE;
  DROP TABLE "_track_record_page_v_version_case_studies" CASCADE;
  DROP TABLE "_track_record_page_v_version_press" CASCADE;
  DROP TABLE "_track_record_page_v_version_awards" CASCADE;
  DROP TABLE "_track_record_page_v" CASCADE;
  DROP TABLE "_track_record_page_v_locales" CASCADE;
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
  DROP TABLE "directions_page_meeting_points" CASCADE;
  DROP TABLE "directions_page_general_tips" CASCADE;
  DROP TABLE "directions_page" CASCADE;
  DROP TABLE "directions_page_locales" CASCADE;
  DROP TABLE "_directions_page_v_version_meeting_points" CASCADE;
  DROP TABLE "_directions_page_v_version_general_tips" CASCADE;
  DROP TABLE "_directions_page_v" CASCADE;
  DROP TABLE "_directions_page_v_locales" CASCADE;
  DROP TABLE "tour_quiz_steps_options" CASCADE;
  DROP TABLE "tour_quiz_steps" CASCADE;
  DROP TABLE "tour_quiz_personalities" CASCADE;
  DROP TABLE "tour_quiz_scoring_weights" CASCADE;
  DROP TABLE "tour_quiz_result_headlines" CASCADE;
  DROP TABLE "tour_quiz" CASCADE;
  DROP TABLE "tour_quiz_locales" CASCADE;
  DROP TABLE "tour_quiz_rels" CASCADE;
  DROP TABLE "_tour_quiz_v_version_steps_options" CASCADE;
  DROP TABLE "_tour_quiz_v_version_steps" CASCADE;
  DROP TABLE "_tour_quiz_v_version_personalities" CASCADE;
  DROP TABLE "_tour_quiz_v_version_scoring_weights" CASCADE;
  DROP TABLE "_tour_quiz_v_version_result_headlines" CASCADE;
  DROP TABLE "_tour_quiz_v" CASCADE;
  DROP TABLE "_tour_quiz_v_locales" CASCADE;
  DROP TABLE "_tour_quiz_v_rels" CASCADE;
  DROP TABLE "exports" CASCADE;
  DROP TABLE "exports_texts" CASCADE;
  DROP TABLE "imports" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_tours_difficulty";
  DROP TYPE "public"."enum_tours_status";
  DROP TYPE "public"."enum_tours_workflow_status";
  DROP TYPE "public"."enum__tours_v_version_difficulty";
  DROP TYPE "public"."enum__tours_v_version_status";
  DROP TYPE "public"."enum__tours_v_version_workflow_status";
  DROP TYPE "public"."enum__tours_v_published_locale";
  DROP TYPE "public"."enum_stories_status";
  DROP TYPE "public"."enum_stories_workflow_status";
  DROP TYPE "public"."enum__stories_v_version_status";
  DROP TYPE "public"."enum__stories_v_version_workflow_status";
  DROP TYPE "public"."enum__stories_v_published_locale";
  DROP TYPE "public"."enum_testimonials_page_visibility";
  DROP TYPE "public"."enum_testimonials_workflow_status";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum__testimonials_v_version_page_visibility";
  DROP TYPE "public"."enum__testimonials_v_version_workflow_status";
  DROP TYPE "public"."enum__testimonials_v_version_status";
  DROP TYPE "public"."enum__testimonials_v_published_locale";
  DROP TYPE "public"."enum_faqs_page_visibility";
  DROP TYPE "public"."enum_faqs_category";
  DROP TYPE "public"."enum_faqs_workflow_status";
  DROP TYPE "public"."enum_faqs_status";
  DROP TYPE "public"."enum__faqs_v_version_page_visibility";
  DROP TYPE "public"."enum__faqs_v_version_category";
  DROP TYPE "public"."enum__faqs_v_version_workflow_status";
  DROP TYPE "public"."enum__faqs_v_version_status";
  DROP TYPE "public"."enum__faqs_v_published_locale";
  DROP TYPE "public"."enum_media_coverage_status";
  DROP TYPE "public"."enum__media_coverage_v_version_status";
  DROP TYPE "public"."enum__media_coverage_v_published_locale";
  DROP TYPE "public"."enum_dietary_options_status";
  DROP TYPE "public"."enum__dietary_options_v_version_status";
  DROP TYPE "public"."enum__dietary_options_v_published_locale";
  DROP TYPE "public"."enum_food_items_local_names_language";
  DROP TYPE "public"."enum_food_items_allergens_allergen";
  DROP TYPE "public"."enum_food_items_flavor_profile_flavor";
  DROP TYPE "public"."enum_food_items_category";
  DROP TYPE "public"."enum_food_items_origin";
  DROP TYPE "public"."enum_food_items_spice_level";
  DROP TYPE "public"."enum_food_items_preparation_method";
  DROP TYPE "public"."enum_food_items_availability";
  DROP TYPE "public"."enum_food_items_status";
  DROP TYPE "public"."enum__food_items_v_version_local_names_language";
  DROP TYPE "public"."enum__food_items_v_version_allergens_allergen";
  DROP TYPE "public"."enum__food_items_v_version_flavor_profile_flavor";
  DROP TYPE "public"."enum__food_items_v_version_category";
  DROP TYPE "public"."enum__food_items_v_version_origin";
  DROP TYPE "public"."enum__food_items_v_version_spice_level";
  DROP TYPE "public"."enum__food_items_v_version_preparation_method";
  DROP TYPE "public"."enum__food_items_v_version_availability";
  DROP TYPE "public"."enum__food_items_v_version_status";
  DROP TYPE "public"."enum__food_items_v_published_locale";
  DROP TYPE "public"."enum_vendors_operating_hours_day";
  DROP TYPE "public"."enum_vendors_closed_on_day";
  DROP TYPE "public"."enum_vendors_payment_methods_method";
  DROP TYPE "public"."enum_vendors_facilities_facility";
  DROP TYPE "public"."enum_vendors_type";
  DROP TYPE "public"."enum_vendors_cuisine_type";
  DROP TYPE "public"."enum_vendors_price_range";
  DROP TYPE "public"."enum_vendors_status";
  DROP TYPE "public"."enum_vendors_location_state";
  DROP TYPE "public"."enum__vendors_v_version_operating_hours_day";
  DROP TYPE "public"."enum__vendors_v_version_closed_on_day";
  DROP TYPE "public"."enum__vendors_v_version_payment_methods_method";
  DROP TYPE "public"."enum__vendors_v_version_facilities_facility";
  DROP TYPE "public"."enum__vendors_v_version_type";
  DROP TYPE "public"."enum__vendors_v_version_cuisine_type";
  DROP TYPE "public"."enum__vendors_v_version_price_range";
  DROP TYPE "public"."enum__vendors_v_version_status";
  DROP TYPE "public"."enum__vendors_v_published_locale";
  DROP TYPE "public"."enum__vendors_v_version_location_state";
  DROP TYPE "public"."enum_landing_pages_type";
  DROP TYPE "public"."enum_landing_pages_status";
  DROP TYPE "public"."enum__landing_pages_v_version_type";
  DROP TYPE "public"."enum__landing_pages_v_version_status";
  DROP TYPE "public"."enum__landing_pages_v_published_locale";
  DROP TYPE "public"."enum_pages_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_type";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_contact_page_status";
  DROP TYPE "public"."enum__contact_page_v_version_status";
  DROP TYPE "public"."enum__contact_page_v_published_locale";
  DROP TYPE "public"."enum_thank_you_pages_cta_section_cta_buttons_variant";
  DROP TYPE "public"."enum_thank_you_pages_type";
  DROP TYPE "public"."enum_thank_you_pages_status";
  DROP TYPE "public"."enum__thank_you_pages_v_version_cta_section_cta_buttons_variant";
  DROP TYPE "public"."enum__thank_you_pages_v_version_type";
  DROP TYPE "public"."enum__thank_you_pages_v_version_status";
  DROP TYPE "public"."enum__thank_you_pages_v_published_locale";
  DROP TYPE "public"."enum_home_page_blocks_cta_block_buttons_variant";
  DROP TYPE "public"."enum_home_page_blocks_why_us_block_reasons_icon_name";
  DROP TYPE "public"."enum_home_page_blocks_guarantees_block_guarantees_icon_name";
  DROP TYPE "public"."name";
  DROP TYPE "public"."enum_home_page_status";
  DROP TYPE "public"."enum__home_page_v_blocks_cta_block_buttons_variant";
  DROP TYPE "public"."enum__home_page_v_blocks_why_us_block_reasons_icon_name";
  DROP TYPE "public"."enum__home_page_v_blocks_guarantees_block_guarantees_icon_name";
  DROP TYPE "public"."enum__home_page_v_version_status";
  DROP TYPE "public"."enum__home_page_v_published_locale";
  DROP TYPE "public"."enum_legal_pages_status";
  DROP TYPE "public"."enum__legal_pages_v_version_status";
  DROP TYPE "public"."enum__legal_pages_v_published_locale";
  DROP TYPE "public"."enum_menus_location";
  DROP TYPE "public"."enum_travel_types_status";
  DROP TYPE "public"."enum__travel_types_v_version_status";
  DROP TYPE "public"."enum__travel_types_v_published_locale";
  DROP TYPE "public"."enum_specialty_experiences_status";
  DROP TYPE "public"."enum__specialty_experiences_v_version_status";
  DROP TYPE "public"."enum__specialty_experiences_v_published_locale";
  DROP TYPE "public"."enum_locations_status";
  DROP TYPE "public"."enum__locations_v_version_status";
  DROP TYPE "public"."enum__locations_v_published_locale";
  DROP TYPE "public"."enum_neighborhoods_location";
  DROP TYPE "public"."enum_neighborhoods_status";
  DROP TYPE "public"."enum__neighborhoods_v_version_location";
  DROP TYPE "public"."enum__neighborhoods_v_version_status";
  DROP TYPE "public"."enum__neighborhoods_v_published_locale";
  DROP TYPE "public"."enum_site_settings_social_proof_platforms_platform";
  DROP TYPE "public"."enum_site_settings_analytics_type";
  DROP TYPE "public"."enum_site_settings_status";
  DROP TYPE "public"."enum__site_settings_v_version_social_proof_platforms_platform";
  DROP TYPE "public"."enum__site_settings_v_version_analytics_type";
  DROP TYPE "public"."enum__site_settings_v_version_status";
  DROP TYPE "public"."enum__site_settings_v_published_locale";
  DROP TYPE "public"."enum_comparison_page_status";
  DROP TYPE "public"."enum__comparison_page_v_version_status";
  DROP TYPE "public"."enum__comparison_page_v_published_locale";
  DROP TYPE "public"."enum_how_it_works_page_status";
  DROP TYPE "public"."enum__how_it_works_page_v_version_status";
  DROP TYPE "public"."enum__how_it_works_page_v_published_locale";
  DROP TYPE "public"."enum_how_to_prepare_page_status";
  DROP TYPE "public"."enum__how_to_prepare_page_v_version_status";
  DROP TYPE "public"."enum__how_to_prepare_page_v_published_locale";
  DROP TYPE "public"."enum_corporate_groups_page_status";
  DROP TYPE "public"."enum__corporate_groups_page_v_version_status";
  DROP TYPE "public"."enum__corporate_groups_page_v_published_locale";
  DROP TYPE "public"."enum_track_record_page_status";
  DROP TYPE "public"."enum__track_record_page_v_version_status";
  DROP TYPE "public"."enum__track_record_page_v_published_locale";
  DROP TYPE "public"."enum_private_tours_page_status";
  DROP TYPE "public"."enum__private_tours_page_v_version_status";
  DROP TYPE "public"."enum__private_tours_page_v_published_locale";
  DROP TYPE "public"."enum_directions_page_status";
  DROP TYPE "public"."enum__directions_page_v_version_status";
  DROP TYPE "public"."enum__directions_page_v_published_locale";
  DROP TYPE "public"."enum_tour_quiz_status";
  DROP TYPE "public"."enum__tour_quiz_v_version_status";
  DROP TYPE "public"."enum__tour_quiz_v_published_locale";
  DROP TYPE "public"."enum_exports_format";
  DROP TYPE "public"."enum_exports_sort_order";
  DROP TYPE "public"."enum_exports_locale";
  DROP TYPE "public"."enum_exports_drafts";
  DROP TYPE "public"."enum_imports_import_mode";
  DROP TYPE "public"."enum_imports_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
