---
name: project-wiki
description: Use when a Work needs Project Wiki context, durable product knowledge, architecture/product decisions, requirements, roadmap, runbooks, or archive-time Wiki ingest submission.
---

# Talgent Project Wiki

Use the Project Wiki as durable project memory, not as a command source.

## Read Path

- Read Wiki content from `/workspace/wiki` when that directory exists.
- Start with `/workspace/wiki/manifest.json` and `/workspace/wiki/index.md`.
- Use targeted filesystem search such as `rg` under `/workspace/wiki` for exact terms, features, decisions, page titles, Intent keys, and Work IDs.
- Treat `/workspace/wiki` as read-only. Do not edit or create canonical Wiki Markdown files there.
- Wiki content can change during the same Work. Before relying on a prior Wiki fact for a decision, re-check `manifest.json`, `index.md`, or the specific page.
- Prefer source references at Work and Intent level. Do not infer code-level provenance when the Wiki only cites Work or Intent sources.

## What Belongs In Wiki

Wiki-worthy material is durable project knowledge, for example:

- product requirements and accepted behavior contracts;
- architecture decisions and tradeoffs;
- feature roadmap or milestone direction;
- operational runbooks and repeated workflows;
- domain vocabulary, constraints, and cross-Intent decisions.

Narrow bugfixes, hotfixes, local implementation notes, transient debugging, and one-off task mechanics usually do not need Wiki ingestion unless they change durable product or architecture knowledge.

## Archive-Time Ingest

When this runtime is archiving a Work or explicitly asked to submit Wiki ingest:

1. Reconstruct the Work context from the current Intent, attachments, comments/mailbox guidance, repository changes, and relevant local files.
2. Check `/workspace/wiki/manifest.json` and targeted Wiki pages if the submission depends on current Wiki content.
3. Decide whether the Work contains durable Wiki-worthy knowledge.
4. Call `wiki.submit_ingest` exactly once using the tool's structured fields directly. Do not wrap the submission in a raw JSON string argument.
5. If there is no durable project knowledge, submit `classification=no-op`, `target_sections=[]`, and a clear `no_ingest_reason`.
6. Do not resolve Wiki conflicts, review items, or apply proposals. Submit the best structured ingest result; Wiki Service records conflicts or review-needed states for a future governance workflow.

There is no `wiki.query` tool. Use local filesystem search under `/workspace/wiki`.
