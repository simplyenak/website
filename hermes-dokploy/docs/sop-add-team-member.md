# SOP: Adding a Team Member to Hermes

## Overview

Hermes runs as a single Docker container on Dokploy (45.136.28.238). Currently
single-user (Maarten). Adding a team member requires decisions on isolation level
and changes across several config layers.

## Pre-Flight: Decide the Access Tier

Before touching anything, decide which tier the new member needs:

| Tier | Isolation | Use case | Effort |
|------|-----------|----------|--------|
| **Observer** | Shared profile, read-only tools | VA monitoring dashboards | Low |
| **Operator** | Shared profile, restricted tools | Guide coordinator responding to queries | Low |
| **Specialist** | Separate profile, scoped skills | Developer or ops person | Medium |
| **Admin** | Separate profile, full access | Co-founder, technical partner | Medium |

## Step 1: Get Their Telegram User ID

1. Have them send `/start` to the Hermes bot (`@SimplyEnakHermesBot`)
2. Check bot logs for the rejected user ID:
   ```bash
   ssh -p 4040 maarten@45.136.28.238
   docker service logs --tail 50 compose-index-auxiliary-program-qm58zh_hermes 2>&1 | grep "unauthorized"
   ```
3. Or have them message `@userinfobot` on Telegram which replies with their ID

## Step 2: Add to Telegram Whitelist

### Option A: Same shared profile (Tier Observer/Operator)

Append their Telegram user ID to the `TELEGRAM_ALLOWED_USERS` env var via Dokploy DB:

```bash
# SSH to server
ssh -p 4040 maarten@45.136.28.238

# Find current value
docker exec -i $(docker ps --filter name=dokploy-postgres --format '{{.Names}}') \
  psql -U dokploy -d dokploy -t -c \
  "SELECT env FROM compose WHERE \"appName\" = 'index-auxiliary-program-qm58zh';" | grep TELEGRAM_ALLOWED_USERS

# Update: append new user ID (comma-separated)
docker exec -i $(docker ps --filter name=dokploy-postgres --format '{{.Names}}') \
  psql -U dokploy -d dokploy -c \
  "UPDATE compose SET env = regexp_replace(env, 'TELEGRAM_ALLOWED_USERS=\[.*\]', 'TELEGRAM_ALLOWED_USERS=[1511186614,NEW_USER_ID]') WHERE \"appName\" = 'index-auxiliary-program-qm58zh';"

# Redeploy to pick up env change
docker service update --force compose-index-auxiliary-program-qm58zh_hermes
```

### Option B: Separate profile (Tier Specialist/Admin)

This requires a separate gateway process per profile, which is **not yet set up**.
See "Architecture needed" section below.

## Step 3: Give Workspace UI Access

The workspace UI at `workspace.system.simplyenak.com` uses a single shared password.

1. Share `HERMES_WORKSPACE_PASSWORD` with the team member (stored in Dokploy env)
2. They access via browser — no individual accounts yet

**Current limitation**: One password for everyone. No per-user workspace auth.

## Step 4: Restrict Tool Access (if Operator tier)

If the new member should NOT have access to dangerous tools (terminal, file writes,
financial data), add tool restrictions to their Telegram session.

Hermes supports `enabled_toolsets` per cron job, but **not yet per Telegram user**.
This is an architectural gap — see "Architecture needed" below.

**Workaround**: Set `GATEWAY_ALLOW_ALL_USERS=false` (already set) and control access
by only whitelisting trusted users. All whitelisted users get the same tool access.

## Step 5: Configure Approvals (recommended for non-admin)

Approvals are already enabled:
```yaml
approvals:
  mode: manual
  timeout: 60
  cron_mode: deny
  destructive_slash_confirm: true
```

This means destructive operations (file deletes, terminal commands) require explicit
confirmation. This applies to ALL users equally — no per-user configuration yet.

## Step 6: Verify Access

1. Team member sends a message to the Hermes bot
2. Check logs confirm their user ID is accepted:
   ```bash
   docker service logs --tail 20 compose-index-auxiliary-program-qm58zh_hermes 2>&1 | grep -v "unauthorized"
   ```
3. They try a simple query
4. They access workspace.system.simplyenak.com with shared password

### ⚠️ Important: Webhook Re-Registration

Every `docker service update --force` or `--env-rm/--env-add` creates a new container. Telegram's webhook registration is **not** automatically re-registered on the new container. After any redeploy:

```bash
CID=$(docker ps --filter name=hermes --format "{{.ID}}" | head -1)
docker exec "$CID" python3 -c "
import os, urllib.request, json
token = os.environ['TELEGRAM_BOT_TOKEN']
secret = os.environ['TELEGRAM_WEBHOOK_SECRET']
payload = json.dumps({'url': 'https://hermes.system.simplyenak.com/telegram', 'secret_token': secret, 'drop_pending_updates': True}).encode()
req = urllib.request.Request(f'https://api.telegram.org/bot{token}/setWebhook', data=payload, headers={'Content-Type': 'application/json'})
print(json.loads(urllib.request.urlopen(req).read()))
"
```

If you don't re-register, the bot will not respond to anyone after the redeploy.

## Step 7: Document

Record in Brilliant KB or MemPalace:
- Team member name + Telegram user ID
- Access tier granted
- Date added
- Any restrictions noted

## Revoking Access

1. **Telegram**: Remove their user ID from `TELEGRAM_ALLOWED_USERS` in Dokploy DB, redeploy
2. **Workspace**: Rotate `HERMES_WORKSPACE_PASSWORD` in Dokploy env, redeploy, share new password with remaining team
3. **If separate profile**: `hermes profile delete <name>` (stops their gateway, removes their data)

```bash
# Remove user from whitelist
docker exec -i $(docker ps --filter name=dokploy-postgres --format '{{.Names}}') \
  psql -U dokploy -d dokploy -c \
  "UPDATE compose SET env = regexp_replace(env, 'TELEGRAM_ALLOWED_USERS=\[.*\]', 'TELEGRAM_ALLOWED_USERS=[1511186614]') WHERE \"appName\" = 'index-auxiliary-program-qm58zh';"
docker service update --force compose-index-auxiliary-program-qm58zh_hermes
```

## Architecture Needed (not yet built)

These are the gaps that need engineering before multi-user works properly:

### 1. Per-User Tool Scoping
**Problem**: All whitelisted Telegram users get the same tools.
**Fix**: Add user-ID-based toolset mapping in gateway config:
```yaml
gateway:
  user_toolsets:
    "1511186614": ["all"]           # admin — everything
    "NEW_USER_ID": ["web", "search"] # operator — read-only tools
```
**Effort**: Requires code change in Hermes gateway (Python).

### 2. Per-User Profiles in Gateway
**Problem**: Gateway runs a single profile. All users share memory, skills, SOUL.md.
**Fix**: Route Telegram user ID to a profile at gateway level:
```yaml
telegram:
  user_profiles:
    "1511186614": "default"        # Maarten — full access
    "NEW_USER_ID": "operator"      # scoped profile
```
Each profile has its own `skills/`, `memories/`, `SOUL.md`.
**Effort**: Requires code change in Hermes gateway.

### 3. Individual Workspace Auth
**Problem**: Single shared password for workspace UI.
**Fix**: Either:
  - Add basic auth user per person (Traefik middleware supports multiple users)
  - Or wait for Hermes workspace to support user accounts natively
**Effort**: Traefik config change (low) or upstream feature request.

### 4. Audit Trail
**Problem**: No per-user action log. Can't tell who did what.
**Fix**: Enable `audit` section in config and ensure logs include user ID:
```yaml
audit:
  enabled: true
  log_path: /home/hermes/.hermes/logs/audit.jsonl
```
**Effort**: Config change + verify gateway logs user ID per action.

## Quick Reference: What Exists vs. What's Missing

| Capability | Status | Works for multi-user? |
|------------|--------|----------------------|
| Telegram user whitelist | ✅ Yes | Yes — comma-separated IDs |
| Workspace shared password | ✅ Yes | Shared — no per-user |
| Approvals on destructive ops | ✅ Yes | Global — applies to all |
| Secret redaction | ✅ Yes | Global |
| Per-user tool restrictions | ❌ No | Needs code change |
| Per-user profiles | ❌ No | Needs code change |
| Per-user workspace auth | ❌ No | Traefik multi-user possible |
| Audit log per user | ✅ Yes — enabled | Structured log at `/home/hermes/.hermes/logs/audit.jsonl` (90d retention, includes user ID) |
| Per-user memory isolation | ❌ No | Needs per-user profiles |
