// Direct navigation to product creation
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
  console.log('Creating products via direct navigation...');
  
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
    
    // Navigate directly to create page
    await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products/create' });
    await sleep(4000);
    
    // Take screenshot
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Get page state
    const pageState = await evalJs(cdp, `
      (() => {
        const modal = document.querySelector('.modal, [role="dialog"], .dialog');
        const form = document.querySelector('form');
        const inputs = Array.from(document.querySelectorAll('input'));
        return {
          url: window.location.href,
          modalExists: !!modal,
          formExists: !!form,
          modalText: modal ? modal.innerText.slice(0, 200) : 'none',
          inputCount: inputs.length,
          inputs: inputs.map(i => ({
            type: i.type,
            id: i.id,
            name: i.name,
            placeholder: i.placeholder,
            visible: i.offsetParent !== null
          }))
        };
      })()
    `);
    console.log(`  URL: ${pageState.url}`);
    console.log(`  Modal: ${pageState.modalExists}, Form: ${pageState.formExists}`);
    console.log(`  Inputs: ${pageState.inputCount}`);
    pageState.inputs.filter(i => i.visible).forEach(i => {
      console.log(`    - ${i.type} #${i.id} "${i.placeholder}"`);
    });
    
    // Fill product name if form exists
    if (pageState.formExists || pageState.modalExists) {
      const nameInput = pageState.inputs.find(i => i.visible && i.type === 'text' && !i.placeholder?.toLowerCase().includes('search'));
      if (nameInput) {
        await evalJs(cdp, `
          (() => {
            const el = document.querySelector('#${nameInput.id}');
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
      const priceInput = pageState.inputs.find(i => i.visible && i.type === 'text' && (i.placeholder?.toLowerCase().includes('price') || i.id?.toLowerCase().includes('price')));
      if (priceInput) {
        await evalJs(cdp, `
          (() => {
            const el = document.querySelector('#${priceInput.id}');
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
    }
    
    // Screenshot after fill
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Look for buttons
    const buttons = await evalJs(cdp, `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns
          .filter(b => {
            const text = (b.textContent || '').trim();
            return text.includes('Continue') || text.includes('Save') || text.includes('Next') || text.includes('Create new');
          })
          .map(b => ({
            text: b.textContent.trim(),
            rect: b.getBoundingClientRect()
          }));
      })()
    `);
    console.log(`  Buttons: ${JSON.stringify(buttons)}`);
    
    // Click button if found
    if (buttons.length > 0) {
      const btn = buttons[0];
      if (btn.rect.width > 0) {
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
    const finalUrl = await evalJs(cdp, 'window.location.href');
    const match = finalUrl.match(/product\/(\d+)/);
    if (match) {
      createdProducts.push({ ...product, id: match[1], url: finalUrl });
      console.log(`  ✓ Product ID: ${match[1]}`);
    } else {
      console.log(`  Not created. URL: ${finalUrl}`);
      // Get more info
      const bodyText = await evalJs(cdp, 'document.body.innerText').catch(() => '');
      console.log(`  Body: ${bodyText.slice(0, 300)}`);
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
