// Check URL expiration select, set Never if needed, click Save
import { listTabs, connect, evalJs } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 90000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);

// find expiration select
const expiry = await evalJs(cdp, `(() => {
  const sels = Array.from(document.querySelectorAll('select'));
  const s = sels.find(x => /expir|expiry/i.test(x.name + ' ' + x.id) || Array.from(x.options).some(o => /never/i.test(o.textContent) && /a week|1 day|12 hours/i.test(sels.map(y => y.innerHTML).join('')) && x === sels.find(z => Array.from(z.options).some(o => /a week/i.test(o.textContent)))));
  if (!s) {
    const alt = sels.find(x => Array.from(x.options).some(o => /never/i.test(o.value + o.textContent)) && Array.from(x.options).some(o => /1 day|a week/i.test(o.textContent)));
    return alt ? { name: alt.name, id: alt.id, value: alt.value, options: Array.from(alt.options).map(o => o.value + ':' + o.textContent.trim()) } : null;
  }
  return { name: s.name, id: s.id, value: s.value, options: Array.from(s.options).map(o => o.value + ':' + o.textContent.trim()) };
})()`);
console.log('EXPIRY:', JSON.stringify(expiry));

if (expiry && !/never/i.test(expiry.value)) {
  const changed = await evalJs(cdp, `(() => {
    const s = document.getElementById('${expiry.id}');
    const opt = Array.from(s.options).find(o => /never/i.test(o.value) || /never/i.test(o.textContent));
    if (!opt) return 'no never option';
    s.value = opt.value;
    s.dispatchEvent(new Event('change', { bubbles: true }));
    return 'set to ' + s.value;
  })()`);
  console.log('EXPIRY CHANGE:', changed);
}

// find Save button and trusted-click
const pos = await evalJs(cdp, `(() => {
  const btns = Array.from(document.querySelectorAll('button, a.btn, input[type=submit]'));
  const b = btns.find(x => /save/i.test((x.textContent || x.value || '').trim()) && /save & get url/i.test(x.textContent || x.value || ''));
  const b2 = b || btns.find(x => /^save/i.test((x.textContent || x.value || '').trim()));
  if (!b2) return null;
  b2.scrollIntoView({ block: 'center' });
  const r = b2.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2, label: (b2.textContent || b2.value || '').trim().slice(0, 30) };
})()`);
console.log('SAVE BTN:', JSON.stringify(pos));
if (!pos) process.exit(1);

await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: pos.x, y: pos.y, button: 'left', clickCount: 1 });
await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: pos.x, y: pos.y, button: 'left', clickCount: 1 });
console.log('clicked save');
await new Promise((r) => setTimeout(r, 7000));

const text = await evalJs(cdp, 'document.body.innerText.slice(0, 600)');
console.log('AFTER SAVE:', text.replace(/\n+/g, ' | ').slice(0, 400));
process.exit(0);
