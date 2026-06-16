import type { CollectionConfig } from 'payload'

export const DirectionsPage: CollectionConfig = {
  slug: 'directions_page',
  admin: {
    useAsTitle: 'seo_title',
    group: 'Pages',
    description: '📍 Meeting Points & Directions page content',
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
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'seo_title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'seo_description',
      type: 'textarea',
      localized: true,
      required: true,
    },
    {
      name: 'hero_title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'hero_description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'hero_image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Hero image — select from media library' },
    },
    {
      name: 'meeting_points',
      type: 'array',
      localized: true,
      admin: { description: 'Meeting point locations for different tours' },
      fields: [
        {
          name: 'tour',
          type: 'text',
          required: true,
          admin: { description: 'Tour name this meeting point is for' },
        },
        {
          name: 'location_name',
          type: 'text',
          required: true,
        },
        {
          name: 'address',
          type: 'text',
        },
        {
          name: 'directions',
          type: 'textarea',
          admin: { description: 'Detailed directions to get there' },
        },
        {
          name: 'landmark',
          type: 'text',
          admin: { description: 'Nearby landmark to look for' },
        },
        {
          name: 'map_url',
          type: 'text',
          admin: { description: 'Google Maps URL' },
        },
        {
          name: 'parking_info',
          type: 'text',
        },
        {
          name: 'public_transport',
          type: 'text',
          admin: { description: 'Nearest LRT/MRT/bus stop' },
        },
      ],
    },
    {
      name: 'general_tips',
      type: 'array',
      localized: true,
      admin: { description: 'General tips for finding meeting points' },
      fields: [
        {
          name: 'tip',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
