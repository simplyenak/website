// Click Edit on product 9, wait for editor, dump sections
import { listTabs, connect, evalJs } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 90000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);

const clicked = await evalJs(cdp, `(() => {
  const a = Array.from(document.querySelectorAll('a')).find(x => x.getAttribute('href') === '#/products/9');
  if (!a) return 'no edit link';
  a.click();
  return 'clicked edit';
})()`);
console.log('CLICK:', clicked);

await new Promise((r) => setTimeout(r, 9000));
console.log('URL:', await evalJs(cdp, 'location.href'));
const text = await evalJs(cdp, 'document.body.innerText');
console.log('LEN:', text.length);
console.log('TEXT:', text.replace(/\n+/g, ' | ').slice(0, 700));
process.exit(0);
