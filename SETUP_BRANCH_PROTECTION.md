# GitHub Branch Protection Setup for Simply Enak

## Why Branch Protection?

Branch protection prevents accidental pushes to `main` and ensures all production changes are reviewed before deployment.

---

## Setup Instructions

### Step 1: Go to Repository Settings

1. Visit: https://github.com/simplyenak/website/settings/branches
2. Click **"Add rule"** or **"Add branch protection rule"**

### Step 2: Configure Protection Rule

**Branch name pattern**: `main`

**Enable these settings**:

#### Protect matching branches

✅ **Require a pull request before merging**
- Required approvals: **1**
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require review from Code Owners (if you set up CODEOWNERS file)

✅ **Require status checks to pass before merging**
- (If you set up GitHub Actions for automated testing)

✅ **Require conversation resolution before merging**
- Ensures all PR comments are addressed

✅ **Require linear history**
- Prevents merge commits, keeps history clean

✅ **Do not allow bypassing the above settings**
- **Important**: Ensures even admins follow the rules

❌ **Do NOT enable** "Allow force pushes"
- Force pushes should only be used in emergencies

❌ **Do NOT enable** "Allow deletions"
- Prevents accidental branch deletion

### Step 3: Save Changes

Click **"Create"** or **"Save changes"**

---

## What This Prevents

❌ Direct commits to `main` without review
❌ Force pushes to `main` (except in emergencies)
❌ Deleting the `main` branch
❌ Merging PRs with unresolved comments
❌ Accidentally deploying staging code

---

## Workflow After Protection

### Before (risky):
```bash
git checkout main
# Make changes
git commit -m "changes"
git push  # ❌ This will now be blocked!
```

### After (safe):
```bash
# 1. Work on feature branch
git checkout -b feature-my-changes

# 2. Make changes and commit
git commit -m "My changes"
git push origin feature-my-changes

# 3. Create Pull Request on GitHub
# 4. Get review and approval
# 5. Merge PR on GitHub
# 6. Deploy to production
git checkout main
git pull origin main
./safe-deploy-production.sh
```

---

## Emergency Override (Use Sparingly!)

If you MUST bypass protection (production is broken):

1. **Temporarily disable branch protection**:
   - Settings → Branches → Edit rule → Uncheck settings

2. **Fix and push**:
   ```bash
   git push origin main --force
   ```

3. **Re-enable protection immediately**:
   - Settings → Branches → Edit rule → Re-check settings

**Log why you did this**: Document the emergency in a commit message

---

## Additional Optional Protections

### CODEOWNERS File

Create `.github/CODEOWNERS` in your repository:

```
# Require review from these people for production changes
* @yourusername
/frontend/src/components/Home/HeroSection.astro @yourusername @teammember
```

### Status Checks (GitHub Actions)

Create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd frontend && npm install
      - run: cd frontend && npm run build
```

Then enable "Require status checks" and select the build check.

---

## Questions?

- GitHub Docs: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches
- Need help? Review this guide or contact your team

---

**Setup Time**: ~5 minutes
**Protection Level**: High 🛡️
**Recommended**: ✅ YES - Do this today!
