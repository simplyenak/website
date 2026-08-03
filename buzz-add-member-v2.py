#!/usr/bin/env python3
"""Add a community member to Buzz relay via NIP-43 kind 9030 event.
Uses pynostr for proper Schnorr/BIP-340 signing.
"""
import sys
import json
import time
import hashlib
from pynostr.key import PrivateKey
from pynostr.event import Event
import websocket

def main():
    owner_privkey_hex = sys.argv[1]  # owner private key (hex)
    target_pubkey_hex = sys.argv[2]  # target pubkey to add (hex)
    relay_url = sys.argv[3]          # e.g. https://buzz.system.simplyenak.com

    ws_url = relay_url.replace("https://", "wss://").replace("http://", "ws://")

    # Create Nostr identity from owner private key
    sk = PrivateKey(bytes.fromhex(owner_privkey_hex))
    owner_pubkey = sk.public_key.hex()
    print(f"Owner pubkey: {owner_pubkey}")
    print(f"Target pubkey: {target_pubkey_hex}")

    # Build kind 9030 event (Add relay member)
    # Create event with tags
    event = Event(
        pubkey=owner_pubkey,
        kind=9030,
        content="",
        created_at=int(time.time()),
        tags=[["p", target_pubkey_hex], ["role", "member"]],
    )

    # Sign it
    event.sign(owner_privkey_hex)

    print(f"Event ID: {event.id}")
    print(f"Signature: {event.signature[:40]}...")

    event_dict = {
        "id": event.id,
        "pubkey": event.pubkey,
        "created_at": event.created_at,
        "kind": event.kind,
        "tags": event.tags,
        "content": event.content,
        "sig": event.signature,
    }

    # Connect and authenticate
    ws = websocket.create_connection(ws_url)
    result = ws.recv()
    print(f"Received: {result[:100]}")

    msg = json.loads(result)
    if msg[0] == "AUTH":
        challenge = msg[1]
        print(f"AUTH challenge received")

        # Sign AUTH event (kind 22242)
        auth_event = Event(
            pubkey=owner_pubkey,
            kind=22242,
            content="",
            created_at=int(time.time()),
            tags=[["relay", relay_url], ["challenge", challenge]],
        )
        auth_event.sign(owner_privkey_hex)

        auth_dict = {
            "id": auth_event.id,
            "pubkey": auth_event.pubkey,
            "created_at": auth_event.created_at,
            "kind": auth_event.kind,
            "tags": auth_event.tags,
            "content": auth_event.content,
            "sig": auth_event.signature,
        }

        ws.send(json.dumps(["AUTH", auth_dict]))
        auth_resp = ws.recv()
        print(f"AUTH response: {auth_resp[:200]}")

    # Send the add-member event
    ws.send(json.dumps(["EVENT", event_dict]))
    resp = ws.recv()
    print(f"EVENT response: {resp}")

    # Wait for any additional responses
    ws.settimeout(3)
    try:
        while True:
            extra = ws.recv()
            print(f"Extra: {extra}")
    except:
        pass

    ws.close()

if __name__ == "__main__":
    main()