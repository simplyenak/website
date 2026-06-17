# Simply Enak Environment Variables Reference

## Frontend Environment Variables (.env)

These variables are used by the Astro frontend application.

### Required Variables
| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PUBLIC_SITE_URL` | Base URL for the site | `https://simplyenak.com` | Yes |
| `PUBLIC_PAYLOAD_URL` | URL of the Payload CMS backend | `http://localhost:3000` | Yes |
| `PAYLOAD_TOKEN` | Authentication token for Payload CMS (optional for public data) | `jwt-token-here` | No (for draft/private content) |

### Optional Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_FORM_ENDPOINT` | Webhook endpoint for contact form submissions | `https://n8n.system.simplyenak.com/webhook/contact-form` |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key for spam protection | `0x4AAAAAAA...` |
| `PUBLIC_VITE_YOUTUBE_API_KEY` | YouTube Data API key for embedding videos | `AIzaSy...` |
| `PUBLIC_VITE_YOUTUBE_CHANNEL_ID` | YouTube channel ID for tour videos | `UCsW0J_Ip_-I5J9JtYqJ3YQA` |

## Backend Environment Variables (.env)

These variables are used by the Payload CMS backend.

### Required Variables
| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PAYLOAD_SECRET` | Secret used to encrypt cookies and sign JWTs | `32-char-random-string-here` | Yes |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://username:password@localhost:5432/database` | Yes |
| `NEXT_PUBLIC_SERVER_URL` | Public URL of the backend (for email links, etc.) | `https://backend.simplyenak.com` | Yes |

### AWS S3 Storage Variables (if using S3)
| Variable | Description | Example |
|----------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | AWS access key ID | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key | `secret...` |
| `AWS_BUCKET` | S3 bucket name | `simplyenak-media` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `AWS_ENDPOINT` | S3 endpoint (for compatible services) | `https://s3.nl-ams.scw.cloud` |

### Email Configuration Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `SMTP_HOST` | SMTP server hostname | `smtp.sendgrid.net` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USERNAME` | SMTP username | `apikey` |
| `SMTP_PASSWORD` | SMTP password or API key | `SG....` |
| `SMTP_FROM_EMAIL` | Default from email address | `noreply@simplyenak.com` |
| `SMTP_FROM_NAME` | Default from name | `Simply Enak` |

### Optional Variables
| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NEXT_PUBLIC_DISABLE_TELEMETRY` | Disable Next.js telemetry | `false` | `true` |
| `PAYLOAD_MAX_AGE_SECONDS` | Cache control max-age for Payload API | `60` | `300` |
| `SHARP_CONCURRENCY` | Number of concurrent image processing operations | `number of CPU cores` | `4` |

## Environment File Precedence

1. `.env.local` - Local overrides (never commit)
2. `.env.[development\|test\|production]` - Environment-specific
3. `.env` - Shared defaults
4. `process.env` - Actual environment variables

## Development Setup

For local development, copy the example files:
```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

Then update the values as needed for your local environment.

## Validation Script

A validation script can be added to check required variables:
```bash
#!/bin/bash
# scripts/validate-env.sh
REQUIRED_VARS=("PAYLOAD_SECRET" "DATABASE_URL" "NEXT_PUBLIC_SERVER_URL" "PUBLIC_SITE_URL" "PUBLIC_PAYLOAD_URL")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables: ${MISSING_VARS[*]}"
    exit 1
fi

echo "✅ All required environment variables are set"
```
