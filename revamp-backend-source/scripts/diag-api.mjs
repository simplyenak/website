#!/usr/bin/env node
/**
 * Quick diagnostic: check API with auth and without
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

  // Check user
  const users = await payload.find({ collection: 'users', limit: 5 })
  console.log('Users found:', users.totalDocs)
  for (const u of users.docs) {
    console.log(`  #${u.id} | email: ${u.email} | role: ${u.role}`)
  }

  // Check tours directly via Payload API
  console.log('\n--- Tours via Payload find ---')
  const tours = await payload.find({ collection: 'tours', limit: 3, depth: 0 })
  console.log('Tours found:', tours.totalDocs)
  for (const t of tours.docs) {
    console.log(`  #${t.id} | slug: ${t.slug} | status: ${t.status} | workflow: ${t.workflowStatus}`)
  }

  // Check stories
  console.log('\n--- Stories via Payload find ---')
  const stories = await payload.find({ collection: 'stories', limit: 3, depth: 0 })
  console.log('Stories found:', stories.totalDocs)
  for (const s of stories.docs) {
    const hasContent = s.content && s.content.root && s.content.root.children?.length > 0
    console.log(`  #${s.id} | slug: ${s.slug} | status: ${s.status} | hasContent: ${hasContent}`)
  }

  // Check site settings
  console.log('\n--- Site Settings ---')
  const settings = await payload.find({ collection: 'site_settings', limit: 1 })
  console.log('Settings found:', settings.totalDocs)

  // Check pages
  console.log('\n--- Pages ---')
  const pages = await payload.find({ collection: 'pages', limit: 5, depth: 0 })
  console.log('Pages found:', pages.totalDocs)

  // Check home page singleton
  console.log('\n--- Home Page ---')
  const home = await payload.find({ collection: 'home_page', limit: 1 })
  console.log('Home pages found:', home.totalDocs)
  if (home.docs.length > 0) {
    console.log('  Hero section:', home.docs[0].heroSection ? 'YES' : 'NO')
    console.log('  Manifesto section:', home.docs[0].manifestoSection ? 'YES' : 'NO')
  }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })