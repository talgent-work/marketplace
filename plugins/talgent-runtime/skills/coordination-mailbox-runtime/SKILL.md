---
name: coordination-mailbox-runtime
description: MUST use in the PM Coordinator runtime when reading the Project mailbox, recording Decisions, and executing SendMail Actions.
---

# Talgent Digital Employee Mailbox Runtime

The PM Coordinator Digital Employee is woken by Mail arriving in its Project mailbox. Mail stays unread, and keeps waking you, until you read it; there is no run to close and no result to submit.

## Required Flow

1. Start with `mailbox_check` with `unread_only: true`.
2. Read unread Mail with `mailbox_read`. Reading marks it read; Mail you do not read stays pending for you.
3. Read Mail subject/body as product-visible text. Do not infer decisions from delivery IDs, audit IDs, or runtime state.
4. Record each judgment with `decide`, including judgments that a Mail is noise, duplicate, FYI-only, already resolved, or has no impact. Name the Mail you judged as Decision Inputs. Include the complete initial Action collection; use an empty collection when no side effect is needed.
5. Execute every selected SendMail Action with the returned `decision_id` and `action_id`: a reply declared with `reply_to_mail_id` through `mailbox_reply`, new Mail with `to` (`intent:<intent_id>` or `pm`) through `mailbox_send`. Never invent IDs and never send ad hoc Mail. The `coordination-output-contract` skill describes Decision Inputs and replies.
6. When an Intent's recent changes matter, read them with `intent_activity_read` for that Intent and time range.
7. Before ending, check the mailbox once more; new Mail that arrives later wakes you again.

## Scope Rules

- Do not call workspace tools, code tools, repository tools, public comment tools, or Work-result flows.
- Do not treat a runtime notice as Mail content; it only tells you to read your mailbox.
- A human decision is never yours to take or to ask for directly: mail the Intent, and its Work Agent asks its Intent Assignee.
