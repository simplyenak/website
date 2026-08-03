#!/usr/bin/env python3
"""Generate Nostr keypair and verify relay owner key."""
import os

# SECP256K1 curve
Gx = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798
Gy = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8
p = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F
a = 0

def point_add(P, Q):
    if P is None: return Q
    if Q is None: return P
    (x1, y1), (x2, y2) = P, Q
    if x1 == x2 and y1 != y2: return None
    if P == Q:
        if y1 == 0: return None
        lam = (3 * x1 * x1 + a) * pow(2 * y1, -1, p) % p
    else:
        lam = (y2 - y1) * pow(x2 - x1, -1, p) % p
    x3 = (lam * lam - x1 - x2) % p
    y3 = (lam * (x1 - x3) - y1) % p
    return (x3, y3)

def point_mul(k, P):
    result = None
    addend = P
    while k:
        if k & 1: result = point_add(result, addend)
        addend = point_add(addend, addend)
        k >>= 1
    return result

def pubkey_from_priv(privkey_hex):
    d = int.from_bytes(bytes.fromhex(privkey_hex), 'big')
    G = (Gx, Gy)
    P = point_mul(d, G)
    return format(P[0], '064x')

# Verify relay owner key
relay_priv = "4fecff3695f329b177218e0d018856b5e87c7821403cb02343df0e4604ba4872"
derived = pubkey_from_priv(relay_priv)
expected = "7e8539c5ccbb1138d92a1f414efef9c833f080627956114ea7350747e564b989"
print(f"Relay priv->pub: {derived}")
print(f"Owner pubkey:    {expected}")
print(f"Match: {derived == expected}")

# Generate Maarten's key
maarten_priv = os.urandom(32).hex()
maarten_pub = pubkey_from_priv(maarten_priv)
print(f"\nMaarten private key (hex): {maarten_priv}")
print(f"Maarten public key (hex):  {maarten_pub}")
