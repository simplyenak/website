import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

/**
 * Content Briefs — Kanban-style workflow for gathering content intel
 * for landing pages and guide stories.
 *
 * Status workflow:
 *   needs-questions    → questions drafted, waiting for me to write them
 *   questions-asked    → questions are in the board, awaiting your answers
 *   answers-received   → you've answered, I can start writing
 *   writing            → content generation in progress
 *   ready-to-publish   → written, pending your review
 *   published          → content deployed
 *
 * Each brief can feed one or more landing pages AND/OR a guide story.
 */
export const ContentBriefs: CollectionConfig = {
  slug: 'content_briefs',
  admin: {
    useAsTitle: 'title',
    group: '📝 Content Pipeline',
    description: '📋 Question-driven content planning for landing pages and guides. Drag by changing status.',
    defaultColumns: ['title', 'segmentType', 'status', 'questionsCount', 'updatedAt'],
    listSearchableFields: ['title', 'segmentType', 'landingPageSlugs'],
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
  hooks: {
    afterChange: [triggerStagingDeploy],
  },
  fields: [
    // ── IDENTIFICATION ────────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "Halal Food Tours in KL" or "Vegetarian Guide — Penang"',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-generated URL-friendly ID',
      },
      hooks: {
        beforeValidate: [
          ({ data, operation }) => {
            if (operation === 'create' && data?.title && !data.slug) {
              data.slug = data.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim()
            }
          },
        ],
      },
    },
    {
      name: 'segmentType',
      type: 'select',
      required: true,
      options: [
        { label: '🥗 Dietary', value: 'dietary' },
        { label: '⭐ Specialty', value: 'specialty' },
        { label: '📍 Location', value: 'location' },
        { label: '🧳 Travel Type', value: 'travel_type' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Which segment category does this brief serve?',
      },
    },
    // ── STATUS / KANBAN COLUMN ────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      options: [
        { label: '❓ Needs Questions', value: 'needs-questions' },
        { label: '✏️ Questions Asked', value: 'questions-asked' },
        { label: '💬 Answers Received', value: 'answers-received' },
        { label: '✍️ Writing', value: 'writing' },
        { label: '✅ Ready to Publish', value: 'ready-to-publish' },
        { label: '🚀 Published', value: 'published' },
      ],
      defaultValue: 'needs-questions',
      admin: {
        position: 'sidebar',
        description: '📍 Kanban column. Change to move items through the pipeline.',
      },
    },
    // ── LINKED PAGES ──────────────────────────────────────────────
    {
      name: 'landingPageSlugs',
      type: 'text',
      admin: {
        description: 'Comma-separated landing page slugs this brief feeds (e.g. "halal-food-tours-kuala-lumpur, halal-food-tours")',
      },
    },
    {
      name: 'relatedLandingPages',
      type: 'relationship',
      relationTo: 'landing_pages',
      hasMany: true,
      admin: {
        description: 'Landing pages this brief will generate content for',
      },
    },
    {
      name: 'guideSlug',
      type: 'text',
      admin: {
        description: 'Slug of the guide story to create/update (e.g. "halal-guide-kuala-lumpur"). Leave blank if brief only feeds landing pages.',
      },
    },
    {
      name: 'guideLink',
      type: 'relationship',
      relationTo: 'stories',
      hasMany: false,
      admin: {
        description: 'Link to the guide story once created',
      },
    },
    // ── QUESTIONS & ANSWERS ───────────────────────────────────────
    {
      name: 'questions',
      type: 'array',
      admin: {
        description: '📋 Questions to gather unique content. Answer each, then I will write.',
      },
      fields: [
        {
          name: 'question',
          type: 'textarea',
          required: true,
          admin: {
            description: 'The question — what we need to know',
          },
        },
        {
          name: 'answer',
          type: 'textarea',
          admin: {
            description: 'Your answer. Be as specific as possible — names, dishes, locations, stories.',
          },
        },
        {
          name: 'quality',
          type: 'select',
          options: [
            { label: '⏳ Not Yet Answered', value: 'unanswered' },
            { label: '✅ Good — enough to write', value: 'good' },
            { label: '🔍 Needs More Detail', value: 'needs-more' },
            { label: '🔄 Needs New Question', value: 'insufficient' },
          ],
          defaultValue: 'unanswered',
          admin: {
            position: 'sidebar',
            description: 'Quality gate — I will update this after reviewing your answer.',
          },
        },
        {
          name: 'followUp',
          type: 'textarea',
          admin: {
            description: 'If quality is "needs-more" or "insufficient", the follow-up question goes here.',
          },
        },
        {
          name: 'intendedFor',
          type: 'select',
          options: [
            { label: 'Landing Page + Guide', value: 'both' },
            { label: 'Landing Page Only', value: 'landing_page' },
            { label: 'Guide Story Only', value: 'guide' },
          ],
          defaultValue: 'both',
          admin: {
            description: 'Where will this answer be used?',
          },
        },
      ],
    },
    // ── NOTES ─────────────────────────────────────────────────────
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this brief (e.g. what content is currently missing, which tours to highlight)',
      },
    },
  ],
  timestamps: true,
}
