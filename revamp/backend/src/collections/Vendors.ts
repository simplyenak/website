import type { CollectionConfig } from 'payload'

export const Vendors: CollectionConfig = {
  slug: 'vendors',
  localization: true,
  admin: {
    useAsTitle: 'name',
    group: 'Reference Data',
    description: '🏪 Food vendors, stalls, hawkers, and restaurants',
    defaultColumns: ['name', 'type', 'location', 'specialtyDishes', 'status'],
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
  fields: [
    {
      name: 'name',
      type: 'text',
            required: true,
      admin: {
        description: 'Vendor/stall/restaurant name',
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
      name: 'type',
      type: 'select',
      options: [
        { label: 'Street Stall', value: 'street_stall' },
        { label: 'Hawker Stall', value: 'hawker_stall' },
        { label: 'Food Court', value: 'food_court' },
        { label: 'Coffee Shop (Kopitiam)', value: 'kopitiam' },
        { label: 'Restaurant', value: 'restaurant' },
        { label: 'Night Market Stall', value: 'pasar_malam' },
        { label: 'Morning Market Stall', value: 'pasar_pagi' },
        { label: 'Home Kitchen', value: 'home_kitchen' },
        { label: 'Food Truck', value: 'food_truck' },
        { label: 'Heritage Shop', value: 'heritage_shop' },
      ],
      required: true,
      admin: {
        description: 'Type of vendor establishment',
      },
    },
    {
      name: 'description',
      type: 'textarea',
            required: true,
      admin: {
        description: 'Brief description of this vendor',
      },
    },
    {
      name: 'history',
      type: 'textarea',
            admin: {
        description: 'History, heritage, family story behind this vendor',
      },
    },
    {
      name: 'yearEstablished',
      type: 'number',
      admin: {
        description: 'Year started (e.g., 1965)',
      },
    },
    {
      name: 'generation',
      type: 'text',
            admin: {
        description: 'Which generation runs it now (e.g., "2nd generation", "3rd generation")',
      },
    },
    {
      name: 'ownerName',
      type: 'text',
            admin: {
        description: 'Current owner/chef name',
      },
    },
    {
      name: 'specialtyDishes',
      type: 'relationship',
      relationTo: 'food_items',
      hasMany: true,
      admin: {
        description: 'Signature food and drink items this vendor is known for',
      },
    },
    {
      name: 'cuisineType',
      type: 'select',
      options: [
        { label: 'Malay', value: 'malay' },
        { label: 'Chinese', value: 'chinese' },
        { label: 'Indian', value: 'indian' },
        { label: 'Peranakan/Nonya', value: 'peranakan' },
        { label: 'Thai', value: 'thai' },
        { label: 'Indonesian', value: 'indonesian' },
        { label: 'Western', value: 'western' },
        { label: 'Fusion', value: 'fusion' },
        { label: 'Mixed', value: 'mixed' },
      ],
      required: true,
      admin: {
        description: 'Primary cuisine type',
      },
    },
    {
      name: 'location',
      type: 'group',
            fields: [
        {
          name: 'address',
          type: 'text',
          admin: {
            description: 'Street address',
          },
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'select',
          options: [
            { label: 'Kuala Lumpur', value: 'kl' },
            { label: 'Penang', value: 'penang' },
            { label: 'Selangor', value: 'selangor' },
            { label: 'Melaka', value: 'melaka' },
            { label: 'Johor', value: 'johor' },
            { label: 'Perak', value: 'perak' },
            { label: 'Kelantan', value: 'kelantan' },
            { label: 'Terengganu', value: 'terengganu' },
            { label: 'Kedah', value: 'kedah' },
            { label: 'Pahang', value: 'pahang' },
            { label: 'Negeri Sembilan', value: 'ns' },
            { label: 'Perlis', value: 'perlis' },
            { label: 'Sabah', value: 'sabah' },
            { label: 'Sarawak', value: 'sarawak' },
          ],
          required: true,
        },
        {
          name: 'postcode',
          type: 'text',
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'Malaysia',
        },
        {
          name: 'latitude',
          type: 'number',
          admin: {
            description: 'For map display',
          },
        },
        {
          name: 'longitude',
          type: 'number',
          admin: {
            description: 'For map display',
          },
        },
        {
          name: 'landmark',
          type: 'text',
          admin: {
            description: 'Nearby landmark for directions (e.g., "opposite Maybank", "next to Chowrasta Market")',
          },
        },
      ],
    },
    {
      name: 'operatingHours',
      type: 'array',
            admin: {
        description: 'Operating hours by day',
      },
      fields: [
        {
          name: 'day',
          type: 'select',
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
            { label: 'Public Holiday', value: 'holiday' },
          ],
          required: true,
        },
        {
          name: 'openTime',
          type: 'text',
          admin: {
            description: 'Opening time (e.g., "7:00 AM", "18:00")',
          },
        },
        {
          name: 'closeTime',
          type: 'text',
          admin: {
            description: 'Closing time',
          },
        },
        {
          name: 'isClosed',
          type: 'checkbox',
          admin: {
            description: 'Closed this day',
          },
        },
        {
          name: 'notes',
          type: 'text',
          admin: {
            description: 'Special notes (e.g., "Lunch only", "Morning shift only")',
          },
        },
      ],
    },
    {
      name: 'closedOn',
      type: 'array',
      admin: {
        description: 'Regular closed days',
      },
      fields: [
        {
          name: 'day',
          type: 'select',
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
            { label: 'Public Holiday', value: 'holiday' },
          ],
          required: true,
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'phone',
          type: 'text',
          admin: {
            description: 'Phone number',
          },
        },
        {
          name: 'whatsapp',
          type: 'text',
          admin: {
            description: 'WhatsApp number',
          },
        },
        {
          name: 'email',
          type: 'text',
          admin: {
            description: 'Email address',
          },
        },
        {
          name: 'website',
          type: 'text',
          admin: {
            description: 'Website URL',
          },
        },
        {
          name: 'facebook',
          type: 'text',
          admin: {
            description: 'Facebook page URL',
          },
        },
        {
          name: 'instagram',
          type: 'text',
          admin: {
            description: 'Instagram handle or URL',
          },
        },
      ],
    },
    {
      name: 'priceRange',
      type: 'select',
      options: [
        { label: '$ (Budget, <RM10)', value: 'budget' },
        { label: '$$ (Moderate, RM10-30)', value: 'moderate' },
        { label: '$$$ (Upscale, RM30-80)', value: 'upscale' },
        { label: '$$$$ (Fine Dining, >RM80)', value: 'fine_dining' },
      ],
      admin: {
        description: 'Price range',
      },
    },
    {
      name: 'paymentMethods',
      type: 'array',
      admin: {
        description: 'Accepted payment methods',
      },
      fields: [
        {
          name: 'method',
          type: 'select',
          options: [
            { label: 'Cash', value: 'cash' },
            { label: 'Credit Card', value: 'credit_card' },
            { label: 'Debit Card', value: 'debit_card' },
            { label: 'Touch \'n Go eWallet', value: 'tng' },
            { label: 'GrabPay', value: 'grabpay' },
            { label: 'Boost', value: 'boost' },
            { label: 'QR Pay', value: 'qr_pay' },
            { label: 'Online Banking', value: 'online_banking' },
          ],
          required: true,
        },
      ],
    },
    {
      name: 'facilities',
      type: 'array',
      admin: {
        description: 'Available facilities',
      },
      fields: [
        {
          name: 'facility',
          type: 'select',
          options: [
            { label: 'Air Conditioning', value: 'aircon' },
            { label: 'WiFi', value: 'wifi' },
            { label: 'Parking', value: 'parking' },
            { label: 'Wheelchair Accessible', value: 'wheelchair' },
            { label: 'Halal Certified', value: 'halal_cert' },
            { label: 'Prayer Room', value: 'prayer_room' },
            { label: 'Outdoor Seating', value: 'outdoor' },
            { label: 'Takeaway', value: 'takeaway' },
            { label: 'Delivery', value: 'delivery' },
            { label: 'Reservations Accepted', value: 'reservations' },
            { label: 'Family Friendly', value: 'family' },
          ],
          required: true,
        },
      ],
    },
    {
      name: 'dietaryOptions',
      type: 'relationship',
      relationTo: 'dietary_options',
      hasMany: true,
      admin: {
        description: 'Dietary accommodations available',
      },
    },
    {
      name: 'images',
      type: 'group',
      fields: [
        {
          name: 'main',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Main photo of vendor/stall',
          },
        },
        {
          name: 'gallery',
          type: 'array',
          admin: {
            description: 'Additional photos',
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
      ],
    },
    {
      name: 'story',
      type: 'textarea',
            admin: {
        description: 'Full story, anecdotes, interesting facts about this vendor',
      },
    },
    {
      name: 'awards',
      type: 'array',
            admin: {
        description: 'Awards, recognitions, media features',
      },
      fields: [
        {
          name: 'award',
          type: 'text',
          required: true,
        },
        {
          name: 'year',
          type: 'number',
        },
        {
          name: 'organization',
          type: 'text',
        },
      ],
    },
    {
      name: 'mediaFeatures',
      type: 'textarea',
            admin: {
        description: 'TV shows, newspapers, magazines, blogs that featured this vendor',
      },
    },
    {
      name: 'tips',
      type: 'textarea',
            admin: {
        description: 'Tips for visitors (e.g., "Arrive early", "Cash only", "Best to try X dish")',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Closed Permanently', value: 'closed' },
      ],
      defaultValue: 'draft',
      admin: {
        description: 'Current operational status',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as featured/heritage vendor',
      },
    },
    {
      name: 'scheduledPublish',
      type: 'date',
      admin: {
        description: 'Auto-publish at this date/time',
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        description: 'When this vendor was published',
      },
    },
  ],
}
