# Simply Enak - Deployment Quick Reference Card

## 🎯 **What Script Should I Use?**

### Deploy to STAGING (preview):
```bash
./deploy-staging-safe.sh
```
- Use when: Testing new features
- Deploys to: Preview URL (not production)
- Safe to experiment? ✅ YES

### Deploy to PRODUCTION:
```bash
./safe-deploy-production.sh
```
- Use when: Ready to go live
- Deploys to: simplyenak.com
- Safe to experiment? ❌ NO - Only deploy tested code!

---

## ⚡ **Quick Commands**

### Check Current Branch
```bash
git branch --show-current
```

### Switch to Staging
```bash
git checkout staging-kl-page
```

### Switch to Production
```bash
git checkout main
git pull origin main
```

### Check Recent Commits
```bash
git log --oneline -5
```

### Check Deployment Status
```bash
curl -s https://simplyenak.com/ | grep "CULINARY EXPERIENCES"
```
If you see "CULINARY EXPERIENCES" → ✅ Production is correct
If you see "Food Tours that Reveal" → ❌ Staging code leaked!

---

## 🚨 **Emergency Rollback**

```bash
# 1. Find last good commit
git log --oneline | head -10

# 2. Reset to it (replace COMMIT_HASH)
git reset --hard COMMIT_HASH

# 3. Force push (ONLY in emergencies!)
git push origin main --force

# 4. Redeploy
./safe-deploy-production.sh
```

---

## ✅ **Pre-Flight Checklist**

Before deploying to production:
- [ ] Tested on staging?
- [ ] On `main` branch?
- [ ] Latest code pulled?
- [ ] Using the safe script?
- [ ] Have 30 minutes to monitor?

**If ALL checked → Good to deploy!**

---

## 📞 **When in Doubt**

1. Test on staging first
2. Ask team member to review
3. Delay deployment until certain
4. **NEVER** deploy under pressure

---

**Tape this to your monitor!** 📌
