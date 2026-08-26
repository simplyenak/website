// State guide image mapping
// Maps state slug -> cover image from SimplyEnak CDN or local assets
export const stateImages: Record<string, { src: string; alt: string }> = {
  // KL area
  'kl': {
    src: '/images/states/inside-pudu-laksa.jpg',
    alt: 'Inside Pudu Laksa in Kuala Lumpur'
  },
  'sekolah-tun-abdul-rahman': {
    src: '/images/states/kl-satay.jpg',
    alt: 'Satay in Kuala Lumpur'
  },
  
  // Penang
  'penang': {
    src: '/images/states/penang-laksa.jpg',
    alt: 'Penang Assam Laksa'
  },
  
  // Default placeholder
  '_default': {
    src: '/images/placeholder-food.jpg',
    alt: 'Malaysian food'
  }
};

// Dish-level images (optional - for detailed guides)
export const dishImages: Record<string, string> = {
  // KL
  'assam-laksa-pudu': '/images/dishes/pudu-laksa.jpg',
  'kl-laksa': '/images/dishes/kl-laksa.jpg',
  
  // Penang
  'penang-laksa': '/images/dishes/penang-laksa.jpg',
  'char-kway-teow': '/images/dishes/char-kway-teow.jpg',
  
  // Default fallback
  '_default': null
};

// Check if an image exists (for development)
export function hasStateImage(slug: string): boolean {
  return slug in stateImages && stateImages[slug] !== null;
}

export function hasDishImage(dishId: string): boolean {
  return dishImages[dishId] !== undefined && dishImages[dishId] !== null;
}
