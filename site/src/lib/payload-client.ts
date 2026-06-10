/**
 * Payload API Client — Live fetch from Payload CMS REST API
 *
 * Provides direct API access to Payload with proper error handling
 * so callers can implement a clean fallback chain.
 *
 * Usage:
 *   import { fetchCollection, fetchSingleton } from '~/lib/payload-client';
 *   const tours = await fetchCollection('tours');
 *   const home = await fetchSingleton('home_page');
 */

// Read from process.env (available at build time in Astro/Node context)
// Astro loads .env automatically for server-side code
const PAYLOAD_URL =
  (typeof process !== 'undefined' && (process as any).env?.PAYLOAD_URL) ||
  'http://localhost:3000';

const PAYLOAD_TOKEN =
  (typeof process !== 'undefined' && (process as any).env?.PAYLOAD_TOKEN) || '';

// ── In-memory cache (keyed by collection slug) ──────────────────────────
// Avoids re-fetching the same collection multiple times during one build.
const cache = new Map<string, any[] | null>();

/**
 * Clear the in-memory cache. Useful between dev-server reload cycles.
 */
export function clearPayloadCache() {
  cache.clear();
}

/**
 * Fetch documents from a Payload collection via REST API.
 *
 * @param slug - Collection slug (e.g. 'tours', 'pages', 'faqs')
 * @param options - Optional overrides (depth, limit, where query)
 * @returns Array of docs, or null if the API is unreachable / errors
 */
export async function fetchCollection(
  slug: string,
  options: { depth?: number; limit?: number; where?: Record<string, any> } = {},
): Promise<any[] | null> {
  // Check cache first
  const cacheKey = `collection:${slug}:${JSON.stringify(options)}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  try {
    const url = new URL(`${PAYLOAD_URL.replace(/\/+$/, '')}/api/${slug}`);
    url.searchParams.set('depth', String(options.depth ?? 3));
    url.searchParams.set('limit', String(options.limit ?? 0));

    if (options.where) {
      url.searchParams.set('where', JSON.stringify(options.where));
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (PAYLOAD_TOKEN) {
      headers['Authorization'] = `Bearer ${PAYLOAD_TOKEN}`;
    }

    const res = await fetch(url.toString(), {
      headers,
      signal: AbortSignal.timeout(10_000), // 10s should be plenty
    });

    if (!res.ok) {
      console.warn(`[payload-client] ${slug}: HTTP ${res.status} — falling back`);
      cache.set(cacheKey, null);
      return null;
    }

    const json = await res.json();
    const docs = (json.docs || []) as any[];
    cache.set(cacheKey, docs);
    return docs;
  } catch (err: any) {
    if (err?.name === 'TimeoutError') {
      console.warn(`[payload-client] ${slug}: timeout after 10s — falling back`);
    } else {
      console.warn(`[payload-client] ${slug}: ${err?.message || 'unknown error'} — falling back`);
    }
    cache.set(cacheKey, null);
    return null;
  }
}

/**
 * Fetch a singleton document (first doc from a collection).
 * Returns the doc object, or null if the collection is empty / unreachable.
 */
export async function fetchSingleton(
  slug: string,
  options: { depth?: number } = {},
): Promise<any | null> {
  const cacheKey = `singleton:${slug}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  const docs = await fetchCollection(slug, { ...options, limit: 1 });
  const doc = docs && docs.length > 0 ? docs[0] : null;
  cache.set(cacheKey, doc);
  return doc;
}

/**
 * Check if Payload is reachable.
 * Returns true if the API root responds, false otherwise.
 */
export async function checkPayloadHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${PAYLOAD_URL.replace(/\/+$/, '')}/api/home_page?limit=1`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(8_000),
    });
    return res.ok || res.status === 401 || res.status === 403;
  } catch {
    return false;
  }
}
