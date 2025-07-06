export function getFullMediaUrl(media: { url?: string } | undefined) {
  const baseURL = import.meta.env.STRAPI_URL
  if (!media?.url) return ''
  return media.url.startsWith('http') ? media.url : baseURL + media.url
}
