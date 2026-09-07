// Create new product: click Create product, dump the creation form
import { listTabs, connect, evalJs } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 90000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);

const pos = await evalJs(cdp, `(() => {
  const b = Array.from(document.querySelectorAll('button, a')).filter(x => x.offsetParent !== null).find(x => (x.textContent || '').trim() === 'Create product');
  if (!b) return null;
  b.scrollIntoView({ block: 'center' });
  const r = b.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
})()`);
console.log('BTN:', JSON.stringify(pos));
if (!pos) process.exit(1);
await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: pos.x, y: pos.y, button: 'left', clickCount: 1 });
await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: pos.x, y: pos.y, button: 'left', clickCount: 1 });
await new Promise((r) => setTimeout(r, 6000));

const text = await evalJs(cdp, 'document.body.innerText.slice(0, 1200)');
console.log('AFTER CLICK:', text.replace(/\n+/g, ' | ').slice(0, 700));

const fields = await evalJs(cdp, `(() => {
  return Array.from(document.querySelectorAll('input, select, textarea')).filter(i => i.offsetParent !== null).map(i => i.tagName + ':' + i.type + ':' + (i.name || i.id) + ':' + (i.placeholder || '').slice(0, 25));
})()`);
console.log('FIELDS:', String(fields).slice(0, 600));
process.exit(0);
