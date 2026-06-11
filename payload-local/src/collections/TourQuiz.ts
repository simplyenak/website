import type { CollectionConfig } from 'payload'

export const TourQuiz: CollectionConfig = {
  slug: 'tour_quiz',
  admin: {
    group: 'Pages',
    description: '🧩 "What Type of Malaysian Foodie Are You?" quiz',
    useAsTitle: 'intro_title',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => ['admin', 'editor'].includes((user as any)?.role),
    update: ({ req: { user } }) => ['admin', 'editor'].includes((user as any)?.role),
    delete: ({ req: { user } }) => (user as any)?.role === 'admin',
  },
  fields: [
    // ── Intro ──
    {
      name: 'intro_title',
      type: 'text',
      defaultValue: 'What Type of Malaysian Foodie Are You?',
    },
    {
      name: 'intro_description',
      type: 'textarea',
      defaultValue: 'Tell us about your Malaysian food experience and we\'ll reveal your foodie personality — plus match you with the perfect tour.',
    },
    {
      name: 'intro_button_label',
      type: 'text',
      defaultValue: 'Take the Quiz',
    },

    // ── Quiz Steps ──
    {
      name: 'steps',
      type: 'array',
      required: true,
      admin: {
        initCollapsed: true,
        description: 'Ordered quiz questions. Each option has score weights for each personality type.',
      },
      fields: [
        { name: 'id', type: 'text', required: true },
        { name: 'question', type: 'text', required: true },
        {
          name: 'options',
          type: 'array',
          required: true,
          admin: { initCollapsed: true },
          fields: [
            { name: 'value', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
            { name: 'icon', type: 'text' },
            { name: 'description', type: 'text' },
          ],
        },
      ],
    },

    // ── Foodie Personalities ──
    {
      name: 'personalities',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'emoji', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'tour_match', type: 'text', admin: { description: 'What kind of tours suit this personality' } },
      ],
    },

    // ── Scoring: answer → personality weights ──
    {
      name: 'scoring_weights',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        { name: 'question_id', type: 'text', required: true },
        { name: 'answer_value', type: 'text', required: true },
        {
          name: 'weights',
          type: 'json',
          required: true,
          admin: { description: 'JSON: { "personality_key": score, ... }' },
        },
      ],
    },

    // ── Result Headlines ──
    {
      name: 'result_headlines',
      type: 'array',
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'headline', type: 'text', required: true },
        { name: 'subtext', type: 'textarea' },
      ],
    },

    // ── Fallback ──
    { name: 'fallback_headline', type: 'text', defaultValue: 'Our Top Picks For You' },
    {
      name: 'fallback_tours',
      type: 'relationship',
      relationTo: 'tours',
      hasMany: true,
    },

    // ── Contact CTA ──
    { name: 'contact_cta_text', type: 'text', defaultValue: 'Still not sure which tour is right for you?' },
    { name: 'contact_cta_button', type: 'text', defaultValue: 'Let Us Help You Choose' },
  ],
}
