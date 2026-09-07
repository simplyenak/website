// ThriveCart product creation - correct flow
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
    
    // Check for modal with Create new product button
    const modalState = await evalJs(cdp, `
      (() => {
        const createBtn = Array.from(document.querySelectorAll('button')).find(b => 
          b.textContent.trim() === 'Create new product' && b.offsetParent !== null
        );
        const cancelBtn = Array.from(document.querySelectorAll('button')).find(b => 
          b.textContent.trim() === 'Cancel' && b.offsetParent !== null
        );
        return {
          url: window.location.href,
          hasCreateBtn: !!createBtn,
          hasCancelBtn: !!cancelBtn,
          createRect: createBtn ? createBtn.getBoundingClientRect() : null,
          cancelRect: cancelBtn ? cancelBtn.getBoundingClientRect() : null
        };
      })()
    `);
    console.log(`  Modal state: ${JSON.stringify(modalState)}`);
    
    // Click "Create new product" in modal
    if (modalState.hasCreateBtn && modalState.createRect) {
      const x = Math.round(modalState.createRect.x + modalState.createRect.width / 2);
      const y = Math.round(modalState.createRect.y + modalState.createRect.height / 2);
      
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mousePressed', x, y, button: 'left', clickCount: 1
      });
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mouseReleased', x, y, button: 'left', clickCount: 1
      });
      console.log(`  Clicked Create new product at (${x}, ${y})`);
      await sleep(2500);
    }
    
    // Take screenshot
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Check for form fields now
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
    const priceField = fields.find(f => f.type === 'text' && (f.placeholder?.toLowerCase().includes('price') || f.placeholder?.toLowerCase().includes('amount') || f.id?.toLowerCase().includes('price')));
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
    
    // Look for Continue button
    const continueBtn = await evalJs(cdp, `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const continueBtn = btns.find(b => {
          const text = (b.textContent || '').trim();
          return text.includes('Continue') || text.includes('Save');
        });
        if (continueBtn && continueBtn.offsetParent !== null) {
          const rect = continueBtn.getBoundingClientRect();
          return {
            text: continueBtn.textContent.trim(),
            rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
          };
        }
        return null;
      })()
    `);
    
    if (continueBtn) {
      console.log(`  Found Continue button: ${continueBtn.text}`);
      const x = Math.round(continueBtn.rect.x + continueBtn.rect.width / 2);
      const y = Math.round(continueBtn.rect.y + continueBtn.rect.height / 2);
      
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mousePressed', x, y, button: 'left', clickCount: 1
      });
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mouseReleased', x, y, button: 'left', clickCount: 1
      });
      console.log(`  Clicked at (${x}, ${y})`);
      await sleep(3000);
    } else {
      console.log('  No Continue button found');
    }
    
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
