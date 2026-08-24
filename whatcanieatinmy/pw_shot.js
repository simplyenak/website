
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await page.goto('http://localhost:4322/');
  await page.waitForTimeout(1000);
  
  // Click vegetarian and halal
  await page.click('[data-restriction="vegetarian"]');
  await page.click('[data-restriction="halal"]');
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: '/tmp/dietary-with-results.png', fullPage: true });
  await page.screenshot({ path: '/tmp/dietary-results-viewport.png', fullPage: false });
  
  // Also test search
  await page.fill('#dish-search', 'laksa');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/dietary-search.png', fullPage: false });
  
  await browser.close();
  console.log('Done');
})();
