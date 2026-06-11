import type { CollectionConfig } from 'payload'

export const ContactPage: CollectionConfig = {
  slug: 'contact_page',
  admin: {
    group: 'Pages',
    description: '📞 Contact page content',
  },
  fields: [
    // SEO
    { name: 'seo_title', type: 'text', admin: { group: 'SEO' } },
    { name: 'seo_description', type: 'textarea', admin: { group: 'SEO' } },

    // Hero Section (blocks)
    {
      name: 'heroSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Page hero with title and subtitle' },
      blocks: [{
        slug: 'heroBlock',
        labels: { singular: 'Hero Block', plural: 'Hero Blocks' },
        fields: [
          { name: 'title', type: 'text' },
          { name: 'subtitle', type: 'text' },
        ],
      }],
    },

    // Contact Intro (blocks)
    {
      name: 'contactIntroSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Introduction text before contact details' },
      blocks: [{
        slug: 'introBlock',
        labels: { singular: 'Intro Block', plural: 'Intro Blocks' },
        fields: [
          { name: 'content', type: 'textarea' },
        ],
      }],
    },

    // Contact Channels (blocks)
    {
      name: 'contactChannelsSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Email, phone, WhatsApp contact details' },
      blocks: [{
        slug: 'channelsBlock',
        labels: { singular: 'Channels Block', plural: 'Channels Blocks' },
        fields: [
          {
            name: 'channels',
            type: 'array',
            maxRows: 5,
            admin: { initCollapsed: true, description: 'Contact channels (email, phone, WhatsApp, etc.)' },
            fields: [
              { name: 'type', type: 'select', options: [
                { label: 'Email', value: 'email' },
                { label: 'Phone', value: 'phone' },
                { label: 'WhatsApp', value: 'whatsapp' },
                { label: 'Website', value: 'website' },
                { label: 'Other', value: 'other' },
              ], required: true },
              { name: 'value', type: 'text', required: true },
              { name: 'label', type: 'text' },
            ],
          },
        ],
      }],
    },

    // Social Links (blocks)
    {
      name: 'socialLinksSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Social media links' },
      blocks: [{
        slug: 'socialBlock',
        labels: { singular: 'Social Block', plural: 'Social Blocks' },
        fields: [
          {
            name: 'links',
            type: 'array',
            maxRows: 10,
            admin: { initCollapsed: true, description: 'Social media links' },
            fields: [
              { name: 'platform', type: 'text', required: true },
              { name: 'url', type: 'text', required: true },
            ],
          },
        ],
      }],
    },

    // FAQ Section (blocks)
    {
      name: 'faqSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'FAQ content for contact page' },
      blocks: [{
        slug: 'faqBlock',
        labels: { singular: 'FAQ Block', plural: 'FAQ Blocks' },
        fields: [
          { name: 'content', type: 'textarea' },
        ],
      }],
    },
  ],
}
