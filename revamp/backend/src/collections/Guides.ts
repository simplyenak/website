import type { CollectionConfig } from 'payload'

export const Guides: CollectionConfig = {
  slug: 'guides',
  admin: {
    useAsTitle: 'name',
    group: 'Operations',
    description: '👤 Tour guides who submit expense claims',
    defaultColumns: ['name', 'email', 'phone', 'isActive', 'createdAt'],
  },
  auth: {
    tokenExpiration: 604800,
    maxLoginAttempts: 5,
    lockTime: 600000,
    verify: false,
    forgotPassword: {
      generateEmailSubject: () => 'Simply Enak - Guide Portal Access',
      generateEmailHTML: (args: any) => {
        const url = `${process.env.PAYLOAD_PUBLIC_URL || 'http://localhost:3000'}/guides/reset/${args?.token}`
        const name = args?.user?.name || 'there'
        return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:600px;margin:2rem auto">
          <h2 style="color:#D4532B">Simply Enak</h2>
          <p>Hi ${name},</p>
          <p>Click below to set up your guide portal password:</p>
          <a href="${url}" style="display:inline-block;background:#D4532B;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:1rem 0">Set Password</a>
          <p style="color:#666;font-size:0.9em">This link expires in 24 hours.</p>
        </body></html>`
      },
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Guide full name', position: 'sidebar' },
    },
    {
      name: 'phone',
      type: 'text',
      admin: { description: 'Contact number', position: 'sidebar' },
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Guide', value: 'guide' },
        { label: 'Admin', value: 'admin' },
      ],
      defaultValue: 'guide',
      required: true,
      admin: { position: 'sidebar' },
      saveToJWT: true,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Inactive guides cannot submit claims' },
    },
    {
      name: 'paymentInfo',
      type: 'group',
      fields: [
        { name: 'bankName', type: 'text' },
        { name: 'accountNumber', type: 'text' },
        { name: 'accountHolder', type: 'text' },
      ],
      admin: { description: 'Bank details for payroll payments' },
    },
  ],
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      const u = user as any
      return u.role === 'admin' ? true : { id: { equals: u.id } }
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return (user as any)?.role === 'admin'
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      const u = user as any
      return u.role === 'admin' ? true : { id: { equals: u.id } }
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