// Find all save buttons with geometry, click the visible one
import { listTabs, connect, evalJs } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 90000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);

await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 2400, deviceScaleFactor: 1, mobile: false });
await new Promise((r) => setTimeout(r, 500));
// scroll page to bottom where save bars live
await evalJs(cdp, 'window.scrollTo(0, document.body.scrollHeight)');
await new Promise((r) => setTimeout(r, 500));

const list = await evalJs(cdp, `(() => {
  return Array.from(document.querySelectorAll('button, a')).filter(b => /^\\s*save/i.test((b.textContent || '').trim())).map(b => {
    const r = b.getBoundingClientRect();
    return { label: (b.textContent || '').trim().slice(0, 25), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), visible: r.width > 0 && r.height > 0 && r.y >= 0 && r.y < window.innerHeight, tag: b.tagName };
  });
})()`);
console.log('SAVE BUTTONS:', JSON.stringify(list, null, 0));

const target = JSON.parse(list).filter(b => b.visible && b.w > 40).pop();
if (!target) { console.log('no visible save button'); process.exit(1); }
console.log('CLICKING:', JSON.stringify(target));

await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: target.x + target.w / 2, y: target.y + target.h / 2, button: 'left', clickCount: 1 });
await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: target.x + target.w / 2, y: target.y + target.h / 2, button: 'left', clickCount: 1 });
await new Promise((r) => setTimeout(r, 8000));

const text = await evalJs(cdp, 'document.body.innerText.slice(0, 700)');
console.log('AFTER:', text.replace(/\n+/g, ' | ').slice(0, 450));
// any toast/notification
const toast = await evalJs(cdp, `(() => { const t = document.querySelector('.toast, .notification, .alert, [class*=toast], [class*=saved]'); return t ? t.textContent.trim().slice(0, 100) : 'no toast'; })()`);
console.log('TOAST:', toast);
process.exit(0);
