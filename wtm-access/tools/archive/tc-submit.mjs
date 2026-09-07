// Submit ThriveCart login form. TC_EMAIL/TC_PASS from env.
import { listTabs, connect, evalJs } from './cdp.mjs';

const email = process.env.TC_EMAIL || '';
const pass = process.env.TC_PASS || '';
if (!email || !pass) { console.error('TC_EMAIL/TC_PASS env required'); process.exit(1); }
setTimeout(() => { console.error('WATCHDOG exit'); process.exit(2); }, 50000);

const tabs = await listTabs();
const tab = tabs.find(t => t.url.includes('thrivecart.com/login'));
if (!tab) { console.error('no login tab'); process.exit(1); }
const cdp = await connect(tab.webSocketDebuggerUrl);

const ok = await evalJs(cdp, `(() => {
  const e = document.getElementById('signin-username');
  const p = document.getElementById('signin-password') || document.querySelector('input[type=password]');
  if (!e || !p) return 'missing fields';
  e.value = ${JSON.stringify(email)};
  p.value = ${JSON.stringify(pass)};
  document.getElementById('signin-form').submit();
  return 'submitted';
})()`);
console.log('SUBMIT:', ok);

await new Promise((r) => setTimeout(r, 7000));
console.log('URL:', await evalJs(cdp, 'location.href'));
const text = await evalJs(cdp, 'document.body.innerText.slice(0, 300)');
console.log('TEXT:', text.replace(/\n+/g, ' | ').slice(0, 260));
process.exit(0);
