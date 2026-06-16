'use client'

import React, { useState, useEffect, useCallback } from 'react'

const COLORS = {
  primary: '#D4532B',
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  gray: '#E5E7EB',
}

function getApiBase() { return window.location.origin }

function getToken(): string | null {
  return localStorage.getItem('guide_token')
}

function getUser(): any | null {
  try { return JSON.parse(localStorage.getItem('guide_user') || 'null') } catch { return null }
}

async function api(path: string, options: RequestInit = {}) {
  const token = getToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${getApiBase()}/api${path}`, { ...options, headers })
  if (res.status === 401) {
    localStorage.removeItem('guide_token')
    localStorage.removeItem('guide_user')
    window.location.hash = '#login'
    return null
  }
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export default function GuidePortal() {
  const [user, setUser] = useState<any>(null)
  const [page, setPage] = useState('login')
  const [assignments, setAssignments] = useState<any[]>([])
  const [claims, setClaims] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const u = getUser()
    const token = getToken()
    if (u && token) {
      setUser(u)
      setPage('dashboard')
      loadData()
    } else {
      setLoading(false)
    }
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [assignData, claimData] = await Promise.all([
        api('/guide-assignments?depth=2&sort=createdAt&limit=50'),
        api('/claims?depth=1&sort=createdAt&limit=50'),
      ])
      if (assignData) setAssignments(assignData.docs || [])
      if (claimData) setClaims(claimData.docs || [])
    } catch (e: any) { setError(e.message) }
    setLoading(false)
  }

  async function handleLogin(email: string, password: string) {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${getApiBase()}/api/guides/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) { setError('Invalid email or password'); setLoading(false); return }
      const data = await res.json()
      localStorage.setItem('guide_token', data.token)
      localStorage.setItem('guide_user', JSON.stringify(data.user))
      setUser(data.user)
      setPage('dashboard')
      await loadData()
    } catch (e: any) { setError('Connection failed') }
    setLoading(false)
  }

  async function handleLogout() {
    localStorage.removeItem('guide_token')
    localStorage.removeItem('guide_user')
    setUser(null)
    setPage('login')
    setAssignments([])
    setClaims([])
  }

  async function submitClaim(assignmentId: string, expenseType: string, amount: string, description: string, claimType: string, expenseDate: string) {
    setLoading(true); setError('')
    try {
      const body: any = {
        expenseType,
        amount: parseFloat(amount),
        description,
        status: 'pending',
        claimType: 'tour',
        expenseDate: new Date().toISOString().split('T')[0],
      }
      if (claimType === 'tour' && assignmentId && assignmentId !== 'business') {
        body.assignment = assignmentId
        body.claimType = 'tour'
      } else {
        body.claimType = 'business'
      }
      if (expenseDate) body.expenseDate = expenseDate

      await api('/claims', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      await loadData()
      setPage('dashboard')
    } catch (e: any) { setError(e.message) }
    setLoading(false)
  }

  // Find claims for a specific assignment
  function getClaimForAssignment(assignmentId: string) {
    return claims.filter(c => typeof c.assignment === 'object' ? c.assignment?.id === assignmentId : c.assignment === assignmentId)
  }

  function renderHeader() {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: `1px solid ${COLORS.gray}`, marginBottom: '1rem' }}>
        <div>
          <div style={{ fontWeight: 700, color: COLORS.primary, fontSize: '1.1rem' }}>Simply Enak</div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{user?.name || 'Guide'}</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={() => setPage('dashboard')} style={tabStyle(page === 'dashboard')}>Tours</button>
          <button onClick={() => { setPage('history'); loadData(); }} style={tabStyle(page === 'history')}>History</button>
          <button onClick={handleLogout} style={{ ...smallBtn, color: '#6B7280', border: 'none', fontSize: '0.75rem' }}>Logout</button>
        </div>
      </div>
    )
  }

  function renderLogin() {
    return (
      <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); handleLogin(fd.get('email') as string, fd.get('password') as string) }} style={{ paddingTop: '4rem' }}>
        <h1 style={{ fontSize: '1.5rem', color: COLORS.primary, marginBottom: '0.25rem' }}>Guide Portal</h1>
        <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '2rem' }}>Sign in to view your tours and submit claims</p>

        {error && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.75rem', borderRadius: 8, fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

        <input name="email" type="email" placeholder="Email address" required style={inputStyle} autoComplete="email" />
        <input name="password" type="password" placeholder="Password" required style={inputStyle} autoComplete="current-password" />
        <button type="submit" disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.6 : 1, width: '100%' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', textAlign: 'center', marginTop: '1rem' }}>
          First time? Your admin will set up your account.
        </p>
      </form>
    )
  }

  function renderDashboard() {
    const myAssignments = assignments.filter((a: any) => typeof a.guide === 'object' ? a.guide?.id === user?.id : a.guide === user?.id)

    return (
      <>
        {renderHeader()}
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Your Tours</h2>
        <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '1rem' }}>{myAssignments.length} upcoming tours</p>

        {error && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.75rem', borderRadius: 8, fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

        {myAssignments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9CA3AF' }}>
            <p>No tours assigned yet</p>
          </div>
        ) : (
          <>
            <button onClick={() => { setPage('claim'); setError(''); }} style={{ ...smallBtn, width: '100%', marginBottom: '0.5rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: 8, fontSize: '0.85rem', padding: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
              + Submit Business Expense (Not linked to tour)
            </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {myAssignments.map((a: any) => {
              const booking = a.booking || {}
              const tour = booking.tour || {}
              const claimList = getClaimForAssignment(a.id)
              const totalClaimed = claimList.reduce((s: number, c: any) => s + (c.amount || 0), 0)
              const isSubmitted = claimList.some((c: any) => c.status !== 'draft')
              const hasPending = claimList.some((c: any) => c.status === 'pending')

              return (
                <div key={a.id} style={{ background: 'white', border: `1px solid ${COLORS.gray}`, borderRadius: 12, padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{tour?.name || 'Tour'}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.125rem' }}>
                        {booking.tourDate ? new Date(booking.tourDate).toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                        {booking.paxCount ? ` · ${booking.paxCount} pax` : ''}
                      </div>
                    </div>
                    <span style={{ ...statusPill(booking.status || 'scheduled') }}>{booking.status?.replace('_', ' ') || 'scheduled'}</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '0.75rem' }}>
                    {booking.tourTime && <span>{booking.tourTime} · </span>}
                    {booking.area || ''}
                  </div>

                  {claimList.length > 0 && (
                    <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600 }}>Claims:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
                        {claimList.map((c: any) => (
                          <span key={c.id} style={{ ...statusPill(c.status), fontSize: '0.7rem' }}>
                            {c.expenseType?.replace('_', ' ')}: RM{c.amount}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button onClick={() => { setPage('claim'); setError(''); }} style={{ ...smallBtn, width: '100%', marginTop: '0.25rem', background: COLORS.primary, color: 'white', border: 'none', fontSize: '0.8rem' }}>
                    {claimList.length === 0 ? 'Submit Expense Claim' : hasPending ? 'Claim Pending Review' : 'Add Another Claim'}
                  </button>
                  <button onClick={() => { setPage('claim'); setError(''); }} style={{ ...smallBtn, width: '100%', marginTop: '0.25rem', background: '#F3F4F6', color: '#374151', border: 'none', fontSize: '0.8rem' }}>
                    Submit Business Expense
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <style>{`@media(prefers-color-scheme:dark){body{background:#111;color:#f3f4f6}}`}</style>
      </>
    )
  }

  function renderClaimForm() {
    const myAssignments = assignments.filter((a: any) => typeof a.guide === 'object' ? a.guide?.id === user?.id : a.guide === user?.id)
    return (
      <>
        {renderHeader()}
        <button onClick={() => setPage('dashboard')} style={{ ...smallBtn, marginBottom: '1rem', border: 'none', color: '#6B7280', fontSize: '0.85rem', padding: 0 }}>← Back to Tours</button>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>New Expense Claim</h2>

        {error && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.75rem', borderRadius: 8, fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={(e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          const claimType = fd.get('claimType') as string || 'tour'
          submitClaim(
            fd.get('assignment') as string,
            fd.get('expenseType') as string,
            fd.get('amount') as string,
            fd.get('description') as string,
            claimType,
            fd.get('expenseDate') as string,
          )
        }}>
          <label style={labelStyle}>Claim Type</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem', borderRadius: 8, border: '1px solid #D1D5DB', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input type="radio" name="claimType" value="tour" defaultChecked style={{ accentColor: COLORS.primary }} />
              Tour Expense
            </label>
            <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem', borderRadius: 8, border: '1px solid #D1D5DB', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input type="radio" name="claimType" value="business" style={{ accentColor: COLORS.primary }} />
              Business Expense
            </label>
          </div>

          <label style={labelStyle}>Tour / Booking</label>
          <select name="assignment" style={inputStyle}>
            <option value="">Select a tour...</option>
            {myAssignments.map((a: any) => {
              const b = a.booking || {}
              const t = b.tour || {}
              return (
                <option key={a.id} value={a.id}>
                  {t.name || 'Tour'} — {b.tourDate ? new Date(b.tourDate).toLocaleDateString() : ''}
                </option>
              )
            })}
          </select>

          <label style={labelStyle}>Expense Type</label>
          <select name="expenseType" required style={inputStyle}>
            <option value="">Select type...</option>
            <option value="food_beverage">Food & Beverage</option>
            <option value="alcoholic_drinks">Alcoholic Drinks</option>
            <option value="miscellaneous">Miscellaneous</option>
            <option value="logistics">Logistics / Transport</option>
            <option value="guide_fee">Guide Fee</option>
            <option value="advance">Advance</option>
            <option value="other">Other</option>
          </select>

          <label style={labelStyle}>Amount (RM)</label>
          <input name="amount" type="number" step="0.01" min="0" required placeholder="0.00" style={inputStyle} />

          <label style={labelStyle}>Date of Expense</label>
          <input name="expenseDate" type="date" required style={inputStyle} defaultValue={new Date().toISOString().split('T')[0]} />

          <label style={labelStyle}>Description</label>
          <textarea name="description" rows={3} placeholder="What was this expense for?" style={{ ...inputStyle, resize: 'vertical' }} />

          <div style={{ background: '#FEF3C7', padding: '0.75rem', borderRadius: 8, fontSize: '0.8rem', color: '#92400E', marginBottom: '1rem' }}>
            Receipt upload coming soon. Please keep your receipt for verification.
          </div>

          <button type="submit" disabled={loading} style={{ ...btnStyle, width: '100%', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Submitting...' : 'Submit Claim'}
          </button>
        </form>
      </>
    )
  }

  function renderHistory() {
    const myClaims = claims.filter((c: any) => {
      const a = typeof c.assignment === 'object' ? c.assignment : null
      const guideId = a?.guide || c.assignment
      return guideId === user?.id || (typeof guideId === 'object' && guideId?.id === user?.id)
    })

    return (
      <>
        {renderHeader()}
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Claim History</h2>
        <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '1rem' }}>{myClaims.length} total claims</p>

        {loading ? (
          <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '2rem' }}>Loading...</p>
        ) : myClaims.length === 0 ? (
          <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '2rem' }}>No claims yet</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {myClaims.map((c: any) => (
              <div key={c.id} style={{ background: 'white', border: `1px solid ${COLORS.gray}`, borderRadius: 10, padding: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>{c.expenseType?.replace(/_/g, ' ')}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>RM {c.amount} · {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}</div>
                  </div>
                  <span style={statusPill(c.status)}>{c.status}</span>
                </div>
                {c.description && <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '0.25rem' }}>{c.description}</div>}
                {c.adminNotes && <div style={{ fontSize: '0.75rem', color: COLORS.primary, marginTop: '0.25rem', fontStyle: 'italic' }}>Note: {c.adminNotes}</div>}
              </div>
            ))}
          </div>
        )}
      </>
    )
  }

  // Page routing
  if (page === 'login' && !user) return renderLogin()
  if (!user) return renderLogin()
  if (page === 'dashboard') return renderDashboard()
  if (page === 'claim') return renderClaimForm()
  if (page === 'history') return renderHistory()
  return renderDashboard()
}

// Styles
const inputStyle: React.CSSProperties = {
  display: 'block', width: '100%', padding: '0.75rem', marginBottom: '0.75rem',
  border: '1px solid #D1D5DB', borderRadius: 8, fontSize: '1rem',
  boxSizing: 'border-box', background: 'white',
}

const btnStyle: React.CSSProperties = {
  padding: '0.85rem', backgroundColor: COLORS.primary, color: 'white',
  border: 'none', borderRadius: 8, fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
}

const smallBtn: React.CSSProperties = {
  padding: '0.5rem 0.75rem', borderRadius: 8, cursor: 'pointer', fontWeight: 500,
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem', color: '#374151',
}

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: '0.4rem 0.75rem', borderRadius: 6, cursor: 'pointer', fontWeight: 500,
  fontSize: '0.8rem', border: 'none',
  background: active ? COLORS.primary : 'transparent',
  color: active ? 'white' : '#6B7280',
})

function statusPill(status: string): React.CSSProperties {
  const colors: Record<string, string[]> = {
    draft: ['#F3F4F6', '#374151'],
    pending: ['#FEF3C7', '#92400E'],
    approved: ['#D1FAE5', '#065F46'],
    rejected: ['#FEE2E2', '#991B1B'],
    paid: ['#DBEAFE', '#1E40AF'],
    scheduled: ['#EFF6FF', '#1E40AF'],
    in_progress: ['#FEF3C7', '#92400E'],
    completed: ['#D1FAE5', '#065F46'],
    cancelled: ['#FEE2E2', '#991B1B'],
  }
  const c = colors[status] || ['#F3F4F6', '#374151']
  return { background: c[0], color: c[1], padding: '0.2rem 0.5rem', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap' }
}