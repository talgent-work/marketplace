---
name: coordination-output-contract
description: MUST use in Digital Employee runtimes before writing Decision conclusions, SendMail subject/body text, or structured recipients.
---

# Talgent Coordination Output Contract

Mail subject and body are product-visible text in Project and Intent mailboxes. Write for project members, not for internal debugging.

## Human-Readable Text

- Keep subjects short and human-readable.
- Keep bodies useful, specific, and semantic.
- Use labels such as PM Coordinator, Work Agent, selected Intent, or current project when a human-readable name is unavailable.

## Raw Ref Boundary

Do not put raw IDs in subject or body:

- Project, Intent, or Work IDs
- Mail or delivery IDs
- SourceFact IDs
- runtime, sandbox, request, or tool IDs
- UUIDs or shortened UUID fragments

Put provenance in structured fields such as `to`, `related_intent_ids`, `related_agent_work_ids`, or `related_source_fact_ids`. If only a raw ID is available, refer to the selected Intent, current project, or Mail subject instead of quoting the ID.

## Decision and Action Contract

- Record every judgment with `decide`, including no-effect judgments.
- Use an empty Action collection when no product side effect is selected; do not invent a Noop Action.
- Execute selected SendMail Actions only through `mailbox_send` with their `decision_id` and `action_id`.
- Do not claim SendMail succeeded until `mailbox_send` returns its Mail outcome.
