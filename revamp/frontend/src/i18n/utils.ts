import { ui, defaultLang } from "./ui";
import type { Language, UiKey } from "./ui";

/** All supported non-English language codes. Used in getStaticPaths() for [lang] routes. */
export const SUPPORTED_LANGS = ['ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt'] as const;

/**
 * Extract the language code from a URL.
 * With prefixDefaultLocale: false, /tours is English, /ms/tours is Malay.
 */
export function getLangFromUrl(url: URL): Language {
  const [, first] = url.pathname.split("/");
  if (first in ui) return first as Language;
  return defaultLang;
}

/**
 * Returns a translation function for the given language.
 * Falls back to English if a key is missing in the target language.
 *
 * Usage in .astro files:
 *   const t = useTranslations(getLangFromUrl(Astro.url));
 *   <h1>{t('nav.tours')}</h1>
 */
export function useTranslations(lang: Language) {
  return function t(key: UiKey): string {
    const langStrings = ui[lang] as Record<string, string> | undefined;
    const enStrings = ui[defaultLang] as Record<string, string>;
    return langStrings?.[key] ?? enStrings[key] ?? key;
  };
}

/**
 * Get URL for language switch (removes existing lang prefix, adds new one)
 */
// Paths that have localized [lang] page variants in src/pages/[lang]/
const LOCALIZABLE_PREFIXES = ['/', '/about', '/contact', '/faq', '/how-it-works', '/stories', '/tours'];

export function localizePath(path: string, currentLang: Language): string {
  // Enforce trailing slash (Astro config: trailingSlash: "always")
  if (!path.endsWith('/') && !path.startsWith('http://') && !path.startsWith('https://') && path !== '') path += '/';
  
  if (currentLang === defaultLang) return path;
  // Skip external links
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // Only localize paths that have [lang] page variants
  const isLocalizable = path === '/' || LOCALIZABLE_PREFIXES.some(prefix => path.startsWith(prefix + '/') || path === prefix);
  if (!isLocalizable) return path;
  return `/${currentLang}${path}`;
}

export function getLangUrl(lang: string, pathname: string): string {
  // Remove existing language prefix (derived from configured locales)
  const localePattern = new RegExp(`^\\/(${Object.keys(ui).join('|')})`);
  let cleanPath = pathname.replace(localePattern, '') || '/';

  // Enforce trailing slash (Astro trailingSlash: "always")
  if (!cleanPath.endsWith('/')) cleanPath += '/';
  if (cleanPath === '//') cleanPath = '/';

  // Don't add prefix for default language (English)
  if (lang === 'en') return cleanPath;

  return `/${lang}${cleanPath}`;
}
