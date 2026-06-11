import type { CollectionConfig } from 'payload'

export const SiteSettings: CollectionConfig = {
  slug: 'site_settings',
  admin: {
    group: 'Settings & Config',
    description: 'Global site settings and configuration',
  },
  fields: [
    {
      name: 'site_name',
      type: 'text',
    },
    {
      name: 'tagline',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'hero_title',
      type: 'text',
    },
    {
      name: 'hero_subtitle',
      type: 'text',
    },
    {
      name: 'hero_description',
      type: 'textarea',
    },
    {
      name: 'hero_image',
      type: 'text',
    },
    {
      name: 'booking_url',
      type: 'text',
    },
    {
      name: 'social_media',
      type: 'json',
    },
    {
      name: 'contact_email',
      type: 'text',
    },
    {
      name: 'contact_phone',
      type: 'text',
    },
    {
      name: 'whatsapp_number',
      type: 'text',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'meta_title',
      type: 'text',
    },
    {
      name: 'meta_description',
      type: 'textarea',
    },
    // Navigation Menus
    {
      name: 'main_navigation',
      type: 'json',
      admin: {
        description: 'Main navigation menu items (JSON array of {label, url})',
      },
    },
    {
      name: 'mobile_navigation',
      type: 'json',
      admin: {
        description: 'Mobile navigation menu items (JSON array of {label, url})',
      },
    },
    {
      name: 'footer_navigation',
      type: 'json',
      admin: {
        description: 'Footer navigation menu items (JSON array of {label, url})',
      },
    },
    {
      name: 'footer_copyright_text',
      type: 'text',
      admin: {
        description: 'Copyright text displayed in footer',
      },
    },
    {
      name: 'sub_page_menus',
      type: 'json',
      admin: {
        description: 'Sub-page menus (JSON object with menu keys and arrays of items)',
      },
    },
  ],
}
