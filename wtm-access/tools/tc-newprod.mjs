// Dashboard: open products list, find "new product" button
import { listTabs, connect, evalJs } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 90000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);
await cdp.send('Page.enable');

await cdp.send('Page.navigate', { url: 'https://thrivecart.com/#/products' });
await new Promise((r) => setTimeout(r, 6000));

const text = await evalJs(cdp, 'document.body.innerText.slice(0, 800)');
console.log('PRODUCTS PAGE:', text.replace(/\n+/g, ' | ').slice(0, 500));

const btns = await evalJs(cdp, `(() => {
  return Array.from(document.querySelectorAll('button, a')).filter(b => b.offsetParent !== null).map(b => (b.textContent || '').trim().slice(0, 30)).filter(t => t && /new|create|add|product/i.test(t)).slice(0, 10);
})()`);
console.log('ACTION BTNS:', JSON.stringify(btns));
process.exit(0);
