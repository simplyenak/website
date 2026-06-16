import type { CollectionConfig } from 'payload'

export const FoodItems: CollectionConfig = {
  slug: 'food_items',
  admin: {
    useAsTitle: 'name',
    group: 'Reference Data',
    description: '🍜 Food and drink items (dishes, beverages, snacks)',
    defaultColumns: ['name', 'category', 'origin', 'dietaryTags', 'status'],
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
        interval: 300000,
      },
    },
    maxPerDoc: 50,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Dish name (e.g., "Nasi Lemak", "Char Koay Teow")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "nasi-lemak")',
      },
    },
    {
      name: 'localNames',
      type: 'array',
      admin: {
        description: 'Names in local languages (Bahasa, Chinese, Tamil)',
      },
      fields: [
        {
          name: 'language',
          type: 'select',
          options: [
            { label: 'Bahasa Malaysia', value: 'ms' },
            { label: 'Chinese (Mandarin)', value: 'zh' },
            { label: 'Chinese (Hokkien)', value: 'hokkien' },
            { label: 'Chinese (Cantonese)', value: 'cantonese' },
            { label: 'Tamil', value: 'ta' },
            { label: 'English', value: 'en' },
          ],
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'script',
          type: 'text',
          admin: {
            description: 'Native script (e.g., 椰浆饭 for Chinese)',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'What is this dish? Key characteristics and appeal',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Main Dish', value: 'main' },
        { label: 'Street Snack', value: 'snack' },
        { label: 'Dessert', value: 'dessert' },
        { label: 'Beverage', value: 'beverage' },
        { label: 'Coffee/Tea', value: 'coffee_tea' },
        { label: 'Fresh Juice', value: 'juice' },
        { label: 'Traditional Drink', value: 'traditional_drink' },
        { label: 'Condiment/Sauce', value: 'condiment' },
        { label: 'Breakfast', value: 'breakfast' },
        { label: 'Soup', value: 'soup' },
        { label: 'Noodles', value: 'noodles' },
        { label: 'Rice Dish', value: 'rice' },
        { label: 'Satay/Grilled', value: 'grilled' },
      ],
      required: true,
      admin: {
        description: 'Type of food or drink',
      },
    },
    {
      name: 'origin',
      type: 'select',
      options: [
        { label: 'Malay', value: 'malay' },
        { label: 'Chinese', value: 'chinese' },
        { label: 'Indian', value: 'indian' },
        { label: 'Peranakan/Nonya', value: 'peranakan' },
        { label: 'Thai', value: 'thai' },
        { label: 'Indonesian', value: 'indonesian' },
        { label: 'Fusion', value: 'fusion' },
        { label: 'International', value: 'international' },
      ],
      required: true,
      admin: {
        description: 'Cultural origin of the dish',
      },
    },
    {
      name: 'region',
      type: 'text',
      admin: {
        description: 'Specific region (e.g., "Penang", "Kelantan", "Hainan")',
      },
    },
    {
      name: 'ingredients',
      type: 'array',
      admin: {
        description: 'Key ingredients in this dish',
      },
      fields: [
        {
          name: 'ingredient',
          type: 'text',
          required: true,
        },
        {
          name: 'isMain',
          type: 'checkbox',
          admin: {
            description: 'Main/defining ingredient',
          },
        },
      ],
    },
    {
      name: 'allergens',
      type: 'array',
      admin: {
        description: 'Common allergens present',
      },
      fields: [
        {
          name: 'allergen',
          type: 'select',
          options: [
            { label: 'Shellfish', value: 'shellfish' },
            { label: 'Fish', value: 'fish' },
            { label: 'Peanuts', value: 'peanuts' },
            { label: 'Tree Nuts', value: 'tree_nuts' },
            { label: 'Soy', value: 'soy' },
            { label: 'Wheat/Gluten', value: 'wheat' },
            { label: 'Eggs', value: 'eggs' },
            { label: 'Dairy', value: 'dairy' },
            { label: 'Sesame', value: 'sesame' },
            { label: 'MSG', value: 'msg' },
          ],
          required: true,
        },
      ],
    },
    {
      name: 'dietaryTags',
      type: 'relationship',
      relationTo: 'dietary_options',
      hasMany: true,
      admin: {
        description: 'Which dietary options this dish satisfies (e.g., Halal, Vegetarian)',
      },
    },
    {
      name: 'spiceLevel',
      type: 'select',
      options: [
        { label: 'None', value: '0' },
        { label: 'Mild', value: '1' },
        { label: 'Medium', value: '2' },
        { label: 'Spicy', value: '3' },
        { label: 'Very Spicy', value: '4' },
        { label: 'Extreme', value: '5' },
      ],
      defaultValue: '0',
      admin: {
        description: 'How spicy is this dish?',
      },
    },
    {
      name: 'flavorProfile',
      type: 'array',
      admin: {
        description: 'Dominant flavors',
      },
      fields: [
        {
          name: 'flavor',
          type: 'select',
          options: [
            { label: 'Sweet', value: 'sweet' },
            { label: 'Sour', value: 'sour' },
            { label: 'Salty', value: 'salty' },
            { label: 'Umami', value: 'umami' },
            { label: 'Bitter', value: 'bitter' },
            { label: 'Savory', value: 'savory' },
            { label: 'Creamy', value: 'creamy' },
            { label: 'Tangy', value: 'tangy' },
          ],
          required: true,
        },
      ],
    },
    {
      name: 'preparationMethod',
      type: 'select',
      options: [
        { label: 'Stir-fried', value: 'stir_fried' },
        { label: 'Steamed', value: 'steamed' },
        { label: 'Grilled/BBQ', value: 'grilled' },
        { label: 'Deep-fried', value: 'deep_fried' },
        { label: 'Braised', value: 'braised' },
        { label: 'Boiled', value: 'boiled' },
        { label: 'Raw', value: 'raw' },
        { label: 'Fermented', value: 'fermented' },
        { label: 'Cured', value: 'cured' },
        { label: 'Mixed', value: 'mixed' },
      ],
      admin: {
        description: 'Primary cooking method',
      },
    },
    {
      name: 'typicalPrice',
      type: 'number',
      admin: {
        description: 'Typical price in MYR (street food range)',
      },
    },
    {
      name: 'availability',
      type: 'select',
      options: [
        { label: 'Year-round', value: 'year_round' },
        { label: 'Seasonal', value: 'seasonal' },
        { label: 'Festival only', value: 'festival' },
        { label: 'Weekend only', value: 'weekend' },
        { label: 'Morning only', value: 'morning' },
        { label: 'Night only', value: 'night' },
      ],
      defaultValue: 'year_round',
      admin: {
        description: 'When is this dish typically available?',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main dish photo',
      },
    },
    {
      name: 'galleryImages',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Additional photos of this dish',
      },
    },
    {
      name: 'culturalSignificance',
      type: 'textarea',
      admin: {
        description: 'History, cultural context, stories behind this dish',
      },
    },
    {
      name: 'servingSuggestions',
      type: 'textarea',
      admin: {
        description: 'How is it typically served? Best way to eat it?',
      },
    },
    {
      name: 'popularVariations',
      type: 'textarea',
      admin: {
        description: 'Regional or vendor variations of this dish',
      },
    },
    {
      name: 'pairings',
      type: 'textarea',
      admin: {
        description: 'What drinks or other dishes pair well with this?',
      },
    },
    {
      name: 'vendorNotes',
      type: 'textarea',
      admin: {
        description: 'Notes about famous vendors, stalls, or restaurants',
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
        description: 'Draft = hidden, Published = available for selection',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as signature/must-try dish',
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
        description: 'When this dish was published',
      },
    },
  ],
}
