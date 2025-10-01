# Staging Environment Setup Guide

This guide will help you set up automatic staging/preview deployments for simplyenak.com using Cloudflare Pages.

## Overview

Once configured, you'll get:
- ✅ **Production:** `simplyenak.com` (main branch)
- ✅ **Preview:** Automatic preview URLs for every branch/PR
- ✅ **Performance Testing:** Direct PageSpeed Insights links in PR comments

## Step 1: Create Cloudflare Pages Project

### Option A: Using Cloudflare Dashboard (Recommended)

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Select your account

2. **Create Pages Project**
   - Click "Workers & Pages" in the sidebar
   - Click "Create application" → "Pages" → "Connect to Git"
   - Select your GitHub account and repository: `simplyenak/website`
   - Click "Begin setup"

3. **Configure Build Settings**
   ```
   Project name: simplyenak-website
   Production branch: main
   Build command: cd frontend && npm run build
   Build output directory: frontend/dist
   Root directory: /
   ```

4. **Add Environment Variables**
   - Click "Environment variables"
   - Add: `PUBLIC_STRAPI_URL` = `https://your-strapi-backend-url.com`
   - Click "Save and Deploy"

5. **Get Your Account ID**
   - In Cloudflare Dashboard, click on "Pages" project
   - The URL will be: `https://dash.cloudflare.com/<ACCOUNT_ID>/pages/...`
   - Copy the Account ID (it's a hex string like `a1b2c3d4e5f6...`)

### Option B: Using Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create Pages project
wrangler pages project create simplyenak-website

# Deploy manually for first time
cd frontend
npm run build
wrangler pages deploy dist --project-name=simplyenak-website
```

## Step 2: Create Cloudflare API Token

1. **Go to API Tokens Page**
   - https://dash.cloudflare.com/profile/api-tokens
   - Click "Create Token"

2. **Use "Edit Cloudflare Workers" Template**
   - Click "Use template" next to "Edit Cloudflare Workers"

3. **Configure Token Permissions**
   ```
   Account Resources:
   - Account → Cloudflare Pages → Edit

   Zone Resources:
   - All zones → Workers Scripts → Edit
   ```

4. **Create and Copy Token**
   - Click "Continue to summary"
   - Click "Create Token"
   - **⚠️ IMPORTANT:** Copy the token immediately (you won't see it again!)

## Step 3: Add GitHub Secrets

1. **Go to GitHub Repository Settings**
   - Navigate to: https://github.com/simplyenak/website/settings/secrets/actions

2. **Add Repository Secrets** (Click "New repository secret" for each):

   | Secret Name | Value | Where to Find |
   |-------------|-------|---------------|
   | `CLOUDFLARE_API_TOKEN` | Your API token from Step 2 | Cloudflare Dashboard → Profile → API Tokens |
   | `CLOUDFLARE_ACCOUNT_ID` | Your account ID | Cloudflare Dashboard URL or from Step 1 |
   | `STRAPI_URL` | Your Strapi backend URL | Your backend deployment URL |

   **Example values:**
   ```
   CLOUDFLARE_API_TOKEN: abc123def456ghi789...
   CLOUDFLARE_ACCOUNT_ID: a1b2c3d4e5f6g7h8i9j0
   STRAPI_URL: https://api.simplyenak.com
   ```

## Step 4: Enable GitHub Actions Workflow

The workflow file `.github/workflows/cloudflare-pages.yml` has been created and is ready to use.

**Commit and push it:**
```bash
git add .github/workflows/cloudflare-pages.yml STAGING-SETUP.md
git commit -m "ci: Add Cloudflare Pages deployment workflow"
git push origin perf/week1-quick-wins
```

## Step 5: Test the Setup

### Automatic Preview Deployment

1. **Push to your feature branch** (like `perf/week1-quick-wins`)
   - GitHub Actions will automatically build and deploy
   - Check progress: https://github.com/simplyenak/website/actions

2. **Preview URL will be:**
   ```
   https://<branch-name>.simplyenak-website.pages.dev

   Example:
   https://perf-week1-quick-wins.simplyenak-website.pages.dev
   ```

3. **Create a Pull Request**
   - A bot will comment with the preview URL
   - The comment will include a PageSpeed Insights link
   - Preview updates automatically with new commits

### Manual Deployment (Optional)

```bash
cd frontend
npm run build
npx wrangler pages deploy dist --project-name=simplyenak-website --branch=staging
```

## How It Works

### Production Deployments
- Triggered by: Push to `main` branch
- Deploys to: `simplyenak.com`
- Automatic: Yes

### Preview Deployments
- Triggered by: Any push to feature branches or PRs
- Deploys to: `https://<branch-name>.simplyenak-website.pages.dev`
- Automatic: Yes
- Lifetime: Until branch is deleted

### Branch Patterns
The workflow deploys these branches automatically:
- `main` → Production
- `perf/**` → Preview (all performance optimization branches)
- Any PR to `main` → Preview

## Deployment URLs

Once deployed, you'll get these URLs:

```bash
# Production
https://simplyenak.com

# Preview for PR #5
https://pr-5.simplyenak-website.pages.dev

# Preview for perf/week1-quick-wins branch
https://perf-week1-quick-wins.simplyenak-website.pages.dev
```

## Testing Performance Improvements

After deployment, test with PageSpeed Insights:

```bash
# Production
https://pagespeed.web.dev/analysis/https-simplyenak-com/

# Staging/Preview
https://pagespeed.web.dev/analysis/https-perf-week1-quick-wins-simplyenak-website-pages-dev/
```

## Troubleshooting

### Build Fails with "Cannot find module"
- **Fix:** Make sure `npm ci` is running in the correct directory
- Check the workflow runs: `cd frontend && npm ci`

### Build Fails with "Failed to fetch from Strapi"
- **Fix:** Add `STRAPI_URL` to Cloudflare Pages environment variables
- Or: Add `PUBLIC_STRAPI_URL` as a GitHub secret

### Preview URL Returns 404
- **Fix:** Wait 1-2 minutes after deployment
- Check Cloudflare Pages dashboard for deployment status
- Verify the branch name matches the URL (hyphens replace slashes)

### API Token Doesn't Work
- **Fix:** Make sure token has "Cloudflare Pages - Edit" permission
- Regenerate token and update GitHub secret

## Alternative: Cloudflare Pages Direct Integration

If you prefer not to use GitHub Actions:

1. **Connect GitHub Directly**
   - In Cloudflare Dashboard → Pages → Create project
   - Select "Connect to Git"
   - Authorize GitHub
   - Select `simplyenak/website` repository

2. **Configure Build**
   ```
   Framework preset: Astro
   Build command: cd frontend && npm run build
   Build output directory: frontend/dist
   ```

3. **Automatic Deployments**
   - Every push to `main` → Production
   - Every PR → Preview comment with URL

**Pros:**
- Simpler setup (no GitHub secrets needed)
- Faster deployments (runs on Cloudflare infrastructure)
- Built-in rollback UI

**Cons:**
- Less control over build process
- Can't customize deployment logic

## Cost

Cloudflare Pages is **FREE** for:
- Unlimited requests
- Unlimited bandwidth
- 500 builds per month
- Automatic preview deployments

Perfect for your use case! 🎉

## Next Steps

Once staging is set up:
1. ✅ Deploy `perf/week1-quick-wins` branch
2. ✅ Get preview URL
3. ✅ Run PageSpeed Insights on preview
4. ✅ Compare before/after scores
5. ✅ Merge to main if performance improves

---

**Need Help?**
- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- GitHub Actions Docs: https://docs.github.com/en/actions
- Contact support if you get stuck!
