'use client'

// Must be server-rendered — React context isn't available during static generation
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

import React from 'react'

/**
 * Next.js global error boundary.
 * Required to prevent prerendering errors with React context in Next.js 16.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={{ padding: '2rem', textAlign: 'center' as const }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong</h1>
          <p style={{ marginBottom: '1rem', color: '#666' }}>An unexpected error occurred. Please try again.</p>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.5rem 1.5rem',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
