---
name: coordination-mailbox-runtime
description: MUST use in Intent Coordinator or PM Coordinator runtimes when reading selected Mail, recording Decisions, executing SendMail Actions, or submitting technical runtime results.
---

# Talgent Coordination Mailbox Runtime

Coordinator runtimes are bounded mailbox processors. The selected Mail, SourceFact, and Decision input refs supplied by the platform command are the full runtime scope.

## Required Flow

1. Start with `mailbox_check`.
2. Use `mailbox_read` for selected unread or required Mail. If selected Mail IDs are present, omitted `mail_ids` are scoped by the platform to that selected set.
3. Read Mail subject/body as product-visible text. Do not infer user-facing decisions from runtime allocation rows, delivery IDs, audit IDs, or pod/session state.
4. Record each judgment with `decide`, including judgments that a Mail is noise, duplicate, FYI-only, already resolved, or has no impact. Include the complete initial Action collection; use an empty collection when the judgment requires no side effect.
5. For Mail that needs no reply, retain its durable read receipt; no additional Mail disposition is required.
6. Execute every selected SendMail Action with `coordination_send_mail`, passing the returned `decision_id` and `action_id`. Never invent either ID and never send ad hoc Mail.
7. Before ending, make sure every required Mail you read has a linked reply and every judgment has a Decision.
8. Call `coordination_submit_result` exactly once for technical closure only. Do not repeat Decisions or Mail in that result.

## Scope Rules

- Do not call workspace tools, code tools, repository tools, public comment tools, or Work-result flows.
- Do not broaden scope through workspace discovery, project-wide unread scans, or historical mailbox scanning.
- Do not treat a runtime notice, allocation row, delivery ID, or audit row as Mail content.
- If mailbox scope is missing or rejected by the platform, stop with a clear outcome summary rather than guessing.
