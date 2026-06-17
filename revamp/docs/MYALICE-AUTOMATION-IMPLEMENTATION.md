# MyAlice Automation Implementation Guide

> **Status:** Draft — needs verification against actual MyAlice Dashboard

---

## What We Know

From the MyAlice API documentation, we can pass custom user attributes via `init()`:

```javascript
MyAliceWebChat.init({
  user: {
    email: "guest@example.com",
    tour_motivation: "milestone",
    tour_style: "absorber",
    tour_city: "penang",
    tour_group_type: "couple",
    tour_headcount: "2"
  }
});
```

These attributes are stored as **user attributes** in MyAlice and can be used in:
1. **Welcome Messages** (conditional greetings)
2. **Automation sequences** (ticket routing, triggers)
3. **Agent inbox views** (agent sees attributes before responding)

---

## Implementation: Conditional Welcome Messages

### Method 1: MyAlice Dashboard (Recommended)

1. **Navigate:** MyAlice Dashboard → Channels → Web Chat → Greetings
2. **Create New Welcome Message** for each motivation type
3. **Set Condition:** `tour_motivation` equals `milestone`
4. **Write Message:** Personalized greeting (see MYALICE-WELCOME-MESSAGES.md for templates)

**Note:** MyAlice's exact UI for conditional greetings may vary. If conditional greetings aren't supported, use Method 2.

### Method 2: Custom Welcome Message via Automation

If MyAlice doesn't support conditional Welcome Messages directly:

1. **Navigate:** MyAlice Dashboard → Automation → Triggers
2. **Create Trigger:** "When chat starts AND tour_motivation is set"
3. **Action:** Send automated message based on attribute value

This is more flexible and can handle multiple conditions (e.g., motivation + city).

---

## Implementation: Agent Inbox Enhancement

When Pauline opens a chat, she should see:

1. **Guest name** (if provided via `email` or `full_name`)
2. **Custom attributes** displayed in the chat sidebar
3. **Past conversation history** (if `email` was provided)

### Setup:
1. **MyAlice Dashboard** → Channels → Web Chat → Edit
2. **Enable:** "Show custom attributes in agent view"
3. **Verify:** Attributes prefixed with `tour_` appear in the chat window

---

## Implementation: Ticket Routing by Motivation

If you have multiple agents, you can route chats based on motivation type:

### Example Routes:
| Motivation | Assigned To | Reason |
|---|---|---|
| `chef` | Pauline (Head Guide) | Needs culinary expertise |
| `milestone` | Pauline | Personal touch for special occasions |
| `corporate` | Maarten | B2B sales, proposal generation |
| `authenticity` | Any guide | Standard route |
| `culture` | Any guide | Standard route |
| `return` | Any guide | Standard route |

### Setup:
1. **MyAlice Dashboard** → Automation → Routing Rules
2. **Create Rule:** "If tour_motivation contains `chef`" → Route to Pauline
3. **Create Rule:** "If tour_motivation contains `milestone`" → Route to Pauline

---

## Testing Plan

### Test Each Motivation Type

| Test | Steps | Expected Result |
|---|---|---|
| **Authenticity Seeker** | Complete profiler → select "locals eat" → Chat Now | Welcome message mentions hidden stalls, local spots |
| **Culture Explorer** | Complete profiler → select "understand this place" → Chat Now | Welcome message mentions stories, food as understanding |
| **Milestone Maker** | Complete profiler → select "special trip" → Chat Now | Welcome message acknowledges occasion, offers personalization |
| **Return Explorer** | Complete profiler → select "been before" → Chat Now | Welcome message mentions deeper side, hidden spots |
| **Chef** | Complete profiler → select "learn craft" → Chat Now | Welcome message mentions technique, vendor visits |

### Test Contact Info Capture

| Test | Steps | Expected Result |
|---|---|---|
| **Email provided** | Enter email in Step 6 → Chat Now | Email linked to past conversations |
| **Phone provided** | Enter phone in Step 6 → Chat Now | Phone used as unique identifier |
| **Neither provided** | Leave both blank → Chat Now | Chat still works, no history linkage |

### Test City-Specific Follow-Ups

| Test | Steps | Expected Result |
|---|---|---|
| **KL selected** | Select KL in profiler → Chat Now | Welcome message mentions Pudu, Chow Kit |
| **Penang selected** | Select Penang in profiler → Chat Now | Welcome message mentions George Town, shophouses |
| **Both selected** | Select Both Cities → Chat Now | Welcome message mentions multi-city experience |

---

## What to Configure in MyAlice Dashboard

### Required Settings

| Setting | Value | Where |
|---|---|---|
| **Pre-chat Survey** | Never | Content → Pre-chat Survey |
| **Welcome Messages** | Conditional by `tour_motivation` | Greetings |
| **Custom Attributes** | Enable display in agent view | Channels → Web Chat → Edit |
| **Conversation History** | Enabled | Advanced Settings |
| **Routing Rules** | By motivation (optional) | Automation → Routing |

### Optional Settings

| Setting | Value | Where |
|---|---|---|
| **Away Message** | Custom with profile info | Content → Away Message |
| **Business Hours** | Set to 9:00-20:00 MYT | Settings → Business Hours |
| **File Attachments** | Enable (for PDF menus, etc.) | Advanced → File Attachments |
| **Sound Notifications** | Enable | Settings → Notifications |

---

## Troubleshooting

### Issue: Welcome Message Not Personalized
- **Check:** Custom attributes are being passed in `init()` call
- **Verify:** Open browser console after clicking "Chat with Our Team Now" and check the `user` object
- **Fix:** Ensure attribute names match exactly (case-sensitive): `tour_motivation`, not `TourMotivation`

### Issue: Past Conversations Not Linked
- **Check:** `email` is being passed in `init()` call
- **Verify:** The email matches an existing MyAlice user exactly
- **Fix:** Use lowercase, trim whitespace

### Issue: Widget Doesn't Open on Click
- **Check:** Selector `#myAliceWebChat .mwa-widget-head` exists
- **Verify:** Inspect the widget element in browser dev tools
- **Fix:** Update the selector in TourConfigurator.astro to match actual DOM

### Issue: Conditional Routing Not Working
- **Check:** Routing rules are configured correctly
- **Verify:** The condition values match exactly what's being passed
- **Fix:** Use "contains" instead of "equals" for more flexible matching

---

## Future Enhancements

### Phase 2: Automated Follow-Up Messages

After the initial Welcome Message, we could trigger automated follow-ups based on inactivity:

```
If no response for 2 minutes AND tour_city is "penang":
  Send: "While you're thinking about it, here's a quick tip: 
         George Town's best hawker stalls open early. 
         Morning tours are usually the most atmospheric!"
```

### Phase 3: Post-Chat Survey

After the chat ends, automatically send a short survey:

```
Thanks for chatting! Quick question: 
Did you find the tour suggestion helpful? 

[ Yes, exactly! ] [ Somewhat ] [ Not really ]
```

Results feed back into the Experience Profiler for continuous improvement.

### Phase 4: Multi-Language Welcome Messages

Use the `tour_style` or user's browser language to send greetings in their language:

```
If browser language is "zh":
  Send: "你好！👋 我看到你正在寻找真实的马来西亚体验..."
If browser language is "ms":
  Send: "Hai! 👋 Saya nampak anda sedang mencari pengalaman Malaysia yang sebenar..."
```

This requires MyAlice's localization features and would need translated versions of all Welcome Messages.

---

## Implementation Checklist

- [ ] Access MyAlice Dashboard and navigate to Greetings
- [ ] Verify conditional Welcome Messages are supported
- [ ] Create 5 Welcome Messages (one per motivation type)
- [ ] Test each Welcome Message on staging
- [ ] Configure custom attributes display in agent view
- [ ] Set up routing rules (if multiple agents)
- [ ] Test contact info linkage (email/phone)
- [ ] Document the setup for future reference
- [ ] Train agents on reading custom attributes
- [ ] Monitor Welcome Message effectiveness (response rates)
