import type { CollectionConfig } from 'payload'

export const TravelTypes: CollectionConfig = {
  slug: 'travel_types',
  admin: {
    group: 'Reference Data',
    description: '🧳 Traveler type references (Couples, Solo, Family, Foodie)',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'icon', 'status'],
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => ['admin', 'editor'].includes((user as any)?.role),
    update: ({ req: { user } }) => ['admin', 'editor', 'reviewer'].includes((user as any)?.role),
    delete: ({ req: { user } }) => (user as any)?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Auto-generated from name' },
    },
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
      index: true,
    },
  ],
  hooks: {
    beforeChange: [
      ({ operation, data }) => {
        if (operation === 'create' && data.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
        }
        return data
      },
    ],
  },
}
