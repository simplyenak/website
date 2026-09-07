// ThriveCart product creation - wait for modal to load
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
  
  // Navigate to products page
  await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products' });
  await sleep(3000);
  
  // Dismiss any modals
  await evalJs(cdp, `
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    document.body.click();
  `);
  await sleep(1000);
  
  const createdProducts = [];
  
  for (const product of PRODUCTS) {
    console.log(`\n=== ${product.name} ===`);
    
    // Click Create product link
    await evalJs(cdp, `
      (() => {
        const links = Array.from(document.querySelectorAll('a'));
        const createLink = links.find(l => l.textContent.trim() === 'Create product');
        if (createLink) {
          createLink.click();
          return 'clicked';
        }
        return 'not found';
      })()
    `);
    
    // Wait for modal to load completely
    console.log('  Waiting for modal to load...');
    await sleep(5000);
    
    // Take screenshot
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Check modal state
    const modalState = await evalJs(cdp, `
      (() => {
        // Check for loading state
        const loading = document.body.innerText.includes('Loading');
        
        // Find all buttons
        const btns = Array.from(document.querySelectorAll('button'));
        const visibleBtns = btns.filter(b => {
          const rect = b.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        });
        
        // Find Create new product button
        const createBtn = visibleBtns.find(b => b.textContent.trim() === 'Create new product');
        
        // Find Digital option
        const digitalOption = Array.from(document.querySelectorAll('[class*="digital"], [class*="type"]')).find(el => {
          const text = el.textContent || '';
          return text.toLowerCase().includes('digital');
        });
        
        return {
          url: window.location.href,
          isLoading: loading,
          buttonCount: visibleBtns.length,
          hasCreateBtn: !!createBtn,
          createBtnRect: createBtn ? (() => {
            const r = createBtn.getBoundingClientRect();
            return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
          })() : null,
          hasDigitalOption: !!digitalOption
        };
      })()
    `);
    
    console.log(`  Modal state: ${JSON.stringify(modalState, null, 2)}`);
    
    // Click Digital option if available
    if (modalState.hasDigitalOption && !modalState.isLoading) {
      const digitalCoords = await evalJs(cdp, `
        (() => {
          const el = Array.from(document.querySelectorAll('[class*="digital"], [class*="type"]')).find(el => {
            const text = el.textContent || '';
            return text.toLowerCase().includes('digital');
          });
          if (el) {
            const rect = el.getBoundingClientRect();
            return { x: Math.round(rect.x + rect.width / 2), y: Math.round(rect.y + rect.height / 2) };
          }
          return null;
        })()
      `);
      
      if (digitalCoords) {
        await cdp.send('Input.dispatchMouseEvent', {
          type: 'mousePressed',
          x: digitalCoords.x,
          y: digitalCoords.y,
          button: 'left'
        });
        await sleep(100);
        await cdp.send('Input.dispatchMouseEvent', {
          type: 'mouseReleased',
          x: digitalCoords.x,
          y: digitalCoords.y,
          button: 'left'
        });
        console.log('  Clicked Digital option');
        await sleep(2000);
      }
    }
    
    // Click Create new product button
    if (modalState.hasCreateBtn && modalState.createBtnRect) {
      const { x, y } = modalState.createBtnRect;
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mousePressed',
        x: x,
        y: y,
        button: 'left'
      });
      await sleep(100);
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mouseReleased',
        x: x,
        y: y,
        button: 'left'
      });
      console.log('  Clicked Create new product');
      
      // Wait for form to appear
      await sleep(5000);
      
      // Take screenshot
      await cdp.send('Page.captureScreenshot', { format: 'png' });
      
      // Check for form fields
      const formState = await evalJs(cdp, `
        (() => {
          const inputs = Array.from(document.querySelectorAll('input'));
          const visible = inputs.filter(i => {
            const rect = i.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          });
          
          return {
            url: window.location.href,
            inputCount: visible.length,
            hasNameField: visible.some(i => i.placeholder?.toLowerCase().includes('name') || i.id?.toLowerCase().includes('name')),
            hasPriceField: visible.some(i => i.placeholder?.toLowerCase().includes('price') || i.id?.toLowerCase().includes('price')),
            hasContinue: document.body.innerText.includes('Continue'),
            inputs: visible.slice(0, 5).map(i => ({ type: i.type, id: i.id, placeholder: i.placeholder }))
          };
        })()
      `);
      
      console.log(`  Form state: ${JSON.stringify(formState, null, 2)}`);
      
      // Fill form if fields exist
      if (formState.hasNameField || formState.hasPriceField) {
        // Fill name
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
        
        // Fill price
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
        
        // Click Continue
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
    await sleep(2000);
  }
  
  console.log('\n=== RESULTS ===');
  console.log(JSON.stringify(createdProducts, null, 2));
  fs.writeFileSync('/tmp/tc-created-products.json', JSON.stringify(createdProducts, null, 2));
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
