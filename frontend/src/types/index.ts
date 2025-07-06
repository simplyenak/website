export interface Header {
  logo: {
    url: string
    name: string
  }
  navItems: Array<{
    href: string
    name: string
  }>
}
