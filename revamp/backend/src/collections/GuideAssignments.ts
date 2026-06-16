import type { CollectionConfig } from 'payload'

export const GuideAssignments: CollectionConfig = {
  slug: 'guide-assignments',
  admin: {
    useAsTitle: 'id',
    group: 'Operations',
    description: '🔗 Which guides are assigned to which tour bookings',
    defaultColumns: ['guide', 'booking', 'role', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'guide',
      type: 'relationship',
      relationTo: 'guides',
      required: true,
      index: true,
      admin: { description: 'Guide assigned to this booking' },
    },
    {
      name: 'booking',
      type: 'relationship',
      relationTo: 'tour-bookings',
      required: true,
      index: true,
      admin: { description: 'The tour booking' },
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Lead Guide', value: 'lead' },
        { label: 'Assistant Guide', value: 'assistant' },
      ],
      defaultValue: 'lead',
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Pending', value: 'pending' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
      admin: { position: 'sidebar' },
    },
  ],
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      const u = user as any
      if (u.role === 'admin') return true
      return { guide: { equals: u.id } }
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
  // Prevent duplicate assignments
  indexes: [
    {
      fields: ['guide', 'booking'],
      unique: true,
    },
  ],
}