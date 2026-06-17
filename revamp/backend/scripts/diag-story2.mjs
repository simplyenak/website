#!/usr/bin/env node
/**
 * Diagnostic: test story creation field by field
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

  // Get first user
  const users = await payload.find({ collection: 'users', limit: 1 })
  const defaultAuthor = users.docs[0]
  console.log('Default user:', JSON.stringify({ id: defaultAuthor.id, email: defaultAuthor.email, role: defaultAuthor.role }).slice(0, 200))

  // Check existing stories
  const existingStories = await payload.find({ collection: 'stories', limit: 5 })
  console.log('Existing stories:', existingStories.totalDocs)

  // Clean up test stories
  for (const slug of ['test-story', 'test-story-2', 'test-story-3', 'test-story-4', 'test-story-5']) {
    try { await payload.delete({ collection: 'stories', where: { slug: { equals: slug } } }) } catch(e) {}
  }

  // Test A: Only title + slug (no author, no content)
  console.log('\n--- Test A: Only title + slug ---')
  try {
    const doc = await payload.create({ collection: 'stories', data: { title: 'Test A', slug: 'test-a' } })
    console.log('✅ Created, ID:', doc.id)
  } catch (err) { console.error('❌', err.message) }

  // Test B: title + slug + author (no content)
  console.log('\n--- Test B: title + slug + author (no content) ---')
  try {
    const doc = await payload.create({ collection: 'stories', data: { title: 'Test B', slug: 'test-b', author: defaultAuthor.id } })
    console.log('✅ Created, ID:', doc.id)
  } catch (err) { console.error('❌', err.message) }

  // Test C: title + slug + author + content as simple string
  console.log('\n--- Test C: title + slug + author + content as string ---')
  try {
    const doc = await payload.create({ collection: 'stories', data: { title: 'Test C', slug: 'test-c', author: defaultAuthor.id, content: 'Hello world' } })
    console.log('✅ Created, ID:', doc.id)
  } catch (err) { console.error('❌', err.message) }

  // Test D: Use the exact lexical JSON format from Payload docs
  console.log('\n--- Test D: Full lexical format ---')
  try {
    const doc = await payload.create({
      collection: 'stories',
      data: {
        title: 'Test D',
        slug: 'test-d',
        author: defaultAuthor.id,
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [{ type: 'text', text: 'Hello world' }]
              }
            ]
          }
        }
      }
    })
    console.log('✅ Created, ID:', doc.id)
  } catch (err) { console.error('❌', err.message) }

  // Test E: Non-localized richText (without locale wrapper)
  console.log('\n--- Test E: Non-localized richText format ---')
  try {
    const doc = await payload.create({
      collection: 'stories',
      data: {
        title: 'Test E',
        slug: 'test-e',
        author: defaultAuthor.id,
        content: {
          root: {
            type: 'root',
            direction: null,
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                direction: null,
                format: '',
                indent: 0,
                version: 1,
                children: [
                  { type: 'text', text: 'Hello world', format: 0, version: 1, mode: 'normal', style: '', detail: 0 }
                ]
              }
            ]
          }
        }
      }
    })
    console.log('✅ Created, ID:', doc.id)
  } catch (err) { console.error('❌', err.message) }

  // List all story fields via introspection
  console.log('\n--- Checking stories collection config ---')
  const colConfig = payload.collections.get('stories')
  console.log('Fields:', colConfig.config.fields.map(f => `${f.name} (${f.type})`))
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })