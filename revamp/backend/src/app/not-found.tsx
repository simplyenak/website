// Override Next.js auto-generated _not-found page — prevent prerender error
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export default function NotFound() {
  return <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
  </div>
}
