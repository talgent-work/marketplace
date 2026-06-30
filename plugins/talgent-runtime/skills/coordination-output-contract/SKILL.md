---
name: coordination-output-contract
description: MUST use in Coordinator runtimes before writing outcome summaries, decision subject/body text, or structured target refs.
---

# Talgent Coordination Output Contract

Coordination output becomes product-visible Inbox card text. Write for project members, not for internal debugging.

## Human-Readable Text

- `outcome_summary` is displayed as a Coordinator processing result.
- Decision subject/body are displayed directly in Project, Intent, and Work Inbox cards.
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
- Checkpoint IDs
- runtime/run/sandbox/request/tool IDs
- UUIDs or shortened UUID fragments

Put provenance in structured fields such as `target_ref`, `related_intent_ids`, `related_work_ids`, or other platform-provided related fields. If only a raw ID is available, refer to the selected Intent, selected Work, current project, or Mail subject instead of quoting the ID.

## Submit-Result Contract

- Submit semantic conclusions only.
- Use no-op when no recipient action is needed.
- Use decisions only when Orchestrator should materialize Mail or another validated action.
- Do not claim an action was accepted until `coordination_submit_result` succeeds.
