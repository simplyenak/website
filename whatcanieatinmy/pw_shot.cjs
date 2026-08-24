
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await page.goto('http://localhost:4322/');
  await page.waitForTimeout(1000);
  
  // Screenshot just the toggle area
  const toggles = await page.locator('.selector-card');
  await toggles.screenshot({ path: '/tmp/dietary-toggles.png' });
  
  // Click vegetarian to show active state
  await page.click('[data-restriction="vegetarian"]');
  await page.waitForTimeout(300);
  await toggles.screenshot({ path: '/tmp/dietary-toggles-active.png' });
  
  // Screenshot hero area
  const hero = await page.locator('.hero');
  await hero.screenshot({ path: '/tmp/dietary-hero.png' });
  
  // Mobile toggle view
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('http://localhost:4322/');
  await page.waitForTimeout(500);
  const mobileToggles = await page.locator('.selector-card');
  await mobileToggles.screenshot({ path: '/tmp/dietary-toggles-mobile.png' });
  
  await browser.close();
  console.log('Done');
})();
