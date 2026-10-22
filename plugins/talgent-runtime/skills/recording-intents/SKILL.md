---
name: recording-intents
description: Record new work as an Intent, placing it without deciding its Agreement. Use when creating child Intents from an approved plan, recording work nobody holds, or adding the work a confirmed hand-off lists.
---

# Recording Intents

An Intent belongs to whoever takes it. You record it and place it; its Assignee and their Agent settle what it means.

## Steps

1. **Look first.** Read the Intents that could already hold the work: your Intent's relations, or the Project's Intents. Recording twice records two.
2. **Record it** under an Action of `talgent-runtime:deciding`. Give it:
   - its title: one sentence saying what needs doing and for whom, in the words of the person who wants it;
   - its Assignee, only as approved or named; otherwise people take it;
   - its Areas and its Cycle, or the pool;
   - its relations: what it depends on, what depends on it, what it belongs with.
3. **Hand it its context** (`talgent-runtime:handing-off`): why it exists and what it is for. A child may receive the parent's relevant criteria and Boundary as material for its Agreement. Its Goal, Acceptance Criteria and Boundary are its Assignee's to confirm.
4. **Tell who it touches**: the Intents it relates to, and the PM Coordinator when you are a Work Agent.

Done when every new Intent exists once, placed and related, and its context is handed over.
