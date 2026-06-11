import type { CollectionConfig } from 'payload'

export const LocationLandingPages: CollectionConfig = {
  slug: 'location_landing_pages',
  admin: {
    group: 'Landing Pages',
    description: '📍 Location-based landing pages (Kuala Lumpur, Penang, etc.)',
    useAsTitle: 'location_name',
  },
  fields: [
    {
      name: 'status', type: 'select',
      options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }],
      defaultValue: 'draft',
    },
    { name: 'location_name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },

    // Hero Section (blocks)
    {
      name: 'heroSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Hero section with title, subtitle, description, and image' },
      blocks: [{
        slug: 'heroBlock',
        labels: { singular: 'Hero Block', plural: 'Hero Blocks' },
        fields: [
          { name: 'title', type: 'text' },
          { name: 'subtitle', type: 'text' },
          { name: 'description', type: 'textarea' },
          { name: 'image', type: 'text' },
        ],
      }],
    },

    // Intro Section (blocks)
    {
      name: 'introSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Introduction section with image' },
      blocks: [{
        slug: 'introBlock',
        labels: { singular: 'Intro Block', plural: 'Intro Blocks' },
        fields: [
          { name: 'title', type: 'text' },
          { name: 'content', type: 'textarea' },
          { name: 'image', type: 'text' },
        ],
      }],
    },

    // Travel Tips Section (blocks)
    {
      name: 'travelTipsSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Travel tips: best time to visit, getting around, what to pack' },
      blocks: [{
        slug: 'tipsBlock',
        labels: { singular: 'Tips Block', plural: 'Tips Blocks' },
        fields: [
          {
            name: 'tips',
            type: 'array',
            maxRows: 6,
            admin: { initCollapsed: true, description: 'Travel tips (e.g., best time to visit, getting around)' },
            fields: [
              { name: 'title', type: 'text', required: true },
              { name: 'content', type: 'textarea' },
            ],
          },
        ],
      }],
    },

    // SEO
    { name: 'meta_title', type: 'text', admin: { group: 'SEO' } },
    { name: 'meta_description', type: 'textarea', admin: { group: 'SEO' } },
    { name: 'published_at', type: 'date' },
  ],
}
