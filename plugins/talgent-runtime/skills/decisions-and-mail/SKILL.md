---
name: decisions-and-mail
description: Use before calling `decide` or writing Mail - which Action each side effect is, which facts a Decision names as inputs, reply versus new Mail, and how Mail text reads to people.
---

# Decisions and Mail

Every product side effect is an Action of a recorded Decision. Call `decide` with the judgment, the inputs it rests on and the complete list of Actions it selects; then pass the returned `decision_id` and `action_id` to the tool that executes each Action. Retrying the same Action returns its first result. Report an Action as done only from that tool's result.

A judgment with no side effect is still a Decision, with an empty Action list: noise, duplicates, FYI and already-resolved items get one too.

Reads take no Decision: mailbox checks and reads, Intent Activity, Intent and graph queries, Project Knowledge, the Project Brief and file downloads.

## Actions

| Action | Executed by |
| --- | --- |
| SendMail | `mailbox_reply` for a declared reply, `mailbox_send` for new Mail |
| PostIntentComment | `intent_comment_reply` |
| PublishArtifact, ReplaceArtifact, DeleteArtifact | `publish_artifact`, `replace_artifact`, `delete_artifact` |
| AdvanceIntentStatus | `advance_intent_status` |
| ReviseIntentAgreement | `revise_intent_agreement` |
| DeclareCriterionMet, WithdrawCriterionDeclaration | `declare_criterion_met`, `withdraw_criterion_declaration` |
| CreateChildIntent, AddIntentRelation | `create_child_intent`, `add_intent_relation` |

Your runtime offers the tools of the Actions you may take.

## Decision Inputs

Name in `decide.inputs` the facts this judgment actually rests on, so people can trace why you acted. Name only what you relied on; the platform never guesses, and a fact you read but did not rely on is not an input.

- `mail` — an Agent Mail you received or sent (its `mail_id`).
- `system_notice` — a System Notice you received (its `mail_id`); the human changes it covers are recorded with it.
- `source_fact` — one human change covered by your System Notice (its `source_fact_id`).
- `work_human_input` — a human input delivered to your Work: a message, a human's answer to your `AskUserQuestion`, or the reason a human gave for declining your request. Use the `ref` in its `<talgent-human-input>` tag.
- `intent_comment` and `project_knowledge` — a comment ID, Knowledge `topic_id` or `source_ref`, with `quote`: the exact passage you relied on, because the original may change later. Only these two kinds take a quote.

Inputs are optional. A Decision that only advances your own Work, such as reporting completion, may name none; it is shown as advancing your Work.

## Reply or New Mail

- To answer a Mail, declare `reply_to_mail_id` on its SendMail Action in `decide`, then execute it with `mailbox_reply`. The replied Mail becomes an input of the Decision automatically; the platform links the thread and sends the reply only to that Mail's sender.
- To tell anyone else — another Intent, the PM Coordinator, or the sender plus others — send new Mail with `mailbox_send` and `to`: `intent:<intent_id>` or `pm`.
- A System Notice has no sender and cannot be replied to.

## Mail Text

Subject and body are what project members read in their mailboxes. Write a short, human-readable subject and a specific, useful body that states the reason, who it affects and the next action.

Keep provenance in the structured fields (`to`, `related_intent_ids`, `related_agent_work_ids`, `related_source_fact_ids`) and refer to things by name in the text: the Intent's key or title, the Mail's subject, "the PM Coordinator", "this Project". Raw references stay out of the text: Project, Intent, Work, Mail, delivery and SourceFact IDs, runtime, sandbox, request and tool IDs, and any UUID or fragment of one.
