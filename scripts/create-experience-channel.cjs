#!/usr/bin/env node
/**
 * Create experience channel for guide submissions
 */
const { getPublicKey, finalizeEvent } = require('nostr-tools');
const WebSocket = require('ws');

const RELAY = 'wss://buzz.system.simplyenak.com';
const OWNER_HEX = '64172bcdff960b8fd4fe988e9ff7fd76734b3d0b46b5962d1ec3c4e778bed846';

function hexToBytes(hex) {
  const arr = new Uint8Array(32);
  for (let i = 0; i < 32; i++) arr[i] = parseInt(hex.slice(i*2, i*2+2), 16);
  return arr;
}

async function postEvent(privkeyHex, kind, tags, content) {
  const privkey = hexToBytes(privkeyHex);
  const event = finalizeEvent({
    created_at: Math.floor(Date.now() / 1000),
    kind, tags, content: content || ''
  }, privkey);

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(RELAY);
    let authenticated = false;

    ws.on('message', async (data) => {
      const msg = JSON.parse(data);

      if (msg[0] === 'AUTH') {
        const authEv = finalizeEvent({
          created_at: Math.floor(Date.now() / 1000),
          kind: 22242,
          tags: [['relay', RELAY], ['challenge', msg[1]]],
          content: ''
        }, privkey);
        ws.send(JSON.stringify(['AUTH', authEv]));
      } else if (msg[0] === 'OK' && msg[2] === true && !authenticated) {
        authenticated = true;
        ws.send(JSON.stringify(['EVENT', event]));
      } else if (msg[0] === 'OK' && msg[2] === true && authenticated) {
        ws.close();
        resolve(true);
      } else if (msg[0] === 'OK' && msg[2] === false) {
        console.error('Failed:', msg[3]);
        ws.close();
        resolve(false);
      }
    });

    ws.on('error', (err) => reject(err));
    setTimeout(() => { ws.close(); reject(new Error('timeout')); }, 15000);
  });
}

async function createChannel(name, about, visibility = 'public') {
  console.log('Creating channel:', name);
  
  const tags = [
    ['name', name],
    ['about', about],
    [visibility],
    ['t', 'stream']
  ];
  
  const ok = await postEvent(OWNER_HEX, 9007, tags, '');
  console.log('  Result:', ok ? 'ok' : 'failed');
  return ok;
}

const [,, name, about, visibility] = process.argv;
const channelName = name || 'experience';
const description = about || 'Share your first-hand experience from tours — prices, vendors, sensory details';

createChannel(channelName, description, visibility || 'public').then(ok => process.exit(ok ? 0 : 1));
