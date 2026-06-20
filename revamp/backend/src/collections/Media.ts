import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

/**
 * Slugify any string for use as a URL/filename segment.
 * Only lowercase letters, numbers, and hyphens.
 */
function slugify(str: string, maxLen = 40): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLen)
    .replace(/-+$/g, '')
}

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

    // ── Filename builders ──
    {
      type: 'row',
      fields: [
        {
          name: 'subject',
          type: 'select',
          admin: {
            description: 'What is this image about? Becomes a filename segment.',
            width: '50%',
          },
          options: [
            { label: '🍜 Food / Dish', value: 'food' },
            { label: '🏪 Market / Stall', value: 'market' },
            { label: '👨‍🍳 Vendor / Hawker', value: 'vendor' },
            { label: '🏛️ Landmark / Street', value: 'landmark' },
            { label: '👥 Tour Group', value: 'group' },
            { label: '🧑‍🏫 Guide / Team', value: 'guide' },
            { label: '🖼️ Hero / Banner', value: 'hero' },
            { label: '🌆 Landscape / Cityscape', value: 'landscape' },
            { label: '🍽️ Plated Dish', value: 'dish' },
            { label: '🔍 Detail / Close-up', value: 'detail' },
            { label: '📦 Logo / Brand', value: 'logo' },
            { label: '🏠 Interior', value: 'interior' },
            { label: '📰 Press / Media', value: 'press' },
          ],
        },
        {
          name: 'custom_label',
          type: 'text',
          admin: {
            description: 'Short specific label (e.g. "petaling-street-char-koay-teow"). Appears in filename.',
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'location_ref',
      type: 'relationship',
      relationTo: 'locations',
      hasMany: false,
      admin: {
        description: 'Which Simply Enak location? Becomes a filename segment → "kuala-lumpur"',
      },
    },
    {
      name: 'credit',
      type: 'text',
      admin: {
        description: 'Photographer name → adds "by-john-doe" to the filename',
      },
    },

    // ── Geo / GPS ──
    {
      name: 'gps',
      type: 'group',
      admin: {
        description: 'GPS coordinates (manual). EXIF is NOT stripped — photographer copyright stays intact.',
      },
      fields: [
        { name: 'lat', type: 'number', admin: { description: 'Latitude' } },
        { name: 'lng', type: 'number', admin: { description: 'Longitude' } },
        { name: 'place', type: 'text', admin: { description: 'Place name' } },
      ],
    },

    // ── Organisational ──
    {
      name: 'usage',
      type: 'text',
      admin: {
        description: 'Where is this image used? (e.g., tours, stories, about, hero)',
      },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Tags for organizing and filtering media',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }: any) => {
        if (operation !== 'create' && operation !== 'update') return data
        if (!data?.filename) return data

        // 1. Always sanitize the raw upload filename as a safety net
        const ext = data.filename.match(/\.([^.]+)$/)?.[1]?.toLowerCase() || ''
        const dotExt = ext ? `.${ext}` : ''
        const sanitized = slugify(data.filename.replace(/\.[^.]+$/, ''), 60) + dotExt

        // 2. If structured selectors are set, build a meaningful filename
        const hasSelectors = data.subject || data.custom_label || data.location_ref || data.credit
        if (hasSelectors) {
          let locName = ''
          if (typeof data.location_ref === 'object' && data.location_ref?.name) {
            locName = data.location_ref.name
          } else if ((typeof data.location_ref === 'number' || typeof data.location_ref === 'string') && req?.payload) {
            // Relationship comes in as just the ID — fetch the location name
            try {
              const loc = await req.payload.findByID({
                collection: 'locations',
                id: data.location_ref,
                depth: 0,
              })
              if (loc?.name) locName = loc.name
            } catch {
              // Location lookup failed — proceed without location in filename
            }
          }

          const parts: string[] = ['simply-enak']
          if (locName) parts.push(slugify(locName, 30))
          if (data.subject) parts.push(data.subject)
          if (data.custom_label) parts.push(slugify(data.custom_label, 40))
          if (data.credit) parts.push(`by-${slugify(data.credit, 30)}`)

          data.filename = parts.join('-') + dotExt
        } else {
          data.filename = sanitized
        }

        return data
      },
    ],
    beforeChange: [
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
