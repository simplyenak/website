import type { CollectionConfig } from 'payload'

export const LocationLandingPages: CollectionConfig = {
  slug: 'location_landing_pages',
  admin: {
    group: 'Landing Pages',
    description: 'Location-based landing pages (Kuala Lumpur, Penang, etc.)',
    useAsTitle: 'location_name',
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
    },
    {
      name: 'location_name',
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
      name: 'hero_title',
      type: 'text',
    },
    {
      name: 'hero_subtitle',
      type: 'text',
    },
    {
      name: 'hero_description',
      type: 'textarea',
    },
    {
      name: 'hero_image',
      type: 'text',
    },
    {
      name: 'intro_title',
      type: 'text',
    },
    {
      name: 'intro_content',
      type: 'textarea',
    },
    {
      name: 'intro_image',
      type: 'text',
    },
    {
      name: 'best_time_to_visit',
      type: 'textarea',
    },
    {
      name: 'getting_around',
      type: 'textarea',
    },
    {
      name: 'what_to_pack',
      type: 'textarea',
    },
    {
      name: 'meta_title',
      type: 'text',
    },
    {
      name: 'meta_description',
      type: 'textarea',
    },
    {
      name: 'published_at',
      type: 'date',
    },
  ],
}
