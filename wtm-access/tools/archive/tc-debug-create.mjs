// Debug ThriveCart create flow
import { listTabs, connect, evalJs } from './cdp.mjs';
import fs from 'fs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 60000);

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Debugging ThriveCart create flow...');
  
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
  
  // Take screenshot
  await cdp.send('Page.captureScreenshot', { format: 'png' });
  
  // Check current state
  const state = await evalJs(cdp, `
    (() => {
      const text = document.body.innerText;
      const btns = Array.from(document.querySelectorAll('button'));
      const links = Array.from(document.querySelectorAll('a'));
      
      return {
        url: window.location.href,
        buttons: btns.filter(b => b.textContent.trim()).map(b => b.textContent.trim()),
        hasCreateBtn: btns.some(b => b.textContent.trim() === 'Create product'),
        hasCreateNewBtn: btns.some(b => b.textContent.trim() === 'Create new product')
      };
    })()
  `);
  
  console.log('Current state:', JSON.stringify(state, null, 2));
  
  // Try clicking "Create product" button
  const clickResult = await evalJs(cdp, `
    (() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const createBtn = btns.find(b => b.textContent.trim() === 'Create product');
      if (createBtn) {
        createBtn.click();
        return 'clicked Create product';
      }
      return 'button not found';
    })()
  `);
  
  console.log('Click result:', clickResult);
  await sleep(2000);
  
  // Take screenshot after click
  await cdp.send('Page.captureScreenshot', { format: 'png' });
  
  // Check state again
  const state2 = await evalJs(cdp, `
    (() => {
      const text = document.body.innerText;
      const inputs = Array.from(document.querySelectorAll('input'));
      const visible = inputs.filter(i => i.offsetParent !== null);
      
      return {
        url: window.location.href,
        inputCount: visible.length,
        hasCreateModal: text.includes('Create a new product'),
        hasOnboarding: text.includes('Get Started'),
        hasContinueBtn: text.includes('Continue')
      };
    })()
  `);
  
  console.log('State after click:', JSON.stringify(state2, null, 2));
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
