import type { CollectionConfig } from 'payload'
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
  endpoint: process.env.S3_ENDPOINT || '',
  region: process.env.S3_REGION || '',
  forcePathStyle: true,
})

const S3_BUCKET = process.env.S3_BUCKET || ''
const CDN_DOMAIN = 'https://cdn.simplyenak.com'
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
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Tags for organizing and filtering media (e.g., vendor-name, tour-kl, hero, gallery)',
      },
    },
    {
      name: 'renameTo',
      type: 'text',
      admin: {
        description: 'Enter new filename (e.g., "clean-name.jpg") then Save. The file on S3 will be renamed.',
      },
    },
  ],
  upload: {
    staticDir: 'media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'medium', width: 800, height: 600, position: 'centre' },
      { name: 'large', width: 1200, height: 800, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'],
  },
  hooks: {
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        const newName = data?.renameTo?.trim()
        if (!newName || !originalDoc?.filename) return data
        if (newName === originalDoc.filename) return data

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
          for (const size of ['thumbnail', 'medium', 'large']) {
            const oldSizeKey = `${PREFIX}/${originalDoc.filename.replace(/(\.\w+)$/, `-400x300$1`)}`
            const newSizeKey = `${PREFIX}/${newName.replace(/(\.\w+)$/, `-400x300$1`)}`
            // Only try if the size file likely exists (Payload names sizes as: filename-WxH.ext)
            // The actual size suffix depends on the config: 400x300 for thumbnail, 800x600 for medium, 1200x800 for large
            const sizeSuffixes: Record<string, string> = {
              thumbnail: '400x300',
              medium: '800x600',
              large: '1200x800',
            }
            const suffix = sizeSuffixes[size]
            const oldSizeKey2 = `${PREFIX}/${originalDoc.filename.replace(/(\.\w+)$/, `-${suffix}$1`)}`
            const newSizeKey2 = `${PREFIX}/${newName.replace(/(\.\w+)$/, `-${suffix}$1`)}`
            try {
              await s3.send(new CopyObjectCommand({
                Bucket: S3_BUCKET,
                CopySource: `/${S3_BUCKET}/${oldSizeKey2}`,
                Key: newSizeKey2,
              }))
              await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: oldSizeKey2 }))
            } catch { /* size file may not exist */ }
          }

          // Delete old file
          await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: oldKey }))

          // Update returned data with new filename
          data.filename = newName
          data.url = `/api/media/file/${newName}?prefix=${PREFIX}`
          data.thumbnailURL = `/api/media/file/${newName.replace(/(\.\w+)$/, '-400x300$1')}`
          // Clear the renameTo field so it doesn't trigger again
          data.renameTo = ''

          req.payload.logger?.info?.('🗂️  File renamed on S3: ' + originalDoc.filename + ' → ' + newName)
        } catch (err: any) {
          req.payload.logger?.error?.('❌ Failed to rename file: ' + err.message)
        }

        return data
      },
    ],
  },
}
