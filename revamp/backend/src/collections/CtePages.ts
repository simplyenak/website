import type { CollectionConfig } from 'payload'

export const CtePages: CollectionConfig = {
  slug: 'cte_pages',
  admin: {
    useAsTitle: 'title',
    group: 'CTE',
    description: '📄 CTE static pages',
    defaultColumns: ['title', 'workflowStatus', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => ['admin', 'editor'].includes((user as any)?.role),
    update: ({ req: { user } }) => ['admin', 'editor', 'reviewer'].includes((user as any)?.role),
    delete: ({ req: { user } }) => (user as any)?.role === 'admin',
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
      name: 'content_markdown',
      type: 'textarea',
      admin: {
        description: 'Page body in Markdown — rendered by the CTE site',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main page image — upload or select from media library',
        position: 'sidebar',
      },
    },
    // SEO — standalone fields (frontend reads cte-pages.json meta_title/meta_description)
    {
      name: 'meta_title',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'SEO title (< 60 chars). Falls back to title if empty.',
      },
    },
    {
      name: 'meta_description',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'SEO meta description (140-160 chars). Falls back to excerpt if empty.',
      },
    },
    {
      name: 'workflowStatus',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Review', value: 'in_review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: {
        description: 'Workflow approval status',
        position: 'sidebar',
      },
    },
  ],
}
