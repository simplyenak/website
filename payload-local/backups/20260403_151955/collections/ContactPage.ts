import type { CollectionConfig } from 'payload'

export const ContactPage: CollectionConfig = {
  slug: 'contact_page',
  admin: {
    group: 'Pages',
    description: 'Contact page content',
  },
  fields: [
    {
      name: 'seo_title',
      type: 'text',
    },
    {
      name: 'seo_description',
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
      name: 'contact_intro',
      type: 'textarea',
    },
    {
      name: 'email',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'whatsapp',
      type: 'text',
    },
    {
      name: 'social_media',
      type: 'json',
    },
    {
      name: 'faq_section',
      type: 'textarea',
    },
  ],
}
