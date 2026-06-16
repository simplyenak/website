import type { CollectionConfig } from 'payload'

export const ContactPage: CollectionConfig = {
  slug: 'contact_page',
  admin: {
    useAsTitle: 'hero_title',
    group: 'Pages',
    description: '📞 Contact page content (simplified flat fields)',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => ['admin', 'editor'].includes((user as any)?.role),
    update: ({ req: { user } }) => ['admin', 'editor', 'reviewer'].includes((user as any)?.role),
    delete: ({ req: { user } }) => (user as any)?.role === 'admin',
  },
  versions: {
    drafts: {
      autosave: {
        interval: 3000,
      },
    },
    maxPerDoc: 20,
  },
  fields: [
    // SEO
    {
      name: 'seo_title',
      type: 'text',
      localized: true,
      admin: { description: 'SEO meta title' },
    },
    {
      name: 'seo_description',
      type: 'textarea',
      localized: true,
      admin: { description: 'SEO meta description' },
    },

    // Hero
    {
      name: 'hero_title',
      type: 'text',
      localized: true,
      required: true,
      admin: { description: 'e.g., "Tell Us What You\'re Looking For"' },
    },
    {
      name: 'hero_subtitle',
      type: 'textarea',
      localized: true,
      admin: { description: 'e.g., "Whether you\'re booking a tour or just curious..."' },
    },

    // Intro
    {
      name: 'intro_title',
      type: 'text',
      localized: true,
      admin: { description: 'e.g., "How Can We Help?"' },
    },
    {
      name: 'intro_subtitle',
      type: 'text',
      localized: true,
      admin: { description: 'e.g., "Choose your reason for reaching out"' },
    },

    // Contact Details
    {
      name: 'contact_email',
      type: 'email',
      admin: { description: 'Primary contact email' },
    },
    {
      name: 'contact_phone',
      type: 'text',
      admin: { description: 'Phone number' },
    },
    {
      name: 'whatsapp_number',
      type: 'text',
      admin: { description: 'WhatsApp number' },
    },
    {
      name: 'contact_hours',
      type: 'text',
      localized: true,
      admin: { description: 'e.g., "Mon – Sun: 9:00 – 20:00"' },
    },

    // Optional: Social Links
    {
      name: 'social_facebook',
      type: 'text',
      admin: { description: 'Facebook page URL' },
    },
    {
      name: 'social_instagram',
      type: 'text',
      admin: { description: 'Instagram URL' },
    },

    // Optional: FAQ
    {
      name: 'faq_content',
      type: 'textarea',
      localized: true,
      admin: { description: 'Optional FAQ content for contact page' },
    },
  ],
}
