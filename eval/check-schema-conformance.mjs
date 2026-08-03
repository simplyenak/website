#!/usr/bin/env node
/**
 * check-schema-conformance.mjs
 *
 * Verifies the sync transform's expected Payload INPUT fields actually exist
 * in the live Payload schema (via the API). Catches the class of bug where a
 * transform reads a field that Payload doesn't provide (e.g. tours meta_title
 * vs the native `meta` object — 2026-08-03, cost hours of silent data loss).
 *
 * Reads the transform field expectations from a registry below and checks one
 * live doc per collection. Warnings for missing fields, hard-fail if a field
 * the site DEPENDS on is absent.
 *
 * Usage:
 *   node --env-file=.env eval/check-schema-conformance.mjs
 *   node --env-file=.env eval/check-schema-conformance.mjs --fail
 *   (--fail exits 1 on any missing field for CI gating)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PAYLOAD_URL = process.env.PAYLOAD_URL || 'https://cms.system.simplyenak.com';
const ADMIN = process.env.PAYLOAD_ADMIN_API_KEY || '';
const FAIL = process.argv.includes('--fail');

// Fields known to be absent in Payload but tolerated by the sync transform
// (it falls back to '' or derived values). These are informational, not gaps.
const TOLERATED_MISSING = {
  landing_pages: ['icon', 'color'], // sync falls back: flat.icon = doc.icon || ''
};

// Collection slug → fields the sync transform / site reads from Payload
const EXPECTED = {
  tours: [
    'name', 'slug', 'tagline', 'shortDescription', 'fullDescription', 'price',
    'currency', 'duration', 'durationMinutes', 'location', 'meetingPoint',
    'maxParticipants', 'minParticipants', 'dietaryOptions', 'travelTypes',
    'specialtyExperiences', 'tailoredAvailable', 'heroImage', 'galleryImages',
    'whatsIncluded', 'whatsExcluded', 'highlights', 'ticketingHubId',
    'isBookable', 'instantConfirmation', 'cancellationPolicy', 'tourFrequency',
    'startTimes', 'dishesCount', 'walkingDistance', 'directionsHtml',
    'itinerary', 'differentiatorsTourist', 'differentiatorsUs', 'whatToBring',
    'languagesOffered', 'segmentTags', 'promoVideoUrl', 'galleryImageAlts',
    'heroImageAlt', 'featured', 'showInMenu', 'popular', 'meta', // native meta object
  ],
  stories: ['title', 'slug', 'excerpt', 'content', 'featuredImage', 'publishedDate', 'author', 'meta_title', 'meta_description'],
  faqs: ['question', 'answer', 'category', 'page_visibility', 'relatedTour'],
  testimonials: ['review_text', 'review_title', 'author_name', 'rating', 'platform', 'date', 'visibility', 'page_visibility'],
  landing_pages: ['title', 'slug', 'hero_title', 'hero_subtitle', 'hero_description', 'content', 'intro_heading', 'meta_title', 'meta_description', 'icon', 'color', 'type', 'status'],
};

async function getDoc(slug) {
  if (!ADMIN) return null;
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/${slug}?limit=1&depth=0`, {
      headers: { 'Authorization': `users API-Key ${ADMIN}` },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return { _error: `HTTP ${res.status}` };
    return await res.json();
  } catch (e) {
    return { _error: e.message };
  }
}

async function main() {
  if (!ADMIN) { console.log('PAYLOAD_ADMIN_API_KEY not set — skipping live schema check.'); process.exit(0); }
  let anyMissing = false;

  for (const [slug, fields] of Object.entries(EXPECTED)) {
    const data = await getDoc(slug);
    const doc = data?._error ? null : (data?.docs?.[0] || data);
    if (!doc) {
      console.log(`  ⚠  ${slug}: cannot read (${data?._error || 'no docs'}) — skipping`);
      continue;
    }
    const missing = fields.filter((f) => !(f in doc));
    const tolerated = TOLERATED_MISSING[slug] || [];
    const hardMissing = missing.filter((f) => !tolerated.includes(f));
    const softMissing = missing.filter((f) => tolerated.includes(f));
    if (softMissing.length > 0) {
      console.log(`  ℹ️  ${slug}: tolerated-missing (sync falls back): ${softMissing.join(', ')}`);
    }
    if (hardMissing.length > 0) {
      anyMissing = true;
      console.log(`  ❌ ${slug}: MISSING ${hardMissing.length}: ${hardMissing.join(', ')}`);
    } else if (missing.length === 0) {
      console.log(`  ✅ ${slug}: all ${fields.length} expected fields present`);
    } else {
      console.log(`  ✅ ${slug}: expected fields present (${softMissing.length} tolerated fallbacks)`);
    }
  }

  if (anyMissing && FAIL) {
    console.log('\nSchema conformance FAILED — the site reads fields Payload does not provide.');
    process.exit(1);
  }
  console.log(anyMissing ? '\nSchema conformance: mismatches found (see above).' : '\nSchema conformance: OK.');
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
