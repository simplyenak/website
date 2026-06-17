#!/usr/bin/env node
/**
 * Static Accessibility & Performance Analysis
 * Analyzes HTML files for common issues without browser
 * 
 * Usage: node scripts/static-audit.cjs
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const RESULTS_DIR = path.join(__dirname, '..', 'audit-results');

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

// Pages to audit
const PAGES_TO_AUDIT = [
  { file: 'index.html', name: 'Homepage' },
  { file: 'tours/index.html', name: 'Tours Index' },
  { file: 'about/index.html', name: 'About Page' },
  { file: 'contact/index.html', name: 'Contact Page' },
  { file: 'stories/index.html', name: 'Stories Index' },
];

// Accessibility checks
function checkAccessibility(html, pageName) {
  const issues = [];
  
  // Check 1: Images without alt text
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  const imgWithoutAlt = imgMatches.filter(img => !img.includes('alt='));
  if (imgWithoutAlt.length > 0) {
    issues.push({
      id: 'image-alt',
      description: 'Images must have alt text',
      impact: 'critical',
      count: imgWithoutAlt.length,
      examples: imgWithoutAlt.slice(0, 3)
    });
  }
  
  // Check 2: Buttons without accessible text
  const buttonMatches = html.match(/<button[^>]*>.*?<\/button>/gi) || [];
  const buttonsWithoutText = buttonMatches.filter(btn => {
    const text = btn.replace(/<[^>]*>/g, '').trim();
    return text.length === 0 && !btn.includes('aria-label');
  });
  if (buttonsWithoutText.length > 0) {
    issues.push({
      id: 'button-name',
      description: 'Buttons must have accessible text',
      impact: 'critical',
      count: buttonsWithoutText.length
    });
  }
  
  // Check 3: Links without href or with empty href
  const linkMatches = html.match(/<a[^>]*>/gi) || [];
  const linksWithoutHref = linkMatches.filter(link => !link.includes('href='));
  if (linksWithoutHref.length > 0) {
    issues.push({
      id: 'link-href',
      description: 'Links must have href attribute',
      impact: 'serious',
      count: linksWithoutHref.length
    });
  }
  
  // Check 4: Form inputs without labels
  const inputMatches = html.match(/<input[^>]*>/gi) || [];
  const inputsWithoutLabel = inputMatches.filter(input => {
    return !input.includes('aria-label') && !input.includes('aria-labelledby') && !input.includes('id=');
  });
  if (inputsWithoutLabel.length > 0) {
    issues.push({
      id: 'label',
      description: 'Form inputs must have labels',
      impact: 'critical',
      count: inputsWithoutLabel.length
    });
  }
  
  // Check 5: Missing lang attribute
  if (!html.includes('<html lang=')) {
    issues.push({
      id: 'html-lang',
      description: 'HTML must have lang attribute',
      impact: 'serious',
      count: 1
    });
  }
  
  // Check 6: Skip link missing
  if (!html.includes('skip') && !html.includes('Skip')) {
    issues.push({
      id: 'skip-link',
      description: 'Page should have skip link',
      impact: 'moderate',
      count: 1
    });
  }
  
  // Check 7: Color contrast (basic check - looks for small text on low contrast backgrounds)
  // This is a simplified check - real contrast needs computed styles
  
  // Check 8: Heading hierarchy
  const h1Matches = html.match(/<h1[^>]*>/gi) || [];
  if (h1Matches.length === 0) {
    issues.push({
      id: 'heading-missing',
      description: 'Page should have exactly one h1',
      impact: 'moderate',
      count: 1
    });
  } else if (h1Matches.length > 1) {
    issues.push({
      id: 'heading-multiple',
      description: 'Page should have exactly one h1',
      impact: 'moderate',
      count: h1Matches.length - 1
    });
  }
  
  return {
    page: pageName,
    timestamp: new Date().toISOString(),
    issues,
    score: Math.max(0, 100 - (issues.reduce((sum, i) => {
      if (i.impact === 'critical') return sum + 15;
      if (i.impact === 'serious') return sum + 10;
      if (i.impact === 'moderate') return sum + 5;
      return sum;
    }, 0)))
  };
}

// Performance checks
function checkPerformance(html, pageName) {
  const metrics = {
    page: pageName,
    timestamp: new Date().toISOString(),
    fileSize: Buffer.byteLength(html, 'utf8'),
    issues: []
  };
  
  // Check 1: Page size
  if (metrics.fileSize > 500000) { // 500KB
    metrics.issues.push({
      id: 'page-size',
      description: 'Page size should be under 500KB',
      value: `${(metrics.fileSize / 1024).toFixed(2)} KB`
    });
  }
  
  // Check 2: Inline styles
  const inlineStyleMatches = html.match(/style="[^"]*"/gi) || [];
  if (inlineStyleMatches.length > 20) {
    metrics.issues.push({
      id: 'inline-styles',
      description: 'Too many inline styles',
      count: inlineStyleMatches.length
    });
  }
  
  // Check 3: Images without lazy loading
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  const imagesWithoutLazy = imgMatches.filter(img => !img.includes('loading="lazy"'));
  if (imagesWithoutLazy.length > 5) {
    metrics.issues.push({
      id: 'lazy-loading',
      description: 'Below-fold images should use lazy loading',
      count: imagesWithoutLazy.length
    });
  }
  
  // Check 4: External scripts
  const scriptMatches = html.match(/<script[^>]*src="[^"]*"[^>]*>/gi) || [];
  metrics.externalScripts = scriptMatches.length;
  
  // Calculate performance score
  let score = 100;
  if (metrics.fileSize > 500000) score -= 20;
  if (inlineStyleMatches.length > 20) score -= 10;
  if (imagesWithoutLazy.length > 5) score -= 15;
  if (scriptMatches.length > 5) score -= 10;
  
  metrics.score = Math.max(0, score);
  
  return metrics;
}

function main() {
  console.log('🔍 Starting Static Site Audit\n');
  console.log('==============================\n');
  
  const accessibilityResults = [];
  const performanceResults = [];
  
  for (const page of PAGES_TO_AUDIT) {
    const filePath = path.join(DIST_DIR, page.file);
    
    if (fs.existsSync(filePath)) {
      const html = fs.readFileSync(filePath, 'utf8');
      
      // Run accessibility checks
      const a11yResult = checkAccessibility(html, page.name);
      accessibilityResults.push(a11yResult);
      
      // Run performance checks
      const perfResult = checkPerformance(html, page.name);
      performanceResults.push(perfResult);
      
      console.log(`\n📄 ${page.name}:`);
      console.log(`  Accessibility Score: ${a11yResult.score}/100`);
      console.log(`  Performance Score: ${perfResult.score}/100`);
      console.log(`  File Size: ${(perfResult.fileSize / 1024).toFixed(2)} KB`);
      
      if (a11yResult.issues.length > 0) {
        console.log(`  Accessibility Issues: ${a11yResult.issues.length}`);
        a11yResult.issues.forEach(issue => {
          console.log(`    - ${issue.id}: ${issue.description} (${issue.impact})`);
        });
      }
      
      if (perfResult.issues.length > 0) {
        console.log(`  Performance Issues: ${perfResult.issues.length}`);
        perfResult.issues.forEach(issue => {
          console.log(`    - ${issue.id}: ${issue.description}`);
        });
      }
    } else {
      console.log(`\n⚠️  File not found: ${filePath}`);
    }
  }
  
  // Save summaries
  const a11ySummary = {
    timestamp: new Date().toISOString(),
    totalPages: accessibilityResults.length,
    averageScore: Math.round(accessibilityResults.reduce((sum, r) => sum + r.score, 0) / accessibilityResults.length),
    totalIssues: accessibilityResults.reduce((sum, r) => sum + r.issues.length, 0),
    results: accessibilityResults
  };
  
  const perfSummary = {
    timestamp: new Date().toISOString(),
    totalPages: performanceResults.length,
    averageScore: Math.round(performanceResults.reduce((sum, r) => sum + r.score, 0) / performanceResults.length),
    averageFileSize: Math.round(performanceResults.reduce((sum, r) => sum + r.fileSize, 0) / performanceResults.length),
    results: performanceResults
  };
  
  fs.writeFileSync(
    path.join(RESULTS_DIR, 'accessibility-static-summary.json'),
    JSON.stringify(a11ySummary, null, 2)
  );
  
  fs.writeFileSync(
    path.join(RESULTS_DIR, 'performance-static-summary.json'),
    JSON.stringify(perfSummary, null, 2)
  );
  
  console.log('\n\n📊 Audit Summary:');
  console.log(`  Accessibility: ${a11ySummary.averageScore}/100 (${a11ySummary.totalIssues} issues)`);
  console.log(`  Performance: ${perfSummary.averageScore}/100 (avg ${(perfSummary.averageFileSize / 1024).toFixed(2)} KB)`);
  console.log(`\n  Results saved to: ${RESULTS_DIR}/`);
  console.log('\n\n✅ Audit complete!\n');
  
  return { accessibility: a11ySummary, performance: perfSummary };
}

// Run the audit
main().catch(console.error);
