import type { CollectionConfig } from 'payload'

export const HomePage: CollectionConfig = {
  slug: 'home_page',
  admin: {
    group: 'Pages',
    description: '🏠 Home page content and sections',
    useAsTitle: 'meta_title',
  },
  fields: [
    // Hero Section (blocks)
    {
      name: 'heroSection',
      type: 'blocks',
      maxRows: 1,
      admin: {
        group: 'Hero Section',
        description: 'Hero section with title, subtitle, badges, and background image',
      },
      blocks: [
        {
          slug: 'heroBlock',
          labels: { singular: 'Hero Block', plural: 'Hero Blocks' },
          fields: [
            { name: 'title', type: 'text' },
            { name: 'highlight', type: 'text' },
            { name: 'titleEnd', type: 'text' },
            { name: 'subtitle', type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'priceInfo', type: 'text' },
            { name: 'bgImage', type: 'text' },
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
        group: 'Manifesto Section',
        description: 'Brand belief/mission statement section',
      },
      blocks: [
        {
          slug: 'manifestoBlock',
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
        group: 'Pillars Section',
        description: 'Three core pillars: People, Food, Place',
      },
      blocks: [
        {
          slug: 'pillarsBlock',
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
        group: 'Vendors Section',
        description: 'Vendor showcase section with links',
      },
      blocks: [
        {
          slug: 'vendorsBlock',
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
        group: 'Tour Segments Section',
        description: 'Tour category selector section',
      },
      blocks: [
        {
          slug: 'segmentsBlock',
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
        group: 'About Section',
        description: 'About Simply Enak teaser section',
      },
      blocks: [
        {
          slug: 'aboutBlock',
          labels: { singular: 'About Block', plural: 'About Blocks' },
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'subtitle', type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'heritage', type: 'text' },
            { name: 'image', type: 'text' },
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
        group: 'Expect Section',
        description: '"What to Expect" stats section',
      },
      blocks: [
        {
          slug: 'statsBlock',
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
        group: 'CTA Section',
        description: 'Call-to-action section blocks',
      },
      blocks: [
        {
          slug: 'ctaBlock',
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
      type: 'json',
      admin: {
        group: 'FAQs Section',
        description: 'Array of FAQ items for home page',
      },
    },

    // SEO
    {
      name: 'meta_title',
      type: 'text',
      admin: { group: 'SEO' },
    },
    {
      name: 'meta_description',
      type: 'textarea',
      admin: { group: 'SEO' },
    },
  ],
}
