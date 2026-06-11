import type { CollectionConfig } from 'payload'

export const DietaryLandingPages: CollectionConfig = {
  slug: 'dietary_landing_pages',
  admin: {
    group: 'Landing Pages',
    description: 'Dietary-specific landing pages (Vegetarian, Halal, etc.)',
    useAsTitle: 'dietary_name',
  },
  fields: [
    {
      name: 'dietary_name',
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
      name: 'challenges_title',
      type: 'text',
    },
    {
      name: 'challenges_content',
      type: 'textarea',
    },
    {
      name: 'options_title',
      type: 'text',
    },
    {
      name: 'options_content',
      type: 'textarea',
    },
    {
      name: 'tips_content',
      type: 'textarea',
    },
    {
      name: 'safe_dishes',
      type: 'json',
    },
    {
      name: 'dishes_to_avoid',
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
