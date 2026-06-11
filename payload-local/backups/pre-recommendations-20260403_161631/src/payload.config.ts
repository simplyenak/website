import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { searchPlugin } from '@payloadcms/plugin-search'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { openapi } from 'payload-oapi'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tours } from './collections/Tours'
import { Stories } from './collections/Stories'
import { Testimonials } from './collections/Testimonials'
import { FAQs } from './collections/FAQs'
import { MediaCoverage } from './collections/MediaCoverage'
// Search collection is auto-created by searchPlugin
import { DietaryLandingPages } from './collections/DietaryLandingPages'
import { DietaryOptions } from './collections/DietaryOptions'
import { FoodItems } from './collections/FoodItems'
import { Vendors } from './collections/Vendors'
import { SpecialtyLandingPages } from './collections/SpecialtyLandingPages'
import { TravelTypeLandingPages } from './collections/TravelTypeLandingPages'
import { LocationLandingPages } from './collections/LocationLandingPages'
import { AboutPage } from './collections/AboutPage'
import { ContactPage } from './collections/ContactPage'
import { ThankYouPages } from './collections/ThankYouPages'
import { Translations } from './collections/Translations'
import { SiteSettings } from './collections/SiteSettings'
import { HomePage } from './collections/HomePage'
import { LegalPages } from './collections/LegalPages'
import { Menus } from './collections/Menus'
import { TravelTypes } from './collections/TravelTypes'
import { SpecialtyExperiences } from './collections/SpecialtyExperiences'
import { Locations } from './collections/Locations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  telemetry: false,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // Rate limiting middleware
  globals: [
    // Rate limit API requests
  ],
  collections: [
    Users,
    Media,
    // Tours & Booking
    Tours,
    // Content & Blog
    Stories,
    Testimonials,
    FAQs,
    MediaCoverage,
    // Reference Data
    DietaryOptions,
    FoodItems,
    Vendors,
    // Landing Pages
    DietaryLandingPages,
    SpecialtyLandingPages,
    TravelTypeLandingPages,
    LocationLandingPages,
    // Pages
    AboutPage,
    ContactPage,
    ThankYouPages,
    HomePage,
    LegalPages,
    Menus,
    TravelTypes,
    SpecialtyExperiences,
    Locations,
    // Translations
    Translations,
    // Settings
    SiteSettings,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: false,
  }),
  sharp,
  plugins: [
    // Import/Export Plugin
    importExportPlugin({
      collections: [
        { slug: 'users' },
        { slug: 'tours' },
        { slug: 'stories' },
        { slug: 'testimonials' },
        { slug: 'faqs' },
        { slug: 'media_coverage' },
        { slug: 'dietary_landing_pages' },
        { slug: 'specialty_landing_pages' },
        { slug: 'travel_type_landing_pages' },
        { slug: 'location_landing_pages' },
        { slug: 'about_page' },
        { slug: 'contact_page' },
        { slug: 'thank_you_pages' },
        { slug: 'home_page' },
        { slug: 'legal_pages' },
        { slug: 'menus' },
        { slug: 'travel_types' },
        { slug: 'specialty_experiences' },
        { slug: 'locations' },
        { slug: 'translations' },
        { slug: 'site_settings' },
        { slug: 'dietary_options' },
        { slug: 'food_items' },
        { slug: 'vendors' },
      ],
      defaultVersionStatus: 'published',
      importLimit: 0, // unlimited
    }),
    // S3 Storage
    s3Storage({
      collections: {
        media: {
          prefix: 'payload-media',
          disableLocalStorage: true,
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        endpoint: process.env.S3_ENDPOINT || '',
        region: process.env.S3_REGION || '',
        forcePathStyle: true,
      },
    }),
    // SEO Plugin
    seoPlugin({
      collections: ['tours', 'stories', 'dietary_landing_pages', 'specialty_landing_pages', 'travel_type_landing_pages', 'location_landing_pages'],
      uploadsCollection: 'media',
    }),
    // Nested Docs Plugin
    nestedDocsPlugin({
      collections: ['about_page', 'contact_page'],
    }),
    // Redirects Plugin
    redirectsPlugin({
      collections: ['tours', 'stories', 'dietary_landing_pages', 'specialty_landing_pages', 'travel_type_landing_pages', 'location_landing_pages'],
      overrides: {
        admin: {
          group: 'Settings & Config',
          description: '🔄 Manage URL redirects (301/302)',
          useAsTitle: 'from',
          defaultColumns: ['from', 'to', 'statusCode', 'updatedAt'],
        },
      },
    }),
    // Search Plugin - Unified search across collections
    searchPlugin({
      collections: ['tours', 'stories', 'faqs', 'testimonials'],
    }),
    // OpenAPI Plugin - Auto-generate API documentation
    openapi({
      specEndpoint: '/openapi-spec',
      authEndpoint: '/api',
      enabled: true,
      metadata: {
        title: 'Simply Enak API',
        version: '1.0.0',
      },
    }),
  ],
})
