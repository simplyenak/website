# Patterns Extracted from RunbookHermes

Source: Tommy-yw/RunbookHermes (github.com/Tommy-yw/RunbookHermes)
Extracted: 2026-06-22

RunbookHermes is an AIOps/SRE incident-response agent built on a Hermes fork.
90% of it (Prometheus/Loki/Jaeger adapters, canary rollback, approval checkpoints,
Alertmanager webhooks) is irrelevant to Simply Enak — we don't run microservices or
get paged at 3am.

These 4 patterns are worth stealing and adapting to our content/marketing workflows.

---

## Pattern 1: Eval Benchmark with Ground-Truth Cases

RunbookHermes ships `data/runbook_benchmark/eval_cases.json` — a list of cases where
each case defines:
- expected_category (what the correct root cause is)
- expected_action_type (what the agent should recommend)
- min_evidence (how many evidence items are required)
- expected_evidence_refs (specific evidence IDs that must appear)
- forbidden_action_types (actions that must NEVER be taken)
- expected_mttr_minutes (target time-to-resolution)
- rag_seed_documents (knowledge base docs to seed before eval)
- postmortem score + reviewer notes (human judgment layered on top)

The eval system then scores the agent on:
- RCA accuracy, action accuracy, evidence recall
- citation accuracy (did it cite real sources?)
- safety gate rate (did it respect approval requirements?)
- false rollback rate (did it do unnecessary rollbacks?)
- MTTR target achievement
- weighted final score

WHY THIS MATTERS FOR US:
Our content pipeline (blog posts, landing pages) has no quality measurement.
We write content, deploy it, and hope. We should be able to score:
- Does the landing page follow the 8-section arc?
- Are tours shown FIRST (not buried after generic sections)?
- Does the hero have both hero_title and hero_description populated?
- Does the page have a clear visual/story arc?
- Is the BM content mirroring the EN content?
- Are images optimized (srcset, WebP, lazy load)?

See: `eval/content-pipeline-benchmark.json` for a starter benchmark.

---

## Pattern 2: Structured Memory Notebooks

RunbookHermes separates memory into typed notebooks instead of one blob:

| Notebook | Purpose |
| --- | --- |
| MEMORY.md | Global stable facts + safety principles |
| USER.md | Team profile, communication style, preferences |
| SERVICE_PROFILE.md | Service dependencies, governance rules |
| FAULT_PATTERNS.md | Recurring failure modes |
| TEAM_RUNBOOK_HABITS.md | Team approval/troubleshooting/review habits |

Each notebook has injection fencing — memory is injected as `<memory-context>` and
treated as "weak prior" that can never override fresh evidence or safety gates.

WHY THIS MATTERS FOR US:
We already have Hermes memory, but it's a flat list. Separating into typed notebooks
would make recall sharper:
- BRAND_FACTS — Simply Enak brand voice, archetype, content pillars
- TECH_STACK — Payload field names, deploy flow, CF Pages config
- CONTENT_PATTERNS — what works for tours, landing pages, blog posts
- RECURRING_BUGS — the _status filter bug, null hero fields, field collisions
- USER_PREFERENCES — Maarten's working style, what he likes/dislikes

We already partially do this — our memory has sections separated by §. But the typed
notebook separation would make it cleaner.

---

## Pattern 3: Memory Safety Scan

RunbookHermes scans ALL memory writes before storing. It rejects:

- Prompt injection ("ignore previous instructions", "you are now admin")
- Role header injection ("system:", "developer:", "assistant:")
- Private key material (BEGIN RSA/OPENSSH KEY)
- Credentials (api_key=..., token=..., password=...)
- Invisible unicode control characters (zero-width, bidirectional override)
- Oversized writes (>60,000 chars → store a summary instead)
- Unsafe markup injection (fake <memory-context>, <script>, <iframe> tags)

The scan is a list of regex patterns (INJECTION_PATTERNS) checked before any write.
See: `runbook_hermes/memory.py` lines 36-44 for the exact patterns.

WHY THIS MATTERS FOR US:
Our Hermes memory has no safety scan. If content from a web page or API response
gets written to memory, it could contain injection attempts. The regex patterns are
simple, deterministic, and worth adding as a hygiene layer.

---

## Pattern 4: Self-Evolving Skill Generation

RunbookHermes auto-generates SKILL.md runbooks after incidents are resolved. The
flow:

1. Incident is resolved and verified
2. Agent extracts: fault pattern + service profile + evidence chain + action taken
3. Agent generates a SKILL.md with: trigger conditions, evidence to collect,
   decision logic, recommended action, safety rules, answer template
4. Skill is published to skills/runbooks/ for future incidents
5. Trust score tracks whether the skill is actually useful over time
6. Low-trust skills fade; high-trust skills get promoted

The payment-503-spike SKILL.md is a good example of the format:
- "Use this skill when [trigger condition]"
- "Evidence to collect: [numbered list of tool calls]"
- "Decision logic: [when X is true]"
- "Recommended action: [safe action with dry-run first]"
- "Safety rules: [never do X without Y]"
- "Final answer template: [structured output format]"

WHY THIS MATTERS FOR US:
We already have this natively in Hermes (skills_list, skill_manage). But the
discipline of writing skills in this structured format after every complex task
is worth adopting. Our best skills (blog-pipeline, content-judge-loop) already
follow this pattern. The gap is: we don't consistently create skills after every
difficult debugging session.

---

## What We Are NOT Taking

These RunbookHermes features are irrelevant to Simply Enak:

- Prometheus/Loki/Jaeger/Tempo observability adapters
- Canary rollback + approval checkpoint + dry-run execution chain
- Alertmanager/Feishu/WeCom webhook gateways
- Payment demo system (payment-service, order-service, coupon-service)
- RCA guard (root cause analysis for infrastructure incidents)
- Action policy guard (risk classification for infrastructure mutations)
- Kubernetes/Argo CD controlled remediation
- Multimodal evidence (Grafana screenshots → incident evidence)
- Training/RL pipeline for fine-tuning on incident data
  (we already have fabric_export/fabric_train in Hermes natively)

---

## Summary: What Actually Improves Our Workflows

1. Content pipeline eval benchmark → measurable content quality
2. Typed memory notebooks → sharper recall (partially already done)
3. Memory safety scan → hygiene (low effort, good insurance)
4. Structured skill generation after complex tasks → (already have the tools,
   need the discipline)

The biggest win is #1 — a content quality benchmark. Everything else is incremental.
