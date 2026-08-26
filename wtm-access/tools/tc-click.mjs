// Trusted click: set viewport, scroll tab into view, Input.dispatchMouseEvent
import { listTabs, connect, evalJs } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 90000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);

await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 2400, deviceScaleFactor: 1, mobile: false });
await new Promise((r) => setTimeout(r, 800));

// scroll tab into view and get coords
const pos = await evalJs(cdp, `(() => {
  const li = Array.from(document.querySelectorAll('li')).find(e => /^fulfil?lment/i.test((e.textContent || '').trim()) && e.textContent.trim().length < 14);
  if (!li) return null;
  li.scrollIntoView({ block: 'center' });
  const r = li.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height };
})()`);
console.log('POS:', JSON.stringify(pos));
if (!pos) process.exit(1);

await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: pos.x, y: pos.y, button: 'left', clickCount: 1 });
await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: pos.x, y: pos.y, button: 'left', clickCount: 1 });
await new Promise((r) => setTimeout(r, 5000));

const text = await evalJs(cdp, 'document.body.innerText');
console.log('STILL_PRODUCT_TAB:', text.includes('Product name Will appear'));
console.log('TEXT:', text.slice(0, 1300).replace(/\n+/g, ' | '));
process.exit(0);
