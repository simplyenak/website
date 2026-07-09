#!/usr/bin/env node
/**
 * Import JSON data into Payload CMS using the Local API.
 * Reads from scripts/payload-import/ and imports into the DB.
 */

import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config({ path: '.env' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const IMPORT_DIR = path.resolve(__dirname, 'payload-import')

// Map filename (without .json) to Payload collection slug
const COLLECTION_MAP = {
  'about_page': 'about_page',
  'contact_page': 'contact_page',
  'dietary_landing_pages': 'landing_pages',
  'faqs': 'faqs',
  'location_landing_pages': 'landing_pages',
  'media_coverage': 'media_coverage',
  'pages': 'pages',
  'specialty_landing_pages': 'landing_pages',
  'stories': 'stories',
  'testimonials': 'testimonials',
  'tours': 'tours',
  'travel_type_landing_pages': 'landing_pages',
  'users': 'users',
}

// Collections that should NOT have their ID stripped (preserve IDs)
const PRESERVE_IDS = ['users']

// Fields to strip from imported docs
const STRIP_FIELDS = ['createdAt', 'updatedAt', 'salt', 'hash', 'loginAttempts', 'lockUntil']

function stripInternalFields(doc, preserveId = false) {
  const out = { ...doc }
  for (const field of STRIP_FIELDS) {
    delete out[field]
  }
  if (!preserveId) {
    delete out.id
  }
  return out
}

async function importCollection(payload, slug, docs, options = {}) {
  const { preserveId = false, singleton = false, typeFilter = null } = options
  
  console.log(`\n📦 Importing ${slug} (${docs.length} docs)...`)
  
  let imported = 0
  let skipped = 0
  let errors = 0
  
  for (const rawDoc of docs) {
    // Skip if type filter is set and doc doesn't match
    if (typeFilter && rawDoc.type !== typeFilter) {
      continue
    }
    
    const doc = stripInternalFields(rawDoc, preserveId)
    
    try {
      if (singleton) {
        // For singletons: check if exists, update or create
        const existing = await payload.find({
          collection: slug,
          limit: 1,
          overrideAccess: true,
        })
        
        if (existing.docs.length > 0) {
          await payload.update({
            collection: slug,
            id: existing.docs[0].id,
            data: doc,
            overrideAccess: true,
          })
          console.log(`  ✅ Updated singleton ${slug}`)
        } else {
          await payload.create({
            collection: slug,
            data: doc,
            overrideAccess: true,
          })
          console.log(`  ✅ Created singleton ${slug}`)
        }
        imported++
      } else {
        // For collections: try to create
        // Check for slug-based duplicates
        if (doc.slug) {
          const existing = await payload.find({
            collection: slug,
            where: { slug: { equals: doc.slug } },
            limit: 1,
            overrideAccess: true,
          })
          
          if (existing.docs.length > 0) {
            await payload.update({
              collection: slug,
              id: existing.docs[0].id,
              data: doc,
              overrideAccess: true,
            })
            console.log(`  🔄 Updated ${slug} / ${doc.slug}`)
            imported++
            continue
          }
        }
        
        await payload.create({
          collection: slug,
          data: doc,
          overrideAccess: true,
        })
        console.log(`  ✅ Created ${slug} / ${doc.slug || doc.name || doc.title || '(no slug)'}`)
        imported++
      }
    } catch (err) {
      console.error(`  ❌ Error importing ${slug}: ${err.message}`)
      if (err.message.includes('unique constraint')) {
        console.error(`     (unique constraint violation — may already exist)`)
      }
      errors++
    }
  }
  
  console.log(`  📊 ${slug}: ${imported} imported/updated, ${skipped} skipped, ${errors} errors`)
  return { imported, skipped, errors }
}

async function main() {
  console.log('🚀 Payload Import Script')
  console.log('========================\n')
  
  console.log('Initializing Payload...')
  const payload = await getPayload({ config })
  console.log('✅ Payload initialized\n')
  
  const stats = { imported: 0, skipped: 0, errors: 0 }
  
  // ── Singletons ──
  const singletonFiles = ['about_page', 'contact_page']
  for (const fileBase of singletonFiles) {
    const filePath = path.join(IMPORT_DIR, `${fileBase}.json`)
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  ${fileBase}.json not found, skipping`)
      continue
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const docs = Array.isArray(data) ? data : [data]
    const slug = COLLECTION_MAP[fileBase]
    
    const result = await importCollection(payload, slug, docs, { singleton: true })
    stats.imported += result.imported
    stats.errors += result.errors
  }
  
  // ── Collections ──
  const collectionFiles = [
    { file: 'faqs', slug: 'faqs' },
    { file: 'media_coverage', slug: 'media_coverage' },
    { file: 'stories', slug: 'stories' },
    { file: 'testimonials', slug: 'testimonials' },
    { file: 'tours', slug: 'tours' },
    { file: 'users', slug: 'users', preserveId: true },
  ]
  
  for (const item of collectionFiles) {
    const filePath = path.join(IMPORT_DIR, `${item.file}.json`)
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  ${item.file}.json not found, skipping`)
      continue
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const docs = Array.isArray(data) ? data : (data.pages || [])
    
    const result = await importCollection(payload, item.slug, docs, { preserveId: item.preserveId })
    stats.imported += result.imported
    stats.errors += result.errors
  }
  
  // ── Landing Pages (all go to landing_pages collection with type field) ──
  const landingPageFiles = [
    { file: 'dietary_landing_pages', type: 'dietary' },
    { file: 'location_landing_pages', type: 'location' },
    { file: 'specialty_landing_pages', type: 'specialty' },
    { file: 'travel_type_landing_pages', type: 'travel_type' },
  ]
  
  for (const item of landingPageFiles) {
    const filePath = path.join(IMPORT_DIR, `${item.file}.json`)
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  ${item.file}.json not found, skipping`)
      continue
    }
    
    const docs = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    if (!Array.isArray(docs)) {
      console.log(`⚠️  ${item.file}.json is not an array, skipping`)
      continue
    }
    
    // Ensure each doc has the correct type
    const typedDocs = docs.map(d => ({ ...d, type: item.type }))
    
    const result = await importCollection(payload, 'landing_pages', typedDocs)
    stats.imported += result.imported
    stats.errors += result.errors
  }
  
  // ── Pages (special format: { pages: [...] }) ──
  const pagesFile = path.join(IMPORT_DIR, 'pages.json')
  if (fs.existsSync(pagesFile)) {
    const data = JSON.parse(fs.readFileSync(pagesFile, 'utf-8'))
    const docs = data.pages || []
    const result = await importCollection(payload, 'pages', docs)
    stats.imported += result.imported
    stats.errors += result.errors
  }
  
  // ── Summary ──
  console.log('\n═══════════════════════════════════════════')
  console.log('📊 Import Summary')
  console.log('═══════════════════════════════════════════')
  console.log(`  ✅ Total imported/updated: ${stats.imported}`)
  console.log(`  ❌ Total errors:           ${stats.errors}`)
  console.log('═══════════════════════════════════════════')
  
  process.exit(stats.errors > 0 ? 1 : 0)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
