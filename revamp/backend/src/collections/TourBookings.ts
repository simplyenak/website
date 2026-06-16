import type { CollectionConfig } from 'payload'

export const TourBookings: CollectionConfig = {
  slug: 'tour-bookings',
  admin: {
    useAsTitle: 'bookingRef',
    group: 'Operations',
    description: '📅 Specific tour instances — a tour on a date',
    defaultColumns: ['tour', 'tourDate', 'bookingRef', 'paxCount', 'channel', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'tour',
      type: 'relationship',
      relationTo: 'tours',
      required: true,
      admin: { description: 'Which tour offering' },
    },
    {
      name: 'tourDate',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' }, description: 'Date the tour runs' },
    },
    {
      name: 'tourTime',
      type: 'text',
      admin: { description: 'Pickup/start time (e.g. 10:00 AM)' },
    },
    {
      name: 'paxCount',
      type: 'number',
      required: true,
      min: 1,
      max: 20,
      admin: { description: 'Number of guests' },
    },
    {
      name: 'bookingRef',
      type: 'text',
      unique: true,
      admin: { description: 'Order reference (OR-XXXX or Stripe ID)' },
    },
    {
      name: 'channel',
      type: 'select',
      options: [
        { label: 'Direct (Website)', value: 'direct' },
        { label: 'Agency / B2B', value: 'agency' },
        { label: 'OTA (Viator, Klook)', value: 'ota' },
        { label: 'Private Booking', value: 'private' },
        { label: 'Corporate / Event', value: 'corporate' },
        { label: 'Manual / Walk-in', value: 'manual' },
      ],
      defaultValue: 'direct',
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'scheduled',
      admin: { position: 'sidebar' },
    },
    {
      name: 'privateBooking',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Special instructions, dietary needs, etc.' },
    },
  ],
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      return true // Guides can see bookings they're assigned to (filtered via relationship)
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return (user as any)?.role === 'admin'
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return (user as any)?.role === 'admin'
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return (user as any)?.role === 'admin'
    },
    admin: ({ req: { user } }) => {
      if (!user) return false
      return (user as any)?.role === 'admin'
    },
  },
  timestamps: true,
}