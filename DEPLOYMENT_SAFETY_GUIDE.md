# Simply Enak - Deployment Safety Guide

## 🚨 **What Went Wrong (October 2025)**

### The Incident
- Staging code (hero redesign) was accidentally deployed to production
- Main branch contained experimental features that shouldn't have been live
- Site served with missing CSS files, causing 99% traffic drop
- Google Analytics showed almost no traffic for 5+ days

### Root Causes
1. No separation between staging and production branches
2. No validation before deployment
3. Manual deployment process prone to human error
4. No confirmation step for production deploys

---

## ✅ **New Safety System (Implemented)**

### 1. Automated Validation Script
**File**: `validate-deployment.sh`

Checks before each production deployment:
- ✓ Ensures you're on the `main` branch
- ✓ No uncommitted changes
- ✓ No staging-related commits in recent history
- ✓ Hero section doesn't contain redesign code
- ✓ Package.json exists
- **Requires typing "DEPLOY" to confirm**

### 2. Safe Deployment Scripts

#### For Production:
```bash
./safe-deploy-production.sh
```

What it does:
1. Runs all validation checks
2. Builds fresh production assets
3. Deploys to `main` branch only
4. Provides verification checklist

#### For Staging:
```bash
./deploy-staging-safe.sh
```

What it does:
1. Prevents deployment from `main` branch
2. Confirms branch before deploying
3. Deploys to preview environment
4. Reminds you this is NOT production

---

## 📋 **Deployment Workflow**

### **Development → Staging → Production**

```
┌─────────────────┐
│  Development    │  Work on feature branches
│  (local)        │  - staging-kl-page
└────────┬────────┘  - feature-xyz
         │
         ↓
┌─────────────────┐
│  Staging        │  ./deploy-staging-safe.sh
│  (preview)      │  - Test changes
└────────┬────────┘  - Verify functionality
         │
         ↓
┌─────────────────┐
│  Code Review    │  - Review changes
│  (GitHub PR)    │  - Get approval
└────────┬────────┘  - Merge to main
         │
         ↓
┌─────────────────┐
│  Production     │  ./safe-deploy-production.sh
│  (main branch)  │  - Validates automatically
└─────────────────┘  - Requires confirmation
```

---

## 🛡️ **Branch Protection (Recommended - Manual Setup)**

### GitHub Branch Protection Rules for `main`

Go to: **GitHub → Settings → Branches → Add rule**

**Protect branch**: `main`

✅ Enable:
- **Require pull request reviews before merging** (at least 1 approval)
- **Require status checks to pass before merging**
- **Require conversation resolution before merging**
- **Do not allow bypassing the above settings**

This prevents:
- Direct pushes to `main` without review
- Accidental force pushes
- Staging code merging without approval

---

## 🎯 **Branch Strategy**

### Branch Purposes

| Branch | Purpose | Auto-Deploy? |
|--------|---------|--------------|
| `main` | **Production only** | ✅ Yes (via safe script) |
| `staging-kl-page` | Staging/preview | ✅ Yes (preview URL) |
| `feature-*` | Feature development | ❌ No |
| `development` | Integration testing | 🟡 Optional |

### Rules

1. **NEVER commit directly to `main`**
2. **NEVER force push to `main`**
3. **ALWAYS** work on feature branches
4. **ALWAYS** test on staging first
5. **ALWAYS** use `./safe-deploy-production.sh` for production

---

## 🚀 **Step-by-Step: Safe Production Deployment**

### Before You Start
- [ ] All changes tested on staging
- [ ] No urgent bugs reported
- [ ] Team notified of deployment

### Deployment Steps

1. **Ensure you're on main branch with latest code**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Run the safe deployment script**
   ```bash
   ./safe-deploy-production.sh
   ```

3. **The script will:**
   - ✓ Run validation checks
   - ✓ Build production assets
   - ✓ Ask for confirmation (type "DEPLOY")
   - ✓ Deploy to Cloudflare Pages

4. **Verify the deployment**
   - Wait 2-3 minutes
   - Visit https://simplyenak.com/
   - Hard refresh browser (Ctrl+Shift+R)
   - Check hero section shows correct content
   - Verify no CSS loading issues
   - Check mobile view

5. **Monitor**
   - Google Analytics real-time (traffic should appear)
   - Check for error reports
   - Monitor for 30 minutes

### If Something Goes Wrong

**Immediate Rollback:**
```bash
# Find last good commit
git log --oneline

# Reset to that commit
git reset --hard <commit-hash>

# Force push (THIS IS THE ONLY TIME FORCE PUSH IS OK)
git push origin main --force

# Redeploy
./safe-deploy-production.sh
```

---

## 🧪 **Step-by-Step: Staging Deployment**

1. **Switch to staging branch**
   ```bash
   git checkout staging-kl-page
   # or your feature branch
   ```

2. **Deploy to staging**
   ```bash
   ./deploy-staging-safe.sh
   ```

3. **Test on preview URL**
   - Deployment will show URL: `https://[hash].website-40z.pages.dev`
   - Test all changes thoroughly
   - Share with team for review

4. **Once approved → merge to main**
   ```bash
   git checkout main
   git pull origin main
   git merge staging-kl-page
   git push origin main
   ```

5. **Deploy to production** (see above)

---

## ⚠️ **Red Flags - STOP and Check**

If you see any of these, **DO NOT DEPLOY**:

❌ Script mentions "staging commits in recent history"
❌ Hero section contains "Food Tours that Reveal" or "highlight-text"
❌ Uncommitted changes in working directory
❌ You're not on the `main` branch
❌ Recent commit messages say "WIP", "test", "staging"
❌ CSS files missing from build output
❌ Build has warnings about missing dependencies

---

## 📊 **Monitoring After Deployment**

### Immediate (0-30 minutes)
- ✅ Site loads correctly
- ✅ CSS and images load
- ✅ Hero section shows production content
- ✅ No console errors (F12 → Console)

### Short-term (1-24 hours)
- ✅ Google Analytics shows traffic
- ✅ No error spike in Cloudflare
- ✅ Mobile site works correctly

### Medium-term (1-7 days)
- ✅ Traffic back to normal levels (40-65 pageviews/day)
- ✅ Google Search Console impressions converting to clicks
- ✅ No user-reported issues

---

## 🔧 **Troubleshooting**

### "Validation failed: Staging commits detected"
**Fix**: Check recent commits with `git log -5`. If staging work is present, don't deploy. Work on a different branch.

### "Build failed during deployment"
**Fix**: Run `npm run build` locally first. Fix any errors before deploying.

### "Site shows old content after deployment"
**Fix**:
1. Clear Cloudflare cache (done automatically)
2. Hard refresh browser (Ctrl+Shift+R)
3. Wait 5 minutes for propagation

### "CSS files not loading"
**Fix**:
1. Check dist folder has CSS files: `ls frontend/dist/_astro/*.css`
2. Rebuild: `cd frontend && rm -rf dist && npm run build`
3. Redeploy

---

## 📝 **Checklist Before ANY Production Deployment**

Print this and keep it visible:

- [ ] I am on the `main` branch
- [ ] I have pulled the latest changes
- [ ] Changes have been tested on staging
- [ ] No team member has reported urgent bugs
- [ ] I am using `./safe-deploy-production.sh` script
- [ ] I have time to monitor for 30 minutes after deployment
- [ ] I know how to rollback if needed
- [ ] Google Analytics is accessible to verify traffic

---

## 🆘 **Emergency Contacts**

### If Deployment Goes Wrong

1. **Rollback immediately** (see rollback instructions above)
2. **Check status page**: https://www.cloudflarestatus.com/
3. **Review Cloudflare deployment logs**

### Support Resources
- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- GitHub Support: https://support.github.com/
- Wrangler CLI Docs: https://developers.cloudflare.com/workers/wrangler/

---

## 📅 **Created**: October 9, 2025
## 📅 **Last Updated**: October 9, 2025
## 👤 **Owner**: Simply Enak Development Team

**Remember**: It's better to delay a deployment than to break production. When in doubt, test again on staging!
