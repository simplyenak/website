'use client'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Something went wrong</h1>
    <p style={{ color: '#666', marginBottom: '1rem' }}>An unexpected error occurred. Please try again.</p>
    <button onClick={() => reset()} style={{ padding: '0.5rem 1.5rem', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
      Try again
    </button>
  </div>
}
