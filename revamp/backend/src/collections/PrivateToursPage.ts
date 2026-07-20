import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

export const PrivateToursPage: CollectionConfig = {
  slug: 'private_tours_page',
  localization: true,
  hooks: {
    afterChange: [triggerStagingDeploy],
  },
  admin: {
    useAsTitle: 'seo_title',
    group: 'Pages',
    description: '🔒 Private Tours page content — editable fields for the /tours/private-tours/ page',
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
    { name: 'hero_title', type: 'text', required: true },
    { name: 'hero_highlight', type: 'text', admin: { description: 'Word(s) to highlight in the hero title' } },
    { name: 'hero_subtitle', type: 'textarea' },
    { name: 'hero_cta_primary_text', type: 'text' },
    { name: 'hero_cta_primary_href', type: 'text', admin: { description: 'e.g. #pricing' } },
    { name: 'hero_cta_secondary_text', type: 'text' },
    { name: 'hero_cta_secondary_href', type: 'text', admin: { description: 'e.g. #tours' } },

    // ── Why private ───────────────────────────────────────────────────────────
    { name: 'why_title', type: 'text' },
    { name: 'why_subtitle', type: 'textarea' },
    {
      name: 'why_private',
      type: 'array',
      admin: { description: '3 reason cards (icon + title + detail)' },
      fields: [
        { name: 'icon', type: 'text', admin: { description: 'Emoji icon' } },
        { name: 'title', type: 'text', required: true },
        { name: 'detail', type: 'textarea' },
      ],
    },

    // ── Tour Configurator ─────────────────────────────────────────────────────
    { name: 'configurator_eyebrow', type: 'text' },
    { name: 'configurator_heading', type: 'text' },
    { name: 'configurator_body', type: 'textarea' },

    // ── Audiences ─────────────────────────────────────────────────────────────
    { name: 'audiences_title', type: 'text' },
    {
      name: 'audiences',
      type: 'array',
      admin: { description: 'Who books private tours (icon + label + detail)' },
      fields: [
        { name: 'icon', type: 'text', admin: { description: 'Emoji icon' } },
        { name: 'label', type: 'text', required: true },
        { name: 'detail', type: 'textarea' },
      ],
    },

    // ── Inclusions ────────────────────────────────────────────────────────────
    { name: 'inclusions_heading', type: 'text' },
    { name: 'on_every_tour_label', type: 'text' },
    {
      name: 'on_every_tour',
      type: 'array',
      admin: { description: 'Items included on every tour (one per row)' },
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    { name: 'private_extras_label', type: 'text' },
    {
      name: 'private_extras',
      type: 'array',
      admin: { description: 'Extras exclusive to private tours (one per row)' },
      fields: [{ name: 'item', type: 'text', required: true }],
    },

    // ── Pricing ───────────────────────────────────────────────────────────────
    { name: 'pricing_heading', type: 'text' },
    { name: 'pricing_body', type: 'textarea' },
    { name: 'pricing_cta_whatsapp', type: 'text', admin: { description: 'WhatsApp button label' } },
    { name: 'pricing_cta_whatsapp_message', type: 'text', admin: { description: 'URL-encoded message pre-filled in WhatsApp' } },
    { name: 'pricing_cta_message', type: 'text', admin: { description: 'Secondary CTA button label' } },

    // ── Available privately ───────────────────────────────────────────────────
    { name: 'available_privately_heading', type: 'text' },
    { name: 'available_privately_subtext', type: 'textarea' },

    // ── Corporate callout ─────────────────────────────────────────────────────
    { name: 'corporate_callout', type: 'textarea' },
    { name: 'corporate_cta_text', type: 'text' },
    { name: 'corporate_cta_href', type: 'text', admin: { description: 'e.g. /tours/corporate-groups/' } },

    // ── FAQs ──────────────────────────────────────────────────────────────────
    { name: 'faq_eyebrow', type: 'text' },
    { name: 'faq_heading', type: 'text' },
    {
      name: 'faqs',
      type: 'array',
      admin: { description: 'Private tour FAQs' },
      fields: [
        { name: 'name', type: 'text', required: true, admin: { description: 'Question text' } },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },

    // ── Internal links ────────────────────────────────────────────────────────
    { name: 'internal_links_heading', type: 'text' },
    { name: 'view_all_tours_text', type: 'text' },
  ],
}
