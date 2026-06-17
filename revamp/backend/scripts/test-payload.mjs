import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

async function main() {
  console.log('Initializing Payload...')
  const payload = await getPayload({ config })
  console.log('Payload initialized!')
  console.log('Collections:', Object.keys(payload.collections))
  process.exit(0)
}

main().catch(err => {
  console.error('Error:', err.message)
  console.error(err.stack)
  process.exit(1)
})
