---
name: intent-workspace
description: Use when executing Talgent Work that needs Intent context, comments, relationships, attachments, artifacts, repository checkout layout, or project wiki guidance.
---

# Talgent Intent Workspace

Use this skill to ground work in Talgent's product model before acting.

## Runtime Identity

Use the `talgent-runtime` MCP context first:

1. Use `get_current_intent`.
2. Inspect `/workspace/inputs` for attachments listed by the current Intent payload.
3. Use `list_current_intent_comments` for comments and then `mark_current_intent_comments_read` for comments you read.
4. Use `get_current_intent_graph` when dependency, parent/child, or related Intent context can affect scope.
5. Write deliverables under `/workspace/outputs`.
6. Use `reply_current_intent_comment` when a visible platform reply is appropriate.

If an expected Intent fact is missing from MCP, say which fact is missing and continue from available workspace evidence.

## Workspace Layout

Use these directories as the contract:

- `/workspace/inputs` — materialized attachments and other input files. Read these before asking for files the user already provided.
- `/workspace/outputs` — deliverable staging. Put final reports, generated assets, archives, and websites here.
- `/workspace` — scratch area for transient files that do not need to become Artifacts.
- `/workspace/repos` — checked-out repositories for coding work.

Never treat files under `/workspace/inputs` as final deliverables. Never rely on files outside `/workspace/outputs` to become Artifacts.

## Intent Context

When available, use Intent context in this order:

1. Intent title/key and description.
2. Current user request.
3. Intent comments, especially recent comments and unresolved questions.
4. Parent, child, and related Intents from `get_current_intent_graph`.
5. Project wiki or repository docs.
6. Attachments under `/workspace/inputs`.

Use MCP to fetch comments, parent/child relations, and linked Intents before searching blindly.

Stay scoped to the current Intent. Use linked Intents to understand dependencies and history, but do not modify, comment on, or treat another Intent as the active Work target unless the user or platform explicitly directs that.

## Work Rules

- Keep code edits in `/workspace/repos/<repo>` when a repository checkout exists.
- Put transient generated work in `/workspace`.
- Put publishable deliverables in `/workspace/outputs`.
- Use TodoWrite for multi-step work so the Portal can reflect progress.
- State assumptions explicitly when Intent context is incomplete.
- Create a current-Intent comment for important decisions, blockers, missing required context, and milestone-level progress when an Intent comment tool or MCP is available.
- Do not list, dump, log, or print secrets from env vars, credentials, repository remotes, SSH keys, tokens, or auth files. Read only platform-named non-secret identity variables when needed.
