// Inspect fulfilment form state: radios, inputs, selects
import { listTabs, connect, evalJs } from './cdp.mjs';

setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 60000);
const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com'));
const cdp = await connect(tab.webSocketDebuggerUrl);

const state = await evalJs(cdp, `(() => {
  const out = { radios: [], inputs: [], selects: [] };
  for (const r of document.querySelectorAll('input[type=radio]')) {
    const label = r.closest('label') ? r.closest('label').textContent.trim().slice(0, 50) : (r.parentElement.textContent || '').trim().slice(0, 50);
    out.radios.push({ name: r.name, value: r.value, checked: r.checked, label });
  }
  for (const i of document.querySelectorAll('input[type=text], input[type=url], input:not([type])')) {
    if (i.offsetParent === null) continue; // visible only
    out.inputs.push({ name: i.name, id: i.id, value: String(i.value).slice(0, 80), ph: i.placeholder });
  }
  for (const s of document.querySelectorAll('select')) {
    out.selects.push({ name: s.name, id: s.id, value: s.value });
  }
  return JSON.stringify(out);
})()`);
console.log(state);
process.exit(0);
