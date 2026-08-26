// Debug: attach to existing tab, eval with watchdog
import { listTabs, connect, evalJs } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG: forced exit after 40s'); process.exit(2); }, 40000);

const tabs = await listTabs();
console.log('TABS:', tabs.map(t => t.url.slice(0, 50)).join(' , '));
const tab = tabs.find(t => t.url.includes('thrivecart'));
if (!tab) { console.error('no thrivecart tab'); process.exit(1); }
console.log('connecting to', tab.id.slice(0, 8));
const cdp = await connect(tab.webSocketDebuggerUrl);
console.log('ws connected');
const t0 = Date.now();
const href = await evalJs(cdp, 'location.href');
console.log('href ok', Date.now() - t0, 'ms:', href);
const text = await evalJs(cdp, 'document.body.innerText.slice(0, 400)');
console.log('TEXT:', text.replace(/\n+/g, ' | ').slice(0, 300));
const inputs = await evalJs(cdp, "Array.from(document.querySelectorAll('input')).map(i => i.type + ':' + (i.name || i.id))");
console.log('INPUTS:', JSON.stringify(inputs));
process.exit(0);
