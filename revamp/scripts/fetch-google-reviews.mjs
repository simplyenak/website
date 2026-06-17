#!/usr/bin/env node
/**
 * Pull Google reviews for Simply Enak using the Places API (New)
 * Run: node scripts/fetch-google-reviews.mjs
 * 
 * Requires: Places API (New) enabled in Google Cloud project se-n8n
 */

const PROJECT_ID = 'se-n8n';
const SEARCH_QUERY = 'Simply Enak Food Experiences Kuala Lumpur';

async function getAccessToken() {
  const { execSync } = await import('child_process');
  return execSync('gcloud auth print-access-token 2>/dev/null').toString().trim();
}

async function searchPlace(token) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Goog-User-Project': PROJECT_ID,
    },
    body: JSON.stringify({
      textQuery: SEARCH_QUERY,
      pageSize: 1,
    }),
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Place search failed: ${err.error?.message || res.status}`);
  }
  
  const data = await res.json();
  if (!data.places || data.places.length === 0) {
    throw new Error('No places found');
  }
  return data.places[0];
}

async function getReviews(token, placeName) {
  // The Places API (New) allows fetching reviews via place name
  const res = await fetch(
    `https://places.googleapis.com/v1/${placeName}?fields=reviews,displayName,rating,userRatingCount`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Goog-User-Project': PROJECT_ID,
      },
    }
  );
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Get place failed: ${err.error?.message || res.status}`);
  }
  
  return await res.json();
}

async function main() {
  console.log('Getting access token...');
  const token = await getAccessToken();
  
  console.log('Searching for Simply Enak...');
  const place = await searchPlace(token);
  console.log(`Found: ${place.displayName?.text} (rating: ${place.rating}, reviews: ${place.userRatingCount})`);
  console.log(`Place name: ${place.name}`);
  
  console.log('\nFetching reviews...');
  const details = await getReviews(token, place.name);
  
  const reviews = details.reviews || [];
  console.log(`\nFound ${reviews.length} reviews\n`);
  
  // Format reviews for social-proof.json
  const formatted = reviews.map((r, i) => ({
    id: i + 1,
    name: r.authorAttribution?.displayName || 'Anonymous',
    text: r.originalText?.text || r.text?.text || '',
    rating: r.rating || 5,
    source: 'google',
    date: r.publishTime || new Date().toISOString().split('T')[0],
    highlighted: i < 3,
  }));
  
  console.log(JSON.stringify(formatted, null, 2));
  
  // Save to file
  const fs = await import('fs');
  const path = await import('path');
  const outPath = path.join(
    process.env.HOME,
    'website-optimization/revamp/frontend/src/data/content/social-proof.json'
  );
  fs.writeFileSync(outPath, JSON.stringify(formatted, null, 2));
  console.log(`\nSaved to ${outPath}`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
