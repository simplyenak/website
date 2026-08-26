// Retry Create product click with fresh coords + modal polling
import { listTabs, connect, evalJs } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 90000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);

// ensure scrolled to top
await evalJs(cdp, 'window.scrollTo(0, 0)');
await new Promise((r) => setTimeout(r, 600));

const pos = await evalJs(cdp, `(() => {
  const b = Array.from(document.querySelectorAll('button, a')).filter(x => x.offsetParent !== null).find(x => (x.textContent || '').trim() === 'Create product');
  if (!b) return null;
  const r = b.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2, tag: b.tagName, cls: b.className.slice(0, 40) };
})()`);
console.log('BTN:', JSON.stringify(pos));
if (!pos) process.exit(1);

await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: pos.x, y: pos.y });
await new Promise((r) => setTimeout(r, 300));
await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: pos.x, y: pos.y, button: 'left', clickCount: 1 });
await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: pos.x, y: pos.y, button: 'left', clickCount: 1 });

// poll for modal/overlay
for (let i = 0; i < 10; i++) {
  await new Promise((r) => setTimeout(r, 800));
  const url = await evalJs(cdp, 'location.href');
  const modal = await evalJs(cdp, `(() => {
    const m = document.querySelector('.modal, [class*=modal], [role=dialog], .popup, [class*=overlay]');
    return m && m.offsetParent !== null ? (m.innerText || '').slice(0, 150) : '';
  })()`);
  if (modal) {
    console.log('URL:', url);
    console.log('MODAL:', modal.replace(/\n+/g, ' | '));
    const fields = await evalJs(cdp, `(() => {
      return Array.from(document.querySelectorAll('input, select, textarea')).filter(i => i.offsetParent !== null).map(i => i.tagName + ':' + i.type + ':' + (i.name || i.id) + ':' + (i.placeholder || '').slice(0, 30));
    })()`);
    console.log('FIELDS:', String(fields).slice(0, 700));
    process.exit(0);
  }
  if (!url.includes('#/products')) {
    console.log('NAVIGATED:', url);
    const text = await evalJs(cdp, 'document.body.innerText.slice(0, 500)');
    console.log('TEXT:', text.replace(/\n+/g, ' | ').slice(0, 350));
    process.exit(0);
  }
}
console.log('no modal appeared');
process.exit(0);
