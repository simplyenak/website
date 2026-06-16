import type { CollectionConfig } from 'payload'

export const HomePage: CollectionConfig = {
  slug: 'home_page',
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
      localized: true,
      admin: {
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
      localized: true,
      admin: {
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
      localized: true,
      admin: {
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
      localized: true,
      admin: {
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
      localized: true,
      admin: {
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
      localized: true,
      admin: {
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
      localized: true,
      admin: {
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
      localized: true,
      admin: {
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
        description: 'Array of FAQ items for home page',
      },
    },

    // Why Us Section (blocks)
    {
      name: 'whyUsSection',
      type: 'blocks',
      maxRows: 1,
      localized: true,
      admin: {
        description: '"Why Choose Us" section with 6 reason cards',
      },
      blocks: [
        {
          slug: 'whyUsBlock',
          labels: { singular: 'Why Us Block', plural: 'Why Us Blocks' },
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'subtitle', type: 'text' },
            {
              name: 'reasons',
              type: 'array',
              maxRows: 6,
              admin: { initCollapsed: true, description: 'Reason cards (icon, stat badge, heading, body)' },
              fields: [
                {
                  name: 'iconName',
                  type: 'select',
                  options: [
                    { label: 'Location / Heritage', value: 'heritage' },
                    { label: 'People / Group', value: 'group' },
                    { label: 'Shield / Trust', value: 'trust' },
                    { label: 'Book / Story', value: 'story' },
                    { label: 'Chat / Q&A', value: 'chat' },
                    { label: 'Puzzle / Custom', value: 'custom' },
                    { label: 'Star / Award', value: 'award' },
                    { label: 'Heart / Passion', value: 'heart' },
                  ],
                  admin: { description: 'Select an icon — frontend maps this to SVG' },
                },
                { name: 'stat', type: 'text', admin: { description: 'e.g., "Since 2011", "Max 8"' } },
                { name: 'heading', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true },
              ],
            },
          ],
        },
      ],
    },

    // Booking Guarantees Section (blocks)
    {
      name: 'bookingGuaranteesSection',
      type: 'blocks',
      maxRows: 1,
      localized: true,
      admin: {
        description: 'Booking guarantees + private tour callout',
      },
      blocks: [
        {
          slug: 'guaranteesBlock',
          labels: { singular: 'Guarantees Block', plural: 'Guarantees Blocks' },
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'subtitle', type: 'text' },
            {
              name: 'guarantees',
              type: 'array',
              maxRows: 5,
              admin: { initCollapsed: true, description: 'Booking guarantee items' },
              fields: [
                {
                  name: 'iconName',
                  type: 'select',
                  options: [
                    { label: 'Checkmark', value: 'check' },
                    { label: 'Calendar', value: 'calendar' },
                    { label: 'Users', value: 'users' },
                    { label: 'Message', value: 'message' },
                    { label: 'Lock', value: 'lock' },
                  ],
                  admin: { description: 'Icon for this guarantee' },
                },
                { name: 'heading', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true },
              ],
            },
            {
              name: 'privateTourCallout',
              type: 'group',
              admin: { description: 'Private tours CTA box' },
              fields: [
                { name: 'title', type: 'text' },
                { name: 'body', type: 'textarea' },
                { name: 'ctaLabel', type: 'text' },
                { name: 'ctaUrl', type: 'text' },
              ],
            },
          ],
        },
      ],
    },

    // Testimonial Platform Badges (blocks)
    {
      name: 'testimonialPlatformBadges',
      type: 'blocks',
      maxRows: 1,
      localized: true,
      admin: {
        description: 'Platform badges (TripAdvisor, Google) + guest stats',
      },
      blocks: [
        {
          slug: 'socialProofBadgesBlock',
          labels: { singular: 'Social Proof Badges Block', plural: 'Social Proof Badges Blocks' },
          fields: [
            {
              name: 'platforms',
              dbName: 'plat',
              type: 'array',
              maxRows: 4,
              admin: { initCollapsed: true, description: 'Review platform badges' },
              fields: [
                {
                  name: 'platform',
                  dbName: 'name',
                  type: 'select',
                  options: [
                    { label: 'TripAdvisor', value: 'tripadvisor' },
                    { label: 'Google', value: 'google' },
                    { label: 'Trustpilot', value: 'trustpilot' },
                    { label: 'Facebook', value: 'facebook' },
                  ],
                  required: true,
                },
                { name: 'rating', type: 'text', admin: { description: 'e.g., "4.9"' } },
                { name: 'reviewCount', type: 'text', admin: { description: 'e.g., "520+"' } },
                { name: 'url', type: 'text', admin: { description: 'Link to reviews' } },
              ],
            },
            {
              name: 'guestStats',
              type: 'group',
              admin: { description: 'Overall guest statistics' },
              fields: [
                { name: 'totalGuests', type: 'text', admin: { description: 'e.g., "5,000+"' } },
                { name: 'sinceYear', type: 'text', admin: { description: 'e.g., "2011"' } },
                { name: 'label', type: 'text', admin: { description: 'e.g., "guests served"' } },
              ],
            },
          ],
        },
      ],
    },

    // SEO
    {
      name: 'meta_title',
      type: 'text',
      localized: true,
    },
    {
      name: 'meta_description',
      type: 'textarea',
      localized: true,
    },
  ],
}
