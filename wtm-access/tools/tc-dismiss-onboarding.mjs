// ThriveCart product creation - dismiss onboarding first
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

// Helper to dismiss onboarding modal
async function dismissOnboarding(cdp) {
  await evalJs(cdp, `
    (() => {
      // Remove onboarding modal if it exists
      const onboarding = document.querySelector('[class*="onboarding"], [class*="get-started"]');
      if (onboarding) {
        onboarding.remove();
        return 'removed onboarding';
      }
      
      // Try to find and click close button
      const closeBtns = Array.from(document.querySelectorAll('button, a, span'));
      const closeBtn = closeBtns.find(b => {
        const text = (b.textContent || '').trim().toLowerCase();
        return text === 'close' || text === 'x' || text === 'dismiss';
      });
      if (closeBtn) {
        closeBtn.click();
        return 'clicked close';
      }
      
      // Try clicking outside the modal
      document.body.click();
      return 'clicked body';
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
  
  const createdProducts = [];
  
  for (const product of PRODUCTS) {
    console.log(`\n=== ${product.name} ===`);
    
    // Navigate to create page
    await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products/create' });
    await sleep(3000);
    
    // Dismiss onboarding modal
    console.log('  Dismissing onboarding...');
    await dismissOnboarding(cdp);
    await sleep(1000);
    
    // Take screenshot
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Step 1: Find and click "Create new product" in the modal
    const step1 = await evalJs(cdp, `
      (() => {
        const allBtns = Array.from(document.querySelectorAll('button'));
        const createBtn = allBtns.find(b => b.textContent.trim() === 'Create new product');
        if (createBtn) {
          createBtn.click();
          return { success: true, msg: 'clicked create btn' };
        }
        return { success: false, msg: 'create btn not found' };
      })()
    `);
    console.log(`  Step 1: ${JSON.stringify(step1)}`);
    
    await sleep(2500);
    
    // Take screenshot
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Step 2: Check for form fields
    const step2 = await evalJs(cdp, `
      (() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        const visible = inputs.filter(i => i.offsetParent !== null);
        
        return {
          url: window.location.href,
          inputCount: visible.length,
          inputs: visible.map(i => ({ 
            type: i.type, 
            id: i.id, 
            name: i.name, 
            placeholder: i.placeholder 
          }))
        };
      })()
    `);
    console.log(`  Step 2: ${JSON.stringify(step2, null, 2)}`);
    
    // Fill form if fields exist
    if (step2.inputCount > 2) {
      const nameField = step2.inputs.find(f => f.type === 'text' && !f.placeholder?.toLowerCase().includes('search'));
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
      
      const priceField = step2.inputs.find(f => f.type === 'text' && (f.placeholder?.toLowerCase().includes('price') || f.id?.toLowerCase().includes('price')));
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
      const step3 = await evalJs(cdp, `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const continueBtn = btns.find(b => {
            const text = (b.textContent || '').trim();
            return text.includes('Continue') || text.includes('Save');
          });
          if (continueBtn) {
            continueBtn.click();
            return { success: true, text: continueBtn.textContent.trim() };
          }
          return { success: false };
        })()
      `);
      console.log(`  Step 3: ${JSON.stringify(step3)}`);
      
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
