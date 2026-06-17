#!/usr/bin/env node
/**
 * Sync Payload CMS → Astro JSON snapshots via programmatic API
 * Uses getPayload() directly (bypasses REST/GraphQL)
 */

import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envPath = path.resolve(__dirname, '..', '.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const match = envContent.match(/^PAYLOAD_SECRET=(.+)$/m)
  if (match) process.env.PAYLOAD_SECRET = match[1].trim()
  const dbMatch = envContent.match(/^DATABASE_URL=(.+)$/m)
  if (dbMatch) process.env.DATABASE_URL = dbMatch[1].trim()
}

const CONTENT_DIR = path.resolve(__dirname, '../../frontend/src/data/content')

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function writeSnapshot(name, data, { isCollection = false } = {}) {
  const filepath = path.join(CONTENT_DIR, `${name}.json`)
  ensureDir(CONTENT_DIR)
  const output = isCollection ? data.docs : data
  fs.writeFileSync(filepath, JSON.stringify(output, null, 2), 'utf8')
  console.log(`  💾 ${name}.json (${JSON.stringify(output).length} bytes, ${isCollection ? data.docs.length + ' items' : 'singleton'})`)
}

function cleanDoc(doc) {
  const { id, collection, createdAt, updatedAt, _status, ...rest } = doc
  return rest
}

async function main() {
  const payload = await getPayload({ config })
  console.log('✅ Payload initialized\n')

  let stats = { written: 0, skipped: 0, errors: 0 }

  // ─── TOURS ───
  console.log('📦 Tours...')
  try {
    const tours = await payload.find({ collection: 'tours', limit: 100, depth: 1, sort: 'name' })
    if (tours.docs.length > 0) {
      writeSnapshot('tours', { docs: tours.docs.map(cleanDoc), totalDocs: tours.totalDocs }, { isCollection: true })
      stats.written++
    } else {
      console.log('  ⚠️ No tours found')
      stats.skipped++
    }
  } catch (err) {
    console.error(`  ❌ ${err.message}`)
    stats.errors++
  }

  // ─── STORIES ───
  console.log('\n📖 Stories...')
  try {
    const stories = await payload.find({ collection: 'stories', limit: 100, depth: 1, sort: 'slug' })
    if (stories.docs.length > 0) {
      writeSnapshot('stories', { docs: stories.docs.map(cleanDoc), totalDocs: stories.totalDocs }, { isCollection: true })
      stats.written++
    } else {
      console.log('  ⚠️ No stories found')
      stats.skipped++
    }
  } catch (err) {
    console.error(`  ❌ ${err.message}`)
    stats.errors++
  }

  // ─── FAQs ───
  console.log('\n❓ FAQs...')
  try {
    const faqs = await payload.find({ collection: 'faqs', limit: 100, depth: 1, sort: 'question' })
    if (faqs.docs.length > 0) {
      writeSnapshot('faqs', { docs: faqs.docs.map(cleanDoc), totalDocs: faqs.totalDocs }, { isCollection: true })
      stats.written++
    } else {
      console.log('  ⚠️ No FAQs found')
      stats.skipped++
    }
  } catch (err) {
    console.error(`  ❌ ${err.message}`)
    stats.errors++
  }

  // ─── TESTIMONIALS ───
  console.log('\n⭐ Testimonials...')
  try {
    const testimonials = await payload.find({ collection: 'testimonials', limit: 100, depth: 1, sort: 'name' })
    if (testimonials.docs.length > 0) {
      writeSnapshot('testimonials', { docs: testimonials.docs.map(cleanDoc), totalDocs: testimonials.totalDocs }, { isCollection: true })
      stats.written++
    } else {
      console.log('  ⚠️ No testimonials found')
      stats.skipped++
    }
  } catch (err) {
    console.error(`  ❌ ${err.message}`)
    stats.errors++
  }

  // ─── SITE SETTINGS (singleton) ───
  console.log('\n⚙️  Site Settings...')
  try {
    const settings = await payload.find({ collection: 'site_settings', limit: 1, depth: 1 })
    if (settings.docs.length > 0) {
      writeSnapshot('site-settings', cleanDoc(settings.docs[0]))
      stats.written++
    } else {
      console.log('  ⚠️ No site settings found')
      stats.skipped++
    }
  } catch (err) {
    console.error(`  ❌ ${err.message}`)
    stats.errors++
  }

  // ─── HOME PAGE (singleton) ───
  console.log('\n🏠 Home Page...')
  try {
    const home = await payload.find({ collection: 'home_page', limit: 1, depth: 1 })
    if (home.docs.length > 0) {
      writeSnapshot('home-page', cleanDoc(home.docs[0]))
      stats.written++
    } else {
      console.log('  ⚠️ No home page found')
      stats.skipped++
    }
  } catch (err) {
    console.error(`  ❌ ${err.message}`)
    stats.errors++
  }

  // ─── ABOUT PAGE (singleton) ───
  console.log('\n📄 About Page...')
  try {
    const about = await payload.find({ collection: 'about_page', limit: 1, depth: 1 })
    if (about.docs.length > 0) {
      writeSnapshot('about-page', cleanDoc(about.docs[0]))
      stats.written++
    } else {
      console.log('  ⚠️ No about page found')
      stats.skipped++
    }
  } catch (err) {
    console.error(`  ❌ ${err.message}`)
    stats.errors++
  }

  // ─── CONTACT PAGE (singleton) ───
  console.log('\n📞 Contact Page...')
  try {
    const contact = await payload.find({ collection: 'contact_page', limit: 1, depth: 1 })
    if (contact.docs.length > 0) {
      writeSnapshot('contact-page', cleanDoc(contact.docs[0]))
      stats.written++
    } else {
      console.log('  ⚠️ No contact page found')
      stats.skipped++
    }
  } catch (err) {
    console.error(`  ❌ ${err.message}`)
    stats.errors++
  }

  // ─── PAGES ───
  console.log('\n📄 Pages...')
  try {
    const pages = await payload.find({ collection: 'pages', limit: 100, depth: 1, sort: 'order' })
    if (pages.docs.length > 0) {
      writeSnapshot('pages', { docs: pages.docs.map(cleanDoc), totalDocs: pages.totalDocs }, { isCollection: true })
      stats.written++
    } else {
      console.log('  ⚠️ No pages found')
      stats.skipped++
    }
  } catch (err) {
    console.error(`  ❌ ${err.message}`)
    stats.errors++
  }

  // ─── MEDIA ───
  console.log('\n🖼️  Media...')
  try {
    const media = await payload.find({ collection: 'media', limit: 100, depth: 0, sort: 'updatedAt' })
    if (media.docs.length > 0) {
      writeSnapshot('media', { docs: media.docs.map(cleanDoc), totalDocs: media.totalDocs }, { isCollection: true })
      stats.written++
    } else {
      console.log('  ⚠️ No media found')
      stats.skipped++
    }
  } catch (err) {
    console.error(`  ❌ ${err.message}`)
    stats.errors++
  }

  // ─── SUMMARY ───
  console.log('\n══════════════════════════════════')
  console.log(`📊 Sync complete: ${stats.written} written, ${stats.skipped} skipped, ${stats.errors} errors`)
  console.log('══════════════════════════════════')
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })