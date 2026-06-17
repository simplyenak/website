# Simply Enak SEO Setup — Qwen Code Version

**Created:** March 3, 2026  
**Status:** ✅ Qwen-Compatible (not Claude!)  
**Next Run:** June 1, 2026

---

## 🎯 What You Have Now

### SEO Strategy Documents

All in `/var/home/maarten/website-optimization/revamp/docs/seo/`:

| Document | Purpose |
|----------|---------|
| **COMPLETE-SETUP-SUMMARY.md** | 📖 Start here! Overview of everything |
| **SEO-STRATEGY-CORRECTED.md** | 📋 Fact-checked strategy (based on claude-brain data) |
| **SEO-DATA-COLLECTION.md** | 📊 How to pull data manually |
| **SEO-QWEN-SETUP.md** | 🤖 Qwen Code integration guide |
| **COMPETITIVE-ANALYSIS-2026.md** | 🏆 8 competitors analyzed |
| **KEYWORD-RESEARCH-2026.md** | 🔍 147 keywords with volumes |
| **GEO-OPTIMIZATION-AI-SEARCH.md** | 🤖 AI search optimization |
| **META-TAGS-OPTIMIZATION.md** | 📝 Optimized titles/descriptions |
| **README-IMPLEMENTATION.md** | ✅ Week-by-week checklist |

### Automation Scripts

All in `/var/home/maarten/website-optimization/claude-brain/sync/`:

| File | Purpose |
|------|---------|
| **seo-quarterly-report.py** | 🐍 Automated quarterly data collection |
| **SEO-QWEN-SETUP.md** | 📖 Qwen-specific setup guide |
| **seo-mcp-config.json** | ❌ Claude-specific (ignore this) |

### Qwen Skills

Installed in `/var/home/maarten/website-optimization/.qwen/skills/`:

| Skill | Purpose |
|-------|---------|
| **seo-data-collection** | Pull SEO data on command |
| **frontend-design** | Create beautiful UIs |
| **xlsx** | Excel file handling |
| **docx** | Word document handling |
| **pdf** | PDF processing |
| **seo-geo** | AI search optimization |
| **seo-master** | Combined SEO workflow |
| *(and more...)* | |

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Download Google API Keys

**GA4 Key:**
```
https://console.cloud.google.com/iam-admin/serviceaccounts
Project: corded-racer-472513-u4
Download JSON → Save to ~/.google/credentials/ga4-key.json
```

**GSC Key:**
```
https://console.cloud.google.com/iam-admin/serviceaccounts
Project: se-n8n
Download JSON → Save to ~/.google/credentials/gsc-key.json
```

### Step 2: Install Python Dependencies

```bash
pip3 install google-analytics-data google-api-python-client
```

### Step 3: Test the Script

```bash
cd /var/home/maarten/website-optimization/claude-brain/sync
python3 seo-quarterly-report.py
```

### Step 4: Use with Qwen Code

Just tell Qwen:

```
Run the SEO quarterly report
```

Or:

```
Check our website traffic and keyword rankings
```

---

## 📅 Quarterly Schedule

| Quarter | Data Period | Run Date |
|---------|-------------|----------|
| Q1 2026 | Jan 1 - Mar 31 | April 1, 2026 |
| Q2 2026 | Apr 1 - Jun 30 | July 1, 2026 |
| Q3 2026 | Jul 1 - Sep 30 | October 1, 2026 |
| Q4 2026 | Oct 1 - Dec 31 | January 1, 2027 |

**Next Run:** June 1, 2026

---

## 📊 What Gets Collected

### Google Analytics 4
- Total sessions
- Page views
- Engagement rate
- Conversions (bookings)
- Top pages by traffic

### Google Search Console
- Total clicks
- Total impressions
- Average CTR
- Average position
- Top keywords
- Top pages

### Cloudflare
- Total requests
- Bandwidth used
- Cache hit rate
- Threats blocked

---

## 📁 Output Files

Reports saved to:
```
/var/home/maarten/website-optimization/revamp/docs/seo/reports/
├── ga4-data-2026-06.json       # GA4 raw data
├── gsc-data-2026-06.json       # GSC raw data
└── seo-report-2026-06.md       # Human-readable summary
```

---

## ✅ What's Different from Claude

| Feature | Claude MCP | Qwen Code |
|---------|------------|-----------|
| **Plugin System** | MCP servers | Skills (SKILL.md files) |
| **Config Location** | `~/.claude.json` | `~/.qwen/skills/` |
| **Execution** | MCP protocol | Direct Python scripts |
| **Setup Complexity** | Medium (MCP config) | Simple (just run script) |

**Qwen Advantage:** Simpler! Just run the Python script directly. No MCP config needed.

---

## 📋 Your Action Items

### This Week
- [ ] Download GA4 service account key
- [ ] Download GSC service account key
- [ ] Install Python dependencies
- [ ] Test the script

### Next Week
- [ ] Update homepage meta tags (see META-TAGS-OPTIMIZATION.md)
- [ ] Add LocalBusiness schema (see schema-localbusiness.json)
- [ ] Check keyword rankings manually

### Ongoing
- [ ] Run quarterly report (June 1, September 1, December 1, March 1)
- [ ] Review SEO reports
- [ ] Implement recommendations

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Run SEO report | `python3 /var/home/maarten/website-optimization/claude-brain/sync/seo-quarterly-report.py` |
| Check credentials | `ls ~/.google/credentials/` |
| Install dependencies | `pip3 install google-analytics-data google-api-python-client` |
| View reports | `ls /var/home/maarten/website-optimization/revamp/docs/seo/reports/` |
| Qwen skill location | `~/.qwen/skills/seo-data-collection/` |

---

## 🎯 Start Here

1. **Read:** `COMPLETE-SETUP-SUMMARY.md` (overall strategy)
2. **Read:** `SEO-QWEN-SETUP.md` (Qwen-specific setup)
3. **Do:** Download Google API keys (5 minutes)
4. **Do:** Test the script (`python3 seo-quarterly-report.py`)
5. **Done:** Tell Qwen "Run the SEO quarterly report" anytime!

---

**Status:** ⏳ Waiting for credentials download  
**Created:** March 3, 2026  
**Updated:** March 3, 2026 (Qwen-compatible)  
**Next Review:** June 1, 2026

**Remember:** This is Qwen Code, not Claude! No MCP config needed — just run the Python script! 🚀
