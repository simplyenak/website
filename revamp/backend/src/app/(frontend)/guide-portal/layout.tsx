import React from 'react'
import './styles.css'

const COLORS = {
  primary: '#D4532B',
  primaryLight: '#FDF2F0',
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  gray: '#F3F4F6',
  text: '#111827',
  muted: '#6B7280',
}

const STATUS_STYLES: Record<string, React.CSSProperties> = {
  draft: { background: '#F3F4F6', color: '#374151' },
  pending: { background: '#FEF3C7', color: '#92400E' },
  approved: { background: '#D1FAE5', color: '#065F46' },
  rejected: { background: '#FEE2E2', color: '#991B1B' },
  paid: { background: '#DBEAFE', color: '#1E40AF' },
}

function getApiBase() {
  if (typeof window === 'undefined') return ''
  const origin = window.location.origin
  return origin
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('guide_token')
}

async function api(path: string, options: RequestInit = {}) {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${getApiBase()}/api${path}`, { ...options, headers })
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('guide_token')
      localStorage.removeItem('guide_user')
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/guide-portal/login'
      }
    }
    throw new Error(`API error: ${res.status}`)
  }
  return res.json()
}

export { COLORS, STATUS_STYLES, getApiBase, getToken, api }

export default function GuidePortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '1rem', minHeight: '100vh' }}>
      {children}
    </div>
  )
}