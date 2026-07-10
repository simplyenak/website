import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

async function main() {
  process.env.DATABASE_URL = 'postgres://postgres@localhost:5432/payload-local'
  const payload = await getPayload({ config })
  console.log('Payload initialized with payload-local!')

  const tours = await payload.find({ collection: 'tours', limit: 1 })
  console.log('Tours query works:', tours.docs.length, 'docs')

  process.exit(0)
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
