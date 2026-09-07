// ThriveCart product creation - find and click create button
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
  
  // Navigate to create page
  await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products/create' });
  await sleep(3000);
  
  // Take screenshot
  await cdp.send('Page.captureScreenshot', { format: 'png' });
  
  // Step 1: Find and click "Create new product" button in modal
  const step1 = await evalJs(cdp, `
    (() => {
      // Look for all buttons
      const allBtns = Array.from(document.querySelectorAll('button'));
      console.log('Total buttons:', allBtns.length);
      
      // Find button with text "Create new product"
      const createBtn = allBtns.find(b => b.textContent.trim() === 'Create new product');
      if (createBtn) {
        console.log('Found create button, clicking...');
        createBtn.click();
        return 'clicked create button';
      }
      
      // Also check for any button containing this text
      const anyCreateBtn = allBtns.find(b => b.textContent.includes('Create new product'));
      if (anyCreateBtn) {
        anyCreateBtn.click();
        return 'clicked alternative create button';
      }
      
      // List all button texts for debugging
      const texts = allBtns.map(b => ({ tag: b.tagName, text: b.textContent.trim().substring(0, 30), id: b.id, class: b.className.substring(0, 50) }));
      return 'buttons not found: ' + JSON.stringify(texts);
    })()
  `);
  
  console.log('Step 1:', step1);
  await sleep(2500);
  
  // Take screenshot
  await cdp.send('Page.captureScreenshot', { format: 'png' });
  
  // Step 2: Check what's on the page now
  const step2 = await evalJs(cdp, `
    (() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const visible = inputs.filter(i => {
        const style = window.getComputedStyle(i);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
      
      // Also check for form fields in modals/dialogs
      const modals = document.querySelectorAll('[class*="modal"], [class*="dialog"], [class*="overlay"]');
      
      return {
        url: window.location.href,
        inputCount: visible.length,
        modalCount: modals.length,
        inputs: visible.map(i => ({ 
          type: i.type, 
          id: i.id, 
          name: i.name, 
          placeholder: i.placeholder 
        }))
      };
    })()
  `);
  
  console.log('Step 2:', JSON.stringify(step2, null, 2));
  
  const createdProducts = [];
  
  // Try to create each product
  for (const product of PRODUCTS) {
    console.log(`\n=== ${product.name} ===`);
    
    // Navigate to create page
    await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products/create' });
    await sleep(3000);
    
    // Dismiss any modals
    await evalJs(cdp, `
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      document.body.click();
    `);
    await sleep(1000);
    
    // Take screenshot
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Step 1: Click "Create new product" button
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
    
    await sleep(2500);
    
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
          inputs: visible.map(i => ({ 
            type: i.type, 
            id: i.id, 
            placeholder: i.placeholder 
          }))
        };
      })()
    `);
    
    console.log(`  Form state: ${JSON.stringify(formState, null, 2)}`);
    
    // Fill form if fields exist
    if (formState.inputCount > 2) {
      const nameField = formState.inputs.find(f => f.type === 'text' && !f.placeholder?.toLowerCase().includes('search'));
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
      
      const priceField = formState.inputs.find(f => f.type === 'text' && (f.placeholder?.toLowerCase().includes('price') || f.id?.toLowerCase().includes('price')));
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
