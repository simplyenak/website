// ThriveCart product creation - click modal and fill form
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
  console.log('Starting ThriveCart product creation...');
  
  const tabs = await listTabs();
  const tab = tabs.find(t => t.url.includes('thrivecart.com'));
  
  if (!tab) {
    console.error('No ThriveCart tab found');
    return;
  }
  
  const cdp = await connect(tab.webSocketDebuggerUrl);
  
  const createdProducts = [];
  
  for (const product of PRODUCTS) {
    console.log(`\n=== Creating: ${product.name} ===`);
    
    // Navigate to products list first
    await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products' });
    await sleep(2000);
    
    // Click "Create new product" button in modal
    const clickResult = await evalJs(cdp, `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const createBtn = btns.find(b => b.textContent.trim() === 'Create new product');
        if (createBtn) {
          createBtn.click();
          return 'clicked create button';
        }
        return 'button not found';
      })()
    `);
    console.log(`  Click result: ${clickResult}`);
    
    await sleep(2000);
    
    // Check what page we're on now
    const currentUrl = await evalJs(cdp, 'window.location.href');
    console.log(`  Current URL: ${currentUrl}`);
    
    // Screenshot
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Get form fields
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
    console.log(`  Visible fields (${visibleFields.length}):`);
    visibleFields.forEach(f => console.log(`    - ${f.type} #${f.id} [${f.name}] placeholder: "${f.placeholder}"`));
    
    // Fill product name
    const nameField = visibleFields.find(f => f.type === 'text' && !f.placeholder?.toLowerCase().includes('search'));
    if (nameField) {
      const fillResult = await evalJs(cdp, `
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
      console.log(`  Name field: ${fillResult}`);
    }
    
    // Fill price
    const priceField = visibleFields.find(f => f.type === 'text' && (f.placeholder?.toLowerCase().includes('price') || f.placeholder?.toLowerCase().includes('amount') || f.id?.toLowerCase().includes('price')));
    if (priceField) {
      const fillResult = await evalJs(cdp, `
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
      console.log(`  Price field: ${fillResult}`);
    }
    
    // Look for currency selector
    const currencySelect = visibleFields.find(f => f.tagName === 'SELECT' && f.name?.toLowerCase().includes('currency'));
    if (currencySelect) {
      const selectResult = await evalJs(cdp, `
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
      console.log(`  Currency: ${selectResult}`);
    }
    
    // Screenshot after filling
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Find and click Continue/Save button
    const buttons = await evalJs(cdp, `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns
          .filter(b => {
            const text = (b.textContent || '').trim();
            return text.includes('Continue') || text.includes('Save') || text.includes('Next') || text.includes('Create');
          })
          .map(b => ({
            text: b.textContent.trim(),
            visible: b.offsetParent !== null,
            rect: b.getBoundingClientRect()
          }));
      })()
    `);
    console.log(`  Action buttons: ${JSON.stringify(buttons)}`);
    
    if (buttons.length > 0) {
      const btn = buttons[0];
      if (btn.rect && btn.rect.width > 0) {
        const x = Math.round(btn.rect.x + btn.rect.width / 2);
        const y = Math.round(btn.rect.y + btn.rect.height / 2);
        
        await cdp.send('Input.dispatchMouseEvent', {
          type: 'mousePressed', x, y, button: 'left', clickCount: 1
        });
        await cdp.send('Input.dispatchMouseEvent', {
          type: 'mouseReleased', x, y, button: 'left', clickCount: 1
        });
        console.log(`  Clicked: ${btn.text} at (${x}, ${y})`);
        await sleep(3000);
      }
    }
    
    // Check if product was created
    const newUrl = await evalJs(cdp, 'window.location.href');
    const match = newUrl.match(/product\/(\d+)/);
    if (match) {
      createdProducts.push({ ...product, id: match[1], url: newUrl });
      console.log(`  ✓ Created product ID: ${match[1]}`);
    } else {
      console.log(`  Product not created yet, URL: ${newUrl}`);
      // Get body text for debugging
      const bodyText = await evalJs(cdp, 'document.body.innerText').catch(() => '');
      console.log(`  Body: ${bodyText.slice(0, 500)}`);
    }
    
    // Navigate back to start next product
    await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products' });
    await sleep(1500);
  }
  
  console.log('\n=== FINAL RESULTS ===');
  console.log(JSON.stringify(createdProducts, null, 2));
  fs.writeFileSync('/tmp/tc-created-products.json', JSON.stringify(createdProducts, null, 2));
  console.log('\nSaved to /tmp/tc-created-products.json');
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
