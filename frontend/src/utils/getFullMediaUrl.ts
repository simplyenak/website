export function getFullMediaUrl(media: { url?: string } | undefined) {
  const baseURL = import.meta.env.STRAPI_URL ?? 'http://localhost:1337'
  if (!media?.url) return ''
  return media.url.startsWith('http') ? media.url : baseURL + media.url
}
