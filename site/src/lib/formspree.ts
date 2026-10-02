/**
 * Contact form endpoint (all call sites).
 *
 * SELF-HOSTED (2026-10-02): previously Formspree (form xjkyqvpz) which 404'd
 * FORM_NOT_FOUND for over a month. Now a RELATIVE same-origin path served by the
 * Cloudflare Worker (`/api/contact` -> POSTs to the Pyrunner `contact-form`
 * webhook -> Resend email to booking@simplyenak.com). Relative path = no CORS.
 * 11 call sites pick this up with no other change.
 */
export const CONTACT_FORM_URL = '/api/contact';