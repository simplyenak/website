import type { CollectionConfig } from 'payload'

export const MediaCoverage: CollectionConfig = {
  slug: 'media_coverage',
  admin: {
    useAsTitle: 'outlet',
    group: 'Content',
    description: '📰 Press mentions, awards, and media features',
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
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
      localized: true,
    },
    {
      name: 'url',
      type: 'text',
    },
    {
      name: 'label',
      type: 'text',
      localized: true,
    },
    {
      name: 'logo_domain',
      type: 'text',
    },
    {
      name: 'highlight',
      type: 'text',
      localized: true,
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
