import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

export const LandingPages: CollectionConfig = {
  slug: 'landing_pages',
  localization: true,
  hooks: {
    afterChange: [triggerStagingDeploy],
  },
  admin: {
    useAsTitle: 'title',
    group: 'Landing Pages',
    description: '🗺️ Dedicated landing pages — hero + intro + auto-linked tours. Long-form guides live in Stories.',
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
    // === HERO SECTION (all types) ===
    {
      name: 'hero_title',
      type: 'text',
            admin: { description: 'Hero section title' },
    },
    {
      name: 'hero_subtitle',
      type: 'text',
            admin: { description: 'Hero subtitle / eyebrow' },
    },
    {
      name: 'hero_description',
      type: 'textarea',
            admin: { description: 'Hero paragraph' },
    },
    {
      name: 'hero_image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Hero image — select from media library' },
    },

    // === SEO — handled by @payloadcms/plugin-seo (meta group with title, description, image) ===
    {
      name: 'content',
      type: 'textarea',
          admin: {
        description: '📝 Short intro paragraph (2-3 sentences). Long-form guides live in Stories.',
      },
    },
    {
      name: 'intro_heading',
      type: 'text',
          admin: { description: 'Heading for the intro section (e.g., "Why vegetarian food in KL?")' },
    },
    {
      name: 'intro_content',
      type: 'textarea',
          admin: { description: 'Intro paragraph body for location pages (maps to location-landing-pages.json intro_content)' },
    },
    {
      name: 'tips_heading',
      type: 'text',
          admin: { description: 'Heading for travel tips section on location pages (maps to travel_tips_heading)' },
    },
    {
      name: 'travel_tips',
      type: 'array',
      admin: { description: 'Travel tips for location pages (maps to location-landing-pages.json travel_tips)' },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'content', type: 'textarea' },
      ],
    },
    // === Segment copy — hero hook, problem, main body ===
    // Per-page marketing copy that used to be hardcoded in
    // LandingPageSections.astro. Payload is the source of truth; the
    // component falls back to hardcoded strings only when a page has no
    // record yet (e.g. segments without a landing page).
    //
    // Design (Maarten, 2026-08-06): ONE markdown field for the page body
    // so copy can be edited per page in a single textarea. The component
    // renders it as prose; optional "## People / ## Places / ## Stories"
    // headings render as the three-card layout.
    {
      name: 'hero_hook',
      type: 'textarea',
          admin: { description: 'Hero hook line under the page title (replaces hardcoded getHook())' },
    },
    {
      name: 'problem_heading',
      type: 'text',
          admin: { description: 'Problem/agitate section title (replaces hardcoded getProblem())' },
    },
    {
      name: 'problem_content',
      type: 'textarea',
          admin: { description: 'Problem/agitate section body (replaces hardcoded getProblem())' },
    },
    {
      name: 'body_markdown',
      type: 'textarea',
          admin: {
        description: 'Main page copy in Markdown. Optional "## People", "## Places", "## Stories" headings render as the three-card layout; everything else renders as prose paragraphs.',
      },
    },
    {
      name: 'cta_text',
      type: 'text',
          admin: { description: 'Primary CTA button text (e.g., "Browse vegetarian tours")' },
    },
    {
      name: 'cta_href',
      type: 'text',
          admin: { description: 'Primary CTA link (e.g., "#tours" or "/contact")' },
    },
    {
      name: 'guide_link_text',
      type: 'text',
          admin: { description: 'Link to the full guide on Stories (e.g., "Read our complete vegetarian guide →")' },
    },
    {
      name: 'guide_slug',
      type: 'text',
          admin: { description: 'Story slug for the full guide (e.g., "vegetarian-guide-kuala-lumpur")' },
    },
    {
      name: 'images',
      type: 'array',
      admin: {
        description: '🖼️ Images for this page — uploaded images generate WebP with responsive sizes and appear in structured data. Add alt text for SEO.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { description: 'Upload image — will be optimized to WebP with responsive sizes' },
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
          admin: { description: 'Alt text (required for SEO & accessibility — describe what the image shows)' },
        },
        {
          name: 'caption',
          type: 'text',
          admin: { description: 'Optional caption displayed below the image' },
        },
        {
          name: 'position',
          type: 'select',
          defaultValue: 'inline',
          options: [
            { label: 'Inline (within content sections)', value: 'inline' },
            { label: 'Hero background', value: 'hero' },
          ],
          admin: { description: 'Where to place this image on the page' },
        },
      ],
    },
    // === SEO — standalone fields (not via SEO plugin, to avoid GraphQL collision with Pages) ===
    {
      name: 'meta_title',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'SEO title (< 60 chars). Falls back to segment cache if empty.',
      },
    },
    {
      name: 'meta_description',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'SEO meta description (140-160 chars). Falls back to segment cache if empty.',
      },
    },
    // === Translations — per-locale content (source of truth for the JSON translations array) ===
    {
      name: 'translations',
      type: 'array',
      admin: {
        description: '🌐 Per-locale translations. Base fields are default locale (en); translations rows hold other languages. Sync pulls these into the site JSON.',
      },
      fields: [
        {
          name: 'languages_code',
          type: 'select',
          required: true,
          options: [
            { label: 'English', value: 'en' },
            { label: 'Bahasa Malaysia', value: 'ms' },
            { label: '中文', value: 'zh' },
            { label: 'Deutsch', value: 'de' },
            { label: 'Español', value: 'es' },
            { label: 'Français', value: 'fr' },
            { label: 'Nederlands', value: 'nl' },
            { label: 'Русский', value: 'ru' },
            { label: '日本語', value: 'ja' },
            { label: 'Português', value: 'pt' },
          ],
          admin: { description: 'Language code for this translation row' },
        },
        { name: 'hero_title', type: 'text' },
        { name: 'hero_subtitle', type: 'text' },
        { name: 'hero_description', type: 'textarea' },
        { name: 'meta_title', type: 'text' },
        { name: 'meta_description', type: 'textarea' },
        { name: 'dietary_name', type: 'text' },
        { name: 'specialty_name', type: 'text' },
        { name: 'travel_type_name', type: 'text' },
        { name: 'icon', type: 'text' },
        { name: 'color', type: 'text' },
        { name: 'challenges_heading', type: 'text' },
        { name: 'options_heading', type: 'text' },
        { name: 'options_content', type: 'textarea' },
        { name: 'tips_heading', type: 'text' },
        { name: 'tips_content', type: 'textarea' },
        { name: 'intro_heading', type: 'text' },
        { name: 'intro_content', type: 'textarea' },
        { name: 'hero_hook', type: 'textarea' },
        { name: 'problem_heading', type: 'text' },
        { name: 'problem_content', type: 'textarea' },
        { name: 'body_markdown', type: 'textarea' },
        { name: 'features_heading', type: 'text' },
        { name: 'safe_dishes_heading', type: 'text' },
        { name: 'avoid_dishes_heading', type: 'text' },
        { name: 'why_perfect_heading', type: 'text' },
        { name: 'why_perfect_content', type: 'textarea' },
        { name: 'expect_heading', type: 'text' },
        { name: 'expect_content', type: 'textarea' },
      ],
    },
    {
      name: 'published_at',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
}
