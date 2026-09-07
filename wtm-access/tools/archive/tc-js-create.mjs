// ThriveCart product creation - using JS clicks
import { listTabs, connect, evalJs } from './cdp.mjs';
import fs from 'fs';

const PRODUCTS = [
  { name: 'Penang Food Guide', price: '8', slug: 'city-penang' },
  { name: 'KL Food Guide', price: '8', slug: 'city-kl' },
  { name: 'Melaka Food Guide', price: '8', slug: 'city-melaka' },
  { name: 'Halal Food Guide', price: '12', slug: 'dietary-halal' },
  { name: 'Vegetarian Food Guide', price: '12', slug: 'dietary-veg' },
];

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 300000);

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Creating products...');
  
  const tabs = await listTabs();
  const tab = tabs.find(t => t.url.includes('thrivecart.com'));
  
  if (!tab) {
    console.error('No ThriveCart tab found');
    return;
  }
  
  const cdp = await connect(tab.webSocketDebuggerUrl);
  
  const createdProducts = [];
  
  for (const product of PRODUCTS) {
    console.log(`\n=== ${product.name} ===`);
    
    // Navigate to create page
    await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products/create' });
    await sleep(3000);
    
    // Take screenshot
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Click "Create new product" using JS
    const clickResult = await evalJs(cdp, `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const createBtn = btns.find(b => b.textContent.trim() === 'Create new product');
        if (createBtn) {
          createBtn.click();
          return 'clicked';
        }
        return 'not found';
      })()
    `);
    console.log(`  Create button: ${clickResult}`);
    
    // Wait for form to appear
    await sleep(2500);
    
    // Take screenshot
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Check for form fields
    const fields = await evalJs(cdp, `
      (() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        const visible = inputs.filter(i => i.offsetParent !== null);
        return visible.map(i => ({
          type: i.type,
          id: i.id,
          name: i.name,
          placeholder: i.placeholder,
          value: i.value
        }));
      })()
    `);
    console.log(`  Fields: ${fields.length}`);
    fields.forEach(f => console.log(`    - ${f.type} #${f.id} "${f.placeholder}"`));
    
    // Fill product name
    const nameField = fields.find(f => f.type === 'text' && !f.placeholder?.toLowerCase().includes('search') && !f.placeholder?.toLowerCase().includes('filter'));
    if (nameField) {
      await evalJs(cdp, `
        (() => {
          const el = document.querySelector('#${nameField.id}');
          if (el) {
            const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
            d.set.call(el, '${product.name}');
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            return 'filled';
          }
          return 'not found';
        })()
      `);
      console.log(`  Filled name`);
    }
    
    // Fill price
    const priceField = fields.find(f => f.type === 'text' && (f.placeholder?.toLowerCase().includes('price') || f.id?.toLowerCase().includes('price')));
    if (priceField) {
      await evalJs(cdp, `
        (() => {
          const el = document.querySelector('#${priceField.id}');
          if (el) {
            const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
            d.set.call(el, '${product.price}');
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            return 'filled';
          }
          return 'not found';
        })()
      `);
      console.log(`  Filled price`);
    }
    
    // Take screenshot after filling
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Look for Continue button and click with JS
    const continueResult = await evalJs(cdp, `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const continueBtn = btns.find(b => {
          const text = (b.textContent || '').trim();
          return text.includes('Continue') || text.includes('Save');
        });
        if (continueBtn) {
          continueBtn.click();
          return 'clicked: ' + continueBtn.textContent.trim();
        }
        return 'not found';
      })()
    `);
    console.log(`  Continue: ${continueResult}`);
    
    await sleep(3000);
    
    // Check if product was created
    const finalUrl = await evalJs(cdp, 'window.location.href');
    const match = finalUrl.match(/product\/(\d+)/);
    if (match) {
      createdProducts.push({ ...product, id: match[1], url: finalUrl });
      console.log(`  ✓ Product ID: ${match[1]}`);
    } else {
      console.log(`  Not created. URL: ${finalUrl}`);
      await cdp.send('Page.captureScreenshot', { format: 'png' });
    }
    
    // Navigate back to list
    await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products' });
    await sleep(1500);
  }
  
  console.log('\n=== RESULTS ===');
  console.log(JSON.stringify(createdProducts, null, 2));
  fs.writeFileSync('/tmp/tc-created-products.json', JSON.stringify(createdProducts, null, 2));
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
