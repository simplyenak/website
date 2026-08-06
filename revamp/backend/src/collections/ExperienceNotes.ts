import type { CollectionConfig } from 'payload'

export const ExperienceNotes: CollectionConfig = {
  slug: 'experience_notes',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    description: '📝 First-hand experience notes from guides — prices, vendors, sensory details, surprises',
    defaultColumns: ['title', 'location', 'linkedTour', 'createdAt', 'status'],
  },
  access: {
    read: ({ req: { user } }) => ['admin', 'editor', 'reviewer'].includes((user as any)?.role),
    create: ({ req: { user } }) => ['admin', 'editor'].includes((user as any)?.role),
    update: ({ req: { user } }) => ['admin', 'editor', 'reviewer'].includes((user as any)?.role),
    delete: ({ req: { user } }) => (user as any)?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Brief title for this experience note (e.g., "Pudu Market Morning Visit")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier',
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      admin: {
        description: 'Where this experience happened (e.g., "Pudu Market, KL" or "Jalan Alor, KL")',
      },
    },
    {
      name: 'linkedTour',
      type: 'relationship',
      relationTo: 'tour-masters',
      admin: {
        description: 'Which tour this experience relates to (if applicable)',
        position: 'sidebar',
      },
    },
    {
      name: 'noteType',
      type: 'select',
      options: [
        { label: 'Vendor Discovery', value: 'vendor_discovery' },
        { label: 'Tour Debrief', value: 'tour_debrief' },
        { label: 'Location Scout', value: 'location_scout' },
        { label: 'Seasonal Update', value: 'seasonal_update' },
        { label: 'Customer Story', value: 'customer_story' },
      ],
      defaultValue: 'tour_debrief',
      admin: {
        description: 'What type of insight this is',
        position: 'sidebar',
      },
    },
    {
      name: 'dishes',
      type: 'array',
      admin: {
        description: 'Food items mentioned with prices and details',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Dish name (e.g., "char kway teow")',
          },
        },
        {
          name: 'price',
          type: 'text',
          admin: {
            description: 'Price in RM (e.g., "RM 8")',
          },
        },
        {
          name: 'vendor',
          type: 'text',
          admin: {
            description: 'Where to get it (e.g., "Jalan Alor stall near 7-Eleven")',
          },
        },
        {
          name: 'notes',
          type: 'textarea',
          admin: {
            description: 'What makes it special, how to order, tips',
          },
        },
      ],
    },
    {
      name: 'vendors',
      type: 'array',
      admin: {
        description: 'Vendors/stalls/restaurants with insights',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Street Stall', value: 'street_stall' },
            { label: 'Hawker Stall', value: 'hawker_stall' },
            { label: 'Food Court', value: 'food_court' },
            { label: 'Restaurant', value: 'restaurant' },
            { label: 'Market Stall', value: 'market_stall' },
            { label: 'Kopitiam', value: 'kopitiam' },
          ],
        },
        {
          name: 'address',
          type: 'text',
          admin: {
            description: 'Street address or landmark',
          },
        },
        {
          name: 'ownerName',
          type: 'text',
          admin: {
            description: 'Owner/chef name (if known)',
          },
        },
        {
          name: 'yearsRunning',
          type: 'text',
          admin: {
            description: 'How long they have been operating',
          },
        },
        {
          name: 'signatureDish',
          type: 'text',
          admin: {
            description: 'What they are known for',
          },
        },
        {
          name: 'story',
          type: 'textarea',
          admin: {
            description: 'Background, family story, interesting facts',
          },
        },
        {
          name: 'tips',
          type: 'textarea',
          admin: {
            description: 'Tips for visitors (best time, what to order, payment)',
          },
        },
      ],
    },
    {
      name: 'sensoryDetails',
      type: 'array',
      admin: {
        description: 'Sensory observations (texture, taste, smell, sound)',
      },
      fields: [
        {
          name: 'detail',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., "crispy outside, soft inside", "smoky from charcoal"',
          },
        },
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Texture', value: 'texture' },
            { label: 'Taste', value: 'taste' },
            { label: 'Smell', value: 'smell' },
            { label: 'Sound', value: 'sound' },
            { label: 'Visual', value: 'visual' },
            { label: 'Temperature', value: 'temperature' },
          ],
        },
      ],
    },
    {
      name: 'surprises',
      type: 'textarea',
      admin: {
        description: 'Unexpected things you learned or discovered',
      },
    },
    {
      name: 'recommendations',
      type: 'array',
      admin: {
        description: 'Actionable tips for visitors',
      },
      fields: [
        {
          name: 'tip',
          type: 'text',
          required: true,
        },
        {
          name: 'priority',
          type: 'select',
          options: [
            { label: 'Must-do', value: 'must' },
            { label: 'Highly recommended', value: 'high' },
            { label: 'Nice to know', value: 'nice' },
          ],
        },
      ],
    },
    {
      name: 'bestTime',
      type: 'text',
      admin: {
        description: 'Best time to visit (e.g., "Before 8 AM", "5 PM-7 PM")',
      },
    },
    {
      name: 'priceRange',
      type: 'text',
      admin: {
        description: 'Price range for the area/food (e.g., "RM 5-15 per dish")',
      },
    },
    {
      name: 'rawNote',
      type: 'textarea',
      admin: {
        description: 'Original voice transcript or quick notes (for reference)',
        position: 'sidebar',
      },
    },
    {
      name: 'images',
      type: 'array',
      admin: {
        description: 'Photos from the visit',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'What is shown in this photo',
          },
        },
      ],
    },
    {
      name: 'linkedContent',
      type: 'relationship',
      relationTo: 'stories',
      hasMany: true,
      admin: {
        description: 'Existing stories this note should enrich',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Ready for Review', value: 'ready_review' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Used in Content', value: 'used' },
      ],
      defaultValue: 'draft',
      admin: {
        description: 'Current status',
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ operation, data }) => {
        if (operation === 'create' && data.title && !data.slug) {
          data.slug = data.title
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
}
