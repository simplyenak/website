import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

const S3_BUCKET = process.env.S3_BUCKET || ''
const PREFIX = 'payload-media'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
    description: '📸 Image and media library for all content',
  },
  fields: [
    // ── SEO / ADA ──
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Alt text for accessibility (SEO + ADA). Auto-filled from filename if left empty.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional caption — include photo credit here if needed.',
      },
    },
    {
      name: 'polaroidLabel',
      type: 'text',
      admin: {
        description: 'Short label shown on the polaroid card (e.g., "Morning market"). Keep it brief — space is tight.',
      },
    },
    {
      name: 'credit',
      type: 'text',
      admin: {
        description: 'Photographer name for attribution.',
      },
    },

    // ── Taxonomy Relationships ──
    {
      name: 'location_ref',
      type: 'relationship',
      relationTo: 'locations',
      hasMany: false,
      admin: {
        description: 'Which Simply Enak location does this image belong to? (e.g. Kuala Lumpur, Penang)',
      },
    },
    {
      name: 'neighbourhood_ref',
      type: 'relationship',
      relationTo: 'neighborhoods',
      hasMany: true,
      admin: {
        description: 'Neighbourhoods shown in this image (e.g. Chinatown, Kampung Baru)',
      },
    },
    {
      name: 'food_ref',
      type: 'relationship',
      relationTo: 'food_items',
      hasMany: true,
      admin: {
        description: 'Dishes / food items shown in this image',
      },
    },
    {
      name: 'dietary_ref',
      type: 'relationship',
      relationTo: 'dietary_options',
      hasMany: true,
      admin: {
        description: 'Dietary options relevant to this image (Vegan, Halal, etc.)',
      },
    },
    {
      name: 'travel_type_ref',
      type: 'relationship',
      relationTo: 'travel_types',
      hasMany: true,
      admin: {
        description: 'Travel types this image represents (Couples, Solo, Family, Foodie)',
      },
    },
    {
      name: 'specialty_ref',
      type: 'relationship',
      relationTo: 'specialty_experiences',
      hasMany: true,
      admin: {
        description: 'Specialty experiences shown (Heritage, Street Food, Night Tour, Market)',
      },
    },
    {
      name: 'vendor_ref',
      type: 'relationship',
      relationTo: 'vendors',
      hasMany: true,
      admin: {
        description: 'Vendors / hawkers shown in this image',
      },
    },

    // ── Organisational ──
    {
      name: 'usage',
      type: 'text',
      admin: {
        description: 'Where is this image used? (e.g., tours, stories, hero, gallery)',
      },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Free-form tags for filtering (photos, ambience, crowd, etc.)',
      },
    },

    // ── Rename Tool ──
    {
      name: 'renameTo',
      type: 'text',
      admin: {
        description: 'Enter new filename (e.g., "clean-name.jpg") then Save. The file on S3 will be renamed, including all image sizes.',
      },
    },
  ],
  upload: {
    staticDir: 'media',
    // Convert all uploads to WebP. Conservative quality — the srcset does
    // the heavy lifting by sending smaller sizes to smaller screens.
    formatOptions: {
      format: 'webp',
      options: { quality: 75 },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: { quality: 65 },
        },
      },
      {
        name: 'medium',
        width: 800,
        height: 600,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: { quality: 70 },
        },
      },
      {
        name: 'large',
        width: 1200,
        height: 800,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: { quality: 72 },
        },
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'],
  },
  hooks: {
    beforeChange: [
      // Auto-fill alt text from filename if empty
      ({ data }: { data: Record<string, any> }) => {
        if (!data?.alt && data?.filename) {
          data.alt = data.filename
            .replace(/\.[^.]+$/, '')
            .replace(/[-_]+/g, ' ')
            .replace(/\b\w/g, (c: string) => c.toUpperCase())
            .trim()
        }
        return data
      },
      // Rename file on S3 if renameTo is set
      async ({ data, originalDoc, req }) => {
        const newName = data?.renameTo?.trim()
        if (!newName || !originalDoc?.filename) return data
        if (newName === originalDoc.filename) return data

        // Lazy import — env vars not available at Docker build time
        const { S3Client, CopyObjectCommand, DeleteObjectCommand } = await import('@aws-sdk/client-s3')
        const s3 = new S3Client({
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
          },
          endpoint: process.env.S3_ENDPOINT || '',
          region: process.env.S3_REGION || 'us-east-1',
          forcePathStyle: true,
        })

        const oldKey = `${PREFIX}/${originalDoc.filename}`
        const newKey = `${PREFIX}/${newName}`

        try {
          // Copy original file to new name
          await s3.send(new CopyObjectCommand({
            Bucket: S3_BUCKET,
            CopySource: `/${S3_BUCKET}/${oldKey}`,
            Key: newKey,
          }))

          // Copy all image sizes
          const sizeSuffixes: Record<string, string> = {
            thumbnail: '400x300',
            medium: '800x600',
            large: '1200x800',
          }
          for (const suffix of Object.values(sizeSuffixes)) {
            const oldSizeKey = `${PREFIX}/${originalDoc.filename.replace(/(\.\w+)$/, `-${suffix}$1`)}`
            const newSizeKey = `${PREFIX}/${newName.replace(/(\.\w+)$/, `-${suffix}$1`)}`
            try {
              await s3.send(new CopyObjectCommand({
                Bucket: S3_BUCKET,
                CopySource: `/${S3_BUCKET}/${oldSizeKey}`,
                Key: newSizeKey,
              }))
              await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: oldSizeKey }))
            } catch { /* size file may not exist */ }
          }

          // Delete old file
          await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: oldKey }))

          // Update returned data with new filename
          data.filename = newName
          data.renameTo = ''

          req.payload.logger?.info?.('🗂️  File renamed on S3: ' + originalDoc.filename + ' → ' + newName)
        } catch (err: any) {
          req.payload.logger?.error?.('❌ Failed to rename file: ' + err.message)
        }

        return data
      },
    ],
    afterChange: [triggerStagingDeploy],
    afterRead: [
      ({ doc }) => {
        // Payload's internal thumbnailURL is a relative path (/api/media/file/...)
        // which reads from local disk. Since we use S3-only, the local file
        // doesn't exist. Use the thumbnail size URL instead, which is already
        // an S3 or CDN URL from the S3 storage plugin.
        if (doc?.thumbnailURL && !doc.thumbnailURL.startsWith('http')) {
          const thumb = doc.sizes?.thumbnail
          if (thumb?.url) {
            doc.thumbnailURL = thumb.url
          }
        }
        return doc
      },
    ],
  },
}
