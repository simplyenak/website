# Vbout Email Marketing Setup Complete

## What's Configured ✅

### WTM Subscribers List (ID: 193083)
- **From email**: noreply@whattoeatinmalaysia.com
- **From name**: What To Eat Malaysia
- **Reply-to**: noreply@whattoeatinmalaysia.com
- **Success message**: "Thanks for joining! You're now on the list. We'll keep you updated on the best dishes and experiences."

### Subscribers (6 total)
| Email | Source |
|-------|--------|
| mfvanrijn@gmail.com | coming-soon |
| test@example.com | manual |
| test-check-2026@simplyenak.com | connectivity-check |
| test-coming-soon@simplyenak.com | coming-soon-verify |
| waitlist-test@simplyenak.com | deploy-test |
| test@test.com | test |

### DNS Records (whattoeatinmalaysia.com)
- ✅ SPF: `v=spf1 include:mxroute.com include:sparkpostmail.com -all`
- ✅ DKIM: `scph092._domainkey.whattoeatinmalaysia.com`
- ✅ DKIM: `scph0926._domainkey.bounce.whattoeatinmalaysia.com`
- ✅ CNAME: `bounce.whattoeatinmalaysia.com` → `sparkpostmail.com`
- ✅ DMARC: 2 records

## Manual Steps Required in Vbout UI

1. **Enable Double Opt-in** (recommended for better deliverability)
   - Go to https://app.vbout.com/Lists
   - Click "WTM Subscribers" → Edit
   - Check "Double Opt-in"

2. **Set Email Subject**
   - Same page, set "Email Subject" field
   - Suggested: "🍜 Welcome to What To Eat Malaysia!"

3. **Test Domain Verification**
   - Go to Settings → Domain Sender Verification
   - Click "Test" for whattoeatinmalaysia.com

## Next Steps

1. Create signup form in Vbout UI
2. Add form embed code to WTM site
3. Connect to wtm-access backend for automatic sync
