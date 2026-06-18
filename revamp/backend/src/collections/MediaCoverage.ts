import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

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
  hooks: {
    afterChange: [triggerStagingDeploy],
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
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Logo image for this press outlet — shows preview in admin',
      },
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
    {
      name: 'page_visibility',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'About page timeline', value: 'about' },
        { label: 'Home page press strip', value: 'home' },
        { label: 'Contact page', value: 'contact' },
      ],
      admin: {
        description: 'Which pages should display this press item',
        position: 'sidebar',
      },
    },
  ],
}
