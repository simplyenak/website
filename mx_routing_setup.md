# MX Routing Setup

## Email Accounts Created

| Domain | Account | Password |
|--------|---------|----------|
| whattoeatinmalaysia.com | noreply@whattoeatinmalaysia.com | NewPass123! |
| whattoeatinmalaysia.com | hello@whattoeatinmalaysia.com | NewPass456! |
| whatcanieatinmy.com | noreply@whatcanieatinmy.com | TempPass123! |
| whatcanieatinmy.com | hello@whatcanieatinmy.com | TempPass456! |
| whenisdurianseason.com | noreply@whenisdurianseason.com | TempPass123! |
| whenisdurianseason.com | hello@whenisdurianseason.com | TempPass456! |
| culinarytravelexperts.com | noreply@culinarytravelexperts.com | TempPass123! |
| culinarytravelexperts.com | hello@culinarytravelexperts.com | TempPass456! |

## DNS Records (All 4 domains)
- ✅ MX records → tuesday.mxrouting.net
- ✅ SPF → `v=spf1 include:mxroute.com -all`
- ✅ DKIM → Added from DirectAdmin API
- ✅ DMARC → `v=DMARC1; p=none`

## SMTP Configuration
- Server: `tuesday.mxrouting.net:587`
- Auth: Full email address + password
- wtm-access configured with `noreply@whattoeatinmalaysia.com`
- Test email sent successfully

## To-Do
- [ ] Change passwords for remaining 3 domains (whatcanieatinmy, whenisdurianseason, culinarytravelexperts)
- [ ] Configure SMTP for other sites if needed
