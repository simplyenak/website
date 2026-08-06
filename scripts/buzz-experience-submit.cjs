#!/usr/bin/env node
/**
 * Post experience note to Buzz channel and save to Payload
 * Usage: node buzz-experience-submit.cjs <message>
 */
const { getPublicKey, finalizeEvent } = require('nostr-tools');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const RELAY = 'wss://buzz.system.simplyenak.com';
const OWNER_HEX = '64172bcdff960b8fd4fe988e9ff7fd76734b3d0b46b5962d1ec3c4e778bed846';
const PAYLOAD_URL = process.env.PAYLOAD_URL || 'https://cms.system.simplyenak.com';
const PAYLOAD_TOKEN = process.env.PAYLOAD_TOKEN || '';

function hexToBytes(hex) {
  const arr = new Uint8Array(32);
  for (let i = 0; i < 32; i++) arr[i] = parseInt(hex.slice(i*2, i*2+2), 16);
  return arr;
}

// Parse experience message format
function parseExperienceMessage(message) {
  const lines = message.split('\n').filter(l => l.trim());
  const data = {
    title: 'Experience Note',
    location: '',
    dishes: [],
    vendors: [],
    sensoryDetails: [],
    surprises: '',
    recommendations: [],
    bestTime: '',
    priceRange: '',
    rawNote: message
  };

  let currentSection = null;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Section headers
    if (trimmed.toLowerCase().startsWith('location:')) {
      data.location = trimmed.replace(/location:/i, '').trim();
      currentSection = null;
    } else if (trimmed.toLowerCase().startsWith('dishes:')) {
      currentSection = 'dishes';
      continue;
    } else if (trimmed.toLowerCase().startsWith('vendors:')) {
      currentSection = 'vendors';
      continue;
    } else if (trimmed.toLowerCase().startsWith('sensory:')) {
      currentSection = 'sensory';
      continue;
    } else if (trimmed.toLowerCase().startsWith('surprises:')) {
      currentSection = 'surprises';
      continue;
    } else if (trimmed.toLowerCase().startsWith('tips:')) {
      currentSection = 'tips';
      continue;
    } else if (trimmed.toLowerCase().startsWith('best time:')) {
      data.bestTime = trimmed.replace(/best time:/i, '').trim();
      currentSection = null;
    } else if (trimmed.toLowerCase().startsWith('price range:')) {
      data.priceRange = trimmed.replace(/price range:/i, '').trim();
      currentSection = null;
    } else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      // List item
      const item = trimmed.replace(/^[-*]\s*/, '');
      
      if (currentSection === 'dishes') {
        // Parse dish: name (RM X) at vendor
        const match = item.match(/^(.+?)\s*(?:\(RM\s*(\d+\.?\d*)\)|,?\s*(?:at|in|near)\s+(.+))?$/i);
        if (match) {
          data.dishes.push({
            name: match[1].trim(),
            price: match[2] ? `RM ${match[2]}` : '',
            vendor: match[3] ? match[3].trim() : ''
          });
        } else {
          data.dishes.push({ name: item, price: '', vendor: '' });
        }
      } else if (currentSection === 'vendors') {
        data.vendors.push({ name: item, story: '' });
      } else if (currentSection === 'sensory') {
        data.sensoryDetails.push({ detail: item, category: 'texture' });
      } else if (currentSection === 'tips') {
        data.recommendations.push({ tip: item, priority: 'high' });
      }
    } else if (currentSection === 'surprises') {
      if (data.surprises) data.surprises += '\n';
      data.surprises += item;
    } else {
      // Check if it's a title
      if (!data.title || data.title === 'Experience Note') {
        data.title = item;
      }
    }
  }

  return data;
}

async function postToChannel(privkeyHex, channelId, message) {
  const privkey = hexToBytes(privkeyHex);
  const event = finalizeEvent({
    created_at: Math.floor(Date.now() / 1000),
    kind: 1,
    tags: [['h', channelId]],
    content: message
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
        ws.close();
        resolve(false);
      }
    });

    ws.on('error', (err) => reject(err));
    setTimeout(() => { ws.close(); reject(new Error('timeout')); }, 15000);
  });
}

async function saveToPayload(data) {
  if (!PAYLOAD_TOKEN) {
    console.error('PAYLOAD_TOKEN not set');
    return false;
  }

  const note = {
    title: data.title,
    location: data.location,
    noteType: 'tour_debrief',
    dishes: data.dishes,
    vendors: data.vendors,
    sensoryDetails: data.sensoryDetails,
    surprises: data.surprises,
    recommendations: data.recommendations,
    bestTime: data.bestTime,
    priceRange: data.priceRange,
    rawNote: data.rawNote,
    status: 'draft',
  };

  try {
    const res = await fetch(`${PAYLOAD_URL}/api/experience_notes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYLOAD_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: note }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Payload error:', error);
      return false;
    }

    const result = await res.json();
    console.log('Saved to Payload:', result.doc?.slug);
    return true;
  } catch (err) {
    console.error('Payload save error:', err.message);
    return false;
  }
}

// Channel IDs
const CHANNEL_IDS = {
  experience: 'EXPERIENCE_CHANNEL_ID_HERE', // Will be set after creation
  general: '67b7d3e1-f3c7-4ba8-bfa3-49a971d025cc',
  hermes: '233f0c82-dcf3-450e-ab04-d0eea5c69511',
  content: '12fc8c01-1119-4f06-b7f9-a86dfd3fe8f0',
};

async function main() {
  const message = process.argv[2];
  if (!message) {
    console.log('Usage: node buzz-experience-submit.cjs "<experience message>"');
    console.log('');
    console.log('Format:');
    console.log('  Title: Your experience title');
    console.log('  Location: Where this happened');
    console.log('  Dishes:');
    console.log('    - dish name (RM price) at vendor');
    console.log('  Vendors:');
    console.log('    - vendor name');
    console.log('  Sensory:');
    console.log('    - texture/taste/smell description');
    console.log('  Tips:');
    console.log('    - recommendation');
    process.exit(1);
  }

  const data = parseExperienceMessage(message);
  
  console.log('Posting to Buzz...');
  const posted = await postToChannel(OWNER_HEX, CHANNEL_IDS.experience, message);
  
  if (posted) {
    console.log('Posted to Buzz!');
    console.log('\nSaving to Payload...');
    await saveToPayload(data);
  } else {
    console.error('Failed to post to Buzz');
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
