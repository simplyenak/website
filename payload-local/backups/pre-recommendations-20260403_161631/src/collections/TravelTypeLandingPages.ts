import type { CollectionConfig } from 'payload'

export const TravelTypeLandingPages: CollectionConfig = {
  slug: 'travel_type_landing_pages',
  admin: {
    group: 'Landing Pages',
    description: '🧳 Travel type landing pages (Family, Couples, Solo, etc.)',
    useAsTitle: 'travel_type_name',
  },
  fields: [
    { name: 'travel_type_name', type: 'text', required: true },
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

    // Why Perfect Section (blocks)
    {
      name: 'whyPerfectSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Why this travel type is perfect for our tours' },
      blocks: [{
        slug: 'contentBlock',
        labels: { singular: 'Content Block', plural: 'Content Blocks' },
        fields: [
          { name: 'title', type: 'text' },
          { name: 'content', type: 'textarea' },
        ],
      }],
    },

    // What to Expect Section (blocks)
    {
      name: 'expectSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'What to expect on tours for this travel type' },
      blocks: [{
        slug: 'contentBlock',
        labels: { singular: 'Content Block', plural: 'Content Blocks' },
        fields: [
          { name: 'content', type: 'textarea' },
        ],
      }],
    },

    // Tips Section (blocks)
    {
      name: 'tipsSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Tips for this travel type' },
      blocks: [{
        slug: 'tipsBlock',
        labels: { singular: 'Tips Block', plural: 'Tips Blocks' },
        fields: [
          { name: 'content', type: 'textarea' },
        ],
      }],
    },

    // Suitable Tours Section (blocks)
    {
      name: 'suitableToursSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Which tours suit this travel type' },
      blocks: [{
        slug: 'tourListBlock',
        labels: { singular: 'Tour List Block', plural: 'Tour List Blocks' },
        fields: [
          {
            name: 'tours',
            type: 'array',
            maxRows: 10,
            admin: { initCollapsed: true, description: 'Tour slugs that suit this travel type' },
            fields: [{ name: 'slug', type: 'text', required: true }],
          },
        ],
      }],
    },

    // Key Features Section (blocks)
    {
      name: 'keyFeaturesSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Key features of this travel type' },
      blocks: [{
        slug: 'featuresBlock',
        labels: { singular: 'Features Block', plural: 'Features Blocks' },
        fields: [
          {
            name: 'features',
            type: 'array',
            maxRows: 10,
            admin: { initCollapsed: true, description: 'Key features' },
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
