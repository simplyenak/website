// ThriveCart - check for tax compliance block - FIXED
import { listTabs, connect, evalJs } from './cdp.mjs';
import fs from 'fs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 60000);

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const tabs = await listTabs();
  const tab = tabs.find(t => t.url.includes('thrivecart.com'));
  
  if (!tab) {
    console.error('No ThriveCart tab found');
    return;
  }
  
  const cdp = await connect(tab.webSocketDebuggerUrl);
  
  // Navigate to products page
  await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products' });
  await sleep(3000);
  
  // Dismiss modals
  await evalJs(cdp, `
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    document.body.click();
  `);
  await sleep(1000);
  
  // Try clicking "Show products" toggle
  await evalJs(cdp, `
    (() => {
      const elements = Array.from(document.querySelectorAll('span, div, button'));
      const showProducts = elements.find(el => el.textContent.trim() === 'Show products');
      if (showProducts) {
        showProducts.click();
        return 'clicked show products';
      }
      
      // Try finding checkbox
      const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
      const checkbox = checkboxes.find(c => c.offsetParent !== null);
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        return 'toggled checkbox';
      }
      
      return 'no toggle found';
    })()
  `);
  
  await sleep(2000);
  
  // Take screenshot
  await cdp.send('Page.captureScreenshot', { format: 'png' });
  
  // Now click Create product
  await evalJs(cdp, `
    const allLinks = Array.from(document.querySelectorAll('a'));
    const createLink = allLinks.find(l => l.textContent.trim() === 'Create product');
    if (createLink) createLink.click();
  `);
  
  await sleep(5000);
  
  // Check state after creating
  const afterCreate = await evalJs(cdp, `
    (() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const visible = inputs.filter(i => {
        const rect = i.getBoundingClientRect();
        return rect.width > 10 && rect.height > 10;
      });
      
      const nameField = visible.find(i => {
        const text = (i.placeholder || '').toLowerCase();
        return text.includes('name') || text.includes('title');
      });
      
      const priceField = visible.find(i => {
        const text = (i.placeholder || '').toLowerCase();
        return text.includes('price');
      });
      
      return {
        url: window.location.href,
        visibleInputCount: visible.length,
        hasNameField: !!nameField,
        hasPriceField: !!priceField,
        inputs: visible.slice(0, 5).map(i => ({ type: i.type, id: i.id, placeholder: i.placeholder }))
      };
    })()
  `);
  
  console.log('After create:', JSON.stringify(afterCreate, null, 2));
  
  // Take screenshot
  await cdp.send('Page.captureScreenshot', { format: 'png' });
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
