import type { CollectionConfig } from 'payload'

export const TrackRecordPage: CollectionConfig = {
  slug: 'track_record_page',
  admin: {
    useAsTitle: 'seo_title',
    group: 'Pages',
    description: '🏆 Track Record page content',
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
      name: 'seo_title',
      type: 'text',
      required: true,
    },
    {
      name: 'seo_description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'hero_title',
      type: 'text',
      required: true,
    },
    {
      name: 'hero_subtitle',
      type: 'textarea',
    },
    {
      name: 'philosophy_quote',
      type: 'textarea',
      admin: { description: 'Philosophy/mission quote block' },
    },
    {
      name: 'stats',
      type: 'array',
      admin: { description: 'Key statistics/metrics' },
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'segments',
      type: 'array',
      admin: { description: 'Guest segments served (corporate, families, etc.)' },
      fields: [
        {
          name: 'num',
          type: 'text',
          admin: { description: 'Segment number (e.g., "01")' },
        },
        {
          name: 'emoji',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'case_studies',
      type: 'array',
      admin: { description: 'Case studies / client stories' },
      fields: [
        {
          name: 'client',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'text',
          admin: { description: 'Client type (e.g., "Fortune 500", "Government agency")' },
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'press',
      type: 'array',
      admin: { description: 'Press mentions and media features' },
      fields: [
        {
          name: 'outlet',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
    {
      name: 'awards',
      type: 'array',
      admin: { description: 'Awards and recognitions' },
      fields: [
        {
          name: 'award',
          type: 'text',
          required: true,
        },
        {
          name: 'year',
          type: 'number',
        },
        {
          name: 'organization',
          type: 'text',
        },
      ],
    },
    {
      name: 'how_we_work_eyebrow',
      type: 'text',
      admin: { description: 'Eyebrow text for "How we work" section' },
    },
  ],
}
