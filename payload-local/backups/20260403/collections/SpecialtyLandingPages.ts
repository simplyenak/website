import type { CollectionConfig } from 'payload'

export const SpecialtyLandingPages: CollectionConfig = {
  slug: 'specialty_landing_pages',
  admin: {
    group: 'Landing Pages',
    description: 'Specialty landing pages (Street Food, Market Tours, etc.)',
    useAsTitle: 'specialty_name',
  },
  fields: [
    {
      name: 'specialty_name',
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
      name: 'experience_title',
      type: 'text',
    },
    {
      name: 'experience_content',
      type: 'textarea',
    },
    {
      name: 'what_makes_special',
      type: 'textarea',
    },
    {
      name: 'highlights',
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
