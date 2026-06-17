# MyAlice Welcome Message Automation

> **Goal:** When a guest opens a chat after completing the Experience Profiler, the first message they receive is personalized to their profile — not a generic "How can we help?"

---

## What We Can Customize

MyAlice supports **conditional Welcome Messages** triggered by user attributes. Since we pass `tour_motivation`, `tour_city`, `tour_group_type`, and other attributes via `MyAliceWebChat.init()`, we can create different greetings for each profile.

---

## Setup Steps

### 1. Access Welcome Messages

1. Log into **MyAlice Dashboard** → **Channels** → **Web Chat**
2. Navigate to **Greetings** or **Welcome Messages**
3. Look for **Conditional Greetings** or **Automated Responses**

### 2. Create Conditional Welcome Messages

Create one Welcome Message per motivation type:

#### Authenticity Seeker
**Condition:** `tour_motivation` contains `authenticity`
```
Hi! 👋 I see you're looking for the real Malaysia — the stalls locals eat at, not the tourist spots. 

We've been taking guests to the same family-run stalls for 14+ years. Tell me: which city are you exploring, and how many people in your group?

I'll suggest something that hits exactly the right hidden spots.
```

#### Culture Explorer
**Condition:** `tour_motivation` contains `culture`
```
Hi! 👋 Food is the best way to understand a place — we couldn't agree more. 

Every dish on our tours comes with the story behind it: who makes it, why it matters, and how it got here. 

Which city are you visiting, and is this your first time in Malaysia?
```

#### Milestone Maker
**Condition:** `tour_motivation` contains `milestone`
```
Hi! 👋 Special trips deserve something special — I'd love to help you plan it. 

Our private tours are built entirely around you: your pace, your interests, your schedule. No rush, no crowds.

What's the occasion, and how many people will be joining?
```

#### Return Explorer
**Condition:** `tour_motivation` contains `return`
```
Hi! 👋 Welcome back — or welcome to the deeper side of Malaysia! 

Since you've been before, I'll skip the basics and take you to the spots most visitors never find. The hidden stalls, the neighbourhoods off the tourist map.

Which city are you heading to, and how many in your group?
```

#### Chef / Culinary Enthusiast
**Condition:** `tour_motivation` contains `chef`
```
Hi! 👋 I see you're here to learn the craft — not just eat. 

We can arrange visits to the people behind the food: the noodle maker, the belacan producer, the wok master who's been doing char kway teow for 30 years.

Which city, and what's your cooking background? I'll suggest the right route.
```

### 3. Add City-Specific Follow-Ups

After the initial greeting, use the `tour_city` attribute to add a city-specific line:

**If `tour_city` is `kl`:**
```
We've got three routes through KL — from the street food of Pudu to the hidden lanes of Chow Kit Market.
```

**If `tour_city` is `penang`:**
```
George Town is our favourite — every stall in those pre-war shophouses has a story going back generations.
```

**If `tour_city` is `both`:**
```
KL and Penang in one trip — that's the full Malaysian food experience. We'll design a route that connects both cities.
```

### 4. Add Group Size Awareness

Use `tour_group_type` and `tour_headcount` to show you've paid attention:

**If `tour_group_type` is `couple`:**
```
Just the two of you — perfect for a relaxed, unhurried pace.
```

**If `tour_group_type` is `family`:**
```
We're great with families — the kids get to try new things at their own pace, and we adapt dishes so everyone eats well.
```

**If `tour_group_type` is `corporate`:**
```
Team building over food — now that's a good idea. We've done this for companies before. Let me put together a proposal.
```

**If `tour_headcount` > 6:**
```
For groups your size, the per-person cost works out very favourably. I'll make sure we get you the best value.
```

---

## Example Full Conversation Flow

**Guest profile:** Milestone Maker, Penang, Couple, 2 people

**Welcome Message (automatic):**
```
Hi! 👋 Special trips deserve something special — I'd love to help you plan it. 

Our private tours are built entirely around you: your pace, your interests, your schedule. No rush, no crowds.

What's the occasion, and how many people will be joining?

George Town is our favourite — every stall in those pre-war shophouses has a story going back generations.

Just the two of you — perfect for a relaxed, unhurried pace.
```

**Guest replies:**
```
It's our 10th anniversary!
```

**Pauline (now knows everything):**
```
Happy early anniversary! 🎉 10 years is wonderful. 

I'm thinking our Eat Drink George Town route as a starting point — 4 hours through the heritage lanes, starting at the old shophouses where vendors have been cooking the same dishes for three generations. 

We'll make it unhurried — let you linger at the stalls you love, add a stop at a nice hidden café for coffee after. 

Shall I sketch out a route for you?
```

---

## Setup Priority

| Priority | What | Effort | Impact |
|---|---|---|---|
| **1** | 5 motivation-type Welcome Messages | 15 min | High — every guest sees one |
| **2** | City-specific follow-ups | 10 min | Medium — shows we know the area |
| **3** | Group size awareness | 5 min | Low — nice touch but not critical |
| **4** | Dietary needs awareness | 5 min | Medium — shows we care about their needs |

### Dietary Needs Quick Response

If `tour_dietary` is not `none`, add:
```
I also see you have some dietary needs — don't worry, we brief every vendor in advance. No surprises at any stop.
```

---

## What to Test

After setting up, test each Welcome Message:

1. **Open staging site** → Complete the Experience Profiler as each motivation type
2. **Click "Chat with Our Team Now"**
3. **Verify** the correct Welcome Message appears
4. **Verify** the custom attributes appear in the agent inbox view
5. **Verify** the chat history links correctly (if you provide an email)

---

## Fallback

If no matching Welcome Message is found, MyAlice shows the default greeting. Make sure the default is generic but warm:

```
Hi! 👋 Welcome to Simply Enak. 

We've been sharing Malaysia's food heritage for 14+ years — from hidden hawker stalls to family-run vendors that most tourists never find.

How can we help you plan your experience?
```
