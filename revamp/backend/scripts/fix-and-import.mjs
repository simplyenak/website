#!/usr/bin/env node
/**
 * Fix story statuses (draft → published) and import missing singletons
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

function loadJson(filename) {
  const filepath = path.join(CONTENT_DIR, filename)
  if (!fs.existsSync(filepath)) { console.warn(`Not found: ${filepath}`); return null }
  try { return JSON.parse(fs.readFileSync(filepath, 'utf8')) }
  catch (err) { console.warn(`Parse failed ${filepath}: ${err.message}`); return null }
}

function htmlToLexical(html) {
  if (!html) return null
  if (typeof html !== 'string') return null
  const blocks = html
    .replace(/<br\s*\/?>/gi, '\n')
    .split(/(?:<\/?(?:p|h[1-6]|li|blockquote|div)[^>]*>)/i)
    .map(s => s.trim())
    .filter(s => s.length > 0)
  const children = blocks.map(block => {
    if (/<li/i.test(block)) {
      const clean = block.replace(/<\/?li[^>]*>/gi, '').trim()
      return { type: 'list_item', format: '', indent: 0, version: 1, direction: null, children: [{ type: 'text', text: clean, format: 0, version: 1, mode: 'normal', style: '', detail: 0 }] }
    }
    const hMatch = block.match(/<h([1-6])[^>]*>(.*?)<\/h\1>/is)
    if (hMatch) {
      const text = hMatch[2].replace(/<[^>]+>/g, '').trim()
      return { type: 'paragraph', format: '', indent: 0, version: 1, direction: null, children: [{ type: 'text', text, format: 0, version: 1, mode: 'normal', style: `h${hMatch[1]}`, detail: 0 }] }
    }
    const clean = block.replace(/<[^>]+>/g, '').trim()
    if (!clean) return null
    return { type: 'paragraph', format: '', indent: 0, version: 1, direction: null, children: [{ type: 'text', text: clean, format: 0, version: 1, mode: 'normal', style: '', detail: 0 }] }
  }).filter(Boolean)
  return { root: { type: 'root', format: '', indent: 0, version: 1, direction: null, children } }
}

async function main() {
  const payload = await getPayload({ config })
  console.log('✅ Payload initialized\n')

  // ─── 1. FIX STORY STATUSES ───
  console.log('📖 Fixing story statuses (draft → published)...')
  const stories = await payload.find({ collection: 'stories', limit: 100, sort: 'slug' })
  let fixed = 0
  for (const s of stories.docs) {
    if (s.status === 'draft' || s.workflowStatus === 'draft') {
      try {
        await payload.update({
          collection: 'stories',
          id: s.id,
          data: { status: 'published', workflowStatus: 'published' }
        })
        fixed++
        console.log(`  ✏️ ${s.slug}: published`)
      } catch (err) {
        console.error(`  ❌ ${s.slug}: ${err.message}`)
      }
    }
  }
  console.log(`  Fixed ${fixed} stories\n`)

  // ─── 2. IMPORT MISSING SINGLETONS ───
  // Get user for author fields
  const users = await payload.find({ collection: 'users', limit: 1 })
  const adminUser = users.docs[0]

  // Home Page
  console.log('🏠 Importing home_page singleton...')
  const homeData = loadJson('home-page.json')
  if (homeData) {
    try {
      const existing = await payload.find({ collection: 'home_page', limit: 1 })
      const data = {
        heroSection: homeData.heroSection || homeData.hero_section || null,
        manifestoSection: homeData.manifestoSection || homeData.manifesto_section || null,
        pillarsSection: homeData.pillarsSection || homeData.pillars_section || null,
        vendorsSection: homeData.vendorsSection || homeData.vendors_section || null,
        segmentsSection: homeData.segmentsSection || homeData.segments_section || null,
        aboutSection: homeData.aboutSection || homeData.about_section || null,
        expectSection: homeData.expectSection || homeData.expect_section || null,
        ctaSection: homeData.ctaSection || homeData.cta_section || null,
        testimonialPlatformBadges: homeData.testimonialPlatformBadges || homeData.testimonial_platform_badges || null,
        faqs: homeData.faqs || null,
        whyUsSection: homeData.whyUsSection || homeData.why_us_section || null,
        bookingGuaranteesSection: homeData.bookingGuaranteesSection || homeData.booking_guarantees_section || null,
        meta_title: homeData.meta_title || null,
        meta_description: homeData.meta_description || null,
      }
      if (existing.docs.length > 0) {
        await payload.update({ collection: 'home_page', id: existing.docs[0].id, data })
        console.log('  🔄 Updated home_page')
      } else {
        await payload.create({ collection: 'home_page', data })
        console.log('  ✅ Created home_page')
      }
    } catch (err) {
      console.error(`  ❌ home_page: ${err.message}`)
    }
  }

  // Site Settings
  console.log('\n⚙️ Importing site_settings singleton...')
  const settingsData = loadJson('site-settings.json')
  if (settingsData) {
    try {
      const existing = await payload.find({ collection: 'site_settings', limit: 1 })
      const data = {
        siteName: settingsData.siteName || settingsData.site_name || 'Simply Enak',
        tagline: settingsData.tagline || null,
        // Copy all fields from JSON, removing internal fields
        ...Object.fromEntries(
          Object.entries(settingsData).filter(([k]) => !['id', 'createdAt', 'updatedAt', '_status', 'collection'].includes(k))
        )
      }
      if (existing.docs.length > 0) {
        await payload.update({ collection: 'site_settings', id: existing.docs[0].id, data })
        console.log('  🔄 Updated site_settings')
      } else {
        await payload.create({ collection: 'site_settings', data })
        console.log('  ✅ Created site_settings')
      }
    } catch (err) {
      console.error(`  ❌ site_settings: ${err.message}`)
    }
  }

  // About Page
  console.log('\n📄 Importing about_page singleton...')
  const aboutData = loadJson('about-page.json')
  if (aboutData) {
    try {
      const existing = await payload.find({ collection: 'about_page', limit: 1 })
      const data = {
        title: aboutData.title || null,
        slug: aboutData.slug || 'about',
        heroTitle: aboutData.heroTitle || aboutData.hero_title || null,
        heroSubtitle: aboutData.heroSubtitle || aboutData.hero_subtitle || null,
        heroDescription: aboutData.heroDescription || aboutData.hero_description || null,
        heroImage: null,
        shortDescription: aboutData.shortDescription || aboutData.short_description || null,
        fullDescription: aboutData.fullDescription || aboutData.full_description || null,
        highlights: (aboutData.highlights || []).map(h => typeof h === 'string' ? { item: h } : h),
        meta: {
          title: aboutData.meta_title || aboutData.meta?.title || null,
          description: aboutData.meta_description || aboutData.meta?.description || null,
        },
        status: 'published',
      }
      if (existing.docs.length > 0) {
        await payload.update({ collection: 'about_page', id: existing.docs[0].id, data })
        console.log('  🔄 Updated about_page')
      } else {
        await payload.create({ collection: 'about_page', data })
        console.log('  ✅ Created about_page')
      }
    } catch (err) {
      console.error(`  ❌ about_page: ${err.message}`)
    }
  }

  // Contact Page
  console.log('\n📄 Importing contact_page singleton...')
  const contactData = loadJson('contact-page.json')
  if (contactData) {
    try {
      const existing = await payload.find({ collection: 'contact_page', limit: 1 })
      const data = {
        title: contactData.title || null,
        slug: contactData.slug || 'contact',
        heroTitle: contactData.heroTitle || contactData.hero_title || null,
        heroSubtitle: contactData.heroSubtitle || contactData.hero_subtitle || null,
        heroDescription: contactData.heroDescription || contactData.hero_description || null,
        heroImage: null,
        shortDescription: contactData.shortDescription || contactData.short_description || null,
        fullDescription: contactData.fullDescription || contactData.full_description || null,
        highlights: (contactData.highlights || []).map(h => typeof h === 'string' ? { item: h } : h),
        meta: {
          title: contactData.meta_title || contactData.meta?.title || null,
          description: contactData.meta_description || contactData.meta?.description || null,
        },
        status: 'published',
      }
      if (existing.docs.length > 0) {
        await payload.update({ collection: 'contact_page', id: existing.docs[0].id, data })
        console.log('  🔄 Updated contact_page')
      } else {
        await payload.create({ collection: 'contact_page', data })
        console.log('  ✅ Created contact_page')
      }
    } catch (err) {
      console.error(`  ❌ contact_page: ${err.message}`)
    }
  }

  // ─── 3. VERIFY ───
  console.log('\n══════════════════════════════════════')
  console.log('📊 Verification')
  console.log('══════════════════════════════════════')

  const verify = {
    home_page: await payload.find({ collection: 'home_page', limit: 1 }),
    site_settings: await payload.find({ collection: 'site_settings', limit: 1 }),
    about_page: await payload.find({ collection: 'about_page', limit: 1 }),
    contact_page: await payload.find({ collection: 'contact_page', limit: 1 }),
    tours: await payload.find({ collection: 'tours', limit: 1, where: { status: { equals: 'published' } } }),
    stories: await payload.find({ collection: 'stories', limit: 1, where: { status: { equals: 'published' } } }),
  }

  for (const [name, result] of Object.entries(verify)) {
    console.log(`  ${result.totalDocs > 0 ? '✅' : '❌'} ${name}: ${result.totalDocs} doc(s)`)
  }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })