#!/usr/bin/env node
/**
 * Finalize stories: check content, fix any missing, clean up test entries
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

function htmlToLexical(html) {
  if (!html) return null
  if (typeof html !== 'string') return null

  // Split by block-level tags
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

  // Get first user
  const users = await payload.find({ collection: 'users', limit: 1 })
  const defaultAuthor = users.docs[0]

  // Load JSON
  const CONTENT_DIR = path.resolve(__dirname, '../../frontend/src/data/content')
  const storiesJson = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'stories.json'), 'utf8'))

  // Delete test stories
  console.log('🧹 Cleaning up test stories...')
  for (const slug of ['test-d', 'test-e']) {
    try {
      const found = await payload.find({ collection: 'stories', where: { slug: { equals: slug } }, limit: 1 })
      if (found.docs.length > 0) {
        await payload.delete({ collection: 'stories', id: found.docs[0].id })
        console.log(`  🗑️ Deleted: ${slug}`)
      }
    } catch(e) {}
  }

  // Now check each story in DB against JSON
  console.log('\n📋 Checking story content...')
  const dbStories = await payload.find({ collection: 'stories', limit: 100, sort: 'slug' })
  let updated = 0, alreadyGood = 0, missingAuthor = 0

  for (const s of dbStories.docs) {
    const jsonItem = storiesJson.find(j => j.slug === s.slug)
    if (!jsonItem) {
      console.log(`  ⚠️ ${s.slug}: not in JSON`)
      continue
    }

    // Check if content is populated
    const hasContent = s.content && s.content.root && s.content.root.children && s.content.root.children.length > 0

    // Check author
    const hasAuthor = s.author && s.author.id

    if (!hasAuthor) {
      // Fix: set author
      try {
        await payload.update({ collection: 'stories', id: s.id, data: { author: defaultAuthor.id } })
        missingAuthor++
        console.log(`  ✏️ ${s.slug}: set author`)
      } catch(e) { console.error(`  ❌ ${s.slug}: ${e.message}`) }
    }

    if (hasContent && hasAuthor) {
      alreadyGood++
    } else if (!hasContent) {
      // Add content
      try {
        const content = htmlToLexical(jsonItem.content)
        await payload.update({ collection: 'stories', id: s.id, data: { content } })
        updated++
        console.log(`  ✏️ ${s.slug}: added content`)
      } catch(e) { console.error(`  ❌ ${s.slug}: ${e.message}`) }
    }
  }

  console.log(`\n📊 Results:`)
  console.log(`  ✅ Already good: ${alreadyGood}`)
  console.log(`  ✏️ Updated: ${updated}`)
  console.log(`  ✏️ Author fixed: ${missingAuthor}`)
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })