#!/usr/bin/env node
/**
 * Translation Dashboard Generator
 * 
 * Creates a visual HTML report showing translation completeness
 * across all languages and collections.
 * 
 * Usage:
 *   node scripts/generate-translation-dashboard.js
 *   node scripts/generate-translation-dashboard.js --open  # Opens in browser
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = resolve(__dirname, '../frontend/src/data/content');
const TRANSLATIONS_DIR = resolve(__dirname, '../frontend/src/i18n/translations');
const OUTPUT_FILE = resolve(__dirname, '../frontend/public/translation-dashboard.html');

const LANGUAGES = [
  { code: 'ms', name: 'Bahasa Malaysia', flag: '🇲🇾' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

const COLLECTIONS = [
  { name: 'home_page', file: null, translationFile: '{lang}.json', label: 'Home Page' },
  { name: 'tours', file: 'tours.json', translationFile: 'tours-translations-{lang}.json', label: 'Tours' },
  { name: 'stories', file: 'stories.json', translationFile: 'stories-translations-{lang}.json', label: 'Stories' },
  { name: 'faqs', file: 'faqs.json', translationFile: 'faqs-translations-{lang}.json', label: 'FAQs' },
  { name: 'testimonials', file: 'testimonials.json', translationFile: 'testimonials-translations-{lang}.json', label: 'Testimonials' },
  { name: 'about_page', file: 'about-page.json', translationFile: 'about-page-translations-{lang}.json', label: 'About Page' },
  { name: 'site_settings', file: 'site-settings.json', translationFile: 'site-settings-translations-{lang}.json', label: 'Site Settings' },
];

function loadJSON(filePath) {
  const fullPath = resolve(TRANSLATIONS_DIR, filePath);
  if (!existsSync(fullPath)) return null;
  try {
    return JSON.parse(readFileSync(fullPath, 'utf8'));
  } catch {
    return null;
  }
}

function loadContentJSON(filePath) {
  const fullPath = resolve(CONTENT_DIR, filePath);
  if (!existsSync(fullPath)) return null;
  try {
    return JSON.parse(readFileSync(fullPath, 'utf8'));
  } catch {
    return null;
  }
}

function hasContent(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function calculateCompleteness(collection, lang) {
  const { translationFile, file } = collection;
  const transPath = translationFile.replace('{lang}', lang);
  const translations = loadJSON(transPath);
  
  if (!translations) {
    return { percentage: 0, total: 0, filled: 0, missing: [] };
  }
  
  // Home page is flat structure
  if (collection.name === 'home_page') {
    const keys = Object.keys(translations);
    const filled = Object.values(translations).filter(v => hasContent(v)).length;
    const percentage = keys.length > 0 ? Math.round((filled / keys.length) * 100) : 0;
    
    const missing = keys.filter(key => !hasContent(translations[key]));
    
    return { percentage, total: keys.length, filled, missing };
  }
  
  // Other collections are nested by item ID
  const contentData = loadContentJSON(file);
  if (!contentData) {
    return { percentage: 0, total: 0, filled: 0, missing: [] };
  }
  
  const items = Array.isArray(contentData) ? contentData : [contentData];
  const translationKeys = Object.keys(translations);
  
  let totalFields = 0;
  let filledFields = 0;
  const missingItems = [];
  
  items.forEach(item => {
    const itemId = item.id || item.slug;
    const itemTrans = translations[itemId];
    
    if (!itemTrans) {
      missingItems.push({ id: itemId, name: item.name || item.title || itemId, fields: 'all' });
      return;
    }
    
    // Check common translatable fields
    const commonFields = ['name', 'title', 'short_description', 'description', 'excerpt', 'question', 'answer', 'review_title', 'review_text', 'tagline', 'hero_title', 'hero_subtitle'];
    
    commonFields.forEach(field => {
      if (itemTrans[field] !== undefined) {
        totalFields++;
        if (hasContent(itemTrans[field])) {
          filledFields++;
        } else {
          missingItems.push({ id: itemId, name: item.name || item.title || itemId, field });
        }
      }
    });
  });
  
  const percentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  
  return {
    percentage,
    total: totalFields,
    filled: filledFields,
    missing: missingItems.slice(0, 10) // Limit to first 10
  };
}

function getStatusColor(percentage) {
  if (percentage >= 90) return '#22c55e'; // green
  if (percentage >= 70) return '#eab308'; // yellow
  if (percentage >= 50) return '#f97316'; // orange
  return '#ef4444'; // red
}

function getStatusIcon(percentage) {
  if (percentage >= 90) return '✅';
  if (percentage >= 70) return '⚠️';
  return '❌';
}

function generateDashboard() {
  console.log('📊 Generating translation dashboard...\n');
  
  const data = {
    generated: new Date().toISOString(),
    languages: {},
    collections: []
  };
  
  // Calculate for each language
  LANGUAGES.forEach(lang => {
    const langData = {
      code: lang.code,
      name: lang.name,
      flag: lang.flag,
      collections: {},
      overall: 0
    };
    
    let totalPercentage = 0;
    
    COLLECTIONS.forEach(collection => {
      const completeness = calculateCompleteness(collection, lang.code);
      langData.collections[collection.name] = {
        ...completeness,
        label: collection.label
      };
      totalPercentage += completeness.percentage;
    });
    
    langData.overall = Math.round(totalPercentage / COLLECTIONS.length);
    data.languages[lang.code] = langData;
  });
  
  // Collection summaries
  COLLECTIONS.forEach(collection => {
    const summary = {
      name: collection.name,
      label: collection.label,
      languages: {}
    };
    
    LANGUAGES.forEach(lang => {
      summary.languages[lang.code] = calculateCompleteness(collection, lang.code);
    });
    
    data.collections.push(summary);
  });
  
  // Generate HTML
  const html = generateHTML(data);
  writeFileSync(OUTPUT_FILE, html, 'utf8');
  
  console.log(`✅ Dashboard generated: ${OUTPUT_FILE}`);
  console.log(`📊 Overall completion by language:\n`);
  
  LANGUAGES.forEach(lang => {
    const langData = data.languages[lang.code];
    const icon = getStatusIcon(langData.overall);
    console.log(`  ${lang.flag} ${lang.code.toUpperCase().padEnd(4)} ${langData.overall}% ${icon}`);
  });
  
  console.log(`\n🌐 Open in browser: file://${OUTPUT_FILE}\n`);
  
  return data;
}

function generateHTML(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Translation Dashboard - Simply Enak</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8fafc;
      color: #1e293b;
      line-height: 1.6;
      padding: 2rem;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; color: #0f172a; }
    .subtitle { color: #64748b; margin-bottom: 2rem; }
    .generated { font-size: 0.875rem; color: #94a3b8; }
    
    .overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    
    .language-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border-left: 4px solid;
    }
    
    .language-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    
    .language-flag { font-size: 2rem; }
    .language-name { font-weight: 600; font-size: 1.125rem; }
    .language-code { 
      background: #f1f5f9; 
      padding: 0.25rem 0.5rem; 
      border-radius: 4px; 
      font-size: 0.75rem;
      font-weight: 600;
    }
    
    .overall-score {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 1rem 0;
    }
    
    .progress-bar {
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
      margin: 0.75rem 0;
    }
    
    .progress-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    
    .collections-table {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background: #f8fafc; font-weight: 600; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; }
    tr:hover { background: #f8fafc; }
    
    .collection-name { font-weight: 500; }
    .percentage { font-weight: 600; font-family: monospace; }
    .status-icon { margin-right: 0.5rem; }
    
    .missing-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .missing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .missing-item {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 1rem;
      font-size: 0.875rem;
    }
    
    .missing-item.critical {
      background: #fef2f2;
      border-color: #ef4444;
    }
    
    .missing-item.warning {
      background: #fefce8;
      border-color: #fde047;
    }
    
    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-left: 0.5rem;
    }
    
    .badge-critical { background: #ef4444; color: white; }
    .badge-warning { background: #eab308; color: white; }
    .badge-ok { background: #22c55e; color: white; }
    
    .actions {
      margin-top: 2rem;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
    }
    
    .btn-primary {
      background: #3b82f6;
      color: white;
    }
    
    .btn-primary:hover { background: #2563eb; }
    
    .btn-secondary {
      background: white;
      color: #3b82f6;
      border: 1px solid #3b82f6;
    }
    
    .btn-secondary:hover { background: #eff6ff; }
    
    @media (max-width: 768px) {
      body { padding: 1rem; }
      .overview-grid { grid-template-columns: 1fr; }
      table { font-size: 0.875rem; }
      th, td { padding: 0.5rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🌍 Translation Dashboard</h1>
    <p class="subtitle">Simply Enak - Translation Completeness Report</p>
    <p class="generated">Generated: ${new Date(data.generated).toLocaleString()}</p>
    
    <h2 style="margin: 2rem 0 1rem;">📊 Overview by Language</h2>
    <div class="overview-grid">
      ${LANGUAGES.map(lang => {
        const langData = data.languages[lang.code];
        const color = getStatusColor(langData.overall);
        const icon = getStatusIcon(langData.overall);
        return \`
          <div class="language-card" style="border-left-color: \${color}">
            <div class="language-header">
              <span class="language-flag">\${lang.flag}</span>
              <div>
                <div class="language-name">\${lang.name}</div>
                <span class="language-code">\${lang.code.toUpperCase()}</span>
              </div>
            </div>
            <div class="overall-score" style="color: \${color}">\${langData.overall}% \${icon}</div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: \${langData.overall}%; background: \${color}"></div>
            </div>
            <div style="font-size: 0.875rem; color: #64748b;">
              \${Object.values(langData.collections).filter(c => c.percentage >= 90).length}/\${COLLECTIONS.length} collections complete
            </div>
          </div>
        \`;
      }).join('')}
    </div>
    
    <h2 style="margin: 2rem 0 1rem;">📚 Completeness by Collection</h2>
    <div class="collections-table">
      <table>
        <thead>
          <tr>
            <th>Collection</th>
            \${LANGUAGES.map(lang => \`<th>\${lang.flag} \${lang.code.toUpperCase()}</th>\`).join('')}
          </tr>
        </thead>
        <tbody>
          \${data.collections.map(collection => \`
            <tr>
              <td class="collection-name">\${collection.label}</td>
              \${LANGUAGES.map(lang => {
                const langData = collection.languages[lang.code];
                const color = getStatusColor(langData.percentage);
                const icon = getStatusIcon(langData.percentage);
                return \`
                  <td>
                    <span class="status-icon">\${icon}</span>
                    <span class="percentage" style="color: \${color}">\${langData.percentage}%</span>
                    <span style="color: #64748b; font-size: 0.75rem;">(\${langData.filled}/\${langData.total})</span>
                  </td>
                \`;
              }).join('')}
            </tr>
          \`).join('')}
        </tbody>
      </table>
    </div>
    
    <h2 style="margin: 2rem 0 1rem;">⚠️ Missing Translations (Critical)</h2>
    <div class="missing-section">
      <div class="missing-grid">
        \${LANGUAGES.filter(lang => data.languages[lang.code].overall < 70).map(lang => {
          const langData = data.languages[lang.code];
          const criticalCollections = Object.entries(langData.collections)
            .filter(([_, c]) => c.percentage < 70)
            .slice(0, 5);
          
          return \`
            <div class="missing-item critical">
              <strong>\${lang.flag} \${lang.name}</strong>
              <span class="badge badge-critical">\${langData.overall}%</span>
              <ul style="margin-top: 0.5rem; padding-left: 1rem; font-size: 0.875rem;">
                \${criticalCollections.map(([key, c]) => \`
                  <li>\${c.label}: \${c.percentage}% complete</li>
                \`).join('')}
              </ul>
            </div>
          \`;
        }).join('')}
        \${LANGUAGES.filter(lang => data.languages[lang.code].overall < 70).length === 0 ? 
          '<p style="color: #22c55e; font-weight: 500;">✅ All languages are above 70% completeness!</p>' : ''}
      </div>
    </div>
    
    <div class="actions">
      <button class="btn btn-primary" onclick="window.print()">📄 Print Report</button>
      <button class="btn btn-secondary" onclick="exportCSV()">📥 Export CSV</button>
      <a href="/" class="btn btn-secondary">← Back to Site</a>
    </div>
  </div>
  
  <script>
    const data = \${JSON.stringify(data)};
    
    function exportCSV() {
      let csv = 'Collection,Language,Percentage,Total,Filled\\n';
      
      data.collections.forEach(collection => {
        Object.keys(collection.languages).forEach(langCode => {
          const langData = collection.languages[langCode];
          csv += \`\${collection.label},\${langCode},\${langData.percentage},\${langData.total},\${langData.filled}\\n\`;
        });
      });
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'translations-report-' + new Date().toISOString().split('T')[0] + '.csv';
      a.click();
    }
  </script>
</body>
</html>\`;
}

// Run
generateDashboard();

// Open in browser if --open flag
if (process.argv.includes('--open')) {
  try {
    if (process.platform === 'darwin') {
      execSync(\`open "\${OUTPUT_FILE}"\`);
    } else if (process.platform === 'win32') {
      execSync(\`start "" "\${OUTPUT_FILE}"\`);
    } else {
      execSync(\`xdg-open "\${OUTPUT_FILE}"\`);
    }
  } catch (e) {
    console.log('Open manually:', OUTPUT_FILE);
  }
}
