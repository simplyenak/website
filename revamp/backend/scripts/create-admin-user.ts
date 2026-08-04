#!/usr/bin/env node
/**
 * Create initial admin user directly via Payload Local API
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

async function createAdminUser() {
  console.log('Initializing Payload...')
  
  const payload = await getPayload({ config })
  
  // Check if users already exist
  if (!process.env.ADMIN_PASSWORD) {
    console.error('❌ ADMIN_PASSWORD env var required — refusing to create a user with a known default password')
    process.exit(1)
  }

  const existing = await payload.find({ collection: 'users', limit: 1 })
  if (existing.docs.length > 0) {
    console.log(`✅ User already exists: ${existing.docs[0].email}`)
    process.exit(0)
  }
  
  console.log('Creating admin user...')
  
  const user = await payload.create({
    collection: 'users',
    data: {
      email: 'admin@simplyenak.com',
      password: process.env.ADMIN_PASSWORD || '',
      role: 'admin',
      fullName: 'Admin User',
    },
  })
  
  console.log(`✅ User created: ${user.email} (ID: ${user.id})`)
  process.exit(0)
}

createAdminUser().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
