import type { CollectionConfig } from 'payload'

export const Stories: CollectionConfig = {
  slug: 'stories',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    description: '📰 Blog posts and articles',
    defaultColumns: ['title', 'category', 'author', 'workflowStatus', 'publishedDate'],
    components: {
      views: {
        list: {
          Component: '@/components/admin/stories/list',
        },
      },
    },
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
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Blog post title',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'Author of this story',
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short summary for listing pages (2-3 sentences)',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: '🍜 Vendor Stories', value: 'vendor-stories' },
        { label: '🗺️ Local Guides', value: 'local-guides' },
        { label: '🎓 Expert Corner', value: 'expert-corner' },
      ],
      defaultValue: 'local-guides',
      admin: {
        description: 'Content category for organization and filtering',
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Full blog post content',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        description: 'Publication date',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main story image — upload or select from media library',
      },
    },
    // SEO fields are handled by seoPlugin
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: {
        description: 'Draft = hidden, Published = visible',
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
    {
      name: 'scheduledPublish',
      type: 'date',
      admin: {
        description: 'Auto-publish at this date/time (leave empty for immediate)',
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'specialtyExperiences',
      type: 'relationship',
      relationTo: ['landing_pages', 'specialty_experiences'],
      hasMany: true,
      admin: {
        description: 'Select specialty experiences (Heritage, Street Food, Night Tour, Market)',
      },
    },
  ],
}
