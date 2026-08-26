// Robust probe: navigate existing tab to ThriveCart login, capture network status
import { listTabs, connect, navigate, evalJs } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 45000);

const tabs = await listTabs();
const tab = tabs.find(t => t.type === 'page');
const cdp = await connect(tab.webSocketDebuggerUrl);

const statuses = [];
await cdp.send('Network.enable');
cdp.on('Network.responseReceived', (p) => {
  const u = p.response.url;
  if (u.includes('thrivecart.com') && !u.includes('.js') && !u.includes('.css') && !u.includes('.png'))
    statuses.push(p.response.status + ' ' + u.slice(0, 80));
});

await cdp.send('Page.enable');
await cdp.send('Page.navigate', { url: 'https://thrivecart.com/login/' });
await new Promise((r) => setTimeout(r, 8000));

console.log('STATUS:\n' + statuses.slice(0, 8).join('\n'));
const info = await evalJs(cdp, 'JSON.stringify({href: location.href, title: document.title.slice(0,60), len: document.body.innerText.length})');
console.log('PAGE:', info);
const text = await evalJs(cdp, 'document.body.innerText.slice(0, 250)');
console.log('TEXT:', text.replace(/\n+/g, ' | ').slice(0, 220));
process.exit(0);
