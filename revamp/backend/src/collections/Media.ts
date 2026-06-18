import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
    description: '📸 Image and media library for all content',
  },
  hooks: {
    afterChange: [triggerStagingDeploy],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
            admin: {
        description: 'Alt text for accessibility',
      },
    },
    {
      name: 'caption',
      type: 'text',
            admin: {
        description: 'Optional caption',
      },
    },
    {
      name: 'usage',
      type: 'text',
      admin: {
        description: 'Where is this image used? (e.g., tours, stories, etc.)',
      },
    },
  ],
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'medium',
        width: 800,
        height: 600,
        position: 'centre',
      },
      {
        name: 'large',
        width: 1200,
        height: 800,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'image/webp',
    ],
  },
}
