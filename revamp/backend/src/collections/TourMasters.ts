import type { CollectionConfig } from 'payload'
import { pushToLive } from '../hooks/pushToLive'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

export const TourMasters: CollectionConfig = {
  slug: 'tour-masters',
  localization: true,
  admin: {
    useAsTitle: 'name',
    group: 'Tours & Booking',
    description: '📝 Canonical tour data — the master source for all tour content',
    defaultColumns: ['name', 'slug', 'workflowStatus', 'lastPushedAt', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => ['admin', 'editor', 'reviewer'].includes((user as any)?.role),
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
    afterChange: [pushToLive, triggerStagingDeploy],
  },
  fields: [
    // ── Identity ──────────────────────────────────────────────────────
    {
      name: 'name',
      type: 'text',
      required: true,
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
            admin: {
        description: 'Short, catchy phrase (e.g., "Off the Beaten Track")',
      },
    },
    // ── Description ──────────────────────────────────────────────────
    {
      name: 'shortDescription',
      type: 'textarea',
            admin: {
        description: 'Brief overview for listing pages (2-3 sentences)',
      },
    },
    {
      name: 'fullDescription',
      type: 'textarea',
            admin: {
        description: 'Complete tour description for detail pages',
      },
    },
    // ── Pricing & Logistics ──────────────────────────────────────────
    {
      name: 'price',
      type: 'number',
      admin: {
        description: 'Retail price in MYR',
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
    // ── Categorisation ───────────────────────────────────────────────
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
    // ── Customisation ────────────────────────────────────────────────
    {
      name: 'tailoredAvailable',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Can this tour be customised/tailored?',
      },
    },
    {
      name: 'tailoredNotes',
      type: 'textarea',
            admin: {
        description: 'Notes about customisation options',
      },
    },
    // ── Media ────────────────────────────────────────────────────────
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
    // ── What's Included ──────────────────────────────────────────────
    {
      name: 'whatsIncluded',
      type: 'array',
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
    // ── Highlights ──────────────────────────────────────────────────
    {
      name: 'highlights',
      type: 'array',
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
    // ── Booking ─────────────────────────────────────────────────────
    {
      name: 'ticketingHubId',
      type: 'text',
      admin: {
        description: 'TicketingHub widget ID for the booking iframe',
      },
    },
    {
      name: 'isBookable',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Master toggle: true = full booking page with availability check. false = SEO guide page.',
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
            admin: {
        description: 'Cancellation and refund policy text',
      },
    },
    // ── Tour Details ────────────────────────────────────────────────
    {
      name: 'tourFrequency',
      type: 'text',
      admin: {
        description: 'How often this tour runs (e.g., "Daily", "Mon-Sat")',
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
        description: 'Physical difficulty level',
      },
    },
    {
      name: 'walkingDistance',
      type: 'text',
      admin: {
        description: 'Total walking distance (e.g., "2 km")',
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
    // ── Differentiators ──────────────────────────────────────────────
    {
      name: 'differentiatorsTourist',
      type: 'array',
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
        description: 'Tags for segment/landing page filtering (e.g., "kuala-lumpur", "vegetarian")',
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
            admin: {
        description: 'Alt text for the hero image',
      },
    },
    // ── Badging ──────────────────────────────────────────────────────
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show on homepage and featured tours section',
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
            admin: {
        description: 'Override badge text (e.g., "Bestseller", "New")',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        description: 'When tour was published',
      },
    },
    // ── Workflow ─────────────────────────────────────────────────────
    {
      name: 'publishedTourId',
      type: 'relationship',
      relationTo: 'tours',
      admin: {
        description: 'Link to the corresponding record in the published Tours collection',
        position: 'sidebar',
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
    // ── Internal / Master-only Fields ────────────────────────────────
    {
      name: 'lastPushedAt',
      type: 'date',
      admin: {
        description: 'When this master was last pushed to PublishedTours',
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'pricingNotes',
      type: 'textarea',
      admin: {
        description: 'Internal: pricing rationale, margin targets, EXO/D2C split notes',
      },
    },
    {
      name: 'vendorNotes',
      type: 'textarea',
      admin: {
        description: 'Internal: vendor relationships, stall details, logistics notes',
      },
    },
    {
      name: 'internalTags',
      type: 'array',
      admin: {
        description: 'Internal: tags for filtering/sorting (not shown on website)',
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
      name: 'pricingHistory',
      type: 'array',
      admin: {
        description: 'Historical record of price changes',
      },
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
        },
        {
          name: 'channel',
          type: 'select',
          options: [
            { label: 'Join-in (D2C)', value: 'd2c' },
            { label: 'Join-in (OTA)', value: 'ota_join_in' },
            { label: 'Private (D2C)', value: 'd2c_private' },
            { label: 'Private (OTA)', value: 'ota_private' },
          ],
        },
        {
          name: 'effectiveFrom',
          type: 'date',
        },
        {
          name: 'effectiveTo',
          type: 'date',
        },
        {
          name: 'note',
          type: 'text',
        },
      ],
    },
  ],
}
