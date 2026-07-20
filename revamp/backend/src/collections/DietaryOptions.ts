import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

export const DietaryOptions: CollectionConfig = {
  slug: 'dietary_options',
  localization: true,
  admin: {
    useAsTitle: 'name',
    group: 'Reference Data',
    description: '🥗 Dietary options reference (Vegetarian, Halal, Vegan, etc.)',
    defaultColumns: ['name', 'slug', 'icon', 'color', 'status'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => ['admin', 'editor'].includes((user as any)?.role),
    update: ({ req: { user } }) => ['admin', 'editor', 'reviewer'].includes((user as any)?.role),
    delete: ({ req: { user } }) => (user as any)?.role === 'admin',
  },
  hooks: {
    afterChange: [triggerStagingDeploy],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
            admin: {
        description: 'Dietary option name (e.g., "Vegetarian", "Halal")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "vegetarian")',
      },
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Icon name or emoji (e.g., "🌱", "leaf")',
      },
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Color code for UI display (e.g., "#22c55e")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
            admin: {
        description: 'Brief description of this dietary option',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Card background image for the tours listing page',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'published',
      admin: {
        description: 'Draft = hidden, Published = available for selection',
      },
    },
    {
      name: 'scheduledPublish',
      type: 'date',
      admin: {
        description: 'Auto-publish at this date/time',
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        description: 'When this dietary option was published',
      },
    },
  ],
}
