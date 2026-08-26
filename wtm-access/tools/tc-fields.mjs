// Fill test checkout: customer + card, submit, observe redirect
import { listTabs, connect, evalJs } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 120000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com/street-food'));
const cdp = await connect(tab.webSocketDebuggerUrl);

// dump form fields
const fields = await evalJs(cdp, `(() => {
  return Array.from(document.querySelectorAll('input, select')).filter(i => i.offsetParent !== null).map(i => (i.tagName === 'SELECT' ? 'select:' + i.id : i.type + ':' + (i.name || i.id) + ':' + (i.placeholder || '').slice(0, 20))).join(' | ');
})()`);
console.log('FIELDS:', String(fields).slice(0, 500));
process.exit(0);
