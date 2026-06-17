/**
 * Unit tests for content translation and image URL functions
 * Updated for Payload CMS (replaces old Directus-based tests)
 */

import { describe, it, expect } from 'vitest';
import { applyTranslation, getImageUrl } from '../src/lib/content.js';

describe('applyTranslation', () => {
  it('returns original item if no translations exist', () => {
    const item = {
      id: 1,
      name: 'KL Street Food',
      description: 'Amazing food tour'
    };

    const result = applyTranslation(item, 'ms');

    expect(result).toEqual(item);
    expect(result.name).toBe('KL Street Food');
  });

  it('returns original item if language is English', () => {
    const item = {
      id: 1,
      name: 'KL Street Food',
      translations: [
        { languages_code: 'ms', name_translated: 'Makanan Jalan KL' }
      ]
    };

    const result = applyTranslation(item, 'en');

    expect(result.name).toBe('KL Street Food');
  });

  it('applies translation when available (_translated suffix)', () => {
    const item = {
      id: 1,
      name: 'KL Street Food',
      description: 'Amazing food tour',
      translations: [
        {
          languages_code: 'ms',
          name_translated: 'Makanan Jalan KL',
          description_translated: 'Lawatan makanan yang menakjubkan'
        }
      ]
    };

    const result = applyTranslation(item, 'ms');

    expect(result.name).toBe('Makanan Jalan KL');
    expect(result.description).toBe('Lawatan makanan yang menakjubkan');
  });

  it('applies translation with plain field names (no _translated suffix)', () => {
    const item = {
      id: 1,
      name: 'KL Street Food',
      translations: [
        {
          languages_code: 'ms',
          name: 'Makanan Jalan KL'
        }
      ]
    };

    const result = applyTranslation(item, 'ms');

    expect(result.name).toBe('Makanan Jalan KL');
  });

  it('falls back to English if translation missing for requested language', () => {
    const item = {
      id: 1,
      name: 'KL Street Food',
      translations: [
        {
          languages_code: 'de',
          name_translated: 'KL Straßenessen'
        }
      ]
    };

    const result = applyTranslation(item, 'ms');

    expect(result.name).toBe('KL Street Food');
  });

  it('skips empty translation values', () => {
    const item = {
      id: 1,
      name: 'KL Street Food',
      translations: [
        {
          languages_code: 'ms',
          name_translated: ''
        }
      ]
    };

    const result = applyTranslation(item, 'ms');

    // Empty string should not override
    expect(result.name).toBe('KL Street Food');
  });

  it('preserves non-translated nested objects', () => {
    const item = {
      id: 1,
      name: 'KL Street Food',
      metadata: {
        duration: '4 hours',
        price: 285
      },
      translations: [
        {
          languages_code: 'ms',
          name_translated: 'Makanan Jalan KL'
        }
      ]
    };

    const result = applyTranslation(item, 'ms');

    expect(result.name).toBe('Makanan Jalan KL');
    expect(result.metadata).toEqual({
      duration: '4 hours',
      price: 285
    });
  });

  it('handles null item gracefully', () => {
    const result = applyTranslation(null, 'ms');
    expect(result).toBeNull();
  });

  it('handles undefined item gracefully', () => {
    const result = applyTranslation(undefined, 'ms');
    expect(result).toBeUndefined();
  });

  it('handles item without translations array', () => {
    const item = {
      id: 1,
      name: 'KL Street Food'
    };

    const result = applyTranslation(item, 'ms');

    expect(result).toEqual(item);
  });
});

describe('getImageUrl', () => {
  it('returns null for falsy values', () => {
    expect(getImageUrl(null)).toBeNull();
    expect(getImageUrl(undefined)).toBeNull();
    expect(getImageUrl('')).toBeNull();
  });

  it('returns full URL as-is', () => {
    const url = 'https://example.com/image.jpg';
    expect(getImageUrl(url)).toBe(url);
  });

  it('returns S3 URL as-is in dev', () => {
    const s3Url = 'https://se-website-images.s3.nl-ams.scw.cloud/image.jpg';
    const result = getImageUrl(s3Url);

    // In dev mode (no PROD env), returns the original URL
    expect(result).toBe(s3Url);
  });

  it('constructs Payload media URL for string UUIDs', () => {
    const uuid = 'abc123-def456';
    const result = getImageUrl(uuid);

    expect(result).toContain('/api/media/file/abc123-def456');
  });

  it('adds query params for image options', () => {
    const uuid = 'abc123';
    const result = getImageUrl(uuid, { width: 800, height: 600 });

    expect(result).toContain('width=800');
    expect(result).toContain('height=600');
  });

  it('handles Payload numeric media IDs', () => {
    const result = getImageUrl(42);

    expect(result).toContain('/api/media/file/42');
  });

  it('returns local paths as-is', () => {
    const path = '/images/local-image.jpg';
    expect(getImageUrl(path)).toBe(path);
  });
});
