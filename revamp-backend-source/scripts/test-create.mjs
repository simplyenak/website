import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

async function main() {
  const payload = await getPayload({ config })
  console.log('Payload initialized')

  try {
    const result = await payload.create({
      collection: 'tours',
      data: {
        name: 'Test Tour',
        slug: 'test-tour',
        isBookable: true,
      }
    })
    console.log('Created tour:', result.id, result.slug)
  } catch (err) {
    console.error('Create error:', err.message)
    if (err.cause) console.error('Cause:', err.cause.message)
  }

  process.exit(0)
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
