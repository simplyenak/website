// ThriveCart product creation - simplified approach
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
    
    // Navigate to products list
    await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products' });
    await sleep(2000);
    
    // Click "Create new product" button using JS click
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
    
    // Wait for modal to appear
    await sleep(2000);
    
    // Take screenshot
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Check page state
    const state = await evalJs(cdp, `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const createNewBtn = btns.find(b => b.textContent.trim() === 'Create new product');
        const digitalBtn = btns.find(b => (b.textContent || '').includes('Digital'));
        return {
          url: window.location.href,
          hasCreateBtn: !!createNewBtn,
          hasDigitalBtn: !!digitalBtn,
          createBtnRect: createNewBtn ? createNewBtn.getBoundingClientRect() : null,
          digitalBtnRect: digitalBtn ? digitalBtn.getBoundingClientRect() : null
        };
      })()
    `);
    console.log(`  State: create=${state.hasCreateBtn}, digital=${state.hasDigitalBtn}`);
    
    // If we see Digital option, click it
    if (state.hasDigitalBtn && state.digitalBtnRect && state.digitalBtnRect.width > 0) {
      const rect = state.digitalBtnRect;
      const x = Math.round(rect.x + rect.width / 2);
      const y = Math.round(rect.y + rect.height / 2);
      
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mousePressed', x, y, button: 'left', clickCount: 1
      });
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mouseReleased', x, y, button: 'left', clickCount: 1
      });
      console.log(`  Clicked Digital at (${x}, ${y})`);
      await sleep(2000);
    }
    
    // Take screenshot
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Check for form fields
    const fields = await evalJs(cdp, `
      (() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        return inputs.filter(i => i.offsetParent !== null).map(i => ({
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
    
    // Fill name
    const nameField = fields.find(f => f.type === 'text' && !f.placeholder?.toLowerCase().includes('search'));
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
    
    // Screenshot
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Click Continue button
    const continueBtn = await evalJs(cdp, `
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
    console.log(`  Continue: ${continueBtn}`);
    
    await sleep(3000);
    
    // Check result
    const finalUrl = await evalJs(cdp, 'window.location.href');
    const match = finalUrl.match(/product\/(\d+)/);
    if (match) {
      createdProducts.push({ ...product, id: match[1], url: finalUrl });
      console.log(`  ✓ Product ID: ${match[1]}`);
    } else {
      console.log(`  Not created. URL: ${finalUrl}`);
      await cdp.send('Page.captureScreenshot', { format: 'png' });
    }
    
    // Go back to list
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
