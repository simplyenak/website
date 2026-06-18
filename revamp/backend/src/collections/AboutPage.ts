import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

export const AboutPage: CollectionConfig = {
  slug: 'about_page',
  hooks: {
    afterChange: [triggerStagingDeploy],
  },
  admin: {
    group: 'Pages',
    useAsTitle: 'seo_title',
    description: '📖 About page content',
  },
  access: {
    read: () => true,
  },
  fields: [
    // SEO
    { name: 'seo_title', type: 'text' },
    { name: 'seo_description', type: 'textarea' },

    // Hero
    {
      name: 'heroSection',
      type: 'blocks',
      maxRows: 1,
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
    { name: 'hero_image', type: 'upload', relationTo: 'media', admin: { description: 'Hero background image — select from media library' } },
    { name: 'hero_eyebrow', type: 'text' },
    { name: 'hero_description', type: 'textarea' },

    // Founder Story (blocks + flat fallback)
    {
      name: 'founderStorySection',
      type: 'blocks',
      maxRows: 1,
            admin: { description: 'Founder story with title and rich text content' },
      blocks: [{
        slug: 'founderStoryBlock',
        labels: { singular: 'Founder Story Block', plural: 'Founder Story Blocks' },
        fields: [
          { name: 'title', type: 'text' },
          { name: 'content', type: 'textarea' },
        ],
      }],
    },
    { name: 'founder_eyebrow', type: 'text' },
    { name: 'founder_heading', type: 'text' },
    { name: 'founder_paragraphs', type: 'textarea' },
    { name: 'founder_image', type: 'upload', relationTo: 'media', admin: { description: 'Founder photo — select from media library' } },

    // Stats
    {
      name: 'statsSection',
      type: 'blocks',
      maxRows: 1,
            admin: { description: 'Key statistics about Simply Enak' },
      blocks: [{
        slug: 'statsBlock',
        labels: { singular: 'Stats Block', plural: 'Stats Blocks' },
        fields: [
          {
            name: 'stats',
            type: 'array',
            maxRows: 10,
            admin: { initCollapsed: true, description: 'Stat items (number + label)' },
            fields: [
              { name: 'number', type: 'text', required: true },
              { name: 'label', type: 'text', required: true },
            ],
          },
        ],
      }],
    },

    // Timeline
    {
      name: 'timelineSection',
      type: 'blocks',
      maxRows: 1,
            admin: { description: 'Company history timeline' },
      blocks: [{
        slug: 'timelineBlock',
        labels: { singular: 'Timeline Block', plural: 'Timeline Blocks' },
        fields: [
          {
            name: 'events',
            type: 'array',
            maxRows: 30,
            admin: { initCollapsed: true, description: 'Timeline events (year, title, description)' },
            fields: [
              { name: 'year', type: 'text', required: true },
              { name: 'title', type: 'text', required: true },
              { name: 'description', type: 'textarea' },
            ],
          },
        ],
      }],
    },
    { name: 'timeline_eyebrow', type: 'text' },
    { name: 'timeline_heading', type: 'text' },
    { name: 'timeline_description', type: 'textarea' },

    // Philosophy
    {
      name: 'philosophySection',
      type: 'blocks',
      maxRows: 1,
            admin: { description: 'Company philosophy/mission' },
      blocks: [{
        slug: 'philosophyBlock',
        labels: { singular: 'Philosophy Block', plural: 'Philosophy Blocks' },
        fields: [
          {
            name: 'items',
            type: 'array',
            maxRows: 10,
            admin: { initCollapsed: true, description: 'Philosophy items (title, description, icon)' },
            fields: [
              { name: 'title', type: 'text', required: true },
              { name: 'description', type: 'textarea', required: true },
              { name: 'icon', type: 'text' },
            ],
          },
        ],
      }],
    },
    { name: 'philosophy_eyebrow', type: 'text' },
    { name: 'philosophy_heading', type: 'text' },
    { name: 'philosophy_items', type: 'textarea', admin: { description: 'JSON string of philosophy items (legacy fallback)' } },

    // Team
    {
      name: 'teamSection',
      type: 'blocks',
      maxRows: 1,
            admin: { description: 'Team members' },
      blocks: [{
        slug: 'teamBlock',
        labels: { singular: 'Team Block', plural: 'Team Blocks' },
        fields: [
          {
            name: 'members',
            type: 'array',
            maxRows: 20,
            admin: { initCollapsed: true, description: 'Team members' },
            fields: [
              { name: 'name', type: 'text', required: true },
              { name: 'role', type: 'text' },
              { name: 'specialty', type: 'text' },
              { name: 'description', type: 'textarea' },
              { name: 'photo', type: 'text' },
            ],
          },
        ],
      }],
    },
    { name: 'team_eyebrow', type: 'text' },
    { name: 'team_heading', type: 'text' },
    { name: 'team_description', type: 'textarea' },
    { name: 'team_members', type: 'textarea', admin: { description: 'JSON string of team members (legacy fallback)' } },

    // Testimonial highlight
    { name: 'testimonial_text', type: 'text' },
    { name: 'testimonial_name', type: 'text' },
    { name: 'testimonial_location', type: 'text' },

    // CTA
    { name: 'cta_heading', type: 'text' },
    { name: 'cta_description', type: 'textarea' },
    { name: 'cta_primary_text', type: 'text' },
    { name: 'cta_primary_url', type: 'text' },
    { name: 'cta_secondary_text', type: 'text' },
    { name: 'cta_secondary_url', type: 'text' },
  ],
}
