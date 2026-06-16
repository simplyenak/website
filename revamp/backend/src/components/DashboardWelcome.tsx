'use client'
import * as React from 'react'
import { useConfig } from '@payloadcms/ui'

export const DashboardWelcome: React.FC = () => {
  const { config } = useConfig()

  return (
    <div style={{ padding: '1.5rem', background: 'var(--theme-input-bg)', borderRadius: '8px', marginBottom: '1.5rem' }}>
      <h2 style={{ margin: '0 0 1rem 0' }}>👋 Welcome to Simply Enak CMS</h2>
      <p style={{ margin: '0 0 1rem 0', color: 'var(--theme-text)', opacity: 0.8 }}>
        Manage your tour content, landing pages, and site settings from one place.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: 'var(--theme-bg)', borderRadius: '4px' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--theme-text)', opacity: 0.7 }}>Quick Actions</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
            <li><a href="/admin/collections/tours" style={{ color: 'var(--theme-elevation-100)' }}>Create New Tour</a></li>
            <li><a href="/admin/collections/stories" style={{ color: 'var(--theme-elevation-100)' }}>Write Story</a></li>
            <li><a href="/admin/collections/faqs" style={{ color: 'var(--theme-elevation-100)' }}>Add FAQ</a></li>
          </ul>
        </div>
        
        <div style={{ padding: '1rem', background: 'var(--theme-bg)', borderRadius: '4px' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--theme-text)', opacity: 0.7 }}>Content Collections</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
            <li><a href="/admin/collections/tours" style={{ color: 'var(--theme-elevation-100)' }}>Tours</a></li>
            <li><a href="/admin/collections/stories" style={{ color: 'var(--theme-elevation-100)' }}>Stories</a></li>
            <li><a href="/admin/collections/testimonials" style={{ color: 'var(--theme-elevation-100)' }}>Testimonials</a></li>
          </ul>
        </div>
        
        <div style={{ padding: '1rem', background: 'var(--theme-bg)', borderRadius: '4px' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--theme-text)', opacity: 0.7 }}>Need Help?</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
            <li style={{ color: 'var(--theme-elevation-100)' }}>Contact dev team</li>
            <li style={{ color: 'var(--theme-elevation-100)' }}>View docs</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
