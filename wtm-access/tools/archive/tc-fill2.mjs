// Precisely fill card fields, verify, complete order, observe redirect
import { listTabs, connect, evalJs } from './cdp.mjs';
import fs from 'fs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 180000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);

const FRAME = { x: 194, y: 191, w: 377, h: 303 };

async function clickAt(x, y) {
  await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
  await new Promise((r) => setTimeout(r, 700));
}
async function keyCombo(modifiers, key, code, keyCode) {
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', modifiers, key, code, windowsVirtualKeyCode: keyCode });
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', modifiers, key, code, windowsVirtualKeyCode: keyCode });
  await new Promise((r) => setTimeout(r, 300));
}
async function fillField(x, y, value) {
  await clickAt(x, y);
  await keyCombo(2, 'a', 'KeyA', 65); // ctrl+a
  await cdp.send('Input.insertText', { text: value });
  await new Promise((r) => setTimeout(r, 500));
}

// card number: top row full width
await fillField(FRAME.x + FRAME.w / 2, FRAME.y + 40, '4242424242424242');
// expiry: row 2 left
await fillField(FRAME.x + 80, FRAME.y + 110, '12/33');
// cvc: row 2 right
await fillField(FRAME.x + 300, FRAME.y + 110, '123');

await new Promise((r) => setTimeout(r, 1500));
const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync('/tmp/checkout-pay2.png', Buffer.from(shot.data, 'base64'));
console.log('screenshot2 saved');
process.exit(0);
