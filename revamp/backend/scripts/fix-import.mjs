#!/usr/bin/env node
/**
 * Fix import for collections that failed in cleanup-and-import.mjs
 * - Stories: HTML content → localized richText
 * - FAQs: answer richText + localized wrapping
 * - Testimonials: fix query field from `name` to `author_name`
 */

import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const CONTENT_DIR = path.resolve(__dirname, '../../frontend/src/data/content')

// Load env
const envPath = path.resolve(__dirname, '..', '.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const match = envContent.match(/^PAYLOAD_SECRET=(.+)$/m)
  if (match) process.env.PAYLOAD_SECRET = match[1].trim()
  const dbMatch = envContent.match(/^DATABASE_URL=(.+)$/m)
  if (dbMatch) process.env.DATABASE_URL = dbMatch[1].trim()
}

function loadJson(filename) {
  const filepath = path.join(CONTENT_DIR, filename)
  if (!fs.existsSync(filepath)) { console.warn(`File not found: ${filepath}`); return null }
  try { return JSON.parse(fs.readFileSync(filepath, 'utf8')) }
  catch (err) { console.warn(`Failed to parse ${filepath}: ${err.message}`); return null }
}

// Convert HTML to simple richText lexical format, wrapped for localization
function htmlToLocalizedRichText(html) {
  if (!html) return { en: { root: { type: 'root', format: '', indent: 0, version: 1, direction: null, children: [] } } }
  if (typeof html !== 'string') return { en: { root: { type: 'root', format: '', indent: 0, version: 1, direction: null, children: [{ type: 'paragraph', format: '', indent: 0, version: 1, direction: null, children: [{ type: 'text', text: String(html), format: 0, version: 1, mode: 'normal', style: '', detail: 0 }] }] } } }

  // Split by block-level tags
  const blocks = html
    .replace(/<br\s*\/?>/gi, '\n')
    .split(/(?:<\/?(?:p|h[1-6]|li|blockquote|div)[^>]*>)/i)
    .map(s => s.trim())
    .filter(s => s.length > 0)

  const children = blocks.map(block => {
    // Check for list items
    if (/<li/i.test(block)) {
      const clean = block.replace(/<\/?li[^>]*>/gi, '').trim()
      return { type: 'list_item', format: '', indent: 0, version: 1, direction: null, children: [{ type: 'text', text: clean, format: 0, version: 1, mode: 'normal', style: '', detail: 0 }] }
    }
    // Check for headings
    const hMatch = block.match(/<h([1-6])[^>]*>(.*?)<\/h\1>/is)
    if (hMatch) {
      const level = hMatch[1]
      const text = hMatch[2].replace(/<[^>]+>/g, '').trim()
      return { type: 'paragraph', format: '', indent: 0, version: 1, direction: null, children: [{ type: 'text', text, format: 0, version: 1, mode: 'normal', style: `h${level}`, detail: 0 }] }
    }
    // Plain paragraph
    const clean = block.replace(/<[^>]+>/g, '').trim()
    if (!clean) return null
    return { type: 'paragraph', format: '', indent: 0, version: 1, direction: null, children: [{ type: 'text', text: clean, format: 0, version: 1, mode: 'normal', style: '', detail: 0 }] }
  }).filter(Boolean)

  return {
    en: {
      root: { type: 'root', format: '', indent: 0, version: 1, direction: null, children }
    }
  }
}

async function main() {
  console.log('🔧 Fix Import — Stories, FAQs, Testimonials')
  console.log('==========================================\n')

  const payload = await getPayload({ config })
  console.log('✅ Payload initialized\n')

  const results = {}

  // ─── STORIES ───
  console.log('📦 Importing stories...')
  const stories = loadJson('stories.json')
  if (stories) {
    let imported = 0, errors = 0
    // Get first user for author relationship
    const users = await payload.find({ collection: 'users', limit: 1 })
    const defaultAuthor = users.docs[0]?.id || null
    if (!defaultAuthor) console.warn('  ⚠️ No users found — stories will have no author')

    for (const item of stories) {
      try {
        const mapped = {
          title: item.title,
          slug: item.slug,
          author: defaultAuthor,
          excerpt: item.excerpt || null,
          content: htmlToLocalizedRichText(item.content),
          publishedDate: item.publishedDate || item.published_date || null,
          status: item.status || 'draft',
          workflowStatus: item.workflowStatus || item.workflow_status || 'draft',
        }

        const existing = await payload.find({ collection: 'stories', where: { slug: { equals: mapped.slug } }, limit: 1 })
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
    results.stories = { imported, errors }
  }

  // ─── FAQs ───
  console.log('\n📦 Importing FAQs...')
  const faqs = loadJson('faqs.json')
  if (faqs) {
    let imported = 0, errors = 0
    const validCategories = ['general', 'booking', 'dietary', 'transport', 'private_tours', 'about_us']
    const categoryMap = {
      'booking': 'booking', 'private_tours': 'private_tours', 'general': 'general',
      'dietary': 'dietary', 'transport': 'transport', 'about_us': 'about_us',
      'practical': 'general', 'food': 'dietary', 'accessibility': 'general',
      'tour': 'general', 'day': 'general'
    }

    for (const item of faqs) {
      try {
        const cat = categoryMap[item.category] || 'general'
        const mapped = {
          question: item.question,
          answer: htmlToLocalizedRichText(item.answer),
          category: validCategories.includes(cat) ? cat : 'general',
          sort_order: item.sort_order || item.sortOrder || 0,
          page_visibility: item.page_visibility && item.page_visibility.length > 0 ? item.page_visibility : ['all'],
          status: 'published',
        }

        const existing = await payload.find({ collection: 'faqs', where: { question: { equals: mapped.question } }, limit: 1 })
        if (existing.docs.length > 0) {
          await payload.update({ collection: 'faqs', id: existing.docs[0].id, data: mapped })
          console.log(`  🔄 Updated FAQ: ${mapped.question.slice(0, 50)}...`)
        } else {
          await payload.create({ collection: 'faqs', data: mapped })
          console.log(`  ✅ Created FAQ: ${mapped.question.slice(0, 50)}...`)
        }
        imported++
      } catch (err) {
        console.error(`  ❌ Error importing FAQ "${item.question?.slice(0, 50)}...": ${err.message}`)
        errors++
      }
    }
    results.faqs = { imported, errors }
  }

  // ─── TESTIMONIALS ───
  console.log('\n📦 Importing testimonials...')
  const testimonials = loadJson('testimonials.json')
  if (testimonials) {
    let imported = 0, errors = 0

    for (const item of testimonials) {
      try {
        const mapped = {
          author_name: item.author_name,
          author_location: item.author_location || null,
          rating: item.rating ? Number(item.rating) : 5,
          review_text: item.review_text || item.review || null,
          review_title: item.review_title || null,
          author_photo: item.author_photo || null,
          date: item.date || null,
          platform: item.platform || 'google',
          page_visibility: item.page_visibility || ['tours'],
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
        console.error(`  ❌ Error importing testimonial ${item.author_name}: ${err.message}`)
        errors++
      }
    }
    results.testimonials = { imported, errors }
  }

  // Summary
  console.log('\n═══════════════════════════════════════════')
  console.log('📊 Fix Import Summary')
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