import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

export const StoriesPage: CollectionConfig = {
  slug: 'stories_page',
  localization: true,
  hooks: {
    afterChange: [triggerStagingDeploy],
  },
  admin: {
    useAsTitle: 'seo_title',
    group: 'Pages',
    description: '\u{1F4D6} Stories listing page — hero, section headings, newsletter CTA',
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
    // ── SEO ──────────────────────────────────────────────────────────────────
    { name: 'seo_title', type: 'text', required: true },
    { name: 'seo_description', type: 'textarea', required: true },

    // ── Hero ─────────────────────────────────────────────────────────────────
    {
      name: 'hero_image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Hero background image — upload or select from media library' },
    },
    { name: 'hero_title', type: 'text', required: true },
    { name: 'hero_description', type: 'textarea' },

    // ── Category Sections ────────────────────────────────────────────────────
    {
      name: 'food_culture_eyebrow',
      type: 'text',
      admin: { description: 'e.g. "Stories behind the dishes"' },
    },
    { name: 'food_culture_heading', type: 'text' },

    {
      name: 'travel_tips_eyebrow',
      type: 'text',
      admin: { description: 'e.g. "Plan like a local"' },
    },
    { name: 'travel_tips_heading', type: 'text' },

    {
      name: 'vendor_stories_eyebrow',
      type: 'text',
      admin: { description: 'e.g. "The people behind the food"' },
    },
    { name: 'vendor_stories_heading', type: 'text' },
    { name: 'vendor_stories_empty_message', type: 'textarea', admin: { description: 'Message shown when no vendor stories exist yet' } },
    { name: 'vendor_stories_empty_cta', type: 'text', admin: { description: 'CTA button label' } },
    { name: 'vendor_stories_empty_cta_href', type: 'text' },

    // ── Newsletter CTA ───────────────────────────────────────────────────────
    { name: 'newsletter_eyebrow', type: 'text', admin: { description: 'e.g. "Hungry for More?"' } },
    { name: 'newsletter_heading', type: 'text' },
    { name: 'newsletter_description', type: 'textarea' },
    { name: 'newsletter_placeholder', type: 'text', admin: { description: 'Input placeholder text' } },
    { name: 'newsletter_button_text', type: 'text' },

    // ── Empty page state ─────────────────────────────────────────────────────
    { name: 'empty_message', type: 'textarea', admin: { description: 'Message when no stories exist at all' } },
    { name: 'empty_cta_text', type: 'text' },
    { name: 'empty_cta_href', type: 'text' },
  ],
}
