---
name: decisions-and-mail
description: Decisions, Actions and Mail - deciding, pursuing and reporting an Action's purpose, citing the Assignee's confirmation, settling input by reply, Decision or acknowledgement, plain Mail versus Mail for a purpose, notifying affected Intents, and Mail text.
---

# Decisions and Mail

People read your Decisions to see what you judged and why. Record a Decision for **judgment**: the reasoning behind a change to a product entity, or a judgment that matters on its own, such as switching approach midway. Input you only take note of is acknowledged instead.

## Decide

Call `decide` with the conclusion, a short rationale, the facts it rests on as inputs, and the Actions it sets out to achieve. An **Action is a purpose**, in your words — "Agree the Agreement with the Assignee", "Tell the client team the API moved" — never a single tool call. The same purpose pursued by other means stays one Action; a different purpose takes a new Decision. A Decision with no Actions is finished at once.

**Inputs** name the facts the judgment actually rests on, so people can trace why you acted:

- `mail` — an Agent Mail you received or sent (`mail_id`).
- `system_notice` — a System Notice you received (`mail_id`); the human changes it covers come with it.
- `source_fact` — one human change covered by your System Notice (`source_fact_id`).
- `work_human_input` — a message to your Work, a human's answer to your `AskUserQuestion`, or the reason they gave for declining: the `ref` in its `<talgent-human-input>` tag.
- `intent_comment`, `project_knowledge` — a comment ID, Knowledge `topic_id` or `source_ref`, with `quote`: the exact passage you relied on, since the original may change. Only these two take a quote.

Inputs are optional; a Decision that only advances your own Work may name none.

## Pursue and Report

Every call that changes a product entity names its open Action with `decision_id` and `action_id`: status, Agreement and criteria, Areas, Cycle, relations, parents, new Intents, comments and Artifacts.

- Make as many calls as the purpose needs: retry after a failure, or change means. Each call is recorded against the Action.
- A refused call returns its owner's reason: correct what it names and call again, or judge the purpose unreachable.
- When the purpose is achieved or cannot be, call `report_action_outcome` with `succeeded` true or false and a one-line `account` of what the effects show. Failure may be reported before any call. You alone report an Action, once; afterwards it takes no further call.
- An Action may stay open across Turns while it waits, for example on an answer. Before each Turn ends you are shown your open Actions; `list_open_actions` shows them any time.
- A retried command meets its own semantics: creating a taken name is refused, replacing writes again, deleting what is gone succeeds. Creating an Intent twice creates two, so read the graph before retrying one.

Done when every Action whose purpose has ended is reported.

## Confirmation

A change that needs the Assignee's approval carries their answer: pass the `ref` of their answer to your `AskUserQuestion` as `confirmation_input_id`. The platform checks it is the Assignee's answer in this Work. One answer backs every change it approved, such as the Agreement and the move to Ready; ask again for anything it did not cover.

## Settling Input

Every Mail and System Notice you read is **settled** one of three ways:

- **Reply** with `mailbox_reply` and `reply_to_mail_id` when it asks you something. The reply goes to its sender, in its thread, and needs no Decision.
- **Decide**, naming it as an input, when it leads you to a change or a judgment that matters.
- **Acknowledge** with `mailbox_acknowledge` when you only take note: informational, duplicate, unrelated or already resolved.

People see read input that is not settled as having no follow-up. An acknowledged Mail can still be replied to or named as an input later. A System Notice has no sender; settle it by deciding or acknowledging.

## Plain Mail and Mail for a Purpose

- **Plain Mail** — a question, a factual answer, a routine report — goes out with `mailbox_send` alone.
- **Mail for a purpose** names the open Action it serves (`decision_id` with `action_id`), so the recipient's later judgment links back to yours.
- Address new Mail with `to`: `intent:<intent_id>` for an Intent's Work Agent, `pm` for the PM Coordinator.

## Notifying Affected Intents

A change that touches other Intents — a relation added or removed, Areas or Cycle changed, a parent set, a new Intent, or a scope, interface, approach, timing or deliverable they build on — is followed by Mail to each affected Intent saying what changed, why, and what it may need to revisit, as Mail for the same Action. A Work Agent finds them in `get_current_intent_graph` and reads each one whose work could rest on the change with `get_intent`; the PM Coordinator mails the Intents its change names. The platform leaves this to you; their people and Agents depend on it.

## Mail Text

Subject and body are what project members read. Write a short, human-readable subject and a specific body: the reason, who it affects, the next step. Name things as people know them — an Intent's key or title, a Mail's subject, "the PM Coordinator", "this Project" — and carry identifiers in the structured fields (`to`, `related_intent_ids`, `related_agent_work_ids`, `related_source_fact_ids`), which keep the text free of IDs and UUIDs.
