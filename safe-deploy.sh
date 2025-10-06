#!/bin/bash

# Safe deployment script that checks for uncommitted work
# Usage: ./safe-deploy.sh "commit message"

if [ -z "$1" ]; then
    echo "❌ Error: Please provide a commit message"
    echo "   Usage: ./safe-deploy.sh \"Your commit message\""
    exit 1
fi

COMMIT_MSG="$1"
echo "🚀 Starting safe deployment process..."

# 1. Check for uncommitted changes
UNCOMMITTED=$(git status --porcelain | wc -l)
if [ $UNCOMMITTED -gt 0 ]; then
    echo "⚠️  Found $UNCOMMITTED uncommitted changes:"
    git status --porcelain | sed 's/^/   /'
    echo ""
    echo "❌ CANNOT DEPLOY: Please commit or stash your changes first!"
    echo ""
    echo "Options:"
    echo "1. Commit changes: git add . && git commit -m \"$COMMIT_MSG\""
    echo "2. Stash changes: git stash push -m \"temp stash\""
    echo "3. Run backup first: ./backup-work.sh"
    exit 1
fi

# 2. Create backup before deployment
echo "📦 Creating pre-deployment backup..."
./backup-work.sh

# 3. Confirm deployment
echo ""
echo "📋 Deployment Summary:"
echo "   Commit message: $COMMIT_MSG"
echo "   Current branch: $(git branch --show-current)"
echo "   Latest commit: $(git log -1 --oneline)"
echo ""
read -p "🔄 Proceed with deployment? (y/N): " confirm

if [[ $confirm != [yY] ]]; then
    echo "❌ Deployment cancelled."
    exit 1
fi

# 4. Run deployment
echo "🚀 Deploying to Cloudflare..."
cd frontend
export CLOUDFLARE_API_TOKEN="***REMOVED***"
export CLOUDFLARE_ACCOUNT_ID="464881de51ec2f03bea6104e467bf3fb"

if wrangler pages deploy dist --project-name staging --branch staging-kl-page --commit-message="$COMMIT_MSG" --commit-dirty=true; then
    echo "✅ Deployment successful!"
    echo "🌐 Check your site at: https://staging-kl-page.staging-5zf.pages.dev"
else
    echo "❌ Deployment failed!"
    echo "💡 Your work is safe - we created a backup before deployment"
    exit 1
fi

echo "🎉 Safe deployment completed!"