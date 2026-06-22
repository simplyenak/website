import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

export const Pages: CollectionConfig = {
  slug: 'pages',
  hooks: {
    afterChange: [triggerStagingDeploy],
  },
  admin: {
    useAsTitle: 'title',
    group: 'Pages',
    description: '📄 Generic content pages — neighborhood guides, segment pages, city overviews',
    defaultColumns: ['title', 'type', 'slug', 'status', 'location'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => ['admin', 'editor'].includes((user as any)?.role),
    update: ({ req: { user } }) => ['admin', 'editor', 'reviewer'].includes((user as any)?.role),
    delete: ({ req: { user } }) => (user as any)?.role === 'admin',
  },
  versions: {
    drafts: {
      autosave: { interval: 3000 },
    },
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
            required: true,
      admin: { description: 'Page title (e.g., "Food Tour around Little India")' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL-friendly slug (e.g., "food-tour-around-little-india")' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: '🏘️ Neighborhood', value: 'neighborhood' },
        { label: '🎯 Segment', value: 'segment' },
        { label: '🥗 Dietary', value: 'dietary' },
        { label: '🏙️ City', value: 'city' },
        { label: '📝 General', value: 'general' },
      ],
      admin: {
        description: 'What kind of page is this?',
        position: 'sidebar',
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
      admin: { position: 'sidebar' },
    },
    {
      name: 'location',
      type: 'text',
      admin: { description: 'City/location for linking to real tours (e.g., "Penang", "Kuala Lumpur")' },
    },
    {
      name: 'tagline',
      type: 'text',
            admin: { description: 'Short tagline shown under the title' },
    },

    // === HERO SECTION ===
    {
      name: 'hero_title',
      type: 'text',
            admin: { description: 'Hero section title (defaults to page title if empty)' },
    },
    {
      name: 'hero_subtitle',
      type: 'text',
            admin: { description: 'Hero subtitle / eyebrow' },
    },
    {
      name: 'hero_description',
      type: 'textarea',
            admin: { description: 'Hero paragraph' },
    },
    {
      name: 'hero_image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Hero image — select from media library' },
    },

    // === CONTENT SECTION ===
    {
      name: 'short_description',
      type: 'textarea',
            admin: { description: 'Short description for cards/previews' },
    },
    {
      name: 'full_description',
      type: 'textarea',
            admin: { description: 'Full page content (supports multi-paragraph)' },
    },

    // === HIGHLIGHTS ===
    {
      name: 'highlights',
      type: 'array',
            admin: { description: 'Key highlights of this page content' },
      fields: [
        { name: 'item', type: 'text', required: true },
      ],
    },

    // === PRICING/DURATION (for tours that may become bookable later) ===
    {
      name: 'price',
      type: 'text',
      admin: { description: 'Indicative price (e.g., "285") — informational only' },
    },
    {
      name: 'duration',
      type: 'text',
      admin: { description: 'Indicative duration in hours (e.g., "4.0") — informational only' },
    },
    {
      name: 'max_participants',
      type: 'number',
      admin: { description: 'Max group size — informational only' },
    },

    // === SEO — handled by @payloadcms/plugin-seo (meta group with title, description, image) ===

    // === ORDERING ===
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Sort order (lower = first)', position: 'sidebar' },
    },
  ],
}
