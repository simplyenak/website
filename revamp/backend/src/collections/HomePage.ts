import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

export const HomePage: CollectionConfig = {
  slug: 'home_page',
  localization: true,
  hooks: {
    afterChange: [triggerStagingDeploy],
  },
  admin: {
    group: 'Pages',
    useAsTitle: 'meta_title',
    description: '🏠 Home page content and sections',
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
  fields: [
    // Hero Section (blocks)
    {
      name: 'heroSection',
      type: 'blocks',
      maxRows: 1,
            admin: {
        description: 'Hero section with title, subtitle, badges, and background image',
      },
      blocks: [
        {
          slug: 'heroBlock',
          localization: true,
          labels: { singular: 'Hero Block', plural: 'Hero Blocks' },
          fields: [
            { name: 'title', type: 'text' },
            { name: 'highlight', type: 'text' },
            { name: 'titleEnd', type: 'text' },
            { name: 'subtitle', type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'priceInfo', type: 'text' },
            {
              name: 'bgImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Hero background image — select from media library' },
            },
            {
              name: 'badges',
              type: 'array',
              maxRows: 12,
              admin: { initCollapsed: true, description: 'Trust badges (e.g., "40+ Heritage Vendors", "Since 2011")' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
          ],
        },
      ],
    },

    // Manifesto Section (blocks)
    {
      name: 'manifestoSection',
      type: 'blocks',
      maxRows: 1,
            admin: {
        description: 'Brand belief/mission statement section',
      },
      blocks: [
        {
          slug: 'manifestoBlock',
          localization: true,
          labels: { singular: 'Manifesto Block', plural: 'Manifesto Blocks' },
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'headline', type: 'textarea' },
            { name: 'tagline', type: 'text' },
            { name: 'body', type: 'textarea' },
            { name: 'attributionRole', type: 'text' },
          ],
        },
      ],
    },

    // Pillars Section (blocks)
    {
      name: 'pillarsSection',
      type: 'blocks',
      maxRows: 1,
            admin: {
        description: 'Three core pillars: People, Food, Place',
      },
      blocks: [
        {
          slug: 'pillarsBlock',
          localization: true,
          labels: { singular: 'Pillars Block', plural: 'Pillars Blocks' },
          fields: [
            { name: 'intro', type: 'text' },
            {
              name: 'pillars',
              type: 'array',
              maxRows: 3,
              admin: { initCollapsed: true, description: 'The three pillars: People, Food, Place' },
              fields: [
                { name: 'label', type: 'text' },
                { name: 'heading', type: 'text' },
                { name: 'body', type: 'textarea' },
              ],
            },
          ],
        },
      ],
    },

    // Vendors Section (blocks)
    {
      name: 'vendorsSection',
      type: 'blocks',
      maxRows: 1,
            admin: {
        description: 'Vendor showcase section with links',
      },
      blocks: [
        {
          slug: 'vendorsBlock',
          localization: true,
          labels: { singular: 'Vendors Block', plural: 'Vendors Blocks' },
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'subtitle', type: 'text' },
            {
              name: 'links',
              type: 'array',
              maxRows: 3,
              admin: { initCollapsed: true, description: 'CTA links (e.g., "Meet on Tour", "Read Stories")' },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },

    // Tour Segments Section (blocks)
    {
      name: 'segmentsSection',
      type: 'blocks',
      maxRows: 1,
            admin: {
        description: 'Tour category selector section',
      },
      blocks: [
        {
          slug: 'segmentsBlock',
          localization: true,
          labels: { singular: 'Segments Block', plural: 'Segments Blocks' },
          fields: [
            { name: 'heading', type: 'text' },
            { name: 'subheading', type: 'text' },
            { name: 'viewAllLabel', type: 'text' },
          ],
        },
      ],
    },

    // About Section (blocks)
    {
      name: 'aboutSection',
      type: 'blocks',
      maxRows: 1,
            admin: {
        description: 'About Simply Enak teaser section',
      },
      blocks: [
        {
          slug: 'aboutBlock',
          localization: true,
          labels: { singular: 'About Block', plural: 'About Blocks' },
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'subtitle', type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'heritage', type: 'text' },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'About section image — select from media library' },
            },
          ],
        },
      ],
    },

    // Expect/Stats Section (blocks)
    {
      name: 'expectSection',
      type: 'blocks',
      maxRows: 1,
            admin: {
        description: '"What to Expect" stats section',
      },
      blocks: [
        {
          slug: 'statsBlock',
          localization: true,
          labels: { singular: 'Stats Block', plural: 'Stats Blocks' },
          fields: [
            { name: 'title', type: 'text' },
            { name: 'subtitle', type: 'text' },
            {
              name: 'stats',
              type: 'array',
              maxRows: 6,
              admin: { initCollapsed: true, description: 'Stat items (number, heading, body)' },
              fields: [
                { name: 'number', type: 'text' },
                { name: 'heading', type: 'text' },
                { name: 'body', type: 'textarea' },
              ],
            },
          ],
        },
      ],
    },

    // CTA Section (blocks)
    {
      name: 'ctaSection',
      type: 'blocks',
      maxRows: 3,
            admin: {
        description: 'Call-to-action section blocks',
      },
      blocks: [
        {
          slug: 'ctaBlock',
          localization: true,
          labels: { singular: 'CTA Block', plural: 'CTA Blocks' },
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'title', type: 'text', required: true },
            { name: 'subtitle', type: 'text' },
            {
              name: 'features',
              type: 'array',
              maxRows: 4,
              admin: { initCollapsed: true, description: 'Trust signals' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'buttons',
              type: 'array',
              maxRows: 3,
              admin: { initCollapsed: true, description: 'CTA buttons' },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
                {
                  name: 'variant',
                  type: 'select',
                  options: [
                    { label: 'Primary', value: 'primary' },
                    { label: 'Secondary', value: 'secondary' },
                    { label: 'WhatsApp', value: 'whatsapp' },
                  ],
                  defaultValue: 'primary',
                },
              ],
            },
          ],
        },
      ],
    },

    // FAQs
    {
      name: 'faqs',
      type: 'array',
      admin: {
        description: 'FAQ items for the home page (question + answer pairs)',
      },
      fields: [
        { name: 'question', type: 'text', required: true, admin: { description: 'The question' } },
        { name: 'answer', type: 'textarea', required: true, admin: { description: 'The answer' } },
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
