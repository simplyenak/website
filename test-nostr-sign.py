#!/usr/bin/env python3
"""Test pynostr event signing/verification locally."""
import time
from pynostr.key import PrivateKey
from pynostr.event import Event

owner_privkey_hex = "64172bcdff960b8fd4fe988e9ff7fd76734b3d0b46b5962d1ec3c4e778bed846"
sk = PrivateKey(bytes.fromhex(owner_privkey_hex))
owner_pubkey = sk.public_key.hex()

print(f"Pubkey: {owner_pubkey}")
print(f"Pubkey len: {len(owner_pubkey)}")

# Create a simple kind 1 text note
event = Event(
    pubkey=owner_pubkey,
    kind=1,
    content="test",
    created_at=int(time.time()),
    tags=[],
)
event.sign(owner_privkey_hex)

print(f"Event ID: {event.id}")
print(f"Sig: {event.sig}")
print(f"Sig len: {len(event.sig)}")

# Verify locally
valid = event.verify()
print(f"Local verify: {valid}")

# Also check with to_dict
d = event.to_dict()
print(f"Dict: {d}")