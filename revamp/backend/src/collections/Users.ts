import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Settings & Config',
    description: '👤 User accounts and authentication',
  },
  auth: true,
  fields: [
    // Email added by default
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Content Editor', value: 'editor' },
        { label: 'Translator', value: 'translator' },
        { label: 'Reviewer', value: 'reviewer' },
      ],
      defaultValue: 'editor',
      required: true,
      admin: {
        description: 'User role determines what they can access and edit',
        position: 'sidebar',
      },
    },
    {
      name: 'fullName',
      type: 'text',
      admin: {
        description: 'Full name for display',
        position: 'sidebar',
      },
    },
    {
      name: 'department',
      type: 'text',
      admin: {
        description: 'Department or team (e.g., Marketing, Translations)',
        position: 'sidebar',
      },
    },
  ],
  access: {
    // Anyone can read users (for author selection)
    read: () => true,
    // Only admins can create users
    create: ({ req: { user } }) => (user as any)?.role === 'admin',
    // Only admins can update users
    update: ({ req: { user } }) => (user as any)?.role === 'admin',
    // Only admins can delete users
    delete: ({ req: { user } }) => (user as any)?.role === 'admin',
  },
}
