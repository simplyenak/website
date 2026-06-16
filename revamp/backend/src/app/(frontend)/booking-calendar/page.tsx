import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

async function getBookings(payload: any, year: number, month: number) {
  const startDate = new Date(year, month, 1).toISOString().split('T')[0]
  const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

  const result = await payload.find({
    collection: 'tour-bookings',
    where: {
      tourDate: { greater_than_equal: startDate },
      AND: [{ tourDate: { less_than_equal: endDate } }],
    },
    sort: 'tourDate',
    depth: 1,
  })
  return result.docs
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default async function BookingCalendarPage({ searchParams }: { searchParams: Promise<{ month?: string; year?: string }> }) {
  const params = await searchParams
  const now = new Date()
  const currentYear = parseInt(params.year || String(now.getFullYear()))
  const currentMonth = parseInt(params.month || String(now.getMonth()))

  const payload = await getPayload({ config: configPromise })
  const bookings = await getBookings(payload, currentYear, currentMonth)

  // Group bookings by date
  const bookingsByDate: Record<string, any[]> = {}
  for (const b of bookings) {
    const dateKey = new Date(b.tourDate).toISOString().split('T')[0]
    if (!bookingsByDate[dateKey]) bookingsByDate[dateKey] = []
    bookingsByDate[dateKey].push(b)
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
  const today = new Date().toISOString().split('T')[0]

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear

  const totalBookings = bookings.length
  const totalPax = bookings.reduce((s: number, b: any) => s + (b.paxCount || 0), 0)

  const STATUS_COLORS: Record<string, string> = {
    scheduled: '#3B82F6',
    in_progress: '#F59E0B',
    completed: '#10B981',
    cancelled: '#EF4444',
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: '#111' }}>
            {MONTHS[currentMonth]} {currentYear}
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: '#666' }}>
            {totalBookings} bookings · {totalPax} guests
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a href={`?month=${prevMonth}&year=${prevYear}`}
            style={navButtonStyle}>{'<'}</a>
          <a href={`?month=${now.getMonth()}&year=${now.getFullYear()}`}
            style={navButtonStyle}>Today</a>
          <a href={`?month=${nextMonth}&year=${nextYear}`}
            style={navButtonStyle}>{'>'}</a>
          <Link href="/admin/collections/tour-bookings/create"
            style={{ ...navButtonStyle, background: '#D4532B', color: 'white', border: 'none' }}>
            + New Booking
          </Link>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: '#E5E7EB', borderRadius: 8, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
        {DAYS.map(d => (
          <div key={d} style={{ background: '#F9FAFB', padding: '0.75rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase' }}>
            {d}
          </div>
        ))}

        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} style={{ background: 'white', minHeight: 100, padding: '0.25rem' }} />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const dateObj = new Date(currentYear, currentMonth, day)
          const dateKey = dateObj.toISOString().split('T')[0]
          const dayBookings = bookingsByDate[dateKey] || []
          const isToday = dateKey === today

          return (
            <div key={day} style={{
              background: 'white',
              minHeight: 100,
              padding: '0.25rem',
              borderLeft: isToday ? '3px solid #D4532B' : undefined,
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.25rem 0.5rem',
                fontWeight: isToday ? 700 : 400,
                color: isToday ? '#D4532B' : '#374151',
                fontSize: '0.85rem',
              }}>
                <span>{day}</span>
                {dayBookings.length > 0 && (
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{dayBookings.length}</span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 0.25rem' }}>
                {dayBookings.slice(0, 3).map((b: any) => (
                  <a key={b.id} href={`/admin/collections/tour-bookings/${b.id}`}
                    style={{
                      display: 'block', padding: '2px 4px', borderRadius: 3, cursor: 'pointer',
                      fontSize: '0.7rem', lineHeight: 1.3,
                      background: `${STATUS_COLORS[b.status] || '#6B7280'}15`,
                      color: STATUS_COLORS[b.status] || '#374151',
                      borderLeft: `3px solid ${STATUS_COLORS[b.status] || '#6B7280'}`,
                      textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                    {b.tour?.name?.substring(0, 20) || 'Tour'} · {b.paxCount}pax
                  </a>
                ))}
                {dayBookings.length > 3 && (
                  <span style={{ fontSize: '0.65rem', color: '#9CA3AF', paddingLeft: '0.25rem' }}>
                    +{dayBookings.length - 3} more
                  </span>
                )}
                {dayBookings.length === 0 && (
                  <a href={`/admin/collections/tour-bookings/create?tourDate=${dateKey}`}
                    style={{
                      display: 'block', padding: '2px 4px', borderRadius: 3, cursor: 'pointer',
                      fontSize: '0.65rem', color: '#9CA3AF', textDecoration: 'none', opacity: 0,
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseOut={(e) => (e.currentTarget.style.opacity = '0')}>
                    + Add
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem', color: '#6B7280' }}>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <span key={status}>
            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: color, marginRight: 4 }} />
            {status.replace('_', ' ')}
          </span>
        ))}
      </div>
    </div>
  )
}

const navButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: 6,
  border: '1px solid #D1D5DB',
  background: 'white',
  cursor: 'pointer',
  fontSize: '0.85rem',
  textDecoration: 'none',
  color: '#374151',
  fontWeight: 500,
}