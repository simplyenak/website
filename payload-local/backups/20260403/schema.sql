--
-- PostgreSQL database dump
--

\restrict qccm1nK0q4t16rNMTzV2VaUzLgblJtb0LjbPUhJ7eVIgGMufvl5eRno7u9c8xa6

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.vendors_rels DROP CONSTRAINT IF EXISTS vendors_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public.vendors_rels DROP CONSTRAINT IF EXISTS vendors_rels_food_items_fk;
ALTER TABLE IF EXISTS ONLY public.vendors_rels DROP CONSTRAINT IF EXISTS vendors_rels_dietary_options_fk;
ALTER TABLE IF EXISTS ONLY public.vendors_payment_methods DROP CONSTRAINT IF EXISTS vendors_payment_methods_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.vendors_operating_hours DROP CONSTRAINT IF EXISTS vendors_operating_hours_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.vendors DROP CONSTRAINT IF EXISTS vendors_images_main_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.vendors_images_gallery DROP CONSTRAINT IF EXISTS vendors_images_gallery_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.vendors_images_gallery DROP CONSTRAINT IF EXISTS vendors_images_gallery_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.vendors_facilities DROP CONSTRAINT IF EXISTS vendors_facilities_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.vendors_closed_on DROP CONSTRAINT IF EXISTS vendors_closed_on_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.vendors_awards DROP CONSTRAINT IF EXISTS vendors_awards_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.users_sessions DROP CONSTRAINT IF EXISTS users_sessions_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.travel_type_landing_pages DROP CONSTRAINT IF EXISTS travel_type_landing_pages_meta_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_travel_type_landing_pages_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_tours_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_testimonials_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_stories_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_specialty_landing_pages_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_media_coverage_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_location_landing_pages_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_legal_pages_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_home_page_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_faqs_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_dietary_landing_pages_fk;
ALTER TABLE IF EXISTS ONLY public.tours_whats_included DROP CONSTRAINT IF EXISTS tours_whats_included_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.tours_whats_excluded DROP CONSTRAINT IF EXISTS tours_whats_excluded_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.tours_rels DROP CONSTRAINT IF EXISTS tours_rels_travel_type_landing_pages_fk;
ALTER TABLE IF EXISTS ONLY public.tours_rels DROP CONSTRAINT IF EXISTS tours_rels_specialty_landing_pages_fk;
ALTER TABLE IF EXISTS ONLY public.tours_rels DROP CONSTRAINT IF EXISTS tours_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public.tours_rels DROP CONSTRAINT IF EXISTS tours_rels_food_items_fk;
ALTER TABLE IF EXISTS ONLY public.tours_rels DROP CONSTRAINT IF EXISTS tours_rels_dietary_options_fk;
ALTER TABLE IF EXISTS ONLY public.tours DROP CONSTRAINT IF EXISTS tours_meta_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.tours_highlights DROP CONSTRAINT IF EXISTS tours_highlights_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.tours_gallery_images DROP CONSTRAINT IF EXISTS tours_gallery_images_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.thank_you_pages_next_steps DROP CONSTRAINT IF EXISTS thank_you_pages_next_steps_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.thank_you_pages_cta_section_cta_buttons DROP CONSTRAINT IF EXISTS thank_you_pages_cta_section_cta_buttons_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.stories DROP CONSTRAINT IF EXISTS stories_meta_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.stories DROP CONSTRAINT IF EXISTS stories_author_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.specialty_landing_pages DROP CONSTRAINT IF EXISTS specialty_landing_pages_meta_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.search_rels DROP CONSTRAINT IF EXISTS search_rels_tours_fk;
ALTER TABLE IF EXISTS ONLY public.search_rels DROP CONSTRAINT IF EXISTS search_rels_testimonials_fk;
ALTER TABLE IF EXISTS ONLY public.search_rels DROP CONSTRAINT IF EXISTS search_rels_stories_fk;
ALTER TABLE IF EXISTS ONLY public.search_rels DROP CONSTRAINT IF EXISTS search_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public.search_rels DROP CONSTRAINT IF EXISTS search_rels_faqs_fk;
ALTER TABLE IF EXISTS ONLY public.redirects_rels DROP CONSTRAINT IF EXISTS redirects_rels_travel_type_landing_pages_fk;
ALTER TABLE IF EXISTS ONLY public.redirects_rels DROP CONSTRAINT IF EXISTS redirects_rels_tours_fk;
ALTER TABLE IF EXISTS ONLY public.redirects_rels DROP CONSTRAINT IF EXISTS redirects_rels_stories_fk;
ALTER TABLE IF EXISTS ONLY public.redirects_rels DROP CONSTRAINT IF EXISTS redirects_rels_specialty_landing_pages_fk;
ALTER TABLE IF EXISTS ONLY public.redirects_rels DROP CONSTRAINT IF EXISTS redirects_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public.redirects_rels DROP CONSTRAINT IF EXISTS redirects_rels_location_landing_pages_fk;
ALTER TABLE IF EXISTS ONLY public.redirects_rels DROP CONSTRAINT IF EXISTS redirects_rels_dietary_landing_pages_fk;
ALTER TABLE IF EXISTS ONLY public.payload_preferences_rels DROP CONSTRAINT IF EXISTS payload_preferences_rels_users_fk;
ALTER TABLE IF EXISTS ONLY public.payload_preferences_rels DROP CONSTRAINT IF EXISTS payload_preferences_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_vendors_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_users_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_travel_type_landing_pages_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_translations_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_tours_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_thank_you_pages_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_testimonials_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_stories_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_specialty_landing_pages_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_site_settings_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_search_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_redirects_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_media_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_media_coverage_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_location_landing_pages_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_food_items_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_faqs_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_dietary_options_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_dietary_landing_pages_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_contact_page_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_about_page_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_docs_travel_types_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_docs_specialty_experiences_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_docs_menus_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_docs_locations_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_docs_legal_pages_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_docs_home_page_fk;
ALTER TABLE IF EXISTS ONLY public.location_landing_pages DROP CONSTRAINT IF EXISTS location_landing_pages_meta_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_cta_block DROP CONSTRAINT IF EXISTS home_page_cta_section__parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_vendors_block_links DROP CONSTRAINT IF EXISTS home_page_blocks_vendors_block_links__parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_vendors_block DROP CONSTRAINT IF EXISTS home_page_blocks_vendors_block__parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_stats_block_stats DROP CONSTRAINT IF EXISTS home_page_blocks_stats_block_stats__parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_stats_block DROP CONSTRAINT IF EXISTS home_page_blocks_stats_block__parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_segments_block DROP CONSTRAINT IF EXISTS home_page_blocks_segments_block__parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_pillars_block_pillars DROP CONSTRAINT IF EXISTS home_page_blocks_pillars_block_pillars__parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_pillars_block DROP CONSTRAINT IF EXISTS home_page_blocks_pillars_block__parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_manifesto_block DROP CONSTRAINT IF EXISTS home_page_blocks_manifesto_block__parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_hero_block_badges DROP CONSTRAINT IF EXISTS home_page_blocks_hero_block_badges__parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_hero_block DROP CONSTRAINT IF EXISTS home_page_blocks_hero_block__parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_cta_block_features DROP CONSTRAINT IF EXISTS home_page_blocks_cta_block_features__parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_cta_block_buttons DROP CONSTRAINT IF EXISTS home_page_blocks_cta_block_buttons__parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_about_block DROP CONSTRAINT IF EXISTS home_page_blocks_about_block__parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.food_items_rels DROP CONSTRAINT IF EXISTS food_items_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public.food_items_rels DROP CONSTRAINT IF EXISTS food_items_rels_media_fk;
ALTER TABLE IF EXISTS ONLY public.food_items_rels DROP CONSTRAINT IF EXISTS food_items_rels_dietary_options_fk;
ALTER TABLE IF EXISTS ONLY public.food_items_local_names DROP CONSTRAINT IF EXISTS food_items_local_names_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.food_items_ingredients DROP CONSTRAINT IF EXISTS food_items_ingredients_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.food_items DROP CONSTRAINT IF EXISTS food_items_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.food_items_flavor_profile DROP CONSTRAINT IF EXISTS food_items_flavor_profile_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.food_items_allergens DROP CONSTRAINT IF EXISTS food_items_allergens_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.dietary_landing_pages DROP CONSTRAINT IF EXISTS dietary_landing_pages_meta_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.contact_page DROP CONSTRAINT IF EXISTS contact_page_parent_id_contact_page_id_fk;
ALTER TABLE IF EXISTS ONLY public.contact_page_breadcrumbs DROP CONSTRAINT IF EXISTS contact_page_breadcrumbs_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.contact_page_breadcrumbs DROP CONSTRAINT IF EXISTS contact_page_breadcrumbs_doc_id_contact_page_id_fk;
ALTER TABLE IF EXISTS ONLY public.about_page DROP CONSTRAINT IF EXISTS about_page_parent_id_about_page_id_fk;
ALTER TABLE IF EXISTS ONLY public.about_page_breadcrumbs DROP CONSTRAINT IF EXISTS about_page_breadcrumbs_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.about_page_breadcrumbs DROP CONSTRAINT IF EXISTS about_page_breadcrumbs_doc_id_about_page_id_fk;
ALTER TABLE IF EXISTS ONLY public._vendors_v_version_payment_methods DROP CONSTRAINT IF EXISTS _vendors_v_version_payment_methods_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public._vendors_v_version_operating_hours DROP CONSTRAINT IF EXISTS _vendors_v_version_operating_hours_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public._vendors_v DROP CONSTRAINT IF EXISTS _vendors_v_version_images_main_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public._vendors_v_version_images_gallery DROP CONSTRAINT IF EXISTS _vendors_v_version_images_gallery_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public._vendors_v_version_images_gallery DROP CONSTRAINT IF EXISTS _vendors_v_version_images_gallery_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public._vendors_v_version_facilities DROP CONSTRAINT IF EXISTS _vendors_v_version_facilities_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public._vendors_v_version_closed_on DROP CONSTRAINT IF EXISTS _vendors_v_version_closed_on_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public._vendors_v_version_awards DROP CONSTRAINT IF EXISTS _vendors_v_version_awards_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public._vendors_v_rels DROP CONSTRAINT IF EXISTS _vendors_v_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public._vendors_v_rels DROP CONSTRAINT IF EXISTS _vendors_v_rels_food_items_fk;
ALTER TABLE IF EXISTS ONLY public._vendors_v_rels DROP CONSTRAINT IF EXISTS _vendors_v_rels_dietary_options_fk;
ALTER TABLE IF EXISTS ONLY public._vendors_v DROP CONSTRAINT IF EXISTS _vendors_v_parent_id_vendors_id_fk;
ALTER TABLE IF EXISTS ONLY public._tours_v_version_whats_included DROP CONSTRAINT IF EXISTS _tours_v_version_whats_included_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public._tours_v_version_whats_excluded DROP CONSTRAINT IF EXISTS _tours_v_version_whats_excluded_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public._tours_v DROP CONSTRAINT IF EXISTS _tours_v_version_meta_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public._tours_v_version_highlights DROP CONSTRAINT IF EXISTS _tours_v_version_highlights_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public._tours_v_version_gallery_images DROP CONSTRAINT IF EXISTS _tours_v_version_gallery_images_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public._tours_v_rels DROP CONSTRAINT IF EXISTS _tours_v_rels_travel_type_landing_pages_fk;
ALTER TABLE IF EXISTS ONLY public._tours_v_rels DROP CONSTRAINT IF EXISTS _tours_v_rels_specialty_landing_pages_fk;
ALTER TABLE IF EXISTS ONLY public._tours_v_rels DROP CONSTRAINT IF EXISTS _tours_v_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public._tours_v_rels DROP CONSTRAINT IF EXISTS _tours_v_rels_food_items_fk;
ALTER TABLE IF EXISTS ONLY public._tours_v_rels DROP CONSTRAINT IF EXISTS _tours_v_rels_dietary_options_fk;
ALTER TABLE IF EXISTS ONLY public._tours_v DROP CONSTRAINT IF EXISTS _tours_v_parent_id_tours_id_fk;
ALTER TABLE IF EXISTS ONLY public._testimonials_v DROP CONSTRAINT IF EXISTS _testimonials_v_parent_id_testimonials_id_fk;
ALTER TABLE IF EXISTS ONLY public._stories_v DROP CONSTRAINT IF EXISTS _stories_v_version_meta_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public._stories_v DROP CONSTRAINT IF EXISTS _stories_v_version_author_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public._stories_v DROP CONSTRAINT IF EXISTS _stories_v_parent_id_stories_id_fk;
ALTER TABLE IF EXISTS ONLY public.menus_items DROP CONSTRAINT IF EXISTS _menus_items_v__parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public._legal_pages_v DROP CONSTRAINT IF EXISTS _legal_pages_v_parent_fkey;
ALTER TABLE IF EXISTS ONLY public._home_page_v DROP CONSTRAINT IF EXISTS _home_page_v_parent_fkey;
ALTER TABLE IF EXISTS ONLY public._food_items_v_version_local_names DROP CONSTRAINT IF EXISTS _food_items_v_version_local_names_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public._food_items_v_version_ingredients DROP CONSTRAINT IF EXISTS _food_items_v_version_ingredients_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public._food_items_v DROP CONSTRAINT IF EXISTS _food_items_v_version_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public._food_items_v_version_flavor_profile DROP CONSTRAINT IF EXISTS _food_items_v_version_flavor_profile_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public._food_items_v_version_allergens DROP CONSTRAINT IF EXISTS _food_items_v_version_allergens_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public._food_items_v_rels DROP CONSTRAINT IF EXISTS _food_items_v_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public._food_items_v_rels DROP CONSTRAINT IF EXISTS _food_items_v_rels_media_fk;
ALTER TABLE IF EXISTS ONLY public._food_items_v_rels DROP CONSTRAINT IF EXISTS _food_items_v_rels_dietary_options_fk;
ALTER TABLE IF EXISTS ONLY public._food_items_v DROP CONSTRAINT IF EXISTS _food_items_v_parent_id_food_items_id_fk;
ALTER TABLE IF EXISTS ONLY public._faqs_v DROP CONSTRAINT IF EXISTS _faqs_v_parent_id_faqs_id_fk;
ALTER TABLE IF EXISTS ONLY public._dietary_options_v DROP CONSTRAINT IF EXISTS _dietary_options_v_parent_id_dietary_options_id_fk;
DROP INDEX IF EXISTS public.vendors_updated_at_idx;
DROP INDEX IF EXISTS public.vendors_slug_idx;
DROP INDEX IF EXISTS public.vendors_rels_path_idx;
DROP INDEX IF EXISTS public.vendors_rels_parent_idx;
DROP INDEX IF EXISTS public.vendors_rels_order_idx;
DROP INDEX IF EXISTS public.vendors_rels_food_items_id_idx;
DROP INDEX IF EXISTS public.vendors_rels_dietary_options_id_idx;
DROP INDEX IF EXISTS public.vendors_payment_methods_parent_id_idx;
DROP INDEX IF EXISTS public.vendors_payment_methods_order_idx;
DROP INDEX IF EXISTS public.vendors_operating_hours_parent_id_idx;
DROP INDEX IF EXISTS public.vendors_operating_hours_order_idx;
DROP INDEX IF EXISTS public.vendors_images_images_main_idx;
DROP INDEX IF EXISTS public.vendors_images_gallery_parent_id_idx;
DROP INDEX IF EXISTS public.vendors_images_gallery_order_idx;
DROP INDEX IF EXISTS public.vendors_images_gallery_image_idx;
DROP INDEX IF EXISTS public.vendors_facilities_parent_id_idx;
DROP INDEX IF EXISTS public.vendors_facilities_order_idx;
DROP INDEX IF EXISTS public.vendors_created_at_idx;
DROP INDEX IF EXISTS public.vendors_closed_on_parent_id_idx;
DROP INDEX IF EXISTS public.vendors_closed_on_order_idx;
DROP INDEX IF EXISTS public.vendors_awards_parent_id_idx;
DROP INDEX IF EXISTS public.vendors_awards_order_idx;
DROP INDEX IF EXISTS public.vendors__status_idx;
DROP INDEX IF EXISTS public.users_updated_at_idx;
DROP INDEX IF EXISTS public.users_sessions_parent_id_idx;
DROP INDEX IF EXISTS public.users_sessions_order_idx;
DROP INDEX IF EXISTS public.users_email_idx;
DROP INDEX IF EXISTS public.users_created_at_idx;
DROP INDEX IF EXISTS public.travel_type_landing_pages_updated_at_idx;
DROP INDEX IF EXISTS public.travel_type_landing_pages_slug_idx;
DROP INDEX IF EXISTS public.travel_type_landing_pages_meta_meta_image_idx;
DROP INDEX IF EXISTS public.travel_type_landing_pages_created_at_idx;
DROP INDEX IF EXISTS public.translations_updated_at_idx;
DROP INDEX IF EXISTS public.translations_rels_travel_type_landing_pages_id_idx;
DROP INDEX IF EXISTS public.translations_rels_tours_id_idx;
DROP INDEX IF EXISTS public.translations_rels_testimonials_id_idx;
DROP INDEX IF EXISTS public.translations_rels_stories_id_idx;
DROP INDEX IF EXISTS public.translations_rels_specialty_landing_pages_id_idx;
DROP INDEX IF EXISTS public.translations_rels_path_idx;
DROP INDEX IF EXISTS public.translations_rels_parent_idx;
DROP INDEX IF EXISTS public.translations_rels_order_idx;
DROP INDEX IF EXISTS public.translations_rels_media_coverage_id_idx;
DROP INDEX IF EXISTS public.translations_rels_location_landing_pages_id_idx;
DROP INDEX IF EXISTS public.translations_rels_legal_pages_id_idx;
DROP INDEX IF EXISTS public.translations_rels_home_page_id_idx;
DROP INDEX IF EXISTS public.translations_rels_faqs_id_idx;
DROP INDEX IF EXISTS public.translations_rels_dietary_landing_pages_id_idx;
DROP INDEX IF EXISTS public.translations_created_at_idx;
DROP INDEX IF EXISTS public.tours_whats_included_parent_id_idx;
DROP INDEX IF EXISTS public.tours_whats_included_order_idx;
DROP INDEX IF EXISTS public.tours_whats_excluded_parent_id_idx;
DROP INDEX IF EXISTS public.tours_whats_excluded_order_idx;
DROP INDEX IF EXISTS public.tours_updated_at_idx;
DROP INDEX IF EXISTS public.tours_slug_idx;
DROP INDEX IF EXISTS public.tours_rels_travel_type_landing_pages_id_idx;
DROP INDEX IF EXISTS public.tours_rels_specialty_landing_pages_id_idx;
DROP INDEX IF EXISTS public.tours_rels_path_idx;
DROP INDEX IF EXISTS public.tours_rels_parent_idx;
DROP INDEX IF EXISTS public.tours_rels_order_idx;
DROP INDEX IF EXISTS public.tours_rels_food_items_id_idx;
DROP INDEX IF EXISTS public.tours_rels_dietary_options_id_idx;
DROP INDEX IF EXISTS public.tours_meta_meta_image_idx;
DROP INDEX IF EXISTS public.tours_highlights_parent_id_idx;
DROP INDEX IF EXISTS public.tours_highlights_order_idx;
DROP INDEX IF EXISTS public.tours_gallery_images_parent_id_idx;
DROP INDEX IF EXISTS public.tours_gallery_images_order_idx;
DROP INDEX IF EXISTS public.tours_created_at_idx;
DROP INDEX IF EXISTS public.tours__status_idx;
DROP INDEX IF EXISTS public.thank_you_pages_updated_at_idx;
DROP INDEX IF EXISTS public.thank_you_pages_slug_idx;
DROP INDEX IF EXISTS public.thank_you_pages_next_steps_parent_id_idx;
DROP INDEX IF EXISTS public.thank_you_pages_next_steps_order_idx;
DROP INDEX IF EXISTS public.thank_you_pages_cta_section_cta_buttons_parent_id_idx;
DROP INDEX IF EXISTS public.thank_you_pages_cta_section_cta_buttons_order_idx;
DROP INDEX IF EXISTS public.thank_you_pages_created_at_idx;
DROP INDEX IF EXISTS public.testimonials_updated_at_idx;
DROP INDEX IF EXISTS public.testimonials_created_at_idx;
DROP INDEX IF EXISTS public.testimonials__status_idx;
DROP INDEX IF EXISTS public.stories_updated_at_idx;
DROP INDEX IF EXISTS public.stories_slug_idx;
DROP INDEX IF EXISTS public.stories_meta_meta_image_idx;
DROP INDEX IF EXISTS public.stories_created_at_idx;
DROP INDEX IF EXISTS public.stories_author_idx;
DROP INDEX IF EXISTS public.stories__status_idx;
DROP INDEX IF EXISTS public.specialty_landing_pages_updated_at_idx;
DROP INDEX IF EXISTS public.specialty_landing_pages_slug_idx;
DROP INDEX IF EXISTS public.specialty_landing_pages_meta_meta_image_idx;
DROP INDEX IF EXISTS public.specialty_landing_pages_created_at_idx;
DROP INDEX IF EXISTS public.site_settings_updated_at_idx;
DROP INDEX IF EXISTS public.site_settings_created_at_idx;
DROP INDEX IF EXISTS public.search_updated_at_idx;
DROP INDEX IF EXISTS public.search_rels_tours_id_idx;
DROP INDEX IF EXISTS public.search_rels_testimonials_id_idx;
DROP INDEX IF EXISTS public.search_rels_stories_id_idx;
DROP INDEX IF EXISTS public.search_rels_path_idx;
DROP INDEX IF EXISTS public.search_rels_parent_idx;
DROP INDEX IF EXISTS public.search_rels_order_idx;
DROP INDEX IF EXISTS public.search_rels_faqs_id_idx;
DROP INDEX IF EXISTS public.search_created_at_idx;
DROP INDEX IF EXISTS public.redirects_updated_at_idx;
DROP INDEX IF EXISTS public.redirects_rels_travel_type_landing_pages_id_idx;
DROP INDEX IF EXISTS public.redirects_rels_tours_id_idx;
DROP INDEX IF EXISTS public.redirects_rels_stories_id_idx;
DROP INDEX IF EXISTS public.redirects_rels_specialty_landing_pages_id_idx;
DROP INDEX IF EXISTS public.redirects_rels_path_idx;
DROP INDEX IF EXISTS public.redirects_rels_parent_idx;
DROP INDEX IF EXISTS public.redirects_rels_order_idx;
DROP INDEX IF EXISTS public.redirects_rels_location_landing_pages_id_idx;
DROP INDEX IF EXISTS public.redirects_rels_dietary_landing_pages_id_idx;
DROP INDEX IF EXISTS public.redirects_from_idx;
DROP INDEX IF EXISTS public.redirects_created_at_idx;
DROP INDEX IF EXISTS public.payload_preferences_updated_at_idx;
DROP INDEX IF EXISTS public.payload_preferences_rels_users_id_idx;
DROP INDEX IF EXISTS public.payload_preferences_rels_path_idx;
DROP INDEX IF EXISTS public.payload_preferences_rels_parent_idx;
DROP INDEX IF EXISTS public.payload_preferences_rels_order_idx;
DROP INDEX IF EXISTS public.payload_preferences_key_idx;
DROP INDEX IF EXISTS public.payload_preferences_created_at_idx;
DROP INDEX IF EXISTS public.payload_migrations_updated_at_idx;
DROP INDEX IF EXISTS public.payload_migrations_created_at_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_updated_at_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_vendors_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_users_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_travel_type_landing_pages__idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_translations_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_tours_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_thank_you_pages_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_testimonials_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_stories_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_specialty_landing_pages_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_site_settings_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_search_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_redirects_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_path_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_parent_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_order_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_media_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_media_coverage_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_location_landing_pages_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_food_items_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_faqs_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_dietary_options_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_dietary_landing_pages_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_contact_page_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_about_page_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_global_slug_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_created_at_idx;
DROP INDEX IF EXISTS public.payload_locked_docs_travel_types_id_idx;
DROP INDEX IF EXISTS public.payload_locked_docs_specialty_experiences_id_idx;
DROP INDEX IF EXISTS public.payload_locked_docs_menus_id_idx;
DROP INDEX IF EXISTS public.payload_locked_docs_locations_id_idx;
DROP INDEX IF EXISTS public.payload_locked_docs_legal_pages_id_idx;
DROP INDEX IF EXISTS public.payload_locked_docs_home_page_id_idx;
DROP INDEX IF EXISTS public.payload_kv_key_idx;
DROP INDEX IF EXISTS public.media_updated_at_idx;
DROP INDEX IF EXISTS public.media_sizes_thumbnail_sizes_thumbnail_filename_idx;
DROP INDEX IF EXISTS public.media_sizes_medium_sizes_medium_filename_idx;
DROP INDEX IF EXISTS public.media_sizes_large_sizes_large_filename_idx;
DROP INDEX IF EXISTS public.media_filename_idx;
DROP INDEX IF EXISTS public.media_created_at_idx;
DROP INDEX IF EXISTS public.media_coverage_updated_at_idx;
DROP INDEX IF EXISTS public.media_coverage_created_at_idx;
DROP INDEX IF EXISTS public.location_landing_pages_updated_at_idx;
DROP INDEX IF EXISTS public.location_landing_pages_slug_idx;
DROP INDEX IF EXISTS public.location_landing_pages_meta_meta_image_idx;
DROP INDEX IF EXISTS public.location_landing_pages_created_at_idx;
DROP INDEX IF EXISTS public.food_items_updated_at_idx;
DROP INDEX IF EXISTS public.food_items_slug_idx;
DROP INDEX IF EXISTS public.food_items_rels_path_idx;
DROP INDEX IF EXISTS public.food_items_rels_parent_idx;
DROP INDEX IF EXISTS public.food_items_rels_order_idx;
DROP INDEX IF EXISTS public.food_items_rels_media_id_idx;
DROP INDEX IF EXISTS public.food_items_rels_dietary_options_id_idx;
DROP INDEX IF EXISTS public.food_items_local_names_parent_id_idx;
DROP INDEX IF EXISTS public.food_items_local_names_order_idx;
DROP INDEX IF EXISTS public.food_items_ingredients_parent_id_idx;
DROP INDEX IF EXISTS public.food_items_ingredients_order_idx;
DROP INDEX IF EXISTS public.food_items_image_idx;
DROP INDEX IF EXISTS public.food_items_flavor_profile_parent_id_idx;
DROP INDEX IF EXISTS public.food_items_flavor_profile_order_idx;
DROP INDEX IF EXISTS public.food_items_created_at_idx;
DROP INDEX IF EXISTS public.food_items_allergens_parent_id_idx;
DROP INDEX IF EXISTS public.food_items_allergens_order_idx;
DROP INDEX IF EXISTS public.food_items__status_idx;
DROP INDEX IF EXISTS public.faqs_updated_at_idx;
DROP INDEX IF EXISTS public.faqs_created_at_idx;
DROP INDEX IF EXISTS public.faqs__status_idx;
DROP INDEX IF EXISTS public.dietary_options_updated_at_idx;
DROP INDEX IF EXISTS public.dietary_options_slug_idx;
DROP INDEX IF EXISTS public.dietary_options_created_at_idx;
DROP INDEX IF EXISTS public.dietary_options__status_idx;
DROP INDEX IF EXISTS public.dietary_landing_pages_updated_at_idx;
DROP INDEX IF EXISTS public.dietary_landing_pages_slug_idx;
DROP INDEX IF EXISTS public.dietary_landing_pages_meta_meta_image_idx;
DROP INDEX IF EXISTS public.dietary_landing_pages_created_at_idx;
DROP INDEX IF EXISTS public.contact_page_updated_at_idx;
DROP INDEX IF EXISTS public.contact_page_parent_idx;
DROP INDEX IF EXISTS public.contact_page_created_at_idx;
DROP INDEX IF EXISTS public.contact_page_breadcrumbs_parent_id_idx;
DROP INDEX IF EXISTS public.contact_page_breadcrumbs_order_idx;
DROP INDEX IF EXISTS public.contact_page_breadcrumbs_doc_idx;
DROP INDEX IF EXISTS public.about_page_updated_at_idx;
DROP INDEX IF EXISTS public.about_page_parent_idx;
DROP INDEX IF EXISTS public.about_page_created_at_idx;
DROP INDEX IF EXISTS public.about_page_breadcrumbs_parent_id_idx;
DROP INDEX IF EXISTS public.about_page_breadcrumbs_order_idx;
DROP INDEX IF EXISTS public.about_page_breadcrumbs_doc_idx;
DROP INDEX IF EXISTS public._vendors_v_version_version_updated_at_idx;
DROP INDEX IF EXISTS public._vendors_v_version_version_slug_idx;
DROP INDEX IF EXISTS public._vendors_v_version_version_created_at_idx;
DROP INDEX IF EXISTS public._vendors_v_version_version__status_idx;
DROP INDEX IF EXISTS public._vendors_v_version_payment_methods_parent_id_idx;
DROP INDEX IF EXISTS public._vendors_v_version_payment_methods_order_idx;
DROP INDEX IF EXISTS public._vendors_v_version_operating_hours_parent_id_idx;
DROP INDEX IF EXISTS public._vendors_v_version_operating_hours_order_idx;
DROP INDEX IF EXISTS public._vendors_v_version_images_version_images_main_idx;
DROP INDEX IF EXISTS public._vendors_v_version_images_gallery_parent_id_idx;
DROP INDEX IF EXISTS public._vendors_v_version_images_gallery_order_idx;
DROP INDEX IF EXISTS public._vendors_v_version_images_gallery_image_idx;
DROP INDEX IF EXISTS public._vendors_v_version_facilities_parent_id_idx;
DROP INDEX IF EXISTS public._vendors_v_version_facilities_order_idx;
DROP INDEX IF EXISTS public._vendors_v_version_closed_on_parent_id_idx;
DROP INDEX IF EXISTS public._vendors_v_version_closed_on_order_idx;
DROP INDEX IF EXISTS public._vendors_v_version_awards_parent_id_idx;
DROP INDEX IF EXISTS public._vendors_v_version_awards_order_idx;
DROP INDEX IF EXISTS public._vendors_v_updated_at_idx;
DROP INDEX IF EXISTS public._vendors_v_rels_path_idx;
DROP INDEX IF EXISTS public._vendors_v_rels_parent_idx;
DROP INDEX IF EXISTS public._vendors_v_rels_order_idx;
DROP INDEX IF EXISTS public._vendors_v_rels_food_items_id_idx;
DROP INDEX IF EXISTS public._vendors_v_rels_dietary_options_id_idx;
DROP INDEX IF EXISTS public._vendors_v_parent_idx;
DROP INDEX IF EXISTS public._vendors_v_latest_idx;
DROP INDEX IF EXISTS public._vendors_v_created_at_idx;
DROP INDEX IF EXISTS public._vendors_v_autosave_idx;
DROP INDEX IF EXISTS public._tours_v_version_whats_included_parent_id_idx;
DROP INDEX IF EXISTS public._tours_v_version_whats_included_order_idx;
DROP INDEX IF EXISTS public._tours_v_version_whats_excluded_parent_id_idx;
DROP INDEX IF EXISTS public._tours_v_version_whats_excluded_order_idx;
DROP INDEX IF EXISTS public._tours_v_version_version_updated_at_idx;
DROP INDEX IF EXISTS public._tours_v_version_version_slug_idx;
DROP INDEX IF EXISTS public._tours_v_version_version_created_at_idx;
DROP INDEX IF EXISTS public._tours_v_version_version__status_idx;
DROP INDEX IF EXISTS public._tours_v_version_meta_version_meta_image_idx;
DROP INDEX IF EXISTS public._tours_v_version_highlights_parent_id_idx;
DROP INDEX IF EXISTS public._tours_v_version_highlights_order_idx;
DROP INDEX IF EXISTS public._tours_v_version_gallery_images_parent_id_idx;
DROP INDEX IF EXISTS public._tours_v_version_gallery_images_order_idx;
DROP INDEX IF EXISTS public._tours_v_updated_at_idx;
DROP INDEX IF EXISTS public._tours_v_rels_travel_type_landing_pages_id_idx;
DROP INDEX IF EXISTS public._tours_v_rels_specialty_landing_pages_id_idx;
DROP INDEX IF EXISTS public._tours_v_rels_path_idx;
DROP INDEX IF EXISTS public._tours_v_rels_parent_idx;
DROP INDEX IF EXISTS public._tours_v_rels_order_idx;
DROP INDEX IF EXISTS public._tours_v_rels_food_items_id_idx;
DROP INDEX IF EXISTS public._tours_v_rels_dietary_options_id_idx;
DROP INDEX IF EXISTS public._tours_v_parent_idx;
DROP INDEX IF EXISTS public._tours_v_latest_idx;
DROP INDEX IF EXISTS public._tours_v_created_at_idx;
DROP INDEX IF EXISTS public._tours_v_autosave_idx;
DROP INDEX IF EXISTS public._testimonials_v_version_version_updated_at_idx;
DROP INDEX IF EXISTS public._testimonials_v_version_version_created_at_idx;
DROP INDEX IF EXISTS public._testimonials_v_version_version__status_idx;
DROP INDEX IF EXISTS public._testimonials_v_updated_at_idx;
DROP INDEX IF EXISTS public._testimonials_v_parent_idx;
DROP INDEX IF EXISTS public._testimonials_v_latest_idx;
DROP INDEX IF EXISTS public._testimonials_v_created_at_idx;
DROP INDEX IF EXISTS public._testimonials_v_autosave_idx;
DROP INDEX IF EXISTS public._stories_v_version_version_updated_at_idx;
DROP INDEX IF EXISTS public._stories_v_version_version_slug_idx;
DROP INDEX IF EXISTS public._stories_v_version_version_created_at_idx;
DROP INDEX IF EXISTS public._stories_v_version_version_author_idx;
DROP INDEX IF EXISTS public._stories_v_version_version__status_idx;
DROP INDEX IF EXISTS public._stories_v_version_meta_version_meta_image_idx;
DROP INDEX IF EXISTS public._stories_v_updated_at_idx;
DROP INDEX IF EXISTS public._stories_v_parent_idx;
DROP INDEX IF EXISTS public._stories_v_latest_idx;
DROP INDEX IF EXISTS public._stories_v_created_at_idx;
DROP INDEX IF EXISTS public._stories_v_autosave_idx;
DROP INDEX IF EXISTS public._legal_pages_v_parent_idx;
DROP INDEX IF EXISTS public._legal_pages_v_latest_idx;
DROP INDEX IF EXISTS public._home_page_v_parent_idx;
DROP INDEX IF EXISTS public._home_page_v_latest_idx;
DROP INDEX IF EXISTS public._food_items_v_version_version_updated_at_idx;
DROP INDEX IF EXISTS public._food_items_v_version_version_slug_idx;
DROP INDEX IF EXISTS public._food_items_v_version_version_image_idx;
DROP INDEX IF EXISTS public._food_items_v_version_version_created_at_idx;
DROP INDEX IF EXISTS public._food_items_v_version_version__status_idx;
DROP INDEX IF EXISTS public._food_items_v_version_local_names_parent_id_idx;
DROP INDEX IF EXISTS public._food_items_v_version_local_names_order_idx;
DROP INDEX IF EXISTS public._food_items_v_version_ingredients_parent_id_idx;
DROP INDEX IF EXISTS public._food_items_v_version_ingredients_order_idx;
DROP INDEX IF EXISTS public._food_items_v_version_flavor_profile_parent_id_idx;
DROP INDEX IF EXISTS public._food_items_v_version_flavor_profile_order_idx;
DROP INDEX IF EXISTS public._food_items_v_version_allergens_parent_id_idx;
DROP INDEX IF EXISTS public._food_items_v_version_allergens_order_idx;
DROP INDEX IF EXISTS public._food_items_v_updated_at_idx;
DROP INDEX IF EXISTS public._food_items_v_rels_path_idx;
DROP INDEX IF EXISTS public._food_items_v_rels_parent_idx;
DROP INDEX IF EXISTS public._food_items_v_rels_order_idx;
DROP INDEX IF EXISTS public._food_items_v_rels_media_id_idx;
DROP INDEX IF EXISTS public._food_items_v_rels_dietary_options_id_idx;
DROP INDEX IF EXISTS public._food_items_v_parent_idx;
DROP INDEX IF EXISTS public._food_items_v_latest_idx;
DROP INDEX IF EXISTS public._food_items_v_created_at_idx;
DROP INDEX IF EXISTS public._food_items_v_autosave_idx;
DROP INDEX IF EXISTS public._faqs_v_version_version_updated_at_idx;
DROP INDEX IF EXISTS public._faqs_v_version_version_created_at_idx;
DROP INDEX IF EXISTS public._faqs_v_version_version__status_idx;
DROP INDEX IF EXISTS public._faqs_v_updated_at_idx;
DROP INDEX IF EXISTS public._faqs_v_parent_idx;
DROP INDEX IF EXISTS public._faqs_v_latest_idx;
DROP INDEX IF EXISTS public._faqs_v_created_at_idx;
DROP INDEX IF EXISTS public._faqs_v_autosave_idx;
DROP INDEX IF EXISTS public._dietary_options_v_version_version_updated_at_idx;
DROP INDEX IF EXISTS public._dietary_options_v_version_version_slug_idx;
DROP INDEX IF EXISTS public._dietary_options_v_version_version_created_at_idx;
DROP INDEX IF EXISTS public._dietary_options_v_version_version__status_idx;
DROP INDEX IF EXISTS public._dietary_options_v_updated_at_idx;
DROP INDEX IF EXISTS public._dietary_options_v_parent_idx;
DROP INDEX IF EXISTS public._dietary_options_v_latest_idx;
DROP INDEX IF EXISTS public._dietary_options_v_created_at_idx;
DROP INDEX IF EXISTS public._dietary_options_v_autosave_idx;
ALTER TABLE IF EXISTS ONLY public.vendors_rels DROP CONSTRAINT IF EXISTS vendors_rels_pkey;
ALTER TABLE IF EXISTS ONLY public.vendors DROP CONSTRAINT IF EXISTS vendors_pkey;
ALTER TABLE IF EXISTS ONLY public.vendors_payment_methods DROP CONSTRAINT IF EXISTS vendors_payment_methods_pkey;
ALTER TABLE IF EXISTS ONLY public.vendors_operating_hours DROP CONSTRAINT IF EXISTS vendors_operating_hours_pkey;
ALTER TABLE IF EXISTS ONLY public.vendors_images_gallery DROP CONSTRAINT IF EXISTS vendors_images_gallery_pkey;
ALTER TABLE IF EXISTS ONLY public.vendors_facilities DROP CONSTRAINT IF EXISTS vendors_facilities_pkey;
ALTER TABLE IF EXISTS ONLY public.vendors_closed_on DROP CONSTRAINT IF EXISTS vendors_closed_on_pkey;
ALTER TABLE IF EXISTS ONLY public.vendors_awards DROP CONSTRAINT IF EXISTS vendors_awards_pkey;
ALTER TABLE IF EXISTS ONLY public.users_sessions DROP CONSTRAINT IF EXISTS users_sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.travel_types DROP CONSTRAINT IF EXISTS travel_types_slug_key;
ALTER TABLE IF EXISTS ONLY public.travel_types DROP CONSTRAINT IF EXISTS travel_types_pkey;
ALTER TABLE IF EXISTS ONLY public.travel_type_landing_pages DROP CONSTRAINT IF EXISTS travel_type_landing_pages_pkey;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_pkey;
ALTER TABLE IF EXISTS ONLY public.translations DROP CONSTRAINT IF EXISTS translations_pkey;
ALTER TABLE IF EXISTS ONLY public.tours_whats_included DROP CONSTRAINT IF EXISTS tours_whats_included_pkey;
ALTER TABLE IF EXISTS ONLY public.tours_whats_excluded DROP CONSTRAINT IF EXISTS tours_whats_excluded_pkey;
ALTER TABLE IF EXISTS ONLY public.tours_rels DROP CONSTRAINT IF EXISTS tours_rels_pkey;
ALTER TABLE IF EXISTS ONLY public.tours DROP CONSTRAINT IF EXISTS tours_pkey;
ALTER TABLE IF EXISTS ONLY public.tours_highlights DROP CONSTRAINT IF EXISTS tours_highlights_pkey;
ALTER TABLE IF EXISTS ONLY public.tours_gallery_images DROP CONSTRAINT IF EXISTS tours_gallery_images_pkey;
ALTER TABLE IF EXISTS ONLY public.thank_you_pages DROP CONSTRAINT IF EXISTS thank_you_pages_pkey;
ALTER TABLE IF EXISTS ONLY public.thank_you_pages_next_steps DROP CONSTRAINT IF EXISTS thank_you_pages_next_steps_pkey;
ALTER TABLE IF EXISTS ONLY public.thank_you_pages_cta_section_cta_buttons DROP CONSTRAINT IF EXISTS thank_you_pages_cta_section_cta_buttons_pkey;
ALTER TABLE IF EXISTS ONLY public.testimonials DROP CONSTRAINT IF EXISTS testimonials_pkey;
ALTER TABLE IF EXISTS ONLY public.stories DROP CONSTRAINT IF EXISTS stories_pkey;
ALTER TABLE IF EXISTS ONLY public.specialty_landing_pages DROP CONSTRAINT IF EXISTS specialty_landing_pages_pkey;
ALTER TABLE IF EXISTS ONLY public.specialty_experiences DROP CONSTRAINT IF EXISTS specialty_experiences_slug_key;
ALTER TABLE IF EXISTS ONLY public.specialty_experiences DROP CONSTRAINT IF EXISTS specialty_experiences_pkey;
ALTER TABLE IF EXISTS ONLY public.site_settings DROP CONSTRAINT IF EXISTS site_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.search_rels DROP CONSTRAINT IF EXISTS search_rels_pkey;
ALTER TABLE IF EXISTS ONLY public.search DROP CONSTRAINT IF EXISTS search_pkey;
ALTER TABLE IF EXISTS ONLY public.redirects_rels DROP CONSTRAINT IF EXISTS redirects_rels_pkey;
ALTER TABLE IF EXISTS ONLY public.redirects DROP CONSTRAINT IF EXISTS redirects_pkey;
ALTER TABLE IF EXISTS ONLY public.payload_preferences_rels DROP CONSTRAINT IF EXISTS payload_preferences_rels_pkey;
ALTER TABLE IF EXISTS ONLY public.payload_preferences DROP CONSTRAINT IF EXISTS payload_preferences_pkey;
ALTER TABLE IF EXISTS ONLY public.payload_migrations DROP CONSTRAINT IF EXISTS payload_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_pkey;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents DROP CONSTRAINT IF EXISTS payload_locked_documents_pkey;
ALTER TABLE IF EXISTS ONLY public.payload_kv DROP CONSTRAINT IF EXISTS payload_kv_pkey;
ALTER TABLE IF EXISTS ONLY public.menus DROP CONSTRAINT IF EXISTS menus_pkey;
ALTER TABLE IF EXISTS ONLY public.media DROP CONSTRAINT IF EXISTS media_pkey;
ALTER TABLE IF EXISTS ONLY public.media_coverage DROP CONSTRAINT IF EXISTS media_coverage_pkey;
ALTER TABLE IF EXISTS ONLY public.locations DROP CONSTRAINT IF EXISTS locations_slug_key;
ALTER TABLE IF EXISTS ONLY public.locations DROP CONSTRAINT IF EXISTS locations_pkey;
ALTER TABLE IF EXISTS ONLY public.location_landing_pages DROP CONSTRAINT IF EXISTS location_landing_pages_pkey;
ALTER TABLE IF EXISTS ONLY public.legal_pages DROP CONSTRAINT IF EXISTS legal_pages_pkey;
ALTER TABLE IF EXISTS ONLY public.home_page DROP CONSTRAINT IF EXISTS home_page_pkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_cta_block DROP CONSTRAINT IF EXISTS home_page_cta_section_pkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_cta_block_features DROP CONSTRAINT IF EXISTS home_page_cta_section_features_pkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_cta_block_buttons DROP CONSTRAINT IF EXISTS home_page_cta_section_buttons_pkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_vendors_block DROP CONSTRAINT IF EXISTS home_page_blocks_vendors_block_pkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_vendors_block_links DROP CONSTRAINT IF EXISTS home_page_blocks_vendors_block_links_pkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_stats_block_stats DROP CONSTRAINT IF EXISTS home_page_blocks_stats_block_stats_pkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_stats_block DROP CONSTRAINT IF EXISTS home_page_blocks_stats_block_pkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_segments_block DROP CONSTRAINT IF EXISTS home_page_blocks_segments_block_pkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_pillars_block DROP CONSTRAINT IF EXISTS home_page_blocks_pillars_block_pkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_pillars_block_pillars DROP CONSTRAINT IF EXISTS home_page_blocks_pillars_block_pillars_pkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_manifesto_block DROP CONSTRAINT IF EXISTS home_page_blocks_manifesto_block_pkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_hero_block DROP CONSTRAINT IF EXISTS home_page_blocks_hero_block_pkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_hero_block_badges DROP CONSTRAINT IF EXISTS home_page_blocks_hero_block_badges_pkey;
ALTER TABLE IF EXISTS ONLY public.home_page_blocks_about_block DROP CONSTRAINT IF EXISTS home_page_blocks_about_block_pkey;
ALTER TABLE IF EXISTS ONLY public.food_items_rels DROP CONSTRAINT IF EXISTS food_items_rels_pkey;
ALTER TABLE IF EXISTS ONLY public.food_items DROP CONSTRAINT IF EXISTS food_items_pkey;
ALTER TABLE IF EXISTS ONLY public.food_items_local_names DROP CONSTRAINT IF EXISTS food_items_local_names_pkey;
ALTER TABLE IF EXISTS ONLY public.food_items_ingredients DROP CONSTRAINT IF EXISTS food_items_ingredients_pkey;
ALTER TABLE IF EXISTS ONLY public.food_items_flavor_profile DROP CONSTRAINT IF EXISTS food_items_flavor_profile_pkey;
ALTER TABLE IF EXISTS ONLY public.food_items_allergens DROP CONSTRAINT IF EXISTS food_items_allergens_pkey;
ALTER TABLE IF EXISTS ONLY public.faqs DROP CONSTRAINT IF EXISTS faqs_pkey;
ALTER TABLE IF EXISTS ONLY public.dietary_options DROP CONSTRAINT IF EXISTS dietary_options_pkey;
ALTER TABLE IF EXISTS ONLY public.dietary_landing_pages DROP CONSTRAINT IF EXISTS dietary_landing_pages_pkey;
ALTER TABLE IF EXISTS ONLY public.contact_page DROP CONSTRAINT IF EXISTS contact_page_pkey;
ALTER TABLE IF EXISTS ONLY public.contact_page_breadcrumbs DROP CONSTRAINT IF EXISTS contact_page_breadcrumbs_pkey;
ALTER TABLE IF EXISTS ONLY public.about_page DROP CONSTRAINT IF EXISTS about_page_pkey;
ALTER TABLE IF EXISTS ONLY public.about_page_breadcrumbs DROP CONSTRAINT IF EXISTS about_page_breadcrumbs_pkey;
ALTER TABLE IF EXISTS ONLY public._vendors_v_version_payment_methods DROP CONSTRAINT IF EXISTS _vendors_v_version_payment_methods_pkey;
ALTER TABLE IF EXISTS ONLY public._vendors_v_version_operating_hours DROP CONSTRAINT IF EXISTS _vendors_v_version_operating_hours_pkey;
ALTER TABLE IF EXISTS ONLY public._vendors_v_version_images_gallery DROP CONSTRAINT IF EXISTS _vendors_v_version_images_gallery_pkey;
ALTER TABLE IF EXISTS ONLY public._vendors_v_version_facilities DROP CONSTRAINT IF EXISTS _vendors_v_version_facilities_pkey;
ALTER TABLE IF EXISTS ONLY public._vendors_v_version_closed_on DROP CONSTRAINT IF EXISTS _vendors_v_version_closed_on_pkey;
ALTER TABLE IF EXISTS ONLY public._vendors_v_version_awards DROP CONSTRAINT IF EXISTS _vendors_v_version_awards_pkey;
ALTER TABLE IF EXISTS ONLY public._vendors_v_rels DROP CONSTRAINT IF EXISTS _vendors_v_rels_pkey;
ALTER TABLE IF EXISTS ONLY public._vendors_v DROP CONSTRAINT IF EXISTS _vendors_v_pkey;
ALTER TABLE IF EXISTS ONLY public._tours_v_version_whats_included DROP CONSTRAINT IF EXISTS _tours_v_version_whats_included_pkey;
ALTER TABLE IF EXISTS ONLY public._tours_v_version_whats_excluded DROP CONSTRAINT IF EXISTS _tours_v_version_whats_excluded_pkey;
ALTER TABLE IF EXISTS ONLY public._tours_v_version_highlights DROP CONSTRAINT IF EXISTS _tours_v_version_highlights_pkey;
ALTER TABLE IF EXISTS ONLY public._tours_v_version_gallery_images DROP CONSTRAINT IF EXISTS _tours_v_version_gallery_images_pkey;
ALTER TABLE IF EXISTS ONLY public._tours_v_rels DROP CONSTRAINT IF EXISTS _tours_v_rels_pkey;
ALTER TABLE IF EXISTS ONLY public._tours_v DROP CONSTRAINT IF EXISTS _tours_v_pkey;
ALTER TABLE IF EXISTS ONLY public._testimonials_v DROP CONSTRAINT IF EXISTS _testimonials_v_pkey;
ALTER TABLE IF EXISTS ONLY public._stories_v DROP CONSTRAINT IF EXISTS _stories_v_pkey;
ALTER TABLE IF EXISTS ONLY public.menus_items DROP CONSTRAINT IF EXISTS _menus_items_v_pkey;
ALTER TABLE IF EXISTS ONLY public._legal_pages_v DROP CONSTRAINT IF EXISTS _legal_pages_v_pkey;
ALTER TABLE IF EXISTS ONLY public._home_page_v DROP CONSTRAINT IF EXISTS _home_page_v_pkey;
ALTER TABLE IF EXISTS ONLY public._food_items_v_version_local_names DROP CONSTRAINT IF EXISTS _food_items_v_version_local_names_pkey;
ALTER TABLE IF EXISTS ONLY public._food_items_v_version_ingredients DROP CONSTRAINT IF EXISTS _food_items_v_version_ingredients_pkey;
ALTER TABLE IF EXISTS ONLY public._food_items_v_version_flavor_profile DROP CONSTRAINT IF EXISTS _food_items_v_version_flavor_profile_pkey;
ALTER TABLE IF EXISTS ONLY public._food_items_v_version_allergens DROP CONSTRAINT IF EXISTS _food_items_v_version_allergens_pkey;
ALTER TABLE IF EXISTS ONLY public._food_items_v_rels DROP CONSTRAINT IF EXISTS _food_items_v_rels_pkey;
ALTER TABLE IF EXISTS ONLY public._food_items_v DROP CONSTRAINT IF EXISTS _food_items_v_pkey;
ALTER TABLE IF EXISTS ONLY public._faqs_v DROP CONSTRAINT IF EXISTS _faqs_v_pkey;
ALTER TABLE IF EXISTS ONLY public._dietary_options_v DROP CONSTRAINT IF EXISTS _dietary_options_v_pkey;
ALTER TABLE IF EXISTS public.vendors_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.vendors ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.travel_types ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.travel_type_landing_pages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.translations_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.translations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tours_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tours ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.thank_you_pages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.testimonials ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.stories ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.specialty_landing_pages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.specialty_experiences ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.site_settings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.search_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.search ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.redirects_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.redirects ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payload_preferences_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payload_preferences ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payload_migrations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payload_locked_documents_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payload_locked_documents ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payload_kv ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.menus_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.menus ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.media_coverage ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.media ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.locations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.location_landing_pages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.legal_pages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.home_page_blocks_vendors_block_links ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.home_page_blocks_vendors_block ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.home_page_blocks_stats_block_stats ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.home_page_blocks_stats_block ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.home_page_blocks_segments_block ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.home_page_blocks_pillars_block_pillars ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.home_page_blocks_pillars_block ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.home_page_blocks_manifesto_block ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.home_page_blocks_hero_block_badges ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.home_page_blocks_hero_block ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.home_page_blocks_cta_block_features ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.home_page_blocks_cta_block_buttons ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.home_page_blocks_cta_block ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.home_page_blocks_about_block ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.home_page ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.food_items_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.food_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.faqs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.dietary_options ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.dietary_landing_pages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.contact_page ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.about_page ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._vendors_v_version_payment_methods ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._vendors_v_version_operating_hours ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._vendors_v_version_images_gallery ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._vendors_v_version_facilities ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._vendors_v_version_closed_on ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._vendors_v_version_awards ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._vendors_v_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._vendors_v ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._tours_v_version_whats_included ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._tours_v_version_whats_excluded ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._tours_v_version_highlights ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._tours_v_version_gallery_images ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._tours_v_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._tours_v ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._testimonials_v ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._stories_v ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._legal_pages_v ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._home_page_v ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._food_items_v_version_local_names ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._food_items_v_version_ingredients ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._food_items_v_version_flavor_profile ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._food_items_v_version_allergens ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._food_items_v_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._food_items_v ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._faqs_v ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._dietary_options_v ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.vendors_rels_id_seq;
DROP TABLE IF EXISTS public.vendors_rels;
DROP TABLE IF EXISTS public.vendors_payment_methods;
DROP TABLE IF EXISTS public.vendors_operating_hours;
DROP TABLE IF EXISTS public.vendors_images_gallery;
DROP SEQUENCE IF EXISTS public.vendors_id_seq;
DROP TABLE IF EXISTS public.vendors_facilities;
DROP TABLE IF EXISTS public.vendors_closed_on;
DROP TABLE IF EXISTS public.vendors_awards;
DROP TABLE IF EXISTS public.vendors;
DROP TABLE IF EXISTS public.users_sessions;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.travel_types_id_seq;
DROP TABLE IF EXISTS public.travel_types;
DROP SEQUENCE IF EXISTS public.travel_type_landing_pages_id_seq;
DROP TABLE IF EXISTS public.travel_type_landing_pages;
DROP SEQUENCE IF EXISTS public.translations_rels_id_seq;
DROP TABLE IF EXISTS public.translations_rels;
DROP SEQUENCE IF EXISTS public.translations_id_seq;
DROP TABLE IF EXISTS public.translations;
DROP TABLE IF EXISTS public.tours_whats_included;
DROP TABLE IF EXISTS public.tours_whats_excluded;
DROP SEQUENCE IF EXISTS public.tours_rels_id_seq;
DROP TABLE IF EXISTS public.tours_rels;
DROP SEQUENCE IF EXISTS public.tours_id_seq;
DROP TABLE IF EXISTS public.tours_highlights;
DROP TABLE IF EXISTS public.tours_gallery_images;
DROP TABLE IF EXISTS public.tours;
DROP TABLE IF EXISTS public.thank_you_pages_next_steps;
DROP SEQUENCE IF EXISTS public.thank_you_pages_id_seq;
DROP TABLE IF EXISTS public.thank_you_pages_cta_section_cta_buttons;
DROP TABLE IF EXISTS public.thank_you_pages;
DROP SEQUENCE IF EXISTS public.testimonials_id_seq;
DROP TABLE IF EXISTS public.testimonials;
DROP SEQUENCE IF EXISTS public.stories_id_seq;
DROP TABLE IF EXISTS public.stories;
DROP SEQUENCE IF EXISTS public.specialty_landing_pages_id_seq;
DROP TABLE IF EXISTS public.specialty_landing_pages;
DROP SEQUENCE IF EXISTS public.specialty_experiences_id_seq;
DROP TABLE IF EXISTS public.specialty_experiences;
DROP SEQUENCE IF EXISTS public.site_settings_id_seq;
DROP TABLE IF EXISTS public.site_settings;
DROP SEQUENCE IF EXISTS public.search_rels_id_seq;
DROP TABLE IF EXISTS public.search_rels;
DROP SEQUENCE IF EXISTS public.search_id_seq;
DROP TABLE IF EXISTS public.search;
DROP SEQUENCE IF EXISTS public.redirects_rels_id_seq;
DROP TABLE IF EXISTS public.redirects_rels;
DROP SEQUENCE IF EXISTS public.redirects_id_seq;
DROP TABLE IF EXISTS public.redirects;
DROP SEQUENCE IF EXISTS public.payload_preferences_rels_id_seq;
DROP TABLE IF EXISTS public.payload_preferences_rels;
DROP SEQUENCE IF EXISTS public.payload_preferences_id_seq;
DROP TABLE IF EXISTS public.payload_preferences;
DROP SEQUENCE IF EXISTS public.payload_migrations_id_seq;
DROP TABLE IF EXISTS public.payload_migrations;
DROP SEQUENCE IF EXISTS public.payload_locked_documents_rels_id_seq;
DROP TABLE IF EXISTS public.payload_locked_documents_rels;
DROP SEQUENCE IF EXISTS public.payload_locked_documents_id_seq;
DROP TABLE IF EXISTS public.payload_locked_documents;
DROP SEQUENCE IF EXISTS public.payload_kv_id_seq;
DROP TABLE IF EXISTS public.payload_kv;
DROP SEQUENCE IF EXISTS public.menus_id_seq;
DROP TABLE IF EXISTS public.menus;
DROP SEQUENCE IF EXISTS public.media_id_seq;
DROP SEQUENCE IF EXISTS public.media_coverage_id_seq;
DROP TABLE IF EXISTS public.media_coverage;
DROP TABLE IF EXISTS public.media;
DROP SEQUENCE IF EXISTS public.locations_id_seq;
DROP TABLE IF EXISTS public.locations;
DROP SEQUENCE IF EXISTS public.location_landing_pages_id_seq;
DROP TABLE IF EXISTS public.location_landing_pages;
DROP SEQUENCE IF EXISTS public.legal_pages_id_seq;
DROP TABLE IF EXISTS public.legal_pages;
DROP SEQUENCE IF EXISTS public.home_page_id_seq;
DROP SEQUENCE IF EXISTS public.home_page_cta_section_id_seq;
DROP SEQUENCE IF EXISTS public.home_page_cta_section_features_id_seq;
DROP SEQUENCE IF EXISTS public.home_page_cta_section_buttons_id_seq;
DROP SEQUENCE IF EXISTS public.home_page_blocks_vendors_block_links_id_seq;
DROP TABLE IF EXISTS public.home_page_blocks_vendors_block_links;
DROP SEQUENCE IF EXISTS public.home_page_blocks_vendors_block_id_seq;
DROP TABLE IF EXISTS public.home_page_blocks_vendors_block;
DROP SEQUENCE IF EXISTS public.home_page_blocks_stats_block_stats_id_seq;
DROP TABLE IF EXISTS public.home_page_blocks_stats_block_stats;
DROP SEQUENCE IF EXISTS public.home_page_blocks_stats_block_id_seq;
DROP TABLE IF EXISTS public.home_page_blocks_stats_block;
DROP SEQUENCE IF EXISTS public.home_page_blocks_segments_block_id_seq;
DROP TABLE IF EXISTS public.home_page_blocks_segments_block;
DROP SEQUENCE IF EXISTS public.home_page_blocks_pillars_block_pillars_id_seq;
DROP TABLE IF EXISTS public.home_page_blocks_pillars_block_pillars;
DROP SEQUENCE IF EXISTS public.home_page_blocks_pillars_block_id_seq;
DROP TABLE IF EXISTS public.home_page_blocks_pillars_block;
DROP SEQUENCE IF EXISTS public.home_page_blocks_manifesto_block_id_seq;
DROP TABLE IF EXISTS public.home_page_blocks_manifesto_block;
DROP SEQUENCE IF EXISTS public.home_page_blocks_hero_block_id_seq;
DROP SEQUENCE IF EXISTS public.home_page_blocks_hero_block_badges_id_seq;
DROP TABLE IF EXISTS public.home_page_blocks_hero_block_badges;
DROP TABLE IF EXISTS public.home_page_blocks_hero_block;
DROP TABLE IF EXISTS public.home_page_blocks_cta_block_features;
DROP TABLE IF EXISTS public.home_page_blocks_cta_block_buttons;
DROP TABLE IF EXISTS public.home_page_blocks_cta_block;
DROP SEQUENCE IF EXISTS public.home_page_blocks_about_block_id_seq;
DROP TABLE IF EXISTS public.home_page_blocks_about_block;
DROP TABLE IF EXISTS public.home_page;
DROP SEQUENCE IF EXISTS public.food_items_rels_id_seq;
DROP TABLE IF EXISTS public.food_items_rels;
DROP TABLE IF EXISTS public.food_items_local_names;
DROP TABLE IF EXISTS public.food_items_ingredients;
DROP SEQUENCE IF EXISTS public.food_items_id_seq;
DROP TABLE IF EXISTS public.food_items_flavor_profile;
DROP TABLE IF EXISTS public.food_items_allergens;
DROP TABLE IF EXISTS public.food_items;
DROP SEQUENCE IF EXISTS public.faqs_id_seq;
DROP TABLE IF EXISTS public.faqs;
DROP SEQUENCE IF EXISTS public.dietary_options_id_seq;
DROP TABLE IF EXISTS public.dietary_options;
DROP SEQUENCE IF EXISTS public.dietary_landing_pages_id_seq;
DROP TABLE IF EXISTS public.dietary_landing_pages;
DROP SEQUENCE IF EXISTS public.contact_page_id_seq;
DROP TABLE IF EXISTS public.contact_page_breadcrumbs;
DROP TABLE IF EXISTS public.contact_page;
DROP SEQUENCE IF EXISTS public.about_page_id_seq;
DROP TABLE IF EXISTS public.about_page_breadcrumbs;
DROP TABLE IF EXISTS public.about_page;
DROP SEQUENCE IF EXISTS public._vendors_v_version_payment_methods_id_seq;
DROP TABLE IF EXISTS public._vendors_v_version_payment_methods;
DROP SEQUENCE IF EXISTS public._vendors_v_version_operating_hours_id_seq;
DROP TABLE IF EXISTS public._vendors_v_version_operating_hours;
DROP SEQUENCE IF EXISTS public._vendors_v_version_images_gallery_id_seq;
DROP TABLE IF EXISTS public._vendors_v_version_images_gallery;
DROP SEQUENCE IF EXISTS public._vendors_v_version_facilities_id_seq;
DROP TABLE IF EXISTS public._vendors_v_version_facilities;
DROP SEQUENCE IF EXISTS public._vendors_v_version_closed_on_id_seq;
DROP TABLE IF EXISTS public._vendors_v_version_closed_on;
DROP SEQUENCE IF EXISTS public._vendors_v_version_awards_id_seq;
DROP TABLE IF EXISTS public._vendors_v_version_awards;
DROP SEQUENCE IF EXISTS public._vendors_v_rels_id_seq;
DROP TABLE IF EXISTS public._vendors_v_rels;
DROP SEQUENCE IF EXISTS public._vendors_v_id_seq;
DROP TABLE IF EXISTS public._vendors_v;
DROP SEQUENCE IF EXISTS public._tours_v_version_whats_included_id_seq;
DROP TABLE IF EXISTS public._tours_v_version_whats_included;
DROP SEQUENCE IF EXISTS public._tours_v_version_whats_excluded_id_seq;
DROP TABLE IF EXISTS public._tours_v_version_whats_excluded;
DROP SEQUENCE IF EXISTS public._tours_v_version_highlights_id_seq;
DROP TABLE IF EXISTS public._tours_v_version_highlights;
DROP SEQUENCE IF EXISTS public._tours_v_version_gallery_images_id_seq;
DROP TABLE IF EXISTS public._tours_v_version_gallery_images;
DROP SEQUENCE IF EXISTS public._tours_v_rels_id_seq;
DROP TABLE IF EXISTS public._tours_v_rels;
DROP SEQUENCE IF EXISTS public._tours_v_id_seq;
DROP TABLE IF EXISTS public._tours_v;
DROP SEQUENCE IF EXISTS public._testimonials_v_id_seq;
DROP TABLE IF EXISTS public._testimonials_v;
DROP SEQUENCE IF EXISTS public._stories_v_id_seq;
DROP TABLE IF EXISTS public._stories_v;
DROP SEQUENCE IF EXISTS public._menus_items_v_id_seq;
DROP TABLE IF EXISTS public.menus_items;
DROP SEQUENCE IF EXISTS public._legal_pages_v_id_seq;
DROP TABLE IF EXISTS public._legal_pages_v;
DROP SEQUENCE IF EXISTS public._home_page_v_id_seq;
DROP TABLE IF EXISTS public._home_page_v;
DROP SEQUENCE IF EXISTS public._food_items_v_version_local_names_id_seq;
DROP TABLE IF EXISTS public._food_items_v_version_local_names;
DROP SEQUENCE IF EXISTS public._food_items_v_version_ingredients_id_seq;
DROP TABLE IF EXISTS public._food_items_v_version_ingredients;
DROP SEQUENCE IF EXISTS public._food_items_v_version_flavor_profile_id_seq;
DROP TABLE IF EXISTS public._food_items_v_version_flavor_profile;
DROP SEQUENCE IF EXISTS public._food_items_v_version_allergens_id_seq;
DROP TABLE IF EXISTS public._food_items_v_version_allergens;
DROP SEQUENCE IF EXISTS public._food_items_v_rels_id_seq;
DROP TABLE IF EXISTS public._food_items_v_rels;
DROP SEQUENCE IF EXISTS public._food_items_v_id_seq;
DROP TABLE IF EXISTS public._food_items_v;
DROP SEQUENCE IF EXISTS public._faqs_v_id_seq;
DROP TABLE IF EXISTS public._faqs_v;
DROP SEQUENCE IF EXISTS public._dietary_options_v_id_seq;
DROP TABLE IF EXISTS public._dietary_options_v;
DROP TYPE IF EXISTS public.enum_vendors_type;
DROP TYPE IF EXISTS public.enum_vendors_status;
DROP TYPE IF EXISTS public.enum_vendors_price_range;
DROP TYPE IF EXISTS public.enum_vendors_payment_methods_method;
DROP TYPE IF EXISTS public.enum_vendors_operating_hours_day;
DROP TYPE IF EXISTS public.enum_vendors_location_state;
DROP TYPE IF EXISTS public.enum_vendors_facilities_facility;
DROP TYPE IF EXISTS public.enum_vendors_cuisine_type;
DROP TYPE IF EXISTS public.enum_vendors_closed_on_day;
DROP TYPE IF EXISTS public.enum_users_role;
DROP TYPE IF EXISTS public.enum_travel_type_landing_pages_status;
DROP TYPE IF EXISTS public.enum_translations_status;
DROP TYPE IF EXISTS public.enum_translations_locale;
DROP TYPE IF EXISTS public.enum_translations_collection;
DROP TYPE IF EXISTS public.enum_tours_workflow_status;
DROP TYPE IF EXISTS public.enum_tours_status;
DROP TYPE IF EXISTS public.enum_thank_you_pages_type;
DROP TYPE IF EXISTS public.enum_thank_you_pages_status;
DROP TYPE IF EXISTS public.enum_thank_you_pages_cta_section_cta_buttons_variant;
DROP TYPE IF EXISTS public.enum_testimonials_workflow_status;
DROP TYPE IF EXISTS public.enum_testimonials_status;
DROP TYPE IF EXISTS public.enum_stories_workflow_status;
DROP TYPE IF EXISTS public.enum_stories_status;
DROP TYPE IF EXISTS public.enum_specialty_landing_pages_status;
DROP TYPE IF EXISTS public.enum_redirects_to_type;
DROP TYPE IF EXISTS public.enum_media_coverage_status;
DROP TYPE IF EXISTS public.enum_location_landing_pages_status;
DROP TYPE IF EXISTS public.enum_food_items_status;
DROP TYPE IF EXISTS public.enum_food_items_spice_level;
DROP TYPE IF EXISTS public.enum_food_items_preparation_method;
DROP TYPE IF EXISTS public.enum_food_items_origin;
DROP TYPE IF EXISTS public.enum_food_items_local_names_language;
DROP TYPE IF EXISTS public.enum_food_items_flavor_profile_flavor;
DROP TYPE IF EXISTS public.enum_food_items_category;
DROP TYPE IF EXISTS public.enum_food_items_availability;
DROP TYPE IF EXISTS public.enum_food_items_allergens_allergen;
DROP TYPE IF EXISTS public.enum_faqs_workflow_status;
DROP TYPE IF EXISTS public.enum_faqs_status;
DROP TYPE IF EXISTS public.enum_dietary_options_status;
DROP TYPE IF EXISTS public.enum_dietary_landing_pages_status;
DROP TYPE IF EXISTS public.enum__vendors_v_version_type;
DROP TYPE IF EXISTS public.enum__vendors_v_version_status;
DROP TYPE IF EXISTS public.enum__vendors_v_version_price_range;
DROP TYPE IF EXISTS public.enum__vendors_v_version_payment_methods_method;
DROP TYPE IF EXISTS public.enum__vendors_v_version_operating_hours_day;
DROP TYPE IF EXISTS public.enum__vendors_v_version_location_state;
DROP TYPE IF EXISTS public.enum__vendors_v_version_facilities_facility;
DROP TYPE IF EXISTS public.enum__vendors_v_version_cuisine_type;
DROP TYPE IF EXISTS public.enum__vendors_v_version_closed_on_day;
DROP TYPE IF EXISTS public.enum__tours_v_version_workflow_status;
DROP TYPE IF EXISTS public.enum__tours_v_version_status;
DROP TYPE IF EXISTS public.enum__testimonials_v_version_workflow_status;
DROP TYPE IF EXISTS public.enum__testimonials_v_version_status;
DROP TYPE IF EXISTS public.enum__stories_v_version_workflow_status;
DROP TYPE IF EXISTS public.enum__stories_v_version_status;
DROP TYPE IF EXISTS public.enum__food_items_v_version_status;
DROP TYPE IF EXISTS public.enum__food_items_v_version_spice_level;
DROP TYPE IF EXISTS public.enum__food_items_v_version_preparation_method;
DROP TYPE IF EXISTS public.enum__food_items_v_version_origin;
DROP TYPE IF EXISTS public.enum__food_items_v_version_local_names_language;
DROP TYPE IF EXISTS public.enum__food_items_v_version_flavor_profile_flavor;
DROP TYPE IF EXISTS public.enum__food_items_v_version_category;
DROP TYPE IF EXISTS public.enum__food_items_v_version_availability;
DROP TYPE IF EXISTS public.enum__food_items_v_version_allergens_allergen;
DROP TYPE IF EXISTS public.enum__faqs_v_version_workflow_status;
DROP TYPE IF EXISTS public.enum__faqs_v_version_status;
DROP TYPE IF EXISTS public.enum__dietary_options_v_version_status;
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: directus
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO directus;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: directus
--

COMMENT ON SCHEMA public IS '';


--
-- Name: enum__dietary_options_v_version_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__dietary_options_v_version_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum__dietary_options_v_version_status OWNER TO directus;

--
-- Name: enum__faqs_v_version_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__faqs_v_version_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum__faqs_v_version_status OWNER TO directus;

--
-- Name: enum__faqs_v_version_workflow_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__faqs_v_version_workflow_status AS ENUM (
    'draft',
    'in_review',
    'approved',
    'published'
);


ALTER TYPE public.enum__faqs_v_version_workflow_status OWNER TO directus;

--
-- Name: enum__food_items_v_version_allergens_allergen; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__food_items_v_version_allergens_allergen AS ENUM (
    'shellfish',
    'fish',
    'peanuts',
    'tree_nuts',
    'soy',
    'wheat',
    'eggs',
    'dairy',
    'sesame',
    'msg'
);


ALTER TYPE public.enum__food_items_v_version_allergens_allergen OWNER TO directus;

--
-- Name: enum__food_items_v_version_availability; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__food_items_v_version_availability AS ENUM (
    'year_round',
    'seasonal',
    'festival',
    'weekend',
    'morning',
    'night'
);


ALTER TYPE public.enum__food_items_v_version_availability OWNER TO directus;

--
-- Name: enum__food_items_v_version_category; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__food_items_v_version_category AS ENUM (
    'main',
    'snack',
    'dessert',
    'beverage',
    'coffee_tea',
    'juice',
    'traditional_drink',
    'condiment',
    'breakfast',
    'soup',
    'noodles',
    'rice',
    'grilled'
);


ALTER TYPE public.enum__food_items_v_version_category OWNER TO directus;

--
-- Name: enum__food_items_v_version_flavor_profile_flavor; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__food_items_v_version_flavor_profile_flavor AS ENUM (
    'sweet',
    'sour',
    'salty',
    'umami',
    'bitter',
    'savory',
    'creamy',
    'tangy'
);


ALTER TYPE public.enum__food_items_v_version_flavor_profile_flavor OWNER TO directus;

--
-- Name: enum__food_items_v_version_local_names_language; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__food_items_v_version_local_names_language AS ENUM (
    'ms',
    'zh',
    'hokkien',
    'cantonese',
    'ta',
    'en'
);


ALTER TYPE public.enum__food_items_v_version_local_names_language OWNER TO directus;

--
-- Name: enum__food_items_v_version_origin; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__food_items_v_version_origin AS ENUM (
    'malay',
    'chinese',
    'indian',
    'peranakan',
    'thai',
    'indonesian',
    'fusion',
    'international'
);


ALTER TYPE public.enum__food_items_v_version_origin OWNER TO directus;

--
-- Name: enum__food_items_v_version_preparation_method; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__food_items_v_version_preparation_method AS ENUM (
    'stir_fried',
    'steamed',
    'grilled',
    'deep_fried',
    'braised',
    'boiled',
    'raw',
    'fermented',
    'cured',
    'mixed'
);


ALTER TYPE public.enum__food_items_v_version_preparation_method OWNER TO directus;

--
-- Name: enum__food_items_v_version_spice_level; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__food_items_v_version_spice_level AS ENUM (
    '0',
    '1',
    '2',
    '3',
    '4',
    '5'
);


ALTER TYPE public.enum__food_items_v_version_spice_level OWNER TO directus;

--
-- Name: enum__food_items_v_version_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__food_items_v_version_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum__food_items_v_version_status OWNER TO directus;

--
-- Name: enum__stories_v_version_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__stories_v_version_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum__stories_v_version_status OWNER TO directus;

--
-- Name: enum__stories_v_version_workflow_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__stories_v_version_workflow_status AS ENUM (
    'draft',
    'in_review',
    'approved',
    'published'
);


ALTER TYPE public.enum__stories_v_version_workflow_status OWNER TO directus;

--
-- Name: enum__testimonials_v_version_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__testimonials_v_version_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum__testimonials_v_version_status OWNER TO directus;

--
-- Name: enum__testimonials_v_version_workflow_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__testimonials_v_version_workflow_status AS ENUM (
    'draft',
    'in_review',
    'approved',
    'published'
);


ALTER TYPE public.enum__testimonials_v_version_workflow_status OWNER TO directus;

--
-- Name: enum__tours_v_version_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__tours_v_version_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum__tours_v_version_status OWNER TO directus;

--
-- Name: enum__tours_v_version_workflow_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__tours_v_version_workflow_status AS ENUM (
    'draft',
    'in_review',
    'approved',
    'published'
);


ALTER TYPE public.enum__tours_v_version_workflow_status OWNER TO directus;

--
-- Name: enum__vendors_v_version_closed_on_day; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__vendors_v_version_closed_on_day AS ENUM (
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
    'holiday'
);


ALTER TYPE public.enum__vendors_v_version_closed_on_day OWNER TO directus;

--
-- Name: enum__vendors_v_version_cuisine_type; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__vendors_v_version_cuisine_type AS ENUM (
    'malay',
    'chinese',
    'indian',
    'peranakan',
    'thai',
    'indonesian',
    'western',
    'fusion',
    'mixed'
);


ALTER TYPE public.enum__vendors_v_version_cuisine_type OWNER TO directus;

--
-- Name: enum__vendors_v_version_facilities_facility; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__vendors_v_version_facilities_facility AS ENUM (
    'aircon',
    'wifi',
    'parking',
    'wheelchair',
    'halal_cert',
    'prayer_room',
    'outdoor',
    'takeaway',
    'delivery',
    'reservations',
    'family'
);


ALTER TYPE public.enum__vendors_v_version_facilities_facility OWNER TO directus;

--
-- Name: enum__vendors_v_version_location_state; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__vendors_v_version_location_state AS ENUM (
    'kl',
    'penang',
    'selangor',
    'melaka',
    'johor',
    'perak',
    'kelantan',
    'terengganu',
    'kedah',
    'pahang',
    'ns',
    'perlis',
    'sabah',
    'sarawak'
);


ALTER TYPE public.enum__vendors_v_version_location_state OWNER TO directus;

--
-- Name: enum__vendors_v_version_operating_hours_day; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__vendors_v_version_operating_hours_day AS ENUM (
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
    'holiday'
);


ALTER TYPE public.enum__vendors_v_version_operating_hours_day OWNER TO directus;

--
-- Name: enum__vendors_v_version_payment_methods_method; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__vendors_v_version_payment_methods_method AS ENUM (
    'cash',
    'credit_card',
    'debit_card',
    'tng',
    'grabpay',
    'boost',
    'qr_pay',
    'online_banking'
);


ALTER TYPE public.enum__vendors_v_version_payment_methods_method OWNER TO directus;

--
-- Name: enum__vendors_v_version_price_range; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__vendors_v_version_price_range AS ENUM (
    'budget',
    'moderate',
    'upscale',
    'fine_dining'
);


ALTER TYPE public.enum__vendors_v_version_price_range OWNER TO directus;

--
-- Name: enum__vendors_v_version_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__vendors_v_version_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum__vendors_v_version_status OWNER TO directus;

--
-- Name: enum__vendors_v_version_type; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum__vendors_v_version_type AS ENUM (
    'street_stall',
    'hawker_stall',
    'food_court',
    'kopitiam',
    'restaurant',
    'pasar_malam',
    'pasar_pagi',
    'home_kitchen',
    'food_truck',
    'heritage_shop'
);


ALTER TYPE public.enum__vendors_v_version_type OWNER TO directus;

--
-- Name: enum_dietary_landing_pages_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_dietary_landing_pages_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum_dietary_landing_pages_status OWNER TO directus;

--
-- Name: enum_dietary_options_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_dietary_options_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum_dietary_options_status OWNER TO directus;

--
-- Name: enum_faqs_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_faqs_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum_faqs_status OWNER TO directus;

--
-- Name: enum_faqs_workflow_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_faqs_workflow_status AS ENUM (
    'draft',
    'in_review',
    'approved',
    'published'
);


ALTER TYPE public.enum_faqs_workflow_status OWNER TO directus;

--
-- Name: enum_food_items_allergens_allergen; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_food_items_allergens_allergen AS ENUM (
    'shellfish',
    'fish',
    'peanuts',
    'tree_nuts',
    'soy',
    'wheat',
    'eggs',
    'dairy',
    'sesame',
    'msg'
);


ALTER TYPE public.enum_food_items_allergens_allergen OWNER TO directus;

--
-- Name: enum_food_items_availability; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_food_items_availability AS ENUM (
    'year_round',
    'seasonal',
    'festival',
    'weekend',
    'morning',
    'night'
);


ALTER TYPE public.enum_food_items_availability OWNER TO directus;

--
-- Name: enum_food_items_category; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_food_items_category AS ENUM (
    'main',
    'snack',
    'dessert',
    'beverage',
    'coffee_tea',
    'juice',
    'traditional_drink',
    'condiment',
    'breakfast',
    'soup',
    'noodles',
    'rice',
    'grilled'
);


ALTER TYPE public.enum_food_items_category OWNER TO directus;

--
-- Name: enum_food_items_flavor_profile_flavor; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_food_items_flavor_profile_flavor AS ENUM (
    'sweet',
    'sour',
    'salty',
    'umami',
    'bitter',
    'savory',
    'creamy',
    'tangy'
);


ALTER TYPE public.enum_food_items_flavor_profile_flavor OWNER TO directus;

--
-- Name: enum_food_items_local_names_language; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_food_items_local_names_language AS ENUM (
    'ms',
    'zh',
    'hokkien',
    'cantonese',
    'ta',
    'en'
);


ALTER TYPE public.enum_food_items_local_names_language OWNER TO directus;

--
-- Name: enum_food_items_origin; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_food_items_origin AS ENUM (
    'malay',
    'chinese',
    'indian',
    'peranakan',
    'thai',
    'indonesian',
    'fusion',
    'international'
);


ALTER TYPE public.enum_food_items_origin OWNER TO directus;

--
-- Name: enum_food_items_preparation_method; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_food_items_preparation_method AS ENUM (
    'stir_fried',
    'steamed',
    'grilled',
    'deep_fried',
    'braised',
    'boiled',
    'raw',
    'fermented',
    'cured',
    'mixed'
);


ALTER TYPE public.enum_food_items_preparation_method OWNER TO directus;

--
-- Name: enum_food_items_spice_level; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_food_items_spice_level AS ENUM (
    '0',
    '1',
    '2',
    '3',
    '4',
    '5'
);


ALTER TYPE public.enum_food_items_spice_level OWNER TO directus;

--
-- Name: enum_food_items_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_food_items_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum_food_items_status OWNER TO directus;

--
-- Name: enum_location_landing_pages_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_location_landing_pages_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum_location_landing_pages_status OWNER TO directus;

--
-- Name: enum_media_coverage_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_media_coverage_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum_media_coverage_status OWNER TO directus;

--
-- Name: enum_redirects_to_type; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_redirects_to_type AS ENUM (
    'reference',
    'custom'
);


ALTER TYPE public.enum_redirects_to_type OWNER TO directus;

--
-- Name: enum_specialty_landing_pages_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_specialty_landing_pages_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum_specialty_landing_pages_status OWNER TO directus;

--
-- Name: enum_stories_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_stories_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum_stories_status OWNER TO directus;

--
-- Name: enum_stories_workflow_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_stories_workflow_status AS ENUM (
    'draft',
    'in_review',
    'approved',
    'published'
);


ALTER TYPE public.enum_stories_workflow_status OWNER TO directus;

--
-- Name: enum_testimonials_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_testimonials_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum_testimonials_status OWNER TO directus;

--
-- Name: enum_testimonials_workflow_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_testimonials_workflow_status AS ENUM (
    'draft',
    'in_review',
    'approved',
    'published'
);


ALTER TYPE public.enum_testimonials_workflow_status OWNER TO directus;

--
-- Name: enum_thank_you_pages_cta_section_cta_buttons_variant; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_thank_you_pages_cta_section_cta_buttons_variant AS ENUM (
    'primary',
    'secondary'
);


ALTER TYPE public.enum_thank_you_pages_cta_section_cta_buttons_variant OWNER TO directus;

--
-- Name: enum_thank_you_pages_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_thank_you_pages_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum_thank_you_pages_status OWNER TO directus;

--
-- Name: enum_thank_you_pages_type; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_thank_you_pages_type AS ENUM (
    'contact',
    'tour_inquiry',
    'feedback',
    'newsletter',
    'booking',
    'custom',
    'inquiry'
);


ALTER TYPE public.enum_thank_you_pages_type OWNER TO directus;

--
-- Name: enum_tours_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_tours_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum_tours_status OWNER TO directus;

--
-- Name: enum_tours_workflow_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_tours_workflow_status AS ENUM (
    'draft',
    'in_review',
    'approved',
    'published'
);


ALTER TYPE public.enum_tours_workflow_status OWNER TO directus;

--
-- Name: enum_translations_collection; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_translations_collection AS ENUM (
    'tours',
    'stories',
    'testimonials',
    'faqs',
    'media_coverage',
    'dietary_landing_pages',
    'specialty_landing_pages',
    'travel_type_landing_pages',
    'location_landing_pages',
    'home_page',
    'legal_pages'
);


ALTER TYPE public.enum_translations_collection OWNER TO directus;

--
-- Name: enum_translations_locale; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_translations_locale AS ENUM (
    'en',
    'ms',
    'zh',
    'de',
    'es',
    'fr',
    'nl',
    'ja',
    'pt',
    'ru'
);


ALTER TYPE public.enum_translations_locale OWNER TO directus;

--
-- Name: enum_translations_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_translations_status AS ENUM (
    'draft',
    'in_translation',
    'ready_for_review',
    'published'
);


ALTER TYPE public.enum_translations_status OWNER TO directus;

--
-- Name: enum_travel_type_landing_pages_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_travel_type_landing_pages_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum_travel_type_landing_pages_status OWNER TO directus;

--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_users_role AS ENUM (
    'admin',
    'editor',
    'translator',
    'reviewer'
);


ALTER TYPE public.enum_users_role OWNER TO directus;

--
-- Name: enum_vendors_closed_on_day; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_vendors_closed_on_day AS ENUM (
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
    'holiday'
);


ALTER TYPE public.enum_vendors_closed_on_day OWNER TO directus;

--
-- Name: enum_vendors_cuisine_type; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_vendors_cuisine_type AS ENUM (
    'malay',
    'chinese',
    'indian',
    'peranakan',
    'thai',
    'indonesian',
    'western',
    'fusion',
    'mixed'
);


ALTER TYPE public.enum_vendors_cuisine_type OWNER TO directus;

--
-- Name: enum_vendors_facilities_facility; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_vendors_facilities_facility AS ENUM (
    'aircon',
    'wifi',
    'parking',
    'wheelchair',
    'halal_cert',
    'prayer_room',
    'outdoor',
    'takeaway',
    'delivery',
    'reservations',
    'family'
);


ALTER TYPE public.enum_vendors_facilities_facility OWNER TO directus;

--
-- Name: enum_vendors_location_state; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_vendors_location_state AS ENUM (
    'kl',
    'penang',
    'selangor',
    'melaka',
    'johor',
    'perak',
    'kelantan',
    'terengganu',
    'kedah',
    'pahang',
    'ns',
    'perlis',
    'sabah',
    'sarawak'
);


ALTER TYPE public.enum_vendors_location_state OWNER TO directus;

--
-- Name: enum_vendors_operating_hours_day; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_vendors_operating_hours_day AS ENUM (
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
    'holiday'
);


ALTER TYPE public.enum_vendors_operating_hours_day OWNER TO directus;

--
-- Name: enum_vendors_payment_methods_method; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_vendors_payment_methods_method AS ENUM (
    'cash',
    'credit_card',
    'debit_card',
    'tng',
    'grabpay',
    'boost',
    'qr_pay',
    'online_banking'
);


ALTER TYPE public.enum_vendors_payment_methods_method OWNER TO directus;

--
-- Name: enum_vendors_price_range; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_vendors_price_range AS ENUM (
    'budget',
    'moderate',
    'upscale',
    'fine_dining'
);


ALTER TYPE public.enum_vendors_price_range OWNER TO directus;

--
-- Name: enum_vendors_status; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_vendors_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum_vendors_status OWNER TO directus;

--
-- Name: enum_vendors_type; Type: TYPE; Schema: public; Owner: directus
--

CREATE TYPE public.enum_vendors_type AS ENUM (
    'street_stall',
    'hawker_stall',
    'food_court',
    'kopitiam',
    'restaurant',
    'pasar_malam',
    'pasar_pagi',
    'home_kitchen',
    'food_truck',
    'heritage_shop'
);


ALTER TYPE public.enum_vendors_type OWNER TO directus;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _dietary_options_v; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._dietary_options_v (
    id integer NOT NULL,
    parent_id integer,
    version_name character varying,
    version_slug character varying,
    version_icon character varying,
    version_color character varying,
    version_description character varying,
    version_status public.enum__dietary_options_v_version_status DEFAULT 'published'::public.enum__dietary_options_v_version_status,
    version_scheduled_publish timestamp(3) with time zone,
    version_published_at timestamp(3) with time zone,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__dietary_options_v_version_status DEFAULT 'draft'::public.enum__dietary_options_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean,
    autosave boolean
);


ALTER TABLE public._dietary_options_v OWNER TO directus;

--
-- Name: _dietary_options_v_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._dietary_options_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._dietary_options_v_id_seq OWNER TO directus;

--
-- Name: _dietary_options_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._dietary_options_v_id_seq OWNED BY public._dietary_options_v.id;


--
-- Name: _faqs_v; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._faqs_v (
    id integer NOT NULL,
    parent_id integer,
    version_question character varying,
    version_answer character varying,
    version_category character varying,
    version_sort_order numeric,
    version_tags character varying,
    version_page_visibility character varying,
    version_tour_id numeric,
    version_workflow_status public.enum__faqs_v_version_workflow_status DEFAULT 'draft'::public.enum__faqs_v_version_workflow_status,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__faqs_v_version_status DEFAULT 'draft'::public.enum__faqs_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean,
    autosave boolean
);


ALTER TABLE public._faqs_v OWNER TO directus;

--
-- Name: _faqs_v_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._faqs_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._faqs_v_id_seq OWNER TO directus;

--
-- Name: _faqs_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._faqs_v_id_seq OWNED BY public._faqs_v.id;


--
-- Name: _food_items_v; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._food_items_v (
    id integer NOT NULL,
    parent_id integer,
    version_name character varying,
    version_slug character varying,
    version_description character varying,
    version_category public.enum__food_items_v_version_category,
    version_origin public.enum__food_items_v_version_origin,
    version_region character varying,
    version_spice_level public.enum__food_items_v_version_spice_level DEFAULT '0'::public.enum__food_items_v_version_spice_level,
    version_preparation_method public.enum__food_items_v_version_preparation_method,
    version_typical_price numeric,
    version_availability public.enum__food_items_v_version_availability DEFAULT 'year_round'::public.enum__food_items_v_version_availability,
    version_image_id integer,
    version_cultural_significance character varying,
    version_serving_suggestions character varying,
    version_popular_variations character varying,
    version_pairings character varying,
    version_vendor_notes character varying,
    version_status public.enum__food_items_v_version_status DEFAULT 'draft'::public.enum__food_items_v_version_status,
    version_featured boolean DEFAULT false,
    version_scheduled_publish timestamp(3) with time zone,
    version_published_at timestamp(3) with time zone,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__food_items_v_version_status DEFAULT 'draft'::public.enum__food_items_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean,
    autosave boolean
);


ALTER TABLE public._food_items_v OWNER TO directus;

--
-- Name: _food_items_v_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._food_items_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._food_items_v_id_seq OWNER TO directus;

--
-- Name: _food_items_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._food_items_v_id_seq OWNED BY public._food_items_v.id;


--
-- Name: _food_items_v_rels; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._food_items_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    dietary_options_id integer,
    media_id integer
);


ALTER TABLE public._food_items_v_rels OWNER TO directus;

--
-- Name: _food_items_v_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._food_items_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._food_items_v_rels_id_seq OWNER TO directus;

--
-- Name: _food_items_v_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._food_items_v_rels_id_seq OWNED BY public._food_items_v_rels.id;


--
-- Name: _food_items_v_version_allergens; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._food_items_v_version_allergens (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    allergen public.enum__food_items_v_version_allergens_allergen,
    _uuid character varying
);


ALTER TABLE public._food_items_v_version_allergens OWNER TO directus;

--
-- Name: _food_items_v_version_allergens_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._food_items_v_version_allergens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._food_items_v_version_allergens_id_seq OWNER TO directus;

--
-- Name: _food_items_v_version_allergens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._food_items_v_version_allergens_id_seq OWNED BY public._food_items_v_version_allergens.id;


--
-- Name: _food_items_v_version_flavor_profile; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._food_items_v_version_flavor_profile (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    flavor public.enum__food_items_v_version_flavor_profile_flavor,
    _uuid character varying
);


ALTER TABLE public._food_items_v_version_flavor_profile OWNER TO directus;

--
-- Name: _food_items_v_version_flavor_profile_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._food_items_v_version_flavor_profile_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._food_items_v_version_flavor_profile_id_seq OWNER TO directus;

--
-- Name: _food_items_v_version_flavor_profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._food_items_v_version_flavor_profile_id_seq OWNED BY public._food_items_v_version_flavor_profile.id;


--
-- Name: _food_items_v_version_ingredients; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._food_items_v_version_ingredients (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    ingredient character varying,
    is_main boolean,
    _uuid character varying
);


ALTER TABLE public._food_items_v_version_ingredients OWNER TO directus;

--
-- Name: _food_items_v_version_ingredients_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._food_items_v_version_ingredients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._food_items_v_version_ingredients_id_seq OWNER TO directus;

--
-- Name: _food_items_v_version_ingredients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._food_items_v_version_ingredients_id_seq OWNED BY public._food_items_v_version_ingredients.id;


--
-- Name: _food_items_v_version_local_names; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._food_items_v_version_local_names (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    language public.enum__food_items_v_version_local_names_language,
    name character varying,
    script character varying,
    _uuid character varying
);


ALTER TABLE public._food_items_v_version_local_names OWNER TO directus;

--
-- Name: _food_items_v_version_local_names_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._food_items_v_version_local_names_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._food_items_v_version_local_names_id_seq OWNER TO directus;

--
-- Name: _food_items_v_version_local_names_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._food_items_v_version_local_names_id_seq OWNED BY public._food_items_v_version_local_names.id;


--
-- Name: _home_page_v; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._home_page_v (
    id integer NOT NULL,
    parent_id integer,
    version jsonb NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now(),
    updated_at timestamp(3) with time zone DEFAULT now(),
    latest boolean DEFAULT false,
    autosave boolean DEFAULT false,
    _status character varying(50) DEFAULT 'draft'::character varying
);


ALTER TABLE public._home_page_v OWNER TO directus;

--
-- Name: _home_page_v_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._home_page_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._home_page_v_id_seq OWNER TO directus;

--
-- Name: _home_page_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._home_page_v_id_seq OWNED BY public._home_page_v.id;


--
-- Name: _legal_pages_v; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._legal_pages_v (
    id integer NOT NULL,
    parent_id integer,
    version jsonb NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now(),
    updated_at timestamp(3) with time zone DEFAULT now(),
    latest boolean DEFAULT false,
    autosave boolean DEFAULT false,
    _status character varying(50) DEFAULT 'draft'::character varying
);


ALTER TABLE public._legal_pages_v OWNER TO directus;

--
-- Name: _legal_pages_v_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._legal_pages_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._legal_pages_v_id_seq OWNER TO directus;

--
-- Name: _legal_pages_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._legal_pages_v_id_seq OWNED BY public._legal_pages_v.id;


--
-- Name: menus_items; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.menus_items (
    id integer CONSTRAINT _menus_items_v_id_not_null NOT NULL,
    _parent_id integer,
    _order integer,
    _path character varying,
    label character varying,
    url character varying,
    open_in_new_tab boolean DEFAULT false,
    "order" integer
);


ALTER TABLE public.menus_items OWNER TO directus;

--
-- Name: _menus_items_v_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._menus_items_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._menus_items_v_id_seq OWNER TO directus;

--
-- Name: _menus_items_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._menus_items_v_id_seq OWNED BY public.menus_items.id;


--
-- Name: _stories_v; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._stories_v (
    id integer NOT NULL,
    parent_id integer,
    version_title character varying,
    version_slug character varying,
    version_author_id integer,
    version_excerpt character varying,
    version_content character varying,
    version_published_date timestamp(3) with time zone,
    version_featured_image character varying,
    version_status public.enum__stories_v_version_status DEFAULT 'draft'::public.enum__stories_v_version_status,
    version_workflow_status public.enum__stories_v_version_workflow_status DEFAULT 'draft'::public.enum__stories_v_version_workflow_status,
    version_scheduled_publish timestamp(3) with time zone,
    version_meta_title character varying,
    version_meta_description character varying,
    version_meta_image_id integer,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__stories_v_version_status DEFAULT 'draft'::public.enum__stories_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean,
    autosave boolean
);


ALTER TABLE public._stories_v OWNER TO directus;

--
-- Name: _stories_v_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._stories_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._stories_v_id_seq OWNER TO directus;

--
-- Name: _stories_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._stories_v_id_seq OWNED BY public._stories_v.id;


--
-- Name: _testimonials_v; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._testimonials_v (
    id integer NOT NULL,
    parent_id integer,
    version_author_name character varying,
    version_author_location character varying,
    version_rating numeric,
    version_review_text character varying,
    version_review_title character varying,
    version_author_photo character varying,
    version_date timestamp(3) with time zone,
    version_visibility_verified boolean DEFAULT true,
    version_visibility_featured boolean DEFAULT false,
    version_platform character varying,
    version_workflow_status public.enum__testimonials_v_version_workflow_status DEFAULT 'draft'::public.enum__testimonials_v_version_workflow_status,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__testimonials_v_version_status DEFAULT 'draft'::public.enum__testimonials_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean,
    autosave boolean
);


ALTER TABLE public._testimonials_v OWNER TO directus;

--
-- Name: _testimonials_v_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._testimonials_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._testimonials_v_id_seq OWNER TO directus;

--
-- Name: _testimonials_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._testimonials_v_id_seq OWNED BY public._testimonials_v.id;


--
-- Name: _tours_v; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._tours_v (
    id integer NOT NULL,
    parent_id integer,
    version_name character varying,
    version_slug character varying,
    version_tagline character varying,
    version_short_description character varying,
    version_full_description character varying,
    version_price numeric,
    version_currency character varying DEFAULT 'MYR'::character varying,
    version_duration character varying,
    version_duration_minutes numeric,
    version_location character varying,
    version_meeting_point character varying,
    version_max_participants numeric,
    version_min_participants numeric DEFAULT 2,
    version_tailored_available boolean DEFAULT false,
    version_tailored_notes character varying,
    version_hero_image character varying,
    version_booking_url character varying,
    version_instant_confirmation boolean DEFAULT true,
    version_scheduled_publish timestamp(3) with time zone,
    version_featured boolean DEFAULT false,
    version_popular boolean DEFAULT false,
    version_new boolean DEFAULT false,
    version_published_at timestamp(3) with time zone,
    version_status public.enum__tours_v_version_status DEFAULT 'draft'::public.enum__tours_v_version_status,
    version_workflow_status public.enum__tours_v_version_workflow_status DEFAULT 'draft'::public.enum__tours_v_version_workflow_status,
    version_meta_title character varying,
    version_meta_description character varying,
    version_meta_image_id integer,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__tours_v_version_status DEFAULT 'draft'::public.enum__tours_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean,
    autosave boolean
);


ALTER TABLE public._tours_v OWNER TO directus;

--
-- Name: _tours_v_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._tours_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._tours_v_id_seq OWNER TO directus;

--
-- Name: _tours_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._tours_v_id_seq OWNED BY public._tours_v.id;


--
-- Name: _tours_v_rels; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._tours_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    dietary_options_id integer,
    travel_type_landing_pages_id integer,
    specialty_landing_pages_id integer,
    food_items_id integer
);


ALTER TABLE public._tours_v_rels OWNER TO directus;

--
-- Name: _tours_v_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._tours_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._tours_v_rels_id_seq OWNER TO directus;

--
-- Name: _tours_v_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._tours_v_rels_id_seq OWNED BY public._tours_v_rels.id;


--
-- Name: _tours_v_version_gallery_images; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._tours_v_version_gallery_images (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    image character varying,
    _uuid character varying
);


ALTER TABLE public._tours_v_version_gallery_images OWNER TO directus;

--
-- Name: _tours_v_version_gallery_images_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._tours_v_version_gallery_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._tours_v_version_gallery_images_id_seq OWNER TO directus;

--
-- Name: _tours_v_version_gallery_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._tours_v_version_gallery_images_id_seq OWNED BY public._tours_v_version_gallery_images.id;


--
-- Name: _tours_v_version_highlights; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._tours_v_version_highlights (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    highlight character varying,
    _uuid character varying
);


ALTER TABLE public._tours_v_version_highlights OWNER TO directus;

--
-- Name: _tours_v_version_highlights_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._tours_v_version_highlights_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._tours_v_version_highlights_id_seq OWNER TO directus;

--
-- Name: _tours_v_version_highlights_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._tours_v_version_highlights_id_seq OWNED BY public._tours_v_version_highlights.id;


--
-- Name: _tours_v_version_whats_excluded; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._tours_v_version_whats_excluded (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    item character varying,
    _uuid character varying
);


ALTER TABLE public._tours_v_version_whats_excluded OWNER TO directus;

--
-- Name: _tours_v_version_whats_excluded_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._tours_v_version_whats_excluded_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._tours_v_version_whats_excluded_id_seq OWNER TO directus;

--
-- Name: _tours_v_version_whats_excluded_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._tours_v_version_whats_excluded_id_seq OWNED BY public._tours_v_version_whats_excluded.id;


--
-- Name: _tours_v_version_whats_included; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._tours_v_version_whats_included (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    item character varying,
    _uuid character varying
);


ALTER TABLE public._tours_v_version_whats_included OWNER TO directus;

--
-- Name: _tours_v_version_whats_included_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._tours_v_version_whats_included_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._tours_v_version_whats_included_id_seq OWNER TO directus;

--
-- Name: _tours_v_version_whats_included_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._tours_v_version_whats_included_id_seq OWNED BY public._tours_v_version_whats_included.id;


--
-- Name: _vendors_v; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._vendors_v (
    id integer NOT NULL,
    parent_id integer,
    version_name character varying,
    version_slug character varying,
    version_type public.enum__vendors_v_version_type,
    version_description character varying,
    version_history character varying,
    version_year_established numeric,
    version_generation character varying,
    version_owner_name character varying,
    version_cuisine_type public.enum__vendors_v_version_cuisine_type,
    version_location_address character varying,
    version_location_city character varying,
    version_location_state public.enum__vendors_v_version_location_state,
    version_location_postcode character varying,
    version_location_country character varying DEFAULT 'Malaysia'::character varying,
    version_location_latitude numeric,
    version_location_longitude numeric,
    version_location_landmark character varying,
    version_contact_phone character varying,
    version_contact_whatsapp character varying,
    version_contact_email character varying,
    version_contact_website character varying,
    version_contact_facebook character varying,
    version_contact_instagram character varying,
    version_price_range public.enum__vendors_v_version_price_range,
    version_images_main_id integer,
    version_story character varying,
    version_media_features character varying,
    version_tips character varying,
    version_status public.enum__vendors_v_version_status DEFAULT 'draft'::public.enum__vendors_v_version_status,
    version_featured boolean DEFAULT false,
    version_scheduled_publish timestamp(3) with time zone,
    version_published_at timestamp(3) with time zone,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__vendors_v_version_status DEFAULT 'draft'::public.enum__vendors_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean,
    autosave boolean
);


ALTER TABLE public._vendors_v OWNER TO directus;

--
-- Name: _vendors_v_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._vendors_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._vendors_v_id_seq OWNER TO directus;

--
-- Name: _vendors_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._vendors_v_id_seq OWNED BY public._vendors_v.id;


--
-- Name: _vendors_v_rels; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._vendors_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    food_items_id integer,
    dietary_options_id integer
);


ALTER TABLE public._vendors_v_rels OWNER TO directus;

--
-- Name: _vendors_v_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._vendors_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._vendors_v_rels_id_seq OWNER TO directus;

--
-- Name: _vendors_v_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._vendors_v_rels_id_seq OWNED BY public._vendors_v_rels.id;


--
-- Name: _vendors_v_version_awards; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._vendors_v_version_awards (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    award character varying,
    year numeric,
    organization character varying,
    _uuid character varying
);


ALTER TABLE public._vendors_v_version_awards OWNER TO directus;

--
-- Name: _vendors_v_version_awards_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._vendors_v_version_awards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._vendors_v_version_awards_id_seq OWNER TO directus;

--
-- Name: _vendors_v_version_awards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._vendors_v_version_awards_id_seq OWNED BY public._vendors_v_version_awards.id;


--
-- Name: _vendors_v_version_closed_on; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._vendors_v_version_closed_on (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    day public.enum__vendors_v_version_closed_on_day,
    _uuid character varying
);


ALTER TABLE public._vendors_v_version_closed_on OWNER TO directus;

--
-- Name: _vendors_v_version_closed_on_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._vendors_v_version_closed_on_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._vendors_v_version_closed_on_id_seq OWNER TO directus;

--
-- Name: _vendors_v_version_closed_on_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._vendors_v_version_closed_on_id_seq OWNED BY public._vendors_v_version_closed_on.id;


--
-- Name: _vendors_v_version_facilities; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._vendors_v_version_facilities (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    facility public.enum__vendors_v_version_facilities_facility,
    _uuid character varying
);


ALTER TABLE public._vendors_v_version_facilities OWNER TO directus;

--
-- Name: _vendors_v_version_facilities_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._vendors_v_version_facilities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._vendors_v_version_facilities_id_seq OWNER TO directus;

--
-- Name: _vendors_v_version_facilities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._vendors_v_version_facilities_id_seq OWNED BY public._vendors_v_version_facilities.id;


--
-- Name: _vendors_v_version_images_gallery; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._vendors_v_version_images_gallery (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    image_id integer,
    _uuid character varying
);


ALTER TABLE public._vendors_v_version_images_gallery OWNER TO directus;

--
-- Name: _vendors_v_version_images_gallery_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._vendors_v_version_images_gallery_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._vendors_v_version_images_gallery_id_seq OWNER TO directus;

--
-- Name: _vendors_v_version_images_gallery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._vendors_v_version_images_gallery_id_seq OWNED BY public._vendors_v_version_images_gallery.id;


--
-- Name: _vendors_v_version_operating_hours; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._vendors_v_version_operating_hours (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    day public.enum__vendors_v_version_operating_hours_day,
    open_time character varying,
    close_time character varying,
    is_closed boolean,
    notes character varying,
    _uuid character varying
);


ALTER TABLE public._vendors_v_version_operating_hours OWNER TO directus;

--
-- Name: _vendors_v_version_operating_hours_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._vendors_v_version_operating_hours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._vendors_v_version_operating_hours_id_seq OWNER TO directus;

--
-- Name: _vendors_v_version_operating_hours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._vendors_v_version_operating_hours_id_seq OWNED BY public._vendors_v_version_operating_hours.id;


--
-- Name: _vendors_v_version_payment_methods; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._vendors_v_version_payment_methods (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    method public.enum__vendors_v_version_payment_methods_method,
    _uuid character varying
);


ALTER TABLE public._vendors_v_version_payment_methods OWNER TO directus;

--
-- Name: _vendors_v_version_payment_methods_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._vendors_v_version_payment_methods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._vendors_v_version_payment_methods_id_seq OWNER TO directus;

--
-- Name: _vendors_v_version_payment_methods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._vendors_v_version_payment_methods_id_seq OWNED BY public._vendors_v_version_payment_methods.id;


--
-- Name: about_page; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.about_page (
    id integer NOT NULL,
    seo_title character varying,
    seo_description character varying,
    hero_title character varying,
    hero_subtitle character varying,
    founder_story_title character varying,
    founder_story_text jsonb,
    stats jsonb,
    timeline jsonb,
    philosophy character varying,
    team jsonb,
    parent_id integer,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.about_page OWNER TO directus;

--
-- Name: about_page_breadcrumbs; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.about_page_breadcrumbs (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    doc_id integer,
    url character varying,
    label character varying
);


ALTER TABLE public.about_page_breadcrumbs OWNER TO directus;

--
-- Name: about_page_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.about_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.about_page_id_seq OWNER TO directus;

--
-- Name: about_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.about_page_id_seq OWNED BY public.about_page.id;


--
-- Name: contact_page; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.contact_page (
    id integer NOT NULL,
    seo_title character varying,
    seo_description character varying,
    hero_title character varying,
    hero_subtitle character varying,
    contact_intro character varying,
    email character varying,
    phone character varying,
    whatsapp character varying,
    social_media jsonb,
    faq_section character varying,
    parent_id integer,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.contact_page OWNER TO directus;

--
-- Name: contact_page_breadcrumbs; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.contact_page_breadcrumbs (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    doc_id integer,
    url character varying,
    label character varying
);


ALTER TABLE public.contact_page_breadcrumbs OWNER TO directus;

--
-- Name: contact_page_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.contact_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_page_id_seq OWNER TO directus;

--
-- Name: contact_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.contact_page_id_seq OWNED BY public.contact_page.id;


--
-- Name: dietary_landing_pages; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.dietary_landing_pages (
    id integer NOT NULL,
    dietary_name character varying NOT NULL,
    slug character varying NOT NULL,
    status public.enum_dietary_landing_pages_status DEFAULT 'draft'::public.enum_dietary_landing_pages_status,
    icon character varying,
    color character varying,
    hero_title character varying,
    hero_subtitle character varying,
    hero_description character varying,
    hero_image character varying,
    challenges_title character varying,
    challenges_content character varying,
    options_title character varying,
    options_content character varying,
    tips_content character varying,
    safe_dishes jsonb,
    dishes_to_avoid jsonb,
    meta_title character varying,
    meta_description character varying,
    published_at timestamp(3) with time zone,
    meta_image_id integer,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.dietary_landing_pages OWNER TO directus;

--
-- Name: dietary_landing_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.dietary_landing_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dietary_landing_pages_id_seq OWNER TO directus;

--
-- Name: dietary_landing_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.dietary_landing_pages_id_seq OWNED BY public.dietary_landing_pages.id;


--
-- Name: dietary_options; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.dietary_options (
    id integer NOT NULL,
    name character varying,
    slug character varying,
    icon character varying,
    color character varying,
    description character varying,
    status public.enum_dietary_options_status DEFAULT 'published'::public.enum_dietary_options_status,
    scheduled_publish timestamp(3) with time zone,
    published_at timestamp(3) with time zone,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_dietary_options_status DEFAULT 'draft'::public.enum_dietary_options_status
);


ALTER TABLE public.dietary_options OWNER TO directus;

--
-- Name: dietary_options_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.dietary_options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dietary_options_id_seq OWNER TO directus;

--
-- Name: dietary_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.dietary_options_id_seq OWNED BY public.dietary_options.id;


--
-- Name: faqs; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.faqs (
    id integer NOT NULL,
    question character varying,
    answer character varying,
    category character varying,
    sort_order numeric,
    tags character varying,
    page_visibility character varying,
    tour_id numeric,
    workflow_status public.enum_faqs_workflow_status DEFAULT 'draft'::public.enum_faqs_workflow_status,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_faqs_status DEFAULT 'draft'::public.enum_faqs_status
);


ALTER TABLE public.faqs OWNER TO directus;

--
-- Name: faqs_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.faqs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faqs_id_seq OWNER TO directus;

--
-- Name: faqs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.faqs_id_seq OWNED BY public.faqs.id;


--
-- Name: food_items; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.food_items (
    id integer NOT NULL,
    name character varying,
    slug character varying,
    description character varying,
    category public.enum_food_items_category,
    origin public.enum_food_items_origin,
    region character varying,
    spice_level public.enum_food_items_spice_level DEFAULT '0'::public.enum_food_items_spice_level,
    preparation_method public.enum_food_items_preparation_method,
    typical_price numeric,
    availability public.enum_food_items_availability DEFAULT 'year_round'::public.enum_food_items_availability,
    image_id integer,
    cultural_significance character varying,
    serving_suggestions character varying,
    popular_variations character varying,
    pairings character varying,
    vendor_notes character varying,
    status public.enum_food_items_status DEFAULT 'draft'::public.enum_food_items_status,
    featured boolean DEFAULT false,
    scheduled_publish timestamp(3) with time zone,
    published_at timestamp(3) with time zone,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_food_items_status DEFAULT 'draft'::public.enum_food_items_status
);


ALTER TABLE public.food_items OWNER TO directus;

--
-- Name: food_items_allergens; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.food_items_allergens (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    allergen public.enum_food_items_allergens_allergen
);


ALTER TABLE public.food_items_allergens OWNER TO directus;

--
-- Name: food_items_flavor_profile; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.food_items_flavor_profile (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    flavor public.enum_food_items_flavor_profile_flavor
);


ALTER TABLE public.food_items_flavor_profile OWNER TO directus;

--
-- Name: food_items_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.food_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.food_items_id_seq OWNER TO directus;

--
-- Name: food_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.food_items_id_seq OWNED BY public.food_items.id;


--
-- Name: food_items_ingredients; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.food_items_ingredients (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    ingredient character varying,
    is_main boolean
);


ALTER TABLE public.food_items_ingredients OWNER TO directus;

--
-- Name: food_items_local_names; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.food_items_local_names (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    language public.enum_food_items_local_names_language,
    name character varying,
    script character varying
);


ALTER TABLE public.food_items_local_names OWNER TO directus;

--
-- Name: food_items_rels; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.food_items_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    dietary_options_id integer,
    media_id integer
);


ALTER TABLE public.food_items_rels OWNER TO directus;

--
-- Name: food_items_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.food_items_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.food_items_rels_id_seq OWNER TO directus;

--
-- Name: food_items_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.food_items_rels_id_seq OWNED BY public.food_items_rels.id;


--
-- Name: home_page; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.home_page (
    id integer NOT NULL,
    hero_title text,
    hero_highlight text,
    hero_title_end text,
    hero_subtitle text,
    hero_description text,
    hero_price_info text,
    hero_vendors text,
    hero_since text,
    hero_rated text,
    hero_max_per_tour text,
    hero_low_waste text,
    hero_guides text,
    hero_stalls text,
    hero_values text,
    hero_guests_hosted text,
    hero_cities text,
    hero_bg_image text,
    manifesto_eyebrow text,
    manifesto_headline text,
    manifesto_tagline text,
    manifesto_body text,
    manifesto_attribution_role text,
    pillars_intro text,
    pillar_people_label text,
    pillar_people_heading text,
    pillar_people_body text,
    pillar_food_label text,
    pillar_food_heading text,
    pillar_food_body text,
    pillar_place_label text,
    pillar_place_heading text,
    pillar_place_body text,
    vendors_eyebrow text,
    vendors_title text,
    vendors_subtitle text,
    vendors_meet_on_tour text,
    vendors_footer text,
    vendors_read_stories text,
    segment_heading text,
    segment_subheading text,
    segment_view_all text,
    about_eyebrow text,
    about_title text,
    about_subtitle text,
    about_description text,
    about_heritage text,
    about_image text,
    expect_title text,
    expect_subtitle text,
    expect_stat1_number text,
    expect_stat1_heading text,
    expect_stat1_body text,
    expect_stat2_number text,
    expect_stat2_heading text,
    expect_stat2_body text,
    expect_stat3_number text,
    expect_stat3_heading text,
    expect_stat3_body text,
    expect_stat4_number text,
    expect_stat4_heading text,
    expect_stat4_body text,
    cta_eyebrow text,
    cta_title text,
    cta_subtitle text,
    cta_free_cancellation text,
    cta_reply_time text,
    cta_max_people text,
    cta_book_experience text,
    cta_chat_whatsapp text,
    faqs jsonb,
    meta_title text,
    meta_description text,
    created_at timestamp(3) with time zone DEFAULT now(),
    updated_at timestamp(3) with time zone DEFAULT now(),
    _status character varying(50) DEFAULT 'draft'::character varying,
    _locales jsonb,
    _latestversion integer,
    _autosave boolean DEFAULT false
);


ALTER TABLE public.home_page OWNER TO directus;

--
-- Name: home_page_blocks_about_block; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.home_page_blocks_about_block (
    id integer NOT NULL,
    _parent_id integer,
    _order integer,
    _path character varying,
    block_name character varying,
    eyebrow character varying,
    title character varying,
    subtitle character varying,
    description text,
    heritage character varying,
    image character varying
);


ALTER TABLE public.home_page_blocks_about_block OWNER TO directus;

--
-- Name: home_page_blocks_about_block_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.home_page_blocks_about_block_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.home_page_blocks_about_block_id_seq OWNER TO directus;

--
-- Name: home_page_blocks_about_block_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.home_page_blocks_about_block_id_seq OWNED BY public.home_page_blocks_about_block.id;


--
-- Name: home_page_blocks_cta_block; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.home_page_blocks_cta_block (
    id integer CONSTRAINT home_page_cta_section_id_not_null NOT NULL,
    _parent_id integer,
    _order integer,
    _path character varying,
    block_name character varying,
    eyebrow character varying,
    title character varying,
    subtitle character varying
);


ALTER TABLE public.home_page_blocks_cta_block OWNER TO directus;

--
-- Name: home_page_blocks_cta_block_buttons; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.home_page_blocks_cta_block_buttons (
    id integer CONSTRAINT home_page_cta_section_buttons_id_not_null NOT NULL,
    _parent_id integer,
    _order integer,
    _path character varying,
    label character varying,
    url character varying,
    variant character varying(50) DEFAULT 'primary'::character varying
);


ALTER TABLE public.home_page_blocks_cta_block_buttons OWNER TO directus;

--
-- Name: home_page_blocks_cta_block_features; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.home_page_blocks_cta_block_features (
    id integer CONSTRAINT home_page_cta_section_features_id_not_null NOT NULL,
    _parent_id integer,
    _order integer,
    _path character varying,
    text character varying
);


ALTER TABLE public.home_page_blocks_cta_block_features OWNER TO directus;

--
-- Name: home_page_blocks_hero_block; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.home_page_blocks_hero_block (
    id integer NOT NULL,
    _parent_id integer,
    _order integer,
    _path character varying,
    block_name character varying,
    title character varying,
    highlight character varying,
    title_end character varying,
    subtitle character varying,
    description text,
    price_info character varying,
    bg_image character varying
);


ALTER TABLE public.home_page_blocks_hero_block OWNER TO directus;

--
-- Name: home_page_blocks_hero_block_badges; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.home_page_blocks_hero_block_badges (
    id integer NOT NULL,
    _parent_id integer,
    _order integer,
    _path character varying,
    text character varying
);


ALTER TABLE public.home_page_blocks_hero_block_badges OWNER TO directus;

--
-- Name: home_page_blocks_hero_block_badges_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.home_page_blocks_hero_block_badges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.home_page_blocks_hero_block_badges_id_seq OWNER TO directus;

--
-- Name: home_page_blocks_hero_block_badges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.home_page_blocks_hero_block_badges_id_seq OWNED BY public.home_page_blocks_hero_block_badges.id;


--
-- Name: home_page_blocks_hero_block_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.home_page_blocks_hero_block_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.home_page_blocks_hero_block_id_seq OWNER TO directus;

--
-- Name: home_page_blocks_hero_block_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.home_page_blocks_hero_block_id_seq OWNED BY public.home_page_blocks_hero_block.id;


--
-- Name: home_page_blocks_manifesto_block; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.home_page_blocks_manifesto_block (
    id integer NOT NULL,
    _parent_id integer,
    _order integer,
    _path character varying,
    block_name character varying,
    eyebrow character varying,
    headline text,
    tagline character varying,
    body text,
    attribution_role character varying
);


ALTER TABLE public.home_page_blocks_manifesto_block OWNER TO directus;

--
-- Name: home_page_blocks_manifesto_block_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.home_page_blocks_manifesto_block_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.home_page_blocks_manifesto_block_id_seq OWNER TO directus;

--
-- Name: home_page_blocks_manifesto_block_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.home_page_blocks_manifesto_block_id_seq OWNED BY public.home_page_blocks_manifesto_block.id;


--
-- Name: home_page_blocks_pillars_block; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.home_page_blocks_pillars_block (
    id integer NOT NULL,
    _parent_id integer,
    _order integer,
    _path character varying,
    block_name character varying,
    intro character varying
);


ALTER TABLE public.home_page_blocks_pillars_block OWNER TO directus;

--
-- Name: home_page_blocks_pillars_block_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.home_page_blocks_pillars_block_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.home_page_blocks_pillars_block_id_seq OWNER TO directus;

--
-- Name: home_page_blocks_pillars_block_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.home_page_blocks_pillars_block_id_seq OWNED BY public.home_page_blocks_pillars_block.id;


--
-- Name: home_page_blocks_pillars_block_pillars; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.home_page_blocks_pillars_block_pillars (
    id integer NOT NULL,
    _parent_id integer,
    _order integer,
    _path character varying,
    label character varying,
    heading character varying,
    body text
);


ALTER TABLE public.home_page_blocks_pillars_block_pillars OWNER TO directus;

--
-- Name: home_page_blocks_pillars_block_pillars_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.home_page_blocks_pillars_block_pillars_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.home_page_blocks_pillars_block_pillars_id_seq OWNER TO directus;

--
-- Name: home_page_blocks_pillars_block_pillars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.home_page_blocks_pillars_block_pillars_id_seq OWNED BY public.home_page_blocks_pillars_block_pillars.id;


--
-- Name: home_page_blocks_segments_block; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.home_page_blocks_segments_block (
    id integer NOT NULL,
    _parent_id integer,
    _order integer,
    _path character varying,
    block_name character varying,
    heading character varying,
    subheading character varying,
    view_all_label character varying
);


ALTER TABLE public.home_page_blocks_segments_block OWNER TO directus;

--
-- Name: home_page_blocks_segments_block_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.home_page_blocks_segments_block_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.home_page_blocks_segments_block_id_seq OWNER TO directus;

--
-- Name: home_page_blocks_segments_block_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.home_page_blocks_segments_block_id_seq OWNED BY public.home_page_blocks_segments_block.id;


--
-- Name: home_page_blocks_stats_block; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.home_page_blocks_stats_block (
    id integer NOT NULL,
    _parent_id integer,
    _order integer,
    _path character varying,
    block_name character varying,
    title character varying,
    subtitle character varying
);


ALTER TABLE public.home_page_blocks_stats_block OWNER TO directus;

--
-- Name: home_page_blocks_stats_block_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.home_page_blocks_stats_block_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.home_page_blocks_stats_block_id_seq OWNER TO directus;

--
-- Name: home_page_blocks_stats_block_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.home_page_blocks_stats_block_id_seq OWNED BY public.home_page_blocks_stats_block.id;


--
-- Name: home_page_blocks_stats_block_stats; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.home_page_blocks_stats_block_stats (
    id integer NOT NULL,
    _parent_id integer,
    _order integer,
    _path character varying,
    number character varying,
    heading character varying,
    body text
);


ALTER TABLE public.home_page_blocks_stats_block_stats OWNER TO directus;

--
-- Name: home_page_blocks_stats_block_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.home_page_blocks_stats_block_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.home_page_blocks_stats_block_stats_id_seq OWNER TO directus;

--
-- Name: home_page_blocks_stats_block_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.home_page_blocks_stats_block_stats_id_seq OWNED BY public.home_page_blocks_stats_block_stats.id;


--
-- Name: home_page_blocks_vendors_block; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.home_page_blocks_vendors_block (
    id integer NOT NULL,
    _parent_id integer,
    _order integer,
    _path character varying,
    block_name character varying,
    eyebrow character varying,
    title character varying,
    subtitle character varying
);


ALTER TABLE public.home_page_blocks_vendors_block OWNER TO directus;

--
-- Name: home_page_blocks_vendors_block_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.home_page_blocks_vendors_block_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.home_page_blocks_vendors_block_id_seq OWNER TO directus;

--
-- Name: home_page_blocks_vendors_block_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.home_page_blocks_vendors_block_id_seq OWNED BY public.home_page_blocks_vendors_block.id;


--
-- Name: home_page_blocks_vendors_block_links; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.home_page_blocks_vendors_block_links (
    id integer NOT NULL,
    _parent_id integer,
    _order integer,
    _path character varying,
    label character varying,
    url character varying
);


ALTER TABLE public.home_page_blocks_vendors_block_links OWNER TO directus;

--
-- Name: home_page_blocks_vendors_block_links_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.home_page_blocks_vendors_block_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.home_page_blocks_vendors_block_links_id_seq OWNER TO directus;

--
-- Name: home_page_blocks_vendors_block_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.home_page_blocks_vendors_block_links_id_seq OWNED BY public.home_page_blocks_vendors_block_links.id;


--
-- Name: home_page_cta_section_buttons_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.home_page_cta_section_buttons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.home_page_cta_section_buttons_id_seq OWNER TO directus;

--
-- Name: home_page_cta_section_buttons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.home_page_cta_section_buttons_id_seq OWNED BY public.home_page_blocks_cta_block_buttons.id;


--
-- Name: home_page_cta_section_features_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.home_page_cta_section_features_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.home_page_cta_section_features_id_seq OWNER TO directus;

--
-- Name: home_page_cta_section_features_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.home_page_cta_section_features_id_seq OWNED BY public.home_page_blocks_cta_block_features.id;


--
-- Name: home_page_cta_section_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.home_page_cta_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.home_page_cta_section_id_seq OWNER TO directus;

--
-- Name: home_page_cta_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.home_page_cta_section_id_seq OWNED BY public.home_page_blocks_cta_block.id;


--
-- Name: home_page_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.home_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.home_page_id_seq OWNER TO directus;

--
-- Name: home_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.home_page_id_seq OWNED BY public.home_page.id;


--
-- Name: legal_pages; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.legal_pages (
    id integer NOT NULL,
    slug text NOT NULL,
    status character varying(50) DEFAULT 'draft'::character varying,
    headline text NOT NULL,
    content jsonb,
    meta_title text,
    meta_description text,
    created_at timestamp(3) with time zone DEFAULT now(),
    updated_at timestamp(3) with time zone DEFAULT now(),
    _status character varying(50) DEFAULT 'draft'::character varying,
    _locales jsonb,
    _latestversion integer,
    _autosave boolean DEFAULT false
);


ALTER TABLE public.legal_pages OWNER TO directus;

--
-- Name: legal_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.legal_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.legal_pages_id_seq OWNER TO directus;

--
-- Name: legal_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.legal_pages_id_seq OWNED BY public.legal_pages.id;


--
-- Name: location_landing_pages; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.location_landing_pages (
    id integer NOT NULL,
    status public.enum_location_landing_pages_status DEFAULT 'draft'::public.enum_location_landing_pages_status,
    location_name character varying NOT NULL,
    slug character varying NOT NULL,
    hero_title character varying,
    hero_subtitle character varying,
    hero_description character varying,
    hero_image character varying,
    intro_title character varying,
    intro_content character varying,
    intro_image character varying,
    best_time_to_visit character varying,
    getting_around character varying,
    what_to_pack character varying,
    meta_title character varying,
    meta_description character varying,
    published_at timestamp(3) with time zone,
    meta_image_id integer,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.location_landing_pages OWNER TO directus;

--
-- Name: location_landing_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.location_landing_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.location_landing_pages_id_seq OWNER TO directus;

--
-- Name: location_landing_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.location_landing_pages_id_seq OWNED BY public.location_landing_pages.id;


--
-- Name: locations; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.locations (
    id integer NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    icon character varying,
    color character varying,
    description text,
    status character varying(50) DEFAULT 'published'::character varying,
    created_at timestamp(3) with time zone DEFAULT now(),
    updated_at timestamp(3) with time zone DEFAULT now(),
    _status character varying(50) DEFAULT 'published'::character varying
);


ALTER TABLE public.locations OWNER TO directus;

--
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.locations_id_seq OWNER TO directus;

--
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.media (
    id integer NOT NULL,
    alt character varying,
    caption character varying,
    usage character varying,
    prefix character varying DEFAULT 'payload-media'::character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    url character varying,
    thumbnail_u_r_l character varying,
    filename character varying,
    mime_type character varying,
    filesize numeric,
    width numeric,
    height numeric,
    focal_x numeric,
    focal_y numeric,
    sizes_thumbnail_url character varying,
    sizes_thumbnail_width numeric,
    sizes_thumbnail_height numeric,
    sizes_thumbnail_mime_type character varying,
    sizes_thumbnail_filesize numeric,
    sizes_thumbnail_filename character varying,
    sizes_medium_url character varying,
    sizes_medium_width numeric,
    sizes_medium_height numeric,
    sizes_medium_mime_type character varying,
    sizes_medium_filesize numeric,
    sizes_medium_filename character varying,
    sizes_large_url character varying,
    sizes_large_width numeric,
    sizes_large_height numeric,
    sizes_large_mime_type character varying,
    sizes_large_filesize numeric,
    sizes_large_filename character varying
);


ALTER TABLE public.media OWNER TO directus;

--
-- Name: media_coverage; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.media_coverage (
    id integer NOT NULL,
    category character varying,
    outlet character varying NOT NULL,
    year character varying,
    detail character varying,
    url character varying,
    label character varying,
    logo_domain character varying,
    highlight character varying,
    status public.enum_media_coverage_status DEFAULT 'draft'::public.enum_media_coverage_status,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.media_coverage OWNER TO directus;

--
-- Name: media_coverage_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.media_coverage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.media_coverage_id_seq OWNER TO directus;

--
-- Name: media_coverage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.media_coverage_id_seq OWNED BY public.media_coverage.id;


--
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.media_id_seq OWNER TO directus;

--
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- Name: menus; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.menus (
    id integer NOT NULL,
    name character varying NOT NULL,
    location character varying(50) NOT NULL,
    items jsonb NOT NULL,
    item_count integer,
    created_at timestamp(3) with time zone DEFAULT now(),
    updated_at timestamp(3) with time zone DEFAULT now(),
    _status character varying(50) DEFAULT 'published'::character varying
);


ALTER TABLE public.menus OWNER TO directus;

--
-- Name: menus_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.menus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menus_id_seq OWNER TO directus;

--
-- Name: menus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.menus_id_seq OWNED BY public.menus.id;


--
-- Name: payload_kv; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.payload_kv (
    id integer NOT NULL,
    key character varying NOT NULL,
    data jsonb NOT NULL
);


ALTER TABLE public.payload_kv OWNER TO directus;

--
-- Name: payload_kv_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.payload_kv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_kv_id_seq OWNER TO directus;

--
-- Name: payload_kv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.payload_kv_id_seq OWNED BY public.payload_kv.id;


--
-- Name: payload_locked_documents; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.payload_locked_documents (
    id integer NOT NULL,
    global_slug character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payload_locked_documents OWNER TO directus;

--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.payload_locked_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_locked_documents_id_seq OWNER TO directus;

--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.payload_locked_documents_id_seq OWNED BY public.payload_locked_documents.id;


--
-- Name: payload_locked_documents_rels; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.payload_locked_documents_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer,
    media_id integer,
    tours_id integer,
    stories_id integer,
    testimonials_id integer,
    faqs_id integer,
    media_coverage_id integer,
    dietary_options_id integer,
    food_items_id integer,
    vendors_id integer,
    dietary_landing_pages_id integer,
    specialty_landing_pages_id integer,
    travel_type_landing_pages_id integer,
    location_landing_pages_id integer,
    about_page_id integer,
    contact_page_id integer,
    thank_you_pages_id integer,
    translations_id integer,
    site_settings_id integer,
    redirects_id integer,
    search_id integer,
    home_page_id integer,
    legal_pages_id integer,
    menus_id integer,
    travel_types_id integer,
    specialty_experiences_id integer,
    locations_id integer
);


ALTER TABLE public.payload_locked_documents_rels OWNER TO directus;

--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.payload_locked_documents_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_locked_documents_rels_id_seq OWNER TO directus;

--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.payload_locked_documents_rels_id_seq OWNED BY public.payload_locked_documents_rels.id;


--
-- Name: payload_migrations; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.payload_migrations (
    id integer NOT NULL,
    name character varying,
    batch numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payload_migrations OWNER TO directus;

--
-- Name: payload_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.payload_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_migrations_id_seq OWNER TO directus;

--
-- Name: payload_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.payload_migrations_id_seq OWNED BY public.payload_migrations.id;


--
-- Name: payload_preferences; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.payload_preferences (
    id integer NOT NULL,
    key character varying,
    value jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payload_preferences OWNER TO directus;

--
-- Name: payload_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.payload_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_preferences_id_seq OWNER TO directus;

--
-- Name: payload_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.payload_preferences_id_seq OWNED BY public.payload_preferences.id;


--
-- Name: payload_preferences_rels; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.payload_preferences_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer
);


ALTER TABLE public.payload_preferences_rels OWNER TO directus;

--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.payload_preferences_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_preferences_rels_id_seq OWNER TO directus;

--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.payload_preferences_rels_id_seq OWNED BY public.payload_preferences_rels.id;


--
-- Name: redirects; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.redirects (
    id integer NOT NULL,
    "from" character varying NOT NULL,
    to_type public.enum_redirects_to_type DEFAULT 'reference'::public.enum_redirects_to_type,
    to_url character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.redirects OWNER TO directus;

--
-- Name: redirects_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.redirects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.redirects_id_seq OWNER TO directus;

--
-- Name: redirects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.redirects_id_seq OWNED BY public.redirects.id;


--
-- Name: redirects_rels; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.redirects_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    tours_id integer,
    stories_id integer,
    dietary_landing_pages_id integer,
    specialty_landing_pages_id integer,
    travel_type_landing_pages_id integer,
    location_landing_pages_id integer
);


ALTER TABLE public.redirects_rels OWNER TO directus;

--
-- Name: redirects_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.redirects_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.redirects_rels_id_seq OWNER TO directus;

--
-- Name: redirects_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.redirects_rels_id_seq OWNED BY public.redirects_rels.id;


--
-- Name: search; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.search (
    id integer NOT NULL,
    title character varying,
    priority numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.search OWNER TO directus;

--
-- Name: search_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.search_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.search_id_seq OWNER TO directus;

--
-- Name: search_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.search_id_seq OWNED BY public.search.id;


--
-- Name: search_rels; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.search_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    tours_id integer,
    stories_id integer,
    faqs_id integer,
    testimonials_id integer
);


ALTER TABLE public.search_rels OWNER TO directus;

--
-- Name: search_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.search_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.search_rels_id_seq OWNER TO directus;

--
-- Name: search_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.search_rels_id_seq OWNED BY public.search_rels.id;


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.site_settings (
    id integer NOT NULL,
    site_name character varying,
    tagline character varying,
    description character varying,
    hero_title character varying,
    hero_subtitle character varying,
    hero_description character varying,
    hero_image character varying,
    booking_url character varying,
    social_media jsonb,
    contact_email character varying,
    contact_phone character varying,
    whatsapp_number character varying,
    address character varying,
    meta_title character varying,
    meta_description character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    main_navigation jsonb,
    mobile_navigation jsonb,
    footer_navigation jsonb,
    footer_copyright_text text,
    sub_page_menus jsonb
);


ALTER TABLE public.site_settings OWNER TO directus;

--
-- Name: site_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.site_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.site_settings_id_seq OWNER TO directus;

--
-- Name: site_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.site_settings_id_seq OWNED BY public.site_settings.id;


--
-- Name: specialty_experiences; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.specialty_experiences (
    id integer NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    icon character varying,
    color character varying,
    description text,
    status character varying(50) DEFAULT 'published'::character varying,
    created_at timestamp(3) with time zone DEFAULT now(),
    updated_at timestamp(3) with time zone DEFAULT now(),
    _status character varying(50) DEFAULT 'published'::character varying
);


ALTER TABLE public.specialty_experiences OWNER TO directus;

--
-- Name: specialty_experiences_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.specialty_experiences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.specialty_experiences_id_seq OWNER TO directus;

--
-- Name: specialty_experiences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.specialty_experiences_id_seq OWNED BY public.specialty_experiences.id;


--
-- Name: specialty_landing_pages; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.specialty_landing_pages (
    id integer NOT NULL,
    specialty_name character varying NOT NULL,
    slug character varying NOT NULL,
    status public.enum_specialty_landing_pages_status DEFAULT 'draft'::public.enum_specialty_landing_pages_status,
    icon character varying,
    color character varying,
    hero_title character varying,
    hero_subtitle character varying,
    hero_description character varying,
    hero_image character varying,
    experience_title character varying,
    experience_content character varying,
    what_makes_special character varying,
    highlights jsonb,
    meta_title character varying,
    meta_description character varying,
    published_at timestamp(3) with time zone,
    meta_image_id integer,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.specialty_landing_pages OWNER TO directus;

--
-- Name: specialty_landing_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.specialty_landing_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.specialty_landing_pages_id_seq OWNER TO directus;

--
-- Name: specialty_landing_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.specialty_landing_pages_id_seq OWNED BY public.specialty_landing_pages.id;


--
-- Name: stories; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.stories (
    id integer NOT NULL,
    title character varying,
    slug character varying,
    author_id integer,
    excerpt character varying,
    content character varying,
    published_date timestamp(3) with time zone,
    featured_image character varying,
    status public.enum_stories_status DEFAULT 'draft'::public.enum_stories_status,
    workflow_status public.enum_stories_workflow_status DEFAULT 'draft'::public.enum_stories_workflow_status,
    scheduled_publish timestamp(3) with time zone,
    meta_title character varying,
    meta_description character varying,
    meta_image_id integer,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_stories_status DEFAULT 'draft'::public.enum_stories_status
);


ALTER TABLE public.stories OWNER TO directus;

--
-- Name: stories_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.stories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stories_id_seq OWNER TO directus;

--
-- Name: stories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.stories_id_seq OWNED BY public.stories.id;


--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.testimonials (
    id integer NOT NULL,
    author_name character varying,
    author_location character varying,
    rating numeric,
    review_text character varying,
    review_title character varying,
    author_photo character varying,
    date timestamp(3) with time zone,
    visibility_verified boolean DEFAULT true,
    visibility_featured boolean DEFAULT false,
    platform character varying,
    workflow_status public.enum_testimonials_workflow_status DEFAULT 'draft'::public.enum_testimonials_workflow_status,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_testimonials_status DEFAULT 'draft'::public.enum_testimonials_status
);


ALTER TABLE public.testimonials OWNER TO directus;

--
-- Name: testimonials_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.testimonials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.testimonials_id_seq OWNER TO directus;

--
-- Name: testimonials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.testimonials_id_seq OWNED BY public.testimonials.id;


--
-- Name: thank_you_pages; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.thank_you_pages (
    id integer NOT NULL,
    title character varying NOT NULL,
    type public.enum_thank_you_pages_type NOT NULL,
    slug character varying NOT NULL,
    status public.enum_thank_you_pages_status DEFAULT 'draft'::public.enum_thank_you_pages_status,
    hero_section_heading character varying DEFAULT 'Thank You!'::character varying,
    hero_section_subheading character varying DEFAULT 'We''ve received your message'::character varying,
    hero_section_icon character varying DEFAULT '✅'::character varying,
    message jsonb,
    contact_info_show_contact boolean DEFAULT true,
    contact_info_email character varying,
    contact_info_phone character varying,
    contact_info_response_time character varying DEFAULT 'We''ll respond within 24 hours'::character varying,
    cta_section_show_cta boolean DEFAULT true,
    seo_meta_title character varying,
    seo_meta_description character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.thank_you_pages OWNER TO directus;

--
-- Name: thank_you_pages_cta_section_cta_buttons; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.thank_you_pages_cta_section_cta_buttons (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    text character varying NOT NULL,
    url character varying NOT NULL,
    variant public.enum_thank_you_pages_cta_section_cta_buttons_variant DEFAULT 'primary'::public.enum_thank_you_pages_cta_section_cta_buttons_variant
);


ALTER TABLE public.thank_you_pages_cta_section_cta_buttons OWNER TO directus;

--
-- Name: thank_you_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.thank_you_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.thank_you_pages_id_seq OWNER TO directus;

--
-- Name: thank_you_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.thank_you_pages_id_seq OWNED BY public.thank_you_pages.id;


--
-- Name: thank_you_pages_next_steps; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.thank_you_pages_next_steps (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    step character varying NOT NULL
);


ALTER TABLE public.thank_you_pages_next_steps OWNER TO directus;

--
-- Name: tours; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.tours (
    id integer NOT NULL,
    name character varying,
    slug character varying,
    tagline character varying,
    short_description character varying,
    full_description character varying,
    price numeric,
    currency character varying DEFAULT 'MYR'::character varying,
    duration character varying,
    duration_minutes numeric,
    location character varying,
    meeting_point character varying,
    max_participants numeric,
    min_participants numeric DEFAULT 2,
    tailored_available boolean DEFAULT false,
    tailored_notes character varying,
    hero_image character varying,
    booking_url character varying,
    instant_confirmation boolean DEFAULT true,
    scheduled_publish timestamp(3) with time zone,
    featured boolean DEFAULT false,
    popular boolean DEFAULT false,
    new boolean DEFAULT false,
    published_at timestamp(3) with time zone,
    status public.enum_tours_status DEFAULT 'draft'::public.enum_tours_status,
    workflow_status public.enum_tours_workflow_status DEFAULT 'draft'::public.enum_tours_workflow_status,
    meta_title character varying,
    meta_description character varying,
    meta_image_id integer,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_tours_status DEFAULT 'draft'::public.enum_tours_status
);


ALTER TABLE public.tours OWNER TO directus;

--
-- Name: tours_gallery_images; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.tours_gallery_images (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    image character varying
);


ALTER TABLE public.tours_gallery_images OWNER TO directus;

--
-- Name: tours_highlights; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.tours_highlights (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    highlight character varying
);


ALTER TABLE public.tours_highlights OWNER TO directus;

--
-- Name: tours_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.tours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tours_id_seq OWNER TO directus;

--
-- Name: tours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.tours_id_seq OWNED BY public.tours.id;


--
-- Name: tours_rels; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.tours_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    dietary_options_id integer,
    travel_type_landing_pages_id integer,
    specialty_landing_pages_id integer,
    food_items_id integer
);


ALTER TABLE public.tours_rels OWNER TO directus;

--
-- Name: tours_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.tours_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tours_rels_id_seq OWNER TO directus;

--
-- Name: tours_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.tours_rels_id_seq OWNED BY public.tours_rels.id;


--
-- Name: tours_whats_excluded; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.tours_whats_excluded (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    item character varying
);


ALTER TABLE public.tours_whats_excluded OWNER TO directus;

--
-- Name: tours_whats_included; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.tours_whats_included (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    item character varying
);


ALTER TABLE public.tours_whats_included OWNER TO directus;

--
-- Name: translations; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.translations (
    id integer NOT NULL,
    label character varying NOT NULL,
    locale public.enum_translations_locale NOT NULL,
    collection public.enum_translations_collection NOT NULL,
    status public.enum_translations_status DEFAULT 'draft'::public.enum_translations_status,
    translator character varying,
    translated_at timestamp(3) with time zone,
    fields_name character varying,
    fields_tagline character varying,
    fields_short_description character varying,
    fields_full_description character varying,
    fields_content character varying,
    fields_excerpt character varying,
    fields_question character varying,
    fields_answer character varying,
    fields_review_text character varying,
    fields_review_title character varying,
    fields_hero_title character varying,
    fields_hero_subtitle character varying,
    fields_hero_description character varying,
    seo_meta_title character varying,
    seo_meta_description character varying,
    notes character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.translations OWNER TO directus;

--
-- Name: translations_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.translations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.translations_id_seq OWNER TO directus;

--
-- Name: translations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.translations_id_seq OWNED BY public.translations.id;


--
-- Name: translations_rels; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.translations_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    tours_id integer,
    stories_id integer,
    testimonials_id integer,
    faqs_id integer,
    media_coverage_id integer,
    dietary_landing_pages_id integer,
    specialty_landing_pages_id integer,
    travel_type_landing_pages_id integer,
    location_landing_pages_id integer,
    home_page_id integer,
    legal_pages_id integer
);


ALTER TABLE public.translations_rels OWNER TO directus;

--
-- Name: translations_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.translations_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.translations_rels_id_seq OWNER TO directus;

--
-- Name: translations_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.translations_rels_id_seq OWNED BY public.translations_rels.id;


--
-- Name: travel_type_landing_pages; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.travel_type_landing_pages (
    id integer NOT NULL,
    travel_type_name character varying NOT NULL,
    slug character varying NOT NULL,
    status public.enum_travel_type_landing_pages_status DEFAULT 'draft'::public.enum_travel_type_landing_pages_status,
    icon character varying,
    color character varying,
    hero_title character varying,
    hero_subtitle character varying,
    hero_description character varying,
    hero_image character varying,
    why_perfect_title character varying,
    why_perfect_content character varying,
    what_to_expect character varying,
    tips_content character varying,
    suitable_tours jsonb,
    key_features jsonb,
    meta_title character varying,
    meta_description character varying,
    published_at timestamp(3) with time zone,
    meta_image_id integer,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.travel_type_landing_pages OWNER TO directus;

--
-- Name: travel_type_landing_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.travel_type_landing_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.travel_type_landing_pages_id_seq OWNER TO directus;

--
-- Name: travel_type_landing_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.travel_type_landing_pages_id_seq OWNED BY public.travel_type_landing_pages.id;


--
-- Name: travel_types; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.travel_types (
    id integer NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    icon character varying,
    color character varying,
    description text,
    status character varying(50) DEFAULT 'published'::character varying,
    created_at timestamp(3) with time zone DEFAULT now(),
    updated_at timestamp(3) with time zone DEFAULT now(),
    _status character varying(50) DEFAULT 'published'::character varying
);


ALTER TABLE public.travel_types OWNER TO directus;

--
-- Name: travel_types_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.travel_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.travel_types_id_seq OWNER TO directus;

--
-- Name: travel_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.travel_types_id_seq OWNED BY public.travel_types.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.users (
    id integer NOT NULL,
    role public.enum_users_role DEFAULT 'editor'::public.enum_users_role NOT NULL,
    full_name character varying,
    department character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    email character varying NOT NULL,
    reset_password_token character varying,
    reset_password_expiration timestamp(3) with time zone,
    salt character varying,
    hash character varying,
    login_attempts numeric DEFAULT 0,
    lock_until timestamp(3) with time zone
);


ALTER TABLE public.users OWNER TO directus;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO directus;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_sessions; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.users_sessions (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    created_at timestamp(3) with time zone,
    expires_at timestamp(3) with time zone NOT NULL
);


ALTER TABLE public.users_sessions OWNER TO directus;

--
-- Name: vendors; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.vendors (
    id integer NOT NULL,
    name character varying,
    slug character varying,
    type public.enum_vendors_type,
    description character varying,
    history character varying,
    year_established numeric,
    generation character varying,
    owner_name character varying,
    cuisine_type public.enum_vendors_cuisine_type,
    location_address character varying,
    location_city character varying,
    location_state public.enum_vendors_location_state,
    location_postcode character varying,
    location_country character varying DEFAULT 'Malaysia'::character varying,
    location_latitude numeric,
    location_longitude numeric,
    location_landmark character varying,
    contact_phone character varying,
    contact_whatsapp character varying,
    contact_email character varying,
    contact_website character varying,
    contact_facebook character varying,
    contact_instagram character varying,
    price_range public.enum_vendors_price_range,
    images_main_id integer,
    story character varying,
    media_features character varying,
    tips character varying,
    status public.enum_vendors_status DEFAULT 'draft'::public.enum_vendors_status,
    featured boolean DEFAULT false,
    scheduled_publish timestamp(3) with time zone,
    published_at timestamp(3) with time zone,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_vendors_status DEFAULT 'draft'::public.enum_vendors_status
);


ALTER TABLE public.vendors OWNER TO directus;

--
-- Name: vendors_awards; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.vendors_awards (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    award character varying,
    year numeric,
    organization character varying
);


ALTER TABLE public.vendors_awards OWNER TO directus;

--
-- Name: vendors_closed_on; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.vendors_closed_on (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    day public.enum_vendors_closed_on_day
);


ALTER TABLE public.vendors_closed_on OWNER TO directus;

--
-- Name: vendors_facilities; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.vendors_facilities (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    facility public.enum_vendors_facilities_facility
);


ALTER TABLE public.vendors_facilities OWNER TO directus;

--
-- Name: vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendors_id_seq OWNER TO directus;

--
-- Name: vendors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.vendors_id_seq OWNED BY public.vendors.id;


--
-- Name: vendors_images_gallery; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.vendors_images_gallery (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    image_id integer
);


ALTER TABLE public.vendors_images_gallery OWNER TO directus;

--
-- Name: vendors_operating_hours; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.vendors_operating_hours (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    day public.enum_vendors_operating_hours_day,
    open_time character varying,
    close_time character varying,
    is_closed boolean,
    notes character varying
);


ALTER TABLE public.vendors_operating_hours OWNER TO directus;

--
-- Name: vendors_payment_methods; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.vendors_payment_methods (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    method public.enum_vendors_payment_methods_method
);


ALTER TABLE public.vendors_payment_methods OWNER TO directus;

--
-- Name: vendors_rels; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.vendors_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    food_items_id integer,
    dietary_options_id integer
);


ALTER TABLE public.vendors_rels OWNER TO directus;

--
-- Name: vendors_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.vendors_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendors_rels_id_seq OWNER TO directus;

--
-- Name: vendors_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.vendors_rels_id_seq OWNED BY public.vendors_rels.id;


--
-- Name: _dietary_options_v id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._dietary_options_v ALTER COLUMN id SET DEFAULT nextval('public._dietary_options_v_id_seq'::regclass);


--
-- Name: _faqs_v id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._faqs_v ALTER COLUMN id SET DEFAULT nextval('public._faqs_v_id_seq'::regclass);


--
-- Name: _food_items_v id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v ALTER COLUMN id SET DEFAULT nextval('public._food_items_v_id_seq'::regclass);


--
-- Name: _food_items_v_rels id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v_rels ALTER COLUMN id SET DEFAULT nextval('public._food_items_v_rels_id_seq'::regclass);


--
-- Name: _food_items_v_version_allergens id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v_version_allergens ALTER COLUMN id SET DEFAULT nextval('public._food_items_v_version_allergens_id_seq'::regclass);


--
-- Name: _food_items_v_version_flavor_profile id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v_version_flavor_profile ALTER COLUMN id SET DEFAULT nextval('public._food_items_v_version_flavor_profile_id_seq'::regclass);


--
-- Name: _food_items_v_version_ingredients id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v_version_ingredients ALTER COLUMN id SET DEFAULT nextval('public._food_items_v_version_ingredients_id_seq'::regclass);


--
-- Name: _food_items_v_version_local_names id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v_version_local_names ALTER COLUMN id SET DEFAULT nextval('public._food_items_v_version_local_names_id_seq'::regclass);


--
-- Name: _home_page_v id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._home_page_v ALTER COLUMN id SET DEFAULT nextval('public._home_page_v_id_seq'::regclass);


--
-- Name: _legal_pages_v id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._legal_pages_v ALTER COLUMN id SET DEFAULT nextval('public._legal_pages_v_id_seq'::regclass);


--
-- Name: _stories_v id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._stories_v ALTER COLUMN id SET DEFAULT nextval('public._stories_v_id_seq'::regclass);


--
-- Name: _testimonials_v id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._testimonials_v ALTER COLUMN id SET DEFAULT nextval('public._testimonials_v_id_seq'::regclass);


--
-- Name: _tours_v id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v ALTER COLUMN id SET DEFAULT nextval('public._tours_v_id_seq'::regclass);


--
-- Name: _tours_v_rels id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v_rels ALTER COLUMN id SET DEFAULT nextval('public._tours_v_rels_id_seq'::regclass);


--
-- Name: _tours_v_version_gallery_images id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v_version_gallery_images ALTER COLUMN id SET DEFAULT nextval('public._tours_v_version_gallery_images_id_seq'::regclass);


--
-- Name: _tours_v_version_highlights id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v_version_highlights ALTER COLUMN id SET DEFAULT nextval('public._tours_v_version_highlights_id_seq'::regclass);


--
-- Name: _tours_v_version_whats_excluded id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v_version_whats_excluded ALTER COLUMN id SET DEFAULT nextval('public._tours_v_version_whats_excluded_id_seq'::regclass);


--
-- Name: _tours_v_version_whats_included id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v_version_whats_included ALTER COLUMN id SET DEFAULT nextval('public._tours_v_version_whats_included_id_seq'::regclass);


--
-- Name: _vendors_v id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v ALTER COLUMN id SET DEFAULT nextval('public._vendors_v_id_seq'::regclass);


--
-- Name: _vendors_v_rels id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_rels ALTER COLUMN id SET DEFAULT nextval('public._vendors_v_rels_id_seq'::regclass);


--
-- Name: _vendors_v_version_awards id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_version_awards ALTER COLUMN id SET DEFAULT nextval('public._vendors_v_version_awards_id_seq'::regclass);


--
-- Name: _vendors_v_version_closed_on id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_version_closed_on ALTER COLUMN id SET DEFAULT nextval('public._vendors_v_version_closed_on_id_seq'::regclass);


--
-- Name: _vendors_v_version_facilities id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_version_facilities ALTER COLUMN id SET DEFAULT nextval('public._vendors_v_version_facilities_id_seq'::regclass);


--
-- Name: _vendors_v_version_images_gallery id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_version_images_gallery ALTER COLUMN id SET DEFAULT nextval('public._vendors_v_version_images_gallery_id_seq'::regclass);


--
-- Name: _vendors_v_version_operating_hours id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_version_operating_hours ALTER COLUMN id SET DEFAULT nextval('public._vendors_v_version_operating_hours_id_seq'::regclass);


--
-- Name: _vendors_v_version_payment_methods id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_version_payment_methods ALTER COLUMN id SET DEFAULT nextval('public._vendors_v_version_payment_methods_id_seq'::regclass);


--
-- Name: about_page id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.about_page ALTER COLUMN id SET DEFAULT nextval('public.about_page_id_seq'::regclass);


--
-- Name: contact_page id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.contact_page ALTER COLUMN id SET DEFAULT nextval('public.contact_page_id_seq'::regclass);


--
-- Name: dietary_landing_pages id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.dietary_landing_pages ALTER COLUMN id SET DEFAULT nextval('public.dietary_landing_pages_id_seq'::regclass);


--
-- Name: dietary_options id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.dietary_options ALTER COLUMN id SET DEFAULT nextval('public.dietary_options_id_seq'::regclass);


--
-- Name: faqs id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.faqs ALTER COLUMN id SET DEFAULT nextval('public.faqs_id_seq'::regclass);


--
-- Name: food_items id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.food_items ALTER COLUMN id SET DEFAULT nextval('public.food_items_id_seq'::regclass);


--
-- Name: food_items_rels id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.food_items_rels ALTER COLUMN id SET DEFAULT nextval('public.food_items_rels_id_seq'::regclass);


--
-- Name: home_page id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page ALTER COLUMN id SET DEFAULT nextval('public.home_page_id_seq'::regclass);


--
-- Name: home_page_blocks_about_block id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_about_block ALTER COLUMN id SET DEFAULT nextval('public.home_page_blocks_about_block_id_seq'::regclass);


--
-- Name: home_page_blocks_cta_block id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_cta_block ALTER COLUMN id SET DEFAULT nextval('public.home_page_cta_section_id_seq'::regclass);


--
-- Name: home_page_blocks_cta_block_buttons id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_cta_block_buttons ALTER COLUMN id SET DEFAULT nextval('public.home_page_cta_section_buttons_id_seq'::regclass);


--
-- Name: home_page_blocks_cta_block_features id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_cta_block_features ALTER COLUMN id SET DEFAULT nextval('public.home_page_cta_section_features_id_seq'::regclass);


--
-- Name: home_page_blocks_hero_block id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_hero_block ALTER COLUMN id SET DEFAULT nextval('public.home_page_blocks_hero_block_id_seq'::regclass);


--
-- Name: home_page_blocks_hero_block_badges id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_hero_block_badges ALTER COLUMN id SET DEFAULT nextval('public.home_page_blocks_hero_block_badges_id_seq'::regclass);


--
-- Name: home_page_blocks_manifesto_block id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_manifesto_block ALTER COLUMN id SET DEFAULT nextval('public.home_page_blocks_manifesto_block_id_seq'::regclass);


--
-- Name: home_page_blocks_pillars_block id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_pillars_block ALTER COLUMN id SET DEFAULT nextval('public.home_page_blocks_pillars_block_id_seq'::regclass);


--
-- Name: home_page_blocks_pillars_block_pillars id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_pillars_block_pillars ALTER COLUMN id SET DEFAULT nextval('public.home_page_blocks_pillars_block_pillars_id_seq'::regclass);


--
-- Name: home_page_blocks_segments_block id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_segments_block ALTER COLUMN id SET DEFAULT nextval('public.home_page_blocks_segments_block_id_seq'::regclass);


--
-- Name: home_page_blocks_stats_block id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_stats_block ALTER COLUMN id SET DEFAULT nextval('public.home_page_blocks_stats_block_id_seq'::regclass);


--
-- Name: home_page_blocks_stats_block_stats id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_stats_block_stats ALTER COLUMN id SET DEFAULT nextval('public.home_page_blocks_stats_block_stats_id_seq'::regclass);


--
-- Name: home_page_blocks_vendors_block id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_vendors_block ALTER COLUMN id SET DEFAULT nextval('public.home_page_blocks_vendors_block_id_seq'::regclass);


--
-- Name: home_page_blocks_vendors_block_links id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_vendors_block_links ALTER COLUMN id SET DEFAULT nextval('public.home_page_blocks_vendors_block_links_id_seq'::regclass);


--
-- Name: legal_pages id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.legal_pages ALTER COLUMN id SET DEFAULT nextval('public.legal_pages_id_seq'::regclass);


--
-- Name: location_landing_pages id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.location_landing_pages ALTER COLUMN id SET DEFAULT nextval('public.location_landing_pages_id_seq'::regclass);


--
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- Name: media id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- Name: media_coverage id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.media_coverage ALTER COLUMN id SET DEFAULT nextval('public.media_coverage_id_seq'::regclass);


--
-- Name: menus id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.menus ALTER COLUMN id SET DEFAULT nextval('public.menus_id_seq'::regclass);


--
-- Name: menus_items id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.menus_items ALTER COLUMN id SET DEFAULT nextval('public._menus_items_v_id_seq'::regclass);


--
-- Name: payload_kv id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_kv ALTER COLUMN id SET DEFAULT nextval('public.payload_kv_id_seq'::regclass);


--
-- Name: payload_locked_documents id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_id_seq'::regclass);


--
-- Name: payload_locked_documents_rels id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_rels_id_seq'::regclass);


--
-- Name: payload_migrations id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_migrations ALTER COLUMN id SET DEFAULT nextval('public.payload_migrations_id_seq'::regclass);


--
-- Name: payload_preferences id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_preferences ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_id_seq'::regclass);


--
-- Name: payload_preferences_rels id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_preferences_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_rels_id_seq'::regclass);


--
-- Name: redirects id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.redirects ALTER COLUMN id SET DEFAULT nextval('public.redirects_id_seq'::regclass);


--
-- Name: redirects_rels id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.redirects_rels ALTER COLUMN id SET DEFAULT nextval('public.redirects_rels_id_seq'::regclass);


--
-- Name: search id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.search ALTER COLUMN id SET DEFAULT nextval('public.search_id_seq'::regclass);


--
-- Name: search_rels id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.search_rels ALTER COLUMN id SET DEFAULT nextval('public.search_rels_id_seq'::regclass);


--
-- Name: site_settings id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.site_settings ALTER COLUMN id SET DEFAULT nextval('public.site_settings_id_seq'::regclass);


--
-- Name: specialty_experiences id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.specialty_experiences ALTER COLUMN id SET DEFAULT nextval('public.specialty_experiences_id_seq'::regclass);


--
-- Name: specialty_landing_pages id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.specialty_landing_pages ALTER COLUMN id SET DEFAULT nextval('public.specialty_landing_pages_id_seq'::regclass);


--
-- Name: stories id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.stories ALTER COLUMN id SET DEFAULT nextval('public.stories_id_seq'::regclass);


--
-- Name: testimonials id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.testimonials ALTER COLUMN id SET DEFAULT nextval('public.testimonials_id_seq'::regclass);


--
-- Name: thank_you_pages id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.thank_you_pages ALTER COLUMN id SET DEFAULT nextval('public.thank_you_pages_id_seq'::regclass);


--
-- Name: tours id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.tours ALTER COLUMN id SET DEFAULT nextval('public.tours_id_seq'::regclass);


--
-- Name: tours_rels id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.tours_rels ALTER COLUMN id SET DEFAULT nextval('public.tours_rels_id_seq'::regclass);


--
-- Name: translations id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations ALTER COLUMN id SET DEFAULT nextval('public.translations_id_seq'::regclass);


--
-- Name: translations_rels id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels ALTER COLUMN id SET DEFAULT nextval('public.translations_rels_id_seq'::regclass);


--
-- Name: travel_type_landing_pages id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.travel_type_landing_pages ALTER COLUMN id SET DEFAULT nextval('public.travel_type_landing_pages_id_seq'::regclass);


--
-- Name: travel_types id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.travel_types ALTER COLUMN id SET DEFAULT nextval('public.travel_types_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vendors id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);


--
-- Name: vendors_rels id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors_rels ALTER COLUMN id SET DEFAULT nextval('public.vendors_rels_id_seq'::regclass);


--
-- Name: _dietary_options_v _dietary_options_v_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._dietary_options_v
    ADD CONSTRAINT _dietary_options_v_pkey PRIMARY KEY (id);


--
-- Name: _faqs_v _faqs_v_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._faqs_v
    ADD CONSTRAINT _faqs_v_pkey PRIMARY KEY (id);


--
-- Name: _food_items_v _food_items_v_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v
    ADD CONSTRAINT _food_items_v_pkey PRIMARY KEY (id);


--
-- Name: _food_items_v_rels _food_items_v_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v_rels
    ADD CONSTRAINT _food_items_v_rels_pkey PRIMARY KEY (id);


--
-- Name: _food_items_v_version_allergens _food_items_v_version_allergens_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v_version_allergens
    ADD CONSTRAINT _food_items_v_version_allergens_pkey PRIMARY KEY (id);


--
-- Name: _food_items_v_version_flavor_profile _food_items_v_version_flavor_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v_version_flavor_profile
    ADD CONSTRAINT _food_items_v_version_flavor_profile_pkey PRIMARY KEY (id);


--
-- Name: _food_items_v_version_ingredients _food_items_v_version_ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v_version_ingredients
    ADD CONSTRAINT _food_items_v_version_ingredients_pkey PRIMARY KEY (id);


--
-- Name: _food_items_v_version_local_names _food_items_v_version_local_names_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v_version_local_names
    ADD CONSTRAINT _food_items_v_version_local_names_pkey PRIMARY KEY (id);


--
-- Name: _home_page_v _home_page_v_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._home_page_v
    ADD CONSTRAINT _home_page_v_pkey PRIMARY KEY (id);


--
-- Name: _legal_pages_v _legal_pages_v_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._legal_pages_v
    ADD CONSTRAINT _legal_pages_v_pkey PRIMARY KEY (id);


--
-- Name: menus_items _menus_items_v_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.menus_items
    ADD CONSTRAINT _menus_items_v_pkey PRIMARY KEY (id);


--
-- Name: _stories_v _stories_v_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._stories_v
    ADD CONSTRAINT _stories_v_pkey PRIMARY KEY (id);


--
-- Name: _testimonials_v _testimonials_v_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._testimonials_v
    ADD CONSTRAINT _testimonials_v_pkey PRIMARY KEY (id);


--
-- Name: _tours_v _tours_v_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v
    ADD CONSTRAINT _tours_v_pkey PRIMARY KEY (id);


--
-- Name: _tours_v_rels _tours_v_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v_rels
    ADD CONSTRAINT _tours_v_rels_pkey PRIMARY KEY (id);


--
-- Name: _tours_v_version_gallery_images _tours_v_version_gallery_images_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v_version_gallery_images
    ADD CONSTRAINT _tours_v_version_gallery_images_pkey PRIMARY KEY (id);


--
-- Name: _tours_v_version_highlights _tours_v_version_highlights_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v_version_highlights
    ADD CONSTRAINT _tours_v_version_highlights_pkey PRIMARY KEY (id);


--
-- Name: _tours_v_version_whats_excluded _tours_v_version_whats_excluded_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v_version_whats_excluded
    ADD CONSTRAINT _tours_v_version_whats_excluded_pkey PRIMARY KEY (id);


--
-- Name: _tours_v_version_whats_included _tours_v_version_whats_included_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v_version_whats_included
    ADD CONSTRAINT _tours_v_version_whats_included_pkey PRIMARY KEY (id);


--
-- Name: _vendors_v _vendors_v_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v
    ADD CONSTRAINT _vendors_v_pkey PRIMARY KEY (id);


--
-- Name: _vendors_v_rels _vendors_v_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_rels
    ADD CONSTRAINT _vendors_v_rels_pkey PRIMARY KEY (id);


--
-- Name: _vendors_v_version_awards _vendors_v_version_awards_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_version_awards
    ADD CONSTRAINT _vendors_v_version_awards_pkey PRIMARY KEY (id);


--
-- Name: _vendors_v_version_closed_on _vendors_v_version_closed_on_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_version_closed_on
    ADD CONSTRAINT _vendors_v_version_closed_on_pkey PRIMARY KEY (id);


--
-- Name: _vendors_v_version_facilities _vendors_v_version_facilities_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_version_facilities
    ADD CONSTRAINT _vendors_v_version_facilities_pkey PRIMARY KEY (id);


--
-- Name: _vendors_v_version_images_gallery _vendors_v_version_images_gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_version_images_gallery
    ADD CONSTRAINT _vendors_v_version_images_gallery_pkey PRIMARY KEY (id);


--
-- Name: _vendors_v_version_operating_hours _vendors_v_version_operating_hours_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_version_operating_hours
    ADD CONSTRAINT _vendors_v_version_operating_hours_pkey PRIMARY KEY (id);


--
-- Name: _vendors_v_version_payment_methods _vendors_v_version_payment_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_version_payment_methods
    ADD CONSTRAINT _vendors_v_version_payment_methods_pkey PRIMARY KEY (id);


--
-- Name: about_page_breadcrumbs about_page_breadcrumbs_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.about_page_breadcrumbs
    ADD CONSTRAINT about_page_breadcrumbs_pkey PRIMARY KEY (id);


--
-- Name: about_page about_page_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.about_page
    ADD CONSTRAINT about_page_pkey PRIMARY KEY (id);


--
-- Name: contact_page_breadcrumbs contact_page_breadcrumbs_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.contact_page_breadcrumbs
    ADD CONSTRAINT contact_page_breadcrumbs_pkey PRIMARY KEY (id);


--
-- Name: contact_page contact_page_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.contact_page
    ADD CONSTRAINT contact_page_pkey PRIMARY KEY (id);


--
-- Name: dietary_landing_pages dietary_landing_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.dietary_landing_pages
    ADD CONSTRAINT dietary_landing_pages_pkey PRIMARY KEY (id);


--
-- Name: dietary_options dietary_options_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.dietary_options
    ADD CONSTRAINT dietary_options_pkey PRIMARY KEY (id);


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- Name: food_items_allergens food_items_allergens_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.food_items_allergens
    ADD CONSTRAINT food_items_allergens_pkey PRIMARY KEY (id);


--
-- Name: food_items_flavor_profile food_items_flavor_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.food_items_flavor_profile
    ADD CONSTRAINT food_items_flavor_profile_pkey PRIMARY KEY (id);


--
-- Name: food_items_ingredients food_items_ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.food_items_ingredients
    ADD CONSTRAINT food_items_ingredients_pkey PRIMARY KEY (id);


--
-- Name: food_items_local_names food_items_local_names_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.food_items_local_names
    ADD CONSTRAINT food_items_local_names_pkey PRIMARY KEY (id);


--
-- Name: food_items food_items_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.food_items
    ADD CONSTRAINT food_items_pkey PRIMARY KEY (id);


--
-- Name: food_items_rels food_items_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.food_items_rels
    ADD CONSTRAINT food_items_rels_pkey PRIMARY KEY (id);


--
-- Name: home_page_blocks_about_block home_page_blocks_about_block_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_about_block
    ADD CONSTRAINT home_page_blocks_about_block_pkey PRIMARY KEY (id);


--
-- Name: home_page_blocks_hero_block_badges home_page_blocks_hero_block_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_hero_block_badges
    ADD CONSTRAINT home_page_blocks_hero_block_badges_pkey PRIMARY KEY (id);


--
-- Name: home_page_blocks_hero_block home_page_blocks_hero_block_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_hero_block
    ADD CONSTRAINT home_page_blocks_hero_block_pkey PRIMARY KEY (id);


--
-- Name: home_page_blocks_manifesto_block home_page_blocks_manifesto_block_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_manifesto_block
    ADD CONSTRAINT home_page_blocks_manifesto_block_pkey PRIMARY KEY (id);


--
-- Name: home_page_blocks_pillars_block_pillars home_page_blocks_pillars_block_pillars_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_pillars_block_pillars
    ADD CONSTRAINT home_page_blocks_pillars_block_pillars_pkey PRIMARY KEY (id);


--
-- Name: home_page_blocks_pillars_block home_page_blocks_pillars_block_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_pillars_block
    ADD CONSTRAINT home_page_blocks_pillars_block_pkey PRIMARY KEY (id);


--
-- Name: home_page_blocks_segments_block home_page_blocks_segments_block_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_segments_block
    ADD CONSTRAINT home_page_blocks_segments_block_pkey PRIMARY KEY (id);


--
-- Name: home_page_blocks_stats_block home_page_blocks_stats_block_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_stats_block
    ADD CONSTRAINT home_page_blocks_stats_block_pkey PRIMARY KEY (id);


--
-- Name: home_page_blocks_stats_block_stats home_page_blocks_stats_block_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_stats_block_stats
    ADD CONSTRAINT home_page_blocks_stats_block_stats_pkey PRIMARY KEY (id);


--
-- Name: home_page_blocks_vendors_block_links home_page_blocks_vendors_block_links_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_vendors_block_links
    ADD CONSTRAINT home_page_blocks_vendors_block_links_pkey PRIMARY KEY (id);


--
-- Name: home_page_blocks_vendors_block home_page_blocks_vendors_block_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_vendors_block
    ADD CONSTRAINT home_page_blocks_vendors_block_pkey PRIMARY KEY (id);


--
-- Name: home_page_blocks_cta_block_buttons home_page_cta_section_buttons_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_cta_block_buttons
    ADD CONSTRAINT home_page_cta_section_buttons_pkey PRIMARY KEY (id);


--
-- Name: home_page_blocks_cta_block_features home_page_cta_section_features_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_cta_block_features
    ADD CONSTRAINT home_page_cta_section_features_pkey PRIMARY KEY (id);


--
-- Name: home_page_blocks_cta_block home_page_cta_section_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_cta_block
    ADD CONSTRAINT home_page_cta_section_pkey PRIMARY KEY (id);


--
-- Name: home_page home_page_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page
    ADD CONSTRAINT home_page_pkey PRIMARY KEY (id);


--
-- Name: legal_pages legal_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.legal_pages
    ADD CONSTRAINT legal_pages_pkey PRIMARY KEY (id);


--
-- Name: location_landing_pages location_landing_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.location_landing_pages
    ADD CONSTRAINT location_landing_pages_pkey PRIMARY KEY (id);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: locations locations_slug_key; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_slug_key UNIQUE (slug);


--
-- Name: media_coverage media_coverage_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.media_coverage
    ADD CONSTRAINT media_coverage_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: menus menus_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT menus_pkey PRIMARY KEY (id);


--
-- Name: payload_kv payload_kv_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_kv
    ADD CONSTRAINT payload_kv_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents payload_locked_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents
    ADD CONSTRAINT payload_locked_documents_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_pkey PRIMARY KEY (id);


--
-- Name: payload_migrations payload_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_migrations
    ADD CONSTRAINT payload_migrations_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences payload_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_preferences
    ADD CONSTRAINT payload_preferences_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences_rels payload_preferences_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_pkey PRIMARY KEY (id);


--
-- Name: redirects redirects_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.redirects
    ADD CONSTRAINT redirects_pkey PRIMARY KEY (id);


--
-- Name: redirects_rels redirects_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.redirects_rels
    ADD CONSTRAINT redirects_rels_pkey PRIMARY KEY (id);


--
-- Name: search search_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.search
    ADD CONSTRAINT search_pkey PRIMARY KEY (id);


--
-- Name: search_rels search_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.search_rels
    ADD CONSTRAINT search_rels_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: specialty_experiences specialty_experiences_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.specialty_experiences
    ADD CONSTRAINT specialty_experiences_pkey PRIMARY KEY (id);


--
-- Name: specialty_experiences specialty_experiences_slug_key; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.specialty_experiences
    ADD CONSTRAINT specialty_experiences_slug_key UNIQUE (slug);


--
-- Name: specialty_landing_pages specialty_landing_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.specialty_landing_pages
    ADD CONSTRAINT specialty_landing_pages_pkey PRIMARY KEY (id);


--
-- Name: stories stories_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_pkey PRIMARY KEY (id);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: thank_you_pages_cta_section_cta_buttons thank_you_pages_cta_section_cta_buttons_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.thank_you_pages_cta_section_cta_buttons
    ADD CONSTRAINT thank_you_pages_cta_section_cta_buttons_pkey PRIMARY KEY (id);


--
-- Name: thank_you_pages_next_steps thank_you_pages_next_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.thank_you_pages_next_steps
    ADD CONSTRAINT thank_you_pages_next_steps_pkey PRIMARY KEY (id);


--
-- Name: thank_you_pages thank_you_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.thank_you_pages
    ADD CONSTRAINT thank_you_pages_pkey PRIMARY KEY (id);


--
-- Name: tours_gallery_images tours_gallery_images_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.tours_gallery_images
    ADD CONSTRAINT tours_gallery_images_pkey PRIMARY KEY (id);


--
-- Name: tours_highlights tours_highlights_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.tours_highlights
    ADD CONSTRAINT tours_highlights_pkey PRIMARY KEY (id);


--
-- Name: tours tours_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.tours
    ADD CONSTRAINT tours_pkey PRIMARY KEY (id);


--
-- Name: tours_rels tours_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.tours_rels
    ADD CONSTRAINT tours_rels_pkey PRIMARY KEY (id);


--
-- Name: tours_whats_excluded tours_whats_excluded_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.tours_whats_excluded
    ADD CONSTRAINT tours_whats_excluded_pkey PRIMARY KEY (id);


--
-- Name: tours_whats_included tours_whats_included_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.tours_whats_included
    ADD CONSTRAINT tours_whats_included_pkey PRIMARY KEY (id);


--
-- Name: translations translations_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_pkey PRIMARY KEY (id);


--
-- Name: translations_rels translations_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_pkey PRIMARY KEY (id);


--
-- Name: travel_type_landing_pages travel_type_landing_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.travel_type_landing_pages
    ADD CONSTRAINT travel_type_landing_pages_pkey PRIMARY KEY (id);


--
-- Name: travel_types travel_types_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.travel_types
    ADD CONSTRAINT travel_types_pkey PRIMARY KEY (id);


--
-- Name: travel_types travel_types_slug_key; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.travel_types
    ADD CONSTRAINT travel_types_slug_key UNIQUE (slug);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_sessions users_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_pkey PRIMARY KEY (id);


--
-- Name: vendors_awards vendors_awards_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors_awards
    ADD CONSTRAINT vendors_awards_pkey PRIMARY KEY (id);


--
-- Name: vendors_closed_on vendors_closed_on_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors_closed_on
    ADD CONSTRAINT vendors_closed_on_pkey PRIMARY KEY (id);


--
-- Name: vendors_facilities vendors_facilities_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors_facilities
    ADD CONSTRAINT vendors_facilities_pkey PRIMARY KEY (id);


--
-- Name: vendors_images_gallery vendors_images_gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors_images_gallery
    ADD CONSTRAINT vendors_images_gallery_pkey PRIMARY KEY (id);


--
-- Name: vendors_operating_hours vendors_operating_hours_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors_operating_hours
    ADD CONSTRAINT vendors_operating_hours_pkey PRIMARY KEY (id);


--
-- Name: vendors_payment_methods vendors_payment_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors_payment_methods
    ADD CONSTRAINT vendors_payment_methods_pkey PRIMARY KEY (id);


--
-- Name: vendors vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);


--
-- Name: vendors_rels vendors_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors_rels
    ADD CONSTRAINT vendors_rels_pkey PRIMARY KEY (id);


--
-- Name: _dietary_options_v_autosave_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _dietary_options_v_autosave_idx ON public._dietary_options_v USING btree (autosave);


--
-- Name: _dietary_options_v_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _dietary_options_v_created_at_idx ON public._dietary_options_v USING btree (created_at);


--
-- Name: _dietary_options_v_latest_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _dietary_options_v_latest_idx ON public._dietary_options_v USING btree (latest);


--
-- Name: _dietary_options_v_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _dietary_options_v_parent_idx ON public._dietary_options_v USING btree (parent_id);


--
-- Name: _dietary_options_v_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _dietary_options_v_updated_at_idx ON public._dietary_options_v USING btree (updated_at);


--
-- Name: _dietary_options_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _dietary_options_v_version_version__status_idx ON public._dietary_options_v USING btree (version__status);


--
-- Name: _dietary_options_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _dietary_options_v_version_version_created_at_idx ON public._dietary_options_v USING btree (version_created_at);


--
-- Name: _dietary_options_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _dietary_options_v_version_version_slug_idx ON public._dietary_options_v USING btree (version_slug);


--
-- Name: _dietary_options_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _dietary_options_v_version_version_updated_at_idx ON public._dietary_options_v USING btree (version_updated_at);


--
-- Name: _faqs_v_autosave_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _faqs_v_autosave_idx ON public._faqs_v USING btree (autosave);


--
-- Name: _faqs_v_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _faqs_v_created_at_idx ON public._faqs_v USING btree (created_at);


--
-- Name: _faqs_v_latest_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _faqs_v_latest_idx ON public._faqs_v USING btree (latest);


--
-- Name: _faqs_v_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _faqs_v_parent_idx ON public._faqs_v USING btree (parent_id);


--
-- Name: _faqs_v_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _faqs_v_updated_at_idx ON public._faqs_v USING btree (updated_at);


--
-- Name: _faqs_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _faqs_v_version_version__status_idx ON public._faqs_v USING btree (version__status);


--
-- Name: _faqs_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _faqs_v_version_version_created_at_idx ON public._faqs_v USING btree (version_created_at);


--
-- Name: _faqs_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _faqs_v_version_version_updated_at_idx ON public._faqs_v USING btree (version_updated_at);


--
-- Name: _food_items_v_autosave_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_autosave_idx ON public._food_items_v USING btree (autosave);


--
-- Name: _food_items_v_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_created_at_idx ON public._food_items_v USING btree (created_at);


--
-- Name: _food_items_v_latest_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_latest_idx ON public._food_items_v USING btree (latest);


--
-- Name: _food_items_v_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_parent_idx ON public._food_items_v USING btree (parent_id);


--
-- Name: _food_items_v_rels_dietary_options_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_rels_dietary_options_id_idx ON public._food_items_v_rels USING btree (dietary_options_id);


--
-- Name: _food_items_v_rels_media_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_rels_media_id_idx ON public._food_items_v_rels USING btree (media_id);


--
-- Name: _food_items_v_rels_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_rels_order_idx ON public._food_items_v_rels USING btree ("order");


--
-- Name: _food_items_v_rels_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_rels_parent_idx ON public._food_items_v_rels USING btree (parent_id);


--
-- Name: _food_items_v_rels_path_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_rels_path_idx ON public._food_items_v_rels USING btree (path);


--
-- Name: _food_items_v_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_updated_at_idx ON public._food_items_v USING btree (updated_at);


--
-- Name: _food_items_v_version_allergens_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_version_allergens_order_idx ON public._food_items_v_version_allergens USING btree (_order);


--
-- Name: _food_items_v_version_allergens_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_version_allergens_parent_id_idx ON public._food_items_v_version_allergens USING btree (_parent_id);


--
-- Name: _food_items_v_version_flavor_profile_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_version_flavor_profile_order_idx ON public._food_items_v_version_flavor_profile USING btree (_order);


--
-- Name: _food_items_v_version_flavor_profile_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_version_flavor_profile_parent_id_idx ON public._food_items_v_version_flavor_profile USING btree (_parent_id);


--
-- Name: _food_items_v_version_ingredients_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_version_ingredients_order_idx ON public._food_items_v_version_ingredients USING btree (_order);


--
-- Name: _food_items_v_version_ingredients_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_version_ingredients_parent_id_idx ON public._food_items_v_version_ingredients USING btree (_parent_id);


--
-- Name: _food_items_v_version_local_names_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_version_local_names_order_idx ON public._food_items_v_version_local_names USING btree (_order);


--
-- Name: _food_items_v_version_local_names_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_version_local_names_parent_id_idx ON public._food_items_v_version_local_names USING btree (_parent_id);


--
-- Name: _food_items_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_version_version__status_idx ON public._food_items_v USING btree (version__status);


--
-- Name: _food_items_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_version_version_created_at_idx ON public._food_items_v USING btree (version_created_at);


--
-- Name: _food_items_v_version_version_image_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_version_version_image_idx ON public._food_items_v USING btree (version_image_id);


--
-- Name: _food_items_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_version_version_slug_idx ON public._food_items_v USING btree (version_slug);


--
-- Name: _food_items_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _food_items_v_version_version_updated_at_idx ON public._food_items_v USING btree (version_updated_at);


--
-- Name: _home_page_v_latest_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _home_page_v_latest_idx ON public._home_page_v USING btree (latest);


--
-- Name: _home_page_v_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _home_page_v_parent_idx ON public._home_page_v USING btree (parent_id);


--
-- Name: _legal_pages_v_latest_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _legal_pages_v_latest_idx ON public._legal_pages_v USING btree (latest);


--
-- Name: _legal_pages_v_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _legal_pages_v_parent_idx ON public._legal_pages_v USING btree (parent_id);


--
-- Name: _stories_v_autosave_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _stories_v_autosave_idx ON public._stories_v USING btree (autosave);


--
-- Name: _stories_v_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _stories_v_created_at_idx ON public._stories_v USING btree (created_at);


--
-- Name: _stories_v_latest_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _stories_v_latest_idx ON public._stories_v USING btree (latest);


--
-- Name: _stories_v_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _stories_v_parent_idx ON public._stories_v USING btree (parent_id);


--
-- Name: _stories_v_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _stories_v_updated_at_idx ON public._stories_v USING btree (updated_at);


--
-- Name: _stories_v_version_meta_version_meta_image_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _stories_v_version_meta_version_meta_image_idx ON public._stories_v USING btree (version_meta_image_id);


--
-- Name: _stories_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _stories_v_version_version__status_idx ON public._stories_v USING btree (version__status);


--
-- Name: _stories_v_version_version_author_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _stories_v_version_version_author_idx ON public._stories_v USING btree (version_author_id);


--
-- Name: _stories_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _stories_v_version_version_created_at_idx ON public._stories_v USING btree (version_created_at);


--
-- Name: _stories_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _stories_v_version_version_slug_idx ON public._stories_v USING btree (version_slug);


--
-- Name: _stories_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _stories_v_version_version_updated_at_idx ON public._stories_v USING btree (version_updated_at);


--
-- Name: _testimonials_v_autosave_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _testimonials_v_autosave_idx ON public._testimonials_v USING btree (autosave);


--
-- Name: _testimonials_v_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _testimonials_v_created_at_idx ON public._testimonials_v USING btree (created_at);


--
-- Name: _testimonials_v_latest_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _testimonials_v_latest_idx ON public._testimonials_v USING btree (latest);


--
-- Name: _testimonials_v_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _testimonials_v_parent_idx ON public._testimonials_v USING btree (parent_id);


--
-- Name: _testimonials_v_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _testimonials_v_updated_at_idx ON public._testimonials_v USING btree (updated_at);


--
-- Name: _testimonials_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _testimonials_v_version_version__status_idx ON public._testimonials_v USING btree (version__status);


--
-- Name: _testimonials_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _testimonials_v_version_version_created_at_idx ON public._testimonials_v USING btree (version_created_at);


--
-- Name: _testimonials_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _testimonials_v_version_version_updated_at_idx ON public._testimonials_v USING btree (version_updated_at);


--
-- Name: _tours_v_autosave_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_autosave_idx ON public._tours_v USING btree (autosave);


--
-- Name: _tours_v_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_created_at_idx ON public._tours_v USING btree (created_at);


--
-- Name: _tours_v_latest_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_latest_idx ON public._tours_v USING btree (latest);


--
-- Name: _tours_v_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_parent_idx ON public._tours_v USING btree (parent_id);


--
-- Name: _tours_v_rels_dietary_options_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_rels_dietary_options_id_idx ON public._tours_v_rels USING btree (dietary_options_id);


--
-- Name: _tours_v_rels_food_items_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_rels_food_items_id_idx ON public._tours_v_rels USING btree (food_items_id);


--
-- Name: _tours_v_rels_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_rels_order_idx ON public._tours_v_rels USING btree ("order");


--
-- Name: _tours_v_rels_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_rels_parent_idx ON public._tours_v_rels USING btree (parent_id);


--
-- Name: _tours_v_rels_path_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_rels_path_idx ON public._tours_v_rels USING btree (path);


--
-- Name: _tours_v_rels_specialty_landing_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_rels_specialty_landing_pages_id_idx ON public._tours_v_rels USING btree (specialty_landing_pages_id);


--
-- Name: _tours_v_rels_travel_type_landing_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_rels_travel_type_landing_pages_id_idx ON public._tours_v_rels USING btree (travel_type_landing_pages_id);


--
-- Name: _tours_v_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_updated_at_idx ON public._tours_v USING btree (updated_at);


--
-- Name: _tours_v_version_gallery_images_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_version_gallery_images_order_idx ON public._tours_v_version_gallery_images USING btree (_order);


--
-- Name: _tours_v_version_gallery_images_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_version_gallery_images_parent_id_idx ON public._tours_v_version_gallery_images USING btree (_parent_id);


--
-- Name: _tours_v_version_highlights_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_version_highlights_order_idx ON public._tours_v_version_highlights USING btree (_order);


--
-- Name: _tours_v_version_highlights_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_version_highlights_parent_id_idx ON public._tours_v_version_highlights USING btree (_parent_id);


--
-- Name: _tours_v_version_meta_version_meta_image_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_version_meta_version_meta_image_idx ON public._tours_v USING btree (version_meta_image_id);


--
-- Name: _tours_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_version_version__status_idx ON public._tours_v USING btree (version__status);


--
-- Name: _tours_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_version_version_created_at_idx ON public._tours_v USING btree (version_created_at);


--
-- Name: _tours_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_version_version_slug_idx ON public._tours_v USING btree (version_slug);


--
-- Name: _tours_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_version_version_updated_at_idx ON public._tours_v USING btree (version_updated_at);


--
-- Name: _tours_v_version_whats_excluded_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_version_whats_excluded_order_idx ON public._tours_v_version_whats_excluded USING btree (_order);


--
-- Name: _tours_v_version_whats_excluded_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_version_whats_excluded_parent_id_idx ON public._tours_v_version_whats_excluded USING btree (_parent_id);


--
-- Name: _tours_v_version_whats_included_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_version_whats_included_order_idx ON public._tours_v_version_whats_included USING btree (_order);


--
-- Name: _tours_v_version_whats_included_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _tours_v_version_whats_included_parent_id_idx ON public._tours_v_version_whats_included USING btree (_parent_id);


--
-- Name: _vendors_v_autosave_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_autosave_idx ON public._vendors_v USING btree (autosave);


--
-- Name: _vendors_v_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_created_at_idx ON public._vendors_v USING btree (created_at);


--
-- Name: _vendors_v_latest_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_latest_idx ON public._vendors_v USING btree (latest);


--
-- Name: _vendors_v_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_parent_idx ON public._vendors_v USING btree (parent_id);


--
-- Name: _vendors_v_rels_dietary_options_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_rels_dietary_options_id_idx ON public._vendors_v_rels USING btree (dietary_options_id);


--
-- Name: _vendors_v_rels_food_items_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_rels_food_items_id_idx ON public._vendors_v_rels USING btree (food_items_id);


--
-- Name: _vendors_v_rels_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_rels_order_idx ON public._vendors_v_rels USING btree ("order");


--
-- Name: _vendors_v_rels_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_rels_parent_idx ON public._vendors_v_rels USING btree (parent_id);


--
-- Name: _vendors_v_rels_path_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_rels_path_idx ON public._vendors_v_rels USING btree (path);


--
-- Name: _vendors_v_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_updated_at_idx ON public._vendors_v USING btree (updated_at);


--
-- Name: _vendors_v_version_awards_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_version_awards_order_idx ON public._vendors_v_version_awards USING btree (_order);


--
-- Name: _vendors_v_version_awards_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_version_awards_parent_id_idx ON public._vendors_v_version_awards USING btree (_parent_id);


--
-- Name: _vendors_v_version_closed_on_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_version_closed_on_order_idx ON public._vendors_v_version_closed_on USING btree (_order);


--
-- Name: _vendors_v_version_closed_on_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_version_closed_on_parent_id_idx ON public._vendors_v_version_closed_on USING btree (_parent_id);


--
-- Name: _vendors_v_version_facilities_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_version_facilities_order_idx ON public._vendors_v_version_facilities USING btree (_order);


--
-- Name: _vendors_v_version_facilities_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_version_facilities_parent_id_idx ON public._vendors_v_version_facilities USING btree (_parent_id);


--
-- Name: _vendors_v_version_images_gallery_image_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_version_images_gallery_image_idx ON public._vendors_v_version_images_gallery USING btree (image_id);


--
-- Name: _vendors_v_version_images_gallery_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_version_images_gallery_order_idx ON public._vendors_v_version_images_gallery USING btree (_order);


--
-- Name: _vendors_v_version_images_gallery_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_version_images_gallery_parent_id_idx ON public._vendors_v_version_images_gallery USING btree (_parent_id);


--
-- Name: _vendors_v_version_images_version_images_main_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_version_images_version_images_main_idx ON public._vendors_v USING btree (version_images_main_id);


--
-- Name: _vendors_v_version_operating_hours_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_version_operating_hours_order_idx ON public._vendors_v_version_operating_hours USING btree (_order);


--
-- Name: _vendors_v_version_operating_hours_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_version_operating_hours_parent_id_idx ON public._vendors_v_version_operating_hours USING btree (_parent_id);


--
-- Name: _vendors_v_version_payment_methods_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_version_payment_methods_order_idx ON public._vendors_v_version_payment_methods USING btree (_order);


--
-- Name: _vendors_v_version_payment_methods_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_version_payment_methods_parent_id_idx ON public._vendors_v_version_payment_methods USING btree (_parent_id);


--
-- Name: _vendors_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_version_version__status_idx ON public._vendors_v USING btree (version__status);


--
-- Name: _vendors_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_version_version_created_at_idx ON public._vendors_v USING btree (version_created_at);


--
-- Name: _vendors_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_version_version_slug_idx ON public._vendors_v USING btree (version_slug);


--
-- Name: _vendors_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _vendors_v_version_version_updated_at_idx ON public._vendors_v USING btree (version_updated_at);


--
-- Name: about_page_breadcrumbs_doc_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX about_page_breadcrumbs_doc_idx ON public.about_page_breadcrumbs USING btree (doc_id);


--
-- Name: about_page_breadcrumbs_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX about_page_breadcrumbs_order_idx ON public.about_page_breadcrumbs USING btree (_order);


--
-- Name: about_page_breadcrumbs_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX about_page_breadcrumbs_parent_id_idx ON public.about_page_breadcrumbs USING btree (_parent_id);


--
-- Name: about_page_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX about_page_created_at_idx ON public.about_page USING btree (created_at);


--
-- Name: about_page_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX about_page_parent_idx ON public.about_page USING btree (parent_id);


--
-- Name: about_page_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX about_page_updated_at_idx ON public.about_page USING btree (updated_at);


--
-- Name: contact_page_breadcrumbs_doc_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX contact_page_breadcrumbs_doc_idx ON public.contact_page_breadcrumbs USING btree (doc_id);


--
-- Name: contact_page_breadcrumbs_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX contact_page_breadcrumbs_order_idx ON public.contact_page_breadcrumbs USING btree (_order);


--
-- Name: contact_page_breadcrumbs_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX contact_page_breadcrumbs_parent_id_idx ON public.contact_page_breadcrumbs USING btree (_parent_id);


--
-- Name: contact_page_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX contact_page_created_at_idx ON public.contact_page USING btree (created_at);


--
-- Name: contact_page_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX contact_page_parent_idx ON public.contact_page USING btree (parent_id);


--
-- Name: contact_page_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX contact_page_updated_at_idx ON public.contact_page USING btree (updated_at);


--
-- Name: dietary_landing_pages_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX dietary_landing_pages_created_at_idx ON public.dietary_landing_pages USING btree (created_at);


--
-- Name: dietary_landing_pages_meta_meta_image_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX dietary_landing_pages_meta_meta_image_idx ON public.dietary_landing_pages USING btree (meta_image_id);


--
-- Name: dietary_landing_pages_slug_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE UNIQUE INDEX dietary_landing_pages_slug_idx ON public.dietary_landing_pages USING btree (slug);


--
-- Name: dietary_landing_pages_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX dietary_landing_pages_updated_at_idx ON public.dietary_landing_pages USING btree (updated_at);


--
-- Name: dietary_options__status_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX dietary_options__status_idx ON public.dietary_options USING btree (_status);


--
-- Name: dietary_options_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX dietary_options_created_at_idx ON public.dietary_options USING btree (created_at);


--
-- Name: dietary_options_slug_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE UNIQUE INDEX dietary_options_slug_idx ON public.dietary_options USING btree (slug);


--
-- Name: dietary_options_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX dietary_options_updated_at_idx ON public.dietary_options USING btree (updated_at);


--
-- Name: faqs__status_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX faqs__status_idx ON public.faqs USING btree (_status);


--
-- Name: faqs_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX faqs_created_at_idx ON public.faqs USING btree (created_at);


--
-- Name: faqs_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX faqs_updated_at_idx ON public.faqs USING btree (updated_at);


--
-- Name: food_items__status_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX food_items__status_idx ON public.food_items USING btree (_status);


--
-- Name: food_items_allergens_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX food_items_allergens_order_idx ON public.food_items_allergens USING btree (_order);


--
-- Name: food_items_allergens_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX food_items_allergens_parent_id_idx ON public.food_items_allergens USING btree (_parent_id);


--
-- Name: food_items_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX food_items_created_at_idx ON public.food_items USING btree (created_at);


--
-- Name: food_items_flavor_profile_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX food_items_flavor_profile_order_idx ON public.food_items_flavor_profile USING btree (_order);


--
-- Name: food_items_flavor_profile_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX food_items_flavor_profile_parent_id_idx ON public.food_items_flavor_profile USING btree (_parent_id);


--
-- Name: food_items_image_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX food_items_image_idx ON public.food_items USING btree (image_id);


--
-- Name: food_items_ingredients_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX food_items_ingredients_order_idx ON public.food_items_ingredients USING btree (_order);


--
-- Name: food_items_ingredients_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX food_items_ingredients_parent_id_idx ON public.food_items_ingredients USING btree (_parent_id);


--
-- Name: food_items_local_names_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX food_items_local_names_order_idx ON public.food_items_local_names USING btree (_order);


--
-- Name: food_items_local_names_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX food_items_local_names_parent_id_idx ON public.food_items_local_names USING btree (_parent_id);


--
-- Name: food_items_rels_dietary_options_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX food_items_rels_dietary_options_id_idx ON public.food_items_rels USING btree (dietary_options_id);


--
-- Name: food_items_rels_media_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX food_items_rels_media_id_idx ON public.food_items_rels USING btree (media_id);


--
-- Name: food_items_rels_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX food_items_rels_order_idx ON public.food_items_rels USING btree ("order");


--
-- Name: food_items_rels_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX food_items_rels_parent_idx ON public.food_items_rels USING btree (parent_id);


--
-- Name: food_items_rels_path_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX food_items_rels_path_idx ON public.food_items_rels USING btree (path);


--
-- Name: food_items_slug_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE UNIQUE INDEX food_items_slug_idx ON public.food_items USING btree (slug);


--
-- Name: food_items_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX food_items_updated_at_idx ON public.food_items USING btree (updated_at);


--
-- Name: location_landing_pages_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX location_landing_pages_created_at_idx ON public.location_landing_pages USING btree (created_at);


--
-- Name: location_landing_pages_meta_meta_image_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX location_landing_pages_meta_meta_image_idx ON public.location_landing_pages USING btree (meta_image_id);


--
-- Name: location_landing_pages_slug_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE UNIQUE INDEX location_landing_pages_slug_idx ON public.location_landing_pages USING btree (slug);


--
-- Name: location_landing_pages_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX location_landing_pages_updated_at_idx ON public.location_landing_pages USING btree (updated_at);


--
-- Name: media_coverage_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX media_coverage_created_at_idx ON public.media_coverage USING btree (created_at);


--
-- Name: media_coverage_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX media_coverage_updated_at_idx ON public.media_coverage USING btree (updated_at);


--
-- Name: media_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX media_created_at_idx ON public.media USING btree (created_at);


--
-- Name: media_filename_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE UNIQUE INDEX media_filename_idx ON public.media USING btree (filename);


--
-- Name: media_sizes_large_sizes_large_filename_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX media_sizes_large_sizes_large_filename_idx ON public.media USING btree (sizes_large_filename);


--
-- Name: media_sizes_medium_sizes_medium_filename_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX media_sizes_medium_sizes_medium_filename_idx ON public.media USING btree (sizes_medium_filename);


--
-- Name: media_sizes_thumbnail_sizes_thumbnail_filename_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX media_sizes_thumbnail_sizes_thumbnail_filename_idx ON public.media USING btree (sizes_thumbnail_filename);


--
-- Name: media_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX media_updated_at_idx ON public.media USING btree (updated_at);


--
-- Name: payload_kv_key_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE UNIQUE INDEX payload_kv_key_idx ON public.payload_kv USING btree (key);


--
-- Name: payload_locked_docs_home_page_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_docs_home_page_id_idx ON public.payload_locked_documents_rels USING btree (home_page_id);


--
-- Name: payload_locked_docs_legal_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_docs_legal_pages_id_idx ON public.payload_locked_documents_rels USING btree (legal_pages_id);


--
-- Name: payload_locked_docs_locations_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_docs_locations_id_idx ON public.payload_locked_documents_rels USING btree (locations_id);


--
-- Name: payload_locked_docs_menus_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_docs_menus_id_idx ON public.payload_locked_documents_rels USING btree (menus_id);


--
-- Name: payload_locked_docs_specialty_experiences_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_docs_specialty_experiences_id_idx ON public.payload_locked_documents_rels USING btree (specialty_experiences_id);


--
-- Name: payload_locked_docs_travel_types_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_docs_travel_types_id_idx ON public.payload_locked_documents_rels USING btree (travel_types_id);


--
-- Name: payload_locked_documents_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_created_at_idx ON public.payload_locked_documents USING btree (created_at);


--
-- Name: payload_locked_documents_global_slug_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_global_slug_idx ON public.payload_locked_documents USING btree (global_slug);


--
-- Name: payload_locked_documents_rels_about_page_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_about_page_id_idx ON public.payload_locked_documents_rels USING btree (about_page_id);


--
-- Name: payload_locked_documents_rels_contact_page_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_contact_page_id_idx ON public.payload_locked_documents_rels USING btree (contact_page_id);


--
-- Name: payload_locked_documents_rels_dietary_landing_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_dietary_landing_pages_id_idx ON public.payload_locked_documents_rels USING btree (dietary_landing_pages_id);


--
-- Name: payload_locked_documents_rels_dietary_options_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_dietary_options_id_idx ON public.payload_locked_documents_rels USING btree (dietary_options_id);


--
-- Name: payload_locked_documents_rels_faqs_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_faqs_id_idx ON public.payload_locked_documents_rels USING btree (faqs_id);


--
-- Name: payload_locked_documents_rels_food_items_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_food_items_id_idx ON public.payload_locked_documents_rels USING btree (food_items_id);


--
-- Name: payload_locked_documents_rels_location_landing_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_location_landing_pages_id_idx ON public.payload_locked_documents_rels USING btree (location_landing_pages_id);


--
-- Name: payload_locked_documents_rels_media_coverage_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_media_coverage_id_idx ON public.payload_locked_documents_rels USING btree (media_coverage_id);


--
-- Name: payload_locked_documents_rels_media_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_media_id_idx ON public.payload_locked_documents_rels USING btree (media_id);


--
-- Name: payload_locked_documents_rels_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_order_idx ON public.payload_locked_documents_rels USING btree ("order");


--
-- Name: payload_locked_documents_rels_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_parent_idx ON public.payload_locked_documents_rels USING btree (parent_id);


--
-- Name: payload_locked_documents_rels_path_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_path_idx ON public.payload_locked_documents_rels USING btree (path);


--
-- Name: payload_locked_documents_rels_redirects_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_redirects_id_idx ON public.payload_locked_documents_rels USING btree (redirects_id);


--
-- Name: payload_locked_documents_rels_search_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_search_id_idx ON public.payload_locked_documents_rels USING btree (search_id);


--
-- Name: payload_locked_documents_rels_site_settings_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_site_settings_id_idx ON public.payload_locked_documents_rels USING btree (site_settings_id);


--
-- Name: payload_locked_documents_rels_specialty_landing_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_specialty_landing_pages_id_idx ON public.payload_locked_documents_rels USING btree (specialty_landing_pages_id);


--
-- Name: payload_locked_documents_rels_stories_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_stories_id_idx ON public.payload_locked_documents_rels USING btree (stories_id);


--
-- Name: payload_locked_documents_rels_testimonials_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_testimonials_id_idx ON public.payload_locked_documents_rels USING btree (testimonials_id);


--
-- Name: payload_locked_documents_rels_thank_you_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_thank_you_pages_id_idx ON public.payload_locked_documents_rels USING btree (thank_you_pages_id);


--
-- Name: payload_locked_documents_rels_tours_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_tours_id_idx ON public.payload_locked_documents_rels USING btree (tours_id);


--
-- Name: payload_locked_documents_rels_translations_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_translations_id_idx ON public.payload_locked_documents_rels USING btree (translations_id);


--
-- Name: payload_locked_documents_rels_travel_type_landing_pages__idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_travel_type_landing_pages__idx ON public.payload_locked_documents_rels USING btree (travel_type_landing_pages_id);


--
-- Name: payload_locked_documents_rels_users_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_users_id_idx ON public.payload_locked_documents_rels USING btree (users_id);


--
-- Name: payload_locked_documents_rels_vendors_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_rels_vendors_id_idx ON public.payload_locked_documents_rels USING btree (vendors_id);


--
-- Name: payload_locked_documents_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_locked_documents_updated_at_idx ON public.payload_locked_documents USING btree (updated_at);


--
-- Name: payload_migrations_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_migrations_created_at_idx ON public.payload_migrations USING btree (created_at);


--
-- Name: payload_migrations_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_migrations_updated_at_idx ON public.payload_migrations USING btree (updated_at);


--
-- Name: payload_preferences_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_preferences_created_at_idx ON public.payload_preferences USING btree (created_at);


--
-- Name: payload_preferences_key_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_preferences_key_idx ON public.payload_preferences USING btree (key);


--
-- Name: payload_preferences_rels_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_preferences_rels_order_idx ON public.payload_preferences_rels USING btree ("order");


--
-- Name: payload_preferences_rels_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_preferences_rels_parent_idx ON public.payload_preferences_rels USING btree (parent_id);


--
-- Name: payload_preferences_rels_path_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_preferences_rels_path_idx ON public.payload_preferences_rels USING btree (path);


--
-- Name: payload_preferences_rels_users_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_preferences_rels_users_id_idx ON public.payload_preferences_rels USING btree (users_id);


--
-- Name: payload_preferences_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX payload_preferences_updated_at_idx ON public.payload_preferences USING btree (updated_at);


--
-- Name: redirects_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX redirects_created_at_idx ON public.redirects USING btree (created_at);


--
-- Name: redirects_from_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE UNIQUE INDEX redirects_from_idx ON public.redirects USING btree ("from");


--
-- Name: redirects_rels_dietary_landing_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX redirects_rels_dietary_landing_pages_id_idx ON public.redirects_rels USING btree (dietary_landing_pages_id);


--
-- Name: redirects_rels_location_landing_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX redirects_rels_location_landing_pages_id_idx ON public.redirects_rels USING btree (location_landing_pages_id);


--
-- Name: redirects_rels_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX redirects_rels_order_idx ON public.redirects_rels USING btree ("order");


--
-- Name: redirects_rels_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX redirects_rels_parent_idx ON public.redirects_rels USING btree (parent_id);


--
-- Name: redirects_rels_path_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX redirects_rels_path_idx ON public.redirects_rels USING btree (path);


--
-- Name: redirects_rels_specialty_landing_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX redirects_rels_specialty_landing_pages_id_idx ON public.redirects_rels USING btree (specialty_landing_pages_id);


--
-- Name: redirects_rels_stories_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX redirects_rels_stories_id_idx ON public.redirects_rels USING btree (stories_id);


--
-- Name: redirects_rels_tours_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX redirects_rels_tours_id_idx ON public.redirects_rels USING btree (tours_id);


--
-- Name: redirects_rels_travel_type_landing_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX redirects_rels_travel_type_landing_pages_id_idx ON public.redirects_rels USING btree (travel_type_landing_pages_id);


--
-- Name: redirects_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX redirects_updated_at_idx ON public.redirects USING btree (updated_at);


--
-- Name: search_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX search_created_at_idx ON public.search USING btree (created_at);


--
-- Name: search_rels_faqs_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX search_rels_faqs_id_idx ON public.search_rels USING btree (faqs_id);


--
-- Name: search_rels_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX search_rels_order_idx ON public.search_rels USING btree ("order");


--
-- Name: search_rels_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX search_rels_parent_idx ON public.search_rels USING btree (parent_id);


--
-- Name: search_rels_path_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX search_rels_path_idx ON public.search_rels USING btree (path);


--
-- Name: search_rels_stories_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX search_rels_stories_id_idx ON public.search_rels USING btree (stories_id);


--
-- Name: search_rels_testimonials_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX search_rels_testimonials_id_idx ON public.search_rels USING btree (testimonials_id);


--
-- Name: search_rels_tours_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX search_rels_tours_id_idx ON public.search_rels USING btree (tours_id);


--
-- Name: search_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX search_updated_at_idx ON public.search USING btree (updated_at);


--
-- Name: site_settings_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX site_settings_created_at_idx ON public.site_settings USING btree (created_at);


--
-- Name: site_settings_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX site_settings_updated_at_idx ON public.site_settings USING btree (updated_at);


--
-- Name: specialty_landing_pages_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX specialty_landing_pages_created_at_idx ON public.specialty_landing_pages USING btree (created_at);


--
-- Name: specialty_landing_pages_meta_meta_image_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX specialty_landing_pages_meta_meta_image_idx ON public.specialty_landing_pages USING btree (meta_image_id);


--
-- Name: specialty_landing_pages_slug_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE UNIQUE INDEX specialty_landing_pages_slug_idx ON public.specialty_landing_pages USING btree (slug);


--
-- Name: specialty_landing_pages_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX specialty_landing_pages_updated_at_idx ON public.specialty_landing_pages USING btree (updated_at);


--
-- Name: stories__status_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX stories__status_idx ON public.stories USING btree (_status);


--
-- Name: stories_author_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX stories_author_idx ON public.stories USING btree (author_id);


--
-- Name: stories_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX stories_created_at_idx ON public.stories USING btree (created_at);


--
-- Name: stories_meta_meta_image_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX stories_meta_meta_image_idx ON public.stories USING btree (meta_image_id);


--
-- Name: stories_slug_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE UNIQUE INDEX stories_slug_idx ON public.stories USING btree (slug);


--
-- Name: stories_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX stories_updated_at_idx ON public.stories USING btree (updated_at);


--
-- Name: testimonials__status_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX testimonials__status_idx ON public.testimonials USING btree (_status);


--
-- Name: testimonials_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX testimonials_created_at_idx ON public.testimonials USING btree (created_at);


--
-- Name: testimonials_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX testimonials_updated_at_idx ON public.testimonials USING btree (updated_at);


--
-- Name: thank_you_pages_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX thank_you_pages_created_at_idx ON public.thank_you_pages USING btree (created_at);


--
-- Name: thank_you_pages_cta_section_cta_buttons_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX thank_you_pages_cta_section_cta_buttons_order_idx ON public.thank_you_pages_cta_section_cta_buttons USING btree (_order);


--
-- Name: thank_you_pages_cta_section_cta_buttons_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX thank_you_pages_cta_section_cta_buttons_parent_id_idx ON public.thank_you_pages_cta_section_cta_buttons USING btree (_parent_id);


--
-- Name: thank_you_pages_next_steps_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX thank_you_pages_next_steps_order_idx ON public.thank_you_pages_next_steps USING btree (_order);


--
-- Name: thank_you_pages_next_steps_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX thank_you_pages_next_steps_parent_id_idx ON public.thank_you_pages_next_steps USING btree (_parent_id);


--
-- Name: thank_you_pages_slug_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE UNIQUE INDEX thank_you_pages_slug_idx ON public.thank_you_pages USING btree (slug);


--
-- Name: thank_you_pages_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX thank_you_pages_updated_at_idx ON public.thank_you_pages USING btree (updated_at);


--
-- Name: tours__status_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX tours__status_idx ON public.tours USING btree (_status);


--
-- Name: tours_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX tours_created_at_idx ON public.tours USING btree (created_at);


--
-- Name: tours_gallery_images_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX tours_gallery_images_order_idx ON public.tours_gallery_images USING btree (_order);


--
-- Name: tours_gallery_images_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX tours_gallery_images_parent_id_idx ON public.tours_gallery_images USING btree (_parent_id);


--
-- Name: tours_highlights_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX tours_highlights_order_idx ON public.tours_highlights USING btree (_order);


--
-- Name: tours_highlights_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX tours_highlights_parent_id_idx ON public.tours_highlights USING btree (_parent_id);


--
-- Name: tours_meta_meta_image_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX tours_meta_meta_image_idx ON public.tours USING btree (meta_image_id);


--
-- Name: tours_rels_dietary_options_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX tours_rels_dietary_options_id_idx ON public.tours_rels USING btree (dietary_options_id);


--
-- Name: tours_rels_food_items_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX tours_rels_food_items_id_idx ON public.tours_rels USING btree (food_items_id);


--
-- Name: tours_rels_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX tours_rels_order_idx ON public.tours_rels USING btree ("order");


--
-- Name: tours_rels_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX tours_rels_parent_idx ON public.tours_rels USING btree (parent_id);


--
-- Name: tours_rels_path_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX tours_rels_path_idx ON public.tours_rels USING btree (path);


--
-- Name: tours_rels_specialty_landing_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX tours_rels_specialty_landing_pages_id_idx ON public.tours_rels USING btree (specialty_landing_pages_id);


--
-- Name: tours_rels_travel_type_landing_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX tours_rels_travel_type_landing_pages_id_idx ON public.tours_rels USING btree (travel_type_landing_pages_id);


--
-- Name: tours_slug_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE UNIQUE INDEX tours_slug_idx ON public.tours USING btree (slug);


--
-- Name: tours_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX tours_updated_at_idx ON public.tours USING btree (updated_at);


--
-- Name: tours_whats_excluded_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX tours_whats_excluded_order_idx ON public.tours_whats_excluded USING btree (_order);


--
-- Name: tours_whats_excluded_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX tours_whats_excluded_parent_id_idx ON public.tours_whats_excluded USING btree (_parent_id);


--
-- Name: tours_whats_included_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX tours_whats_included_order_idx ON public.tours_whats_included USING btree (_order);


--
-- Name: tours_whats_included_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX tours_whats_included_parent_id_idx ON public.tours_whats_included USING btree (_parent_id);


--
-- Name: translations_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_created_at_idx ON public.translations USING btree (created_at);


--
-- Name: translations_rels_dietary_landing_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_dietary_landing_pages_id_idx ON public.translations_rels USING btree (dietary_landing_pages_id);


--
-- Name: translations_rels_faqs_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_faqs_id_idx ON public.translations_rels USING btree (faqs_id);


--
-- Name: translations_rels_home_page_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_home_page_id_idx ON public.translations_rels USING btree (home_page_id);


--
-- Name: translations_rels_legal_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_legal_pages_id_idx ON public.translations_rels USING btree (legal_pages_id);


--
-- Name: translations_rels_location_landing_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_location_landing_pages_id_idx ON public.translations_rels USING btree (location_landing_pages_id);


--
-- Name: translations_rels_media_coverage_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_media_coverage_id_idx ON public.translations_rels USING btree (media_coverage_id);


--
-- Name: translations_rels_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_order_idx ON public.translations_rels USING btree ("order");


--
-- Name: translations_rels_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_parent_idx ON public.translations_rels USING btree (parent_id);


--
-- Name: translations_rels_path_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_path_idx ON public.translations_rels USING btree (path);


--
-- Name: translations_rels_specialty_landing_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_specialty_landing_pages_id_idx ON public.translations_rels USING btree (specialty_landing_pages_id);


--
-- Name: translations_rels_stories_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_stories_id_idx ON public.translations_rels USING btree (stories_id);


--
-- Name: translations_rels_testimonials_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_testimonials_id_idx ON public.translations_rels USING btree (testimonials_id);


--
-- Name: translations_rels_tours_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_tours_id_idx ON public.translations_rels USING btree (tours_id);


--
-- Name: translations_rels_travel_type_landing_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_travel_type_landing_pages_id_idx ON public.translations_rels USING btree (travel_type_landing_pages_id);


--
-- Name: translations_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_updated_at_idx ON public.translations USING btree (updated_at);


--
-- Name: travel_type_landing_pages_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX travel_type_landing_pages_created_at_idx ON public.travel_type_landing_pages USING btree (created_at);


--
-- Name: travel_type_landing_pages_meta_meta_image_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX travel_type_landing_pages_meta_meta_image_idx ON public.travel_type_landing_pages USING btree (meta_image_id);


--
-- Name: travel_type_landing_pages_slug_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE UNIQUE INDEX travel_type_landing_pages_slug_idx ON public.travel_type_landing_pages USING btree (slug);


--
-- Name: travel_type_landing_pages_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX travel_type_landing_pages_updated_at_idx ON public.travel_type_landing_pages USING btree (updated_at);


--
-- Name: users_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX users_created_at_idx ON public.users USING btree (created_at);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_sessions_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX users_sessions_order_idx ON public.users_sessions USING btree (_order);


--
-- Name: users_sessions_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX users_sessions_parent_id_idx ON public.users_sessions USING btree (_parent_id);


--
-- Name: users_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX users_updated_at_idx ON public.users USING btree (updated_at);


--
-- Name: vendors__status_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors__status_idx ON public.vendors USING btree (_status);


--
-- Name: vendors_awards_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_awards_order_idx ON public.vendors_awards USING btree (_order);


--
-- Name: vendors_awards_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_awards_parent_id_idx ON public.vendors_awards USING btree (_parent_id);


--
-- Name: vendors_closed_on_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_closed_on_order_idx ON public.vendors_closed_on USING btree (_order);


--
-- Name: vendors_closed_on_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_closed_on_parent_id_idx ON public.vendors_closed_on USING btree (_parent_id);


--
-- Name: vendors_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_created_at_idx ON public.vendors USING btree (created_at);


--
-- Name: vendors_facilities_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_facilities_order_idx ON public.vendors_facilities USING btree (_order);


--
-- Name: vendors_facilities_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_facilities_parent_id_idx ON public.vendors_facilities USING btree (_parent_id);


--
-- Name: vendors_images_gallery_image_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_images_gallery_image_idx ON public.vendors_images_gallery USING btree (image_id);


--
-- Name: vendors_images_gallery_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_images_gallery_order_idx ON public.vendors_images_gallery USING btree (_order);


--
-- Name: vendors_images_gallery_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_images_gallery_parent_id_idx ON public.vendors_images_gallery USING btree (_parent_id);


--
-- Name: vendors_images_images_main_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_images_images_main_idx ON public.vendors USING btree (images_main_id);


--
-- Name: vendors_operating_hours_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_operating_hours_order_idx ON public.vendors_operating_hours USING btree (_order);


--
-- Name: vendors_operating_hours_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_operating_hours_parent_id_idx ON public.vendors_operating_hours USING btree (_parent_id);


--
-- Name: vendors_payment_methods_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_payment_methods_order_idx ON public.vendors_payment_methods USING btree (_order);


--
-- Name: vendors_payment_methods_parent_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_payment_methods_parent_id_idx ON public.vendors_payment_methods USING btree (_parent_id);


--
-- Name: vendors_rels_dietary_options_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_rels_dietary_options_id_idx ON public.vendors_rels USING btree (dietary_options_id);


--
-- Name: vendors_rels_food_items_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_rels_food_items_id_idx ON public.vendors_rels USING btree (food_items_id);


--
-- Name: vendors_rels_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_rels_order_idx ON public.vendors_rels USING btree ("order");


--
-- Name: vendors_rels_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_rels_parent_idx ON public.vendors_rels USING btree (parent_id);


--
-- Name: vendors_rels_path_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_rels_path_idx ON public.vendors_rels USING btree (path);


--
-- Name: vendors_slug_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE UNIQUE INDEX vendors_slug_idx ON public.vendors USING btree (slug);


--
-- Name: vendors_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX vendors_updated_at_idx ON public.vendors USING btree (updated_at);


--
-- Name: _dietary_options_v _dietary_options_v_parent_id_dietary_options_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._dietary_options_v
    ADD CONSTRAINT _dietary_options_v_parent_id_dietary_options_id_fk FOREIGN KEY (parent_id) REFERENCES public.dietary_options(id) ON DELETE SET NULL;


--
-- Name: _faqs_v _faqs_v_parent_id_faqs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._faqs_v
    ADD CONSTRAINT _faqs_v_parent_id_faqs_id_fk FOREIGN KEY (parent_id) REFERENCES public.faqs(id) ON DELETE SET NULL;


--
-- Name: _food_items_v _food_items_v_parent_id_food_items_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v
    ADD CONSTRAINT _food_items_v_parent_id_food_items_id_fk FOREIGN KEY (parent_id) REFERENCES public.food_items(id) ON DELETE SET NULL;


--
-- Name: _food_items_v_rels _food_items_v_rels_dietary_options_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v_rels
    ADD CONSTRAINT _food_items_v_rels_dietary_options_fk FOREIGN KEY (dietary_options_id) REFERENCES public.dietary_options(id) ON DELETE CASCADE;


--
-- Name: _food_items_v_rels _food_items_v_rels_media_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v_rels
    ADD CONSTRAINT _food_items_v_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: _food_items_v_rels _food_items_v_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v_rels
    ADD CONSTRAINT _food_items_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._food_items_v(id) ON DELETE CASCADE;


--
-- Name: _food_items_v_version_allergens _food_items_v_version_allergens_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v_version_allergens
    ADD CONSTRAINT _food_items_v_version_allergens_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._food_items_v(id) ON DELETE CASCADE;


--
-- Name: _food_items_v_version_flavor_profile _food_items_v_version_flavor_profile_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v_version_flavor_profile
    ADD CONSTRAINT _food_items_v_version_flavor_profile_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._food_items_v(id) ON DELETE CASCADE;


--
-- Name: _food_items_v _food_items_v_version_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v
    ADD CONSTRAINT _food_items_v_version_image_id_media_id_fk FOREIGN KEY (version_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _food_items_v_version_ingredients _food_items_v_version_ingredients_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v_version_ingredients
    ADD CONSTRAINT _food_items_v_version_ingredients_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._food_items_v(id) ON DELETE CASCADE;


--
-- Name: _food_items_v_version_local_names _food_items_v_version_local_names_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._food_items_v_version_local_names
    ADD CONSTRAINT _food_items_v_version_local_names_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._food_items_v(id) ON DELETE CASCADE;


--
-- Name: _home_page_v _home_page_v_parent_fkey; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._home_page_v
    ADD CONSTRAINT _home_page_v_parent_fkey FOREIGN KEY (parent_id) REFERENCES public.home_page(id) ON DELETE CASCADE;


--
-- Name: _legal_pages_v _legal_pages_v_parent_fkey; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._legal_pages_v
    ADD CONSTRAINT _legal_pages_v_parent_fkey FOREIGN KEY (parent_id) REFERENCES public.legal_pages(id) ON DELETE CASCADE;


--
-- Name: menus_items _menus_items_v__parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.menus_items
    ADD CONSTRAINT _menus_items_v__parent_id_fkey FOREIGN KEY (_parent_id) REFERENCES public.menus(id) ON DELETE CASCADE;


--
-- Name: _stories_v _stories_v_parent_id_stories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._stories_v
    ADD CONSTRAINT _stories_v_parent_id_stories_id_fk FOREIGN KEY (parent_id) REFERENCES public.stories(id) ON DELETE SET NULL;


--
-- Name: _stories_v _stories_v_version_author_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._stories_v
    ADD CONSTRAINT _stories_v_version_author_id_users_id_fk FOREIGN KEY (version_author_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: _stories_v _stories_v_version_meta_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._stories_v
    ADD CONSTRAINT _stories_v_version_meta_image_id_media_id_fk FOREIGN KEY (version_meta_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _testimonials_v _testimonials_v_parent_id_testimonials_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._testimonials_v
    ADD CONSTRAINT _testimonials_v_parent_id_testimonials_id_fk FOREIGN KEY (parent_id) REFERENCES public.testimonials(id) ON DELETE SET NULL;


--
-- Name: _tours_v _tours_v_parent_id_tours_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v
    ADD CONSTRAINT _tours_v_parent_id_tours_id_fk FOREIGN KEY (parent_id) REFERENCES public.tours(id) ON DELETE SET NULL;


--
-- Name: _tours_v_rels _tours_v_rels_dietary_options_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v_rels
    ADD CONSTRAINT _tours_v_rels_dietary_options_fk FOREIGN KEY (dietary_options_id) REFERENCES public.dietary_options(id) ON DELETE CASCADE;


--
-- Name: _tours_v_rels _tours_v_rels_food_items_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v_rels
    ADD CONSTRAINT _tours_v_rels_food_items_fk FOREIGN KEY (food_items_id) REFERENCES public.food_items(id) ON DELETE CASCADE;


--
-- Name: _tours_v_rels _tours_v_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v_rels
    ADD CONSTRAINT _tours_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._tours_v(id) ON DELETE CASCADE;


--
-- Name: _tours_v_rels _tours_v_rels_specialty_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v_rels
    ADD CONSTRAINT _tours_v_rels_specialty_landing_pages_fk FOREIGN KEY (specialty_landing_pages_id) REFERENCES public.specialty_landing_pages(id) ON DELETE CASCADE;


--
-- Name: _tours_v_rels _tours_v_rels_travel_type_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v_rels
    ADD CONSTRAINT _tours_v_rels_travel_type_landing_pages_fk FOREIGN KEY (travel_type_landing_pages_id) REFERENCES public.travel_type_landing_pages(id) ON DELETE CASCADE;


--
-- Name: _tours_v_version_gallery_images _tours_v_version_gallery_images_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v_version_gallery_images
    ADD CONSTRAINT _tours_v_version_gallery_images_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._tours_v(id) ON DELETE CASCADE;


--
-- Name: _tours_v_version_highlights _tours_v_version_highlights_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v_version_highlights
    ADD CONSTRAINT _tours_v_version_highlights_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._tours_v(id) ON DELETE CASCADE;


--
-- Name: _tours_v _tours_v_version_meta_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v
    ADD CONSTRAINT _tours_v_version_meta_image_id_media_id_fk FOREIGN KEY (version_meta_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _tours_v_version_whats_excluded _tours_v_version_whats_excluded_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v_version_whats_excluded
    ADD CONSTRAINT _tours_v_version_whats_excluded_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._tours_v(id) ON DELETE CASCADE;


--
-- Name: _tours_v_version_whats_included _tours_v_version_whats_included_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._tours_v_version_whats_included
    ADD CONSTRAINT _tours_v_version_whats_included_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._tours_v(id) ON DELETE CASCADE;


--
-- Name: _vendors_v _vendors_v_parent_id_vendors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v
    ADD CONSTRAINT _vendors_v_parent_id_vendors_id_fk FOREIGN KEY (parent_id) REFERENCES public.vendors(id) ON DELETE SET NULL;


--
-- Name: _vendors_v_rels _vendors_v_rels_dietary_options_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_rels
    ADD CONSTRAINT _vendors_v_rels_dietary_options_fk FOREIGN KEY (dietary_options_id) REFERENCES public.dietary_options(id) ON DELETE CASCADE;


--
-- Name: _vendors_v_rels _vendors_v_rels_food_items_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_rels
    ADD CONSTRAINT _vendors_v_rels_food_items_fk FOREIGN KEY (food_items_id) REFERENCES public.food_items(id) ON DELETE CASCADE;


--
-- Name: _vendors_v_rels _vendors_v_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_rels
    ADD CONSTRAINT _vendors_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._vendors_v(id) ON DELETE CASCADE;


--
-- Name: _vendors_v_version_awards _vendors_v_version_awards_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_version_awards
    ADD CONSTRAINT _vendors_v_version_awards_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._vendors_v(id) ON DELETE CASCADE;


--
-- Name: _vendors_v_version_closed_on _vendors_v_version_closed_on_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_version_closed_on
    ADD CONSTRAINT _vendors_v_version_closed_on_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._vendors_v(id) ON DELETE CASCADE;


--
-- Name: _vendors_v_version_facilities _vendors_v_version_facilities_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_version_facilities
    ADD CONSTRAINT _vendors_v_version_facilities_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._vendors_v(id) ON DELETE CASCADE;


--
-- Name: _vendors_v_version_images_gallery _vendors_v_version_images_gallery_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_version_images_gallery
    ADD CONSTRAINT _vendors_v_version_images_gallery_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _vendors_v_version_images_gallery _vendors_v_version_images_gallery_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_version_images_gallery
    ADD CONSTRAINT _vendors_v_version_images_gallery_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._vendors_v(id) ON DELETE CASCADE;


--
-- Name: _vendors_v _vendors_v_version_images_main_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v
    ADD CONSTRAINT _vendors_v_version_images_main_id_media_id_fk FOREIGN KEY (version_images_main_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _vendors_v_version_operating_hours _vendors_v_version_operating_hours_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_version_operating_hours
    ADD CONSTRAINT _vendors_v_version_operating_hours_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._vendors_v(id) ON DELETE CASCADE;


--
-- Name: _vendors_v_version_payment_methods _vendors_v_version_payment_methods_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._vendors_v_version_payment_methods
    ADD CONSTRAINT _vendors_v_version_payment_methods_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._vendors_v(id) ON DELETE CASCADE;


--
-- Name: about_page_breadcrumbs about_page_breadcrumbs_doc_id_about_page_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.about_page_breadcrumbs
    ADD CONSTRAINT about_page_breadcrumbs_doc_id_about_page_id_fk FOREIGN KEY (doc_id) REFERENCES public.about_page(id) ON DELETE SET NULL;


--
-- Name: about_page_breadcrumbs about_page_breadcrumbs_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.about_page_breadcrumbs
    ADD CONSTRAINT about_page_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.about_page(id) ON DELETE CASCADE;


--
-- Name: about_page about_page_parent_id_about_page_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.about_page
    ADD CONSTRAINT about_page_parent_id_about_page_id_fk FOREIGN KEY (parent_id) REFERENCES public.about_page(id) ON DELETE SET NULL;


--
-- Name: contact_page_breadcrumbs contact_page_breadcrumbs_doc_id_contact_page_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.contact_page_breadcrumbs
    ADD CONSTRAINT contact_page_breadcrumbs_doc_id_contact_page_id_fk FOREIGN KEY (doc_id) REFERENCES public.contact_page(id) ON DELETE SET NULL;


--
-- Name: contact_page_breadcrumbs contact_page_breadcrumbs_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.contact_page_breadcrumbs
    ADD CONSTRAINT contact_page_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.contact_page(id) ON DELETE CASCADE;


--
-- Name: contact_page contact_page_parent_id_contact_page_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.contact_page
    ADD CONSTRAINT contact_page_parent_id_contact_page_id_fk FOREIGN KEY (parent_id) REFERENCES public.contact_page(id) ON DELETE SET NULL;


--
-- Name: dietary_landing_pages dietary_landing_pages_meta_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.dietary_landing_pages
    ADD CONSTRAINT dietary_landing_pages_meta_image_id_media_id_fk FOREIGN KEY (meta_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: food_items_allergens food_items_allergens_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.food_items_allergens
    ADD CONSTRAINT food_items_allergens_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.food_items(id) ON DELETE CASCADE;


--
-- Name: food_items_flavor_profile food_items_flavor_profile_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.food_items_flavor_profile
    ADD CONSTRAINT food_items_flavor_profile_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.food_items(id) ON DELETE CASCADE;


--
-- Name: food_items food_items_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.food_items
    ADD CONSTRAINT food_items_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: food_items_ingredients food_items_ingredients_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.food_items_ingredients
    ADD CONSTRAINT food_items_ingredients_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.food_items(id) ON DELETE CASCADE;


--
-- Name: food_items_local_names food_items_local_names_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.food_items_local_names
    ADD CONSTRAINT food_items_local_names_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.food_items(id) ON DELETE CASCADE;


--
-- Name: food_items_rels food_items_rels_dietary_options_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.food_items_rels
    ADD CONSTRAINT food_items_rels_dietary_options_fk FOREIGN KEY (dietary_options_id) REFERENCES public.dietary_options(id) ON DELETE CASCADE;


--
-- Name: food_items_rels food_items_rels_media_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.food_items_rels
    ADD CONSTRAINT food_items_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: food_items_rels food_items_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.food_items_rels
    ADD CONSTRAINT food_items_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.food_items(id) ON DELETE CASCADE;


--
-- Name: home_page_blocks_about_block home_page_blocks_about_block__parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_about_block
    ADD CONSTRAINT home_page_blocks_about_block__parent_id_fkey FOREIGN KEY (_parent_id) REFERENCES public.home_page(id) ON DELETE CASCADE;


--
-- Name: home_page_blocks_cta_block_buttons home_page_blocks_cta_block_buttons__parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_cta_block_buttons
    ADD CONSTRAINT home_page_blocks_cta_block_buttons__parent_id_fkey FOREIGN KEY (_parent_id) REFERENCES public.home_page_blocks_cta_block(id) ON DELETE CASCADE;


--
-- Name: home_page_blocks_cta_block_features home_page_blocks_cta_block_features__parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_cta_block_features
    ADD CONSTRAINT home_page_blocks_cta_block_features__parent_id_fkey FOREIGN KEY (_parent_id) REFERENCES public.home_page_blocks_cta_block(id) ON DELETE CASCADE;


--
-- Name: home_page_blocks_hero_block home_page_blocks_hero_block__parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_hero_block
    ADD CONSTRAINT home_page_blocks_hero_block__parent_id_fkey FOREIGN KEY (_parent_id) REFERENCES public.home_page(id) ON DELETE CASCADE;


--
-- Name: home_page_blocks_hero_block_badges home_page_blocks_hero_block_badges__parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_hero_block_badges
    ADD CONSTRAINT home_page_blocks_hero_block_badges__parent_id_fkey FOREIGN KEY (_parent_id) REFERENCES public.home_page_blocks_hero_block(id) ON DELETE CASCADE;


--
-- Name: home_page_blocks_manifesto_block home_page_blocks_manifesto_block__parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_manifesto_block
    ADD CONSTRAINT home_page_blocks_manifesto_block__parent_id_fkey FOREIGN KEY (_parent_id) REFERENCES public.home_page(id) ON DELETE CASCADE;


--
-- Name: home_page_blocks_pillars_block home_page_blocks_pillars_block__parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_pillars_block
    ADD CONSTRAINT home_page_blocks_pillars_block__parent_id_fkey FOREIGN KEY (_parent_id) REFERENCES public.home_page(id) ON DELETE CASCADE;


--
-- Name: home_page_blocks_pillars_block_pillars home_page_blocks_pillars_block_pillars__parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_pillars_block_pillars
    ADD CONSTRAINT home_page_blocks_pillars_block_pillars__parent_id_fkey FOREIGN KEY (_parent_id) REFERENCES public.home_page_blocks_pillars_block(id) ON DELETE CASCADE;


--
-- Name: home_page_blocks_segments_block home_page_blocks_segments_block__parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_segments_block
    ADD CONSTRAINT home_page_blocks_segments_block__parent_id_fkey FOREIGN KEY (_parent_id) REFERENCES public.home_page(id) ON DELETE CASCADE;


--
-- Name: home_page_blocks_stats_block home_page_blocks_stats_block__parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_stats_block
    ADD CONSTRAINT home_page_blocks_stats_block__parent_id_fkey FOREIGN KEY (_parent_id) REFERENCES public.home_page(id) ON DELETE CASCADE;


--
-- Name: home_page_blocks_stats_block_stats home_page_blocks_stats_block_stats__parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_stats_block_stats
    ADD CONSTRAINT home_page_blocks_stats_block_stats__parent_id_fkey FOREIGN KEY (_parent_id) REFERENCES public.home_page_blocks_stats_block(id) ON DELETE CASCADE;


--
-- Name: home_page_blocks_vendors_block home_page_blocks_vendors_block__parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_vendors_block
    ADD CONSTRAINT home_page_blocks_vendors_block__parent_id_fkey FOREIGN KEY (_parent_id) REFERENCES public.home_page(id) ON DELETE CASCADE;


--
-- Name: home_page_blocks_vendors_block_links home_page_blocks_vendors_block_links__parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_vendors_block_links
    ADD CONSTRAINT home_page_blocks_vendors_block_links__parent_id_fkey FOREIGN KEY (_parent_id) REFERENCES public.home_page_blocks_vendors_block(id) ON DELETE CASCADE;


--
-- Name: home_page_blocks_cta_block home_page_cta_section__parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page_blocks_cta_block
    ADD CONSTRAINT home_page_cta_section__parent_id_fkey FOREIGN KEY (_parent_id) REFERENCES public.home_page(id) ON DELETE CASCADE;


--
-- Name: location_landing_pages location_landing_pages_meta_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.location_landing_pages
    ADD CONSTRAINT location_landing_pages_meta_image_id_media_id_fk FOREIGN KEY (meta_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: payload_locked_documents_rels payload_locked_docs_home_page_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_docs_home_page_fk FOREIGN KEY (home_page_id) REFERENCES public.home_page(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_docs_legal_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_docs_legal_pages_fk FOREIGN KEY (legal_pages_id) REFERENCES public.legal_pages(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_docs_locations_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_docs_locations_fk FOREIGN KEY (locations_id) REFERENCES public.locations(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_docs_menus_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_docs_menus_fk FOREIGN KEY (menus_id) REFERENCES public.menus(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_docs_specialty_experiences_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_docs_specialty_experiences_fk FOREIGN KEY (specialty_experiences_id) REFERENCES public.specialty_experiences(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_docs_travel_types_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_docs_travel_types_fk FOREIGN KEY (travel_types_id) REFERENCES public.travel_types(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_about_page_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_about_page_fk FOREIGN KEY (about_page_id) REFERENCES public.about_page(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_contact_page_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_contact_page_fk FOREIGN KEY (contact_page_id) REFERENCES public.contact_page(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_dietary_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_dietary_landing_pages_fk FOREIGN KEY (dietary_landing_pages_id) REFERENCES public.dietary_landing_pages(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_dietary_options_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_dietary_options_fk FOREIGN KEY (dietary_options_id) REFERENCES public.dietary_options(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_faqs_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_faqs_fk FOREIGN KEY (faqs_id) REFERENCES public.faqs(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_food_items_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_food_items_fk FOREIGN KEY (food_items_id) REFERENCES public.food_items(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_location_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_location_landing_pages_fk FOREIGN KEY (location_landing_pages_id) REFERENCES public.location_landing_pages(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_media_coverage_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_media_coverage_fk FOREIGN KEY (media_coverage_id) REFERENCES public.media_coverage(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_media_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_locked_documents(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_redirects_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_redirects_fk FOREIGN KEY (redirects_id) REFERENCES public.redirects(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_search_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_search_fk FOREIGN KEY (search_id) REFERENCES public.search(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_site_settings_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_site_settings_fk FOREIGN KEY (site_settings_id) REFERENCES public.site_settings(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_specialty_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_specialty_landing_pages_fk FOREIGN KEY (specialty_landing_pages_id) REFERENCES public.specialty_landing_pages(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_stories_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_stories_fk FOREIGN KEY (stories_id) REFERENCES public.stories(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_testimonials_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_testimonials_fk FOREIGN KEY (testimonials_id) REFERENCES public.testimonials(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_thank_you_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_thank_you_pages_fk FOREIGN KEY (thank_you_pages_id) REFERENCES public.thank_you_pages(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_tours_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_tours_fk FOREIGN KEY (tours_id) REFERENCES public.tours(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_translations_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_translations_fk FOREIGN KEY (translations_id) REFERENCES public.translations(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_travel_type_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_travel_type_landing_pages_fk FOREIGN KEY (travel_type_landing_pages_id) REFERENCES public.travel_type_landing_pages(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_vendors_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_vendors_fk FOREIGN KEY (vendors_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_preferences(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: redirects_rels redirects_rels_dietary_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.redirects_rels
    ADD CONSTRAINT redirects_rels_dietary_landing_pages_fk FOREIGN KEY (dietary_landing_pages_id) REFERENCES public.dietary_landing_pages(id) ON DELETE CASCADE;


--
-- Name: redirects_rels redirects_rels_location_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.redirects_rels
    ADD CONSTRAINT redirects_rels_location_landing_pages_fk FOREIGN KEY (location_landing_pages_id) REFERENCES public.location_landing_pages(id) ON DELETE CASCADE;


--
-- Name: redirects_rels redirects_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.redirects_rels
    ADD CONSTRAINT redirects_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.redirects(id) ON DELETE CASCADE;


--
-- Name: redirects_rels redirects_rels_specialty_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.redirects_rels
    ADD CONSTRAINT redirects_rels_specialty_landing_pages_fk FOREIGN KEY (specialty_landing_pages_id) REFERENCES public.specialty_landing_pages(id) ON DELETE CASCADE;


--
-- Name: redirects_rels redirects_rels_stories_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.redirects_rels
    ADD CONSTRAINT redirects_rels_stories_fk FOREIGN KEY (stories_id) REFERENCES public.stories(id) ON DELETE CASCADE;


--
-- Name: redirects_rels redirects_rels_tours_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.redirects_rels
    ADD CONSTRAINT redirects_rels_tours_fk FOREIGN KEY (tours_id) REFERENCES public.tours(id) ON DELETE CASCADE;


--
-- Name: redirects_rels redirects_rels_travel_type_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.redirects_rels
    ADD CONSTRAINT redirects_rels_travel_type_landing_pages_fk FOREIGN KEY (travel_type_landing_pages_id) REFERENCES public.travel_type_landing_pages(id) ON DELETE CASCADE;


--
-- Name: search_rels search_rels_faqs_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.search_rels
    ADD CONSTRAINT search_rels_faqs_fk FOREIGN KEY (faqs_id) REFERENCES public.faqs(id) ON DELETE CASCADE;


--
-- Name: search_rels search_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.search_rels
    ADD CONSTRAINT search_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.search(id) ON DELETE CASCADE;


--
-- Name: search_rels search_rels_stories_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.search_rels
    ADD CONSTRAINT search_rels_stories_fk FOREIGN KEY (stories_id) REFERENCES public.stories(id) ON DELETE CASCADE;


--
-- Name: search_rels search_rels_testimonials_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.search_rels
    ADD CONSTRAINT search_rels_testimonials_fk FOREIGN KEY (testimonials_id) REFERENCES public.testimonials(id) ON DELETE CASCADE;


--
-- Name: search_rels search_rels_tours_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.search_rels
    ADD CONSTRAINT search_rels_tours_fk FOREIGN KEY (tours_id) REFERENCES public.tours(id) ON DELETE CASCADE;


--
-- Name: specialty_landing_pages specialty_landing_pages_meta_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.specialty_landing_pages
    ADD CONSTRAINT specialty_landing_pages_meta_image_id_media_id_fk FOREIGN KEY (meta_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: stories stories_author_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: stories stories_meta_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_meta_image_id_media_id_fk FOREIGN KEY (meta_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: thank_you_pages_cta_section_cta_buttons thank_you_pages_cta_section_cta_buttons_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.thank_you_pages_cta_section_cta_buttons
    ADD CONSTRAINT thank_you_pages_cta_section_cta_buttons_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.thank_you_pages(id) ON DELETE CASCADE;


--
-- Name: thank_you_pages_next_steps thank_you_pages_next_steps_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.thank_you_pages_next_steps
    ADD CONSTRAINT thank_you_pages_next_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.thank_you_pages(id) ON DELETE CASCADE;


--
-- Name: tours_gallery_images tours_gallery_images_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.tours_gallery_images
    ADD CONSTRAINT tours_gallery_images_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.tours(id) ON DELETE CASCADE;


--
-- Name: tours_highlights tours_highlights_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.tours_highlights
    ADD CONSTRAINT tours_highlights_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.tours(id) ON DELETE CASCADE;


--
-- Name: tours tours_meta_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.tours
    ADD CONSTRAINT tours_meta_image_id_media_id_fk FOREIGN KEY (meta_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: tours_rels tours_rels_dietary_options_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.tours_rels
    ADD CONSTRAINT tours_rels_dietary_options_fk FOREIGN KEY (dietary_options_id) REFERENCES public.dietary_options(id) ON DELETE CASCADE;


--
-- Name: tours_rels tours_rels_food_items_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.tours_rels
    ADD CONSTRAINT tours_rels_food_items_fk FOREIGN KEY (food_items_id) REFERENCES public.food_items(id) ON DELETE CASCADE;


--
-- Name: tours_rels tours_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.tours_rels
    ADD CONSTRAINT tours_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.tours(id) ON DELETE CASCADE;


--
-- Name: tours_rels tours_rels_specialty_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.tours_rels
    ADD CONSTRAINT tours_rels_specialty_landing_pages_fk FOREIGN KEY (specialty_landing_pages_id) REFERENCES public.specialty_landing_pages(id) ON DELETE CASCADE;


--
-- Name: tours_rels tours_rels_travel_type_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.tours_rels
    ADD CONSTRAINT tours_rels_travel_type_landing_pages_fk FOREIGN KEY (travel_type_landing_pages_id) REFERENCES public.travel_type_landing_pages(id) ON DELETE CASCADE;


--
-- Name: tours_whats_excluded tours_whats_excluded_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.tours_whats_excluded
    ADD CONSTRAINT tours_whats_excluded_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.tours(id) ON DELETE CASCADE;


--
-- Name: tours_whats_included tours_whats_included_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.tours_whats_included
    ADD CONSTRAINT tours_whats_included_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.tours(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_dietary_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_dietary_landing_pages_fk FOREIGN KEY (dietary_landing_pages_id) REFERENCES public.dietary_landing_pages(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_faqs_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_faqs_fk FOREIGN KEY (faqs_id) REFERENCES public.faqs(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_home_page_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_home_page_fk FOREIGN KEY (home_page_id) REFERENCES public.home_page(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_legal_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_legal_pages_fk FOREIGN KEY (legal_pages_id) REFERENCES public.legal_pages(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_location_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_location_landing_pages_fk FOREIGN KEY (location_landing_pages_id) REFERENCES public.location_landing_pages(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_media_coverage_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_media_coverage_fk FOREIGN KEY (media_coverage_id) REFERENCES public.media_coverage(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.translations(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_specialty_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_specialty_landing_pages_fk FOREIGN KEY (specialty_landing_pages_id) REFERENCES public.specialty_landing_pages(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_stories_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_stories_fk FOREIGN KEY (stories_id) REFERENCES public.stories(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_testimonials_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_testimonials_fk FOREIGN KEY (testimonials_id) REFERENCES public.testimonials(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_tours_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_tours_fk FOREIGN KEY (tours_id) REFERENCES public.tours(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_travel_type_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_travel_type_landing_pages_fk FOREIGN KEY (travel_type_landing_pages_id) REFERENCES public.travel_type_landing_pages(id) ON DELETE CASCADE;


--
-- Name: travel_type_landing_pages travel_type_landing_pages_meta_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.travel_type_landing_pages
    ADD CONSTRAINT travel_type_landing_pages_meta_image_id_media_id_fk FOREIGN KEY (meta_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: users_sessions users_sessions_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: vendors_awards vendors_awards_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors_awards
    ADD CONSTRAINT vendors_awards_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- Name: vendors_closed_on vendors_closed_on_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors_closed_on
    ADD CONSTRAINT vendors_closed_on_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- Name: vendors_facilities vendors_facilities_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors_facilities
    ADD CONSTRAINT vendors_facilities_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- Name: vendors_images_gallery vendors_images_gallery_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors_images_gallery
    ADD CONSTRAINT vendors_images_gallery_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: vendors_images_gallery vendors_images_gallery_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors_images_gallery
    ADD CONSTRAINT vendors_images_gallery_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- Name: vendors vendors_images_main_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_images_main_id_media_id_fk FOREIGN KEY (images_main_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: vendors_operating_hours vendors_operating_hours_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors_operating_hours
    ADD CONSTRAINT vendors_operating_hours_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- Name: vendors_payment_methods vendors_payment_methods_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors_payment_methods
    ADD CONSTRAINT vendors_payment_methods_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- Name: vendors_rels vendors_rels_dietary_options_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors_rels
    ADD CONSTRAINT vendors_rels_dietary_options_fk FOREIGN KEY (dietary_options_id) REFERENCES public.dietary_options(id) ON DELETE CASCADE;


--
-- Name: vendors_rels vendors_rels_food_items_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors_rels
    ADD CONSTRAINT vendors_rels_food_items_fk FOREIGN KEY (food_items_id) REFERENCES public.food_items(id) ON DELETE CASCADE;


--
-- Name: vendors_rels vendors_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.vendors_rels
    ADD CONSTRAINT vendors_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: directus
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict qccm1nK0q4t16rNMTzV2VaUzLgblJtb0LjbPUhJ7eVIgGMufvl5eRno7u9c8xa6

