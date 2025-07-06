import type { Schema, Struct } from '@strapi/strapi';

export interface NavItemsItem extends Struct.ComponentSchema {
  collectionName: 'components_nav_items_items';
  info: {
    displayName: 'item';
    icon: 'bulletList';
  };
  attributes: {
    href: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'nav-items.item': NavItemsItem;
    }
  }
}
