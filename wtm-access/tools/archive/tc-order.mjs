// Click Complete Order, observe where the browser lands
import { listTabs, connect, evalJs } from './cdp.mjs';
import fs from 'fs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 180000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);
await cdp.send('Page.enable');

let landed = null;
cdp.on('Page.frameNavigated', (p) => {
  if (p.frame.parentId === undefined && p.frame.url && !p.frame.url.startsWith('about:')) landed = p.frame.url;
});

// find Complete Order button
const pos = await evalJs(cdp, `(() => {
  const btns = Array.from(document.querySelectorAll('button, a')).filter(b => b.offsetParent !== null);
  const b = btns.find(x => /complete order/i.test((x.textContent || '').trim()));
  if (!b) return null;
  const r = b.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2, label: (b.textContent || '').trim() };
})()`);
console.log('BTN:', JSON.stringify(pos));
if (!pos) process.exit(1);

b2: {
  await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: pos.x, y: pos.y, button: 'left', clickCount: 1 });
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: pos.x, y: pos.y, button: 'left', clickCount: 1 });
}
console.log('clicked Complete Order');

// watch navigation up to 30s
for (let i = 0; i < 30; i++) {
  await new Promise((r) => setTimeout(r, 1000));
  if (landed && !landed.includes('thrivecart.com')) break;
}
console.log('FINAL URL:', landed || '(still on checkout)');

const text = landed && !landed.includes('thrivecart.com')
  ? await evalJs(cdp, 'document.body.innerText.slice(0, 300)')
  : await evalJs(cdp, 'document.body.innerText.slice(0, 400)');
console.log('TEXT:', text.replace(/\n+/g, ' | ').slice(0, 300));

const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync('/tmp/checkout-done.png', Buffer.from(shot.data, 'base64'));
console.log('screenshot saved');
process.exit(0);
