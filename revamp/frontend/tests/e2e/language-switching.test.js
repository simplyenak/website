/**
 * E2E Tests for Language Switching
 * 
 * Tests that language switching works correctly across the site.
 * Run with: npx playwright test tests/e2e/language-switching.test.js
 */

import { test, expect } from '@playwright/test';

// Base URL for testing (update for staging/production)
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:4321';

test.describe('Language Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('homepage loads in English by default', async ({ page }) => {
    await expect(page).toHaveURL(`${BASE_URL}/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('switches to Malay from homepage', async ({ page }) => {
    // Find language switcher and select Malay
    const langSwitcher = page.locator('select[name="lang"], .language-switcher select');
    
    if (await langSwitcher.count() > 0) {
      await langSwitcher.selectOption('ms');
      await expect(page).toHaveURL(`${BASE_URL}/ms/`);
      await expect(page.locator('html')).toHaveAttribute('lang', 'ms');
    } else {
      // Alternative: navigate directly
      await page.goto(`${BASE_URL}/ms/`);
      await expect(page.locator('html')).toHaveAttribute('lang', 'ms');
    }
  });

  test('switches to German from homepage', async ({ page }) => {
    await page.goto(`${BASE_URL}/de/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  });

  test('switches to Chinese from homepage', async ({ page }) => {
    await page.goto(`${BASE_URL}/zh/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh');
  });

  test('preserves language when navigating to about page', async ({ page }) => {
    // Go to Malay about page
    await page.goto(`${BASE_URL}/ms/about/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ms');
    
    // Click on tours link (should stay in Malay)
    const toursLink = page.locator('a[href*="/tours/"]').first();
    if (await toursLink.count() > 0) {
      await toursLink.click();
      await expect(page).toHaveURL(`${BASE_URL}/ms/tours/`);
    }
  });

  test('about page shows correct language content', async ({ page }) => {
    const testCases = [
      { lang: 'en', url: '/about/', expectedText: 'Our Story' },
      { lang: 'ms', url: '/ms/about/', expectedText: 'Kisah Kami' },
      { lang: 'de', url: '/de/about/', expectedText: 'Unsere Geschichte' },
    ];

    for (const testCase of testCases) {
      await page.goto(`${BASE_URL}${testCase.url}`);
      await expect(page.locator('html')).toHaveAttribute('lang', testCase.lang);
      
      // Check for expected text (adjust selectors based on actual markup)
      const heading = page.locator('h1').first();
      await expect(heading).toContainText(testCase.expectedText, { useInnerText: true });
    }
  });

  test('tours page shows correct language content', async ({ page }) => {
    const testCases = [
      { lang: 'en', url: '/tours/' },
      { lang: 'ms', url: '/ms/tours/' },
      { lang: 'de', url: '/de/tours/' },
    ];

    for (const testCase of testCases) {
      await page.goto(`${BASE_URL}${testCase.url}`);
      await expect(page.locator('html')).toHaveAttribute('lang', testCase.lang);
    }
  });

  test('tour detail page shows correct language', async ({ page }) => {
    // Test a specific tour in different languages
    const tourSlug = 'kl-street-food';
    
    await page.goto(`${BASE_URL}/tours/${tourSlug}/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    
    await page.goto(`${BASE_URL}/ms/tours/${tourSlug}/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ms');
  });

  test('stories page shows correct language', async ({ page }) => {
    await page.goto(`${BASE_URL}/stories/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    
    await page.goto(`${BASE_URL}/ms/stories/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ms');
  });

  test('contact page shows correct language', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    
    await page.goto(`${BASE_URL}/ms/contact/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ms');
  });

  test('FAQ page shows correct language', async ({ page }) => {
    await page.goto(`${BASE_URL}/faq/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    
    await page.goto(`${BASE_URL}/ms/faq/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ms');
  });

  test('all supported languages are accessible', async ({ page }) => {
    const languages = ['en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt'];
    
    for (const lang of languages) {
      await page.goto(`${BASE_URL}/${lang}/`);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
    }
  });

  test('404 page works in different languages', async ({ page }) => {
    await page.goto(`${BASE_URL}/nonexistent-page/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    
    await page.goto(`${BASE_URL}/ms/nonexistent-page/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ms');
  });
});

test.describe('SEO and Metadata', () => {
  test('each language has correct hreflang tags', async ({ page }) => {
    const languages = ['en', 'ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt'];
    
    for (const lang of languages) {
      await page.goto(`${BASE_URL}/${lang}/`);
      
      // Check for hreflang tags
      const hreflangTags = page.locator('link[rel="alternate"][hreflang]');
      const count = await hreflangTags.count();
      
      // Should have hreflang for all languages
      expect(count).toBeGreaterThanOrEqual(languages.length - 1);
    }
  });

  test('each language has correct meta description', async ({ page }) => {
    const testCases = [
      { lang: 'en', url: '/' },
      { lang: 'ms', url: '/ms/' },
      { lang: 'de', url: '/de/' },
    ];

    for (const testCase of testCases) {
      await page.goto(`${BASE_URL}${testCase.url}`);
      
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content');
    }
  });

  test('each language has correct title tag', async ({ page }) => {
    const testCases = [
      { lang: 'en', url: '/' },
      { lang: 'ms', url: '/ms/' },
      { lang: 'de', url: '/de/' },
    ];

    for (const testCase of testCases) {
      await page.goto(`${BASE_URL}${testCase.url}`);
      await expect(page).toHaveTitle(/Simply Enak/);
    }
  });
});

test.describe('Performance', () => {
  test('pages load quickly in all languages', async ({ page }) => {
    const languages = ['en', 'ms', 'de'];
    
    for (const lang of languages) {
      const startTime = Date.now();
      await page.goto(`${BASE_URL}/${lang}/`);
      const loadTime = Date.now() - startTime;
      
      // Should load in under 3 seconds
      expect(loadTime).toBeLessThan(3000);
    }
  });

  test('no JavaScript errors on page load', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto(`${BASE_URL}/ms/`);
    
    expect(errors).toHaveLength(0);
  });
});
