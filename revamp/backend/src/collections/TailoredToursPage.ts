import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

export const TailoredToursPage: CollectionConfig = {
  slug: 'tailored_tours_page',
  localization: true,
  hooks: {
    afterChange: [triggerStagingDeploy],
  },
  admin: {
    useAsTitle: 'seo_title',
    group: 'Pages',
    description: '🎯 Tailored Experience page content — for the /tours/tailored-tours/ page',
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
    { name: 'hero_cta_primary_href', type: 'text', admin: { description: 'e.g. #process' } },
    { name: 'hero_cta_secondary_text', type: 'text' },
    { name: 'hero_cta_secondary_href', type: 'text' },

    // ── What is tailored ──────────────────────────────────────────────────────
    { name: 'what_title', type: 'text' },
    { name: 'what_subtitle', type: 'textarea' },
    {
      name: 'what_cards',
      type: 'array',
      admin: { description: '3 cards explaining what makes tailored different (icon + title + detail)' },
      fields: [
        { name: 'icon', type: 'text', admin: { description: 'Emoji icon' } },
        { name: 'title', type: 'text', required: true },
        { name: 'detail', type: 'textarea' },
      ],
    },

    // ── Difference from private ───────────────────────────────────────────────
    { name: 'difference_heading', type: 'text' },
    {
      name: 'difference_rows',
      type: 'array',
      admin: { description: 'Comparison rows: private tour vs tailored experience' },
      fields: [
        { name: 'feature', type: 'text', required: true, admin: { description: 'Feature name' } },
        { name: 'private_tour', type: 'text', admin: { description: 'What private tours offer' } },
        { name: 'tailored', type: 'text', admin: { description: 'What tailored adds' } },
      ],
    },

    // ── Process ───────────────────────────────────────────────────────────────
    { name: 'process_eyebrow', type: 'text' },
    { name: 'process_heading', type: 'text' },
    {
      name: 'process_steps',
      type: 'array',
      admin: { description: 'How the tailored experience works (number + title + description)' },
      fields: [
        { name: 'number', type: 'number' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },

    // ── Use cases ─────────────────────────────────────────────────────────────
    { name: 'use_cases_heading', type: 'text' },
    {
      name: 'use_cases',
      type: 'array',
      admin: { description: 'Who books tailored experiences (icon + label + detail)' },
      fields: [
        { name: 'icon', type: 'text', admin: { description: 'Emoji icon' } },
        { name: 'label', type: 'text', required: true },
        { name: 'detail', type: 'textarea' },
      ],
    },

    // ── Examples ──────────────────────────────────────────────────────────────
    { name: 'examples_heading', type: 'text' },
    { name: 'examples_subtext', type: 'textarea' },
    {
      name: 'examples',
      type: 'array',
      admin: { description: 'Real examples of tailored routes we have built' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'duration', type: 'text', admin: { description: 'e.g. "6 hours"' } },
      ],
    },

    // ── Pricing ───────────────────────────────────────────────────────────────
    { name: 'pricing_heading', type: 'text' },
    { name: 'pricing_body', type: 'textarea' },
    { name: 'pricing_cta_whatsapp', type: 'text' },
    { name: 'pricing_cta_whatsapp_message', type: 'text', admin: { description: 'URL-encoded WhatsApp message' } },
    { name: 'pricing_cta_message', type: 'text', admin: { description: 'Secondary CTA button label' } },

    // ── FAQs ──────────────────────────────────────────────────────────────────
    { name: 'faq_eyebrow', type: 'text' },
    { name: 'faq_heading', type: 'text' },
    {
      name: 'faqs',
      type: 'array',
      admin: { description: 'Tailored experience FAQs' },
      fields: [
        { name: 'name', type: 'text', required: true, admin: { description: 'Question text' } },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },

    // ── Cross-links ───────────────────────────────────────────────────────────
    { name: 'private_callout', type: 'textarea', admin: { description: 'Callout linking to private tours' } },
    { name: 'private_cta_text', type: 'text' },
    { name: 'private_cta_href', type: 'text', admin: { description: 'e.g. /tours/private-tours/' } },
  ],
}
