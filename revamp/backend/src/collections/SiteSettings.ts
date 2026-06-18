import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

export const SiteSettings: CollectionConfig = {
  slug: 'site_settings',
  hooks: {
    afterChange: [triggerStagingDeploy],
  },
  admin: {
    group: 'Settings & Config',
    description: 'Global site settings — pricing, contact, social, navigation',
    useAsTitle: 'site_name',
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
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
      localized: true,
      admin: { description: 'Short tagline' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
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
      localized: true,
      admin: { description: 'e.g., "Mon – Sun: 9:00 – 20:00"' },
    },
    {
      name: 'address',
      type: 'textarea',
      localized: true,
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
      localized: true,
    },
    {
      name: 'meta_description',
      type: 'textarea',
      localized: true,
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
      localized: true,
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

    // ── Analytics & Tracking ──
    {
      name: 'google_analytics_id',
      type: 'text',
      admin: {
        description: 'GA4 Measurement ID (e.g., G-XXXXXXXXXX)',
      },
    },
    {
      name: 'google_tag_manager_id',
      type: 'text',
      admin: {
        description: 'GTM Container ID (e.g., GTM-XXXXXXX). If set, GTM replaces direct gtag.js',
      },
    },
    {
      name: 'facebook_pixel_id',
      type: 'text',
      admin: {
        description: 'Meta Pixel ID',
      },
    },
    {
      name: 'head_scripts',
      type: 'textarea',
      admin: {
        description: 'Custom HTML to inject in <head> (verification meta tags, etc.)',
      },
    },
    {
      name: 'meta_facebook_verification',
      type: 'text',
      admin: {
        description: 'Facebook domain verification code',
      },
    },

    // ── Currency Rates ──
    {
      name: 'currency_rate_usd',
      type: 'number',
      admin: { description: 'USD to MYR rate' },
    },
    {
      name: 'currency_rate_eur',
      type: 'number',
      admin: { description: 'EUR to MYR rate' },
    },
    {
      name: 'currency_rate_gbp',
      type: 'number',
      admin: { description: 'GBP to MYR rate' },
    },
    {
      name: 'currency_rate_sgd',
      type: 'number',
      admin: { description: 'SGD to MYR rate' },
    },
    {
      name: 'currency_rate_aud',
      type: 'number',
      admin: { description: 'AUD to MYR rate' },
    },
    {
      name: 'currency_rate_cad',
      type: 'number',
      admin: { description: 'CAD to MYR rate' },
    },
    {
      name: 'currency_rate_chf',
      type: 'number',
      admin: { description: 'CHF to MYR rate' },
    },
    {
      name: 'currency_rate_cny',
      type: 'number',
      admin: { description: 'CNY to MYR rate' },
    },
    {
      name: 'currency_rates_fetched_at',
      type: 'text',
      admin: { description: 'Date currency rates were last updated (YYYY-MM-DD)' },
    },

    // ── Page Meta ──
    {
      name: 'contact_page_title',
      type: 'text',
      localized: true,
      admin: { description: 'Contact page <title>' },
    },
    {
      name: 'contact_page_description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Contact page meta description' },
    },
    {
      name: 'faq_page_title',
      type: 'text',
      localized: true,
      admin: { description: 'FAQ page <title>' },
    },
    {
      name: 'faq_page_description',
      type: 'textarea',
      localized: true,
      admin: { description: 'FAQ page meta description' },
    },
    {
      name: 'corporate_page_title',
      type: 'text',
      localized: true,
      admin: { description: 'Corporate page <title>' },
    },
    {
      name: 'corporate_page_content',
      type: 'richText',
      localized: true,
      admin: { description: 'Corporate page body content' },
    },

    // ── Guide Fields ──
    {
      name: 'guide_meta_description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Guide page meta description' },
    },
    {
      name: 'guide_max_bio_length',
      type: 'number',
      defaultValue: 250,
      admin: { description: 'Max characters for guide bio' },
    },
    {
      name: 'guide_max_education_length',
      type: 'number',
      defaultValue: 150,
      admin: { description: 'Max characters for guide education' },
    },
    {
      name: 'guide_max_expertise_length',
      type: 'number',
      defaultValue: 100,
      admin: { description: 'Max characters for guide expertise' },
    },
    {
      name: 'guide_max_highlight_length',
      type: 'number',
      defaultValue: 80,
      admin: { description: 'Max characters for guide highlight' },
    },
    {
      name: 'guide_max_personality_length',
      type: 'number',
      defaultValue: 100,
      admin: { description: 'Max characters for guide personality' },
    },
    {
      name: 'guide_max_testimonial_length',
      type: 'number',
      defaultValue: 200,
      admin: { description: 'Max characters for guide testimonial' },
    },

    // ── Newsletter ──
    {
      name: 'newsletter_section_heading',
      type: 'text',
      localized: true,
      admin: { description: 'Newsletter section heading' },
    },
    {
      name: 'newsletter_placeholder_text',
      type: 'text',
      localized: true,
      admin: { description: 'Newsletter email input placeholder' },
    },
    {
      name: 'newsletter_submit_button',
      type: 'text',
      localized: true,
      admin: { description: 'Newsletter submit button label' },
    },
    {
      name: 'newsletter_success_message',
      type: 'text',
      localized: true,
      admin: { description: 'Message shown after successful subscription' },
    },

    // ── WhatsApp ──
    {
      name: 'whatsapp_button_label',
      type: 'text',
      localized: true,
      admin: { description: 'WhatsApp CTA button text' },
    },
    {
      name: 'whatsapp_greeting_message',
      type: 'textarea',
      localized: true,
      admin: { description: 'Pre-filled WhatsApp message text' },
    },

    // ── Analytics Type ──
    {
      name: 'analytics_type',
      type: 'select',
      options: [
        { label: 'Google Analytics (gtag.js)', value: 'google_analytics' },
        { label: 'Google Tag Manager', value: 'gtm' },
        { label: 'None', value: 'none' },
      ],
      defaultValue: 'google_analytics',
      admin: { description: 'Which analytics system to use' },
    },

    // ── Cookie Banner ──
    {
      name: 'cookie_banner_enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show cookie consent banner',
        position: 'sidebar',
      },
    },
    {
      name: 'cookie_banner_message',
      type: 'textarea',
      localized: true,
      admin: { description: 'Main cookie banner text' },
    },
    {
      name: 'cookie_banner_privacy_link',
      type: 'text',
      admin: { description: 'URL to privacy policy page' },
    },
    {
      name: 'cookie_banner_decline_text',
      type: 'text',
      localized: true,
      admin: { description: 'Decline button label' },
    },
    {
      name: 'cookie_banner_accept_text',
      type: 'text',
      localized: true,
      admin: { description: 'Accept button label' },
    },

    // ── CTA Defaults ──
    {
      name: 'cta_defaults',
      type: 'group',
      admin: { description: 'Fallback CTA text used across the site' },
      fields: [
        {
          name: 'primary_label',
          type: 'text',
          localized: true,
          admin: { description: 'Default primary CTA (e.g., "Book Your Tour")' },
        },
        {
          name: 'primary_url',
          type: 'text',
          admin: { description: 'Default primary CTA URL' },
        },
        {
          name: 'secondary_label',
          type: 'text',
          localized: true,
          admin: { description: 'Default secondary CTA (e.g., "Contact Us")' },
        },
        {
          name: 'secondary_url',
          type: 'text',
          admin: { description: 'Default secondary CTA URL' },
        },
        {
          name: 'whatsapp_label',
          type: 'text',
          localized: true,
          admin: { description: 'WhatsApp CTA fallback text' },
        },
      ],
    },

    // ── Social Proof Platforms ──
    {
      name: 'social_proof_platforms',
      type: 'array',
      maxRows: 5,
      admin: {
        initCollapsed: true,
        description: 'Review platforms displayed in badges (TripAdvisor, Google, etc.)',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'TripAdvisor', value: 'tripadvisor' },
            { label: 'Google', value: 'google' },
            { label: 'Trustpilot', value: 'trustpilot' },
            { label: 'Facebook', value: 'facebook' },
          ],
          required: true,
        },
        { name: 'rating', type: 'text', admin: { description: 'e.g., "4.9"' } },
        { name: 'review_count', type: 'text', admin: { description: 'e.g., "520+"' } },
        { name: 'url', type: 'text', admin: { description: 'Link to profile/reviews' } },
      ],
    },

    // ── Error Page ──
    {
      name: 'error_page',
      type: 'group',
      admin: { description: '404 / error page content' },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          admin: { description: '404 page heading' },
        },
        {
          name: 'body',
          type: 'textarea',
          localized: true,
          admin: { description: '404 page message' },
        },
        {
          name: 'cta_label',
          type: 'text',
          localized: true,
          admin: { description: 'Button text (e.g., "Back to Home")' },
        },
        {
          name: 'cta_url',
          type: 'text',
          admin: { description: 'Button URL' },
        },
      ],
    },
  ],
}
