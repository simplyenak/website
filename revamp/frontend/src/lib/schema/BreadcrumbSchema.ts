import { z } from 'zod';

/**
 * BreadcrumbList schema for Simply Enak
 * Based on schema.org/BreadcrumbList
 */
export interface BreadcrumbListSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: {
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }[];
}

/**
 * Creates a BreadcrumbList schema object
 * @param breadcrumbs - Array of breadcrumb objects with name and href
 * @param currentUrl - The current page URL (for the last item)
 * @returns BreadcrumbListSchema object
 */
export function createBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; href: string }>,
  currentUrl: string
): BreadcrumbListSchema {
  const itemListElement = breadcrumbs
    .map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.href
    }))
    .concat({
      "@type": "ListItem",
      position: breadcrumbs.length + 1,
      name: breadcrumbs[breadcrumbs.length - 1]?.name || 'Home',
      item: currentUrl
    });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement
  };
}

/**
 * Zod schema for validation
 */
export const breadcrumbSchema = z.object({
  "@context": z.literal("https://schema.org"),
  "@type": z.literal("BreadcrumbList"),
  itemListElement: z.array(
    z.object({
      "@type": z.literal("ListItem"),
      position: z.number().int().positive(),
      name: z.string(),
      item: z.string().url()
    })
  ).nonempty()
});

export type { BreadcrumbListSchema };