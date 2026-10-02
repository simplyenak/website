/**
 * Contact form endpoint (all call sites).
 *
 * SELF-HOSTED (2026-10-02): previously Formspree (form xjkyqvpz) which 404'd
 * FORM_NOT_FOUND for over a month. Now a RELATIVE same-origin path served by the
 * Cloudflare Worker (`/api/contact` -> POSTs to the Pyrunner `contact-form`
 * webhook -> Resend email to booking@simplyenak.com). Relative path = no CORS.
 * 11 call sites pick this up with no other change.
 * Anti-bot: the Pyrunner script (`contact-form`) verifies the Cloudflare
 * Turnstile token (`cf-turnstile-response`) server-side via siteverify and
 * silently drops submissions without a valid challenge. Every form renders the
 * Turnstile widget with the site key (see form `.cf-turnstile` blocks).
 */
export const CONTACT_FORM_URL = '/api/contact';