---
name: planning-intent
description: Plan a Backlog Intent with its Assignee - its Intent Agreement, whether it splits, its children and its relations - and move it to Ready: interview, confirm, move. Use whenever your Intent is in Backlog, or a change reopens its Agreement or plan before Ready.
---

# Planning an Intent

The title is the person's sentence; the Agreement and the plan are what it turns out to mean and how it is carried out. Planning runs in three steps: interview, confirm, move. Each step finishes before the next begins, because what is saved and recorded must be what the Assignee confirmed, and an Intent you create stays.

## Before asking

Read the Intent, its graph and its ancestors' Boundaries, the Areas it is in with their boundaries, the Cycle it belongs to, the Project Knowledge pages it touches, its Attachments and its repositories. They show where the fog lies: what the title leaves open, what the facts already fix, and where they disagree.

## 1. Interview

Interview the Assignee (`talgent-runtime:interviewing`) until each of these rests on their answers:

1. **Intent Goal**: the outcome and why it matters, in a sentence or two. It comes from the destination they named.
2. **Acceptance Criteria**: results that will each plainly hold or not when the work ends. They come from what the Assignee said they would point at to call it done.
3. **Deliverable's form**: what people will receive and in what form. It becomes a criterion or part of one.
4. **Intent Boundary**: what it will not do, and the constraints it keeps throughout. It comes from what they ruled out of scope.
5. **Split or not**: split when parts need other people or the whole outgrows this Work. A plan may have no children; splitting divides the work, never the Goal.
6. **Each child**: its one-sentence title, its Assignee, and what it contributes to this Intent.
7. **Relations**: Intents this one depends on, Intents that depend on it, and Intents it belongs with. Read each in full before calling it a dependency or a duplicate.

The Area boundaries and ancestors' Boundaries already bind the Intent. Leave them out of its Boundary.

Done when every part rests on their answers.

## 2. Confirm

1. Write the whole Agreement and plan as your message, in the Assignee's words where they gave them: the children, or that there are none, and the relations.
2. Ask with `AskUserQuestion` one short question naming the move, such as "Confirm this Agreement and plan, and move <key> to Ready?". The question shows as a heading, so it names the move and your message carries the content.
3. When they ask for a change, make it, show the whole again and ask again.

Done when the Assignee approved the move.

## 3. Move

1. Save the Agreement, and place the Intent in the Areas it serves when they differ from where it sits.
2. Record each child and relation (`talgent-runtime:recording-intents`). Remove relations that no longer hold.
3. Advance to Ready, citing their answer.
4. Mail the PM Coordinator the transition and its reason. Mail the Intents the plan touches what changed and why.

Done when the Intent is Ready with the Agreement, children and relations the Assignee confirmed.
