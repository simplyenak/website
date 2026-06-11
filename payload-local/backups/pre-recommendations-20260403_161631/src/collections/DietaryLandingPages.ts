import type { CollectionConfig } from 'payload'

export const DietaryLandingPages: CollectionConfig = {
  slug: 'dietary_landing_pages',
  admin: {
    group: 'Landing Pages',
    description: '🥗 Dietary-specific landing pages (Vegetarian, Halal, etc.)',
    useAsTitle: 'dietary_name',
  },
  fields: [
    { name: 'dietary_name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'status', type: 'select',
      options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }],
      defaultValue: 'draft',
    },
    { name: 'icon', type: 'text' },
    { name: 'color', type: 'text' },

    // Hero Section (blocks)
    {
      name: 'heroSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Hero section with title, subtitle, description, and image' },
      blocks: [{
        slug: 'heroBlock',
        labels: { singular: 'Hero Block', plural: 'Hero Blocks' },
        fields: [
          { name: 'title', type: 'text' },
          { name: 'subtitle', type: 'text' },
          { name: 'description', type: 'textarea' },
          { name: 'image', type: 'text' },
        ],
      }],
    },

    // Challenges Section (blocks)
    {
      name: 'challengesSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Challenges section for this dietary option' },
      blocks: [{
        slug: 'contentBlock',
        labels: { singular: 'Content Block', plural: 'Content Blocks' },
        fields: [
          { name: 'title', type: 'text' },
          { name: 'content', type: 'textarea' },
        ],
      }],
    },

    // Options Section (blocks)
    {
      name: 'optionsSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'What options are available' },
      blocks: [{
        slug: 'contentBlock',
        labels: { singular: 'Content Block', plural: 'Content Blocks' },
        fields: [
          { name: 'title', type: 'text' },
          { name: 'content', type: 'textarea' },
        ],
      }],
    },

    // Tips Section (blocks)
    {
      name: 'tipsSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Tips and advice' },
      blocks: [{
        slug: 'tipsBlock',
        labels: { singular: 'Tips Block', plural: 'Tips Blocks' },
        fields: [
          { name: 'content', type: 'textarea' },
        ],
      }],
    },

    // Safe Dishes (blocks)
    {
      name: 'safeDishesSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Dishes that are safe to eat' },
      blocks: [{
        slug: 'dishListBlock',
        labels: { singular: 'Dish List Block', plural: 'Dish List Blocks' },
        fields: [
          {
            name: 'dishes',
            type: 'array',
            admin: { initCollapsed: true, description: 'List of safe dishes' },
            fields: [{ name: 'name', type: 'text', required: true }],
          },
        ],
      }],
    },

    // Dishes to Avoid (blocks)
    {
      name: 'avoidDishesSection',
      type: 'blocks',
      maxRows: 1,
      admin: { description: 'Dishes to avoid for this dietary option' },
      blocks: [{
        slug: 'dishListBlock',
        labels: { singular: 'Dish List Block', plural: 'Dish List Blocks' },
        fields: [
          {
            name: 'dishes',
            type: 'array',
            admin: { initCollapsed: true, description: 'List of dishes to avoid' },
            fields: [{ name: 'name', type: 'text', required: true }],
          },
        ],
      }],
    },

    // SEO
    { name: 'meta_title', type: 'text', admin: { group: 'SEO' } },
    { name: 'meta_description', type: 'textarea', admin: { group: 'SEO' } },
    { name: 'published_at', type: 'date' },
  ],
}
