// Click Fulfillment tab in product 9 editor and dump its form
import { listTabs, connect, evalJs } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 90000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);

const clicked = await evalJs(cdp, `(() => {
  const els = Array.from(document.querySelectorAll('a, [role=tab], li, button, span'));
  const t = els.find(e => /^(fulfil?lment|fulfillment)$/i.test((e.textContent || '').trim()) && e.children.length < 3);
  if (!t) return 'not found';
  t.click();
  return 'clicked: ' + (t.textContent || '').trim();
})()`);
console.log('CLICK:', clicked);

await new Promise((r) => setTimeout(r, 6000));
const text = await evalJs(cdp, 'document.body.innerText');
const i = text.indexOf('Fulfillment');
console.log('TEXT:', text.slice(0, 1400).replace(/\n+/g, ' | '));
process.exit(0);
