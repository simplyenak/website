import type { CollectionConfig } from 'payload'

export const AboutPage: CollectionConfig = {
  slug: 'about_page',
  admin: {
    group: 'Pages',
    useAsTitle: 'meta_title',
    description: '📖 About page content',
  },
  localized: true,
  access: {
    read: () => true,
    create: ({ req: { user } }) => ['admin', 'editor'].includes((user as any)?.role),
    update: ({ req: { user } }) => ['admin', 'editor'].includes((user as any)?.role),
    delete: ({ req: { user } }) => (user as any)?.role === 'admin',
  },
  fields: [
    // SEO
    { name: 'seo_title', type: 'text' },
    { name: 'seo_description', type: 'textarea' },

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

    // Founder Story (blocks)
    {
      name: 'founderStorySection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Founder story with title and rich text content' },
      blocks: [{
        slug: 'founderStoryBlock',
        labels: { singular: 'Founder Story Block', plural: 'Founder Story Blocks' },
        fields: [
          { name: 'title', type: 'text' },
          { name: 'content', type: 'textarea' },
        ],
      }],
    },

    // Stats Section (blocks)
    {
      name: 'statsSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Key statistics about Simply Enak' },
      blocks: [{
        slug: 'statsBlock',
        labels: { singular: 'Stats Block', plural: 'Stats Blocks' },
        fields: [
          {
            name: 'stats',
            type: 'array',
            maxRows: 10,
            admin: { initCollapsed: true, description: 'Stat items (number + label)' },
            fields: [
              { name: 'number', type: 'text', required: true },
              { name: 'label', type: 'text', required: true },
            ],
          },
        ],
      }],
    },

    // Timeline Section (blocks)
    {
      name: 'timelineSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Company history timeline' },
      blocks: [{
        slug: 'timelineBlock',
        labels: { singular: 'Timeline Block', plural: 'Timeline Blocks' },
        fields: [
          {
            name: 'events',
            type: 'array',
            maxRows: 30,
            admin: { initCollapsed: true, description: 'Timeline events (year, title, description)' },
            fields: [
              { name: 'year', type: 'text', required: true },
              { name: 'title', type: 'text', required: true },
              { name: 'description', type: 'textarea' },
            ],
          },
        ],
      }],
    },

    // Philosophy Section (blocks)
    {
      name: 'philosophySection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Company philosophy/mission' },
      blocks: [{
        slug: 'philosophyBlock',
        labels: { singular: 'Philosophy Block', plural: 'Philosophy Blocks' },
        fields: [
          { name: 'content', type: 'textarea' },
        ],
      }],
    },

    // Team Section (blocks)
    {
      name: 'teamSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Team members' },
      blocks: [{
        slug: 'teamBlock',
        labels: { singular: 'Team Block', plural: 'Team Blocks' },
        fields: [
          {
            name: 'members',
            type: 'array',
            maxRows: 20,
            admin: { initCollapsed: true, description: 'Team members' },
            fields: [
              { name: 'name', type: 'text', required: true },
              { name: 'role', type: 'text' },
              { name: 'specialty', type: 'text' },
              { name: 'description', type: 'textarea' },
              { name: 'photo', type: 'text' },
            ],
          },
        ],
      }],
    },
  ],
}
