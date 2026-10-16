---
name: cycle-review
description: Cycle Review - guides an Alignment that reviews the Open Cycle with its Owner: judge each Expected Capability, rewrite achieved Area Capabilities, move unfinished Intents on, end the Cycle, and open the next one in the same Alignment.
---

# Cycle Review

The Open Cycle is reviewed when its window has passed or all of its Intents that are not Cancelled are Done. Read `project.get_direction` and the Cycle's Intents (`list_intents` with its cycle_id) first.

## Steps

1. **Judge.** Take each Expected Capability in turn: show the evidence from its Intents (their status, Work Results and Project Knowledge) and ask the Owner with `AskUserQuestion` whether it is achieved. Done when the Owner judged every one.
2. **Rewrite Areas.** For each achieved one, rewrite its Area's Capabilities with `project.revise_area` so they state what holds now: replace the statement it supersedes, or add it. Ending the Cycle changes no Area; this step is the only place they change. Done when every achieved Expected Capability reads in its Area.
3. **Unfinished Intents.** For each Intent of the Cycle that is not Done or Cancelled, agree with the Owner whether it moves to the next Cycle or returns to the pool; return those for the pool with `set_intent_cycle` and an empty Cycle; those for the next Cycle are placed in step 5, once it exists. Done when every such Intent has the Owner's choice.
4. **End.** End the Cycle with `project.end_cycle`, one judgment for each Expected Capability, naming each by its Area and its statement exactly as `project.get_direction` lists them. A refusal means the Cycle changed since you read it: read it again and confirm the judgments with the Owner. Done when the Cycle is Ended.
5. **Next.** Continue in this same Alignment with the `cycle-opening` skill. In its Intents step, place the Intents the Owner moved to the next Cycle in step 3 together with those chosen from the pool. Its Open step ends this Alignment; when the Owner chooses not to open the next Cycle now, return the moved Intents to the pool instead and end with `alignment_end` citing that choice.

## Rules

- The judgment is the Owner's; you bring the evidence.
