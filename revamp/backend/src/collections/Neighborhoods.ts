import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

export const Neighborhoods: CollectionConfig = {
  slug: 'neighborhoods',
  localization: true,
  admin: {
    group: 'Reference Data',
    description: '🏘️ Neighborhoods and districts featured on tours',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'location', 'status'],
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
  hooks: {
    afterChange: [triggerStagingDeploy],
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
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
            admin: { description: 'Neighborhood name (e.g., "Bukit Bintang")' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL-friendly identifier' },
    },
    {
      name: 'description',
      type: 'textarea',
            admin: { description: 'Short description of the neighborhood' },
    },
    {
      name: 'fullDescription',
      type: 'textarea',
            admin: { description: 'Longer description for detail pages' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Neighborhood hero image' },
    },
    {
      name: 'location',
      type: 'select',
      options: [
        { label: 'Kuala Lumpur', value: 'kuala-lumpur' },
        { label: 'Penang', value: 'penang' },
        { label: 'Ipoh', value: 'ipoh' },
      ],
      admin: { description: 'Which city this neighborhood belongs to' },
    },
    {
      name: 'highlights',
      type: 'array',
      maxRows: 10,
            admin: { initCollapsed: true, description: 'Key highlights or tags' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'foodSpecialties',
      type: 'array',
      maxRows: 10,
            admin: { initCollapsed: true, description: 'Famous dishes from this area' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      name: 'relatedTours',
      type: 'relationship',
      relationTo: 'tours',
      hasMany: true,
      admin: { description: 'Tours that visit this neighborhood' },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: { description: 'Draft = hidden, Published = visible' },
    },
    // SEO
    {
      name: 'meta_title',
      type: 'text',
          },
    {
      name: 'meta_description',
      type: 'textarea',
          },
  ],
}
