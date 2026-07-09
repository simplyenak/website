// Root layout — forces all pages to be server-rendered
// Required for Payload CMS + Next.js 16 compatibility
// without this, _global-error and _not-found pages fail to prerender
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
