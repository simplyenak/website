#!/usr/bin/env python3
"""Add a community member to Buzz relay via NIP-43 kind 9030 event."""
import sys
import json
import time
import websocket
from pynostr.key import PrivateKey
from pynostr.event import Event

def main():
    owner_privkey_hex = sys.argv[1]
    target_pubkey_hex = sys.argv[2]
    relay_url = sys.argv[3]

    ws_url = relay_url.replace("https://", "wss://").replace("http://", "ws://")

    sk = PrivateKey(bytes.fromhex(owner_privkey_hex))
    owner_pubkey = sk.public_key.hex()
    print(f"Owner pubkey: {owner_pubkey}")
    print(f"Target pubkey: {target_pubkey_hex}")

    # Kind 9030: Add relay member
    event = Event(
        pubkey=owner_pubkey,
        kind=9030,
        content="",
        created_at=int(time.time()),
        tags=[["p", target_pubkey_hex], ["role", "member"]],
    )
    event.sign(owner_privkey_hex)
    print(f"Event ID: {event.id}")

    # Connect and handle NIP-42 auth
    ws = websocket.create_connection(ws_url)
    result = ws.recv()
    msg = json.loads(result)

    if msg[0] == "AUTH":
        challenge = msg[1]
        print(f"AUTH challenge received")
        auth_event = Event(
            pubkey=owner_pubkey,
            kind=22242,
            content="",
            created_at=int(time.time()),
            tags=[["relay", ws_url], ["challenge", challenge]],
        )
        auth_event.sign(owner_privkey_hex)
        ws.send(json.dumps(["AUTH", auth_event.to_dict()]))
        auth_resp = ws.recv()
        print(f"AUTH response: {auth_resp}")

    # Send add-member event
    ws.send(json.dumps(["EVENT", event.to_dict()]))
    resp = ws.recv()
    print(f"EVENT response: {resp}")

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