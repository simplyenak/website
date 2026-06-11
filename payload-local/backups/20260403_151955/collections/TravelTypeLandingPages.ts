import type { CollectionConfig } from 'payload'

export const TravelTypeLandingPages: CollectionConfig = {
  slug: 'travel_type_landing_pages',
  admin: {
    group: 'Landing Pages',
    description: 'Travel type landing pages (Family, Couples, Solo, etc.)',
    useAsTitle: 'travel_type_name',
  },
  fields: [
    {
      name: 'travel_type_name',
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
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
    },
    {
      name: 'icon',
      type: 'text',
    },
    {
      name: 'color',
      type: 'text',
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
      name: 'why_perfect_title',
      type: 'text',
    },
    {
      name: 'why_perfect_content',
      type: 'textarea',
    },
    {
      name: 'what_to_expect',
      type: 'textarea',
    },
    {
      name: 'tips_content',
      type: 'textarea',
    },
    {
      name: 'suitable_tours',
      type: 'json',
    },
    {
      name: 'key_features',
      type: 'json',
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
