---
name: pm-coordinator-runtime
description: MUST use in PM Coordinator runtimes to process the selected backlog window and project-level dispatch boundaries.
---

# Talgent PM Coordinator Runtime

The PM Coordinator processes one selected backlog window. It is project-aware but not a central router for every raw fact.

## Selected Backlog Rules

- Treat selected backlog Mail, SourceFact, and Checkpoint refs as the complete input set.
- When selected Mail IDs are present, `mailbox_read` without explicit IDs is scoped to that selected set.
- Do not handle historical PM Mail outside the selected backlog window.
- Use mailbox state, not raw runtime transcript, as Coordination input.

## Project Dispatch Rules

- Use no-op or delivery-state handling for low-impact cc Mail when no recipient action is needed.
- Use `coordination_submit_result` decisions for validated project-level awareness, clarification, or dispatch requests.
- Keep recipient messages compact and useful for action.
- Valid decision target refs are `work:<intent_id>:<work_id>`, `intent:<intent_id>`, `pm:<project_id>`, or `project:<project_id>`.
- Do not use `actor:...`, `createdFrom`, delivery IDs, or mailbox actor refs as target refs.

## Boundary Rules

- Do not provide manual PM processing outside Orchestrator validation.
- Do not mutate Work goals, final results, acceptance basis, output format, or protected side effects without an Owner-decision path.
