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
        interval: 3000,
      },
    },
    maxPerDoc: 50,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      admin: {
        description: 'The question as a visitor would ask it',
      },
    },
    {
      name: 'answer',
      type: 'richText',
      admin: {
        description: 'Full answer — supports formatting, links, and lists',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Booking', value: 'booking' },
        { label: 'Dietary', value: 'dietary' },
        { label: 'Transport', value: 'transport' },
        { label: 'Private Tours', value: 'private_tours' },
        { label: 'About Us', value: 'about_us' },
      ],
      admin: {
        description: 'Topic area for this FAQ',
        position: 'sidebar',
      },
    },
    {
      name: 'page_visibility',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'All pages', value: 'all' },
        { label: 'Home', value: 'home' },
        { label: 'Tours', value: 'tours' },
        { label: 'About', value: 'about' },
        { label: 'Contact', value: 'contact' },
      ],
      admin: {
        description: 'Which pages should display this FAQ',
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Free-form tags for grouping and search (e.g. "halal", "payment", "group-size")',
      },
    },
    {
      name: 'relatedTour',
      type: 'relationship',
      relationTo: 'tours',
      admin: {
        description: 'Link to a specific tour this FAQ belongs to',
        position: 'sidebar',
      },
    },
    {
      name: 'relatedStory',
      type: 'relationship',
      relationTo: 'stories',
      admin: {
        description: 'Link to a blog post that answers this question in detail',
        position: 'sidebar',
      },
    },
    {
      name: 'sort_order',
      type: 'number',
      admin: {
        description: 'Sort order within its category (lower numbers appear first)',
        position: 'sidebar',
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
