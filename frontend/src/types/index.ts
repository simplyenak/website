export interface Media {
  url: string
  name: string
}
export interface Button {
  title: string
  href: string
  buttonType?:
    | 'primary'
    | 'secondary'
    | 'primary-btn'
    | 'secondary-btn'
    | 'primary-btn-small'
    | 'secondary-btn-small'
    | 'tab-primary-btn'
    | 'tab-secondary-btn'
  icon?: {
    name: string
  }
}
export interface NavItem {
  href: string
  name: string
}
export interface Header {
  logo: Media
  navItems: NavItem[]
}

export interface Footer {
  logo: Media
  phoneNumber: string
  email: string
  partners: { url: string; image: Media }[]
  paymentMethods: Media[]
  quickLinks: NavItem[]
  copyrightText: string
}

export interface HeroSection {
  title: string
  subTitle: string
  bgImage: Media
  buttons: Button[]
}
export interface PartnersSection {
  partnersImages: Media[]
}
export interface AboutSection {
  title: string
  subTitle: string
  description: string
  image: Media
}
