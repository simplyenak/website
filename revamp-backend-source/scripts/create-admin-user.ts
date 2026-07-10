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
      password: 'admin123',
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
