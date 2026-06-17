#!/usr/bin/env node
/**
 * Automated Accessibility Audit (Static Files Only)
 * Runs axe-core core rules on HTML files
 * 
 * Usage: node scripts/audit-a11y.cjs
 */

const fs = require('fs');
const path = require('path');
const axe = require('axe-core');

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

async function main() {
  console.log('🔍 Starting Automated Accessibility Audit\n');
  console.log('==========================================\n');
  
  const accessibilityResults = [];
  
  for (const page of PAGES_TO_AUDIT) {
    const filePath = path.join(DIST_DIR, page.file);
    
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
  
  console.log('\n\n📊 Accessibility Summary:');
  console.log(`  Average Score: ${summary.averageScore}/100`);
  console.log(`  Total Violations: ${summary.totalViolations}`);
  console.log(`  Results saved to: ${RESULTS_DIR}/accessibility-summary.json`);
  
  console.log('\n\n✅ Audit complete!\n');
  console.log('Next steps:');
  console.log('1. Review accessibility-summary.json for violations');
  console.log('2. Fix critical violations (wcag2a, wcag2aa)');
  console.log('3. Run again to verify fixes\n');
  
  return summary;
}

// Run the audit
main().catch(console.error);
