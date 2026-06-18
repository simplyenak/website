import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

export const HowItWorksPage: CollectionConfig = {
  slug: 'how_it_works_page',
  hooks: {
    afterChange: [triggerStagingDeploy],
  },
  admin: {
    useAsTitle: 'hero_title',
    group: 'Pages',
    description: '📋 How It Works page content',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => ['admin', 'editor'].includes((user as any)?.role),
    update: ({ req: { user } }) => ['admin', 'editor', 'reviewer'].includes((user as any)?.role),
    delete: ({ req: { user } }) => (user as any)?.role === 'admin',
  },
  versions: {
    drafts: {
      autosave: {
        interval: 3000,
      },
    },
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'hero_title',
      type: 'text',
      localized: true,
      required: true,
      admin: { description: 'Page hero title' },
    },
    {
      name: 'hero_subtitle',
      type: 'text',
      localized: true,
      admin: { description: 'Hero subtitle' },
    },
    {
      name: 'steps_title',
      type: 'text',
      localized: true,
      admin: { description: 'Section title for tour steps' },
    },
    {
      name: 'steps',
      type: 'array',
      localized: true,
      required: true,
      admin: { description: 'Step-by-step tour process' },
      fields: [
        {
          name: 'number',
          type: 'number',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'detail',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'inclusions_title',
      type: 'text',
      localized: true,
      admin: { description: 'Section title for what\'s included' },
    },
    {
      name: 'inclusions',
      type: 'array',
      localized: true,
      admin: { description: 'Items included in every tour' },
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'formats_title',
      type: 'text',
      localized: true,
      admin: { description: 'Section title for tour formats' },
    },
    {
      name: 'formats_subtitle',
      type: 'text',
      localized: true,
      admin: { description: 'Subtitle for tour formats section' },
    },
    {
      name: 'formats',
      type: 'array',
      localized: true,
      admin: { description: 'Tour format options (join-in, private, etc.)' },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'seo_title',
      type: 'text',
      localized: true,
      admin: { description: 'SEO meta title' },
    },
    {
      name: 'seo_description',
      type: 'textarea',
      localized: true,
      admin: { description: 'SEO meta description' },
    },
  ],
}
