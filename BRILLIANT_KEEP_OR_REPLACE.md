# Brilliant (xiReactor) — Keep or Replace?

**Date:** 2026-09-18 · **Scope:** assessment of `thejeremyhodge/xireactor-brilliant` and
alternatives for the stated use case: *"retain mostly static company data that needs
versioning and access control."*

## Verdict

**Replace.** Brilliant fails the versioning requirement outright, has a worst-case bus
factor, and is over-engineered for static data. The closest mainstream replacements
(BookStack, Wiki.js) are actively maintained, version every change, and expose APIs our
cron + agent workflows can re-point to.

---

## 1. What Brilliant is (verified)

- Self-hosted, headless knowledge base: PostgreSQL + RLS + pgvector, FastAPI REST,
  MCP server (18 tools) for Claude Code/Co-work. Apache-2.0.
- Purpose-built for *agents and humans sharing institutional context* — staging/
  governance pipeline (4 tiers), row-level security, groups, sensitivity levels,
  comments, wikilinks/knowledge graph, Obsidian vault import.
- Our deployment: `compose-brilliant_{api,db,mcp}` in Dokploy/Swarm, locally built
  images (`brilliant-api:latest`, `brilliant-mcp:latest`, pgvector/pg16), source clone
  at `/home/maarten/xireactor-brilliant` on the server.
- Our usage today: `brilliant-kb-assistant` skill (MCP tools), business-dashboard cron
  (`GET /entries?content_type=…`, `GET /index`), content = tours, guests, operations,
  decisions, meetings, daily notes — i.e. mostly-static company context.

## 2. Why it fails the requirement

**2a. No content version history.** Migrations 001–034 (core, relationships, governance,
RLS, staging, permissions, comments, blobs, access logs…) contain **no entry-revisions /
history table**. `expected_version` is an optimistic-concurrency *counter* — it stops
lost updates, it does not let you roll back. The staging pipeline is a change queue +
approval gate, not history: once approved, the previous content is gone. `audit_log` /
`entry_access_log` record *events* (who read/did what), not *content snapshots*.
⇒ For mostly-static data, the rare bad edit is permanent. No diff, no rollback, no
time-travel. This is the single decisive miss.

**2b. Bus factor — worst case.** Repo created 2026-04-10; **last push 2026-05-30
(≈3.5 months dormant)**; 21 stars; 36 open issues unanswered; **52 of 53 commits by
`thejeremyhodge`** (1 drive-by contribution). v0.2.2 → v0.10.1 in 7 weeks, then silence —
the profile of a launch/demo sprint (render.yaml itself references "V2 demo" and
"click-deploy demo recording"). Pre-1.0, one maintainer, dormant: the exact risk being
challenged.

**2c. We already maintain a fork.** Server clone is 9 commits behind upstream with local
patches (`api/Dockerfile`, `api/database.py`). Every extra day on Brilliant deepens a
divergence from a repo that is not moving.

**2d. Over-engineered for static data.** Multi-tenant RLS, governance tiers, OAuth
handoff, personal zones — valuable only for high-volume agent-authored content. Static
reference data needs approvals less than it needs history.

**2e. No browse-able UI.** API/MCP-only (plus a minimal /setup and vault-import page).
Versioned static company data wants a human-edit-able, human-browse-able surface.

**Honest counterpoint** (the "keep" case): if we intended to go all-in on agent-authored
content under governance tiers, Brilliant is the only tool with that shape, and Apache-2.0
removes licensing risk. Keep would also be defensible *only with* a nightly dump of all
entries to git as poor-man's versioning — that still leaves the bus factor + diverged-fork
problem unsolved. Recommendation stands: migrate the static knowledge out.

## 3. Candidates (verified current numbers, 2026-09-18)

| Tool | Stars | License | Last push | Versioning | ACL | API | Notes |
|---|---|---|---|---|---|---|---|
| **BookStack** | 19k | MIT | today (11 yrs) | ✅ full page revisions + diff + rollback | ✅ roles + per-page | ✅ REST R/W | docs/wiki-class; official Docker |
| **Wiki.js** | 29k | AGPL-3.0 | today | ✅ git-backed storage | ✅ granular ACL | ✅ GraphQL+REST | Node; Docker |
| **Outline** | 41k | BUSL-1.1 | today | ✅ doc history + restore | ✅ granular | ✅ **official MCP (built-in)** | self-host; needs OIDC (Forgejo can serve) |
| **Docmost** | 22k | AGPL-3.0 | yesterday | ✅ page history | ✅ workspaces+groups | limited | younger (2023), 331 open issues |
| **Onyx/Danswer** | 32k | — | today | ❌ weak | via connectors | ✅ | search-first, not authoring |
| **AnythingLLM** | 66k | MIT | yesterday | ❌ no doc history | ✅ workspaces | ✅ | RAG chat, not a versioned KB |
| **Khoj** | 37k | AGPL-3.0 | 2026-08 | partial | ❌ weak | ✅ | personal PKM focus |
| *Forgejo + Markdown* | n/a | n/a | n/a (ours) | ✅ git history | ✅ repo ACL+MFA | ✅ Forgejo API/git | zero new infra; no WYSIWYG |

## 4. Recommendation

### Primary: **BookStack** (self-hosted, MIT, Docker)
- Your three requirements map 1:1: static company data → books/chapters/pages;
  **versioning → built-in revision history (diff + rollback) at every save**;
  **access control → role permissions + per-page ACLs**.
- REST API (read+write) → re-point `business-dashboard.py` and agent skills without a
  new paradigm; official Docker image → fits Dokploy/Swarm alongside everything else.
- Simple MySQL/MariaDB data model → easy backups, no lock-in, cheap to exit later.
- Honest caveat: it is *also* a dominant-single-maintainer project (Dan Brown, 11
  years) — but the durability profile is the opposite of Brilliant: continuous release
  train, paid-support revenue, huge install base. Static data in BookStack is trivially
  portable, so the remaining single-person risk is contained.
- Gaps vs Brilliant: no native semantic/vector search (Qdrant is already in our stack —
  index BookStack pages into it if agents need semantic recall), no MCP out of box
  (thin MCP wrapper over the documented REST API is a small build).

### Zero-dependency alternative: **Forgejo repo + Markdown** (already running on LXC105)
- Static data as markdown: versioning = git (history, diff, rollback, blame), access
  control = repo ACL (already configured), agents read files/git/Forgejo API directly.
- Kills the bus-factor concern completely — no third-party project in the critical path.
- Choose this over BookStack if: Maarten is the only editor, WYSIWYG is not needed,
  and "no new moving parts" outweighs "web UI + API niceties".

### Supplementary: **Grist** (already self-hosted) for the tabular slice
- Finance/vendor/supplier records fit Grist (snapshot versioning + access rules + API).

### Does anything do BOTH (agent-native + human wiki)? — Yes: Outline (since Feb 2026)

Outline now ships an **official built-in MCP server** (changelog 2026-02-18) — agents can
search, read, create, edit documents and manage comments directly over
`https://<your-instance>/mcp` (Streamable HTTP; OAuth or API-key auth; works on
self-hosted). Combined with its GUI, document history + restore (versioning), and
granular ACL (collections/teams/groups/private docs), it is the one mature tool that
genuinely covers both halves natively.

The friction I previously flagged for Outline is mostly gone:
- **OIDC/login**: Outline has no built-in user DB and requires an OIDC/SAML provider —
  **our Forgejo instance (LXC105) is itself an OIDC provider** (`.well-known/
  openid-configuration`, PKCE, userinfo — confirmed in Forgejo docs), so Outline can
  sign in against existing infra. No Authentik/Keycloak needed.
- **Storage**: Scaleway S3 already in the stack (local disk also works).
- **Postgres**: already standard here; Redis is the only genuinely new small piece.

Remaining honest catches for Outline:
- **BUSL-1.1** license: free for internal self-hosting (converts to Apache-2.0 after
  ~3 years), but you may not offer it as a service to third parties — fine for Simply
  Enak internal KB, a constraint if a CTE/B2B partner portal ever rode on it.
- Heavier runtime than Brilliant (Postgres + Redis + worker + S3/local disk).
- Verify at setup: Forgejo OAuth2 scopes/consent behavior for third-party apps; Outline
  also lists native Gitea OAuth among supported providers, giving a second login path.

So the updated short-list for "both":
| Tool | Official MCP | GUI | Versioning | ACL | Login | License |
|---|---|---|---|---|---|---|
| **Outline** | ✅ built-in | ✅ | ✅ history+restore | ✅ granular | OIDC → our Forgejo | BUSL-1.1 |
| **BookStack** | community (pnocera/bookstack-mcp-server, 89★, MIT, active) | ✅ | ✅ revisions+rollback | ✅ roles+per-page | local accounts | MIT |
| **Wiki.js** | community (jaalbin24/wikijs-mcp, 18★) | ✅ | ✅ git-backed | ✅ | local accounts | AGPL-3.0 |

### Seafile wiki — the user's preferred direction (community + plugins, already deployed)

Seafile's built-in **Wikis module (13.0, SeaDoc 2.0)** is a genuine "both" candidate for
this user specifically, because the deployment already exists and is current:

**Verified on LXC 104** (2026-09-18): `seafileltd/seafile-mc:13.0-latest` +
`seafileltd/sdoc-server:2.0-latest` + OnlyOffice + Redis + watchtower auto-updates;
env has `ENABLE_SEADOC`, `ENABLE_SEAFILE_AI`, notification/metadata servers enabled.
User runs Community Edition and covers Pro-gated features (granular folder perms,
full-text search, audit) with community plugins.

**Requirement map (primary sources):**
| Requirement | Status | Evidence |
|---|---|---|
| Versioning | ✅ | Wiki module: page **History Versions + restore** (help.seafile.com/wiki/version_history_and_page_search); markdown-library model: file revision history (`KEEP_FILE_REVISIONS`). |
| Access control | ✅⚠ | Library/wiki-level perms in Community; granular covered by user's plugins. Not per-page out of the box. |
| GUI (simple) | ✅ | Column-view markdown wiki (old model) + block-based wiki editor (new); the simplicity the user explicitly likes. |
| Agents | ⚠ | Full documented HTTP API (already scripted in seafile-homelab skill); **no official MCP** — thin wrapper needed; agents can also read synced markdown directly. |
| Semantic search | ⚠ | SeaSearch full-text in 13.0 (some caps by edition); Qdrant add-on possible. |
| Active development | ✅ | 13.0.x monthly+ patch cadence through mid-2026; wiki module is a headline 13.0 feature (block editor, comments, Ask AI, sdoc/Markdown import-export); company (Seafile Ltd., 14 yrs) — not a one-person project. |
| Portability | ✅ | Wiki exports/imports Markdown; old model is plain md files (git-dump friendly). |
| Cost | ✅ | Already running; Community + plugins. |

**Status (2026-09-18): MIGRATION EXECUTED & VERIFIED.**
- 167 entries exported from Brilliant → markdown (0 errors), frontmatter preserves
  `type`/`tags`/`summary`/dates/`source_id`.
- Uploaded to Seafile repo `Simply-Enak-KB` (2fb7f0b7…): 167 files / 628,703 bytes,
  per-file size verified + spot content hash checks PASS.
- `~/.hermes-website/scripts/seafile_kb.py` = adapter (same interface as old Brilliant
  client); both business-dashboard copies re-pointed and verified running on Seafile.
- Seafile creds (`SEAFILE_ADMIN_EMAIL/PASSWORD`) added to `~/.hermes-website/.env` +
  `~/.hermes/.env` (0600; raw-parsed by adapter — quote-safe).
- Exposed Brilliant key: removed from dev44 script (was hardcoded — policy violation),
  registered in `scripts/known-secrets.txt`. **Rotate it** (it appeared in session dumps).
- Brilliant stack scaled to 0/0 on the server (volumes kept; restore =
  `docker service scale compose-brilliant_api=1 compose-brilliant_db=1
  compose-brilliant_mcp=1 brilliant-bridge_bridge=1`).
- Verify in UI: seafile.myss2home.stream → `Simply-Enak-KB` library (column view).

**Phase 2 (2026-09-18): pruned + enriched.**
- Pruned 8 test/junk entries (test/, testing/, test-tour-01, n8n tests, hermes-security-test,
  test-delete-me) + 13 now-empty dirs → repo now **159 files / 644,507 bytes**.
- Enriched **8 tour stubs** from live Payload tours (site/src/data/content/tours.json /
  cms.system.simplyenak.com — descriptions, price, duration, meeting point, highlights,
  itinerary, inclusions; real CMS data only, placeholder-desc tours flagged honestly) and
  **17 story one-liners** from stories.json (excerpt + full published `content_markdown` +
  author/URL meta). Files without a real source (eat-drink, melaka, penang-heritage,
  mamak-culture, etc.) left untouched — faithful, nothing fabricated.
- Re-uploaded all 159 with replace=1 (per-file size verified) + content hash spot-checks
  on enriched files: **ALL PASS**. Local staging: /var/home/maarten/brilliant-export +
  /var/home/maarten/brilliant-migration/{export_brilliant,upload_to_seafile,enrich,deploy_changes}.py,
  change log: brilliant-export/changes.json.

**Phase 3 (2026-09-18): SKILL/MEMORY rebase + SPO-trigger automation.**
- Brilliant references replaced across gateway + dev44 + server skills (the KB-access
  refs now point at Seafile; Brilliant MCP/health/credential notes marked historical).
- New skill `seafile-kb-assistant` = canonical KB access + mandatory SOP-trigger rule:
  any mention of pricing/terms/policy/process changes → IMMEDIATELY file a dated entry
  in `sops/pending-updates.md` (`status: pending`); trigger table inside the skill.
- kb-v2 is a git repo (nightly `kb-sync.sh` → Payload sync → enrich → reorg → commit →
  Seafile re-upload; systemd user timer `kb-sync.timer` @ 02:45). `reorg.py` now
  preserves `.git` + `sops/pending-updates.md` across rebuilds.

**Verdict:** the "good enough now + actively improving + portable" trifecta that
Brilliant was supposed to be. Adopt for what it gives TODAY (versioning ✓, ACL via
plugins ✓, simplicity ✓, zero new infra ✓), treat the development as bonus, not the
reason. Remaining engineering: ~10-tool MCP/API read layer for agents (re-point
business-dashboard + KB skill from Brilliant API → Seafile API), optional Qdrant
indexing, decide old-markdown-library vs new-block-wiki per content type (files =
portable; sdoc = richer editor, markdown-exportable). Retirement: dump Brilliant
entries via REST → Seafile; kill the brilliant stack.

### Not recommended here
- **Outline as second-class**: now the top "both" candidate (official MCP); only skip it
   if the BUSL license or the extra Redis/worker runtime is a real objection.
- **Wiki.js / Docmost**: viable, but nothing they add beats BookStack's maturity for
  this workload.
- **Onyx / AnythingLLM / Khoj**: wrong shape (search/RAG/PKM), no real versioning.

## 5. Migration sketch (Brilliant → target)

1. **Export:** `GET /entries` (paginated) from `brilliant.system.simplyenak.com` → one
   markdown file per entry, folder = `logical_path`; keep `content_type`/tags metadata.
2. **Locate the API key** first: it is NOT in the server's `site/.env` (401 observed);
   it lives in PyRunner secrets / cron env (business-dashboard finds it today).
3. **Import:** Note book = top path bucket, chapter = sub-path, page = entry; tag =
   `content_type`; or commit the markdown tree straight into Forgejo.
4. **Re-point consumers:** business-dashboard cron → BookStack REST (filter by tag) or
   Forgejo; rewrite `brilliant-kb-assistant` skill → BookStack/Forgejo reading skill;
   retire `brilliant-*` services + MCP bridge in Dokploy.
5. **Verify:** parity spot-check (entry counts, sample content diffs), cron green,
   agent reads succeed — then decommission.

## 6. Sources
- GitHub API: repo metadata, contributors, tags, commit cadence, tree (`thejeremyhodge/xireactor-brilliant`).
- Raw repo files: `db/migrations/*`, `api/services/audit.py`, `db/migrations/023_access_log.sql`.
- GitHub API metadata for candidate repos (stars/license/push dates).
- Local: Dokploy service listing, server clone git state, business-dashboard script,
  brilliant-kb-assistant skill.
- BookStack features/API/revisions: project documentation (bookstackapp.com; docs
  pages were 404/mobile-blocked on 2026-09-18 — revision-history and API claims are
  long-standing documented behavior, verify at bookstackapp.com/docs before committing).