# Testing Guide - Simply Enak Translation System

## Overview

The translation system has comprehensive test coverage including:
- **Unit tests** for translation functions
- **Validation tests** for file structure
- **E2E tests** for language switching behavior

---

## Running Tests

### Unit Tests (Vitest)

```bash
# Run all unit tests
npm run test:run

# Run in watch mode (during development)
npm run test

# Run with coverage report
npm run test:coverage
```

**What's tested:**
- `applyTranslation()` function
- `getImageUrl()` function
- Translation file existence
- Translation file validity (JSON)
- Page file structure
- getStaticPaths configuration

**Location:** `frontend/tests/*.test.js`

---

### E2E Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/e2e/language-switching.test.js

# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**What's tested:**
- Language switching functionality
- URL routing per language
- Content displays in correct language
- Navigation preserves language
- SEO metadata (hreflang, title, description)
- Page load performance
- JavaScript errors

**Location:** `frontend/tests/e2e/*.test.js`

**Requirements:**
- Server running (`npm run dev` or `npm run preview`)
- Set `TEST_BASE_URL` environment variable if not using default

---

## Test Coverage

### Unit Tests (27 tests)

| Suite | Tests | Description |
|-------|-------|-------------|
| applyTranslation | 8 | Translation merging logic |
| getImageUrl | 6 | Image URL handling |
| Translation Files | 7 | File existence and validity |
| Content Files | 4 | JSON structure validation |
| Page Files | 2 | Dynamic page configuration |

### E2E Tests (20+ tests)

| Suite | Tests | Description |
|-------|-------|-------------|
| Language Switching | 12 | Switching between languages |
| Content Validation | 6 | Correct language content |
| SEO & Metadata | 3 | hreflang, titles, descriptions |
| Performance | 2 | Load times, JS errors |

---

## Continuous Integration

Tests run automatically in these scenarios:

### Pre-commit Hook
```bash
npm run precommit:check
```
Runs:
1. Directus sync check
2. Full sync from Directus
3. Translation validation
4. Unit tests

### Pre-build Hook
(If enabled)
```bash
npm run build
```
Runs unit tests before building.

### CI/CD Pipeline
(GitHub Actions example)
```yaml
- name: Run Tests
  run: |
    npm ci
    npm run test:run
    npx playwright install
    npm run test:e2e
```

---

## Writing New Tests

### Unit Test Example

```javascript
// tests/my-feature.test.js
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/lib/my-module';

describe('My Feature', () => {
  it('does something useful', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });
});
```

### E2E Test Example

```javascript
// tests/e2e/my-feature.test.js
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:4321';

test.describe('My Feature', () => {
  test('works correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/my-page/`);
    await expect(page.locator('h1')).toContainText('Expected Text');
  });
});
```

---

## Test Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `TEST_BASE_URL` | `http://localhost:4321` | Base URL for E2E tests |
| `CI` | `false` | Enable CI mode (more retries, fewer workers) |

---

## Debugging Tests

### Unit Tests
```bash
# Run specific test file
npm run test:run -- tests/translation.test.js

# Run specific test by name
npm run test:run -- -t "applies translation"

# Run with verbose output
npm run test:run -- --reporter=verbose
```

### E2E Tests
```bash
# Run with UI (interactive debugging)
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/e2e/language-switching.test.js

# Run in headed mode (see browser)
npx playwright test --headed

# Run with slow motion
npx playwright test --slowmo=1000

# Generate HTML report
npx playwright test --reporter=html
npx playwright show-report
```

---

## Common Issues

### "Cannot find module" Error
**Fix:** Ensure imports use correct paths:
```javascript
// ✅ Correct
import { x } from '@/lib/module';
import { y } from '../src/lib/module';

// ❌ Wrong
import { x } from '../lib/module';
```

### Playwright Tests Timeout
**Fix:** Increase timeout or check server:
```javascript
test('my test', async ({ page }) => {
  test.setTimeout(30000); // 30 seconds
  // ...
});
```

### Tests Pass Locally But Fail in CI
**Fix:** Check for:
- Environment variable differences
- Race conditions (add waits)
- Browser-specific issues (test all browsers)

---

## Coverage Reports

```bash
# Generate coverage
npm run test:coverage

# View HTML report
open coverage/index.html
```

**Target coverage:**
- Functions: 80%+
- Branches: 70%+
- Lines: 80%+

---

## Best Practices

1. **Test behavior, not implementation**
   ```javascript
   // ✅ Good
   expect(result.name).toBe('Malay Name');
   
   // ❌ Bad
   expect(result.translations[0].languages_code).toBe('ms');
   ```

2. **Use descriptive test names**
   ```javascript
   // ✅ Good
   it('applies Malay translations when available');
   
   // ❌ Bad
   it('works');
   ```

3. **Keep tests independent**
   - Each test should run in isolation
   - No shared state between tests
   - Clean up after yourself

4. **Test edge cases**
   - Empty values
   - Null/undefined
   - Missing translations
   - Invalid input

5. **E2E tests should be minimal**
   - Test critical user flows only
   - Unit tests for logic
   - E2E for integration

---

## Maintenance

### When Adding New Translation Fields
1. Update unit tests for `applyTranslation()`
2. Update validation tests for required fields
3. Run tests to verify

### When Adding New Languages
1. Update E2E test language list
2. Update validation test language list
3. Run all tests

### When Changing Page Structure
1. Update E2E test selectors
2. Update validation test paths
3. Run E2E tests

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/react-testing-library/intro/)

---

**Last Updated:** 2026-03-29  
**Test Count:** 27 unit tests + 20+ E2E tests
