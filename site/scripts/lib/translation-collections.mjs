/**
 * Shared translation configuration for Simply Enak content pipeline.
 *
 * Used by:
 *   - scripts/translate-content.mjs  (reads/writes content JSON)
 *   - scripts/export-translations.mjs  (content JSON → monitoring files)
 *   - scripts/validate-translations.mjs (could import from here too)
 */

export const ALL_LANGS = ['ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt'];

export const LANG_NAMES = {
  ms: 'Malay',
  zh: 'Simplified Chinese',
  de: 'German',
  es: 'Spanish',
  fr: 'French',
  nl: 'Dutch',
  ru: 'Russian',
  ja: 'Japanese',
  pt: 'Portuguese',
};

// Fields that should never be translated — metadata, IDs, images, etc.
export const SKIP_FIELDS = new Set([
  // Internal IDs
  'id', 'languages_code',
  // Timestamps
  'created_at', 'updated_at', 'date_updated', 'date_created', 'date_created',
  // Payload metadata
  'version', 'last_reviewed', 'reviewer_notes', 'seo_keywords', 'internal_name',
  'template_version', 'ab_test_variant', 'analytics_id', 'campaign_id',
  'experiment_id', 'content_hash',
  // Image fields (URLs, not text)
  'about_image', 'hero_bg_image', 'hero_image', 'portrait',
]);

// Brand context injected into every translation prompt.
// Derived from docs/brand/BRAND_GUIDE.md — keep in sync.
export const BRAND_CONTEXT = `You are translating content for Simply Enak, a Malaysian food tour company established in 2011 by Pauline and Maarten Belmans. The brand voice is warm, personal, and knowledgeable — like a passionate friend showing you around. Avoid formal or corporate language. Short, direct sentences. No em-dashes for dramatic pauses. Never use: "authentic", "immersive experience", "embark on a journey", "luxury", "premium", "world-class", "can't-miss", "unforgettable". Preserve all HTML tags, markdown formatting, and line breaks exactly as they appear in the source. Do not translate proper nouns: Simply Enak, Pauline, Maarten, Aunty Lim, Uncle Chen, Mak Cik Salmah, TicketingHub, WhatsApp, KL (Kuala Lumpur), Penang, Ipoh, Chow Kit, Kampung Baru, Petaling Street, Georgetown, Bukit Bintang. Do not translate food names that are proper Malaysian dishes: nasi lemak, char kway teow, curry laksa, rendang, roti jala, apam balik, etc.`;

/**
 * Collection registry — describes how to read each content file.
 *
 * Each entry has:
 *   file:              filename in frontend/src/data/content/
 *   type:              'array' or 'singleton'
 *   matchField:        field to match items by (for array types)
 *   translatableFields: fields that should be translated
 *   arrayFields:       fields that are JSON arrays of strings (need per-item translation)
 *   htmlFields:        fields containing HTML (preserve tags)
 */
export const COLLECTIONS = {
  tours: {
    file: 'tours.json',
    type: 'array',
    matchField: 'slug',
    translatableFields: [
      'name', 'tagline', 'short_description', 'full_description',
      'whats_included', 'whats_excluded', 'highlights',
      'meta_title', 'meta_description',
    ],
    arrayFields: ['whats_included', 'whats_excluded', 'highlights'],
  },
  stories: {
    file: 'stories.json',
    type: 'array',
    matchField: 'slug',
    translatableFields: ['title', 'excerpt', 'content', 'meta_title', 'meta_description'],
    htmlFields: ['content'],
  },
  faqs: {
    file: 'faqs.json',
    type: 'array',
    matchField: 'question',
    translatableFields: ['question', 'answer'],
    htmlFields: ['answer'],
  },
  testimonials: {
    file: 'testimonials.json',
    type: 'array',
    matchField: 'review_text', // review_title is NULL in Payload — use the actual text
    translatableFields: ['review_title', 'review_text'],
  },
  home_page: {
    file: 'home-page.json',
    type: 'singleton',
    translatableFields: [
      'hero_title', 'hero_highlight', 'hero_title_end', 'hero_subtitle', 'hero_description',
      'hero_price_info', 'hero_vendors', 'hero_since', 'hero_rated', 'hero_max_per_tour',
      'hero_low_waste', 'hero_guides', 'hero_stalls', 'hero_values', 'hero_guests_hosted', 'hero_cities',
      'manifesto_eyebrow', 'manifesto_headline', 'manifesto_tagline', 'manifesto_body',
      'manifesto_attribution_role',
      'pillars_intro',
      'pillar_people_label', 'pillar_people_heading', 'pillar_people_body',
      'pillar_food_label', 'pillar_food_heading', 'pillar_food_body',
      'pillar_place_label', 'pillar_place_heading', 'pillar_place_body',
      'vendors_eyebrow', 'vendors_title', 'vendors_subtitle',
      'segment_heading', 'segment_subheading', 'segment_view_all',
      'expect_title', 'expect_subtitle',
      'expect_stat1_heading', 'expect_stat1_body',
      'expect_stat2_heading', 'expect_stat2_body',
      'expect_stat3_heading', 'expect_stat3_body',
      'expect_stat4_heading', 'expect_stat4_body',
      'cta_eyebrow', 'cta_title', 'cta_subtitle',
      'cta_free_cancellation', 'cta_reply_time', 'cta_max_people',
      'cta_book_experience', 'cta_chat_whatsapp',
      'about_eyebrow', 'about_title', 'about_subtitle', 'about_description', 'about_heritage',
      'vendors_meet_on_tour', 'vendors_footer', 'vendors_read_stories',
      'meta_title', 'meta_description',
    ],
  },
  about_page: {
    file: 'about-page.json',
    type: 'singleton',
    translatableFields: [
      'heroEyebrow', 'heroHeading', 'heroDescription',
      'founderSection', 'stats', 'timelineSection', 'philosophySection',
      'teamSection', 'testimonial', 'ctaSection',
      'seo_title', 'seo_description',
    ],
    objectArrayFields: {
      founderSection: { translatableSubFields: ['eyebrow', 'heading', 'text'] },
      timelineSection: { translatableSubFields: ['title', 'subtitle', 'description'] },
      philosophySection: { translatableSubFields: ['eyebrow', 'heading', 'description'] },
      teamSection: { translatableSubFields: ['heading', 'description'] },
      ctaSection: { translatableSubFields: ['heading', 'description'] },
    },
  },
  contact_page: {
    file: 'contact-page.json',
    type: 'singleton',
    translatableFields: [
      'hero_title', 'hero_subtitle',
      'intro_title', 'intro_subtitle',
      'contact_phone', 'contact_email', 'contact_hours', 'whatsapp_number',
      'contactMethods', 'planningScenarios', 'ourPromise', 'businessHours',
      'meta_title', 'meta_description',
    ],
    objectArrayFields: {
      contactMethods: { translatableSubFields: ['heading', 'description', 'subtitle'] },
      planningScenarios: { translatableSubFields: ['heading', 'description'] },
      ourPromise: { translatableSubFields: ['title', 'description'] },
      businessHours: { translatableSubFields: ['title', 'description'] },
    },
  },
  tours_index_page: {
    file: 'tours-index-page.json',
    type: 'singleton',
    translatableFields: [
      'hero_title', 'hero_subtitle', 'hero_description',
      'signature_tours_eyebrow', 'signature_tours_heading', 'signature_tours_subtext',
      'tours_by_city_eyebrow', 'tours_by_city_heading', 'tours_by_city_subtext',
      'meta_title', 'meta_description',
    ],
  },
  faq_page: {
    file: 'faq-page.json',
    type: 'singleton',
    translatableFields: ['hero_title', 'hero_subtitle', 'meta_title', 'meta_description'],
  },
  private_tours_page: {
    file: 'private-tours-page.json',
    type: 'singleton',
    translatableFields: [
      'seo_title', 'seo_description',
      'hero_title', 'hero_highlight', 'hero_subtitle',
      'hero_cta_primary_text', 'hero_cta_secondary_text',
      'why_title', 'why_subtitle',
      'configurator_eyebrow', 'configurator_heading', 'configurator_body',
      'audiences_title',
      'inclusions_heading', 'on_every_tour_label', 'private_extras_label',
      'on_every_tour', 'private_extras',
      'pricing_heading', 'pricing_body', 'pricing_cta_whatsapp', 'pricing_cta_message',
      'available_privately_heading', 'available_privately_subtext',
      'corporate_callout', 'corporate_cta_text',
      'faq_eyebrow', 'faq_heading',
      'internal_links_heading', 'view_all_tours_text',
    ],
    arrayFields: ['on_every_tour', 'private_extras'],
    objectArrayFields: {
      why_private: { translatableSubFields: ['title', 'detail'] },
      audiences:   { translatableSubFields: ['label', 'detail'] },
      faqs:        { translatableSubFields: ['name', 'answer'] },
    },
  },
  join_in_tours_page: {
    file: 'join-in-tours-page.json',
    type: 'singleton',
    translatableFields: [
      'seo_title', 'seo_description',
      'hero_title', 'hero_highlight', 'hero_subtitle',
      'hero_cta_primary_text', 'hero_cta_secondary_text',
      'badge_solo',
      'how_it_works_title', 'how_it_works_subtitle',
      'solo_heading', 'solo_body',
      'solo_testimonial_quote', 'solo_testimonial_attribution',
      'all_tours_heading', 'all_tours_subtext',
      'faqs_heading',
      'internal_links_heading',
      'link_all_tours_text', 'link_private_tours_text',
      'link_kl_text', 'link_penang_text', 'link_stories_text',
    ],
  },
  stories_index_page: {
    file: 'stories-index-page.json',
    type: 'singleton',
    translatableFields: [
      'seo_title', 'seo_description',
      'hero_title', 'hero_highlight', 'hero_subtitle',
    ],
  },
  stories_archive_page: {
    file: 'stories-archive-page.json',
    type: 'singleton',
    translatableFields: [
      'seo_title', 'seo_description',
      'hero_title', 'hero_highlight', 'hero_subtitle',
      'filter_all_label', 'no_results_text',
    ],
  },
  landing_pages_dietary: {
    file: 'dietary-landing-pages.json',
    type: 'array',
    matchField: 'slug',
    translatableFields: [
      'hero_title', 'hero_subtitle', 'hero_description',
      'content', 'intro_heading',
      'dietary_name',
      'meta_title', 'meta_description',
    ],
  },
  landing_pages_specialty: {
    file: 'specialty-landing-pages.json',
    type: 'array',
    matchField: 'slug',
    translatableFields: [
      'hero_title', 'hero_subtitle', 'hero_description',
      'content', 'intro_heading',
      'specialty_name',
      'meta_title', 'meta_description',
    ],
  },
  landing_pages_travel_type: {
    file: 'travel-type-landing-pages.json',
    type: 'array',
    matchField: 'slug',
    translatableFields: [
      'hero_title', 'hero_subtitle', 'hero_description',
      'content', 'intro_heading',
      'meta_title', 'meta_description',
    ],
  },
  landing_pages_location: {
    file: 'location-landing-pages.json',
    type: 'array',
    matchField: 'slug',
    translatableFields: [
      'hero_title', 'hero_subtitle', 'hero_description',
      'content', 'intro_heading',
      'meta_title', 'meta_description',
    ],
  },
};

/**
 * Check if a value has translatable content.
 */
export function hasContent(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === 'string') return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'object') return Object.keys(v).length > 0;
  if (typeof v === 'number' || typeof v === 'boolean') return true;
  return false;
}

/**
 * Determine if a field should be skipped (not translated).
 */
export function shouldSkipField(field) {
  if (SKIP_FIELDS.has(field)) return true;
  if (field.endsWith('_id')) return true;
  return false;
}
