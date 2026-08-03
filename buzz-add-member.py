#!/usr/bin/env python3
"""Add a community member to Buzz relay via NIP-43 kind 9030 event."""
import sys
import json
import time
import hashlib
import requests
from coincurve import PrivateKey

def sign_event(privkey_hex: str, kind: int, content: str, tags: list) -> dict:
    """Create and sign a Nostr event."""
    privkey = bytes.fromhex(privkey_hex)
    pk = PrivateKey(privkey)
    pubkey_hex = pk.public_key.format(compressed=True)[1:].hex()

    event = {
        "pubkey": pubkey_hex,
        "created_at": int(time.time()),
        "kind": kind,
        "tags": tags,
        "content": content,
    }

    # Canonical serialization for event ID
    serialized = json.dumps([0, event["pubkey"], event["created_at"],
                           event["kind"], event["tags"], event["content"]],
                          separators=(',', ':'), ensure_ascii=False)
    event_id = hashlib.sha256(serialized.encode('utf-8')).hexdigest()
    event["id"] = event_id

    # Sign with secp256k1 — Schnorr signature (BIP-340)
    # coincurve doesn't do Schnorr natively, but we can use the SchnorrSign
    sig = pk.sign_schnorr(bytes.fromhex(event_id), None)
    event["sig"] = sig.hex()

    return event

def main():
    owner_privkey = sys.argv[1]  # owner private key (hex)
    target_pubkey = sys.argv[2]  # target pubkey to add (hex)
    relay_url = sys.argv[3]      # e.g. https://buzz.system.simplyenak.com

    # Kind 9030: Add relay member
    # Tags: ["p", target_pubkey], optionally ["role", "member"]
    tags = [
        ["p", target_pubkey],
        ["role", "member"],
    ]

    event = sign_event(owner_privkey, 9030, "", tags)
    print(f"Signed event: {json.dumps(event, indent=2)}")

    # Submit via WebSocket EVENT message through relay's Nostr endpoint
    # Buzz relay accepts events via WebSocket, but we can also try the HTTP ingest
    # Try the relay's HTTP event endpoint first
    ws_url = relay_url.replace("https://", "wss://").replace("http://", "ws://")

    import websocket
    ws = websocket.create_connection(ws_url)

    # Read auth challenge if required (NIP-42)
    result = ws.recv()
    print(f"Received: {result[:200]}")

    msg = json.loads(result)
    if msg[0] == "AUTH":
        challenge = msg[1]
        print(f"Got AUTH challenge: {challenge}")

        # Sign AUTH event (kind 22242)
        auth_event = sign_event(owner_privkey, 22242, "", [
            ["relay", relay_url],
            ["challenge", challenge],
        ])
        ws.send(json.dumps(["AUTH", auth_event]))
        auth_resp = ws.recv()
        print(f"AUTH response: {auth_resp[:200]}")

    # Now send the EVENT
    ws.send(json.dumps(["EVENT", event]))
    resp = ws.recv()
    print(f"EVENT response: {resp}")
    ws.close()

if __name__ == "__main__":
    main()