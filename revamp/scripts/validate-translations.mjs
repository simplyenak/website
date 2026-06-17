#!/usr/bin/env node
/**
 * Validate Translation Completeness
 * 
 * Checks all collections for missing translations and generates a report.
 * Exits with error code if critical translations are missing.
 * 
 * Usage:
 *   node scripts/validate-translations.js
 *   node scripts/validate-translations.js --strict  # Fail on any missing
 *   node scripts/validate-translations.js --lang ms  # Check specific language
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = resolve(__dirname, '../frontend/src/data/content');
const TRANSLATIONS_DIR = resolve(__dirname, '../frontend/src/i18n/translations');

const LANGUAGES = ['ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt'];
const REQUIRED_LANGUAGES = ['ms', 'zh', 'de']; // Must have these for launch

// Collections to validate with their required fields
const COLLECTIONS = [
  {
    name: 'tours',
    file: 'tours.json',
    translationFile: 'tours-translations',
    requiredFields: ['name', 'short_description'],
    isSingleton: false
  },
  {
    name: 'stories',
    file: 'stories.json',
    translationFile: 'stories-translations',
    requiredFields: ['title', 'excerpt'],
    isSingleton: false
  },
  {
    name: 'faqs',
    file: 'faqs.json',
    translationFile: 'faqs-translations',
    requiredFields: ['question', 'answer'],
    isSingleton: false
  },
  {
    name: 'testimonials',
    file: 'testimonials.json',
    translationFile: 'testimonials-translations',
    requiredFields: ['review_title', 'review_text'],
    isSingleton: false
  },
  {
    name: 'about_page',
    file: 'about-page.json',
    translationFile: 'about-page-translations',
    requiredFields: ['hero_title', 'hero_subtitle'],
    isSingleton: true
  },
  {
    name: 'site_settings',
    file: 'site-settings.json',
    translationFile: 'site-settings-translations',
    requiredFields: ['tagline'],
    isSingleton: true
  }
];

// Parse command line arguments
const args = process.argv.slice(2);
const isStrict = args.includes('--strict');
const langFilter = args.find(arg => arg.startsWith('--lang='))?.split('=')[1];

// Validation results
const results = {
  passed: true,
  languages: {},
  collections: [],
  warnings: [],
  errors: []
};

/**
 * Load JSON file safely
 */
function loadJSON(filePath, baseDir = CONTENT_DIR) {
  const fullPath = resolve(baseDir, filePath);
  if (!existsSync(fullPath)) {
    return null;
  }
  try {
    return JSON.parse(readFileSync(fullPath, 'utf8'));
  } catch (err) {
    results.errors.push(`Failed to parse ${filePath}: ${err.message}`);
    return null;
  }
}

/**
 * Load translation file for a collection and language
 */
function loadTranslations(collection, lang) {
  const fileName = `${collection}-translations-${lang}.json`;
  const fullPath = resolve(TRANSLATIONS_DIR, fileName);
  
  if (!existsSync(fullPath)) {
    return null;
  }
  
  try {
    const content = readFileSync(fullPath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    return null;
  }
}

/**
 * Check if a field has content (not empty/null/undefined)
 */
function hasContent(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Validate a single collection
 */
function validateCollection(collectionConfig) {
  const { name, file, translationFile, requiredFields, isSingleton } = collectionConfig;
  const data = loadJSON(file);
  
  if (!data) {
    results.errors.push(`Missing data file: ${file}`);
    return;
  }
  
  const items = isSingleton ? [data] : (Array.isArray(data) ? data : [data]);
  
  const collectionResult = {
    name,
    total: items.length,
    languages: {},
    missing: []
  };
  
  // Initialize language stats
  LANGUAGES.forEach(lang => {
    collectionResult.languages[lang] = {
      complete: 0,
      incomplete: 0,
      missing: []
    };
  });
  
  // Check each language's translation file
  LANGUAGES.forEach(lang => {
    if (langFilter && lang !== langFilter) return;
    
    const transFile = `${translationFile}-${lang}.json`;
    const translations = loadJSON(transFile, TRANSLATIONS_DIR);
    
    if (!translations) {
      // No translation file for this language
      collectionResult.languages[lang].incomplete = items.length;
      collectionResult.missing.push({
        item: `All ${name}`,
        language: lang,
        fields: requiredFields
      });
      
      if (REQUIRED_LANGUAGES.includes(lang)) {
        results.errors.push(
          `Missing ${lang} translations file for ${name} (${transFile})`
        );
      } else {
        results.warnings.push(
          `Missing ${lang} translations file for ${name} (${transFile})`
        );
      }
      return;
    }
    
    // Count how many items have at least one required field translated
    const translationKeys = Object.keys(translations);
    const expectedItems = items.length;
    let completeCount = 0;
    
    translationKeys.forEach(key => {
      const itemTrans = translations[key];
      const hasRequiredField = requiredFields.some(field => hasContent(itemTrans[field]));
      if (hasRequiredField) {
        completeCount++;
      }
    });
    
    if (completeCount < expectedItems) {
      collectionResult.languages[lang].incomplete = expectedItems - completeCount;
      collectionResult.languages[lang].complete = completeCount;
      
      if (completeCount < expectedItems) {
        results.warnings.push(
          `${name}: ${lang} has ${completeCount}/${expectedItems} items with required fields`
        );
      }
    } else {
      collectionResult.languages[lang].complete = expectedItems;
    }
  });
  
  results.collections.push(collectionResult);
}

/**
 * Validate home page translations (special case - uses {lang}.json)
 */
function validateHomePage() {
  LANGUAGES.forEach(lang => {
    if (langFilter && lang !== langFilter) return;
    
    const fileName = `${lang}.json`;
    const fullPath = resolve(TRANSLATIONS_DIR, fileName);
    
    if (!existsSync(fullPath)) {
      results.errors.push(`Missing home page translations for ${lang} (${fileName})`);
      return;
    }
    
    const translations = loadJSON(fileName, TRANSLATIONS_DIR);
    if (!translations) {
      results.errors.push(`Failed to load home page translations for ${lang}`);
      return;
    }
    
    // Check required fields
    const requiredFields = ['hero_title', 'hero_subtitle', 'cta_title'];
    const missingFields = requiredFields.filter(field => !hasContent(translations[field]));
    
    if (missingFields.length > 0) {
      results.warnings.push(`Home page missing ${lang} translation for: ${missingFields.join(', ')}`);
    }
    
    // Calculate completeness
    const totalFields = Object.keys(translations).length;
    const filledFields = Object.values(translations).filter(v => hasContent(v)).length;
    const percentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
    
    results.languages[lang] = {
      homePage: {
        total: totalFields,
        filled: filledFields,
        percentage
      }
    };
  });
}

/**
 * Generate report
 */
function generateReport() {
  console.log('\n' + '='.repeat(70));
  console.log('🌍 TRANSLATION VALIDATION REPORT');
  console.log('='.repeat(70) + '\n');
  
  // Summary by language
  console.log('📊 COMPLETENESS BY LANGUAGE\n');
  console.log('Language'.padEnd(20) + 'Home Page'.padEnd(15) + 'Status');
  console.log('-'.repeat(70));
  
  LANGUAGES.forEach(lang => {
    const langData = results.languages[lang]?.homePage;
    if (langData) {
      const status = langData.percentage >= 90 ? '✅' : langData.percentage >= 50 ? '⚠️' : '❌';
      console.log(
        lang.toUpperCase().padEnd(20) +
        `${langData.percentage}%`.padEnd(15) +
        `${status} ${langData.filled}/${langData.total} fields`
      );
    }
  });
  
  console.log('\n');
  
  // Summary by collection
  console.log('📚 COMPLETENESS BY COLLECTION\n');
  
  results.collections.forEach(collection => {
    console.log(`${collection.name.toUpperCase()}: ${collection.total} items`);
    
    LANGUAGES.forEach(lang => {
      if (langFilter && lang !== langFilter) return;
      
      const langData = collection.languages[lang];
      const total = langData.complete + langData.incomplete;
      const percentage = total > 0 ? Math.round((langData.complete / total) * 100) : 0;
      const status = percentage === 100 ? '✅' : percentage > 0 ? '⚠️' : '❌';
      
      console.log(`  ${lang.toUpperCase().padEnd(6)} ${percentage}% (${langData.complete}/${total}) ${status}`);
    });
    
    console.log('');
  });
  
  // Missing translations
  if (results.collections.some(c => c.missing.length > 0)) {
    console.log('❌ MISSING TRANSLATIONS\n');
    
    results.collections.forEach(collection => {
      if (collection.missing.length === 0) return;
      
      console.log(`${collection.name}:`);
      collection.missing.slice(0, 10).forEach(m => {
        console.log(`  - ${m.item} (${m.language}): ${m.fields.join(', ')}`);
      });
      
      if (collection.missing.length > 10) {
        console.log(`  ... and ${collection.missing.length - 10} more`);
      }
      console.log('');
    });
  }
  
  // Warnings
  if (results.warnings.length > 0) {
    console.log(`⚠️  WARNINGS (${results.warnings.length} total)\n`);
    results.warnings.slice(0, 10).forEach(w => console.log(`  - ${w}`));
    if (results.warnings.length > 10) {
      console.log(`  ... and ${results.warnings.length - 10} more`);
    }
    console.log('');
  }
  
  // Errors
  if (results.errors.length > 0) {
    console.log(`🔴 ERRORS (${results.errors.length} total)\n`);
    results.errors.forEach(e => console.log(`  - ${e}`));
    console.log('');
  }
  
  // Final verdict
  console.log('='.repeat(70));
  
  const hasRequiredLanguages = REQUIRED_LANGUAGES.every(lang => {
    const langData = results.languages[lang]?.homePage;
    return langData && langData.percentage >= 90;
  });
  
  if (results.errors.length === 0 && hasRequiredLanguages) {
    console.log('✅ VALIDATION PASSED');
    if (!hasRequiredLanguages) {
      console.log('⚠️  Warning: Some required languages are incomplete');
    }
  } else {
    console.log('❌ VALIDATION FAILED');
    console.log(`   ${results.errors.length} errors, ${results.warnings.length} warnings`);
    
    if (!hasRequiredLanguages) {
      console.log(`   Required languages (${REQUIRED_LANGUAGES.join(', ')}) must be 90%+ complete`);
    }
  }
  
  console.log('='.repeat(70) + '\n');
  
  // Exit code
  if (isStrict && (results.errors.length > 0 || results.warnings.length > 0)) {
    process.exit(1);
  } else if (results.errors.length > 0) {
    process.exit(1);
  }
}

// Run validation
console.log('🔍 Validating translations...\n');

validateHomePage();
COLLECTIONS.forEach(validateCollection);
generateReport();
