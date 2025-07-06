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

export interface PartnerPartner extends Struct.ComponentSchema {
  collectionName: 'components_partner_partners';
  info: {
    displayName: 'partner';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    name: Schema.Attribute.String &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<'partner'>;
    url: Schema.Attribute.String;
  };
}

export interface PaymentMethodPaymentMethod extends Struct.ComponentSchema {
  collectionName: 'components_payment_method_payment_methods';
  info: {
    displayName: 'paymentMethods';
  };
  attributes: {
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    name: Schema.Attribute.String &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<'Payment Methods Images'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'nav-items.item': NavItemsItem;
      'partner.partner': PartnerPartner;
      'payment-method.payment-method': PaymentMethodPaymentMethod;
    }
  }
}
