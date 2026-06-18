import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

export const LandingPages: CollectionConfig = {
  slug: 'landing_pages',
  hooks: {
    afterChange: [triggerStagingDeploy],
  },
  admin: {
    useAsTitle: 'title',
    group: 'Landing Pages',
    description: '🗺️ Unified landing pages (dietary, specialty, travel type, location)',
    defaultColumns: ['title', 'type', 'slug', 'status'],
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
      localized: true,
      required: true,
      admin: { description: 'Display title (e.g., "Vegetarian Food Tours", "Penang Food Scene")' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL-friendly slug (e.g., "vegetarian", "penang")' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: '🥗 Dietary', value: 'dietary' },
        { label: '⭐ Specialty Experience', value: 'specialty' },
        { label: '🧳 Travel Type', value: 'travel_type' },
        { label: '📍 Location', value: 'location' },
      ],
      admin: {
        description: 'What kind of landing page is this?',
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
    // === HERO SECTION (all types) ===
    {
      name: 'hero_title',
      type: 'text',
      localized: true,
      admin: { description: 'Hero section title' },
    },
    {
      name: 'hero_subtitle',
      type: 'text',
      localized: true,
      admin: { description: 'Hero subtitle / eyebrow' },
    },
    {
      name: 'hero_description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Hero paragraph' },
    },
    {
      name: 'hero_image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Hero image — select from media library' },
    },

    // === SEO ===
    {
      name: 'meta_title',
      type: 'text',
      localized: true,
      admin: { description: 'SEO meta title' },
    },
    {
      name: 'meta_description',
      type: 'textarea',
      localized: true,
      admin: { description: 'SEO meta description' },
    },
    {
      name: 'content',
      type: 'textarea',
      localized: true,
      admin: {
        description: '📝 Page content — formatted with ## headings and paragraphs. This is the main body text.',
      },
    },
    {
      name: 'images',
      type: 'array',
      admin: {
        description: '🖼️ Images for this page — uploaded images generate WebP with responsive sizes and appear in structured data. Add alt text for SEO.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { description: 'Upload image — will be optimized to WebP with responsive sizes' },
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
          admin: { description: 'Alt text (required for SEO & accessibility — describe what the image shows)' },
        },
        {
          name: 'caption',
          type: 'text',
          admin: { description: 'Optional caption displayed below the image' },
        },
        {
          name: 'position',
          type: 'select',
          defaultValue: 'inline',
          options: [
            { label: 'Inline (within content sections)', value: 'inline' },
            { label: 'Hero background', value: 'hero' },
          ],
          admin: { description: 'Where to place this image on the page' },
        },
      ],
    },
    {
      name: 'published_at',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
}
