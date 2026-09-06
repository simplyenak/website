// ThriveCart product creation - direct approach
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

// Get all visible buttons and their text
async function getAllButtons(cdp) {
  return await evalJs(cdp, `
    (() => {
      const btns = Array.from(document.querySelectorAll('button, a, span'));
      const visible = btns.filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      return visible.map(el => ({
        tag: el.tagName.toLowerCase(),
        text: el.textContent.trim().substring(0, 50),
        rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) }
      })).filter(b => b.text.length > 0);
    })()
  `);
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
  
  // Get all buttons
  const buttons = await getAllButtons(cdp);
  console.log('All visible buttons:');
  buttons.forEach(b => console.log(`  ${b.text} at (${b.rect.x},${b.rect.y})`));
  
  // Look for Create product button
  const createBtn = buttons.find(b => b.text.includes('Create') || b.text.includes('New Product'));
  console.log('\nCreate button:', createBtn ? createBtn.text : 'NOT FOUND');
  
  const createdProducts = [];
  
  for (const product of PRODUCTS) {
    console.log(`\n=== ${product.name} ===`);
    
    // Navigate to create page
    await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products/create' });
    await sleep(3000);
    
    // Dismiss modals
    await evalJs(cdp, `
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      document.body.click();
    `);
    await sleep(1000);
    
    // Get buttons again
    const buttons2 = await getAllButtons(cdp);
    console.log('Buttons after nav:');
    buttons2.forEach(b => console.log(`  ${b.text} at (${b.rect.x},${b.rect.y})`));
    
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
          inputCount: visible.length,
          inputs: visible.map(i => ({ type: i.type, id: i.id, placeholder: i.placeholder }))
        };
      })()
    `);
    console.log('Form state:', JSON.stringify(formState, null, 2));
    
    // Fill form if available
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
