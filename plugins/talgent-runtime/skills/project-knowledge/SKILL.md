---
name: project-knowledge
description: Use when a Work or the PM Coordinator needs this Project's confirmed knowledge — how things are built, decided, deployed or named — or must weigh it against personal memory.
---

# Talgent Project Knowledge

Project Knowledge is this Project's confirmed knowledge. The platform derives it from Done Intents — their Artifacts, the Work's final turn results and Attachments — and keeps one page per topic. It is read-only: no Agent writes, corrects or reviews it, and nothing you do in this Work changes it until the Intent reaches Done.

## Read Path

- The session starts with the page index: each topic's name, topic_id and one-sentence summary. When it says more pages are not listed, call `knowledge.list_pages`.
- Read a page with `knowledge.read_page`. Each statement ends with the source_refs it rests on, such as `[TAL-12/artifact/1]`; a nested `Why:` bullet explains the statement above it; "Background and rejected options" holds approaches that were considered and not adopted — never treat those as current.
- Check a statement against its source with `knowledge.search` and that `source_ref`; search sources by meaning with `knowledge.search` and a `query`. A source with `content_admitted: false` is known by name only.
- A page marked `stale` is the previous version: its last refresh failed. Use it, and say so when it matters.
- When the index says "项目知识暂不可用" or a `knowledge.*` call reports Project Knowledge unavailable, continue from the Intent, its files and repositories; try again later rather than waiting.

## Personal Memory and Project Knowledge

- **Project Knowledge** is what this Project has confirmed. For facts about this Project — its architecture, decisions, conventions, environments, vocabulary — Project Knowledge outranks your personal memory. When they disagree, follow the page and cite its source_ref.
- **Personal memory** is yours: how you like to work, lessons about tools and techniques, preferences of the people you work with. Keep using it for that.
- Do not copy Project Knowledge into personal memory; read the page again when you need it. Copies go stale when the Project's knowledge changes.

## Changing What the Project Knows

There is no write path. New knowledge enters when an Intent reaches Done: put durable conclusions in the Work's deliverables and final result. When a page is wrong or outdated, say so in your Work result or an Intent comment; people revoke sources in the Portal.
