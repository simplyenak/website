#!/usr/bin/env node
/**
 * Automated Accessibility & Performance Audit
 * Runs axe-core for accessibility and Lighthouse for performance
 * 
 * Usage: node scripts/audit-site.js
 */

const fs = require('fs');
const path = require('path');
const axe = require('axe-core');
const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const RESULTS_DIR = path.join(__dirname, '..', 'audit-results');

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

// Pages to audit
const PAGES_TO_AUDIT = [
  { url: '/', name: 'Homepage' },
  { url: '/tours/', name: 'Tours Index' },
  { url: '/about/', name: 'About Page' },
  { url: '/contact/', name: 'Contact Page' },
  { url: '/stories/', name: 'Stories Index' },
];

async function runAccessibilityAudit(html, pageName) {
  console.log(`\n🔍 Running accessibility audit: ${pageName}`);
  
  const results = await axe.run(html, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21aa']
    }
  });
  
  const violations = results.violations;
  const incomplete = results.incomplete;
  const passes = results.passes;
  
  console.log(`  ✅ Passed: ${passes.length} checks`);
  console.log(`  ⚠️  Incomplete: ${incomplete.length} checks`);
  console.log(`  ❌ Violations: ${violations.length} violations`);
  
  if (violations.length > 0) {
    console.log('\n  Violations:');
    violations.forEach((v, i) => {
      console.log(`    ${i + 1}. ${v.id}: ${v.description}`);
      console.log(`       Impact: ${v.impact}`);
      console.log(`       Nodes: ${v.nodes.length}`);
      if (v.nodes[0]) {
        console.log(`       Example: ${v.nodes[0].html.substring(0, 100)}...`);
      }
    });
  }
  
  return {
    page: pageName,
    timestamp: new Date().toISOString(),
    violations,
    incomplete,
    passes: passes.length,
    score: Math.max(0, 100 - (violations.length * 10) - (incomplete.length * 5))
  };
}

async function runPerformanceAudit(pageUrl, pageName) {
  console.log(`\n🚀 Running performance audit: ${pageName}`);
  
  const options = {
    logLevel: 'error',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: 9222,
    formFactor: 'mobile'
  };
  
  try {
    const runnerResult = await lighthouse(pageUrl, options);
    
    if (!runnerResult || !runnerResult.lhr) {
      throw new Error('No Lighthouse results');
    }
    
    const categories = runnerResult.lhr.categories;
    
    console.log(`  Performance: ${categories.performance.score * 100}/100`);
    console.log(`  Accessibility: ${categories.accessibility.score * 100}/100`);
    console.log(`  Best Practices: ${categories['best-practices'].score * 100}/100`);
    console.log(`  SEO: ${categories.seo.score * 100}/100`);
    
    return {
      page: pageName,
      url: pageUrl,
      timestamp: new Date().toISOString(),
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      bestPractices: Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100),
      audits: runnerResult.lhr.audits
    };
  } catch (error) {
    console.error(`  ❌ Error running Lighthouse: ${error.message}`);
    return null;
  }
}

async function auditStaticFiles() {
  console.log('📁 Auditing static HTML files...\n');
  
  const accessibilityResults = [];
  
  for (const page of PAGES_TO_AUDIT) {
    const filePath = path.join(DIST_DIR, page.url === '/' ? 'index.html' : `${page.url}index.html`);
    
    if (fs.existsSync(filePath)) {
      const html = fs.readFileSync(filePath, 'utf8');
      const result = await runAccessibilityAudit(html, page.name);
      accessibilityResults.push(result);
      
      // Save individual result
      fs.writeFileSync(
        path.join(RESULTS_DIR, `a11y-${page.name.toLowerCase().replace(' ', '-')}.json`),
        JSON.stringify(result, null, 2)
      );
    } else {
      console.log(`\n⚠️  File not found: ${filePath}`);
    }
  }
  
  // Save summary
  const summary = {
    timestamp: new Date().toISOString(),
    totalPages: accessibilityResults.length,
    averageScore: Math.round(accessibilityResults.reduce((sum, r) => sum + r.score, 0) / accessibilityResults.length),
    totalViolations: accessibilityResults.reduce((sum, r) => sum + r.violations.length, 0),
    results: accessibilityResults
  };
  
  fs.writeFileSync(
    path.join(RESULTS_DIR, 'accessibility-summary.json'),
    JSON.stringify(summary, null, 2)
  );
  
  console.log('\n📊 Accessibility Summary:');
  console.log(`  Average Score: ${summary.averageScore}/100`);
  console.log(`  Total Violations: ${summary.totalViolations}`);
  console.log(`  Results saved to: ${RESULTS_DIR}/accessibility-summary.json`);
  
  return summary;
}

async function main() {
  console.log('🔍 Starting Automated Site Audit\n');
  console.log('=================================\n');
  
  // Run accessibility audit on static files
  const a11ySummary = await auditStaticFiles();
  
  console.log('\n\n✅ Audit complete!\n');
  console.log('Next steps:');
  console.log('1. Review accessibility-summary.json for violations');
  console.log('2. Fix critical violations (wcag2a, wcag2aa)');
  console.log('3. Run again to verify fixes\n');
}

// Run the audit
main().catch(console.error);
