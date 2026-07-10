import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'translator', 'reviewer');
  CREATE TYPE "public"."enum_tours_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_tours_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum__tours_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tours_v_version_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum_stories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_stories_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum__stories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__stories_v_version_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum_testimonials_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_version_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum__testimonials_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_faqs_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum_faqs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faqs_v_version_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum__faqs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_media_coverage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_dietary_options_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__dietary_options_v_version_status" AS ENUM('draft', 'published');
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
  CREATE TYPE "public"."enum_vendors_operating_hours_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'holiday');
  CREATE TYPE "public"."enum_vendors_closed_on_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'holiday');
  CREATE TYPE "public"."enum_vendors_payment_methods_method" AS ENUM('cash', 'credit_card', 'debit_card', 'tng', 'grabpay', 'boost', 'qr_pay', 'online_banking');
  CREATE TYPE "public"."enum_vendors_facilities_facility" AS ENUM('aircon', 'wifi', 'parking', 'wheelchair', 'halal_cert', 'prayer_room', 'outdoor', 'takeaway', 'delivery', 'reservations', 'family');
  CREATE TYPE "public"."enum_vendors_type" AS ENUM('street_stall', 'hawker_stall', 'food_court', 'kopitiam', 'restaurant', 'pasar_malam', 'pasar_pagi', 'home_kitchen', 'food_truck', 'heritage_shop');
  CREATE TYPE "public"."enum_vendors_cuisine_type" AS ENUM('malay', 'chinese', 'indian', 'peranakan', 'thai', 'indonesian', 'western', 'fusion', 'mixed');
  CREATE TYPE "public"."enum_vendors_location_state" AS ENUM('kl', 'penang', 'selangor', 'melaka', 'johor', 'perak', 'kelantan', 'terengganu', 'kedah', 'pahang', 'ns', 'perlis', 'sabah', 'sarawak');
  CREATE TYPE "public"."enum_vendors_price_range" AS ENUM('budget', 'moderate', 'upscale', 'fine_dining');
  CREATE TYPE "public"."enum_vendors_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__vendors_v_version_operating_hours_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'holiday');
  CREATE TYPE "public"."enum__vendors_v_version_closed_on_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'holiday');
  CREATE TYPE "public"."enum__vendors_v_version_payment_methods_method" AS ENUM('cash', 'credit_card', 'debit_card', 'tng', 'grabpay', 'boost', 'qr_pay', 'online_banking');
  CREATE TYPE "public"."enum__vendors_v_version_facilities_facility" AS ENUM('aircon', 'wifi', 'parking', 'wheelchair', 'halal_cert', 'prayer_room', 'outdoor', 'takeaway', 'delivery', 'reservations', 'family');
  CREATE TYPE "public"."enum__vendors_v_version_type" AS ENUM('street_stall', 'hawker_stall', 'food_court', 'kopitiam', 'restaurant', 'pasar_malam', 'pasar_pagi', 'home_kitchen', 'food_truck', 'heritage_shop');
  CREATE TYPE "public"."enum__vendors_v_version_cuisine_type" AS ENUM('malay', 'chinese', 'indian', 'peranakan', 'thai', 'indonesian', 'western', 'fusion', 'mixed');
  CREATE TYPE "public"."enum__vendors_v_version_location_state" AS ENUM('kl', 'penang', 'selangor', 'melaka', 'johor', 'perak', 'kelantan', 'terengganu', 'kedah', 'pahang', 'ns', 'perlis', 'sabah', 'sarawak');
  CREATE TYPE "public"."enum__vendors_v_version_price_range" AS ENUM('budget', 'moderate', 'upscale', 'fine_dining');
  CREATE TYPE "public"."enum__vendors_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_dietary_landing_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_specialty_landing_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_travel_type_landing_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_location_landing_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_thank_you_pages_cta_section_cta_buttons_variant" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_thank_you_pages_type" AS ENUM('contact', 'tour_inquiry', 'feedback', 'newsletter', 'booking', 'custom');
  CREATE TYPE "public"."enum_thank_you_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_translations_locale" AS ENUM('en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ja', 'pt', 'ru');
  CREATE TYPE "public"."enum_translations_collection" AS ENUM('tours', 'stories', 'testimonials', 'faqs', 'media_coverage', 'dietary_landing_pages', 'specialty_landing_pages', 'travel_type_landing_pages', 'location_landing_pages');
  CREATE TYPE "public"."enum_translations_status" AS ENUM('draft', 'in_translation', 'ready_for_review', 'published');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
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
  	"alt" varchar,
  	"caption" varchar,
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
  
  CREATE TABLE "tours_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image" varchar
  );
  
  CREATE TABLE "tours_whats_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "tours_whats_excluded" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "tours_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"highlight" varchar
  );
  
  CREATE TABLE "tours" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"tagline" varchar,
  	"short_description" varchar,
  	"full_description" varchar,
  	"price" numeric,
  	"currency" varchar DEFAULT 'MYR',
  	"duration" varchar,
  	"duration_minutes" numeric,
  	"location" varchar,
  	"meeting_point" varchar,
  	"max_participants" numeric,
  	"min_participants" numeric DEFAULT 2,
  	"tailored_available" boolean DEFAULT false,
  	"tailored_notes" varchar,
  	"hero_image" varchar,
  	"booking_url" varchar,
  	"instant_confirmation" boolean DEFAULT true,
  	"scheduled_publish" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"popular" boolean DEFAULT false,
  	"new" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"status" "enum_tours_status" DEFAULT 'draft',
  	"workflow_status" "enum_tours_workflow_status" DEFAULT 'draft',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_tours_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "tours_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dietary_options_id" integer,
  	"travel_type_landing_pages_id" integer,
  	"specialty_landing_pages_id" integer,
  	"food_items_id" integer
  );
  
  CREATE TABLE "_tours_v_version_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tours_v_version_whats_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tours_v_version_whats_excluded" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tours_v_version_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"highlight" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tours_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_tagline" varchar,
  	"version_short_description" varchar,
  	"version_full_description" varchar,
  	"version_price" numeric,
  	"version_currency" varchar DEFAULT 'MYR',
  	"version_duration" varchar,
  	"version_duration_minutes" numeric,
  	"version_location" varchar,
  	"version_meeting_point" varchar,
  	"version_max_participants" numeric,
  	"version_min_participants" numeric DEFAULT 2,
  	"version_tailored_available" boolean DEFAULT false,
  	"version_tailored_notes" varchar,
  	"version_hero_image" varchar,
  	"version_booking_url" varchar,
  	"version_instant_confirmation" boolean DEFAULT true,
  	"version_scheduled_publish" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_popular" boolean DEFAULT false,
  	"version_new" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_status" "enum__tours_v_version_status" DEFAULT 'draft',
  	"version_workflow_status" "enum__tours_v_version_workflow_status" DEFAULT 'draft',
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__tours_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_tours_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dietary_options_id" integer,
  	"travel_type_landing_pages_id" integer,
  	"specialty_landing_pages_id" integer,
  	"food_items_id" integer
  );
  
  CREATE TABLE "stories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"author_id" integer,
  	"excerpt" varchar,
  	"content" varchar,
  	"published_date" timestamp(3) with time zone,
  	"featured_image" varchar,
  	"status" "enum_stories_status" DEFAULT 'draft',
  	"workflow_status" "enum_stories_workflow_status" DEFAULT 'draft',
  	"scheduled_publish" timestamp(3) with time zone,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_stories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_stories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_author_id" integer,
  	"version_excerpt" varchar,
  	"version_content" varchar,
  	"version_published_date" timestamp(3) with time zone,
  	"version_featured_image" varchar,
  	"version_status" "enum__stories_v_version_status" DEFAULT 'draft',
  	"version_workflow_status" "enum__stories_v_version_workflow_status" DEFAULT 'draft',
  	"version_scheduled_publish" timestamp(3) with time zone,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__stories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author_name" varchar,
  	"author_location" varchar,
  	"rating" numeric,
  	"review_text" varchar,
  	"review_title" varchar,
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
  
  CREATE TABLE "_testimonials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_author_name" varchar,
  	"version_author_location" varchar,
  	"version_rating" numeric,
  	"version_review_text" varchar,
  	"version_review_title" varchar,
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
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"category" varchar,
  	"sort_order" numeric,
  	"tags" varchar,
  	"page_visibility" varchar,
  	"tour_id" numeric,
  	"workflow_status" "enum_faqs_workflow_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_faqs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_faqs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_question" varchar,
  	"version_answer" varchar,
  	"version_category" varchar,
  	"version_sort_order" numeric,
  	"version_tags" varchar,
  	"version_page_visibility" varchar,
  	"version_tour_id" numeric,
  	"version_workflow_status" "enum__faqs_v_version_workflow_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__faqs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "media_coverage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" varchar,
  	"outlet" varchar NOT NULL,
  	"year" varchar,
  	"detail" varchar,
  	"url" varchar,
  	"label" varchar,
  	"logo_domain" varchar,
  	"highlight" varchar,
  	"status" "enum_media_coverage_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "dietary_options" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"icon" varchar,
  	"color" varchar,
  	"description" varchar,
  	"status" "enum_dietary_options_status" DEFAULT 'published',
  	"scheduled_publish" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_dietary_options_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_dietary_options_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_icon" varchar,
  	"version_color" varchar,
  	"version_description" varchar,
  	"version_status" "enum__dietary_options_v_version_status" DEFAULT 'published',
  	"version_scheduled_publish" timestamp(3) with time zone,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__dietary_options_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
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
  	"name" varchar,
  	"slug" varchar,
  	"description" varchar,
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
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
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
  	"latest" boolean,
  	"autosave" boolean
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
  	"id" varchar PRIMARY KEY NOT NULL,
  	"award" varchar,
  	"year" numeric,
  	"organization" varchar
  );
  
  CREATE TABLE "vendors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"type" "enum_vendors_type",
  	"description" varchar,
  	"history" varchar,
  	"year_established" numeric,
  	"generation" varchar,
  	"owner_name" varchar,
  	"cuisine_type" "enum_vendors_cuisine_type",
  	"location_address" varchar,
  	"location_city" varchar,
  	"location_state" "enum_vendors_location_state",
  	"location_postcode" varchar,
  	"location_country" varchar DEFAULT 'Malaysia',
  	"location_latitude" numeric,
  	"location_longitude" numeric,
  	"location_landmark" varchar,
  	"contact_phone" varchar,
  	"contact_whatsapp" varchar,
  	"contact_email" varchar,
  	"contact_website" varchar,
  	"contact_facebook" varchar,
  	"contact_instagram" varchar,
  	"price_range" "enum_vendors_price_range",
  	"images_main_id" integer,
  	"story" varchar,
  	"media_features" varchar,
  	"tips" varchar,
  	"status" "enum_vendors_status" DEFAULT 'draft',
  	"featured" boolean DEFAULT false,
  	"scheduled_publish" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_vendors_status" DEFAULT 'draft'
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
  	"id" serial PRIMARY KEY NOT NULL,
  	"award" varchar,
  	"year" numeric,
  	"organization" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_vendors_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_type" "enum__vendors_v_version_type",
  	"version_description" varchar,
  	"version_history" varchar,
  	"version_year_established" numeric,
  	"version_generation" varchar,
  	"version_owner_name" varchar,
  	"version_cuisine_type" "enum__vendors_v_version_cuisine_type",
  	"version_location_address" varchar,
  	"version_location_city" varchar,
  	"version_location_state" "enum__vendors_v_version_location_state",
  	"version_location_postcode" varchar,
  	"version_location_country" varchar DEFAULT 'Malaysia',
  	"version_location_latitude" numeric,
  	"version_location_longitude" numeric,
  	"version_location_landmark" varchar,
  	"version_contact_phone" varchar,
  	"version_contact_whatsapp" varchar,
  	"version_contact_email" varchar,
  	"version_contact_website" varchar,
  	"version_contact_facebook" varchar,
  	"version_contact_instagram" varchar,
  	"version_price_range" "enum__vendors_v_version_price_range",
  	"version_images_main_id" integer,
  	"version_story" varchar,
  	"version_media_features" varchar,
  	"version_tips" varchar,
  	"version_status" "enum__vendors_v_version_status" DEFAULT 'draft',
  	"version_featured" boolean DEFAULT false,
  	"version_scheduled_publish" timestamp(3) with time zone,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__vendors_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_vendors_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"food_items_id" integer,
  	"dietary_options_id" integer
  );
  
  CREATE TABLE "dietary_landing_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"dietary_name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_dietary_landing_pages_status" DEFAULT 'draft',
  	"icon" varchar,
  	"color" varchar,
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"hero_description" varchar,
  	"hero_image" varchar,
  	"challenges_title" varchar,
  	"challenges_content" varchar,
  	"options_title" varchar,
  	"options_content" varchar,
  	"tips_content" varchar,
  	"safe_dishes" jsonb,
  	"dishes_to_avoid" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "specialty_landing_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"specialty_name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_specialty_landing_pages_status" DEFAULT 'draft',
  	"icon" varchar,
  	"color" varchar,
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"hero_description" varchar,
  	"hero_image" varchar,
  	"experience_title" varchar,
  	"experience_content" varchar,
  	"what_makes_special" varchar,
  	"highlights" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "travel_type_landing_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"travel_type_name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_travel_type_landing_pages_status" DEFAULT 'draft',
  	"icon" varchar,
  	"color" varchar,
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"hero_description" varchar,
  	"hero_image" varchar,
  	"why_perfect_title" varchar,
  	"why_perfect_content" varchar,
  	"what_to_expect" varchar,
  	"tips_content" varchar,
  	"suitable_tours" jsonb,
  	"key_features" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "location_landing_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_location_landing_pages_status" DEFAULT 'draft',
  	"location_name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"hero_description" varchar,
  	"hero_image" varchar,
  	"intro_title" varchar,
  	"intro_content" varchar,
  	"intro_image" varchar,
  	"best_time_to_visit" varchar,
  	"getting_around" varchar,
  	"what_to_pack" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "about_page_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"founder_story_title" varchar,
  	"founder_story_text" jsonb,
  	"stats" jsonb,
  	"timeline" jsonb,
  	"philosophy" varchar,
  	"team" jsonb,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_page_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"contact_intro" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"whatsapp" varchar,
  	"social_media" jsonb,
  	"faq_section" varchar,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "thank_you_pages_next_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step" varchar NOT NULL
  );
  
  CREATE TABLE "thank_you_pages_cta_section_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_thank_you_pages_cta_section_cta_buttons_variant" DEFAULT 'primary'
  );
  
  CREATE TABLE "thank_you_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"type" "enum_thank_you_pages_type" NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_thank_you_pages_status" DEFAULT 'draft',
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
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "translations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"locale" "enum_translations_locale" NOT NULL,
  	"collection" "enum_translations_collection" NOT NULL,
  	"status" "enum_translations_status" DEFAULT 'draft',
  	"translator" varchar,
  	"translated_at" timestamp(3) with time zone,
  	"fields_name" varchar,
  	"fields_tagline" varchar,
  	"fields_short_description" varchar,
  	"fields_full_description" varchar,
  	"fields_content" varchar,
  	"fields_excerpt" varchar,
  	"fields_question" varchar,
  	"fields_answer" varchar,
  	"fields_review_text" varchar,
  	"fields_review_title" varchar,
  	"fields_hero_title" varchar,
  	"fields_hero_subtitle" varchar,
  	"fields_hero_description" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "translations_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tours_id" integer,
  	"stories_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer,
  	"media_coverage_id" integer,
  	"dietary_landing_pages_id" integer,
  	"specialty_landing_pages_id" integer,
  	"travel_type_landing_pages_id" integer,
  	"location_landing_pages_id" integer
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar,
  	"tagline" varchar,
  	"description" varchar,
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"hero_description" varchar,
  	"hero_image" varchar,
  	"booking_url" varchar,
  	"social_media" jsonb,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"whatsapp_number" varchar,
  	"address" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tours_id" integer,
  	"stories_id" integer,
  	"dietary_landing_pages_id" integer,
  	"specialty_landing_pages_id" integer,
  	"travel_type_landing_pages_id" integer,
  	"location_landing_pages_id" integer
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"priority" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tours_id" integer,
  	"stories_id" integer,
  	"faqs_id" integer,
  	"testimonials_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
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
  	"dietary_landing_pages_id" integer,
  	"specialty_landing_pages_id" integer,
  	"travel_type_landing_pages_id" integer,
  	"location_landing_pages_id" integer,
  	"about_page_id" integer,
  	"contact_page_id" integer,
  	"thank_you_pages_id" integer,
  	"translations_id" integer,
  	"site_settings_id" integer,
  	"redirects_id" integer,
  	"search_id" integer
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
  ALTER TABLE "tours_gallery_images" ADD CONSTRAINT "tours_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_whats_included" ADD CONSTRAINT "tours_whats_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_whats_excluded" ADD CONSTRAINT "tours_whats_excluded_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_highlights" ADD CONSTRAINT "tours_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours" ADD CONSTRAINT "tours_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_dietary_options_fk" FOREIGN KEY ("dietary_options_id") REFERENCES "public"."dietary_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_travel_type_landing_pages_fk" FOREIGN KEY ("travel_type_landing_pages_id") REFERENCES "public"."travel_type_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_specialty_landing_pages_fk" FOREIGN KEY ("specialty_landing_pages_id") REFERENCES "public"."specialty_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_food_items_fk" FOREIGN KEY ("food_items_id") REFERENCES "public"."food_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_version_gallery_images" ADD CONSTRAINT "_tours_v_version_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_version_whats_included" ADD CONSTRAINT "_tours_v_version_whats_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_version_whats_excluded" ADD CONSTRAINT "_tours_v_version_whats_excluded_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_version_highlights" ADD CONSTRAINT "_tours_v_version_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v" ADD CONSTRAINT "_tours_v_parent_id_tours_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tours_v" ADD CONSTRAINT "_tours_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tours_v_rels" ADD CONSTRAINT "_tours_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_rels" ADD CONSTRAINT "_tours_v_rels_dietary_options_fk" FOREIGN KEY ("dietary_options_id") REFERENCES "public"."dietary_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_rels" ADD CONSTRAINT "_tours_v_rels_travel_type_landing_pages_fk" FOREIGN KEY ("travel_type_landing_pages_id") REFERENCES "public"."travel_type_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_rels" ADD CONSTRAINT "_tours_v_rels_specialty_landing_pages_fk" FOREIGN KEY ("specialty_landing_pages_id") REFERENCES "public"."specialty_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tours_v_rels" ADD CONSTRAINT "_tours_v_rels_food_items_fk" FOREIGN KEY ("food_items_id") REFERENCES "public"."food_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_parent_id_stories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_parent_id_testimonials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faqs_v" ADD CONSTRAINT "_faqs_v_parent_id_faqs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_dietary_options_v" ADD CONSTRAINT "_dietary_options_v_parent_id_dietary_options_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."dietary_options"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "food_items_local_names" ADD CONSTRAINT "food_items_local_names_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."food_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "food_items_ingredients" ADD CONSTRAINT "food_items_ingredients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."food_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "food_items_allergens" ADD CONSTRAINT "food_items_allergens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."food_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "food_items_flavor_profile" ADD CONSTRAINT "food_items_flavor_profile_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."food_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "food_items" ADD CONSTRAINT "food_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "food_items_rels" ADD CONSTRAINT "food_items_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."food_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "food_items_rels" ADD CONSTRAINT "food_items_rels_dietary_options_fk" FOREIGN KEY ("dietary_options_id") REFERENCES "public"."dietary_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "food_items_rels" ADD CONSTRAINT "food_items_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_food_items_v_version_local_names" ADD CONSTRAINT "_food_items_v_version_local_names_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_food_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_food_items_v_version_ingredients" ADD CONSTRAINT "_food_items_v_version_ingredients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_food_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_food_items_v_version_allergens" ADD CONSTRAINT "_food_items_v_version_allergens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_food_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_food_items_v_version_flavor_profile" ADD CONSTRAINT "_food_items_v_version_flavor_profile_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_food_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_food_items_v" ADD CONSTRAINT "_food_items_v_parent_id_food_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."food_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_food_items_v" ADD CONSTRAINT "_food_items_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
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
  ALTER TABLE "_vendors_v_rels" ADD CONSTRAINT "_vendors_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_vendors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_vendors_v_rels" ADD CONSTRAINT "_vendors_v_rels_food_items_fk" FOREIGN KEY ("food_items_id") REFERENCES "public"."food_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_vendors_v_rels" ADD CONSTRAINT "_vendors_v_rels_dietary_options_fk" FOREIGN KEY ("dietary_options_id") REFERENCES "public"."dietary_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dietary_landing_pages" ADD CONSTRAINT "dietary_landing_pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "specialty_landing_pages" ADD CONSTRAINT "specialty_landing_pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "travel_type_landing_pages" ADD CONSTRAINT "travel_type_landing_pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "location_landing_pages" ADD CONSTRAINT "location_landing_pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_breadcrumbs" ADD CONSTRAINT "about_page_breadcrumbs_doc_id_about_page_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."about_page"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_breadcrumbs" ADD CONSTRAINT "about_page_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_parent_id_about_page_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."about_page"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page_breadcrumbs" ADD CONSTRAINT "contact_page_breadcrumbs_doc_id_contact_page_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."contact_page"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page_breadcrumbs" ADD CONSTRAINT "contact_page_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_parent_id_contact_page_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contact_page"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "thank_you_pages_next_steps" ADD CONSTRAINT "thank_you_pages_next_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."thank_you_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "thank_you_pages_cta_section_cta_buttons" ADD CONSTRAINT "thank_you_pages_cta_section_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."thank_you_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "translations_rels" ADD CONSTRAINT "translations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."translations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "translations_rels" ADD CONSTRAINT "translations_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "translations_rels" ADD CONSTRAINT "translations_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "translations_rels" ADD CONSTRAINT "translations_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "translations_rels" ADD CONSTRAINT "translations_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "translations_rels" ADD CONSTRAINT "translations_rels_media_coverage_fk" FOREIGN KEY ("media_coverage_id") REFERENCES "public"."media_coverage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "translations_rels" ADD CONSTRAINT "translations_rels_dietary_landing_pages_fk" FOREIGN KEY ("dietary_landing_pages_id") REFERENCES "public"."dietary_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "translations_rels" ADD CONSTRAINT "translations_rels_specialty_landing_pages_fk" FOREIGN KEY ("specialty_landing_pages_id") REFERENCES "public"."specialty_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "translations_rels" ADD CONSTRAINT "translations_rels_travel_type_landing_pages_fk" FOREIGN KEY ("travel_type_landing_pages_id") REFERENCES "public"."travel_type_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "translations_rels" ADD CONSTRAINT "translations_rels_location_landing_pages_fk" FOREIGN KEY ("location_landing_pages_id") REFERENCES "public"."location_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_dietary_landing_pages_fk" FOREIGN KEY ("dietary_landing_pages_id") REFERENCES "public"."dietary_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_specialty_landing_pages_fk" FOREIGN KEY ("specialty_landing_pages_id") REFERENCES "public"."specialty_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_travel_type_landing_pages_fk" FOREIGN KEY ("travel_type_landing_pages_id") REFERENCES "public"."travel_type_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_location_landing_pages_fk" FOREIGN KEY ("location_landing_pages_id") REFERENCES "public"."location_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
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
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dietary_landing_pages_fk" FOREIGN KEY ("dietary_landing_pages_id") REFERENCES "public"."dietary_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_specialty_landing_pages_fk" FOREIGN KEY ("specialty_landing_pages_id") REFERENCES "public"."specialty_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_travel_type_landing_pages_fk" FOREIGN KEY ("travel_type_landing_pages_id") REFERENCES "public"."travel_type_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_location_landing_pages_fk" FOREIGN KEY ("location_landing_pages_id") REFERENCES "public"."location_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_about_page_fk" FOREIGN KEY ("about_page_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_page_fk" FOREIGN KEY ("contact_page_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_thank_you_pages_fk" FOREIGN KEY ("thank_you_pages_id") REFERENCES "public"."thank_you_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_translations_fk" FOREIGN KEY ("translations_id") REFERENCES "public"."translations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_settings_fk" FOREIGN KEY ("site_settings_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
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
  CREATE INDEX "tours_gallery_images_order_idx" ON "tours_gallery_images" USING btree ("_order");
  CREATE INDEX "tours_gallery_images_parent_id_idx" ON "tours_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "tours_whats_included_order_idx" ON "tours_whats_included" USING btree ("_order");
  CREATE INDEX "tours_whats_included_parent_id_idx" ON "tours_whats_included" USING btree ("_parent_id");
  CREATE INDEX "tours_whats_excluded_order_idx" ON "tours_whats_excluded" USING btree ("_order");
  CREATE INDEX "tours_whats_excluded_parent_id_idx" ON "tours_whats_excluded" USING btree ("_parent_id");
  CREATE INDEX "tours_highlights_order_idx" ON "tours_highlights" USING btree ("_order");
  CREATE INDEX "tours_highlights_parent_id_idx" ON "tours_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tours_slug_idx" ON "tours" USING btree ("slug");
  CREATE INDEX "tours_meta_meta_image_idx" ON "tours" USING btree ("meta_image_id");
  CREATE INDEX "tours_updated_at_idx" ON "tours" USING btree ("updated_at");
  CREATE INDEX "tours_created_at_idx" ON "tours" USING btree ("created_at");
  CREATE INDEX "tours__status_idx" ON "tours" USING btree ("_status");
  CREATE INDEX "tours_rels_order_idx" ON "tours_rels" USING btree ("order");
  CREATE INDEX "tours_rels_parent_idx" ON "tours_rels" USING btree ("parent_id");
  CREATE INDEX "tours_rels_path_idx" ON "tours_rels" USING btree ("path");
  CREATE INDEX "tours_rels_dietary_options_id_idx" ON "tours_rels" USING btree ("dietary_options_id");
  CREATE INDEX "tours_rels_travel_type_landing_pages_id_idx" ON "tours_rels" USING btree ("travel_type_landing_pages_id");
  CREATE INDEX "tours_rels_specialty_landing_pages_id_idx" ON "tours_rels" USING btree ("specialty_landing_pages_id");
  CREATE INDEX "tours_rels_food_items_id_idx" ON "tours_rels" USING btree ("food_items_id");
  CREATE INDEX "_tours_v_version_gallery_images_order_idx" ON "_tours_v_version_gallery_images" USING btree ("_order");
  CREATE INDEX "_tours_v_version_gallery_images_parent_id_idx" ON "_tours_v_version_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_tours_v_version_whats_included_order_idx" ON "_tours_v_version_whats_included" USING btree ("_order");
  CREATE INDEX "_tours_v_version_whats_included_parent_id_idx" ON "_tours_v_version_whats_included" USING btree ("_parent_id");
  CREATE INDEX "_tours_v_version_whats_excluded_order_idx" ON "_tours_v_version_whats_excluded" USING btree ("_order");
  CREATE INDEX "_tours_v_version_whats_excluded_parent_id_idx" ON "_tours_v_version_whats_excluded" USING btree ("_parent_id");
  CREATE INDEX "_tours_v_version_highlights_order_idx" ON "_tours_v_version_highlights" USING btree ("_order");
  CREATE INDEX "_tours_v_version_highlights_parent_id_idx" ON "_tours_v_version_highlights" USING btree ("_parent_id");
  CREATE INDEX "_tours_v_parent_idx" ON "_tours_v" USING btree ("parent_id");
  CREATE INDEX "_tours_v_version_version_slug_idx" ON "_tours_v" USING btree ("version_slug");
  CREATE INDEX "_tours_v_version_meta_version_meta_image_idx" ON "_tours_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_tours_v_version_version_updated_at_idx" ON "_tours_v" USING btree ("version_updated_at");
  CREATE INDEX "_tours_v_version_version_created_at_idx" ON "_tours_v" USING btree ("version_created_at");
  CREATE INDEX "_tours_v_version_version__status_idx" ON "_tours_v" USING btree ("version__status");
  CREATE INDEX "_tours_v_created_at_idx" ON "_tours_v" USING btree ("created_at");
  CREATE INDEX "_tours_v_updated_at_idx" ON "_tours_v" USING btree ("updated_at");
  CREATE INDEX "_tours_v_latest_idx" ON "_tours_v" USING btree ("latest");
  CREATE INDEX "_tours_v_autosave_idx" ON "_tours_v" USING btree ("autosave");
  CREATE INDEX "_tours_v_rels_order_idx" ON "_tours_v_rels" USING btree ("order");
  CREATE INDEX "_tours_v_rels_parent_idx" ON "_tours_v_rels" USING btree ("parent_id");
  CREATE INDEX "_tours_v_rels_path_idx" ON "_tours_v_rels" USING btree ("path");
  CREATE INDEX "_tours_v_rels_dietary_options_id_idx" ON "_tours_v_rels" USING btree ("dietary_options_id");
  CREATE INDEX "_tours_v_rels_travel_type_landing_pages_id_idx" ON "_tours_v_rels" USING btree ("travel_type_landing_pages_id");
  CREATE INDEX "_tours_v_rels_specialty_landing_pages_id_idx" ON "_tours_v_rels" USING btree ("specialty_landing_pages_id");
  CREATE INDEX "_tours_v_rels_food_items_id_idx" ON "_tours_v_rels" USING btree ("food_items_id");
  CREATE UNIQUE INDEX "stories_slug_idx" ON "stories" USING btree ("slug");
  CREATE INDEX "stories_author_idx" ON "stories" USING btree ("author_id");
  CREATE INDEX "stories_meta_meta_image_idx" ON "stories" USING btree ("meta_image_id");
  CREATE INDEX "stories_updated_at_idx" ON "stories" USING btree ("updated_at");
  CREATE INDEX "stories_created_at_idx" ON "stories" USING btree ("created_at");
  CREATE INDEX "stories__status_idx" ON "stories" USING btree ("_status");
  CREATE INDEX "_stories_v_parent_idx" ON "_stories_v" USING btree ("parent_id");
  CREATE INDEX "_stories_v_version_version_slug_idx" ON "_stories_v" USING btree ("version_slug");
  CREATE INDEX "_stories_v_version_version_author_idx" ON "_stories_v" USING btree ("version_author_id");
  CREATE INDEX "_stories_v_version_meta_version_meta_image_idx" ON "_stories_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_stories_v_version_version_updated_at_idx" ON "_stories_v" USING btree ("version_updated_at");
  CREATE INDEX "_stories_v_version_version_created_at_idx" ON "_stories_v" USING btree ("version_created_at");
  CREATE INDEX "_stories_v_version_version__status_idx" ON "_stories_v" USING btree ("version__status");
  CREATE INDEX "_stories_v_created_at_idx" ON "_stories_v" USING btree ("created_at");
  CREATE INDEX "_stories_v_updated_at_idx" ON "_stories_v" USING btree ("updated_at");
  CREATE INDEX "_stories_v_latest_idx" ON "_stories_v" USING btree ("latest");
  CREATE INDEX "_stories_v_autosave_idx" ON "_stories_v" USING btree ("autosave");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "testimonials__status_idx" ON "testimonials" USING btree ("_status");
  CREATE INDEX "_testimonials_v_parent_idx" ON "_testimonials_v" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_version_version_updated_at_idx" ON "_testimonials_v" USING btree ("version_updated_at");
  CREATE INDEX "_testimonials_v_version_version_created_at_idx" ON "_testimonials_v" USING btree ("version_created_at");
  CREATE INDEX "_testimonials_v_version_version__status_idx" ON "_testimonials_v" USING btree ("version__status");
  CREATE INDEX "_testimonials_v_created_at_idx" ON "_testimonials_v" USING btree ("created_at");
  CREATE INDEX "_testimonials_v_updated_at_idx" ON "_testimonials_v" USING btree ("updated_at");
  CREATE INDEX "_testimonials_v_latest_idx" ON "_testimonials_v" USING btree ("latest");
  CREATE INDEX "_testimonials_v_autosave_idx" ON "_testimonials_v" USING btree ("autosave");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "faqs__status_idx" ON "faqs" USING btree ("_status");
  CREATE INDEX "_faqs_v_parent_idx" ON "_faqs_v" USING btree ("parent_id");
  CREATE INDEX "_faqs_v_version_version_updated_at_idx" ON "_faqs_v" USING btree ("version_updated_at");
  CREATE INDEX "_faqs_v_version_version_created_at_idx" ON "_faqs_v" USING btree ("version_created_at");
  CREATE INDEX "_faqs_v_version_version__status_idx" ON "_faqs_v" USING btree ("version__status");
  CREATE INDEX "_faqs_v_created_at_idx" ON "_faqs_v" USING btree ("created_at");
  CREATE INDEX "_faqs_v_updated_at_idx" ON "_faqs_v" USING btree ("updated_at");
  CREATE INDEX "_faqs_v_latest_idx" ON "_faqs_v" USING btree ("latest");
  CREATE INDEX "_faqs_v_autosave_idx" ON "_faqs_v" USING btree ("autosave");
  CREATE INDEX "media_coverage_updated_at_idx" ON "media_coverage" USING btree ("updated_at");
  CREATE INDEX "media_coverage_created_at_idx" ON "media_coverage" USING btree ("created_at");
  CREATE UNIQUE INDEX "dietary_options_slug_idx" ON "dietary_options" USING btree ("slug");
  CREATE INDEX "dietary_options_updated_at_idx" ON "dietary_options" USING btree ("updated_at");
  CREATE INDEX "dietary_options_created_at_idx" ON "dietary_options" USING btree ("created_at");
  CREATE INDEX "dietary_options__status_idx" ON "dietary_options" USING btree ("_status");
  CREATE INDEX "_dietary_options_v_parent_idx" ON "_dietary_options_v" USING btree ("parent_id");
  CREATE INDEX "_dietary_options_v_version_version_slug_idx" ON "_dietary_options_v" USING btree ("version_slug");
  CREATE INDEX "_dietary_options_v_version_version_updated_at_idx" ON "_dietary_options_v" USING btree ("version_updated_at");
  CREATE INDEX "_dietary_options_v_version_version_created_at_idx" ON "_dietary_options_v" USING btree ("version_created_at");
  CREATE INDEX "_dietary_options_v_version_version__status_idx" ON "_dietary_options_v" USING btree ("version__status");
  CREATE INDEX "_dietary_options_v_created_at_idx" ON "_dietary_options_v" USING btree ("created_at");
  CREATE INDEX "_dietary_options_v_updated_at_idx" ON "_dietary_options_v" USING btree ("updated_at");
  CREATE INDEX "_dietary_options_v_latest_idx" ON "_dietary_options_v" USING btree ("latest");
  CREATE INDEX "_dietary_options_v_autosave_idx" ON "_dietary_options_v" USING btree ("autosave");
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
  CREATE INDEX "_food_items_v_latest_idx" ON "_food_items_v" USING btree ("latest");
  CREATE INDEX "_food_items_v_autosave_idx" ON "_food_items_v" USING btree ("autosave");
  CREATE INDEX "_food_items_v_rels_order_idx" ON "_food_items_v_rels" USING btree ("order");
  CREATE INDEX "_food_items_v_rels_parent_idx" ON "_food_items_v_rels" USING btree ("parent_id");
  CREATE INDEX "_food_items_v_rels_path_idx" ON "_food_items_v_rels" USING btree ("path");
  CREATE INDEX "_food_items_v_rels_dietary_options_id_idx" ON "_food_items_v_rels" USING btree ("dietary_options_id");
  CREATE INDEX "_food_items_v_rels_media_id_idx" ON "_food_items_v_rels" USING btree ("media_id");
  CREATE INDEX "vendors_operating_hours_order_idx" ON "vendors_operating_hours" USING btree ("_order");
  CREATE INDEX "vendors_operating_hours_parent_id_idx" ON "vendors_operating_hours" USING btree ("_parent_id");
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
  CREATE UNIQUE INDEX "vendors_slug_idx" ON "vendors" USING btree ("slug");
  CREATE INDEX "vendors_images_images_main_idx" ON "vendors" USING btree ("images_main_id");
  CREATE INDEX "vendors_updated_at_idx" ON "vendors" USING btree ("updated_at");
  CREATE INDEX "vendors_created_at_idx" ON "vendors" USING btree ("created_at");
  CREATE INDEX "vendors__status_idx" ON "vendors" USING btree ("_status");
  CREATE INDEX "vendors_rels_order_idx" ON "vendors_rels" USING btree ("order");
  CREATE INDEX "vendors_rels_parent_idx" ON "vendors_rels" USING btree ("parent_id");
  CREATE INDEX "vendors_rels_path_idx" ON "vendors_rels" USING btree ("path");
  CREATE INDEX "vendors_rels_food_items_id_idx" ON "vendors_rels" USING btree ("food_items_id");
  CREATE INDEX "vendors_rels_dietary_options_id_idx" ON "vendors_rels" USING btree ("dietary_options_id");
  CREATE INDEX "_vendors_v_version_operating_hours_order_idx" ON "_vendors_v_version_operating_hours" USING btree ("_order");
  CREATE INDEX "_vendors_v_version_operating_hours_parent_id_idx" ON "_vendors_v_version_operating_hours" USING btree ("_parent_id");
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
  CREATE INDEX "_vendors_v_parent_idx" ON "_vendors_v" USING btree ("parent_id");
  CREATE INDEX "_vendors_v_version_version_slug_idx" ON "_vendors_v" USING btree ("version_slug");
  CREATE INDEX "_vendors_v_version_images_version_images_main_idx" ON "_vendors_v" USING btree ("version_images_main_id");
  CREATE INDEX "_vendors_v_version_version_updated_at_idx" ON "_vendors_v" USING btree ("version_updated_at");
  CREATE INDEX "_vendors_v_version_version_created_at_idx" ON "_vendors_v" USING btree ("version_created_at");
  CREATE INDEX "_vendors_v_version_version__status_idx" ON "_vendors_v" USING btree ("version__status");
  CREATE INDEX "_vendors_v_created_at_idx" ON "_vendors_v" USING btree ("created_at");
  CREATE INDEX "_vendors_v_updated_at_idx" ON "_vendors_v" USING btree ("updated_at");
  CREATE INDEX "_vendors_v_latest_idx" ON "_vendors_v" USING btree ("latest");
  CREATE INDEX "_vendors_v_autosave_idx" ON "_vendors_v" USING btree ("autosave");
  CREATE INDEX "_vendors_v_rels_order_idx" ON "_vendors_v_rels" USING btree ("order");
  CREATE INDEX "_vendors_v_rels_parent_idx" ON "_vendors_v_rels" USING btree ("parent_id");
  CREATE INDEX "_vendors_v_rels_path_idx" ON "_vendors_v_rels" USING btree ("path");
  CREATE INDEX "_vendors_v_rels_food_items_id_idx" ON "_vendors_v_rels" USING btree ("food_items_id");
  CREATE INDEX "_vendors_v_rels_dietary_options_id_idx" ON "_vendors_v_rels" USING btree ("dietary_options_id");
  CREATE UNIQUE INDEX "dietary_landing_pages_slug_idx" ON "dietary_landing_pages" USING btree ("slug");
  CREATE INDEX "dietary_landing_pages_meta_meta_image_idx" ON "dietary_landing_pages" USING btree ("meta_image_id");
  CREATE INDEX "dietary_landing_pages_updated_at_idx" ON "dietary_landing_pages" USING btree ("updated_at");
  CREATE INDEX "dietary_landing_pages_created_at_idx" ON "dietary_landing_pages" USING btree ("created_at");
  CREATE UNIQUE INDEX "specialty_landing_pages_slug_idx" ON "specialty_landing_pages" USING btree ("slug");
  CREATE INDEX "specialty_landing_pages_meta_meta_image_idx" ON "specialty_landing_pages" USING btree ("meta_image_id");
  CREATE INDEX "specialty_landing_pages_updated_at_idx" ON "specialty_landing_pages" USING btree ("updated_at");
  CREATE INDEX "specialty_landing_pages_created_at_idx" ON "specialty_landing_pages" USING btree ("created_at");
  CREATE UNIQUE INDEX "travel_type_landing_pages_slug_idx" ON "travel_type_landing_pages" USING btree ("slug");
  CREATE INDEX "travel_type_landing_pages_meta_meta_image_idx" ON "travel_type_landing_pages" USING btree ("meta_image_id");
  CREATE INDEX "travel_type_landing_pages_updated_at_idx" ON "travel_type_landing_pages" USING btree ("updated_at");
  CREATE INDEX "travel_type_landing_pages_created_at_idx" ON "travel_type_landing_pages" USING btree ("created_at");
  CREATE UNIQUE INDEX "location_landing_pages_slug_idx" ON "location_landing_pages" USING btree ("slug");
  CREATE INDEX "location_landing_pages_meta_meta_image_idx" ON "location_landing_pages" USING btree ("meta_image_id");
  CREATE INDEX "location_landing_pages_updated_at_idx" ON "location_landing_pages" USING btree ("updated_at");
  CREATE INDEX "location_landing_pages_created_at_idx" ON "location_landing_pages" USING btree ("created_at");
  CREATE INDEX "about_page_breadcrumbs_order_idx" ON "about_page_breadcrumbs" USING btree ("_order");
  CREATE INDEX "about_page_breadcrumbs_parent_id_idx" ON "about_page_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "about_page_breadcrumbs_doc_idx" ON "about_page_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "about_page_parent_idx" ON "about_page" USING btree ("parent_id");
  CREATE INDEX "about_page_updated_at_idx" ON "about_page" USING btree ("updated_at");
  CREATE INDEX "about_page_created_at_idx" ON "about_page" USING btree ("created_at");
  CREATE INDEX "contact_page_breadcrumbs_order_idx" ON "contact_page_breadcrumbs" USING btree ("_order");
  CREATE INDEX "contact_page_breadcrumbs_parent_id_idx" ON "contact_page_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "contact_page_breadcrumbs_doc_idx" ON "contact_page_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "contact_page_parent_idx" ON "contact_page" USING btree ("parent_id");
  CREATE INDEX "contact_page_updated_at_idx" ON "contact_page" USING btree ("updated_at");
  CREATE INDEX "contact_page_created_at_idx" ON "contact_page" USING btree ("created_at");
  CREATE INDEX "thank_you_pages_next_steps_order_idx" ON "thank_you_pages_next_steps" USING btree ("_order");
  CREATE INDEX "thank_you_pages_next_steps_parent_id_idx" ON "thank_you_pages_next_steps" USING btree ("_parent_id");
  CREATE INDEX "thank_you_pages_cta_section_cta_buttons_order_idx" ON "thank_you_pages_cta_section_cta_buttons" USING btree ("_order");
  CREATE INDEX "thank_you_pages_cta_section_cta_buttons_parent_id_idx" ON "thank_you_pages_cta_section_cta_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "thank_you_pages_slug_idx" ON "thank_you_pages" USING btree ("slug");
  CREATE INDEX "thank_you_pages_updated_at_idx" ON "thank_you_pages" USING btree ("updated_at");
  CREATE INDEX "thank_you_pages_created_at_idx" ON "thank_you_pages" USING btree ("created_at");
  CREATE INDEX "translations_updated_at_idx" ON "translations" USING btree ("updated_at");
  CREATE INDEX "translations_created_at_idx" ON "translations" USING btree ("created_at");
  CREATE INDEX "translations_rels_order_idx" ON "translations_rels" USING btree ("order");
  CREATE INDEX "translations_rels_parent_idx" ON "translations_rels" USING btree ("parent_id");
  CREATE INDEX "translations_rels_path_idx" ON "translations_rels" USING btree ("path");
  CREATE INDEX "translations_rels_tours_id_idx" ON "translations_rels" USING btree ("tours_id");
  CREATE INDEX "translations_rels_stories_id_idx" ON "translations_rels" USING btree ("stories_id");
  CREATE INDEX "translations_rels_testimonials_id_idx" ON "translations_rels" USING btree ("testimonials_id");
  CREATE INDEX "translations_rels_faqs_id_idx" ON "translations_rels" USING btree ("faqs_id");
  CREATE INDEX "translations_rels_media_coverage_id_idx" ON "translations_rels" USING btree ("media_coverage_id");
  CREATE INDEX "translations_rels_dietary_landing_pages_id_idx" ON "translations_rels" USING btree ("dietary_landing_pages_id");
  CREATE INDEX "translations_rels_specialty_landing_pages_id_idx" ON "translations_rels" USING btree ("specialty_landing_pages_id");
  CREATE INDEX "translations_rels_travel_type_landing_pages_id_idx" ON "translations_rels" USING btree ("travel_type_landing_pages_id");
  CREATE INDEX "translations_rels_location_landing_pages_id_idx" ON "translations_rels" USING btree ("location_landing_pages_id");
  CREATE INDEX "site_settings_updated_at_idx" ON "site_settings" USING btree ("updated_at");
  CREATE INDEX "site_settings_created_at_idx" ON "site_settings" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_tours_id_idx" ON "redirects_rels" USING btree ("tours_id");
  CREATE INDEX "redirects_rels_stories_id_idx" ON "redirects_rels" USING btree ("stories_id");
  CREATE INDEX "redirects_rels_dietary_landing_pages_id_idx" ON "redirects_rels" USING btree ("dietary_landing_pages_id");
  CREATE INDEX "redirects_rels_specialty_landing_pages_id_idx" ON "redirects_rels" USING btree ("specialty_landing_pages_id");
  CREATE INDEX "redirects_rels_travel_type_landing_pages_id_idx" ON "redirects_rels" USING btree ("travel_type_landing_pages_id");
  CREATE INDEX "redirects_rels_location_landing_pages_id_idx" ON "redirects_rels" USING btree ("location_landing_pages_id");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_tours_id_idx" ON "search_rels" USING btree ("tours_id");
  CREATE INDEX "search_rels_stories_id_idx" ON "search_rels" USING btree ("stories_id");
  CREATE INDEX "search_rels_faqs_id_idx" ON "search_rels" USING btree ("faqs_id");
  CREATE INDEX "search_rels_testimonials_id_idx" ON "search_rels" USING btree ("testimonials_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
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
  CREATE INDEX "payload_locked_documents_rels_dietary_landing_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("dietary_landing_pages_id");
  CREATE INDEX "payload_locked_documents_rels_specialty_landing_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("specialty_landing_pages_id");
  CREATE INDEX "payload_locked_documents_rels_travel_type_landing_pages__idx" ON "payload_locked_documents_rels" USING btree ("travel_type_landing_pages_id");
  CREATE INDEX "payload_locked_documents_rels_location_landing_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("location_landing_pages_id");
  CREATE INDEX "payload_locked_documents_rels_about_page_id_idx" ON "payload_locked_documents_rels" USING btree ("about_page_id");
  CREATE INDEX "payload_locked_documents_rels_contact_page_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_page_id");
  CREATE INDEX "payload_locked_documents_rels_thank_you_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("thank_you_pages_id");
  CREATE INDEX "payload_locked_documents_rels_translations_id_idx" ON "payload_locked_documents_rels" USING btree ("translations_id");
  CREATE INDEX "payload_locked_documents_rels_site_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("site_settings_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
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
  DROP TABLE "tours_gallery_images" CASCADE;
  DROP TABLE "tours_whats_included" CASCADE;
  DROP TABLE "tours_whats_excluded" CASCADE;
  DROP TABLE "tours_highlights" CASCADE;
  DROP TABLE "tours" CASCADE;
  DROP TABLE "tours_rels" CASCADE;
  DROP TABLE "_tours_v_version_gallery_images" CASCADE;
  DROP TABLE "_tours_v_version_whats_included" CASCADE;
  DROP TABLE "_tours_v_version_whats_excluded" CASCADE;
  DROP TABLE "_tours_v_version_highlights" CASCADE;
  DROP TABLE "_tours_v" CASCADE;
  DROP TABLE "_tours_v_rels" CASCADE;
  DROP TABLE "stories" CASCADE;
  DROP TABLE "_stories_v" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "_testimonials_v" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "_faqs_v" CASCADE;
  DROP TABLE "media_coverage" CASCADE;
  DROP TABLE "dietary_options" CASCADE;
  DROP TABLE "_dietary_options_v" CASCADE;
  DROP TABLE "food_items_local_names" CASCADE;
  DROP TABLE "food_items_ingredients" CASCADE;
  DROP TABLE "food_items_allergens" CASCADE;
  DROP TABLE "food_items_flavor_profile" CASCADE;
  DROP TABLE "food_items" CASCADE;
  DROP TABLE "food_items_rels" CASCADE;
  DROP TABLE "_food_items_v_version_local_names" CASCADE;
  DROP TABLE "_food_items_v_version_ingredients" CASCADE;
  DROP TABLE "_food_items_v_version_allergens" CASCADE;
  DROP TABLE "_food_items_v_version_flavor_profile" CASCADE;
  DROP TABLE "_food_items_v" CASCADE;
  DROP TABLE "_food_items_v_rels" CASCADE;
  DROP TABLE "vendors_operating_hours" CASCADE;
  DROP TABLE "vendors_closed_on" CASCADE;
  DROP TABLE "vendors_payment_methods" CASCADE;
  DROP TABLE "vendors_facilities" CASCADE;
  DROP TABLE "vendors_images_gallery" CASCADE;
  DROP TABLE "vendors_awards" CASCADE;
  DROP TABLE "vendors" CASCADE;
  DROP TABLE "vendors_rels" CASCADE;
  DROP TABLE "_vendors_v_version_operating_hours" CASCADE;
  DROP TABLE "_vendors_v_version_closed_on" CASCADE;
  DROP TABLE "_vendors_v_version_payment_methods" CASCADE;
  DROP TABLE "_vendors_v_version_facilities" CASCADE;
  DROP TABLE "_vendors_v_version_images_gallery" CASCADE;
  DROP TABLE "_vendors_v_version_awards" CASCADE;
  DROP TABLE "_vendors_v" CASCADE;
  DROP TABLE "_vendors_v_rels" CASCADE;
  DROP TABLE "dietary_landing_pages" CASCADE;
  DROP TABLE "specialty_landing_pages" CASCADE;
  DROP TABLE "travel_type_landing_pages" CASCADE;
  DROP TABLE "location_landing_pages" CASCADE;
  DROP TABLE "about_page_breadcrumbs" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "contact_page_breadcrumbs" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "thank_you_pages_next_steps" CASCADE;
  DROP TABLE "thank_you_pages_cta_section_cta_buttons" CASCADE;
  DROP TABLE "thank_you_pages" CASCADE;
  DROP TABLE "translations" CASCADE;
  DROP TABLE "translations_rels" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_tours_status";
  DROP TYPE "public"."enum_tours_workflow_status";
  DROP TYPE "public"."enum__tours_v_version_status";
  DROP TYPE "public"."enum__tours_v_version_workflow_status";
  DROP TYPE "public"."enum_stories_status";
  DROP TYPE "public"."enum_stories_workflow_status";
  DROP TYPE "public"."enum__stories_v_version_status";
  DROP TYPE "public"."enum__stories_v_version_workflow_status";
  DROP TYPE "public"."enum_testimonials_workflow_status";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum__testimonials_v_version_workflow_status";
  DROP TYPE "public"."enum__testimonials_v_version_status";
  DROP TYPE "public"."enum_faqs_workflow_status";
  DROP TYPE "public"."enum_faqs_status";
  DROP TYPE "public"."enum__faqs_v_version_workflow_status";
  DROP TYPE "public"."enum__faqs_v_version_status";
  DROP TYPE "public"."enum_media_coverage_status";
  DROP TYPE "public"."enum_dietary_options_status";
  DROP TYPE "public"."enum__dietary_options_v_version_status";
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
  DROP TYPE "public"."enum_vendors_operating_hours_day";
  DROP TYPE "public"."enum_vendors_closed_on_day";
  DROP TYPE "public"."enum_vendors_payment_methods_method";
  DROP TYPE "public"."enum_vendors_facilities_facility";
  DROP TYPE "public"."enum_vendors_type";
  DROP TYPE "public"."enum_vendors_cuisine_type";
  DROP TYPE "public"."enum_vendors_location_state";
  DROP TYPE "public"."enum_vendors_price_range";
  DROP TYPE "public"."enum_vendors_status";
  DROP TYPE "public"."enum__vendors_v_version_operating_hours_day";
  DROP TYPE "public"."enum__vendors_v_version_closed_on_day";
  DROP TYPE "public"."enum__vendors_v_version_payment_methods_method";
  DROP TYPE "public"."enum__vendors_v_version_facilities_facility";
  DROP TYPE "public"."enum__vendors_v_version_type";
  DROP TYPE "public"."enum__vendors_v_version_cuisine_type";
  DROP TYPE "public"."enum__vendors_v_version_location_state";
  DROP TYPE "public"."enum__vendors_v_version_price_range";
  DROP TYPE "public"."enum__vendors_v_version_status";
  DROP TYPE "public"."enum_dietary_landing_pages_status";
  DROP TYPE "public"."enum_specialty_landing_pages_status";
  DROP TYPE "public"."enum_travel_type_landing_pages_status";
  DROP TYPE "public"."enum_location_landing_pages_status";
  DROP TYPE "public"."enum_thank_you_pages_cta_section_cta_buttons_variant";
  DROP TYPE "public"."enum_thank_you_pages_type";
  DROP TYPE "public"."enum_thank_you_pages_status";
  DROP TYPE "public"."enum_translations_locale";
  DROP TYPE "public"."enum_translations_collection";
  DROP TYPE "public"."enum_translations_status";
  DROP TYPE "public"."enum_redirects_to_type";`)
}
