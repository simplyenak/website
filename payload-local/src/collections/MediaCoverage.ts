import type { CollectionConfig } from 'payload'

export const MediaCoverage: CollectionConfig = {
  slug: 'media_coverage',
  admin: {
    useAsTitle: 'outlet',
    group: 'Content',
    description: '📰 Press mentions, awards, and media features',
  },
  localized: true,
  access: {
    read: () => true,
    create: ({ req: { user } }) => ['admin', 'editor'].includes((user as any)?.role),
    update: ({ req: { user } }) => ['admin', 'editor'].includes((user as any)?.role),
    delete: ({ req: { user } }) => (user as any)?.role === 'admin',
  },
  fields: [
    {
      name: 'category',
      type: 'text',
    },
    {
      name: 'outlet',
      type: 'text',
      required: true,
    },
    {
      name: 'year',
      type: 'number',
      admin: {
        description: 'Year of publication (e.g. 2024)',
      },
    },
    {
      name: 'detail',
      type: 'textarea',
    },
    {
      name: 'url',
      type: 'text',
    },
    {
      name: 'label',
      type: 'text',
    },
    {
      name: 'logo_domain',
      type: 'text',
    },
    {
      name: 'highlight',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
    },
  ],
}
