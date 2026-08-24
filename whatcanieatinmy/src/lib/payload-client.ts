/**
 * Payload API Client — Live fetch from Payload CMS REST API
 *
 * Provides direct API access to Payload for `whatcanieatinmy.com`
 */

// Read configurations from .env (Astro auto-loads .env files for builds)
export const PAYLOAD_URL =
  (typeof process !== 'undefined' && (process as any).env?.PAYLOAD_URL) ||
  'http://localhost:3000';

export const PAYLOAD_TOKEN =
  (typeof process !== 'undefined' && (process as any).env?.PAYLOAD_TOKEN) || '';

// Cache to avoid redundant fetches
const cache = new Map<string, any[] | null>();

// Clear in-memory cache
export function clearPayloadCache() {
  cache.clear();
}

// Generic API fetcher for Payload collections
export async function fetchCollection(
  slug: string,
  options: { depth?: number; limit?: number; where?: Record<string, any>; locale?: string } = {},
): Promise<any[] | null> {
  const cacheKey = `collection:${slug}:${JSON.stringify(options)}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  try {
    const url = new URL(`${PAYLOAD_URL.replace(/\/+$/, '')}/api/${slug}`);
    if (options.limit) url.searchParams.set('limit', `${options.limit}`);
    if (options.depth) url.searchParams.set('depth', `${options.depth}`);
    if (options.locale) url.searchParams.set('locale', options.locale);
    if (options.where) url.searchParams.set('where', JSON.stringify(options.where));

    const headers: Record<string, string> = {};
    if (PAYLOAD_TOKEN) headers['Authorization'] = `Bearer ${PAYLOAD_TOKEN}`;

    const res = await fetch(url.toString(), { headers });
    const json = (await res.json()) as { docs: any[] };

    if (json.docs) cache.set(cacheKey, json.docs);
    return json.docs;
  } catch (err) {
    console.error(`[Payload Fetch Error] ${slug}: ${(err as Error)?.message}`);
    return null;
  }
}