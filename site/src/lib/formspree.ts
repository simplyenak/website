/**
 * Formspree endpoints.
 * NOTE (2026-08-26): form xjkyqvpz returns 404 FORM_NOT_FOUND at Formspree;
 * every contact submission site-wide fails until this ID is replaced.
 * Swap the ID here once; all 11 call sites pick it up.
 */
export const CONTACT_FORM_URL = 'https://formspree.io/f/xjkyqvpz';
