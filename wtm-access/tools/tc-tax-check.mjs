// ThriveCart - check for tax compliance block
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
  
  // Check for tax compliance banner and try to toggle it
  const taxInfo = await evalJs(cdp, `
    (() => {
      // Find tax compliance elements
      const taxElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const text = el.textContent || '';
        return text.includes('Tax') || text.includes('compliance') || text.includes('Stripe');
      });
      
      // Find the toggle
      const toggle = taxElements.find(el => {
        const classList = el.className || '';
        return classList.includes('toggle') || classList.includes('switch') || el.tagName === 'LABEL';
      });
      
      // Find any clickable element related to tax
      const taxLinks = Array.from(document.querySelectorAll('a, button, span, div')).filter(el => {
        const text = el.textContent.trim();
        return text.includes('Show products') || text.includes('Review your tax');
      });
      
      return {
        taxElementCount: taxElements.length,
        taxElements: taxElements.slice(0, 5).map(e => ({
          tag: e.tagName,
          class: e.className.substring(0, 100),
          text: e.textContent.trim().substring(0, 100)
        })),
        clickableTaxElements: taxLinks.map(e => ({
          tag: e.tagName,
          text: e.textContent.trim(),
          class: e.className.substring(0, 50)
        }))
      };
    })()
  `);
  
  console.log('Tax compliance info:', JSON.stringify(taxInfo, null, 2));
  
  // Try clicking "Show products" link if it exists
  await evalJs(cdp, `
    (() => {
      const links = Array.from(document.querySelectorAll('a, span, button'));
      const showProducts = links.find(l => l.textContent.trim() === 'Show products');
      if (showProducts) {
        showProducts.click();
        return 'clicked show products';
      }
      
      // Try finding the toggle
      const toggles = Array.from(document.querySelectorAll('input[type="checkbox"]'));
      const toggle = toggles.find(t => t.offsetParent !== null);
      if (toggle) {
        toggle.checked = !toggle.checked;
        toggle.dispatchEvent(new Event('change', { bubbles: true }));
        return 'toggled checkbox';
      }
      
      return 'no toggle found';
    })()
  `);
  
  await sleep(2000);
  
  // Take screenshot
  await cdp.send('Page.captureScreenshot', { format: 'png' });
  
  // Now try to create a product
  await evalJs(cdp, `
    const links = Array.from(document.querySelectorAll('a'));
    const createLink = links.find(l => l.textContent.trim() === 'Create product');
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
      
      // Look for form fields
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
