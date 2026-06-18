import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

export const LegalPages: CollectionConfig = {
  slug: 'legal_pages',
  admin: {
    group: 'Pages',
    description: '📜 Legal pages (Privacy Policy, Terms, etc.)',
    useAsTitle: 'headline',
    defaultColumns: ['headline', 'slug', 'status', 'updatedAt'],
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
  hooks: {
    afterChange: [triggerStagingDeploy],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        description: 'URL slug for this legal page (e.g., privacy-policy, terms-of-service)',
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
      admin: {
        description: 'Publication status',
      },
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
      admin: {
        description: 'Page headline/title (e.g., Privacy Policy, Terms of Service)',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Full page content in rich text format',
      },
    },
    {
      name: 'meta_title',
      type: 'text',
      admin: {
        description: 'SEO meta title',
      },
    },
    {
      name: 'meta_description',
      type: 'textarea',
      admin: {
        description: 'SEO meta description',
      },
    },
  ],
}
