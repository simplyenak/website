// Minimal CDP driver for chrome-headless-shell on :9222
// Usage: node cdp.mjs <url> — navigates and prints page text
// Or import { cdpSession, navigate, evalJs } from './cdp.mjs'

const CDP_HTTP = 'http://localhost:9222';

export async function newTab(url = 'about:blank') {
  const r = await fetch(`${CDP_HTTP}/json/new?${new URLSearchParams({ url })}`, { method: 'PUT' });
  const tab = await r.json();
  return tab; // { id, webSocketDebuggerUrl, ... }
}

export async function listTabs() {
  const r = await fetch(`${CDP_HTTP}/json/list`);
  return r.json();
}

export function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const pending = new Map();
    let id = 0;
    const listeners = {};
    ws.onopen = () => resolve({
      send(method, params = {}) {
        return new Promise((res, rej) => {
          const mid = ++id;
          pending.set(mid, { res, rej });
          ws.send(JSON.stringify({ id: mid, method, params }));
        });
      },
      on(method, fn) { (listeners[method] = listeners[method] || []).push(fn); },
      close() { ws.close(); },
    });
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const { res, rej } = pending.get(msg.id);
        pending.delete(msg.id);
        msg.error ? rej(new Error(msg.error.message)) : res(msg.result);
      } else if (msg.method && listeners[msg.method]) {
        for (const fn of listeners[msg.method]) fn(msg.params);
      }
    };
    ws.onerror = (e) => reject(new Error('ws error'));
  });
}

export async function navigate(cdp, url, timeoutMs = 20000) {
  await cdp.send('Page.enable');
  await cdp.send('Page.navigate', { url });
  await new Promise((resolve) => {
    const t = setTimeout(resolve, timeoutMs);
    cdp.on('Page.loadEventFired', () => { clearTimeout(t); resolve(); });
  });
  await new Promise((r) => setTimeout(r, 1200)); // settle SPA render
}

export async function evalJs(cdp, expression, awaitPromise = false) {
  const r = await cdp.send('Runtime.evaluate', {
    expression, awaitPromise, returnByValue: true,
  });
  if (r.exceptionDetails) throw new Error('page js: ' + JSON.stringify(r.exceptionDetails).slice(0, 400));
  return r.result?.value;
}
