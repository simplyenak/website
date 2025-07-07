export interface Media {
  url: string
  name: string
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
