// Force Fulfillment tab switch via full mouse event sequence
import { listTabs, connect, evalJs } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 90000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);

const res = await evalJs(cdp, `(() => {
  const li = Array.from(document.querySelectorAll('li')).find(e => /^fulfil?lment/i.test((e.textContent || '').trim()) && e.textContent.trim().length < 14);
  if (!li) return 'no li';
  const r = li.getBoundingClientRect();
  const opts = { bubbles: true, cancelable: true, view: window, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 };
  li.dispatchEvent(new MouseEvent('mouseover', opts));
  li.dispatchEvent(new MouseEvent('mousedown', opts));
  li.dispatchEvent(new MouseEvent('mouseup', opts));
  li.dispatchEvent(new MouseEvent('click', opts));
  return 'events sent to ' + r.x + ',' + r.y;
})()`);
console.log('RES:', res);

await new Promise((r) => setTimeout(r, 6000));
const text = await evalJs(cdp, 'document.body.innerText');
const hasProductTab = text.includes('Product name Will appear');
console.log('STILL_PRODUCT_TAB:', hasProductTab);
console.log('TEXT:', text.slice(0, 1200).replace(/\n+/g, ' | '));
process.exit(0);
