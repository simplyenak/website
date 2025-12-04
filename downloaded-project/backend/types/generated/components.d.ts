import type { Schema, Struct } from '@strapi/strapi';

export interface AboutPageTextWithLeftRightImage
  extends Struct.ComponentSchema {
  collectionName: 'components_about_page_text_with_left_right_images';
  info: {
    displayName: 'Text With LeftRight Image';
  };
  attributes: {
    bgColor: Schema.Attribute.String;
    contents: Schema.Attribute.Blocks & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right']>;
    title: Schema.Attribute.String;
  };
}

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
    title: Schema.Attribute.String;
  };
}

export interface CardsCategory extends Struct.ComponentSchema {
  collectionName: 'components_cards_categories';
  info: {
    displayName: 'category';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
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

export interface CardsToursCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_tours_cards';
  info: {
    displayName: 'ToursCard';
  };
  attributes: {
    buttons: Schema.Attribute.Component<'button.button', true>;
    class: Schema.Attribute.String;
    duration: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.String;
    price: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface CardsVideosId extends Struct.ComponentSchema {
  collectionName: 'components_cards_videos_ids';
  info: {
    displayName: 'videosId';
  };
  attributes: {
    youtubeVideoId: Schema.Attribute.String;
  };
}

export interface ContactGetInTouchSection extends Struct.ComponentSchema {
  collectionName: 'components_contact_get_in_touch_sections';
  info: {
    displayName: 'Get In Touch Section';
  };
  attributes: {
    contents: Schema.Attribute.Blocks & Schema.Attribute.Required;
    formEmbedUrl: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String;
  };
}

export interface CtaSectionCtaSection extends Struct.ComponentSchema {
  collectionName: 'components_cta_section_cta_sections';
  info: {
    displayName: 'CTA Section';
  };
  attributes: {
    phoneNumber: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface EmbeddedVideoEmbeddedVideo extends Struct.ComponentSchema {
  collectionName: 'components_embedded_video_embedded_videos';
  info: {
    displayName: 'Embedded Video';
  };
  attributes: {
    aspectRatio: Schema.Attribute.Enumeration<['16:9', '4:3', '1:1']> &
      Schema.Attribute.DefaultTo<'16:9'>;
    iframeSrc: Schema.Attribute.String & Schema.Attribute.Required;
    playButtonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Play Video'>;
    poster: Schema.Attribute.Media<'images'>;
    showPlayButton: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String;
  };
}

export interface GlobalHeroGlobalHero extends Struct.ComponentSchema {
  collectionName: 'components_global_hero_global_heroes';
  info: {
    displayName: 'Global Hero';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    objectPosition: Schema.Attribute.Enumeration<
      [
        'object-center',
        'object-top',
        'object-bottom',
        'object-left',
        'object-right',
        'object-left-top',
        'object-left-bottom',
        'object-right-top',
        'object-right-bottom',
        'object-top-left',
        'object-top-right',
        'object-bottom-left',
        'object-bottom-right',
      ]
    > &
      Schema.Attribute.DefaultTo<'object-center'>;
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
    description: 'Icon component for displaying icons';
    displayName: 'icon';
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
      Schema.Attribute.Required;
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

export interface SeoSeo extends Struct.ComponentSchema {
  collectionName: 'components_seo_seos';
  info: {
    displayName: 'SEO';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    schema: Schema.Attribute.JSON;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Simply Enak \u2013 Food Tours and more'>;
  };
}

export interface SocialLinkSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_social_link_social_links';
  info: {
    displayName: 'socialLink';
  };
  attributes: {
    href: Schema.Attribute.String;
    icon: Schema.Attribute.Component<'icon.icon', false> &
      Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Private;
  };
}

export interface StoriesDetailsAboutSimplyEnakSection
  extends Struct.ComponentSchema {
  collectionName: 'components_stories_details_about_simply_enak_sections';
  info: {
    displayName: 'About Simply Enak Section';
  };
  attributes: {
    contents: Schema.Attribute.Blocks & Schema.Attribute.Required;
    socialItems: Schema.Attribute.Component<'social-link.social-link', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface StoriesDetailsAuthonSection extends Struct.ComponentSchema {
  collectionName: 'components_stories_details_authon_sections';
  info: {
    displayName: 'Authon Section';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    possition: Schema.Attribute.String;
  };
}

export interface StoriesDetailsStoriesDetailsContents
  extends Struct.ComponentSchema {
  collectionName: 'components_stories_details_stories_details_contents';
  info: {
    displayName: 'Stories Details Contents';
  };
  attributes: {
    contents: Schema.Attribute.Blocks & Schema.Attribute.Required;
    embededVideo: Schema.Attribute.Component<
      'embedded-video.embedded-video',
      false
    >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    video: Schema.Attribute.Component<'video.video', false> &
      Schema.Attribute.Required;
    videoType: Schema.Attribute.Enumeration<['local', 'embeded']>;
  };
}

export interface StoriesDetailsStoriesDetailsHero
  extends Struct.ComponentSchema {
  collectionName: 'components_stories_details_stories_details_heroes';
  info: {
    displayName: 'Stories Details Hero';
  };
  attributes: {
    bgImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
  };
}

export interface TourDetailsTourDetailsContents extends Struct.ComponentSchema {
  collectionName: 'components_tour_details_tour_details_contents';
  info: {
    displayName: 'Tour Details Contents';
  };
  attributes: {
    contents: Schema.Attribute.Blocks & Schema.Attribute.Required;
    embededVideo: Schema.Attribute.Component<
      'embedded-video.embedded-video',
      false
    >;
    video: Schema.Attribute.Component<'video.video', false>;
    videoType: Schema.Attribute.Enumeration<['local', 'embeded']>;
  };
}

export interface TourDetailsTourDetailsHero extends Struct.ComponentSchema {
  collectionName: 'components_tour_details_tour_details_heroes';
  info: {
    displayName: 'Tour Details Hero';
  };
  attributes: {
    duration: Schema.Attribute.String & Schema.Attribute.Required;
    experienceType: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'> &
      Schema.Attribute.Required;
    location: Schema.Attribute.String & Schema.Attribute.Required;
    maxParticipants: Schema.Attribute.Integer;
    price: Schema.Attribute.String & Schema.Attribute.Required;
    time: Schema.Attribute.String;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
  };
}

export interface ToursOtherBookingSection extends Struct.ComponentSchema {
  collectionName: 'components_tours_other_booking_sections';
  info: {
    displayName: 'Other Booking Section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    isBookingButton: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String;
  };
}

export interface ToursToursCardsSection extends Struct.ComponentSchema {
  collectionName: 'components_tours_tours_cards_sections';
  info: {
    displayName: 'Tours Cards Section';
  };
  attributes: {
    text: Schema.Attribute.Text;
  };
}

export interface VideoVideo extends Struct.ComponentSchema {
  collectionName: 'components_video_videos';
  info: {
    displayName: 'Video';
  };
  attributes: {
    autoplay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    controls: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    description: Schema.Attribute.Text;
    fileType: Schema.Attribute.Enumeration<['upload', 'external']> &
      Schema.Attribute.DefaultTo<'external'>;
    loop: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    muted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    poster: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    videoFile: Schema.Attribute.Media<'videos'> & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about-page.text-with-left-right-image': AboutPageTextWithLeftRightImage;
      'button.button': ButtonButton;
      'cards.category': CardsCategory;
      'cards.our-values-card': CardsOurValuesCard;
      'cards.stories-card': CardsStoriesCard;
      'cards.testimonials-card': CardsTestimonialsCard;
      'cards.tours-card': CardsToursCard;
      'cards.videos-id': CardsVideosId;
      'contact.get-in-touch-section': ContactGetInTouchSection;
      'cta-section.cta-section': CtaSectionCtaSection;
      'embedded-video.embedded-video': EmbeddedVideoEmbeddedVideo;
      'global-hero.global-hero': GlobalHeroGlobalHero;
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
      'seo.seo': SeoSeo;
      'social-link.social-link': SocialLinkSocialLink;
      'stories-details.about-simply-enak-section': StoriesDetailsAboutSimplyEnakSection;
      'stories-details.authon-section': StoriesDetailsAuthonSection;
      'stories-details.stories-details-contents': StoriesDetailsStoriesDetailsContents;
      'stories-details.stories-details-hero': StoriesDetailsStoriesDetailsHero;
      'tour-details.tour-details-contents': TourDetailsTourDetailsContents;
      'tour-details.tour-details-hero': TourDetailsTourDetailsHero;
      'tours.other-booking-section': ToursOtherBookingSection;
      'tours.tours-cards-section': ToursToursCardsSection;
      'video.video': VideoVideo;
    }
  }
}
