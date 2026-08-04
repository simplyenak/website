# Buzz Recovery + Hermes 0.20 Upgrade Plan

## What Working Buzz Looks Like

```
User posts in #general (Buzz desktop/iOS app)
       ↓
Buzz relay receives kind:1 event
       ↓
Hermes gateway (on server) has WSS subscription
       ↓
Hermes sees message, runs agent turn
       ↓
Hermes posts reply as kind:1 event to same channel
       ↓
User sees reply in Buzz app

Cron jobs: deliver="buzz:<channel-uuid>" → message appears in that channel
```

Single Hermes gateway, one process. Fizz/Honey/Bumble are personas (same Hermes,
different system prompt per channel), NOT separate processes.

## Current State (Diagnosed)

| Component | Status | Detail |
|-----------|--------|--------|
| Relay infra | HEALTHY | All 6 services up, NIP-11 responds |
| Hermes on server | v0.19.1 | Needs v0.20.0 (Herald release, Buzz improvements) |
| Buzz plugin | EXISTS | `/usr/local/lib/python3.12/site-packages/plugins/platforms/buzz/` |
| Buzz platform enabled | DISABLED | `platforms: {}` in config.yaml |
| Hermes key relay membership | OK | In relay_members table |
| Hermes key channel membership | BROKEN | Only member of "expertise" (1 of 16 channels) |
| BUZZ_HOME_CHANNEL env | WRONG | Points to non-existent UUID 233f0c82... |
| opencode-go API key | BROKEN | HTTP 401 Invalid API key |
| Last Buzz message | Aug 2 | 2 days ago, 11 total messages ever |
| GitHub reachable | YES | Can pip install from git now |

### Root Causes (in priority order)

1. **Buzz platform not enabled** — plugin exists but `platforms: {}` means it never loads
2. **Hermes key not in channels** — relay returns `400: restricted: not a channel member`
3. **BUZZ_HOME_CHANNEL is wrong** — points to deleted/non-existent channel UUID
4. **Hermes v0.19.1** — predates Herald Buzz improvements
5. **opencode-go API key invalid** — cron jobs using deepseek-v4-flash fail with 401

---

## Phase 1: Fix Database (relay membership) — 5 min

Add Hermes key (5cf9b39c...) to all channel_members tables so it can post.

```sql
-- Run against production-buzz_postgres
-- Add Hermes key to every channel as member
INSERT INTO channel_members (community_id, channel_id, pubkey, role, joined_at, invited_by)
SELECT '9e56adfe-1dae-4305-96b6-edb6659e7996', c.id,
       decode('5cf9b39c5a6211b68a880759fd2405475cbd053343a383a323d29769f1c7a3ba', 'hex'),
       'member', now(),
       decode('7e8539c5ccbb1138d92a1f414efef9c833f080627956114ea7350747e564b989', 'hex')
FROM channels c
WHERE NOT EXISTS (
    SELECT 1 FROM channel_members cm
    WHERE cm.channel_id = c.id
    AND encode(cm.pubkey, 'hex') = '5cf9b39c5a6211b68a880759fd2405475cbd053343a383a323d29769f1c7a3ba'
);
```

Fix BUZZ_HOME_CHANNEL to real "general" channel: `98427b43-fd45-405f-ad4e-38e949527e45`

## Phase 2: Update Hermes Docker Image to v0.20.0 — 15 min

Update Dockerfile to install from GitHub (reachable now):

```dockerfile
# Old: COPY hermes-agent/ + HERMES_NIX_BUILD=1 pip install local source
# New: pip install from git tag
RUN pip install --no-cache-dir "git+https://github.com/NousResearch/hermes-agent.git@v2026.8.3#egg=hermes-agent[web,cron,voice]"
```

Build + push to local registry:
```bash
cd ~/hermes-dokploy
docker build -t hermes-simplyenak:latest -f Dockerfile .
docker tag hermes-simplyenak:latest localhost:5000/hermes-simplyenak:latest
docker push localhost:5000/hermes-simplyenak:latest
```

## Phase 3: Enable Buzz Platform in Config — 5 min

Update config.yaml inside the container (or via Dokploy env/mount):

```yaml
platforms:
  buzz:
    enabled: true
    # These come from env vars already set:
    # BUZZ_RELAY_URL, BUZZ_PRIVATE_KEY, BUZZ_HOME_CHANNEL, BUZZ_ALLOWED_USERS
```

Redeploy: `docker service update --force compose-index-auxiliary-program-qm58zh_hermes`

## Phase 4: Fix API Key — 2 min

opencode-go key expired. Either:
- Rotate OPENCODE_GO_API_KEY in Dokploy env
- OR switch cron jobs to Omniroute (already has valid key)

## Phase 5: Verify — 5 min

1. Check gateway logs show Buzz platform connected
2. Post test message from Buzz app to #general
3. Verify Hermes responds
4. Trigger a cron job with `deliver="buzz:98427b43-..."` and verify it appears
5. Check relay events table for new kind:1 events

---

## Risk Notes

- Phase 2 rebuild causes ~30s gateway downtime during Swarm service update
- Phase 1 SQL is idempotent (uses NOT EXISTS guard)
- Fizz/Honey/Bumble agent keys exist in skill docs but only Hermes key is deployed on server
- If the v0.20.0 Dockerfile build fails (Nix backend), fallback: bundle source tree like v0.19.1 did
