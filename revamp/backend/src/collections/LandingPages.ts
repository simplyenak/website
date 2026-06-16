import type { CollectionConfig } from 'payload'

export const LandingPages: CollectionConfig = {
  slug: 'landing_pages',
  admin: {
    useAsTitle: 'title',
    group: 'Landing Pages',
    description: '🗺️ Unified landing pages (dietary, specialty, travel type, location)',
    defaultColumns: ['title', 'type', 'slug', 'status'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => ['admin', 'editor'].includes((user as any)?.role),
    update: ({ req: { user } }) => ['admin', 'editor', 'reviewer'].includes((user as any)?.role),
    delete: ({ req: { user } }) => (user as any)?.role === 'admin',
  },
  versions: {
    drafts: {
      autosave: { interval: 3000 },
    },
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      admin: { description: 'Display title (e.g., "Vegetarian Food Tours", "Penang Food Scene")' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL-friendly slug (e.g., "vegetarian", "penang")' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: '🥗 Dietary', value: 'dietary' },
        { label: '⭐ Specialty Experience', value: 'specialty' },
        { label: '🧳 Travel Type', value: 'travel_type' },
        { label: '📍 Location', value: 'location' },
      ],
      admin: {
        description: 'What kind of landing page is this?',
        position: 'sidebar',
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
      admin: { position: 'sidebar' },
    },
    {
      name: 'icon',
      type: 'text',
      admin: { description: 'Emoji icon (e.g., 🥗, 🏛️, 👨‍👩‍👧‍👦)' },
    },
    {
      name: 'color',
      type: 'text',
      admin: { description: 'Brand color hex (e.g., #22c55e)' },
    },

    // === HERO SECTION (all types) ===
    {
      name: 'hero_title',
      type: 'text',
      localized: true,
      admin: { description: 'Hero section title' },
    },
    {
      name: 'hero_subtitle',
      type: 'text',
      localized: true,
      admin: { description: 'Hero subtitle / eyebrow' },
    },
    {
      name: 'hero_description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Hero paragraph' },
    },
    {
      name: 'hero_image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Hero image — select from media library' },
    },

    // === INTRO/CONTENT SECTION (all types) ===
    {
      name: 'intro_heading',
      type: 'text',
      localized: true,
      admin: { description: 'Intro section heading (e.g., "Why It Matters", "The Experience")' },
    },
    {
      name: 'intro_content',
      type: 'textarea',
      localized: true,
      admin: { description: 'Main content paragraph' },
    },

    // === CHALLENGES SECTION (dietary only) ===
    {
      name: 'challenges_heading',
      type: 'text',
      localized: true,
      admin: { description: 'Dietary: Challenges heading' },
    },
    {
      name: 'challenges',
      type: 'array',
      localized: true,
      admin: { description: 'Dietary: Challenges for this dietary type' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
      ],
    },

    // === OPTIONS SECTION (dietary only) ===
    {
      name: 'options_heading',
      type: 'text',
      localized: true,
      admin: { description: 'Dietary: Options/solutions heading' },
    },
    {
      name: 'options_content',
      type: 'textarea',
      localized: true,
      admin: { description: 'Dietary: How we cater to this dietary need' },
    },

    // === FEATURES/HIGHLIGHTS SECTION (specialty, travel_type) ===
    {
      name: 'features_heading',
      type: 'text',
      localized: true,
      admin: { description: 'Features/highlights heading' },
    },
    {
      name: 'highlights',
      type: 'array',
      localized: true,
      admin: { description: 'Key features or highlights' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
      ],
    },

    // === TIPS SECTION (all types) ===
    {
      name: 'tips_heading',
      type: 'text',
      localized: true,
      admin: { description: 'Tips section heading' },
    },
    {
      name: 'tips_content',
      type: 'textarea',
      localized: true,
      admin: { description: 'General tips content' },
    },
    {
      name: 'tips',
      type: 'array',
      localized: true,
      admin: { description: 'Individual tip cards (title + content)' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'text' },
      ],
    },

    // === DISH LISTS (dietary: safe dishes / avoid dishes) ===
    {
      name: 'safe_dishes_heading',
      type: 'text',
      localized: true,
      admin: { description: 'Dietary: "Dishes you can enjoy" heading' },
    },
    {
      name: 'safe_dishes',
      type: 'array',
      localized: true,
      admin: { description: 'Dietary: Safe dishes to recommend' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'text' },
      ],
    },
    {
      name: 'avoid_dishes_heading',
      type: 'text',
      localized: true,
      admin: { description: 'Dietary: "Dishes to avoid" heading' },
    },
    {
      name: 'avoid_dishes',
      type: 'array',
      localized: true,
      admin: { description: 'Dietary: Dishes to avoid for this type' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'text' },
      ],
    },

    // === TOUR LIST (travel_type: suitable tours) ===
    {
      name: 'tours_heading',
      type: 'text',
      localized: true,
      admin: { description: 'Travel type: "Suitable tours" heading' },
    },
    {
      name: 'suitable_tours',
      type: 'array',
      admin: { description: 'Travel type: Tour slugs that suit this travel type' },
      fields: [
        { name: 'tour_slug', type: 'text', required: true, admin: { description: 'Tour slug (e.g., "chow-kit-market-food-tour")' } },
      ],
    },

    // === TRAVEL TIPS (location: travel tips) ===
    {
      name: 'travel_tips',
      type: 'array',
      localized: true,
      admin: { description: 'Location: Travel tips (title + content per tip)' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'text' },
      ],
    },

    // === SEO ===
    {
      name: 'meta_title',
      type: 'text',
      localized: true,
      admin: { description: 'SEO meta title' },
    },
    {
      name: 'meta_description',
      type: 'textarea',
      localized: true,
      admin: { description: 'SEO meta description' },
    },
    {
      name: 'content',
      type: 'textarea',
      localized: true,
      admin: {
        description: '📝 Page content — formatted with ## headings and paragraphs. This is the main body of your landing page.',
        components: {
          Input: '@/components/admin/landing/ContentEditor',
        },
      },
    },
    {
      name: 'published_at',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
}
