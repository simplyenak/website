import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

export const Tours: CollectionConfig = {
  slug: 'tours',
  admin: {
    useAsTitle: 'name',
    group: 'Tours & Booking',
    description: '🚌 Tour offerings and packages',
    defaultColumns: ['name', 'slug', 'price', 'duration', 'location', 'workflowStatus', 'featured'],
    components: {
      views: {
        list: {
          Component: '@/components/admin/tours/list',
        },
      },
    },
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
    maxPerDoc: 50,
  },
  hooks: {
    afterChange: [triggerStagingDeploy],
    beforeChange: [
      ({ operation, data }) => {
        if (operation === 'create' && data.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'The official tour name (e.g., "Flavours of Malaysia")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "flavours-of-malaysia")',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      admin: {
        description: 'Short, catchy phrase (e.g., "Off the Beaten Track")',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Brief overview for listing pages (2-3 sentences)',
      },
    },
    {
      name: 'fullDescription',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Complete tour description for detail pages',
      },
    },
    {
      name: 'price',
      type: 'number',
      admin: {
        description: 'Price in MYR',
      },
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'MYR',
      admin: {
        description: 'Currency code',
        readOnly: true,
      },
    },
    {
      name: 'duration',
      type: 'text',
      admin: {
        description: 'Human-readable (e.g., "4 hours")',
      },
    },
    {
      name: 'durationMinutes',
      type: 'number',
      admin: {
        description: 'Duration in minutes for calculations',
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'City/area (e.g., "Kuala Lumpur", "Penang")',
      },
    },
    {
      name: 'meetingPoint',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Where participants should gather',
      },
    },
    {
      name: 'maxParticipants',
      type: 'number',
      admin: {
        description: 'Maximum group size',
      },
    },
    {
      name: 'minParticipants',
      type: 'number',
      defaultValue: 2,
      admin: {
        description: 'Minimum group size (default: 2)',
      },
    },
    {
      name: 'dietaryOptions',
      type: 'relationship',
      relationTo: 'dietary_options',
      hasMany: true,
      admin: {
        description: 'Select dietary options available on this tour (managed in Dietary Options)',
      },
    },
    {
      name: 'travelTypes',
      type: 'relationship',
      relationTo: ['landing_pages', 'travel_types'],
      hasMany: true,
      admin: {
        description: 'Select travel types this tour suits (Couples, Solo, Family, Foodie)',
      },
    },
    {
      name: 'specialtyExperiences',
      type: 'relationship',
      relationTo: ['landing_pages', 'specialty_experiences'],
      hasMany: true,
      admin: {
        description: 'Select specialty experiences (Heritage, Street Food, Night Tour, Market)',
      },
    },
    {
      name: 'foodItems',
      type: 'relationship',
      relationTo: 'food_items',
      hasMany: true,
      admin: {
        description: 'Select food and drink items featured on this tour',
      },
    },
    {
      name: 'tailoredAvailable',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Can this tour be customized/tailored?',
      },
    },
    {
      name: 'tailoredNotes',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Notes about customization options',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main tour image — upload or select from media library',
      },
    },
    {
      name: 'galleryImages',
      type: 'array',
      admin: {
        description: 'Additional tour photos',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'whatsIncluded',
      type: 'array',
      localized: true,
      admin: {
        description: 'What is included in the tour price',
      },
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'whatsExcluded',
      type: 'array',
      localized: true,
      admin: {
        description: 'What is NOT included in the tour price',
      },
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'highlights',
      type: 'array',
      localized: true,
      admin: {
        description: 'Tour highlights and key features',
      },
      fields: [
        {
          name: 'highlight',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'ticketingHubId',
      type: 'text',
      admin: {
        description: 'TicketingHub widget ID for the booking iframe (e.g., "kl-street-food"). When set, the tour shows the booking UI instead of the guide page.',
      },
    },
    {
      name: 'isBookable',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Master toggle: true = full booking page with availability check, reviews, itinerary. false = SEO guide page.',
      },
    },
    {
      name: 'bookingUrl',
      type: 'text',
      admin: {
        description: 'External booking link (if applicable)',
      },
    },
    {
      name: 'instantConfirmation',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Bookings are confirmed immediately',
      },
    },
    {
      name: 'scheduledPublish',
      type: 'date',
      admin: {
        description: 'Auto-publish at this date/time (leave empty for immediate)',
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'cancellationPolicy',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Cancellation and refund policy text',
      },
    },
    {
      name: 'tourFrequency',
      type: 'text',
      admin: {
        description: 'How often this tour runs (e.g., "Daily", "Mon-Sat", "Weekends only")',
      },
    },
    {
      name: 'startTimes',
      type: 'array',
      admin: {
        description: 'Available start times for this tour',
      },
      fields: [
        {
          name: 'time',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'dishesCount',
      type: 'number',
      admin: {
        description: 'Number of food/drink tastings included',
      },
    },
    {
      name: 'difficulty',
      type: 'select',
      options: [
        { label: 'Easy', value: 'easy' },
        { label: 'Moderate', value: 'moderate' },
        { label: 'Challenging', value: 'challenging' },
      ],
      defaultValue: 'easy',
      admin: {
        description: 'Physical difficulty level (walking distance, terrain)',
      },
    },
    {
      name: 'walkingDistance',
      type: 'text',
      admin: {
        description: 'Total walking distance (e.g., "2 km", "1.5 miles")',
      },
    },
    {
      name: 'directionsHtml',
      type: 'textarea',
      admin: {
        description: 'HTML content for the directions/getting-there section',
      },
    },
    {
      name: 'itinerary',
      type: 'array',
      localized: true,
      admin: {
        description: 'Step-by-step tour itinerary',
      },
      fields: [
        {
          name: 'step',
          type: 'number',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'duration',
          type: 'text',
          admin: {
            description: 'Duration for this step (e.g., "30 min")',
          },
        },
      ],
    },
    {
      name: 'differentiatorsTourist',
      type: 'array',
      localized: true,
      admin: {
        description: 'What makes this tour different — written for tourists',
      },
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'differentiatorsUs',
      type: 'array',
      localized: true,
      admin: {
        description: 'What makes this tour different — written for our brand voice',
      },
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'whatToBring',
      type: 'array',
      localized: true,
      admin: {
        description: 'What guests should bring / wear',
      },
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'languagesOffered',
      type: 'array',
      admin: {
        description: 'Languages this tour is offered in',
      },
      fields: [
        {
          name: 'language',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'segmentTags',
      type: 'array',
      admin: {
        description: 'Tags for segment/landing page filtering (e.g., "kuala-lumpur", "vegetarian", "night-tours")',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'promoVideoUrl',
      type: 'text',
      admin: {
        description: 'URL to a promotional video (YouTube/Vimeo embed URL)',
      },
    },
    {
      name: 'galleryImageAlts',
      type: 'array',
      admin: {
        description: 'Alt text for each gallery image, matched by index',
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'heroImageAlt',
      type: 'text',
      localized: true,
      admin: {
        description: 'Alt text for the hero image',
      },
    },
    // SEO fields are handled by seoPlugin
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show on homepage and featured tours section',
      },
    },
    {
      name: 'showInMenu',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show in the header navigation dropdown menu',
        position: 'sidebar',
      },
    },
    {
      name: 'popular',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as popular/bestseller',
      },
    },
    {
      name: 'new',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as new tour',
      },
    },
    {
      name: 'badgeLabel',
      type: 'text',
      localized: true,
      admin: {
        description: 'Override badge text (e.g., "Bestseller", "New"). Falls back to featured/popular/new logic if empty.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        description: 'When tour was published',
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
        description: 'Draft = hidden, Published = visible on website',
      },
    },
    {
      name: 'workflowStatus',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Review', value: 'in_review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: {
        description: 'Workflow approval status',
        position: 'sidebar',
      },
    },
  ],
}
