export function getFullMediaUrl(media: { url?: string } | undefined) {
  // Use CDN domain for images served through Cloudflare (with Polish optimization)
  const cdnURL = 'https://cdn.simplyenak.com'
  const baseURL = import.meta.env.STRAPI_URL ?? 'http://localhost:1337'

  if (!media?.url) return ''

  // If URL is already absolute, return as-is
  if (media.url.startsWith('http')) return media.url

  // For relative URLs (uploads), use CDN in production, base URL in development
  const isDevelopment = import.meta.env.DEV || baseURL.includes('localhost')
  return isDevelopment ? baseURL + media.url : cdnURL + media.url
}
