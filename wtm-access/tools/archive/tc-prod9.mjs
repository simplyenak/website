// Open product 9 editor, dump UI structure around fulfilment/success
import { listTabs, connect, evalJs } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 60000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);
await cdp.send('Page.enable');

await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products/9' });
await new Promise((r) => setTimeout(r, 8000));

const text = await evalJs(cdp, 'document.body.innerText');
console.log('LEN:', text.length);
// find fulfilment/success mentions
for (const kw of ['Fulfilment', 'Fulfillment', 'Success', 'success']) {
  let i = text.indexOf(kw);
  let n = 0;
  while (i !== -1 && n < 2) {
    console.log('KW[' + kw + ']:', text.slice(Math.max(0, i - 60), i + 200).replace(/\n+/g, ' | '));
    i = text.indexOf(kw, i + 1);
    n++;
  }
}
// tab-like elements
const tabEls = await evalJs(cdp, `Array.from(document.querySelectorAll('[role=tab], .nav a, .nav li, [class*=tab] a, [class*=Tab]')).map(e => (e.textContent || '').trim().slice(0, 25)).filter(Boolean).slice(0, 25).join(' | ')`);
console.log('TABS:', tabEls);
process.exit(0);
