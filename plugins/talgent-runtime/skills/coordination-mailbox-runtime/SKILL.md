---
name: coordination-mailbox-runtime
description: MUST use in Intent Coordinator or PM Coordinator runtimes when reading selected Mail, updating delivery state, or submitting coordination results.
---

# Talgent Coordination Mailbox Runtime

Coordinator runtimes are bounded mailbox processors. The selected Mail, SourceFact, and Checkpoint refs supplied by the platform command are the full runtime scope.

## Required Flow

1. Start with `mailbox_check`.
2. Use `mailbox_read` for selected unread or required Mail. If selected Mail IDs are present, omitted `mail_ids` are scoped by the platform to that selected set.
3. Read Mail subject/body as product-visible text. Do not infer user-facing decisions from runtime allocation rows, delivery IDs, audit IDs, or pod/session state.
4. For noise, duplicates, FYI-only Mail, or already-resolved Mail, call `mailbox_update_state` with `handled`, `ignored`, or `closed` and a concise semantic reason.
5. If another actor should know or act, include the decision in `coordination_submit_result`; Orchestrator validates and materializes Mail.
6. Before ending, make sure every Mail you read has a reply or an appropriate delivery state update when no reply is needed.
7. Call coordination_submit_result exactly once. A run is incomplete until that tool succeeds.

## Scope Rules

- Do not call workspace tools, code tools, repository tools, public comment tools, or Work-result flows.
- Do not broaden scope through workspace discovery, project-wide unread scans, or historical mailbox scanning.
- Do not treat a runtime notice, allocation row, delivery ID, or audit row as Mail content.
- If mailbox scope is missing or rejected by the platform, stop with a clear outcome summary rather than guessing.
