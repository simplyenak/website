// Locate hcaptcha challenge iframe, clip-screenshot the grid
import { listTabs, connect, evalJs } from './cdp.mjs';
import fs from 'fs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 60000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);

// find visible hcaptcha iframes with size
const rects = await evalJs(cdp, `(() => {
  return Array.from(document.querySelectorAll('iframe')).filter(f => {
    const r = f.getBoundingClientRect();
    return r.width > 200 && r.height > 150;
  }).map(f => { const r = f.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), src: (f.src || f.name || '').slice(0, 70) }; });
})()`);
console.log('BIG IFRAMES:', JSON.stringify(rects));

const hc = JSON.parse(rects).find(r => r.src.includes('hcaptcha')) || JSON.parse(rects).find(r => r.w > 250 && r.h > 300) || JSON.parse(rects)[0];
console.log('CAPTCHA FRAME:', JSON.stringify(hc));

const shot = await cdp.send('Page.captureScreenshot', { format: 'png', clip: { x: hc.x, y: hc.y, width: hc.w, height: hc.h, scale: 2 } });
fs.writeFileSync('/tmp/hcaptcha-grid.png', Buffer.from(shot.data, 'base64'));
console.log('grid saved:', hc.w, 'x', hc.h, 'at', hc.x, hc.y);
process.exit(0);
