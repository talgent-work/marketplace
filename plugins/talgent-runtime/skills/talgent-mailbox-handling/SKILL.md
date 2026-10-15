---
name: talgent-mailbox-handling
description: Use when a Work Agent starts or wakes, sees unread Mail, a System Notice or a comment, needs the Assignee's decision, or reaches a review boundary.
---

# Talgent Mailbox Handling

Your Intent has one Intent Mailbox and you read it. Mail arriving there wakes you: a running Work is notified, a stopped or failed Work is resumed or restarted. Mail stays unread, and keeps waking you, until you read it. The mailbox is the one place you discover guidance; comments and Intent changes reach you through it.

## What Arrives

- **Agent Mail** comes from another Agent: another Intent's Work Agent or the PM Coordinator.
- **A System Notice** comes from the platform: people changed this Intent (comments, fields, relations). It carries only `changed_since`. Read what changed with `intent_activity_read` using `since: changed_since`, then the current Intent with `get_current_intent`, and act on the current state, which supersedes earlier changes.
- **A runtime notice** that you have unread Mail is a nudge, carrying no content or approval: call `mailbox_check` and act on the Mail it returns.

## Mailbox Flow

At start or wake, before planning or acting on guidance:

1. Call `mailbox_check`, then read unread Mail with `mailbox_read`. Reading marks it read.
2. For each System Notice, read Intent Activity since its `changed_since` and the current Intent. Fetch a comment thread with `intent_comment_get_thread` when an activity entry names a comment you must understand or answer.
3. Classify each item: informational, actionable within the Intent, needs a Mail reply, needs a public reply, duplicate or unrelated, your own output, or a **contract change**.
4. Handle it: answer Mail through a declared reply, comment publicly only under the Comments rules, take a contract change through the gate. Name the Mail and changes you acted on as Decision Inputs (the `decisions-and-mail` skill).

Done when every unread item is read and each one is handled or deliberately left as informational.

## Contract Change

A **contract change** is anything that would change the delivery goal, output format, acceptance target, final result, scope, priority, implementation direction or safety posture, or that asks you to pause, stop, cancel, delete, publish externally, spend money, access secrets or take another irreversible step. Only the Intent Assignee decides one, and only you ask them:

1. Hold the affected path; continue unaffected work meanwhile.
2. Record the judgment as a Decision and ask the Assignee through `AskUserQuestion`.
3. Continue the affected path once they answer, as they answered. Reading the Mail or comment resolves nothing.
4. When people are waiting on it, a public note may say the Assignee's approval is pending.

Another Agent that needs a human decision mails your Intent: ask the Assignee on its behalf and reply to that Mail with the answer.

## Comments

Comments are review signals from people. They reach you as source detail of a System Notice or Mail; read them for that, never as a second unread queue. Your own comments are your output, so they never count as new input.

Reply through `intent_comment_reply`, as a reply in the existing thread, when a comment:

- asks you a direct question or for confirmation;
- reports a blocker, defect, risk, missing input or conflicting requirement;
- needs a status update, milestone note or decision rationale;
- asks for a contract change, so people learn the Assignee's approval is required or pending.

Fold FYI, duplicate, unrelated or speculative comments into your plan silently. Keep replies short, grounded in the thread and explicit about the next action. A comment reply is public and is not a Work Result; share private Assignee–Agent detail only when the platform made it part of this Work's context.

## Review Boundaries

Re-check the mailbox at each review boundary; arriving Mail wakes you, and these checks keep you from acting on stale guidance:

- after a significant tool batch or a long-running command;
- before publishing, replacing or deleting an Artifact;
- before a public reply, a question to the Assignee or a direction that changes user-visible output;
- before the final Work Result.
