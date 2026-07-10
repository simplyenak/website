import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

async function main() {
  process.env.DATABASE_URL = 'postgres://postgres@localhost:5432/staging_payload'
  console.log('Testing staging_payload...')
  const payload = await getPayload({ config })
  console.log('Payload initialized with staging_payload!')

  const tours = await payload.find({ collection: 'tours', limit: 1 })
  console.log('Tours query works:', tours.docs.length, 'docs')

  const pages = await payload.find({ collection: 'pages', limit: 1 })
  console.log('Pages query works:', pages.docs.length, 'docs')

  process.exit(0)
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
