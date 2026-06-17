# Production Secrets
# Generated: 2026-05-14
# ⚠️  DELETE THIS FILE after copying values to GitHub Secrets / Dokploy.
# Do NOT commit to version control.

# ── GitHub Secrets (add to simplyenak/revamp → Settings → Secrets → Actions) ──

PAYLOAD_SECRET=***REMOVED***

PAYLOAD_DB_PASSWORD=GENERATE_YOUR_OWN_openssl_rand_hex32

# ── How to generate ──
# openssl rand -hex 32

# ── Still needed from you ──
# DOCKERHUB_USERNAME      = your Docker Hub account name
# DOCKERHUB_TOKEN         = access token from hub.docker.com → Account Settings → Security
# CLOUDFLARE_API_TOKEN    = CF dashboard → API Tokens → Pages:Admin
# CLOUDFLARE_ACCOUNT_ID   = CF dashboard → Workers & Pages → Account ID