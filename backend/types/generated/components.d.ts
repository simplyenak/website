import type { Schema, Struct } from '@strapi/strapi';

export interface ButtonButton extends Struct.ComponentSchema {
  collectionName: 'components_button_buttons';
  info: {
    displayName: 'button';
  };
  attributes: {
    buttonType: Schema.Attribute.Enumeration<
      [
        'primary-btn',
        'secondary-btn',
        'primary-btn-small',
        'secondary-btn-small',
        'tab-primary-btn',
        'tab-secondary-btn',
      ]
    > &
      Schema.Attribute.DefaultTo<'primary-btn'>;
    href: Schema.Attribute.String;
    icon: Schema.Attribute.Component<'icon.icon', false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CardsOurValuesCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_our_values_cards';
  info: {
    displayName: 'Our Values Card';
  };
  attributes: {
    description: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.Component<'icon.icon', false> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CardsStoriesCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_stories_cards';
  info: {
    displayName: 'Stories Card';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    link: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CardsTestimonialsCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_testimonials_cards';
  info: {
    displayName: 'Testimonials Card';
  };
  attributes: {
    country: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    review: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomePageAboutSection extends Struct.ComponentSchema {
  collectionName: 'components_home_page_about_sections';
  info: {
    displayName: 'About Section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    subTitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomePageHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_home_page_hero_sections';
  info: {
    displayName: 'Hero Section';
  };
  attributes: {
    bgImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    buttons: Schema.Attribute.Component<'button.button', true>;
    subTitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomePageMediaSection extends Struct.ComponentSchema {
  collectionName: 'components_home_page_media_sections';
  info: {
    displayName: 'Media Section';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
    videoEmbedUrl: Schema.Attribute.Text;
  };
}

export interface HomePageOurToursSection extends Struct.ComponentSchema {
  collectionName: 'components_home_page_our_tours_sections';
  info: {
    displayName: 'Our Tours Section';
  };
  attributes: {
    button: Schema.Attribute.Component<'button.button', false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomePageOurValuesSection extends Struct.ComponentSchema {
  collectionName: 'components_home_page_our_values_sections';
  info: {
    displayName: 'Our Values Section';
  };
  attributes: {
    bgImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'cards.our-values-card', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomePagePartnersSection extends Struct.ComponentSchema {
  collectionName: 'components_home_page_partners_sections';
  info: {
    displayName: 'Partners Section';
  };
  attributes: {
    partnersImages: Schema.Attribute.Media<'images', true> &
      Schema.Attribute.Required;
    SectionName: Schema.Attribute.String &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<'Partners Section'>;
  };
}

export interface HomePageStoriesSection extends Struct.ComponentSchema {
  collectionName: 'components_home_page_stories_sections';
  info: {
    displayName: 'Stories Section';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomePageTestimonialsSection extends Struct.ComponentSchema {
  collectionName: 'components_home_page_testimonials_sections';
  info: {
    displayName: 'Testimonials Section';
  };
  attributes: {
    cards: Schema.Attribute.Component<'cards.testimonials-card', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface IconIcon extends Struct.ComponentSchema {
  collectionName: 'components_icon_icons';
  info: {
    displayName: 'Icon';
  };
  attributes: {
    name: Schema.Attribute.Enumeration<
      [
        'icon-arrow-right',
        'icon-camera',
        'icon-check',
        'icon-checkout',
        'icon-clock',
        'icon-close',
        'icon-envelope',
        'icon-facebook',
        'icon-heart',
        'icon-instagram',
        'icon-menu',
        'icon-money',
        'icon-multicircle',
        'icon-paper-rocket',
        'icon-phone',
        'icon-reload',
        'icon-search',
        'icon-thumb-right',
        'icon-thumbs-up',
        'icon-user',
        'icon-whatsapp',
        'icon-youtube',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'icon-check'>;
  };
}

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
      'button.button': ButtonButton;
      'cards.our-values-card': CardsOurValuesCard;
      'cards.stories-card': CardsStoriesCard;
      'cards.testimonials-card': CardsTestimonialsCard;
      'home-page.about-section': HomePageAboutSection;
      'home-page.hero-section': HomePageHeroSection;
      'home-page.media-section': HomePageMediaSection;
      'home-page.our-tours-section': HomePageOurToursSection;
      'home-page.our-values-section': HomePageOurValuesSection;
      'home-page.partners-section': HomePagePartnersSection;
      'home-page.stories-section': HomePageStoriesSection;
      'home-page.testimonials-section': HomePageTestimonialsSection;
      'icon.icon': IconIcon;
      'nav-items.item': NavItemsItem;
      'partner.partner': PartnerPartner;
      'payment-method.payment-method': PaymentMethodPaymentMethod;
    }
  }
}
