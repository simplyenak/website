#!/usr/bin/env node
/**
 * Transform & Import Frontend JSON → Payload Staging
 *
 * Usage:
 *   DATABASE_URL=postgres://... npx tsx scripts/transform-and-import.mjs [--dry-run] [--target=local|staging]
 *
 * Phase 1: Scan all JSONs for image URLs → create Media DB entries
 * Phase 2: Transform field names → import via Payload Local API
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Pre-load PAYLOAD_SECRET before config import
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '..', '.env')
if (fs.existsSync(envPath) && !process.env.PAYLOAD_SECRET) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const match = envContent.match(/^PAYLOAD_SECRET=(.+)$/m)
  if (match) process.env.PAYLOAD_SECRET = match[1].trim()
}

import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import pg from 'pg'
import dotenv from 'dotenv'

const { Client } = pg

dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

// ─── CONFIG ─────────────────────────────────────────────────────────────────
const CONTENT_DIR = path.resolve(__dirname, '../../frontend/src/data/content')
const DRY_RUN = process.argv.includes('--dry-run')
const TARGET = process.argv.find(a => a.startsWith('--target='))?.split('=')[1] || 'local'

const COLLECTIONS_TO_IMPORT = [
  'tours',
  'stories',
  'testimonials',
  'faqs',
  'pages',
  'landing_pages',
  'media_coverage',
  'dietary_options',
  'food_items',
  'vendors',
  'locations',
  'travel_types',
  'specialty_experiences',
  'neighborhoods',
]

// ─── FIELD MAPPINGS ─────────────────────────────────────────────────────────

// LandingPages: unified collection with type field
const LANDING_PAGE_TYPE_MAP = {
  'dietary-landing-pages.json': 'dietary',
  'location-landing-pages.json': 'location',
  'specialty-landing-pages.json': 'specialty',
  'travel-type-landing-pages.json': 'travel_type',
}

// Convert plain text or HTML to Payload richText (Slate) format
function toRichText(val) {
  if (!val) return null
  if (typeof val !== 'string') return val

  // Check if it's HTML
  if (val.includes('<')) {
    return htmlToSlate(val)
  }

  // Plain text — single paragraph
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: null,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: null,
          children: [
            { type: 'text', text: val, format: 0, version: 1, mode: 'normal', style: '', detail: 0 }
          ],
        },
      ],
    },
  }
}

// Simple HTML-to-Slate converter (handles <p> tags)
function htmlToSlate(html) {
  const children = []
  // Split by </p> and process each paragraph
  const paragraphs = html.split(/<\/p\s*>/i).filter(Boolean)

  for (const para of paragraphs) {
    // Extract text between <p...> and the content
    const match = para.match(/<p[^>]*>(.*)/is)
    if (match) {
      const text = match[1].replace(/<[^>]+>/g, '').replace(/\n+/g, ' ').trim()
      if (text) {
        children.push({
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: null,
          children: [
            { type: 'text', text, format: 0, version: 1, mode: 'normal', style: '', detail: 0 }
          ],
        })
      }
    }
  }

  // Fallback: if no paragraphs found, treat as plain text
  if (children.length === 0) {
    const text = html.replace(/<[^>]+>/g, '').trim()
    if (text) {
      children.push({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: null,
        children: [
          { type: 'text', text, format: 0, version: 1, mode: 'normal', style: '', detail: 0 }
        ],
      })
    }
  }

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: null,
      children,
    },
  }
}

// FAQ category value mapping (frontend → payload valid values)
const FAQ_CATEGORY_MAP = {
  'accessibility': 'general',
  'day': 'general',
  'food': 'general',
  'practical': 'general',
  'tour': 'general',
  'booking': 'booking',
  'dietary': 'dietary',
  'private_tours': 'private_tours',
  'general': 'general',
}

// Map frontend JSON field names → Payload schema field names
const FIELD_MAPS = {
  tours: {
    // Direct mappings (same name in both)
    slug: 'slug',
    status: 'status',
    price: 'price',
    currency: 'currency',
    duration: 'duration',
    duration_minutes: 'duration_minutes',
    location: 'location',
    max_participants: 'max_participants',
    min_participants: 'min_participants',
    tailored_available: 'tailored_available',
    ticketing_hub_id: 'ticketing_hub_id',
    is_bookable: 'is_bookable',
    booking_url: 'booking_url',
    instant_confirmation: 'instant_confirmation',
    scheduled_publish: 'scheduled_publish',
    tour_frequency: 'tour_frequency',
    dishes_count: 'dishes_count',
    difficulty: 'difficulty',
    walking_distance: 'walking_distance',
    directions_html: 'directions_html',
    promo_video_url: 'promo_video_url',
    featured: 'featured',
    popular: 'popular',
    new: 'new',
    published_at: 'published_at',
    workflow_status: 'workflow_status',
    // Renamed mappings
    name: 'name', // in locales
    tagline: 'tagline', // in locales
    short_description: 'short_description', // in locales
    full_description: 'full_description', // in locales
    meeting_point: 'meeting_point', // in locales
    tailored_notes: 'tailored_notes', // in locales
    cancellation_policy: 'cancellation_policy', // in locales
    hero_image_alt: 'hero_image_alt', // in locales
    badge_label: 'badge_label', // in locales
    meta_title: 'meta_title', // in locales
    meta_description: 'meta_description', // in locales
    meta_image: 'meta_image_id',
    hero_image: 'hero_image_id',
  },
  stories: {
    slug: 'slug',
    status: 'status',
    publishedDate: 'publishedDate',
    scheduledPublish: 'scheduledPublish',
    workflowStatus: 'workflowStatus',
    title: 'title', // locales
    subtitle: 'subtitle', // locales
    excerpt: 'excerpt', // locales
    content: 'content', // locales — converted to richText
    author: 'author', // relationship field → set to default user
    meta_title: 'meta_title', // locales
    meta_description: 'meta_description', // locales
    hero_image: 'hero_image_id',
    meta_image: 'meta_image_id',
  },
  testimonials: {
    author_name: 'author_name',
    author_location: 'author_location',
    rating: 'rating',
    review_text: 'review_text',
    review_title: 'review_title',
    author_photo: 'author_photo',
    date: 'date',
    visibility: 'visibility',
    platform: 'platform',
    relatedTours: 'relatedTours',
    page_visibility: 'page_visibility',
    workflowStatus: 'workflowStatus',
  },
  faqs: {
    question: 'question', // locales
    answer: 'answer', // locales — will be converted to richText
    category: 'category',
    status: 'status',
    order: 'order',
    page_visibility: 'page_visibility',
  },
  pages: {
    slug: 'slug',
    status: 'status',
    type: 'type',
    title: 'title', // locales
    meta_title: 'meta_title', // locales
    meta_description: 'meta_description', // locales
    meta_image: 'meta_image_id',
    location: 'location',
  },
  media_coverage: {
    outlet: 'outlet',
    url: 'url',
    date: 'date',
    featured: 'featured',
    status: 'status',
    title: 'title', // locales
    excerpt: 'excerpt', // locales
    logo: 'logo_id',
  },
  landing_pages: {
    // Common
    slug: 'slug',
    status: 'status',
    icon: 'icon',
    color: 'color',
    published_at: 'published_at',
    // Hero
    hero_title: 'hero_title', // locales
    hero_subtitle: 'hero_subtitle', // locales
    hero_description: 'hero_description', // locales
    hero_image: 'hero_image_id',
    // Intro
    intro_content: 'intro_content', // locales
    intro_title: 'intro_title', // locales
    meta_title: 'meta_title', // locales
    meta_description: 'meta_description', // locales
    meta_image: 'meta_image_id',
    // Type-specific (frontend → payload)
    dietary_name: 'title', // locales
    location_name: 'title', // locales
    specialty_name: 'title', // locales
    travel_type_name: 'title', // locales
    // Arrays (all in locales where applicable)
    food_highlights: 'highlights',
    signature_dishes: 'safe_dishes',
    travel_tips: 'tips',
    challenges: 'challenges',
    tips: 'tips',
    safe_dishes: 'safe_dishes',
    avoid_dishes: 'avoid_dishes',
    suitable_tours: 'suitable_tours',
    highlights: 'highlights',
    key_features: 'highlights',
    why_perfect_content: 'intro_content',
    expect_content: 'intro_content',
    // Headings (locales)
    travel_tips_heading: 'tips_heading', // locales
    challenges_heading: 'challenges_heading', // locales
    options_heading: 'options_heading', // locales
    options_content: 'options_content', // locales
    features_heading: 'features_heading', // locales
    tips_heading: 'tips_heading', // locales
    tips_content: 'tips_content', // locales
    safe_dishes_heading: 'safe_dishes_heading', // locales
    avoid_dishes_heading: 'avoid_dishes_heading', // locales
    tours_heading: 'tours_heading', // locales
    why_perfect_heading: 'intro_title', // locales
    expect_heading: 'intro_title', // locales
  },
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

function log(section, msg) {
  const prefix = DRY_RUN ? '[DRY-RUN]' : `[${section}]`
  console.log(`${prefix} ${msg}`)
}

function loadJson(filename) {
  const filepath = path.join(CONTENT_DIR, filename)
  if (!fs.existsSync(filepath)) {
    log('WARN', `File not found: ${filepath}`)
    return null
  }
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'))
  } catch (err) {
    log('ERROR', `Failed to parse ${filepath}: ${err.message}`)
    return null
  }
}

// Extract all unique image URLs from a document
function extractImageUrls(doc) {
  const urls = new Set()
  function scan(obj) {
    if (!obj || typeof obj !== 'object') return
    if (Array.isArray(obj)) {
      obj.forEach(scan)
    } else {
      for (const [key, val] of Object.entries(obj)) {
        if (typeof val === 'string' && val.match(/^https?:\/\/.*\.(jpe?g|png|webp|gif|svg)/i)) {
          urls.add(val)
        } else if (typeof val === 'object') {
          scan(val)
        }
      }
    }
  }
  scan(doc)
  return Array.from(urls)
}

// Fetch image metadata (Content-Type, Content-Length)
async function fetchImageMeta(url) {
  const ext = path.extname(new URL(url).pathname).toLowerCase()
  const mimeFromExt = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  }
  const fallbackMime = mimeFromExt[ext] || 'image/jpeg'

  try {
    const res = await fetch(url, { method: 'HEAD' })
    if (res.ok) {
      return {
        mimeType: res.headers.get('content-type')?.split(';')[0] || fallbackMime,
        filesize: parseInt(res.headers.get('content-length') || '0', 10) || null,
        url,
      }
    }
  } catch (err) {
    // HEAD may fail on S3; fall through
  }

  // Fallback: try GET with range 0-0 (lighter than full GET)
  try {
    const res = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-0' } })
    if (res.ok || res.status === 206) {
      return {
        mimeType: res.headers.get('content-type')?.split(';')[0] || fallbackMime,
        filesize: parseInt(res.headers.get('content-length') || '0', 10) || null,
        url,
      }
    }
  } catch (err) {
    log('WARN', `Failed to fetch metadata for ${url}: ${err.message}`)
  }

  // Ultimate fallback: guess from extension
  return { mimeType: fallbackMime, filesize: null, url }
}

// ─── PHASE 1: MEDIA IMPORT ──────────────────────────────────────────────────

async function importMedia(dbClient) {
  log('MEDIA', 'Scanning all JSONs for image references...')
  const allUrls = new Set()

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.json'))
  for (const file of files) {
    const data = loadJson(file)
    if (!data) continue
    const docs = Array.isArray(data) ? data : [data]
    for (const doc of docs) {
      extractImageUrls(doc).forEach(url => allUrls.add(url))
    }
  }

  log('MEDIA', `Found ${allUrls.size} unique image URLs`)
  if (allUrls.size === 0) return new Map()

  const urlToId = new Map()

  // Check existing media by URL
  const existingRes = await dbClient.query('SELECT id, url FROM media WHERE url = ANY($1)', [Array.from(allUrls)])
  for (const row of existingRes.rows) {
    urlToId.set(row.url, row.id)
    log('MEDIA', `Existing media: ${row.url} → id:${row.id}`)
  }

  // Also check by filename to avoid unique constraint violations
  const allFilenames = Array.from(allUrls).map(url => path.basename(new URL(url).pathname))
  const existingByFilenameRes = await dbClient.query(
    'SELECT id, url, filename FROM media WHERE filename = ANY($1)',
    [allFilenames]
  )
  for (const row of existingByFilenameRes.rows) {
    // Map the filename back to any URL that uses it
    for (const url of allUrls) {
      if (path.basename(new URL(url).pathname) === row.filename && !urlToId.has(url)) {
        urlToId.set(url, row.id)
        log('MEDIA', `Existing by filename: ${url} → id:${row.id} (filename: ${row.filename})`)
      }
    }
  }

  const newUrls = Array.from(allUrls).filter(url => !urlToId.has(url))
  log('MEDIA', `${newUrls.length} new images to create`)

  if (DRY_RUN) {
    for (const url of newUrls) {
      const meta = await fetchImageMeta(url)
      log('MEDIA', `[DRY-RUN] Would create: ${url} (${meta?.mimeType}, ${meta?.filesize} bytes)`)
    }
    return urlToId
  }

  for (const url of newUrls) {
    const meta = await fetchImageMeta(url)
    if (!meta) {
      log('WARN', `Skipping ${url} — metadata fetch failed`)
      continue
    }

    const filename = path.basename(new URL(url).pathname)
    const prefix = 'payload-media'

    // Insert into media table
    try {
      const insertRes = await dbClient.query(
        `INSERT INTO media (filename, mime_type, filesize, url, prefix, width, height, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         RETURNING id`,
        [filename, meta.mimeType, meta.filesize, url, prefix, null, null]
      )
      const id = insertRes.rows[0].id
      urlToId.set(url, id)
      log('MEDIA', `Created: ${filename} → id:${id}`)
    } catch (err) {
      if (err.code === '23505') {
        // Unique constraint violation — fetch existing and use it
        const existingRes = await dbClient.query('SELECT id FROM media WHERE filename = $1', [filename])
        if (existingRes.rows.length > 0) {
          const id = existingRes.rows[0].id
          urlToId.set(url, id)
          log('MEDIA', `Reused existing: ${filename} → id:${id}`)
        } else {
          log('WARN', `Unique constraint failed but no existing found for ${filename}`)
        }
      } else {
        throw err
      }
    }
  }

  return urlToId
}

// ─── PHASE 2: CONTENT TRANSFORM & IMPORT ────────────────────────────────────

function transformLandingPage(doc, type, urlToId) {
  const map = FIELD_MAPS.landing_pages
  const result = {
    slug: doc.slug,
    status: doc.status || 'published',
    type,
    icon: doc.icon || '',
    color: doc.color || '',
    published_at: doc.published_at || new Date().toISOString(),
    _status: doc._status || 'published',
  }

  // Map locale fields
  const localeFields = {}
  for (const [frontendKey, payloadKey] of Object.entries(map)) {
    if (!doc.hasOwnProperty(frontendKey)) continue
    const val = doc[frontendKey]

    // Handle image references
    if (frontendKey === 'hero_image' || frontendKey === 'meta_image') {
      if (val && urlToId.has(val)) {
        result[payloadKey] = urlToId.get(val)
      }
      continue
    }

    // Handle title mapping (dietary_name, location_name, etc. → title)
    if (['dietary_name', 'location_name', 'specialty_name', 'travel_type_name'].includes(frontendKey)) {
      localeFields[payloadKey] = val
      continue
    }

    // Handle simple locale fields (including new mapped ones)
    if (['hero_title', 'hero_subtitle', 'hero_description', 'intro_content', 'intro_title',
         'meta_title', 'meta_description', 'options_content', 'tips_content',
         'challenges_heading', 'options_heading', 'features_heading', 'tips_heading',
         'safe_dishes_heading', 'avoid_dishes_heading', 'tours_heading',
         'travel_tips_heading', 'why_perfect_heading', 'expect_heading'].includes(frontendKey)) {
      localeFields[payloadKey] = val
      continue
    }

    // Handle array fields
    if (Array.isArray(val)) {
      // Transform array item shapes
      if (frontendKey === 'food_highlights' || frontendKey === 'challenges' || frontendKey === 'features' || frontendKey === 'highlights' || frontendKey === 'key_features') {
        localeFields[payloadKey] = val.map(item => ({
          title: item.title || item.name || '',
          description: item.description || '',
        }))
      } else if (frontendKey === 'signature_dishes' || frontendKey === 'safe_dishes') {
        localeFields[payloadKey] = val.map(item => ({
          name: item.name || item.title || '',
          description: item.description || '',
        }))
      } else if (frontendKey === 'travel_tips' || frontendKey === 'tips') {
        localeFields[payloadKey] = val.map(item => ({
          title: item.title || '',
          content: item.content || item.description || '',
        }))
      } else if (frontendKey === 'avoid_dishes') {
        localeFields[payloadKey] = val.map(item => ({
          name: item.name || item.title || '',
          description: item.description || '',
        }))
      } else if (frontendKey === 'suitable_tours') {
        localeFields[payloadKey] = val.map(item => ({
          tour_slug: item.tour_slug || item.slug || item,
        }))
      } else {
        localeFields[payloadKey] = val
      }
      continue
    }

    // Everything else
    result[payloadKey] = val
  }

  return { ...result, ...localeFields }
}

function transformDoc(doc, collection, urlToId) {
  if (collection === 'landing_pages') {
    // Detect type from available fields
    let type = 'location'
    if (doc.dietary_name) type = 'dietary'
    else if (doc.specialty_name) type = 'specialty'
    else if (doc.travel_type_name) type = 'travel_type'
    return transformLandingPage(doc, type, urlToId)
  }

  const map = FIELD_MAPS[collection]
  if (!map) return doc

  const result = {}
  for (const [frontendKey, payloadKey] of Object.entries(map)) {
    if (!doc.hasOwnProperty(frontendKey)) continue
    let val = doc[frontendKey]

    // Skip relationship fields we can't resolve
    if (collection === 'stories' && frontendKey === 'author') {
      result[payloadKey] = 1 // Default to first user (import@simplyenak.com)
      continue
    }

    // Image references
    if (frontendKey === 'hero_image' || frontendKey === 'meta_image' || frontendKey === 'logo') {
      if (val && urlToId.has(val)) {
        result[payloadKey] = urlToId.get(val)
      }
      continue
    }

    // Convert plain text to richText for specific fields
    if ((collection === 'stories' && frontendKey === 'content') ||
        (collection === 'faqs' && frontendKey === 'answer')) {
      val = toRichText(val)
    }

    // Map FAQ category values
    if (collection === 'faqs' && frontendKey === 'category' && val) {
      val = FAQ_CATEGORY_MAP[val] || 'general'
    }

    result[payloadKey] = val
  }

  // Ensure _status is set
  if (!result._status) result._status = 'published'
  if (!result.status) result.status = 'published'

  return result
}

async function importCollection(payload, collection, docs, urlToId, matchKey = null) {
  log(collection.toUpperCase(), `Importing ${docs.length} docs...`)
  let imported = 0
  let skipped = 0
  let errors = 0

  // For no-slug collections, fetch all existing docs to match by key
  let existingDocs = []
  if (matchKey && !DRY_RUN) {
    try {
      const all = await payload.find({ collection, limit: 1000, overrideAccess: true })
      existingDocs = all.docs || []
    } catch (e) {
      log('WARN', `Could not fetch existing ${collection}: ${e.message}`)
    }
  }

  for (const doc of docs) {
    try {
      const transformed = transformDoc(doc, collection, urlToId)
      const slug = transformed.slug

      if (DRY_RUN) {
        log(collection.toUpperCase(), `[DRY-RUN] Would import: ${slug || transformed[matchKey] || 'no-slug'}`)
        imported++
        continue
      }

      let targetId = null

      if (slug) {
        // Slug-based collections: check by slug
        const existing = await payload.find({
          collection,
          where: { slug: { equals: slug } },
          limit: 1,
          overrideAccess: true,
        })
        if (existing.docs.length > 0) targetId = existing.docs[0].id
      } else if (matchKey) {
        // No-slug collections: match by key
        const matchVal = transformed[matchKey]
        if (matchVal) {
          const found = existingDocs.find(d => {
            const existingVal = d[matchKey]
            // Handle localized fields (objects with en/ms/zh)
            if (typeof existingVal === 'object' && existingVal !== null) {
              return existingVal.en === matchVal.en || existingVal.en === matchVal
            }
            return existingVal === matchVal
          })
          if (found) targetId = found.id
        }
      }

      if (targetId) {
        await payload.update({
          collection,
          id: targetId,
          data: transformed,
          overrideAccess: true,
        })
        log(collection.toUpperCase(), `Updated: ${slug || transformed[matchKey]}`)
      } else {
        const created = await payload.create({
          collection,
          data: transformed,
          overrideAccess: true,
        })
        log(collection.toUpperCase(), `Created: ${slug || transformed[matchKey]}`)
        // Cache for subsequent duplicates in this run
        if (matchKey) existingDocs.push(created)
      }
      imported++
    } catch (err) {
      log('ERROR', `Failed to import ${collection} ${doc.slug || doc.id || '?'}: ${err.message}`)
      errors++
    }
  }

  return { imported, skipped, errors }
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('='.repeat(70))
  console.log('  Simply Enak — Frontend JSON → Payload Import')
  console.log(`  Target: ${TARGET} | Dry-run: ${DRY_RUN}`)
  console.log('='.repeat(70))

  // Connect to DB directly for media inserts
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('ERROR: DATABASE_URL not set')
    process.exit(1)
  }

  const dbClient = new Client({ connectionString: dbUrl })
  await dbClient.connect()
  log('DB', `Connected: ${dbUrl.replace(/\/\/.*@/, '//***@')}`)

  // Phase 1: Media
  const urlToId = await importMedia(dbClient)

  // Phase 2: Content
  const payload = await getPayload({ config })
  log('PAYLOAD', 'Initialized')

  const stats = {}

  // Tours - only import REAL bookable tours (not marketing pages)
  const allTours = loadJson('tours.json')
  if (allTours) {
    const realTours = allTours.filter(t => t.is_bookable || t.ticketing_hub_id)
    const skippedMarketing = allTours.length - realTours.length
    if (skippedMarketing > 0) {
      log('TOURS', `Skipping ${skippedMarketing} marketing pages (they belong in pages/landing_pages)`)
    }
    stats.tours = await importCollection(payload, 'tours', realTours, urlToId)
  }

  // Stories
  const stories = loadJson('stories.json')
  if (stories) {
    stats.stories = await importCollection(payload, 'stories', stories, urlToId)
  }

  // Testimonials
  const testimonials = loadJson('testimonials.json')
  if (testimonials) {
    stats.testimonials = await importCollection(payload, 'testimonials', testimonials, urlToId, 'author_name')
  }

  // FAQs
  const faqs = loadJson('faqs.json')
  if (faqs) {
    stats.faqs = await importCollection(payload, 'faqs', faqs, urlToId, 'question')
  }

  // Pages
  const pages = loadJson('pages.json')
  if (pages) {
    stats.pages = await importCollection(payload, 'pages', pages, urlToId)
  }

  // Media Coverage
  const mediaCoverage = loadJson('media-coverage.json')
  if (mediaCoverage) {
    stats.media_coverage = await importCollection(payload, 'media_coverage', mediaCoverage, urlToId, 'url')
  }

  // Landing Pages (4 separate JSONs → 1 collection)
  const landingPageFiles = [
    'dietary-landing-pages.json',
    'location-landing-pages.json',
    'specialty-landing-pages.json',
    'travel-type-landing-pages.json',
  ]
  let allLandingPages = []
  for (const file of landingPageFiles) {
    const data = loadJson(file)
    if (data) allLandingPages = allLandingPages.concat(data)
  }
  if (allLandingPages.length > 0) {
    stats.landing_pages = await importCollection(payload, 'landing_pages', allLandingPages, urlToId)
  }

  // Dietary Options
  const dietaryOptions = loadJson('dietary-options.json')
  if (dietaryOptions) {
    stats.dietary_options = await importCollection(payload, 'dietary_options', dietaryOptions, urlToId)
  }

  // Locations
  const locations = loadJson('locations.json')
  if (locations) {
    stats.locations = await importCollection(payload, 'locations', locations, urlToId)
  }

  // Travel Types
  const travelTypes = loadJson('travel-types.json')
  if (travelTypes) {
    stats.travel_types = await importCollection(payload, 'travel_types', travelTypes, urlToId)
  }

  // Specialty Experiences
  const specialtyExperiences = loadJson('specialty-experiences.json')
  if (specialtyExperiences) {
    stats.specialty_experiences = await importCollection(payload, 'specialty_experiences', specialtyExperiences, urlToId)
  }

  await dbClient.end()

  // Summary
  console.log('\n' + '='.repeat(70))
  console.log('  IMPORT SUMMARY')
  console.log('='.repeat(70))
  for (const [col, s] of Object.entries(stats)) {
    console.log(`  ${col.padEnd(25)} | Created/Updated: ${s.imported} | Errors: ${s.errors}`)
  }
  console.log('='.repeat(70))
}

main().catch(err => {
  console.error('FATAL:', err)
  process.exit(1)
})
