import type { CollectionConfig } from 'payload'

export const Translations: CollectionConfig = {
  slug: 'translations',
  admin: {
    group: 'Content',
    description: '🌐 Manage all translations in one place',
    useAsTitle: 'label',
    defaultColumns: ['label', 'locale', 'collection', 'parent', 'updatedAt'],
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description: 'Descriptive label (e.g., "Flavours of Malaysia - Malay Translation")',
      },
    },
    {
      name: 'locale',
      type: 'select',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Bahasa Malaysia', value: 'ms' },
        { label: '中文 (Chinese)', value: 'zh' },
        { label: 'Deutsch (German)', value: 'de' },
        { label: 'Español (Spanish)', value: 'es' },
        { label: 'Français (French)', value: 'fr' },
        { label: 'Nederlands (Dutch)', value: 'nl' },
        { label: '日本語 (Japanese)', value: 'ja' },
        { label: 'Português (Portuguese)', value: 'pt' },
        { label: 'Русский (Russian)', value: 'ru' },
      ],
      required: true,
      admin: {
        description: 'Language for this translation',
      },
    },
    {
      name: 'collection',
      type: 'select',
      options: [
        { label: 'Tours', value: 'tours' },
        { label: 'Stories', value: 'stories' },
        { label: 'Testimonials', value: 'testimonials' },
        { label: 'FAQs', value: 'faqs' },
        { label: 'Media Coverage', value: 'media_coverage' },
        { label: 'Dietary Landing Pages', value: 'dietary_landing_pages' },
        { label: 'Specialty Landing Pages', value: 'specialty_landing_pages' },
        { label: 'Travel Type Landing Pages', value: 'travel_type_landing_pages' },
        { label: 'Location Landing Pages', value: 'location_landing_pages' },
        { label: 'Home Page', value: 'home_page' },
        { label: 'Legal Pages', value: 'legal_pages' },
      ],
      required: true,
      admin: {
        description: 'Which collection this translation belongs to',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: ['tours', 'stories', 'testimonials', 'faqs', 'media_coverage', 'dietary_landing_pages', 'specialty_landing_pages', 'travel_type_landing_pages', 'location_landing_pages', 'home_page', 'legal_pages'],
      required: true,
      admin: {
        description: 'The original content item being translated',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Translation', value: 'in_translation' },
        { label: 'Ready for Review', value: 'ready_for_review' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: {
        description: 'Translation workflow status',
      },
    },
    {
      name: 'translator',
      type: 'text',
      admin: {
        description: 'Who translated this (name or agency)',
      },
    },
    {
      name: 'translatedAt',
      type: 'date',
      admin: {
        description: 'When translation was completed',
      },
    },
    {
      name: 'fields',
      type: 'group',
      admin: {
        description: 'Translated content fields',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          admin: {
            description: 'Name/Title translation',
          },
        },
        {
          name: 'tagline',
          type: 'text',
          admin: {
            description: 'Tagline translation',
          },
        },
        {
          name: 'shortDescription',
          type: 'textarea',
          admin: {
            description: 'Short description translation',
          },
        },
        {
          name: 'fullDescription',
          type: 'textarea',
          admin: {
            description: 'Full description translation',
          },
        },
        {
          name: 'content',
          type: 'textarea',
          admin: {
            description: 'Main content (for stories)',
          },
        },
        {
          name: 'excerpt',
          type: 'textarea',
          admin: {
            description: 'Excerpt/summary translation',
          },
        },
        {
          name: 'question',
          type: 'text',
          admin: {
            description: 'Question (for FAQs)',
          },
        },
        {
          name: 'answer',
          type: 'textarea',
          admin: {
            description: 'Answer (for FAQs)',
          },
        },
        {
          name: 'reviewText',
          type: 'textarea',
          admin: {
            description: 'Review text (for testimonials)',
          },
        },
        {
          name: 'reviewTitle',
          type: 'text',
          admin: {
            description: 'Review title (for testimonials)',
          },
        },
        {
          name: 'heroTitle',
          type: 'text',
          admin: {
            description: 'Hero title (for landing pages)',
          },
        },
        {
          name: 'heroSubtitle',
          type: 'text',
          admin: {
            description: 'Hero subtitle (for landing pages)',
          },
        },
        {
          name: 'heroDescription',
          type: 'textarea',
          admin: {
            description: 'Hero description (for landing pages)',
          },
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      admin: {
        description: 'SEO translations',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'Meta title translation',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'Meta description translation',
          },
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes for translators',
      },
    },
  ],
}
