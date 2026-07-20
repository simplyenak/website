import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

export const ToursPage: CollectionConfig = {
  slug: 'tours_page',
  localization: true,
  hooks: {
    afterChange: [triggerStagingDeploy],
  },
  admin: {
    useAsTitle: 'seo_title',
    group: 'Pages',
    description: '🏝️ Tours listing page — every section, image, and text is managed here',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => ['admin', 'editor'].includes((user as any)?.role),
    update: ({ req: { user } }) => ['admin', 'editor', 'reviewer'].includes((user as any)?.role),
    delete: ({ req: { user } }) => (user as any)?.role === 'admin',
  },
  fields: [
    // ── SEO ──────────────────────────────────────────────────────────────────
    { name: 'seo_title', type: 'text', required: true },
    { name: 'seo_description', type: 'textarea', required: true },

    // ── Hero Section ─────────────────────────────────────────────────────────
    {
      name: 'hero_image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Hero background image — upload or select from media library' },
    },
    { name: 'hero_title', type: 'text', required: true, admin: { description: 'Main heading (supports HTML like <br/>)' } },
    { name: 'hero_highlight', type: 'text', admin: { description: 'Word/phrase inside <span class="text-accent"> in title' } },
    { name: 'hero_cta_primary_text', type: 'text' },
    { name: 'hero_cta_primary_href', type: 'text' },
    { name: 'hero_cta_secondary_text', type: 'text' },
    { name: 'hero_cta_secondary_href', type: 'text' },

    // ── Three Ways to Experience ─────────────────────────────────────────────
    {
      name: 'three_ways_eyebrow',
      type: 'text',
      admin: { description: 'e.g. "YOUR CHOICE"' },
    },
    { name: 'three_ways_heading', type: 'text' },
    { name: 'three_ways_section_description', type: 'textarea' },
    {
      name: 'three_ways',
      type: 'array',
      maxRows: 3,
      admin: { description: '3 cards — Private Tour, Tailored Experience, Join a Small Group' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'features', type: 'array', fields: [{ name: 'feature', type: 'text', required: true }] },
        { name: 'cta_text', type: 'text' },
        { name: 'cta_href', type: 'text' },
        { name: 'is_popular', type: 'checkbox', admin: { description: 'Highlight this card as "POPULAR"' } },
      ],
    },

    // ── Signature Tours Section ───────────────────────────────────────────────
    {
      name: 'signature_eyebrow',
      type: 'text',
      admin: { description: 'e.g. "THE ORIGINALS"' },
    },
    { name: 'signature_heading', type: 'text' },
    { name: 'signature_description', type: 'textarea' },

    // ── Tours by City ────────────────────────────────────────────────────────
    {
      name: 'city_eyebrow',
      type: 'text',
      admin: { description: 'e.g. "BY DESTINATION"' },
    },
    { name: 'city_heading', type: 'text' },
    { name: 'city_description', type: 'textarea' },
    {
      name: 'cities',
      type: 'array',
      admin: { description: 'Tour destination cards shown in the grid' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'City hero image' },
        },
        { name: 'href', type: 'text', admin: { description: 'Link to city tours page, e.g. /tours/locations/food-tours-kuala-lumpur' } },
        { name: 'tour_count_label', type: 'text', admin: { description: 'e.g. "3 tours →", "Coming soon →"' } },
      ],
    },

    // ── By Dietary ────────────────────────────────────────────────────────────
    {
      name: 'dietary_eyebrow',
      type: 'text',
      admin: { description: 'e.g. "DIETARY PREFERENCES"' },
    },
    { name: 'dietary_heading', type: 'text' },
    { name: 'dietary_description', type: 'textarea' },
    {
      name: 'dietary_image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Image used across all dietary cards' },
    },

    // ── By Experience ─────────────────────────────────────────────────────────
    {
      name: 'experience_eyebrow',
      type: 'text',
      admin: { description: 'e.g. "EXPERIENCE TYPE"' },
    },
    { name: 'experience_heading', type: 'text' },
    { name: 'experience_description', type: 'textarea' },
    {
      name: 'experiences',
      type: 'array',
      admin: { description: 'Experience type cards (Street Food, Market, Heritage, Night Tour)' },
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Card background image' },
        },
        {
          name: 'specialty_slug',
          type: 'text',
          admin: { description: 'Slug of the specialty experience (e.g. street-food, market-tour, heritage, night-tour). Used to filter tours.' },
        },
        { name: 'href', type: 'text', admin: { description: 'Landing page link, e.g. /tours/specialty/street-food-tours-kuala-lumpur' } },
      ],
    },

    // ── Who You're Traveling With ─────────────────────────────────────────────
    {
      name: 'travel_with_eyebrow',
      type: 'text',
      admin: { description: 'e.g. "TRAVEL STYLE"' },
    },
    { name: 'travel_with_heading', type: 'text' },
    { name: 'travel_with_description', type: 'textarea' },
    {
      name: 'travel_with_options',
      type: 'array',
      admin: { description: 'Travel style cards (Family, Couples, Foodie)' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'icon', type: 'text', admin: { description: 'Emoji icon, e.g. 👨‍👩‍👧‍👦' } },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Card background image' },
        },
        {
          name: 'travel_type_slug',
          type: 'text',
          admin: { description: 'Slug of the travel type (e.g. family, couples, foodie). Used to filter tours.' },
        },
        { name: 'href', type: 'text', admin: { description: 'Segment page link, e.g. /tours/segments/food-tours-for-families-kuala-lumpur' } },
      ],
    },

    // ── Groups & Events ───────────────────────────────────────────────────────
    {
      name: 'groups_eyebrow',
      type: 'text',
      admin: { description: 'e.g. "FOR GROUPS"' },
    },
    { name: 'groups_heading', type: 'text' },
    { name: 'groups_section_description', type: 'textarea' },
    {
      name: 'groups',
      type: 'array',
      admin: { description: 'Group & event cards' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Card background image' },
        },
        { name: 'href', type: 'text' },
      ],
    },

    // ── Tailor Make Your Own Tour ─────────────────────────────────────────────
    {
      name: 'tailor_eyebrow',
      type: 'text',
      admin: { description: 'e.g. "FULLY CUSTOM"' },
    },
    { name: 'tailor_heading', type: 'text' },
    { name: 'tailor_description', type: 'textarea' },
    {
      name: 'tailor_image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Image for the tailor section' },
    },
    {
      name: 'tailor_features',
      type: 'array',
      admin: { description: 'Bullet list of benefits (any duration, combine cities, WhatsApp planning)' },
      fields: [{ name: 'feature', type: 'text', required: true }],
    },
    { name: 'tailor_cta_text', type: 'text' },
    { name: 'tailor_cta_href', type: 'text' },

    // ── Find Your Perfect Tour ────────────────────────────────────────────────
    { name: 'find_tour_heading', type: 'text', admin: { description: 'e.g. "Find Your Perfect Tour"' } },
    { name: 'find_tour_description', type: 'text', admin: { description: 'e.g. "Browse all our tour categories"' } },

    // ── Not Sure CTA ──────────────────────────────────────────────────────────
    { name: 'not_sure_heading', type: 'text' },
    { name: 'not_sure_description', type: 'textarea' },
    { name: 'not_sure_cta_text', type: 'text' },
    { name: 'not_sure_cta_href', type: 'text' },
  ],
}
