/**
 * Shared block definitions for Payload CMS collections.
 * 
 * These blocks are reused across multiple collections to maintain
 * consistency and reduce duplication.
 * 
 * Usage:
 *   import { heroBlock, contentBlock, statsBlock } from '../blocks'
 *   
 *   {
 *     name: 'heroSection',
 *     type: 'blocks',
 *     maxRows: 1,
 *     blocks: [heroBlock],
 *   }
 */

import type { Block } from 'payload'

// ============================================================
// HERO BLOCK
// Used by: HomePage, AboutPage, ContactPage, all Landing Pages
// ============================================================
export const heroBlock: Block = {
  slug: 'heroBlock',
  labels: { singular: 'Hero Block', plural: 'Hero Blocks' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Hero background image — select from media library' },
    },
  ],
}

// ============================================================
// CONTENT BLOCK (title + content pair)
// Used by: DietaryLandingPages, SpecialtyLandingPages, TravelTypeLandingPages
// ============================================================
export const contentBlock: Block = {
  slug: 'contentBlock',
  labels: { singular: 'Content Block', plural: 'Content Blocks' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'content', type: 'textarea' },
  ],
}

// ============================================================
// TIPS BLOCK (content only)
// Used by: DietaryLandingPages, TravelTypeLandingPages
// ============================================================
export const tipsBlock: Block = {
  slug: 'tipsBlock',
  labels: { singular: 'Tips Block', plural: 'Tips Blocks' },
  fields: [
    { name: 'content', type: 'textarea' },
  ],
}

// ============================================================
// FEATURES BLOCK (content + highlights array)
// Used by: SpecialtyLandingPages, TravelTypeLandingPages
// ============================================================
export const featuresBlock: Block = {
  slug: 'featuresBlock',
  labels: { singular: 'Features Block', plural: 'Features Blocks' },
  fields: [
    { name: 'content', type: 'textarea' },
    {
      name: 'highlights',
      type: 'array',
      maxRows: 10,
      admin: { initCollapsed: true, description: 'Key highlights or features' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
  ],
}

// ============================================================
// STATS BLOCK (stats array with number + label)
// Used by: HomePage, AboutPage
// ============================================================
export const statsBlock: Block = {
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
}

// ============================================================
// CTA BLOCK (eyebrow + title + subtitle + features + buttons)
// Used by: HomePage
// ============================================================
export const ctaBlock: Block = {
  slug: 'ctaBlock',
  labels: { singular: 'CTA Block', plural: 'CTA Blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'text' },
    {
      name: 'features',
      type: 'array',
      maxRows: 4,
      admin: { initCollapsed: true, description: 'Trust signals' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'buttons',
      type: 'array',
      maxRows: 3,
      admin: { initCollapsed: true, description: 'CTA buttons' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        {
          name: 'variant',
          type: 'select',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'WhatsApp', value: 'whatsapp' },
          ],
          defaultValue: 'primary',
        },
      ],
    },
  ],
}

// ============================================================
// DISH LIST BLOCK (dishes array)
// Used by: DietaryLandingPages
// ============================================================
export const dishListBlock: Block = {
  slug: 'dishListBlock',
  labels: { singular: 'Dish List Block', plural: 'Dish List Blocks' },
  fields: [
    {
      name: 'dishes',
      type: 'array',
      admin: { initCollapsed: true, description: 'List of dishes' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
  ],
}

// ============================================================
// INTRO BLOCK (title + content + image)
// Used by: LocationLandingPages
// ============================================================
export const introBlock: Block = {
  slug: 'introBlock',
  labels: { singular: 'Intro Block', plural: 'Intro Blocks' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'content', type: 'textarea' },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Section image — select from media library' },
    },
  ],
}

// ============================================================
// TOUR LIST BLOCK (tours array with slugs)
// Used by: TravelTypeLandingPages
// ============================================================
export const tourListBlock: Block = {
  slug: 'tourListBlock',
  labels: { singular: 'Tour List Block', plural: 'Tour List Blocks' },
  fields: [
    {
      name: 'tours',
      type: 'array',
      maxRows: 10,
      admin: { initCollapsed: true, description: 'Tour slugs' },
      fields: [{ name: 'slug', type: 'text', required: true }],
    },
  ],
}

// ============================================================
// FOUNDER STORY BLOCK (title + rich content)
// Used by: AboutPage
// ============================================================
export const founderStoryBlock: Block = {
  slug: 'founderStoryBlock',
  labels: { singular: 'Founder Story Block', plural: 'Founder Story Blocks' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'content', type: 'textarea' },
  ],
}

// ============================================================
// TIMELINE BLOCK (events array)
// Used by: AboutPage
// ============================================================
export const timelineBlock: Block = {
  slug: 'timelineBlock',
  labels: { singular: 'Timeline Block', plural: 'Timeline Blocks' },
  fields: [
    {
      name: 'events',
      type: 'array',
      maxRows: 30,
      admin: { initCollapsed: true, description: 'Timeline events' },
      fields: [
        { name: 'year', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}

// ============================================================
// PHILOSOPHY BLOCK (content only)
// Used by: AboutPage
// ============================================================
export const philosophyBlock: Block = {
  slug: 'philosophyBlock',
  labels: { singular: 'Philosophy Block', plural: 'Philosophy Blocks' },
  fields: [
    { name: 'content', type: 'textarea' },
  ],
}

// ============================================================
// TEAM BLOCK (members array)
// Used by: AboutPage
// ============================================================
export const teamBlock: Block = {
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
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Team member photo — select from media library' },
        },
      ],
    },
  ],
}

// ============================================================
// CHANNELS BLOCK (contact channels array)
// Used by: ContactPage
// ============================================================
export const channelsBlock: Block = {
  slug: 'channelsBlock',
  labels: { singular: 'Channels Block', plural: 'Channels Blocks' },
  fields: [
    {
      name: 'channels',
      type: 'array',
      maxRows: 5,
      admin: { initCollapsed: true, description: 'Contact channels' },
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Email', value: 'email' },
            { label: 'Phone', value: 'phone' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Website', value: 'website' },
            { label: 'Other', value: 'other' },
          ],
          required: true,
        },
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text' },
      ],
    },
  ],
}

// ============================================================
// SOCIAL BLOCK (social links array)
// Used by: ContactPage
// ============================================================
export const socialBlock: Block = {
  slug: 'socialBlock',
  labels: { singular: 'Social Block', plural: 'Social Blocks' },
  fields: [
    {
      name: 'links',
      type: 'array',
      maxRows: 10,
      admin: { initCollapsed: true, description: 'Social media links' },
      fields: [
        { name: 'platform', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}

// ============================================================
// FAQ BLOCK (content only)
// Used by: ContactPage
// ============================================================
export const faqBlock: Block = {
  slug: 'faqBlock',
  labels: { singular: 'FAQ Block', plural: 'FAQ Blocks' },
  fields: [
    { name: 'content', type: 'textarea' },
  ],
}

// ============================================================
// MANIFESTO BLOCK
// Used by: HomePage
// ============================================================
export const manifestoBlock: Block = {
  slug: 'manifestoBlock',
  labels: { singular: 'Manifesto Block', plural: 'Manifesto Blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'headline', type: 'textarea' },
    { name: 'tagline', type: 'text' },
    { name: 'body', type: 'textarea' },
    { name: 'attributionRole', type: 'text' },
  ],
}

// ============================================================
// PILLARS BLOCK (pillars array)
// Used by: HomePage
// ============================================================
export const pillarsBlock: Block = {
  slug: 'pillarsBlock',
  labels: { singular: 'Pillars Block', plural: 'Pillars Blocks' },
  fields: [
    { name: 'intro', type: 'text' },
    {
      name: 'pillars',
      type: 'array',
      maxRows: 3,
      admin: { initCollapsed: true, description: 'The three pillars' },
      fields: [
        { name: 'label', type: 'text' },
        { name: 'heading', type: 'text' },
        { name: 'body', type: 'textarea' },
      ],
    },
  ],
}

// ============================================================
// VENDORS BLOCK (links array)
// Used by: HomePage
// ============================================================
export const vendorsBlock: Block = {
  slug: 'vendorsBlock',
  labels: { singular: 'Vendors Block', plural: 'Vendors Blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'text' },
    {
      name: 'links',
      type: 'array',
      maxRows: 3,
      admin: { initCollapsed: true, description: 'CTA links' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}

// ============================================================
// SEGMENTS BLOCK
// Used by: HomePage
// ============================================================
export const segmentsBlock: Block = {
  slug: 'segmentsBlock',
  labels: { singular: 'Segments Block', plural: 'Segments Blocks' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'text' },
    { name: 'viewAllLabel', type: 'text' },
  ],
}

// ============================================================
// ABOUT BLOCK
// Used by: HomePage
// ============================================================
export const aboutBlock: Block = {
  slug: 'aboutBlock',
  labels: { singular: 'About Block', plural: 'About Blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'heritage', type: 'text' },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Section image — select from media library' },
    },
  ],
}

// ============================================================
// WHY US BLOCK (6 reason cards with icon, stat, heading, body)
// Used by: HomePage
// ============================================================
export const whyUsBlock: Block = {
  slug: 'whyUsBlock',
  labels: { singular: 'Why Us Block', plural: 'Why Us Blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'text' },
    {
      name: 'reasons',
      type: 'array',
      maxRows: 6,
      admin: { initCollapsed: true, description: 'Reason cards (icon, stat badge, heading, body)' },
      fields: [
        {
          name: 'iconName',
          type: 'select',
          options: [
            { label: 'Location / Heritage', value: 'heritage' },
            { label: 'People / Group', value: 'group' },
            { label: 'Shield / Trust', value: 'trust' },
            { label: 'Book / Story', value: 'story' },
            { label: 'Chat / Q&A', value: 'chat' },
            { label: 'Puzzle / Custom', value: 'custom' },
            { label: 'Star / Award', value: 'award' },
            { label: 'Heart / Passion', value: 'heart' },
          ],
          admin: { description: 'Select an icon — frontend maps this to SVG' },
        },
        { name: 'stat', type: 'text', admin: { description: 'e.g., "Since 2011", "Max 8"' } },
        { name: 'heading', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
  ],
}

// ============================================================
// GUARANTEES BLOCK (5 guarantees + private tour callout)
// Used by: HomePage
// ============================================================
export const guaranteesBlock: Block = {
  slug: 'guaranteesBlock',
  labels: { singular: 'Guarantees Block', plural: 'Guarantees Blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'text' },
    {
      name: 'guarantees',
      type: 'array',
      maxRows: 5,
      admin: { initCollapsed: true, description: 'Booking guarantee items' },
      fields: [
        {
          name: 'iconName',
          type: 'select',
          options: [
            { label: 'Checkmark', value: 'check' },
            { label: 'Calendar', value: 'calendar' },
            { label: 'Users', value: 'users' },
            { label: 'Message', value: 'message' },
            { label: 'Lock', value: 'lock' },
          ],
          admin: { description: 'Icon for this guarantee' },
        },
        { name: 'heading', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
    {
      name: 'privateTourCallout',
      type: 'group',
      admin: { description: 'Private tours CTA box' },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'body', type: 'textarea' },
        { name: 'ctaLabel', type: 'text' },
        { name: 'ctaUrl', type: 'text' },
      ],
    },
  ],
}

// ============================================================
// SOCIAL PROOF BADGES BLOCK (platform ratings + guest stats)
// Used by: HomePage, TestimonialsSection
// ============================================================
export const socialProofBadgesBlock: Block = {
  slug: 'socialProofBadgesBlock',
  labels: { singular: 'Social Proof Badges Block', plural: 'Social Proof Badges Blocks' },
  fields: [
    {
      name: 'platforms',
      type: 'array',
      maxRows: 4,
      admin: { initCollapsed: true, description: 'Review platform badges (TripAdvisor, Google, etc.)' },
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'TripAdvisor', value: 'tripadvisor' },
            { label: 'Google', value: 'google' },
            { label: 'Trustpilot', value: 'trustpilot' },
            { label: 'Facebook', value: 'facebook' },
          ],
          required: true,
        },
        { name: 'rating', type: 'text', admin: { description: 'e.g., "4.9"' } },
        { name: 'reviewCount', type: 'text', admin: { description: 'e.g., "520+"' } },
        { name: 'url', type: 'text', admin: { description: 'Link to reviews' } },
      ],
    },
    {
      name: 'guestStats',
      type: 'group',
      admin: { description: 'Overall guest statistics' },
      fields: [
        { name: 'totalGuests', type: 'text', admin: { description: 'e.g., "5,000+"' } },
        { name: 'sinceYear', type: 'text', admin: { description: 'e.g., "2011"' } },
        { name: 'label', type: 'text', admin: { description: 'e.g., "guests served"' } },
      ],
    },
  ],
}

// ============================================================
// NEIGHBORHOOD BLOCK (for Neighborhoods collection)
// Used by: Neighborhoods
// ============================================================
export const neighborhoodBlock: Block = {
  slug: 'neighborhoodBlock',
  labels: { singular: 'Neighborhood Block', plural: 'Neighborhood Blocks' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'text' },
    { name: 'location', type: 'text' },
    {
      name: 'highlights',
      type: 'array',
      maxRows: 10,
      admin: { initCollapsed: true, description: 'Key highlights of this neighborhood' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
  ],
}
