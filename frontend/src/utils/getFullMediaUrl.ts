export function getFullMediaUrl(media: { url?: string } | undefined) {
  // Proxy S3 images through Cloudflare CDN for Polish optimization (WebP/AVIF conversion)
  const cdnURL = 'https://cdn.simplyenak.com'
  const baseURL = import.meta.env.STRAPI_URL ?? 'http://localhost:1337'
  const s3Domain = 'se-website-images.s3.nl-ams.scw.cloud'

  if (!media?.url) return ''

  // Rewrite S3 URLs to go through Cloudflare CDN
  if (media.url.includes(s3Domain)) {
    const isDevelopment = import.meta.env.DEV || baseURL.includes('localhost')
    if (isDevelopment) {
      return media.url // Keep S3 direct in development
    }
    // In production: rewrite to cdn.simplyenak.com/uploads/...
    const path = media.url.split(s3Domain)[1] // Gets "/uploads/..." part
    return cdnURL + path
  }

  // If URL is already absolute (not S3), return as-is
  if (media.url.startsWith('http')) return media.url

  // For relative URLs (uploads), use CDN in production, base URL in development
  const isDevelopment = import.meta.env.DEV || baseURL.includes('localhost')
  return isDevelopment ? baseURL + media.url : cdnURL + media.url
}
