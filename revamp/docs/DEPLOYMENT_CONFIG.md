# Deployment Configuration

## Overview

This repository deploys to **Cloudflare Pages** (frontend) and **Dokploy** (backend) with the following setup:

| Component | Platform | Domain | Environment |
|-----------|----------|--------|-------------|
| Frontend | Cloudflare Pages | staging.simplyenak.com | Staging |
| Frontend | Cloudflare Pages | simplyenak.com | Production |
| Backend | Dokploy (Docker) | cms.system.simplyenak.com | Staging |
| Backend | Dokploy (Docker) | cms.system.simplyenak.com | Production |

## CI/CD Architecture

```
Developer push to main
  │
  ├──► GitHub Actions: staging.yml
  │     ├── Build Docker image → simplyenak/website-backend:staging
  │     ├── Build Astro frontend → deploy to CF Pages staging
  │
  └──► (after testing)
        Manual trigger: promote-to-production.yml
          ├── Build Docker image → simplyenak/website-backend:production
          ├── Tag as :latest (fallback)
          └── Deploy frontend to CF Pages production
                │
                ▼
          Dokploy auto-pulls :production image → deploys
```

## Current Status

✅ **Staging workflow** — `.github/workflows/staging.yml` ready  
✅ **Production promotion** — `.github/workflows/promote-to-production.yml` ready  
✅ **Docker image** — builds in GitHub Actions, pushes to Docker Hub  
✅ **Backend** — Dokploy configured with `docker-compose.production.yml`  
✅ **Frontend staging** — CF Pages staging project (needs reconnect to this repo)  
✅ **Frontend production** — CF Pages production project  

## Workflow Details

### Staging Deploy (`staging.yml`)

- **Trigger:** Push to `main` (auto) or PR to `main`
- **Backend job:** Builds Docker image → `simplyenak/website-backend:staging`
- **Frontend job:** Builds Astro → deploys to CF Pages staging
- **Required secrets:** `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

### Promote to Production (`promote-to-production.yml`)

- **Trigger:** Manual (`workflow_dispatch`), requires confirmation input `"deploy"`
- **Backend job:** Builds Docker image → tags as `:production`, `:production-{sha}`, and `:latest`
- **Frontend job:** Builds Astro → deploys to CF Pages production
- **Required secrets:** Same as staging + production CF Pages project

## Docker Image Tags

| Tag | Purpose | Updated By |
|-----|---------|------------|
| `:staging` | Latest staging build | `staging.yml` on every push to main |
| `:staging-{sha}` | Pinned staging build | `staging.yml` on every push to main |
| `:production` | Current production (what Dokploy runs) | `promote-to-production.yml` |
| `:production-{sha}` | Pinned production build (for rollback) | `promote-to-production.yml` |
| `:latest` | Fallback / most recent production build | `promote-to-production.yml` |

## Dokploy Configuration

### Docker Compose (`docker-compose.production.yml`)

```yaml
services:
  payload:
    image: simplyenak/website-backend:production
    # Traefik routing → cms.system.simplyenak.com
    # ...
  payload-postgres:
    image: postgres:16-alpine
    # ...
```

### Dokploy Setup Steps

1. **Create stack** in Dokploy dashboard
2. **Connect to GitHub** repo: `simplyenak/revamp`
3. **Set compose file path:** `revamp/backend/docker-compose.production.yml`
4. **Add environment variables:**

| Variable | Value | Source |
|----------|-------|--------|
| `DATABASE_URL` | `postgres://payload:***@payload-postgres:5432/payload_production` | Docker Compose env |
| `PAYLOAD_SECRET` | `[generate: openssl rand -hex 32]` | GitHub Secret |
| `PAYLOAD_DB_PASSWORD` | `[generate: openssl rand -hex 32]` | GitHub Secret + Dokploy env |
| `S3_ACCESS_KEY_ID` | `[your S3 key]` | GitHub Secret |
| `S3_SECRET_ACCESS_KEY` | `[your S3 secret]` | GitHub Secret |
| `S3_BUCKET` | `[your bucket]` | GitHub Secret |
| `S3_REGION` | `[your region]` | GitHub Secret |
| `S3_ENDPOINT` | `[your S3 endpoint]` | GitHub Secret |
| `PAYLOAD_PUBLIC_SERVER_URL` | `https://cms.system.simplyenak.com` | Docker Compose env |
| `NEXT_PUBLIC_SERVER_URL` | `https://cms.system.simplyenak.com` | Docker Compose env |
| `NODE_ENV` | `production` | Docker Compose env |
| `PAYLOAD_TELEMETRY` | `false` | Docker Compose env |

5. **Enable auto-deploy** — Dokploy watches Docker Hub for new `:production` tags
6. **Set up Docker Hub webhook** → Dokploy auto-redeploys on new image push

## Environment Variables (GitHub Secrets)

### Required for Both Workflows

| Secret | Description | Status |
|--------|-------------|--------|
| `DOCKERHUB_USERNAME` | Docker Hub login | Needs to be added |
| `DOCKERHUB_TOKEN` | Docker Hub access token (create at hub.docker.com) | Needs to be added |
| `CLOUDFLARE_API_TOKEN` | CF Pages deploy token | Needs to be added |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | Needs to be added |

## Local Development

```bash
# Start Postgres
pg_ctl -D /home/maarten/pgdata start

# Backend (from revamp/backend/)
cp .env.example .env   # fill in real values
pnpm install
pnpm run build
pnpm start   # runs on http://localhost:3000

# Frontend (from revamp/frontend/)
npm run dev   # runs on http://localhost:5173

# Sync content from Payload API to JSON snapshots
cd revamp && node revamp/scripts/sync-payload.mjs

# Build frontend for production
cd revamp/frontend && npm run build
```

## Rollback Procedure

### Backend (Docker/Dokploy)

1. Find previous image digest:
   ```bash
   docker pull simplyenak/website-backend:production
   # Or use a pinned SHA tag: simplyenak/website-backend:production-{sha}
   ```
2. In Dokploy dashboard → manually specify the previous image tag
3. Or re-run `promote-to-production.yml` with a specific commit SHA

### Frontend (Cloudflare Pages)

1. Go to CF dashboard → Workers & Pages → `production` project
2. Find last known good deployment
3. Click "Rollback to this deploy"