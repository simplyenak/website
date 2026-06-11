import type { CollectionConfig } from 'payload'

export const HowToPreparePage: CollectionConfig = {
  slug: 'how_to_prepare_page',
  admin: {
    useAsTitle: 'seo_title',
    group: 'Pages',
    description: '🎒 How to Prepare page content',
  },
  localized: true,
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
      required: true,
      admin: { description: 'SEO meta title' },
    },
    {
      name: 'seo_description',
      type: 'textarea',
      required: true,
      admin: { description: 'SEO meta description' },
    },
    {
      name: 'hero_title',
      type: 'text',
      required: true,
    },
    {
      name: 'hero_description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'hero_image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Hero image — select from media library' },
    },
    {
      name: 'whatToWear',
      type: 'array',
      admin: { description: 'What to wear items' },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
    {
      name: 'whatToBring',
      type: 'array',
      admin: { description: 'What to bring items' },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
    {
      name: 'whatToExpect',
      type: 'array',
      admin: { description: 'What to expect steps/items' },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
    {
      name: 'dietary_heading',
      type: 'text',
      admin: { description: 'Dietary requirements section heading' },
    },
    {
      name: 'dietary_intro',
      type: 'textarea',
      admin: { description: 'Intro text for dietary section' },
    },
    {
      name: 'dietary_notes',
      type: 'array',
      admin: { description: 'Specific dietary notes/tips' },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
    {
      name: 'directions_cta_text',
      type: 'text',
      admin: { description: 'CTA text for directions link' },
    },
    {
      name: 'directions_cta_button',
      type: 'text',
      admin: { description: 'CTA button label for directions' },
    },
  ],
}
