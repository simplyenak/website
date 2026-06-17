#!/usr/bin/env node
/**
 * Import missing collections and fix errors from cleanup-and-import.mjs
 */

import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const CONTENT_DIR = path.resolve(__dirname, '../../frontend/src/data/content')
const IMPORT_DIR = path.resolve(__dirname, 'payload-import')

function loadJson(filename) {
  let filepath = path.join(CONTENT_DIR, filename)
  if (!fs.existsSync(filepath)) {
    filepath = path.join(IMPORT_DIR, filename)
    if (!fs.existsSync(filepath)) {
      console.warn(`  ⚠️ File not found: ${filename}`)
      return null
    }
  }
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'))
  } catch (err) {
    console.warn(`  ⚠️ Failed to parse ${filepath}: ${err.message}`)
    return null
  }
}

async function importUsers(payload) {
  console.log('\n📦 Importing users...')
  const data = loadJson('users.json')
  if (!data) return { imported: 0, errors: 0 }

  let imported = 0
  let errors = 0

  for (const item of data) {
    try {
      const mapped = {
        email: item.email,
        password: item.password || 'ChangeMe2026!',
        fullName: item.fullName || item.full_name || null,
        role: item.role || 'editor',
        department: item.department || null,
      }

      const existing = await payload.find({
        collection: 'users',
        where: { email: { equals: mapped.email } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({ collection: 'users', id: existing.docs[0].id, data: mapped })
        console.log(`  🔄 Updated user: ${mapped.email}`)
      } else {
        await payload.create({ collection: 'users', data: mapped })
        console.log(`  ✅ Created user: ${mapped.email}`)
      }
      imported++
    } catch (err) {
      console.error(`  ❌ Error importing user ${item.email}: ${err.message}`)
      errors++
    }
  }

  return { imported, errors }
}

function htmlToLexical(html) {
  if (!html) return { root: { type: 'root', format: '', indent: 0, version: 1, children: [] } }
  // Split by paragraphs and wrap each in a lexical paragraph node
  const paragraphs = html.split(/<\/?p>/i).filter(s => s.trim().length > 0)
  const children = paragraphs.map(text => ({
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    children: [{ text: text.replace(/<[^>]+>/g, '').trim(), type: 'text', version: 1 }]
  }))
  return { root: { type: 'root', format: '', indent: 0, version: 1, children } }
}

async function importStories(payload) {
  console.log('\n📦 Importing stories...')
  const data = loadJson('stories.json')
  if (!data) return { imported: 0, errors: 0 }

  // Find first admin user for author relationship
  const users = await payload.find({ collection: 'users', limit: 1 })
  const defaultAuthor = users.docs[0]?.id || null
  if (!defaultAuthor) {
    console.warn('  ⚠️ No users found — skipping stories (author is required)')
    return { imported: 0, errors: 0 }
  }

  let imported = 0
  let errors = 0

  for (const item of data) {
    try {
      const mapped = {
        title: item.title,
        slug: item.slug,
        author: defaultAuthor,
        excerpt: item.excerpt || null,
        content: htmlToLexical(item.content),
        publishedDate: item.publishedDate || item.published_date || null,
        status: item.status || 'published',
        workflowStatus: item.workflowStatus || item.workflow_status || 'published',
        meta: {
          title: item.meta?.title || null,
          description: item.meta?.description || null,
        },
      }

      const existing = await payload.find({
        collection: 'stories',
        where: { slug: { equals: mapped.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({ collection: 'stories', id: existing.docs[0].id, data: mapped })
        console.log(`  🔄 Updated story: ${mapped.slug}`)
      } else {
        await payload.create({ collection: 'stories', data: mapped })
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

async function importTestimonials(payload) {
  console.log('\n📦 Importing testimonials...')
  const data = loadJson('testimonials.json')
  if (!data) return { imported: 0, errors: 0 }

  let imported = 0
  let errors = 0

  for (const item of data) {
    try {
      const mapped = {
        author_name: item.author_name,
        author_location: item.author_location || null,
        rating: item.rating ? Number(item.rating) : 5,
        review_text: item.review_text || null,
        review_title: item.review_title || null,
        author_photo: item.author_photo || null,
        date: item.date || null,
        platform: item.platform || 'google',
        visibility: item.visibility || 'public',
        status: 'published',
      }

      const existing = await payload.find({
        collection: 'testimonials',
        where: { author_name: { equals: mapped.author_name } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({ collection: 'testimonials', id: existing.docs[0].id, data: mapped })
        console.log(`  🔄 Updated testimonial: ${mapped.author_name}`)
      } else {
        await payload.create({ collection: 'testimonials', data: mapped })
        console.log(`  ✅ Created testimonial: ${mapped.author_name}`)
      }
      imported++
    } catch (err) {
      console.error(`  ❌ Error importing testimonial: ${err.message}`)
      errors++
    }
  }

  return { imported, errors }
}

const FAQ_CATEGORY_MAP = {
  'booking': 'booking',
  'private_tours': 'private_tours',
  'general': 'general',
  'dietary': 'dietary',
  'practical': 'general',
  'food': 'dietary',
  'accessibility': 'general',
  'tour': 'general',
  'day': 'general',
}

async function importFAQs(payload) {
  console.log('\n📦 Importing FAQs (fixing categories)...')
  const data = loadJson('faqs.json')
  if (!data) return { imported: 0, errors: 0 }

  let imported = 0
  let errors = 0

  for (const item of data) {
    try {
      const mapped = {
        question: item.question,
        answer: item.answer || null,
        category: FAQ_CATEGORY_MAP[item.category] || 'general',
        sort_order: item.sort_order || item.sortOrder || 0,
        page_visibility: item.page_visibility || ['all'],
        status: 'published',
      }

      const existing = await payload.find({
        collection: 'faqs',
        where: { question: { equals: mapped.question } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({ collection: 'faqs', id: existing.docs[0].id, data: mapped })
        console.log(`  🔄 Updated FAQ: ${mapped.question.slice(0, 50)}...`)
      } else {
        await payload.create({ collection: 'faqs', data: mapped })
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

async function importSingleton(payload, slug, filename, mapper = null) {
  console.log(`\n📦 Importing ${slug}...`)
  const data = loadJson(filename)
  if (!data) return { imported: 0, errors: 0 }

  const doc = mapper ? mapper(Array.isArray(data) ? data[0] : data) : (Array.isArray(data) ? data[0] : data)

  try {
    const existing = await payload.find({
      collection: slug,
      limit: 1,
    })

    if (existing.docs.length > 0) {
      await payload.update({ collection: slug, id: existing.docs[0].id, data: doc })
      console.log(`  🔄 Updated ${slug}`)
    } else {
      await payload.create({ collection: slug, data: doc })
      console.log(`  ✅ Created ${slug}`)
    }
    return { imported: 1, errors: 0 }
  } catch (err) {
    console.error(`  ❌ Error importing ${slug}: ${err.message}`)
    return { imported: 0, errors: 1 }
  }
}

async function importCollectionSimple(payload, slug, filename, mapper = null) {
  console.log(`\n📦 Importing ${slug}...`)
  const data = loadJson(filename)
  if (!data) return { imported: 0, errors: 0 }

  const docs = Array.isArray(data) ? data : (data.pages || [data])
  let imported = 0
  let errors = 0

  for (const item of docs) {
    try {
      const mapped = mapper ? mapper(item) : item
      if (!mapped) continue

      const slugField = mapped.slug || mapped.headline || mapped.title || mapped.name
      const existing = await payload.find({
        collection: slug,
        where: slugField ? { slug: { equals: slugField } } : {},
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({ collection: slug, id: existing.docs[0].id, data: mapped })
        console.log(`  🔄 Updated ${slug}: ${slugField}`)
      } else {
        await payload.create({ collection: slug, data: mapped })
        console.log(`  ✅ Created ${slug}: ${slugField}`)
      }
      imported++
    } catch (err) {
      console.error(`  ❌ Error importing ${slug}: ${err.message}`)
      errors++
    }
  }

  return { imported, errors }
}

async function main() {
  console.log('🚀 Import Missing Content')
  console.log('==========================\n')

  const payload = await getPayload({ config })
  console.log('✅ Payload initialized\n')

  const results = {}

  // 1. Users (needed for stories author)
  results.users = await importUsers(payload)

  // 2. Fix previously failed collections
  results.stories = await importStories(payload)
  results.testimonials = await importTestimonials(payload)
  results.faqs = await importFAQs(payload)

  // 3. Singleton pages
  results.about_page = await importSingleton(payload, 'about_page', 'about-page.json')
  results.contact_page = await importSingleton(payload, 'contact_page', 'contact-page.json')
  results.home_page = await importSingleton(payload, 'home_page', 'home-page.json')
  results.site_settings = await importSingleton(payload, 'site_settings', 'site-settings.json', data => {
    const copy = { ...data }
    delete copy.og_image
    delete copy.hero_image
    delete copy.guide_image
    delete copy.guide_image_alt
    return copy
  })
  results.how_it_works_page = await importSingleton(payload, 'how_it_works_page', 'how-it-works-page.json')
  results.how_to_prepare_page = await importSingleton(payload, 'how_to_prepare_page', 'how-to-prepare-page.json')
  results.corporate_groups_page = await importSingleton(payload, 'corporate_groups_page', 'corporate-groups-page.json')
  results.track_record_page = await importSingleton(payload, 'track_record_page', 'track-record-page.json')
  results.private_tours_page = await importSingleton(payload, 'private_tours_page', 'private-tours-page.json', data => {
    const copy = { ...data }
    if (Array.isArray(copy.on_every_tour)) {
      copy.on_every_tour = copy.on_every_tour.map(item => typeof item === 'string' ? { item } : item)
    }
    if (Array.isArray(copy.private_extras)) {
      copy.private_extras = copy.private_extras.map(item => typeof item === 'string' ? { item } : item)
    }
    return copy
  })
  results.directions_page = await importSingleton(payload, 'directions_page', 'directions-page.json')

  // 4. Collections
  results.legal_pages = await importCollectionSimple(payload, 'legal_pages', 'legal-pages.json', item => {
    const copy = { ...item }
    if (Array.isArray(copy.content)) {
      copy.content = { root: { type: 'root', children: copy.content, version: 1 } }
    }
    return copy
  })
  results.thank_you_pages = await importCollectionSimple(payload, 'thank_you_pages', 'thank-you-pages.json')
  results.tour_quiz = await importSingleton(payload, 'tour_quiz', 'tour-quiz.json')

  // Summary
  console.log('\n═══════════════════════════════════════════')
  console.log('📊 Import Summary')
  console.log('═══════════════════════════════════════════')
  for (const [key, val] of Object.entries(results)) {
    console.log(`  ${val.errors > 0 ? '⚠️' : '✅'} ${key}: ${val.imported} imported, ${val.errors} errors`)
  }
  const totalErrors = Object.values(results).reduce((sum, r) => sum + (r.errors || 0), 0)
  console.log('═══════════════════════════════════════════')
  console.log(`  ❌ Total errors: ${totalErrors}`)
  console.log('═══════════════════════════════════════════')

  process.exit(totalErrors > 0 ? 1 : 0)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
