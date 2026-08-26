// Fill Stripe card via coordinate clicks + insertText, complete order
import { listTabs, connect, evalJs } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 150000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);

// geometry of visible iframes in payment area
const frames = await evalJs(cdp, `(() => {
  return Array.from(document.querySelectorAll('iframe')).filter(f => {
    const r = f.getBoundingClientRect();
    return r.width > 50 && r.height > 10 && r.y > 0 && r.y < 3000;
  }).map(f => { const r = f.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), src: (f.src || '').slice(0, 60) }; });
})()`);
console.log('FRAMES:', JSON.stringify(frames));

async function clickAt(x, y) {
  await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
  await new Promise((r) => setTimeout(r, 600));
}
async function type(text) {
  await cdp.send('Input.insertText', { text });
  await new Promise((r) => setTimeout(r, 400));
}

// The payment element iframe = widest frame containing stripe src or biggest single-line frame
const arr = frames;
const cardFrame = arr.find(f => f.src.includes('stripe')) || arr.sort((a, b) => b.w - a.w)[0];
console.log('CARD FRAME:', JSON.stringify(cardFrame));

// card number field: left portion of the frame
await clickAt(cardFrame.x + 120, cardFrame.y + cardFrame.h / 2);
await type('4242424242424242');
// expiry: right side — try clicking progressively
await clickAt(cardFrame.x + cardFrame.w * 0.62, cardFrame.y + cardFrame.h / 2);
await type('1233');
// cvc: far right
await clickAt(cardFrame.x + cardFrame.w * 0.85, cardFrame.y + cardFrame.h / 2);
await type('123');

// screenshot-equivalent: dump frame states via outer page text
const text = await evalJs(cdp, 'document.body.innerText.slice(0, 400)');
console.log('TEXT:', text.replace(/\n+/g, ' | ').slice(0, 300));
process.exit(0);
