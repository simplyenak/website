#!/usr/bin/env node
/**
 * Force schema push with auto-accept prompts
 */

import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

async function main() {
  console.log('Forcing schema push...')

  // Auto-accept Drizzle prompts by emitting keypress events
  const interval = setInterval(() => {
    process.stdin.emit('keypress', '\n', { name: 'return', ctrl: false })
  }, 25)

  try {
    const payload = await getPayload({ config })
    console.log('Schema push complete!')

    // Check what tables were created
    const result = await payload.db.execute({
      raw: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
    })
    console.log(`Total tables: ${result.rows.length}`)

    const hasPages = result.rows.some(r => r.table_name === 'pages')
    console.log(`Pages table exists: ${hasPages}`)
  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    clearInterval(interval)
    process.exit(0)
  }
}

main()
