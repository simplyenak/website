// ThriveCart product creation - preserve create button
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

// Dismiss onboarding WITHOUT removing create button
async function dismissOnboarding(cdp) {
  // Find and click Close link in onboarding modal ONLY
  await evalJs(cdp, `
    (() => {
      // Find the onboarding modal specifically
      const allElements = document.querySelectorAll('*');
      const onboardingEl = Array.from(allElements).find(el => {
        const text = el.textContent || '';
        return text.includes('Get Started with ThriveCart') || text.includes('Onboarding Checklist');
      });
      
      if (onboardingEl) {
        // Find Close button/link within this element
        const closeBtn = onboardingEl.querySelector('a, span, button');
        if (closeBtn && closeBtn.textContent.trim().toLowerCase() === 'close') {
          closeBtn.click();
          return 'clicked close in onboarding';
        }
        
        // Click outside the modal
        document.body.click();
        return 'clicked body';
      }
      
      // Press Escape to close modals
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      return 'pressed escape';
    })()
  `);
  
  await sleep(1000);
  
  // Verify onboarding is gone but create button still exists
  const check = await evalJs(cdp, `
    (() => {
      const text = document.body.innerText;
      const btns = Array.from(document.querySelectorAll('button'));
      const hasOnboarding = text.includes('Get Started') || text.includes('Onboarding');
      const hasCreateBtn = btns.some(b => b.textContent.trim() === 'Create new product');
      return { hasOnboarding, hasCreateBtn };
    })()
  `);
  console.log(`  Status: ${JSON.stringify(check)}`);
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
    
    // Take screenshot before dismissing
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Dismiss onboarding carefully
    console.log('  Dismissing onboarding...');
    await dismissOnboarding(cdp);
    
    // Take screenshot after
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Step 1: Click "Create new product"
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
    
    // Check for form fields
    const step2 = await evalJs(cdp, `
      (() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        const visible = inputs.filter(i => {
          const style = window.getComputedStyle(i);
          return style.display !== 'none' && style.visibility !== 'hidden' && i.offsetParent !== null;
        });
        
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
