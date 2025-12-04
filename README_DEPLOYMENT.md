# Simply Enak - Deployment System

## 📚 Documentation Overview

This directory now contains a comprehensive deployment safety system to prevent the October 2025 incident from happening again.

---

## 🎯 Start Here

### New to Deployments?
1. Read: [`DEPLOYMENT_QUICK_REFERENCE.md`](DEPLOYMENT_QUICK_REFERENCE.md) (2 min)
2. Read: [`DEPLOYMENT_SAFETY_GUIDE.md`](DEPLOYMENT_SAFETY_GUIDE.md) (15 min)
3. Setup: [`SETUP_BRANCH_PROTECTION.md`](SETUP_BRANCH_PROTECTION.md) (5 min)

### Ready to Deploy?
**Staging**: Run `./deploy-staging-safe.sh`
**Production**: Run `./safe-deploy-production.sh`

---

## 📋 Files in This System

### Deployment Scripts (Automated)
- ✅ `validate-deployment.sh` - Pre-deployment validation checks
- ✅ `safe-deploy-production.sh` - Safe production deployment with validation
- ✅ `deploy-staging-safe.sh` - Staging deployment with safety checks

### Documentation
- 📖 `DEPLOYMENT_SAFETY_GUIDE.md` - Complete deployment procedures (detailed)
- 📖 `DEPLOYMENT_QUICK_REFERENCE.md` - Quick command reference (quick lookup)
- 📖 `SETUP_BRANCH_PROTECTION.md` - GitHub branch protection setup
- 📖 `README_DEPLOYMENT.md` - This file (overview)

---

## 🚀 Quick Start Commands

### For Staging/Preview Deployments:
```bash
# Switch to your feature branch
git checkout staging-kl-page

# Deploy to preview
./deploy-staging-safe.sh
```

### For Production Deployments:
```bash
# Ensure on main with latest code
git checkout main
git pull origin main

# Deploy to production (with automatic validation)
./safe-deploy-production.sh
```

---

## 🛡️ Safety Features

### 1. Automated Validation
- ✅ Branch verification (must be on `main` for production)
- ✅ Clean working directory check
- ✅ Staging commit detection
- ✅ Hero section content verification
- ✅ Manual confirmation required ("DEPLOY")

### 2. Separate Environments
- **Production**: `main` branch → https://simplyenak.com/
- **Staging**: `staging-kl-page` → Preview URLs
- **Feature branches**: Your branches → Preview URLs

### 3. Documentation
- Step-by-step procedures
- Emergency rollback instructions
- Troubleshooting guides
- Checklists for safety

### 4. Branch Protection (Manual Setup Required)
- See: `SETUP_BRANCH_PROTECTION.md`
- Prevents direct pushes to `main`
- Requires PR reviews before merging
- **Action needed**: Set this up on GitHub

---

## ⚠️ What NOT to Do

❌ **NEVER** run manual deployments without the safe scripts
❌ **NEVER** force push to `main` (except emergencies)
❌ **NEVER** deploy directly from staging branches to production
❌ **NEVER** skip validation checks
❌ **NEVER** deploy without testing on staging first

---

## ✅ What TO Do

✅ **ALWAYS** use `./safe-deploy-production.sh` for production
✅ **ALWAYS** test on staging first
✅ **ALWAYS** verify deployment after it completes
✅ **ALWAYS** monitor Google Analytics after production deploys
✅ **ALWAYS** have 30 minutes to monitor after deployment

---

## 🆘 Emergency Procedures

### If Production Breaks:

1. **Immediate rollback**:
   ```bash
   git reset --hard <last-good-commit>
   git push origin main --force
   ./safe-deploy-production.sh
   ```

2. **Verify rollback worked**:
   - Visit https://simplyenak.com/
   - Check hero shows: "CULINARY EXPERIENCES FROM THE HEART"
   - Verify CSS loads properly

3. **Investigate**:
   - Review recent commits: `git log -10`
   - Check deployment logs in Cloudflare
   - Review what went wrong

---

## 📊 Monitoring After Deployment

### Immediate (0-10 minutes)
- ✅ Site loads at https://simplyenak.com/
- ✅ Hero section shows correct content
- ✅ CSS files load (no missing styles)
- ✅ Images display properly
- ✅ Mobile view works

### Short-term (1-24 hours)
- ✅ Google Analytics shows traffic
- ✅ No error spike in Cloudflare
- ✅ Search Console no new errors

### Medium-term (1-7 days)
- ✅ Traffic at normal levels (40-65 pageviews/day)
- ✅ Conversion rates stable
- ✅ No user complaints

---

## 🔧 Maintenance

### Monthly Tasks
- [ ] Review deployment logs
- [ ] Update documentation if workflow changes
- [ ] Test rollback procedure
- [ ] Verify branch protection still enabled

### After Major Changes
- [ ] Update validation script if needed
- [ ] Document new deployment risks
- [ ] Train team on new procedures

---

## 📞 Support

### Resources
- **Cloudflare Pages**: https://developers.cloudflare.com/pages/
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler/
- **GitHub Protection**: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches

### Team Contact
- Questions about deployment? Review this documentation
- Emergency? See emergency procedures above
- Suggestions? Update the relevant `.md` file

---

## 🎓 Learning from October 2025

**What happened**: Staging code deployed to production, site broke, 99% traffic loss

**Why it happened**:
- No validation before deployment
- No separation between staging/production
- Manual process prone to error
- No confirmation step

**How we fixed it**:
- ✅ Automated validation scripts
- ✅ Separate deployment commands
- ✅ Confirmation requirements
- ✅ Comprehensive documentation
- ✅ Branch protection recommendations

**Result**: This incident led to a much safer deployment system!

---

## 📅 Version History

- **v1.0** - October 9, 2025 - Initial deployment safety system
  - Created after October 2025 production incident
  - All safety scripts implemented
  - Complete documentation written

---

**Remember**: *A safe deployment is better than a fast deployment.*

When in doubt, test again on staging!
