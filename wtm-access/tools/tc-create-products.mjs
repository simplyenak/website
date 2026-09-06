// ThriveCart automation using CDP
import { listTabs, connect, evalJs } from './cdp.mjs';
import fs from 'fs';

const TC_EMAIL = process.env.TC_EMAIL || 'info@simplyenak.com';
const TC_PASS = process.env.TC_PASS || 'ZoYamIVavAmu69';

const PRODUCTS = [
  { name: 'Penang Food Guide', price: '8', slug: 'city-penang' },
  { name: 'KL Food Guide', price: '8', slug: 'city-kl' },
  { name: 'Melaka Food Guide', price: '8', slug: 'city-melaka' },
  { name: 'Halal Food Guide', price: '12', slug: 'dietary-halal' },
  { name: 'Vegetarian Food Guide', price: '12', slug: 'dietary-veg' },
];

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 180000);

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Starting ThriveCart automation...');
  
  const tabs = await listTabs();
  let tab = tabs.find(t => t.url.includes('thrivecart.com'));
  
  if (!tab) {
    console.log('No ThriveCart tab found, navigating to login...');
    // Use the first available tab
    tab = tabs[0];
  }
  
  const cdp = await connect(tab.webSocketDebuggerUrl);
  
  // Navigate to login
  await cdp.send('Page.navigate', { url: 'https://thrivecart.com/login/' });
  await sleep(3000);
  
  // Find and fill form
  const inputs = await evalJs(cdp, `
    (() => {
      const i = Array.from(document.querySelectorAll('input'));
      return i.map(x => ({ type: x.type, name: x.name, id: x.id, visible: x.offsetParent !== null }));
    })()
  `);
  console.log('Inputs:', JSON.stringify(inputs));
  
  // Fill email
  const emailInput = inputs.find(x => x.type === 'email' || x.name === 'username');
  if (emailInput) {
    await evalJs(cdp, `
      (() => {
        const el = document.querySelector('#signin-username, input[name="username"], input[type="email"]');
        if (el) {
          const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
          d.set.call(el, '${TC_EMAIL}');
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          return 'filled';
        }
        return 'not found';
      })()
    `);
  }
  
  // Fill password
  const passInput = inputs.find(x => x.type === 'password');
  if (passInput) {
    await evalJs(cdp, `
      (() => {
        const el = document.querySelector('#signin-password, input[name="password"]');
        if (el) {
          const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
          d.set.call(el, '${TC_PASS}');
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          return 'filled';
        }
        return 'not found';
      })()
    `);
  }
  
  // Click sign in
  await evalJs(cdp, `
    (() => {
      const btn = document.querySelector('button[type="submit"], input[type="submit"]');
      if (btn) {
        btn.click();
        return 'clicked';
      }
      return 'not found';
    })()
  `);
  
  await sleep(3000);
  
  // Check if logged in
  const currentUrl = await evalJs(cdp, 'window.location.href');
  console.log('Current URL:', currentUrl);
  
  if (currentUrl.includes('/login')) {
    console.error('Login failed!');
    await cdp.send('Page.captureScreenshot', { quality: 80 });
    const screen = await evalJs(cdp, 'document.body.innerText');
    console.log('Page content:', screen.slice(0, 500));
    return;
  }
  
  // Navigate to products
  await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products' });
  await sleep(2000);
  
  const createdProducts = [];
  
  for (const product of PRODUCTS) {
    console.log(`\nCreating: ${product.name}`);
    
    // Try to click "Create product" or navigate directly
    await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products/create' });
    await sleep(2000);
    
    const pageTitle = await evalJs(cdp, 'document.title');
    console.log(`  Title: ${pageTitle}`);
    
    // Check page content
    const bodyText = await evalJs(cdp, 'document.body.innerText');
    console.log(`  Body preview: ${bodyText.slice(0, 200)}`);
    
    // Fill form if available
    const formFields = await evalJs(cdp, `
      (() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        return inputs.map(i => ({
          type: i.type, name: i.name, id: i.id, 
          placeholder: i.placeholder, visible: i.offsetParent !== null
        }));
      })()
    `);
    console.log('  Form fields:', JSON.stringify(formFields));
    
    // Try to fill product name
    const nameInput = formFields.find(f => f.type === 'text' && !f.name.includes('price') && !f.name.includes('currency'));
    if (nameInput) {
      await evalJs(cdp, `
        (() => {
          const el = document.querySelector('input[name="name"], input[placeholder*="product"], input[placeholder*="name"]');
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
    }
    
    // Take screenshot
    await evalJs(cdp, `
      (() => {
        return new Promise(resolve => {
          window.scrollTo(0, document.body.scrollHeight);
          setTimeout(() => resolve('scrolled'), 500);
        });
      })()
    `);
    
    const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png', quality: 80 });
    fs.writeFileSync(`/tmp/tc-create-${product.slug}.png`, Buffer.from(screenshot.data, 'base64'));
    console.log(`  Screenshot: /tmp/tc-create-${product.slug}.png`);
    
    // Get product ID from URL if created
    const url = await evalJs(cdp, 'window.location.href');
    const match = url.match(/product\/(\d+)/);
    if (match) {
      createdProducts.push({ ...product, id: match[1], url });
      console.log(`  ✓ Product ID: ${match[1]}`);
    }
  }
  
  console.log('\n=== RESULTS ===');
  console.log(JSON.stringify(createdProducts, null, 2));
  fs.writeFileSync('/tmp/tc-created-products.json', JSON.stringify(createdProducts, null, 2));
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
