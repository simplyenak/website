import type { CollectionConfig } from 'payload'

export const CorporateGroupsPage: CollectionConfig = {
  slug: 'corporate_groups_page',
  admin: {
    useAsTitle: 'seo_title',
    group: 'Pages',
    description: '🏢 Corporate & Group Tours page content',
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
      name: 'hero_eyebrow',
      type: 'text',
      localized: true,
      admin: { description: 'Small label above hero title' },
    },
    {
      name: 'hero_title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'hero_subtitle',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'offer_eyebrow',
      type: 'text',
      localized: true,
    },
    {
      name: 'offer_heading',
      type: 'text',
      localized: true,
    },
    {
      name: 'offer_body_1',
      type: 'textarea',
      localized: true,
      admin: { description: 'Main offer description text' },
    },
    {
      name: 'offer_perfect_for',
      type: 'array',
      localized: true,
      admin: { description: '"Perfect for" list items' },
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'offer_body_2',
      type: 'textarea',
      localized: true,
      admin: { description: 'Secondary offer text' },
    },
    {
      name: 'benefits_eyebrow',
      type: 'text',
      localized: true,
    },
    {
      name: 'benefits_title',
      type: 'text',
      localized: true,
    },
    {
      name: 'benefit_cards',
      type: 'array',
      localized: true,
      admin: { description: 'Feature/benefit cards' },
      fields: [
        {
          name: 'icon',
          type: 'text',
          admin: { description: 'Emoji or icon' },
        },
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
      name: 'kl_section',
      type: 'group',
      localized: true,
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
        },
        {
          name: 'heading',
          type: 'text',
        },
        {
          name: 'subtext',
          type: 'textarea',
        },
      ],
      admin: { description: 'Kuala Lumpur corporate tour section' },
    },
    {
      name: 'penang_section',
      type: 'group',
      localized: true,
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
        },
        {
          name: 'heading',
          type: 'text',
        },
        {
          name: 'subtext',
          type: 'textarea',
        },
      ],
      admin: { description: 'Penang corporate tour section' },
    },
    {
      name: 'how_eyebrow',
      type: 'text',
      localized: true,
    },
    {
      name: 'how_heading',
      type: 'text',
      localized: true,
    },
    {
      name: 'how_steps',
      type: 'array',
      localized: true,
      admin: { description: 'How it works steps for corporate groups' },
      fields: [
        {
          name: 'number',
          type: 'number',
        },
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
      name: 'cta_heading',
      type: 'text',
      localized: true,
    },
    {
      name: 'cta_body',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'cta_email_label',
      type: 'text',
      localized: true,
    },
    {
      name: 'cta_whatsapp_label',
      type: 'text',
      localized: true,
    },
  ],
}
