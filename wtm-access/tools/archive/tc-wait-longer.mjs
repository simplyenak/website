// ThriveCart product creation - longer waits
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
    
    // Take screenshot before any interaction
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Find and click "Create new product" button
    const clickResult = await evalJs(cdp, `
      (() => {
        const allBtns = Array.from(document.querySelectorAll('button'));
        const createBtn = allBtns.find(b => b.textContent.trim() === 'Create new product');
        if (createBtn) {
          createBtn.click();
          return 'clicked';
        }
        return 'not found';
      })()
    `);
    console.log(`  Create button: ${clickResult}`);
    
    // Wait longer to see if modal changes
    console.log('  Waiting 3 seconds...');
    await sleep(3000);
    
    // Take screenshot after wait
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Check what's on the page now
    const state = await evalJs(cdp, `
      (() => {
        const text = document.body.innerText;
        const inputs = Array.from(document.querySelectorAll('input'));
        const visible = inputs.filter(i => {
          const rect = i.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        });
        
        // Look for form fields
        const nameField = visible.find(i => i.placeholder?.toLowerCase().includes('name') || i.id?.toLowerCase().includes('name'));
        const priceField = visible.find(i => i.placeholder?.toLowerCase().includes('price') || i.id?.toLowerCase().includes('price'));
        
        return {
          url: window.location.href,
          inputCount: visible.length,
          hasNameField: !!nameField,
          hasPriceField: !!priceField,
          hasContinue: text.includes('Continue'),
          hasProductTitle: text.includes('Product Title'),
          inputs: visible.slice(0, 10).map(i => ({ 
            type: i.type, 
            id: i.id, 
            placeholder: i.placeholder 
          }))
        };
      })()
    `);
    
    console.log(`  State: ${JSON.stringify(state, null, 2)}`);
    
    // Fill form if fields exist
    if (state.hasNameField || state.hasPriceField) {
      // Find name field
      if (state.hasNameField) {
        const nameInput = await evalJs(cdp, `
          (() => {
            const inputs = Array.from(document.querySelectorAll('input'));
            return inputs.find(i => i.placeholder?.toLowerCase().includes('name') || i.id?.toLowerCase().includes('name'));
          })()
        `);
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
          console.log(`  Filled name field`);
        }
      }
      
      // Find price field
      if (state.hasPriceField) {
        const priceInput = await evalJs(cdp, `
          (() => {
            const inputs = Array.from(document.querySelectorAll('input'));
            return inputs.find(i => i.placeholder?.toLowerCase().includes('price') || i.id?.toLowerCase().includes('price'));
          })()
        `);
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
          console.log(`  Filled price field`);
        }
      }
      
      await cdp.send('Page.captureScreenshot', { format: 'png' });
      
      // Click Continue
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
