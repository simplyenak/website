// Fresh login: navigate to login page, fill, submit, land on dashboard
import { listTabs, connect, evalJs } from './cdp.mjs';

const email = process.env.TC_EMAIL || '';
const pass = process.env.TC_PASS || '';
if (!email || !pass) { console.error('TC_EMAIL/TC_PASS required'); process.exit(1); }
setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 90000);

const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com')) || tabs[0];
const cdp = await connect(tab.webSocketDebuggerUrl);
await cdp.send('Page.enable');
await cdp.send('Page.navigate', { url: 'https://thrivecart.com/login/' });
await new Promise((r) => setTimeout(r, 6000));

const filled = await evalJs(cdp, `(() => {
  const e = document.querySelector('input[name="email"], input[type="email"]');
  const p = document.querySelector('input[type="password"]');
  if (!e || !p) return 'missing fields';
  const set = (el, v) => {
    const d = Object.getOwnPropertyDescriptor(el.tagName === 'INPUT' ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype, 'value');
    d.set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  };
  set(e, '${email}');
  set(p, '${pass}');
  return 'filled';
})()`);
console.log('FILL:', filled);
if (filled !== 'filled') process.exit(1);

const btn = await evalJs(cdp, `(() => {
  const b = document.querySelector('button[type="submit"], form button, input[type="submit"]') || Array.from(document.querySelectorAll('button')).find(x => /log ?in|sign ?in/i.test(x.textContent || ''));
  if (!b) return null;
  const r = b.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
})()`);
console.log('BTN:', JSON.stringify(btn));
if (!btn) process.exit(1);
await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: btn.x, y: btn.y, button: 'left', clickCount: 1 });
await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: btn.x, y: btn.y, button: 'left', clickCount: 1 });
await new Promise((r) => setTimeout(r, 9000));
const url = await evalJs(cdp, 'location.href');
const text = await evalJs(cdp, 'document.body.innerText.slice(0, 300)');
console.log('NOW:', url, '|', text.replace(/\n+/g, ' | ').slice(0, 200));
process.exit(0);
