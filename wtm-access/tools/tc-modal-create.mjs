// Click modal button properly
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
    await sleep(3000);
    
    // Take screenshot to see state
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Click the "Create new product" button using trusted mouse event
    const clickResult = await evalJs(cdp, `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const createBtn = btns.find(b => b.textContent.trim() === 'Create new product');
        if (createBtn) {
          // Get fresh coordinates
          const rect = createBtn.getBoundingClientRect();
          const x = Math.round(rect.x + rect.width / 2);
          const y = Math.round(rect.y + rect.height / 2);
          
          // Dispatch trusted click
          createBtn.click();
          return { clicked: true, rect: { x, y, width: rect.width, height: rect.height } };
        }
        return { clicked: false };
      })()
    `);
    console.log(`  Click result: ${JSON.stringify(clickResult)}`);
    
    // Wait for modal to appear
    await sleep(2000);
    
    // Screenshot after click
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Check if modal appeared
    const modalState = await evalJs(cdp, `
      (() => {
        const modal = document.querySelector('.modal, [role="dialog"], .dialog, .tc-modal');
        return {
          exists: !!modal,
          text: modal ? modal.innerText.slice(0, 500) : 'none',
          url: window.location.href
        };
      })()
    `);
    console.log(`  Modal: ${JSON.stringify(modalState)}`);
    
    // If modal exists, wait for it to render form
    if (modalState.exists) {
      await sleep(2000);
      
      // Take another screenshot
      await cdp.send('Page.captureScreenshot', { format: 'png' });
      
      // Get form fields in modal
      const modalInputs = await evalJs(cdp, `
        (() => {
          const modal = document.querySelector('.modal, [role="dialog"], .dialog, .tc-modal');
          if (!modal) return [];
          const inputs = Array.from(modal.querySelectorAll('input, select, textarea'));
          return inputs.map(i => ({
            type: i.type,
            id: i.id,
            name: i.name,
            placeholder: i.placeholder,
            visible: i.offsetParent !== null
          }));
        })()
      `);
      console.log(`  Modal inputs: ${JSON.stringify(modalInputs)}`);
      
      // Fill name field
      const nameField = modalInputs.find(i => i.visible && i.type === 'text' && !i.placeholder?.toLowerCase().includes('search'));
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
        console.log(`  Filled name field`);
      }
      
      // Fill price field
      const priceField = modalInputs.find(i => i.visible && i.type === 'text' && (i.placeholder?.toLowerCase().includes('price') || i.id?.toLowerCase().includes('price')));
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
        console.log(`  Filled price field`);
      }
      
      // Screenshot after filling
      await cdp.send('Page.captureScreenshot', { format: 'png' });
      
      // Find and click Continue/Save button
      const saveBtn = await evalJs(cdp, `
        (() => {
          const modal = document.querySelector('.modal, [role="dialog"], .dialog, .tc-modal');
          if (!modal) return null;
          const btn = modal.querySelector('button');
          if (btn) {
            const rect = btn.getBoundingClientRect();
            return {
              text: btn.textContent.trim(),
              rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
            };
          }
          return null;
        })()
      `);
      console.log(`  Save button: ${JSON.stringify(saveBtn)}`);
      
      if (saveBtn && saveBtn.rect.width > 0) {
        const x = Math.round(saveBtn.rect.x + saveBtn.rect.width / 2);
        const y = Math.round(saveBtn.rect.y + saveBtn.rect.height / 2);
        
        await cdp.send('Input.dispatchMouseEvent', {
          type: 'mousePressed', x, y, button: 'left', clickCount: 1
        });
        await cdp.send('Input.dispatchMouseEvent', {
          type: 'mouseReleased', x, y, button: 'left', clickCount: 1
        });
        console.log(`  Clicked save at (${x}, ${y})`);
        await sleep(3000);
      }
      
      // Check if product was created
      const finalUrl = await evalJs(cdp, 'window.location.href');
      const match = finalUrl.match(/product\/(\d+)/);
      if (match) {
        createdProducts.push({ ...product, id: match[1], url: finalUrl });
        console.log(`  ✓ Product ID: ${match[1]}`);
      }
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
