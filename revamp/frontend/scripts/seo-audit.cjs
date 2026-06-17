#!/usr/bin/env node
/**
 * Comprehensive SEO Audit
 * Analyzes all HTML files for SEO best practices
 * 
 * Usage: node scripts/seo-audit.cjs
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const RESULTS_DIR = path.join(__dirname, '..', 'audit-results');

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

// Get all HTML files recursively
function getAllHtmlFiles(dir, baseDir = dir) {
  let results = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('_') && item !== 'node_modules') {
      results = results.concat(getAllHtmlFiles(fullPath, baseDir));
    } else if (item.endsWith('.html')) {
      const relativePath = path.relative(baseDir, fullPath);
      results.push({
        path: fullPath,
        relativePath: relativePath,
        url: '/' + relativePath.replace(/\\/g, '/').replace('index.html', '')
      });
    }
  }
  
  return results;
}

// Extract meta information from HTML
function extractMetaInfo(html) {
  const meta = {
    title: '',
    description: '',
    canonical: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: '',
    hreflangs: [],
    structuredData: [],
    h1s: [],
    h2s: [],
    internalLinks: [],
    externalLinks: [],
    imagesWithoutAlt: [],
    robots: ''
  };
  
  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  meta.title = titleMatch ? titleMatch[1].trim() : '';
  
  // Meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  meta.description = descMatch ? descMatch[1].trim() : '';
  
  // Canonical
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);
  meta.canonical = canonicalMatch ? canonicalMatch[1].trim() : '';
  
  // OG tags
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  meta.ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : '';
  
  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  meta.ogDescription = ogDescMatch ? ogDescMatch[1].trim() : '';
  
  const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  meta.ogImage = ogImageMatch ? ogImageMatch[1].trim() : '';
  
  // Twitter card
  const twitterCardMatch = html.match(/<meta[^>]*name=["']twitter:card["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  meta.twitterCard = twitterCardMatch ? twitterCardMatch[1].trim() : '';
  
  // Hreflangs
  const hreflangMatches = html.matchAll(/<link[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']*)["'][^>]*href=["']([^"']*)["'][^>]*>/gi);
  for (const match of hreflangMatches) {
    meta.hreflangs.push({ lang: match[1], href: match[2] });
  }
  
  // Structured data (JSON-LD)
  const jsonLdMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const match of jsonLdMatches) {
    try {
      const jsonData = JSON.parse(match[1]);
      meta.structuredData.push(jsonData);
    } catch (e) {
      // Invalid JSON
    }
  }
  
  // Headings
  const h1Matches = html.match(/<h1[^>]*>([^<]*)<\/h1>/gi);
  meta.h1s = h1Matches ? h1Matches.map(h => h.replace(/<[^>]*>/g, '').trim()) : [];
  
  const h2Matches = html.match(/<h2[^>]*>([^<]*)<\/h2>/gi);
  meta.h2s = h2Matches ? h2Matches.map(h => h.replace(/<[^>]*>/g, '').trim()) : [];
  
  // Links
  const linkMatches = html.matchAll(/<a[^>]*href=["']([^"']*)["'][^>]*>([^<]*)<\/a>/gi);
  for (const match of linkMatches) {
    const href = match[1];
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    
    if (href.startsWith('http') && !href.includes('simplyenak.com')) {
      meta.externalLinks.push({ href, text });
    } else if (href.startsWith('/') || href.startsWith('#')) {
      meta.internalLinks.push({ href, text });
    }
  }
  
  // Images without alt
  const imgMatches = html.matchAll(/<img[^>]*>/gi);
  for (const match of imgMatches) {
    const img = match[0];
    if (!img.includes('alt=')) {
      meta.imagesWithoutAlt.push(img.substring(0, 100));
    }
  }
  
  // Robots
  const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  meta.robots = robotsMatch ? robotsMatch[1].trim() : '';
  
  return meta;
}

// Analyze SEO for a page
function analyzeSeo(meta, url) {
  const issues = [];
  const warnings = [];
  const recommendations = [];
  
  // Title checks
  if (!meta.title) {
    issues.push({ type: 'critical', id: 'missing-title', message: 'Page is missing a title tag' });
  } else if (meta.title.length < 30) {
    warnings.push({ id: 'short-title', message: `Title too short (${meta.title.length} chars, min 30)` });
  } else if (meta.title.length > 60) {
    warnings.push({ id: 'long-title', message: `Title too long (${meta.title.length} chars, max 60)` });
  }
  
  // Description checks
  if (!meta.description) {
    issues.push({ type: 'critical', id: 'missing-description', message: 'Page is missing a meta description' });
  } else if (meta.description.length < 120) {
    warnings.push({ id: 'short-description', message: `Description too short (${meta.description.length} chars, min 120)` });
  } else if (meta.description.length > 160) {
    warnings.push({ id: 'long-description', message: `Description too long (${meta.description.length} chars, max 160)` });
  }
  
  // Canonical checks
  if (!meta.canonical && !url.includes('404')) {
    recommendations.push({ id: 'missing-canonical', message: 'Page should have a canonical URL' });
  }
  
  // OG tags checks
  if (!meta.ogTitle) {
    recommendations.push({ id: 'missing-og-title', message: 'Missing og:title tag' });
  }
  if (!meta.ogDescription) {
    recommendations.push({ id: 'missing-og-description', message: 'Missing og:description tag' });
  }
  if (!meta.ogImage) {
    recommendations.push({ id: 'missing-og-image', message: 'Missing og:image tag' });
  }
  
  // H1 checks
  if (meta.h1s.length === 0) {
    issues.push({ type: 'serious', id: 'missing-h1', message: 'Page is missing an H1 heading' });
  } else if (meta.h1s.length > 1) {
    warnings.push({ id: 'multiple-h1', message: `Page has ${meta.h1s.length} H1 tags (should be 1)` });
  }
  
  // H2 checks
  if (meta.h2s.length === 0) {
    warnings.push({ id: 'missing-h2', message: 'Page has no H2 headings' });
  }
  
  // Internal linking checks
  if (meta.internalLinks.length < 3) {
    recommendations.push({ id: 'few-internal-links', message: `Page has only ${meta.internalLinks.length} internal links (recommend 3+)` });
  }
  
  // Image alt checks
  if (meta.imagesWithoutAlt.length > 0) {
    issues.push({ type: 'serious', id: 'images-without-alt', message: `${meta.imagesWithoutAlt.length} images missing alt text` });
  }
  
  // Robots checks
  if (meta.robots.includes('noindex')) {
    warnings.push({ id: 'noindex', message: 'Page is set to noindex' });
  }
  
  // Structured data checks
  if (meta.structuredData.length === 0 && !url.includes('404')) {
    recommendations.push({ id: 'no-structured-data', message: 'Page has no structured data (JSON-LD)' });
  }
  
  // Calculate score
  let score = 100;
  issues.forEach(issue => {
    if (issue.type === 'critical') score -= 20;
    if (issue.type === 'serious') score -= 10;
  });
  warnings.forEach(() => score -= 5);
  recommendations.forEach(() => score -= 2);
  
  return {
    url,
    score: Math.max(0, score),
    issues,
    warnings,
    recommendations,
    meta
  };
}

function main() {
  console.log('🔍 Starting Comprehensive SEO Audit\n');
  console.log('====================================\n');
  
  const htmlFiles = getAllHtmlFiles(DIST_DIR);
  console.log(`Found ${htmlFiles.length} HTML files to audit\n`);
  
  const results = [];
  
  for (const file of htmlFiles) {
    if (file.relativePath.includes('node_modules') || file.relativePath.includes('_astro')) {
      continue;
    }
    
    const html = fs.readFileSync(file.path, 'utf8');
    const meta = extractMetaInfo(html);
    const analysis = analyzeSeo(meta, file.url);
    
    results.push(analysis);
    
    console.log(`\n📄 ${file.url || '/'} (${file.relativePath})`);
    console.log(`  SEO Score: ${analysis.score}/100`);
    console.log(`  Title: ${analysis.meta.title.substring(0, 60)}${analysis.meta.title.length > 60 ? '...' : ''} (${analysis.meta.title.length} chars)`);
    console.log(`  Description: ${analysis.meta.description.substring(0, 60)}${analysis.meta.description.length > 60 ? '...' : ''} (${analysis.meta.description.length} chars)`);
    console.log(`  H1s: ${analysis.meta.h1s.length}, H2s: ${analysis.meta.h2s.length}`);
    console.log(`  Internal Links: ${analysis.meta.internalLinks.length}, External: ${analysis.meta.externalLinks.length}`);
    
    if (analysis.issues.length > 0) {
      console.log(`  ❌ Issues: ${analysis.issues.length}`);
      analysis.issues.forEach(issue => {
        console.log(`    - [${issue.type}] ${issue.message}`);
      });
    }
    
    if (analysis.warnings.length > 0) {
      console.log(`  ⚠️  Warnings: ${analysis.warnings.length}`);
      analysis.warnings.forEach(warning => {
        console.log(`    - ${warning.message}`);
      });
    }
    
    if (analysis.recommendations.length > 0) {
      console.log(`  💡 Recommendations: ${analysis.recommendations.length}`);
      analysis.recommendations.forEach(rec => {
        console.log(`    - ${rec.message}`);
      });
    }
  }
  
  // Calculate summary
  const summary = {
    timestamp: new Date().toISOString(),
    totalPages: results.length,
    averageScore: Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length),
    pagesWithIssues: results.filter(r => r.issues.length > 0).length,
    pagesWithWarnings: results.filter(r => r.warnings.length > 0).length,
    totalIssues: results.reduce((sum, r) => sum + r.issues.length, 0),
    totalWarnings: results.reduce((sum, r) => sum + r.warnings.length, 0),
    totalRecommendations: results.reduce((sum, r) => sum + r.recommendations.length, 0),
    results
  };
  
  // Save results
  fs.writeFileSync(
    path.join(RESULTS_DIR, 'seo-audit-summary.json'),
    JSON.stringify(summary, null, 2)
  );
  
  // Save detailed results
  fs.writeFileSync(
    path.join(RESULTS_DIR, 'seo-audit-detailed.json'),
    JSON.stringify({
      timestamp: new Date().toISOString(),
      audit: summary
    }, null, 2)
  );
  
  console.log('\n\n📊 SEO Audit Summary:');
  console.log(`  Total Pages: ${summary.totalPages}`);
  console.log(`  Average Score: ${summary.averageScore}/100`);
  console.log(`  Pages with Issues: ${summary.pagesWithIssues}`);
  console.log(`  Pages with Warnings: ${summary.pagesWithWarnings}`);
  console.log(`  Total Issues: ${summary.totalIssues}`);
  console.log(`  Total Warnings: ${summary.totalWarnings}`);
  console.log(`  Total Recommendations: ${summary.totalRecommendations}`);
  console.log(`\n  Results saved to: ${RESULTS_DIR}/seo-audit-*.json`);
  
  return summary;
}

// Run the audit
const result = main();
process.exit(result.averageScore >= 80 ? 0 : 1);
