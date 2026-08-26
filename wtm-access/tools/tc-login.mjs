// ThriveCart login via CDP. Reads TC_EMAIL/TC_PASS from env.
import { newTab, connect, navigate, evalJs } from './cdp.mjs';

const email = process.env.TC_EMAIL || '';
const pass = process.env.TC_PASS || '';
if (!email || !pass) { console.error('TC_EMAIL/TC_PASS env required'); process.exit(1); }

const tab = await newTab('https://thrivecart.com/login/');
const cdp = await connect(tab.webSocketDebuggerUrl);
await navigate(cdp, 'https://thrivecart.com/login/');

// inspect form
const inputs = await evalJs(cdp, `Array.from(document.querySelectorAll('input')).map(i => ({type: i.type, name: i.name, id: i.id, ph: i.placeholder}))`);
console.log('INPUTS:', JSON.stringify(inputs));

// fill + submit via native setters so React picks it up
const filled = await evalJs(cdp, `(() => {
  const set = (el, v) => {
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  };
  let emailEl = null, passEl = null;
  for (const el of document.querySelectorAll('input')) {
    const t = (el.type || '').toLowerCase();
    const hint = (el.name + ' ' + el.id + ' ' + el.placeholder + ' ' + (el.autocomplete || '')).toLowerCase();
    if (t === 'email' || hint.includes('email')) emailEl = el;
    if (t === 'password') passEl = el;
  }
  if (!emailEl || !passEl) return { ok: false, emailEl: !!emailEl, passEl: !!passEl };
  set(emailEl, ${JSON.stringify(email)});
  set(passEl, ${JSON.stringify(pass)});
  return { ok: true };
})()`);
console.log('FILL:', JSON.stringify(filled));

await evalJs(cdp, `(() => {
  const btn = document.querySelector('button[type="submit"]') || Array.from(document.querySelectorAll('button')).find(b => /log ?in|sign ?in/i.test(b.textContent));
  if (!btn) return 'no button';
  btn.click(); return 'clicked ' + (btn.textContent || '').trim().slice(0, 30);
})()`);

await new Promise((r) => setTimeout(r, 5000));
const url = await evalJs(cdp, 'location.href');
const text = await evalJs(cdp, 'document.body.innerText.slice(0, 500)');
console.log('URL:', url);
console.log('TEXT:', text.replace(/\\n+/g, ' | ').slice(0, 400));
