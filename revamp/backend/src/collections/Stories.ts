import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'
import { preventEmptyPublish } from '../hooks/preventEmptyPublish'

export const Stories: CollectionConfig = {
  slug: 'stories',
  localization: true,
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    description: '📰 Blog posts and articles',
    defaultColumns: ['title', 'author', 'workflowStatus', 'publishedDate'],
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
  hooks: {
    beforeChange: [preventEmptyPublish],
    afterChange: [triggerStagingDeploy],
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
      name: 'specialtyExperiences',
      type: 'relationship',
      relationTo: 'specialty_experiences',
      hasMany: true,
      admin: {
        description: 'Tag this story with specialty experiences (e.g. First Time Visitors, Street Food)',
        position: 'sidebar',
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
      name: 'content',
      type: 'richText',
      required: true,
            admin: {
        description: 'Full blog post content',
      },
    },
    {
      name: 'content_markdown',
      type: 'textarea',
      admin: {
        description: 'Markdown version of content — used for static site rendering. If empty, site falls back to richText conversion.',
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
    // SEO — standalone fields (frontend reads s.meta_title, not s.meta?.title)
    {
      name: 'meta_title',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'SEO title (< 60 chars). Falls back to story title if empty.',
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
      name: 'locationsRef',
      type: 'relationship',
      relationTo: 'locations',
      hasMany: true,
      admin: {
        description: 'Locations covered in this story (KL, Penang, Ipoh, etc.)',
        position: 'sidebar',
      },
    },
  ],
}
