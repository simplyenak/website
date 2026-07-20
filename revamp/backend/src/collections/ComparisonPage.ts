import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

export const ComparisonPage: CollectionConfig = {
  slug: 'comparison_page',
  localization: true,
  hooks: {
    afterChange: [triggerStagingDeploy],
  },
  admin: {
    group: 'Pages',
    description: '⚖️ Competitor comparison page content',
    useAsTitle: 'page_title',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => ['admin', 'editor'].includes((user as any)?.role),
    update: ({ req: { user } }) => ['admin', 'editor', 'reviewer'].includes((user as any)?.role),
    delete: ({ req: { user } }) => (user as any)?.role === 'admin',
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
  fields: [
    {
      name: 'page_title',
      type: 'text',
      required: true,
            admin: { description: 'Page H1 title' },
    },
    {
      name: 'page_subtitle',
      type: 'text',
            admin: { description: 'Subtitle under the title' },
    },
    {
      name: 'hero_description',
      type: 'textarea',
            admin: { description: 'Intro paragraph explaining the comparison' },
    },
    {
      name: 'comparison_intro',
      type: 'textarea',
            admin: { description: 'Text before the comparison table' },
    },
    {
      name: 'competitors',
      type: 'array',
      maxRows: 5,
            admin: { initCollapsed: true, description: 'Competitors to compare against' },
      fields: [
        { name: 'name', type: 'text', required: true, admin: { description: 'Competitor name' } },
        { name: 'tagline', type: 'text', admin: { description: 'Short tagline or descriptor' } },
      ],
    },
    {
      name: 'comparison_rows',
      type: 'array',
      maxRows: 20,
            admin: { initCollapsed: true, description: 'Feature comparison rows' },
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
          admin: { description: 'Feature name (e.g., "Group Size")' },
        },
        {
          name: 'us_value',
          type: 'text',
          required: true,
          admin: { description: 'Our value (e.g., "Max 8")' },
        },
        {
          name: 'competitor_values',
          type: 'array',
          admin: { initCollapsed: true, description: 'Values for each competitor (same order as competitors array)' },
          fields: [{ name: 'value', type: 'text' }],
        },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Highlight this row as a key differentiator' },
        },
      ],
    },
    {
      name: 'cta_section',
      type: 'group',
      admin: { description: 'Bottom CTA section' },
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'body', type: 'textarea' },
        { name: 'cta_label', type: 'text' },
        { name: 'cta_url', type: 'text' },
      ],
    },
    {
      name: 'trust_badges',
      type: 'array',
      maxRows: 5,
            admin: { initCollapsed: true, description: 'Trust signals below comparison' },
      fields: [
        { name: 'icon', type: 'text', admin: { description: 'Icon name or SVG reference' } },
        { name: 'label', type: 'text', required: true },
      ],
    },
    // SEO
    {
      name: 'meta_title',
      type: 'text',
          },
    {
      name: 'meta_description',
      type: 'textarea',
          },
  ],
}
