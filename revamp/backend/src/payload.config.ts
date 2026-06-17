import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { openapi } from 'payload-oapi'
import { mediaGalleryPlugin } from '@sitebytom/payload-media-gallery'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tours } from './collections/Tours'
import { TourMasters } from './collections/TourMasters'
import { Stories } from './collections/Stories'
import { Testimonials } from './collections/Testimonials'
import { FAQs } from './collections/FAQs'
import { MediaCoverage } from './collections/MediaCoverage'
// Search collection is auto-created by searchPlugin
import { LandingPages } from './collections/LandingPages'
import { DietaryOptions } from './collections/DietaryOptions'
import { FoodItems } from './collections/FoodItems'
import { Vendors } from './collections/Vendors'
import { AboutPage } from './collections/AboutPage'
import { ContactPage } from './collections/ContactPage'
import { ThankYouPages } from './collections/ThankYouPages'
import { SiteSettings } from './collections/SiteSettings'
import { HomePage } from './collections/HomePage'
import { LegalPages } from './collections/LegalPages'
import { Menus } from './collections/Menus'
import { TravelTypes } from './collections/TravelTypes'
import { SpecialtyExperiences } from './collections/SpecialtyExperiences'
import { Locations } from './collections/Locations'
import { HowItWorksPage } from './collections/HowItWorksPage'
import { HowToPreparePage } from './collections/HowToPreparePage'
import { CorporateGroupsPage } from './collections/CorporateGroupsPage'
import { TrackRecordPage } from './collections/TrackRecordPage'
import { PrivateToursPage } from './collections/PrivateToursPage'
import { DirectionsPage } from './collections/DirectionsPage'
import { TourQuiz } from './collections/TourQuiz'
import { Neighborhoods } from './collections/Neighborhoods'
import { ComparisonPage } from './collections/ComparisonPage'
import { Pages } from './collections/Pages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  telemetry: false,
  localization: {
    locales: [
      { code: 'en', label: 'English' },
      { code: 'ms', label: 'Bahasa Malaysia' },
      { code: 'zh', label: '中文' },
      { code: 'de', label: 'Deutsch' },
      { code: 'es', label: 'Español' },
      { code: 'fr', label: 'Français' },
      { code: 'nl', label: 'Nederlands' },
      { code: 'ru', label: 'Русский' },
      { code: 'ja', label: '日本語' },
      { code: 'pt', label: 'Português' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
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
    TourMasters,
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
    LandingPages,
    // Pages
    Pages,
    AboutPage,
    ContactPage,
    ThankYouPages,
    HomePage,
    LegalPages,
    Menus,
    TravelTypes,
    SpecialtyExperiences,
    Locations,
    Neighborhoods,
    // Settings
    SiteSettings,
    ComparisonPage,
    // Additional Pages
    HowItWorksPage,
    HowToPreparePage,
    CorporateGroupsPage,
    TrackRecordPage,
    PrivateToursPage,
    DirectionsPage,
    // Quiz
    TourQuiz,
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
    push: true,
  }),
  sharp,
  plugins: [
    // Import/Export Plugin
    importExportPlugin({
      collections: [
        { slug: 'users' },
        { slug: 'tours' },
        { slug: 'tour-masters' },
        { slug: 'stories' },
        { slug: 'testimonials' },
        { slug: 'faqs' },
        { slug: 'media_coverage' },
        { slug: 'landing_pages' },
        { slug: 'pages' },
        { slug: 'about_page' },
        { slug: 'contact_page' },
        { slug: 'thank_you_pages' },
        { slug: 'home_page' },
        { slug: 'legal_pages' },
        { slug: 'menus' },
        { slug: 'travel_types' },
        { slug: 'specialty_experiences' },
        { slug: 'locations' },
        { slug: 'neighborhoods' },
        { slug: 'site_settings' },
        { slug: 'comparison_page' },
        { slug: 'dietary_options' },
        { slug: 'food_items' },
        { slug: 'vendors' },
        { slug: 'how_it_works_page' },
        { slug: 'how_to_prepare_page' },
        { slug: 'corporate_groups_page' },
        { slug: 'track_record_page' },
        { slug: 'private_tours_page' },
        { slug: 'directions_page' },
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
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }: { filename: string; prefix?: string }) => {
            return `https://cdn.simplyenak.com/payload-media/${filename}`;
          },
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
      collections: ['tours', 'stories', 'landing_pages', 'pages'],
      uploadsCollection: 'media',
    }),
    // Nested Docs Plugin
    nestedDocsPlugin({
      collections: ['about_page', 'contact_page'],
    }),
    // OpenAPI Plugin
    openapi({
      specEndpoint: '/openapi-spec',
      authEndpoint: '/api',
      enabled: true,
      metadata: {
        title: 'Simply Enak API',
        version: '1.0.0',
      },
    }),
    // Media Gallery Plugin
    mediaGalleryPlugin({
      collections: { media: true },
      defaultView: 'justified',
      lightbox: true,
      edit: true,
    }),
  ],
})
