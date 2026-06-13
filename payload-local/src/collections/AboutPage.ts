/**
 * About Page — Payload Collection (flat field approach for extras)
 *
 * Uses blocks for structured sections + flat fields for additional content
 * that doesn't fit Payload's auto-generated block tables.
 */
import type { CollectionConfig } from 'payload'

export const AboutPage: CollectionConfig = {
  slug: 'about_page',
  admin: {
    group: 'Pages',
    useAsTitle: 'seo_title',
    description: '📖 About page content',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => ['admin', 'editor'].includes((user as any)?.role),
    update: ({ req: { user } }) => ['admin', 'editor'].includes((user as any)?.role),
    delete: ({ req: { user } }) => (user as any)?.role === 'admin',
  },
  fields: [
    // SEO
    { name: 'seo_title', type: 'text' },
    { name: 'seo_description', type: 'textarea' },

    // Hero flat fields (blocks handle title+subtitle, these are extras)
    { name: 'hero_image', type: 'text', admin: { description: 'Hero background image URL' } },
    { name: 'hero_eyebrow', type: 'text', admin: { description: 'Small label above title (e.g. "Our Story")' } },
    { name: 'hero_description', type: 'textarea' },

    // Hero Section (blocks)
    {
      name: 'heroSection', type: 'blocks', maxRows: 1,
      admin: { description: 'Page hero with title and subtitle' },
      blocks: [{
        slug: 'heroBlock',
        labels: { singular: 'Hero Block', plural: 'Hero Blocks' },
        fields: [
          { name: 'title', type: 'text' },
          { name: 'subtitle', type: 'text' },
        ],
      }],
    },

    // Founder Story flat fields
    { name: 'founder_eyebrow', type: 'text' },
    { name: 'founder_heading', type: 'text' },
    { name: 'founder_image', type: 'text', admin: { description: 'Founder photo URL' } },
    { name: 'founder_paragraphs', type: 'textarea', admin: { description: 'Founder story paragraphs (separated by blank lines)' } },

    // Stats Section (blocks) — unchanged from original
    {
      name: 'statsSection', type: 'blocks', maxRows: 1,
      admin: { description: 'Key statistics about Simply Enak' },
      blocks: [{
        slug: 'statsBlock',
        labels: { singular: 'Stats Block', plural: 'Stats Blocks' },
        fields: [{
          name: 'stats', type: 'array', maxRows: 10,
          fields: [
            { name: 'number', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
          ],
        }],
      }],
    },

    // Timeline flat fields (blocks handle events)
    { name: 'timeline_eyebrow', type: 'text' },
    { name: 'timeline_heading', type: 'text' },
    { name: 'timeline_description', type: 'textarea' },

    // Timeline Section (blocks) — uses events array (existing table name)
    {
      name: 'timelineSection', type: 'blocks', maxRows: 1,
      admin: { description: 'Company history timeline' },
      blocks: [{
        slug: 'timelineBlock',
        labels: { singular: 'Timeline Block', plural: 'Timeline Blocks' },
        fields: [{
          name: 'events', type: 'array', maxRows: 30,
          fields: [
            { name: 'year', type: 'text', required: true },
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
          ],
        }],
      }],
    },

    // Philosophy flat fields
    { name: 'philosophy_eyebrow', type: 'text' },
    { name: 'philosophy_heading', type: 'text' },
    { name: 'philosophy_items', type: 'textarea', admin: { description: 'JSON array of {number, title, description} objects' } },

    // Team flat fields
    { name: 'team_eyebrow', type: 'text' },
    { name: 'team_heading', type: 'text' },
    { name: 'team_description', type: 'textarea' },
    { name: 'team_members', type: 'textarea', admin: { description: 'JSON array of {name, role, specialty, description, photo} objects' } },

    // Testimonial flat fields
    { name: 'testimonial_text', type: 'textarea' },
    { name: 'testimonial_name', type: 'text' },
    { name: 'testimonial_location', type: 'text' },

    // CTA flat fields
    { name: 'cta_heading', type: 'text' },
    { name: 'cta_description', type: 'textarea' },
    { name: 'cta_primary_text', type: 'text' },
    { name: 'cta_primary_url', type: 'text' },
    { name: 'cta_secondary_text', type: 'text' },
    { name: 'cta_secondary_url', type: 'text' },
  ],
}