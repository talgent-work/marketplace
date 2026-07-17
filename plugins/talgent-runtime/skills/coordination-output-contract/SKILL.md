---
name: coordination-output-contract
description: MUST use in Coordinator runtimes before writing Decision conclusions, SendMail subject/body text, outcome summaries, or structured target refs.
---

# Talgent Coordination Output Contract

Coordination output becomes product-visible Inbox card text. Write for project members, not for internal debugging.

## Human-Readable Text

- `outcome_summary` is a display-safe technical closure summary, not a Decision or Mail processing result.
- SendMail subject/body are displayed directly in Project, Intent, and Work Inbox cards.
- Keep subjects short and human-readable.
- Keep bodies useful, specific, and semantic.
- Use actor labels such as Intent Coordinator, PM Coordinator, Work Agent, selected Work, selected Intent, or current project when a human-readable name is unavailable.

## Raw Ref Boundary

Do not put raw IDs in `outcome_summary`, subject, or body:

- Project IDs
- Intent IDs
- Work IDs
- Mail or delivery IDs
- SourceFact IDs
- legacy Checkpoint IDs that may appear in historical text
- runtime/run/sandbox/request/tool IDs
- UUIDs or shortened UUID fragments

Put provenance in structured fields such as `target_ref`, `related_intent_ids`, `related_work_ids`, or other platform-provided related fields. If only a raw ID is available, refer to the selected Intent, selected Work, current project, or Mail subject instead of quoting the ID.

## Decision and Action Contract

- Record every judgment with `decide`, including no-effect judgments.
- Use an empty Action collection when no product side effect is selected; do not invent a Noop Action.
- Execute selected SendMail Actions only through `coordination_send_mail` with their `decision_id` and `action_id`.
- `coordination_submit_result` is technical closure only and does not create Decisions, Actions, or Mail.
- Do not claim SendMail succeeded until `coordination_send_mail` returns its Mail outcome.
