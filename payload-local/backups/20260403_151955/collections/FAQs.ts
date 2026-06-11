import type { CollectionConfig } from 'payload'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    group: 'Content',
    description: '❓ Frequently asked questions',
    defaultColumns: ['question', 'category', 'workflowStatus', 'sort_order'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => ['admin', 'editor'].includes((user as any)?.role),
    update: ({ req: { user } }) => ['admin', 'editor', 'reviewer'].includes((user as any)?.role),
    delete: ({ req: { user } }) => (user as any)?.role === 'admin',
  },
  versions: {
    drafts: {
      autosave: {
        interval: 300000,
      },
    },
    maxPerDoc: 50,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'textarea',
    },
    {
      name: 'category',
      type: 'text',
    },
    {
      name: 'sort_order',
      type: 'number',
      admin: {
        description: 'Sort order (lower numbers first)',
      },
    },
    {
      name: 'tags',
      type: 'text',
    },
    {
      name: 'page_visibility',
      type: 'text',
    },
    {
      name: 'tour_id',
      type: 'number',
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
