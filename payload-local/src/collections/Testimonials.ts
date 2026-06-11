import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'author_name',
    group: 'Content',
    description: '⭐ Customer reviews and testimonials',
    defaultColumns: ['author_name', 'rating', 'relatedTours', 'workflowStatus'],
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
      name: 'author_name',
      type: 'text',
      required: true,
      admin: {
        description: 'Reviewer name',
      },
    },
    {
      name: 'author_location',
      type: 'text',
      admin: {
        description: 'Reviewer location (e.g., "Australia")',
      },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      admin: {
        description: 'Star rating (1-5)',
      },
    },
    {
      name: 'review_text',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Full review text',
      },
    },
    {
      name: 'review_title',
      type: 'text',
      admin: {
        description: 'Short review title/summary',
      },
    },
    {
      name: 'author_photo',
      type: 'text',
      admin: {
        description: 'Author photo URL (optional)',
      },
    },
    {
      name: 'date',
      type: 'date',
      admin: {
        description: 'When review was submitted',
      },
    },
    {
      name: 'visibility',
      type: 'group',
      fields: [
        {
          name: 'verified',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Verified customer review',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show on homepage',
          },
        },
      ],
    },
    {
      name: 'platform',
      type: 'text',
      admin: {
        description: 'Source platform (Google, TripAdvisor, etc.)',
      },
    },
    {
      name: 'relatedTours',
      type: 'relationship',
      relationTo: 'tours',
      hasMany: true,
      admin: {
        description: 'Pick the specific tours where this review should appear. Leave empty and check "Show on all tours" below to show it everywhere.',
        position: 'sidebar',
      },
    },
    {
      name: 'page_visibility',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Show on all tour pages', value: 'tours' },
        { label: 'Show on homepage', value: 'home' },
        { label: 'Show on About page', value: 'about' },
      ],
      admin: {
        description: 'General pages to show this review on. "Show on all tour pages" acts as a fallback when no specific tours are picked above.',
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
