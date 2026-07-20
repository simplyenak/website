import type { CollectionConfig } from 'payload'

export const ThankYouPages: CollectionConfig = {
  slug: 'thank_you_pages',
  localization: true,
  admin: {
    group: 'Pages',
    description: '🎉 Thank you pages for form submissions',
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'updatedAt', 'status'],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
            required: true,
      admin: {
        description: 'Page title (e.g., "Thank You - Contact Form")',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Contact Form', value: 'contact' },
        { label: 'Tour Inquiry', value: 'tour_inquiry' },
        { label: 'Feedback/Survey', value: 'feedback' },
        { label: 'Newsletter Signup', value: 'newsletter' },
        { label: 'Booking Confirmation', value: 'booking' },
        { label: 'Custom', value: 'custom' },
      ],
      required: true,
      admin: {
        description: 'What form submission this page is for',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL path (e.g., "thank-you-contact")',
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
      admin: {
        description: 'Publish when ready',
      },
    },
    {
      name: 'heroSection',
      type: 'group',
            fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Thank You!',
          admin: {
            description: 'Main heading',
          },
        },
        {
          name: 'subheading',
          type: 'text',
          defaultValue: 'We\'ve received your message',
          admin: {
            description: 'Subheading text',
          },
        },
        {
          name: 'icon',
          type: 'text',
          defaultValue: '✅',
          admin: {
            description: 'Emoji or icon',
          },
        },
      ],
    },
    {
      name: 'message',
      type: 'richText',
            admin: {
        description: 'Main thank you message',
      },
    },
    {
      name: 'nextSteps',
      type: 'array',
            admin: {
        description: 'What happens next (bullet points)',
      },
      fields: [
        {
          name: 'step',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'contactInfo',
      type: 'group',
            fields: [
        {
          name: 'showContact',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show contact information',
          },
        },
        {
          name: 'email',
          type: 'text',
          admin: {
            description: 'Contact email (optional)',
          },
        },
        {
          name: 'phone',
          type: 'text',
          admin: {
            description: 'Contact phone (optional)',
          },
        },
        {
          name: 'responseTime',
          type: 'text',
          defaultValue: 'We\'ll respond within 24 hours',
          admin: {
            description: 'Expected response time',
          },
        },
      ],
    },
    {
      name: 'ctaSection',
      type: 'group',
            fields: [
        {
          name: 'showCta',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show call-to-action buttons',
          },
        },
        {
          name: 'ctaButtons',
          type: 'array',
          admin: {
            description: 'Buttons to show (e.g., "Browse Tours")',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
            {
              name: 'variant',
              type: 'select',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
              ],
              defaultValue: 'primary',
            },
          ],
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
            fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'SEO title',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'SEO description',
          },
        },
      ],
    },
  ],
}
