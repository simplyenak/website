// Load checkout page in browser tab, extract rendered config
import { listTabs, connect, evalJs } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 90000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);
await cdp.send('Page.enable');

const netHits = [];
await cdp.send('Network.enable');
cdp.on('Network.responseReceived', (p) => {
  if (p.response.url.includes('pages.dev')) netHits.push('net: ' + p.response.url.slice(0, 80));
});

await cdp.send('Page.navigate', { url: 'https://uiy.thrivecart.com/street-food-masters-collection/' });
await new Promise((r) => setTimeout(r, 9000));

const found = await evalJs(cdp, `(() => {
  const html = document.documentElement.outerHTML;
  const hits = [];
  let i = html.indexOf('pages.dev');
  while (i !== -1 && hits.length < 3) { hits.push(html.slice(Math.max(0, i - 120), i + 60)); i = html.indexOf('pages.dev', i + 1); }
  let j = html.indexOf('"fulfillment"');
  while (j !== -1 && hits.length < 6) { hits.push('F: ' + html.slice(j, j + 220)); j = html.indexOf('"fulfillment"', j + 1); }
  return hits.length ? hits.join(' ||| ') : 'nothing in DOM';
})()`);
console.log('DOM:', found.replace(/\s+/g, ' ').slice(0, 700));
console.log('NET:', netHits.join(' , ') || 'no pages.dev network hits');
const text = await evalJs(cdp, 'document.body.innerText.slice(0, 200)');
console.log('TEXT:', text.replace(/\n+/g, ' | ').slice(0, 180));
process.exit(0);
