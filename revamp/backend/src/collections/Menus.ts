import type { CollectionConfig } from 'payload'
import { triggerStagingDeploy } from '../hooks/deployTrigger'

export const Menus: CollectionConfig = {
  slug: 'menus',
  localization: true,
  admin: {
    group: 'Settings & Config',
    description: '🧭 Manage site navigation menus',
    useAsTitle: 'name',
    defaultColumns: ['name', 'location', 'itemCount', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
            admin: {
        description: 'Menu name (e.g., "Main Navigation", "Footer Menu")',
      },
    },
    {
      name: 'location',
      type: 'select',
      options: [
        { label: 'Top / Header Menu', value: 'top' },
        { label: 'Mobile Menu', value: 'mobile' },
        { label: 'Footer Menu', value: 'footer' },
        { label: 'Sub Page Menu', value: 'sub_page' },
      ],
      required: true,
      admin: {
        description: 'Where this menu appears on the site',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
            admin: {
        description: 'Menu items — label and URL for each link',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
            placeholder: '/tours or https://external.com',
          },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          admin: {
            width: '25%',
          },
        },
        {
          name: 'order',
          type: 'number',
          admin: {
            width: '25%',
            description: 'Display order (lower = first)',
          },
        },
      ],
    },
    {
      name: 'itemCount',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Auto-calculated from items array',
        hidden: false,
      },
    },
  ],
  hooks: {
    afterChange: [triggerStagingDeploy],
    beforeChange: [
      ({ data }) => {
        if (data?.items) {
          data.itemCount = data.items.length
        }
        return data
      },
    ],
  },
}
