// Attach CDP session to Stripe iframe, fill card fields programmatically
import { listTabs, connect } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 90000);

// browser-level ws
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
const stripe = targetInfos.filter(t => t.type === 'iframe' && t.url.includes('js.stripe.com'));
console.log('STRIPE IFRAMES:', stripe.length, stripe.map(s => s.targetId.slice(0, 6) + ' ' + s.url.slice(0, 50)));

// find the one with input fields
for (const t of stripe.slice(0, 6)) {
  const { sessionId } = await bsend('Target.attachToTarget', { targetId: t.targetId, flatten: true });
  const r = await bsend('Runtime.evaluate', {
    expression: `JSON.stringify({inputs: Array.from(document.querySelectorAll('input')).map(i => ({name: i.name, id: i.id, ph: i.placeholder, aria: i.getAttribute('aria-label'), v: i.value.slice(0,8)}))})`,
    returnByValue: true,
  }, sessionId);
  const info = JSON.parse(r.result.value);
  if (info.inputs.length) {
    console.log('TARGET', t.targetId.slice(0, 8), 'inputs:', JSON.stringify(info.inputs));
    // fill: card number
    const fill = `
      const set = (el, v) => {
        const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        d.set.call(el, v);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      const inputs = Array.from(document.querySelectorAll('input'));
      const card = inputs.find(i => /card|number/i.test(i.name + i.id + i.placeholder + (i.getAttribute('aria-label') || '')) || i.autocomplete === 'cc-number');
      const exp = inputs.find(i => /exp/i.test(i.name + i.id + i.placeholder + (i.getAttribute('aria-label') || '')) || i.autocomplete === 'cc-exp');
      const cvc = inputs.find(i => /cvc|security/i.test(i.name + i.id + i.placeholder + (i.getAttribute('aria-label') || '')) || i.autocomplete === 'cc-csc');
      const out = [];
      if (card) { set(card, '4242424242424242'); out.push('card:' + card.value); }
      if (exp) { set(exp, '12/33'); out.push('exp:' + exp.value); }
      if (cvc) { set(cvc, '123'); out.push('cvc:' + cvc.value); }
      out.join(' ; ');
    `;
    const fr = await bsend('Runtime.evaluate', { expression: fill, returnByValue: true, awaitPromise: false }, sessionId);
    console.log('FILL RESULT:', fr.result.value);
  }
  await bsend('Runtime.runIfWaitingForDebugger', {}, sessionId).catch(() => {});
}
process.exit(0);
