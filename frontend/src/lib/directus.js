/**
 * Directus API Client for Simply Enak
 * 
 * Usage:
 * import { directus, getDietaryLandingPageBySlug, getAllTours } from '@/lib/directus';
 */

import { createDirectus, rest, readItems, readSingleton, readItem } from '@directus/sdk';

// Directus instance
const directusUrl = import.meta.env.PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export const directus = createDirectus(directusUrl).with(rest());

// ============================================
// DIETARY LANDING PAGES
// ============================================

export async function getDietaryLandingPageBySlug(slug) {
  try {
    const pages = await directus.request(readItems('dietary_landing_pages', {
      filter: { slug: { _eq: slug } },
      limit: 1
    }));
    return pages[0] || null;
  } catch (error) {
    console.error('Error fetching dietary landing page:', error);
    return null;
  }
}

export async function getAllDietaryLandingPages() {
  try {
    return await directus.request(readItems('dietary_landing_pages', {
      filter: { status: { _eq: 'published' } },
      sort: ['dietary_name']
    }));
  } catch (error) {
    console.error('Error fetching dietary landing pages:', error);
    return [];
  }
}

// ============================================
// LOCATION LANDING PAGES
// ============================================

export async function getLocationLandingPageBySlug(slug) {
  try {
    const pages = await directus.request(readItems('location_landing_pages', {
      filter: { slug: { _eq: slug } },
      limit: 1
    }));
    return pages[0] || null;
  } catch (error) {
    console.error('Error fetching location landing page:', error);
    return null;
  }
}

export async function getAllLocationLandingPages() {
  try {
    return await directus.request(readItems('location_landing_pages', {
      filter: { status: { _eq: 'published' } },
      sort: ['location_name']
    }));
  } catch (error) {
    console.error('Error fetching location landing pages:', error);
    return [];
  }
}

// ============================================
// TRAVEL TYPE LANDING PAGES
// ============================================

export async function getTravelTypeLandingPageBySlug(slug) {
  try {
    const pages = await directus.request(readItems('travel_type_landing_pages', {
      filter: { slug: { _eq: slug } },
      limit: 1
    }));
    return pages[0] || null;
  } catch (error) {
    console.error('Error fetching travel type landing page:', error);
    return null;
  }
}

export async function getAllTravelTypeLandingPages() {
  try {
    return await directus.request(readItems('travel_type_landing_pages', {
      filter: { status: { _eq: 'published' } },
      sort: ['travel_type_name']
    }));
  } catch (error) {
    console.error('Error fetching travel type landing pages:', error);
    return [];
  }
}

// ============================================
// SPECIALTY LANDING PAGES
// ============================================

export async function getSpecialtyLandingPageBySlug(slug) {
  try {
    const pages = await directus.request(readItems('specialty_landing_pages', {
      filter: { slug: { _eq: slug } },
      limit: 1
    }));
    return pages[0] || null;
  } catch (error) {
    console.error('Error fetching specialty landing page:', error);
    return null;
  }
}

export async function getAllSpecialtyLandingPages() {
  try {
    return await directus.request(readItems('specialty_landing_pages', {
      filter: { status: { _eq: 'published' } },
      sort: ['specialty_name']
    }));
  } catch (error) {
    console.error('Error fetching specialty landing pages:', error);
    return [];
  }
}

// ============================================
// TOURS
// ============================================

export async function getTourBySlug(slug) {
  try {
    const tours = await directus.request(readItems('tours', {
      filter: { slug: { _eq: slug } },
      limit: 1
    }));
    return tours[0] || null;
  } catch (error) {
    console.error('Error fetching tour:', error);
    return null;
  }
}

export async function getAllTours(options = {}) {
  try {
    return await directus.request(readItems('tours', {
      filter: { status: { _eq: 'published' } },
      sort: ['name'],
      ...options
    }));
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

export async function getToursByDietary(dietarySlug) {
  try {
    // First get the dietary page to find compatible tours
    const dietaryPage = await getDietaryLandingPageBySlug(dietarySlug);
    if (!dietaryPage || !dietaryPage.compatible_tours) {
      return [];
    }
    
    // Fetch the compatible tours
    const tourIds = dietaryPage.compatible_tours;
    if (!tourIds || tourIds.length === 0) {
      return [];
    }
    
    return await directus.request(readItems('tours', {
      filter: { 
        id: { _in: tourIds },
        status: { _eq: 'published' }
      }
    }));
  } catch (error) {
    console.error('Error fetching tours by dietary:', error);
    return [];
  }
}

export async function getToursByLocation(locationSlug) {
  try {
    const locationPage = await getLocationLandingPageBySlug(locationSlug);
    if (!locationPage || !locationPage.featured_tours) {
      // Fallback: filter by location string
      return await directus.request(readItems('tours', {
        filter: { 
          status: { _eq: 'published' },
          location: { _contains: locationPage?.location_name || '' }
        }
      }));
    }
    
    const tourIds = locationPage.featured_tours;
    return await directus.request(readItems('tours', {
      filter: { 
        id: { _in: tourIds },
        status: { _eq: 'published' }
      }
    }));
  } catch (error) {
    console.error('Error fetching tours by location:', error);
    return [];
  }
}

export async function getToursByTravelType(travelTypeSlug) {
  try {
    const travelTypePage = await getTravelTypeLandingPageBySlug(travelTypeSlug);
    if (!travelTypePage || !travelTypePage.suitable_tours) {
      return [];
    }
    
    const tourIds = travelTypePage.suitable_tours;
    return await directus.request(readItems('tours', {
      filter: { 
        id: { _in: tourIds },
        status: { _eq: 'published' }
      }
    }));
  } catch (error) {
    console.error('Error fetching tours by travel type:', error);
    return [];
  }
}

export async function getToursBySpecialty(specialtySlug) {
  try {
    const specialtyPage = await getSpecialtyLandingPageBySlug(specialtySlug);
    if (!specialtyPage || !specialtyPage.featured_tours) {
      return [];
    }
    
    const tourIds = specialtyPage.featured_tours;
    return await directus.request(readItems('tours', {
      filter: { 
        id: { _in: tourIds },
        status: { _eq: 'published' }
      }
    }));
  } catch (error) {
    console.error('Error fetching tours by specialty:', error);
    return [];
  }
}

export async function getFeaturedTours() {
  try {
    return await directus.request(readItems('tours', {
      filter: { 
        status: { _eq: 'published' },
        featured: { _eq: true }
      },
      limit: 6
    }));
  } catch (error) {
    console.error('Error fetching featured tours:', error);
    return [];
  }
}

// ============================================
// HOME PAGE
// ============================================

export async function getHomePage() {
  try {
    return await directus.request(readSingleton('home_page'));
  } catch (error) {
    console.error('Error fetching home page:', error);
    return null;
  }
}

// ============================================
// SITE SETTINGS
// ============================================

export async function getSiteSettings() {
  try {
    return await directus.request(readSingleton('site_settings'));
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

// ============================================
// STORIES (BLOG)
// ============================================

export async function getStoryBySlug(slug) {
  try {
    const stories = await directus.request(readItems('stories', {
      filter: { slug: { _eq: slug } },
      limit: 1
    }));
    return stories[0] || null;
  } catch (error) {
    console.error('Error fetching story:', error);
    return null;
  }
}

export async function getAllStories(options = {}) {
  try {
    return await directus.request(readItems('stories', {
      filter: { status: { _eq: 'published' } },
      sort: ['-published_at'],
      ...options
    }));
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
}

export async function getFeaturedStories() {
  try {
    return await directus.request(readItems('stories', {
      filter: { 
        status: { _eq: 'published' },
        featured: { _eq: true }
      },
      sort: ['-published_at'],
      limit: 3
    }));
  } catch (error) {
    console.error('Error fetching featured stories:', error);
    return [];
  }
}

export async function getStoriesByCategory(category) {
  try {
    return await directus.request(readItems('stories', {
      filter: { 
        status: { _eq: 'published' },
        category: { _eq: category }
      },
      sort: ['-published_at']
    }));
  } catch (error) {
    console.error('Error fetching stories by category:', error);
    return [];
  }
}

// ============================================
// TESTIMONIALS
// ============================================

export async function getFeaturedTestimonials() {
  try {
    return await directus.request(readItems('testimonials', {
      filter: { 
        featured: { _eq: true },
        verified: { _eq: true }
      },
      sort: ['-date'],
      limit: 6
    }));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

// ============================================
// IMAGE URLS
// ============================================

export function getImageUrl(fileId, options = {}) {
  if (!fileId) return null;
  
  // If it's already a full URL (S3 or external), return as is
  if (fileId.startsWith('http://') || fileId.startsWith('https://')) {
    return fileId;
  }
  
  // If it's a local path (starts with /), use it directly
  if (fileId.startsWith('/')) {
    return fileId;
  }
  
  // Otherwise, it's a Directus file ID - use Directus assets endpoint
  const params = new URLSearchParams();
  if (options.width) params.set('width', options.width);
  if (options.height) params.set('height', options.height);
  if (options.fit) params.set('fit', options.fit);
  if (options.quality) params.set('quality', options.quality);
  
  const queryString = params.toString();
  return `${directusUrl}/assets/${fileId}${queryString ? `?${queryString}` : ''}`;
}

// Helper to convert staging image paths to local paths
export function getLocalImagePath(imagePath) {
  if (!imagePath) return null;
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Convert staging paths like /images/kl-chow-kit-market.jpg to local paths
  // Images should be placed in /public/images/
  return imagePath;
}
