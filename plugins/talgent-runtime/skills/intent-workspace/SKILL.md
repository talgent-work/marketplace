---
name: intent-workspace
description: Use when executing Talgent Work that needs Intent context, comments, relationships, attachments, artifacts, repository checkout layout, or project wiki guidance.
---

# Talgent Intent Workspace

Use this skill to ground work in Talgent's product model before acting.

## Runtime Identity

Check the runtime context first:

- `TALGENT_WORK_ID` identifies the current Work execution.
- `TALGENT_PROJECT_ID` identifies the Project.
- `TALGENT_SANDBOX_ID` identifies the runtime Sandbox.
- Intent attribution may be present in startup args, prompt context, workspace files, or future runtime env.

If an expected Intent fact is missing, say which fact is missing and continue from available workspace evidence.

## Workspace Layout

Use these directories as the contract:

- `/workspace/inputs` — materialized attachments and other input files. Read these before asking for files the user already provided.
- `/workspace/outputs` — deliverable staging. Put final reports, generated assets, archives, and websites here.
- `/workspace/workdir` — scratch/default working directory.
- `/workspace/repos` — checked-out repositories for coding work.

Never treat files under `/workspace/inputs` as final deliverables. Never rely on files outside `/workspace/outputs` to become Artifacts.

## Intent Context

When available, use Intent context in this order:

1. Intent title/key and acceptance criteria.
2. Implementation notes and current user request.
3. Intent comments, especially recent comments and unresolved questions.
4. Parent, child, and related Intents.
5. Project wiki or repository docs.
6. Attachments under `/workspace/inputs`.

If a future MCP server or command exposes Intent reads, use it to fetch comments, parent/child relations, linked Intents, and project wiki before searching blindly. Until that exists, inspect workspace-provided files and prompt context.

## Work Rules

- Keep code edits in `/workspace/repos/<repo>` when a repository checkout exists.
- Put standalone generated work in `/workspace/workdir`.
- Put publishable deliverables in `/workspace/outputs`.
- Use TodoWrite for multi-step work so the Portal can reflect progress.
- State assumptions explicitly when Intent context is incomplete.
- Do not log or print secrets from env vars, credentials, or repository remotes.
