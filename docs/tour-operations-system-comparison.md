# Simply Enak — Tour Operations System: Approach Comparison

**Date:** July 3, 2026  
**Context:** Simply Enak uses Twenty CRM for sales/CRM, Payload CMS for the website, and needs a tour operations system for day-to-day running of food tours.

---

## Executive Summary

The operations system Simply Enak needs is **classic internal tooling**: forms, status workflows, payment tracking, file uploads, approvals, and calendar management. This is neither unique nor bleeding-edge — it's what every tour operator needs. The question is which build approach wastes the least time and creates the least future pain.

---

## Approaches Compared

### 1. Custom-Built CRUD App (Supabase + React/Vue/Svelte)

**Stack:** Supabase (Postgres, Auth, Realtime, Storage) + lightweight frontend framework

**Development speed:** Fast IF you're already competent with the stack. "Vibe coding" with AI (Claude/Cursor/Codex) can get you a working prototype in days. But production-quality code — auth, error handling, loading states, mobile responsiveness, file uploads, role-based access — takes longer than the demo shows. Realistic: **1-3 weeks** for an MVP that a non-technical person can actually use.

**Flexibility:** Maximum. You build exactly what you need — no more, no less. Approval workflows with custom business logic? Trivial. Payment reconciliation with split payments? Your SQL query. Guide claim forms with auto-calculated totals? One afternoon.

**Maintainability:** Depends entirely on code quality. AI-generated code is notoriously undocumented, untested, and inconsistent. A year from now, whoever inherits this needs to understand the whole codebase. If the business grows, adding features means more coding. **This is the biggest risk of this approach.**

**Cost:**
- Supabase Pro: $25/month (8GB DB, auth, storage, realtime)
- Domain/hosting: ~$5/month (or already have it)
- **Dev time: 40-120 hours** of AI-assisted development

**Mobile access:** Easy. Build a responsive SPA or PWA. Supabase Auth + Realtime means field staff get live updates. But you have to build the mobile forms yourself.

**Twenty CRM integration:** Straightforward. Supabase Edge Functions or a simple Node.js service can sync data via Twenty's REST/GraphQL API or webhooks. You control the data model — match whatever Twenty expects.

---

### 2. Nocobase

**GitHub:** 23.2k ★ | AGPL license | Self-hosted | 16,961 commits  
**Website positioning:** "AI + no-code platform for building business systems"

**Development speed:** Fastest for **initial setup** — you define data models in the UI, configure workflows visually, build forms by dragging. Nocobase now has AI builder agents that can scaffold things from natural language. Getting a basic version of the operations system could be **days, not weeks**.

**Flexibility:** Good for what Nocobase supports, frustrating for what it doesn't. You're confined to Nocobase's data model patterns, workflow triggers, and UI components. The **approval workflow** (guide claims → manager approval → payment) is achievable via Nocobase's workflow plugin. But **payment reconciliation** (matching Stripe/TicketingHub payouts to bookings, tracking partial payments, handling refunds) will push Nocobase to its limits — you'd likely need a custom plugin or hacks.

**Maintainability:** Config-driven means non-developers can tweak forms and fields. But **Nocobase's plugin API and workflow engine are Nocobase-specific knowledge** — there's less community support than Directus or Strapi. If the project is abandoned (risk with any smaller open-source project), you're stuck on a version that can't be updated.

**Cost:** Free to self-host (community edition). Premium plugins may cost. Hosting: ~$10-20/month on a small VPS (Node.js + PostgreSQL).

**Mobile access:** Nocobase renders in mobile browsers reasonably well, but there's no native mobile app. Forms work but feel like web forms, not native mobile forms.

**Twenty CRM integration:** Via REST API or webhooks. Possible but adds another integration layer — Nocobase sits between Twenty and your data, adding latency and complexity.

**⚠️ Warning:** Simply Enak's previous CMS experiments (Directus → Payload) show that migrating away from a platform is painful. If Nocobase turns out to be the wrong fit, you'll face that same migration cost again.

---

### 3. Other Low-Code Platforms

#### Directus
**GitHub:** 36.4k ★ | Self-hosted | **Simply Enak already tried and left Directus**  
**Pricing:** Core (free, 3 seats, 25 collections), Team ($499/mo), Enterprise (custom)

Directus is excellent at what it does — wrapping any SQL database in an instant API + admin panel. But it failed for Simply Enak before (caching issues, bugs, frustration). It's a **backend/API tool**, not an operations system builder. You'd still need to build a custom frontend for field staff, guide claims, and calendar views. Directus as the "database layer" is overkill vs. just using Supabase or plain Postgres.

**Verdict for this use case:** Not recommended. Already tried, didn't work, wrong tool for the job.

#### Baserow
**GitHub:** 5.2k ★ | Pricing: $0 (3k rows/workspace), $10/user/mo (Premium), $18/user/mo (Advanced)

Baserow is an Airtable alternative with grid, calendar, kanban, form views and a newer application builder. It's **simpler than Nocobase** — less flexible on workflows, less customizable. Good for lightweight data management, but **approval workflows, payment reconciliation, and receipt uploads are stretching it**. The Application Builder is new and limited. Row limits on lower plans would be hit quickly (3k rows on free).

**Verdict:** Too constrained. Row limits, workflow limitations, and smaller ecosystem make it a poor fit.

#### Strapi
**GitHub:** 72.6k ★ | **Purpose-built as a headless CMS, not operations software**

Strapi is great for content (articles, pages, media) but lacks workflow engines, approval chains, role-based operations, and calendar management. Using Strapi for tour operations would be fighting its design — you'd need custom plugins for everything.

**Verdict:** Wrong tool. Stick with Payload CMS for content. Don't try to make Strapi do operations.

---

## Head-to-Head Comparison

| Criteria | **Custom (Supabase + Svelte/React)** | **Nocobase** | **Directus** | **Baserow** |
|---|---|---|---|---|
| **Dev speed (initial MVP)** | 1-3 weeks | **Days** | 1-2 weeks + custom frontend | 1 week (simple needs) |
| **Flexibility** | ★★★★★ Unlimited | ★★★☆☆ (plugin-bound) | ★★★★☆ (API-first, needs frontend) | ★★☆☆☆ (Airtable-like limits) |
| **Approval workflows** | Trivial (code) | Possible (workflow plugin) | Needs custom | ❌ Too limited |
| **Payment reconciliation** | Custom SQL + logic | **Hard** (plugin hack needed) | Needs custom | ❌ Not possible |
| **Receipt uploads** | Trivial (Supabase Storage) | Built-in file mgmt | Built-in media lib | File upload element |
| **Mobile-friendly forms** | Build with framework X | Basic web mobile | Needs custom frontend | Form view (basic) |
| **Calendar/scheduling** | FullCalendar + DB | Calendar plugin | Not built-in | Calendar view (basic) |
| **Staff assignment** | Simple relations | Data models + UI | Via API | Via relations |
| **Maintainability (1yr)** | ★★☆☆☆ (code quality risk) | ★★★☆☆ (config, but niche) | ★★★★☆ (mature + well-known) | ★★★☆☆ (growing) |
| **Cost (monthly infra)** | $25-50 | $10-20 (self-host) | $0 (self-host, 3 seats) | $10/user/mo |
| **Cost (dev time)** | 40-120 hrs (AI-assisted) | **10-30 hrs** (configure) | 30-60 hrs | 20-40 hrs |
| **Twenty CRM integration** | ★★★★★ Direct API sync | ★★★☆☆ Via REST plugin | ★★★★☆ Via API | ★★★☆☆ Via API |
| **Migration cost if wrong** | Low (you own the code) | **High** (platform lock-in) | Medium | Low (simple data export) |
| **Long-term viability** | As long as you maintain it | ★★★☆☆ (smaller community) | ★★★★★ (mature, well-funded) | ★★★☆☆ (small, growing) |
| **Data ownership** | Full (your Supabase DB) | Full (your Postgres DB) | Full (your SQL DB) | Cloud-hosted (or self-host) |

---

## Recommendation

### For Simply Enak, today, I recommend: **Custom-built app (Supabase + SvelteKit)**

**This is the honest call, not the easy one.**

Here's why:

**1. The approval workflow IS the product.** Guide claims → receipt verification → manager approval → payment processing is not a "nice to have" — it's the operational spine of the business. Every platform (Nocobase, Baserow, Directus) will make you fight for this. In a custom app, it's a state machine with clear transitions, and you get exactly the UX and business logic you need.

**2. Payment reconciliation is the killer.** Matching Stripe/TicketingHub payouts to bookings, handling partial payments, refunds, and guide commissions — this is accounting-level logic. Trying to do this in Nocobase's workflow engine will produce fragile, hard-to-debug configurations. In SQL + TypeScript, it's a few well-tested functions.

**3. You already own the infrastructure.** You have a server (45.136.28.238) with Docker and PostgreSQL. Adding a Supabase-like stack (or actual Supabase cloud) is marginal cost. You don't need to provision new infrastructure.

**4. Twenty CRM integration is straightforward.** Your ops data (bookings, payments, claims) needs to sync to Twenty for the sales side. Building this as a Supabase Edge Function or a lightweight service is simpler than routing through Nocobase/Directus.

**5. Migration cost is zero if it goes wrong.** If the custom app doesn't work out, your data is in a vanilla PostgreSQL database with a known schema. Any future system can consume it. Migrating *off* Nocobase or Directus costs real money and time.

**6. SvelteKit specifically** — lightweight, fast to develop with AI, excellent mobile responsiveness out of the box, and smaller than React for a simple CRUD app. Vue or React work too, but SvelteKit's form actions and server-side rendering give you rapid form development that maps directly to tour operations needs.

### When NOT to go custom

- You have **no one** who can write or maintain TypeScript/Python/JS in any capacity. "AI coding" requires a human who can review, debug, and deploy. If that's not you or a team member, custom is risky.
- You need this **in 48 hours** with zero tolerance for bugs. Nocobase can give you something working faster, even if it's less polished.

### Fallback: Nocobase WITH custom plugin

**Use this if** the custom approach seems too risky. Keep the operations core in Nocobase (tours, staff, schedule) but build a **small custom microservice** for the hard parts:
- Payment reconciliation
- Guide claim approval math
- Twenty CRM sync

This hybrid gives you the speed of Nocobase for CRUD + the flexibility of code for the complex bits. The downside: now you maintain both a Nocobase instance AND a custom service, doubling your surface area.

### What about Baserow / Directus / Strapi?

- **Baserow:** Too restrictive. Row limits and weak workflows disqualify it.
- **Directus:** Already tried, already left. Caching issues and the "wraps your DB" model create more problems than they solve for this use case.
- **Strapi:** A content CMS, not an operations tool. Wrong category entirely.

### What this means for Twenty CRM

Twenty CRM (self-hosted or cloud, $9/user/mo) handles:
- Sales pipeline (leads → opportunities → won/lost)
- Contacts and companies (customer records, communication history)
- Email and calendar sync
- Sales dashboards

The custom ops system handles:
- Tour schedule and staff assignments
- Payment tracking and reconciliation
- Guide claims + receipts + approvals
- Mobile forms for field staff

**Data flows:** Bookings created/updated in the ops system → webhook pushes to Twenty CRM as Opportunities. Guide claims approved → payout data available to finance. The two systems are separate, connected by a thin sync layer.

---

## Cost Comparison (Real Numbers)

| Item | Custom Build | Nocobase | Directus | Baserow |
|---|---|---|---|---|
| **Infra (monthly)** | $25 (Supabase Pro) or $5 (self-hosted Postgres + edge functions) | $10-20 (VPS) | $10-20 (VPS) | $100-180 (10 users @ Premium/Advanced) |
| **Initial build time** | 60-100 hours AI-assisted | 20-40 hours config | 40-60 hours config + frontend | Unlimited (won't fit) |
| **Build cost @ $50/hr** | $3,000-5,000 | $1,000-2,000 | $2,000-3,000 | N/A |
| **Year 1 total** | ~$3,300-5,300 | ~$1,240-2,240 | ~$2,240-3,240 | ~$1,200-2,160 (but won't work) |
| **Year 2 (maintenance)** | ~$500-1,000 (bug fixes, tweaks) | ~$500-1,000 (config updates) | ~$500-1,000 | Same |
| **Migration if wrong** | Low (data in vanilla Postgres) | High ($2k+ to migrate) | High ($2k+ to migrate) | Low (export CSV) |

---

## Final Verdict

**Build custom with Supabase + SvelteKit (or React/Vue).** Use the existing server's PostgreSQL. Build the approval workflow as a state machine, payment reconciliation as SQL queries, and mobile forms as a responsive PWA. Keep it to ~6 database tables and ~15 screens. Use AI for rapid prototyping but have a human review and test every data write path.

Nocobase is a reasonable first step if you genuinely have no development capability. But if you have any ability to write or direct code, the custom approach gives you a **cheaper, more flexible, more maintainable system** that you'll never need to migrate off.
