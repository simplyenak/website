#!/usr/bin/env node
/**
 * Import data from Directus JSON exports into Payload CMS
 * Usage: npx tsx scripts/import-data.ts
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config({ path: '.env' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const IMPORT_DIR = path.join(__dirname, 'payload-import')

async function importCollection(payload: any, collection: string, file: string) {
  const filePath = path.join(IMPORT_DIR, file)
  if (!fs.existsSync(filePath)) {
    console.log(`  ⏭️  ${file} not found, skipping`)
    return 0
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  if (!Array.isArray(data) || data.length === 0) {
    console.log(`  ⏭️  ${file} is empty, skipping`)
    return 0
  }

  let count = 0
  for (const item of data) {
    try {
      await payload.create({
        collection,
        data: item,
      })
      count++
    } catch (err: any) {
      console.log(`  ⚠️  Error creating ${collection} item: ${err.message?.substring(0, 80) || err}`)
    }
  }
  return count
}

async function main() {
  console.log('🚀 Starting Payload data import...\n')

  const payload = await getPayload({ config })

  const collections = [
    { name: 'users', file: 'users.json' },
    { name: 'tours', file: 'tours.json' },
    { name: 'stories', file: 'stories.json' },
    { name: 'faqs', file: 'faqs.json' },
    { name: 'testimonials', file: 'testimonials.json' },
    { name: 'media_coverage', file: 'media_coverage.json' },
    { name: 'dietary_landing_pages', file: 'dietary_landing_pages.json' },
    { name: 'specialty_landing_pages', file: 'specialty_landing_pages.json' },
    { name: 'travel_type_landing_pages', file: 'travel_type_landing_pages.json' },
    { name: 'location_landing_pages', file: 'location_landing_pages.json' },
    { name: 'about_page', file: 'about_page.json' },
    { name: 'contact_page', file: 'contact_page.json' },
  ]

  for (const { name, file } of collections) {
    // Check if collection already has data
    const existing = await payload.find({ collection: name as const, limit: 1 })
    if (existing.docs.length > 0) {
      console.log(`⏭️  ${name}: already has data, skipping`)
      continue
    }

    const count = await importCollection(payload, name, file)
    if (count > 0) {
      console.log(`✅ ${name}: imported ${count} items`)
    } else {
      console.log(`⏭️  ${name}: nothing imported`)
    }
  }

  console.log('\n✅ Import complete!')
  process.exit(0)
}

main().catch(err => {
  console.error('❌ Import failed:', err.message)
  process.exit(1)
})
