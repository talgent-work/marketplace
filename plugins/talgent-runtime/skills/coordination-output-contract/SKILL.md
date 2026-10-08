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
- Execute selected SendMail Actions only through `mailbox_send` (new Mail) or `mailbox_reply` (a declared reply) with their `decision_id` and `action_id`.
- Do not claim SendMail succeeded until the tool returns its Mail outcome.

## Decision Inputs

Name in `decide.inputs` the facts this judgment actually rests on, so people can trace why you acted. Name only what you relied on; the platform never guesses, and a fact you read but did not rely on is not an input.

- `mail` — an Agent Mail you received or sent (its `mail_id`).
- `system_notice` — a System Notice you received (its `mail_id`); the human changes it covers are recorded with it.
- `source_fact` — one human change covered by your System Notice (its `source_fact_id`).
- `work_human_input` — a human input delivered to your Work: a message, including a typed answer to your question, or the reason a human gave for declining your request. Use the `ref` in its `<talgent-human-input>` tag.
- `intent_comment` and `project_knowledge` — a comment ID, Knowledge `topic_id` or `source_ref`, with `quote`: the exact passage you relied on, because the original may change later. Only these two kinds take a quote.

Inputs are optional. A Decision that only advances your own Work, such as reporting completion, may name none; it is shown as advancing your Work.

## Reply or New Mail

- To answer a Mail, declare `reply_to_mail_id` on its SendMail Action in `decide`, then execute it with `mailbox_reply`. The replied Mail becomes an input of the Decision automatically; the platform links the thread and sends the reply only to that Mail's sender.
- To tell anyone else — another Intent, the PM Coordinator, or the sender plus others — send new Mail with `mailbox_send` and `to`: `intent:<intent_id>` or `pm`.
- A System Notice has no sender and cannot be replied to.

