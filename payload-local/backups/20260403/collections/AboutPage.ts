import type { CollectionConfig } from 'payload'

export const AboutPage: CollectionConfig = {
  slug: 'about_page',
  admin: {
    group: 'Pages',
    description: 'About page content',
  },
  fields: [
    {
      name: 'seo_title',
      type: 'text',
    },
    {
      name: 'seo_description',
      type: 'textarea',
    },
    {
      name: 'hero_title',
      type: 'text',
    },
    {
      name: 'hero_subtitle',
      type: 'text',
    },
    {
      name: 'founder_story_title',
      type: 'text',
    },
    {
      name: 'founder_story_text',
      type: 'richText',
    },
    {
      name: 'stats',
      type: 'json',
    },
    {
      name: 'timeline',
      type: 'json',
    },
    {
      name: 'philosophy',
      type: 'textarea',
    },
    {
      name: 'team',
      type: 'json',
    },
  ],
}
