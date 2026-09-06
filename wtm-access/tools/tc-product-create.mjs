// ThriveCart product creation - handle modal flow
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
    
    // Click "Create new product" button
    const clickResult = await evalJs(cdp, `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const createBtn = btns.find(b => b.textContent.trim() === 'Create new product');
        if (createBtn && createBtn.offsetParent !== null) {
          createBtn.click();
          return 'clicked';
        }
        return 'not found or hidden';
      })()
    `);
    console.log(`  Create button: ${clickResult}`);
    
    // Wait for modal to appear
    await sleep(1500);
    
    // Take screenshot
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Check if the type selection modal is showing
    const modalState = await evalJs(cdp, `
      (() => {
        const digitalBtn = Array.from(document.querySelectorAll('button')).find(b => 
          (b.textContent || '').includes('Digital')
        );
        const createBtn = Array.from(document.querySelectorAll('button')).find(b => 
          b.textContent.trim() === 'Create new product'
        );
        return {
          hasDigitalBtn: !!digitalBtn,
          hasCreateBtn: !!createBtn,
          digitalRect: digitalBtn ? digitalBtn.getBoundingClientRect() : null,
          createRect: createBtn ? createBtn.getBoundingClientRect() : null
        };
      })()
    `);
    console.log(`  Modal state: ${JSON.stringify(modalState)}`);
    
    // Click "Create new product" in the modal
    if (modalState.hasCreateBtn) {
      const rect = modalState.createRect;
      const x = Math.round(rect.x + rect.width / 2);
      const y = Math.round(rect.y + rect.height / 2);
      
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mousePressed', x, y, button: 'left', clickCount: 1
      });
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mouseReleased', x, y, button: 'left', clickCount: 1
      });
      console.log(`  Clicked Create new product at (${x}, ${y})`);
      await sleep(2500);
    }
    
    // Take screenshot after clicking
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Check for form fields now
    const formFields = await evalJs(cdp, `
      (() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        const visibleInputs = inputs.filter(i => i.offsetParent !== null);
        return visibleInputs.map(i => ({
          type: i.type,
          id: i.id,
          name: i.name,
          placeholder: i.placeholder,
          value: i.value
        }));
      })()
    `);
    console.log(`  Form fields: ${formFields.length}`);
    formFields.forEach(f => {
      console.log(`    - ${f.type} #${f.id} "${f.placeholder}"`);
    });
    
    // Fill product name
    const nameField = formFields.find(f => f.type === 'text' && !f.placeholder?.toLowerCase().includes('search'));
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
      console.log(`  Filled name: ${product.name}`);
    }
    
    // Fill price
    const priceField = formFields.find(f => f.type === 'text' && (f.placeholder?.toLowerCase().includes('price') || f.placeholder?.toLowerCase().includes('amount') || f.id?.toLowerCase().includes('price')));
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
      console.log(`  Filled price: ${product.price}`);
    }
    
    // Screenshot after filling
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Look for Continue/Save button
    const continueBtn = await evalJs(cdp, `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const continueBtn = btns.find(b => {
          const text = (b.textContent || '').trim();
          return text.includes('Continue') || text.includes('Save') || text.includes('Next');
        });
        if (continueBtn) {
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
      console.log(`  Found button: ${continueBtn.text}`);
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
    }
    
    // Check if product was created
    const finalUrl = await evalJs(cdp, 'window.location.href');
    const match = finalUrl.match(/product\/(\d+)/);
    if (match) {
      createdProducts.push({ ...product, id: match[1], url: finalUrl });
      console.log(`  ✓ Product ID: ${match[1]}`);
    } else {
      console.log(`  Not created. URL: ${finalUrl}`);
      // Screenshot to debug
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
