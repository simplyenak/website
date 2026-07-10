#!/usr/bin/env node
/**
 * Diagnostic: test minimal story creation to find correct richText format
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
  const defaultAuthor = users.docs[0]?.id || null
  console.log('Default author ID:', defaultAuthor)

  // Clean up any previous test
  try { await payload.delete({ collection: 'stories', where: { slug: { equals: 'test-story' } } }) } catch(e) {}

  // Test 1: Minimal story with null content
  console.log('\n--- Test 1: Story with null content ---')
  try {
    const doc = await payload.create({
      collection: 'stories',
      data: {
        title: 'Test Story 1',
        slug: 'test-story',
        author: defaultAuthor,
        content: null,
        status: 'published',
      }
    })
    console.log('✅ Created with null content, ID:', doc.id)
  } catch (err) {
    console.error('❌ Failed:', err.message)
  }

  // Test 2: Minimal story with empty localized richText
  console.log('\n--- Test 2: Story with empty localized richText ---')
  try {
    const doc = await payload.create({
      collection: 'stories',
      data: {
        title: 'Test Story 2',
        slug: 'test-story-2',
        author: defaultAuthor,
        content: {
          en: {
            root: {
              type: 'root',
              children: [],
              direction: null,
              format: '',
              indent: 0,
              version: 1,
            }
          }
        },
        status: 'published',
      }
    })
    console.log('✅ Created with empty richText, ID:', doc.id)
  } catch (err) {
    console.error('❌ Failed:', err.message)
  }

  // Test 3: Story with paragraph richText
  console.log('\n--- Test 3: Story with paragraph richText ---')
  try {
    const doc = await payload.create({
      collection: 'stories',
      data: {
        title: 'Test Story 3',
        slug: 'test-story-3',
        author: defaultAuthor,
        content: {
          en: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    { text: 'Hello world', type: 'text' }
                  ]
                }
              ],
              direction: null,
              format: '',
              indent: 0,
              version: 1,
            }
          }
        },
        status: 'published',
      }
    })
    console.log('✅ Created with paragraph richText, ID:', doc.id)
  } catch (err) {
    console.error('❌ Failed:', err.message)
  }

  // Test 4: Story with text node format/detail
  console.log('\n--- Test 4: Story with text node including format/detail ---')
  try {
    const doc = await payload.create({
      collection: 'stories',
      data: {
        title: 'Test Story 4',
        slug: 'test-story-4',
        author: defaultAuthor,
        content: {
          en: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    { text: 'Hello world', type: 'text', format: 0, version: 1, mode: 'normal', style: '', detail: 0 }
                  ],
                  format: '',
                  indent: 0,
                  version: 1,
                  direction: null,
                }
              ],
              direction: null,
              format: '',
              indent: 0,
              version: 1,
            }
          }
        },
        status: 'published',
      }
    })
    console.log('✅ Created with detailed text node, ID:', doc.id)
  } catch (err) {
    console.error('❌ Failed:', err.message)
  }
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})