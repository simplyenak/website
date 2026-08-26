// Fill Link email + mobile inside Stripe frame, then submit
import { listTabs, connect, evalJs } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 120000);

const ver = await (await fetch('http://localhost:9222/json/version')).json();
const bws = new WebSocket(ver.webSocketDebuggerUrl);
await new Promise((res, rej) => { bws.onopen = res; bws.onerror = rej; });
let mid = 0;
const pending = new Map();
bws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); }
};
function bsend(method, params = {}, sessionId) {
  return new Promise((res, rej) => {
    const id = ++mid;
    pending.set(id, { res, rej });
    bws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
}
const { targetInfos } = await bsend('Target.getTargets');
const acc = targetInfos.find(t => t.type === 'iframe' && t.url.includes('elements-inner-accessory'));
const { sessionId } = await bsend('Target.attachToTarget', { targetId: acc.targetId, flatten: true });

const r = await bsend('Runtime.evaluate', {
  expression: `(() => {
    const set = (el, v) => {
      const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
      d.set.call(el, v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Tab' }));
    };
    const inputs = Array.from(document.querySelectorAll('input'));
    const email = inputs.find(i => i.type === 'email' || /email/i.test(i.autocomplete || '') || /email/i.test(i.name + i.id + (i.placeholder || '')));
    const phone = inputs.find(i => i.type === 'tel' || /tel|phone/i.test(i.autocomplete || '') || /phone|mobile/i.test(i.name + i.id + (i.placeholder || '')));
    const out = [];
    if (email) { set(email, 'cdp-test@simplyenak.com'); out.push('email=' + email.value); }
    if (phone) { set(phone, '0123456789'); out.push('phone=' + phone.value); }
    return out.join(' ; ') || 'no email/phone fields found. all inputs: ' + inputs.map(i => i.type + '/' + (i.autocomplete || '') + '/' + (i.name || '') + '/' + (i.placeholder || '').slice(0, 15)).join(' | ');
  })()`,
  returnByValue: true,
}, sessionId);
console.log('LINK FILL:', r.result.value);
process.exit(0);
