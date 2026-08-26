// ThriveCart login on existing tab. Reads TC_EMAIL/TC_PASS from env.
import { listTabs, connect, evalJs } from './cdp.mjs';

const email = process.env.TC_EMAIL || '';
const pass = process.env.TC_PASS || '';
if (!email || !pass) { console.error('TC_EMAIL/TC_PASS env required'); process.exit(1); }
setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 60000);

const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com/login'));
if (!tab) { console.error('no login tab open'); process.exit(1); }
const cdp = await connect(tab.webSocketDebuggerUrl);

const filled = await evalJs(cdp, `(() => {
  const set = (el, v) => {
    const proto = Object.getPrototypeOf(el) === HTMLTextAreaElement.prototype ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  };
  let emailEl = null, passEl = null;
  for (const el of document.querySelectorAll('input')) {
    const t = (el.type || '').toLowerCase();
    const hint = (el.name + ' ' + el.id + ' ' + el.placeholder).toLowerCase();
    if (t === 'email' || hint.includes('email')) emailEl = el;
    if (t === 'password') passEl = el;
  }
  if (!emailEl || !passEl) return { ok: false, e: !!emailEl, p: !!passEl };
  set(emailEl, ${JSON.stringify(email)});
  set(passEl, ${JSON.stringify(pass)});
  return { ok: true };
})()`);
console.log('FILL:', JSON.stringify(filled));

const clicked = await evalJs(cdp, `(() => {
  const btn = document.querySelector('button[type="submit"]') ||
    Array.from(document.querySelectorAll('button, a[role=button]')).find(b => /log ?in|sign ?in/i.test(b.textContent || ''));
  if (!btn) return 'no-button';
  btn.click(); return 'clicked';
})()`);
console.log('CLICK:', clicked);

await new Promise((r) => setTimeout(r, 6000));
const href = await evalJs(cdp, 'location.href');
const text = await evalJs(cdp, 'document.body.innerText.slice(0, 400)');
console.log('URL:', href);
console.log('TEXT:', text.replace(/\n+/g, ' | ').slice(0, 300));
process.exit(0);
