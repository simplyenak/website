// ThriveCart product creation - handle tax compliance banner
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
    
    // Dismiss onboarding and tax banner
    await evalJs(cdp, `
      (() => {
        // Close any modals
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        document.body.click();
        
        // Look for "Show products" toggle
        const showProductsBtn = Array.from(document.querySelectorAll('button, a, span')).find(el => {
          const text = (el.textContent || '').trim();
          return text.includes('Show products') || text.includes('Show Products');
        });
        if (showProductsBtn) {
          showProductsBtn.click();
          return 'clicked show products';
        }
        
        return 'dismissed modals';
      })()
    `);
    await sleep(1500);
    
    // Take screenshot
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Check state again
    const state = await evalJs(cdp, `
      (() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        const visible = inputs.filter(i => {
          const rect = i.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        });
        
        // Look for create button
        const btns = Array.from(document.querySelectorAll('button'));
        const createBtn = btns.find(b => b.textContent.trim() === 'Create new product');
        
        return {
          url: window.location.href,
          inputCount: visible.length,
          hasCreateBtn: !!createBtn,
          createBtnRect: createBtn ? (() => {
            const r = createBtn.getBoundingClientRect();
            return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
          })() : null,
          hasNameField: visible.some(i => i.placeholder?.toLowerCase().includes('name')),
          hasPriceField: visible.some(i => i.placeholder?.toLowerCase().includes('price')),
          hasContinue: document.body.innerText.includes('Continue')
        };
      })()
    `);
    
    console.log(`  State: ${JSON.stringify(state, null, 2)}`);
    
    // Click create button if visible
    if (state.hasCreateBtn && state.createBtnRect) {
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mousePressed',
        x: state.createBtnRect.x,
        y: state.createBtnRect.y,
        button: 'left',
        clickCount: 1
      });
      await sleep(100);
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mouseReleased',
        x: state.createBtnRect.x,
        y: state.createBtnRect.y,
        button: 'left',
        clickCount: 1
      });
      console.log('  Clicked create button');
      await sleep(3000);
      
      // Take screenshot after click
      await cdp.send('Page.captureScreenshot', { format: 'png' });
      
      // Check state again
      const afterClick = await evalJs(cdp, `
        (() => {
          const inputs = Array.from(document.querySelectorAll('input'));
          const visible = inputs.filter(i => {
            const rect = i.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          });
          
          return {
            url: window.location.href,
            inputCount: visible.length,
            hasNameField: visible.some(i => i.placeholder?.toLowerCase().includes('name')),
            hasPriceField: visible.some(i => i.placeholder?.toLowerCase().includes('price')),
            hasContinue: document.body.innerText.includes('Continue'),
            inputs: visible.slice(0, 5).map(i => ({ type: i.type, id: i.id, placeholder: i.placeholder }))
          };
        })()
      `);
      console.log(`  After click: ${JSON.stringify(afterClick, null, 2)}`);
      
      // Fill form if fields exist
      if (afterClick.hasNameField || afterClick.hasPriceField) {
        // Find name field
        const nameField = await evalJs(cdp, `
          (() => {
            const inputs = Array.from(document.querySelectorAll('input'));
            return inputs.find(i => i.placeholder?.toLowerCase().includes('name') || i.id?.toLowerCase().includes('name'));
          })()
        `);
        
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
          console.log('  Filled name');
        }
        
        // Find price field
        const priceField = await evalJs(cdp, `
          (() => {
            const inputs = Array.from(document.querySelectorAll('input'));
            return inputs.find(i => i.placeholder?.toLowerCase().includes('price') || i.id?.toLowerCase().includes('price'));
          })()
        `);
        
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
          console.log('  Filled price');
        }
        
        await cdp.send('Page.captureScreenshot', { format: 'png' });
        
        // Find and click Continue
        const continueCoords = await evalJs(cdp, `
          (() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => {
              const text = (b.textContent || '').trim();
              return text.includes('Continue') || text.includes('Save');
            });
            if (btn) {
              const rect = btn.getBoundingClientRect();
              return { x: Math.round(rect.x + rect.width / 2), y: Math.round(rect.y + rect.height / 2) };
            }
            return null;
          })()
        `);
        
        if (continueCoords) {
          await cdp.send('Input.dispatchMouseEvent', {
            type: 'mousePressed',
            x: continueCoords.x,
            y: continueCoords.y,
            button: 'left'
          });
          await sleep(100);
          await cdp.send('Input.dispatchMouseEvent', {
            type: 'mouseReleased',
            x: continueCoords.x,
            y: continueCoords.y,
            button: 'left'
          });
          console.log('  Clicked Continue');
          await sleep(3000);
        }
      }
    }
    
    // Check result
    const finalUrl = await evalJs(cdp, 'window.location.href');
    const match = finalUrl.match(/product\/(\d+)/);
    if (match) {
      createdProducts.push({ ...product, id: match[1], url: finalUrl });
      console.log(`  ✓ Product ID: ${match[1]}`);
    } else {
      console.log(`  Not created. URL: ${finalUrl}`);
    }
    
    // Navigate back
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
