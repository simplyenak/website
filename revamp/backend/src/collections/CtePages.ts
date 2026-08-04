import type { CollectionConfig } from 'payload'

export const CtePages: CollectionConfig = {
  slug: 'cte_pages',
  admin: {
    useAsTitle: 'title',
    group: 'CTE',
    description: '📄 CTE static pages',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
