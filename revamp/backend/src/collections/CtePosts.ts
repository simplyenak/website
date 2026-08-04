import type { CollectionConfig } from 'payload'

export const CtePosts: CollectionConfig = {
  slug: 'cte_posts',
  admin: {
    useAsTitle: 'title',
    group: 'CTE',
    description: '📝 CTE blog posts and articles',
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
      name: 'excerpt',
      type: 'textarea',
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
    {
      name: 'publishedDate',
      type: 'date',
    },
  ],
}
