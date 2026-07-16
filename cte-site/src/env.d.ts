/// <reference types="astro/client" />

export interface PageProps {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  canonicalURL?: string;
  noindex?: boolean;
}
