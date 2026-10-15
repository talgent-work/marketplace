---
name: intent-workspace
description: Use when Talgent Work touches the Intent's context, its Attachments or Artifacts, other Intents and their files, repository checkouts, or the workspace layout.
---

# Talgent Intent Workspace

## Workspace Layout

- `/workspace` - your own read-write working area for this Work: drafts, intermediate files, build outputs, downloads. It is reclaimed after the Work closes; people can browse it while the Work exists.
- `/workspace/inputs` - this Intent's Attachments, read-only. Uploads and deletions show up here while you run.
- `/workspace/repos` - checked-out repositories. Make code changes there, on the checked-out branch unless the user or the repository clearly says otherwise.
- `/home/talgent` - your HOME, kept across Works: personal memory and configuration.

There is no `outputs/` directory: a file becomes an Artifact only when you publish it.

## Intent Context

Ground decisions in this order:

1. The Intent's title and key and its Intent Agreement, read with `get_current_intent`.
2. The current user request.
3. Mail and the source detail it references.
4. Comments named by Mail or Intent Activity, or needing a visible reply.
5. Parent, child and related Intents from `get_current_intent_graph`; read any of them in full with `get_intent` (by id or key) before judging a duplicate, dependency or blocker.
6. Repository docs and project guidance files.
7. Attachments under `/workspace/inputs`, and files of other Intents.

The current Work is bound to one Intent and acts on it alone; other Intents are context. When an expected Intent fact is missing, say which one and continue from the evidence you have.

## Intent Files

**Attachments** are this Intent's inputs: list them with `get_current_intent` and read them under `/workspace/inputs` before asking anyone for files they already provided. They are never deliverables.

**Artifacts** are the deliverables people receive. An Artifact is one file you published deliberately, from anywhere under `/workspace` except `inputs/`:

- Publish only final deliverables for people; interim results stay in `/workspace`, where people can browse them. Pack a multi-file deliverable into one archive: a directory cannot be published.
- `publish_artifact` creates a new Artifact and is refused when the name is taken. Use `replace_artifact` to update that Artifact on purpose (it keeps its name and share links), or choose another name. `delete_artifact` removes one. Each is an Action of a Decision.
- Before finishing, check the Artifacts `get_current_intent` lists and replace or delete any earlier package the final one supersedes, so the list holds only final deliverables. After the Intent is Done its files no longer change.

**Files of other Intents** of this Project: find them with `get_current_intent_graph` and `get_intent`, and copy one into your workspace with `download_intent_file`. The copy is a reference snapshot: it does not follow later changes and is neither an Attachment nor a deliverable of your Intent. A Done Intent's content can also be read as text through Project Knowledge (`knowledge.search` with its `source_ref`).

## Impact Notice

After a Decision that sets or changes something other Intents may build on (scope, an interface, the approach, timing, a deliverable replaced or dropped), find the affected Intents: read `get_current_intent_graph`, then `get_intent` for each parent, child or related Intent whose work could rest on it. Mail each affected Intent (`intent:<intent_id>`) what changed, why, and what it may need to revisit, naming that Decision as an input. When nothing in the graph rests on the change, the Decision stands alone.
