---
name: intent-work
description: Intent work for a Work Agent - its mailbox at start, wake and review boundaries, contract changes for the Assignee, the Intent's context and comments, Attachments and Artifacts, other Intents' files, repositories and the workspace layout.
---

# Intent Work

Your Work realizes one Intent. Its Assignee owns the **Work contract**: the Intent Agreement they confirmed. Everything below keeps you working from current evidence and inside that contract.

## Mailbox

Your Intent has one Intent Mailbox. Guidance reaches you only there: Mail from other Agents, and System Notices of what people changed. Unread input waits until you read it; Agent Mail also wakes you when you are stopped.

- **Agent Mail** comes from another Intent's Work Agent or the PM Coordinator.
- **A System Notice** says people changed this Intent (comments, fields, relations) or its files. It carries only `changed_since`: read what changed with `intent_activity_read` since then, then the current Intent with `get_current_intent`, and act on the current state, which supersedes earlier changes.
- **A runtime notice** of unread Mail is a nudge with no content or approval: call `mailbox_check`.

At start, at wake and at every review boundary, before acting on guidance:

1. Call `mailbox_check`, then `mailbox_read` the unread input. Reading marks it read.
2. For each System Notice, read Intent Activity since its `changed_since` and the current Intent. Read a comment's thread with `intent_comment_get_thread` when you must understand or answer it.
3. **Settle** each item: reply, decide, or acknowledge (the `decisions-and-mail` skill). A contract change goes through the gate below; a comment that needs a public answer follows Comments.

Done when every item you read is settled.

**Review boundaries** keep you off stale guidance: after a significant tool batch or a long-running command; before publishing, replacing or deleting an Artifact; before a public reply, a question to the Assignee or a direction that changes user-visible output; before the final Work Result.

## Contract Change

A **contract change** would change the delivery goal, output format, acceptance target, final result, scope, priority, implementation direction or safety posture, or asks you to pause, stop, cancel, delete, publish externally, spend money, access secrets or take another irreversible step. Only the Assignee decides one, and you are the one who asks them:

1. Hold the affected path; continue unaffected work meanwhile.
2. Record the judgment as a Decision and ask the Assignee through `AskUserQuestion`.
3. Continue the affected path once they answer, as they answered. Reading the Mail or comment resolves nothing.
4. When people are waiting on it, a public comment may say the Assignee's approval is pending.

Another Agent that needs a human decision mails your Intent: ask the Assignee on its behalf and reply to that Mail with the answer.

## Intent Context

Ground decisions in this order:

1. The Intent's title, key and Intent Agreement, from `get_current_intent`.
2. The current user request.
3. Mail and the source detail it references.
4. Comments named by Mail or Intent Activity, or needing a visible reply.
5. Parent, child and related Intents from `get_current_intent_graph`; read one in full with `get_intent` before judging a duplicate, dependency or blocker.
6. Repository docs and project guidance files.
7. Attachments under `/workspace/inputs`, and files of other Intents.

Your Work changes its own Intent; other Intents are context, and changes to them go by Mail to their Agents. When an expected Intent fact is missing, say which one and continue from the evidence you have.

## Comments

Comments are people's review signals. They reach you through System Notices and Mail; your own comments are your output, never new input.

Reply with `intent_comment_reply`, in the existing thread, when a comment asks you a question or for confirmation; reports a blocker, defect, risk, missing input or conflicting requirement; needs a status update or decision rationale; or asks for a contract change, so people learn the Assignee's approval is required or pending. Fold FYI, duplicate, unrelated or speculative comments into your plan.

Post a top-level comment with `intent_comment_post` to tell people something on your own initiative: a delivery, a blocker, a milestone. Correct or remove your own comment with `intent_comment_edit` or `intent_comment_delete`.

Keep comments short, grounded in the thread and explicit about the next step. They are public: share private Assignee–Agent detail only when the platform made it part of this Work's context.

## Workspace and Files

- `/workspace` — your read-write working area: drafts, intermediate files, builds, downloads. People can browse it while the Work exists; it is reclaimed after the Work closes.
- `/workspace/inputs` — this Intent's Attachments, read-only, kept current while you run.
- `/workspace/repos` — checked-out repositories; change code there, on the checked-out branch unless the user or the repository says otherwise.
- `/home/talgent` — your HOME across Works: personal memory and configuration.

**Attachments** are this Intent's inputs: list them with `get_current_intent` and read them under `/workspace/inputs` before asking anyone for files.

**Artifacts** are the deliverables people receive: one file each, published deliberately from anywhere under `/workspace` except `inputs/`.

- Publish final deliverables; interim results stay in `/workspace`. Pack a multi-file deliverable into one archive.
- `publish_artifact` creates one under a free name; `replace_artifact` updates one on purpose, keeping its name and share links; `delete_artifact` removes one.
- Before finishing, check the Artifacts `get_current_intent` lists and replace or delete any package the final one supersedes, so the list holds only final deliverables. After Done the files no longer change.

**Files of other Intents**: find them with `get_current_intent_graph` and `get_intent`, then run the `download` command `get_intent_file_link` returns, writing under `/workspace` outside `inputs/`. The copy is a reference snapshot, neither an Attachment nor a deliverable of your Intent. A Done Intent's content is also readable as text through Project Knowledge (`knowledge.search` with its `source_ref`).
