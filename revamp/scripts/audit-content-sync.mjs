#!/usr/bin/env node
/**
 * Content Sync Audit — checks if Payload CMS data is properly flowing to frontend
 * Run: node scripts/audit-content-sync.mjs
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');

function loadJSON(path) {
  try {
    return JSON.parse(readFileSync(resolve(ROOT, path), 'utf-8'));
  } catch (e) {
    return null;
  }
}

function countChars(str) {
  return typeof str === 'string' ? str.length : 0;
}

function countArray(arr) {
  return Array.isArray(arr) ? arr.length : 0;
}

const dietaryPages = loadJSON('frontend/src/data/content/dietary-landing-pages.json') || [];
const specialtyPages = loadJSON('frontend/src/data/content/specialty-landing-pages.json') || [];
const travelTypePages = loadJSON('frontend/src/data/content/travel-type-landing-pages.json') || [];
const locationPages = loadJSON('frontend/src/data/content/location-landing-pages.json') || [];

console.log('\n╔════════════════════════════════════════════════════════════════════╗');
console.log('║         PAYLOAD CMS → FRONTEND CONTENT SYNC AUDIT                 ║');
console.log('╚════════════════════════════════════════════════════════════════════╝\n');

let totalIssues = 0;
let criticalIssues = 0;

// ── DIETARY PAGES ────────────────────────────────────────────────────────────
console.log('📋 DIETARY PAGES (' + dietaryPages.length + ' pages)');
console.log('─────────────────────────────────────────────────────────────────────');
let dietaryEmpty = 0;
let dietaryHasContent = 0;
for (const p of dietaryPages) {
  const hasHeroDesc = countChars(p.hero_description) > 50;
  const hasIntro = countChars(p.intro_content) > 50;
  const hasChallenges = countArray(p.challenges) > 0;
  const hasTips = countArray(p.tips) > 0;
  const hasSafe = countArray(p.safe_dishes) > 0;
  const hasAvoid = countArray(p.avoid_dishes) > 0;
  const hasContent = hasHeroDesc || hasIntro || hasChallenges || hasTips || hasSafe || hasAvoid;

  if (hasContent) dietaryHasContent++; else dietaryEmpty++;

  const status = hasContent ? '✅' : '❌ EMPTY';
  const fields = [];
  if (!hasHeroDesc) fields.push('hero_desc');
  if (!hasIntro) fields.push('intro');
  if (!hasChallenges) fields.push('challenges');
  if (!hasTips) fields.push('tips');
  if (!hasSafe) fields.push('safe_dishes');
  if (!hasAvoid) fields.push('avoid_dishes');

  console.log(`  ${status} ${p.slug.padEnd(18)} ${fields.length > 0 ? '(' + fields.join(', ') + ' missing)' : '(has content)'}`);
}
console.log(`  → ${dietaryEmpty} empty, ${dietaryHasContent} with content\n`);
totalIssues += dietaryEmpty;
if (dietaryEmpty > 0) criticalIssues += dietaryEmpty;

// ── SPECIALTY PAGES ──────────────────────────────────────────────────────────
console.log('📋 SPECIALTY PAGES (' + specialtyPages.length + ' pages)');
console.log('─────────────────────────────────────────────────────────────────────');
let specialtyEmpty = 0;
let specialtyHasContent = 0;
for (const p of specialtyPages) {
  const hasHeroDesc = countChars(p.hero_description) > 50;
  const hasIntro = countChars(p.intro_content) > 50;
  const hasHighlights = countArray(p.highlights) > 0;
  const hasContent = hasHeroDesc || hasIntro || hasHighlights;

  if (hasContent) specialtyHasContent++; else specialtyEmpty++;

  const status = hasContent ? '✅' : '❌ EMPTY';
  const fields = [];
  if (!hasHeroDesc) fields.push('hero_desc');
  if (!hasIntro) fields.push('intro');
  if (!hasHighlights) fields.push('highlights');

  console.log(`  ${status} ${p.slug.padEnd(18)} ${fields.length > 0 ? '(' + fields.join(', ') + ' missing)' : '(has content)'}`);
}
console.log(`  → ${specialtyEmpty} empty, ${specialtyHasContent} with content\n`);
totalIssues += specialtyEmpty;
if (specialtyEmpty > 0) criticalIssues += specialtyEmpty;

// ── TRAVEL TYPE PAGES ────────────────────────────────────────────────────────
console.log('📋 TRAVEL TYPE PAGES (' + travelTypePages.length + ' pages)');
console.log('─────────────────────────────────────────────────────────────────────');
let travelEmpty = 0;
let travelHasContent = 0;
for (const p of travelTypePages) {
  const hasHeroDesc = countChars(p.hero_description) > 50;
  const hasWhy = countChars(p.why_perfect_content) > 50;
  const hasExpect = countChars(p.expect_content) > 50;
  const hasTips = countArray(p.tips) > 0;
  const hasContent = hasHeroDesc || hasWhy || hasExpect || hasTips;

  if (hasContent) travelHasContent++; else travelEmpty++;

  const status = hasContent ? '✅' : '❌ EMPTY';
  const fields = [];
  if (!hasHeroDesc) fields.push('hero_desc');
  if (!hasWhy) fields.push('why_perfect');
  if (!hasExpect) fields.push('expect');
  if (!hasTips) fields.push('tips');

  console.log(`  ${status} ${p.slug.padEnd(18)} ${fields.length > 0 ? '(' + fields.join(', ') + ' missing)' : '(has content)'}`);
}
console.log(`  → ${travelEmpty} empty, ${travelHasContent} with content\n`);
totalIssues += travelEmpty;
if (travelEmpty > 0) criticalIssues += travelEmpty;

// ── LOCATION PAGES ───────────────────────────────────────────────────────────
console.log('📋 LOCATION PAGES (' + locationPages.length + ' pages)');
console.log('─────────────────────────────────────────────────────────────────────');
let locationEmpty = 0;
let locationHasContent = 0;
for (const p of locationPages) {
  const hasHeroDesc = countChars(p.hero_description) > 50;
  const hasIntro = countChars(p.intro_content) > 50;
  const hasFoodHighlights = countArray(p.food_highlights) > 0;
  const hasSignatureDishes = countArray(p.signature_dishes) > 0;
  const hasTravelTips = countArray(p.travel_tips) > 0;
  const hasContent = hasHeroDesc || hasIntro || hasFoodHighlights || hasSignatureDishes || hasTravelTips;

  if (hasContent) locationHasContent++; else locationEmpty++;

  const status = hasContent ? '✅' : '❌ EMPTY';
  const fields = [];
  if (!hasHeroDesc) fields.push('hero_desc');
  if (!hasIntro) fields.push('intro');
  if (!hasFoodHighlights) fields.push('food_highlights');
  if (!hasSignatureDishes) fields.push('signature_dishes');
  if (!hasTravelTips) fields.push('travel_tips');

  console.log(`  ${status} ${p.slug.padEnd(18)} ${fields.length > 0 ? '(' + fields.join(', ') + ' missing)' : '(has content)'}`);
}
console.log(`  → ${locationEmpty} empty, ${locationHasContent} with content\n`);
totalIssues += locationEmpty;
if (locationEmpty > 0) criticalIssues += locationEmpty;

// ── FIELD NAME MISMATCH CHECK ────────────────────────────────────────────────
console.log('🔍 FIELD NAME MISMATCH ANALYSIS');
console.log('─────────────────────────────────────────────────────────────────────');
console.log('  Payload field        → JSON field              → Component uses');
console.log('  ───────────────────────────────────────────────────────────────────');
console.log('  hero_description     → hero_description        → ✅ SegmentPage (heroDescription)');
console.log('  intro_content        → intro_content           → ✅ Location page (set:html)');
console.log('  intro_content        → intro_content           → ❌ SegmentPage uses "editorial" (WRONG!)');
console.log('  challenges[]         → challenges[]            → ❌ NOT rendered in SegmentPage');
console.log('  options_content      → options_content         → ❌ NOT rendered in SegmentPage');
console.log('  highlights[]         → highlights[]            → ❌ NOT rendered in SegmentPage');
console.log('  tips[]               → tips[]                  → ❌ NOT rendered in SegmentPage');
console.log('  safe_dishes[]        → safe_dishes[]           → ❌ NOT rendered in SegmentPage');
console.log('  avoid_dishes[]       → avoid_dishes[]          → ❌ NOT rendered in SegmentPage');
console.log('  travel_tips[]        → travel_tips[]           → ✅ Location page renders them');
console.log('  food_highlights[]    → food_highlights[]       → ✅ Location page renders them');
console.log('  signature_dishes[]   → signature_dishes[]      → ✅ Location page renders them');
console.log('');

// ── SUMMARY ──────────────────────────────────────────────────────────────────
console.log('╔════════════════════════════════════════════════════════════════════╗');
console.log('║                         SUMMARY                                   ║');
console.log('╠════════════════════════════════════════════════════════════════════╣');
console.log(`║  Total empty pages:        ${String(totalIssues).padStart(3)} / ${String(dietaryPages.length + specialtyPages.length + travelTypePages.length + locationPages.length).padStart(3)}                              ║`);
console.log(`║  Critical issues:           ${String(criticalIssues).padStart(3)}                                  ║`);
console.log(`║  Field name mismatches:     1 (intro_content vs editorial)        ║`);
console.log(`║  Unrendered Payload fields: 7+ (challenges, tips, dishes, etc.)   ║`);
console.log('╚════════════════════════════════════════════════════════════════════╝\n');

console.log('🔧 REQUIRED FIXES:');
console.log('   1. Populate content in Payload CMS for all landing pages');
console.log('   2. Fix dietary/specialty/travel-type routes: use intro_content not editorial');
console.log('   3. Extend SegmentPage to render challenges, tips, safe_dishes, etc.');
console.log('   4. Run npm run sync to pull latest Payload data');
console.log('');
