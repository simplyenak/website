/**
 * Deploy trigger hook — calls GitHub repository_dispatch after content changes.
 * Added to content collections to trigger staging deploy via GitHub Actions.
 */
import type { CollectionAfterChangeHook } from 'payload'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''
const REPO = 'simplyenak/website'
const GITHUB_API = `https://api.github.com/repos/${REPO}/dispatches`

export const triggerStagingDeploy: CollectionAfterChangeHook = async ({ operation }) => {
  // Only trigger on create/update/delete — skip on read
  if (operation !== 'create' && operation !== 'update' && operation !== 'delete') return
  if (!GITHUB_TOKEN) return

  try {
    await fetch(GITHUB_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_type: 'deploy-staging' }),
      signal: AbortSignal.timeout(10000),
    })
  } catch (err) {
    // Non-critical — deploy will still happen on next push or manual trigger
    console.error('Deploy trigger webhook failed:', err instanceof Error ? err.message : err)
  }
}
