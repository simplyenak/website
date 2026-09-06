// State guide image mapping — only real photographs are listed.
// The former 16-entry map pointed at 16 byte-identical placeholder JPEGs;
// those were removed. States without an entry render a branded tile instead.
export const stateImages: Record<string, { src: string; alt: string }> = {
  penang: {
    src: '/images/covers/penang.jpg',
    alt: 'Street food stalls in George Town, Penang',
  },
  'kuala-lumpur': {
    src: '/images/covers/kl.jpg',
    alt: 'Street food in Kuala Lumpur',
  },
  melaka: {
    src: '/images/covers/melaka.svg',
    alt: 'Melaka Food Checklist',
  },
};

// Dish-level images are not shipped yet; map kept empty so hasDishImage()
// returns false everywhere instead of pointing at missing files.
export const dishImages: Record<string, string | null> = {};

export function hasStateImage(slug: string): boolean {
  return slug in stateImages;
}

export function hasDishImage(dishId: string): boolean {
  return dishImages[dishId] !== undefined && dishImages[dishId] !== null;
}
