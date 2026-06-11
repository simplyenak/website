import type { CollectionConfig } from 'payload'

export const SiteSettings: CollectionConfig = {
  slug: 'site_settings',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Settings & Config',
    description: 'Global site settings — pricing, contact, social, navigation',
    useAsTitle: 'site_name',
  },
  fields: [
    // ── Identity ──
    {
      name: 'site_name',
      type: 'text',
      required: true,
      admin: { description: 'e.g., "Simply Enak"' },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: { description: 'Short tagline' },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Site description (SEO)' },
    },
    {
      name: 'company_established',
      type: 'number',
      admin: { description: 'Year founded (e.g., 2011)' },
    },
    {
      name: 'registration_no',
      type: 'text',
      admin: { description: 'Company registration number' },
    },

    // ── Tour Config ──
    {
      name: 'tour_price',
      type: 'number',
      admin: { description: 'Base price per person (e.g., 285)' },
    },
    {
      name: 'tour_currency',
      type: 'text',
      defaultValue: 'MYR',
      admin: { description: 'Currency code (e.g., MYR)' },
    },
    {
      name: 'max_people_per_tour',
      type: 'number',
      admin: { description: 'Maximum guests per tour (e.g., 9)' },
    },
    {
      name: 'tour_duration',
      type: 'text',
      admin: { description: 'Display text (e.g., "4–5 hours")' },
    },

    // ── Social Proof ──
    {
      name: 'heritage_vendors_count',
      type: 'text',
      admin: { description: 'e.g., "40+"' },
    },
    {
      name: 'years_operating',
      type: 'text',
      admin: { description: 'e.g., "14+"' },
    },
    {
      name: 'guests_hosted',
      type: 'text',
      admin: { description: 'e.g., "5,000+"' },
    },
    {
      name: 'rating',
      type: 'text',
      admin: { description: 'e.g., "4.9"' },
    },
    {
      name: 'review_count',
      type: 'text',
      admin: { description: 'e.g., "5,000+"' },
    },

    // ── Contact ──
    {
      name: 'contact_email',
      type: 'email',
      admin: { description: 'Booking email' },
    },
    {
      name: 'contact_phone',
      type: 'text',
      admin: { description: 'Phone number' },
    },
    {
      name: 'whatsapp_number',
      type: 'text',
      admin: { description: 'WhatsApp number (e.g., "+60172878929")' },
    },
    {
      name: 'business_hours',
      type: 'text',
      admin: { description: 'e.g., "Mon – Sun: 9:00 – 20:00"' },
    },
    {
      name: 'address',
      type: 'textarea',
      admin: { description: 'Business address' },
    },

    // ── Forms ──
    {
      name: 'forms_webhook_url',
      type: 'text',
      admin: { description: 'n8n/Forms webhook URL for contact forms' },
    },

    // ── Social Links ──
    {
      name: 'social_facebook',
      type: 'text',
    },
    {
      name: 'social_instagram',
      type: 'text',
    },
    {
      name: 'social_youtube',
      type: 'text',
    },
    {
      name: 'social_tripadvisor',
      type: 'text',
      admin: { description: 'TripAdvisor URL' },
    },
    {
      name: 'social_tripadvisor_penang',
      type: 'text',
      admin: { description: 'TripAdvisor Penang URL' },
    },
    {
      name: 'social_linkedin_company',
      type: 'text',
    },
    {
      name: 'social_linkedin_maarten',
      type: 'text',
    },
    {
      name: 'social_linkedin_pauline',
      type: 'text',
    },

    // ── Press / Media ──
    {
      name: 'press_natgeo_url',
      type: 'text',
    },
    {
      name: 'press_lonelyplanet_url',
      type: 'text',
    },
    {
      name: 'press_cnn_url',
      type: 'text',
    },
    {
      name: 'press_routard_url',
      type: 'text',
    },
    {
      name: 'press_timeout_penang_url',
      type: 'text',
    },

    // ── Google My Business ──
    {
      name: 'gmb_kl_url',
      type: 'text',
      admin: { description: 'Google Maps Business listing (KL)' },
    },
    {
      name: 'gmb_penang_url',
      type: 'text',
      admin: { description: 'Google Maps Business listing (Penang)' },
    },

    // ── SEO ──
    {
      name: 'meta_title',
      type: 'text',
    },
    {
      name: 'meta_description',
      type: 'textarea',
    },
    {
      name: 'og_image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Default Open Graph image' },
    },
    {
      name: 'hero_image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Hero image — select from media library' },
    },
    {
      name: 'booking_url',
      type: 'text',
    },

    // ── Navigation ──
    {
      name: 'main_navigation',
      type: 'json',
      admin: { description: 'Header nav items (JSON array of {label, url})' },
    },
    {
      name: 'mobile_navigation',
      type: 'json',
      admin: { description: 'Mobile nav items' },
    },
    {
      name: 'footer_navigation',
      type: 'json',
      admin: { description: 'Footer nav items' },
    },
    {
      name: 'footer_copyright_text',
      type: 'text',
    },
    {
      name: 'sub_page_menus',
      type: 'json',
      admin: { description: 'Sub-page menus (JSON object)' },
    },

    // ── Feature Toggles ──
    {
      name: 'show_vendors',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show vendor sections across the site',
        position: 'sidebar',
      },
    },

    // ── Guide / Social Proof Copy ──
    {
      name: 'guide_image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Guide photo shown on tour detail pages' },
    },
    {
      name: 'guide_image_alt',
      type: 'text',
      admin: { description: 'Alt text for guide photo' },
    },
    {
      name: 'guide_heading',
      type: 'text',
      admin: { description: 'Heading in "Your Guide" section (e.g., "The People Behind the Stalls")' },
    },
    {
      name: 'guide_body',
      type: 'textarea',
      admin: { description: 'Body copy in "Your Guide" section' },
    },
    {
      name: 'travellers_choice_year',
      type: 'text',
      admin: { description: 'Year of TripAdvisor Travellers\' Choice award (e.g., "2023")' },
    },
    {
      name: 'currency_usd_rate',
      type: 'number',
      admin: { description: 'MYR → USD conversion rate (e.g., 0.22). Used for indicative price display.' },
    },
    {
      name: 'currency_aud_rate',
      type: 'number',
      admin: { description: 'MYR → AUD conversion rate (e.g., 0.32). Used for indicative price display.' },
    },

    // ── Social Proof Text ──
    {
      name: 'countries_served',
      type: 'text',
      defaultValue: '50+ countries',
      admin: { description: 'Countries stat shown on tour pages (e.g. "50+ countries")' },
    },

    // ── Section Labels (tour detail pages) ──
    {
      type: 'collapsible',
      label: 'Tour Page Section Labels',
      admin: { description: 'Eyebrow labels on tour detail page sections' },
      fields: [
        { name: 'label_the_experience', type: 'text', defaultValue: 'The Experience' },
        { name: 'label_straight_from_guests', type: 'text', defaultValue: 'Straight from Our Guests' },
        { name: 'label_stop_by_stop', type: 'text', defaultValue: 'Stop by Stop' },
        { name: 'label_why_join_us', type: 'text', defaultValue: 'Why Join Us' },
        { name: 'label_the_full_story', type: 'text', defaultValue: 'The Full Story' },
        { name: 'label_on_the_tour', type: 'text', defaultValue: 'On the Tour' },
        { name: 'label_the_people', type: 'text', defaultValue: 'The People' },
        { name: 'label_private_tailored', type: 'text', defaultValue: 'Private & Tailored' },
        { name: 'label_what_you_get', type: 'text', defaultValue: 'What You Get' },
        { name: 'label_where_to_find_us', type: 'text', defaultValue: 'Where to Find Us' },
        { name: 'label_good_to_know', type: 'text', defaultValue: 'Good to Know' },
        { name: 'label_common_questions', type: 'text', defaultValue: 'Common Questions' },
        { name: 'label_background', type: 'text', defaultValue: 'Background' },
        { name: 'label_come_with_us', type: 'text', defaultValue: 'Come With Us' },
        { name: 'label_insider_guides', type: 'text', defaultValue: 'Insider Guides' },
        { name: 'label_local_specialties', type: 'text', defaultValue: 'Local Specialties' },
        { name: 'label_food_culture', type: 'text', defaultValue: 'Food & Culture' },
        { name: 'label_culture_heritage', type: 'text', defaultValue: 'Culture & Heritage' },
        { name: 'label_vendor_stories', type: 'text', defaultValue: 'Vendor Stories' },
        { name: 'label_walk_it_with_us', type: 'text', defaultValue: 'Walk it With Us' },
        { name: 'label_stay_in_loop', type: 'text', defaultValue: 'Stay in the Loop' },
        { name: 'label_good_for', type: 'text', defaultValue: 'Good for' },
      ],
    },

    // ── Tour Configuration ──
    {
      name: 'main_tour_slugs',
      type: 'text',
      hasMany: true,
      defaultValue: [
        'flavours-of-malaysia',
        'eat-drink-george-town',
        'kl-street-food',
        'penang-street-food',
        'secrets-of-kl-nightlife',
      ],
      admin: {
        description: 'The "main 5" tours featured on homepage and priority ordering. Must match tour slugs.',
      },
    },
  ],
}
