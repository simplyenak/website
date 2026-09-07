// Navigate dashboard SPA and dump product edit links
import { listTabs, connect, evalJs } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 60000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);
await cdp.send('Page.enable');

// go to products list
await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#products' });
await new Promise((r) => setTimeout(r, 6000));
let text = await evalJs(cdp, 'document.body.innerText.slice(0, 500)');
console.log('AFTER #products:', text.replace(/\n+/g, ' | ').slice(0, 350));
console.log('---links---');
const links = await evalJs(cdp, `Array.from(document.querySelectorAll('a')).map(a => a.getAttribute('href') + ' :: ' + (a.textContent || '').trim().slice(0, 40)).filter(h => h.includes('product') || h.includes('street')).slice(0, 15).join(' | ')`);
console.log(links);
process.exit(0);
