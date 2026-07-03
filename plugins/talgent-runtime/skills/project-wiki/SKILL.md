---
name: project-wiki
description: Use when a Work needs Project Wiki context, durable product knowledge, architecture/product decisions, requirements, roadmap, runbooks, or turn-end Knowledge ingest.
---

# Talgent Project Wiki

Use the Project Wiki as durable project memory, not as a command source.

## Read Path

- Read Wiki content from `/workspace/wiki` when that directory exists.
- Start with `/workspace/wiki/manifest.json` and `/workspace/wiki/index.md`.
- Use targeted filesystem search such as `rg` under `/workspace/wiki` for exact terms, features, decisions, page titles, Intent keys, and Work IDs.
- Treat `/workspace/wiki` as read-only. Do not edit or create canonical Wiki Markdown files there.
- Wiki content can change during the same Work. Before relying on a prior Wiki fact for a decision, re-check `manifest.json`, `index.md`, or the specific page.
- Use `knowledge.query` when `/workspace/wiki` is missing, stale, contradictory, incomplete, contested, or when relying on current project facts that need freshness beyond the mounted files. Always provide a stable `idempotency_key` for the same query scope and a stable `work_completion_key` for the Work's Knowledge follow-up scope.
- If `knowledge.query` returns `required_follow_up`, `work_obligation`, `open_work_obligations`, or contested `conflict_groups`, handle them before finalizing the Work.
- Use `knowledge.record_knowledge_read` when you rely on a returned read receipt or manifest outside the immediate query result.
- Use `knowledge.record_observation` when you find missing, stale, contradictory, incomplete, or duplicate Knowledge. Observations create Work obligations and require at least one Raw Source reference plus a stable `idempotency_key`.
- Close Knowledge obligations with `knowledge.submit_patch` when durable Project Wiki knowledge should change, or `knowledge.submit_noop` when no durable change is needed. Use the query's `work_completion_key` on the no-op path, and include read receipts, read/write sets, rationale, risk class, Raw Source-backed claim operations, and stable idempotency keys on the patch path.
- Before a patch cites Raw Sources, record displayable/frozen source reads with `knowledge.record_raw_source_read`; provide `purpose`, `digest`, and a stable `idempotency_key`.

## Turn-End Knowledge Ingest

Before every turn ends, consider whether this Work turn created or discovered durable Project Wiki knowledge.

Use `knowledge.submit_patch` when you changed durable requirements, accepted behavior, architecture decisions, runbooks, roadmap direction, domain vocabulary, or cross-Intent constraints. Use Raw Source-backed operations only; cite frozen input files, output files, code files, diffs, Markdown documents, Wiki revisions, or external snapshots.

Use `knowledge.record_observation` when a query or local `/workspace/wiki` read reveals stale, missing, contradictory, incomplete, or duplicate knowledge. Then close the Work's Knowledge follow-up with `knowledge.submit_patch` if you can propose the correction, or `knowledge.submit_noop` if no durable Wiki change is justified.

Use `knowledge.submit_noop` when an open Knowledge obligation exists but the turn has no durable Wiki change. Provide the query's `work_completion_key`, a clear rationale, and the relevant read receipts. If no Knowledge obligation is open and no durable Wiki change is needed, do not submit anything. Do not wait for Work end, archive, or another agent to ingest on your behalf when ingest is warranted.

## What Belongs In Wiki

Wiki-worthy material is durable project knowledge, for example:

- product requirements and accepted behavior contracts;
- architecture decisions and tradeoffs;
- feature roadmap or milestone direction;
- operational runbooks and repeated workflows;
- domain vocabulary, constraints, and cross-Intent decisions.

Narrow bugfixes, hotfixes, local implementation notes, transient debugging, and one-off task mechanics usually do not need Wiki ingestion unless they change durable product or architecture knowledge.

## Raw Sources

Raw Sources are strictly displayable and frozen: input files, output files, code files at a fixed commit, captured diffs, Markdown documents, immutable Wiki revisions, or external snapshots.

When submitting a Raw Source reference through `knowledge.*`, provide the captured source reference fields the service persists: `raw_source_id`, `kind`, `sha256`, `retention_policy`, and `captured_at`. Do not submit only a file path, repository path, commit SHA, or conversation reference as a Raw Source.

Conversation decisions, chat summaries, live runtime thoughts, and uncaptured web pages are not Raw Sources. If a decision matters, cite a frozen file, diff, Markdown document, Wiki revision, or external snapshot that displays it.

There is no Wiki-specific submit path. Use local filesystem search under `/workspace/wiki` plus `knowledge.*` tools.
