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
