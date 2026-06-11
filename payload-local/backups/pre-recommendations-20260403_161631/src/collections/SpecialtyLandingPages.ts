import type { CollectionConfig } from 'payload'

export const SpecialtyLandingPages: CollectionConfig = {
  slug: 'specialty_landing_pages',
  admin: {
    group: 'Landing Pages',
    description: '⭐ Specialty landing pages (Street Food, Market Tours, etc.)',
    useAsTitle: 'specialty_name',
  },
  fields: [
    { name: 'specialty_name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'status', type: 'select',
      options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }],
      defaultValue: 'draft',
    },
    { name: 'icon', type: 'text' },
    { name: 'color', type: 'text' },

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

    // Experience Section (blocks)
    {
      name: 'experienceSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'What the experience is about' },
      blocks: [{
        slug: 'contentBlock',
        labels: { singular: 'Content Block', plural: 'Content Blocks' },
        fields: [
          { name: 'title', type: 'text' },
          { name: 'content', type: 'textarea' },
        ],
      }],
    },

    // What Makes Special Section (blocks)
    {
      name: 'specialFeaturesSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'What makes this specialty special' },
      blocks: [{
        slug: 'featuresBlock',
        labels: { singular: 'Features Block', plural: 'Features Blocks' },
        fields: [
          { name: 'content', type: 'textarea' },
          {
            name: 'highlights',
            type: 'array',
            maxRows: 10,
            admin: { initCollapsed: true, description: 'Key highlights' },
            fields: [{ name: 'text', type: 'text', required: true }],
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
