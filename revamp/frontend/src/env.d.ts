/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly CMS_URL: string;
  readonly VITE_FORM_ENDPOINT: string;
  readonly VITE_TURNSTILE_SITE_KEY: string;
  readonly PUBLIC_VITE_YOUTUBE_API_KEY: string;
  readonly PUBLIC_VITE_YOUTUBE_CHANNEL_ID: string;

  // N8N webhook URLs — set in Cloudflare Pages → project → Settings → Environment Variables
  readonly PUBLIC_FORMS_WEBHOOK: string;
  readonly PUBLIC_FORMS_CONTACT_WEBHOOK: string;
  readonly PUBLIC_FORMS_INQUIRY_WEBHOOK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
