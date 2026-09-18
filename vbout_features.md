# Vbout Email Marketing - Complete Feature List

## Account Info
- **Account**: Happiness Dojo / universe-in-you
- **Package**: License Tier 2 (Paid)
- **Timezone**: Asia/Kuala_Lumpur
- **API Key**: `2126286030036220618380215`

## Email Marketing (Working)

### Lists
| List ID | Name | Domain |
|---------|------|--------|
| 193083 | WTM Subscribers | whattoeatinmalaysia.com |
| 193084 | WCIEIM Subscribers | whatcanieatinmy.com |
| 193085 | Durian Subscribers | whenisdurianseason.com |
| 193086 | CTE Subscribers | culinarytravelexperts.com |

### Contacts
- Add contact: ✅ `emailmarketing/addcontact.json`
- Get contacts: ✅ `emailmarketing/getcontacts.json`
- Delete contact: ✅ `emailmarketing/deletecontact.json`
- Edit contact: ✅ `emailmarketing/editcontact.json`
- Sync contact: ✅ `emailmarketing/synccontact.json`

### Campaigns
- List campaigns: ✅ `emailmarketing/campaigns/get.json`
- Get campaign: ✅ `emailmarketing/getcampaign.json`
- Add campaign: ⚠️ Needs domain verification first
- Edit campaign: ⚠️ Needs domain verification first

### Stats
- Get stats: ✅ `emailmarketing/stats.json?id=LIST_ID`

## Social Media (Working)

### Connected Accounts
- Facebook: 2 pages (Coach Maarten, Happiness Dojo)
- Google Business: 0
- Twitter/X: 0
- LinkedIn: Check list

### Features
- Post to social: ✅ `socialmedia/addpost.json`
- Calendar view: ✅ `socialmedia/calendar.json`
- Edit post: ✅ `socialmedia/editpost.json`
- Delete post: ✅ `socialmedia/deletepost.json`
- Stats: ✅ `socialmedia/stats.json`

## Automation (Available)
- Create automation from guide: ✅ `automation/createautomationfromguide.json`
- Get guides: ⚠️ Needs testing

## Goals (Available)
- List goals: ✅ `goal/lists.json`
- Add goal: ✅ `goal/add.json`
- Edit goal: ✅ `goal/edit.json`
- Delete goal: ✅ `goal/delete.json`

## Settings
- Custom shortcodes: ✅ `settings/customshortcodes.json`
- Add shortcode: ✅ `settings/addcustomshortcode.json`
- Delete shortcode: ✅ `settings/deletecustomshortcode.json`

## AI Features (Available)
- AI chatbot templates: ✅ `ai/chatbot/templates.json`
- AI categories: ✅ `ai/categories.json`
- AI tags: ✅ `ai/tags.json`
- AI copy generation: ✅ `ai/copy.json`

## Webhooks
- List webhooks: ⚠️ Needs ID
- Add webhook: ✅ `webhook/add.json`
- Edit webhook: ✅ `webhook/edit.json`
- Delete webhook: ✅ `webhook/delete.json`

## ❌ Not Working via API

### Domain Sender Verification
- **Endpoint**: `domain/add.json`
- **Error**: errorCode 1000
- **Solution**: Manual UI setup required

## Setup Required

### 1. Domain Sender Verification (Manual)
Go to https://app.vbout.com/Settings → Domain Sender Verification
Add each domain and complete DNS verification.

### 2. Connect Social Media
Link Twitter/X and LinkedIn accounts for social posting.

## Integration Scripts
- `vbout_integration.py` - Main integration script
- `vbout_setup.md` - Setup documentation

## Next Steps
1. Add domains in Vbout UI (manual)
2. Once verified, create email campaigns
3. Connect social media accounts
4. Set up webhooks for sync automation
5. Integrate with wtm-access waitlist
