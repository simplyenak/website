/**
 * Prevent publishing empty content — blocks workflowStatus/status from
 * being set to 'published' when the story body is empty (no content_markdown
 * and no Lexical content text). Calendar placeholders and unfinished drafts
 * must not go live as thin/empty shells (2026-08-14 incident: 11 cal-2026-*
 * stories published with zero body).
 *
 * A beforeChange hook is used so it can force the status back to draft
 * before save; a beforeValidate hook would hard-fail the whole request
 * (including legitimate partial saves).
 */
import type { CollectionBeforeChangeHook } from 'payload'

function extractTextLength(content: unknown): number {
  if (!content) return 0
  if (typeof content === 'string') return content.trim().length

  // Lexical rich text: { root: { children: [...] } }
  const root = (content as any)?.root
  if (!root?.children || !Array.isArray(root.children)) return 0

  let total = 0
  const walk = (nodes: any[]) => {
    for (const node of nodes || []) {
      if (!node) continue
      if (node.type === 'text' && typeof node.text === 'string') {
        total += node.text.trim().length
      }
      if (Array.isArray(node.children)) walk(node.children)
    }
  }
  walk(root.children)
  return total
}

export const preventEmptyPublish: CollectionBeforeChangeHook = async ({ data, req }) => {
  const mdLen = ((data.content_markdown as string) || '').trim().length
  const lexLen = extractTextLength(data.content)
  const bodyLen = mdLen + lexLen

  // Cover all three publish signals: workflowStatus (custom), status (custom),
  // and _status (Payload built-in, set by the admin Publish button via versioning).
  const wf = data.workflowStatus
  const st = data.status
  const ps = data._status
  const becomingPublished = wf === 'published' || st === 'published' || ps === 'published'

  if (becomingPublished && bodyLen < 50) {
    // Force back to draft — the record stays editable, just not live.
    if (wf === 'published') data.workflowStatus = 'draft'
    if (st === 'published') data.status = 'draft'
    if (ps === 'published') data._status = 'draft'
    req.payload.logger.warn(
      `[preventEmptyPublish] Blocked publishing "${data.title || data.slug || '?'}" ` +
      `(body ${bodyLen} chars < 50). Forced back to draft.`
    )
  }
  return data
}
