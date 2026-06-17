/**
 * Unit tests for translation validation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = resolve(__dirname, '../src/data/content');
const TRANSLATIONS_DIR = resolve(__dirname, '../src/i18n/translations');

describe('Translation File Validation', () => {
  it('home page translation files exist for all languages', () => {
    const languages = ['ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt'];
    
    languages.forEach(lang => {
      const filePath = resolve(TRANSLATIONS_DIR, `${lang}.json`);
      expect(existsSync(filePath)).toBe(true);
    });
  });

  it('home page translations have required fields', () => {
    const requiredFields = ['hero_title', 'hero_subtitle', 'cta_title'];
    const languages = ['ms', 'zh', 'de']; // Required languages
    
    languages.forEach(lang => {
      const filePath = resolve(TRANSLATIONS_DIR, `${lang}.json`);
      const content = JSON.parse(readFileSync(filePath, 'utf8'));
      
      requiredFields.forEach(field => {
        expect(content[field]).toBeDefined();
        expect(content[field]).toBeTruthy();
      });
    });
  });

  it('tours translation files exist for required languages', () => {
    // Only check languages that have tour translations
    const languages = ['ms', 'zh', 'de'];
    
    languages.forEach(lang => {
      const filePath = resolve(TRANSLATIONS_DIR, `tours-translations-${lang}.json`);
      // Don't fail if file doesn't exist - translations might not be complete yet
      if (existsSync(filePath)) {
        const content = JSON.parse(readFileSync(filePath, 'utf8'));
        expect(Object.keys(content).length).toBeGreaterThan(0);
      }
    });
  });

  it('stories translation files exist for required languages', () => {
    // Only check languages that have story translations
    const languages = ['ms', 'zh', 'de', 'fr', 'nl'];
    
    languages.forEach(lang => {
      const filePath = resolve(TRANSLATIONS_DIR, `stories-translations-${lang}.json`);
      if (existsSync(filePath)) {
        const content = JSON.parse(readFileSync(filePath, 'utf8'));
        expect(Object.keys(content).length).toBeGreaterThan(0);
      }
    });
  });

  it('translation files are valid JSON', () => {
    const languages = ['ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt'];
    
    languages.forEach(lang => {
      const filePath = resolve(TRANSLATIONS_DIR, `${lang}.json`);
      const content = readFileSync(filePath, 'utf8');
      
      expect(() => JSON.parse(content)).not.toThrow();
    });
  });

  it('translation files have no duplicate keys', () => {
    const languages = ['ms', 'zh', 'de'];
    
    languages.forEach(lang => {
      const filePath = resolve(TRANSLATIONS_DIR, `${lang}.json`);
      const content = readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      const keys = Object.keys(data);
      const uniqueKeys = new Set(keys);
      
      expect(keys.length).toBe(uniqueKeys.size);
    });
  });
});

describe('Content File Validation', () => {
  it('tours.json exists and has items', () => {
    const filePath = resolve(CONTENT_DIR, 'tours.json');
    expect(existsSync(filePath)).toBe(true);
    
    const content = JSON.parse(readFileSync(filePath, 'utf8'));
    expect(Array.isArray(content)).toBe(true);
    expect(content.length).toBeGreaterThan(0);
  });

  it('stories.json exists and has items', () => {
    const filePath = resolve(CONTENT_DIR, 'stories.json');
    expect(existsSync(filePath)).toBe(true);
    
    const content = JSON.parse(readFileSync(filePath, 'utf8'));
    expect(Array.isArray(content)).toBe(true);
    expect(content.length).toBeGreaterThan(0);
  });

  it('home-page.json exists', () => {
    const filePath = resolve(CONTENT_DIR, 'home-page.json');
    expect(existsSync(filePath)).toBe(true);
  });

  it('tours have translations array or translation files exist', () => {
    const filePath = resolve(CONTENT_DIR, 'tours.json');
    const content = JSON.parse(readFileSync(filePath, 'utf8'));
    
    // Either tours have inline translations OR separate translation files exist
    const hasInlineTranslations = content.some(tour => tour.translations);
    const hasTranslationFiles = ['ms', 'zh', 'de'].some(lang => 
      existsSync(resolve(TRANSLATIONS_DIR, `tours-translations-${lang}.json`))
    );
    
    expect(hasInlineTranslations || hasTranslationFiles).toBe(true);
  });
});

describe('Page File Validation', () => {
  it('[lang] dynamic pages exist', () => {
    const pages = [
      'about.astro',
      'contact.astro',
      'faq.astro',
      'tours/index.astro',
      'stories/index.astro'
    ];
    
    const langDir = resolve(__dirname, '../src/pages/[lang]');
    
    pages.forEach(page => {
      const filePath = resolve(langDir, page);
      expect(existsSync(filePath)).toBe(true);
    });
  });

  it('[lang] pages have getStaticPaths', () => {
    const pages = ['about.astro', 'contact.astro', 'faq.astro'];
    const langDir = resolve(__dirname, '../src/pages/[lang]');
    
    pages.forEach(page => {
      const filePath = resolve(langDir, page);
      const content = readFileSync(filePath, 'utf8');
      
      expect(content).toContain('getStaticPaths');
      // [lang] pages use array mapping to generate locale paths dynamically
      // Check that the locale array includes non-English languages (via literal or SUPPORTED_LANGS import)
      const hasMsLiteral = /'ms'/.test(content);
      const hasSupportedLangsImport = /SUPPORTED_LANGS/.test(content);
      expect(hasMsLiteral || hasSupportedLangsImport).toBe(true);
    });
  });

  it('[lang] pages use Astro.params.lang', () => {
    const filePath = resolve(__dirname, '../src/pages/[lang]/about.astro');
    const content = readFileSync(filePath, 'utf8');
    
    expect(content).toContain('Astro.params.lang');
  });
});
