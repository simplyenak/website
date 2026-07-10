import { getPayload } from 'payload'
import config from '../src/payload.config.js'
import fs from 'fs'
import path from 'path'

const CONTENT_DIR = path.resolve(process.cwd(), '../frontend/src/data/content')

function loadJson(filename) {
  const filepath = path.join(CONTENT_DIR, filename)
  if (!fs.existsSync(filepath)) {
    console.warn(`  ⚠️ File not found: ${filepath}`)
    return null
  }
  return JSON.parse(fs.readFileSync(filepath, 'utf8'))
}

function toSnakeCase(obj) {
  if (Array.isArray(obj)) return obj.map(toSnakeCase)
  if (obj && typeof obj === 'object') {
    const result = {}
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
      result[snakeKey] = toSnakeCase(value)
    }
    return result
  }
  return obj
}

function mapTour(data) {
  // Use snake_case fields preferentially (they match the DB schema)
  const t = data._status ? data : toSnakeCase(data)

  return {
    name: t.name,
    slug: t.slug,
    tagline: t.tagline || null,
    short_description: t.short_description || null,
    full_description: t.full_description || null,
    price: t.price ? Number(t.price) : null,
    currency: t.currency || 'MYR',
    duration: t.duration || null,
    duration_minutes: t.duration_minutes ? Number(t.duration_minutes) : null,
    location: t.location || null,
    meeting_point: t.meeting_point || null,
    max_participants: t.max_participants ? Number(t.max_participants) : null,
    min_participants: t.min_participants ? Number(t.min_participants) : 2,
    tailored_available: t.tailored_available ?? false,
    tailored_notes: t.tailored_notes || null,
    hero_image: t.hero_image || null,
    booking_url: t.booking_url || null,
    instant_confirmation: t.instant_confirmation ?? true,
    scheduled_publish: t.scheduled_publish || null,
    featured: t.featured ?? false,
    popular: t.popular ?? false,
    new: t.new ?? false,
    published_at: t.published_at || null,
    status: t.status || 'draft',
    workflow_status: t.workflow_status || 'draft',
    meta_title: t.meta?.title || null,
    meta_description: t.meta?.description || null,
    is_bookable: t.is_bookable ?? false,
    ticketing_hub_id: t.ticketing_hub_id || null,
    tour_frequency: t.tour_frequency || null,
    dishes_count: t.dishes_count ? Number(t.dishes_count) : null,
    difficulty: t.difficulty || 'easy',
    walking_distance: t.walking_distance || null,
    directions_html: t.directions_html || null,
    promo_video_url: t.promo_video_url || null,
    // Arrays
    highlights: (t.highlights || []).map(h =>
      typeof h === 'string' ? { highlight: h } : h
    ),
    whats_included: (t.whats_included || []).map(i =>
      typeof i === 'string' ? { item: i } : i
    ),
    whats_excluded: (t.whats_excluded || []).map(i =>
      typeof i === 'string' ? { item: i } : i
    ),
    gallery_images: (t.gallery_images || []).map((img, idx) => ({
      image: typeof img === 'string' ? img : img?.url || img?.src || null,
      _order: idx,
    })).filter(g => g.image),
    // Keep existing ID if present
    id: t.id || undefined,
  }
}

async function importTours(payload) {
  console.log('\n📦 Importing tours...')
  const data = loadJson('tours.json')
  if (!data) return { imported: 0, errors: 0 }

  let imported = 0
  let errors = 0

  for (const item of data) {
    try {
      const mapped = mapTour(item)
      const existing = await payload.find({
        collection: 'tours',
        where: { slug: { equals: mapped.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'tours',
          id: existing.docs[0].id,
          data: mapped,
        })
        console.log(`  🔄 Updated tour: ${mapped.slug}`)
      } else {
        await payload.create({
          collection: 'tours',
          data: mapped,
        })
        console.log(`  ✅ Created tour: ${mapped.slug}`)
      }
      imported++
    } catch (err) {
      console.error(`  ❌ Error importing tour ${item.slug}: ${err.message}`)
      errors++
    }
  }

  return { imported, errors }
}

async function importFAQs(payload) {
  console.log('\n📦 Importing FAQs...')
  const data = loadJson('faqs.json')
  if (!data) return { imported: 0, errors: 0 }

  let imported = 0
  let errors = 0

  for (const item of data) {
    try {
      const mapped = {
        question: item.question,
        answer: item.answer,
        category: item.category || 'general',
        sort_order: item.sort_order || item.sortOrder || 0,
        status: item.status || 'published',
      }

      const existing = await payload.find({
        collection: 'faqs',
        where: { question: { equals: mapped.question } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'faqs',
          id: existing.docs[0].id,
          data: mapped,
        })
        console.log(`  🔄 Updated FAQ: ${mapped.question.slice(0, 50)}...`)
      } else {
        await payload.create({
          collection: 'faqs',
          data: mapped,
        })
        console.log(`  ✅ Created FAQ: ${mapped.question.slice(0, 50)}...`)
      }
      imported++
    } catch (err) {
      console.error(`  ❌ Error importing FAQ: ${err.message}`)
      errors++
    }
  }

  return { imported, errors }
}

async function importMediaCoverage(payload) {
  console.log('\n📦 Importing media coverage...')
  const data = loadJson('media-coverage.json')
  if (!data) return { imported: 0, errors: 0 }

  let imported = 0
  let errors = 0

  for (const item of data) {
    try {
      const mapped = {
        outlet: item.outlet || item.name,
        category: item.category || 'print',
        year: item.year ? Number(item.year) : null,
        url: item.url || null,
        logo_domain: item.logo_domain || null,
        status: item.status || 'published',
      }

      const existing = await payload.find({
        collection: 'media_coverage',
        where: { outlet: { equals: mapped.outlet } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'media_coverage',
          id: existing.docs[0].id,
          data: mapped,
        })
        console.log(`  🔄 Updated media: ${mapped.outlet}`)
      } else {
        await payload.create({
          collection: 'media_coverage',
          data: mapped,
        })
        console.log(`  ✅ Created media: ${mapped.outlet}`)
      }
      imported++
    } catch (err) {
      console.error(`  ❌ Error importing media: ${err.message}`)
      errors++
    }
  }

  return { imported, errors }
}

async function importTestimonials(payload) {
  console.log('\n📦 Importing testimonials...')
  const data = loadJson('testimonials.json')
  if (!data) return { imported: 0, errors: 0 }

  let imported = 0
  let errors = 0

  for (const item of data) {
    try {
      const mapped = {
        name: item.name,
        text: item.text || item.review,
        rating: item.rating ? Number(item.rating) : 5,
        source: item.source || 'google',
        status: item.status || 'published',
      }

      const existing = await payload.find({
        collection: 'testimonials',
        where: { name: { equals: mapped.name } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'testimonials',
          id: existing.docs[0].id,
          data: mapped,
        })
        console.log(`  🔄 Updated testimonial: ${mapped.name}`)
      } else {
        await payload.create({
          collection: 'testimonials',
          data: mapped,
        })
        console.log(`  ✅ Created testimonial: ${mapped.name}`)
      }
      imported++
    } catch (err) {
      console.error(`  ❌ Error importing testimonial: ${err.message}`)
      errors++
    }
  }

  return { imported, errors }
}

async function importStories(payload) {
  console.log('\n📦 Importing stories...')
  const data = loadJson('stories.json')
  if (!data) return { imported: 0, errors: 0 }

  let imported = 0
  let errors = 0

  for (const item of data) {
    try {
      const mapped = {
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt || null,
        content: item.content || null,
        status: item.status || 'published',
      }

      const existing = await payload.find({
        collection: 'stories',
        where: { slug: { equals: mapped.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'stories',
          id: existing.docs[0].id,
          data: mapped,
        })
        console.log(`  🔄 Updated story: ${mapped.slug}`)
      } else {
        await payload.create({
          collection: 'stories',
          data: mapped,
        })
        console.log(`  ✅ Created story: ${mapped.slug}`)
      }
      imported++
    } catch (err) {
      console.error(`  ❌ Error importing story ${item.slug}: ${err.message}`)
      errors++
    }
  }

  return { imported, errors }
}

async function main() {
  console.log('🚀 Content Migration Script')
  console.log('===========================\n')

  const payload = await getPayload({ config })
  console.log('✅ Payload initialized\n')

  const results = {}

  results.tours = await importTours(payload)
  results.faqs = await importFAQs(payload)
  results.media_coverage = await importMediaCoverage(payload)
  results.testimonials = await importTestimonials(payload)
  results.stories = await importStories(payload)

  console.log('\n═══════════════════════════════════════════')
  console.log('📊 Import Summary')
  console.log('═══════════════════════════════════════════')
  let totalImported = 0
  let totalErrors = 0
  for (const [collection, { imported, errors }] of Object.entries(results)) {
    console.log(`  ${collection}: ${imported} imported/updated, ${errors} errors`)
    totalImported += imported
    totalErrors += errors
  }
  console.log('═══════════════════════════════════════════')
  console.log(`  ✅ Total imported/updated: ${totalImported}`)
  console.log(`  ❌ Total errors:           ${totalErrors}`)
  console.log('═══════════════════════════════════════════')

  process.exit(totalErrors > 0 ? 1 : 0)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
