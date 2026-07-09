# Twenty CRM — Comprehensive Research

## What Is Twenty CRM?

Twenty is an **open-source CRM platform** positioned as "the open alternative to Salesforce." It's built for **technical teams** who want a CRM they can customize, extend, and version like the rest of their software stack. The company (Twenty HQ) operates a managed cloud version while the core is fully open source under a permissive license.

- **GitHub**: [github.com/twentyhq/twenty](https://github.com/twentyhq/twenty) — **52.1K stars**, 7.7K forks, 13,352 commits
- **Website**: [twenty.com](https://twenty.com)
- **Docs**: [docs.twenty.com](https://docs.twenty.com)
- **Community active**: 6.8K Discord members, active GitHub discussions
- **Funding**: VC-backed (raised ~$10M+ based on team size and product maturity)

---

## Architecture & Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React (SPA), TypeScript, Jotai (state), Linaria (CSS-in-JS), Lingui (i18n) |
| **Backend** | NestJS (Node.js framework), TypeScript |
| **Database** | PostgreSQL |
| **Queue/Jobs** | Redis + BullMQ |
| **Build/Monorepo** | Nx (Nx workspace) |
| **Self-hosting** | Docker Compose (production); local setup for dev/contribution |
| **Extension system** | `npx create-twenty-app` — build custom objects, server-side logic, React components, AI agents as "Apps" |
| **AI/MCP** | Native MCP server for AI assistants (Claude, ChatGPT, Cursor) |
| **API** | GraphQL API, REST API, webhooks (Change Data Capture) |

**Key architectural notes:**
- Monorepo managed with Nx
- Server-side rendering with Next.js on the website; the CRM app is a React SPA
- Designed to be self-hostable via Docker Compose (official script and manual steps)
- Apps framework lets you define objects, fields, views, logic functions, and agents as TypeScript code, deployable to any workspace
- Native MCP (Model Context Protocol) server for AI tool integration

---

## Key Features

### Core CRM Features
- **People** (contacts/leads), **Companies** (accounts), **Opportunities** (deals/pipeline) — standard objects
- **Custom Objects** — unlimited, create your own data model (e.g., Projects, Subscriptions, Events, Tours, Bookings)
- **Custom Fields** — unlimited, various types (text, number, date, select, multi-select, relation, currency, etc.)
- **Views** — table, kanban, and record-level views with filtering, sorting, and grouping
- **Timeline** — activity history on records
- **Tasks** — to-dos linked to records
- **Notes** — attached notes on records
- **Files** — file attachments
- **Email Sync** — bi-directional sync for People, Companies, and Opportunities
- **Calendar Sync** — meeting sync and scheduling
- **Dashboards** — custom dashboards with aggregate, bar, line, and pie widgets; real-time data from any object
- **Workflows** — no-code automations (trigger → actions); email sequences, field updates, etc.

### AI & Automation
- **AI Chatbot** — conversational assistant that queries your CRM data (coming soon / early stage)
- **AI Agents** — agents in workflows (coming soon)
- **Native MCP Server** — connect Claude, ChatGPT, Cursor via OAuth to read/write CRM data in natural language
- **Workflow Automations** — trigger-based (record created, updated, matched) → actions (send email, update field, webhook, Slack)

### Extensibility & Developer Features
- **Apps Framework** — `npx create-twenty-app` scaffolds a full extension. Build:
  - Custom objects, fields, views (code-defined)
  - Server-side logic functions
  - Custom React components that render inside Twenty's UI
  - AI skills and agents
  - Custom navigation items
- **Version Control** — apps are versioned and deployable to any workspace
- **GraphQL API** — full data access
- **Webhooks** — change data capture for real-time integration
- **REST API** — available
- **OAuth** — for third-party integrations

### Permissions & Access
- **Role-based access** — standard permissions
- **Row-level permissions** (Organization plan) — finer access control
- **SSO/SAML** (Organization plan)

### Data Model Flexibility
- Unlimited custom objects with no extra charge
- Unlimited custom fields
- Relation fields between objects
- Standard objects: People, Companies, Opportunities, Notes, Tasks
- Email/calendar sync only works with People, Companies, Opportunities

---

## Pricing (as of July 2026)

### Cloud Plans

| Feature | **Pro** | **Organization** |
|---------|---------|-----------------|
| **Price** | **$9/user/month** (yearly) | **$19/user/month** (yearly) |
| Trial | 30-day free trial, no credit card | Same |
| Standard objects | ✅ | ✅ |
| Custom objects (unlimited) | ✅ | ✅ |
| Custom fields (unlimited) | ✅ | ✅ |
| Workflows | ✅ | ✅ |
| AI features | ✅ | ✅ |
| Dashboards | ✅ | ✅ |
| Email & Calendar sync | ✅ | ✅ |
| API & Webhooks | ✅ | ✅ |
| MCP Server | ✅ | ✅ |
| SSO/SAML | ❌ | ✅ |
| Row-level permissions | ❌ | ✅ |
| Audit logs (likely) | ❌ | ✅ |

### Self-Hosting
- **Free** — open-source core is fully self-hostable
- Docker Compose-based deployment
- System requirements: 2GB+ RAM, PostgreSQL, Redis
- Backup and restore documentation available
- Must manage your own infrastructure, upgrades, SSL, backups

### Add-on Services
- **Onboarding Packs** — 4-hour pack for larger rollouts; certified partners for 1-2 week deployments
- **Partners** — certified implementation partners for customization
- No surprise add-on pricing (Twenty explicitly markets this as a differentiator vs Salesforce)

---

## Strengths

1. **True open source** — AGPL or similar permissive license; self-hostable; no vendor lock-in
2. **Modern tech stack** — React, TypeScript, NestJS, GraphQL — familiar to any modern developer
3. **Apps framework** — uniquely powerful extension model; define objects as code, version them, deploy
4. **No punitively-priced add-ons** — API, webhooks, workflows, custom objects all included in base price (unlike Salesforce where each is a paid add-on)
5. **AI-native** — MCP server built in; designed for AI agents from the ground up
6. **User-friendly for non-devs** — custom objects, fields, views, and no-code workflows from Settings UI
7. **Reasonable pricing** — $9/user/month is competitive with HubSpot ($50+/month) and leagues cheaper than Salesforce ($150+/user/month)
8. **Active community** — 52K GitHub stars, active Discord, regular releases (13K+ commits)
9. **Self-hosting option** — full control over data and infrastructure
10. **Multi-language** — i18n support with Crowdin

## Weaknesses & Limitations

1. **Relatively young product** — launched ~2023, still maturing. Some features are "coming soon" (advanced AI agents, etc.)
2. **Email/calendar sync limited** — only works with People, Companies, Opportunities standard objects; custom objects don't get sync
3. **No mobile app** — no native mobile app (web-based only; may be a concern for field operations)
4. **Limited marketplace/ecosystem** — no mature app marketplace like Salesforce AppExchange or HubSpot App Marketplace
5. **No built-in marketing automation** — no email campaigns beyond basic workflows; no marketing automation engine
6. **No built-in customer service/support desk** — no ticketing system, knowledge base, or help desk
7. **Reporting is basic** — dashboards exist but may not match the depth of Salesforce or HubSpot reporting
8. **Self-hosting requires ops** — not trivial; needs PostgreSQL, Redis, Docker, backups, SSL, upgrades
9. **Smaller company/team** — may have less support capacity than Salesforce, HubSpot, or Zoho
10. **No offline mode** — requires internet connectivity

---

## What It's Best Suited For

### Ideal Use Cases
- **Tech-forward SMBs and startups** that want a modern, customizable CRM they can extend with code
- **B2B sales teams** with standard pipeline management needs (people, companies, deals)
- **Companies already using modern JS stacks** — the extension model (React, TypeScript) means your dev team can build exactly what you need
- **Teams wanting AI integration** — MCP server makes it easy to connect AI assistants
- **Organizations with complex/custom data models** — unlimited custom objects and fields without upselling
- **Privacy-conscious companies** — self-hosting option for full data control
- **Companies migrating from Salesforce** looking to escape the pricing treadmill while keeping customization

### Not Ideal For
- **Non-technical small businesses** without developer resources — the DIY customization model requires some technical capability
- **Enterprises needing mature compliance/audit features** — still building out enterprise-grade permissions
- **Organizations needing marketing automation** — not a replacement for HubSpot Marketing Hub or Mailchimp
- **Customer service teams** — no support desk / ticketing built in
- **Sales teams needing heavy offline mobile access** — no native mobile app

---

## Comparison Context: Nocobase vs Twenty

Since Simply Enak is currently on **Nocobase** (a no-code platform builder), here's the key contrast:

| Dimension | Nocobase | Twenty |
|-----------|----------|--------|
| **Primary purpose** | General-purpose no-code app builder | CRM-specific |
| **CRM out of box** | ❌ — you build it | ✅ — full CRM with sales pipeline |
| **Custom objects** | ✅ Unlimited | ✅ Unlimited |
| **Workflows** | ✅ Plugin-based | ✅ Built-in |
| **Email sync** | ❌ (would need to build) | ✅ Built-in |
| **Calendar sync** | ❌ | ✅ Built-in |
| **Pricing** | Free/self-hosted | $9/user/mo cloud or free self-hosted |
| **Learning curve** | Higher (you build everything from scratch) | Lower (CRM-focused, just customize) |
| **Extension model** | Plugin marketplace | Apps framework (code-defined) |
| **AI features** | ❌ None built-in | ✅ MCP server + chatbot |
| **Dashboard/reporting** | Build your own | Built-in dashboards |
| **Community size** | ~8K stars | ~52K stars |
| **Open source** | ✅ | ✅ |

For a **food tourism business** like Simply Enak running on Nocobase, switching to Twenty would mean:
- **Gain**: CRM-specific features out of the box (pipeline, contacts, email sync, dashboards)
- **Lose**: General-purpose flexibility (if you built restaurant-specific operations beyond CRM in Nocobase)
- **Trade-off**: Nocobase is a platform builder; Twenty is a CRM you customize. If your core need is customer relationship management, Twenty is more focused and ready. If you need a full operational platform (booking systems, inventory, logistics), you'd need to either extend Twenty via its Apps framework or stick with Nocobase.

---

## Summary Judgment

Twenty CRM is a **strong, modern, open-source CRM** that's ideal for technical teams who want the flexibility of a Salesforce-like platform without the Salesforce price tag or complexity. It's best suited for companies that:
- Need a customizable CRM
- Have some technical capability (or a developer on staff)
- Value open source and data ownership
- Want AI integration from day one

For Simply Enak, Twenty could replace Nocobase for **CRM functions** (contacts, pipeline, email sync) but wouldn't directly replace any custom **operational apps** (booking systems, tour management, inventory) you may have built in Nocobase — unless you invest in building those as Twenty Apps.
