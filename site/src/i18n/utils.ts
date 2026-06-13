import { ui, defaultLang } from "./ui";
import type { Language, UiKey } from "./ui";

/** All supported non-English language codes. Used in getStaticPaths() for [lang] routes. */
export const SUPPORTED_LANGS = ['ms'] as const;

/** Supported languages as a union type including default */
export type SupportedLang = typeof SUPPORTED_LANGS[number];

/**
 * Extract the language code from a URL.
 * With prefixDefaultLocale: false, / is English, /ms/tours is Malay.
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
 * Get localized path for a given URL path and language.
 * English paths stay at root, other languages get prefixed.
 * Respects site's trailingSlash: false — no trailing slashes added.
 */
export function localizePath(path: string, lang: Language): string {
  if (lang === defaultLang) return path;
  const clean = path.replace(/\/+$/, '');
  return `/${lang}${clean || ''}`;
}

/**
 * Get the URL for switching to a different language from the current pathname.
 * Respects site's trailingSlash: false.
 */
export function getLangUrl(targetLang: string, currentPathname: string): string {
  // Remove existing language prefix (if any)
  const localePattern = new RegExp(`^\\/(${Object.keys(ui).join('|')})`);
  let cleanPath = currentPathname.replace(localePattern, '') || '/';
  cleanPath = cleanPath.replace(/\/+$/, '') || '/';

  // No prefix for default language (English)
  if (targetLang === defaultLang) return cleanPath;

  return `/${targetLang}${cleanPath === '/' ? '' : cleanPath}`;
}
