// ThriveCart product creation - check for blockers
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
  
  // Navigate to create page
  await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products/create' });
  await sleep(3000);
  
  // Dismiss any modals
  await evalJs(cdp, `
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    document.body.click();
  `);
  await sleep(1000);
  
  // Get full page state
  const debug = await evalJs(cdp, `
    (() => {
      // Check for any error messages or warnings
      const errors = Array.from(document.querySelectorAll('[class*="error"], [class*="warning"], [class*="banner"]'));
      const errorText = errors.map(e => e.textContent.trim().substring(0, 200)).filter(t => t.length > 0);
      
      // Check for any disabled states
      const btns = Array.from(document.querySelectorAll('button'));
      const disabledBtns = btns.filter(b => b.disabled);
      
      // Check for any toast notifications
      const toasts = Array.from(document.querySelectorAll('[class*="toast"], [class*="notification"]'));
      
      // Check body text for any blocking messages
      const bodyText = document.body.innerText;
      
      return {
        url: window.location.href,
        errorCount: errors.length,
        errorMessages: errorText,
        disabledButtons: disabledBtns.map(b => b.textContent.trim()),
        toastCount: toasts.length,
        hasBlockingMessage: bodyText.includes('Tax') || bodyText.includes('Compliance') || bodyText.includes('Stripe')
      };
    })()
  `);
  
  console.log('Debug info:', JSON.stringify(debug, null, 2));
  
  // Take screenshot
  await cdp.send('Page.captureScreenshot', { format: 'png' });
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
