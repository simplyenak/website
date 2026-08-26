// Advance checkout step: fill visible inputs, click continue/pay
import { listTabs, connect, evalJs } from './cdp.mjs';

const MODE = process.argv[2] || 'email'; // email | continue
setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 60000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);

if (MODE === 'email') {
  const r = await evalJs(cdp, `(() => {
    const e = document.querySelector('input[name="customer.email"]');
    if (!e) return 'no email field';
    e.value = 'cdp-test@simplyenak.com';
    e.dispatchEvent(new Event('input', { bubbles: true }));
    e.dispatchEvent(new Event('change', { bubbles: true }));
    return 'filled';
  })()`);
  console.log('EMAIL:', r);
  // click continue button
  const pos = await evalJs(cdp, `(() => {
    const btns = Array.from(document.querySelectorAll('button, a')).filter(b => b.offsetParent !== null);
    const b = btns.find(x => /continue|next|proceed/i.test(x.textContent || '')) || btns.find(x => /pay|order/i.test(x.textContent || ''));
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, label: (b.textContent || '').trim().slice(0, 25) };
  })()`);
  console.log('BTN:', JSON.stringify(pos));
  if (pos) {
    await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: pos.x, y: pos.y, button: 'left', clickCount: 1 });
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: pos.x, y: pos.y, button: 'left', clickCount: 1 });
  }
  await new Promise((r) => setTimeout(r, 5000));
  const fields = await evalJs(cdp, `Array.from(document.querySelectorAll('input, select')).filter(i => i.offsetParent !== null).map(i => i.type + ':' + (i.name || i.id)).join(' | ')`);
  console.log('FIELDS NOW:', String(fields).slice(0, 400));
}
process.exit(0);
