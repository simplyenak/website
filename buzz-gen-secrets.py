import secrets, string

# Postgres password (32 hex chars)
pg_pass = secrets.token_hex(16)

# Redis password (32 hex chars)
redis_pass = secrets.token_hex(16)

# S3 access key (20 alphanumeric)
s3_access = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(20))

# S3 secret key (40 alphanumeric)
s3_secret = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(40))

# HMAC secret (64 hex chars)
hmac_secret = secrets.token_hex(32)

# Relay private key (64 hex chars) — relay signing key
relay_privkey = secrets.token_hex(32)

# Output
print(f'POSTGRES_PASSWORD={pg_pass}')
print(f'REDIS_PASSWORD={redis_pass}')
print(f'BUZZ_S3_ACCESS_KEY={s3_access}')
print(f'BUZZ_S3_SECRET_KEY={s3_secret}')
print(f'BUZZ_GIT_HOOK_HMAC_SECRET={hmac_secret}')
print(f'BUZZ_RELAY_PRIVATE_KEY={relay_privkey}')