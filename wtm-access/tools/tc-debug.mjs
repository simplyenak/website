// Debug ThriveCart create flow
import { listTabs, connect, evalJs } from './cdp.mjs';
import fs from 'fs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 60000);

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Debugging ThriveCart...');
  
  const tabs = await listTabs();
  const tab = tabs.find(t => t.url.includes('thrivecart.com'));
  
  if (!tab) {
    console.error('No ThriveCart tab found');
    return;
  }
  
  const cdp = await connect(tab.webSocketDebuggerUrl);
  
  // Go to products page
  await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products' });
  await sleep(3000);
  
  // Take screenshot
  await cdp.send('Page.captureScreenshot', { format: 'png' });
  
  // Get all clickable elements
  const elements = await evalJs(cdp, `
    (() => {
      const btns = Array.from(document.querySelectorAll('button, a'));
      return btns
        .filter(b => b.offsetParent !== null)
        .map(b => ({
          tag: b.tagName,
          text: (b.textContent || '').trim().slice(0, 50),
          href: b.href,
          rect: b.getBoundingClientRect()
        }))
        .filter(e => e.rect.width > 0 && e.rect.height > 0);
    })()
  `);
  
  console.log('Clickable elements:');
  elements.forEach((e, i) => {
    console.log(`  ${i}: ${e.tag} "${e.text}" href=${e.href || 'none'} rect=${JSON.stringify(e.rect)}`);
  });
  
  // Look for the specific Create new product button
  const createBtn = elements.find(e => e.text === 'Create new product');
  console.log('\nCreate button found:', !!createBtn);
  
  if (createBtn) {
    console.log('Creating product...');
    
    // Click using CDP
    const x = Math.round(createBtn.rect.x + createBtn.rect.width / 2);
    const y = Math.round(createBtn.rect.y + createBtn.rect.height / 2);
    
    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mousePressed', x, y, button: 'left', clickCount: 1
    });
    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased', x, y, button: 'left', clickCount: 1
    });
    console.log(`Clicked at (${x}, ${y})`);
    
    await sleep(2000);
    
    // Check what happened
    const newUrl = await evalJs(cdp, 'window.location.href');
    console.log('New URL:', newUrl);
    
    // Take screenshot
    await cdp.send('Page.captureScreenshot', { format: 'png' });
    
    // Get form fields if any
    const fields = await evalJs(cdp, `
      (() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        return inputs.filter(i => i.offsetParent !== null).map(i => ({
          type: i.type,
          id: i.id,
          name: i.name,
          placeholder: i.placeholder,
          value: i.value
        }));
      })()
    `);
    console.log('Fields:', JSON.stringify(fields, null, 2));
  }
  
  // Now try navigating directly to create
  console.log('\n--- Trying direct navigation ---');
  await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products/create' });
  await sleep(3000);
  
  await cdp.send('Page.captureScreenshot', { format: 'png' });
  
  const state = await evalJs(cdp, `
    (() => {
      const body = document.body.innerText;
      const inputs = Array.from(document.querySelectorAll('input')).filter(i => i.offsetParent !== null);
      const btns = Array.from(document.querySelectorAll('button')).filter(b => b.offsetParent !== null);
      return {
        url: window.location.href,
        bodyPreview: body.slice(0, 500),
        inputCount: inputs.length,
        buttonCount: btns.length,
        inputs: inputs.map(i => ({ type: i.type, id: i.id, name: i.name, placeholder: i.placeholder })),
        buttons: btns.map(b => ({ text: (b.textContent || '').trim().slice(0, 30) }))
      };
    })()
  `);
  
  console.log('State:', JSON.stringify(state, null, 2));
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
