import type { CollectionConfig } from 'payload'

export const MediaCoverage: CollectionConfig = {
  slug: 'media_coverage',
  admin: {
    useAsTitle: 'outlet',
    group: 'Content',
    description: '📰 Press mentions, awards, and media features',
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
      type: 'text',
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
