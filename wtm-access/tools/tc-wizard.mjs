// Full wizard flow: /products/create -> click Digital card -> Create -> fill name/price
import { listTabs, connect, evalJs } from './cdp.mjs';

const NAME = process.env.PROD_NAME || 'Test Wizard Product';
const PRICE = process.env.PROD_PRICE || '15';
setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 120000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);
await cdp.send('Page.enable');

async function clickSelector(js) {
  const pos = await evalJs(cdp, js);
  if (!pos) return null;
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: pos.x, y: pos.y });
  await new Promise((r) => setTimeout(r, 250));
  await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: pos.x, y: pos.y, button: 'left', clickCount: 1 });
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: pos.x, y: pos.y, button: 'left', clickCount: 1 });
  return true;
}

await cdp.send('Page.navigate', { url: 'https://thrivecart.com/uiy/#/products/create' });
await new Promise((r) => setTimeout(r, 6000));

// click the Digital card: find element containing exact text 'Digital'
const digital = await clickSelector(`(() => {
  const els = Array.from(document.querySelectorAll('div, span, label, a')).filter(e => e.offsetParent !== null && e.children.length === 0 && (e.textContent || '').trim() === 'Digital');
  const e = els[els.length - 1];
  if (!e) return null;
  let card = e;
  for (let i = 0; i < 4 && card.parentElement; i++) { card = card.parentElement; const r0 = card.getBoundingClientRect(); if (r0.width > 80 && r0.height > 60) break; }
  const r = card.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
})()`);
console.log('digital card clicked:', digital);
await new Promise((r) => setTimeout(r, 1500));

const created = await clickSelector(`(() => {
  const b = Array.from(document.querySelectorAll('button')).filter(x => x.offsetParent !== null).find(x => /create new product/i.test(x.textContent || ''));
  if (!b) return null;
  const r = b.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
})()`);
console.log('create clicked:', created);
await new Promise((r) => setTimeout(r, 9000));

const url = await evalJs(cdp, 'location.href');
console.log('URL:', url);
const text = await evalJs(cdp, 'document.body.innerText.slice(0, 600)');
console.log('TEXT:', text.replace(/\n+/g, ' | ').slice(0, 400));
const fields = await evalJs(cdp, `Array.from(document.querySelectorAll('input, select')).filter(i => i.offsetParent !== null).map(i => i.type + ':' + (i.name || i.id) + ':' + (i.placeholder || '').slice(0, 25)).join(' | ')`);
console.log('FIELDS:', String(fields).slice(0, 600));
process.exit(0);
