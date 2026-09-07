// ThriveCart - check what's blocking product creation
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
  
  // Get all visible elements with their types and text
  const elements = await evalJs(cdp, `
    (() => {
      // Get all buttons
      const buttons = Array.from(document.querySelectorAll('button'));
      const btnInfo = buttons.filter(b => b.textContent.trim().length > 0).map(b => ({
        text: b.textContent.trim().substring(0, 50),
        disabled: b.disabled,
        class: b.className.substring(0, 100),
        rect: (() => {
          const r = b.getBoundingClientRect();
          return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
        })()
      })).filter(b => b.rect.w > 0 && b.rect.h > 0);
      
      // Get all links
      const links = Array.from(document.querySelectorAll('a')).filter(a => {
        const text = a.textContent.trim();
        return text.length > 0 && text.length < 50;
      }).map(a => ({
        text: a.textContent.trim(),
        href: a.href,
        rect: (() => {
          const r = a.getBoundingClientRect();
          return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
        })()
      })).filter(l => l.rect.w > 0 && l.rect.h > 0);
      
      // Look for tax compliance related elements
      const taxRelated = Array.from(document.querySelectorAll('*')).filter(el => {
        const text = el.textContent || '';
        return text.includes('Tax') || text.includes('compliance') || text.includes('Stripe');
      }).slice(0, 10).map(el => ({
        tag: el.tagName,
        text: el.textContent.trim().substring(0, 100),
        class: el.className.substring(0, 50)
      }));
      
      return {
        buttons: btnInfo,
        links: links.filter(l => !l.text.includes('Search')),
        taxRelated
      };
    })()
  `);
  
  console.log('Buttons:', JSON.stringify(elements.buttons, null, 2));
  console.log('\nLinks:', JSON.stringify(elements.links, null, 2));
  console.log('\nTax-related:', JSON.stringify(elements.taxRelated, null, 2));
  
  // Take screenshot
  await cdp.send('Page.captureScreenshot', { format: 'png' });
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
