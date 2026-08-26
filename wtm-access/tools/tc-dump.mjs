// Dump DOM around "What should happen after purchase?" section
import { listTabs, connect, evalJs } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 60000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);

const html = await evalJs(cdp, `(() => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    if (n.textContent.includes('What should happen after purchase')) {
      let el = n.parentElement;
      for (let i = 0; i < 3 && el.parentElement; i++) el = el.parentElement;
      return el.outerHTML.slice(0, 3500);
    }
  }
  return 'not found';
})()`);
console.log(html);
process.exit(0);
