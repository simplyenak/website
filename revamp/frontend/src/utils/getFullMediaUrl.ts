export function getFullMediaUrl(media: { url?: string } | undefined) {
  const cdnURL = 'https://cdn.simplyenak.com'
  const payloadUrl = import.meta.env.PUBLIC_PAYLOAD_URL ?? 'http://localhost:3000'

  if (!media?.url) return ''

  // Already absolute (external, CDN, or direct S3)
  if (media.url.startsWith('http')) return media.url

  // Static assets (/_astro/, /assets/, /@fs/) — use as-is
  if (media.url.startsWith('/_astro/') || media.url.startsWith('/assets/') || media.url.startsWith('/@fs/')) {
    return media.url
  }

  // Payload media API path: /api/media/file/filename.jpg?prefix=payload-media
  // Rewrite to direct CDN URL: https://cdn.simplyenak.com/payload-media/filename.jpg
  if (media.url.startsWith('/api/media/file/')) {
    const isDevelopment = import.meta.env.DEV || payloadUrl.includes('localhost')
    if (isDevelopment) {
      // In dev, proxy through Payload
      return payloadUrl + media.url
    }
    // Extract filename from the path: /api/media/file/IMG_123.jpg?prefix=payload-media → IMG_123.jpg
    const match = media.url.match(/\/api\/media\/file\/([^?]+)/)
    if (match) {
      return `${cdnURL}/payload-media/${match[1]}`
    }
    return cdnURL + media.url
  }

  // Any other local absolute path — return directly
  if (media.url.startsWith('/')) return media.url

  // Relative paths — use CDN in production
  const isDevelopment = import.meta.env.DEV || payloadUrl.includes('localhost')
  return isDevelopment ? payloadUrl + media.url : cdnURL + media.url
}
