#!/usr/bin/env node
/**
 * Diagnostic: check existing stories and fix them
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

async function main() {
  const payload = await getPayload({ config })
  console.log('✅ Payload initialized\n')

  // List all existing stories
  const existingStories = await payload.find({ collection: 'stories', limit: 50, sort: 'title' })
  console.log(`Total stories in DB: ${existingStories.totalDocs}`)

  for (const s of existingStories.docs) {
    const hasContent = s.content && s.content.root && s.content.root.children && s.content.root.children.length > 0
    const hasLocaleContent = s.content && s.en
    console.log(`  #${s.id} | slug: ${s.slug} | title: ${s.title} | hasContent: ${hasContent} | hasLocaleContent: ${!!hasLocaleContent} | author: ${s.author}`)
  }

  // Load JSON data
  const CONTENT_DIR = path.resolve(__dirname, '../../frontend/src/data/content')
  const storiesJson = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'stories.json'), 'utf8'))
  console.log(`\nStories in JSON: ${storiesJson.length}`)

  // Check which stories from JSON are NOT in DB
  const slugsInDb = existingStories.docs.map(s => s.slug)
  const missing = storiesJson.filter(s => !slugsInDb.includes(s.slug))
  console.log(`Missing from DB: ${missing.length}`)
  for (const m of missing) console.log(`  - ${m.slug}`)

  // Check which stories need content update
  const needsUpdate = existingStories.docs.filter(s => {
    const jsonItem = storiesJson.find(j => j.slug === s.slug)
    if (!jsonItem) return false
    const hasContent = s.content && s.content.root && s.content.root.children && s.content.root.children.length > 0
    return !hasContent
  })
  console.log(`Need content update: ${needsUpdate.length}`)
  for (const u of needsUpdate) console.log(`  - #${u.id}: ${u.slug}`)
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })