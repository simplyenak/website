import type { CollectionConfig } from 'payload'

export const Claims: CollectionConfig = {
  slug: 'claims',
  admin: {
    useAsTitle: 'id',
    group: 'Operations',
    description: '💰 Guide expense claims (tour & business)',
    defaultColumns: ['claimType', 'expenseType', 'amount', 'status', 'expenseDate', 'createdAt'],
  },
  fields: [
    {
      name: 'claimType',
      type: 'select',
      required: true,
      defaultValue: 'tour',
      options: [
        { label: 'Tour Expense', value: 'tour' },
        { label: 'Business Expense', value: 'business' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Tour expenses link to a booking; business expenses do not',
      },
    },
    {
      name: 'expenseDate',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
        description: 'When the expense occurred',
      },
    },
    {
      name: 'assignment',
      type: 'relationship',
      relationTo: 'guide-assignments',
      index: true,
      admin: {
        description: 'Which tour assignment this claim is for',
        condition: (_, siblingData) => siblingData?.claimType === 'tour',
      },
    },
    {
      name: 'expenseType',
      type: 'select',
      required: true,
      options: [
        { label: 'Food & Beverage', value: 'food_beverage' },
        { label: 'Alcoholic Drinks', value: 'alcoholic_drinks' },
        { label: 'Miscellaneous', value: 'miscellaneous' },
        { label: 'Logistics / Transport', value: 'logistics' },
        { label: 'Guide Fee', value: 'guide_fee' },
        { label: 'Advance (to guide)', value: 'advance' },
        { label: 'Other', value: 'other' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0,
      admin: { description: 'Amount in MYR' },
    },
    {
      name: 'receipt',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: { description: 'Upload receipt photo' },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'What was this expense for?' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Paid', value: 'paid' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Draft → Pending → Approved/Rejected → Paid',
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      admin: { description: 'Admin notes (rejection reason, payment reference)' },
    },
    {
      name: 'paidDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'When this claim was paid',
        date: { pickerAppearance: 'dayOnly' },
        condition: (_, siblingData) => siblingData?.status === 'paid',
      },
    },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        { label: 'Payroll Batch', value: 'payroll' },
        { label: 'Emergency Payment', value: 'emergency' },
      ],
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData?.status === 'paid',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc, operation }) => {
        if (operation !== 'update') return data

        if (data?.status === 'paid' && originalDoc?.status !== 'paid') {
          data.paidDate = new Date().toISOString()
        }

        if (originalDoc?.status === 'paid' && data?.status && data?.status !== 'paid') {
          data.paidDate = null
          data.paymentMethod = null
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        if (
          operation === 'update' &&
          doc?.status === 'approved' &&
          previousDoc?.status !== 'approved'
        ) {
          const webhookUrl = `https://pyrunner.system.simplyenak.com/webhook/30af4a2d5d4249b19aa3414c71af4d4b/`
          const body = JSON.stringify({ claimId: doc.id })
          try {
            await fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body,
            })
          } catch (e) {
            console.error('Claim sync webhook failed:', e)
          }
        }
      },
    ],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      return true
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      const u = user as any
      return u.role === 'admin' || u.role === 'guide'
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return true
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
