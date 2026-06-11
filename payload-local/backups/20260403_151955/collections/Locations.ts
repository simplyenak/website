import type { CollectionConfig } from 'payload'

export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    group: 'Reference Data',
    description: '📍 Location references (Kuala Lumpur, Penang, Ipoh)',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'icon', 'status'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'icon', type: 'text', admin: { description: 'Emoji or icon name' } },
    { name: 'color', type: 'text', admin: { description: 'UI color hex code' } },
    { name: 'description', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'published',
    },
  ],
}
