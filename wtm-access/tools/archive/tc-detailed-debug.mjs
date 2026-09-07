// ThriveCart - detailed debug of create flow
import { listTabs, connect, evalJs } from './cdp.mjs';
import fs from 'fs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 60000);

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
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
  
  // Dismiss modals
  await evalJs(cdp, `
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    document.body.click();
  `);
  await sleep(1000);
  
  // Click Create product
  await evalJs(cdp, `
    const links = Array.from(document.querySelectorAll('a'));
    const createLink = links.find(l => l.textContent.trim() === 'Create product');
    if (createLink) createLink.click();
  `);
  
  await sleep(5000);
  
  // Take screenshot before any clicks
  await cdp.send('Page.captureScreenshot', { format: 'png' });
  
  // Check what's visible
  const debug = await evalJs(cdp, `
    (() => {
      // Get all buttons with their full details
      const buttons = Array.from(document.querySelectorAll('button')).map(b => {
        const rect = b.getBoundingClientRect();
        return {
          text: b.textContent.trim().substring(0, 30),
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          w: Math.round(rect.width),
          h: Math.round(rect.height),
          visible: rect.width > 0 && rect.height > 0
        };
      }).filter(b => b.visible);
      
      // Get all form fields
      const inputs = Array.from(document.querySelectorAll('input')).map(i => {
        const rect = i.getBoundingClientRect();
        return {
          type: i.type,
          id: i.id,
          placeholder: i.placeholder,
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          w: Math.round(rect.width),
          h: Math.round(rect.height),
          visible: rect.width > 0 && rect.height > 0
        };
      }).filter(i => i.visible);
      
      // Check for any dialogs/modals
      const dialogs = Array.from(document.querySelectorAll('[role="dialog"]'));
      
      return {
        url: window.location.href,
        buttonCount: buttons.length,
        buttons: buttons.filter(b => b.text.length > 0),
        inputCount: inputs.length,
        inputs: inputs,
        dialogCount: dialogs.length
      };
    })()
  `);
  
  console.log(JSON.stringify(debug, null, 2));
  
  // Take screenshot after
  await cdp.send('Page.captureScreenshot', { format: 'png' });
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
