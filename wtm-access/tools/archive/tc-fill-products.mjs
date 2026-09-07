// Continue ThriveCart product creation - fill form
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
  console.log('Continuing product creation...');
  
  const tabs = await listTabs();
  const tab = tabs.find(t => t.url.includes('thrivecart.com'));
  
  if (!tab) {
    console.error('No ThriveCart tab found');
    return;
  }
  
  const cdp = await connect(tab.webSocketDebuggerUrl);
  
  // Click "Create new product" button
  console.log('Clicking Create new product...');
  await evalJs(cdp, `
    (() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const createBtn = btns.find(b => b.textContent.trim() === 'Create new product');
      if (createBtn) {
        createBtn.click();
        return 'clicked create button';
      }
      return 'not found';
    })()
  `);
  
  await sleep(3000);
  
  const createdProducts = [];
  
  for (const product of PRODUCTS) {
    console.log(`\nCreating: ${product.name}`);
    
    // Get current URL
    const url = await evalJs(cdp, 'window.location.href');
    console.log(`  URL: ${url}`);
    
    // Check for form fields
    const formFields = await evalJs(cdp, `
      (() => {
        const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
        return inputs.map(i => ({
          type: i.type,
          name: i.name,
          id: i.id,
          placeholder: i.placeholder,
          value: i.value,
          visible: i.offsetParent !== null,
          tagName: i.tagName
        }));
      })()
    `);
    const visibleFields = formFields.filter(f => f.visible);
    console.log('  Visible fields:', JSON.stringify(visibleFields, null, 2));
    
    // Fill product name
    const nameField = visibleFields.find(f => f.type === 'text' && !f.placeholder?.includes('search') && !f.placeholder?.includes('filter'));
    if (nameField) {
      await evalJs(cdp, `
        (() => {
          const el = document.querySelector('#${nameField.id}');
          if (el) {
            const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
            d.set.call(el, '${product.name}');
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            return 'filled name';
          }
          return 'not found';
        })()
      `);
    }
    
    // Fill price
    const priceField = visibleFields.find(f => f.type === 'text' && (f.placeholder?.includes('price') || f.placeholder?.includes('amount') || f.placeholder?.includes('$')));
    if (priceField) {
      await evalJs(cdp, `
        (() => {
          const el = document.querySelector('#${priceField.id}');
          if (el) {
            const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
            d.set.call(el, '${product.price}');
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            return 'filled price';
          }
          return 'not found';
        })()
      `);
    }
    
    // Look for currency selector
    const currencySelect = visibleFields.find(f => f.tagName === 'SELECT' && f.name?.includes('currency'));
    if (currencySelect) {
      await evalJs(cdp, `
        (() => {
          const el = document.querySelector('#${currencySelect.id}');
          if (el) {
            el.value = 'MYR';
            el.dispatchEvent(new Event('change', { bubbles: true }));
            return 'selected MYR';
          }
          return 'not found';
        })()
      `);
    }
    
    // Take screenshot
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Look for action buttons
    const buttons = await evalJs(cdp, `
      (() => {
        const btns = Array.from(document.querySelectorAll('button, a'));
        return btns
          .filter(b => {
            const text = (b.textContent || '').trim();
            return text.includes('Continue') || text.includes('Save') || text.includes('Next') || text.includes('Create');
          })
          .map(b => ({
            tag: b.tagName,
            text: b.textContent.trim().slice(0, 40),
            href: b.href,
            visible: b.offsetParent !== null,
            rect: b.getBoundingClientRect()
          }));
      })()
    `);
    console.log('  Action buttons:', JSON.stringify(buttons, null, 2));
    
    // Click continue/save
    if (buttons.length > 0) {
      const btn = buttons.find(b => b.text.includes('Continue') || b.text.includes('Save') || b.text.includes('Next'));
      if (btn) {
        // Use click with coordinates
        const rect = btn.rect;
        const x = Math.round(rect.x + rect.width / 2);
        const y = Math.round(rect.y + rect.height / 2);
        
        await cdp.send('Input.dispatchMouseEvent', {
          type: 'mousePressed', x, y, button: 'left', clickCount: 1
        });
        await cdp.send('Input.dispatchMouseEvent', {
          type: 'mouseReleased', x, y, button: 'left', clickCount: 1
        });
        console.log(`  Clicked: ${btn.text}`);
        await sleep(2000);
      }
    }
    
    // Check if product was created
    const newUrl = await evalJs(cdp, 'window.location.href');
    const match = newUrl.match(/product\/(\d+)/);
    if (match) {
      createdProducts.push({ ...product, id: match[1], url: newUrl });
      console.log(`  ✓ Created product ID: ${match[1]}`);
    } else {
      console.log(`  Product not created, current URL: ${newUrl}`);
      // Take screenshot to debug
      await cdp.send('Page.captureScreenshot', { format: 'png' });
      const bodyText = await evalJs(cdp, 'document.body.innerText').catch(() => '');
      console.log(`  Body: ${bodyText.slice(0, 400)}`);
    }
    
    // Navigate back to products list
    await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products' });
    await sleep(2000);
  }
  
  console.log('\n=== RESULTS ===');
  console.log(JSON.stringify(createdProducts, null, 2));
  fs.writeFileSync('/tmp/tc-created-products.json', JSON.stringify(createdProducts, null, 2));
  console.log('\nSaved to /tmp/tc-created-products.json');
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
