# CI/CD Pipeline — Simply Enak Payload CMS

## Architecture

Since staging and production run on the **same server** (`45.136.28.238:4040`), the pipeline uses the same SSH credentials and Dokploy instance. The distinction is in the Docker image tags and which Dokploy compose is active.

```
Developer push to main
  │
  ├──► GitHub Actions: staging.yml (auto)
  │      ├── Build Docker image (multi-stage, pnpm)
  │      ├── Tag: simplyenak/website-backend:staging + :staging-{sha}
  │      ├── Push to Docker Hub
  │      └── SSH → pull :staging-{sha} → redeploy via Dokploy
  │
  └──► Manual trigger: promote-to-production.yml (workflow_dispatch)
         ├── Confirm input: type "deploy"
         ├── Build Docker image
         ├── Tag: :production + :production-{sha} + :latest
         ├── Push to Docker Hub
         └── SSH → pull :production-{sha} → redeploy via Dokploy
```

## Dockerfile

**Location:** `revamp/backend/Dockerfile`

- Multi-stage build (deps → build → runner) for minimal image size (~150MB vs ~1GB for full Node)
- Uses **pnpm** (matches your pnpm-lock.yaml)
- Runs as non-root `nextjs` user for security
- Expects `output: 'standalone'` (configured in `next.config.mjs`)
- Built-in health check
- GitHub Actions layer caching for fast rebuilds (~30s on cache hit)

## Image Tags

| Tag | Purpose | Updated By |
|-----|---------|------------|
| `:staging` | Latest staging build | `staging.yml` on every push to main |
| `:staging-{sha}` | Pinned staging build | `staging.yml` on every push |
| `:production` | Current production (what Dokploy runs) | `promote-to-production.yml` |
| `:production-{sha}` | Pinned production build (for rollback) | `promote-to-production.yml` |
| `:latest` | Fallback / most recent production build | `promote-to-production.yml` |

## Required GitHub Secrets (revamp repo)

| Secret | Value | Status |
|--------|-------|--------|
| `DOCKERHUB_USERNAME` | `simplyenak` | ⚠️ Needs to be added |
| `DOCKERHUB_TOKEN` | Your PAT | ⚠️ Needs to be added |
| `SERVER_HOST` | `45.136.28.238` | ⚠️ Needs to be added |
| `SERVER_USER` | SSH username | ⚠️ Needs to be added |
| `SERVER_SSH_KEY` | SSH private key | ⚠️ Needs to be added |

## Dokploy Setup

Dokploy is at `45.136.28.238:4040` and manages the `simplyenak-backend` stack at:
```
/etc/dokploy/compose/simplyenak-backend-7x9k2m/code/docker-compose.yml
```

The compose file uses `simplyenak/website-backend:production` as the image. The GitHub Actions workflows update this tag and redeploy via SSH.

**Environment variables** must be set in Dokploy's stack config (or in the compose file):

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgres://payload:{DB_PASSWORD}@payload-postgres:5432/payload_production` |
| `PAYLOAD_SECRET` | Generate: `openssl rand -hex 32` |
| `PAYLOAD_DB_PASSWORD` | Your production DB password |
| `S3_ACCESS_KEY_ID` | `***REMOVED***` |
| `S3_SECRET_ACCESS_KEY` | From Scaleway console |
| `S3_BUCKET` | `se-website-images` |
| `S3_REGION` | `nl-ams` |
| `S3_ENDPOINT` | `https://s3.nl-ams.scw.cloud` |

## Local Development

```bash
cd /var/home/maarten/website-optimization/revamp/backend
cp .env.example .env   # fill in real values
pnpm install
pnpm run build
pnpm start   # http://localhost:3000
```

## Rollback

```bash
# Option 1: Re-run workflow with specific commit SHA
gh workflow run "promote-to-production.yml" -f commit_sha="abc1234"

# Option 2: SSH into server and manually pull previous tag
ssh maarten@45.136.28.238 -p 4040
docker pull simplyenak/website-backend:production-{sha}
cd /etc/dokploy/compose/simplyenak-backend-7x9k2m/code
sed -i 's|simplyenak/website-backend:.*|simplyenak/website-backend:production-{sha}|' docker-compose.yml
docker stack deploy -c docker-compose.yml simplyenak-backend --with-registry-auth
```