#!/usr/bin/env node
/**
 * Sync script: Payload CMS → Astro JSON snapshots
 * 
 * Pulls content from Payload REST API, transforms block-based data
 * to flat format for compatibility with the existing Astro data layer,
 * and writes JSON snapshots.
 * 
 * Fallback chain (all Payload):
 *   1. Authenticated API (PAYLOAD_TOKEN set)
 *   2. Unauthenticated API (public read collections)
 *   3. Sensible defaults / empty structures for missing collections
 * 
 * Usage: npm run sync
 *   or: node scripts/sync-payload.mjs [--dry-run] [--verbose]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from project root if it exists (for local dev without --env-file)
const envPath = path.resolve(__dirname, '..', '.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim()
    if (!process.env[key]) {
      process.env[key] = val
    }
  }
}

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3000'
const PAYLOAD_TOKEN = process.env.PAYLOAD_TOKEN || ''
const PAYLOAD_EMAIL = process.env.PAYLOAD_EMAIL || ''
const PAYLOAD_PASSWORD = process.env.PAYLOAD_PASSWORD || ''
const CONTENT_DIR = path.resolve(__dirname, '../src/data/content')
const DRY_RUN = process.argv.includes('--dry-run')
const VERBOSE = process.argv.includes('--verbose')
const FORCE = process.argv.includes('--force')

// Safety: minimum item counts per collection. If Payload returns fewer,
// the sync aborts to prevent corrupting/emptying the site.
// Set to 0 for collections that legitimately may be empty.
const MIN_COUNTS = {
  'tours': 1,
  'stories': 0,
  'faqs': 0,
  'testimonials': 0,
  'media_coverage': 0,
  'legal_pages': 0,
  'dietary_options': 1,
  'travel_types': 1,
  'specialty_experiences': 1,
  'locations': 1,
  'tour_quiz': 1,
  'dietary_landing_pages': 0,
  'specialty_landing_pages': 0,
  'travel_type_landing_pages': 0,
  'location_landing_pages': 0,
  'landing_pages': 0,
}

// Track safety violations during sync
const safetyViolations = []
let backupDone = false

// Map JSON filenames to Payload collection slugs for safety validation
const SLUG_MAP = {
  'tours': 'tours',
  'stories': 'stories',
  'faqs': 'faqs',
  'testimonials': 'testimonials',
  'media-coverage': 'media_coverage',
  'legal-pages': 'legal_pages',
  'dietary-options': 'dietary_options',
  'travel-types': 'travel_types',
  'specialty-experiences': 'specialty_experiences',
  'locations': 'locations',
  'tour-quiz': 'tour_quiz',
  // Landing pages: split by type so segment pages don't mix concerns
  'dietary-landing-pages': 'landing_pages',
  'specialty-landing-pages': 'landing_pages',
  'travel-type-landing-pages': 'landing_pages',
  'location-landing-pages': 'landing_pages',
}

// Stats
const stats = { fetched: 0, unauth: 0, defaulted: 0, written: 0, errored: 0, backupCount: 0, preserved: 0 }

// ─── HTTP helpers ───────────────────────────────────────────────────────────────

// Files that should NOT be overwritten by sync if they already have hand-curated content.
const PROTECTED_FILES = new Set([
])

// Check if a transformed result is effectively empty (all block-sourced fields are empty/null).
// This prevents overwriting hand-curated JSON when Payload blocks haven't been populated yet.
function isEffectivelyEmpty(data, requiredFields = []) {
  if (!data) return true
  if (typeof data !== 'object') return false
  const fields = requiredFields.length > 0 ? requiredFields : Object.keys(data).filter(k => k !== 'id')
  const nonEmpty = fields.filter(k => {
    const v = data[k]
    if (v === null || v === undefined || v === '') return false
    if (Array.isArray(v) && v.length === 0) return false
    return true
  })
  // If ALL required fields are non-empty, it's not effectively empty
  return nonEmpty.length < fields.length
}

// The key content fields for home-page and about-page — if these are all empty,
// the Payload blocks haven't been populated yet.
const HOME_REQUIRED_FIELDS = [
  'hero_title', 'hero_subtitle', 'manifesto_headline', 'cta_title',
  'pillars_intro', 'vendors_title', 'segment_heading',
]
const ABOUT_REQUIRED_FIELDS = [
  'hero_title', 'founder_story_title', 'founder_story_text',
]

async function payloadFetch(slug, useAuth = true) {
  const url = new URL(`${PAYLOAD_URL}/api/${slug}`)
  url.searchParams.set('depth', '3')
  url.searchParams.set('limit', '0')

  const reqHeaders = { 'Content-Type': 'application/json' }
  if (useAuth && PAYLOAD_TOKEN) {
    reqHeaders['Authorization'] = `Bearer ${PAYLOAD_TOKEN}`
  }

  try {
    const res = await fetch(url, { headers: reqHeaders, signal: AbortSignal.timeout(300000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    return json.docs || []
  } catch (err) {
    return null
  }
}

async function fetchCollection(slug) {
  // 1. Try with existing token
  if (PAYLOAD_TOKEN) {
    const docs = await payloadFetch(slug, true)
    if (docs !== null) { stats.fetched++; return docs }
  }
  // 1b. Try login-based auth if email/password are available
  let loginToken = '';
  if (PAYLOAD_EMAIL && PAYLOAD_PASSWORD) {
    try {
      const loginRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: PAYLOAD_EMAIL, password: PAYLOAD_PASSWORD }),
        signal: AbortSignal.timeout(15000),
      })
      if (loginRes.ok) {
        const loginData = await loginRes.json()
        loginToken = loginData.token || ''
        if (loginToken) {
          const url = new URL(`${PAYLOAD_URL}/api/${slug}`)
          url.searchParams.set('depth', '3')
          url.searchParams.set('limit', '0')
          const authRes = await fetch(url, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${loginToken}` },
            signal: AbortSignal.timeout(300000),
          })
          if (authRes.ok) {
            const json = await authRes.json()
            stats.fetched++
            return json.docs || []
          }
        }
      }
    } catch { /* login failed, fall through */ }
  }
  // 2. Try without auth (public read)
  const docs = await payloadFetch(slug, false)
  if (docs !== null) { stats.unauth++; return docs }
  // 3. Failed
  return null
}

async function fetchSingleton(slug) {
  const docs = await fetchCollection(slug)
  return docs && docs.length > 0 ? docs[0] : null
}

function backupExistingJSON() {
  const BACKUP_DIR = path.join(CONTENT_DIR, '.sync-backup')
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.json'))
  if (files.length === 0) return 0
  fs.mkdirSync(BACKUP_DIR, { recursive: true })
  let count = 0
  for (const f of files) {
    fs.copyFileSync(path.join(CONTENT_DIR, f), path.join(BACKUP_DIR, f))
    count++
  }
  return count
}

async function preflightCheck() {
  log('🔍 Preflight: checking Payload connectivity...')
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/home_page?limit=1`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(180000),
    })
    if (res.ok || res.status === 401 || res.status === 403) {
      log('  ✅ Payload is responding')
      return true
    }
    log(`  ❌ Payload returned HTTP ${res.status}`)
    return false
  } catch (err) {
    log(`  ❌ Cannot reach Payload at ${PAYLOAD_URL}: ${err.message}`)
    return false
  }
}

function writeJSON(filename, data, options = {}) {
  if (DRY_RUN) {
    if (VERBOSE) log(`  [DRY RUN] Would write ${filename}`)
    return true
  }

  // Safety: validate minimum item counts
  const baseName = filename.replace('.json', '')
  const slug = SLUG_MAP[baseName] || baseName
  const minCount = MIN_COUNTS[slug] ?? 0

  if (minCount > 0) {
    const actualCount = Array.isArray(data) ? data.length : (data ? 1 : 0)
    if (actualCount < minCount) {
      safetyViolations.push({
        file: filename,
        slug,
        expected: minCount,
        actual: actualCount,
      })
      log(`  🛡️  SAFETY: ${filename} has ${actualCount} items (min: ${minCount}) — SKIPPED`)
      return false
    }
  }

  // Backup existing JSON before first write
  if (!backupDone) {
    stats.backupCount = backupExistingJSON()
    backupDone = true
    if (stats.backupCount > 0) log(`  💾 Backed up ${stats.backupCount} existing JSON files`)
  }

  // Protect hand-curated page config files from being overwritten with minimal defaults
  if (PROTECTED_FILES.has(filename) && !FORCE) {
    const existingPath = path.join(CONTENT_DIR, filename)
    if (fs.existsSync(existingPath)) {
      try {
        const existing = JSON.parse(fs.readFileSync(existingPath, 'utf-8'))
        if (Object.keys(existing).length > Object.keys(data).length) {
          log(`  🛡️  PROTECTED: ${filename} has ${Object.keys(existing).length} fields (sync would write ${Object.keys(data).length}). Use --force to overwrite.`)
          return true
        }
      } catch { /* if we can't read it, proceed with write */ }
    }
  }

  // Preserve existing translations that the sync doesn't produce from Payload
  const filePath = path.join(CONTENT_DIR, filename)
  if (fs.existsSync(filePath) && !FORCE) {
    try {
      const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      const incoming = data
      // Singleton (object): copy translations if missing
      if (!Array.isArray(incoming) && typeof incoming === 'object' && incoming !== null) {
        if (!incoming.translations && existing.translations) {
          incoming.translations = existing.translations
        }
      }
      // Array: merge translations per-item by slug
      if (Array.isArray(incoming) && Array.isArray(existing)) {
        const bySlug = Object.fromEntries(
          existing.filter(e => e.slug).map(e => [e.slug, e.translations])
        )
        for (const item of incoming) {
          if (!item.translations && item.slug && bySlug[item.slug]) {
            item.translations = bySlug[item.slug]
          }
        }
        // Also match FAQs by question text
        if (filename === 'faqs.json') {
          const byQuestion = Object.fromEntries(
            existing.filter(e => e.question).map(e => [e.question.trim().toLowerCase(), e.translations])
          )
          for (const item of incoming) {
            if (!item.translations && item.question) {
              const key = item.question.trim().toLowerCase()
              if (byQuestion[key]) item.translations = byQuestion[key]
            }
          }
        }
        // Match testimonials by review_title
        if (filename === 'testimonials.json') {
          const byTitle = Object.fromEntries(
            existing.filter(e => e.review_title).map(e => [e.review_title.trim().toLowerCase(), e.translations])
          )
          for (const item of incoming) {
            if (!item.translations && item.review_title) {
              const key = item.review_title.trim().toLowerCase()
              if (byTitle[key]) item.translations = byTitle[key]
            }
          }
        }

        // Field-level merge: when both incoming and existing have translations,
        // preserve existing field values that are missing from incoming.
        // This keeps locally-translated content (from translate-content.mjs)
        // when Payload doesn't have those fields populated.
        const MATCH_FIELDS = {
          'tours.json': 'slug',
          'stories.json': 'slug',
          'faqs.json': 'question',
          'testimonials.json': 'review_title',
        }
        const matchField = MATCH_FIELDS[filename]
        if (matchField) {
          const existingByMatch = Object.fromEntries(
            existing.filter(e => e[matchField]).map(e => [e[matchField], e])
          )
          for (const item of incoming) {
            if (!item.translations || !item[matchField]) continue
            const existingItem = existingByMatch[item[matchField]]
            if (!existingItem?.translations) continue

            // Build map: lang → existing translation
            const existingByLang = Object.fromEntries(
              existingItem.translations
                .filter(t => t.languages_code)
                .map(t => [t.languages_code, t])
            )

            for (const trans of item.translations) {
              const lang = trans.languages_code
              const existingTrans = existingByLang[lang]
              if (!existingTrans) continue

              // Fill empty fields in incoming from existing
              for (const [field, existingVal] of Object.entries(existingTrans)) {
                if (field === 'id' || field === 'languages_code' || field.endsWith('_id')) continue
                const existingHasContent = existingVal && (typeof existingVal === 'object' ? Object.keys(existingVal).length > 0 : String(existingVal).trim().length > 0)
                const incomingVal = trans[field]
                const incomingIsEmpty = !incomingVal || (typeof incomingVal === 'object' ? Object.keys(incomingVal).length === 0 : !String(incomingVal).trim())

                if (existingHasContent && incomingIsEmpty) {
                  trans[field] = existingVal
                }
              }
            }
          }
        }
      }
    } catch { /* if we can't read existing file, proceed without translations */ }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
  stats.written++
  if (VERBOSE) log(`  ✅ ${filename}`)
  return true
}

function log(msg) {
  if (VERBOSE || !DRY_RUN) console.log(msg)
}

// ─── Block → Flat transformers ──────────────────────────────────────────────────

/**
 * Transform tours from Payload's camelCase fields to the snake_case keys
 * the frontend expects, and add computed fields.
 *
 * Payload field           →  JSON key(s)
 * ticketingHubId          →  ticketing_hub_id
 * isBookable              →  is_bookable
 * cancellationPolicy      →  cancellation_policy
 * tourFrequency           →  tour_frequency
 * startTimes[].time       →  start_times (string array)
 * dishesCount             →  dishes_count
 * difficulty              →  difficulty (passthrough)
 * walkingDistance          →  walking_distance
 * directionsHtml          →  directions_html
 * itinerary[]             →  itinerary (passthrough)
 * differentiatorsTourist  →  differentiators_tourist
 * differentiatorsUs       →  differentiators_us
 * whatToBring[].item      →  what_to_bring (string array)
 * languagesOffered[].lang →  languages_offered (string array)
 * segmentTags[].tag       →  segment_tags (string array)
 * promoVideoUrl           →  promo_video_url
 * galleryImageAlts[].alt  →  gallery_image_alts (string array)
 * heroImageAlt            →  hero_image_alt
 * shortDescription        →  short_description (alias)
 * fullDescription         →  full_description (alias)
 * durationMinutes         →  duration_minutes (alias)
 * maxParticipants         →  max_participants (alias)
 * minParticipants         →  min_participants (alias)
 * dietaryOptions          →  dietary_options (alias)
 * specialtyExperiences    →  specialty_experiences (alias)
 * whatsIncluded[].item    →  whats_included (string array)
 * whatsExcluded[].item    →  whats_excluded (string array)
 */
function transformTour(tour) {
  if (!tour) return tour

  // Unwrap Payload array-of-objects into flat string arrays where needed
  const unwrap = (arr, key = 'item') =>
    Array.isArray(arr) ? arr.map(i => typeof i === 'object' ? (i[key] ?? i.time ?? i.language ?? i.alt ?? i.tag ?? i.highlight ?? '') : i).filter(Boolean) : arr || []

  const unwrapItinerary = (arr) =>
    Array.isArray(arr) ? arr.map(i => typeof i === 'object' ? i : { step: 0, title: String(i) }) : arr || []

  return {
    ...tour,

    // ── Booking-critical fields ──
    ticketing_hub_id: tour.ticketingHubId || tour.ticketing_hub_id || null,
    is_bookable: tour.isBookable === true || tour.is_bookable === true || !!(tour.ticketingHubId || tour.ticketing_hub_id),

    // ── camelCase → snake_case aliases ──
    short_description: tour.short_description || tour.shortDescription || null,
    full_description: tour.full_description || tour.fullDescription || null,
    duration_minutes: tour.duration_minutes ?? tour.durationMinutes ?? null,
    max_participants: tour.max_participants ?? tour.maxParticipants ?? null,
    min_participants: tour.min_participants ?? tour.minParticipants ?? null,
    dietary_options: tour.dietary_options || tour.dietaryOptions || [],
    specialty_experiences: tour.specialty_experiences || tour.specialtyExperiences || [],
    whats_included: tour.whats_included || unwrap(tour.whatsIncluded),
    whats_excluded: tour.whats_excluded || unwrap(tour.whatsExcluded),

    // ── New Payload fields → snake_case ──
    cancellation_policy: tour.cancellation_policy || tour.cancellationPolicy || null,
    tour_frequency: tour.tour_frequency || tour.tourFrequency || null,
    start_times: tour.start_times || unwrap(tour.startTimes, 'time'),
    dishes_count: tour.dishes_count ?? tour.dishesCount ?? null,
    walking_distance: tour.walking_distance || tour.walkingDistance || null,
    directions_html: tour.directions_html || tour.directionsHtml || null,
    itinerary: tour.itinerary || unwrapItinerary(tour.itinerary) || [],
    differentiators_tourist: tour.differentiators_tourist || unwrap(tour.differentiatorsTourist),
    differentiators_us: tour.differentiators_us || unwrap(tour.differentiatorsUs),
    what_to_bring: tour.what_to_bring || unwrap(tour.whatToBring),
    languages_offered: tour.languages_offered || unwrap(tour.languagesOffered, 'language'),
    segment_tags: tour.segment_tags || unwrap(tour.segmentTags, 'tag'),
    promo_video_url: tour.promo_video_url || tour.promoVideoUrl || null,
    gallery_image_alts: tour.gallery_image_alts || unwrap(tour.galleryImageAlts, 'alt'),
    hero_image_alt: tour.hero_image_alt || tour.heroImageAlt || null,
  }
}

function transformHomePage(doc) {
  if (!doc) return null
  const out = { id: doc.id }

  // Extract blocks from Payload's block-based sections
  const blocks = {}
  for (const section of Object.keys(doc)) {
    if (Array.isArray(doc[section]) && doc[section].length > 0 && doc[section][0].blockType) {
      blocks[section] = doc[section][0]
    }
  }

  // ── Hero Section ──
  const hero = blocks.heroSection || {}
  out.hero_title = hero.title || ''
  out.hero_highlight = hero.highlight || ''
  out.hero_title_end = hero.titleEnd || ''
  out.hero_subtitle = hero.subtitle || ''
  out.hero_description = hero.description || ''
  out.hero_price_info = hero.priceInfo || ''
  out.hero_bg_image = hero.bgImage || hero.image || null
  out.hero_eyebrow = hero.eyebrow || ''
  out.hero_cta_primary = hero.ctaPrimaryText || hero.ctaPrimary || ''
  out.hero_cta_primary_url = hero.ctaPrimaryUrl || ''
  out.hero_cta_secondary = hero.ctaSecondaryText || hero.ctaSecondary || ''
  out.hero_cta_secondary_url = hero.ctaSecondaryUrl || ''

  // Hero badges → individual flat fields (frontend expects separate strings)
  const badges = hero.badges || []
  out.hero_vendors = badges[0]?.text || ''
  out.hero_since = badges[1]?.text || ''
  out.hero_rated = badges[2]?.text || ''
  out.hero_max_per_tour = badges[3]?.text || ''
  out.hero_low_waste = badges[4]?.text || ''
  out.hero_guides = badges[5]?.text || ''
  out.hero_stalls = badges[6]?.text || ''
  out.hero_values = badges[7]?.text || ''
  out.hero_guests_hosted = badges[8]?.text || ''
  out.hero_cities = badges[9]?.text || ''

  // ── Manifesto Section ──
  const manifesto = blocks.manifestoSection || {}
  out.manifesto_eyebrow = manifesto.eyebrow || ''
  out.manifesto_headline = manifesto.headline || manifesto.quote || ''
  out.manifesto_tagline = manifesto.tagline || ''
  out.manifesto_body = manifesto.body || ''
  out.manifesto_attribution_name = manifesto.attributionName || manifesto.founderName || ''
  out.manifesto_attribution_role = manifesto.attributionRole || manifesto.attribution || ''
  out.manifesto_portrait = manifesto.portrait || null

  // ── Pillars Section ──
  const pillars = blocks.pillarsSection || {}
  out.pillars_intro = pillars.intro || ''
  const pillarItems = pillars.pillars || []
  // Frontend expects pillar_{key}_label/heading/body for 3 pillars
  const pillarKeys = ['people', 'food', 'place']
  for (let i = 0; i < 3; i++) {
    const key = pillarKeys[i]
    const p = pillarItems[i] || {}
    out[`pillar_${key}_label`] = p.label || p.title || ''
    out[`pillar_${key}_heading`] = p.heading || ''
    out[`pillar_${key}_body`] = p.body || p.description || ''
    out[`pillar_${key}_image`] = p.image || null
  }

  // ── Vendors Section ──
  const vendors = blocks.vendorsSection || {}
  out.vendors_eyebrow = vendors.eyebrow || ''
  out.vendors_title = vendors.title || ''
  out.vendors_subtitle = vendors.subtitle || ''
  out.featured_tours_title = (blocks.toursSection || {}).title || (blocks.featuredToursSection || {}).title || ''

  // ── Segments Section ──
  const segments = blocks.segmentsSection || {}
  out.segment_heading = segments.heading || segments.title || ''
  out.segment_subheading = segments.subheading || ''
  out.segment_view_all = segments.viewAllLabel || ''

  // ── About Section ──
  const about = blocks.aboutSection || {}
  out.about_eyebrow = about.eyebrow || null
  out.about_title = about.title || null
  out.about_subtitle = about.subtitle || null
  out.about_description = about.description || null
  out.about_heritage = about.heritage || null
  out.about_image = about.image || null

  // ── Expect Section (stats) ──
  // Frontend expects expect_stat{N}_number/heading/body for each stat
  const expectBlock = blocks.expectSection || {}
  out.expect_title = expectBlock.title || ''
  out.expect_subtitle = expectBlock.subtitle || ''
  const expectStats = expectBlock.stats || []
  for (let i = 0; i < expectStats.length; i++) {
    const n = i + 1
    out[`expect_stat${n}_number`] = expectStats[i].number || ''
    out[`expect_stat${n}_heading`] = expectStats[i].heading || expectStats[i].label || ''
    out[`expect_stat${n}_body`] = expectStats[i].body || expectStats[i].description || ''
  }

  // ── CTA Section ──
  const cta = blocks.ctaSection || {}
  out.cta_eyebrow = cta.eyebrow || ''
  out.cta_title = cta.title || cta.heading || ''
  out.cta_subtitle = cta.subtitle || cta.description || ''
  out.cta_book_experience = cta.bookLabel || cta.primaryButton || ''
  out.cta_chat_whatsapp = cta.chatLabel || cta.secondaryButton || ''

  // CTA features → individual flat fields
  const ctaFeatures = cta.features || []
  const ctaFeatureKeys = ['cta_free_cancellation', 'cta_reply_time', 'cta_max_people']
  for (let i = 0; i < Math.min(ctaFeatures.length, 3); i++) {
    out[ctaFeatureKeys[i]] = ctaFeatures[i].text || ctaFeatures[i].title || ''
  }

  // ── Vendors extras (null until populated in Payload) ──
  out.vendors_meet_on_tour = vendors.meetOnTour || null
  out.vendors_footer = vendors.footer || null
  out.vendors_read_stories = vendors.readStories || null

  // ── Meta fields (flat on the document, not in blocks) ──
  out.meta_title = doc.meta_title || ''
  out.meta_description = doc.meta_description || ''
  out.faqs = doc.faqs || null

  return out
}

function transformAboutPage(doc) {
  if (!doc) return null
  const out = { id: doc.id }

  // Extract blocks from Payload's block-based sections
  const blocks = {}
  for (const section of Object.keys(doc)) {
    if (Array.isArray(doc[section]) && doc[section].length > 0 && doc[section][0].blockType) {
      blocks[section] = doc[section][0]
    }
  }

  // ── Hero Section ──
  const hero = blocks.heroSection || {}
  out.heroImage = doc.hero_image || ''
  out.heroEyebrow = doc.hero_eyebrow || ''
  out.heroHeading = hero.title || ''
  out.heroDescription = doc.hero_description || ''

  // ── Founder Story Section ──
  out.founderSection = {
    eyebrow: doc.founder_eyebrow || '',
    heading: doc.founder_heading || '',
    paragraphs: (doc.founder_paragraphs || '').split('\n\n').filter(Boolean),
    image: doc.founder_image || '',
  }

  // ── Stats Section ──
  const statsBlock = blocks.statsSection || {}
  out.stats = (statsBlock.stats || []).map(s => ({
    number: s.number || '',
    label: s.label || '',
  }))

  // ── Timeline Section ──
  const timelineBlock = blocks.timelineSection || {}
  let milestones = []
  if (timelineBlock.events) {
    milestones = timelineBlock.events.map(e => ({
      year: e.year || '',
      title: e.title || '',
      description: e.description || '',
    }))
  }
  out.timelineSection = {
    eyebrow: doc.timeline_eyebrow || '',
    heading: doc.timeline_heading || '',
    description: doc.timeline_description || '',
    milestones,
  }

  // ── Philosophy Section ──
  let philItems = []
  try {
    philItems = JSON.parse(doc.philosophy_items || '[]')
  } catch {}
  out.philosophySection = {
    eyebrow: doc.philosophy_eyebrow || '',
    heading: doc.philosophy_heading || '',
    items: philItems,
  }

  // ── Team Section ──
  let teamMembers = []
  try {
    teamMembers = JSON.parse(doc.team_members || '[]')
  } catch {}
  out.teamSection = {
    eyebrow: doc.team_eyebrow || '',
    heading: doc.team_heading || '',
    description: doc.team_description || '',
    members: teamMembers,
  }

  // ── Testimonial ──
  out.testimonial = {
    text: doc.testimonial_text || '',
    name: doc.testimonial_name || '',
    location: doc.testimonial_location || '',
  }

  // ── CTA Section ──
  out.ctaSection = {
    heading: doc.cta_heading || '',
    description: doc.cta_description || '',
    ctaPrimary: {
      text: doc.cta_primary_text || '',
      url: doc.cta_primary_url || '',
    },
    ctaSecondary: {
      text: doc.cta_secondary_text || '',
      url: doc.cta_secondary_url || '',
    },
  }

  // ── SEO fields ──
  out.seo_title = doc.seo_title || ''
  out.seo_description = doc.seo_description || ''

  return out
}

function transformContactPage(doc) {
  if (!doc) return null
  return {
    id: doc.id,
    hero_title: doc.hero_title || '',
    hero_subtitle: doc.hero_subtitle || '',
    intro_title: doc.intro_title || '',
    intro_subtitle: doc.intro_subtitle || '',
    contact_phone: doc.contact_phone || '',
    contact_email: doc.contact_email || '',
    contact_hours: doc.contact_hours || '',
    whatsapp_number: doc.whatsapp_number || '',
    // Structured sections matching template expectations
    contactMethods: {
      heading: doc.contact_methods_heading || '',
      description: doc.contact_methods_description || '',
      items: (doc.contact_methods_items || []).map(m => ({
        type: m.type || '',
        title: m.title || '',
        subtitle: m.subtitle || '',
        detail: m.detail || '',
        cta: { text: m.cta_text || '', url: m.cta_url || '' },
      })),
    },
    planningScenarios: {
      heading: doc.planning_scenarios_heading || '',
      description: doc.planning_scenarios_description || '',
      items: (doc.planning_scenarios_items || []).map(s => ({
        title: s.title || '',
        description: s.description || '',
      })),
    },
    ourPromise: {
      title: doc.our_promise_title || '',
      description: doc.our_promise_description || '',
      highlights: (doc.our_promise_highlights || []).map(h => h.text || ''),
    },
    businessHours: {
      text: doc.business_hours_text || '',
      timezone: doc.business_hours_timezone || '',
    },
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
  }
}

function transformNavigation(docs) {
  if (!docs || docs.length === 0) return { header_links: [], footer_links: [], mobile_links: [] }
  const out = { header_links: [], footer_links: [], mobile_links: [] }
  for (const menu of docs) {
    const items = (menu.items || []).map(item => ({
      label: item.label || '',
      url: item.url || '',
      openInNewTab: item.openInNewTab || false,
    }))
    if (menu.location === 'top') out.header_links = items
    else if (menu.location === 'mobile') out.mobile_links = items
    else if (menu.location === 'footer') out.footer_links = items
  }
  return out
}


function transformPage(doc) {
  if (!doc) return null
  return {
    id: doc.id,
    slug: doc.slug,
    _status: doc.status || 'published',
    status: doc.status || 'published',
    type: doc.type || 'general',
    name: doc.title || '',
    title: doc.title || '',
    tagline: doc.tagline || '',
    hero_title: doc.hero_title || '',
    hero_subtitle: doc.hero_subtitle || '',
    hero_description: doc.hero_description || '',
    hero_image: doc.hero_image || null,
    short_description: doc.short_description || '',
    shortDescription: doc.short_description || '',
    full_description: doc.full_description || '',
    fullDescription: doc.full_description || '',
    location: doc.location || '',
    highlights: (doc.highlights || []).map(h => h.item || h).filter(Boolean),
    price: doc.price || null,
    duration: doc.duration || null,
    max_participants: doc.max_participants || null,
    meta_title: doc.meta_title || '',
    meta_description: doc.meta_description || '',
    order: doc.order || 0,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}
function transformLandingPages(docs) {
  if (!docs || docs.length === 0) return { dietary: [], specialty: [], travelType: [], location: [] }

  const result = { dietary: [], specialty: [], travelType: [], location: [] }

  for (const doc of docs) {
    const type = doc.type
    const flat = {
      id: doc.id, slug: doc.slug, status: doc.status || 'published',
      meta_title: doc.meta_title || '', meta_description: doc.meta_description || '',
      hero_title: doc.hero_title || '', hero_subtitle: doc.hero_subtitle || '',
      hero_description: doc.hero_description || '', hero_image: doc.hero_image || '',
    }

    if (type === 'dietary') {
      flat.dietary_name = doc.title
      flat.icon = doc.icon || ''
      flat.color = doc.color || ''
      flat.challenges_heading = doc.challenges_heading || ''
      flat.challenges = (doc.challenges || []).map(c => ({ title: c.title || '', description: c.description || '' }))
      flat.options_heading = doc.options_heading || ''
      flat.options_content = doc.options_content || ''
      flat.tips_heading = doc.tips_heading || ''
      flat.tips_content = doc.tips_content || ''
      flat.tips = (doc.tips || []).map(t => ({ title: t.title || '', content: t.content || '' }))
      flat.safe_dishes_heading = doc.safe_dishes_heading || ''
      flat.safe_dishes = (doc.safe_dishes || []).map(d => ({ name: d.name || '', description: d.description || '' }))
      flat.avoid_dishes_heading = doc.avoid_dishes_heading || ''
      flat.avoid_dishes = (doc.avoid_dishes || []).map(d => ({ name: d.name || '', description: d.description || '' }))
      result.dietary.push(flat)
    } else if (type === 'specialty') {
      flat.specialty_name = doc.title
      flat.icon = doc.icon || ''
      flat.color = doc.color || ''
      flat.intro_heading = doc.intro_heading || ''
      flat.intro_content = doc.intro_content || ''
      flat.features_heading = doc.features_heading || ''
      flat.highlights = (doc.highlights || []).map(h => ({ title: h.title || '', description: h.description || '' }))
      result.specialty.push(flat)
    } else if (type === 'travel_type') {
      flat.travel_type_name = doc.title
      flat.icon = doc.icon || ''
      flat.color = doc.color || ''
      flat.why_perfect_heading = doc.intro_heading || ''
      flat.why_perfect_content = doc.intro_content || ''
      flat.expect_heading = doc.tips_heading || ''
      flat.expect_content = doc.tips_content || ''
      flat.tips_heading = doc.tips_heading || ''
      flat.tips_content = doc.tips_content || ''
      flat.tips = (doc.tips || []).map(t => ({ title: t.title || '', content: t.content || '' }))
      flat.suitable_tours = (doc.suitable_tours || []).map(t => ({ tour_slug: t.tour_slug || '' }))
      flat.key_features = (doc.highlights || []).map(h => ({ title: h.title || '', description: h.description || '' }))
      result.travelType.push(flat)
    } else if (type === 'location') {
      flat.location_name = doc.title
      flat.intro_heading = doc.intro_heading || ''
      flat.intro_content = doc.intro_content || ''
      flat.travel_tips_heading = doc.tips_heading || ''
      flat.travel_tips = (doc.travel_tips || []).map(t => ({ title: t.title || '', content: t.content || '' }))
      result.location.push(flat)
    }
  }

  return result
}

// ─── Private Tours Page transform ───────────────────────────────────────────────
// Converts Payload array fields (with id-keyed sub-objects) to the flat format
// the frontend JSON snapshots and applyTranslation() expect.
function transformPrivateToursPage(doc) {
  if (!doc) return null
  const flat = { ...doc }
  // Simple string arrays: [{item: "..."}] → ["..."]
  if (Array.isArray(doc.on_every_tour)) {
    flat.on_every_tour = doc.on_every_tour.map(r => r.item ?? r).filter(Boolean)
  }
  if (Array.isArray(doc.private_extras)) {
    flat.private_extras = doc.private_extras.map(r => r.item ?? r).filter(Boolean)
  }
  // Object arrays: strip Payload id field
  if (Array.isArray(doc.why_private)) {
    flat.why_private = doc.why_private.map(({ id: _id, ...rest }) => rest)
  }
  if (Array.isArray(doc.audiences)) {
    flat.audiences = doc.audiences.map(({ id: _id, ...rest }) => rest)
  }
  if (Array.isArray(doc.faqs)) {
    flat.faqs = doc.faqs.map(({ id: _id, ...rest }) => rest)
  }
  return flat
}

// ─── Main sync ──────────────────────────────────────────────────────────────────

async function sync() {
  console.log('🔄 Syncing from Payload CMS → Astro JSON snapshots')
  console.log(`   Payload: ${PAYLOAD_URL}`)
  console.log(`   Output:  ${CONTENT_DIR}`)
  console.log(`   ${DRY_RUN ? '🔍 DRY RUN' : '✏️  Writing files'}`)
  if (!PAYLOAD_TOKEN && !DRY_RUN) console.log('   ⚠️  No PAYLOAD_TOKEN — only public read collections will be fetched')
  if (FORCE) console.log('   ⚠️  FORCE mode — safety thresholds disabled')
  console.log('')

  // Pre-flight: check Payload is alive
  const alive = await preflightCheck()
  if (!alive) {
    console.log('\n❌ Payload is not responding. Aborting sync.')
    console.log('   Your existing JSON snapshots are untouched.')
    process.exit(1)
  }

  if (!DRY_RUN) fs.mkdirSync(CONTENT_DIR, { recursive: true })

  // ── Core collections ──
  const coreItems = [
    { slug: 'tours', file: 'tours.json', label: 'Tours', transform: (docs) => (docs || []).map(transformTour) },
    { slug: 'pages', file: 'pages.json', label: 'Pages', transform: (docs) => (docs || []).map(transformPage) },
    { slug: 'stories', file: 'stories.json', label: 'Stories' },
    { slug: 'faqs', file: 'faqs.json', label: 'FAQs' },
    { slug: 'testimonials', file: 'testimonials.json', label: 'Testimonials' },
    { slug: 'media_coverage', file: 'media-coverage.json', label: 'Media Coverage' },
    { slug: 'legal_pages', file: 'legal-pages.json', label: 'Legal Pages' },
    { slug: 'menus', file: 'navigation.json', label: 'Navigation', transform: transformNavigation },
    { slug: 'dietary_options', file: 'dietary-options.json', label: 'Dietary Options' },
    { slug: 'travel_types', file: 'travel-types.json', label: 'Travel Types' },
    { slug: 'specialty_experiences', file: 'specialty-experiences.json', label: 'Specialty Experiences' },
    { slug: 'locations', file: 'locations.json', label: 'Locations' },
    { slug: 'vendors', file: 'vendors.json', label: 'Vendors' },
  ]

  for (const item of coreItems) {
    log(`📦 ${item.label}...`)
    const docs = await fetchCollection(item.slug)
    const data = item.transform ? item.transform(docs) : docs
    if (data !== null && data !== undefined) {
      writeJSON(item.file, data)
    } else {
      writeJSON(item.file, item.transform ? item.transform([]) : [])
      stats.defaulted++
      if (VERBOSE) log(`  ⚙️  Defaulted (empty): ${item.file}`)
    }
  }

  // ── Reviews (derived from testimonials collection) ──
  log('⭐ Reviews...')
  const testimonialsPath = path.join(CONTENT_DIR, 'testimonials.json')
  const reviewsPath = path.join(CONTENT_DIR, 'reviews.json')
  if (fs.existsSync(testimonialsPath)) {
    try {
      const testimonialDocs = JSON.parse(fs.readFileSync(testimonialsPath, 'utf-8'))
      const reviews = (testimonialDocs || []).filter(d => d.workflowStatus === 'published').map(d => ({
        author: d.author_name || '',
        rating: d.rating || 5,
        text: d.review_text || '',
        date: d.date || '',
        location: d.author_location === 'KL' ? 'KL' : d.author_location === 'Penang' ? 'Penang' : 'KL',
      })).filter(r => r.author && r.text)
      fs.writeFileSync(reviewsPath, JSON.stringify(reviews, null, 2) + '\n')
      stats.written++
      log(`  ✅ reviews.json (${reviews.length} reviews)`)
    } catch (e) {
      log(`  ⚠️  reviews.json transform failed: ${e.message}`)
    }
  }

  // ── Singletons ──
  const singletons = [
    { slug: 'home_page', file: 'home-page.json', label: 'Home Page', transform: transformHomePage },
    { slug: 'about_page', file: 'about-page.json', label: 'About Page', transform: transformAboutPage },
    { slug: 'contact_page', file: 'contact-page.json', label: 'Contact Page', transform: transformContactPage },
    { slug: 'site_settings', file: 'site-settings.json', label: 'Site Settings' },
    { slug: 'thank_you_pages', file: 'thank-you-pages.json', label: 'Thank You Pages', asArray: true },
    { slug: 'tour_quiz', file: 'tour-quiz.json', label: 'Tour Quiz' },
    { slug: 'how_it_works_page', file: 'how-it-works-page.json', label: 'How It Works Page' },
    { slug: 'how_to_prepare_page', file: 'how-to-prepare-page.json', label: 'How To Prepare Page' },
    { slug: 'corporate_groups_page', file: 'corporate-groups-page.json', label: 'Corporate Groups Page' },
    { slug: 'private_tours_page', file: 'private-tours-page.json', label: 'Private Tours Page', transform: transformPrivateToursPage },
    { slug: 'track_record_page', file: 'track-record-page.json', label: 'Track Record Page' },
    { slug: 'directions_page', file: 'directions-page.json', label: 'Directions Page' },
  ]

  for (const item of singletons) {
    log(`🏠 ${item.label}...`)
    if (item.asArray) {
      // Collection expected as array
      const docs = await fetchCollection(item.slug)
      if (docs !== null) {
        writeJSON(item.file, docs)
      } else {
        writeJSON(item.file, [])
        stats.defaulted++
      }
    } else {
      const doc = await fetchSingleton(item.slug)
      const data = item.transform ? (doc ? item.transform(doc) : null) : doc
      if (item.handCurated && fs.existsSync(path.join(CONTENT_DIR, item.file)) && !FORCE) {
        log(`  🛡️  HAND-CURATED: ${item.file} — skipping sync. Use --force to overwrite.`)
        stats.preserved++
      } else if (data) {
        // Protect hand-curated JSON from being overwritten by empty block transforms
        let requiredFields = []
        if (item.file === 'home-page.json') requiredFields = HOME_REQUIRED_FIELDS
        else if (item.file === 'about-page.json') requiredFields = ABOUT_REQUIRED_FIELDS

        if (requiredFields.length > 0 && isEffectivelyEmpty(data, requiredFields) && !FORCE) {
          log(`  🛡️  EMPTY BLOCKS: ${item.file} — Payload blocks not populated yet. Preserving existing JSON. Use --force to overwrite.`)
        } else {
          writeJSON(item.file, data)
        }
      } else {
        // No data from Payload — check if we have existing hand-curated content
        const existingPath = path.join(CONTENT_DIR, item.file)
        if (fs.existsSync(existingPath) && !FORCE) {
          log(`  🛡️  PRESERVED: ${item.file} — not in Payload, keeping existing file. Use --force to overwrite.`)
        } else {
          writeJSON(item.file, {})
          stats.defaulted++
          if (VERBOSE) log(`  ⚙️  Defaulted (empty): ${item.file}`)
        }
      }
    }
  }

  // ── Landing Pages (unified → 4 files) ──
  log('🗺️  Landing Pages...')
  const landingDocs = await fetchCollection('landing_pages')
  const { dietary, specialty, travelType, location } = transformLandingPages(landingDocs)
  writeJSON('dietary-landing-pages.json', dietary)
  writeJSON('specialty-landing-pages.json', specialty)
  writeJSON('travel-type-landing-pages.json', travelType)
  writeJSON('location-landing-pages.json', location)

  // ── Currency Rates (live fetch from Frankfurter — free, no API key) ──
  log('💱 Currency rates (Frankfurter)...')
  try {
    const ratesRes = await fetch('https://api.frankfurter.app/latest?from=MYR&to=USD,AUD', {
      signal: AbortSignal.timeout(8000),
    })
    if (ratesRes.ok) {
      const ratesData = await ratesRes.json()
      const usdRate = ratesData?.rates?.USD
      const audRate = ratesData?.rates?.AUD
      if (usdRate && audRate) {
        const settingsPath = path.join(CONTENT_DIR, 'site-settings.json')
        if (fs.existsSync(settingsPath)) {
          const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
          settings.currency_usd_rate = Math.round(usdRate * 10000) / 10000
          settings.currency_aud_rate = Math.round(audRate * 10000) / 10000
          settings.currency_rates_fetched_at = ratesData.date
          if (!DRY_RUN) {
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2))
            stats.written++
          }
          log(`  ✅ MYR → USD ${usdRate.toFixed(4)}, MYR → AUD ${audRate.toFixed(4)} (ECB rate date: ${ratesData.date})`)
        } else {
          log('  ⚠️  site-settings.json not found — currency rates not patched')
        }
      } else {
        log('  ⚠️  Unexpected response shape from Frankfurter — keeping existing rates')
      }
    } else {
      log(`  ⚠️  Frankfurter returned HTTP ${ratesRes.status} — keeping existing rates`)
    }
  } catch (e) {
    log(`  ⚠️  Currency fetch failed (${e.message}) — keeping existing rates`)
  }

  // ── Page-level configs (hand-curated, no Payload collection) ──
  // These files were carefully crafted to work with the frontend.
  // They are preserved by the PROTECTED_FILES mechanism in writeJSON.
  // The sync deliberately does NOT overwrite them with defaults.
  log('📄 Page configs (preserved — hand-curated, no Payload collection):')
  const pageConfigs = [
    'tours-index-page.json', 'join-in-tours-page.json',
    'stories-index-page.json', 'stories-archive-page.json',
    'faq-page.json', 'media-page.json',
  ]
  for (const file of pageConfigs) {
    const existingPath = path.join(CONTENT_DIR, file)
    if (fs.existsSync(existingPath)) {
      const existing = JSON.parse(fs.readFileSync(existingPath, 'utf-8'))
      log(`  📄 ${file}: ${Object.keys(existing).length} fields — preserved`)
    } else {
      log(`  ⚠️  ${file}: not found — create manually or via Payload collection`)
    }
  }

  // ── Orphan / legacy files (empty arrays or defaults) ──
  writeJSON('social-proof.json', [])
  writeJSON('values-stories.json', [])

  // ── Summary ──
  console.log('')
  console.log('═══════════════════════════════════════════')
  console.log('📊 Sync Summary')
  console.log('═══════════════════════════════════════════')
  console.log(`  ✅ Fetched (auth):      ${stats.fetched}`)
  console.log(`  ✅ Fetched (public):    ${stats.unauth}`)
  console.log(`  ⚙️  Defaults:           ${stats.defaulted}`)
  console.log(`  📝 Files written:       ${stats.written}`)
  console.log(`  ❌ Errors:              ${stats.errored}`)
  console.log('═══════════════════════════════════════════')

  // Safety violations check
  if (safetyViolations.length > 0) {
    console.log('')
    console.log('🛡️  Safety Checks — Collections below minimum thresholds:')
    console.log('─────────────────────────────────────────────────────')
    for (const v of safetyViolations) {
      console.log(`  ❌ ${v.file}: ${v.actual} items (min: ${v.expected})`)
    }
    console.log('─────────────────────────────────────────────────────')
    console.log(`  ${safetyViolations.length} collection(s) failed safety check.`)
    console.log(`  Your existing JSON snapshots are preserved (see ${CONTENT_DIR}/.sync-backup/).`)
    if (!FORCE) {
      console.log('')
      console.log('  To override and write anyway, use: npm run sync -- --force')
      process.exit(1)
    } else {
      console.log('  ⚠️  FORCE mode — writing anyway despite safety violations.')
    }
  }

  if (stats.errored > 0) {
    console.log(`\n⚠️  ${stats.errored} error(s) during sync.`)
    process.exit(1)
  }
}

sync().catch(err => {
  console.error('Fatal sync error:', err)
  process.exit(1)
})
