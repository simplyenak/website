// Debug: What's actually on the page
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
  
  // Take screenshot
  await cdp.send('Page.captureScreenshot', { format: 'png' });
  
  // Get detailed page state
  const debug = await evalJs(cdp, `
    (() => {
      // Get all buttons with their positions
      const buttons = Array.from(document.querySelectorAll('button'));
      const btnDetails = buttons.map(b => {
        const rect = b.getBoundingClientRect();
        return {
          text: b.textContent.trim().substring(0, 50),
          id: b.id,
          class: b.className.substring(0, 100),
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          w: Math.round(rect.width),
          h: Math.round(rect.height),
          visible: rect.width > 0 && rect.height > 0
        };
      }).filter(b => b.visible);
      
      // Get all modals/dialogs
      const modals = Array.from(document.querySelectorAll('[class*="modal"], [class*="dialog"], [class*="overlay"], [role="dialog"]'));
      const modalInfo = modals.map(m => ({
        class: m.className.substring(0, 100),
        text: m.textContent.substring(0, 100).replace(/\s+/g, ' '),
        visible: m.offsetParent !== null
      }));
      
      // Look for the Create new product button specifically
      const createBtn = buttons.find(b => b.textContent.trim() === 'Create new product');
      
      return {
        url: window.location.href,
        buttonCount: buttons.length,
        visibleButtons: btnDetails,
        modalCount: modals.length,
        modals: modalInfo,
        hasCreateBtn: !!createBtn,
        createBtnRect: createBtn ? createBtn.getBoundingClientRect() : null
      };
    })()
  `);
  
  console.log(JSON.stringify(debug, null, 2));
  
  // Try clicking the button using coordinates
  if (debug.createBtnRect) {
    const { x, y, w, h } = debug.createBtnRect;
    const clickX = Math.round(x + w / 2);
    const clickY = Math.round(y + h / 2);
    
    console.log(`\nClicking at (${clickX}, ${clickY})`);
    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: clickX,
      y: clickY,
      button: 'left'
    });
    await sleep(500);
    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: clickX,
      y: clickY,
      button: 'left'
    });
    
    await sleep(3000);
    
    // Check state after click
    const afterClick = await evalJs(cdp, `
      (() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        const visible = inputs.filter(i => {
          const rect = i.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        });
        
        return {
          url: window.location.href,
          inputCount: visible.length,
          hasFormFields: visible.some(i => i.placeholder?.toLowerCase().includes('name') || i.placeholder?.toLowerCase().includes('price')),
          inputs: visible.slice(0, 5).map(i => ({ type: i.type, id: i.id, placeholder: i.placeholder }))
        };
      })()
    `);
    
    console.log('\nAfter click:', JSON.stringify(afterClick, null, 2));
    
    // Take screenshot
    await cdp.send('Page.captureScreenshot', { format: 'png' });
  }
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
