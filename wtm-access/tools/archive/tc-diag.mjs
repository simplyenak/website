// Instrumented submit: console + network + screenshot after click
import { listTabs, connect, evalJs } from './cdp.mjs';
import fs from 'fs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 90000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);
await cdp.send('Network.enable');
await cdp.send('Runtime.enable');

const events = [];
cdp.on('Network.responseReceived', (p) => {
  const u = p.response.url;
  if (!u.includes('js.stripe.com/v3') && !u.includes('m.stripe.network') && !u.includes('.css'))
    events.push(p.response.status + ' ' + u.slice(0, 90));
});
cdp.on('Network.loadingFailed', (p) => events.push('FAIL ' + (p.errorText || '') + ' ' + (p.blockedReason || '')));
cdp.on('Runtime.consoleAPICalled', (p) => {
  if (['error', 'warning'].includes(p.type)) events.push('CONSOLE ' + p.type + ': ' + (p.args || []).map(a => String(a.value || a.description || '')).join(' ').slice(0, 140));
});

const pos = await evalJs(cdp, '(() => { const b = Array.from(document.querySelectorAll("button, a")).filter(x => x.offsetParent !== null).find(x => /complete order/i.test((x.textContent||"").trim())); const r = b.getBoundingClientRect(); return {x: r.x + r.width/2, y: r.y + r.height/2}; })()');
await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: pos.x, y: pos.y, button: 'left', clickCount: 1 });
await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: pos.x, y: pos.y, button: 'left', clickCount: 1 });
console.log('clicked');

await new Promise((r) => setTimeout(r, 12000));
console.log('EVENTS:', events.slice(0, 15).join('\n  ') || '(none)');

const errs = await evalJs(cdp, `(() => {
  const t = document.body.innerText;
  const lines = t.split('\n').filter(l => /error|invalid|incomplete|required|problem/i.test(l));
  return lines.slice(0, 6).join(' | ') || 'no error text';
})()`);
console.log('ERR TEXT:', errs);
const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync('/tmp/checkout-post.png', Buffer.from(shot.data, 'base64'));
console.log('shot saved');
process.exit(0);
