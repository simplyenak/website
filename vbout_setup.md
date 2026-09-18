# Vbout Email Marketing Setup

## Account Info
- **Account**: Happiness Dojo / universe-in-you
- **API Key**: `2126286030036220618380215`
- **Package**: License Tier 2 (Paid)
- **Timezone**: Asia/Kuala_Lumpur

## Lists Created (via API)

| List ID | Name | Domain | Subscribers |
|---------|------|--------|-------------|
| 193083 | WTM Subscribers | whattoeatinmalaysia.com | 0 |
| 193084 | WCIEIM Subscribers | whatcanieatinmy.com | 0 |
| 193085 | Durian Subscribers | whenisdurianseason.com | 0 |
| 193086 | CTE Subscribers | culinarytravelexperts.com | 0 |

## API Endpoints Working

### ✅ Contact Management
```bash
# Add contact to list
curl -s -X POST "https://api.vbout.com/1/emailmarketing/addcontact.json?key=API_KEY&listid=193083&email=test@test.com&firstname=Test&lastname=User&status=active&format=json"

# Get contacts from list
curl -s "https://api.vbout.com/1/emailmarketing/getcontacts.json?key=API_KEY&listid=193083&format=json"

# Delete contact
curl -s -X DELETE "https://api.vbout.com/1/emailmarketing/deletecontact.json?key=API_KEY&id=CONTACT_ID"
```

### ✅ List Management
```bash
# Get all lists
curl -s "https://api.vbout.com/1/emailmarketing/getlists.json?key=API_KEY&format=json"

# Get single list
curl -s "https://api.vbout.com/1/emailmarketing/getlist.json?key=API_KEY&id=LIST_ID&format=json"
```

### ✅ Account Info
```bash
curl -s "https://api.vbout.com/1/app/me.json?key=API_KEY&format=json"
```

### ✅ Campaigns (Need Domain Verification First)
```bash
# Get campaigns
curl -s "https://api.vbout.com/1/emailmarketing/campaigns/get.json?key=API_KEY&format=json"

# Add campaign (requires subject, fromemail, from_name, reply_to)
curl -s -X POST "https://api.vbout.com/1/emailmarketing/addcampaign.json?key=API_KEY&name=Test&subject=Test&fromemail=noreply@domain.com&from_name=Sender&reply_to=noreply@domain.com&listid=LIST_ID&format=json"
```

### ✅ Other Features
- Email templates (8 available)
- Audiences
- Automation guides
- Webhooks
- Social media posting
- AI chatbot templates
- Goals tracking

## ❌ Not Working via API

### Domain Sender Verification
- **Endpoint**: `domain/add.json` - returns error
- **Solution**: Must be done manually in Vbout UI

## Manual Setup Required

### Step 1: Add Sending Domains
1. Go to https://app.vbout.com/Settings
2. Click "Domain Sender Verification" in left sidebar
3. Click "Add Sender" button
4. Add each domain:
   - `whattoeatinmalaysia.com`
   - `whatcanieatinmy.com`
   - `whenisdurianseason.com`
   - `culinarytravelexperts.com`

### Step 2: Add DNS Records
After adding each domain, Vbout will generate:
- **SPF record**: `v=spf1 include:sparkpostmail.com ~all`
- **DKIM record**: TXT record with generated key
- **DMARC record**: `v=DMARC1; p=none`

Add these to Cloudflare DNS for each domain.

### Step 3: Verify Domains
Click "Test" in Vbout after adding DNS records. Wait for propagation (up to 24h).

## Integration with WTM

### Sync Waitlist Emails
Use the Python script to sync waitlist emails from wtm-access to Vbout:
```bash
python3 vbout_integration.py
```

### Programmatic Usage
```python
from vbout_integration import sync_waitlist_email, get_list_stats

# Sync a waitlist email
sync_waitlist_email("test@example.com", site="wtm")

# Get all list stats
stats = get_list_stats()
print(stats)
```

## Next Steps
1. User should manually add domains in Vbout UI
2. Once domains are verified, configure email campaigns
3. Integrate wtm-access waitlist with Vbout list automation
4. Set up automated welcome emails for new subscribers
